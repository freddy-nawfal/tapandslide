var game;

//var sideMenuHeight = (window.innerHeight * 0.05)
var actualHeight;
var widthReference = 540;
var ourSpriteScale = 1/6; //(nos sprites 600*600) donc on veut que par rapport a la ref on est 100px
var userScale;

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
  actualHeight = document.getElementById('game').offsetHeight;
  $("#menuTop").show();
  game = new Phaser.Game(window.innerWidth, actualHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
  userScale = window.innerWidth/widthReference;
}

function preload() {
  game.load.image('background', 'assets/background-game.png');
  game.load.image('button', 'assets/button-normal.png');
  game.load.image('slider', 'assets/slider-normal.png');
  game.load.image('midSlider', 'assets/mid-slider-normal.png');
  game.load.spritesheet('fleches', 'assets/fleches.png', 200, 100,3);
  game.load.image('spiral','assets/spiral-normal.png');
  console.log(game.load.progress);
}

var CurrentObject;
var MyProgression;
var EnemyProgression;

function create() {
  var background = game.add.sprite(window.innerWidth/2,actualHeight/2,'background');
  background.anchor.setTo(0.5,0.5);
  background.scale.setTo(window.innerWidth/game.cache.getImage('background').width);

  game.input.enabled=false;
  startTimer(3, $("#beginTimer"), function(){
    game.input.enabled=true;
    $("#beginTimer").hide();
  });

  if(Level.mode == "ranked"){
  }
  else if(Level.mode == "practice"){
    //MyProgression = game.add.text(window.innerWidth-155, 10, "PROGRESSION: "+Level.myProgression+"%");
    //MyProgression.fontSize = 15;
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
      
    }
    else if(Level.mode == "practice"){
      //MyProgression.setText("PROGRESSION: "+Math.round((Level.elementIndex/Level.levelElements.length)*100)+"%");
      player1Bar.animate((Level.elementIndex/Level.levelElements.length));
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