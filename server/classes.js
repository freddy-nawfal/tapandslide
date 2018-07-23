var randomstring = require("randomstring");

var TypeObject = {
  BUTTON: 1,
  SLIDER: 2,
  SPIRAL: 3,
  nbType: 3,
  percentage: {
    button: 0.7,
    slider: 0.25,
    spiral: 0.05
  }
};

module.exports = {

	level : class{

		constructor(size){
			this.tab = [];
			var nbButton = Math.floor(TypeObject.percentage.button * size);
			var nbSlider = Math.floor(TypeObject.percentage.slider * size);
			var nbSpiral = Math.floor(TypeObject.percentage.spiral * size);
			if((nbButton + nbSlider + nbSpiral)<size) nbButton += size - (nbButton + nbSlider + nbSpiral);

			for(var i=0; i<nbButton; i++){
			  this.tab.push(["practice", generateElement(TypeObject.BUTTON)]);
			}
			for(var i=0; i<nbSlider; i++){
			  this.tab.push(["practice", generateElement(TypeObject.SLIDER)]);
			}
			for(var i=0; i<nbSpiral; i++){
			  this.tab.push(["practice", generateElement(TypeObject.SPIRAL)]);
			}
			
			return shuffleArray(tab);
		}

		generateElement(type){
			var pos = {
				button: {
					x: 0,
					y: 0
				},
				slider: {
					start : {
						x: 0,
						y: 0
					},
					middle : {
						x: 0,
						y: 0
					},
					end : {
						x: 0,
						y: 0
					}
				}
			};

			if(type == TypeObject.BUTTON){//BOUTON
			    pos.button.x = Math.floor(Math.random()*99) + 1;
			    pos.button.y = Math.floor(Math.random()*99) + 1;
			}
			else if(type == TypeObject.SLIDER){//SLIDER
				pos.slider.start.x = Math.floor(Math.random()*99) + 1;
			    pos.slider.start.y = Math.floor(Math.random()*99) + 1;

			    var X;
			    var Y; Math.floor(Math.random()*99) + 1;
			    var minDistancePercent = 40;

			    while(getDistance(X=Math.floor(Math.random()*99) + 1, Y=Math.floor(Math.random()*99) + 1, pos.slider.start.x, pos.slider.start.y) < minDistancePercent) continue;

			    pos.slider.middle.x=X;
				pos.slider.middle.y=Y;

				X=0;
				Y=0;
				while(getDistance(X=Math.floor(Math.random()*99) + 1, Y=Math.floor(Math.random()*99) + 1, pos.slider.middle.x, pos.slider.middle.y) < minDistancePercent) continue;
			    pos.slider.end.x=X;
				pos.slider.end.y=Y;
			}

			return {type: type, pos: pos};
		}

		getElements(){
			return this.tab;
		}
	}
}

function getDistance ( x1, y1, x2, y2 ){ //Distance entre 2 sprite (x1,y1) et (x2,y2)
  var dx = x1 - x2
  var dy = y1 - y2
  return Math.sqrt ( dx * dx + dy * dy )
}

function shuffleArray(a) { //O(n) on se met bien
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}