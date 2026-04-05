let votes = {};
let currentUser = "";

/* PAGE SWITCH (FIXED) */
function showSection(id){
document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active");
});

document.getElementById(id).classList.add("active");
}

/* LOGIN */
function login(){
if(!username.value || !password.value){
return alert("Enter credentials");
}

currentUser = username.value;

let initials = currentUser.split(" ").map(w=>w[0]).join("").toUpperCase();
avatar.innerText = initials;
avatar.classList.remove("hidden");

showSection("community");
}

/* COMMUNITY */
function previewMedia(){
let file = postMedia.files[0];
if(!file) return;

let url = URL.createObjectURL(file);
preview.innerHTML = `<img src="${url}" width="200">`;
}

function addPost(){
let text = postText.value;
if(!text) return;

let id = Date.now();
votes[id]=0;

posts.innerHTML += `
<div class="post" id="post-${id}">
<p id="text-${id}">${text}</p>

<div>
<button onclick="vote(${id},1)">⬆</button>
<span id="up-${id}">0</span>

<button onclick="vote(${id},-1)">⬇</button>
<span id="down-${id}">0</span>

<button onclick="deletePost(${id})">🗑</button>
</div>

<input placeholder="comment" onkeydown="if(event.key==='Enter') addComment(this)">
</div>
`;

postText.value="";
preview.innerHTML="";
}

function vote(id,val){
let current=votes[id];
let up=document.getElementById(`up-${id}`);
let down=document.getElementById(`down-${id}`);

if(current===val){
if(val===1) up.innerText--;
else down.innerText--;
votes[id]=0;
return;
}

if(current===1) up.innerText--;
if(current===-1) down.innerText--;

if(val===1) up.innerText++;
else down.innerText++;

votes[id]=val;
}

/* COMMENTS */
function addComment(input){
if(!input.value) return;

input.insertAdjacentHTML("afterend",
`<div class="comment">${input.value}</div>`);

input.value="";
}

/* LOST & FOUND */
function previewItem(){
let file=itemImg.files[0];
let url=URL.createObjectURL(file);
itemPreview.src=url;
itemPreview.classList.remove("hidden");
}

function addItem(){
items.innerHTML += `
<div class="item">
<h4>${itemTitle.value}</h4>
<p>${itemDesc.value}</p>
<img src="${itemPreview.src}" width="200">

<input placeholder="comment" onkeydown="if(event.key==='Enter') addComment(this)">
</div>
`;
}