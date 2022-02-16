const app = require("./api");
const pool = require('./db');


app.listen(2000, () => {
    console.log("Server has started on port 2000");
})

// connecting DataBase

pool.connect((err) => {
    if (err) throw err;
    pool.query('create table if not exists public.users(id UUID NOT NULL,username VARCHAR(100),password VARCHAR(100),first_name VARCHAR(50),last_name VARCHAR(50),account_created timestamp with time zone,account_updated timestamp with time zone, PRIMARY KEY (id));',
        function (error, result) {
            console.log(result);
        });
});
