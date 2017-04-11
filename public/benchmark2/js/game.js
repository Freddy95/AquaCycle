/* Skeleton complete, what's left to do is to load object locations from the map */

var AquaCycle = AquaCycle || {};
AquaCycle.Game = function(){};
// global variables to be initialized
var controls, player, predators;
var map, backgroundlayer;
var infobox, infotext, infostyle, typetext, typestyle;
var healthBar;
var expBar;
var result;
var itemsFound = [];
//this is the toggle boolean for chaning the user's speed from "running" to "walking",
var movingSlow = false;
var gamePaused = false;
var playerLoaded = false;
var predatorsMoving = false;
var deathPlaying = false;
var SLOW_VELOCITY = 200;
var FAST_VELOCITY = 500;
var playerSpeed = 350;
var IDLE_ANIM;
var SLOW_ANIM;
var FAST_ANIM;

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
        
        this.loadPrey();
        this.loadItems();
        this.loadPredators();
        this.loadPlayer();
        // These always have to be called last
        this.loadHealthBar();
        this.loadExperienceBar();
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
            this.game.physics.arcade.collide(this.player, this.predators, this.takeDamage, null, this);
            this.game.physics.arcade.collide(this.player, this.blockedLayer);
            this.game.physics.arcade.collide(this.predators,this.blockedLayer);
            this.game.physics.arcade.overlap(this.player, this.prey, this.eat, null, this);
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.body.angularVelocity = 0;
            
            this.processMovement();
            this.scalePlayer();
            this.movePredators(this);
            this.movePrey(this);
        }

        if(expBar.width == 200) {
            $('#winbtn').click();
            this.game.paused = true;
        }
    },

    eat: function(player, edible) {
    	// Eat a shrimp
    	edible.destroy();
    	//add to experience bars
        if(expBar.width < 200){
            expBar.width = expBar.width + 5;
            //this is down bc this is an anonymous function and lost context of "this"
            console.log(this);
        }
    },

    takeDamage: function() {
    	// The player has hit something that will cause it to take damage
    	if(!this.player.invincible) {
    		if(this.healthBar.children[1] == null) {
    			// play a dying animation and end the game
                this.healthBar.children.pop();
    			//console.log("You died.");
                $('#diebtn').click();
                this.game.time.events.add(0,this.playDeath,this,false);
                this.game.time.events.add(50,this.playDeath,this,true);
                //this.game.paused = true;

    		} else {
    			// Remove one heart from the health bar
    			this.healthBar.children.pop();
		        // Change player's vulnerability
		        this.vulnerable();
		        // Change the player's alpha level
		        this.player.alpha = 0.5;
		        // Add timer event to change back vulnerability
		        this.game.time.events.add(2000, this.vulnerable, this);
    		}
    	}
    },
    playDeath: function(finished){
        if(!deathPlaying){
            deathPlaying = true;
            var newSize = this.player.scale.x/1.2;
            this.player.scale.setTo(newSize,newSize);
            if(finished){
                console.log("You died.");
                $('#diebtn').click();
                this.game.paused = true;
            }
            deathPlaying = false;
        }
    },

    vulnerable: function() {
    	// Change the player's invincibility
	    this.player.invincible = !this.player.invincible;
	    // Change the player's alpha level back
	    this.player.alpha = 1;
    },
    /*
        Method for update to be called when game is paused
    */
    pauseUpdate: function(){
        //if the pause menu is not shown the game should be playing
        if(!($('#myModal').hasClass('in')) && this.game.paused && !(this.healthBar.children[1] == null) && this.expBar.width != 200){
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
                //check player velocity to determine animation to play
                if(playerSpeed == SLOW_VELOCITY){
                    this.player.animations.play('slow');
                }else{
                    this.player.animations.play('fast');
                }
        }else{
            //check to see if player is currently idling
            if(this.player.animations.currentAnim !=  IDLE_ANIM){
                this.player.animations.play('idle');
            }
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
        //add to user
        console.log('player');
        console.log(this);
        if(this.objs.indexOf(this.object.name) === -1){
            this.objs.push(this.object.name);
            
            var objectImage = "<img src=\"../assets/" + this.object.name + ".png\" class=\"item\">"
            $('#items').append(objectImage);
        }
        //add to experience bars
        if(expBar.width < 200){
            expBar.width = expBar.width + 20;
            //this is down bc this is an anonymous function and lost context of "this"
            console.log(this);
        }
        infotext.text = this.object.info;
        // Changing the title and color for each type of item
        if(this.object.type == "predator") {
        	// Set style and change title
        	typetext.text = "Predator Information";
        	typestyle = { font: '20px Arial', fill: 'red' };
        	typetext.setStyle(typestyle);
        } else if (this.object.type == "item") {
        	// Set style and change title
        	typetext.text = "Item Information";
        	typestyle = { font: '20px Arial', fill: 'blue' };
        	typetext.setStyle(typestyle);
        } else if (this.object.type == "prey") {
        	// Set style and change title
        	typetext.text = "Prey Information";
        	typestyle = { font: '20px Arial', fill: 'green' };
        	typetext.setStyle(typestyle);
        }
    },

    loadPlayer: function(){
        result = this.findObjectsByType('playerStart', this.map, 'itemLayer')
        this.player = AquaCycle.game.add.sprite(result[0].x,result[0].y,'player');
        IDLE_ANIM = this.player.animations.add('idle',[1,3,5,7,9,11,13,15,17,0,2,4,6,8,10,12,14,16], 10, true);
        SLOW_ANIM = this.player.animations.add('slow',[1,3,5,7,9,11,13,15,17,0,2,4,6,8,10,12,14,16],20, true);
        FAST_ANIM = this.player.animations.add('fast',[1,3,5,7,9,11,13,15,17,0,2,4,6,8,10,12,14,16],30, true);
        AquaCycle.game.physics.arcade.enable(this.player);
        AquaCycle.game.camera.follow(this.player);
        this.player.anchor.setTo(0.5,0.5);
        
        this.player.body.collideWorldBounds = true;
        playerLoaded = true;
        this.player.invincible = false;
        console.log(this.player);
    },

    loadLevel:function(){
        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('DepthTileMockups','world');
        //this.map.addTilesetImage('predator', 'predator');
        this.map.addTilesetImage('DepthTileMockups','world2');
        this.map.addTilesetImage('DepthTileMockups1','world1');
        this.backgroundLayer = this.map.createLayer("background");
        this.blockedLayer = this.map.createLayer("collideLayer");
        this.map.setCollisionBetween(1, 600, true, 'collideLayer');

        this.backgroundLayer.resizeWorld();   
    },

    //method to load predator from the tileset, as of right now its hardcoded to only get shark sprit
    loadPredators: function(){
        this.predators = this.game.add.group();
        this.predators.enableBody = true;
        var predator;
        result = this.findObjectsByType('predator',this.map,'itemLayer');
        
        result.forEach(function(element){
            element.properties.sprite = 'predator'
            this.createFromTiledObject(element,this.predators);
        },this);  
        for (var i = 0; i < this.predators.hash.length; i++) {
            predator = this.predators.hash[i];
           
            //click event
            console.log(this.player);
            predator.events.onInputDown.add(this.getObjectInformation, {objs : itemsFound, object : predator });
        }

        this.predators.forEach(function(predator){
            predator.isMoving = false;
            predator.body.collideWorldBounds = true;
            predator.anchor.setTo(0.5,0.5);
            
            predator.animations.add('move',[1,3,5,7,9,11,13,15,17,0,2,4,6,8,10,12,14,16]);
            //allows predators to be clicked on
            predator.inputEnabled = true;
        });

        
    },

    //method to load prey from the tileset
    loadPrey: function(){
        this.prey = this.game.add.group();
        this.prey.enableBody = true;
        var p;
        var result = this.findObjectsByType('prey',this.map,'itemLayer');
        
        console.log(result);
        result.forEach(function(element) {
            element.properties.sprite = element.properties.name;
            this.createFromTiledObject(element,this.prey);
        },this);  

        for (var i = 0; i < this.prey.hash.length; i++) {
            p = this.prey.hash[i];
           
            //click event
            p.events.onInputDown.add(this.getObjectInformation, {object : p, objs : itemsFound});
        }

        this.prey.forEach(function(p){
            p.isMoving = false;
            p.body.collideWorldBounds = true;
            p.anchor.setTo(0.5,0.5);
            
            //allows prey to be clicked on
            p.inputEnabled = true;
        });

        
    },

    loadItems: function(){
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;
        var result = this.findObjectsByType('item', this.map, 'itemLayer');


        result.forEach(function(element){
            element.properties.sprite = element.properties.name;
            this.createFromTiledObject(element,this.items);
        },this);  
        for (var i = 0; i < this.items.hash.length; i++) {
            item = this.items.hash[i];
           
            //click event
            item.events.onInputDown.add(this.getObjectInformation, {object : item, objs : itemsFound});
        }

        this.items.forEach(function(it){
            it.inputEnabled = true;
        });

    },

    movePredators: function(){
        this.predators.forEach(function(predator){
            if(predator.isMoving == false){
                predator.isMoving = true;
                predator.animations.play("move",20,true);
                var randomDirection = this.game.rnd.integerInRange(0,10);
                if(randomDirection <= 5){
                    predator.body.angularVelocity = -this.game.rnd.integerInRange(0,150);
                }
                if(randomDirection > 6){
                    predator.body.angularVelocity = this.game.rnd.integerInRange(0,150);
                }
                predator.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(predator.angle,150));
                //var randomTime = this.game.rnd.integerInRange(1,8)*100;
                //this.game.time.events.add(randomTime,this.anglePredators,this);
                this.game.time.events.add(1000,this.stopPredators,this); 
            }
            
        },this);
    },

    stopPredators: function(){
        this.predators.forEach(function(predator){
            predator.isMoving = false;
            predator.body.velocity.x = 0;
            predator.body.velocity.y = 0;
            predator.body.angularVelocity = 0;
        });
    },

    movePrey: function(){
        this.prey.forEach(function(p){
            if(p.isMoving == false){
                p.isMoving = true;
                var randomDirection = this.game.rnd.integerInRange(0,10);
                if(randomDirection <= 5){
                    p.body.angularVelocity = -this.game.rnd.integerInRange(0,150);
                }
                if(randomDirection > 6){
                    p.body.angularVelocity = this.game.rnd.integerInRange(0,150);
                }
                p.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(p.angle,150));
                this.game.time.events.add(1000,this.stopPrey,this); 
            }
            
        },this);
    },

    stopPrey: function(){
        this.prey.forEach(function(p){
            p.isMoving = false;
            p.body.velocity.x = 0;
            p.body.velocity.y = 0;
            p.body.angularVelocity = 0;
        });
    },

    loadInfoBox: function() {
    	// Add the info box and the infobox text
    	infobox = this.game.add.sprite(950,10,'infobox');
    	infobox.alpha = 0.8;
    	infobox.fixedToCamera = true;
    	infostyle = { font: '20px Arial', fill: '#2a4157', wordWrap: true, wordWrapWidth: infobox.width - 10, boundsAlignH: 'right' };
    	infotext = this.game.add.text(0,0,'', infostyle);
    	infotext.x = infobox.x + 5;
    	infotext.y = infobox.y + 30;
    	infotext.fixedToCamera = true;

    	// Add the type text to the box
    	typestyle = { font: '20px Arial', fill: '#2a4157', boundsAlignH: 'center' };
    	typetext = this.game.add.text(0,0,'Information Box',typestyle);
    	typetext.x = infobox.x + 5;
    	typetext.y = infobox.y + 5;
    	typetext.fixedToCamera = true;
    },

    loadHealthBar: function() {
    	// Load the health bar
	    this.healthBar = this.game.add.group();
	    // Add health bar heart by heart
	    for (var i = 0; i < 5; i++) {
	        var heart = this.healthBar.create(i * 32, 32, 'heart');
	    }
	    // Fix the health bar to the camera
	    this.healthBar.fixedToCamera = true;
    },

    loadExperienceBar: function(){
        //this is the background of the bar
        var bmd = this.game.add.bitmapData(200,40);
         bmd.ctx.beginPath();
         bmd.ctx.rect(0,0,180,30);
         //color of background
         bmd.ctx.fillStyle = '#3c3c3c';
         bmd.ctx.fill();
         var b = this.game.add.sprite(10,30, bmd);
         b.fixedToCamera = true;
         b.anchor.y = 0.5;
         //actual bar
         var exp = this.game.add.bitmapData(200,40);
         exp.ctx.beginPath();
         exp.ctx.rect(0,0,180,30);
         //color filled in
         exp.ctx.fillStyle = '#a8c3d4';
         exp.ctx.fill();    
         expBar = this.game.add.sprite(10,30,exp);
         expBar.width = 0;       
         expBar.fixedToCamera = true;
         expBar.anchor.y = 0.5;
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
    },

    scalePlayer:function(){
        if(this.healthBar.children[1]!=null){
                if(expBar.width<=60){
                    this.player.scale.setTo(0.7,0.7);
                }
                else if(expBar.width<=120){
                    this.player.scale.setTo(1.0,1.0);
                }
                else if(expBar.width >120){
                    this.player.scale.setTo(1.4, 1.4);
                }
            }
    },
    addObjectToPlayer:function(object){
        
    }    
}


