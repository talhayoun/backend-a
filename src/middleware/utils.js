const verifyKey = (req, res, next) => {
    const authKey = req.headers['poll-api-key'];
    if(authKey !== process.env.SECRET)
        return res.send({err: "Failed to verify auth key"});
    next()
}

module.exports = {verifyKey}