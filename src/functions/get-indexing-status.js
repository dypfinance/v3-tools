import fetchGql from './fetch-gql'

const QUERY = `{
	indexingStatuses {
		synced
    subgraph
    health
    chains {
      network
      chainHeadBlock {number}
      latestBlock {
        number
      }
    }
    node
    entityCount
  }
}`

export default async function getSyncStats() {
    let res = await fetchGql(QUERY, null, window.config.indexing_status_endpoint)
    console.log({res})
    return res.data.indexingStatuses[0].chains[0]
}