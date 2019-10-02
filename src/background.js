import parseQuery from "/src/parser/QueryParser.js";
import Locator from "/src/Locator.js";
import Database from "/src/Database.js";
import History from "/src/History.js";
import Time from "/src/model/Time.js";

chrome.browserAction.onClicked.addListener(() =>  {
  chrome.tabs.create({ url: "https://idos.idnes.cz/vlakyautobusy/spojeni/#col-content" });
});

chrome.omnibox.onInputStarted.addListener(() => {
  Database.loadCities();
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  let results = [];

  try {
    results = await parseQuery(text);
  } catch (error) {
    console.error(error);
    return;
  }

  if (results.length > 0) {
    setDefaultSuggestion(results.shift().toDescription());
  } else if (text.length > 1) {
    setDefaultSuggestion(`Místo <match>${text}</match> nebylo nalezeno`);
  } else {
    setDefaultSuggestion(`<dim>Kam chcete jet?</dim>`);
  }

  suggestResults(suggest, results);
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  let results = await parseQuery(text);

  if (results.length > 0) {
    let result = await completeResult(results[0]);
    History.saveResult(result);

    openPage(result.toUrl(), disposition);
  }
});

// ----------------------------------------------------------------------

function setDefaultSuggestion(description) {
  chrome.omnibox.setDefaultSuggestion({ description });
}

function suggestResults(suggest, results) {
  let suggestions = results.map((result) => ({
    content: result.toQuery(),
    description: result.toDescription()
  }));

  suggest(suggestions);
}

async function completeResult(result) {
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
