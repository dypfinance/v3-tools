const mongoose = require("mongoose")
const config = require('../config')

const VIEW_REFRESH_DURATION = config.pair_views_refresh_duration_in_seconds * 1e3

const PairViewCountSchema = mongoose.Schema({
    pair_name: {
        type: String,
        index: true
    },
    pair_address: {
        type: String,
        index: true,
        unique: true,
        lowercase: true
    },

    view_timestamp: {
        type: Number,
        index: true
    },
    view_count: {
        type: Number,
        index: true
    }
    
})

const PairViewCount = module.exports = mongoose.model('PairViewCount', PairViewCountSchema)

module.exports.registerView = async ({pair_address, pair_name}) => {
    let pairView = await PairViewCount.findOne({pair_address})
    if (!pairView) {
        pairView = new PairViewCount({pair_address, pair_name, view_timestamp: Date.now(), view_count: 0})
    }
    if (Date.now() - pairView.view_timestamp >= VIEW_REFRESH_DURATION) {
        pairView.view_count = 0
        pairView.view_timestamp = Date.now()
    }
    pairView.view_count++
    const savedPairView = await pairView.save()
    return savedPairView
}

module.exports.getTopTen = async () => {
    let pairViews = await PairViewCount.find().where('view_timestamp').gte(Date.now() - VIEW_REFRESH_DURATION).sort('-view_count').limit(10)
    return (pairViews || [])
}