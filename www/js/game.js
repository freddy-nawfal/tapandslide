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
    currentCompleted: true,
    gameEnded:false
  };
  actualHeight = document.getElementById('game').offsetHeight;

  $("#menuTop").show();
  if(mode=="practice"){
    $('#player2ProgressBar').hide();
  }
  else if(mode=="ranked"){
    $('#player2ProgressBar').show();
  }
  game = new Phaser.Game(window.innerWidth, actualHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update },true);
  userScale = window.innerWidth/widthReference;
}

function preload() {
  //game.load.image('background', 'assets/background-game.png');
  game.load.image('button', 'assets/button-normal.png');
  game.load.image('slider', 'assets/slider-normal.png');
  game.load.image('midSlider', 'assets/mid-slider-normal.png');
  game.load.spritesheet('fleches', 'assets/fleches-anim.png', 600, 300,11);
  game.load.image('spiral','assets/spiral-normal.png');
  game.load.image('particleButton','assets/particleButton.png');
  game.load.image('particleSlider','assets/particleSlider.png');
  game.load.image('particleSpiral','assets/particleSpiral.png');
}

var CurrentObject;
var MyProgression;
var EnemyProgression;
var style = {font: "Lato", fill: "#000000"};
var emitterButton; var emitterSlider; var emitterSpiral; var emitterFinish;

function create() {
  /*var background = game.add.sprite(window.innerWidth/2,actualHeight/2,'background');
  background.anchor.setTo(0.5,0.5);
  background.scale.setTo(window.innerWidth/game.cache.getImage('background').width);*/
  createEmitters();

  game.input.enabled=false;
  $("#beginTimer").html('');
  $("#beginTimer").show();

  if(Level.mode == "ranked"){
    startTimer(3, $("#beginTimer"), function(){
      gameHandlers.out.bothTimerGo();
    });
  }
  else if(Level.mode == "practice"){
    startTimer(3, $("#beginTimer"), function(){
      $('#beginTimer').html('GO!');
      game.input.enabled=true;
      setTimeout(function(){
        $('#beginTimer').hide();
      },2000);
    });
  }
  
}

function update() {
  if(game){
    if(Level.ready && updateLevel(Level.mode) && Level.gameEnded) {
      //fin de la partie si on rentre ici
      if(Level.mode == "ranked"){
        //on envoie au serveur le gagnant etc...
        if(Level.elementIndex >= Level.levelElements.length && Level.winner == myID){
          var text = game.add.text(window.innerWidth/2,actualHeight/2,"WINNER", style);
          text.anchor.setTo(0.5,0.5);
          text.fontSize = 50;
        }
        else{
          var text = game.add.text(window.innerWidth/2,actualHeight/2,"LOSER", style);
          text.anchor.setTo(0.5,0.5);
          text.fontSize = 50;
        }
      }
      else if(Level.mode == "practice"){
        var text = game.add.text(window.innerWidth/2,actualHeight/2,"FINISH", style);
        text.anchor.setTo(0.5,0.5);
        text.fontSize = 50;
      }
      emitEndParticle();
      emitterFinish.forEachAlive(function(p){   p.alpha= p.lifespan / emitterFinish.lifespan; });
    }
    // ici parti pas encore fini, pour les trucs autre
    if(Level.mode == "ranked"){
      
    }
    else if(Level.mode == "practice"){

    }
    emitterButton.forEachAlive(function(p){   p.alpha= p.lifespan / emitterButton.lifespan; });
    emitterSlider.forEachAlive(function(p){   p.alpha= p.lifespan / emitterSlider.lifespan; });
    emitterSpiral.forEachAlive(function(p){   p.alpha= p.lifespan / emitterSpiral.lifespan; });
  }
}

function updateLevel(mode){
  if(!Level.gameEnded){
    if(Level.ready && Level.elementIndex < Level.levelElements.length){
      if(Level.currentCompleted) {
        CurrentObject = generateNewObject(Level.levelElements[Level.elementIndex][1].type, Level.levelElements[Level.elementIndex][1].pos, Level.levelElements[Level.elementIndex][0]); // pour l'instant on genere en continue tant qu'on fait pas de fonction server qui renvoi un tableau de tous les types un a un
        Level.currentCompleted = false;
      }
      else {
        CurrentObject = checkCurrentComplete(CurrentObject);
        if(CurrentObject.Completed==true) {
          particleEmit(CurrentObject);
          Level.currentCompleted = true;
          Level.elementIndex++;
          if(mode == "ranked") updateRanked();
          else if(mode == "practice") updatePractice();
          CurrentObject = null;
        }
      } 
    }
    else if(Level.elementIndex >= Level.levelElements.length) return true;
    return false;
  }
  return true;
}

function updateRanked(){
  var id = CurrentObject.id;
  gameHandlers.out.elementFinished(id);
}

function updatePractice(){
  player1Bar.animate((Level.elementIndex/Level.levelElements.length));
  if(Level.elementIndex >= Level.levelElements.length){ //ici tu viens de finir dans cette update
    Level.gameEnded = true;
    retourMenu(5000);
  }
}