let default_option_data = {
    engines: [
        {
            display_name: "ラクマ",
            url: "https://fril.jp/search/STRING"
        }, {
            display_name: "Amazon",
            url: "https://www.amazon.co.jp/s?k=STRING&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&ref=nb_sb_noss_2"
        }, {
            display_name: "メルカリ",
            url: "https://www.mercari.com/jp/search/?keyword=STRING"
        }, {
            display_name: "ヤフオク",
            url: "https://auctions.yahoo.co.jp/search/search?auccat=&tab_ex=commerce&ei=utf-8&aq=-1&oq=&sc_i=&fr=auc_top&p=STRING&x=0&y=0"
        }, {
            display_name: "モノレート",
            url: "https://mnrate.com/search?i=All&kwd=STRING&s="
        }
    ],
    selected_site: "モノレート",
    first_boot: true
}

function show_denger_alert(string) {
    $("body").prepend(`
                <div class="alert alert-danger" role="alert">${string}</div>
    `)
}

function show_success_alert(string) {
    $("body").prepend(`
                <div class="alert alert-success" role="alert">${string}</div>
    `)
}

async function delete_alert() {
    $("div.alert").remove()
}

async function remove_sites() {
    const result = await get_sites()
    for (const i in result["engines"]) {
        $(`#tr_${result["engines"][i].display_name}`).remove()
    }
}

async function get_sites() {
    let result = await browser.storage.sync.get()
    if (!result.engines) {
        result = default_option_data;
    }
    return result
}

async function set_sites(data) {
    const result = await browser.storage.sync.set(data)
    return result
}

async function delete_key(data, querry) {
    const match_data = data["engines"].filter(function (item, index) {
        if (item.display_name != querry) return true
    })
    console.dir(match_data)
    data["engines"] = match_data
    return data
}

async function add_key(data, site_name, site_url) {
    const new_data = {
        display_name: site_name,
        url: site_url
    }
    data.engines.push(new_data)
    return data
}

async function has_key(data, querry) {
    for (const i in data["engines"]) {
        const display_name = data["engines"][i].display_name
        if (display_name === querry) {
            console.log(display_name, querry);
            return true
        }
    }
    return false
}

async function show_sites() {
    const result = await get_sites()
    if (result.first_boot) {
        await browser.storage.sync.set({ first_boot: false })
        $("body").prepend(`
                <div class="alert alert-primary" role="alert">初期設定を適用しました｡</div>
        `)
    }
    for (const i in result["engines"]) {
        const site_name = result["engines"][i].display_name
        const site_url = result["engines"][i].url
        $("table#table_delete").append(`
                <tr id=tr_${site_name}>
                    <td>
                        <div class="radio">
                            <label>
                                <input type="radio" name="optionsRadios" id="optionsRadios1" value=${site_name}> ${site_name}
                            </label>
                        </div> 
                    </td>
                    <td>
                        <input type="text" class="form-control ${site_name}" value=${site_url}>
                    </td>                    
                    <td>
                        <button type="button" class="btn btn-primary save" value=${site_name}>保存</button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger delete" value=${site_name}>削除</button>
                    </td>
                </tr>
                    `)
    }
    $('input[name="optionsRadios"]:radio').val([result.selected_site])
}