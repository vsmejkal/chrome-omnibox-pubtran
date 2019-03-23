import IdosQuery from './IdosQuery.js';

chrome.omnibox.onInputStarted.addListener(() => {
  
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const description = IdosQuery.parse(text).toDescription();
  if (description) {
    chrome.omnibox.setDefaultSuggestion({ description });
  }
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  const query = IdosQuery.parse(text);
  await query.populateDefaults();

  if (query.isValid()) {
    openSearchResults(query.toUrl(), disposition);
  }
});

function openSearchResults(url, disposition) {
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

/************ Utilities *************/

async function CityLocator() {
  
  //navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}