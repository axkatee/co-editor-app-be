const { send_response } = require("../services/response_service");
const { users } = require("../store");
const { createUserInStore, loginUser } = require("../services/store_service");

const createUser = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return send_response(400, res, 'Invalid params');
    }
    try {
        if (name.length < 4 || email.length < 4 || password.length < 4) {
            return send_response(400, res, 'Invalid params');
        }
        createUserInStore(name, email, password);

        return send_response(200, res);
    } catch(e) {
        if (e.message === 'exist_account') {
            return send_response(400, res, 'Account already exist');
        } else {
            return send_response(500, res, 'Error with registration');
        }
    }
}

const login = (req, res) => {
    const { email, password } = req.query;
    if (!email || !password) {
        return send_response(400, res, 'Invalid params');
    }
    try {
        if (email.length < 4 || password.length < 4) {
            return send_response(400, res, 'Invalid params');
        }
        const userId = loginUser(email, password);

        return send_response(200, res, userId);
    } catch(e) {
        if (e.message === 'invalid_user') {
            return send_response(400, res, 'Invalid email or password');
        }
        return send_response(500, res, 'Error on login');
    }
}

const getUsers = (req, res) => {
    const usersList = [];

    Object.keys(users).forEach(id => {
        usersList.push(users[id]);
    });
    return send_response(200, res, usersList);
}


module.exports = {
    createUser,
    login,
    getUsers
}