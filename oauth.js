const { app, BrowserWindow } = require('electron');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// Define your client ID and secret
const CLIENT_ID = 'your client id';
const CLIENT_SECRET = 'your client secret';

// Define the scopes you want to request (in this case, we only need the user's email and name)
const SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

// Create a new OAuth2 client using your client ID and secret
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET,redirectUri = 'https://www.youtube.com');

// Create a new Electron window
let win;

function createWindow() {
  win = new BrowserWindow({
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

  win.loadURL(authUrl);

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

      // Log the user's email and name
      console.log(`Email: ${data.emailAddresses[0].value}`);
      console.log(`Name: ${data.names[0].displayName}`);

      // Close the Electron window
      win.close();
    } catch (error) {
      console.error(error);
    }
  });
}

app.on('ready', createWindow);
