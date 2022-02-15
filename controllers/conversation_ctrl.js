const { err_res, success_res } = require("../services/service");
const { conversations } = require("../store");
const { v4: uuidv4 } = require("uuid");

const getConversations = (req, res) => {
    let listOfConversations = [];
    const userId = req.body;
    if (!userId) {
        return err_res(res);
    }

    Object.keys(conversations).forEach(id => {
        if (conversations[id].author === userId) {
            listOfConversations.push(conversations[id]);
        }
    });

    return success_res(res, listOfConversations);
}

const createConversation = (req, res) => {
    const params = req.body;
    if (!params.name || !params.author) {
        return err_res(res);
    }
    try {
        const { name, author } = params;
        const conversationId = uuidv4();
        conversations[conversationId] = { name, author, lastMutation: null, text: '', contributors: [] };

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
        let countOfMutations = conversations[conversationId].lastMutation[userId].count || 0;

        conversations[conversationId].text = text;
        conversations[conversationId].lastMutation[userId].count = countOfMutations + 1;

        return success_res(res, conversations[conversationId]);
    } catch(e) {
        return err_res(res, 'Error on create conversation');
    }
}

const deleteConversation = (req, res) => {
    const { conversationId, author } = req.body;
    if (!conversationId) {
        return err_res(res);
    }

    if (conversations[conversationId].author !== author) {
        return err_res(res, 'Permission denied');
    }

    try {
        delete conversations[conversationId];
        return success_res(res, conversations);
    } catch(e) {
        return err_res(res, 'Error on delete conversation');
    }
}

const getInfoAboutConversation = (req, res) => {
    const { conversationId } = req.body;
    if (!conversationId) {
        return err_res(res);
    }
    return success_res(res, conversations[conversationId]);
}

const addUserToConversation = (req, res) => {
    const { conversationId, author, userId } = req.body;
    try {
        if (!conversationId || !author || !userId) {
            return err_res(res);
        }

        if (conversations[conversationId].author !== author) {
            return err_res(res, 'Permission denied');
        }

        conversations[conversationId].contributors.push(userId);

        return success_res(res, conversations[conversationId]);
    } catch (e) {
        return err_res(res, 'Error on add user to conversation');
    }
}

module.exports = {
    getConversations,
    createConversation,
    deleteConversation,
    getInfoAboutConversation,
    editConversation,
    addUserToConversation
}