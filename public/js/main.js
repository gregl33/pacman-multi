



let socket = io();

socket.emit('join', {
    playername:'user' + Math.floor((Math.random() * 50) + 1),
    room:'tesmp1'
});


socket.on('joined', (data) => {
  console.log(data);
});


socket.on('newPlayerJoined', data => {
    console.log(data)
})

var map_ = {
    cols: 10,
    rows: 10,
    tsize: 50,
    tiles: [
      1,1,1,1,1,1,1,1,1,1,
			1,0,0,0,0,0,0,0,0,1,
			1,0,0,0,0,1,1,1,0,1,
			1,0,0,0,0,0,0,0,0,1,
			1,0,1,1,0,1,1,1,0,1,
			1,0,0,0,0,0,0,0,0,1,
			1,0,1,1,0,1,1,1,0,1,
			1,0,0,0,0,0,0,0,0,1,
			1,0,0,0,0,0,0,0,0,1,
			1,1,1,1,1,1,1,1,1,1
		]
,
    getTile: function (col, row) {
        return this.tiles[row * map_.cols + col];
    }
};

function setup() {
	createCanvas(500, 500);
  	frameRate(15);
    // fill(150);
    // square(2*map_.tsize, map_.tsize, map_.tsize);

}

var player1 = {
  x:2*map_.tsize,
  y:2*map_.tsize
};

function draw() {
  console.log(player1);
  background(200);


  for (let i = 0; i < map_.cols; i++) {
      for (var j = 0; j < map_.rows; j++) {
        var n = map_.getTile(i, j);
        if (n == 1) {

          fill(50);
          square(i*map_.tsize, j*map_.tsize, map_.tsize);
        }
      }
    }


  fill(150);

  var tempPlayer1X = player1.x;
  var tempPlayer1Y = player1.y;

  switch (direction) {
    case "left":
        player1.x -= map_.tsize;

      break;
    case "right":
        player1.x += map_.tsize;

      break;
    case "up":
        player1.y -= map_.tsize;
      break;
    case "down":
        player1.y += map_.tsize;

      break;
  }

  if((map_.getTile((player1.x/map_.tsize), (player1.y/map_.tsize))) == 1){
    direction = "";
    player1.x = tempPlayer1X;
    player1.y = tempPlayer1Y;
  }

  square(player1.x, player1.y, map_.tsize);





}


var direction;
function keyPressed() {
  switch (keyCode) {
    case 65:
    case 37:
        direction = 'left';
        // player1.x -= map_.tsize;

      break;
    case 68:
    case 39:
        direction = 'right';
        // player1.x += map_.tsize;

      break;
    case 87:
    case 38:
        direction = 'up';
        // player1.y -= map_.tsize;
      break;
    case 83:
    case 40:
        direction = 'down';
        // player1.y += map_.tsize;


      break;
  }
}
