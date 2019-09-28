import parseQuery from "/src/parser/QueryParser.js";
import ParserError from "/src/model/ParserError.js";
import Locator from "/src/Locator.js";
import Database from "/src/Database.js";
import Time from "/src/model/Time.js";

chrome.browserAction.onClicked.addListener((tab) =>  {
  chrome.runtime.reload();
});

chrome.omnibox.onInputStarted.addListener(() => {
  Database.loadCities();
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  let results = [];

  console.log('Input changed');

  try {
    results = await parseQuery(text);
  } catch (error) {
    if (error instanceof ParserError) {
      // setDefaultSuggestion(error.message);
      return;
    } else {
      throw error;
    }
  }

  if (results.length > 0) {
    setDefaultSuggestion(results.shift().toDescription());
  } else if (text.length > 1) {
    setDefaultSuggestion(`Místo <match>${text}</match> nebylo nalezeno`);
  } else {
    setDefaultSuggestion(`<dim>Kam chcete jet?</dim>`);
  }

  suggest(results.map((result) => ({
    content: result.toQuery(),
    description: result.toDescription()
  })));
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  let results = await parseQuery(text);

  if (results.length > 0) {
    let result = await sanitizeResult(results[0]);

    openPage(result.toUrl(), disposition);
  }
});

// ----------------------------------------------------------------------

function setDefaultSuggestion(description) {
  chrome.omnibox.setDefaultSuggestion({ description });
}

async function sanitizeResult(result) {
  if (!result.from) {
    let gps = await Locator.getCurrentPosition();
    let nearestCity = await Database.findNearest(gps);
    result.from = nearestCity;
  }

  if (result.date && !result.time) {
    result.time = new Time({ hour: 6, minute: 0 });
  }

  return result;
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
