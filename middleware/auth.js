const config = require("config");
const jwt    = require("jsonwebtoken");

// This middleware we use to handle jwt and give payload data to the next()
module.exports = function(req, res, next)  {
    // Getting token
    const token = req.header("x-auth-token");

    // Check if there no token
    if (!token) {
        return res.status(401).json({
            msg: "No token. Authorization denied"
        })
    }

    try {
        // Getting payload (user id) from token and pull it into request
        const decoded = jwt.verify(token, config.get("jwtSecret"));
        req.user      = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({
            msg: "Invalid token"
        })
    }
}