const { ipcRenderer } = require('electron');
const fs = require('fs');

const moveHistory = [];

ipcRenderer.on('move', (event, { x, y, w, c }) => {
  const dot = document.getElementById('dot');
  dot.style.left = x + 'px';
  dot.style.top = y + 'px';
  dot.style.width = w + 'px';
  dot.style.height = w + 'px';
  dot.style.backgroundColor = c;

  moveHistory.push({ x, y, w, c });
  console.log(`width_set to ${w}`);
  console.log("MOVED__");
});
// const { ipcRenderer } = require('electron');
const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
  const csv = convertToCSV(moveHistory);
  const filename = 'move_history.csv';
  saveFile(csv, filename);
});

function convertToCSV(arr) {
  const header = Object.keys(arr[0]).join(',');
  const rows = arr.map(obj => Object.values(obj).join(','));
  return [header, ...rows].join('\n');
}

function saveFile(data, filename) {
  fs.writeFile(filename, data, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    alert(`File saved as ${filename}`);
    console.log(`File saved as ${filename}`);
  });
}
