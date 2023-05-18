const { app, BrowserWindow, ipcMain } = require('electron');
const express = require('express');
const bodyParser = require('body-parser');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', function () {
  createWindow();

  const app = express();

  app.use(bodyParser.json());

  app.get('/', function (req, res) {
    const { x, y, w, c } = req.query;
    mainWindow.webContents.send('move', { x, y, w, c });
    res.send('Dot moved');
  });

  app.listen(9876, function () {
    console.log('Listening on port 9876');
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('move', (event, { x, y, w, c }) => {
  mainWindow.webContents.send('move', { x, y, w, c });
});
