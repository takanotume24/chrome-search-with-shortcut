chrome.commands.onCommand.addListener(function (cmd) {
    switch (cmd) {
        case "selected_text":
            var querry_info = {
                active: true,
                windowId: chrome.windows.WINDOW_ID_CURRENT
            };

            (async () => {
                const result = await browser.tabs.query(querry_info);
                const current_tab = result.shift();
                var message = {};
                const response = await browser.tabs.sendMessage(current_tab.id, message);
                search(response.selection_text);
            })();

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
    (async () => {
        const result = await browser.storage.sync.get()
        const site_name = await result.selected_site
        const site = await get_url(result, site_name)
        console.log(site)
        const site_url = site.url + query;
        chrome.tabs.create({ url: site_url });
    })();
}

function get_url(json, site_name) {
    console.log(json)
    const match_data = json["engines"].filter(function (item, index) {
        console.log(item.site_name)
        if (item.site_name == site_name) return true
    })
    return match_data[0]
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

