import React, { useState } from 'react'
import dypLogo from '../../top-pools-card/assets/dyplogo.svg'  
import TopPoolsDetails from '../../top-pools-card/TopPoolsDetails'


const EtherPoolsCard = () => {

  const [showDetails, setShowDetails] = useState(false);

  return (
  <>
      <div className="ether-pools-card position-relative px-2 py-3">
        <div className="purplediv" style={{top: '10px', background: '#7770DF'}}></div>
        <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2 ps-2">
                <img src={dypLogo} alt="" />
                <h6 style={{fontSize: '23px', fontWeight: '500', color: '#fff'}}>DYP proposal</h6>
            </div>
            <div className="disburse-btn">Disburse/Burn</div>
        </div>
        <div className="expiry-date d-flex align-items-end justify-content-between p-2 mt-4">
            <div className="d-flex flex-column align-items-start gap-2">
                <span style={{fontSize: '13px', fontWeight: '400', color: '#7A81B4'}}>Expired</span>
                <h6 style={{fontSize: '19px', fontWeight: '500', color: '#C0CBF7'}}>3 months ago</h6>
            </div>
            <h6
              className="details-text gap-1 d-flex align-items-center"
              style={{ color: showDetails === false ? "#75CAC2" : "#F8845B", cursor: 'pointer' }}
              onClick={() => {
                setShowDetails(!showDetails);
              }}
            >
              {showDetails === false ? "Details" : "Close"}
              <img src={showDetails === false ? 'https://cdn.worldofdypians.com/tools/greenarrow.svg' : 'https://cdn.worldofdypians.com/tools/orangearrow.svg'} />
            </h6>
        </div>
    </div>
    {showDetails && <TopPoolsDetails />}
  </>
  )
}

export default EtherPoolsCard