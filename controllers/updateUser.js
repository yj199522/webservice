const pool = require("../db");

const {
    generatePasswordHash,
    basicAuth,
    comparePassword
} = require("../utils/helper");

const StatsD = require('statsd-client');
sdc = new StatsD({
    host: 'localhost',
    port: 8125
});

const logger = require('../logger');

const updateUser = (req, res) => {
    const [username, password] = basicAuth(req);
    sdc.increment('endpoint.user.put - updateUser');
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
                    verified
                } = result.rows[0];
                comparePassword(hashPassword, password)
                    .then(compareValue => {
                        if (compareValue) {
                            if (!verified) {
                                logger.error('User not Verified');
                                return res.status(400).json('User not Verified');
                            } else {
                                updateData(req, res, username);
                            }
                        } else {
                            logger.error("Incorrect Password");
                            return res.status(401).json("Incorrect Password");
                        }
                    })
            } else {
                logger.error("Username Password");
                return res.status(401).json("Username Incorrect");
            }
        })
        .catch(err => {
            logger.error(err.message);
            return res.status(400).json(err.message)
        })
}

const updateData = (req, res, username) => {
    const fieldNeeded = ["first_name", "last_name", "password"];
    const reqKey = req.body ? Object.keys(req.body) : null;

    if (!reqKey || !reqKey.length) {
        logger.error("No information is provided to update user");
        return res.status(400).json("No information is provided to update user");
    }

    let checking = true;

    reqKey.forEach(val => {
        if (fieldNeeded.indexOf(val) < 0) {
            checking = false;
        }
    })

    if (!checking) {
        logger.error("Only first_name, last_name, and password is required");
        return res.status(400).json("Only first_name, last_name, and password is required");
    }

    const account_updated = new Date().toISOString();
    const {
        first_name,
        last_name,
        password
    } = req.body;
    if ((password && password.length < 8) || (first_name && !first_name.length) || (last_name && !last_name.length)) {
        logger.error("Incorrect data format");
        return res.status(400).json("Incorrect data format");
    }

    if (password) {
        generatePasswordHash(password)
            .then((hashPassword) => {
                req.body.password = hashPassword;
                updatingQuery(req, res, username, account_updated);
            })
    } else {
        updatingQuery(req, res, username, account_updated);
    }
}

const updatingQuery = (req, res, username, account_updated) => {
    const dKeys = Object.keys(req.body);
    dKeys.push("account_updated");
    const dataTuples = dKeys.map((k, index) => `${k} = $${index + 1}`);
    const updates = dataTuples.join(", ");

    const queries = `UPDATE users SET ${updates} where username = $${dKeys.length +  1}`;
    const values = [...Object.values(req.body), account_updated, username];

    pool.query(queries, values, (err, result) => {
        if (err) {
            logger.error("Error updating data to database while creating user");
            res.status(400).json("Error updating data to database while creating user");
        } else {
            logger.info("User successfully updated for username: " + username);
            res.status(204).json(result.rows[0])
        }
    })
}
module.exports = updateUser;