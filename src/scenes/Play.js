class Play extends Phaser.Scene{
    constructor(){
        super('playScene');
    }

    preload(){
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('platform', './assets/platform.png');
        this.load.image('spike', './assets/spike.png');
        this.load.spritesheet('player', './assets/spritesheets/player.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }
    create(){
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        
        //this.pVisibleWidth = 0;

        this.pGroup = this.add.group({
            removeCallback: function(platform){
                platform.scene.pPool.add(platform)
            }
        });

        this.pPool = this.add.group({
            removeCallback: function(platform){
                platform.scene.pGroup.add(platform)
            }
        });

        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        //keeps track of the jumps made by player
        this.playerJump = 0;
        //adds initial platform
        this.addPlatform(game.config.width, game.config.width / 3, game.config.height * options.pVertical[1]);

        //player
        this.player = this.physics.add.sprite(options.startPosition, game.config.height * 0.7, 'player', 1);
        this.player.setGravityY(options.playerGravity);
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', {
                start: 1,
                end: 1
            }),
            frameRate: 0,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.pGroup);

        //jump input
        this.input.on('pointerdown', this.jump, this);
        //game over
        this.gameOver = false;

    }

    //helper function for adding platforms
    addPlatform(scale, X, Y){
        let platform;
        if(this.pPool.getLength()){
            platform = this.pPool.getFirst();
            platform.x = X;
            platform.active = true;
            platform.visible = true;
            this.pPool.remove(platform);
        } else{
            platform = this.physics.add.sprite(X, Y, 'platform');
            platform.setImmovable(true);
            platform.setFrictionX(0);
            platform.setVelocityX(-options.platformSpeed);
            this.pGroup.add(platform);
        }
        const platformWidth = scale;
        platform.pVisibleWidth = platformWidth;
        platform.displayWidth = platformWidth;
        this.nextPlat = Phaser.Math.Between(options.pSpawnRange[0], options.pSpawnRange[1]);
    }

    //helper function for jump
    jump(){
        if(this.player.body.touching.down || (this.playerJump > 0 && this.playerJump < options.maxJump)){
            if(this.player.body.touching.down){
                this.playerJump = 0
            }
            this.player.setVelocityY(options.jumpDist * -1);
            this.playerJump++;
        }
    }
    
    update(){
        this.starfield.tilePositionX -= 3;

        if(this.player.y > game.config.height){
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (Enter) to Restart or (Esc) for Menu').setOrigin(0.5);
            this.gameOver = true;
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyEnter)){
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyEsc)){
            this.scene.start('menuScene');
        }

        //recycle platform
        let min = game.config.width;
        let rPlatH = 0;

        this.pGroup.getChildren().forEach(function(platform){
            let pDist = game.config.width - platform.x - platform.pVisibleWidth / 2;
            if(pDist < min){
                min = pDist;
                rPlatH = platform.y;
            }
            if(platform.x < - platform.pVisibleWidth / 2){
                this.pGroup.killAndHide(platform);
                this.pGroup.remove(platform);
            }
        }, this);

        //add platform
        if(min > this.nextPlat){
            let nextPlatWidth = Phaser.Math.Between(options.platformSize[0], options.platformSize[1]);
            let platRHeight = options.pHeightScale * Phaser.Math.Between(options.pHeightRange[0], options.pHeightRange[1]);
            let nextPlatSpace = rPlatH + platRHeight;
            let minPlatH = game.config.height * options.pVertical[0];
            let maxPlatH = game.config.height * options.pVertical[1];
            let nextPlatH = Phaser.Math.Clamp(nextPlatSpace, minPlatH, maxPlatH);
            this.addPlatform(nextPlatWidth, game.config.width + nextPlatWidth / 2, nextPlatH);
        }
    }
    

}
