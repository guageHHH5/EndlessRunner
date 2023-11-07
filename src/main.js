let config = {
    type: Phaser.AUTO,
    physics: {
        default: 'arcade'
    },
    width: 640,
    height: 480,
    backgroundColor: '#150c25',
    scene: [ Menu, Play ]
}


let options = {
    platformSpeed: 350,
    pSpawnRange: [60, 150],
    platformSize: [60, 450],
    pHeightRange: [-8, 8],
    pHeightScale: 9,
    pVertical: [0.1, 0.8],
    playerGravity: 850,
    jumpDist: 410,
    startPosition: 90,
    maxJump: 2
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3;

let keyEnter, keySpace, keyEsc;
