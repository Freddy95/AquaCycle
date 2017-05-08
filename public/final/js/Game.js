var AquaCycle = AquaCycle || {};
AquaCycle.Game = function(){};
// Sprite Variables
var player, predators, prey;
// World Variables
var map, backgroundlayer, controls;
var infobox, infotext, infostyle, typetext, typestyle, foundstat;
var healthBar;
var expBar;
// Metric Variables
var result;
var itemsFound = [];
var totalItems;
// Moving Variables
var movingSlow = true;
var SLOW_VELOCITY = 200;
var FAST_VELOCITY = 400;
var playerSpeed = 200;
var predatorsMoving = false;
// Loading Variables
var gamePaused = false;
var playerLoaded = false;
// Animation Variables
var IDLE_ANIM;
var SLOW_ANIM;
var FAST_ANIM;
var DIE_ANIM;
var deathPlaying = false;
// Level Variables
var CURRENT_LEVEL;
var timer;
var currentObject;
var foundObject = false;
var objectsToFind = [];
var objectToFind;
// Sound Variables
var winMusicPlaying = false;
var movingSoundPlaying = false;
var discoverSound = new Audio("sounds/discover.mp3");
var winMusic = new Audio("sounds/winning.mp3");
var levelMusic;
AquaCycle.Game.prototype = {
    /*****************************************************
    *   CREATE FUNCTION
    ******************************************************/
    create: function(){
        //$('#objective').empty();
        //$('#controls').empty();
        //$('#strategy').empty();
        this.checkCurrentLevel();
        this.loadLevel();

        levelMusic = AquaCycle.game.add.audio('bgMusic');
        levelMusic.play("",0,0.8,true);
        //create the keyboard controls self explanatory, walking speed will be related to shift key
        this.controls = {
            // GAME CONTROLS
            UP:             this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            LEFT:           this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            RIGHT:          this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            TOGGLE_SPEED:   this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
            PAUSE:          this.game.input.keyboard.addKey(Phaser.Keyboard.ESC),
            // CHEAT CONTROLS
            INVINCIBLE:     this.game.input.keyboard.addKey(Phaser.Keyboard.I),
            EXPERIENCE:     this.game.input.keyboard.addKey(Phaser.Keyboard.E),
            TIME:           this.game.input.keyboard.addKey(Phaser.Keyboard.T),
            ONE:            this.game.input.keyboard.addKey(Phaser.Keyboard.ONE),
            TWO:            this.game.input.keyboard.addKey(Phaser.Keyboard.TWO),
            THREE:          this.game.input.keyboard.addKey(Phaser.Keyboard.THREE),
            LOSE:           this.game.input.keyboard.addKey(Phaser.Keyboard.L),
            WIN:            this.game.input.keyboard.addKey(Phaser.Keyboard.V)
        };
        //add a listener function the shift key to toggle walking speed
        playerSpeed = SLOW_VELOCITY;
        this.movingSlow = true;
        this.controls.TOGGLE_SPEED.onDown.add(function(){
                this.movingSlow = !this.movingSlow;
                if(this.movingSlow){
                    playerSpeed = SLOW_VELOCITY;
                }
                else{
                    playerSpeed = FAST_VELOCITY;
                }
        },this);

        this.controls.WIN.onDown.add(function(){
            expBar.width = 200;
        },this);

        this.controls.LOSE.onDown.add(function(){
            while(this.healthBar.children[1] != null) {
                this.healthBar.children.pop();
            }
            this.takeDamage();
        },this);

        this.controls.INVINCIBLE.onDown.add(function(){
            // Change player's vulnerability
            this.vulnerable();
            // Change the player's alpha level
            this.player.alpha = 0.5;
            // Add timer event to change back vulnerability
            this.game.time.events.add(2000, this.vulnerable, this);
        },this);
        //experience bar cheat
        this.controls.EXPERIENCE.onDown.add(function(){
            this.increaseExpBar(20);
        }, this);
        //time cheat
        this.controls.TIME.onDown.add(function(){
            if(CURRENT_LEVEL != "1"){
                timer.text = parseInt(timer.text) + 5;
            }
        }, this);
        //add a listener function so that when the one button is pressed level one is loaded
        /*
            TODO: IF we can save a cookie we can keep track of what level the  player is currently
            on that way we can just check to see what level the user is on via cookie and load the appropriate level
        */
        this.controls.ONE.onDown.add(function(){
            Cookies.set('currentLevel','1');
            history.go(0)
        },this);

        this.controls.TWO.onDown.add(function(){
            Cookies.set('currentLevel','2');

            history.go(0);
        },this);

        this.controls.THREE.onDown.add(function(){
            Cookies.set('currentLevel','3');
            history.go(0);
        },this);

        //add a listener function to esc key to generate pause menu
        this.controls.PAUSE.onDown.add(this.pauseGame,this);
        

        this.loadTrash();
        this.loadPrey();
        this.loadItems();
        this.loadPredators();
        this.loadPlayer();
        // These always have to be called last
        this.loadHealthBar();
        this.loadExperienceBar();
        this.loadInfoBox();
        if(CURRENT_LEVEL == "2" || CURRENT_LEVEL == "3") {
            this.loadTimer();
        }

        this.game.paused = true;
    },

    /*****************************************************
    *   UPDATE FUNCTION
    ******************************************************/
    update: function(){
        // if the modal is shown and the game is not paused it should be
        if(!($('#myModal').hasClass('in')) && this.game.paused){
            this.pauseGame();
            return;
        }

        // if the modal is shown and the game is not paused it should be
        if($('#myModal').hasClass('in') && !this.game.paused){
            console.log("should be paused");
            this.game.paused = true;
            this.gamePaused = !this.gamePaused;
            
        }
       
        //player movement method
        if(playerLoaded){
            this.game.physics.arcade.collide(this.player, this.predators, this.takeDamage, null, this);
            this.game.physics.arcade.collide(this.predators, this.predators);
            this.game.physics.arcade.collide(this.player, this.blockedLayer);
            this.game.physics.arcade.collide(this.predators,this.blockedLayer);
            this.game.physics.arcade.collide(this.prey, this.blockedLayer);
            this.game.physics.arcade.overlap(this.player, this.prey, this.eat, null, this);
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.body.angularVelocity = 0;
            
            this.processMovement();
            //this.scalePlayer();
            this.movePredators(this);
            this.movePrey(this);
        }

        if(expBar.width >= 200) {
            //had to create a method in the main javascript file so that the music would play while game paused
            setTimeout(playWinningMusic,1);
            this.game.paused = true;
        }
    },


    
    /*****************************************************
    *   WORLD & LEVEL FUNCTIONS
    ******************************************************/
    loadLevel: function(){
        if(CURRENT_LEVEL == "1") {
            // Load level 1
            this.map = this.game.add.tilemap('level1');
            this.map.addTilesetImage('tiles','tiles');
            this.backgroundLayer = this.map.createLayer("backgroundLayer");
            this.blockedLayer = this.map.createLayer("collideLayer");
            this.map.setCollisionBetween(1, 600, true, 'collideLayer');
            this.backgroundLayer.resizeWorld();
            // Set the total number of items
            totalItems = 8;
            // Set the modal text
            var objective = "<p>For this level, you must collect enough <b>experience</b> to fill the <b>experience bar</b> in the top left. You can gain a little experience by eating prey, but most of your experience will come from interacting with different objects in the ocean. Be careful though, there are <em>predators</em> who will hunt you if you make yourself noticeable.</p>";
            $('#objective').append(objective);

            var controls = "<p><em>Keyboard Controls:</em></p><p>| <b>W</b> | Press this button to move forward</p><p>| <b>A</b> | Press this button to move to the left</p><p>| <b>D</b> | Press this button to move to the right</p><p>| <b>SHIFT</b> | Press this button to toggle moving slow and fast</p><p>| <b>ESC</b> | Press this button to enter and exit this menu</p><br><p><em>Mouse Controls:</em></p><p>While moving around, use your mouse to click on different objects in the game world. Finding new objects will earn you <b>experience</b> and facts about the objects will appear in the <b>Objects Found</b> tab of this menu.</p>";
            $('#controls').append(controls);

            var strategy = "<p>The <b>closer</b> you are to a fish, and the <b>faster</b> you are moving, the more likely it is that they will notice you. For <em>hunting</em>, move slowly toward your prey, then, just before they are about to run away, speed up in a zig zag motion to make a quick catch. Be <em>careful</em> though, if you move too quickly you'll catch the attention of other predators looking for a meal.</p>";
            $('#strategy').append(strategy);

            //set max level
            if(Cookies.get('maxLevel') == null){
                Cookies.set('maxLevel', "1");
            }
        } else if(CURRENT_LEVEL == "2") {
            // Load level 2
            this.map = this.game.add.tilemap('level2');
            this.map.addTilesetImage('tiles','tiles');
            this.backgroundLayer = this.map.createLayer("backgroundLayer");
            this.blockedLayer = this.map.createLayer("collideLayer");
            this.map.setCollisionBetween(1, 600, true, 'collideLayer');
            this.backgroundLayer.resizeWorld();
            // Set the total number of items
            totalItems = 6;
            // Set the modal text
            var objective = "<p>For this level, you must eat enough <b>prey</b> to fill the <b>progress bar</b> before the <b>timer</b> in the top left runs out. You can gain more time by interacting with different objects in the ocean. Be careful though, there are <em>predators</em> who will hunt you if you make yourself noticeable.</p>";
            $('#objective').append(objective);

            var controls = "<p><em>Keyboard Controls:</em></p><p>| <b>W</b> | Press this button to move forward</p><p>| <b>A</b> | Press this button to move to the left</p><p>| <b>D</b> | Press this button to move to the right</p><p>| <b>SHIFT</b> | Press this button to toggle moving slow and fast</p><p>| <b>ESC</b> | Press this button to enter and exit this menu</p><br><p><em>Mouse Controls:</em></p><p>While moving around, use your mouse to click on different objects in the game world. Finding new objects will earn you <b>more time</b> and facts about the objects will appear in the <b>Objects Found</b> tab of this menu.</p>";
            $('#controls').append(controls);

            var strategy = "<p>The <b>closer</b> you are to a fish, and the <b>faster</b> you are moving, the more likely it is that they will notice you. For <em>hunting</em>, move slowly toward your prey, then, just before they are about to run away, speed up in a zig zag motion to make a quick catch. Be <em>careful</em> though, if you move too quickly you'll catch the attention of other predators looking for a meal.</p><br><p><b>Don't forget about exploring</b>, it is unlikely you will be able to win without gaining a little more time to hunt so you can go unnoticed.</p>";
            $('#strategy').append(strategy);
            if(parseInt(Cookies.get('maxLevel')) < 2){
                Cookies.set('maxLevel', "2");
            }
        } else if(CURRENT_LEVEL == "3") {
            // Load level 3
            this.map = this.game.add.tilemap('level3');
            this.map.addTilesetImage('tiles','tiles');
            this.backgroundLayer = this.map.createLayer("backgroundLayer");
            this.blockedLayer = this.map.createLayer("collideLayer");
            this.map.setCollisionBetween(1, 600, true, 'collideLayer');
            this.backgroundLayer.resizeWorld();
            // Load the objects for the level
            objectsToFind = ["shark","seagrass","conchshell","sanddollar","grouper","tuna","mulletfish","soda","sixpack"];
            currentObject = objectsToFind.pop();
            // Set the total number of items
            totalItems = objectsToFind.length + 1;
            // Set the modal text
            var objective = "<p>For this level, you are on a <b>scavenger hunt</b> where you will be shown an object underneath the information box that you must locate before the timer runs out. When you find the object, click on it to register it to the <b>Objects Found</b> page in this menu. This will cause the <b>progress bar</b> to increase and you will recieve the next object to look for. Each time you find an object in the game the timer will reset, but any time you have left will be added to that base time. This means the faster you find an object, the more time you will have to find the next object. Eating prey will also give you a small amount of extra time.</p><br><p>Your <b>goal</b> is to find all the objects in the scavenger hunt, completely filling the progress bar.</p>";
            $('#objective').append(objective);

            var controls = "<p><em>Keyboard Controls:</em></p><p>| <b>W</b> | Press this button to move forward</p><p>| <b>A</b> | Press this button to move to the left</p><p>| <b>D</b> | Press this button to move to the right</p><p>| <b>SHIFT</b> | Press this button to toggle moving slow and fast</p><p>| <b>ESC</b> | Press this button to enter and exit this menu</p><br><p><em>Mouse Controls:</em></p><p>While moving around, use your mouse to click on different objects in the game world. Finding new objects will earn you <b>more time</b> and facts about the objects will appear in the <b>Objects Found</b> tab of this menu.</p>";
            $('#controls').append(controls);

            var strategy = "<p>The <b>closer</b> you are to a fish, and the <b>faster</b> you are moving, the more likely it is that they will notice you. For <em>hunting</em>, move slowly toward your prey, then, just before they are about to run away, speed up in a zig zag motion to make a quick catch. Be <em>careful</em> though, if you move too quickly you'll catch the attention of other predators looking for a meal.</p>";

            $('#strategy').append(strategy);

            //set cookie max level
            Cookies.set('maxLevel', "3");
            $('#nextLevelBtn').prop('disabled', true);
            $('#winNextLevelBtn').html("Restart").attr('onclick', 'javascript:history.go(0)');
        }
    },

    checkCurrentLevel: function() {
        //a jquery library to get the current level from a stored cookie
       CURRENT_LEVEL = Cookies.get('currentLevel');
       if (CURRENT_LEVEL == null ) {
            Cookies.set('currentLevel','1');
            CURRENT_LEVEL = Cookies.get("currentLevel");
       }
       else {
         CURRENT_LEVEL = Cookies.get('currentLevel');
       }
    },

    goToNextLevel: function(){
        //console.log(AquaCycle.game.state);
        if(CURRENT_LEVEL!="3"){
            var nextLevel = parseInt(CURRENT_LEVEL)+1;
            CURRENT_LEVEL = nextLevel.toString();
            Cookies.set('currentLevel',CURRENT_LEVEL);
            var maxLevel = Cookies.get('maxLevel');
            if(maxLevel == null){
                Cookies.set('maxLevel', nextLevel.toString());
            }else{
                if(parseInt(maxLevel) < nextLevel){
                    Cookies.set('maxLevel', nextLevel.toString());
                }
            }
            AquaCycle.game.state.start('Game');
            history.go(0);
        }
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

    loadInfoBox: function() {
        // Add the info box and the infobox text
        infobox = this.game.add.sprite(905,10,'infobox');
        infobox.alpha = 0.8;
        infobox.fixedToCamera = true;
        infostyle = { font: '20px Arial', fill: '#2a4157', wordWrap: true, wordWrapWidth: infobox.width - 10, boundsAlignH: 'right' };
        infotext = this.game.add.text(0,0,'', infostyle);
        infotext.x = infobox.x + 5;
        infotext.y = infobox.y + 55;
        infotext.fixedToCamera = true;

        // Get the number of items left found
        foundstat = this.game.add.text(0,0, 'Found ' + 0 + ' objects out of ' + totalItems ,infostyle);
        foundstat.x = infobox.x + 5;
        foundstat.y = infobox.y + 30;
        foundstat.fixedToCamera = true;

        // Add the type text to the box
        typestyle = { font: '20px Arial', fill: '#2a4157', boundsAlignH: 'center' };
        typetext = this.game.add.text(0,0,'Information Box',typestyle);
        typetext.x = infobox.x + 5;
        typetext.y = infobox.y + 5;
        typetext.fixedToCamera = true;

        if(CURRENT_LEVEL == "3") {
            objectToFind = this.game.add.sprite(905,100,currentObject);
            objectToFind.fixedToCamera = true;
        }
    },

    loadTimer: function(){
        this.game.add.text(210,10, "Time Remaining: ", null).fixedToCamera = true;
        timer = this.game.add.text(450,10, 20, null);
        timer.fixedToCamera = true;
        this.game.time.events.add(1000, this.decreaseTimer, this);
    },

    /*****************************************************
    *   HELPER FUNCTIONS
    ******************************************************/
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

    //TODO: think of a different way to call the sound playing
    decreaseTimer: function(){
        if(playerLoaded){
            timer.text = timer.text - 1;
            if(timer.text == 0){
                while(this.healthBar.children[1] != null) {
                    this.healthBar.children.pop();
                }
                this.takeDamage();
            }
            else{
                this.game.time.events.add(1000, this.decreaseTimer, this);
            }
            
        }
     
    },

    playDeath: function(){
        AquaCycle.game.camera.follow(this.dead_player);

        this.player.destroy();
        this.dead_player.animations.play('die');

        this.game.time.events.add(5000, this.endGame, this);
    },

    //add the dying music and play it
    playDyingMusic: function() {
        var dyingMusic = this.game.add.audio('dying');
        dyingMusic.play();
    },

    /*
        Method to see if the player is moving, if so play the apropriate
        sound effect for their current speed
    */
    playMovingSounds: function(){
        if(!movingSoundPlaying){
            movingSoundPlaying = true;
            if(this.controls.UP.isDown){

                if(playerSpeed == SLOW_VELOCITY){
                    movingSlowSound = this.game.add.audio('swimming_slow');
                    movingSlowSound.play();
                }
                else{
                    movingFastSpeed = this.game.add.audio('swimming_fast');
                    movingFastSpeed.play();
                }   
                setTimeout(function(){movingSoundPlaying=false},7000);
                
            }
        }
    },
    /**
        Increases experience bar width by value and then checks whether or not to scale the player
    */
    increaseExpBar: function(value){
        expBar.width += value;
        this.scalePlayer();
    },
    /*****************************************************
    *   PLAYER FUNCTIONS
    ******************************************************/
    loadPlayer: function(){
        result = this.findObjectsByType('playerStart', this.map, 'objectLayer')
        if(CURRENT_LEVEL == "1"){
            this.player = AquaCycle.game.add.sprite(result[0].x,result[0].y,'blacktipshark');
            IDLE_ANIM = this.player.animations.add('idle',[2,5,8,11,14,17,20,23,26,29,1,4,7,10,13,16,19,22,25,28], 10, true);
            SLOW_ANIM = this.player.animations.add('slow',[2,5,8,11,14,17,20,23,26,29,1,4,7,10,13,16,19,22,25,28], 20, true);
            FAST_ANIM = this.player.animations.add('fast',[2,5,8,11,14,17,20,23,26,29,1,4,7,10,13,16,19,22,25,28], 30, true);
        } else if(CURRENT_LEVEL == "2"){
            this.player = AquaCycle.game.add.sprite(result[0].x,result[0].y,'barracudafish');
            IDLE_ANIM = this.player.animations.add('idle',[3,7,11,15,2,6,10,14], 10, true);
            SLOW_ANIM = this.player.animations.add('slow',[3,7,11,15,2,6,10,14], 20, true);
            FAST_ANIM = this.player.animations.add('fast',[3,7,11,15,2,6,10,14], 30, true);
        } else if(CURRENT_LEVEL == "3") {
            this.player = AquaCycle.game.add.sprite(result[0].x,result[0].y,'seaturtle');
            IDLE_ANIM = this.player.animations.add('idle',[0,1,2,3,4,5], 10, true);
            SLOW_ANIM = this.player.animations.add('slow',[0,1,2,3,4,5], 20, true);
            FAST_ANIM = this.player.animations.add('fast',[0,1,2,3,4,5], 30, true);
        }
        
        AquaCycle.game.physics.arcade.enable(this.player);
        AquaCycle.game.camera.follow(this.player);
        this.player.anchor.setTo(0.5,0.5);
        this.player.scale.setTo(0.7,0.7);
        this.player.body.collideWorldBounds = true;
        playerLoaded = true;
        this.player.invincible = false;
        this.player.angle = -90;
    },

    // Method to get user input and then change the player sprite's speed
    processMovement: function(){
        if(this.controls.LEFT.isDown){
            //change velocity varying on if the player is moving slow
            this.player.body.angularVelocity = -playerSpeed;
        }

        else if(this.controls.RIGHT.isDown) {
            this.player.body.angularVelocity = playerSpeed;
        }

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
                this.game.time.events.add(0,this.playMovingSounds,this);
        }else {
            //check to see if player is currently idling
            if(this.player.animations.currentAnim !=  IDLE_ANIM){
                this.player.animations.play('idle');
            }
        }
    },


    eat: function(player, edible) {
        //add to experience bars
        if(CURRENT_LEVEL == "1" || CURRENT_LEVEL == "2") {
            if(expBar.width < 200) {
                if(itemsFound.indexOf(edible.name) === -1) {
                    itemsFound.push(edible.name);
                    
                    var objectInfo = "<div class=\"row\"><div class=\"col-md-3 image\"><img src=\"assets/" + edible.name + ".png\" id=\"prey\"></div><div class=\"col-md-9\">" + edible.info + "</div></div><br></br>";
                    $('#items').append(objectInfo);

                    //expBar.width = expBar.width + 20;
                    this.increaseExpBar(20);
                    foundstat.text = "Found " + itemsFound.length + " objects out of " + totalItems;
                } else {
                    if(CURRENT_LEVEL == "2") {
                        //expBar.width = expBar.width + 20;
                        this.increaseExpBar(20);
                    } 
                    else if (CURRENT_LEVEL == "1") {
                        //expBar.width = expBar.width + 5;
                        this.increaseExpBar(5);
                    }
                }
                // Set style and change title
                infotext.text = "Press ESC for more information.";
                typetext.text = "Prey Added to Objects Found";
                typestyle = { font: '20px Arial', fill: 'green' };
                typetext.setStyle(typestyle);
                // Eat a shrimp
                edible.destroy();
            }
        } else {
            // Level 3 logic for eating
            edible.destroy();
            // Increase the amount of time they have to find the next item
            timer.text = parseInt(timer.text) + 5;
        }
    },

    takeDamage: function() {
        // The player has hit something that will cause it to take damage
        if(!this.player.invincible) {
            if(this.healthBar.children[1] == null) {
                // play a dying animation and end the game
                this.healthBar.children.pop();

                // Create the dying shark
                
                if(CURRENT_LEVEL == "1"){
                    this.dead_player = this.game.add.sprite(this.player.body.x + 16, this.player.body.y + 16, 'blacktipshark');
                    DIE_ANIM = this.dead_player.animations.add('die',[0,3,6,9,12,15,18,21], 3, false);
                }else if(CURRENT_LEVEL == "2"){
                    this.dead_player = this.game.add.sprite(this.player.body.x + 16, this.player.body.y + 16, 'barracudafish');
                    DIE_ANIM = this.dead_player.animations.add('die',[1,5,9,13,0,4,8,12], 3, false);
                } else if(CURRENT_LEVEL == "3"){
                    this.dead_player = this.game.add.sprite(this.player.body.x + 16, this.player.body.y + 16, 'barracudafish');
                    DIE_ANIM = this.dead_player.animations.add('die',[1,5,9,13,0,4,8,12], 3, false);
                }
                
                this.dead_player.angle = this.player.angle;

                if(expBar.width<=60){
                    this.dead_player.scale.setTo(0.7,0.7);
                }
                else if(expBar.width<=120){
                    this.dead_player.scale.setTo(1.0,1.0);
                }
                else if(expBar.width >120){
                    this.dead_player.scale.setTo(1.4, 1.4);
                }

                // Remove the player
                playerLoaded = false;
                //immediatley playing the losing music then a little bit after process the player dying 
                this.game.time.events.add(0,this.playDyingMusic,this);
                this.game.time.events.add(1, this.playDeath, this);

            } else {
                // Remove one heart from the health bar
                this.healthBar.children.pop();
                //play damage audio
                var damageSound = this.game.add.audio('damage');
                damageSound.play();
                // Change player's vulnerability
                this.vulnerable();
                // Change the player's alpha level
                this.player.alpha = 0.5;
                // Add timer event to change back vulnerability
                this.game.time.events.add(2000, this.vulnerable, this);
            }
        }
    },

    vulnerable: function() {
        // Change the player's invincibility
        this.player.invincible = !this.player.invincible;
        // Change the player's alpha level back
        this.player.alpha = 1;
    },

    endGame: function() {
        $('#diebtn').click();
        this.game.paused = true;
    },
    /**
        should only be called via increaseExpBar function
        also increases speed when necessary
    */
    scalePlayer:function(){
        if(this.healthBar.children[1]!=null){
                if(expBar.width<60){
                    this.player.scale.setTo(0.7,0.7);
                }
                else if(expBar.width ==60){
                    this.player.scale.setTo(1.0,1.0);
                    playerSpeed += 50;
                    SLOW_VELOCITY = 250;
                    FAST_VELOCITY = 450;
                    this.healthBar.create(this.healthBar.length * 32, 32, 'heart');
                }
                else if(expBar.width == 120){
                    this.player.scale.setTo(1.4, 1.4);
                    this.healthBar.create(this.healthBar.length * 32, 32, 'heart');
                    playerSpeed += 50;
                    SLOW_VELOCITY = 300;
                    FAST_VELOCITY = 500;
                }
            }
    },

    /*****************************************************
    *   PREDATOR FUNCTIONS
    ******************************************************/
    // Method to load predator from the tileset, as of right now its hardcoded to only get shark sprit
    loadPredators: function(){
        this.predators = this.game.add.group();
        this.predators.enableBody = true;
        var predator;
        result = this.findObjectsByType('predator',this.map,'objectLayer');
        var p;
        if(CURRENT_LEVEL == "1"){
            p = 'tigershark';
        } else {
            p = 'blacktipshark';
        } 
        result.forEach(function(element){
            element.properties.sprite = p;
            this.createFromTiledObject(element,this.predators);
        },this);  
        for (var i = 0; i < this.predators.hash.length; i++) {
            predator = this.predators.hash[i];
           
            //click event
            predator.events.onInputDown.add(this.getObjectInformation, {objs : itemsFound, object : predator, myself : this });
        }

        this.predators.forEach(function(predator){
            predator.isMoving = false;
            predator.body.collideWorldBounds = true;
            predator.anchor.setTo(0.5,0.5);
            //predator.body.allowRotation = false;
            if(CURRENT_LEVEL == "1"){
                predator.animations.add('move',[1,3,5,7,9,11,13,15,17,0,2,4,6,8,10,12,14,16], 20, true);
            } else {
                predator.animations.add('move',[2,5,8,11,14,17,20,23,26,29,1,4,7,10,13,16,19,22,25,28], 20, true);
            } 
            
            //allows predators to be clicked on
            predator.inputEnabled = true;
            predator.animations.play('move');
        });

        
    },

    movePredators: function(){
        // TODO: Then need to make predators move toward player when in two diff agro ranges
            // one for close up and the other a bit farther away with faster movement
            // Add something like an isStalking boolean
        this.predators.forEach(function(predator){
            if(predator.isMoving == false){
                // Setup the movement for the predator
                predator.body.angularVelocity = 0;
                predator.isMoving = true;
                // Check the predator's distance from the player
                var distanceFromPlayer = this.game.physics.arcade.distanceBetween(predator,this.player);
                if(distanceFromPlayer < 150) {
                    // The player is moving slow so the aggro range is smaller
                    console.log("You are moving SLOW and someone is chasing you");
                    var angle = (this.game.physics.arcade.angleBetween(predator, this.player)) * (180/Math.PI);
                    // The predator is in the aggro range, so move toward player
                    predator.angle = angle;
                    predator.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(angle,350));
                } else if((distanceFromPlayer < 400) && !this.movingSlow && this.player.animations.currentAnim != IDLE_ANIM) {
                    // The player is moving fast so the aggro range is greater
                    console.log("You are moving FAST and someone is chasing you");
                    var angle = (this.game.physics.arcade.angleBetween(predator, this.player)) * (180/Math.PI);
                    // The predator is in the aggro range, so move toward player
                    predator.angle = angle;
                    predator.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(angle,350));
                } else {
                    // Move a random direction
                    var randomDirection = this.game.rnd.integerInRange(0,10);
                    if(randomDirection <= 5) {
                        // Move in one direction
                        predator.body.angularVelocity = -this.game.rnd.integerInRange(0,150);
                    }
                    if(randomDirection > 6) {
                        // Or move in the other
                        predator.body.angularVelocity = this.game.rnd.integerInRange(0,150);
                    }
                    // Copy that velocity
                    predator.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(predator.angle,200));
                    // Follow that direction for a set priod of time
                    this.game.time.events.add(1000,this.stopPredators,this);
                }
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

    /*****************************************************
    *   PREY FUNCTIONS
    ******************************************************/
    // Method to load prey from the tileset
    loadPrey: function(){
        this.prey = this.game.add.group();
        this.prey.enableBody = true;
        var p;
        var result = this.findObjectsByType('prey',this.map,'objectLayer');
        
        //console.log(result);
        result.forEach(function(element) {
            element.properties.sprite = element.properties.name;
            this.createFromTiledObject(element,this.prey);
        },this);  

        for (var i = 0; i < this.prey.hash.length; i++) {
            p = this.prey.hash[i];
           
            //click event
            p.events.onInputDown.add(this.getObjectInformation, {object : p, objs : itemsFound, myself : this});
        }

        this.prey.forEach(function(p){
            p.isMoving = false;
            p.body.collideWorldBounds = true;
            p.anchor.setTo(0.5,0.5);
            
            //allows prey to be clicked on
            p.inputEnabled = true;
        });

        
    },

    movePrey: function(){
        this.prey.forEach(function(p){
            if(p.isMoving == false){
                // Setup the movement for the prey
                p.body.angularVelocity = 0;
                p.isMoving = true;
                // Check the prey's distance from the player
                var distanceFromPlayer = this.game.physics.arcade.distanceBetween(p,this.player);
                if(distanceFromPlayer < 150) {
                    // The player is moving slow so the aggro range is smaller
                    var angle = Math.PI - ((this.game.physics.arcade.angleBetween(p, this.player)) * (180/Math.PI));
                    // The prey is in the aggro range, so move away from the player
                    p.angle = angle;
                    p.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(angle,350));
                } else if((distanceFromPlayer < 400) && !this.movingSlow && this.player.animations.currentAnim != IDLE_ANIM) {
                    // The player is moving fast so the aggro range is larger
                    var angle = Math.PI - ((this.game.physics.arcade.angleBetween(p, this.player)) * (180/Math.PI));
                    // The prey is in the aggro range, so move away from the player
                    p.angle = angle;
                    p.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(angle,350));
                } else {
                    // The prey should move randomly
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

    /*****************************************************
    *   ITEM FUNCTIONS
    ******************************************************/
    loadItems: function(){
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;
        var result = this.findObjectsByType('item', this.map, 'objectLayer');


        result.forEach(function(element){
            element.properties.sprite = element.properties.name;
            this.createFromTiledObject(element,this.items);
        },this);  
        for (var i = 0; i < this.items.hash.length; i++) {
            item = this.items.hash[i];
           
            //click event
            item.events.onInputDown.add(this.getObjectInformation, {object : item, objs : itemsFound, myself : this});
        }

        this.items.forEach(function(it){
            it.inputEnabled = true;
        });

    },

    loadTrash: function(){
        this.pollution = this.game.add.group();
        this.pollution.enableBody = true;
        var trash;
        var result = this.findObjectsByType('trash', this.map, 'objectLayer');


        result.forEach(function(element){
            element.properties.sprite = element.properties.name;
            this.createFromTiledObject(element,this.pollution);
        },this);  
        for (var i = 0; i < this.pollution.hash.length; i++) {
            trash = this.pollution.hash[i];
           
            //click event
            trash.events.onInputDown.add(this.getObjectInformation, {object : trash, objs : itemsFound, myself : this});
        }

        this.pollution.forEach(function(it){
            it.inputEnabled = true;
        });

    },

    // This method will get the information on mouseclick down of a certain object clicked
    getObjectInformation: function(){
        // add to user
        if(this.objs.indexOf(this.object.name) === -1){
            this.objs.push(this.object.name);

            // Add to experience bar if current level not 2
            if(CURRENT_LEVEL == "1") {
                if(expBar.width < 200){
                    //expBar.width = expBar.width + 20;
                    this.myself.increaseExpBar(20);
                }
            } else if(CURRENT_LEVEL == "2") {
                timer.text = parseInt(timer.text) + 5;
            } else if(CURRENT_LEVEL == "3") {
                if(this.object.name == currentObject) {
                    // Make the time increase by 20 because they've found the item
                    timer.text = parseInt(timer.text) + 20;
                    //increment the expbar because they found an item
                    //expBar.width = expBar.width + (200/totalItems);
                    this.myself.increaseExpBar((200/totalItems));
                    if(objectsToFind.length === 0){
                        expBar.width = 200;

                    }
                    // Set the new object to find
                    foundObject = true;
                    currentObject = objectsToFind.pop();
                    
                    // Show the new object to find
                    objectToFind.destroy();
                    objectToFind = AquaCycle.game.add.sprite(905,100,currentObject);
                    objectToFind.fixedToCamera = true;
                }
            }
            
            if (CURRENT_LEVEL == "1" || CURRENT_LEVEL == "2" || (CURRENT_LEVEL == "3" && foundObject == true)) {
                foundstat.text = "Found " + itemsFound.length + " objects out of " + totalItems;
                infotext.text = "Press ESC for more information.";
                // Changing the title and color for each type of item
                if(this.object.type == "predator") {
                    // Set style and change title
                    typetext.text = "Predator Added to Objects Found";
                    typestyle = { font: '20px Arial', fill: 'red' };
                    typetext.setStyle(typestyle);
                    // Add the object info to the objects found page
                    var objectInfo = "<div class=\"row\"><div class=\"col-md-3 image\"><img src=\"assets/" + this.object.name + ".png\" id=\"predator\"></div><div class=\"col-md-9\">" + this.object.info + "</div></div><br></br>";
                    $('#items').append(objectInfo);
                } else if (this.object.type == "item") {
                    // Set style and change title
                    typetext.text = "Item Added to Objects Found";
                    typestyle = { font: '20px Arial', fill: 'blue' };
                    typetext.setStyle(typestyle);
                    // Add the object info to the objects found page
                    var objectInfo = "<div class=\"row\"><div class=\"col-md-3 image\"><img src=\"assets/" + this.object.name + ".png\" id=\"item\"></div><div class=\"col-md-9\">" + this.object.info + "</div></div><br></br>";
                    $('#items').append(objectInfo);
                } else if (this.object.type == "prey") {
                    // Set style and change title
                    typetext.text = "Prey Added to Objects Found";
                    typestyle = { font: '20px Arial', fill: 'green' };
                    typetext.setStyle(typestyle);
                    // Add the object info to the objects found page
                    var objectInfo = "<div class=\"row\"><div class=\"col-md-3 image\"><img src=\"assets/" + this.object.name + ".png\" id=\"prey\"></div><div class=\"col-md-9\">" + this.object.info + "</div></div><br></br>";
                    $('#items').append(objectInfo);
                } else if (this.object.type == "trash") {
                    // Set style and change title
                    typetext.text = "Trash Added to Objects Found";
                    typestyle = { font: '20px Arial', fill: 'black' };
                    typetext.setStyle(typestyle);
                    // Add the object info to the objects found page
                    var objectInfo = "<div class=\"row\"><div class=\"col-md-3 image\"><img src=\"assets/" + this.object.name + ".png\" id=\"trash\"></div><div class=\"col-md-9\">" + this.object.info + "</div></div><br></br>";
                    $('#items').append(objectInfo);
                }
                foundObject = false;
                discoverSound.play();
            }
        }
        
    },

    /*****************************************************
    *   PAUSE FUNCTIONS
    ******************************************************/
    // Method to pause the game, will invert the paused boolean once pressed
    pauseGame: function(){
        if(this.gamePaused){
            //console.log("unpaused");
            this.game.paused = false;
        } else {
            //console.log("paused");
            this.game.paused = true;
        }
        $('#btn').click();
        this.gamePaused = !this.gamePaused;
    },

    // Method for update to be called when game is paused
    pauseUpdate: function(){
        //if the pause menu is not shown the game should be playing
        if(!($('#myModal').hasClass('in')) && !(this.healthBar.children[1] == null) && expBar.width != 200){
            console.log("should be unpaused");
            this.game.paused = false;
            this.gamePaused = !this.gamePaused;
        }

    }   
}