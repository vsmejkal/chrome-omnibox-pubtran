import City from '../City.js';
import StringUtil from '../StringUtil.js';


export default async function parseCity(query) {
    query = StringUtil.normalize(query)

    if (query.length < 2) {
        return [];
    }

    return City.search(query)
}