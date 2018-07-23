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

  	if(socket.roomID){
  		var toS;
	  	if(rooms[socket.roomID].clients[0].id != socket.id){ 
	  		toS = rooms[socket.roomID].clients[0].id;
	  		rooms[socket.roomID].clients[0].roomID = 0;
	  	}
	  	else {
	  		toS = rooms[socket.roomID].clients[1].id;
	  		rooms[socket.roomID].clients[1].roomID = 0;
	  	}

	  	
	  	io.to(toS).emit('opponentLeft');


	  	delete waitingRanked[socket.id];
	  	delete rooms[socket.roomID];
	 }
  });


  socket.on('elementFinished', function(id){
  	var roomID = socket.roomID;
  	var room = rooms[roomID];

  	var client1Tab = room.client1Tab;
  	var client2Tab = room.client2Tab;

  	if(room.clients[0].id == socket.id){
  		if(client1Tab[id]){
  			if(!client1Tab[id].done){
  				client1Tab[id].done = true;
  				client1Tab.counter++;

  				console.log("Progression client 1: "+ (client1Tab.counter/room.level.getElements().length)*100 +"%");
  			}
  		}
  	}
  	else if(room.clients[1].id == socket.id){
  		if(client2Tab[id]){
  			if(!client2Tab[id].done){
  				client2Tab[id].done = true;
  				client2Tab.counter++;
  				console.log("Progression client 2: "+ (client2Tab.counter/room.level.getElements().length)*100 +"%");
  			}
  		}
  	}

  	// ici frr t'envoi la progression
  	// ici frr tu verifie aussi kil a fini esh
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
			    		level: null,
			    		client1Tab : {counter: 0},
			    		client2Tab : {counter: 0}
			    	};

			    	generateRoom(roomID);

			    	client1.roomID = roomID;
			    	client2.roomID = roomID;
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
	var tab = rooms[roomID].level.getElements();
	for (var i = 0; i < tab.length; i++) {
		rooms[roomID].client1Tab[tab[i][0]] = {done: false};
		rooms[roomID].client2Tab[tab[i][0]] = {done: false};
	}

	io.to(roomID).emit('level', rooms[roomID].level.getElements());
}



http.listen(8000, function(){
  console.log('listening on *:8000');
});