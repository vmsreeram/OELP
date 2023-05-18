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

async function get_cur_amount(){
    var db1 = client.db("tempdemo")
    const amount_left =  await db1.collection("credits").findOne({ "name":"credits" });
    return amount_left.amount;
}
const showcreds = document.getElementById("credits_left")
async function updateCreditsDisplay() {
    const currentAmount = await get_cur_amount();
    showcreds.innerHTML = `Credits left - ${currentAmount}`;
}
updateCreditsDisplay();


document.getElementById('loginboxes').style.display = 'block';
document.getElementById('addcreditboxes').style.display = 'block';

// async function run() {
//     try {
//         await client.connect();
        
//         var db1 = client.db("tempdemo")
//         const user = await db1.collection("deviceinfo").findOne({ "name":"admin" });
//         if(!user)
//         {
//             alert("Alert: API Key not found");
//         }
//         else
//         {
//             // alert("Alert: API Key found");
           
//         }
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

function subCreds() {
    async function run1() {
        try {

            await client.connect();
            
            var db1 = client.db("tempdemo");
            var usrnm = document.getElementById("usrname");
            var passd = document.getElementById("pwd");
            if(usrnm.value == ""){
                alert("Add valid username");
                return
            }
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
            document.getElementById("usrname").value="";
            document.getElementById("pwd").value="";
            
  
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
    run1().catch(console.dir);
}

async function updateCredits(){
            var db1 = client.db("tempdemo");
            var credits_add = document.getElementById("credits_amount");
            console.log(credits_add.value)
            if(credits_add.value != "") {
                const currentAmount = await get_cur_amount();
                console.log(currentAmount)
                const result = await db1.collection('credits').updateOne(
                    { name: 'credits' },
                    { $set: { amount: currentAmount+parseInt(credits_add.value )} }
                );
                updateCreditsDisplay();
                document.getElementById("credits_amount").value="";
            }
}

document.getElementById("backbtn").onclick = function () {
    // location.href = "index.html";
    ipcRenderer.send('admin_logout');
};