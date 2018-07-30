var gameHandlers = {
	in : {
		level : null,

		loadLevel : function(data){
			this.level = data;
		},

		joinedRoom : function(){
			searching = false;
			$("#menu").hide();
			$("#inGameLoader").hide();
			$("#menuTop").hide();
			info("Game found, transitioning...");

			if(game){
                console.log("destroying game");
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
	            $("#ready").css('background','rgba(204, 88, 88, 0.35)');
	            $("#readyMenu").show();
	        }, 1000);
		},

		gameStart : function(){
			hideNotification(true);
	        $("#game").show();
	        $("readyMenu").hide();
			$("#ready").css('background','rgba(204, 88, 88, 0.35)');
			$('#timer').html("");
	        launch("ranked", this.level);
		},

		opponentLeft : function(){
			mainMenu();
			info("Your opponent left", 3);
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

		winner : function(){
			info("YOU WON", 5);
			mainMenu();
		},

		loser : function(){
			info("YOU LOST", 5);
			mainMenu();
		}
	},

	out : {
		elementFinished : function(id){
			socket.emit("elementFinished", id);
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
		}
	}
	
}