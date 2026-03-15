import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
setDoc,
getDoc,
collection,
addDoc,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* ================= REGISTER ================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

signupForm.addEventListener("submit", async (e) => {

e.preventDefault();

const name = document.getElementById("signupName").value;
const roll = document.getElementById("signupRoll").value;
const email = document.getElementById("signupEmail").value;
const password = document.getElementById("signupPassword").value;

try {

const userCredential = await createUserWithEmailAndPassword(auth,email,password);

await setDoc(doc(db,"users",userCredential.user.uid),{
name:name,
rollNo:roll,
email:email
});

alert("Registered Successfully");

signupForm.reset();

window.location.href="login.html";

}catch(error){

alert(error.message);

}

});

}



/* ================= LOGIN ================= */

const loginForm = document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const email = document.getElementById("loginEmail").value;
const password = document.getElementById("loginPassword").value;

const errorBox = document.getElementById("loginError");

try{

await signInWithEmailAndPassword(auth,email,password);

if(errorBox){
errorBox.style.color="green";
errorBox.innerText="Login Successful";
}

setTimeout(()=>{
window.location.href="dashboard.html";
},1000);

}catch(error){

if(errorBox){
errorBox.style.color="red";
errorBox.innerText="Invalid email or password";
}else{
alert("Invalid email or password");
}

}

});

}



/* ================= USER SESSION ================= */

onAuthStateChanged(auth, async(user)=>{

if(user){

const docRef = doc(db,"users",user.uid);
const docSnap = await getDoc(docRef);

if(docSnap.exists()){

const data = docSnap.data();

const welcome = document.getElementById("welcomeUser");

if(welcome){
welcome.innerText = "Welcome " + data.name;
}

const name = document.getElementById("profileName");
const email = document.getElementById("profileEmail");
const roll = document.getElementById("profileRoll");

if(name) name.innerText = data.name;
if(email) email.innerText = data.email;
if(roll) roll.innerText = data.rollNo;

}

loadMyCourses();

}else{

if(window.location.pathname.includes("dashboard.html")){
window.location.href="login.html";
}

}

});



/* ================= LOGOUT ================= */

const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick = async()=>{

await signOut(auth);

window.location.href="login.html";

};

}



/* ================= SIDEBAR NAVIGATION ================= */

window.showCourses = function(){

document.getElementById("coursesSection").classList.remove("hidden");
document.getElementById("myCoursesSection").classList.add("hidden");
document.getElementById("profileSection").classList.add("hidden");
document.getElementById("faqSection").classList.add("hidden");

}

window.showMyCourses = function(){

document.getElementById("coursesSection").classList.add("hidden");
document.getElementById("myCoursesSection").classList.remove("hidden");
document.getElementById("profileSection").classList.add("hidden");
document.getElementById("faqSection").classList.add("hidden");

}

window.showProfile = function(){

document.getElementById("coursesSection").classList.add("hidden");
document.getElementById("myCoursesSection").classList.add("hidden");
document.getElementById("profileSection").classList.remove("hidden");
document.getElementById("faqSection").classList.add("hidden");

}

window.showFaq = function(){

document.getElementById("coursesSection").classList.add("hidden");
document.getElementById("myCoursesSection").classList.add("hidden");
document.getElementById("profileSection").classList.add("hidden");
document.getElementById("faqSection").classList.remove("hidden");

}



/* ================= COURSE ENROLL ================= */

window.enrollCourse = async(course)=>{

const user = auth.currentUser;

if(!user){
alert("Please login first");
return;
}

try{

// prevent duplicate enrollments
const q = query(
collection(db,"enrollments"),
where("userId","==",user.uid),
where("course","==",course)
);

const snapshot = await getDocs(q);

if(!snapshot.empty){
alert("You are already enrolled in this course");
return;
}

await addDoc(collection(db,"enrollments"),{

userId:user.uid,
course:course,
progress:1

});

alert("Enrolled Successfully");

window.location.href="course.html?course="+course;

}catch(error){

alert(error.message);

}

}



/* ================= LOAD MY COURSES ================= */

async function loadMyCourses(){

const user = auth.currentUser;

if(!user) return;

const q = query(collection(db,"enrollments"),where("userId","==",user.uid));

const querySnapshot = await getDocs(q);

const grid = document.getElementById("myCoursesGrid");

if(!grid) return;

grid.innerHTML="";

querySnapshot.forEach((doc)=>{

const data = doc.data();

const card = document.createElement("div");

card.className="course-card";

card.innerHTML=`

<h3>${data.course}</h3>
<p>Continue learning</p>
<button onclick="openCourse('${data.course}')">Open</button>

`;

grid.appendChild(card);

});

}



/* ================= OPEN COURSE ================= */

window.openCourse = function(course){

window.location.href="course.html?course="+course;

}