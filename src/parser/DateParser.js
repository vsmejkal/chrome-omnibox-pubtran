const DAY = 24 * 60 * 60 * 1000;

export default async function parseDate(query) {
  switch (query) {
    case 'dnes':
      return new Date();
    case 'zitra':
      return new Date(getToday() + DAY);
    case 'vcera':
      return new Date(getToday() - DAY);
    case 'pondeli':
      return new Date(getToday() + getDaysAhead(1));
    case 'utery':
      return new Date(getToday() + getDaysAhead(2));
    case 'streda':
      return new Date(getToday() + getDaysAhead(3));
    case 'ctvrtek':
      return new Date(getToday() + getDaysAhead(4));
    case 'patek':
      return new Date(getToday() + getDaysAhead(5));
    case 'sobota':
      return new Date(getToday() + getDaysAhead(6));
    case 'nedele':
      return new Date(getToday() + getDaysAhead(7));
  }

  const match = query.match(/^(\d+)[\.\/](\d*)\.?$/);
  if (!match) {
    return null;
  }
  
  const day = parseInt(match[1]);
  const month = parseInt(match[2]) || new Date().getMonth() + 1;

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return null;
  }

  const result = new Date();
  result.setDate(day);
  result.setMonth(month - 1);

  return result;
}

function getToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0).getTime();
}

function getDaysAhead(dayOfWeek) {
  return DAY * ((dayOfWeek - new Date().getDay() + 7) % 7);
}