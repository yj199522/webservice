const app = require("./api");
const pool = require('./db');
const logger = require('./logger');


app.listen(2000, () => {
    console.log("Server has started on port 2000");
})

// connecting DataBase
pool.connect((err) => {
    if (err) {
        logger.error(err.message);
        throw err;
    }
    logger.info("users DB connected");
    pool.query('create table if not exists public.users(id UUID NOT NULL,username VARCHAR(100),password VARCHAR(100),first_name VARCHAR(50),last_name VARCHAR(50),account_created timestamp with time zone,account_updated timestamp with time zone, PRIMARY KEY (id));',
        function (error, result) {
            logger.info("users DB created Successfully");
            console.log(result);
        });
    logger.info("photos DB connected");
    pool.query('create table if not exists public.photos(id UUID NOT NULL,user_id UUID NOT NULL,file_name VARCHAR(100),url text,upload_date Date,path VARCHAR(255), PRIMARY KEY (id), CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id));',
        function (error, result) {
            logger.info("photos DB created Successfully");
            console.log(result);
        });
});