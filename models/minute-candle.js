const mongoose = require('mongoose')
const moment = require('moment')

const MinuteCandleSchema = mongoose.Schema({
    time: {
        type: mongoose.SchemaTypes.Date,
        index: true
    },
    pair: {
        type: String,
        index: true,
        lowercase: true,
        trim: true
    },

    o_token1PerToken0: Number,
    o_usdPerToken0: Number,

    h_token1PerToken0: Number,
    h_usdPerToken0: Number,

    l_token1PerToken0: Number,
    l_usdPerToken0: Number,

    c_token1PerToken0: Number,
    c_usdPerToken0: Number,



    o_token0PerToken1: Number,
    o_usdPerToken1: Number,

    h_token0PerToken1: Number,
    h_usdPerToken1: Number,

    l_token0PerToken1: Number,
    l_usdPerToken1: Number,

    c_token0PerToken1: Number,
    c_usdPerToken1: Number,



    v_token1: Number,
    v_token0: Number,
    v_usd: Number
})

let MinuteCandle = module.exports = mongoose.model('MinuteCandle', MinuteCandleSchema)

MinuteCandle.processSwap = async function(swap) {
    let token0PerToken1 = 0, token1PerToken0 = 0,
        usdPerToken0 = 0, usdPerToken1 = 0,
        amountToken1 = 0, amountToken0 = 0, amountUSD = 0
    
    let { amount_1_in, amount_1_out, amount_0_in, amount_0_out, amount_usd, timestamp, pair } = swap

    pair = String(pair).toLowerCase().trim()
    amount_0_in = Number(amount_0_in)
    amount_0_out = Number(amount_0_out)
    amount_1_in = Number(amount_1_in)
    amount_1_out = Number(amount_1_out)
    amount_usd = Number(amount_usd)
    timestamp = Number(timestamp)

    amountUSD = amount_usd

    if (amount_0_in == 0) {
        amountToken0 = amount_0_out
        amountToken1 = amount_1_in
    } else {
        amountToken0 = amount_0_in
        amountToken1 = amount_1_out
    }

    token0PerToken1 = Math.min(Number.MAX_VALUE, amountToken0 / amountToken1) || 0
    token1PerToken0 = Math.min(Number.MAX_VALUE, amountToken1 / amountToken0) || 0

    usdPerToken0 = Math.min(Number.MAX_VALUE, amountUSD / amountToken0) || 0
    usdPerToken1 = Math.min(Number.MAX_VALUE, amountUSD / amountToken1) || 0

    let time = moment(timestamp*1e3).utc().format('YYYY-MM-DDTHH:mm[Z]')

    let candle = await MinuteCandle.findOne({pair, time})
    

    if (!candle) {
        let prevCandle = await MinuteCandle.find({pair})
                        .sort('-time')
                        .where('time')
                        .lt(time)
                        .limit(1)

        prevCandle = prevCandle[0]
        
        candle = new MinuteCandle({
            time,
            pair,

            o_token0PerToken1: token0PerToken1,
            o_token1PerToken0: token1PerToken0,
            o_usdPerToken0: usdPerToken0,
            o_usdPerToken1: usdPerToken1,

            l_token0PerToken1: token0PerToken1,
            l_token1PerToken0: token1PerToken0,
            l_usdPerToken0: usdPerToken0,
            l_usdPerToken1: usdPerToken1,

            h_tokehn0PerToken1: token0PerToken1,
            h_token1PerToken0: token1PerToken0,
            h_usdPerToken0: usdPerToken0,
            h_usdPerToken1: usdPerToken1,

          

            c_token0PerToken1: token0PerToken1,
            c_token1PerToken0: token1PerToken0,
            c_usdPerToken0: usdPerToken0,
            c_usdPerToken1: usdPerToken1,

            v_token0: 0,
            v_token1: 0,
            v_usd: 0
        })

        if (prevCandle) {
            candle.o_token0PerToken1 = prevCandle.c_token0PerToken1
            candle.o_token1PerToken0 = prevCandle.c_token1PerToken0
            candle.o_usdPerToken0 = prevCandle.c_usdPerToken0
            candle.o_usdPerToken1 = prevCandle.c_usdPerToken1

            candle.h_token0PerToken1 = Math.max(token0PerToken1 , prevCandle.c_token0PerToken1)
            candle.h_token1PerToken0 = Math.max(token1PerToken0 , prevCandle.c_token1PerToken0)
            candle.h_usdPerToken0 = Math.max(usdPerToken0 , prevCandle.c_usdPerToken0)
            candle.h_usdPerToken1 = Math.max(usdPerToken1 , prevCandle.c_usdPerToken1)

            candle.l_token0PerToken1 = Math.min(token0PerToken1, prevCandle.c_token0PerToken1)
            candle.l_token1PerToken0 = Math.min(token1PerToken0, prevCandle.c_token1PerToken0)
            candle.l_usdPerToken0 = Math.min(usdPerToken0, prevCandle.c_usdPerToken0)
            candle.l_usdPerToken1 = Math.min(usdPerToken1, prevCandle.c_usdPerToken1)
        }

    } else {

        if (token0PerToken1 > candle.h_token0PerToken1) {
            candle.h_token0PerToken1 = token0PerToken1
        }
        if (token0PerToken1 < candle.l_token0PerToken1) {
            candle.l_token0PerToken1 = token0PerToken1
        }
        candle.c_token0PerToken1 = token0PerToken1


        if (token1PerToken0 > candle.h_token1PerToken0) {
            candle.h_token1PerToken0 = token1PerToken0
        }
        if (token1PerToken0 < candle.l_token1PerToken0) {
            candle.l_token1PerToken0 = token1PerToken0
        }
        candle.c_token1PerToken0 = token1PerToken0

        
        if (usdPerToken0 > candle.h_usdPerToken0) {
            candle.h_usdPerToken0 = usdPerToken0
        }
        if (usdPerToken0 < candle.l_usdPerToken0) {
            candle.l_usdPerToken0 = usdPerToken0
        }
        candle.c_usdPerToken0 = usdPerToken0


        if (usdPerToken1 > candle.h_usdPerToken1) {
            candle.h_usdPerToken1 = usdPerToken1
        }
        if (usdPerToken1 < candle.l_usdPerToken1) {
            candle.l_usdPerToken1 = usdPerToken1
        }
        candle.c_usdPerToken1 = usdPerToken1

    }

    candle.v_usd += amountUSD
    candle.v_token1 += amountToken1
    candle.v_token0 += amountToken0


    await candle.save()
}