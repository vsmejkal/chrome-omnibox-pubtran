import StringUtil from "../StringUtil.js";

export default class QueryScanner {
  /**
   * Process text query by joining tokens
   * 
   * @param {string} query
   */
  constructor(query) {
    this.tokens = StringUtil.normalize(query).split(/\s+/);
    this.start = 0;
    this.end = 1;
  }

  async scan(parser, result = null) {
    for (this.end = this.start + 1; this.end <= this.tokens.length; this.end++) {
      let phrase = this.tokens.slice(this.start, this.end).join(" ");
      let newResult = await parser(phrase);

      if (isTruthy(newResult)) {
        result = newResult;
      } else {
        break;
      }
    }

    this.start = this.end - 1;

    return result;
  }
}

function isTruthy(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return Boolean(value);
}