export default async function parseTime(query) {
  return parseRelativeTime(query) || parseNumericTime(query);
}

function parseRelativeTime(query) {
  switch (query) {
    case 'rano':
      return { hour: 6, minute: 0 };
    case 'dopoledne':
      return { hour: 8, minute: 0 };
    case 'odpoledne':
      return { hour: 12, minute: 0 };
    case 'vecer':
      return { hour: 16, minute: 0 };
    default:
      return null;
  }
}

function parseNumericTime(query) {
  const pattern = /^(?:ve?\s)?(\d\d?)(?:\:(\d\d))?\s?(?:h|hod|hodin)?$/
  const match = query.match(pattern);
  if (!match) {
    return null;
  }

  const hour = parseInt(match[1]);
  const minute = parseInt(match[2]) || 0;

  if (hour > 23 || minute > 59) {
    return null;
  }

  return { hour, minute };
}