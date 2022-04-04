const pool = require("../db");

const {
    basicAuth,
    comparePassword
} = require("../utils/helper");

const StatsD = require('statsd-client');
sdc = new StatsD({host: 'localhost', port: 8125});

const logger = require('../logger');

const getImageData = (req, res) => {
    const [username, password] = basicAuth(req);
    sdc.increment('endpoint.user.get - getImageData');
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
                            getImgData(req, res, id);
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

const getImgData = (req, res, user_id) => {
    let queries = "Select file_name, id, url, upload_date, user_id from photos where user_id = $1"
    let values = [user_id]
    pool.query(queries, values)
        .then(result => {
            if (!result.rowCount) {
                logger.error("Image not found");
                return res.status(404).json("Image not found");
            } else {
                result.rows[0].upload_date = new Date(result.rows[0].upload_date).toISOString().slice(0, 10)
                logger.error("Image details display for user_id: " + user_id);
                return res.status(200).json(result.rows[0]);
            }
        })
}

module.exports = getImageData;