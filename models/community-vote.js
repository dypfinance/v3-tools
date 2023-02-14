let mongoose = require('mongoose')

let CommunityVoteSchema = mongoose.Schema({
    created_at: {
        type: Number,
        default: Date.now
    },
    pairId: {
        type: String,
        index: true,
        lowercase: true
    },
    coinbase: {
        type: String,
        index: true,
        lowercase: true
    },
    upvote: {
        type: Boolean,
        index: true
    }
})

module.exports = mongoose.model('CommunityVote', CommunityVoteSchema)