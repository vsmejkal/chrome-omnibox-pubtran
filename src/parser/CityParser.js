import City from '../City.js';
import { parseHumanDate } from './DateParser.js';

export default async function parseCities(query) {
    // Limit number of results at the beginning
    if (query.length < 2) {
        return [];
    }

    // Ignore city if it is a day of week
    if (parseHumanDate(query)) {
        return [];
    }

    return City.search(query)
}