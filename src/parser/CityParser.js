import CityDatabase from "../CityDatabase.js";
import { parseHumanDate } from "./DateParser.js";

export default async function parseCities(query) {
    // Limit number of results at the beginning
    if (query.length < 2) {
        return [];
    }

    // Ignore the city name matches a day of week
    if (!isCapitalized(query) && parseHumanDate(query)) {
        return [];
    }

    return CityDatabase.search(query)
}

function isCapitalized(string) {
    return string[0] === string[0].toUpperCase();
}