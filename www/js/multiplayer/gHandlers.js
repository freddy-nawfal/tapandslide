var gameHandlers = {
	in : {
		level : null,

		loadLevel : function(data){
			this.level = data;
		},

		joinedRoom : function(data){
			$("#msg").html("Game found");

	        if(game)game.destroy();

	        launch("ranked", this.level);
	        setTimeout(function(){
	            $("#msg").html("");
	            $("#game").slideToggle("slow");
	        }, 1000);
		},

		opponentLeft : function(){
			mainMenu();
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