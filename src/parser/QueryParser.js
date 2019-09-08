import parseDate from "/src/parser/DateParser.js";
import parseTime from "/src/parser/TimeParser.js";
import parseCities from "/src/parser/CityParser.js";
import StringUtil from "/src/StringUtil.js";
import Result from "/src/model/Result.js";
import QueryScanner from "/src/parser/QueryScanner.js";


/**
 * Parses query from omnibox
 * 
 * @param {string} query Query text to process
 * @returns {Promise<Result[]>}
 */
export default async function parseQuery(query) {
  /*let r1 = new Result({
    from: "Lanškroun",
    to: "Brno",
    description: "<match>Lan</match>škroun  ➡️  <match>Brno</match><dim> | neděle 18:00</dim>"
  });

  return [r1];*/

  query = StringUtil.normalize(query);

  let scanner = new QueryScanner(query);
  let fromList = await scanner.scan(parseCities, []);
  let toList = await scanner.scan(parseCities, []);
  let date = await scanner.scan(parseDate);
  let time = await scanner.scan(parseTime);
  
  if (fromList.length === 0 && toList.length === 0) {
    return [];
  }

  if (toList.length === 0) {
    [fromList, toList] = [[null], fromList];
  }

  let results = [];
  for (let from of fromList) {
    for (let to of toList) {
      results.push(new Result({ from, to, date, time }));
    }
  }

  return results;
}
/*
function Scanner(text) {
  let tokens = StringUtil.normalize(text).split(/\s+/);
  let start = 0, end;

  return {
    async scan(parseResult) {
      let result = null;

      for (end = start + 1; end <= tokens.length; end++) {
        let phrase = tokens.slice(start, end).join(" ");
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
*/