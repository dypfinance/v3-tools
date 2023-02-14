import React from 'react'
import governanceHeroIcon from '../assets/governanceHeroIcon.svg'

const GovernanceHero = () => {
  return (
    <div className="row w-100 governance-hero justify-content-between">
       <div className="col-5 d-flex flex-column justify-content-center gap-3 px-5">
        <h3 className="text-white">Dypius Governance</h3>
        <p className="text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus sit amet tortor ornare efficitur. Quisque turpis arcu, auctor tincidunt quam ac, lobortis tristique nulla. Donec volutpat suscipit egestas.
        </p>
      </div>
        <div className="col-3 d-flex justify-content-center align-items-center">
        <img src={governanceHeroIcon} alt="" />
        </div>
    </div>
  )
}

export default GovernanceHero