// interprocess communication is done using ipcRenderer. 
const { ipcRenderer } = require('electron');
const wifi = require('node-wifi');

const { MongoClient } = require("mongodb");
const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri);

// import { BrowserWindow } from 'electron';


// closing the window ~ used only in dev phase
function closeFn1() {
    ipcRenderer.send('close')
}

var db1 = client.db("tempdemo")
async function get_cur_amount(){
const amount_left =  await db1.collection("credits").findOne({ "name":"credits" });
    return amount_left.amount;
}
const showcreds = document.getElementById("show-credits")
async function updateCreditsDisplay() {
    const currentAmount = await get_cur_amount();
    showcreds.innerHTML = `Credits left - ${currentAmount}`;
  }
  updateCreditsDisplay();
  
let test1_amount = 100;
let test2_amount = 150;

/*
async function checkSimServer() {
  // check whether http server is up and running
  const http = require('http');
  const options = {
  host: '127.0.0.1',
  port: 9876,
  path: '/'
  };
  const request = http.request(options, (response) => {
      console.log(`checkSimServer: HTTP Server up and running.`);
      console.log(`checkSimServer: HTTP Server status code: ${response.statusCode}`);
      request.end();
      return true;
  });
  request.on('error', (error) => {
      alert(`checkSimServer: HTTP Server is not running.`);
      console.log(`checkSimServer: HTTP Server error: ${error.message}`);
      request.end();
      return false;
  });
  request.end();
}
*/
async function checkSimServer() {
  const http = require('http');
  const options = {
    host: '127.0.0.1',
    port: 9876,
    path: '/'
  };

  return new Promise((resolve, reject) => {
    const request = http.request(options, (response) => {
      console.log(`checkSimServer: HTTP Server up and running.`);
      console.log(`checkSimServer: HTTP Server status code: ${response.statusCode}`);
      request.end();
      resolve(true); // Resolve the promise with a value of true if the request completes successfully
    });

    request.on('error', (error) => {
      console.log(`checkSimServer: HTTP Server error: ${error.message}`);
      request.end();
      resolve(false); // Resolve the promise with a value of false if the request fails
    });

    request.end();
  });
}

/*
async function testSetFn1() {
    // alert("Alert: To be implemented");
    var db1 = client.db("tempdemo")
    const amount_left = await db1.collection("credits").findOne({ "name":"credits" });
    if(test1_amount <= amount_left.amount){
      const isServerUp = await checkSimServer(); // Wait for checkSimServer() to return a value
    alert(`Received ${isServerUp} from checkSimServer`);
    
    if (isServerUp)  {
              const result = await db1.collection('credits').updateOne(
                  { name: 'credits' },
                  { $set: { amount: amount_left.amount-test1_amount } }
                );
                updateCreditsDisplay();

          ipcRenderer.send('user_test1');
        }

    }
    else{
        alert("Insufficient credits");
    }
     
}
*/

async function testSetFn1() {
  var db1 = client.db("tempdemo");
  const amount_left = await db1.collection("credits").findOne({ "name": "credits" });
  if (test1_amount <= amount_left.amount) {
    const isServerUp = await checkSimServer();
    if (isServerUp) {
      const result = await db1.collection('credits').updateOne(
        { name: 'credits' },
        { $set: { amount: amount_left.amount - test1_amount } }
      );
      updateCreditsDisplay();
      ipcRenderer.send('user_test1');
    } else {
      alert("HTTP server is not running.");
    }
  } else {
    alert("Insufficient credits");
  }
}
  
function testSetFn2() {
    wifi.init();
    wifi.getCurrentConnections(async (err, currentConnections) => {
        try {
            console.log("inside");
          if (currentConnections.length === 0) {
           alert("Wifi needed for this test");
          } else {
            const amount_left = await db1.collection("credits").findOne({ "name":"credits" });
            if(test2_amount <= amount_left.amount){
                const result = await db1.collection('credits').updateOne(
                    { name: 'credits' },
                    { $set: { amount: amount_left.amount-test1_amount } }
                  );
                  alert("test completed");
                }
                else{
                    alert("Insufficient credits")
                }
                  updateCreditsDisplay();

          }
        } catch (e) {
          console.log(e)
        }
      });
      console.log("here")
}
function testSetFn3() {
    alert("Alert: To be implemented");
    // ipcRenderer.send('close')
}


document.getElementById("userlogout").onclick = function () {
    // location.href = "index.html";
    ipcRenderer.send('user_logout');
};

