import parseDate from "/src/parser/DateParser.js";
import parseTime from "/src/parser/TimeParser.js";
import parseCities from "/src/parser/CityParser.js";
import StringUtil from "/src/StringUtil.js";
import Result from "/src/model/Result.js";
import TransportType from "/src/model/TransportType.js";
import QueryScanner from "/src/parser/QueryScanner.js";


/**
 * Parse query from omnibox
 * @param {string} query
 * @returns {Promise<Result[]>}
 */
export default async function parseQuery(query) {
  query = StringUtil.normalize(query);

  let scanner = new QueryScanner(query);
  let type = await scanner.scan(parseTransportType);
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
      results.push(new Result({ from, to, date, time, type }));
    }
  }

  return results;
}

function parseTransportType(query) {
  switch (query) {
    case "autobus":
    case "bus":
      return TransportType.BUS;

    case "vlak":
      return TransportType.TRAIN;

    default:
      return null;
  }
}