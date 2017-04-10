var AquaCycle = AquaCycle || {};

AquaCycle.Preload = function(){};

AquaCycle.Preload.prototype = {
    preload: function(){
        AquaCycle.game.load.spritesheet('player', '../assets/SharkSpriteSheet2.png',128,64);
        AquaCycle.game.load.image('shipwreck','../assets/shipwreck2.png');
        AquaCycle.game.load.tilemap('level1','../assets/level1_draft2.json',null,Phaser.Tilemap.TILED_JSON);
        AquaCycle.game.load.image('world','../assets/DepthTileMockups.png');
        AquaCycle.game.load.image('world1','../assets/GIMP/DepthTileMockups1.png');
        AquaCycle.game.load.image('world2','../assets/Tiled/DepthTileMockups.png');
        AquaCycle.game.load.image('shark','../assets/shark.png');
        AquaCycle.game.load.spritesheet('predator','../assets/LargerEnemySpriteSheet.png',192,96);
        AquaCycle.game.load.image('infobox','../assets/infobox.png');
        AquaCycle.game.load.image('heart','../assets/heart.png');
    },

    create: function() {
        this.state.start('Game');
    }

}