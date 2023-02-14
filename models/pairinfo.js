let mongoose = require('mongoose')

let PairInfoSchema = mongoose.Schema({
    pair_id: {
        type: String,
        index: true,
        unique: true,
        lowercase: true
    },
    project_comment_public: {type: String, default: ''},
    ts_comment_public: {type: String, default: ''},
    
    ts_score_security: {
        type: Number,
        index: true,
        default: 0
    },
    ts_score_liquidity: {
        type: Number,
        index: true,
        default: 0
    },
    ts_score_tokenomics: {
        type: Number,
        index: true,
        default: 0
    },
    ts_score_information: {
        type: Number,
        index: true,
        default: 0
    },
    ts_score_avg: {
        type: Number,
        index: true,
        default: 0
    },

    link_audit: {
        type: String, default: ''
    },
    link_logo: {
        type: String, default: ''
    },
    link_website: {
        type: String, default: ''
    },
    link_coinmarketcap: {
        type: String, default: ''
    },
    link_coingecko: {
        type: String, default: ''
    },
    link_twitter: {
        type: String, default: ''
    },
    link_telegram: {
        type: String, default: ''
    }

})

module.exports = mongoose.model('PairInfo', PairInfoSchema)