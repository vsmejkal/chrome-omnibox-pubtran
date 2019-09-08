export default class ParserError extends Error {
  constructor(message) {
    this.message = message;
  }

  toString() {
    return this.message;
  }
}