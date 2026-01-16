const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const {login, me, signup}=require("./authController");
const { requireAuth } = require('./authMiddleware');

app.post("/api/login", login);
app.post("/api/signup", signup);
app.get("/api/me", requireAuth, me);

const PORT = 5143;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});


