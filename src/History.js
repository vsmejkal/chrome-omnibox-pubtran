import Storage from "/src/Storage.js";

export default {
  saveResult(result) {
    resultToKeys(result).forEach(key => {
      Storage.update(key, value => !value ? 1 : value + 1)
    });
  },

  removeResult(result) {
    resultToKeys(result).forEach(Storage.remove)
  },

  async getHits(cities) {
    let keys = cities.map(cityToKey);
    let hits = await Storage.getAll(keys);
    
    return keys.map(key => hits[key] || 0);
  }
}

function resultToKeys(result) {
  return [result.from, result.to].filter(Boolean).map(cityToKey);
}

function cityToKey(city) {
  return `history_${city.name}_${city.area}`;
}