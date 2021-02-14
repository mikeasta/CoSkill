const express   = require("express");
const User      = require("../../models/User");
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const {check, validationResult} = require("express-validator");
const config    = require("config");
const auth      = require("../../middleware/auth");
const router    = express.Router();

// 1. Get user data
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error!");
    }
});

// 2. Authenication
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
                expiresIn: 360000
            },
            (err, token) => {
                if (err) throw err;
                res.json({token});
            }
        )
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error!")
    }
});

module.exports = router;