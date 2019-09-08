import Database from "/src/Database.js";
import { parseHumanDate } from "/src/parser/DateParser.js";

export default async function parseCities(query) {
    // Limit number of results at start
    if (query.length < 2) {
        return [];
    }

    // Ignore city names matching a day of week
    if (!isCapitalized(query) && parseHumanDate(query)) {
        return [];
    }

    return Database.search(query)
}

function isCapitalized(string) {
    return string[0] === string[0].toUpperCase();
}