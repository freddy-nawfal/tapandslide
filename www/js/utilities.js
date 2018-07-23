var TypeObject = {
  BUTTON: 1,
  SLIDER: 2,
  SPIRAL: 3,
  nbType: 3,
  percentage: {
    button: 0.7,
    slider: 0.25,
    spiral: 0.05
  }
};
var Side = {
  RIGHT: 1,
  LEFT: 2,
};

function generateButton(pos){
  var NewObj = {
      Type: TypeObject.BUTTON,
      Object: null,
      Completed: false,
      isClicked: false,
      objectWidth: game.cache.getFrameByIndex('button',1).width/2,
    };
    var x = (pos.button.x / 100) * window.innerWidth;
    var y = (pos.button.y / 100) * window.innerHeight;
    if(x < NewObj.objectWidth)                      x = NewObj.objectWidth;
    if(x > window.innerWidth-NewObj.objectWidth)    x = window.innerWidth-NewObj.objectWidth;
    if(y < NewObj.objectWidth)                      y = NewObj.objectWidth;
    if(y > window.innerHeight-NewObj.objectWidth)   y = window.innerHeight-NewObj.objectWidth;


    NewObj.Object = game.add.button(x, y, 'button', clickButton, this, 0, 0, 0);
    NewObj.Object.setFrames(0, 0, 1);
    NewObj.Object.input.pixelPerfectOver = true;
    NewObj.Object.anchor.setTo(0.5, 0.5);
    return NewObj;
}

function generateSlider(pos){
  var NewObj = {
      Type: TypeObject.SLIDER,
      Object: null,
      Completed: false,
      PointSlider: null,
      SliderMidPoint: false,
      endPos: null,
      Fleches:null,
      objectWidth: game.cache.getFrameByIndex('slider',1).width/2,
      pointWidth: game.cache.getFrameByIndex('midSlider',1).width/2,
      minDistanceFleche: null
    };

    //object
    var x = (pos.slider.start.x / 100) * window.innerWidth;
    var y = (pos.slider.start.y / 100) * window.innerHeight;
    if(x < NewObj.objectWidth)                      x = NewObj.objectWidth;
    if(x > window.innerWidth-NewObj.objectWidth)    x = window.innerWidth-NewObj.objectWidth;
    if(y < NewObj.objectWidth)                      y = NewObj.objectWidth;
    if(y > window.innerHeight-NewObj.objectWidth)   y = window.innerHeight-NewObj.objectWidth;
    NewObj.Object = game.add.button(x, y, 'slider', clickSlider, this, 0, 0, 0)
    NewObj.Object.input.enableDrag();
    NewObj.Object.setFrames(0, 0, 1);
    NewObj.Object.input.pixelPerfectOver = true;
    NewObj.Object.anchor.setTo(0.5, 0.5);

    //point
    x = (pos.slider.middle.x / 100) * window.innerWidth;
    y = (pos.slider.middle.y / 100) * window.innerHeight;
    if(x < NewObj.pointWidth)                      x = NewObj.pointWidth;
    if(x > window.innerWidth-NewObj.pointWidth)    x = window.innerWidth-NewObj.pointWidth;
    if(y < NewObj.pointWidth)                      y = NewObj.pointWidth;
    if(y > window.innerHeight-NewObj.pointWidth)   y = window.innerHeight-NewObj.pointWidth;
    NewObj.PointSlider = game.add.sprite(x, y, 'midSlider');
    NewObj.PointSlider.anchor.setTo(0.5, 0.5);
    var blink = NewObj.PointSlider.animations.add('blink');
    blink.enableUpdate = true;
    NewObj.PointSlider.animations.play('blink', 15, true);

    x = (pos.slider.end.x / 100) * window.innerWidth;
    y = (pos.slider.end.y / 100) * window.innerHeight;
    if(x < NewObj.pointWidth)                      x = NewObj.pointWidth;
    if(x > window.innerWidth-NewObj.pointWidth)    x = window.innerWidth-NewObj.pointWidth;
    if(y < NewObj.pointWidth)                      y = NewObj.pointWidth;
    if(y > window.innerHeight-NewObj.pointWidth)   y = window.innerHeight-NewObj.pointWidth;
    NewObj.endPos = {
      endX: x,
      endY: y
    };

    //fleches
    var flechesPos = getMiddle(NewObj.Object.x,NewObj.Object.y,NewObj.PointSlider.x,NewObj.PointSlider.y);
    NewObj.Fleches = game.add.sprite(flechesPos[0],flechesPos[1],'fleches');
    var flechesAnim = NewObj.Fleches.animations.add('flechesAnim');
    flechesAnim.enableUpdate = true;
    NewObj.Fleches.animations.play('flechesAnim',5,true);
    NewObj.Fleches.anchor.setTo(0.5, 0.5);
    NewObj.Fleches.angle = Math.atan2(NewObj.PointSlider.y - NewObj.Object.y, NewObj.PointSlider.x - NewObj.Object.x) * 180 / Math.PI;
    NewObj.minDistanceFleche = game.cache.getFrameByIndex('fleches',1).width + NewObj.objectWidth/2 + NewObj.pointWidth/2;
    return NewObj;
}

function generateSpiral(){
  var NewObj = {
      Type: TypeObject.SPIRAL,
      Object: null,
      Completed: false,
      isClicked: false,
      spiralScore:0,
      spiralScoreMax: 360*4,
      spiralScaleMin:0.4,
      spiralScaleMax:0.9,
      spiralSide:null,
      spiralDistance: null,
      previousPointerAngle:null,
    };
    NewObj.spiralDistance = NewObj.spiralScaleMin*20;
    NewObj.Object = game.add.sprite(window.innerWidth/2,window.innerHeight/2,'spiral');
    NewObj.Object.anchor.setTo(0.5,0.5);
    NewObj.Object.inputEnabled=true;
    NewObj.Object.scale.setTo(NewObj.spiralScaleMin);
    NewObj.Object.events.onInputDown.add(clickSpiral,this);
    NewObj.Object.events.onInputUp.add(releaseSpiral,this);
    return NewObj;
}

function generateNewObject(type, pos, id){ //Fonction qui génère un nouvelle objet aléatoire - Pour le multi on lui passera un tableau en param, puis on genere l'objet en fonction de ca 
  var NewObject;
  if(type == TypeObject.BUTTON){//BOUTON
    NewObject = generateButton(pos);
  }
  else if(type == TypeObject.SLIDER){//SLIDER
    NewObject = generateSlider(pos);
  }
  else if(type == TypeObject.SPIRAL){//SPIRAL
    NewObject = generateSpiral();
  }
  NewObject.id = id;
  return NewObject;
}

function clickButton(){ //Fonction qui s'execute a l'appuie sur le bouton
  CurrentObject.isClicked = true;
}

function clickSlider(){ //Fonction qui s'execute a l'appuie sur le slider
  CurrentObject.Object.input.isDragged = true;
}

function clickSpiral(){
  CurrentObject.isClicked = true;
}
function releaseSpiral(){
  CurrentObject.isClicked = false;
}

function checkButton(obj){
  if (obj.isClicked) {
    obj.Completed = true;
    obj.isClicked = false;
    obj.Object.destroy();
  }
  return obj;
}

function checkSlider(obj){
  //SLIDER reste dans les limites de la carte en cas de drag
  if(obj.Object.x<obj.objectWidth) obj.Object.x = obj.objectWidth;
  if(obj.Object.x>window.innerWidth-obj.objectWidth) obj.Object.x = window.innerWidth-obj.objectWidth;
  if(obj.Object.y<obj.objectWidth) obj.Object.y = obj.objectWidth;
  if(obj.Object.y>window.innerHeight-obj.objectWidth) obj.Object.y = window.innerHeight-obj.objectWidth;

  //GERE LA FLECHE
  if(getDistance(obj.Object.x,obj.Object.y,obj.PointSlider.x,obj.PointSlider.y)>obj.minDistanceFleche){
    obj.Fleches.visible = true;
    var newFlechesPos = getMiddle(obj.Object.x,obj.Object.y,obj.PointSlider.x,obj.PointSlider.y);
    obj.Fleches.x = newFlechesPos[0];
    obj.Fleches.y = newFlechesPos[1];
    obj.Fleches.angle = Math.atan2(obj.PointSlider.y - obj.Object.y, obj.PointSlider.x - obj.Object.x) * 180 / Math.PI;
  }
  else{
    obj.Fleches.visible = false;
  }

  // GERE LE POINT SLIDER
  if(checkOverlap(obj.Object,obj.PointSlider) && checkSliderDistance(obj)){
    if(!obj.SliderMidPoint){ // slider - mid point - changement pos du pointSLider vers end point
      obj.SliderMidPoint = true;
      obj.PointSlider.x = obj.endPos.endX;
      obj.PointSlider.y = obj.endPos.endY;
    }
    else{ // fin du slider - endpoint
      if(obj.Object.input.isDragged){
        obj.Object.input.isDragged = false;
      }
      obj.SliderMidPoint = false;
      obj.Completed = true;
      obj.PointSlider.destroy();
      obj.Object.destroy();
      obj.Fleches.destroy();
    }
  }
  return obj;
}

function checkSpiral(obj){
  //angle entre milieu et souris
  var pointerAngle = (Math.atan2(game.input.activePointer.y - obj.Object.y, game.input.activePointer.x - obj.Object.x) * 180 / Math.PI)+180;
  //safe zone 20 % interieur
  obj.spiralDistance = obj.Object.scale.x*20;
  //si il clique et qu'il est pas dans la safe zone
  if(obj.isClicked && getDistance(obj.Object.x,obj.Object.y,game.input.activePointer.x,game.input.activePointer.y)>obj.spiralDistance){
    //on initialise le previousPointer si ce n'est pas fait
    if(obj.previousPointerAngle == null)
      obj.previousPointerAngle = pointerAngle;
    //si prevPointer initialise, alors tu test la diff par rapport a l'actuel
    else{
      //premier mouvement decide s'il va tourner a droite ou a gauche (ou dans cas ou il decide de changer de sens, ca se reinitialise au score=0)
      if(obj.spiralScore==0){
        if(obj.previousPointerAngle < pointerAngle && Math.abs(obj.previousPointerAngle-pointerAngle)<300){
          obj.spiralSide = Side.RIGHT;
        }else if(obj.previousPointerAngle > pointerAngle && Math.abs(obj.previousPointerAngle-pointerAngle)<300){
          obj.spiralSide = Side.LEFT;
        }
        obj.spiralScore++; //pour pas rentrer dans ce if en continue
      }
      //ICI TEST DE LA DIFF DES ANGLES PREV ET ACTUEL
      if(obj.spiralScore>0){
        var diffAngle = Math.abs(obj.previousPointerAngle-pointerAngle);
        if(obj.spiralSide==Side.RIGHT){//vers la droite
          if(obj.previousPointerAngle < pointerAngle){
            if(diffAngle>180){ //gère la rotation et les tricheurs xD
              //droite tourne mauvais sens passage de 0 a 360
              obj.spiralScore -= (360-pointerAngle)+obj.previousPointerAngle;
              obj.Object.angle -= (360-pointerAngle)+obj.previousPointerAngle;
            }else{ //droite bon sens tous les cas
              obj.spiralScore += diffAngle;
              obj.Object.angle += diffAngle;
            }
          }
          else{
            if(diffAngle>180){ //gère la rotation et les tricheurs xD
              //droite bon sens passage de 360 a 0
              obj.spiralScore += (360-obj.previousPointerAngle)+pointerAngle;
              obj.Object.angle += (360-obj.previousPointerAngle)+pointerAngle;
            }else{//droite tourne mauvais sens tous les cas
              obj.spiralScore -= diffAngle;
              obj.Object.angle -= diffAngle;
            }
          }
        }
        else{
          if(obj.previousPointerAngle > pointerAngle){ //bon sens
            if(diffAngle>180){ //gère la rotation et les tricheurs xD
              //gauche tourne mauvais sens passage de 360 a 0
              obj.spiralScore -= (360-obj.previousPointerAngle)+pointerAngle;
              obj.Object.angle += (360-obj.previousPointerAngle)+pointerAngle;
            }else{ //gauche bon sens tous les cas
              obj.spiralScore += diffAngle;
              obj.Object.angle -= diffAngle;
            }
          }
          else{ //mauvais sens
            if(diffAngle>180){ //gère la rotation et les tricheurs xD
              //gauche bon sens passage de 0 a 360
              obj.spiralScore += (360-pointerAngle)+obj.previousPointerAngle;
              obj.Object.angle -= (360-obj.previousPointerAngle)+pointerAngle;
            }else{ //gauche tourne mauvais sens tous les cas
              obj.spiralScore -= diffAngle;
              obj.Object.angle += diffAngle;
            }
          }
        }
      }
      //pointer actuel devient l'ancien
      obj.previousPointerAngle = pointerAngle;
      if(obj.spiralScore<0) obj.spiralScore = 0;
    }
    //on verifie s'il a fini la spiral
    if(obj.spiralScore>=obj.spiralScoreMax){
      obj.Completed = true;
      obj.isClicked = false;
      obj.spiralScore = 0;
      obj.spiralSide = null;
      obj.previousPointerAngle = null;
      obj.Object.destroy();
    }
  }
  //s'il ne clique pas ou qu'il est dans la safe zone, on diminue le score progressivement jusqu'a 0 et reinitialise le previousPointer
  else {
    obj.previousPointerAngle = null;
    if(obj.spiralScore>0){
      obj.spiralScore-=2;
      if(obj.spiralSide ==Side.RIGHT)
        obj.Object.angle -= 2;
      else obj.Object.angle += 2;
      if(obj.spiralScore<0) obj.spiralScore = 0;
    }
  }
  //on change le scale en fonction de son score
  var diff = obj.spiralScaleMax - obj.spiralScaleMin;
  var newScale = obj.spiralScaleMin+(obj.spiralScaleMax - obj.spiralScaleMin)*(obj.spiralScore / obj.spiralScoreMax);
  obj.Object.scale.setTo(newScale);

  return obj;
}


function checkCurrentComplete(obj) { //fonction qui check l'état courant de notre objet
  var newObj;
  if(obj.Type == TypeObject.BUTTON){ // si BOUTON
    newObj = checkButton(obj);
  }
  else if(obj.Type == TypeObject.SLIDER){ // si SLIDER
    newObj = checkSlider(obj)
  }
  else if (obj.Type == TypeObject.SPIRAL){//SPIRAL
    newObj = checkSpiral(obj);
  }  
  return newObj;
}

function checkOverlap(spriteA, spriteB) { //Verifie l'overlap entre 2 sprite (box2d quoi)
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function checkSliderDistance(obj){ //Verifie la distance entre le slider et le point pour la collision (utilisation de cercle)
  var distance = getDistance(obj.Object.x,obj.Object.y,obj.PointSlider.x,obj.PointSlider.y);
  if(distance <= obj.objectWidth+obj.pointWidth) return true;
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

function generatePracticeLevel(size){
  var tab = [];
  var nbButton = Math.floor(TypeObject.percentage.button * size);
  var nbSlider = Math.floor(TypeObject.percentage.slider * size);
  var nbSpiral = Math.floor(TypeObject.percentage.spiral * size);
  if((nbButton + nbSlider + nbSpiral)<size) nbButton += size - (nbButton + nbSlider + nbSpiral);

  for(var i=0; i<nbButton; i++){
    tab.push(["practice", generatePracticeElement(TypeObject.BUTTON)]);
  }
  for(var i=0; i<nbSlider; i++){
    tab.push(["practice", generatePracticeElement(TypeObject.SLIDER)]);
  }
  for(var i=0; i<nbSpiral; i++){
    tab.push(["practice", generatePracticeElement(TypeObject.SPIRAL)]);
  }
  return shuffleArray(tab);
}

function generatePracticeElement(type){
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
    while(getDistance(X=Math.floor(Math.random()*99) + 1, Y=Math.floor(Math.random()*99) + 1, pos.slider.middle.x, pos.slider.middle.y) < minDistancePercent) continue;
      pos.slider.end.x=X;
    pos.slider.end.y=Y;
  }

  return {type: type, pos: pos};
}

function shuffleArray(a) { //O(n) on se met bien
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}