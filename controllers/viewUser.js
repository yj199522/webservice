const pool = require("../db");

const {
    basicAuth,
    comparePassword
} = require("../utils/helper");

const StatsD = require('statsd-client');
sdc = new StatsD({
    host: 'localhost',
    port: 8125
});

const logger = require('../logger');

const viewUser = (req, res) => {
    const [username, password] = basicAuth(req);
    sdc.increment('endpoint.user.get - viewUser');
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
                    password: hashPassword
                } = result.rows[0];
                comparePassword(hashPassword, password)
                    .then(compareValue => {
                        if (compareValue) {
                            const data = result.rows[0];
                            if (!data.verified) {
                                logger.error('User not Verified');
                                return res.status(400).json('User not Verified');
                            } else {
                                delete data["password"];
                                delete data["verified"];
                                delete data["verified_on"];
                                logger.info("User detailed viewed for username: " + username);
                                return res.status(200).json(data);
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
            return res.status(400).json(err.message)
        })
}

module.exports = viewUser;