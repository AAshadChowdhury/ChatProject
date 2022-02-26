var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);//modules: http, express, socket.io
app.use(express.static(__dirname + '/public'));//client file
//app.get('/', function (req, res) {//route
//    res.sendfile(__dirname + '/public/Page1.html');
//});
var usernames = {};
io.sockets.on('connection', function (socket) {//three events: sendchat, adduser,disconnect
    socket.on('sendchat', function (data) {
        io.sockets.emit('chat', socket.username, data);//sends this methods
    });
    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username] = username;
        socket.emit('chat', 'SERVER', 'you have connected');//sent to himself
        socket.broadcast.emit('chat', 'SERVER', username + ' has connected');//sent to all users except who sent
        io.sockets.emit('allusers', usernames);
    });
    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('allusers', usernames);
        socket.broadcast.emit('chat', 'SERVER', socket.username + ' has disconnected');
    });
});
server.listen(1337);
console.log('Listening on port: 1337');
