import Locator from './Locator.js';
import StringUtil from './StringUtil.js';
import CityParser from './parser/CityParser.js';

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

  /*static async parse(text) {
    const tokens = text.trim().split(/\s+/);
    const query = tokens.join(' ')

    console.log((await CityParser(query)).map(String))

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
  }*/
}
