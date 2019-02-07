



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
