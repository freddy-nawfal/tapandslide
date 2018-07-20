var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
  game.load.spritesheet('button', 'assets/button.png', 100, 100, 2);
  game.load.spritesheet('slider', 'assets/slider.png', 100, 100, 2);
  game.load.spritesheet('midSlider', 'assets/midslider-anim.png', 50, 50, 8);
  game.load.spritesheet('fleches', 'assets/fleches.png', 200, 100,3);
}

var TypeObject = {
  BUTTON: 1,
  SLIDER: 2,
};
var CurrentObject = { //objet qui gere notre current
  Type: null,
  Object: null,
  Completed: true,
  isClicked: false,
  PointSlider: null,
  SliderMidPoint: false,
  Fleches:null,
  objectWidth: null,
  pointWidth: null,
};
var minDistanceSlider = 250; //en fonction de nos sprites, distance min entre le slider et le point (à mettre coté server et a recuperer)

function create() {
  game.stage.backgroundColor = "#ffffff";
  CurrentObject.objectWidth = game.cache.getFrameByIndex('button',1).width/2;
  CurrentObject.pointWidth = game.cache.getFrameByIndex('midSlider',1).width/2;
}

function update() {
    if(CurrentObject.Completed) {
      generateNewObject(); // pour l'instant on genere en continue tant qu'on fait pas de fonction server qui renvoi un tableau de tous les types un a un
    }
    else {
      checkCurrent();
    }
}

function generateNewObject(){ //Fonction qui génère un nouvelle objet aléatoire - Pour le multi on lui passera un tableau en param, puis on genere l'objet en fonction de ca 
  console.log("generation nouvel objet");
  CurrentObject.Completed = false;
  CurrentObject.Type = Math.floor(Math.random() * 2) + 1 ;
  if(CurrentObject.Type == TypeObject.BUTTON){
    CurrentObject.Object = game.add.button(getRandomPos(CurrentObject.objectWidth,window.innerWidth - CurrentObject.objectWidth),
                                           getRandomPos(CurrentObject.objectWidth,window.innerHeight - CurrentObject.objectWidth),
                                           'button', clickButton, this, 0, 0, 0);
  }
  else if(CurrentObject.Type == TypeObject.SLIDER){
    //object
    CurrentObject.Object = game.add.button(getRandomPos(CurrentObject.objectWidth,window.innerWidth - CurrentObject.objectWidth),
                                           getRandomPos(CurrentObject.objectWidth,window.innerHeight - CurrentObject.objectWidth),
                                           'slider', clickButton, this, 0, 0, 0);
    CurrentObject.Object.input.enableDrag();

    //point
    CurrentObject.PointSlider = game.add.sprite(getRandomPos(CurrentObject.pointWidth,window.innerWidth - CurrentObject.objectWidth),
                                                getRandomPos(CurrentObject.pointWidth,window.innerHeight - CurrentObject.objectWidth),
                                                'midSlider');
    while(getDistance(CurrentObject.Object.x,CurrentObject.Object.y,
        CurrentObject.PointSlider.x = getRandomPos(CurrentObject.pointWidth,window.innerWidth - CurrentObject.objectWidth),
        CurrentObject.PointSlider.y = getRandomPos(CurrentObject.pointWidth,window.innerHeight - CurrentObject.objectWidth)) < minDistanceSlider) continue;
    CurrentObject.PointSlider.anchor.setTo(0.5, 0.5);
    var blink = CurrentObject.PointSlider.animations.add('blink');
    blink.enableUpdate = true;
    CurrentObject.PointSlider.animations.play('blink', 15, true);

    //fleches
    var flechesPos = getMiddle(CurrentObject.Object.x,CurrentObject.Object.y,CurrentObject.PointSlider.x,CurrentObject.PointSlider.y);
    CurrentObject.Fleches = game.add.sprite(flechesPos[0],flechesPos[1],'fleches');
    var flechesAnim = CurrentObject.Fleches.animations.add('flechesAnim');
    flechesAnim.enableUpdate = true;
    CurrentObject.Fleches.animations.play('flechesAnim',5,true);
    CurrentObject.Fleches.anchor.setTo(0.5, 0.5);
    CurrentObject.Fleches.angle = Math.atan2(CurrentObject.PointSlider.y - CurrentObject.Object.y, CurrentObject.PointSlider.x - CurrentObject.Object.x) * 180 / Math.PI;
  }
  //Commun au bouton et slider object
  CurrentObject.Object.setFrames(0, 0, 1);
  CurrentObject.Object.input.pixelPerfectOver = true;
  CurrentObject.Object.anchor.setTo(0.5, 0.5);
}

function clickButton(){ //Fonction qui s'execute a l'appuie sur le bouton
  CurrentObject.isClicked = true;
}

function clickSlider(){ //Fonction qui s'execute a l'appuie sur le slider
  CurrentObject.Object.input.isDragged = true;
}

function checkCurrent() { //fonction qui check l'état courant de notre objet
  if(CurrentObject.Type == TypeObject.BUTTON){ // si BOUTON
    if (CurrentObject.isClicked) {
      CurrentObject.Completed = true;
      CurrentObject.isClicked = false;
      CurrentObject.Object.destroy();
    }
  }
  else if(CurrentObject.Type == TypeObject.SLIDER){ // si SLIDER
    //SLIDER reste dans les limites de la carte en cas de drag
    if(CurrentObject.Object.x<CurrentObject.objectWidth) CurrentObject.Object.x = CurrentObject.objectWidth;
    if(CurrentObject.Object.x>window.innerWidth-CurrentObject.objectWidth) CurrentObject.Object.x = window.innerWidth-CurrentObject.objectWidth;
    if(CurrentObject.Object.y<CurrentObject.objectWidth) CurrentObject.Object.y = CurrentObject.objectWidth;
    if(CurrentObject.Object.y>window.innerHeight-CurrentObject.objectWidth) CurrentObject.Object.y = window.innerHeight-CurrentObject.objectWidth;

    //GERE LA FLECHE
    if(getDistance(CurrentObject.Object.x,CurrentObject.Object.y,CurrentObject.PointSlider.x,CurrentObject.PointSlider.y)>minDistanceSlider){
      CurrentObject.Fleches.visible = true;
      var newFlechesPos = getMiddle(CurrentObject.Object.x,CurrentObject.Object.y,CurrentObject.PointSlider.x,CurrentObject.PointSlider.y);
      CurrentObject.Fleches.x = newFlechesPos[0];
      CurrentObject.Fleches.y = newFlechesPos[1];
      CurrentObject.Fleches.angle = Math.atan2(CurrentObject.PointSlider.y - CurrentObject.Object.y, CurrentObject.PointSlider.x - CurrentObject.Object.x) * 180 / Math.PI;
    }
    else{
      CurrentObject.Fleches.visible = false;
    }

    // GERE LE POINT SLIDER
    if(checkOverlap(CurrentObject.Object,CurrentObject.PointSlider) && checkSliderDistance()){
      if(!CurrentObject.SliderMidPoint){ // slider - mid point - changement pos du pointSLider vers end point
        CurrentObject.SliderMidPoint = true;
        while(getDistance(CurrentObject.Object.x,CurrentObject.Object.y,
        CurrentObject.PointSlider.x = getRandomPos(CurrentObject.pointWidth,window.innerWidth - CurrentObject.objectWidth),
        CurrentObject.PointSlider.y = getRandomPos(CurrentObject.pointWidth,window.innerHeight - CurrentObject.objectWidth)) < minDistanceSlider) continue;
      }
      else{ // fin du slider - endpoint
        if(CurrentObject.Object.input.isDragged){
          CurrentObject.Object.input.isDragged = false;
        }
        CurrentObject.SliderMidPoint = false;
        CurrentObject.Completed = true;
        CurrentObject.PointSlider.destroy();
        CurrentObject.Object.destroy();
        CurrentObject.Fleches.destroy();
      }
    }
  }
}

function getRandomPos(min,max) { //Nombre entier random entre min et max inclus
  return Math.floor(Math.random()*(max-min+1)+min);
}

function checkOverlap(spriteA, spriteB) { //Verifie l'overlap entre 2 sprite (box2d quoi)
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function checkSliderDistance(){ //Verifie la distance entre le slider et le point pour la collision (utilisation de cercle)
  var distance = getDistance(CurrentObject.Object.x,CurrentObject.Object.y,CurrentObject.PointSlider.x,CurrentObject.PointSlider.y);
  if(distance <= CurrentObject.objectWidth+CurrentObject.pointWidth) return true;
  return false;
}

function getDistance ( x1, y1, x2, y2 ){ //Distance en pixel entre 2 sprite (x1,y1) et (x2,y2)
  var dx = x1 - x2
  var dy = y1 - y2
  return Math.sqrt ( dx * dx + dy * dy )
}

function getMiddle(x1,y1,x2,y2){ //Milieu de 2 points passer en parametre
  return [Math.floor((x1+x2)/2),Math.floor((y1+y2)/2)];
}