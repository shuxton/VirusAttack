var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    audio: {
        disableWebAudio: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
  
    scene: {
     
       preload: preload,
       reset: reset,
       create: create,
      update: update,
      render: render,
      

   }
 };
 
 var game = new Phaser.Game(config);

 

var platforms,player,virus,sides,bullet,mask,sanitizer,virusVel,key,enter,title;
var nextFire=0,fireRate=100;


function preload() {
 
   this.load.audio('instruction', 'assets/instructions.mp3'); 

   this.load.multiatlas('idle', 'assets/idle_guy.json', 'assets');
   this.load.multiatlas('run', 'assets/run_guy.json', 'assets');
   this.load.multiatlas('idleL', 'assets/idleL_guy.json', 'assets');
   this.load.multiatlas('runL', 'assets/runL_guy.json', 'assets');

 this.load.image('background', 'assets/1624.jpg');
 this.load.image('title', 'assets/title.png');
 this.load.image('computer', 'assets/computer.png');

 this.load.image('enter', 'assets/enter.png');
 this.load.image('shield', 'assets/shield.png');

 this.load.image('mask', 'assets/mask.png');
 this.load.image('virus', 'assets/virus.png');
 this.load.image('portal', 'assets/portal.png');
 this.load.image('sanitizer', 'assets/sanitizer.png');
 this.load.image('bullet', 'assets/bullet.png');

 this.load.image('tile','assets/Tiles/Tile (2).png')
 this.load.image('tileJump','assets/Tiles/Tile (15).png')
 this.load.image('tileSides','assets/Tiles/Tile (5).png')

 this.load.image('acid','assets/Tiles/Acid (2).png')
}


function create() {
  this.add.image(512,384, 'background');
  title=this.add.image(512,384,'title')
  enter=this.add.image(512,500,'enter').setScale(0.8,0.8)
  //this.add.image(100,100,'computer').setScale(0.5,0.5)

  //this.sound.play('instruction');
 
  platforms = this.physics.add.staticGroup();
  sidesL = this.physics.add.staticGroup();
  sidesR = this.physics.add.staticGroup();
  



  sidesL.create(-95,120,'tileSides')
  sidesL.create(-95,350,'tileSides')
  sidesL.create(-95,580,'tileSides')

  sidesR.create(1119,120,'tileSides')
  sidesR.create(1119,350,'tileSides')
  sidesR.create(1119,580,'tileSides')

  platforms.create(130,838,'tile')
  platforms.create(380,838,'tile')
   platforms.create(635,838,'acid')
 platforms.create(890,838,'tile')
// platforms.create(890,568,'tileJump')

this.physics.add.staticGroup().create(940,80,'portal')

 virus = this.physics.add.sprite(950,100,'virus');
 virus.body.allowGravity = false;

 //sanitizer=this.physics.add.sprite(950,100,'sanitizer');



 virus.setCollideWorldBounds(true);


 mask=this.physics.add.sprite(950,100,'mask');
 mask.visible=false;
 mask.setCollideWorldBounds(true)

  player = this.physics.add.sprite(100, 450, 'idle').setScale(0.2,0.2);

  shield=this.physics.add.sprite(player.x,player.y,'shield').setScale(0.2,0.2)

  


  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  //shield.setCollideWorldBounds(true);
  shield.body.allowGravity=false;
shield.visible=false;


  this.anims.create({
   key: 'left',
   frames: this.anims.generateFrameNames('runL', { start: 1, end: 7,zeroPad: 1,
       prefix: 'RunL (', suffix: ').png'}),
   frameRate: 30,
   repeat: -1
});
var frameNames=this.anims.generateFrameNames('idle', { start: 1, end: 7,zeroPad: 1,
   prefix: 'Idle (', suffix: ').png'});
this.anims.create({
   key: 'turn',
   frames: frameNames,
   frameRate: 30,
   repeat: -1
});
player.anims.play('turn');


this.anims.create({
   key: 'right',
   frames:  this.anims.generateFrameNames('run', { start: 1, end: 7,zeroPad: 1,
       prefix: 'Run (', suffix: ').png'}),
   frameRate: 30,
   repeat: -1
});


this.physics.add.collider(player, platforms);
//this.physics.add.collider(shield, platforms);

maskcol=this.physics.add.collider(player, mask,maskChange,null,this);
this.physics.add.collider(platforms, mask);

this.physics.add.collider(virus, platforms,virusChange,null,this);
this.physics.add.collider(virus, sidesL,virusChangeL,null,this);
this.physics.add.collider(virus, sidesR,virusChangeR,null,this);

function maskChange(){
    mask.visible=false;
    maskcol.destroy();
    shield.visible=true;
}

function virusChange(){

if(virus.body.velocity.x==0)virus.setVelocityX((Math.random()*400+400));
else virus.setVelocityX((virus.body.velocity.x))

if(virus.body.velocity.y==0)virus.setVelocityY(-(Math.random()*400+400))
else     virus.setVelocityY(-(virus.body.velocity.y));

}

function virusChangeL(){

   if(virus.body.velocity.x==0)virus.setVelocityX((Math.random()*400+400));
   else virus.setVelocityX(-(virus.body.velocity.x))
  
  if(virus.body.velocity.y==0)virus.setVelocityY(-(Math.random()*400+400))
  else     virus.setVelocityY((virus.body.velocity.y));
  }

  function virusChangeR(){

   if(virus.body.velocity.x==0)virus.setVelocityX(-(Math.random()*400+400));
   else virus.setVelocityX(-(virus.body.velocity.x))
  
  if(virus.body.velocity.y==0)virus.setVelocityY(-(Math.random()*400+400))
  else     virus.setVelocityY(-(virus.body.velocity.y));
  }


cursors = this.input.keyboard.createCursorKeys();
  key = this.input.keyboard.addKeys({
    'TAB': Phaser.Input.Keyboard.KeyCodes.TAB,
    'ESC': Phaser.Input.Keyboard.KeyCodes.ESC,
    'Space': Phaser.Input.Keyboard.KeyCodes.SPACE,
    'X': Phaser.Input.Keyboard.KeyCodes.X,
    'One': Phaser.Input.Keyboard.KeyCodes.ONE,
    'Two': Phaser.Input.Keyboard.KeyCodes.TWO,
    'F': Phaser.Input.Keyboard.KeyCodes.F,
    'C': Phaser.Input.Keyboard.KeyCodes.C,
    'W': Phaser.Input.Keyboard.KeyCodes.W,
    'M': Phaser.Input.Keyboard.KeyCodes.M,
    'I': Phaser.Input.Keyboard.KeyCodes.I,
    'A': Phaser.Input.Keyboard.KeyCodes.A,
    'S': Phaser.Input.Keyboard.KeyCodes.S,
    'D': Phaser.Input.Keyboard.KeyCodes.D,
    'E': Phaser.Input.Keyboard.KeyCodes.E,
    'Enter': Phaser.Input.Keyboard.KeyCodes.ENTER
});
}


function update() {
    shield.setPosition(player.x,player.y)
    if(key.Enter.isDown && !this.gameStarted){
        this.gameStarted=true;
       virus.body.allowGravity=true;
       title.destroy();
       enter.destroy();
     mask.visible=true;
    }
    if(this.gameStarted){
        if(!virusVel){
        virus.setVelocityX(-(Math.random()*400+400));
virus.setVelocityY(Math.random()*400+400)
virusVel=true;
        }
        if(key.Space.isDown){
            if(new Date().getTime()>nextFire ){
                nextFire = new Date().getTime() + fireRate;
                bullet=this.physics.add.sprite(player.x, 590, 'bullet')
                bullet.body.allowGravity=false;
            bullet.setVelocityX(660);
            bulletCol=this.physics.add.collider(virus, bullet,bulletHit,null,this);
function bulletHit(){
virus.destroy();
bulletCol.destroy();
}
            }
        }
   if (cursors.left.isDown)
   {
      
       player.setVelocityX(-460);
       player.anims.play('left', true);
   }
   else if (cursors.right.isDown)
   {
       player.setVelocityX(460);

       player.anims.play('right', true);
   }
   else
   {
       player.setVelocityX(0);

       player.anims.play('turn');
   }

   if (cursors.up.isDown && player.body.touching.down)
   {
       player.setVelocityY(-430);
   }
  

}
 

 

}
function reset(){
    this.gameStarted = false;
	this.gameOver = false;
    this.score = 0;
    this.virus.body.allowGravity=false;
virusVel=false;
}

function start(){
    this.gameStarted = true;
	//this.gameOver = false;
   // this.score = 0;
    this.virus.body.allowGravity=true;
//virusVel=true;
}

function render(){}