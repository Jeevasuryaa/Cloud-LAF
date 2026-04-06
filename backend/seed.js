const db = require("./db");
const bcrypt = require("bcrypt");

async function createUser() {
    const hashed = await bcrypt.hash("1234", 10);

    db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        ["jeeva", hashed],
        (err) => {
            if (err) console.log(err);
            else console.log("User created");
        }
    );
}

createUser();