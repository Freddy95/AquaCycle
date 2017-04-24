function load () {
	if(Cookies.get('maxLevel') != null){
		$('#continue').prop('disabled', false);
	}
}
function startNewGame(){
	Cookies.set('currentLevel', "1");
	window.location = "Game.html"; 
}
function continueGame(){
	Cookies.set('currentLevel', Cookies.get('maxLevel'));
	window.location = "Game.html"; 
}