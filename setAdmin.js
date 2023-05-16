const { ipcRenderer } = require('electron');
// setting up mongoclient which is used to comm with mongodb server
const { MongoClient } = require("mongodb");
const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri);

// closing the window ~ used only in dev phase
function closeFn1() {
    ipcRenderer.send('close')
}

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
                    "isadmin": "1"
                  });
                alert("Alert: User `"+usrnm.value+"` added to db");
                ipcRenderer.send('adminReg_logout');
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