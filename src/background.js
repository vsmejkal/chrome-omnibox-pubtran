import IdosQuery from './IdosQuery.js';
import parseQuery from './parser/QueryParser.js';

chrome.browserAction.onClicked.addListener((tab) =>  {
  chrome.runtime.reload();
});

chrome.omnibox.onInputStarted.addListener(() => {
  
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const result = await parseQuery(text);
  console.log(result);
  // const description = query.toDescription();

  // suggest([
  //   { content: "http://reddit.com/r/" + text, description: "reddit.com/r/" + text },
  //   { content: "http://imgur.com/r/" + text, description: "imgur.com/r/" + text }
  // ]);

  // if (description) {
  //   chrome.omnibox.setDefaultSuggestion({ description });
  // }
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  const query = await IdosQuery.parse(text);
  await query.sanitize();

  if (query.isValid()) {
    openResultsPage(query.toUrl(), disposition);
  }
});

function openResultsPage(url, disposition) {
  switch (disposition) {
    case 'newForegroundTab':
      chrome.tabs.create({ url });
      break;
    case 'newBackgroundTab':
      chrome.tabs.create({ url, active: false });
      break;
    default:
      chrome.tabs.query({ active: true }, ([tab]) => {
        if (tab) {
          chrome.tabs.update(tab.id, { url });
        }
      });
  }
}
