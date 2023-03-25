// console.log('log from index.js');

const { ipcRenderer } = require('electron');

ipcRenderer.on('fn-called', () => {
    stopLoader();
});


const { MongoClient } = require("mongodb");
const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri);
// async function run() {
//     try {
//         await client.connect();
//         // database and collection code goes here
//         // insert code goes here
//         // display the results of your operation
//         console.log("mongo connected!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

////////////////
document.addEventListener("DOMContentLoaded", function(event) {
    const logTextArea = document.getElementById('log');
  
    function appendToLog(text) {
      logTextArea.value += text + '\n';
    }

    const http = require('http');
    const options = {
    host: '127.0.0.1',
    port: 9999,
    path: '/'
    };
    const request = http.request(options, (response) => {
        appendToLog(`HTTP Server up and running.`);
        console.log(`HTTP Server status code: ${response.statusCode}`);
    });
    request.on('error', (error) => {
        appendToLog(`HTTP Server is not running.`);
        console.log(`HTTP Server error: ${error.message}`);
    });
    request.end();

    const options1 = {
        host: '0.0.0.0',
        port: 27017,
        path: '/'
    };
    const request1 = http.request(options1, (response) => {
        appendToLog(`MongoDB Server up and running.`);
        console.log(`MongoDB Server status code: ${response.statusCode}`);
    });
    request1.on('error', (error) => {
        appendToLog(`MongoDB Server is not running.`);
        console.log(`MongoDB Server error: ${error.message}`);
    });
    request1.end();

});
/////////////


function closeFn1() {
    // console.log('Clicked1');
    ipcRenderer.send('close')
}

function subCreds() {
    async function run() {
        try {
            await client.connect();
            // database and collection code goes here
            // insert code goes here
            // display the results of your operation
            
            // console.log("mongo connected!");
            var usrnm = document.getElementById("usrname")
            var passd = document.getElementById("pwd")
            // console.log("username=",usrnm.value)
            // console.log("pass=",passd.value)
            var db1 = client.db("tempdemo")
            const user = await db1.collection("userinfo").findOne({ "name":usrnm.value });
            // const user = db1.collection("userinfo").find({ name:{usrnm},password:{passd} });
            // console.log(user)
            // console.log(user.password)
            if(!user || (user.password != passd.value))
            {
                // console.log("Incorrect credentials")
                alert("Alert: Incorrect credentials");
                usrnm.value=""
                passd.value=""
            }
            else
            {
                alert("Alert: Logged in");
                usrnm.value=""
                passd.value=""
                ipcRenderer.send("loggedin")
            }
            // console.log("mongo done!");
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
    run().catch(console.dir);

    
}

function stopLoader() {
    var loader = document.getElementById("loader");
    var hellotitle = document.getElementById("hellotitle");
    var body = document.querySelector("body");
    var loginboxes = document.getElementById("loginboxes");
    var lblDiag = document.getElementById("lblDiag")
    var log = document.getElementById("log")
    
    loader.style.animation = "none";
    loader.style.animation = "none";
    loader.hidden="true";
    hellotitle.style.display = "block";
    body.style.backgroundColor = "white";
    loginboxes.style.display = "block";
    lblDiag.style.display = "none";
    log.style.display = "none"

    // ---- no longer used ----
    // setTimeout(function() {
    //   }, 0);
}
ipcRenderer.send('ready-diag')
// setTimeout(stopLoader, 5000);