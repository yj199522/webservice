const express = require('express');
const fileUpload = require("express-fileupload");
const app = express();
const StatsD = require('node-statsd');
sdc = new StatsD();
const logger = require('./logger');
app.use(fileUpload());
const {
    createUser,
    updateUser,
    viewUser,
    uploadImg,
    getImageData,
    deleteImg
} = require("./controllers");


const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

//Routes
app.post("/v1/user", createUser);
app.put("/v1/user/self", updateUser);
app.get("/v1/user/self", viewUser);
app.get("/v1/user/self", viewUser);
app.post("/v1/user/self/pic", uploadImg);
app.get("/v1/user/self/pic", getImageData);
app.delete("/v1/user/self/pic", deleteImg);
app.get("/healthz", (req, res) => {
    sdc.increment('endpoint.user.post');
    try {
        logger.info("server responds with 200 OK if it is healhty.");
        res.status(200).json("server responds with 200 OK if it is healhty.");
    } catch (err) {
        logger.info(err.message);
        res.json(err.message);
    }
});
app.get('*', function (req, res) {
    logger.error("Page not found!");
    res.status(404).json("Page not found!")
});
module.exports = app;