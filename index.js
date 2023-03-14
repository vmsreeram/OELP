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
    var errimg = document.getElementById("errimg")
    
    loader.style.animation = "none";
    loader.style.animation = "none";
    loader.hidden="true";
    hellotitle.style.display = "block";
    body.style.backgroundColor = "white";
    loginboxes.style.display = "block";
    lblDiag.style.display = "none";
    errimg.style.display = "none"

    // ---- no longer used ----
    // setTimeout(function() {
    //   }, 0);
}
ipcRenderer.send('ready-diag')
// setTimeout(stopLoader, 5000);