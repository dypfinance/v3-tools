import React from "react";
import defiBg from "./assets/defiBg.webp";
import rightlogo from "./assets/filledArrow.svg";
import "./launchpad.css";
import { NavLink } from "react-router-dom";

const LaunchpadCard = () => {
  return (
    <NavLink to="/earn/defi-staking" className="launchpad-wrapper">
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
            Make the most of your assets with DeFi Staking
          </h6>
          <img src={rightlogo} alt="" />
        </div>
      </div>
    </NavLink>
  );
};

export default LaunchpadCard;
