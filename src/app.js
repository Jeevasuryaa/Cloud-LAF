let votes = {};
let currentUser = "";

/* PAGE SWITCH (FIXED) */
function showSection(id) {
    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
}

/* LOGIN */
function login() {
    if (!username.value || !password.value) {
        return alert("Enter credentials");
    }

    currentUser = username.value;

    let initials = currentUser.split(" ").map(w => w[0]).join("").toUpperCase();
    avatar.innerText = initials;
    avatar.classList.remove("hidden");

    showSection("community");
}

/* COMMUNITY */
function previewMedia() {
    let file = postMedia.files[0];
    if (!file) return;

    let url = URL.createObjectURL(file);
    preview.innerHTML = `<img src="${url}" width="200">`;
}

function addPost() {
    let text = postText.value;
    let imgHTML = preview.innerHTML;
    if (!text && !imgHTML) return;

    let id = Date.now();
    votes[id] = 0;

    posts.innerHTML += `
<div class="post" id="post-${id}">
<div class="post-header">
<strong>${currentUser}</strong>
<div class="dropdown-container">
<button class="menu-btn" onclick="toggleMenu(${id})">⋮</button>
<div id="menu-${id}" class="menu-content">
<div onclick="savePost(${id})">Save</div>
<div onclick="editPost(${id})">Edit</div>
<div onclick="deletePost(${id})">Delete</div>
</div>
</div>
</div>
<p id="text-${id}">${text}</p>
${imgHTML}

<div>
<button onclick="vote(${id},1)">⬆</button>
<span id="up-${id}">0</span>

<button onclick="vote(${id},-1)">⬇</button>
<span id="down-${id}">0</span>
</div>

<div class="comments-section">
<input placeholder="comment" onkeydown="if(event.key==='Enter') addComment(this)">
</div>
</div>
`;

    postText.value = "";
    preview.innerHTML = "";
    postMedia.value = "";
}

function vote(id, val) {
    let current = votes[id];
    let up = document.getElementById(`up-${id}`);
    let down = document.getElementById(`down-${id}`);

    if (current === val) {
        if (val === 1) up.innerText--;
        else down.innerText--;
        votes[id] = 0;
        return;
    }

    if (current === 1) up.innerText--;
    if (current === -1) down.innerText--;

    if (val === 1) up.innerText++;
    else down.innerText++;

    votes[id] = val;
}

function toggleMenu(id) {
    let menu = document.getElementById(`menu-${id}`);
    menu.classList.toggle("show");
}

function savePost(id) {
    alert("Post saved successfully!");
    toggleMenu(id);
}

function editPost(id) {
    let textElem = document.getElementById(`text-${id}`);
    let newText = prompt("Edit your post:", textElem.innerText);
    if (newText !== null && newText.trim() !== "") {
        textElem.innerText = newText;
    }
    toggleMenu(id);
}

function deletePost(id) {
    let post = document.getElementById(`post-${id}`);
    if (post) post.remove();
}

/* COMMENTS */
function addComment(input) {
    if (!input.value) return;

    input.insertAdjacentHTML("afterend",
        `<div class="comment">${input.value}</div>`);

    input.value = "";
}

/* LOST & FOUND */
function previewItem() {
    let file = itemImg.files[0];
    let url = URL.createObjectURL(file);
    itemPreview.src = url;
    itemPreview.classList.remove("hidden");
}

function addItem() {
    let id = Date.now();
    items.innerHTML += `
<div class="item" id="item-${id}">
<div class="post-header">
<strong>${currentUser}</strong>
<div class="dropdown-container">
<button class="menu-btn" onclick="toggleMenu(${id})">⋮</button>
<div id="menu-${id}" class="menu-content">
<div onclick="saveItem(${id})">Save</div>
<div onclick="editItem(${id})">Edit</div>
<div onclick="deleteItem(${id})">Delete</div>
</div>
</div>
</div>
<h4 id="item-title-${id}">${itemTitle.value}</h4>
<p id="item-desc-${id}">${itemDesc.value}</p>
<img src="${itemPreview.src}" width="200">

<div class="comments-section">
<input placeholder="comment" onkeydown="if(event.key==='Enter') addComment(this)">
</div>
</div>
`;

    itemTitle.value = "";
    itemDesc.value = "";
    itemPreview.classList.add("hidden");
    itemPreview.src = "";
    itemImg.value = "";
}

function saveItem(id) {
    alert("Item saved successfully!");
    toggleMenu(id);
}

function editItem(id) {
    let titleElem = document.getElementById(`item-title-${id}`);
    let descElem = document.getElementById(`item-desc-${id}`);

    let newTitle = prompt("Edit your item title:", titleElem.innerText);
    if (newTitle !== null && newTitle.trim() !== "") {
        titleElem.innerText = newTitle;
    }

    let newDesc = prompt("Edit your item description:", descElem.innerText);
    if (newDesc !== null && newDesc.trim() !== "") {
        descElem.innerText = newDesc;
    }
    toggleMenu(id);
}

function deleteItem(id) {
    let item = document.getElementById(`item-${id}`);
    if (item) item.remove();
}