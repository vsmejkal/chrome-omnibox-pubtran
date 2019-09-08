export default class Time {
  /**
   * @param {Object} params
   * @param {number} params.hour
   * @param {number} params.minute
   */
  constructor({ hour, minute } = {}) {
    this.hour = hour;
    this.minute = minute;
  }

  static now() {
    let date = new Date();

    return new Time({
      hour: date.getHours(),
      minute: date.getMinutes()
    });
  }

  get isValid() {
    return this.hour >= 0 && this.hour < 24 && this.minute >= 0 && this.minute < 60;
  }

  toString() {
    let hour = String(this.hour);
    let minute = String(this.minute);

    if (minute.length === 1) {
      minute = "0" + minute;
    }

    return `${hour}:${minute}`;
  }
}