const { ipcRenderer } = require('electron');
const electron = require('electron');
const select = document.getElementById('networks');
const connectButton = document.getElementById('connect');

const wifi = require('node-wifi');
wifi.init();

wifi.scan(function(err, response) {
    // document.getElementById('lblChkWifi').style.display('none');
    if (err) console.log(err);
    else {
        response.forEach(function(network) {
            const option = document.createElement('option');
            option.text = network.ssid;
            option.value = network.ssid;
            document.getElementById('networks').appendChild(option);
        });
    }
    console.log(document.getElementById('networks').options.length);
    if(document.getElementById('networks').options.length === 0) {
        console.log("No WiFi Found");
        document.getElementById('lblChkWifi').innerHTML="No WiFi Found";

        // hide buttons
        // document.getElementById('networks').style.display='none';
        document.getElementById('pwdDiv').style.display='none';
        document.getElementById('connect').style.display='none';
        // document.getElementById('lblNetworksWifi').style.display='none';
    } else {
        document.getElementById('lblChkWifi').innerHTML=document.getElementById('networks').options.length + " WiFi network(s) found";
    }
  });

  connectButton.addEventListener('click', function() {
    const ssid = select.value;
    const password = document.getElementById('inputField').value;

    const options = {
    type: 'question',
    buttons: ['Connect', 'Cancel'],
    defaultId: 0,
    title: `Connect to ${ssid}`,
    message: `Are you sure you want to connect to ${ssid}?`,
    };

    ipcRenderer.invoke('show-message-box', options).then((response) => {
    if (response === 0) {
        wifi.connect({ ssid, password }, function(err) {
            if (err) console.log(err);
            else console.log(`Connected to ${ssid}`);
        });
    }
    }).catch((error) => {
    console.log(error);
    });
  });


// closing the window ~ used only in dev phase
function closeFn1() {
    ipcRenderer.send('close')
}
