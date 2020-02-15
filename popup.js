$(function () {
    $(document).ready(function () {
        chrome.storage.sync.get(function (result) {
            console.log(result)
            for (const i in result["engines"]) {
                $(".col-sm-6").append(`
                    <div class="radio">
                        <label>
                            <input type="radio" name="optionsRadios" id="optionsRadios1" value=${result["engines"][i].site_name}> ${result["engines"][i].display_name}
                        </label>
                    </div> 
                `)
            }
            $('input[name="optionsRadios"]:radio').val([result.selected_site])
        });

    });

    $(document).on("change", 'input[name="optionsRadios"]:radio', function () {
        const site_name = $(this).val()
        let option_data = null
        chrome.storage.sync.get(function (result) {
            option_data = result
            console.log(`from sync:${option_data.selected_site}`)
        })

        if (!option_data) { option_data = get_default_option_data(); }

        option_data.selected_site = site_name;
        console.log(option_data);

        chrome.storage.sync.set(option_data, function () {
            console.log(option_data);
        })
    });
});

function check_first_instration() {
    (async () => {
        const result = await browser.storage.sync.get()
        if (result) {
            return true
        } else {
            return false
        }
    })
}

function get_default_option_data() {
    console.log(`first instration`)
    return {
        engines: [
            {
                display_name: "ラクマ",
                site_name: "rakuma",
                url: "https://fril.jp/search/"
            }, {
                display_name: "Amazon",
                site_name: "amazon",
                url: "https://www.amazon.co.jp/s?k="
            }, {
                display_name: "メルカリ",
                site_name: "mercari",
                url: "https://www.mercari.com/jp/search/?keyword="
            }, {
                display_name: "ヤフオク",
                site_name: "yahuoku",
                url: "https://auctions.yahoo.co.jp/search/search?auccat=&tab_ex=commerce&ei=utf-8&aq=-1&oq=&sc_i=&fr=auc_top&p="
            }, {
                display_name: "モノレート",
                site_name: "mnrate",
                url: "https://mnrate.com/search?i=All&kwd="
            }
        ],
        selected_site: "mnrate"
    }
}