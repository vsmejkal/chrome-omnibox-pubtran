import StringUtil from "/src/StringUtil.js";

/**
 * Process text query by joining tokens
 */
export default class QueryScanner {
  /**
   * @param {string} query
   */
  constructor(query) {
    this.tokens = query.trim().split(/\s+/);
    this.start = 0;
    this.end = 1;
  }

  async scan(parser, result = null) {
    for (this.end = this.start + 1; this.end <= this.tokens.length; this.end++) {
      let phrase = this.tokens.slice(this.start, this.end).join(" ");
      let value = await parser(phrase);

      if (isTruthy(value)) {
        result = value;
      } else if (isTruthy(result)) {
        break;
      }
    }

    if (isTruthy(result)) {
      this.start = this.end - 1;
    }

    return result;
  }

  isFinished() {
    return this.start === this.tokens.length;
  }

  getUnprocessedPart() {
    return this.tokens.slice(this.start).join(" ")
  }
}

function isTruthy(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return Boolean(value);
}