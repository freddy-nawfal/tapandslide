var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var randomstring = require("randomstring");

var Classes = require("./classes.js");


var waitingRanked = {};
var rooms = {};


io.on('connection', function(socket){
  
  socket.on("search", function(mode){
  	console.log("client: "+socket.id+" searching for "+mode);
  	if(mode == "ranked"){
  		socket.attempts = 0;
  		waitingRanked[socket.id] = socket;
  	}
  });


  socket.on('disconnect', function(){
  	delete waitingRanked[socket.id];


  	// Si user dans room:
  	//	User 2 gagne -> notifier et renvoyer à l'accueil
  	//	Supprimer la room
  });

});


var matchMaker = setInterval(function(){
	Object.keys(waitingRanked).forEach(function(key1) {
	    Object.keys(waitingRanked).forEach(function(key2) {
		    if(key1 != key2){
		    	// tester les elo points et tout 
		    	var client1 = waitingRanked[key1];
		    	var client2 = waitingRanked[key2];

		    	if(client1 && client2){
		    		delete waitingRanked[key1];
			    	delete waitingRanked[key2];

			    	var roomID = randomstring.generate(7);
			    	rooms[roomID] = {
			    		clients: [client1, client2], 
			    		level: null
			    	};
			    	generateRoom(roomID);
		    	}
		    }
		});
	});

}, 2000);



function generateRoom(roomID) {
	var client1 = rooms[roomID].clients[0];
	var client2 = rooms[roomID].clients[1];

	console.log("Matched: "+client1.id+" AND "+client2.id);

	client1.join(roomID);
	client2.join(roomID);

	generateLevel(roomID);
	io.to(roomID).emit('joinedRoom', client1.id+" AND "+client2.id);

}

function generateLevel(roomID){
	rooms[roomID].level = new Classes.level(50);

	io.to(roomID).emit('level', rooms[roomID].level.getElements());
}




http.listen(8000, function(){
  console.log('listening on *:8000');
});