var randomstring = require("randomstring");

var nbElements = 3;

var TypeObject = {
  BUTTON: 1,
  SLIDER: 2,
  SPIRAL: 3,
};

module.exports = {

	level : class{

		constructor(levelLength){
			this.tab = [];

			for(var i=0; i<levelLength; i++){
				this.tab.push([randomstring.generate(7), this.generateElement()]);
			}
		}

		generateElement(){
			var type = Math.floor(Math.random()*nbElements) + 1;
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
				while(getDistance(X=Math.floor(Math.random()*99) + 1, Y=Math.floor(Math.random()*99) + 1, pos.middle.start.x, pos.middle.start.y) < minDistancePercent) continue;
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