const express      = require("express");
const User         = require("../../models/User");
const bcrypt       = require("bcryptjs");
const jwt          = require("jsonwebtoken");
const {check, validationResult} = require("express-validator");
const config       = require("config");
const auth         = require("../../middleware/auth");
const serverError  = require("../../utils/serverError");

const router    = express.Router();


/**
 *  @description : Get current user data
 *                 We are going to get user model without password property
 *                 since thar we use .select("")
 *  @route       : GET api/auth
 *  @access      : Private 
     */

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        return serverError(res, err);
    }
});


/**
 *  @description : Sign in
 *                 Each login leads to creation of new JWT token,
 *                 so, we should not to sign new token
 *  @route       : POST api/auth
 *  @access      : Public
     */

router.post("/", [
    check("email", "Valid email is required!")
        .isEmail(),
    check("password", "Password is required!")
        .exists()
], async (req, res) => {
    // Validation result
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json(
            {
                errors: errors.array()
            }
        )
    }

    const {email, password} = req.body;
    try {
        // 1. Check if user exists
        const user = await User.findOne({email});
        if (!user)
        {
            return res.status(400).json({
                errors: [
                    {
                        msg: "Invalid credentials!"
                    }
                ]
            })
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                errors: [
                    {
                        msg: "Invalid credentials!"
                    }
                ]
            })
        }

        // 3. Creating jwt
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
            (err, token) => {
                if (err) throw err;
                res.json({token});
            }
        );
    } catch (err) {
        return serverError(res, err);
    }
});

module.exports = router;