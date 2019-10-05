import Date from "/src/model/Date.js";
import StringUtil from "/src/StringUtil.js";

let DAY = 24 * 60 * 60 * 1000;

export default async function parseDate(query) {
  query = StringUtil.normalize(query);

  let date = parseHumanDate(query) || parseNumericDate(query);

  return (date && date.isValid) ? date : null;
}

export function parseHumanDate(query) {
  let now = Date.Native.now()
  let dayOfWeek = new Date.Native().getDay()
  let timestamp;

  switch (query) {
    case "vcera":
      timestamp = now - DAY;
      break;

    case "dnes":
      timestamp = now;
      break;

    case "zitra":
      timestamp = now + DAY;
      break;

    case "pozitri":
      timestamp = now + 2 * DAY;
      break;

    case "nedele":
    case "v nedeli":
      timestamp = now + DAY * ((0 - dayOfWeek + 7) % 7);
      break;

    case "pondeli":
    case "v pondeli":
      timestamp = now + DAY * ((1 - dayOfWeek + 7) % 7);
      break;

    case "utery":
    case "v utery":
      timestamp = now + DAY * ((2 - dayOfWeek + 7) % 7);
      break;

    case "streda":
    case "ve stredu":
      timestamp = now + DAY * ((3 - dayOfWeek + 7) % 7);
      break;

    case "ctvrtek":
    case "ve ctvrtek":
      timestamp = now + DAY * ((4 - dayOfWeek + 7) % 7);
      break;

    case "patek":
    case "v patek":
      timestamp = now + DAY * ((5 - dayOfWeek + 7) % 7);
      break;

    case "sobota":
    case "v sobotu":
      timestamp = now + DAY * ((6 - dayOfWeek + 7) % 7);
      break;

    default:
      return null;
  }

  let date = new Date.Native(timestamp);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  // Turn of the year
  if (date.getMonth() < new Date.Native().getMonth()) {
    year++;
  }

  return new Date({ day, month, year });
}

function parseNumericDate(query) {
  let match = query.match(/^(\d+)[\.\/](\d*)\.?$/);
  if (!match) {
    return null;
  }
  
  let day = parseInt(match[1]);
  let month = parseInt(match[2]) || new Date.Native().getMonth() + 1;
  let year = new Date.Native().getFullYear();

  return new Date({ day, month, year });
}
