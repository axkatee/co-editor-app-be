const users = {};
const conversations = {};

const checkIsUserExist = (email) => {
    Object.keys(users).forEach(userId => {
        if (users[userId].email === email) {
            throw new Error('exist_account');
        }
    });
}

const checkUserExistence = (email, password) => {
    Object.keys(users).forEach(userId => {
        if (users[userId].email !== email) {
            throw new Error('invalid_email');
        }
        if (users[userId].password !== password) {
            throw new Error('invalid_password');
        }
    });
}

module.exports = {
    users,
    conversations,
    checkIsUserExist,
    checkUserExistence
}