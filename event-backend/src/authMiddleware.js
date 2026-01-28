const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

exports.requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Error token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Erreur JWT détaillée:", error.message);
        return res.status(401).json({ error: "Token invalid" });
    }
};


exports.checkUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // On identifie l'utilisateur pour le SQL
        next();
    } catch (error) {
        next();
    }
};
