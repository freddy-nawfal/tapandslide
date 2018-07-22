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
			//var type = Math.floor(Math.random()*nbElements) + 1;
			var type = 1;
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
			}

			return {type: type, pos: pos};
		}

		getElements(){
			return this.tab;
		}
	}
}