class Menu extends Phaser.Scene{
    constructor(){
        super('menuScene');
    }
    preload(){

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


        //menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Star Explorer', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Press (Enter) to start game', menuConfig).setOrigin(0.5);

        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyEnter)){
            this.scene.start('playScene');
        }
    }
}