const DAY = 24 * 60 * 60 * 1000;

export default async function parseDate(query) {
  let date = parseHumanDate(query) || parseNumericDate(query);

  if (date && isValidDate(date)) {
    return date;
  } else {
    return null;
  }
}

export function parseHumanDate(query) {
  let now = Date.now()
  let dayOfWeek = new Date().getDay()
  let timestamp;

  switch (query) {
    case 'dnes':
      timestamp = now;
      break;

    case 'zitra':
      timestamp = now + DAY;
      break;

    case 'vcera':
      timestamp = now - DAY;
      break;

    case 'nedele':
    case 'v nedeli':
      timestamp = now + DAY * ((0 - dayOfWeek + 7) % 7);
      break;

    case 'pondeli':
    case 'v pondeli':
      timestamp = now + DAY * ((1 - dayOfWeek + 7) % 7);
      break;

    case 'utery':
    case 'v utery':
      timestamp = now + DAY * ((2 - dayOfWeek + 7) % 7);
      break;

    case 'streda':
    case 've stredu':
      timestamp = now + DAY * ((3 - dayOfWeek + 7) % 7);
      break;

    case 'ctvrtek':
    case 've ctvrtek':
      timestamp = now + DAY * ((4 - dayOfWeek + 7) % 7);
      break;

    case 'patek':
    case 'v patek':
      timestamp = now + DAY * ((5 - dayOfWeek + 7) % 7);
      break;

    case 'sobota':
    case 'v sobotu':
      timestamp = now + DAY * ((6 - dayOfWeek + 7) % 7);
      break;

    default:
      return null;
  }

  let date = new Date(timestamp);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  // Turn of the year
  if (date.getMonth() < new Date().getMonth()) {
    year++;
  }

  return {day, month, year};
}

function parseNumericDate(query) {
  let match = query.match(/^(\d+)[\.\/](\d*)\.?$/);
  if (!match) {
    return null;
  }
  
  let day = parseInt(match[1]);
  let month = parseInt(match[2]) || new Date().getMonth() + 1;
  let year = new Date().getFullYear();

  return {day, month, year};
}

function isValidDate({day, month, year}) {
  const date = new Date();
  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);

  return date.getDate() === day &&
         date.getMonth() + 1 === month &&
         date.getFullYear() === year;
}
