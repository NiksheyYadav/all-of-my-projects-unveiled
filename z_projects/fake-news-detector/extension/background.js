chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeText",
    title: "Analyze for Fake News",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyzeText" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, { action: "analyze" });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "show_result" && message.data) {
    chrome.runtime.sendMessage(message); // Forward to popup
  }
});