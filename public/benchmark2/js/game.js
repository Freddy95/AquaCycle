var AquaCycle = AquaCycle || {};
AquaCycle.Game = function(){};
// global variables to be initialized
var controls;

//this is the toggle boolean for chaning the user's speed from "running" to "walking",
var movingSlow = false;

AquaCycle.Game.prototype = {
    create: function(){
        //create the keyboard controls self explanatory, walking speed will be related to shift key
        this.controls = {
            UP:             this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            DOWN:           this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            LEFT:           this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            RIGHT:          this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            TOGGLE_SPEED:   this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
            PAUSE:          this.game.input.keyboard.addKey(Phaser.Keyboard.ESC),
        };
        //add a listener function the shift key to toggle walking speed
        this.controls.PAUSE.onDown.add(function(){
                movingSlow = !movingSlow;
        },this);
        //add a listener function to esc key to generate pause menu
        this.controls.PAUSE.onDown.add(pauseGame);
    },

    update: function(){
        
    },

    //TODO: figure out how to pause the game
    pauseGame: function(){

    }
}
