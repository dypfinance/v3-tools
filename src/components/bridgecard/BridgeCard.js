import React from "react";
import filledArrow from "./assets/filledarrow.svg";
import bridgeLogo from "./assets/bridge-logo.svg";
import yieldIcon from "./assets/yieldIcon.svg";

import "./bridgecard.css";

const BridgeCard = ({onMobileClick}) => {
  return (
    <div className="bridgecard-wrapper" onClick={onMobileClick}>
      <div
        className="purplediv"
        style={{ background: "#8890C4", top: "23px" }}
      ></div>
      <div className="d-flex flex-column gap-2 justify-content-between h-100">
        <div className="">
          <h6 className="bridgecard-title d-flex justify-content-between gap-2 align-items-center">
            Mobile App
          </h6>
        </div>
        <div className="d-flex flex-column gap-3">
          <div>
            <h6 className="bridgecard-desc">
              Enjoy the ultimate mobile experience.
            </h6>
          </div>
          <div>
            <h6 className="bridgecard-btntext d-flex justify-content-start gap-2 align-items-center">
              <img src={filledArrow} alt="" />
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgeCard;
