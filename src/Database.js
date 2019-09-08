import Config from "/src/Config.js";
import StringUtil from "/src/StringUtil.js";
import Locator from "/src/Locator.js";
import City from "/src/model/City.js";
import Position from "/src/model/Position.js";

let $cities = null;

export default {
  cities: null,
  index: null,
  
  async loadCities() {
    console.log('loadCities');

    let dataset = Config.CITY_DATASET;
    let url = chrome.runtime.getURL(dataset);
    let response = await fetch(url);
    let data = await response.text();

    this.cities = parseCsv(data);
    this.index = buildIndex(this.cities);

    function parseCsv(data) {
      return data.split("\n").filter(StringUtil.isNotEmpty).slice(1).map((line, id) => {
        let [name, area, latitude, longitude] = line.split(",");
        let position = new Position({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        });
  
        return new City({id, name, area, position});
      });
    }

    function buildIndex(cities) {
      let index = new Map();

      cities.forEach((city) => {
        let prefix = city.asciiName.slice(0, 2);
        if (index.has(prefix)) {
          index.get(prefix).push(city);
        } else {
          index.set(prefix, [city]);
        }
      });

      return index;
    }
  },

  async findNearest(position) {
    if (!this.cities) {
      await this.loadCities();
    }

    let dists = this.cities.map(city => city.distanceTo(position));

    return this.cities.reduce((cityA, cityB) =>
      dists[cityA.id] < dists[cityB.id] ? cityA : cityB
    );
  },

  async search(query, limit = 10) {
    if (!this.index) {
      await this.loadCities();
    }

    let prefix = query.slice(0, 2);
    let cities = this.index.get(prefix);
    if (!cities) {
      return [];
    }

    return cities
      .map((city) => ({ city, score: city.match(query) }))
      .filter(({ score }) => score > 0)
      .sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA)
      .slice(0, limit)
      .map(({ city }) => city);
  }
}
