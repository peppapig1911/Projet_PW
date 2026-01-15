const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const {login}=require("./authController");
const { requireAuth } = require('./authMiddleware');

app.post("/api/login", login)
app.post("/api/validate", requireAuth)

const PORT = 5000;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});

