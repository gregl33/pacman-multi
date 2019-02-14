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

  const map_ = {
      cols: 23,
      rows: 23,
      tsize: 30,
      tiles: [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,1,
        1,3,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,3,1,
        1,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,1,
        1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,
        1,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1,
        1,0,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,0,1,0,1,
        1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,
        1,0,1,0,1,0,1,0,1,1,1,3,1,1,1,0,1,0,1,0,1,0,1,
        1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,
        1,0,1,0,1,0,0,0,1,0,3,3,3,0,1,0,0,0,1,0,1,0,1,
        1,2,1,0,1,1,1,1001,3,0,3,100,3,0,3,0,1,1,1,0,1,2,1,
        1,0,1,0,1,0,0,0,1,0,3,3,3,0,1,0,0,0,1,0,1,0,1,
        1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,
        1,0,1,0,1,0,1,0,1,1,1,3,1,1,1,0,1,0,1,0,1,0,1,
        1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,
        1,0,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,0,1,0,1,
        1,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1,
        1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,
        1,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,1,
        1,3,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,3,1,
        1,3,3,3,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,3,3,3,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
  		],
      playerStart: {x:330,y:330}
  };

// socket.io events
io.on( "connection", function( socket ){
  console.log( "A user connected", socket.id);


  console.log(Object.keys(rooms));

  socket.emit('user_connected', Object.keys(rooms));



  socket.on('join', (data) => {
    if (data != null ){
      console.log(data)
      if (rooms[data.room] == null) {
        rooms[data.room] = {
          map:Object.assign({}, map_),
          players:[]
        };
        // socket.emit('new_room', data.room);
        socket.broadcast.emit('new_room', data.room);


      }
      let userObj = {
        playername: data.playername,
        socketid: socket.id,
        playerObj: rooms[data.room]["map"]["playerStart"],
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
        socketid:userObj["socketid"],
        map: rooms[data.room]["map"]
      }

      socket.emit('joined', res)
    }



  });


  socket.on('playerMoved', (data) => {
if(Object.entries(rooms).length >= 1 && rooms.constructor === Object){

// console.log("room: " + data.room);
    let roomData = rooms[data.room];
    if(data["map_tiles"] != null && data["map_tiles"].length >= 1){
      roomData["map"].tiles = data["map_tiles"];
    }
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
            io.sockets.to(user.socketid).emit('mapUpdated', roomData["map"].tiles);

          }
        });
    }

}
  });

});

module.exports = app;
