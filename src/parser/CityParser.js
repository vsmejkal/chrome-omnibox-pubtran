import City from '../City.js';

export default async function parseCities(query) {
    if (query.length < 2) {
        return [];
    }

    return City.search(query)
}