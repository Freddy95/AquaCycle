var AquaCycle = AquaCycle || {};

AquaCycle.Boot = function(){};

//configure loading
AquaCycle.Boot.prototype = {

    preload: function() {
        //use this to load assets for load screen
    },

    create: function(){
        //background of loading
        this.game.stage.backgroundColor = 'blue';

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //TODO: figure out physics system before we get too far
        this.game.physics.startSystem(Phaser.Physics.ARACDE);
        
        this.state.start('Preload');
    }
}