import Locator from './Locator.js';
import StringUtil from './StringUtil.js';
import parseQuery from './parser/QueryParser.js';

export default {
  async parse(text) {
    let result = await parseQuery(text);

    if (!validateResult(result)) {
      return [];
    }

    return createSuggestions(result);
  }
};

export default class IdosQuery {
  constructor({ from, to, datetime }) {
    this.from = from;
    this.to = to;
    this.datetime = datetime;
  }

  getDateString(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  getTimeString(date) {
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${hour}:${minute}`;
  }

  toDescription({from, to, date}) {
    let text;

    if (this.from && this.to) {
      text += `<match>${this.from}</match> – <match>${this.to}</match>`
    } else if (this.to) {
      text += `<match>${this.to}</match>`
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

  

  async sanitize() {
    if (!this.from) {
      this.from = await Locator.getPosition();
    }
  
    if (!this.datetime) {
      this.datetime = new Date();
    }
  }
}

function validateResult({from, to, date}) {
  return to.length > 0 && date instanceof Date;
}

function itemizeResult({from, to, date}) {
  let fromCities = (from.length > 0) ? from : [null];
  let toCities = (to.length > 0) ? to : [null];

  return fromCities.map(from => toCities.map(to => ({ from, to, date }))).flat();
}

