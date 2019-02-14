
let socket = io();
let player1 = {
  x:-1,
  y:-1
};
let newMove = "";
let curr_direction = "";
let map_ = {
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
    getTile: function (col, row) {
        return this.tiles[row * map_.cols + col];
    },
    updateTile: function (col, row, n) {
      this.tiles[row * map_.cols + col] = n;
    }
};


let roomName = 'test1';
socket.emit('join', {
    playername:'user' + Math.floor((Math.random() * 50) + 1),
    room:roomName,
});


socket.on('joined', (data) => {
  console.log(data);
  // if(data.socketid){
    userID = data.socketid;
  // }
});

let otherPlayers = []
socket.on('newPlayerJoined', data => {
    console.log(data)
    otherPlayers = data;
})



socket.on('otherPlayerMoved', data => {
    console.log(data)
    otherPlayers = data;

})




let userID = 0000;

let ghost_1 = {
  x: -1,
  y: -1,
  "new_move":"",
  "curr_direction":""
}



let ghostNewPosTime = 1000;
let ghostsArr = [
  {
    x: -1,
    y: -1,
    "new_move":"",
    "curr_direction":"",
    "id":1001
  }//,
  // {
  //   x: -1,
  //   y: -1,
  //   "new_move":"",
  //   "curr_direction":"",
  //   "id":1002
  // }
]
function setup() {
	createCanvas((map_.cols * map_.tsize), (map_.rows * map_.tsize));
  frameRate(10);

  for (let i = 0; i < map_.cols; i++) {
      for (var j = 0; j < map_.rows; j++) {
        var n = map_.getTile(i, j);
        switch (n) {
          case 100:
            player1.x = i*map_.tsize;
            player1.y = j*map_.tsize;
            break;
          case 1001:
            var g = findMeGhost(1001);
            g.x = i*map_.tsize;
            g.y = j*map_.tsize;
            break;
          case 1002:
            var g = findMeGhost(1002);
            g.x = i*map_.tsize;
            g.y = j*map_.tsize;
            break;
          default:
        }
      }
    }

    for (let g = 0; g < ghostsArr.length; g++) {
      ghostsArr[g]["timer"] = setTimeout(generateNewGhostMove,ghostNewPosTime,ghostsArr[g]["id"])
    }
}

function findMeGhost(id) {
  return ghostsArr.find(function(ghost) {
      return ghost.id === id;
  });
}



function draw() {
  background(200);
  for (let i = 0; i < map_.cols; i++) {
      for (var j = 0; j < map_.rows; j++) {
        var n = map_.getTile(i, j);
        if (n == 1) {
          fill(50);
          square(i*map_.tsize, j*map_.tsize, map_.tsize);
        } else if (n == 0){
          fill(color(255,153,51));
          square(i*map_.tsize, j*map_.tsize, map_.tsize);
        } else if (n == 2) {
          fill(color(0,0,255));
          square(i*map_.tsize, j*map_.tsize, map_.tsize);
        }
      }
    }

  fill(150);





  for (p of otherPlayers) {
    if(p.socketid != userID){
      fill(p.playerColor[0],p.playerColor[1],p.playerColor[2]);
      square(p.playerObj.x, p.playerObj.y, map_.tsize);
    }
  }


  let tempPlayer1 = {
    x:player1.x,
    y:player1.y
  };

  let newMove_p = getNewPos(newMove,{x:player1.x,y:player1.y});

  player1 = getNewPos(curr_direction,player1)

  if((map_.getTile((newMove_p.x/map_.tsize), (newMove_p.y/map_.tsize))) != 1 && newMove != ""){
    player1.x = newMove_p.x;
    player1.y = newMove_p.y;
    curr_direction = newMove;
    newMove = "";
  }else{
    if((map_.getTile((player1.x/map_.tsize), (player1.y/map_.tsize))) == 1){
      player1.x = tempPlayer1.x;
      player1.y = tempPlayer1.y;
    }
  }

  if ((map_.getTile((player1.x/map_.tsize), (player1.y/map_.tsize))) == 0) {
    map_.updateTile((player1.x/map_.tsize), (player1.y/map_.tsize), userId);
  }

  if ((map_.getTile((player1.x/map_.tsize), (player1.y/map_.tsize))) == 2) {
    map_.updateTile((player1.x/map_.tsize), (player1.y/map_.tsize), userId);
  }

  countScore()

  fill(color(255,255,0));
  square(player1.x, player1.y, map_.tsize);





  // let newMove_p_g = getNewPos(ghost_1["new_move"],{x:ghost_1.x,y:ghost_1.y});
  //
  // ghost_1 = getNewPos(ghost_1["curr_direction"],ghost_1);
  //
  // if((map_.getTile((newMove_p_g.x/map_.tsize), (newMove_p_g.y/map_.tsize))) != 1 && ghost_1["new_move"] != ""){
  //   ghost_1.x = newMove_p_g.x;
  //   ghost_1.y = newMove_p_g.y;
  //   ghost_1["curr_direction"] = ghost_1["new_move"];
  //   ghost_1["new_move"] = "";
  // }else{
  //   if((map_.getTile((ghost_1.x/map_.tsize), (ghost_1.y/map_.tsize))) == 1){
  //     // player1.x = tempPlayer1.x;
  //     // player1.y = tempPlayer1.y;
  //     generateNewGhostMove()
  //   }
  // }
  // ghostNewPos()
  for (let g = 0; g < ghostsArr.length; g++) {
    // generateNewGhostMove(ghostsArr[g]["id"]);
    ghostNewPos(ghostsArr[g]["id"]);
    // console.log(ghostsArr[g]["curr_direction"] + " - "+ghostsArr[g]["new_move"]);
  }


  // fill(color(255, 0, 0));
  // square(ghost_1.x, ghost_1.y, map_.tsize);


  socket.emit('playerMoved', {
      socketid:userID,
      playerObj: player1,
      room:roomName
  });
}

function countScore() {
   let score = 0;
   for (var i = 0; i < map_.tiles.length; i++) {
    if (map_.tiles[i] == userId) {
      score++  
    }
  }
}

function countScore() {
   let score = 0;
   for (var i = 0; i < map_.tiles.length; i++) {
    if (map_.tiles[i] == userId) {
      score++  
    }
  }
}

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.key) {
    case "a":
    case "ArrowLeft":
        newMove = 'left';
      break;
    case "d":
    case "ArrowRight":
        newMove = 'right';
      break;
    case "w":
    case "ArrowUp":
        newMove = 'up';
      break;
    case "s":
    case "ArrowDown":
        newMove = 'down';

      break;
  }
});

// function keyPressed() {
//     switch (keyCode) {
//       case 65:
//       case 37:
//         newMove = 'left';
//         break;
//       case 68:
//       case 39:
//         newMove = 'right';
//         break;
//       case 87:
//       case 38:
//         newMove = 'up';
//         break;
//       case 83:
//       case 40:
//         newMove = 'down';
//         break;
//     }
// }


function getNewPos(new_direction,cor_obj) {
  switch (new_direction) {
    case "left":
        cor_obj.x -= map_.tsize;
      break;
    case "right":
        cor_obj.x += map_.tsize;
      break;
    case "up":
        cor_obj.y -= map_.tsize;
      break;
    case "down":
        cor_obj.y += map_.tsize;
      break;
  }
  return cor_obj;
}


function ghostNewPos(ghost_id) {
generateNewGhostMove(ghost_id);
  let ghost = findMeGhost(ghost_id);


  let temp_ghost_1 = {
    x:ghost.x,y:ghost.y
  }
  let newMove_p_g = getNewPos(ghost["new_move"],{x:ghost.x,y:ghost.y});

  ghost = getNewPos(ghost["curr_direction"],ghost);

  if((map_.getTile((newMove_p_g.x/map_.tsize), (newMove_p_g.y/map_.tsize))) != 1 && ghost["new_move"] != ""){
    ghost.x = newMove_p_g.x;
    ghost.y = newMove_p_g.y;
    ghost["curr_direction"] = ghost["new_move"];
    ghost["new_move"] = "";
  }else{
    if((map_.getTile((ghost.x/map_.tsize), (ghost.y/map_.tsize))) == 1){
      ghost.x = temp_ghost_1.x;
      ghost.y = temp_ghost_1.y;
      generateNewGhostMove(ghost_id)
      // ghostNewPos()
      ghostNewPos(ghost_id);
    }
  }
  fill(color(255, 0, 0));
  square(ghost.x, ghost.y, map_.tsize);
}


function generateNewGhostMove(ghost_id) {

  let ghost = findMeGhost(ghost_id);

  // console.log(ghost);


  var _1 = map_.getTile(((ghost.x-map_.tsize)/map_.tsize), ((ghost.y-map_.tsize)/map_.tsize));

  var _2 = map_.getTile((ghost.x/map_.tsize), ((ghost.y-map_.tsize)/map_.tsize));

  var _3 = map_.getTile(((ghost.x+map_.tsize)/map_.tsize), ((ghost.y-map_.tsize)/map_.tsize));

  var _4 = map_.getTile(((ghost.x-map_.tsize)/map_.tsize), (ghost.y/map_.tsize));
  //
  var t = map_.getTile((ghost.x/map_.tsize), (ghost.y/map_.tsize));
  //
  var _5 = map_.getTile(((ghost.x+map_.tsize)/map_.tsize), (ghost.y/map_.tsize));
  //
  var _6 = map_.getTile(((ghost.x-map_.tsize)/map_.tsize), ((ghost.y+map_.tsize)/map_.tsize));
  var _7 = map_.getTile((ghost.x/map_.tsize), ((ghost.y+map_.tsize)/map_.tsize));

  var _8 = map_.getTile(((ghost.x+map_.tsize)/map_.tsize), ((ghost.y+map_.tsize)/map_.tsize));

  // console.log(_1 + "," +_2+ "," +_3);
  // console.log(_4 + "," +t+ "," +_5);
  // console.log(_6 + "," +_7+ "," +_8);





  // clearTimeout(ghost["timer"]);
  //
  // let moves = ["left","right","up","down"];
  // switch (ghost["curr_direction"]) {
  //   case "left":
  //       moves = ["up","down"];
  //     break;
  //   case "right":
  //       moves = ["up","down"];
  //     break;
  //   case "up":
  //       moves = ["left","right"];
  //     break;
  //   case "down":
  //       moves = ["left","right"];
  //     break;
  // }
  // var rand = moves[Math.floor(Math.random() * moves.length)];
  // ghost["new_move"] = rand;
  // // ghostNewPos(ghost_id);
  // ghost["timer"] = setTimeout(generateNewGhostMove,ghostNewPosTime,ghost_id)

}
