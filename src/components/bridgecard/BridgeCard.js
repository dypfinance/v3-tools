import React from "react";
 
import { NavLink } from "react-router-dom";
import "./bridgecard.css";

const BridgeCard = ({onMobileClick}) => {
  return (
    <NavLink to='/games' className="bridgecard-wrapper">
    <div className="">
      <div
        className="purplediv"
        style={{ background: "#8890C4", top: "23px" }}
      ></div>
      <div className="d-flex flex-column gap-2 justify-content-between h-100">
        <div className="">
          <h6 className="bridgecard-title d-flex justify-content-between gap-2 align-items-center">
          Mini-Games
          </h6>
        </div>
        <div className="d-flex flex-column gap-3">
          <div>
            <h6 className="bridgecard-desc">
            Enjoy the ultimate gaming experience.
            </h6>
          </div>
          <div>
            <h6 className="bridgecard-btntext d-flex justify-content-start gap-2 align-items-center">
              <img src={'https://cdn.worldofdypians.com/tools/filledArrow.svg'} alt="" /> 
            </h6>
          </div>
        </div>
      </div>
    </div>
    </NavLink>
  );
};

export default BridgeCard;
