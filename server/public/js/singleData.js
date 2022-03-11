

// on page load, get crypto data
$.ajax({
    type: 'GET',
    url: '/getCryptoData',
    data: {},
    success: function(result) {
        try {
            GenerateChart(result.cryptoData);
            $("#data-loading-spinner").hide();
        } catch(err) {
            console.log(err)
            $("#error-message").html("There was an error loading the data.  Please try reloading the page (" + err +")");
            $("#error-message-container").show();
        }
    }
});


// Generate chart for this page's crypto
function GenerateChart(cryptoData) {
    var crypto = $("#crypto").html();
    const labels = [];
    const thisCryptoData = [];
    console.log(crypto);
    console.log(cryptoData);
    for (var i in cryptoData) {
        labels.push(Object.values(cryptoData[i])[0])
        thisCryptoData.push(cryptoData[i][crypto])
    }
    const data = {
        labels: labels,
        datasets: [
          {
            label: crypto + ' Price (in $)',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: thisCryptoData,
          }
      ]
    };
    const config = {
        type: 'line',
        data: data,
        options: {}
    };

    const chart = new Chart(
        document.getElementById('chart'),
        config
    );
}



