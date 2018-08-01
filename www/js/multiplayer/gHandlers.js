var gameHandlers = {
	in : {
		level : null,

		loadLevel : function(data){
			this.level = data;
		},

		joinedRoom : function(){
			info("Game found, transitioning...");


			searching = false;
			$("#menu").hide();
			$("#inGameLoader").hide();
			$("#menuTop").hide();

			if(game){
                game.destroy(true, true);
                game = null;
                $("#game").html("");
            }

			$("#searching").hide();
			$("#ranked").show();

			setTimeout(function(){
				clearInterval(timerInterval);
	            startTimer(15, $("#timer"), function(){
		            leave();
		            info("You left the game", 3);
		        });
		        hideNotification();
	            $("#readyMenu").show();
	        }, 1000);

	        player1Bar.animate(0);
			player2Bar.animate(0);
		},

		gameStart : function(){
			hideNotification(true);
	        $("#game").show();
	        $("readyMenu").hide();
			$('#timer').html("");
	        launch("ranked", this.level);
		},

		opponentLeft : function(){
			mainMenu();
			info("Your opponent left", 3);
		},

		gameGo : function(){
			$('#beginTimer').html('GO!');
			game.input.enabled=true;
			setTimeout(function(){
				$('#beginTimer').hide();
			},2000);
		},

		progressionInfo : function(data){
			if(data[0].id == myID){
				Level.myProgression = Math.round(data[0].value);
				Level.enemyProgression = Math.round(data[1].value);
			}
			else if(data[1].id == myID){
				Level.myProgression = Math.round(data[1].value);
				Level.enemyProgression = Math.round(data[0].value);
			}
			player1Bar.animate(Level.myProgression/100);
			player2Bar.animate(Level.enemyProgression/100);
		},

		gameFinished : function(id){
			Level.gameEnded = true;
			Level.winner = id;
			retourMenu(5000);
		},

		stats : function(data){
			var msg = "";
			if(data.queue == 1){
				msg = msg+""+data.queue+" player in the queue."; 
			}
			else{
				msg = msg+""+data.queue+" players in the queue."; 
			}
			msg+="<br>";
			msg = msg+""+data.rooms*2+" players playing."; 
			info(msg, 3);
		}
	},

	out : {
		elementFinished : function(id){
			socket.emit("elementFinished", id);
		},

		bothTimerGo : function(){
			socket.emit('bothTimerGo');
		},

		search : function(mode){
			socket.emit("search", mode);
		}, 

		abandonSearch : function(){
			socket.emit("abandonSearch");
		},

		readyLaunch : function(){
			socket.emit("readyLaunch");
		},

		forceLeave : function(){
			socket.emit("forceLeave");
		},

		getStats : function(){
			socket.emit("getStats");
		}
	}
	
}