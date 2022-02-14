const { v4: uuidv4 } = require("uuid");
const { err_res, success_res } = require("../services/service");
const { users, checkIsUserExist, checkUserExistence } = require("../store");

const createUser = async (req, res) => {
    const params = req.body;
    if (!params.name || !params.email || !params.password) {
        return err_res(res, 'Invalid params');
    }
    try {
        const { name, email, password } = params;
        if (name.length < 4 || email.length < 4 || password.length < 4) {
            return err_res(res, 'Invalid params');
        }
        checkIsUserExist(email);
        const userId = uuidv4();
        users[userId] = { name, email, password };
        return success_res(res);
    } catch(e) {
        if (e === 'exist_account') {
            return err_res(res, 'Account already exist');
        } else {
            return err_res(res, 'Error on registration');
        }
    }
}

const login = async (req, res) => {
    const params = req.body;
    if (!params.email || !params.password) {
        return err_res(res);
    }
    try {
        const { email, password } = params;
        if (email.length < 4 || password.length < 4) {
            return err_res(res);
        }
        checkUserExistence(email, password);

        return success_res(res);
    } catch(e) {
        if (e === 'invalid_email') {
            return err_res(res, 'Invalid email');
        }
        if (e === 'invalid_password'){
            return err_res(res, 'Invalid password');
        }
        return err_res(res, 'Error on login');
    }
}

const getUsers = (req, res) => {
    return success_res(res, users);
}


module.exports = {
    createUser,
    login,
    getUsers
}