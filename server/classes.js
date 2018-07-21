var randomstring = require("randomstring");

var nbElements = 3;


module.exports = {

	level : class{

		constructor(levelLength){
			this.tab = [];


			for(var i=0; i<levelLength; i++){
				this.tab.push([randomstring.generate(7), this.generateElement()]);
			}
		}

		generateElement(){
			return Math.floor(Math.random()*nbElements) + 1;
		}

		getElements(){
			return this.tab;
		}
	}
}