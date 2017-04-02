var AquaCycle = AquaCycle || {};

AquaCycle.preload = function(){};

AquaCycle.preload.prototype = {
    preload: function(){
        //loading screen??
        //example this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    },

    create: function(){
        this.state.start('Game');
    }

}