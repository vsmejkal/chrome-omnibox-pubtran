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
   * @param {string} query Normalized string query
   * @returns {boolean} If the city matches the query
   */
  match(query) {
    return this.asciiValue.startsWith(query);
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