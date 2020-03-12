document.write("<script src=\"helper.js\"></script> ");

chrome.commands.onCommand.addListener(async function (cmd) {
    switch (cmd) {
        case "selected_text":
            let querry_info = {
                active: true,
                windowId: chrome.windows.WINDOW_ID_CURRENT
            };

            const result = await browser.tabs.query(querry_info);
            const current_tab = result.shift();
            let message = {};
            const response = await browser.tabs.sendMessage(current_tab.id, message);
            await search(response.selection_text);

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

async function search(query) {
    const result = await get_sites()
    const display_name = await result.selected_site
    const site = await get_url(result, display_name)
    const replased_url = site.url.replace("STRING", query)
    await browser.tabs.create({ url: replased_url });
}

async function get_url(json, display_name) {
    console.log(json)
    const match_data = json["engines"].filter(function (item, index) {
        if (item.display_name == display_name) return true
    })
    return match_data[0]
}


