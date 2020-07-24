var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
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
      create: create,
      update: update,
      render: render
   }
 };
 
 var game = new Phaser.Game(config);
 var platforms,player,virus,sides,bullet,mask,sanitizer;



 function preload() {

   
    this.load.multiatlas('idle', 'assets/idle_guy.json', 'assets');
    this.load.multiatlas('run', 'assets/run_guy.json', 'assets');
    this.load.multiatlas('idleL', 'assets/idleL_guy.json', 'assets');
    this.load.multiatlas('runL', 'assets/runL_guy.json', 'assets');

  this.load.image('background', 'assets/1624.jpg');
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
  //sanitizer=this.physics.add.sprite(950,100,'sanitizer');
 // mask=this.physics.add.sprite(950,100,'mask');



  virus.setCollideWorldBounds(true);
virus.setVelocityX(-(Math.random()*400+400));
virus.setVelocityY(Math.random()*400+400)
  //platforms.create(300,768,'tile')



   player = this.physics.add.sprite(100, 450, 'idle').setScale(0.2,0.2);
  // bullet = this.physics.add.group();

   player.setBounce(0.2);
   player.setCollideWorldBounds(true);
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
this.physics.add.collider(virus, platforms,virusChange,null,this);
this.physics.add.collider(virus, sidesL,virusChangeL,null,this);
this.physics.add.collider(virus, sidesR,virusChangeR,null,this);


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
 }


 function update() {
    if (cursors.left.isDown)
    {
        bullet=this.physics.add.sprite(player.x, 590, 'bullet')
       // bullet.create(player.x, 590, 'bullet');
        bullet.setVelocityX(300);
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
 
 function render(){}