var notifyElement = $("#msg");
var hidden = true;
var timeout = null;



function info(msg, seconds = null){
	showNotification();

	notifyElement.html(msg);

	if(seconds){
		if(!timeout){

			timeout = setTimeout(function(){
				hideNotification();
			}, seconds*1000);
		}
		else{
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				hideNotification();
			}, seconds*1000);
		}
	}
}

function showNotification(){
	if(hidden){
		notifyElement.slideToggle();
		hidden = false;
	}
}

function hideNotification(now = false){
	if(!hidden){
		if(now){
			notifyElement.hide();
		}
		else{
			notifyElement.slideToggle();
		}
		hidden = true;
		notifyElement.html("");
	}
}