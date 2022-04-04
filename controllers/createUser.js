const {
    v4: uuidv4
} = require("uuid");

const {
    validateEmail,
    generatePasswordHash
} = require("../utils/helper");

const pool = require("../db");

const StatsD = require('statsd-client');
sdc = new StatsD();

const logger = require('../logger');

const createUser = (req, res) => {
    const fieldNeeded = ["first_name", "last_name", "username", "password", "account_created", "account_updated"];
    const reqKey = req.body ? Object.keys(req.body) : null;
    sdc.increment('endpoint.user.post');
    logger.info('Made user create api call');
    if (!reqKey || !reqKey.length) {
        logger.error('No information is provided to create a user');
        return res.status(400).json("No information is provided to create user");
    }

    let checking = true;

    reqKey.forEach(val => {
        if (fieldNeeded.indexOf(val) < 0) {
            checking = false;
        }
    })

    if (!checking) {
        logger.error("Only first_name, last_name, username, and password is required");
        return res.status(400).json("Only first_name, last_name, username, and password is required");
    }

    const id = uuidv4();
    const account_created = new Date().toISOString();
    const account_updated = new Date().toISOString();
    const {
        first_name,
        last_name,
        username,
        password
    } = req.body;


    const isEmailCorrect = validateEmail(username);

    if (!password || !username || !first_name || !last_name || password.length < 8 || !first_name.length || !last_name.length) {
        logger.error("Incorrect data format");
        return res.status(400).json("Incorrect data format");
    }

    if (!isEmailCorrect) {
        logger.error("Enter proper email");
        return res.status(400).json("Enter proper email");
    }

    generatePasswordHash(password)
        .then((hashPassword) => {
            let queries = "Select * from users where username = $1";
            pool.query(queries, [username], (err, result) => {
                if (!result.rowCount) {
                    queries = "INSERT INTO users(first_name, last_name, password, username, account_created, account_updated, id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, username, account_created, account_updated";
                    const values = [first_name, last_name, hashPassword, username, account_created, account_updated, id];
                    pool.query(queries, values, (error, results) => {
                        if (error) {
                            logger.error("Error inserting data to database while creating user");
                            return res.status(400).json("Error inserting data to database while creating user");
                        } else {
                            logger.info('User successfully created');
                            return res.status(201).json(results.rows[0]);
                        }
                    })
                } else {
                    logger.error("Username already in used");
                    return res.status(400).json("Username already in used");
                }
            })
        });
}

module.exports = createUser;