/* Skeleton complete, what's left to do is to load object locations from the map */

var AquaCycle = AquaCycle || {};
AquaCycle.Game = function(){};
// global variables to be initialized
var controls, player, predators;
var map, backgroundlayer;
var infobox, infotext, infostyle;
var result;
//this is the toggle boolean for chaning the user's speed from "running" to "walking",
var movingSlow = false;
var gamePaused = false;
var playerLoaded = false;
var predatorsMoving = false;
var SLOW_VELOCITY = 100;
var FAST_VELOCITY = 200;
var playerSpeed = 200;
AquaCycle.Game.prototype = {
    create: function(){
        this.loadLevel();

        //this.map.setCollisionBetween(1,)
        //this.backgroundlayer.resizeWorld();
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
                if(this.movingSlow){
                    playerSpeed = SLOW_VELOCITY;
                }
                else{
                    playerSpeed = FAST_VELOCITY;
                }
        },this);

        //add a listener function to esc key to generate pause menu
        this.controls.PAUSE.onDown.add(this.pauseGame,this);
        this.loadPlayer();
        this.loadPredators();
        this.loadInfoBox();
    },

    update: function(){
        //if the modal is shown and the game is not paused it should be
        if($('#myModal').hasClass('in') && !this.game.paused){
            console.log("should be paused");
            this.game.paused = true;
            this.gamePaused = !this.gamePaused;
        }


        //player movement method
        if(playerLoaded){
            this.game.physics.arcade.collide(this.player,this.predators);
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.body.angularVelocity = 0;
            this.player.animations.play("move",20,true);
            this.processMovement();
            this.movePredators();
        }
      
        
    },
    /*
        Method for update to be called when game is paused
    */
    pauseUpdate: function(){
        //if the pause menu is not shown the game should be playing
        if(!($('#myModal').hasClass('in')) && this.game.paused){
            console.log("should be unpaused");
            this.game.paused = false;
            this.gamePaused = !this.gamePaused;
        }
    },
    /*
        Method to get user input and then change the playe sprites speed
    */
    processMovement: function(){
        if(this.controls.LEFT.isDown){
            //change velocity varying on if the player is moving slow
            this.player.body.angularVelocity = -playerSpeed;
        }

        else if(this.controls.RIGHT.isDown) {
            this.player.body.angularVelocity = playerSpeed;
        }

        //TODO:FIgure out how to rotate from center
        if(this.controls.UP.isDown) {
                this.player.body.velocity.copyFrom(
                    this.game.physics.arcade.velocityFromAngle(this.player.angle,playerSpeed)
                    );
        }
    },

    //method to pause the game, will invert the paused boolean once pressed;
    pauseGame: function(){
        if(this.gamePaused){
            console.log("unpaused");
            this.game.paused = false;
        } else {
            console.log("paused");
            this.game.paused = true;
        }
        $('#btn').click();
        this.gamePaused = !this.gamePaused;
    },

    /*
        This method will get the information on mouseclick down of a certain object clicked
        In theory this will be a listener function added dynamically to each object generated
    */
    getObjectInformation: function(){
        
    },

    loadPlayer: function(){
        this.player = AquaCycle.game.add.sprite(128,64,'player');
        this.player.animations.add('move',[1,3,5,7,9,11,13,15,17,0,2,4,6,8,10,12,14,16]);
        AquaCycle.game.physics.arcade.enable(this.player);
        AquaCycle.game.camera.follow(this.player);
        this.player.anchor.setTo(0.5,0.5);
        playerLoaded = true;
    },

    loadLevel:function(){
        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('tileset','world');
        this.map.addTilesetImage('enemy', 'shark');
        this.backgroundLayer = this.map.createLayer('background');
        this.backgroundLayer.resizeWorld();   
    },

    loadPredators: function(){
        this.predators = this.game.add.group();
        this.predators.enableBody = true;
        var predator;
        result = this.findObjectsByType('predator',this.map,'objectsLayer');
         
        console.log("result");
        console.log(result);
        result.forEach(function(element){
            element.properties.sprite = 'shark'
            this.createFromTiledObject(element,this.predators);
        },this);

        this.predators.forEach(function(predator){
            predator.isMoving = false;
        });

        
    },
    
    movePredators: function(){
        this.predators.forEach(function(predator){
            if(predator.isMoving == false){
                predator.isMoving = true;
                
                var randomDirection = AquaCycle.game.rnd.integerInRange(0,1);
                console.log(randomDirection);
                if(randomDirection == 0){
                    predator.body.velocity.x = 150;
                }
                if(randomDirection == 1){
                    predator.body.velocity.x = -150
                }
                
                AquaCycle.game.time.events.add(600,this.stopPredators,this);
                
              
            }
            
        });
    },

    stopPredators: function(){
        console.log(hello);
        this.predators.forEach(function(predator){
            predator.isMoving = false;
        });
    },

    loadInfoBox: function() {
    	//this.infobox = this.game.add.sprite(1004,556,'infobox');
    	this.infobox = this.game.add.sprite(940,520,'infobox');
    	this.infobox.alpha = 0.8;
    	this.infostyle = { font: '14px Arial', fill: '#2a4157', wordWrap: true, wordWrapWidth: this.infobox.width - 10, boundsAlignH: 'right' };
    	this.infotext = this.game.add.text(0,0,'Information:\nThis is an example of the text that would go in this information box. I am going to keep typing for a long time so I can fill the box somewhat and get an example of what the text wrap may look like. I think this is long enough. Goodbye.',this.infostyle);
    	this.infotext.x = this.infobox.x + 5;
    	this.infotext.y = this.infobox.y + 5;
    },

    findObjectsByType: function(type,map,layer){
        var result = new Array();
        map.objects[layer].forEach(function(element){
            if(element.properties.type === type){
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element,group){

        var sprite = group.create(element.x,element.y,element.properties.sprite);
        Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
        });
    }
}
