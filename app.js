const config = require('./config')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.connect(config.local_db_uri, { useNewUrlParser: true, useUnifiedTopology: true })

const app = express()

// allow app routes to be accessed from other domains
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const api = require('./routes/api')
app.use('/api', api)

const FarmInfo = require('./models/farminfo')
app.listen(config.port, () => {
    FarmInfo.startFarmInfoUpdateService()
    console.log("Server listening on port "+config.port)
})