chrome.commands.onCommand.addListener(function (cmd) {
    switch (cmd) {
        case "selected_text":
            var querry_info = {
                active: true,
                windowId: chrome.windows.WINDOW_ID_CURRENT
            };

            chrome.tabs.query(querry_info, function (result) {
                var current_tab = result.shift();
                var message = {};
                chrome.tabs.sendMessage(current_tab.id, message, function (response) {
                    search(response.selection_text);
                });

            });
            break;
    }
});

chrome.contextMenus.create({
    title: "検索: '%s'",
    contexts: ["all"],
    "onclick": onRequest
});

function onRequest(info, tab) {
    search(info.selectionText);
};

function search(query) {
    const serviceCall = 'http://www.google.com/search?q=' + query;
    chrome.tabs.create({ url: serviceCall });
}

