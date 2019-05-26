import Config from "./Config.js";
import StringUtil from "./StringUtil.js";

class Cities {
  constructor(path) {
    this._cities = this._load(path);
  }

  async getCities() {
    return this._cities;
  }

  async findNearest(position) {
    const cities = await this.getCities();

    return cities
      .map((city) => ({ distance: this._distance(city, position), ...city }))
      .reduce((c1, c2) => c1.distance < c2.distance ? c1 : c2);
  }

  async _load(path) {
    const url = chrome.runtime.getURL(path);
    const response = await fetch(url);
    const data = await response.text();
    
    return data.split('\n').filter(StringUtil.isNotEmpty).slice(1).map(line => {
      const [name, area, latitude, longitude] = line.split(',');
      
      return {
        name,
        area,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    });
  }

  _distance(gps1, gps2) {
    const dLat = gps1.latitude - gps2.latitude;
    const dLong = gps1.longitude - gps2.longitude;
  
    return Math.pow(dLat, 2) + Math.pow(dLong, 2);
  }
}

export default new Cities(Config.CITY_DATASET)
