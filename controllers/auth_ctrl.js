const { v4: uuidv4 } = require("uuid");
const { err_res, success_res } = require("../services/service");
const { users, checkIsUserExist, checkUserExistence } = require("../store");

const createUser = (req, res) => {
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
        users[userId] = { id: userId, name, email, password };
        return success_res(res);
    } catch(e) {
        if (e.message === 'exist_account') {
            return err_res(res, 'Account already exist');
        } else {
            return err_res(res, 'Error on registration');
        }
    }
}

const login = (req, res) => {
    let userId;
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

        for(let key of Object.keys(users)) {
            if (users[key].email === email) {
                userId = key;
                break;
            }
        }

        return success_res(res, userId);
    } catch(e) {
        if (e.message === 'invalid_user') {
            return err_res(res, 'Invalid email or password');
        }
        return err_res(res, 'Error on login');
    }
}

const getUsers = (req, res) => {
    const usersList = [];

    Object.keys(users).forEach(userId => {
        usersList.push(users[userId])
    });

    return success_res(res, usersList);
}


module.exports = {
    createUser,
    login,
    getUsers
}