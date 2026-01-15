const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./authMiddleware");
const pool = require("../db");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({ token });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}