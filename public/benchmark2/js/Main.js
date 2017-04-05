var AquaCycle = AquaCycle || {};

//placeholder resolution
//TODO: Figure out how to get adaptive resolution
AquaCycle.game = new Phaser.Game(1280,720,Phaser.AUTO, 'game_location');

AquaCycle.game.state.add('Boot', AquaCycle.Boot);
AquaCycle.game.state.add('Preload', AquaCycle.Preload);
AquaCycle.game.state.add('Game', AquaCycle.Game);
//How do we load sperate levels
//AquaCycle.game.state.add('Level2',AquaCycle.game)
//after adding game states start the boot function
AquaCycle.game.state.start('Boot');