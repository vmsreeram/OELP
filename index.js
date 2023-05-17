const { ipcRenderer } = require('electron');
// interprocess communication is done ipcrenderer
ipcRenderer.on('fn-called', () => {
    // when main.js sees that diagonostics.py (in http server) has returned, it calles fn-called on ipc channel
    stopLoader();
});

// setting up mongoclient which is used to comm with mongodb server
const { MongoClient } = require("mongodb");
const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri);

//////////////// Diagnostics logging section
////////////////
document.addEventListener("DOMContentLoaded", function(event) {
    const logTextArea = document.getElementById('log');
  
    function appendToLog(text) {
      logTextArea.value += text + '\n';
    }

    // check whether http server is up and running
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

    // check whether mongodb server is up and running
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

// closing the window ~ used only in dev phase
function closeFn1() {
    ipcRenderer.send('close')
}

// function that sends the username, password to mongoDB and verifies the credentials
function subCreds() {
    async function run() {
        try {
            ////
            const options1 = {
                host: '0.0.0.0',
                port: 27017,
                path: '/'
            };
            const http = require('http');
            const request1 = http.request(options1, (response) => {
                
            });
            request1.on('error', (error) => {
                alert(`MongoDB Server is not running.`);
                console.log(`MongoDB Server error: ${error.message}`);
                document.getElementById("usrname").value="";
                document.getElementById("pwd").value="";
            });
            request1.end();
            ////
            await client.connect();
            
            var usrnm = document.getElementById("usrname")
            var passd = document.getElementById("pwd")
            var db1 = client.db("tempdemo")
            const user = await db1.collection("userinfo").findOne({ "name":usrnm.value });
            if(!user || (user.password != passd.value))
            {
                alert("Alert: Incorrect credentials");
                usrnm.value=""
                passd.value=""
            }
            else
            {
                if(user.isadmin == "1")
                {
                    alert("Alert: Logged in as admin");
                    usrnm.value=""
                    passd.value=""
                    ipcRenderer.send("loggedin_adm")

                }
                else
                {
                    alert("Alert: Logged in");
                    usrnm.value=""
                    passd.value=""
                    ipcRenderer.send("loggedin")
                }
            }
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
    run().catch(console.dir);

    
}

// Function that stops the spinning css-loader, and displays wecome page. Called when diagonostics is completed and successful.
function stopLoader() {
    async function run() {
        try {
            await client.connect();
            var db1 = client.db("tempdemo")
            const apikey = await db1.collection("deviceinfo").findOne({"name":"admin"});
            if(!apikey){
                console.log("API key not present");
                ipcRenderer.send('oauth-redirect');
                // ipcRenderer.on('ouath-redirect-response',async (event, arg)=>{
                //     const emailAddress = arg[0];
                //     console.log(emailAddress);
                //     //
                //     var db2 = client.db("company_db")
                //     const Entry = await db2.collection("customer").findOne({"email":emailAddress});
                //     if(!Entry) {
                //         //
                //     } else {
                //         db1.collection("deviceinfo").insertOne({"name":"admin","api_key":Entry.apikey})
                //         ipcRenderer.send('admin_passwordset');
                //     }

                // });
            }
            else{
                console.log("API key present");
            }
        }
         finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
    run().catch(console.dir);

    var loader = document.getElementById("loader");
    var hellotitle = document.getElementById("hellotitle");
    var body = document.querySelector("body");
    var loginboxes = document.getElementById("loginboxes");
    var lblDiag = document.getElementById("lblDiag")
    var log = document.getElementById("log")
    var wifibtn = document.getElementById("wificnctbtn")
    wifibtn.style.display = "block";
    loader.style.animation = "none";
    loader.style.animation = "none";
    loader.hidden="true";
    hellotitle.style.display = "block";
    body.style.backgroundColor = "white";
    loginboxes.style.display = "block";
    lblDiag.style.display = "none";
    log.style.display = "none"

}
ipcRenderer.send('ready-diag')
