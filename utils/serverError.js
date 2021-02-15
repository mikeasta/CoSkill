const serverError = (res, err) => {
    console.error(err.message);
    return res.status(500).send("Server Error!");
}

module.exports = serverError;