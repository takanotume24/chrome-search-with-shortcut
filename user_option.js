document.write("<script src=\"helper.js\"></script> ");

$(function () {
    $(document).ready(function () {
        show_sites()
    });

    $(document).on("change", 'input[name="optionsRadios"]:radio', async function () {
        const display_name = $(this).val()
        const option_data = await get_sites()
        console.dir(`from sync:${option_data.selected_site}`)
        option_data.selected_site = display_name;
        console.dir(option_data);
        await set_sites(option_data)
    });

    $(document).on("click", 'button#button_add', async function () {
        const new_display_name = $("#new_display_name").val()
        const new_site_url = $("#new_site_url").val()

        let option_data = await get_sites()
        await delete_alert()
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
        await delete_alert()
        await show_success_alert(`正常に追加されました｡サイト名:${new_display_name}, URL:${new_site_url}`)
    });

    $(document).on("click", 'button.btn.btn-danger.delete', async function () {
        const button_name = $(this).val()
        console.dir(button_name)
        const sites = await get_sites()
        console.dir(sites)
        const deleted_sites = await delete_key(sites, button_name)
        console.dir(deleted_sites)
        await delete_alert()
        await show_success_alert(`正常に削除されました｡サイト名:${button_name}`)
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
        await delete_alert()
        await show_success_alert(`正常に変更されました｡サイト名:${new_display_name},URL:${new_site_url}`)
        await remove_sites()
        await set_sites(fixed_sites)
        await show_sites()
    });
});


