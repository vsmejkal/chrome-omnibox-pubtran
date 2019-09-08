export default class Result {
  /**
   * Result produced by QueryParser.
   * 
   * @param {Object} params
   * @param {City} params.from
   * @param {City} params.to
   * @param {Date} params.date
   * @param {Time} params.time
   */
  constructor ({ from, to, date, time }) {
    this.from = from;
    this.to = to;
    this.date = date;
    this.time = time;
  }

  toUrl() {
    let url = "https://jizdnirady.idnes.cz/vlakyautobusy/spojeni/"
      + "?submit=true"
      + "&lng=CZECH"
      + "&akce=vlakyautobusy";

    if (this.from) {
      url += "&f=" + this.from.toString();
    }
    if (this.to) {
      url += "&t=" + this.to.toString();
    }
    if (this.date) {
      url += "&date=" + this.date.toString();
    }
    if (this.time) {
      url += "&time=" + this.time.toString();
    }

    return url;
  }

  toQuery() {
    let query = [];

    if (this.from) {
      query.push(this.from.name);
    }
    if (this.to) {
      query.push(this.to.name);
    }
    if (this.date) {
      query.push(this.date.toString());
    }
    if (this.time) {
      query.push(this.time.toString());
    }

    return query.join(" ") + " ";
  }

  toDescription() {
    let fragments = [];

    if (this.from) {
      fragments.push(this.from.toString());
    }
    if (this.to) {
      fragments.push(" →  " + this.to.toString());
    }
    if (this.date || this.time) {
      fragments.push("|");
    }
    if (this.date) {
      fragments.push(this.date.toString());
    }
    if (this.time) {
      fragments.push(this.time.toString());
    }

    return fragments.join(" ").trim();
  }
}
