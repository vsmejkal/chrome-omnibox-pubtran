import parseTransportType from "/src/parser/TransportTypeParser.js";
import parseCities from "/src/parser/CityParser.js";
import parseDate from "/src/parser/DateParser.js";
import parseTime from "/src/parser/TimeParser.js";
import Result from "/src/model/Result.js";
import QueryScanner from "/src/parser/QueryScanner.js";

/**
 * @typedef {object} ParserResult
 * @property {Result[]} items
 * @property {string?} notFound
 * 
 */

/**
 * Parse query from omnibox and return Result[] on success.
 * @param {string} query
 * @returns {Promise<ParserResult>}
 */
export default async function parseQuery(query) {
  query = query.trim();

  let scanner = new QueryScanner(query);
  let transportType = await scanner.scan(parseTransportType);
  let fromList = await scanner.scan(parseCities, []);
  let toList = await scanner.scan(parseCities, []);
  let date = await scanner.scan(parseDate);
  let time = await scanner.scan(parseTime);

  if (!scanner.isFinished()) {
    return {notFound: scanner.getUnprocessedPart()};
  }
  
  if (fromList.length === 0) {
    fromList = [null];
  }

  if (toList.length === 0) {
    [fromList, toList] = [[null], fromList];
  }

  if (!transportType && !toList[0]) {
    return {items: []};
  }

  let items = [];
  for (let from of fromList) {
    for (let to of toList) {
      items.push(new Result({ from, to, date, time, transportType }));
    }
  }

  return {items};
}
