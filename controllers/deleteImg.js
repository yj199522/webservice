const pool = require("../db");

const {
    basicAuth,
    comparePassword
} = require("../utils/helper");

require("dotenv").config();
var AWS = require("aws-sdk");
const bucketName = process.env.S3_BUCKET;
const region = process.env.AWS_REGION;
const s3 = new AWS.S3({
    region
});


const deleteImg = (req, res) => {
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
                            deleteImgData(res, id);
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

const deleteImgData = (res, user_id) => {
    let queries = "Select path from photos where user_id = $1";
    let values = [user_id];
    pool.query(queries, values)
        .then(result => {
            if (result.rowCount) {
                s3.deleteObject({
                    Bucket: bucketName,
                    Key: result.rows[0].path
                }, (err, data) => {
                    if (err) {
                        return res.status(400).json(err);
                    } else {
                        queries = "DELETE FROM photos WHERE user_id = $1"
                        pool.query(queries, values)
                            .then(results => {
                                return res.status(204).json(results.rows[0]);
                            })
                    }
                })
            } else {
                return res.status(404).json("Image not found");
            }
        })
}

module.exports = deleteImg;