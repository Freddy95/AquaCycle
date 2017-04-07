var AquaCycle = AquaCycle || {};

//placeholder resolution
//TODO: Figure out how to get adaptive resolution
var gameWidth = 1280
var gameHeight = 720
AquaCycle.game = new Phaser.Game(gameWidth,gameHeight,Phaser.AUTO, 'game_location');

AquaCycle.game.state.add('Boot', AquaCycle.Boot);
AquaCycle.game.state.add('Preload', AquaCycle.Preload);
AquaCycle.game.state.add('Game', AquaCycle.Game);
//How do we load sperate levels
//AquaCycle.game.state.add('Level2',AquaCycle.game)
//after adding game states start the boot function
AquaCycle.game.state.start('Boot');