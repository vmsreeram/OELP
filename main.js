const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require("electron");
const { platform } = require("os");
const path = require("path");
const url = require("url");

const wifi = require('wifi-control');
wifi.init();

ipcMain.handle('show-message-box', (event, options) => {
    const result = dialog.showMessageBoxSync({
      ...options,
      message: `${options.message}`,
      noLink: true,
      cancelId: 1,
      customInputs: [
        { label: options.inputFieldLabel, type: 'password' },
      ],
    });
  
    return Promise.resolve(result);
  });

// function to create window when the app is ready/activated.
let win;
function createWindow() {
    win= new BrowserWindow({
        frame: false,
        // fullscreen: true,            // To be uncommented before final testing/depolyment
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        },
      });

    // index.html is loaded as the first window on startup
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes:true
    }));

    // Used for debugging
    win.webContents.openDevTools();
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

// function to create window that is displayed when login is successful
let win1;
ipcMain.on('loggedin', () => {
    win.close();                // to close the previous window
    win1= new BrowserWindow({
        frame: false,
        // fullscreen: true,            // To be uncommented before final testing/depolyment
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
    
    // Used for debugging
    win1.webContents.openDevTools();

    win1.on('closed', () => {
        win1 = null;
    })


});


// function to create window that is displayed when login is successful
let win1_adm;
ipcMain.on('loggedin_adm', () => {
    win.close();                // to close the previous window
    win1_adm= new BrowserWindow({
        frame: false,
        // fullscreen: true,            // To be uncommented before final testing/depolyment
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        },
      });
      win1_adm.loadURL(url.format({
        pathname: path.join(__dirname, 'adminpage.html'),
        protocol: 'file',
        slashes:true
    }));
    
    // Used for debugging
    win1_adm.webContents.openDevTools();

    win1_adm.on('closed', () => {
        win1_adm = null;
    })


});


ipcMain.on('admin_logout', () => {
    win1_adm.close();                // to close the previous window
    win= new BrowserWindow({
        frame: false,
        // fullscreen: true,            // To be uncommented before final testing/depolyment
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
    
    // Used for debugging
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    })


});



ipcMain.on('user_logout', () => {
    win1.close();                // to close the previous window
    win= new BrowserWindow({
        frame: false,
        // fullscreen: true,            // To be uncommented before final testing/depolyment
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
    
    // Used for debugging
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    })


});


flag=false;

// once index is ready, index.js calles ready-diag through ipc. Now main.js will httprequest the python server
ipcMain.on('ready-diag', (event, arg) => {
    if(flag)
    {
        console.log("successful");
        event.sender.send('fn-called');
    }
    else {
    var XMLHttpRequest = require('xhr2');
    let request = new XMLHttpRequest();
    request.open("GET","http://127.0.0.1:9999")
    request.send()
    request.onload = () => {
        // if request successful,
        if(request.status === 200){
            console.log("successful");
            event.sender.send('fn-called');
            flag=true;
        }
        else{
            console.log("failed")
        }
    }
};
});
  
