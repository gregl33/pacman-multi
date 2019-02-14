
let socket = io();
// let player1 = {
//   x:-1,
//   y:-1
// };
let newMove = "";
let curr_direction = "";
let map_ = {};
let otherPlayers = []
let userID = 0000;
let roomName = '';


socket.on('user_connected', (data) => {
  console.log("connected");
  for (var i = 0; i < data.length; i++) {
    createRoomBox(data[i]);
  }
});


socket.on('new_room', (data) => {
  createRoomBox(data);
});

socket.on('joined', (data) => {
  console.log(data);
    userID = data.socketid;
    map_ = data["map"];

    map_.getTile = function (col, row) {
      if(map_.tiles != null){
        return map_.tiles[row * map_.cols + col];
      } else{
        return -1;
      }
    };
    map_.updateTile = function (col, row, n) {
      map_.tiles[row * map_.cols + col] = n;
    }

    document.getElementById("all_rooms").classList.add("hide_all_rooms");
    otherPlayers = data["users"];

    letsPlay();
});



socket.on('newPlayerJoined', data => {
    console.log(data)
    otherPlayers = data;
})

socket.on('otherPlayerMoved', data => {
    console.log(data)
    otherPlayers = data;

})

socket.on('mapUpdated', data => {
    console.log(data)
    map_.tiles = data;
})


function startGame(evt) {
  var element_column = evt.currentTarget.parentElement;
  while (element_column.className != "column") {
    element_column = element_column.parentElement;
  }

  let input_playernameInput = element_column.querySelector(".playernameInput");
  let input_roomnameInput = element_column.querySelector(".roomnameInput");

  if(input_playernameInput != null && input_roomnameInput != null){
    roomName = input_roomnameInput.value;
    socket.emit('join', {
        playername: input_playernameInput.value,
        room:roomName,
    });
  }
}


function createDiv(type,classes,appendTo,attributes,id_) {
  var div = document.createElement(type);
  if(classes != null && classes.length >= 1){
    div.classList.add.apply(div.classList,classes);
  }
  if(id_ != null){
    div.id = id_;
  }
  if(attributes != null){
    for (var key in attributes) {
       if (attributes.hasOwnProperty(key)) {
           div.setAttribute(key,attributes[key]);
       }
    }
  }
  if(appendTo != null){
    appendTo.appendChild(div);
  }
  return div;
}



function createRoomBox(name) {
  let all_rooms = document.getElementById("all_rooms");
  let div = createDiv("div",["column"],all_rooms,null,"");

    let r_input = createDiv("input",["roomnameInput","disable_roomnameInput"],div,null,"");
    r_input.type = "text";
    r_input.r_input = "roomname";
    r_input.r_input = "Room Name";
    r_input.disabled = true;
    r_input.value =   name;

    let p_input = createDiv("input",["playernameInput"],div,null,"");
    p_input.type = "text";
    p_input.name = "playername";
    p_input.placeholder = "Player Name";


    let btnEnter = createDiv("button",["enterBtn"],div,null,"");
    btnEnter.type="button";
    btnEnter.name="enterBtn";
    // btnEnter.onclick = startGame;
    btnEnter.addEventListener("click",startGame,false);
    btnEnter.textContent = "Enter";
}
