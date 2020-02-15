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
        const result = await browser.storage.local.get()
        const display_name = await result.selected_site
        const site = await get_url(result, display_name)
        console.log(site)
        const site_url = site.url + query;
        chrome.tabs.create({ url: site_url });
    })();
}

function get_url(json, display_name) {
    console.log(json)
    const match_data = json["engines"].filter(function (item, index) {
        console.log(item.display_name)
        if (item.display_name == display_name) return true
    })
    return match_data[0]
}


