import parseDate from "../src/parser/DateParser.js";

export default {
  async today() {
    const date = await parseDate("dnes");
    const now = new Date();

    return date.getDate() === now.getDate() && 
           date.getMonth() === now.getMonth() &&
           date.getFullYear() === now.getFullYear();
  }
};