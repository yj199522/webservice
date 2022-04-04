const pool = require("../db");

const {
    basicAuth,
    comparePassword
} = require("../utils/helper");

const {
    v4: uuidv4
} = require("uuid");

require("dotenv").config();
const AWS = require("aws-sdk");
const bucketName = process.env.S3_BUCKET;
const region = process.env.AWS_REGION;
const s3 = new AWS.S3({
    region
});


const StatsD = require('statsd-client');
sdc = new StatsD();

const logger = require('../logger');

const uploadImg = (req, res) => {
    const [username, password] = basicAuth(req);
    sdc.increment('endpoint.user.post');
    if (!username || !password) {
        logger.error("Forbidden Request");
        return res.status(403).json("Forbidden Request");
    }

    let queries = "SELECT * from users where username = $1";
    let values = [username];

    pool.query(queries, values)
        .then(result => {
            if (result.rowCount) {
                const {
                    password: hashPassword,
                    id
                } = result.rows[0];
                comparePassword(hashPassword, password)
                    .then(compareValue => {
                        if (compareValue) {
                            uploadImgData(req, res, id);
                        } else {
                            logger.error("Incorrect Password");
                            return res.status(401).json("Incorrect Password");
                        }
                    })
            } else {
                logger.error("Username Incorrect");
                return res.status(401).json("Username Incorrect");
            }
        })
        .catch(err => {
            return res.status(400).json(err.message)
        })
}

const uploadImgData = (req, res, user_id) => {
    if (!req.files) {
        logger.error("No data is provided");
        return res.status(400).json("No data is provided");
    }
    if (!req.files.fileName || !req.files.fileName.name) {
        logger.error("Incorrect data format");
        return res.status(400).json("Incorrect data format");
    }
    const {
        fileName: {
            name: file_name,
            data: img
        }
    } = req.files;
    const fileType = ['png', 'jpg', 'jpeg'];
    if (!fileType.includes(file_name.split('.')[1])) {
        logger.error("Only .png, .jpg, or .jpeg is required");
        return res.status(400).json("Only .png, .jpg, or .jpeg is required");
    }
    let values = [user_id];
    let queries = "Select path from photos where user_id = $1"
    pool.query(queries, values)
        .then(result => {
            if (result.rows.length) {
                s3.deleteObject({
                    Bucket: bucketName,
                    Key: result.rows[0].path
                }, (err, data) => {
                    if (err) {
                        logger.error("Error deleting data to database while creating photos");
                        return res.status(400).json("Error deleting data to database while creating photos");
                    } else {
                        queries = "DELETE FROM photos WHERE user_id = $1"
                        pool.query(queries, values);
                    }
                })
            }
        })
    let upload_date = new Date().toISOString().slice(0, 10);
    let imgData = `images/${user_id}/` + file_name;
    const params = {
        Bucket: bucketName,
        Key: imgData,
        Body: img,
        Metadata: {
            file_name,
            id: uuidv4(),
            upload_date,
            user_id
        }
    }
    s3.upload(params, (err, data) => {
        if (err) {
            throw (err);
        }
        const {
            Location,
            Key
        } = data
        queries = "INSERT INTO photos(id, user_id, file_name, url, upload_date, path) VALUES($1, $2,  $3, $4, $5, $6) RETURNING file_name, id, url, upload_date,user_id";
        values = [uuidv4(), user_id, file_name, Location, upload_date, Key];
        pool.query(queries, values, (err, result) => {
            if (err) {
                logger.error("Error inserting data to database while creating photos");
                return res.status(400).json("Error inserting data to database while creating photos");
            } else {
                logger.info("Image Uploaded Successfully for user_id: " + user_id);
                return res.status(201).json(result.rows[0]);
            }
        })
    })
}

module.exports = uploadImg;