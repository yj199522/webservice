const pool = require("../db");

const {
    basicAuth,
    comparePassword
} = require("../utils/helper");

require("dotenv").config();

const AWS = require("aws-sdk");
const bucketName = process.env.S3_BUCKET;
const region = process.env.AWS_REGION;
const s3 = new AWS.S3({
    region
});

const StatsD = require('statsd-client');
sdc = new StatsD({
    host: 'localhost',
    port: 8125
});

const logger = require('../logger');

const deleteImg = (req, res) => {
    const [username, password] = basicAuth(req);
    sdc.increment('endpoint.user.delete - deleteImg');
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
                    id,
                    verified
                } = result.rows[0];
                comparePassword(hashPassword, password)
                    .then(compareValue => {
                        if (compareValue) {
                            if (!verified) {
                                logger.error('User not Verified');
                                return res.status(400).json('User not Verified');
                            } else {
                                deleteImgData(res, id, username);
                            }
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
            logger.error(err.message);
            return res.status(400).json(err.message)
        })
}

const deleteImgData = (res, user_id, username) => {
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
                                logger.info("Image Deleted Successfully for username: " + username);
                                return res.status(204).json(results.rows[0]);
                            })
                    }
                })
            } else {
                logger.error("Image not found");
                return res.status(404).json("Image not found");
            }
        })
}

module.exports = deleteImg;