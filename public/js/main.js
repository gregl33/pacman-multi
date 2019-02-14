
function letsPlay() {
let sketch = function( p5_script ) {
  p5_script.setup = function() {
    p5_script.createCanvas((map_.cols * map_.tsize), (map_.rows * map_.tsize));
    p5_script.frameRate(10);

    for (let i = 0; i < map_.cols; i++) {
        for (var j = 0; j < map_.rows; j++) {
          var n = map_.getTile(i, j);
          switch (n) {
            // case 100:
            // for (o_player of otherPlayers) {
            //    if(o_player.socketid == userID){
            //      o_player.x = i*map_.tsize;
            //      o_player.y = j*map_.tsize;
            //
            //      socket.emit('playerMoved', {
            //          socketid:userID,
            //          playerObj: o_player,
            //          room:roomName,
            //          map_tiles: map_.tiles
            //      });
            //    }
            //  }


              // break;
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

  p5_script.draw = function() {
    p5_script.background(200);
    for (let i = 0; i < map_.cols; i++) {
        for (var j = 0; j < map_.rows; j++) {
          var n = map_.getTile(i, j);
          if (n == 1) {
            p5_script.fill(50);
            p5_script.square(i*map_.tsize, j*map_.tsize, map_.tsize);
          } else if (n == 0){
            p5_script.fill(p5_script.color(255,153,51));
            p5_script.square(i*map_.tsize, j*map_.tsize, map_.tsize);
          } else if (n == 2) {
            p5_script.fill(p5_script.color(0,0,255));
            p5_script.square(i*map_.tsize, j*map_.tsize, map_.tsize);
          }
        }
      }

    p5_script.fill(150);


    for (o_player of otherPlayers) {
      if(o_player.socketid != userID){
        p5_script.fill(p5_script.color(o_player.playerColor[0],o_player.playerColor[1],o_player.playerColor[2]));
        p5_script.square(o_player.playerObj.x, o_player.playerObj.y, map_.tsize);
        countScore(o_player.socketid,o_player.playername);
      }else if(o_player.socketid == userID){


        let tempPlayer1 = {
          x:o_player.playerObj.x,
          y:o_player.playerObj.y
        };

        let newMove_p = getNewPos(newMove,{x:o_player.playerObj.x,y:o_player.playerObj.y});

        o_player.playerObj = getNewPos(curr_direction,o_player.playerObj)

        if((map_.getTile((newMove_p.x/map_.tsize), (newMove_p.y/map_.tsize))) != 1 && newMove != ""){
          o_player.playerObj.x = newMove_p.x;
          o_player.playerObj.y = newMove_p.y;
          curr_direction = newMove;
          newMove = "";
        }else{
          if((map_.getTile((o_player.playerObj.x/map_.tsize), (o_player.playerObj.y/map_.tsize))) == 1){
            o_player.playerObj.x = tempPlayer1.x;
            o_player.playerObj.y = tempPlayer1.y;
          }
        }

        if ((map_.getTile((o_player.playerObj.x/map_.tsize), (o_player.playerObj.y/map_.tsize))) == 0) {
          map_.updateTile((o_player.playerObj.x/map_.tsize), (o_player.playerObj.y/map_.tsize), userID);
        }

        if ((map_.getTile((o_player.playerObj.x/map_.tsize), (o_player.playerObj.y/map_.tsize))) == 2) {
          map_.updateTile((o_player.playerObj.x/map_.tsize), (o_player.playerObj.y/map_.tsize), userID);
        }


        p5_script.fill(p5_script.color(255,255,0));
        p5_script.square(o_player.playerObj.x, o_player.playerObj.y, map_.tsize);



        socket.emit('playerMoved', {
            socketid:userID,
            playerObj: {x:o_player.playerObj.x, y:o_player.playerObj.y},
            room:roomName,
            map_tiles: map_.tiles
        });

        countScore(o_player.socketid,o_player.playername);

      }
    }





    for (let g = 0; g < ghostsArr.length; g++) {
      // generateNewGhostMove(ghostsArr[g]["id"]);
      // ghostNewPos(ghostsArr[g]["id"]);
      // console.log(ghostsArr[g]["curr_direction"] + " - "+ghostsArr[g]["new_move"]);
    }


    // countScore()

  }

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


function findMeGhost(id) {
  return ghostsArr.find(function(ghost) {
      return ghost.id === id;
  });
}





function countScore(userID_,playername_) {
   let score = 0;
   if(map_.tiles != null){
     for (var i = 0; i < map_.tiles.length; i++) {
      if (map_.tiles[i] == userID_) {
        score++;
      }
    }
  }
  console.log(playername_ + ": " + score);
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
  p5_script.fill(p5_script.color(255, 0, 0));
  p5_script.square(ghost.x, ghost.y, map_.tsize);
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


};
var myp5 = new p5(sketch);

}
