var AquaCycle = AquaCycle || {};

AquaCycle.Preload = function(){};

AquaCycle.Preload.prototype = {
    preload: function(){
        //loading screen??
        //example this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        AquaCycle.game.load.spritesheet('player', '../assets/SharkSpriteSheet2.png',128,64);
        AquaCycle.game.load.tilemap('level1','../assets/level1_draft_enemies.json',null,Phaser.Tilemap.TILED_JSON);
        AquaCycle.game.load.image('world','../assets/DepthTileMockups.png');
        AquaCycle.game.load.image('shark','../assets/shark.png')
        AquaCycle.game.load.image('infobox','../assets/infobox2.png');
        AquaCycle.game.load.image('heart','../assets/heart.png');
    },

    create: function(){
        this.state.start('Game');
    }

}