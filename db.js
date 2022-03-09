const Pool = require("pg").Pool

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.HOSTNAME,
    port: process.env.PORT,
    database: process.env.DB_NAME,
    ssl: true
})

module.exports = pool;