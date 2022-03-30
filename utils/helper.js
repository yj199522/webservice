const bcrypt = require("bcrypt");
const {
    Buffer
} = require('buffer');

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const generatePasswordHash = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error)
    }
}

const basicAuth = (req) => {
    const auth = req.headers.authorization;
    if (!auth || auth.indexOf('Basic ') === -1) return res.status(403).json("Forbidden Request")
    // verify auth credentials
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    return credentials.split(':');
}

const comparePassword = async (hashPassword, password) => {
    return await bcrypt.compare(password, hashPassword);
}

const getImage = (base64) => {
    const converted = base64.replace(/^data:image\/\w+;base64,/, '');
    const extension = base64.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0].split('/')
    return [Buffer.from(converted, 'base64'), extension]
};

module.exports = {
    validateEmail,
    generatePasswordHash,
    basicAuth,
    comparePassword,
    getImage
};