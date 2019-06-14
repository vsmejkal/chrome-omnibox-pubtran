const DAY = 24 * 60 * 60 * 1000;

function getToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0).getTime();
}

function getDaysAhead(dayOfWeek) {
  return DAY * ((dayOfWeek - new Date().getDay() + 7) % 7);
}
  
export default function parseDate(query) {
  query = StringUtil.normalize(query);
  
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

  const date = query.match(/^(\d+)[\.\/](\d*)\.?$/);
  const day = parseInt(date[1]);
  const month = parseInt(date[2]) || new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  if (!date || day < 1 || day > 31 || month < 1 || month > 12) {
    return null;
  }

  return { day, month, year };
}