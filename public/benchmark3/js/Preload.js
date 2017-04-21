var AquaCycle = AquaCycle || {};

AquaCycle.Preload = function(){};

AquaCycle.Preload.prototype = {
    preload: function(){
        // Load the levels of the game and their assets
        AquaCycle.game.load.tilemap('level1','../assets/level1.json',null,Phaser.Tilemap.TILED_JSON);
        AquaCycle.game.load.image('world1','../assets/DepthTileMockups.png');
        AquaCycle.game.load.image('world2','../assets/Tiled/DepthTileMockups.png');
        AquaCycle.game.load.image('infobox','../assets/infobox.png');
        AquaCycle.game.load.image('heart','../assets/heart.png');

        // Load the player sprite sheets
        AquaCycle.game.load.spritesheet('player', '../assets/blacktip_shark.png',128,64);

        // Load the predator sprite sheets
        AquaCycle.game.load.spritesheet('predator','../assets/tiger_shark.png',192,96);

        // Load the prey sprite sheets
        AquaCycle.game.load.image('pinkshrimp','../assets/pinkshrimp.png');
        AquaCycle.game.load.image('brownshrimp','../assets/brownshrimp.png');

        // Load the item images
        AquaCycle.game.load.image('shipwreck','../assets/shipwreck.png');
        AquaCycle.game.load.image('seagrass', '../assets/seagrass.png');
        AquaCycle.game.load.image('sanddollar', '../assets/sanddollar.png');
        AquaCycle.game.load.image('conchshell', '../assets/conchshell.png');
        AquaCycle.game.load.image('shark','../assets/shark.png');
    },

    create: function() {
        this.state.start('Game');
    }

}