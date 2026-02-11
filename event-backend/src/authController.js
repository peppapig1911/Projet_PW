const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const pool = require("../db");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({error: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({error: "Invalid credentials"});
        }

        const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, {expiresIn: "365d"});

        return res.json({token});

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Server error"});
    }
};

//Partie SIGN UP

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Signup data received:", req.body);
        const checkUser = await pool.query("SELECT id FROM users WHERE username = $1", [username]);

        if (checkUser.rows.length>0) {
            return res.status(409).json({ error: "Username already taken" });
        }

        const saltRounds = 10; //facteur de coût
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const result = await pool.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username", [username, passwordHash]);
        const newUser = result.rows[0];

        return res.status(201).json({message: "User created successfully"});

    } catch (error) {
    console.log("--- DÉBUT DE L'ERREUR ---");
    console.error(error);
    console.log("--- FIN DE L'ERREUR ---");

    return res.status(500).json({
        error: "Server error",
        detail: error.message
    });
}
};

exports.me = async (req,res)=>{
    return res.json({
        user:{
            id: req.user.id,
            username:req.user.username,
        },
    });
};