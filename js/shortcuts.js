var electron = require('electron');
var remote = require('electron').remote; 
var dialog = remote.dialog;
var Mousetrap = require('mousetrap');

Mousetrap.bind("mod+o", openFiles);
Mousetrap.bind("mod+q", toggleRightSidebar);


function toggleRightSidebar(){
	$('#toggleRightSidebar').click();
}

function openFiles(){
	console.log('still opening file');
}
