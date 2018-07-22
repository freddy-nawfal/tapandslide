var game;


function launch(){
  game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
  

  Level = {
    levelElements: [],
    ready: false,
    elementIndex: 0,
  };

}

var Level = {
  levelElements: [],
  ready: false,
  elementIndex: 0,
};

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
  if(Level.ready && updateLevel()) {
    Level.ready = false;
    
    mainMenu();
  }
}

function getLevel(data){
  Level.levelElements = data;
  Level.ready = true;
  console.log(Level.levelElements.length);
}

function updateLevel(){
  if(Level.ready && Level.elementIndex < Level.levelElements.length){
    if(CurrentCompleted) {
      CurrentObject = generateNewObject(Level.levelElements[Level.elementIndex][1].type, Level.levelElements[Level.elementIndex][1].pos, Level.levelElements[Level.elementIndex][0]); // pour l'instant on genere en continue tant qu'on fait pas de fonction server qui renvoi un tableau de tous les types un a un
      CurrentCompleted = false;
    }
    else {
      CurrentObject = checkCurrentComplete(CurrentObject);
      if(CurrentObject.Completed==true) {
        CurrentObject = null;
        CurrentCompleted = true;
        Level.elementIndex++;
      }
    } 
  }
  else if(Level.elementIndex >= Level.levelElements.length) return true;
  return false;
}