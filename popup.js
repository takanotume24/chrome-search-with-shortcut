$(function () {
    $(document).ready(function () {
        chrome.storage.local.get(function (result) {
            console.log(result)
            for (const i in result["engines"]) {
                $(".col-sm-6").append(`
                <tr>
                <td>
                    <div class="radio">
                        <label>
                            <input type="radio" name="optionsRadios" id="optionsRadios1" value=${result["engines"][i].display_name}> ${result["engines"][i].display_name}
                        </label>
                    </div> 
                <td>

                </tr>
                    `)
            }
            $('input[name="optionsRadios"]:radio').val([result.selected_site])
        });

    });

    $(document).on("change", 'input[name="optionsRadios"]:radio', function () {
        const display_name = $(this).val()
        let option_data = null
        chrome.storage.local.get(function (result) {
            option_data = result
            console.log(`from sync:${option_data.selected_site}`)
        })

        if (!option_data) { option_data = get_default_option_data(); }

        option_data.selected_site = display_name;
        console.log(option_data);

        chrome.storage.local.set(option_data, function () {
            console.log(option_data);
        })
    });
});


let default_option_data = {
    engines: [
        {
            display_name: "ラクマ",
            url: "https://fril.jp/search/"
        }, {
            display_name: "Amazon",
            url: "https://www.amazon.co.jp/s?k="
        }, {
            display_name: "メルカリ",
            url: "https://www.mercari.com/jp/search/?keyword="
        }, {
            display_name: "ヤフオク",
            url: "https://auctions.yahoo.co.jp/search/search?auccat=&tab_ex=commerce&ei=utf-8&aq=-1&oq=&sc_i=&fr=auc_top&p="
        }, {
            display_name: "モノレート",
            url: "https://mnrate.com/search?i=All&kwd="
        }
    ],
    selected_site: "モノレート"
}
