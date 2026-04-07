let votes = {};
let currentUser = "";
let historyStack = [];

window.onload = () => {
    let token = localStorage.getItem("token");
    let username = localStorage.getItem("username");
    let userId = localStorage.getItem("userId");

    if (token && username && userId) {
        currentUser = username;

        let initials = username.split(" ").map(w => w[0]).join("").toUpperCase();

        let sidebarAvatar = document.getElementById("sidebar-avatar");
        sidebarAvatar.innerText = initials;
        document.getElementById("sidebar-username").innerText = username;

        document.getElementById("sidebar").classList.remove("hidden");
        document.getElementById("main-content").classList.add("shifted");

        showSection("community");
        loadPosts(); // 🔥 load from DB
    }
};

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
}

async function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (!user || !pass) return alert("Enter credentials");

    try {
        let res = await fetch("http://13.49.78.182:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user, password: pass })
        });

        let data = await res.json();

        if (data.error) return alert(data.error);

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.id);

        currentUser = data.username;

        let initials = currentUser.split(" ").map(w => w[0]).join("").toUpperCase();

        document.getElementById("sidebar-avatar").innerText = initials;
        document.getElementById("sidebar-username").innerText = currentUser;

        document.getElementById("sidebar").classList.remove("hidden");
        document.getElementById("main-content").classList.add("shifted");

        historyStack = [];

        showSection("community");
        loadPosts();

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}


function previewMedia() {
    let file = postMedia.files[0];
    if (!file) return;

    let url = URL.createObjectURL(file);
    preview.innerHTML = `<img src="${url}" width="200">`;
}


async function addPost() {
    let text = postText.value;
    let imgHTML = preview.innerHTML;
    if (!text && !imgHTML) return;

    let userId = localStorage.getItem("userId");

    // ✅ Save to DB
    await fetch("http://13.49.78.182:5000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: text,
            image: "",
            user_id: userId
        })
    });

    loadPosts();

    postText.value = "";
    preview.innerHTML = "";
    postMedia.value = "";
}

async function loadPosts() {
    let res = await fetch("http://13.49.78.182:5000/posts");
    let data = await res.json();

    posts.innerHTML = "";

    data.forEach(post => {
        let id = post.id;

        votes[id] = 0;

        let commentsHTML = "";
        if (post.comments && post.comments.length > 0) {
            post.comments.forEach(c => {
                commentsHTML += `
                <div class="comment">
                    <strong>${c.username}:</strong> ${c.content}
                </div>
                `;
            });
        }

        posts.innerHTML += `
<div class="post" id="post-${id}">
<div class="post-header">
<strong>${post.username}</strong>
<div class="dropdown-container">
<button class="menu-btn" onclick="toggleMenu(${id})">...</button>
<div id="menu-${id}" class="menu-content">
<div onclick="savePost(${id})">Save</div>
<div onclick="editPost(${id})">Edit</div>
<div onclick="deletePost(${id})">Delete</div>
</div>
</div>
</div>

<p id="text-${id}">${post.content}</p>

<div>
<button onclick="vote(${id},1)">+</button>
<span id="up-${id}">${post.upvotes || 0}</span>

<button onclick="vote(${id},-1)">-</button>
<span id="down-${id}">${post.downvotes || 0}</span>
</div>

<div class="comments-section">
${commentsHTML}

<input placeholder="comment" 
onkeydown="if(event.key==='Enter') addComment(this, ${id})">
</div>
</div>
`;
    });
}


async function vote(id, val) {
    let userId = localStorage.getItem("userId");

    await fetch("http://13.49.78.182:5000/vote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: userId,
            post_id: id,
            value: val
        })
    });

    loadPosts();
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

async function deletePost(id) {
    await fetch(`http://13.49.78.182:5000/posts/${id}`, {
        method: "DELETE"
    });

    loadPosts(); // refresh UI
}

async function addComment(input, postId) {
    if (!input.value) return;

    let userId = localStorage.getItem("userId");

    await fetch("http://13.49.78.182:5000/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: userId,
            post_id: postId,
            content: input.value
        })
    });

    input.value = "";
    loadPosts(); 
}