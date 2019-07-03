import parseDate from "./DateParser.js";
import parseTime from "./TimeParser.js";
import parseCities from "./CityParser.js";
import StringUtil from "../StringUtil.js";


export default async function parseQuery(query) {
  const result = {
    from: null,
    to: null,
    date: new Date()
  };

  const scanner = queryScanner(query);
  
  const from = await scanner.scan(parseCities);
  if (from) {
    console.log('From', from.map(String));
    result.from = from[0];
  }

  const to = await scanner.scan(parseCities);
  if (to) {
    console.log('To', to.map(String));
    result.to = to[0];
  }

  const date = await scanner.scan(parseDate);
  if (date) {
    result.date.setFullYear(date.year, date.month - 1, date.day);
  }

  const time = await scanner.scan(parseTime);
  if (time) {
    result.date.setHours(time.hour, time.minute, 0, 0);
  }
  
  if (result.from && !result.to) {
    result.to = result.from;
    result.from = null;
  }

  return result;
}

function queryScanner(query) {
  const tokens = StringUtil.normalize(query).split(/\s+/);
  let start = 0, end;

  return {
    async scan(parseResult) {
      let result = null;

      for (end = start + 1; end <= tokens.length; end++) {
        const phrase = tokens.slice(start, end).join(' ');
        const value = await parseResult(phrase);

        if (value && !isEmptyArray(value)) {
          result = value;
        } else {
          break;
        }
      }

      start = end - 1;

      return result;
    }
  };
}

function isEmptyArray(array) {
  return Array.isArray(array) && array.length === 0;
}