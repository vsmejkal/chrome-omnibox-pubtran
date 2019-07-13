import Config from "./Config.js";
import StringUtil from "./StringUtil.js";
import Locator from "./Locator.js";
import City from "./data/City.js";
import Position from "./data/Position.js";

let __CITIES = null;

export default {
  /**
   * @returns {Promise<City[]>}
   */
  async getCities() {
    if (!__CITIES) {
      __CITIES = this.loadCities(Config.CITY_DATASET);
    }
    return __CITIES;
  },
  
  async loadCities(datasetPath) {
    console.log('loadCities');

    let url = chrome.runtime.getURL(datasetPath);
    let response = await fetch(url);
    let data = await response.text();
    
    return data.split("\n").filter(StringUtil.isNotEmpty).slice(1).map((line, id) => {
      let [name, area, latitude, longitude] = line.split(",");

      let position = new Position({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });

      return new City({ id, name, area, position });
    });
  },

  async findNearest(position) {
    let cities = await this.getCities()
    let dists = cities.map(city => city.distanceTo(position))

    return cities.reduce((cityA, cityB) =>
      dists[cityA.id] < dists[cityB.id] ? cityA : cityB
    );
  },

  async search(query, limit = 10) {
    let cities = await this.getCities();
    let scores = cities.map(city => {
      let match = city.match(query);
      return match ? match.score : 0;
    });
    // let location = await Locator.getPosition();

    return cities
      .filter(city => scores[city.id] > 0)
      .sort((cityA, cityB) => scores[cityB.id] - scores[cityA.id])
      .slice(0, limit);
  }
}
