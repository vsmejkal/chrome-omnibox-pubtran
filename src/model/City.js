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
    this._value = null;
    this._asciiValue = null;
    this._showArea = false;
  }

  get value() {
    if (!this._value) {
      this._value = this.toString().toLowerCase();
    }
    return this._value;
  }

  get asciiValue() {
    if (!this._asciiValue) {
      this._asciiValue = StringUtil.normalize(this.value);
    }
    return this._asciiValue;
  }

  get showArea() {
    return this._showArea;
  }

  set showArea(show) {
    this._showArea = show;
    this._value = null;
    this._asciiValue = null;
  }

  /**
   * @param {string} query Query string
   * @param {boolean?} asciiMode True if the query should be matched against ASCII value
   * @returns {boolean} True if the city matches the query
   */
  match(query, asciiMode = false) {
    let value = (asciiMode) ? this.asciiValue : this.value;
    let tokens = value.split(' ');

    return query.split(' ').every((prefix, i) => tokens[i] && tokens[i].startsWith(prefix));
  }
  
  distanceTo(gps) {
    return this.gps.distanceTo(gps);
  }

  toString() {
    if (this._showArea) {
      return `${this.name} (${this.area})`;
    } else {
      return this.name;
    }
  }
}