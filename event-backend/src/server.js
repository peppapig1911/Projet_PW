const express = require('express');
const cors = require("cors");
const eventController = require("./eventController");
const eventSubscription = require("./eventSubscription");

const app = express();
app.use(express.json());
app.use(cors());

const {login, me, signup}=require("./authController");
const { requireAuth } = require('./authMiddleware');

app.post("/api/login", login);
app.post("/api/signup", signup);
app.get("/api/me", requireAuth, me);
app.get("/api/events", eventController.getAllEvents);
app.post("/api/events", requireAuth, eventController.createEvent);
app.post("/api/events/:id/register", requireAuth, eventSubscription.register);
app.delete("/api/events/:id/unregister", requireAuth, eventSubscription.unregister);

const PORT = 5143;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});


