

export default async function parseQuery(query) {
  const tokens = StringUtil.normalize(query).split(/\s+/);

  let from = null;
  let to = null;
  let date = null;
  let time = null;
  
  function getPhrase(start, end) {
    return tokens.slice(start, end).join(' ');
  }

  function parseCity(end = start + 1) {
    const phrase = 

  }

  


}