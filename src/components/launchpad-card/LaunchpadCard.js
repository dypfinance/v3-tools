import React from "react";
import defiBg from "./assets/defiBg.webp";
import rightlogo from "./assets/filledArrow.svg";
import "./launchpad.css";
import { NavLink } from "react-router-dom";
import whitelistHomeBg from './assets/whitelistHomeBg.png'

const LaunchpadCard = () => {
  return (
    <a href="https://dypius.medium.com/dypius-expands-to-base-unlocking-new-opportunities-110cfed318c3" className="launchpad-wrapper" rel="noreferrer" target="_blank">
      <div className="d-flex flex-column gap-2 align-items-center justify-content-between">
        <img src={defiBg} alt="" className="launchpadbg" />
        <div
          className="d-flex gap-2 align-items-center justify-content-between w-100"
          style={{ padding: "0px 10px 4px 10px" }}
        >
          <h6
            style={{
              color: "#b3b9dd",
              fontSize: "12px",
              fontWeight: "500",
              lineHeight: "16px",
            }}
          >
            Dypius Expands to Base Ecosystem
          </h6>
          <img src={rightlogo} alt="" />
        </div>
      </div>
    </a>
  );
};

export default LaunchpadCard;
