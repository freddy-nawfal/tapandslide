var gameHandlers = {
	in : {
		level : null,

		loadLevel : function(data){
			this.level = data;
		},

		joinedRoom : function(){
			searching = false;
			info("Game found, transitioning...");
			$("#menu").hide();

			if(game){
                console.log("destroying game");
                game.destroy(true, true);
                game = null;
                $("#game").html("");
            }

			$("#searching").hide();
			$("#ranked").show();

			setTimeout(function(){
	            startTimer(15, $("#timer"), function(){
		            gameHandlers.out.forceLeave();
		            mainMenu();
		            info("You left the game", 3);
		        });
		        hideNotification();
	            $("#ready").css('background','rgba(204, 88, 88, 0.35)');
	            $("#readyMenu").show();
	        }, 1000);
		},

		gameStart : function(){
			// ICI si tu veux le timer mais le level charge pas du coup
			/*
			setTimeout(function(){
	        	hideNotification();
	            $("#game").show();
	            $("readyMenu").hide();
				$("#ready").css('background','rgba(204, 88, 88, 0.35)');
				$('#timer').html("");
	        	launch("ranked", this.level);
			},1000)
			*/

			// ICI tout marche mais ils attendent plus du coup
			hideNotification();
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
				Level.myProgression = data[0].value;
				Level.enemyProgression = data[1].value;
			}
			else if(data[1].id == myID){
				Level.myProgression = data[1].value;
				Level.enemyProgression = data[0].value;
			}
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