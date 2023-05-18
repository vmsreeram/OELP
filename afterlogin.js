// interprocess communication is done using ipcRenderer. 
const { ipcRenderer } = require('electron');

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

async function testSetFn1() {
    // alert("Alert: To be implemented");
    var db1 = client.db("tempdemo")
    const amount_left = await db1.collection("credits").findOne({ "name":"credits" });
    if(test1_amount <= amount_left.amount){
        const result = await db1.collection('credits').updateOne(
            { name: 'credits' },
            { $set: { amount: amount_left.amount-test1_amount } }
          );
    ipcRenderer.send('user_test1');

    }
    else{
        alert("Insufficient credits");
    }
    /**
     *  var XMLHttpRequest = require('xhr2'); 
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/moveDot?x=0&y=0");
        xhr.send();
     */
}

  
function testSetFn2() {
    alert("Alert: To be implemented");
    // ipcRenderer.send('close')
}
function testSetFn3() {
    alert("Alert: To be implemented");
    // ipcRenderer.send('close')
}


document.getElementById("userlogout").onclick = function () {
    // location.href = "index.html";
    ipcRenderer.send('user_logout');
};

