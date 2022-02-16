const { success_res } = require("../services/service");

const ping = (req, res) => {
    success_res(res, 'pong');
}

module.exports = {
    ping
}