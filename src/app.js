let votes = {};
let currentUser = "";
let historyStack = [];

/* ================= AUTO LOGIN ================= */
window.onload = () => {
    let token = localStorage.getItem("token");
    let username = localStorage.getItem("username");

    if (token && username) {
        currentUser = username;

        let initials = username.split(" ").map(w => w[0]).join("").toUpperCase();

        let sidebarAvatar = document.getElementById("sidebar-avatar");
        sidebarAvatar.innerText = initials;
        document.getElementById("sidebar-username").innerText = username;

        document.getElementById("sidebar").classList.remove("hidden");
        document.getElementById("main-content").classList.add("shifted");

        showSection("community");
    }
};

/* ================= PAGE SWITCH ================= */
function showSection(id, isBack = false) {
    let currentActive = document.querySelector(".page.active");

    if (currentActive && !isBack && currentActive.id !== "login" && currentActive.id !== id) {
        historyStack.push(currentActive.id);
    }

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    let sidebar = document.getElementById("sidebar");
    let mainContent = document.getElementById("main-content");

    if (id === "login") {
        sidebar.classList.add("hidden");
        mainContent.classList.remove("shifted");
    } else if (currentUser !== "") {
        sidebar.classList.remove("hidden");
        mainContent.classList.add("shifted");
    }

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

/* ================= LOGIN (BACKEND) ================= */
async function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (!user || !pass) {
        return alert("Enter credentials");
    }

    try {
        let res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user,
                password: pass
            })
        });

        let data = await res.json();

        if (data.error) {
            return alert(data.error);
        }

        // SAVE SESSION
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        currentUser = data.username;

        let initials = currentUser.split(" ").map(w => w[0]).join("").toUpperCase();

        let sidebarAvatar = document.getElementById("sidebar-avatar");
        sidebarAvatar.innerText = initials;
        document.getElementById("sidebar-username").innerText = currentUser;

        document.getElementById("sidebar").classList.remove("hidden");
        document.getElementById("main-content").classList.add("shifted");

        historyStack = [];

        showSection("community");

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

/* ================= PROFILE ================= */
function changeProfilePic() {
    let file = document.getElementById("profilePicInput").files[0];
    if (!file) return;

    let url = URL.createObjectURL(file);
    let avatar = document.getElementById("sidebar-avatar");
    avatar.style.backgroundImage = `url(${url})`;
    avatar.innerText = "";
}

function maximizeProfilePic() {
    let avatar = document.getElementById("sidebar-avatar");
    let bgImage = avatar.style.backgroundImage;

    if (!bgImage || bgImage === 'none') return;

    let url = bgImage.slice(4, -1).replace(/"/g, "");
    document.getElementById("fullImage").src = url;
    document.getElementById("imageModal").classList.add("active");
}

function closeModal() {
    document.getElementById("imageModal").classList.remove("active");
}

/* ================= COMMUNITY ================= */
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
<button class="menu-btn" onclick="toggleMenu(${id})">...</button>
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
<button onclick="vote(${id},1)">+</button>
<span id="up-${id}">0</span>

<button onclick="vote(${id},-1)">-</button>
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
        clone.id = `saved-post-${id}`;
        let menu = clone.querySelector(".dropdown-container");
        if (menu) menu.remove();

        document.getElementById("savedItems").appendChild(clone);
        alert("Post saved!");
    }
    toggleMenu(id);
}

function editPost(id) {
    let textElem = document.getElementById(`text-${id}`);
    let newText = prompt("Edit post:", textElem.innerText);
    if (newText) textElem.innerText = newText;
    toggleMenu(id);
}

function deletePost(id) {
    let post = document.getElementById(`post-${id}`);
    if (post) post.remove();
}

/* ================= COMMENTS ================= */
function addComment(input) {
    if (!input.value) return;

    input.insertAdjacentHTML("afterend",
        `<div class="comment">${input.value}</div>`);

    input.value = "";
}

/* ================= LOST & FOUND ================= */
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
<button class="menu-btn" onclick="toggleMenu(${id})">...</button>
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
        clone.id = `saved-item-${id}`;
        let menu = clone.querySelector(".dropdown-container");
        if (menu) menu.remove();

        document.getElementById("savedItems").appendChild(clone);
        alert("Item saved!");
    }
    toggleMenu(id);
}

function editItem(id) {
    let titleElem = document.getElementById(`item-title-${id}`);
    let descElem = document.getElementById(`item-desc-${id}`);

    let newTitle = prompt("Edit title:", titleElem.innerText);
    if (newTitle) titleElem.innerText = newTitle;

    let newDesc = prompt("Edit description:", descElem.innerText);
    if (newDesc) descElem.innerText = newDesc;

    toggleMenu(id);
}

function deleteItem(id) {
    let item = document.getElementById(`item-${id}`);
    if (item) item.remove();
}