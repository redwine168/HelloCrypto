

// on page load, get crypto data
$.ajax({
    type: 'GET',
    url: '/getCryptoData',
    data: {},
    success: function(result) {
        try {
            GenerateBTCChart(result.cryptoData);
        } catch(err) {
            console.log("ERROR: " + err);
        }
    }
});

// TO DO - MAKE FUNCTION FOR EACH CRYPTO AND THEN PUT EACH GRAPH IN A FLEXBOX

function GenerateBTCChart(cryptoData) {
    const labels = [];
    const BTC = [];
    for (var i in cryptoData) {
        // WHY CANT I USE DATE KEY
        labels.push(Object.values(cryptoData[i])[0])
        BTC.push(cryptoData[i].BTC)
    }
    const data = {
        labels: labels,
        datasets: [
          {
            label: 'BTC',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: BTC,
          }
      ]
    };
    const config = {
        type: 'line',
        data: data,
        options: {}
    };

    const myChart = new Chart(
        document.getElementById('btc-chart'),
        config
    );
}





