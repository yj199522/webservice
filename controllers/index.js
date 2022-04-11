const createUser = require("./createUser");
const updateUser = require("./updateUser");
const viewUser = require("./viewUser");
const uploadImg = require("./uploadImg");
const getImageData = require("./getImg");
const deleteImg = require("./deleteImg")
const verifyUsers = require("./verifyUsers")

module.exports = {
    createUser,
    updateUser,
    viewUser,
    uploadImg,
    getImageData,
    deleteImg,
    verifyUsers
};