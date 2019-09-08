import parseCities from "/src/parser/CityParser.js";

export default {
  async shortName() {
    let cities = await parseCities("as");

    return cities.some(city => city.name === "Aš");
  },

  async incompleteName() {
    let cities = await parseCities("lansk");

    return cities.some(city => city.name === "Lanškroun");
  },

  // Ignored: currently we support just searching from the start
  // async startInTheMiddle() {
  //   let cities = await parseCities("trebov");

  //   return cities.some(city => city.name === "Česká Třebová");
  // }
};