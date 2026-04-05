let votes = {};
let currentUser = "";
let historyStack = [];

/* PAGE SWITCH (FIXED) */
function showSection(id, isBack = false) {
    let currentActive = document.querySelector(".page.active");

    // Keep track of history if not using the back button
    if (currentActive && !isBack && currentActive.id !== "login" && currentActive.id !== id) {
        historyStack.push(currentActive.id);
    }

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    // Manage sidebar visibility based on login state
    let sidebar = document.getElementById("sidebar");
    let mainContent = document.getElementById("main-content");
    if (id === "login") {
        sidebar.classList.add("hidden");
        mainContent.classList.remove("shifted");
    } else if (currentUser !== "") {
        sidebar.classList.remove("hidden");
        mainContent.classList.add("shifted");
    }

    // Manage back button visibility
    let backBtn = document.getElementById("back-btn");
    if (backBtn) {
        if (id === "login" || historyStack.length === 0) {
            backBtn.classList.add("hidden");
        } else {
            backBtn.classList.remove("hidden");
        }
    }
}

function goBack() {
    if (historyStack.length > 0) {
        let prev = historyStack.pop();
        showSection(prev, true);
    }
}

/* LOGIN */
function login() {
    if (!username.value || !password.value) {
        return alert("Enter credentials");
    }

    currentUser = username.value;

    let initials = currentUser.split(" ").map(w => w[0]).join("").toUpperCase();

    let sidebarAvatar = document.getElementById("sidebar-avatar");
    sidebarAvatar.innerText = initials;
    document.getElementById("sidebar-username").innerText = currentUser;

    document.getElementById("sidebar").classList.remove("hidden");
    document.getElementById("main-content").classList.add("shifted");

    historyStack = []; // Reset history stack on login

    showSection("community");
}

function changeProfilePic() {
    let file = document.getElementById("profilePicInput").files[0];
    if (!file) return;

    let url = URL.createObjectURL(file);
    let avatar = document.getElementById("sidebar-avatar");
    avatar.style.backgroundImage = `url(${url})`;
    avatar.innerText = ""; // Hide initials if image is set
}

function maximizeProfilePic() {
    let avatar = document.getElementById("sidebar-avatar");
    let bgImage = avatar.style.backgroundImage;
    
    // Don't maximize if they haven't uploaded an image yet
    if (!bgImage || bgImage === 'none') return;
    
    let url = bgImage.slice(4, -1).replace(/"/g, "");
    document.getElementById("fullImage").src = url;
    document.getElementById("imageModal").classList.add("active");
}

function closeModal() {
    document.getElementById("imageModal").classList.remove("active");
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
    let post = document.getElementById(`post-${id}`);
    if (post) {
        let clone = post.cloneNode(true);
        clone.id = `saved-post-${id}`; // avoid ID conflicts
        let menu = clone.querySelector(".dropdown-container");
        if (menu) menu.remove(); // Remove dropdown for saved items

        document.getElementById("savedItems").appendChild(clone);
        alert("Post saved to your profile!");
    }
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
    let item = document.getElementById(`item-${id}`);
    if (item) {
        let clone = item.cloneNode(true);
        clone.id = `saved-item-${id}`; // avoid ID conflicts
        let menu = clone.querySelector(".dropdown-container");
        if (menu) menu.remove(); // Remove dropdown for saved items

        document.getElementById("savedItems").appendChild(clone);
        alert("Item saved to your profile!");
    }
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