import React from "react";
import defiBg from "./assets/defiBg.webp";
import rightlogo from "./assets/filledArrow.svg";
import "./launchpad.css";
import { NavLink } from "react-router-dom";
import whitelistHomeBg from './assets/whitelistHomeBg.png'

const LaunchpadCard = () => {
  return (
    <NavLink to="/wod-whitelist" className="launchpad-wrapper">
      <div className="d-flex flex-column gap-2 align-items-center justify-content-between position-relative">
        <div className="whitelist-days-left">
          <span className="whitelist-days-left-span">9 days left</span>
        </div>
        <img src={whitelistHomeBg} alt="" className="launchpadbg"  />
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
            Join now to secure your spot as early investor
          </h6>
          <img src={rightlogo} alt="" />
        </div>
      </div>
    </NavLink>
  );
};

export default LaunchpadCard;
