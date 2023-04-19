const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    ipcRenderer
} = require("electron");
const { platform } = require("os");
const path = require("path");
const url = require("url");
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

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
    win1.close();    
               // to close the previous window
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
  
let oauthwin;
ipcMain.on('oauth-redirect',(event)=>{
  
  win.close();

// Define your client ID and secret
const CLIENT_ID = '3764791994-ihegnq8q8usst3qurno1ft73druvu6qq.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

// Define the scopes you want to request (in this case, we only need the user's email and name)
const SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

// Create a new OAuth2 client using your client ID and secret
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET,redirectUri = 'https://www.youtube.com');

  console.log("here");
  oauthwin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Open the Google OAuth consent page in the Electron window
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES.join(' ')
  });

  oauthwin.loadURL(authUrl);

  // Handle the Google OAuth callback
  win.webContents.on('will-redirect', async (event, url) => {
    // Parse the authorization code from the callback URL
    const urlParams = new URLSearchParams(new URL(url).search);
    const authorizationCode = urlParams.get('code');

    try {
      // Exchange the authorization code for an access token
      const { tokens } = await oAuth2Client.getToken(authorizationCode);

      // Set the access token for future API requests
      oAuth2Client.setCredentials(tokens);

      // Use the Google People API to retrieve the user's email and name
      const peopleApi = google.people({ version: 'v1', auth: oAuth2Client });
      const { data } = await peopleApi.people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names'
      });
      console.log("here");
      // Log the user's email and name
      console.log(`Email: ${data.emailAddresses[0].value}`);
      console.log(`Name: ${data.names[0].displayName}`);
       event.sender.send('ouath-redirect-response',data.emailAddresses[0].value);
      // Close the Electron window
      win.close();
    } catch (error) {
      console.error(error);
    }
  });

})

let win_admin_password;

ipcMain.on('admin_passwordset',()=>{

    console.log("Set Admin Password");
})