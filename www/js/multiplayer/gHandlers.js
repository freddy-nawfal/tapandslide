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

			$("#searching").hide();
			$("#ranked").show();

			 setTimeout(function(){
	            hideNotification();
	            $(ready).css('background','rgba(204, 88, 88, 0.35)');
	            $("#readyMenu").show();
	            startTimer(15, $("#timer"), function(){
	            	gameHandlers.out.forceLeave();
	            	mainMenu();
	            });
	        }, 1000);
		},

		gameStart : function(){
			if(game){
                console.log("destroying game");
                game.destroy(true, true);
                game = null;
                $("#game").html("");
            }

	        launch("ranked", this.level);
	        
	        setTimeout(function(){
	            $("#game").show();
	            $("readyMenu").hide();
				$(ready).css('background','rgba(204, 88, 88, 0.35)');
	        }, 1000);
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