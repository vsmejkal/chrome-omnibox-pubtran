import parseQuery from "../src/parser/QueryParser.js";

export default {
  async city() {
    const result = await parseQuery("výprachtice");

    return result.from === null && result.to.name === "Výprachtice";
  },

  async twoWordCity() {
    const result = await parseQuery("česká třebová");

    return result.from === null && result.to.name === "Česká Třebová";
  },

  async cityToCity() {
    const result = await parseQuery("brno česká třebová");

    return result.from.name === "Brno" && result.to.name === "Česká Třebová";
  },

  async partialCityName() {
    const result = await parseQuery("brno suchdol");

    return result.from.name === "Brno" && result.to.name === "Suchdol nad Odrou";
  },

  async withHumanDate() {
    const result = await parseQuery("lanškroun pátek večer");

    return result.from === null &&
           result.to.name === "Lanškroun" &&
           result.date.getDay() === 5 &&
           result.date.getHours() >= 16;
  }
};