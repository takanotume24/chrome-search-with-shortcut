$(function () {
    $('input[name="optionsRadios"]:radio').change(function () {
        const site_name = $(this).val()
        const options = {
            engine: site_name
        }
        chrome.storage.sync.set(options, function () {
            console.log("is set:" + options.engine);
        });
    })
});