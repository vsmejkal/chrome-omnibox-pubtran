import parseDate from "../src/parser/DateParser.js";

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
    const days = ["nedele", "pondeli", "utery", "streda", "ctvrtek", "patek", "sobota"];
    const results = await Promise.all(days.map(parseDate));

    return results.every((result, index) => equalDates(result, nextDayOfWeek(index)));
  },

  async dayOfWeekWithPreposition() {
    const days = ["v nedeli", "v pondeli", "v utery", "ve stredu", "ve ctvrtek", "v patek", "v sobotu"];
    const results = await Promise.all(days.map(parseDate));

    return results.every((result, index) => equalDates(result, nextDayOfWeek(index)));
  },

  async numericDates() {
    const formats = ["13.4", "13.4.", "13/4"];
    const expected = { day: 13, month: 4 };
    const results = await Promise.all(formats.map(parseDate));

    return results.every(result => equalDates(result, expected));
  }
};


function relativeDate(delta) {
  const date = new Date();
  date.setDate(date.getDate() + delta);

  return { day: date.getDate(), month: date.getMonth() + 1 };
}

function nextDayOfWeek(dayOfWeek) {
  const today = new Date();

  return relativeDate((dayOfWeek - today.getDay() + 7) % 7);
}

function equalDates(date1, date2) {
  return date1.day === date2.day && date1.month === date2.month;
}