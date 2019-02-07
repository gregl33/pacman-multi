



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
    tiles: [1,1,1,1,1,1,1,1,1,1,
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
  	
}

function draw() {
	console.log(direction);
	background(200);
	for (let i = 0; i < map_.cols; i++) {
  		for (var j = 0; j < map_.rows; j++) {
  			var n = map_.getTile(i, j);
  			if (n == 1) {
  				square(i*map_.tsize, j*map_.tsize, map_.tsize);
  			}
  		}
  	}
}
var direction;
function keyPressed() {
  switch (keyCode) {
    case 65:
    case 37:
        direction = 'left';

      break;
    case 68:
    case 39:
        direction = 'right';

      break;
    case 87:
    case 38:

        direction = 'up';

      break;
    case 83:
    case 40:
        direction = 'down';

      break;
  }
}

