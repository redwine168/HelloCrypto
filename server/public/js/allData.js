

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


// Chart functions
function GenerateCharts(cryptoData) {
    GenerateBTCChart(cryptoData);
    GenerateETHChart(cryptoData);
    GenerateLTCChart(cryptoData);
    GenerateBCHChart(cryptoData);
}

// Generate the BTC chart
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

// Generate the ETH chart
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

// Generate the LTC chart
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

// Generate the BCH chart
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


function showSelectUsernameModal() {
    $("#new-username-modal").show();
}

function hideSelectUsernameModal() {
    $("#new-username-modal").hide();
}

// Validate and confirm user's submitted username
function submitUsername() {
    var username = $("#new-username-input").val();
    // if username too long or too short
    if (username.length < 3 || username.length > 12) {
        $("#submit-username-error-msg").html("Username must be between 3 and 12 characters long.");
    }
    // if username has invalid characters
    else if (!/^[a-zA-Z]+$/.test(username)) {
        $("#submit-username-error-msg").html("Only letters (A-Z, a-z) are allowed.");
    }
    // if valid username
    else {
        $("#username").val(username);
        hideSelectUsernameModal();
    }
}



/// ------------------
/// ----- SOCKET -----
/// ------------------
var socket = io();

// Send chat message
$("#new-chat-message-form").submit(function(e) {
    sendChatMessage();
    e.preventDefault();
});

function sendChatMessage() {
    let message = $("#new-chat-message-input").val();
    let username = $("#username").val();
    if (username === "") {
        showSelectUsernameModal();
        return;
    }
    if (message !== "") {
        $("#new-chat-message-input").val("");
        socket.emit('new-chat-message', {username, message}, (error) => {
            if (error) {
                //if error sending message, return user to homepage
                alert(error);
                location.href = '/home';
            }
        });
    }
}

// On new chat message
socket.on('chat-message', (username, message) => {
    const chatMessageTemplate = document.querySelector('#chat-message-template').innerHTML;
    const chatbox = document.querySelector('#chat');
    const chatMessageHtml = Mustache.render(chatMessageTemplate,
      {
        username,
        message
      }
    )
    chatbox.innerHTML = chatbox.innerHTML + chatMessageHtml;
    chatbox.scrollTop = chatbox.scrollHeight;
});

// Join this chatroom when user enters this page
socket.emit('join-chatroom', {username}, (error) => {
    if (error) {
        // if error joining chatroom, return user to homepage
        alert(error);
        location.href = '/'
    }
});


