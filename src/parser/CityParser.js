import Database from "/src/Database.js";
import { parseHumanDate } from "/src/parser/DateParser.js";

export default async function parseCities(query) {
    if (query.length < 1) {
        return [];
    }

    // Ignore city names matching a day of week
    if (!isCapitalized(query) && parseHumanDate(query)) {
        return [];
    }

    let t1 = performance.now();
    let cities = await Database.search(query);
    let t2 = performance.now();

    console.debug(`Search took ${t2 - t1} ms`);

    return cities;
}

function isCapitalized(string) {
    return string[0] === string[0].toUpperCase();
}