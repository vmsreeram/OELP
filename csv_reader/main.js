const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);


ipcMain.handle('open-csv-dialog', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'CSV', extensions: ['csv'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {

    // Read the contents of the selected CSV file
    const csvFilePath = result.filePaths[0];
    const stream = fs.createReadStream(csvFilePath, { encoding: 'utf-8' });
    let csvData = '';
    stream.pipe(csv())
      .on('data', (row) => {
        // Process each row of the CSV file
        csvData += `${JSON.stringify(row)}\n`;
        console.log("here");
      })
      .on('end', () => {
        // The end of the CSV file has been reached
        console.log(csvData)
        mainWindow.webContents.send('csv-data', csvData);
      })
      .on('error', (err) => {
        // An error occurred while processing the CSV file
        console.error(err);
        event.returnValue = null;
      });
  } else {
    event.returnValue = null;
  }
});