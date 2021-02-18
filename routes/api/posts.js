const express = require("express");
const serverError = require("../../utils/serverError");
const auth    = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId")
const { check, validationResult } = require("express-validator");
const Post    = require("../../models/Post");
const User    = require("../../models/User");

const router = express.Router();

/**
 *  @description : Create new post
 *  @route       : POST api/posts
 *  @access      : Private
 */

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
        
        const { 
            name, 
            secondName, 
            avatar 
        } = user;

        let postFields = {
            name,
            secondName, 
            avatar, 
            text,
            user: req.user.id
        };

        let post = new Post(postFields);

        await post.save();
        return res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});


/**
 *  @description : Get all posts
 *  @route       : GET api/posts
 *  @access      : Public
 */

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


/**
 *  @description : Get special post
 *  @route       : GET api/posts/:post_id
 *  @access      : Public
 */

router.get("/:post_id", checkObjectId("post_id"),
    async ({ params : { post_id }}, res) => {
    try {
        const post = await Post.findOne({_id: post_id});

        if (!post) {
            return res.status(400).json({
                    msg: "There is no post"
                });
        }

        return res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});


/**
 *  @description : Delete special post
 *                 (Only if you are autheniticated)
 *  @route       : DELETE api/posts/:post_id
 *  @access      : Private
 */

router.delete("/:post_id", [
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


/**
 *  @description : Like post
 *  @route       : PUT api/posts/like/:post_id
 *  @access      : Private
 */

router.put("/like/:post_id",[
    auth,
    checkObjectId("post_id")
], async (req, res) => {
    const { post_id } = req.params;
    const { id }      = req.user;

    try {
        let post = await Post.findOne({ _id: post_id });

        if (!post) {
            return res.status(400).json({
                msg: "There is no post"
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


/**
 *  @description : Unlike post
 *  @route       : DELETE api/posts/like/:post_id
 *  @access      : Private
 */

router.delete("/like/:post_id", [
    auth,
    checkObjectId("post_id")
], async (req, res) => {
    const { post_id } = req.params;
    const { id } = req.user;

    try {
        const post = await Post.findOne({ _id: post_id });

        if (!post) {
            return res.status(400).json({
                msg: "There is no post"
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


/**
 *  @description : Comment post
 *  @route       : POST api/posts/comment/:post_id
 *  @access      : Private
 */

router.post("/comment/:post_id", [
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
                msg: "There is no post"
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


/**
 *  @description : Delete comment from post
 *  @route       : DELETE api/posts/comment/:post_id/:comment_id
 *  @access      : Private
 */

router.delete("/comment/:post_id/:comment_id", [
    auth, 
    checkObjectId("post_id"),
    checkObjectId("comment_id")
], async (req, res) => {
    const { post_id, comment_id } = req.params;

    try {
        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(400).json({
                msg: "There is no post"
            });
        }

        post.comments = post.comments.filter( comment => {
            return comment._id !== comment_id;
        });

        await post.save();
        return res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});


/**
 *  @description : Like comment 
 *  @route       : PUT api/posts/comment/like/:post_id/:comment_id
 *  @access      : Private
 */

router.put("/comment/like/:post_id/:comment_id", [
    auth,
    checkObjectId("post_id"),
    checkObjectId("comment_id")
], async (req, res) => {
    const { post_id, comment_id } = req.params;
    const { id } = req.user;
    try {
        // Check if post exists
        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(400).json({
                msg: "There is no post"
            });
        }

        // Check if comment exists
        const idx = post.comments.findIndex( comment => {
            return comment._id == comment_id;
        });

        if (idx == -1) {
            return res.status(400).json({
                msg: "There is no comment"
            });
        }

        // Check if liked
        let liked = post.comments[idx].likes.find( like => {
            return like.user == id;
        });

        if (liked) {
            return res.status(400).json({
                msg: "You've already liked this comment"
            });
        }

        post.comments[idx].likes.unshift({ user: id });
        await post.save();
        return res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});


/**
 *  @description : Unlike comment 
 *  @route       : DELETE api/posts/comment/like/:post_id/:comment_id
 *  @access      : Private
 */

router.delete("/comment/like/:post_id/:comment_id", [
    auth,
    checkObjectId("post_id"),
    checkObjectId("comment_id")
], async (req, res) => {
    const { post_id, comment_id } = req.params;
    const { id } = req.user;
    try {
        // Check if post exists
        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(400).json({
                msg: "There is no post =(. Please, make sure that you've entered valid link"
            });
        }

        // Check if comment exists
        const idx = post.comments.findIndex( comment => {
            return comment._id == comment_id;
        });

        if (idx == -1) {
            return res.status(400).json({
                msg: "There is no comment =(. Please, make sure that you've entered valid link"
            });
        }

        post.comments[idx].likes = post.comments[idx].likes.filter( like => {
            return like.user != id;
        });

        await post.save();
        return res.json(post);
    } catch (err) {
        return serverError(res, err);
    }
});

module.exports = router;