import Location from './Location.js'

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

  async populateDefaults() {
    if (!this.from) {
      this.from = await Location.getCurrentCity();
    }
  
    if (!this.datetime) {
      this.datetime = new Date();
    }
  }

  static parse(text) {
    let tokens = text.trim().split(/\s+/);

    let time = parseTime(tokens.slice(-1)[0] || '');
    if (time) {
      tokens.pop();
    }

    let date = parseDate(tokens.slice(-1)[0] || '');
    if (date) {
      tokens.pop();
    }

    if (date && time) {
      date.setHours(time.hour);
      date.setMinutes(time.minute);
    }

    let to = tokens.pop() || null;
    let from = tokens.pop() || null;
    let datetime = date;

    return new IdosQuery({ from, to, datetime });
  }
}

function getToday() {
  let now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0);
}

function parseDate(text) {
  const DAY = 24 * 60 * 60 * 1000;
  let today = getToday().getTime();
  let daysAhead = day => (day - new Date().getDay() + 7) % 7;

  switch (normalized(text)) {
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

  let nums = text.match(/\d+/g);
  if (!nums) {
    return null;
  }

  let day = parseInt(nums[0]);
  let month = parseInt(nums[1]) || new Date().getMonth() + 1;
  let year = new Date().getFullYear();

  return new Date(year, month - 1, day);
}

function parseTime(text) {
  switch (normalized(text)) {
    case 'rano':
      return { hour: 6, minute: 0 };
    case 'dopoledne':
      return { hour: 8, minute: 0 };
    case 'odpoledne':
      return { hour: 12, minute: 0 };
    case 'vecer':
      return { hour: 16, minute: 0 };
  }

  let nums = text.match(/\d+/g)
  if (!nums) {
    return null;
  }

  let hour = parseInt(nums[0]);
  let minute = parseInt(nums[1]) || 0;

  return  { hour, minute };
}

function normalized(string) {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}