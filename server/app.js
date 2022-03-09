const http = require('http');
const express = require('express');
var session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

//var DbContext = require('./DbFunctions/DbContext');
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

const server = http.createServer(app);
var io = require('socket.io')(server);


// GET for home page (landing page)
app.get('/', async function(request, response) {
    /*
    response.render(publicDirectoryPath + 'views/home.html', {
        userID: userData["ID"],
        userEmailAddress: userData["EmailAddress"],
        username: userData["Username"]
    });*/
    response.render(publicDirectoryPath + 'views/home.html');
});

app.get('/data', async function(request, response) {
    response.render(publicDirectoryPath + 'views/data.html');
});





app.post('/navToData', function(request, response) {
    var userID = request.body.userID;
    request.session.userID = userID;
    response.send({redirect: '/data'});
});


/// ------------------
/// ----- SOCKET -----
/// ------------------


// When a user connects
io.on('connection', (socket) => {

    // Request to get available chatrooms
    socket.on('available-chatrooms-refresh-request', async (data) => {
        // Get user info and add socket to appropriate room
        var userID = data.userID;
        var room = config.naming.home + userID;
        socket.join(room);

        chatrooms = {}
        dbContext.SelectMostPopularChatrooms().then((popularChatroomsResult) => {
            chatrooms.popularChatrooms = popularChatroomsResult.recordset;
            dbContext.SelectActiveChatrooms().then((activeChatroomsResult) => {
                chatrooms.activeChatrooms = activeChatroomsResult.recordset;
                io.to(room).emit('available-chatrooms', chatrooms);
            });
        });
    });


    // Create new chatroom
    socket.on('create-new-chatroom', (data) => {
        var insertNewChatroomModel = {};
        insertNewChatroomModel.chatroomName = data.chatroomName
        insertNewChatroomModel.userID = data.userID;
        let room = config.naming.home + data.userID;
        dbContext.InsertNewChatroom(insertNewChatroomModel).then((newChatroomID) => {
            io.to(room).emit('nav-to-chatroom', newChatroomID);
        });
    });


    // Join chatroom
    socket.on('join-chatroom', (data) => {
        var addUserToChatroomModel = {}
        addUserToChatroomModel.userID = data.userID;
        addUserToChatroomModel.chatroomID = data.chatroomID;
        let room = config.naming.chatroom + addUserToChatroomModel.chatroomID;
        socket.join(room);
        let message = data.username + " entered the chatroom!";
        io.to(room).emit('chat-message', 0, "Admin", message);
        dbContext.AddUserToChatroom(addUserToChatroomModel);
    });

    // Leave chatroom
    socket.on("disconnecting", () => {
        var rooms = socket.rooms;
        for (var i in rooms) {
            if (rooms[i].includes(config.naming.chatroom)) {
                var chatroomID = rooms[i].substring(rooms[i].indexOf(config.naming.chatroom) + config.naming.chatroom.length);
                io.to(socket.id).emit('disconnected-from-chatroom');
                removeUserFromChatroomModel = {};
                removeUserFromChatroomModel.chatroomID = chatroomID;
                dbContext.RemoveUserFromChatroom(removeUserFromChatroomModel);
            }
        }
    });


    // New chat message
    socket.on('new-chat-message', (data) => {
        /*
        // delete this:
        io.to(socket.id).emit('disconnected-from-chatroom');
        console.log("disconnecting " + socket.id)*/

        insertNewMessageModel = {};
        insertNewMessageModel.chatroomID = data.chatroomID;
        insertNewMessageModel.userID = data.userID;
        insertNewMessageModel.message = data.message;
        let room = "chatroom" + insertNewMessageModel.chatroomID;
        io.to(room).emit('chat-message', data.userID, data.username, insertNewMessageModel.message);
        dbContext.InsertNewMessage(insertNewMessageModel);
    });

});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});