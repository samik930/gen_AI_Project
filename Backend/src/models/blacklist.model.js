const mongoose = require('mongoose')

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        unique: [true,"Token is required to be added in the blacklist"]
    }
},
{ timestamps : true }
)

const blacklistModel = mongoose.model("BlackListTokens",blacklistSchema)

module.exports = blacklistModel