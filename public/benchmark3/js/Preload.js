var AquaCycle = AquaCycle || {};

AquaCycle.Preload = function(){};

AquaCycle.Preload.prototype = {
    preload: function(){
        // Load the levels of the game and their assets
        AquaCycle.game.load.tilemap('level1','assets/level1_withObjects.json',null,Phaser.Tilemap.TILED_JSON);
        AquaCycle.game.load.tilemap('level2', 'assets/level2.json',null,Phaser.Tilemap.TILED_JSON);
        AquaCycle.game.load.tilemap('level3', 'assets/level3.json',null,Phaser.Tilemap.TILED_JSON);
        AquaCycle.game.load.image('tiles','assets/depth_tiles.png');
        AquaCycle.game.load.image('infobox','assets/infobox_small.png');
        AquaCycle.game.load.image('heart','assets/heart.png');

        // Load sounds
        AquaCycle.game.load.audio('discover','sounds/discover.mp3');
        AquaCycle.game.load.audio('dying','sounds/dying.mp3');
        AquaCycle.game.load.audio('swimming_slow','sounds/swimming_slow.mp3');
        AquaCycle.game.load.audio('swimming_fast','sounds/swimming_fast.mp3');
        AquaCycle.game.load.audio('winning','sounds/winning.mp3');
        AquaCycle.game.load.audio('bgMusic','sounds/bensound-slowmotion.mp3');
        AquaCycle.game.load.audio('damage','sounds/damage.mp3');
        // Load the player sprite sheets
        AquaCycle.game.load.spritesheet('blacktipshark', 'assets/blacktip_shark.png',128,64);
        AquaCycle.game.load.spritesheet('barracudafish', 'assets/barracudafish.png', 128,64);

        // Load the predator sprite sheets
        AquaCycle.game.load.spritesheet('tigershark','assets/tiger_shark.png',192,96);

        // Load the prey sprite sheets
        AquaCycle.game.load.image('pinkshrimp','assets/pinkshrimp.png');
        AquaCycle.game.load.image('brownshrimp','assets/brownshrimp.png');
        AquaCycle.game.load.image('peacockflounder','assets/peacockflounder.png');
        AquaCycle.game.load.image('shark','assets/shark.png');
        AquaCycle.game.load.image('mulletfish', 'assets/mulletfish.png');
        AquaCycle.game.load.image('tuna', 'assets/tuna.png');
        AquaCycle.game.load.image('grouper', 'assets/grouper.png');

        // Load the item images
        AquaCycle.game.load.image('shipwreck','assets/shipwreck.png');
        AquaCycle.game.load.image('seagrass', 'assets/seagrass.png');
        AquaCycle.game.load.image('sanddollar', 'assets/sanddollar.png');
        AquaCycle.game.load.image('conchshell', 'assets/conchshell.png');
        AquaCycle.game.load.image('soda','assets/soda.png');
        AquaCycle.game.load.image('sixpack','assets/sixpack.png');
    },

    create: function() {
        this.state.start('Game');
    }

}

