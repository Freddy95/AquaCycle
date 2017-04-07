function loadPlayer(){
    player = AquaCycle.game.add.sprite(300,200,'player');
    AquaCycle.game.physics.arcade.enable(player);
    AquaCycle.game.camera.follow(player);
    playerLoaded = true;
    return player;
}

function placePlayer(){

}