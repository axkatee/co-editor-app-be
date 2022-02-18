const send_response = (statusCode, res, message) => res.status(statusCode).send({ ok: true, message: message || null });

module.exports = { send_response }