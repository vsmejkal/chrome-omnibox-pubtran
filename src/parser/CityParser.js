import City from '../City.js';
import { parseHumanDate } from './DateParser.js';

export default async function parseCities(query) {
    // Limit number of results at the beginning
    if (query.length < 2) {
        return [];
    }

    // Ignore if it's a day of week
    if (!isCapitalized(query) && parseHumanDate(query)) {
        return [];
    }

    return City.search(query)
}

function isCapitalized(string) {
    return string[0] === string[0].toUpperCase();
}