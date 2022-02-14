const err_res = (res, message) => res.status(400).send({ ok: false, message: message || null });

const success_res = (res, message) => res.status(200).send({ ok: true, message: message || null });

module.exports = {
    err_res,
    success_res
}