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

			var newRow = "\
						<tr role=\"row\" class=\"" + rowColor + "\" ondblclick=\"playSong('"+docs[i]['path']+"')\"> \
              <td class=\"sorting_1 title\">"+ docs[i]['title'] +"</td>\
              <td class=\"artist\">"+ docs[i]['artist'] +"</td> \
              <td class=\"duration\">"+ docs[i]['duration'] +"</td> \
            </tr>";
      $('#songs').append(newRow);
		}
	});
	
}
$(document).ready(function(){
	loadSongs();
});






