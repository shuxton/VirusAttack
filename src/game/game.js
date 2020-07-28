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

 

var platforms,
player,
viral,
sides,
bullet,
mask,
sanitizer,
virusVel,
key,
enter,
title,
dead=false,
scoreText,total=0,medicineSupplied=false,
nextFire=0,fireRate=200,score=0,oldScore=1,bulletCount=0,health=100,coins=1000,shieldTime=0,added=true,add1=false,add2=false;


function preload() {
 
   this.load.audio('instruction', 'assets/instructions.mp3'); 
   this.load.audio('jumpaudio', 'assets/jump.mp3'); 
   this.load.audio('pick', 'assets/pick.wav'); 
   this.load.audio('destroy', 'assets/destroy.mp3'); 
   this.load.audio('death', 'assets/death.wav'); 
   this.load.audio('enterkey', 'assets/enterkey.mp3'); 

   this.load.audio('attack', 'assets/attack.wav'); 
   this.load.audio('bgmusic', 'assets/bgmusic.mp3'); 


   this.load.multiatlas('idle', 'assets/idle_guy.json', 'assets');
   this.load.multiatlas('run', 'assets/run_guy.json', 'assets');
   this.load.multiatlas('idleL', 'assets/idleL_guy.json', 'assets');
   this.load.multiatlas('runL', 'assets/runL_guy.json', 'assets');

   this.load.image('drop', 'assets/water.png');
   this.load.image('coin', 'assets/coin.png');
   this.load.image('money', 'assets/money.png');
   this.load.image('heart', 'assets/heart.png');

   this.load.image('background', 'assets/1624.jpg');
   this.load.image('title', 'assets/title.png');
   this.load.image('computer', 'assets/computer.png');
   this.load.image('enter', 'assets/enter.png');
   this.load.image('end', 'assets/end.png');
   this.load.image('creators', 'assets/creators.png');

   this.load.image('jump', 'assets/jump.png');
   this.load.image('capsules', 'assets/pills.png');
   this.load.image('shield', 'assets/shield.png');
   this.load.image('mask', 'assets/mask.png');
   this.load.image('virus', 'assets/virus.png');
   this.load.image('portal', 'assets/portal.png');
   this.load.image('sanitizer', 'assets/sanitizer.png');
   this.load.image('bullet', 'assets/bullet.png');
   this.load.image('tile','assets/Tiles/Tile (2).png')
   this.load.image('tileSides','assets/Tiles/Tile (5).png')
   this.load.image('acid','assets/Tiles/Acid (2).png')
   this.load.image('dead','assets/dead.png')

}


function create() {

  this.add.image(512,384, 'background');

  bgmusic=this.sound.add('bgmusic',{
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
})
bgmusic.play();

  title=this.add.image(512,384,'title')
  enter=this.add.image(512,500,'enter').setScale(0.8,0.8)

  //this.sound.play('instruction');
 
  platforms = this.physics.add.staticGroup();
  sidesL = this.physics.add.staticGroup();
  sidesR = this.physics.add.staticGroup();
  jump= this.physics.add.staticGroup();
  sanPlatform=this.physics.add.staticGroup();
  acid=this.physics.add.staticGroup();
  stats=this.physics.add.staticGroup();

  scoreText = this.add.text(35, 20, 'Score: 0', { fontSize: '20px', fill: '#000000',});
scoreText.setStroke('#000000', 3);

  stats.create(195,30, 'drop')
  stats.create(335,30, 'coin')
  stats.create(475,30, 'heart')

  healthText = this.add.text(490, 20, ': 100', { fontSize: '20px', fill: '#000000' });
  healthText.setStroke('#000000', 2);

  sanText = this.add.text(205, 20, ': 0mL', { fontSize: '20px', fill: '#000000' });
  sanText.setStroke('#000000', 2);

  coinText = this.add.text(350, 20, ': 1000', { fontSize: '20px', fill: '#000000' });
  coinText.setStroke('#000000', 2);




  sidesL.create(-95,120,'tileSides')
  sidesL.create(-95,350,'tileSides')
  sidesL.create(-95,580,'tileSides')

  sidesR.create(1119,120,'tileSides')
  sidesR.create(1119,350,'tileSides')
  sidesR.create(1119,580,'tileSides')

  platforms.create(130,838,'tile')
  platforms.create(380,838,'tile')
  acid.create(635,838,'acid')
  platforms.create(890,838,'tile')

  this.physics.add.staticGroup().create(940,80,'portal')



viral = this.physics.add.group({
    key: 'virus',
    repeat: 0,
    setXY: { x: 950, y: 100, stepX: 0 }
});
viral.children.iterate(function (child) {

    child.body.allowGravity = false;
    child.setCollideWorldBounds(true);
});


sanitizer=this.physics.add.sprite(120,70,'sanitizer');
sanitizer.visible=false;
sanitizer.body.allowGravity=false;
sanitizer.setCollideWorldBounds(true)



 mask=this.physics.add.sprite(950,100,'mask');
 mask.visible=false;
 mask.body.allowGravity=false;
 mask.setCollideWorldBounds(true);

  
 
 player = this.physics.add.sprite(100, 450, 'idle').setScale(0.2,0.2);
 player.setBounce(0.2);
 player.setCollideWorldBounds(true);

 
 
 
 shield=this.physics.add.sprite(player.x,player.y,'shield').setScale(0.2,0.2)
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
this.physics.add.collider(player, sanPlatform);
this.physics.add.overlap(player, sanitizer,sanTouch,null,this);
this.physics.add.collider(player, jump,highJump,null,this);

this.physics.add.overlap(player, acid,acidDeath,null,this);

this.physics.add.overlap(player, mask,maskChange,null,this);



this.physics.add.collider(sanitizer, sanPlatform);
this.physics.add.collider(platforms, mask);
this.physics.add.collider(mask, jump);

this.physics.add.collider(viral, platforms,virusChange,null,this);
this.physics.add.collider(viral, acid,virusChange,null,this);

this.physics.add.collider(viral, sidesL,virusChangeL,null,this);
this.physics.add.collider(viral, sidesR,virusChangeR,null,this);

this.physics.add.overlap(player, viral,virusAttack,null,this);

function virusAttack(){
    if(!shield.visible){
    health=health-0.5;
    if(health<=0){
        dead=true;health=0;
    player.setTexture('dead')
    }
}
}

function acidDeath(){
    health=0;
    dead=true;
    player.setTexture('dead')
}

function sanTouch(){
    if(coins>=500){
        this.sound.play('pick')

    bulletCount=10;
    coins-=500;
 sanText.setText(': ' + bulletCount+"mL");

    sanitizer.destroy()
    if(coins==0){
    money=this.physics.add.sprite(100,600,'money');
money.setCollideWorldBounds(true)
this.physics.add.collider(money, platforms);
this.physics.add.overlap(player, money,moneyChange,null,this);
function moneyChange(){
    this.sound.play('pick')

    coins+=1000
    money.destroy()

}
    }
    add1 =true;
    }
}



function highJump(){
    this.sound.play('jumpaudio')
    player.setVelocityY(-650)
}

function maskChange(){
    if(coins>=500){
        this.sound.play('pick')

    coins-=500;
    mask.visible=false;
    mask.destroy();
    shield.visible=true;
    shieldTime=new Date().getTime();
    if(coins==0){
        money=this.physics.add.sprite(100,600,'money');
    money.setCollideWorldBounds(true)
    this.physics.add.collider(money, platforms);
    this.physics.add.overlap(player, money,moneyChange,null,this);
    function moneyChange(){
        coins+=1000
        money.destroy()
    
    }
        }
    add2=true
    }
}

function virusChange(virus,platforms){

if(virus.body.velocity.x==0)virus.setVelocityX((Math.random()*400+400));
else virus.setVelocityX((virus.body.velocity.x))

if(virus.body.velocity.y==0)virus.setVelocityY(-(Math.random()*400+700))
else     virus.setVelocityY(-(virus.body.velocity.y));

}

function virusChangeL(virus,sidesL){

   if(virus.body.velocity.x==0)virus.setVelocityX((Math.random()*400+400));
   else virus.setVelocityX(-(virus.body.velocity.x))
  
  if(virus.body.velocity.y==0)virus.setVelocityY(-(Math.random()*400+700))
  else     virus.setVelocityY((virus.body.velocity.y));
  }

  function virusChangeR(virus,sidesR){

   if(virus.body.velocity.x==0)virus.setVelocityX(-(Math.random()*400+400));
   else virus.setVelocityX(-(virus.body.velocity.x))
  
  if(virus.body.velocity.y==0)virus.setVelocityY(-(Math.random()*400+700))
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

    healthText.setText(': ' + health);
    coinText.setText(': ' + coins);

if(((health<=30 && health>=20) || (health<=60 && health>=50))&& !medicineSupplied){
    medicine=this.physics.add.sprite(540,320,'capsules');
    medicineSupplied=true;
    medicine.setCollideWorldBounds(true);
    this.physics.add.collider(platforms,medicine)
    this.physics.add.collider(jump,medicine)
    this.physics.add.overlap(player,medicine,medAcquired,null,this)
function medAcquired(){
    medicineSupplied=false;

    health=health+35;
medicine.destroy()
}

}

    if(add1 && add2)added=false;

    if(shield.visible && new Date().getTime()-shieldTime>7000){
        shield.visible=false;
    }
    if(score==oldScore){
        oldScore=2*score;
        if(oldScore>16){oldScore=2;score=1}
        viral = this.physics.add.group({
            key: 'virus',
            repeat: (score*2)-1,
            setXY: { x: 950, y: 100, stepX: 0 }
        });
        viral.children.iterate(function (child) {
            child.setCollideWorldBounds(true);

            child.setVelocityX(-(Math.random()*400+400));
            child.setVelocityY(Math.random()*400+400)
        
        });score=0
        this.physics.add.collider(viral, acid,virusChange,null,this);
        this.physics.add.collider(viral, platforms,virusChange,null,this);
this.physics.add.collider(viral, sidesL,virusChangeL,null,this);
this.physics.add.collider(viral, sidesR,virusChangeR,null,this);

this.physics.add.overlap(player, viral,virusAttack,null,this);

function virusAttack(){
    if(!shield.visible){
    health=health-0.5;
    if(health<=0){
        health=0;
        dead=true;
    player.setTexture('dead')
    }
}
}
function virusChange(virus,platforms){

    if(virus.body.velocity.x==0)virus.setVelocityX((Math.random()*400+400));
    else virus.setVelocityX((virus.body.velocity.x))
    
    if(virus.body.velocity.y==0)virus.setVelocityY(-(Math.random()*400+700))
    else     virus.setVelocityY(-(virus.body.velocity.y));
    
    }
    
    function virusChangeL(virus,sidesL){
    
       if(virus.body.velocity.x==0)virus.setVelocityX((Math.random()*400+400));
       else virus.setVelocityX(-(virus.body.velocity.x))
      
      if(virus.body.velocity.y==0)virus.setVelocityY(-(Math.random()*400+700))
      else     virus.setVelocityY((virus.body.velocity.y));
      }
    
      function virusChangeR(virus,sidesR){
    
       if(virus.body.velocity.x==0)virus.setVelocityX(-(Math.random()*400+400));
       else virus.setVelocityX(-(virus.body.velocity.x))
      
      if(virus.body.velocity.y==0)virus.setVelocityY(-(Math.random()*400+700))
      else     virus.setVelocityY(-(virus.body.velocity.y));
      }
    
    }


    shield.setPosition(player.x,player.y)

if(key.Enter.isDown && dead){
    this.sound.play('enterkey')

    window.location.href=window.location.href
}

    if(key.Enter.isDown && !this.gameStarted){
        this.sound.play('enterkey')

        this.gameStarted=true;
        viral.children.iterate(function (child) {

            child.body.allowGravity = true;
        });
       
       title.destroy();
       enter.destroy();
     mask.visible=true;
     sanitizer.visible=true;
    
 jump.create(540,420,'jump')
 jump.create(920,670,'jump')

 sanPlatform.create(120,200,'jump')
 sanitizer.body.allowGravity=true;
 mask.body.allowGravity=true;
    }
    if(this.gameStarted){
        if(!virusVel){
            viral.children.iterate(function (child) {

                child.setVelocityX(-(Math.random()*400+400));
                child.setVelocityY(Math.random()*400+400)
            
            });
        
virusVel=true;
        }
        if(key.Space.isDown){
           // console.log(added)

            if(bulletCount>=0 && new Date().getTime()>nextFire ){
                
                bulletCount--;
                if(bulletCount>0){
                    this.sound.play('attack')

                sanText.setText(': ' + bulletCount+"mL");

                nextFire = new Date().getTime() + fireRate;
                bullet=this.physics.add.sprite(player.x, player.y, 'bullet')
                bullet.body.allowGravity=false;
            bullet.setVelocityX(660);
            bulletCol=this.physics.add.overlap(viral, bullet,bulletHit,null,this);
function bulletHit(virus,bullet){
    score++;
    total++;
   // this.sound.play('destroy')

    scoreText.setText('Score: ' + total);
    bullet.disableBody(true,true);
    virus.disableBody(true,true);
//bulletCol.destroy();

}
            }else if(!added){
                sanText.setText(': ' + bulletCount+"mL");

                sanitizer=this.physics.add.sprite(120,70,'sanitizer');
                sanitizer.setCollideWorldBounds(true)
                this.physics.add.overlap(player, sanitizer,sanTouch,null,this);
                this.physics.add.collider(sanitizer, sanPlatform);
                function sanTouch(){
                    if(coins>=500){
                        this.sound.play('pick')

                    bulletCount=10;
                    coins-=500;
                    sanText.setText(': ' + bulletCount+"mL");
                    sanitizer.destroy()
                    if(coins==0){
                        money=this.physics.add.sprite(100,600,'money');
                    money.setCollideWorldBounds(true)
                    this.physics.add.collider(money, platforms);
                    this.physics.add.overlap(player, money,moneyChange,null,this);
                    function moneyChange(){
                        this.sound.play('pick')

                        coins+=1000
                        money.destroy()
                    
                    }
                        }

                   add1=true;
                    }
                }
                mask=this.physics.add.sprite(950,100,'mask');
                mask.setCollideWorldBounds(true)
                this.physics.add.overlap(player, mask,maskChange,null,this);
                this.physics.add.collider(platforms, mask);
                this.physics.add.collider(mask, jump);
                function maskChange(){
                    if(coins>=500){
                        this.sound.play('pick')

                    coins-=500;
                    mask.visible=false;
                   mask.destroy();
                    shield.visible=true;
                    shieldTime=new Date().getTime();
                    if(coins==0){
                        money=this.physics.add.sprite(100,600,'money');
                    money.setCollideWorldBounds(true)
                    this.physics.add.collider(money, platforms);
                    this.physics.add.overlap(player, money,moneyChange,null,this);
                    function moneyChange(){
                        this.sound.play('pick')

                        coins+=1000
                        money.destroy()
                    
                    }
                        }
                    add2=true;
                    }
                }added=true;add1=false;add2=false;
            }}
        }
    if(!dead){   
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
      // this.sound.play('jumpaudio')

   }
}else{

    player.setTexture('dead')
   
   creators=this.add.image(512,384,'creators')
  end=this.add.image(512,500,'end').setScale(0.8,0.8)
}

}
 

 

}
function reset(){
    this.gameStarted = false;
	this.gameOver = false;
    this.score = 0;
    viral.children.iterate(function (child) {

        child.body.allowGravity = false;
    });
virusVel=false;
}



function render(){}