const { ipcRenderer } = require('electron');

ipcRenderer.on('move', (event, { x, y, w, c }) => {
  const dot = document.getElementById('dot');
  dot.style.left = x + 'px';
  dot.style.top = y + 'px';
  dot.style.width = w + 'px';
  dot.style.height = w + 'px';
  dot.style.backgroundColor = c;

  console.log(`width_set to ${w}`);
  console.log("MOVED__");
});
const { ipcRenderer } = require('electron');

