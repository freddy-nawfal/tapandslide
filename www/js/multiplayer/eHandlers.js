var errors = {
	connect_error : function(){
		errors.printErrorMsg("Connection error");
	},
	connect_timeout : function(){
		errors.printErrorMsg("Connection timeout");
	},
	reconnect_attempt : function(data){
		errors.printErrorMsg("Reconnection attempt: "+data);
	},
	reconnect_error : function(){
		errors.printErrorMsg("Reconnection error");
	},
	reconnect_failed : function(){
		errors.printErrorMsg("Reconnection failed");
	},

	printErrorMsg : function(msg){
		$("#game").hide();
        $("#menu").hide();
        $("#msg").show();
        $("#msg").html(msg);
	}
}