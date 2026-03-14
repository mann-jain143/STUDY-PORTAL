// Import Firebase database
import { db } from "./firebase.js";

import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function fillComplaint(){

const issue = document.getElementById("issueType").value;
const textbox = document.getElementById("complaintText");

if(issue !== ""){
textbox.value = issue;
}

}
// Function to submit complaint
async function sendComplaint(){

const email = localStorage.getItem("userEmail");

const issue = document.getElementById("issueType").value;
const text = document.getElementById("complaintText").value;

// only check if complaint text exists
if(text.trim() === ""){
alert("Please describe your problem");
return;
}

try{

await addDoc(collection(db,"complaints"),{

userEmail: email,
issueType: issue ? issue : "User described issue",
complaintText: text,
status: "Pending",
time: serverTimestamp()

});

document.getElementById("statusMsg").innerText =
"Complaint submitted successfully";

document.getElementById("complaintText").value="";
document.getElementById("issueType").value="";

}
catch(error){

console.error("Complaint error:",error);
alert("Error submitting complaint");

}

window.sendComplaint = sendComplaint;
}