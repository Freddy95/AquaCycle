function load () {
	if(Cookies.get('maxLevel') == null){
		Cookies.set('maxLevel', 1)
	}else{
		var maxLevel = parseInt(Cookies.get('maxLevel'));
		if(maxLevel == 3){
			$('#btn2').prop('disabled', false);
			$('#btn3').prop('disabled', false);
		}else if(maxLevel == 2){
			$('#btn2').prop('disabled', false);
		}
	}
	// body...
}

function goToLevel(level){
	console.log(level);
	Cookies.set('currentLevel', level.toString());
	window.location = 'Game.html';
}