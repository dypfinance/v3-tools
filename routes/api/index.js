const ethers = require('ethers')

const config = require('../../config')
const MinuteCandle = require('../../models/minute-candle')
const CommunityVote = require('../../models/community-vote')
const PairInfo = require('../../models/pairinfo')
const FarmInfo = require('../../models/farminfo')
const PairViewCount = require('../../models/pairviewcount')

const router = require('express').Router()

router.get('/test', (req, res) => {
    res.send('Hello, world! Server seems up!')
})

router.get('/hot-pairs', async (_req, res) => {
    let hotPairs = await PairViewCount.getTopTen()
    res.send({hotPairs})
})
router.post('/register-view', async (req, res) => {
    let {pair_address, pair_name} = req.query
    try {
        await PairViewCount.registerView({ pair_address, pair_name })
    } catch (e) {
        console.error(e)
    }
    res.sendStatus(200)
})

router.get('/community-votes', async (req, res) => {
    let pairId = String(req.query.pairId).trim().toLowerCase()
    let coinbase = String(req.query.coinbase).trim().toLowerCase()
    let voteCount = await CommunityVote.find({pairId}).count()
    let upvoteCount = await CommunityVote.find({pairId, upvote: true}).count()
    let coinbaseVote = await CommunityVote.findOne({pairId, coinbase})

    if (coinbaseVote) {
        coinbaseVote = coinbaseVote.upvote
    }

    res.send({
        voteCount,
        upvoteCount,
        coinbaseVote
    })
})

router.get('/pair-info', async (req, res) => {
    let pair_id = req.query.pairId
    let pairInfo = await PairInfo.findOne({pair_id})
    res.send({pairInfo})
})
router.post('/pair-info', async (req, res) => {
    try {
        let signature = req.headers['auth-token']
        let recoveredAccount = ethers.utils.verifyMessage(config.metamask_message, signature)
        if (String(recoveredAccount).toLowerCase() != config.metamask_admin_account.toLowerCase()) {
            throw new Error("Account mismatch!")
        }
    } catch (e) {
        res.sendStatus(403)
        return
    }

    let json = req.body.json
    try {
        json = JSON.parse(json)
    } catch (e) {
        res.sendStatus(400)
        return
    }

    try {
        await PairInfo.remove()

        await Promise.all(json.map(async pairInfo => {
            let pair = new PairInfo(pairInfo)
            return await pair.save()
        }))
        
    } catch (e) {
        res.sendStatus(500)
        return;
    }

    res.sendStatus(200)
})

router.get('/farm-info', async (_req, res) => {
    let farmInfo = await FarmInfo.find().sort('-tvl_usd').limit(512)
    res.send({ farmInfo })
})

router.post('/farm-info', async (req, res) => {
    try {
        let signature = req.headers['auth-token']
        let recoveredAccount = ethers.utils.verifyMessage(config.metamask_message, signature)
        if (String(recoveredAccount).toLowerCase() != config.metamask_admin_account.toLowerCase()) {
            throw new Error("Account mismatch!")
        }
    } catch (e) {
        res.sendStatus(403)
        return
    }

    let json = req.body.json
    try {
        json = JSON.parse(json)
        console.log(json)
    } catch (e) {
        res.sendStatus(400)
        return
    }

    try {
        await FarmInfo.remove()

        await Promise.all(json.map(async farmInfo => {
            let farm = new FarmInfo(farmInfo)
            return await farm.save()
        }))
        
    } catch (e) {
        res.sendStatus(500)
        return;
    }

    res.sendStatus(200)
})

router.post('/community-votes', async (req, res) => {
    let upvote = req.query.action == 'like'
    let pairId = String(req.query.pairId).trim().toLowerCase()
    let coinbase = String(req.query.coinbase).trim().toLowerCase()
    let vote = await CommunityVote.findOne({ coinbase, pairId })
    if (vote) {
        if (upvote == vote.upvote) {
            await vote.remove()
            res.sendStatus(200)
            return
        } else {
            vote.upvote = upvote
            await vote.save()
            res.sendStatus(200)
            return
        }
    } else {
        vote = new CommunityVote({ pairId, coinbase, upvote })
        await vote.save()
        res.sendStatus(200)
        return
    }
})

router.get('/candles/minutes/:pair_id', async (req, res) => {
    let pair = String(req.params.pair_id).toLowerCase()
    let candles = []
    let {from, to} = req.query
    if (!from || !to) { 
        candles = await MinuteCandle.find({
            pair
        })
        .sort('-time')
        .limit(512)
    } else {
        candles = await MinuteCandle.find({
            pair
        })
        .sort('-time')
        .where('time')
        .gte(from*1e3)
        .lt(to*1e3)
        
        console.log({requestedCandles: candles, from, to})
    }
    res.send(candles)
})

module.exports = router