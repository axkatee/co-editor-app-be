const { send_response } = require("../services/service");

const ping = (req, res) => {
    send_response(200, res, 'pong');
}

module.exports = { ping };