import React from "react";
import "./whitelist.css";
import dyp from "./assets/dyp.svg";
import idyp from "./assets/idyp.svg";
import premium from "./assets/premium.png";
import tooltipIcon from './assets/tooltipIcon.svg'

const Whitelist = ({ networkId, isConnected, handleConnection, coinbase }) => {
  return (
    <div className="container-lg p-0">
      <div className="whitelist-banner d-flex flex-column flex-lg-row p-4 gap-3 gap-lg-0 align-items-center mb-4">
        <div className="col-12 col-lg-4">
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
              <div className="d-flex flex-column gap-2">
                <span className="commiting-amount">$123k</span>
                <span className="migration-status-text-2">
                  Total Committed Value
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="whitelist-info-grid">
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Token Distribution</span>
          <h6 className="mb-0 whitelist-info-title">Private Round</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Token Price</span>
          <h6 className="mb-0 whitelist-info-title">$0.0325</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Fully Market Cap</span>
          <h6 className="mb-0 whitelist-info-title">$42,500,000</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Cliff/Vesting Period</span>
          <h6 className="mb-0 whitelist-info-title">3/16 Months</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Network</span>
          <h6 className="mb-0 whitelist-info-title">BNB Chain</h6>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-7">
          <div className="whitelist-info-item d-flex flex-column w-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0 whitelist-deposit-title">Whitelist</h6>
                <span className="whitelist-days-left">
                  9 days left
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-5"></div>
      </div>
    </div>
  );
};

export default Whitelist;
