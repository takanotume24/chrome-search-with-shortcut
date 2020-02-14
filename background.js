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
    let options = {
        engine: "mnrate"
    };
    (async () => {
        const result = await browser.storage.sync.get(options)
        const site_name = await result.engine
        const site_url = select_url(site_name) + query;
        chrome.tabs.create({ url: site_url });
    })()
}

function select_url(site_name) {
    switch (site_name) {
        case "mnrate":
            return "https://mnrate.com/search?i=All&kwd="
        case "amazon":
            return "https://www.amazon.co.jp/s?k="
        case "mercari":
            return "https://www.mercari.com/jp/search/?keyword="
        case "rakuma":
            return "https://fril.jp/search/"
        case "yahuoku":
            return "https://auctions.yahoo.co.jp/search/search?auccat=&tab_ex=commerce&ei=utf-8&aq=-1&oq=&sc_i=&fr=auc_top&p="
    }
}

