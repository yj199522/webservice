const express = require('express');
const app = express();


const cors = require("cors");
const pool = require('./db');

// middleware
app.use(cors());
app.use(express.json());

//Routes
app.get("/healthz", (req, res) => {
    try {
        res.status(200).json("server responds with 200 OK if it is healhty.")
    } catch (err) {
        res.json(err.message);
    }
})

app.get('*', function(req, res){
    res.status(404).json("Page not found!")
});

module.exports = app;