const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password:"24100742y@sh",
    host: "localhost",
    port: 5432,
    database: "CloudAssignment"
})

module.exports = pool;