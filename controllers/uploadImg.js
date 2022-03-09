const pool = require("../db");

const {
    basicAuth,
    comparePassword,
    getImage
} = require("../utils/helper");

const {
    v4: uuidv4
} = require("uuid");

require("dotenv").config();
var AWS = require("aws-sdk");
const bucketName = process.env.S3_BUCKET;
const region = process.env.AWS_REGION;
const s3 = new AWS.S3({
    region
});

const uploadImg = (req, res) => {
    const [username, password] = basicAuth(req);

    if (!username || !password) {
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
                            return res.status(401).json("Incorrect Password");
                        }
                    })
            } else {
                return res.status(401).json("Username Incorrect");
            }
        })
        .catch(err => {
            return res.status(400).json(err.message)
        })
}

const uploadImgData = (req, res, user_id) => {
    const {
        profilePic: {
            contents
        }
    } = req.body;
    let values = [user_id];
    const [img, file] = getImage(contents);
    let queries = "Select path from photos where user_id = $1"
    pool.query(queries, values)
        .then(result => {
            if (result.rows.length) {
                s3.deleteObject({
                    Bucket: bucketName,
                    Key: result.rows[0].path
                }, (err, data) => {
                    if (err) {
                        return res.status(400).json("Error deleting data to database while creating photos");
                    } else {
                        queries = "DELETE FROM photos WHERE user_id = $1"
                        pool.query(queries, values);
                    }
                })
            }
        })
    let upload_date = new Date().toISOString().slice(0, 10);
    const file_name = file[0] + "." + file[1];
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
                return res.status(400).json("Error inserting data to database while creating photos");
            } else {
                return res.status(201).json(result.rows[0]);
            }
        })
    })
}

module.exports = uploadImg;