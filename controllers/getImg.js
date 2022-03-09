const pool = require("../db");

const {
    basicAuth,
    comparePassword
} = require("../utils/helper");

const getImageData = (req, res) => {
    const [username, password] = basicAuth(req);

    if (!username || !password) {
        return res.status(403).json("Forbidden Request");
    }

    let queries = "SELECT * from users where username = $1";
    let values = [username];

    pool.query(queries, values)
        .then(result => {
            if (result.rowCount) {
                const {
                    password: hashPassword,
                    id
                } = result.rows[0];
                comparePassword(hashPassword, password)
                    .then(compareValue => {
                        if (compareValue) {
                            getImgData(req, res, id);
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

const getImgData = (req, res, user_id) => {
    let queries = "Select file_name, id, url, upload_date, user_id from photos where user_id = $1"
    let values = [user_id]
    pool.query(queries, values)
        .then(result => {
            if (!result.rowCount) {
                return res.status(404).json("Image not found");
            } else {
                result.rows[0].upload_date = new Date(result.rows[0].upload_date).toISOString().slice(0, 10)
                return res.status(200).json(result.rows[0]);
            }
        })
}

module.exports = getImageData;