import parseCities from "../src/parser/CityParser.js";

export default {
  async incompleteName() {
    const cities = await parseCities("lansk")

    return cities.some(city => city.name === "Lanškroun")
  },

  async startingInMiddle() {
    const cities = await parseCities("trebov")

    return cities.some(city => city.name === "Česká Třebová")
  }
};