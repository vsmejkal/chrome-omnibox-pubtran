export default function parseTime(query) {
  query = StringUtil.normalize(query)

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

  const time = query.match(/^(\d+)(?:h|\:(\d\d))?$/)
  const hour = parseInt(time[1]);
  const minute = parseInt(time[2]) || 0;

  if (!time || hour > 23 || minute > 59) {
    return null;
  }

  return { hour, minute };
}