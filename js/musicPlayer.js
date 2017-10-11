var player;

function playSong(url){
	if(player){
		player.stop(); //stops if already player is defined already
	}
	player = new Howl({
		src: [url]
	});
	playerTogglePlay();
}


function playerTogglePlay(){
	if(player){
		if(player.playing()){
			player.pause();
			$('#playerPausePlayButton').removeClass('fa-pause-circle');
			$('#playerPausePlayButton').addClass('fa-play-circle');
		}
		else{
			player.play();
			$('#playerPausePlayButton').removeClass('fa-play-circle');
			$('#playerPausePlayButton').addClass('fa-pause-circle');
		}
	}
	else{
		//do nothing, player isn't initialized.
	}
}

function playerAdjustVolume(vol){
	if(player){
		player.volume(vol/100);
	}
}