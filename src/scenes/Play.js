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
        this.score = 0;
        this.timeS = 0;
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        
        this.addedPlat = 0;

        
        //bgm
        this.music = this.sound.add('bgm');
        this.music.play();
        this.music.setLoop(true);

        

        this.music.setVolume(0.4);

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

        this.spikeGroup = this.add.group({
            removeCallback: function(spike){
                spike.scene.spikePool.add(spike)
            }
        });

        this.spikePool = this.add.group({
            removeCallback: function(spike){
                spike.scene.spikeGroup.add(spike)
            }
        });

        let subtext = {
            fontFamily: 'Courier',
            fontSize: '20px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        
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

        this.dead = false;
        this. pCollider = this.physics.add.collider(this.player, this.pGroup);
        this.physics.add.overlap(this.player, this.spikeGroup, function(player, spike){
            player.setImmovable(true);
            this.player.body.setVelocityY(-200);
            this.dead = true;
            this.physics.world.removeCollider(this.pCollider);
        }, null, this);


        //game over
        this.gameOver = false;

        
        //timer
        this.timer = this.add.text(borderUISize * 14 + borderPadding, borderUISize + borderPadding*2, '', subtext);


    }

    //helper function for adding platforms
    addPlatform(scale, X, Y){
        this.addedPlat++;
        let platform;
        if(this.pPool.getLength()){
            platform = this.pPool.getFirst();
            platform.x = X;
            platform.y = Y;
            platform.active = true;
            platform.visible = true;
            this.pPool.remove(platform);
        } else{
            platform = this.add.tileSprite(X, Y, scale, 15, 'platform');
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setFrictionX(0);
            platform.body.setVelocityX(-options.platformSpeed);
            this.pGroup.add(platform);
        }
        const platformWidth = scale;
        platform.pVisibleWidth = platformWidth;
        platform.displayWidth = platformWidth;
        this.nextPlat = Phaser.Math.Between(options.pSpawnRange[0], options.pSpawnRange[1]);

        if(this.addedPlat > 1){
            //checking if there's a spike on the platform
            let spike;
            if(Phaser.Math.Between(1, 100) <= options.spikeProb){
                if(this.spikePool.getLength()){
                    spike = this.spikePool.getFirst();
                    spike.x = X - scale / 2.1 + Phaser.Math.Between(1, scale);
                    spike.y = Y - 16;
                    //console.log(Y);
                    spike.alpha = 1;
                    spike.active = true;
                    spike.visible = true;
                    this.spikePool.remove(spike);
                }
                else{
                    spike = this.add.tileSprite(X - scale / 2.1 + Phaser.Math.Between(1, scale), Y - 16, 32, 22, 'spike');
                    //console.log(Y);
                    this.physics.add.existing(spike);
                    spike.body.setImmovable(true);
                    spike.body.setVelocityX(-options.platformSpeed);
                    this.spikeGroup.add(spike);
                }
            }
        }
    }


    update(time, delta){
        this.starfield.tilePositionX -= 3;
        this.score += delta * 0.001;
        
        this.timer.setText(Math.round(this.score));
        if(Phaser.Input.Keyboard.JustDown(keySpace)){
            if(this.player.body.touching.down || (this.playerJump > 0 && this.playerJump < options.maxJump)){
                if(this.player.body.touching.down){
                    this.playerJump = 0
                }
                this.sound.play('sfx_jump');
                this.player.setVelocityY(-options.jumpDist);
                this.playerJump++;
            }
        }

        if(this.player.y > game.config.height || this.dead){
            this.dead = true;
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (Enter) to Restart or (Esc) for Menu').setOrigin(0.5);
            this.music.stop();
            this.score = Math.abs((delta * 0.001) - this.score);
            this.gameOver = true;
        }



        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyEnter)){
            this.sound.play('sfx_select');
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyEsc)){
            this.sound.play('sfx_select');
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

        //recycle spike
        this.spikeGroup.getChildren().forEach(function(spike){
            if(spike.x < - spike.pVisibleWidth / 2){
                this.spikeGroup.killAndHide(spike);
                this.spikeGroup.remove(spike);
            }
        }, this)

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
