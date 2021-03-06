const cloneDeep = require("lodash.clonedeep");
const { v4: uuidv4 } = require("uuid");
const { users, conversations } = require("../store");



const createUserInStore = (name, email, password) => {
    Object.values(users).forEach(value => {
        if (value.email === email) {
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

const getConversationsFromStore = () => {
    let clonedConversations = cloneDeep(conversations);
    Object.keys(conversations).forEach(key => {
        delete clonedConversations[key].text;
    });
    return clonedConversations;
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
    conversations[conversationId].mutations[userId] = conversations[conversationId].mutations[userId]
        ? ++conversations[conversationId].mutations[userId] : 1;

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
    conversations[conversationId] = { id: conversationId, name, author: user, mutations: {}, text: '', contributors: [] };
    return conversations[conversationId];
}

const inviteUserToConversation = (invitedUser, conversationId) => {
    invitedUser.isFavorite = false;
    conversations[conversationId].contributors.push(invitedUser);
}

module.exports = {
    createUserInStore,
    loginUser,
    getConversationsFromStore,
    changeConversationFavoriteStateInStore,
    editConversationInStore,
    createConversationInStore,
    inviteUserToConversation
}