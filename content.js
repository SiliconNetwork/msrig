let lastQuery = '';
let timeoutId = null;

// Function to extract the search query from the URL
function getQueryFromUrl(url) {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get('q');
}

// Debounce function to limit the rate at which the search query is sent
function debounce(func, wait) {
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  };
}

// Function to handle search query changes
const handleSearchQueryChange = debounce(() => {
  const query = getQueryFromUrl(window.location.href);
  if (query && query !== lastQuery) {
    lastQuery = query;
    chrome.runtime.sendMessage({ action: 'searchBing', query });
  }
}, 1000); // 1 second debounce

// Monitor changes to the Google search results page
const observer = new MutationObserver(handleSearchQueryChange);

// Start observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });
