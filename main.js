// console.log('main process started');
// console.log('log from main.js');

const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");
const { platform } = require("os");
const path = require("path");
const url = require("url");

// const { MongoClient } = require("mongodb");
// const uri = "mongodb://0.0.0.0:27017/";
// const client = new MongoClient(uri);
// async function run() {
//     try {
//         await client.connect();
//         // database and collection code goes here
//         // insert code goes here
//         // display the results of your operation
//         console.log("mongo connected!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

let win;
function createWindow() {
    win= new BrowserWindow({
        frame: false,
        // fullscreen: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        },
      });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes:true
    }));
    // var pyoptions = {
    //     scriptPath : path.join(__dirname, '.'i)
    // }
    
      

    // win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    })
}

app.on('ready',createWindow);
app.on('window-all-closed', () => {
    if(platform!='darwin')
        app.quit()
});

app.on('activate', () => {
    if (win === null) {
    createWindow()
    }
});

// main.js handles command sent through ipc, and quits the app.
ipcMain.on('close', () => {
    app.quit()
});

let win1;
ipcMain.on('loggedin', () => {
    // app.quit()
    win.close();
    win1= new BrowserWindow({
        frame: false,
        // fullscreen: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        },
      });
    win1.loadURL(url.format({
        pathname: path.join(__dirname, 'afterlogin.html'),
        protocol: 'file',
        slashes:true
    }));
    // var pyoptions = {
    //     scriptPath : path.join(__dirname, '.'i)
    // }
    
      

    // win1.webContents.openDevTools();
    win1.on('closed', () => {
        win1 = null;
    })


});

ipcMain.on('ready-diag', (event, arg) => {
    var XMLHttpRequest = require('xhr2');
let request = new XMLHttpRequest();
request.open("GET","http://127.0.0.1:9999")
request.send()
request.onload = () => {
    if(request.status === 200){
        console.log("successful");
        event.sender.send('fn-called');
    }
    else{
        console.log("failed")
    }
};
});
  
