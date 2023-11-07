class Menu extends Phaser.Scene{
    constructor(){
        super('menuScene');
    }
    preload(){
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_jump', './assets/Jump-Sound.wav');
        this.load.audio('bgm', './assets/05132020.mp3');
    }

    create(){
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#150c25',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        let subtitle = {
            fontFamily: 'Courier',
            fontSize: '17px',
            backgroundColor: '#150c25',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Star Rush', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Press (Enter) to start game', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.8, 'Press (Space) to jump', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.1, 'Assets, SFX (all but select)/bgm, Programming: Eric Wang', subtitle).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.05, 'Select SFX created by Nathan Altice', subtitle).setOrigin(0.5);

        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyEnter)){
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}