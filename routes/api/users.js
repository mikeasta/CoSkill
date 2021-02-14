const express  = require("express");
const {check, validationResult} = require("express-validator");
const bcrypt   = require("bcryptjs");
const gravatar = require("gravatar");
const jwt      = require("jsonwebtoken");
const config   = require("config");
const User     = require("../../models/User");
const auth     = require("../../middleware/auth");
const router   = express.Router();

// @route:  POST api/users
// @desc:   Register user
// @access: Public
router.post("/", [
    check("name", "Name is required!")
        .not()
        .isEmpty(),
        check("secondName", "Second name is required!")
        .not()
        .isEmpty(),
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

    const {name, secondName, email, password} = req.body;
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
                expiresIn: 360000
            },
            (error, token) => {
                if (error) throw error;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error!");
    }
});

module.exports = router;