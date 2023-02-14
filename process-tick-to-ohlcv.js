const { Client } = require('pg')
const config = require('./config')
const fs = require('fs')
const mongoose = require('mongoose')

mongoose.connect(config.local_db_uri, {useNewUrlParser: true, useUnifiedTopology: true})

const MinuteCandle = require('./models/minute-candle')
const wait = ms => new Promise(r => setTimeout(r, ms))

;(async function() {
    const client = new Client({
        connectionString: config.postgres_conn_string_graphnode
    })
    await client.connect()
    let processed = Number(fs.readFileSync('./candles-progress.txt', 'utf-8'))
    console.log({processed})
    await wait(2e3)
    while (true) {

        const res = await client.query(`SELECT * FROM sgd1.swap ORDER BY vid ASC OFFSET ${processed} LIMIT 10000`)

        console.time('Processing Swap')
        if (res.rows.length == 0) {
            console.log("No swaps found, waiting 5s")
            await wait(5000)
            console.log("Wait over, continuing...")
        }
        for (let i = 0; i < res.rows.length; i++) {
            await MinuteCandle.processSwap(res.rows[i])
            console.log(`Processed ${i+1} of ${res.rows.length}, total processed: ${processed}`)
            fs.writeFileSync('./candles-progress.txt', String(++processed))
        }
        console.timeEnd('Processing Swap')
    
        // let res2 = res.rows.map(r => r.timestamp*1)
        // console.log(JSON.stringify(res2) == JSON.stringify(res2.sort()))
        // console.log(res.rowCount, res2.length)
    }
    // await client.end()    
})();