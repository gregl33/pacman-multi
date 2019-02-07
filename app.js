const fs = require('fs');

var express = require( "express");
var socket_io = require( "socket.io" );
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var natural = require('natural');

var app = express();
// Socket.io
var io  = socket_io();
app.io  = io;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


 let rooms = {};



app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/html/index.html'));
});


// app.post('/join', function(req, res, next) {
//   res.sendFile(path.join(__dirname + '/public/html/intro.html'));
// });


// socket.io events
io.on( "connection", function( socket ){
  console.log( "A user connected", socket.id);



  socket.on('join', (data) => {
    if (data != null ){
      console.log(data)
      if (rooms[data.room] == null) {
        rooms[data.room] = {
          players:[]
        };
      }
      let userObj = {
        playername: data.playername,
        socketid: socket.id
      }
      rooms[data.room]["players"].push(userObj);
      console.log(rooms);

      rooms[data.room]["players"].map((user) => {
        if (user.socketid != socket.id) {
          console.log('new_Player_Joined')
          io.sockets.to(user.socketid).emit('newPlayerJoined', rooms[data.room]["players"])
        }
      })
    }

    let res = {
      users:rooms[data.room]["players"]
    }

    socket.emit('joined', res)

  })


});

module.exports = app;
