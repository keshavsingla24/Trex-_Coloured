//Variables and values for the  gamestates 
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//variables for trex and ground
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

// variables and groups for clouds and obstacles
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obsbird , obsbirdImage, birdsGroup ;

var score;

//variables for gameover and restart
var gameOverImg,restartImg
//variable for sounds 
var jumpSound , checkPointSound, dieSound

var bgcolor=180;

function preload(){
  //preloading of all the animation and images used in the game
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  obsbirdImage= loadImage("Bird.png");

   restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  //creating canvas
  createCanvas(600, 200);
  
  
  //sprite for the trex 
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  //sprite for the moving ground
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //gameover sprite
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  //restart sprite
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  //gameover and restart properties
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  //invisible ground sprite 
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  birdsGroup = createGroup();
  // collider for trex 
  trex.setCollider("circle",0,0,40);
  
  score = 0;
  
}

function draw() {
  
   // background color 
  background(bgcolor);
  //displaying score
  textSize(15);
  text("Score: "+ score, 500,50);
  
   //propeties in gamestate PLAY
  if(gameState === PLAY){
   
    //visibility of gameover and restart
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4+3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //change from day to night 
    if(score > 0 && score % 100 === 0) {
    bgcolor=50;
    }
    
    if(score > 0 && score % 200 === 0) {
    bgcolor=180;
    }
    
    //playing sound at checkpoints
    if(score > 0 && score % 100 === 0){
    checkPointSound.play();
    }
    
    //resetting the ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
      jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    //spawn birds in the air
    bird();
    
    //change to gamestate end
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
    }

    if(birdsGroup.isTouching(trex)){
      gameState = END;
    dieSound.play();
  }
  }
   
   else if (gameState === END) {
   //visibility of restart and gameover in gamestate end
      gameOver.visible = true;
      restart.visible = true;
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
     //restarting the game when we press on the restart icon
     if(mousePressedOver(restart)){
    reset();
     }
  
     //stopping ground and trex in gamestate end
      ground.velocityX = 0;
      trex.velocityY = 0
  
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    birdsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     birdsGroup.setLifetimeEach(0);
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function spawnObstacles(){
  //spawning clouds after every 60 frames
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
  obstacle.velocityX = -(6+3*score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  // spawn the clouds after every 60 frames
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime =205;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function bird() {
  if(frameCount%200===0) {
    obsbird= createSprite(500,130,20,20);
    obsbird.addImage(obsbirdImage);
    obsbird.scale=0.2;
    obsbird.velocityX=-(6+3*score/100);

    obsbird.lifetime = 205;

    birdsGroup.add(obsbird);

  }

}

function reset() {
  //function to reset the game
  gameState=PLAY;
  restart.visible=false;
  gameOver.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0;
  bgcolor=180;
}