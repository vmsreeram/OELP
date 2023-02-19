// console.log('log from index.js');

const { ipcRenderer } = require('electron');

ipcRenderer.on('fn-called', () => {
    stopLoader();
});
        
function closeFn1() {
    // console.log('Clicked1');
    ipcRenderer.send('close')
}

function stopLoader() {
    var loader = document.getElementById("loader");
    var hellotitle = document.getElementById("hellotitle");
    var body = document.querySelector("body");
    var loginboxes = document.getElementById("loginboxes");
    var lblDiag = document.getElementById("lblDiag")
    
    loader.style.animation = "none";
    loader.style.animation = "none";
    loader.hidden="true";
    hellotitle.style.display = "block";
    body.style.backgroundColor = "white";
    loginboxes.style.display = "block";
    lblDiag.style.display = "none"

    // ---- no longer used ----
    // setTimeout(function() {
    //   }, 0);
}
ipcRenderer.send('ready-diag')
// setTimeout(stopLoader, 5000);