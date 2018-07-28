var gameHandlers = {
	in : {
		level : null,

		loadLevel : function(data){
			this.level = data;
		},

		joinedRoom : function(data){
			searching = false;
			$("#msg").html("Game found");
			$("#menu").hide();

	        if(game)game.destroy();

	        launch("ranked", this.level);
	        
	        setTimeout(function(){
	            $("#msg").hide();
	            $("#game").show();
	        }, 1000);
		},

		opponentLeft : function(){
			mainMenu();
			$("#msg").show();
			$("#msg").html("Your opponent left");
		},

		progressionInfo : function(data){
			console.log(data);
			if(data[0].id = myID){
				Level.myProgression = data[0].value;
				Level.enemyProgression = data[1].value;
			}
			else if(data[1].id = myID){
				Level.myProgression = data[1].value;
				Level.enemyProgression = data[0].value;
			}
		},

		winner : function(data){
			$("#game").hide();
			$("#menu").show();
			$("#msg").show();
			if(data == myID){
				$("#msg").html("YOU WON");
			}
			else{
				$("#msg").html("YOU LOST");
			}
		}
	},

	out : {
		elementFinished : function(id){
			socket.emit("elementFinished", id);
		},

		search : function(mode){
			socket.emit("search", mode);
		}
	}
	
}