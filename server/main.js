var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var randomstring = require("randomstring");


var Classes = require("./classes.js");
const User = require("./models/user");

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/tapnslide";
mongoose
	.connect(mongoUrl, { useNewUrlParser: true })
	.catch(err => console.error(`Mongoose Error: ${err.stack}`));

var waitingRanked = {};
var rooms = {};


function isConnected(socket){
	return socket.user ? true : false;
}

function sendNotLoggedIn(socket){
	io.to(socket.id).emit("not_logged_in");
}

io.on('connection', function(socket){

	socket.emit("connected", socket.id);

	// Demande de connexion
	socket.on("login", function(data){
		User.findOne({username: data.username}, function(err, user){
			if(err)throw err;
			if(user){
				if(user.validPassword(data.password)){
					// User is valid, connecting him 
					socket.user = user;

					var toSend = {success: true, username: user.username};
					socket.emit("sign_in_info", toSend);
				}
				else{
					// invalid password
					var toSend = {success: false, errorfield: 'password'};
					socket.emit("sign_in_info", toSend);
				}
			}
			else{
				// User not found
				var toSend = {success: false, errorfield: 'username'};
				socket.emit("sign_in_info", toSend);
			}
		});
	});

	socket.on("sign_up", function(data){
		User.find({username: data.username}, function(user){
			if(user){
				// User already existing
				var toSend = {success: false, errorfield: 'username'};
				socket.emit("sign_up_info", toSend);
			}
			else{
				// Creating user
				User.create({username: data.username, password: data.password})
				.then(function(user){
					socket.user = user;
					var toSend = {success: true, username: user.username};
					socket.emit("sign_up_info", toSend);
				})
			}
		})
	});

	
	// Rejoindre le matchmaking
  socket.on("search", function(mode){
		if(isConnected(socket)){
			socket.emit("search");
			console.log("client: "+socket.id+" searching for "+mode);
			if(mode == "ranked"){
				socket.attempts = 0;
				waitingRanked[socket.id] = socket;
			}
		}
		else{
			sendNotLoggedIn(socket);	
		}
	});
	

	// Récupérer le nombre de joueurs en recherche, et en partie
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


	// Quitter le matchmaking
  socket.on("abandonSearch", function(){
  	delete waitingRanked[socket.id];
  	console.log(socket.id+" left the matchmaking");
	});
	
	// Quitter la game
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


	// Déconnexion du socket
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

	// Nous avons clické sur "ready"
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

	// 
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


	// Nous avons fini un élément
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
			var player1Data = {
				player: room.clients[0],
				progression: c1Progression
			};

			var player2Data = {
				player: room.clients[1],
				progression: c2Progression
			};
			calculateAndSetElo(player1Data, player2Data);

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


function calculateAndSetElo(player1Data, player2Data){
	var winner;
	var loser;
	

	if(player1Data.progression == 100){
		winner = player1Data.player;
		loser = player2Data.player;
	}
	else{
		winner = player2Data.player;
		loser = player1Data.player;
	}

	if(isConnected(winner) && isConnected(loser)){
		User.findOne({_id: winner.user._id}, function(err, WINNER){
			User.findOne({_id: loser.user._id}, function(err, LOSER){
				if(WINNER && LOSER){
					
					var progressionDifference = Math.abs(player1Data.progression - player2Data.progression);
					console.log("Progression difference: "+progressionDifference);

					console.log("Winner elo: "+WINNER.stats.elo);
					console.log("Loser elo: "+LOSER.stats.elo);

					var eloDifferenceWinner = WINNER.stats.elo - LOSER.stats.elo;

					var eloCalcWinner;
					var eloCalcLoser;
					
					if(eloDifferenceWinner > 0){
						// Winner was advantaged

						eloCalcWinner = progressionDifference * (1/eloDifferenceWinner);
						eloCalcLoser = progressionDifference * (1/eloDifferenceWinner);
					}
					else{
						// Loser was advantaged

						eloCalcLoser = 5 * progressionDifference * (1/Math.abs(eloDifferenceWinner));
						eloCalcWinner = progressionDifference * (1/Math.abs(eloDifferenceWinner));
					}

					console.log("Elo Calc Winner: "+ eloCalcWinner);
					console.log("Elo Calc Loser: "+ eloCalcLoser);

					WINNER.stats.elo += eloCalcWinner; 
					LOSER.stats.elo -= eloCalcLoser; 

					if(WINNER.stats.elo < 1) WINNER.stats.elo = 1;
					if(LOSER.stats.elo < 1) LOSER.stats.elo = 1;

					WINNER.save(function(e, w){});
					LOSER.save(function(e, w){});

				}
			});
		});
	}
}


// ============ MATCHMAKING ============


// Toutes les 2 secondes on parcours la liste des gens en attente 
var matchMaker = setInterval(function(){
	Object.keys(waitingRanked).forEach(function(key1) {
	    Object.keys(waitingRanked).forEach(function(key2) {
		    if(key1 != key2){
		    	var client1 = waitingRanked[key1];
		    	var client2 = waitingRanked[key2];

		    	if(client1 && client2){
						// tester les elo points et tout
						
						// Si les 2 joueurs matchent
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
	var numberOfElementsInLevel = Math.floor(Math.random() * 60) + 30;
	rooms[roomID].level = new Classes.level(numberOfElementsInLevel);
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