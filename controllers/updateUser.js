const pool = require("../db");

const {
    generatePasswordHash,
    basicAuth,
    comparePassword
} = require("../utils/helper");

const updateUser = (req, res) => {
    const [username, password] = basicAuth(req);

    if (!username || !password) {
        return res.status(403).json("Forbidden Request");
    }

    let queries = "SELECT password from users where username = $1";
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
                            updateData(req, res, username);
                        } else {
                            return res.status(401).json("Incorrect Password");
                        }
                    })
            } else {
                return res.status(401).json("Username Incorrect");
            }
        })
        .catch(err => {
            return res.status(400).json(err.message)
        })
}

const updateData = (req, res, username) => {
    const fieldNeeded = ["first_name", "last_name", "password"];
    const reqKey = req.body ? Object.keys(req.body) : null;

    if (!reqKey || !reqKey.length) {
        return res.status(400).json("No information is provided to update user");
    }

    let checking = true;

    reqKey.forEach(val => {
        if (fieldNeeded.indexOf(val) < 0) {
            checking = false;
        }
    })

    if (!checking) {
        return res.status(400).json("Only first_name, last_name, and password is required");
    }

    const account_updated = new Date().toISOString();
    const {
        first_name,
        last_name,
        password
    } = req.body;
    if ((password && password.length < 8) || (first_name && !first_name.length) || (last_name && !last_name.length)) {
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
            res.status(400).json("Error updating data to database while creating user");
        } else {
            res.status(204).json(result.rows[0])
        }
    })
}
module.exports = updateUser;