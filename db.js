const Pool = require("pg").Pool;
const fs = require('fs');
const rdsCa = fs.readFileSync('./rds-combined-ca-bundle.pem');

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOSTNAME,
    port: process.env.PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: [rdsCa]
    }
})

module.exports = pool;