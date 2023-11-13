import React, { useEffect, useState } from "react";
import "./migrationbanner.css";
import migrationBannerIcon from "./assets/migrationBannerIcon.png";
import { NavLink } from "react-router-dom";
import Countdown from "react-countdown";
import axios from "axios";
import getFormattedNumber from "../../functions/get-formatted-number";
import useWindowSize from "../../functions/useWindowSize";

const renderer = ({ days, hours, minutes }) => {
  return (
    <div className="d-flex align-items-start gap-2">
      <div className="d-flex flex-column align-items-center">
        <h6 className="migrated-tokens-amount mb-0">{days}</h6>
        <span className="migrated-tokens mb-0">Days</span>
      </div>
      <h6 className="migrated-tokens-amount mb-0">:</h6>

      <div className="d-flex flex-column align-items-center">
        <h6 className="migrated-tokens-amount mb-0">{hours}</h6>
        <span className="migrated-tokens mb-0">Hours</span>
      </div>
      <h6 className="migrated-tokens-amount mb-0">:</h6>
      <div className="d-flex flex-column align-items-center">
        <h6 className="migrated-tokens-amount mb-0">{minutes}</h6>
        <span className="migrated-tokens mb-0">Minutes</span>
      </div>
    </div>
  );
};

const MigrationBanner = () => {
  const [countdown, setCountdown] = useState(true);
  const [migrationAmount, setMigrationAmount] = useState(0);
  const [migrationPercentage, setMigrationPercentage] = useState(true);

  const windowSize = useWindowSize();

  let lastDay = new Date("2023-11-08T09:00:00.000+01:00");

  const getMigrationData = async () => {
    const result = await axios.get(
      "https://api.dyp.finance/api/migratedTokens"
    );
    if (result && result.status === 200) {
      const tokenAmount = result.data.migratedTokens;
      const percentage = result.data.tokenPercentage;
      setMigrationAmount(tokenAmount);
      setMigrationPercentage(percentage);
    }
  };

  useEffect(() => {
    getMigrationData();
  }, []);

  return (
    <div className="migration-banner-wrapper p-3">
      <div className="purplediv" style={{ background: "#8890c4" }}></div>
      <div className="d-flex align-items-center gap-2">
        <img src={migrationBannerIcon} alt="" />
        <h6 className="migration-banner-title mb-0">Migration Status</h6>
      </div>
      <div className="d-flex flex-column gap-3">
        <div className="migrated-tokens-wrapper my-4 d-flex flex-column flex-xl-row align-items-center justify-content-between p-3">
          <>
            <span className="migrated-tokens mb-0">
              Migrated
              {windowSize.width > 500 && <br />}
              {" "}DYP Tokens
            </span>
            <h6 className="migrated-tokens-amount mb-0">
              {getFormattedNumber(migrationAmount, 0)}
            </h6>
          </>
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
            style={{
              width: `${
                windowSize.width > 500
                  ? migrationPercentage >= 35
                    ? migrationPercentage
                    : ""
                  : migrationPercentage >= 55
                  ? migrationPercentage
                  : ""
              }%`,
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <>
                <h6 className="migration-percentage mb-0">
                  {migrationPercentage}%
                </h6>
                <span className="migration-dash"></span>
              </>
            </div>
          </div>
        </div>
        <span className="migration-progress-info mb-0">
          *Total supply to be migrated: 79.9M DYP
        </span>
        <div className="d-flex align-items-center gap-2 mt-3">
          <NavLink to={"/migration"} className="btn filled-btn">
            Migrate
          </NavLink>
          <a
            href="https://medium.com/@dypius/how-to-convert-your-old-dyp-to-the-new-dyp-v2-63b8965bbfa5"
            target="_blank"
            rel="noreferrer"
            className="btn outline-btn"
            style={{ padding: "6px 24px" }}
          >
            Tutorial
          </a>
        </div>
      </div>
    </div>
  );
};

export default MigrationBanner;
