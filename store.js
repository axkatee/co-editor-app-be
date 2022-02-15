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
    let isUserExist = false;
    for(let value of Object.values(users)) {
        if (value.email === email && value.password === password) {
            isUserExist = true;
         break;
        }
    }
    if (!isUserExist) {
        throw new Error('invalid_user');
    }
}

module.exports = {
    users,
    conversations,
    checkIsUserExist,
    checkUserExistence
}