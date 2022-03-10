

// on page load, get crypto data
$.ajax({
    type: 'GET',
    url: '/getCryptoData',
    data: {},
    success: function(result) {
        try {
            GenerateCharts(result.cryptoData);
            $("#data-loading-spinner").hide();
        } catch(err) {
            console.log(err)
            $("#error-message").html("There was an error loading the data.  Please try reloading the page (" + err +")");
            $("#error-message-container").show();
        }
    }
});


function GenerateCharts(cryptoData) {
    GenerateBTCChart(cryptoData);
    GenerateETHChart(cryptoData);
    GenerateLTCChart(cryptoData);
    GenerateBCHChart(cryptoData);
}


function GenerateBTCChart(cryptoData) {
    const labels = [];
    const BTC = [];
    for (var i in cryptoData) {
        labels.push(Object.values(cryptoData[i])[0])
        BTC.push(cryptoData[i].BTC)
    }
    const data = {
        labels: labels,
        datasets: [
          {
            label: 'BTC Price (in $)',
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

    const btcChart = new Chart(
        document.getElementById('btc-chart'),
        config
    );
}

function GenerateETHChart(cryptoData) {
  const labels = [];
  const ETH = [];
  for (var i in cryptoData) {
      labels.push(Object.values(cryptoData[i])[0])
      ETH.push(cryptoData[i].ETH)
  }
  const data = {
      labels: labels,
      datasets: [
        {
          label: 'ETH Price (in $)',
          backgroundColor: 'rgb(0, 0, 255)',
          borderColor: 'rgb(0, 0, 255)',
          data: ETH,
        }
    ]
  };
  const config = {
      type: 'line',
      data: data,
      options: {}
  };

  const ethChart = new Chart(
      document.getElementById('eth-chart'),
      config
  );
}

function GenerateLTCChart(cryptoData) {
  const labels = [];
  const LTC = [];
  for (var i in cryptoData) {
      labels.push(Object.values(cryptoData[i])[0])
      LTC.push(cryptoData[i].LTC)
  }
  const data = {
      labels: labels,
      datasets: [
        {
          label: 'LTC Price (in $)',
          backgroundColor: 'rgb(0, 255, 0)',
          borderColor: 'rgb(0, 255, 0)',
          data: LTC,
        }
    ]
  };
  const config = {
      type: 'line',
      data: data,
      options: {}
  };

  const ltcChart = new Chart(
      document.getElementById('ltc-chart'),
      config
  );
}

function GenerateBCHChart(cryptoData) {
  const labels = [];
  const BCH = [];
  for (var i in cryptoData) {
      labels.push(Object.values(cryptoData[i])[0])
      BCH.push(cryptoData[i].BCH)
  }
  const data = {
      labels: labels,
      datasets: [
        {
          label: 'BCH Price (in $)',
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(0, 0, 0)',
          data: BCH,
        }
    ]
  };
  const config = {
      type: 'line',
      data: data,
      options: {}
  };

  const bchChart = new Chart(
      document.getElementById('bch-chart'),
      config
  );
}





