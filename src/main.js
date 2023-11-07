/*
    Star Rush, a game by Eric Wang
    Spent Approximately 30+ hours including initial structure, algorithms, as well as debugging
    As for the creative tilt, I dont know anymore, I'm tired, but I think hit 85-90% of the criteria
*/
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
    pVertical: [0.5, 0.8],
    playerGravity: 850,
    jumpDist: 410,
    startPosition: 90,
    maxJump: 2,
    spikeProb: 25
}


let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3;

let keyEnter, keySpace, keyEsc, cursor, time;
