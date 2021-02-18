const express  = require("express");
const {check, validationResult} = require("express-validator");
const bcrypt   = require("bcryptjs");
const gravatar = require("gravatar");
const jwt      = require("jsonwebtoken");
const config   = require("config");
const User     = require("../../models/User");
const serverError = require("../../utils/serverError");
const router   = express.Router();


/**
 *  @description : Create new user
 *  @route       : POST api/users 
 *  @access      : Public
 */

router.post("/", [
    check("name", "Name is required!")
        .notEmpty(),
        check("secondName", "Second name is required!")
        .notEmpty(),
    check("email", "Valid email is required!")
        .isEmail(),
    check("password", "Please enter a password with 6 or more characters")
        .isLength({min: 6})
] , async (req, res) => {

    // Request validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    } 

    const {
        name, 
        secondName, 
        email, 
        password
    } = req.body;

    try {
        // Register user
        // 1. See if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                errors: [
                    {
                        msg: "User already exists"
                    }
                ]
            });
        }

        // 2. Get user avatar
        const avatar = gravatar.url(email,{
            s: "200", 
            r: "pg",
            d: "mm"
        });

        user = new User({
            name,
            secondName,
            email,
            avatar,
            password
        });

        // 3. Encrypt password
        const salt      = await bcrypt.genSalt(10);
        user.password   = await bcrypt.hash(password, salt);
        await user.save();

        // 4. JWT
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get("jwtSecret"),
            {
                expiresIn: Number(config.get("jwtExpiresIn"))
            },
            (error, token) => {
                if (error) throw error;
                res.json({ token });
            }
        );

    } catch (err) {
        return serverError(res, err);
    }
});

module.exports = router;