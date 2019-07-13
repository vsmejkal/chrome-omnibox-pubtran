import parseQuery from "../src/parser/QueryParser.js";

export default {
  async city() {
    let results = await parseQuery("výprachtice");

    return results[0].from === null && results[0].to.name === "Výprachtice";
  },

  async twoWordCity() {
    let results = await parseQuery("česká třebová");

    return results[0].from === null && results[0].to.name === "Česká Třebová";
  },

  async cityToCity() {
    let results = await parseQuery("brno česká třebová");

    return results[0].from.name === "Brno" && results[0].to.name === "Česká Třebová";
  },

  async partialCityName() {
    let results = await parseQuery("brno suchdol");

    return results.every(r => r.from.name === "Brno") &&
           results.some(r => r.to.name === "Suchdol nad Odrou");
  },

  async withHumanDate() {
    let results = await parseQuery("lanškroun pátek večer");
    let result = results[0];

    return result.from === null &&
           result.to.name === "Lanškroun" &&
           result.date.dayOfWeek === 5 &&
           result.time.hour >= 16;
  }
};