var game;

var sideMenuHeight = (window.innerHeight * 0.05)
var actualHeight = window.innerHeight;

var Level = {
  mode: null,
  levelElements: [],
  ready: false,
  elementIndex: 0,
  myProgression: 0,
  enemyProgression: 0,
  currentCompleted: true
};

function launch(mode,level){
  Level = {
    mode: mode,
    levelElements:level,
    ready: true,
    elementIndex: 0,
    myProgression: 0,
    enemyProgression: 0,
    currentCompleted: true
  };

  game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
  
  $("#sideMenu").show();
}

function preload() {
  game.load.spritesheet('button', 'assets/button.png', 100, 100, 2);
  game.load.spritesheet('slider', 'assets/slider.png', 100, 100, 2);
  game.load.spritesheet('midSlider', 'assets/midslider-anim.png', 50, 50, 8);
  game.load.spritesheet('fleches', 'assets/fleches.png', 200, 100,3);
  game.load.image('spiral','assets/kawaii-spiral.png');
  console.log(game.load.progress);
}

var CurrentObject;
var MyProgression;
var EnemyProgression;

function create() {
  game.stage.backgroundColor = "#ffffff";

  if(Level.mode == "ranked"){
    MyProgression = game.add.text(10, sideMenuHeight+10, "ME: "+Level.myProgression+"%");
    EnemyProgression = game.add.text(window.innerWidth-100, sideMenuHeight+10, "ENEMY: "+Level.enemyProgression+"%");

    MyProgression.fontSize = 15;
    EnemyProgression.fontSize = 15;
  }
  else if(Level.mode == "practice"){
    MyProgression = game.add.text(window.innerWidth-155, 10, "PROGRESSION: "+Level.myProgression+"%");
    MyProgression.fontSize = 15;
  }
  
}

function update() {
  if(game){
    if(Level.ready && updateLevel(Level.mode)) {
      //fin de la partie si on rentre ici
      if(Level.mode == "ranked"){
        //on envoie au serveur le gagnant etc...
      }
      else if(Level.mode == "practice"){
        //on sauvegarde localement si meilleur resultat
      }
      Level.ready = false;
      mainMenu();
    }

    if(Level.mode == "ranked"){
      MyProgression.setText("ME: "+Level.myProgression+"%");
      EnemyProgression.setText("ENEMY: "+Level.enemyProgression+"%"); 
      p1.progress = Level.myProgression/100;
      p2.progress = Level.enemyProgression/100;  
    }
    else if(Level.mode == "practice"){
      MyProgression.setText("PROGRESSION: "+Math.round((Level.elementIndex/Level.levelElements.length)*100)+"%");
    }

  }
}

function updateLevel(mode){
  if(Level.ready && Level.elementIndex < Level.levelElements.length){
    if(Level.currentCompleted) {
      CurrentObject = generateNewObject(Level.levelElements[Level.elementIndex][1].type, Level.levelElements[Level.elementIndex][1].pos, Level.levelElements[Level.elementIndex][0]); // pour l'instant on genere en continue tant qu'on fait pas de fonction server qui renvoi un tableau de tous les types un a un
      Level.currentCompleted = false;
    }
    else {
      CurrentObject = checkCurrentComplete(CurrentObject);
      if(CurrentObject.Completed==true) {
        if(mode == "ranked") updateRanked();
        else if(mode == "practice") updatePractice();
        CurrentObject = null;
        Level.currentCompleted = true;
        Level.elementIndex++;
      }
    } 
  }
  else if(Level.elementIndex >= Level.levelElements.length) return true;
  return false;
}

function updateRanked(){
  var id = CurrentObject.id;

  gameHandlers.out.elementFinished(id);
}

function updatePractice(){
  //ici barre de progression locale
}