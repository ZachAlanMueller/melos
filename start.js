'use strict';
const electron = require('electron');
const {dialog} = require('electron')
const app = electron.app;
const Menu = electron.Menu; //menu bar
var Mousetrap = require('mousetrap'); //keybindings
const fs = require("fs"); //filesystem
var mm = require('musicmetadata'); //musicmetadata
var Datastore = require('nedb')
  , db = new Datastore({ filename: './db/songs', autoload: true });
var path = require('path');


// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400,
		title: "Melos"
	});
	win.maximize();
	win.webContents.openDevTools();
	// win.loadURL(`file://${__dirname}/starter.html`);
	win.loadURL(`file://${__dirname}/html/landing.html`);
	win.on('closed', onClosed);


	return win;
}


app.on('ready', () => {
	createMenuBar();
});

app.on('window-all-closed', () => {
	//Check options
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});

function createMenuBar(){
	const menuTemplate = [
    {
      label: 'HELLO',
      submenu: [
        {
          label: 'About',
          click: () => {
            console.log('About Clicked'); //@TODO
          }
        }, {
          type: 'separator'
        }, {
          label: 'Quit',
          click: () => {
            app.quit();
          }
        }
      ]
  	},
    {
        label: 'Music',
        submenu: [
          {
            label: 'Add New Song',
            click: () => {
              dialog.showOpenDialog({filters: [{ name: 'Music', extensions: ['m4a', 'mp3', 'spx', 'wav']}], properties: ['openFile', 'multiSelections']}, function (fileNames) {
              	for(var i = 0; i < fileNames.length; i++){
              		addSong(fileNames[i]);
              	}
							});
            }
          }, { 
          	label: 'Add Folder',
            click: () => {
              dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']}, function (folderNames) {
              	console.log(folderNames);
              	loadFilesFromFolder(folderNames[0]);
							});
            }
          }, {
            type: 'separator'
          }, {
            label: 'Quit',
            click: () => {
              //Don't do that
            }
          }
        ]
    }
	];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

function loadFilesFromFolder(folderName){
	var files = fs.readdirSync(folderName);
	for(var i = 0; i < files.length; i++){
		if(fs.lstatSync(folderName + "/" + files[i]).isFile()) {
			var ext = files[i].substr(files[i].lastIndexOf('.') + 1);
			if(ext == "m4a" || ext == "mp3" || ext == "spx" || ext == "wav"){
				addSong(folderName + "/" + files[i]);
			}
		}
		if(fs.lstatSync(folderName + "/" + files[i]).isDirectory()){
			loadFilesFromFolder(folderName + "/" + files[i]);
		}
	}
}

function addSong(filename){ //@TODO check for no metadata found
	var parser = mm(fs.createReadStream(filename), function (err, metadata) {
	  if (err) {
	  	metadata['artist'][0] = "Unknown";
	  	metadata['title'] = filename.substr(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.') - filename.lastIndexOf('/') - 1);
	  	metadata['duration'] = 0;
	  }
	  metadata['artist'][0] = metadata['artist'][0].replace("#", " "); metadata['artist'][0] = metadata['artist'][0].replace("%", " "); metadata['artist'][0] = metadata['artist'][0].replace("{", " "); metadata['artist'][0] = metadata['artist'][0].replace("}", " "); metadata['artist'][0] = metadata['artist'][0].replace("\\", " "); metadata['artist'][0] = metadata['artist'][0].replace("<", " "); metadata['artist'][0] = metadata['artist'][0].replace(">", " "); metadata['artist'][0] = metadata['artist'][0].replace("*", " "); metadata['artist'][0] = metadata['artist'][0].replace("?", " "); metadata['artist'][0] = metadata['artist'][0].replace("/", " "); metadata['artist'][0] = metadata['artist'][0].replace("$", " "); metadata['artist'][0] = metadata['artist'][0].replace("!", " "); metadata['artist'][0] = metadata['artist'][0].replace("'", " "); metadata['artist'][0] = metadata['artist'][0].replace("\"", " "); metadata['artist'][0] = metadata['artist'][0].replace(":", " "); metadata['artist'][0] = metadata['artist'][0].replace("@", " ");
	  var dir = path.resolve(filename);
	  var fs = require('fs');
	  var file = metadata['title'];
	  file = file.replace("#", " "); file = file.replace("%", " "); file = file.replace("{", " "); file = file.replace("}", " "); file = file.replace("\\", " "); file = file.replace("<", " "); file = file.replace(">", " "); file = file.replace("*", " "); file = file.replace("?", " "); file = file.replace("/", " "); file = file.replace("$", " "); file = file.replace("!", " "); file = file.replace("\"", " "); file = file.replace(":", " "); file = file.replace("@", " ");
		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
	  //Finally, copy file to local directory
		fs.createReadStream(filename).pipe(fs.createWriteStream(dir));
		//Now add file to db - critical db info should be Title Artist Path for now
		var db_object = {
			title: file,
			artist: metadata['artist'][0],
			duration: metadata['duration'],
			path: dir
		}	



		db.count({path: dir}, function(err, count){
			if(count == 0){
				db.insert(db_object, function (err, newDoc) {   
					if(err){
						console.log(err);
					}

				});
			}
			else{
				db.remove({ path: dir }, {}, function (err, numRemoved) {
				  if(err){
				  	console.log(err);
				  }
				  //console.log(numRemoved);
				});
				db.insert(db_object, function (err, newDoc) {
					if(err){
						console.log(err);
					}

				});
			}
		});
		
	});
}


function progressWindow(){
	const progWin = new electron.BrowserWindow({
		width: 600,
		height: 400,
		frame: false
	});
	progWin.show();
}








