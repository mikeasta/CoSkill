const express = require("express");
const serverError = require("../../utils/serverError");
const auth    = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId")
const { check, validationResult } = require("express-validator");
const Post    = require("../../models/Post");
const User    = require("../../models/User");

const router = express.Router();

// @route:  POST api/posts
// @desc:   Create a new post
// @access: Private

router.post("/", [
    auth,
    [
        check("text", "Text is required").notEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { text } = req.body;

    try {
        const user = await User
            .findOne({_id: req.user.id})
            .select(["-password", "-email", "-date"]);
        
        const { name, secondName, avatar } = user;

        let postFields = {
            name, secondName, avatar, text
        };

        postFields.user = req.user.id;

        let post = new Post(postFields);

        await post.save();
        res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});


// @route:  GET api/posts
// @desc:   Get all posts
// @access: Public

router.get("/", async (req, res) => {
    try {
        const posts = await Post
            .find()
            .populate("users", ["name", "secondName", "avatar"]);

        return res.json(posts);
    } catch (err) {
        return serverError(res, err);
    }
});


// @route:  GET api/posts/post/:post_id
// @desc:   Get special post by id
// @access: Public

router.get("/post/:post_id", checkObjectId("post_id"),
    async ({ params : { post_id }}, res) => {
    try {
        const post = await Post.findOne({_id: post_id});

        if (!post) {
            return res.status(400).json({
                    msg: "There is no post =(. Please, make sure that you've entered valid link"
                });
        }

        return res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});


// @route:  DELETE api/posts/post/:post_id
// @desc:   Delete post
// @access: Private

router.delete("/post/:post_id", [
    auth,
    checkObjectId("post_id")
], async (req, res) => {
    const { post_id } = req.params;
    const { id }      = req.user;

    try {
        const post = await Post.findOne({ _id : post_id });

        if ( post.user != id ) {
            return res.status(400).json({
                msg: "Don't try to delete other user's post"
            });
        }

        await Post.deleteOne({ _id: post_id });
        return res.json({
            msg: "Post deleted!"
        })
    } catch (err) {
        return serverError(res, err);
    }
});


// @route:  PUT api/posts/post/:post_id/like
// @desc:   Like post
// @access: Private

router.put("/post/:post_id/like",[
    auth,
    checkObjectId("post_id")
], async (req, res) => {
    const { post_id } = req.params;
    const { id }      = req.user;

    try {
        let post = await Post.findOne({ _id: post_id });

        if (!post) {
            return res.status(400).json({
                msg: "There is no post =(. Please, make sure that you've entered valid link"
            });
        }

        // Check if post has already liked by this user
        let liked = post.likes.find( like => {
            return like.user == id;
        });

        if (liked) {
            return res.status(400).json({
                msg: "You've already liked this post"
            })
        }

        post.likes.push({ user : id });
        await post.save();
        return res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});


// @route:  DELETE api/posts/post/:post_id/like
// @desc:   Unlike post
// @access: Private

router.delete("/post/:post_id/like", [
    auth,
    checkObjectId("post_id")
], async (req, res) => {
    const { post_id } = req.params;
    const { id } = req.user;

    try {
        const post = await Post.findOne({ _id: post_id });

        if (!post) {
            return res.status(400).json({
                msg: "There is no post =(. Please, make sure that you've entered valid link"
            });
        }

        post.likes = post.likes.filter( like => {
            return like.user !=  id;
        });

        await post.save();
        return res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});


// @route:  POST api/posts/post/:post_id/comment
// @desc:   Leave a comment to post
// @access: Private

router.post("/post/:post_id/comment", [
    auth,
    checkObjectId("post_id"),
    check("text", "Comment text is required").notEmpty()
], async (req, res) => {
    const { post_id } = req.params;
    const { id }      = req.user;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }   

    try {
        const post = await Post.findById( post_id );
        const user = await User.findById(id).select(["-password", "-email", "-date"]);

        if (!post) {
            return res.status(400).json({
                msg: "There is no post =(. Please, make sure that you've entered valid link"
            });
        }

        const {
            name,
            secondName,
            avatar
        } = user;

        const commentFields = {
            name,
            secondName,
            avatar,
            text: req.body.text,
            user: id
        };

        post.comments.unshift(commentFields);
        await post.save();
        return res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});


// @route:  DELETE api/posts/post/:post_id/comment/:comment_id
// @desc:   Delete a comment from post
// @access: Private

router.delete("/post/:post_id/comment/:comment_id", [
    auth, 
    checkObjectId("post_id"),
    checkObjectId("comment_id")
], async (req, res) => {
    const { post_id, comment_id } = req.params;

    try {
        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(400).json({
                msg: "There is no post =(. Please, make sure that you've entered valid link"
            });
        }

        post.comments = post.comments.filter( comment => {
            return comment._id != comment_id;
        });

        await post.save();
        return res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});

module.exports = router;