const { ipcRenderer } = require('electron');

function closeFn1() {
    // console.log('Clicked1');
    ipcRenderer.send('close')
}

