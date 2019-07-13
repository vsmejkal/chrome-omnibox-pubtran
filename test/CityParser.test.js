import parseCities from "../src/parser/CityParser.js";

export default {
  async incompleteName() {
    let cities = await parseCities("lansk");

    return cities.some(city => city.name === "Lanškroun");
  },

  async startInTheMiddle() {
    let cities = await parseCities("trebov");

    return cities.some(city => city.name === "Česká Třebová");
  }
};