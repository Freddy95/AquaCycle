var AquaCycle = AquaCycle || {};

//placeholder resolution
AquaCycle.game = new Phaser.Game(1280,720,Phaser.AUTO, '');

AquaCycle.game.state.add('Boot', AquaCycle.Boot);
AquaCycle.game.state.add('Preload', AquaCycle.preload);
AquaCycle.game.state.add('Game', AquaCycle.Game);
//How do we load sperate levels
//AquaCycle.game.state.add('Level2',AquaCycle.game)
//after adding game states start the boot function
AquaCycle.game.state.start('Boot');