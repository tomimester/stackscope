// Remembers the HTTP response headers of each tab's main page load.
// Headers like "Server", "X-Powered-By" or "cf-ray" reveal a lot about the backend,
// but a page's own JavaScript can't see them — only the extension can.

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.tabId < 0) return;
    const headers = {};
    for (const h of details.responseHeaders || []) {
      const name = h.name.toLowerCase();
      headers[name] = headers[name] ? `${headers[name]}, ${h.value}` : h.value;
    }
    // Redirects fire this too; the last (final) response wins.
    chrome.storage.session.set({
      [`tab:${details.tabId}`]: { url: details.url, status: details.statusCode, headers, time: Date.now() },
    });
  },
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['responseHeaders']
);

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(`tab:${tabId}`);
});
