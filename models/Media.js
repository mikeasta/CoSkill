// This model will store media files: photos & videos
const mongoose = require("mongoose");
const MediaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});

module.exports = Media = mongoose.model("media", MediaSchema);