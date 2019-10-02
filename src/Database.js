import Config from "/src/Config.js";
import StringUtil from "/src/StringUtil.js";
import History from "/src/History.js";
import City from "/src/model/City.js";
import Gps from "/src/model/Gps.js";

export default {
  cities: null,
  index: null,
  
  async loadCities() {
    console.debug('loadCities');

    let dataset = Config.CITY_DATASET;
    let url = chrome.runtime.getURL(dataset);
    let response = await fetch(url);
    let data = await response.text();

    this.cities = parseCsv(data);
    this.index = buildIndex(this.cities);
    postprocessData(this.index);

    function parseCsv(data) {
      return data.split("\n").filter(StringUtil.isNotEmpty).slice(1).map((line, id) => {
        let [name, area, latitude, longitude] = line.split(",");
        let gps = new Gps(parseFloat(latitude), parseFloat(longitude));
  
        return new City({id, name, area, gps});
      });
    }

    function buildIndex(cities) {
      let index = new Map();

      cities.forEach((city) => {
        let prefix = city.asciiValue.slice(0, 2);
        if (index.has(prefix)) {
          index.get(prefix).push(city);
        } else {
          index.set(prefix, [city]);
        }
      });

      return index;
    }

    function postprocessData(index) {
      for (let cities of index.values()) {
        cities.forEach((city, i) => {
          let prevCity = cities[i - 1] || {};
          let nextCity = cities[i + 1] || {};

          if (city.name === prevCity.name || city.name === nextCity.name) {
            city.showArea = true;
          }
        });
      }
    }
  },

  async findNearest(gps) {
    if (!this.cities) {
      await this.loadCities();
    }

    let dists = this.cities.map(city => city.distanceTo(gps));

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

    let hits = await History.getHits(cities);
    let scores = new Map();

    cities.forEach((city, index) => 
      scores.set(city, getScore(city, hits[index]))
    );

    return cities
      .filter(city => scores.get(city) >= 0)
      .sort((city1, city2) => scores.get(city2) - scores.get(city1))
      .slice(0, limit);

    function getScore(city, hits) {
      if (!city.match(query)) {
        return -1;
      }

      let score = hits;

      // If the query matches the whole city name, prioritize it
      if (query.length >= city.name.length) {
        score += 10000;
      }
  
      // Favor district towns
      if (city.area.startsWith(city.name)) {
        score += 10;
      }

      return score;
    }
  }
}
