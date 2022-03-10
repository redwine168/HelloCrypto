

function navToData() {
    $.ajax({
        type: 'POST',
        url: '/navToData',
        data: {},
        success: function(result) {
            window.location = result.redirect;
        }
    });
}