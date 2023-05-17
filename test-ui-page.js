// const { ipcRenderer } = require('electron');

const express = require('express');
const Expapp = express();
const port = 8080;
let win_user_tests;

// Endpoint to handle the move-dot request
Expapp.get('/move-dot', (req, res) => {
  const { x, y } = req.query;
  moveDot(parseInt(x), parseInt(y));
  res.send('moveDot function called successfully');
});
Expapp.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
// function moveDot(x, y) {
//   console.log(`Moving dot to (${x}, ${y})`);
//   win_user_tests.webContents.send('move-right');
// }


var dot = document.getElementById("dot");
X=0;
Y=0;
// ipcRenderer.on('move-right', () => {
//     X=X+15;
//     console.log("moved in test-ui")
//     moveDot(X,Y);
// });

function moveDot(x, y) {
  dot.style.left = x.toString() + "px";
  dot.style.top = y.toString() + "px";
}

// // Bind the mouse events/////
// document.getElementById("frame").addEventListener("mousemove", function(e) {
//   moveDot(e.pageX, e.pageY);
// });
