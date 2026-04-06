const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "supersecretkey"; // later move to .env

app.get("/", (req, res) => {
    res.send("API Running 🚀");
});

/* LOGIN API */
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        async (err, user) => {
            if (err) return res.status(500).json({ error: "DB error" });

            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return res.status(400).json({ error: "Wrong password" });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                SECRET,
                { expiresIn: "1d" }
            );

            res.json({
                token,
                username: user.username
            });
        }
    );
});

app.listen(5000, () => console.log("Server running on port 5000"));