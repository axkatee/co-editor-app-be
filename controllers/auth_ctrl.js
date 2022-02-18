const { send_response } = require("../services/service");
const { users } = require("../store");
const { createUserInStore, loginUser } = require("../services/store-service");

const createUser = (req, res) => {
    const params = req.body;
    if (!params.name || !params.email || !params.password) {
        return send_response(400, res, 'Invalid params');
    }
    try {
        const { name, email, password } = params;
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
    const params = req.body;
    if (!params.email || !params.password) {
        return send_response(400, res, 'Invalid params');
    }
    try {
        const { email, password } = params;
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