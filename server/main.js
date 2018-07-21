var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Classes = require("./classes.js");



io.on('connection', function(socket){
  var level = new Classes.level(20);

  socket.emit('level', level.getElements());

});






http.listen(8000, function(){
  console.log('listening on *:8000');
});