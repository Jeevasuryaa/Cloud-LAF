const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "supersecretkey";

app.get("/", (req, res) => {
    res.send("API Running 🚀");
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) return res.status(500).json({ error: "DB error" });

        if (!user) return res.status(400).json({ error: "User not found" });

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) return res.status(400).json({ error: "Wrong password" });

        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            username: user.username,
            id: user.id
        });
    });
});

/* ================= CREATE POST ================= */
app.post("/posts", (req, res) => {
    const { content, image, user_id } = req.body;

    db.run(
        `INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)`,
        [user_id, content, image],
        function (err) {
            if (err) return res.status(500).json({ error: "DB error" });

            res.json({ success: true, postId: this.lastID });
        }
    );
});

/* ================= GET POSTS (WITH VOTES) ================= */
app.get("/posts", (req, res) => {
    db.all(`
        SELECT 
            posts.*,
            users.username,
            SUM(CASE WHEN votes.value = 1 THEN 1 ELSE 0 END) AS upvotes,
            SUM(CASE WHEN votes.value = -1 THEN 1 ELSE 0 END) AS downvotes
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN votes ON posts.id = votes.post_id
        GROUP BY posts.id
        ORDER BY posts.id DESC
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(rows);
    });
});

/* ================= VOTE ================= */
app.post("/vote", (req, res) => {
    const { user_id, post_id, value } = req.body;

    db.get(
        `SELECT * FROM votes WHERE user_id = ? AND post_id = ?`,
        [user_id, post_id],
        (err, row) => {
            if (row) {
                if (row.value === value) {
                    db.run(`DELETE FROM votes WHERE user_id=? AND post_id=?`, [user_id, post_id]);
                } else {
                    db.run(`UPDATE votes SET value=? WHERE user_id=? AND post_id=?`, [value, user_id, post_id]);
                }
            } else {
                db.run(`INSERT INTO votes (user_id, post_id, value) VALUES (?, ?, ?)`,
                    [user_id, post_id, value]);
            }

            res.json({ success: true });
        }
    );
});

app.listen(5000, () => console.log("Server running on port 5000"));