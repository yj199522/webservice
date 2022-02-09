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
        res.json("server responds with 200 OK if it is healhty.", 200)
    } catch (err) {
        res.json(err.message);
    }
})

app.get('*', function(req, res){

    res.send('Page not found!', 404);

});

module.exports = app;