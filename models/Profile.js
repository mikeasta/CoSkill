const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
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
    bio: {
        type: String
    },
    education: [
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldmnofstudy: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        },
        vk: {
            type: String
        },
        tiktok: {
            type: String
        },
        telegram: {
            type: String
        }
    },
    contacts: {
        mobilephone: {
            type: String
        },
        phone: {
            type: String
        },
        fax: {
            type: String
        },
        email: {
            type: String
        },
        viber: {
            type: String
        },
        hangouts: {
            type: String
        },
        skype: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);