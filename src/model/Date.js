export default class Date {
  /**
   * @param {Object} params
   * @param {number} params.day
   * @param {number} params.month
   * @param {number} params.year
   */
  constructor({ day, month, year } = {}) {
    this.day = day;
    this.month = month;
    this.year = year;;
  }

  static get Native() {
    return window.Date;
  }

  static now() {
    let date = new Date.Native();

    return new Date({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
  }

  get isValid() {
    let date = new Date.Native(this.year, this.month - 1, this.day);

    return date.getDate() === this.day &&
           date.getMonth() + 1 === this.month &&
           date.getFullYear() === this.year;
  }

  get dayOfWeek() {
    return this.toNative().getDay()
  }

  toNative() {
    return new Date.Native(this.year, this.month - 1, this.day);
  }

  toString() {
    return `${this.day}.${this.month}.${this.year}`;
  }

  toHumanString() {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    
    return this.toNative().toLocaleDateString(undefined, options);
  }
}
