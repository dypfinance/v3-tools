import React from "react";
import "./whitelist.css";
import dyp from "./assets/dyp.svg";
import idyp from "./assets/idyp.svg";
import premium from "./assets/premium.png";

const Whitelist = ({ networkId, isConnected, handleConnection, coinbase }) => {
  return (
    <div className="container-lg p-0">
      <div className="whitelist-banner d-flex flex-column flex-lg-row p-4 gap-3 gap-lg-0 align-items-center mb-4">
        <div className="col-12 col-lg-6">
          <div className="d-flex flex-column gap-3">
            <h6 className="migration-banner-title mb-0">WOD Token Whitelist</h6>
            <p className="migration-banner-desc mb-0">
              WOD Token Whitelist grants early access to our exclusive token
              sale. Join now to secure your spot and be among the first to
              unlock unique benefits within the World of Dypians ecosystem.
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-4 d-flex justify-content-center justify-content-lg-end">
          <div className="position-relative d-flex align-items-center flex-column">
            <div className="commiting-wrapper p-3">
              <div className="d-flex flex-column gap-1">
                <span className="commiting-amount">$123k</span>
                <span className="migration-status-text">
                  Total Committed Value
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column flex-lg-row gap-4 gap-lg-0 align-items-center justify-content-between mb-4">
        <div className="whitelist-details-wrapper p-3 d-flex flex-column gap-3 position-relative">
          <div className="d-flex align-items-center gap-1">
            <img className="whitelist-item-img" src={dyp} alt="" />
            <div className="d-flex flex-column">
              <span className="whitelist-item-title">DYP Token</span>
              <span className="whitelist-item-desc">
                Holding or staking DYPv2 makes you eligible for the WOD token
                whitelist
              </span>
            </div>
          </div>
        </div>
        <div className="whitelist-details-wrapper p-3 d-flex flex-column gap-3 position-relative">
          <div className="d-flex align-items-center gap-1">
            <img className="whitelist-item-img" src={idyp} alt="" />
            <div className="d-flex flex-column">
              <span className="whitelist-item-title">iDYP Token</span>
              <span className="whitelist-item-desc">
                Holding or staking iDYP makes you eligible for the WOD token
                whitelist
              </span>
            </div>
          </div>
        </div>
        <div className="whitelist-details-wrapper p-3 d-flex flex-column gap-3 position-relative">
          <div className="d-flex align-items-center gap-1">
            <img className="whitelist-item-img" src={premium} alt="" />
            <div className="d-flex flex-column">
              <span className="whitelist-item-title">Premium Subscriber</span>
              <span className="whitelist-item-desc">
                By being a Premium Subscriber you are eligible to join the WOD
                token whitelist
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whitelist;
