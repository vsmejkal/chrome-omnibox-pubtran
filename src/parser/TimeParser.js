import Time from "../data/Time.js";

export default async function parseTime(query) {
  console.log("parseTime:", query)

  var time = parseRelativeTime(query) || parseNumericTime(query);

  return (time && time.isValid) ? time : null;
}

function parseRelativeTime(query) {
  switch (query) {
    case "rano":
      return new Time({ hour: 6, minute: 0 });
    case "dopoledne":
      return new Time({ hour: 8, minute: 0 });
    case "odpoledne":
      return new Time({ hour: 12, minute: 0 });
    case "vecer":
      return new Time({ hour: 16, minute: 0 });
  }
}

function parseNumericTime(query) {
  let pattern = /^(?:ve?\s)?(\d\d?)(?:\:(\d\d))?\s?(?:h|hod|hodin)?$/
  let match = query.match(pattern);
  if (!match) {
    return null;
  }

  let hour = parseInt(match[1]);
  let minute = parseInt(match[2]) || 0;

  return new Time({ hour, minute });
}