const { err_res, success_res } = require("../services/service");
const { conversations, users } = require("../store");
const { v4: uuidv4 } = require("uuid");
const cloneDeep = require('lodash.clonedeep')

const getConversations = (req, res) => {
    let listOfFavoriteConversations = [];
    let listOfUnfavoriteConversations = [];
    const userId = req.query.userId;
    if (!userId) {
        return err_res(res);
    }

    Object.keys(conversations).forEach(id => {
        let contributorsIds = conversations[id].contributors.map(user => user.id);
        if (conversations[id].author.id === userId) {
            conversations[id].author.isFavorite
                ? listOfFavoriteConversations.push(conversations[id])
                : listOfUnfavoriteConversations.push(conversations[id])
        } else if (contributorsIds.includes(userId)) {
            const user = conversations[id].contributors.find(user => user.id === userId);
            user.isFavorite
                ? listOfFavoriteConversations.push(conversations[id])
                : listOfUnfavoriteConversations.push(conversations[id])
        }
    });

    return success_res(res, { listOfFavoriteConversations, listOfUnfavoriteConversations });
}

const getInfoAboutConversation = (req, res) => {
    const { conversationId } = req.query;
    if (!conversationId) {
        return err_res(res);
    }
    return success_res(res, conversations[conversationId]);
}

const createConversation = (req, res) => {
    let user = {};
    const params = req.body;
    if (!params.name || !params.author) {
        return err_res(res);
    }
    try {
        const { name, author } = params;

        Object.keys(users).forEach(userId => {
            if (userId === author) {
                user = cloneDeep(users[userId]);
                user.isFavorite = false;
                delete user.password;
            }
        });

        const conversationId = uuidv4();
        conversations[conversationId] = { id: conversationId, name, author: user, mutations: [], text: '', contributors: [] };

        return success_res(res, conversations[conversationId]);
    } catch(e) {
        return err_res(res, 'Error on create conversation');
    }
}

const editConversation = (req, res) => {
    const params = req.body;
    if (!params.conversationId || !params.text || !params.userId) {
        return err_res(res);
    }
    try {
        const { conversationId, text, userId } = params;

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

        return success_res(res, conversations[conversationId]);
    } catch(e) {
        return err_res(res, 'Error on edit conversation');
    }
}

const deleteConversation = (req, res) => {
    const { conversationId, author } = req.query;
    if (!conversationId) {
        return err_res(res);
    }

    if (conversations[conversationId].author.id !== author) {
        return err_res(res, 'Permission denied');
    }

    try {
        delete conversations[conversationId];
        return success_res(res, conversations);
    } catch(e) {
        return err_res(res, 'Error on delete conversation');
    }
}

const addUserToConversation = (req, res) => {
    const { conversationId, author, invitedUser } = req.body;
    try {
        if (!conversationId || !author || !invitedUser) {
            return err_res(res);
        }

        if (conversations[conversationId].author.id !== author) {
            return err_res(res, 'Permission denied');
        }

        invitedUser.isFavorite = false;
        conversations[conversationId].contributors.push(invitedUser);

        return success_res(res, conversations[conversationId]);
    } catch (e) {
        return err_res(res, 'Error on add user to conversation');
    }
}

const changeFavoriteState = (req, res) => {
    const { conversationId, userId, isFavorite } = req.body;
    try {
        if (!conversationId || !userId) {
            return err_res(res);
        }

        if (conversations[conversationId].author.id === userId) {
            conversations[conversationId].author.isFavorite = isFavorite;
        } else {
            conversations[conversationId].contributors.forEach(user => {
                if (user.id === userId) {
                    user.isFavorite = isFavorite;
                }
            });
        }
        console.log(conversations)

        return success_res(res, conversations[conversationId]);
    } catch (e) {
        return err_res(res, 'Error on add user to conversation');
    }
}

module.exports = {
    getConversations,
    createConversation,
    deleteConversation,
    editConversation,
    addUserToConversation,
    changeFavoriteState,
    getInfoAboutConversation
}