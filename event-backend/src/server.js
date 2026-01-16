const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const {login, me}=require("./authController");
const { requireAuth } = require('./authMiddleware');

app.post("/api/login", login)
app.get("/api/me", requireAuth, me);

const PORT = 5143;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});

//Partie SIGN UP
const {signup}=require("./authController");
app.post("/api/signup", signup)


