import StringUtil from "/src/StringUtil.js";

export default class City {
  /**
   * @param {Object} params
   * @param {number} params.id
   * @param {string} params.name
   * @param {string} params.area
   * @param {Gps} params.gps
   */
  constructor({ id, name, area, gps }) {
    this.id = id;
    this.name = name;
    this.area = area;
    this.gps = gps;
    this.asciiValue = this.getAsciiValue();
    
    this._showArea = false;
  }

  get showArea() {
    return this._showArea;
  }

  set showArea(show) {
    this._showArea = show;
    this.asciiValue = this.getAsciiValue();
  }

  /**
   * Matches the city against query
   * 
   * @param {string} query Normalized string query
   */
  match(query) {
    // let pattern = " " + query;
    // let index = this._ascii.indexOf(pattern);
    // if (index < 0) return null;

    if (!this.asciiValue.startsWith(query)) {
      return 0;
    }

    let offset = 0;
    let coverage = query.length / parseFloat(this.name.length);
    let position = offset === 0 ? 1 : 0;
    let capital = this.area.startsWith(this.name) ? 1 : 0;
    let score = coverage + position + capital;

    return score;
  }
  
  distanceTo(gps) {
    return this.gps.distanceTo(gps);
  }

  getAsciiValue() {
    return StringUtil.normalize(this.toString())
  }

  toString() {
    if (this._showArea) {
      return `${this.name} (${this.area})`;
    } else {
      return this.name;
    }
  }
}