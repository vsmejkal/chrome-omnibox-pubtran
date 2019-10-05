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
  setDefaultSuggestion(`<dim>Hledat spojení do …</dim>`);
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  let result;

  try {
    result = await parseQuery(text);
  } catch (error) {
    console.error(error);
    return;
  }

  let {items = [], notFound} = result;

  if (items.length > 0) {
    setDefaultSuggestion(items.shift().toDescription());
  } else if (notFound) {
    setDefaultSuggestion(`Místo <match>${notFound}</match> nebylo nalezeno`);
  } else {
    setDefaultSuggestion(`Hledat spojení do <dim>…</dim>`);
  }

  suggestResults(suggest, items);
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  let {items} = await parseQuery(text);

  if (items.length > 0) {
    let result = await completeResult(items[0]);
    History.saveResult(result);

    openPage(result.toUrl(), disposition);
  }
});

// ===========================================================================

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
