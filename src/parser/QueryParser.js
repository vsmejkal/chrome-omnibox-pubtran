import parseDate from "./DateParser.js";
import parseTime from "./TimeParser.js";
import parseCities from "./CityParser.js";
import StringUtil from "../StringUtil.js";


export default async function parseQuery(query) {
  let result = {
    from: [],
    to: [],
    date: new Date()
  };

  let scanner = Scanner(query);
  
  let from = await scanner.scan(parseCities);
  if (from) {
    result.from = from;
  }

  let to = await scanner.scan(parseCities);
  if (to) {
    result.to = to;
  }

  let date = await scanner.scan(parseDate);
  if (date) {
    result.date.setFullYear(date.year, date.month - 1, date.day);
  }

  let time = await scanner.scan(parseTime);
  if (time) {
    result.date.setHours(time.hour, time.minute, 0, 0);
  }
  
  if (result.to.length === 0) {
    result.to = result.from;
    result.from = [];
  }

  return result;
}

function Scanner(text) {
  let tokens = StringUtil.normalize(text).split(/\s+/);
  let start = 0, end;

  return {
    async scan(parseResult) {
      let result = null;

      for (end = start + 1; end <= tokens.length; end++) {
        let phrase = tokens.slice(start, end).join(' ');
        let value = await parseResult(phrase);

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
