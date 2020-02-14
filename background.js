/* The function that finds and returns the selected text */
const funcToInject = function () {
    const selection = window.getSelection();
    return (selection.rangeCount > 0) ? selection.toString() : '';
};

/* This line converts the above function to string
 * (and makes sure it will be called instantly) */
const jsCodeStr = ';(' + funcToInject + ')();';

chrome.commands.onCommand.addListener(function (cmd) {
    switch (cmd) {
        case "selected_text":
            chrome.tabs.executeScript({
                code: jsCodeStr,
                allFrames: true   //  <-- inject into all frames, as the selection 
            }, function (selected_text_per_frame) {
                console.log(selected_text_per_frame)
                if (!selected_text_per_frame.length[0]) {
                    console.log("nothing selected.");
                    return -1;
                };
                if (typeof (selected_text_per_frame[0]) !== "string") { return -1 };
                if (chrome.runtime.lastError) {
                    console.log('ERROR:\n' + chrome.runtime.lastError.message);
                }
                search(selected_text_per_frame[0])

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

