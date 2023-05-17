// interprocess communication is done using ipcRenderer. 
const { ipcRenderer } = require('electron');

// import { BrowserWindow } from 'electron';


// closing the window ~ used only in dev phase
function closeFn1() {
    ipcRenderer.send('close')
}

function testSetFn1() {
    // alert("Alert: To be implemented");
    ipcRenderer.send('user_test1')
    /**
     *  var XMLHttpRequest = require('xhr2'); 
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/moveDot?x=0&y=0");
        xhr.send();
     */
}

  
function testSetFn2() {
    alert("Alert: To be implemented");
    // ipcRenderer.send('close')
}
function testSetFn3() {
    alert("Alert: To be implemented");
    // ipcRenderer.send('close')
}


document.getElementById("userlogout").onclick = function () {
    // location.href = "index.html";
    ipcRenderer.send('user_logout');
};
