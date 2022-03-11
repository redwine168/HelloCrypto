const http = require('http');
const express = require('express');
var session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const { response } = require('express');

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
const port = process.env.PORT || 1337;
const publicDirectoryPath = path.join(__dirname, 'public/');
app.use(express.static(publicDirectoryPath));

// custom packages
var config = require('./config');
var DataService = require('./Services/DataService');
let dataService = new DataService(publicDirectoryPath + config.data_filename);

const server = http.createServer(app);
var io = require('socket.io')(server);


// GET for home page (landing page)
app.get('/', function(request, response) {
    response.render(publicDirectoryPath + 'views/home.html');
});

// GET for all crypto data page
app.get('/allData', function(request, response) { 
    response.render(publicDirectoryPath + 'views/allData.html');
});

// GET for single crypto data page
app.get('/singleData', function(request, response) {
    var crypto = request.session.crypto;
    response.render(publicDirectoryPath + 'views/singleData.html', {
        thisCrypto: crypto
    });
});

// GET call for retrieving the crypto data
app.get('/getCryptoData', function(request, response) {
    dataService.GetCryptoData().then((cryptoData) => {
        response.send({cryptoData: cryptoData});
    });
});

// POST for navigating to all crypto data page
app.post('/navToAllData', function(request, response) {
    response.send({redirect: '/allData'});
});

// POST for navigating to single crypto data page
app.post('/navToSingleData', function(request, response) {
    request.session.crypto = request.body.crypto;
    response.send({redirect: '/singleData'});
});


/// ------------------
/// ----- SOCKET -----
/// ------------------

// When a user connects
io.on('connection', (socket) => {
    // Join chatroom
    socket.on('join-chatroom', (data) => {
        // we'll only have one room, the name of which we'll pull from config
        let room = config.crypto_chatroom_name;
        socket.join(room);
    });


    // New chat message
    socket.on('new-chat-message', (data) => {
        let room = config.crypto_chatroom_name;
        io.to(room).emit('chat-message', data.username, data.message);
    });

});

server.listen(port, () => {
    console.log("Server running on port " + port)
});