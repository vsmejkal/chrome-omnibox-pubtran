import StringUtil from "../StringUtil.js";

export default class City {
  /**
   * @param {Object} params
   * @param {number} params.id
   * @param {string} params.name
   * @param {string} params.area
   * @param {Position} params.position
   */
  constructor({ id, name, area, position }) {
    this.id = id;
    this.name = name;
    this.area = area;
    this.position = position;

    this._ascii = " " + StringUtil.normalize(name);
  }

  /**
   * Matches the city against query
   * 
   * @param {string} query Normalized query in ASCII
   */
  match(query) {
    let pattern = " " + query;
    let index = this._ascii.indexOf(pattern);
    if (index < 0) return null;

    let offset = index - 1;
    let length = query.length;
    let coverage = length / parseFloat(this.name.length);
    let position = offset === 0 ? 1 : 0;
    let capital = this.area.startsWith(this.name) ? 1 : 0;
    let score = coverage + position + capital;

    return { score, offset, length };
  }
  
  distanceTo(position) {
    return this.position.distanceTo(position);
  }

  toString() {
    return `${this.name}`;
  }
}