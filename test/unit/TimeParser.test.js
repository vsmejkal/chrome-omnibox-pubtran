import parseTime from "/src/parser/TimeParser.js";

export default {
  async hours() {
    let time = await parseTime("17");

    return time.hour === 17 && time.minute === 0;
  },

  async hoursAndMinutes() {
    let time = await parseTime("17:15");

    return time.hour === 17 && time.minute === 15;
  },

  async shortSuffix() {
    let time = await parseTime("17h");

    return time.hour === 17 && time.minute === 0;
  },

  async longSuffix() {
    let time = await parseTime("17 hodin");

    return time.hour === 17 && time.minute === 0;
  },

  async preposition() {
    let time = await parseTime("v 7");

    return time.hour === 7 && time.minute === 0;
  },

  async prepositionAndMinutes() {
    let time = await parseTime("v 17:15");

    return time.hour === 17 && time.minute === 15;
  },

  async prepositionAndSuffix() {
    let time = await parseTime("v 17 hodin");

    return time.hour === 17 && time.minute === 0;
  }
};