import Database from "/src/Database.js";
import StringUtil from "/src/StringUtil.js";
import { parseHumanDate } from "/src/parser/DateParser.js";

export default async function parseCities(query) {
    if (query.length === 0 || isDayOfWeek(query)) {
        return [];
    }

    let t1 = performance.now();
    let cities = await Database.search(query);
    let t2 = performance.now();

    console.debug(`Search took ${t2 - t1} ms`);

    return cities;
}

function isDayOfWeek(string) {
    let normString = StringUtil.normalize(string);

    return string[0] === string[0].toLowerCase() && parseHumanDate(normString);
}
