const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    secondName: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        }
    ],
    skills: [
        {
            label: {
                type: String,
                required: true
            }, 
            skillType: {
                type: String,
                default: "common"
            }
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            secondName: {
                type: String
            },
            avatar: {
                type: String
            },
            skills: [
                {
                    label: {
                        type: String,
                        required: true
                    }, 
                    skillType: {
                        type: String,
                        default: "common"
                    }
                }
            ],
            likes: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "user"
                    }
                }
            ],
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model("post", PostSchema);