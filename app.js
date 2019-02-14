const fs = require('fs');

var express = require( "express");
var socket_io = require( "socket.io" );
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');


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





let appModel = require('./models/appModel.js');


app.route('/test/:mapid')
  .get(function (req, res) {
    appModel.getMapById(req.params.mapid, function(err, map) {
      if (err){
        res.send(err);
      }else{
        res.json(map);
      }
    });
  });
  app.route('/test')
    .get(function (req, res) {
      appModel.getAllMaps(function(err, map) {
        if (err){
          res.send(err);
        }else{
          res.json(map);
        }
      });
    });


  // .post(function (req, res) {
  //   res.send('Add a book')
  // })




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
        socketid: socket.id,
        playerObj: {},
        playerColor: [Math.floor((Math.random() * 255) + 1),Math.floor((Math.random() * 255) + 1),Math.floor((Math.random() * 255) + 1)]

        // playerid: Math.floor((Math.random() * 1000) + 1)/
      }
      rooms[data.room]["players"].push(userObj);
      console.log(rooms);

      rooms[data.room]["players"].map((user) => {
        if (user.socketid != socket.id) {
          console.log('new_Player_Joined')
          io.sockets.to(user.socketid).emit('newPlayerJoined', rooms[data.room]["players"])
        }
      })

      let res = {
        users:rooms[data.room]["players"],
        socketid:userObj["socketid"]

      }

      socket.emit('joined', res)
    }



  });


  socket.on('playerMoved', (data) => {
if(Object.entries(rooms).length >= 1 && rooms.constructor === Object){
    let roomData = rooms[data.room];
    let players = roomData["players"];
    // debugger;


    let p = players.find(function(player) {
      return player.socketid == data["socketid"];
    })

// console.log(p);

    if(p != null){
      p.playerObj = data["playerObj"];
    }

    // console.log(p);


    if(players != null && players.length >= 2){
        players.map((user) => {
          if (user.socketid != data["socketid"]) {
            io.sockets.to(user.socketid).emit('otherPlayerMoved', players);
          }
        });
    }

}
  });

});

module.exports = app;
