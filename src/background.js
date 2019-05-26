import IdosQuery from './IdosQuery.js';

chrome.browserAction.onClicked.addListener((tab) =>  {
  chrome.runtime.reload();
});

chrome.omnibox.onInputStarted.addListener(() => {
  
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const query = await IdosQuery.parse(text);
  const description = query.toDescription();

  if (description) {
    chrome.omnibox.setDefaultSuggestion({ description });
  }
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
