import Config from "./Config.js";
import StringUtil from "./StringUtil.js";
import Locator from "./Locator.js";

let _cities;

export default class City {
  constructor({id, name, area, latitude, longitude}) {
    this.id = id;
    this.name = name;
    this.area = area;
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
    this.ascii = StringUtil.normalize(name);
  }

  toString() {
    return `${this.name} (${this.area})`;
  }

  static async getAll() {
    if (!_cities) {
      _cities = City.loadAll(Config.CITY_DATASET);
    }

    return _cities;
  }
  
  static async loadAll(datasetPath) {
    const url = chrome.runtime.getURL(datasetPath);
    const response = await fetch(url);
    const data = await response.text();
    
    return data.split('\n').filter(StringUtil.isNotEmpty).slice(1).map((line, id) => {
      const [name, area, latitude, longitude] = line.split(',');
      
      return new City({ id, name, area, latitude, longitude });
    });
  }

  static async findNearest(position) {
    const cities = await City.getAll()
    const dists = cities.map(city => squareDistance(city, position))

    return cities.reduce((cityA, cityB) =>
      dists[cityA.id] < dists[cityB.id] ? cityA : cityB
    );
  }

  static async search(query) {
    const cities = await City.getAll();
    // const location = await Locator.getPosition();
    const pattern = new RegExp('\\b' + query);
    const scores = cities.map(getScore);

    return cities
      .filter(city => scores[city.id] > 0)
      .sort((cityA, cityB) => scores[cityB.id] - scores[cityA.id]);

    function getScore(city) {
      const match = city.ascii.match(pattern)
      if (!match) {
        return 0;
      }

      const coverage = match[0].length / parseFloat(match.input.length);
      const position = match.index === 0 ? 1 : 0;
      const capital = city.area.startsWith(city.name) ? 1 : 0;

      return coverage + position + capital;
    }
  }
}

function squareDistance(gpsA, gpsB) {
  return Math.pow(gpsA.latitude - gpsB.latitude, 2) + Math.pow(gpsA.longitude - gpsB.longitude, 2);
}
