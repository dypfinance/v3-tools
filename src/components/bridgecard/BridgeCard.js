import React from "react";
import filledArrow from "./assets/filledarrow.svg";
import bridgeLogo from "./assets/bridge-logo.svg";
import yieldIcon from "./assets/yieldIcon.svg";

import "./bridgecard.css";
import { NavLink } from "react-router-dom";

const BridgeCard = () => {
  return (
    <NavLink to="/farms" className="bridgecard-wrapper">
      <div
        className="purplediv"
        style={{ background: "#8890C4", top: "23px" }}
      ></div>
      <div className="d-flex flex-column gap-2 justify-content-between h-100">
        <div className="">
          <h6 className="bridgecard-title d-flex justify-content-between gap-2 align-items-center">
            Yields <img src={yieldIcon} alt="" />
          </h6>
        </div>
        <div className="d-flex flex-column gap-3">
          <div>
            <h6 className="bridgecard-desc">
              View yield farming projects running on different blockchains.
            </h6>
          </div>
          <div>
            <h6 className="bridgecard-btntext d-flex justify-content-end gap-2 align-items-center">
              <img src={filledArrow} alt="" />
            </h6>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default BridgeCard;
