import React from "react";
import "./migrationbanner.css";
import migrationBannerIcon from "./assets/migrationBannerIcon.svg";
import { NavLink } from "react-router-dom";

const MigrationBanner = () => {
  return (
    <div className="migration-banner-wrapper p-3">
      <div className="purplediv" style={{ background: "#8890c4" }}></div>
      <div className="d-flex align-items-center gap-2">
        <img src={migrationBannerIcon} alt="" />
        <h6 className="migration-banner-title mb-0">Migration Status</h6>
      </div>
      <div className="d-flex flex-column gap-3">
        <div className="migrated-tokens-wrapper my-4 d-flex align-items-center justify-content-between p-3">
          <span className="migrated-tokens mb-0">
            Migrated
            <br />
            DYP Tokens
          </span>
          <h6 className="migrated-tokens-amount mb-0">27,256,226</h6>
        </div>
        <div className="migration-outer-progress d-flex align-items-center justify-content-start">
          <div className="progress-dots d-flex align-items-center justify-content-between">
            <span className="migration-dot"></span>
            <span className="migration-dot"></span>
            <span className="migration-dot"></span>
            <span className="migration-dot"></span>
            <span className="migration-dot"></span>
            <span className="migration-dot"></span>
            <span className="migration-dot"></span>
            <span className="migration-dot"></span>
            <span className="migration-dot"></span>
            <span className="migration-dot"></span>
          </div>
          <div className="migration-inner-progress d-flex align-items-center justify-content-end px-3" style={{width: "50%"}}>
            <div className="d-flex align-items-center gap-2">
              <h6 className="migration-percentage mb-0">50%</h6>
              <span className="migration-dash"></span>
            </div>
          </div>
        </div>
          <span className="migration-progress-info mb-0">*Total supply to be migrated: 75M DYP</span>
          <div className="d-flex align-items-center gap-2 mt-5">
            <NavLink to={"/migration"} className="btn filled-btn">Migrate</NavLink>
            <button className="btn outline-btn" style={{padding: "6px 24px"}}>Tutorial</button>
          </div>
      </div>
    </div>
  );
};

export default MigrationBanner;
