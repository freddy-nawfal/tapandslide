var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var randomstring = require("randomstring");

var Classes = require("./classes.js");


var waitingRanked = {};
var rooms = {};


io.on('connection', function(socket){

	socket.emit("connected", socket.id);

  
  socket.on("search", function(mode){
  	console.log("client: "+socket.id+" searching for "+mode);
  	if(mode == "ranked"){
  		socket.attempts = 0;
  		waitingRanked[socket.id] = socket;
  	}
  });

  socket.on("getStats", function(){
  	var nbQ = 0;
  	var nbR = 0;
  	Object.keys(waitingRanked).forEach(function(key1) {
  		nbQ++;
  	});
  	Object.keys(rooms).forEach(function(key1) {
  		nbR++;
  	});
  	socket.emit("stats", {queue: nbQ, rooms: nbR});
  });

  socket.on("abandonSearch", function(){
  	delete waitingRanked[socket.id];
  	console.log(socket.id+" left the matchmaking");
  });
  socket.on("forceLeave", function(){
	if(socket.roomID){
  		var toS;
	  	if(rooms[socket.roomID].clients[0].id != socket.id){ 
	  		toS = rooms[socket.roomID].clients[0].id;
	  		rooms[socket.roomID].clients[0].roomID = 0;
	  		rooms[socket.roomID].clients[1].roomID = 0;
	  	}
	  	else {
	  		toS = rooms[socket.roomID].clients[1].id;
	  		rooms[socket.roomID].clients[1].roomID = 0;
	  		rooms[socket.roomID].clients[0].roomID = 0;
	  	}

	  	
	  	io.to(toS).emit('opponentLeft');

	  	delete rooms[socket.roomID];
	  	delete waitingRanked[socket.id];
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

	  	delete rooms[socket.roomID];
	 }

	if(waitingRanked[socket.id]){
	  delete waitingRanked[socket.id];
	  console.log(socket.id+" left the matchmaking");
	}
	 
  });

  socket.on("readyLaunch", function(){
  	var roomID = socket.roomID;
  	var room = rooms[roomID];
  	if(room.clients[0].id == socket.id)
  		room.client1Ready = true;
  	else if(room.clients[1].id == socket.id)
  		room.client2Ready = true;

  	if(room.client1Ready && room.client2Ready){
  		io.to(roomID).emit("gameStart");
  	}
  });

  socket.on('bothTimerGo', function(){
  	var roomID = socket.roomID;
  	var room = rooms[roomID];
  	if(room.clients[0].id == socket.id)
  		room.client1Go = true;
  	else if(room.clients[1].id == socket.id)
  		room.client2Go = true;

  	if(room.client1Go && room.client2Go){
  		io.to(roomID).emit("gameGo");
  	}
  });

  socket.on('elementFinished', function(id){
  	var roomID = socket.roomID;
  	var room = rooms[roomID];

  	var client1Tab = room.client1Tab;
  	var client2Tab = room.client2Tab;

  	// on inkrément les compteurs frr 
  	if(room.clients[0].id == socket.id){
  		if(client1Tab[id]){
  			if(!client1Tab[id].done){
  				client1Tab[id].done = true;
  				client1Tab.counter++;
  			}
  		}
  	}
  	else if(room.clients[1].id == socket.id){
  		if(client2Tab[id]){
  			if(!client2Tab[id].done){
  				client2Tab[id].done = true;
  				client2Tab.counter++;
  			}
  		}
  	}

  	// ici frr tu kalkul et t'envoi la progression
  	var c1Progression = (client1Tab.counter/room.level.getElements().length)*100;
  	var c2Progression = (client2Tab.counter/room.level.getElements().length)*100;

  	var toSend = [
  	{
  		id: room.clients[0].id, 
  		value: c1Progression
  	}, 
  	{
  		id: room.clients[1].id, 
  		value: c2Progression
  	}];

  	io.to(roomID).emit("progressionInfo", toSend);


  
  	// ici frr tu verifie aussi kil a fini wesh
  	if(c1Progression == 100 || c2Progression == 100){
  		if(c1Progression == 100){
  			io.to(roomID).emit('gameFinished',room.clients[0].id);
  		}
  		else{
  			io.to(roomID).emit('gameFinished',room.clients[1].id);
  		}

  		room.clients[0].roomID = null;
  		room.clients[1].roomID = null;
  		delete rooms[roomID];
  	}


  });


});

// Toutes les 2 secondes on parcours la liste des gens en attente 
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