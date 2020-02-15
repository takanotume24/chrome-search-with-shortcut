$(function () {
    $(document).ready(function () {
        show_sites()
    });

    $(document).on("change", 'input[name="optionsRadios"]:radio', async function () {
        const display_name = $(this).val()
        const option_data = await get_sites()
        console.dir(`from sync:${option_data.selected_site}`)
        if (!option_data.engines) { option_data = default_option_data; }
        option_data.selected_site = display_name;
        console.dir(option_data);
        await set_sites(option_data)
    });

    $(document).on("click", 'button#button_add', async function () {
        const new_display_name = $("#new_display_name").val()
        const new_site_url = $("#new_site_url").val()

        let option_data = await get_sites()
        console.dir(option_data)
        if (!option_data.engines) {
            option_data = default_option_data
        }

        await delete_denger_alert()
        if (!new_display_name) {
            show_denger_alert("サイト名を入力してください");
            return
        }
        if (!new_site_url) {
            show_denger_alert("サイトのURLを入力してください")
            return
        }
        if (await has_key(option_data, new_display_name)) {
            show_denger_alert(`${new_display_name}は既に登録されています｡`)
            return
        }

        $("#new_display_name").val("")
        $("#new_site_url").val("")

        await add_key(option_data, new_display_name, new_site_url)
        await remove_sites()
        await set_sites(option_data)
        await show_sites()
    });

    $(document).on("click", 'button.btn.btn-danger.delete', async function () {
        const button_name = $(this).val()
        console.dir(button_name)
        const sites = await get_sites()
        console.dir(sites)
        const deleted_sites = await delete_key(sites, button_name)
        console.dir(deleted_sites)
        await remove_sites()
        await set_sites(deleted_sites)
        await show_sites()
    });

    $(document).on("click", 'button.btn.btn-primary.save', async function () {
        const button_name = $(this).val()
        const new_site_url = $(`input.form-control.${button_name}`).val()
        console.log(`form:${new_site_url}`)
        const new_display_name = button_name
        const sites = await get_sites()
        const deleted_sites = await delete_key(sites, button_name)
        const fixed_sites = await add_key(sites, new_display_name, new_site_url)
        await remove_sites()
        await set_sites(fixed_sites)
        await show_sites()
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

function show_denger_alert(string) {
    $("body").prepend(`
                <div class="alert alert-danger" role="alert">${string}</div>
    `)
}

async function delete_denger_alert() {
    $("div.alert.alert-danger").remove()
}

async function remove_sites() {
    const result = await browser.storage.local.get()
    for (const i in result["engines"]) {
        $(`#tr_${result["engines"][i].display_name}`).remove()
    }
}

async function get_sites() {
    const result = await browser.storage.local.get()
    return result
}

async function set_sites(data) {
    const result = await browser.storage.local.set(data)
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
    const result = await browser.storage.local.get()
    console.dir(default_option_data);
    if (!result.engines) {
        await browser.storage.local.set(default_option_data)
        $("body").prepend(`
                <div class="alert alert-primary" role="alert">初期設定を適用しました｡</div>
        `)
        result = await browser.storage.local.get()
    }
    for (const i in result["engines"]) {
        const site_name = result["engines"][i].display_name
        const site_url = result["engines"][i].url
        console.log(site_name)
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