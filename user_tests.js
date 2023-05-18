/**
 * fetch('http://localhost:3000/move-dot?x=100&y=200')
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));

 */
const { ipcRenderer } = require('electron');

document.getElementById("back-btn").addEventListener('click', function() {
    ipcRenderer.send('test1-back-called');
  });

X = 200;
Y = 200;

LIM = 100;

W = 10;
W_Max = 35;
W_Min = 1;

COL = 'red'

fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)

document.getElementById("left").addEventListener('click', function() {
  if(X-10 >= 0)
  {
    X = X-10;
    fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));
  } else alert("out of permissible limits");
});

document.getElementById("right").addEventListener('click', function() {
  if(X+10 <= 300)
  {
    X = X+10;
    fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));
  } else alert("out of permissible limits");
});

document.getElementById("up").addEventListener('click', function() {
  if(Y+10 <= 300)
  {
    Y = Y+10;
    fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));
  } else alert("out of permissible limits");
});

document.getElementById("down").addEventListener('click', function() {
  if(Y-10 >= 0)
  {
    Y = Y-10;
    fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));
  } else alert("out of permissible limits");
});

document.getElementById("inc_width").addEventListener('click', function() {
  if(W+2 <= W_Max)
  {
    W = W+2;
    fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));
  } else alert("out of permissible limits");
});

document.getElementById("dec_width").addEventListener('click', function() {
  if(W-2 >= W_Min)
  {
    W = W-2;
    fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));
  } else alert("out of permissible limits");
});

document.getElementById("col_red").addEventListener('click', function() {
  COL = 'red'
    fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));
});

document.getElementById("col_green").addEventListener('click', function() {
  COL = 'green'
  fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error(error));
});

document.getElementById("col_blue").addEventListener('click', function() {
  COL = 'blue'
  fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error(error));
});

document.getElementById("col_yell").addEventListener('click', function() {
  COL = 'yellow'
  fetch(`http://localhost:9876/?x=${X}&y=${Y}&w=${W}&c=${COL}`)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error(error));
});
