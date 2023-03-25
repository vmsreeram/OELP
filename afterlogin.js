const { ipcRenderer } = require('electron');

function closeFn1() {
    // console.log('Clicked1');
    ipcRenderer.send('close')
}

function testSetFn1() {
    // pyhton server to be imp...
    alert("Alert: To be implemented");
    // ipcRenderer.send('close')
}
function testSetFn2() {
    // pyhton server to be imp...
    alert("Alert: To be implemented");
    // ipcRenderer.send('close')
}
function testSetFn3() {
    // pyhton server to be imp...
    alert("Alert: To be implemented");
    // ipcRenderer.send('close')
}

