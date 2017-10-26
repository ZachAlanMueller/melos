var Datastore = require('nedb'), db = new Datastore({ filename: './db/songs', autoload: true });



function loadSongs(){
	$('#songs').empty();

	db.find({}).sort({artist: 1}).exec(function(err, docs){
		if(err){
			console.log(err);
		}
		var artist = '';
		for(i = 0; i < docs.length; i++){
			if(docs[i]['artist'] != artist){
				var artistInsert = "<h4>"+docs[i]['artist']+"</h4>";
				$('#songs').append(artistInsert);
				artist = docs[i]['artist'];
			}
			var songInsert = "<div class='row song-instance'>";
			songInsert += " <div class='col-sm-1'> </div>";
			songInsert += " <div class='col-sm-4'>";
			songInsert += " <i class='fa fa-play-circle clickable' aria-hidden='true' style='vertical-align: middle; display: inline; color: #222d32;' onClick=\"playSong('"+docs[i]['path']+"')\"></i>";
      songInsert += " &nbsp;&nbsp;<div class='songTitle' style='display: inline;'>" + docs[i]['title'] + "</div>";
      songInsert += " </div>";//songTitle column div

      songInsert += " <div class='col-sm-3'>";
			songInsert += " <div class='songArtist' style='display: inline;'>" + docs[i]['artist'] + "</div>";
      songInsert += " </div>";//songArtist column div

      songInsert += " <div class='col-sm-2'>";
			songInsert += " <div class='songDuration' style='display: inline;'>" + docs[i]['duration'] + "</div>";
      songInsert += " </div>";//songDuration column div

      songInsert += " <div class='col-sm-1 btn-group'>";
      songInsert += " <button type='button' class='btn btn-box-tool dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>";
      songInsert += " <i class='fa fa-ellipsis-h clickable' aria-hidden='true' style='vertical-align: middle; display: inline;'></i>";
      songInsert += " </button>";
      songInsert += " <ul class='dropdown-menu' role='menu'>"
	    songInsert += "<li><a href='#'>Action</a></li>"
	    songInsert += "<li><a href='#'>Another action</a></li>"
	    songInsert += "<li><a href='#'>Something else here</a></li>"
	    songInsert += "<li class='divider'></li>"
	    songInsert += "<li><a href='#'>Separated link</a></li>"
	    songInsert += " </ul>"

      songInsert += " </div>";//Songname column div
      songInsert += "</div>"; //Ending the row div

      songInsert += "<hr style='margin-top:4px; margin-bottom: 8px;'>"; //Ending the row div
      $('#songs').append(songInsert);
		}
	});
	
}
// <div class="btn-group">
//   <button type="button" class="btn btn-box-tool dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
//     <i class="fa fa-wrench"></i></button>
//   <ul class="dropdown-menu" role="menu">
//     songInsert += "<li><a href="#">Action</a></li>"
//     songInsert += "<li><a href="#">Another action</a></li>"
//     songInsert += "<li><a href="#">Something else here</a></li>"
//     songInsert += "<li class="divider"></li>"
//     songInsert += "<li><a href="#">Separated link</a></li>"
//   </ul>
// </div>









$(document).ready(function(){
	loadSongs();
});






