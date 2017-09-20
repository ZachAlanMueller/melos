'use strict';
const electron = require('electron');
const {dialog} = require('electron')
const app = electron.app;
const Menu = electron.Menu; //menu bar
var Mousetrap = require('mousetrap'); //keybindings
const fs = require("fs"); //filesystem
var mm = require('musicmetadata'); //musicmetadata



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
		if(fs.lstatSync(folderName + "/" + files[i]).isFile()) { //@TODO also check if file has extension defined 
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
	  	metadata['title'] = filename.substr(filename.lastIndexOf('/') + 1);
	  }
	  var dir = "./music/" + metadata['artist'][0]
	  var fs = require('fs');
	  var file = metadata['title'];
	  file = file.replace("#", " "); file = file.replace("%", " "); file = file.replace("&", " "); file = file.replace("{", " "); file = file.replace("}", " "); file = file.replace("\\", " "); file = file.replace("<", " "); file = file.replace(">", " "); file = file.replace("*", " "); file = file.replace("?", " "); file = file.replace("/", " "); file = file.replace("$", " "); file = file.replace("!", " "); file = file.replace("'", " "); file = file.replace("\"", " "); file = file.replace(":", " "); file = file.replace("@", " ");
		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
	  var ext = filename.substr(filename.lastIndexOf('.') + 1);
	  dir += "/" + file + "." + ext;
		fs.createReadStream(filename).pipe(fs.createWriteStream(dir));
	});
}


