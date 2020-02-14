chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const selection = window.getSelection();
    sendResponse({ selection_text: selection.toString() });
    return true;
});
