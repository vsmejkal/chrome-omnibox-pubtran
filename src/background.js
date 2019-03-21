chrome.omnibox.onInputEntered.addListener(text => {
  // Encode user input for special characters , / ? : @ & = + $ #
  const newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
  chrome.tabs.create({ url: newURL });
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const results = ['vlak', 'bus', 'vlak + bus'].map(it => ({
    content: 'https://idos.cz/' + it,
    description: `18:54 ${text} --> 20:06 Pardubice <dim>(${it})</dim>`
  }))

  console.log(results)
  suggest(results)
})