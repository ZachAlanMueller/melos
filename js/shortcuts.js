var electron = require('electron');
var remote = require('electron').remote; 
var dialog = remote.dialog;
var Mousetrap = require('mousetrap');

Mousetrap.bind("mod+o", openFiles);



function openFiles(){
	console.log('still opening file');
	dialog.showOpenDialog({filters: [{ name: 'Music', extensions: ['m4a', 'mp3', 'spx']}], properties: ['openFile', 'multiSelections']}, function (fileNames) {

	}); 
}

// openFiles();