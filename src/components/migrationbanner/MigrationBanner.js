import React, { useState } from "react";
import "./migrationbanner.css";
import migrationBannerIcon from "./assets/migrationBannerIcon.svg";
import { NavLink } from "react-router-dom";
import Countdown from "react-countdown";

const renderer = ({ days ,hours, minutes}) => {
  return (
    <div className="d-flex align-items-start gap-2">
    <div className="d-flex flex-column align-items-center">
      <h6 className="migrated-tokens-amount mb-0">
        {days}
      </h6>
      <span className="migrated-tokens mb-0">Days</span>
    </div>
    <h6 className="migrated-tokens-amount mb-0">:</h6>

    <div className="d-flex flex-column align-items-center">
      <h6 className="migrated-tokens-amount mb-0">
        {hours}
      </h6>
      <span className="migrated-tokens mb-0">Hours</span>
    </div>
    <h6 className="migrated-tokens-amount mb-0">:</h6>
    <div className="d-flex flex-column align-items-center">
      <h6 className="migrated-tokens-amount mb-0">
        {minutes}
      </h6>
      <span className="migrated-tokens mb-0">Minutes</span>
    </div>
  </div>

  )
}

const MigrationBanner = () => {
  const [countdown, setCountdown] = useState(true);

  let lastDay = new Date("2023-11-08T09:00:00.000+02:00");
  

  return (
    <div className="migration-banner-wrapper p-3">
      <div className="purplediv" style={{ background: "#8890c4" }}></div>
      <div className="d-flex align-items-center gap-2">
        <img src={migrationBannerIcon} alt="" />
        <h6 className="migration-banner-title mb-0">Migration Status</h6>
      </div>
      <div className="d-flex flex-column gap-3">
        <div className="migrated-tokens-wrapper my-4 d-flex align-items-center justify-content-between p-3">
          {countdown ? (
            <>
              <span className="migrated-tokens mb-0">Live in</span>
              {/* <div className="d-flex align-items-start gap-2">
                <div className="d-flex flex-column">
                  <h6 className="migrated-tokens-amount mb-0">
                    15
                  </h6>
                  <span className="migrated-tokens mb-0">Hours</span>
                </div>
                <h6 className="migrated-tokens-amount mb-0">:</h6>
                <div className="d-flex flex-column">
                  <h6 className="migrated-tokens-amount mb-0">
                    06
                  </h6>
                  <span className="migrated-tokens mb-0">Minutes</span>
                </div>
              </div> */}
              <Countdown renderer={renderer} date={lastDay} zeroPadTime={2} onComplete={() => setCountdown(false)} />
            </>
          ) : (
            <>
              <span className="migrated-tokens mb-0">
                Migrated
                <br />
                DYP Tokens
              </span>
              <h6 className="migrated-tokens-amount mb-0">27,256,226</h6>
            </>
          )}
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
          <div
            className="migration-inner-progress d-flex align-items-center justify-content-end px-3"
            style={{ width: "100%" }}
          >
            <div className="d-flex align-items-center gap-2">
              {countdown ? 
              <>
              <h6 className="migration-percentage mb-0">Coming soon</h6>
              </>
              :
              <>
              <h6 className="migration-percentage mb-0">50%</h6>
              <span className="migration-dash"></span>
              </>
              }
            </div>
          </div>
        </div>
        <span className="migration-progress-info mb-0">
          *Total supply to be migrated: 75M DYP
        </span>
        <div className="d-flex align-items-center gap-2 mt-3">
          <NavLink to={"/migration"} className="btn filled-btn">
            Migrate
          </NavLink>
          <button className="btn outline-btn" style={{ padding: "6px 24px" }}>
            Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default MigrationBanner;
