const { v4: uuidv4 } = require("uuid");
const cloneDeep = require("lodash.clonedeep");
const { users, conversations } = require("../store");



const createUserInStore = (name, email, password) => {
    Object.keys(users).forEach(userId => {
        if (users[userId].email === email) {
            throw new Error('exist_account');
        }
    });
    const userId = uuidv4();
    users[userId] = { id: userId, name, email, password };
}

const loginUser = (email, password) => {
    let isUserExist = false;
    let userId;
    for(let value of Object.values(users)) {
        if (value.email === email && value.password === password) {
            userId = value.id;
            isUserExist = true;
            break;
        }
    }
    if (!isUserExist) {
        throw new Error('invalid_user');
    }
    return userId;
}

const changeConversationFavoriteStateInStore = (conversationId, userId, isFavorite) => {
    if (conversations[conversationId].author.id === userId) {
        conversations[conversationId].author.isFavorite = isFavorite;
    } else {
        conversations[conversationId].contributors.forEach(user => {
            if (user.id === userId) {
                user.isFavorite = isFavorite;
            }
        });
    }
}

const editConversationInStore = (conversationId, userId, text) => {
    conversations[conversationId].mutations.forEach(mutation => {
        if (mutation.userId === userId) {
            mutation.countOfMutations += 1;
        }
    });

    const userIdsInMutations = conversations[conversationId].mutations.map(mutation => mutation.userId);

    if (!userIdsInMutations.includes(userId)) {
        conversations[conversationId].mutations.push({ userId, countOfMutations: 1 });
    }

    conversations[conversationId].text = text;
}

const createConversationInStore = (author, name) => {
    let user = {};
    Object.keys(users).forEach(userId => {
        if (userId === author) {
            user = cloneDeep(users[userId]);
            user.isFavorite = false;
            delete user.password;
        }
    });

    const conversationId = uuidv4();
    conversations[conversationId] = { id: conversationId, name, author: user, mutations: [], text: '', contributors: [] };
    return conversations[conversationId];
}

const inviteUserToConversation = (invitedUser, conversationId) => {
    invitedUser.isFavorite = false;
    conversations[conversationId].contributors.push(invitedUser);
}

module.exports = {
    createUserInStore,
    loginUser,
    changeConversationFavoriteStateInStore,
    editConversationInStore,
    createConversationInStore,
    inviteUserToConversation
}