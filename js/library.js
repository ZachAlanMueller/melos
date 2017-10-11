var Datastore = require('nedb'), db = new Datastore({ filename: './db/songs', autoload: true });



function loadSongs(){
	$('#songs').empty();
	db.find({}).sort({artist: 1}).exec(function(err, docs){
		if(err){
			console.log(err);
		}
		for(i = 0; i < docs.length; i++){
			var rowColor = 'odd';
			if(i %2 == 0){
				rowColor = 'even';
			}
			var newPath = docs[i]['path'].slice(0,2) + "../" + docs[i]['path'].slice(2); // Path from the html folder, instead of from the projects root directory
			var newRow = "\
						<tr role=\"row\" class=\"" + rowColor + "\" ondblclick=\"playSong('"+newPath+"')\"> \
              <td class=\"sorting_1 title\">"+ docs[i]['title'] +"</td>\
              <td class=\"artist\">"+ docs[i]['artist'] +"</td> \
            </tr>";
      $('#songs').append(newRow);
		}
	});
	
}
$(document).ready(function(){
	loadSongs();


	// var sound = new Howl({
	// 	src: ['./../music/2cellos/Viva La Vida.m4a']
	// });
	// sound.play();
});
