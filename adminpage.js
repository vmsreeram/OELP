// interprocess communication is done using ipcRenderer. 
const { ipcRenderer } = require('electron');
// setting up mongoclient which is used to comm with mongodb server
const { MongoClient } = require("mongodb");
const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri);

// closing the window ~ used only in dev phase
function closeFn1() {
    ipcRenderer.send('close')
}

async function run() {
    try {
        await client.connect();
        
        var db1 = client.db("tempdemo")
        const user = await db1.collection("deviceinfo").findOne({ "name":"admin" });
        if(!user)
        {
            alert("Alert: API Key not found");
        }
        else
        {
            alert("Alert: API Key found");
            document.getElementById('loginboxes').style.display = 'block';
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

function subCreds() {
    async function run1() {
        try {
            await client.connect();
            
            var db1 = client.db("tempdemo");
            var usrnm = document.getElementById("usrname");
            var passd = document.getElementById("pwd");
            const user = await db1.collection("userinfo").findOne({ "name":usrnm.value });
            if(!user)
            {
                await db1.collection("userinfo").insertOne({
                    "name": usrnm.value,
                    "password": passd.value,
                    "isadmin": "0"
                  });
                alert("Alert: User `"+usrnm.value+"` added to db");
            }
            else
            {
                alert("Alert: User `"+usrnm.value+"` already present in db");
            }

            
  
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
    run1().catch(console.dir);
}

document.getElementById("backbtn").onclick = function () {
    // location.href = "index.html";
    ipcRenderer.send('admin_logout');
};