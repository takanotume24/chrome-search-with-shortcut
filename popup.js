document.write("<script src=\"helper.js\"></script> ");

$(function () {
    $(document).ready(async function () {
        const result = await get_sites()
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

    $(document).on("change", 'input[name="optionsRadios"]:radio', async function () {
        const display_name = $(this).val()
        let option_data = await get_sites()

        option_data.selected_site = display_name;
        await set_sites(option_data)
    });
});
