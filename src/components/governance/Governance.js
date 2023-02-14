import React from 'react'
import EtherPools from './EtherPools/EtherPools'
import './governance.css'
import GovernanceBalance from './GovernanceBalance/GovernanceBalance'
import GovernanceHero from './GovernanceHero/GovernanceHero'

const Governance = () => {
  return (
    <div className="container-lg governance-wrapper d-flex flex-column justify-content-center align-items-center py-3 position-relative">
      <GovernanceHero />
      <GovernanceBalance />
      <EtherPools />
    </div>
  )
}

export default Governance