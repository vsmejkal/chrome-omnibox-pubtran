import parseDate from "/src/parser/DateParser.js";

export default {
  async today() {
    return equalDates(await parseDate("dnes"), relativeDate(0));
  },

  async yesterday() {
    return equalDates(await parseDate("vcera"), relativeDate(-1));
  },

  async tomorrow() {
    return equalDates(await parseDate("zitra"), relativeDate(1));
  },

  async dayOfWeek() {
    let days = ["nedele", "pondeli", "utery", "streda", "ctvrtek", "patek", "sobota"];
    let results = await Promise.all(days.map(parseDate));

    return results.every((result, index) => equalDates(result, nextDayOfWeek(index)));
  },

  async dayOfWeekWithPreposition() {
    let days = ["v nedeli", "v pondeli", "v utery", "ve stredu", "ve ctvrtek", "v patek", "v sobotu"];
    let results = await Promise.all(days.map(parseDate));

    return results.every((result, index) => equalDates(result, nextDayOfWeek(index)));
  },

  async numericDates() {
    let formats = ["13.4", "13.4.", "13/4"];
    let expected = { day: 13, month: 4 };
    let results = await Promise.all(formats.map(parseDate));

    return results.every(result => equalDates(result, expected));
  }
};


function relativeDate(delta) {
  let date = new Date();
  date.setDate(date.getDate() + delta);

  return { day: date.getDate(), month: date.getMonth() + 1 };
}

function nextDayOfWeek(dayOfWeek) {
  let today = new Date();

  return relativeDate((dayOfWeek - today.getDay() + 7) % 7);
}

function equalDates(date1, date2) {
  return date1.day === date2.day && date1.month === date2.month;
}