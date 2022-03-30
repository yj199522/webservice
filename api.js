const express = require('express');
const fileUpload = require("express-fileupload");
const app = express();
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
    try {
        res.status(200).json("OK1")
    } catch (err) {
        res.json(err.message);
    }
});
app.get('*', function (req, res) {
    res.status(404).json("Page not found!")
});
module.exports = app;