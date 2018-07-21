var game;
function launch(){
  game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });
}

function preload() {
  game.load.spritesheet('button', 'assets/button.png', 100, 100, 2);
  game.load.spritesheet('slider', 'assets/slider.png', 100, 100, 2);
  game.load.spritesheet('midSlider', 'assets/midslider-anim.png', 50, 50, 8);
  game.load.spritesheet('fleches', 'assets/fleches.png', 200, 100,3);
  game.load.image('spiral','assets/kawaii-spiral.png');
}

var CurrentObject;
var CurrentCompleted = true;

function create() {
  game.stage.backgroundColor = "#ffffff";
}

function update() {
  //console.log(this.input.activePointer.x, this.input.activePointer.y);
    if(CurrentCompleted) {
      CurrentObject = generateNewObject(); // pour l'instant on genere en continue tant qu'on fait pas de fonction server qui renvoi un tableau de tous les types un a un
      CurrentCompleted = false;
    }
    else {
      CurrentObject = checkCurrentComplete(CurrentObject);
      if(CurrentObject.Completed==true) {
        CurrentObject = null;
        CurrentCompleted = true;
      }
    }
}

