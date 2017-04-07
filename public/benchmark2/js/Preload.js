var AquaCycle = AquaCycle || {};

AquaCycle.Preload = function(){};

AquaCycle.Preload.prototype = {
    preload: function(){
        //loading screen??
        //example this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        AquaCycle.game.load.spritesheet('player', '../assets/shark.png',64,128);
        AquaCycle.game.load.script('Load_Player.js','Load_Player.js')
    },

    create: function(){
        this.state.start('Game');
    }

}