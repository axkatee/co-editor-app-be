const { conversations } = require("../store");
const {
    changeConversationFavoriteStateInStore,
    editConversationInStore,
    createConversationInStore,
    inviteUserToConversation,
    getConversationsFromStore
} = require("../services/store_service");
const { send_response } = require("../services/response_service");
const socketClient = require("../services/socket_client");

const getConversations = (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return send_response(400, res, 'Invalid params');
    }
    const conversationsFromStore = getConversationsFromStore();

    return send_response(200, res, conversationsFromStore);
}

const getInfoAboutConversation = (req, res) => {
    const { conversationId } = req.query;
    if (!conversationId) {
        return send_response(400, res, 'Invalid params');
    }
    return send_response(200, res, conversations[conversationId]);
}

const createConversation = (req, res) => {
    const { name, author } = req.body;
    if (!name || !author) {
        return send_response(400, res, 'Invalid params');
    }
    try {
        const newConversation = createConversationInStore(author, name);

        return send_response(200, res, newConversation);
    } catch(e) {
        return send_response(500, res, 'Error on create conversation');
    }
}

const editConversation = (req, res) => {
    const { conversationId, userId, text } = req.body;
    if (!conversationId || !userId) {
        return send_response(400, res, 'Invalid params');
    }
    try {
        editConversationInStore(conversationId, userId, text || '');

        socketClient.sendConversationData(conversations[conversationId]);
        return send_response(201, res, conversations[conversationId]);
    } catch(e) {
        return send_response(500, res, 'Error on edit conversation');
    }
}

const deleteConversation = (req, res) => {
    const { conversationId, author } = req.query;
    if (!conversationId) {
        return send_response(400, res, 'Invalid params');
    }

    if (conversations[conversationId].author.id !== author) {
        return send_response(400, res, 'Permission denied');
    }

    try {
        delete conversations[conversationId];

        socketClient.deleteConversationData(conversationId);
        return send_response(200, res);
    } catch(e) {
        return send_response(500, res, 'Error on delete conversation');
    }
}

const addUserToConversation = (req, res) => {
    const { conversationId, author, invitedUser } = req.body;
    try {
        if (!conversationId || !author || !invitedUser) {
            return send_response(400, res, 'Invalid params');
        }

        if (conversations[conversationId].author.id !== author) {
            return send_response(400, res, 'Permission denied');
        }

        inviteUserToConversation(invitedUser, conversationId);

        socketClient.sendConversationData(conversations[conversationId]);
        return send_response(200, res, conversations[conversationId]);
    } catch (e) {
        return send_response(500, res, 'Error on add user to conversation');
    }
}

const changeFavoriteState = (req, res) => {
    const { conversationId, userId, isFavorite } = req.body;
    try {
        if (!conversationId || !userId) {
            return send_response(400, res, 'Invalid params');
        }
        changeConversationFavoriteStateInStore(conversationId, userId, isFavorite);

        return send_response(200, res, conversations[conversationId]);
    } catch (e) {
        return send_response(500, res, 'Error on add user to conversation');
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