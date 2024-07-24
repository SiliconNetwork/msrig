let bingWindowId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "searchBing") {
    const query = message.query;
    const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&form=QBLH&sp=-1&ghc=1&lq=0&pq=ez&sc=11-2&qs=n&sk=&cvid=41D8EDAE5CA444519B70DD57B3A31A42&ghsh=0&ghacc=0&ghpl=`;

    if (bingWindowId !== null) {
      chrome.windows.update(bingWindowId, { focused: true }, () => {
        chrome.tabs.query({ windowId: bingWindowId }, (tabs) => {
          chrome.tabs.update(tabs[0].id, { url }, () => {
            setTimeout(() => {
              chrome.windows.remove(bingWindowId);
              bingWindowId = null;
            }, 4500);
          });
        });
      });
    } else {
      chrome.windows.create({ url, state: 'minimized' }, (win) => {
        bingWindowId = win.id;
        setTimeout(() => {
          chrome.windows.remove(bingWindowId);
          bingWindowId = null;
        }, 4500);
      });
    }
  }
});
