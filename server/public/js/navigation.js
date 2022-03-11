

// Navigate to page showing all crypto data
function navToAllData() {
    $.ajax({
        type: 'POST',
        url: '/navToAllData',
        data: {},
        success: function(result) {
            window.location = result.redirect;
        }
    });
}


// Navigate to page showing just selected crypto data (according to clicked button)
function navToSingleData(button) {
    let crypto = $(button).attr('id').replace("-btn", "");
    $.ajax({
        type: 'POST',
        url: '/navToSingleData',
        data: {
            crypto: crypto
        },
        success: function(result) {
            window.location = result.redirect;
        }
    });
}