const express                     = require("express");
const { check, validationResult } = require("express-validator");

const checkObjectId = require("../../middleware/checkObjectId");
const auth          = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User    = require("../../models/User");
const Post    = require("../../models/Post");

const router = express.Router();

// @route:  GET api/profile/me
// @desc:   Get current user profile
// @access: Private

router.get("/me", auth, async(req, res) => {
    try {
        const profile = await Profile
            .findOne({user: req.user.id})
            .populate("user", ["name", "secondName", "avatar"]);

        if (!profile) {
            return res.status(400).json({
                msg: "There is no profile for this user"
            });
        }

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error!");
    }
});


// @route   POST api/profile
// @desc    Create/update users profile
//          1. Require 'status' & 'skills' to be.
//          2. Check for our validation
//          3. Getting profile props from req.body
//          4. Define our profile fields object, add a 'user' prop
//          5. Build profile object
//          6. Check for profile existing. Update or create new.
// @access  Private

router.post("/", [
    auth,
    [
        check("skills", "Skills are required").notEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        company,
        website,
        location,
        skills,
        bio,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
        vk,
        tiktok,
        telegram,
        mobilePhone,
        phone,
        fax,
        email,
        viber,
        hangouts,
        skype
    } = req.body;

    let profileFields = {};
    profileFields.user = req.user.id;

    if (company)  profileFields.company  = company;
    if (website)  profileFields.website  = website;
    if (location) profileFields.location = location;
    if (bio)      profileFields.bio      = bio;
    if (skills) {
        profileFields.skills = skills
            .split(",")
            .map(skill => {
                return skill.trim();
            });
    }

    let socialFields = {};
    if (youtube)   socialFields.youtube   = youtube;
    if (twitter)   socialFields.twitter   = twitter;
    if (facebook)  socialFields.facebook  = facebook;
    if (linkedin)  socialFields.linkedin  = linkedin;
    if (instagram) socialFields.instagram = instagram;
    if (vk)        socialFields.vk        = vk;
    if (tiktok)    socialFields.tiktok    = tiktok;
    if (telegram)  socialFields.telegram  = telegram;

    let contactFields = {};
    if (mobilePhone) contactFields.mobilePhone = mobilePhone;
    if (phone)       contactFields.phone       = phone;
    if (fax)         contactFields.fax         = fax;
    if (email)       contactFields.email       = email;
    if (viber)       contactFields.viber       = viber;
    if (hangouts)    contactFields.hangouts    = hangouts;
    if (skype)       contactFields.skype       = skype;

    profileFields.social   = socialFields;
    profileFields.contacts = contactFields;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        // Using upsert option (creates new doc if no match is found):
        profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { 
                new: true, 
                upsert: true, 
                setDefaultsOnInsert: true 
            }
        );

        return res.json(profile);        
    } catch (err) {
        console.error(err.massage);
        return res.status(500).send("Server Error!");
    }
});


// @route: GET api/profile
// @desc:  Get all profiles
// @access: Public

router.get("/", async (req, res) => {
    try {
        const profiles = await Profile
            .find()
            .populate("user", ["name", "secondName", "avatar"]);
        
        return res.json(profiles);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error!");
    }
});

// @route: GET api/profile/user/:user_id
// @desc:  Get a profile by user id
// @access: Public

router.get(
    "/user/:user_id", 
    checkObjectId("user_id"), 
    async ({ params: { user_id } }, res) => {
        try {
            const profile = await Profile
                .findOne({ user: user_id })
                .populate("user", ["name", "secondName", "avatar"]);

            if (!profile) return res.status(400).json({ msg: "Profile not found"});
                
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server Error!");
        }
    }
);

// @route: DELETE api/profile
// @desc:  Delete profile, user and posts
// @access: Private

router.delete("/", auth, async (req, res) => {
    try {
        await Promise.all([
            Post.deleteMany({ user: req.user.id }),
            Profile.findOneAndRemove({ user: req.user.id }),
            User.findOneAndRemove({ _id: req.user.id })
        ]);

        return res.json("User deleted");
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error!");
    }
});


// @route: PUT api/profile/education
// @desc:  Add education to profile
// @access: Private

router.put("/education", [
    auth,
    [
        check("school", "School is required").notEmpty(),
        check("degree", "Degree is required").notEmpty(),
        check("fieldofstudy", "Field of study is required").notEmpty(),
        check("from", "From is required").notEmpty()
    ],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            
            profile.education.unshift(req.body);

            await profile.save();
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server Error!");
        }
    }
]);


// @route: DELETE api/profile/education/:education_id
// @desc:  Add education to profile
// @access: Private

router.delete("/education/:education_id", [
    auth,
    checkObjectId("education_id")
], async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });

        profile.education = profile.education.filter( edu => {
            return edu._id.toString() != req.params.education_id; 
        });

        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error!");
    }
});

module.exports = router;