const {
    v4: uuidv4
} = require("uuid");

const {
    validateEmail,
    generatePasswordHash,
    generateAccessToken
} = require("../utils/helper");

const pool = require("../db");

const StatsD = require('statsd-client');
sdc = new StatsD({
    host: 'localhost',
    port: 8125
});

const logger = require('../logger');

const AWS = require("aws-sdk");

const region = process.env.AWS_REGION;
AWS.config.update({
    region
});

const dynamo = new AWS.DynamoDB({
    region
})
const DynamoDB = new AWS.DynamoDB.DocumentClient({
    service: dynamo
});

const SNS = new AWS.SNS({
    apiVersion: '2010-03-31'
});

const time = 2;

const createUser = (req, res) => {
    const fieldNeeded = ["first_name", "last_name", "username", "password", "account_created", "account_updated"];
    const reqKey = req.body ? Object.keys(req.body) : null;
    sdc.increment('endpoint.user.post - createUser');
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
                    queries = "INSERT INTO users(first_name, last_name, password, username, account_created, account_updated, id, verified, verified_on) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, first_name, last_name, username, account_created, account_updated";
                    const values = [first_name, last_name, hashPassword, username, account_created, account_updated, id, false, account_updated];
                    pool.query(queries, values, (error, results) => {
                        if (error) {
                            logger.error("Error inserting data to database while creating user");
                            return res.status(400).json("Error inserting data to database while creating user");
                        } else {
                            const current = Math.floor(Date.now() / 1000)
                            let ttl = 60 * time
                            const expiresIn = ttl + current
                            const token = generateAccessToken(username);
                            let dbdata = {
                                Item: {
                                    token,
                                    username,
                                    ttl: expiresIn,
                                },
                                TableName: "dynamo_db"
                            }
                            logger.info({
                                token: token,
                                msg: 'token for dynamo'
                            });
                            console.log('test..')
                            DynamoDB.put(dbdata, function (error, data) {
                                if (error) {
                                    logger.error('error');
                                    console.log("Error in putting item in DynamoDB ", error);
                                } else {
                                    logger.info('success dynamo');
                                }
                            });
                            dbdata = {
                                Item: {
                                    username
                                },
                                TableName: "dynamo_email"
                            }
                            DynamoDB.put(dbdata, function (error, data) {
                                if (error) {
                                    logger.error('error');
                                    console.log("Error in putting item in DynamoDB ", error);
                                } else {
                                    logger.info('success dynamo in email');
                                }
                            });
                            logger.info('after dynamo');
                            const params = {
                                Message: JSON.stringify({
                                    username,
                                    token,
                                    messageType: "Notification",
                                    domainName: process.env.DOMAIN_NAME,
                                    first_name: first_name,
                                    verified: false
                                }),
                                TopicArn: process.env.TOPIC_ARN,
                            }
                            let publishTextPromise = SNS.publish(params).promise();
                            publishTextPromise.then(
                                function (data) {
                                    logger.info('promise dynamo');
                                    logger.info(`Message sent to the topic ${params.TopicArn}`);
                                    logger.info("MessageID is " + data.MessageId);
                                }).catch(
                                function (err) {
                                    logger.error({
                                        errorMsg: 'promise dynamo db',
                                        err: err
                                    });
                                    console.error(err, err.stack);
                                });
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