const db = require("./db");
const bcrypt = require("bcrypt");

async function createUsers() {
    const hashed1 = await bcrypt.hash("1234", 10);
    const hashed2 = await bcrypt.hash("1234", 10);

    db.run(
        `INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`,
        ["jeeva", hashed1]
    );

    db.run(
        `INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`,
        ["mukesh", hashed2]
    );

    console.log("Users created (jeeva & mukesh)");
}

createUsers();