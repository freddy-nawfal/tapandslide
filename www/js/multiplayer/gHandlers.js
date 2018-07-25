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