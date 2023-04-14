require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require("mongoose");

// Global user model
var User;
async function connectMongoose() {
    await mongoose.connect(`${process.env.DB_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("mongoose connected");
    });
    require("./user");
    User = mongoose.model("User");
}

async function initialLoad() {
    await connectMongoose();
}

initialLoad();

// GET root
app.get("/", async (req, res) => {
    res.send("This is our main endpoint");
});

// GET a single user
app.get("/users/:uid", async (req, res) => {
    const id = req.params.uid;
    User.findById(id).then((user) => {
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    }).catch(err => {
        if (err) {
            throw err;
        }
    })
});

// Create a new user
app.post("/users", async (req, res) => {
    const body = req?.body;
    const {
        name,
        email,
        phone,
    } = body;
    const newUser = {
        name,
        email,
        phone,
    };
    const user = new User(newUser);
    user.save().then((r) => {
        res.send("User created..");
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })
})

app.delete("/users/:uid", async (req, res) => {
    const id = req.params.uid;
    User.findByIDAndDelete(id);
});

app.listen(process.env.PORT, () => {
    console.log(   `Up and running on port ${process.env.PORT}-- this is our users service `);
})