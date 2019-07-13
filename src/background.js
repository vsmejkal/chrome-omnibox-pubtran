import parseQuery from "./parser/QueryParser.js";
import ParserError from "./data/ParserError.js";
import Locator from "./Locator.js";
import CityDatabase from "./CityDatabase.js";
import Time from "./data/Time.js";

chrome.browserAction.onClicked.addListener((tab) =>  {
  chrome.runtime.reload();
});

chrome.omnibox.onInputStarted.addListener(() => {
  CityDatabase.getCities();
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  let results = [];

  try {
    results = await parseQuery(text);
  } catch (error) {
    if (error instanceof ParserError) {
      setDefaultSuggestion(error.message);
      return;
    } else {
      throw error;
    }
  }

  if (results.length > 0) {
    setDefaultSuggestion(results.shift().toDescription());
  }

  suggest(results.map(result => ({
    content: result.toQuery(),
    description: result.toDescription()
  })));
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  let results = await parseQuery(text);

  if (results.length > 0) {
    let url = await getResultUrl(results[0]);
    openPage(url, disposition);
  }
});

// ----------------------------------------------------------------------

function setDefaultSuggestion(description) {
  chrome.omnibox.setDefaultSuggestion({ description });
}

async function getResultUrl(result) {
  if (!result.from) {
    let position = await Locator.getCurrentPosition();
    let nearestCity = await CityDatabase.findNearest(position);
    result.from = nearestCity;
  }

  if (result.date && !result.time) {
    result.time = new Time({ hour: 6, minute: 0 });
  }

  return result.toUrl()
}

function openPage(url, disposition) {
  switch (disposition) {
    case "newForegroundTab":
      chrome.tabs.create({ url });
      break;

    case "newBackgroundTab":
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

