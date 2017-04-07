var AquaCycle = AquaCycle || {};
AquaCycle.Game = function(){};
// global variables to be initialized
var controls,player;

//this is the toggle boolean for chaning the user's speed from "running" to "walking",
var movingSlow = false;
var gamePaused = false;
var playerLoaded = false;
var SLOW_VELOCITY = 100;
var FAST_VELOCITY = 200;

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
        this.controls.TOGGLE_SPEED.onDown.add(function(){
                this.movingSlow = !this.movingSlow;
                console.log(this.movingSlow);
        },this);

        //add a listener function to esc key to generate pause menu
        this.controls.PAUSE.onDown.add(this.pauseGame,this);
        this.loadPlayer();
    },

    update: function(){
        //player movement method
        if(playerLoaded){
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.body.angularVelocity = 0;
            this.processMovement();
            console.log(this.controls);
        }
      
        
    },

    /*
        Method to get user input and then change the playe sprites speed
    */
    processMovement: function(){
        console.log("hello");
        if(this.controls.LEFT.isDown){
            console.log("left")
            //change velocity varying on if the player is moving slow
            if(this.movingSlow) {
                this.player.body.angularVelocity = -SLOW_VELOCITY;
            }
            else {
                this.player.body.angularVelocity = -FAST_VELOCITY;
            }
        }

        else if(this.controls.RIGHT.isDown) {
            if(this.movingSlow) {
                this.player.boy.angularVelocity = SLOW_VELOCITY;
            }
            else{
                this.player.body.angularVelocity = FAST_VELOCITY;
            }
        }

        //TODO:FIgure out how to rotate from center
        if(this.controls.UP.isDown) {
            this.player.body.velocity.copyFrom(
                this.game.physics.arcade.velocityFromAngle(this.player.angle,300));
        }
    },

    //method to pause the game, will inver the paused boolean once pressed;
    //TODO:display an html pause menu page
    pauseGame: function(){
        if(this.gamePaused){
            console.log("unpaused");
            this.game.paused = false;
        } else {
            console.log("paused");
            this.game.paused = true;
        }
        this.gamePaused = !this.gamePaused;
    },

    /*
        This method will get the information on mouseclick down of a certain object clicked
        In theory this will be a listener function added dynamically to each object generated
    */
    getObjectInformation: function(){

    },

    loadPlayer: function(){
        this.player = AquaCycle.game.add.sprite(300,200,'player');
        AquaCycle.game.physics.arcade.enable(this.player);
        AquaCycle.game.camera.follow(this.player);
        playerLoaded = true;
    },

    loadLevel:function(){
        
    }
}
