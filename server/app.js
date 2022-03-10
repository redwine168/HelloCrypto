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
const hostname = '127.0.0.1';
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

app.get('/data', function(request, response) { 
    response.render(publicDirectoryPath + 'views/data.html', {
        cryptoData: request.session.cryptoData
    });
});

app.get('/getCryptoData', function(request, response) {
    dataService.GetCryptoData().then((cryptoData) => {
        response.send({cryptoData: cryptoData});
    });
})


app.post('/navToData', function(request, response) {
    response.send({redirect: '/data'});
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


server.listen(port, hostname, () => {
     console.log(`Server running at http://${hostname}:${port}/`);
});