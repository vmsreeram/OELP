console.log('log from index.js');

const ipc = require('electron').ipcRenderer
        
function closeFn1() {
    console.log('Clicked1');
    ipc.send('close')
}