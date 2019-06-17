import parseTime from "../src/parser/TimeParser.js";

export default {
  async hours() {
    const time = await parseTime("17");

    return time.hour === 17 && time.minute === 0;
  },

  async hoursAndMinutes() {
    const time = await parseTime("17:15");

    return time.hour === 17 && time.minute === 15;
  },

  async withShortSuffix() {
    const time = await parseTime("17h");

    return time.hour === 17 && time.minute === 0;
  },

  async withLongSuffix() {
    const time = await parseTime("17 hodin");

    return time.hour === 17 && time.minute === 0;
  },

  async withPreposition() {
    const time = await parseTime("v 17:15");

    return time.hour === 17 && time.minute === 15;
  },

  async withPrepositionAndSuffix() {
    const time = await parseTime("v 17 hodin");

    return time.hour === 17 && time.minute === 0;
  }
};