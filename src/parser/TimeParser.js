export default async function parseTime(query) {
  switch (query) {
    case 'rano':
      return { hour: 6, minute: 0 };
    case 'dopoledne':
      return { hour: 8, minute: 0 };
    case 'odpoledne':
      return { hour: 12, minute: 0 };
    case 'vecer':
      return { hour: 16, minute: 0 };
  }

  const match = query.match(/^(\d+)(?:h|\:(\d\d))?$/)
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