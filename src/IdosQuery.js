import Location from './OfflineLocator.js'
import StringUtil from './StringUtil.js';

export default class IdosQuery {
  constructor({ from, to, datetime }) {
    this.from = from;
    this.to = to;
    this.datetime = datetime;
  }

  getDateString() {
    const day = this.datetime.getDate();
    const month = this.datetime.getMonth() + 1;
    const year = this.datetime.getFullYear();

    return `${day}.${month}.${year}`;
  }

  getTimeString() {
    const hour = this.datetime.getHours();
    const minute = this.datetime.getMinutes();

    return `${hour}:${minute}`;
  }

  toDescription() {
    let text = 'Hledat spojení';

    if (this.from && this.to) {
      text += ` <match>${this.from}</match> – <match>${this.to}</match>`
    } else if (this.to) {
      text += ` do <match>${this.to}</match>`
    }

    if (this.datetime) {
      const date = this.getDateString();
      text += `, ${date}`;
    }

    return text.trim()
  }

  toUrl() {
    return 'https://jizdnirady.idnes.cz/vlakyautobusy/spojeni/'
      + '?submit=true'
      + '&akce=vlakyautobusy'
      + '&lng=CZECH'
      + '&f=' + this.from
      + '&t=' + this.to
      + '&date=' + this.getDateString()
      + '&time=' + this.getTimeString()
  }

  toSuggestResult() {
    return {
      content: this.toUrl(),
      description: this.toDescription()
    };
  }

  isValid() {
    return this.from && this.to && this.datetime instanceof Date;
  }

  async sanitize() {
    if (!this.from) {
      this.from = await Location.getCity();
    }
  
    if (!this.datetime) {
      this.datetime = new Date();
    }
  }

  static async parse(text) {
    const tokens = text.trim().split(/\s+/);

    const time = parseTime(tokens.slice(-1)[0] || '');
    if (time) {
      tokens.pop();
    }

    const date = parseDate(tokens.slice(-1)[0] || '');
    if (date) {
      tokens.pop();
    }

    if (date && time) {
      date.setHours(time.hour);
      date.setMinutes(time.minute);
    }

    const to = tokens.pop() || null;
    const from = tokens.pop() || null;
    const datetime = date;

    return new IdosQuery({ from, to, datetime });
  }
}

function getToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0);
}

function parseDate(text) {
  const DAY = 24 * 60 * 60 * 1000;
  const today = getToday().getTime();
  const daysAhead = day => (day - new Date().getDay() + 7) % 7;

  switch (StringUtil.normalize(text)) {
    case 'dnes':
      return new Date();
    case 'zitra':
      return new Date(today + DAY);
    case 'vcera':
      return new Date(today - DAY);
    case 'pondeli':
      return new Date(today + daysAhead(1) * DAY);
    case 'utery':
      return new Date(today + daysAhead(2) * DAY);
    case 'streda':
      return new Date(today + daysAhead(3) * DAY);
    case 'ctvrtek':
      return new Date(today + daysAhead(4) * DAY);
    case 'patek':
      return new Date(today + daysAhead(5) * DAY);
    case 'sobota':
      return new Date(today + daysAhead(6) * DAY);
    case 'nedele':
      return new Date(today + daysAhead(7) * DAY);
  }

  const nums = text.match(/\d+/g);
  if (!nums) {
    return null;
  }

  const day = parseInt(nums[0]);
  const month = parseInt(nums[1]) || new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  return new Date(year, month - 1, day);
}

function parseTime(text) {
  switch (StringUtil.normalize(text)) {
    case 'rano':
      return { hour: 6, minute: 0 };
    case 'dopoledne':
      return { hour: 8, minute: 0 };
    case 'odpoledne':
      return { hour: 12, minute: 0 };
    case 'vecer':
      return { hour: 16, minute: 0 };
  }

  const nums = text.match(/\d+/g)
  if (!nums) {
    return null;
  }

  const hour = parseInt(nums[0]);
  const minute = parseInt(nums[1]) || 0;

  return  { hour, minute };
}