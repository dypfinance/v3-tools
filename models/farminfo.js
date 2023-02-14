const mongoose = require('mongoose')

const config = require('../config')
const axios = require('axios').default

const FarmInfoSchema = mongoose.Schema({
    link_logo: String,

    link_pair: String,
    
    pair_name: { type: String, index: true },
    pool_name: { type: String, index: true },
    return_types: String,
    apy_percent: { type: Number, index: true, default: 0 },
    tvl_usd: { type: Number, index: true, default: 0 },

    apy_percent_url: { type: String, default: '' },
    tvl_usd_url: {type: String, default: ''}
})

const FarmInfo = module.exports = mongoose.model('FarmInfo', FarmInfoSchema)


const UPDATE_INTERVAL = config.farm_info_update_interval_in_seconds * 1e3

module.exports.startFarmInfoUpdateService = () => {
    async function updateInfo() {
        console.log('updateInfo()')
        try {
            let farms_with_apy_url = await FarmInfo.find().where('apy_percent_url').ne('')
            let farms_with_tvl_url = await FarmInfo.find().where('tvl_usd_url').ne('')

            farms_with_apy_url.forEach(async farm => {
                try {
                    let id = farm.id
                    let result = await axios.get(farm.apy_percent_url)
                    result = result.data
                    result = Number(result)
                    if (result) {
                        f = await FarmInfo.findById(id)
                        if (f) {
                            f.apy_percent = result
                            await f.save()
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            })

            farms_with_tvl_url.forEach(async farm => {
                try {
                    let id = farm.id
                    let result = await axios.get(farm.tvl_usd_url)
                    result = result.data
                    result = Number(result)
                    if (result) {
                        f = await FarmInfo.findById(id)
                        if (f) {
                            f.tvl_usd = result
                            await f.save()
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            })

        } catch (e) {
            console.error(e)
        }
    }

    updateInfo()
    setInterval(updateInfo, UPDATE_INTERVAL)
}