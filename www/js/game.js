var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });



function preload() {
  game.load.spritesheet('button', 'assets/button.png', 100, 100, 2);
}

var button;

function create() {

  game.stage.backgroundColor = "#ffffff";

  button = game.add.button(game.world.centerX, game.world.centerY, 'button', actionOnClick, this, 0, 0, 0);


  button.x = getRandomPos(window.innerWidth - 100)
  button.y = getRandomPos(window.innerHeight - 100);
  button.input.pixelPerfectOver = true;

}

function update() {
    
}


function actionOnClick () {
  //  Manually changing the frames of the button, i.e, how it will look when you play with it
  button.setFrames(0, 0, 1);


  button.x = getRandomPos(window.innerWidth - 100)
  button.y = getRandomPos(window.innerHeight - 100);

}



function getRandomPos(max) {
  return Math.floor(Math.random() * (max + 1)); 
}