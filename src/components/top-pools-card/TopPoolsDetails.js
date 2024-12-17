import React, { useState } from "react";
import ellipse from "./assets/ellipse.svg";
import arrowup from "./assets/arrow-up.svg"; 

const TopPoolsDetails = ({performanceFee, rewardsToken, contractExp, tvl }) => {
  const [depositValue, setDepositValue] = useState(1000);
  return (
    <div className="pools-details-wrapper d-flex m-0 container-lg">
      <div className="leftside">
        <div className="activewrapper">
          <h6 className="activetxt">
            <img
              src={ellipse}
              alt=""
              className="position-relative"
              style={{ top: '-1px' }}

            />
            Active status
          </h6>
        </div>
        <div className="d-flex flex-column gap-2 justify-content-between">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <h6 className="earnrewards-text">Earn rewards in:</h6>
            <h6 className="earnrewards-token">DYP</h6>
          </div>
          <div className="d-flex align-items-center justify-content-between gap-2">
            <h6 className="earnrewards-text">Performance fee:</h6>
            <h6 className="earnrewards-token">0.25%</h6>
          </div>
        </div>
        <div>
          <div>
            <h6 className="bottomitems">
              <img src={arrowup} alt="" />
              Video tutorial
            </h6>
          </div>
          <div>
            <h6 className="bottomitems">
              <img src={arrowup} alt="" />
              Get DYP
            </h6>
          </div>
          <div>
            <h6 className="bottomitems">
              <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" />
              More info
            </h6>
          </div>
        </div>
      </div>
      <div className="otherside">
        <div className="activewrapper" style={{ visibility: "hidden" }}>
          <h6 className="activetxt">
            <img
              src={ellipse}
              alt=""
              className="position-relative"
              style={{ top: '-1px' }}

            />
            Active status
          </h6>
        </div>
        <div className="d-flex flex-column gap-2 justify-content-between">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <h6 className="earnrewards-text">Contract expires:</h6>
            <h6 className="earnrewards-token">14.12.2022</h6>
          </div>
          <div className="d-flex align-items-center justify-content-between gap-2">
            <h6 className="earnrewards-text">Total value locked:</h6>
            <h6 className="earnrewards-token">$2,340,823.45</h6>
          </div>
        </div>
        <button className="btn green-btn">Claim reward 0.01 ETH</button>
      </div>
      <div className="otherside-border">
        <h6 className="deposit-txt">Deposit</h6>
        <div className="d-flex flex-column gap-2 justify-content-between">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="position-relative">
              <h6 className="amount-txt">Amount</h6>
              <input
                type={"text"}
                className="styledinput"
                value={depositValue}
                onChange={(e) => setDepositValue(e.target.value)}
              />
            </div>
            <button className="btn maxbtn">Max</button>
          </div>
        </div>
        <button className="btn filledbtn">Approve</button>
      </div>
      <div className="otherside-border">
        <h6 className="withdraw-txt">Withdraw</h6>
        <div className="d-flex flex-column gap-2 justify-content-between">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="position-relative">
              <h6 className="amount-txt">Amount</h6>
              <input
                type={"text"}
                className="styledinput"
                value={depositValue}
                onChange={(e) => setDepositValue(e.target.value)}
              />
            </div>
            <button className="btn maxbtn">Max</button>
          </div>
        </div>
        <button className="btn filledbtn">Approve</button>
      </div>
    </div>
  );
};

export default TopPoolsDetails;
