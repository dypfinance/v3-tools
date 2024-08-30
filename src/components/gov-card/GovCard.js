import React from "react";
import filledArrow from "./assets/filledarrow.svg";
import govLogo from "./assets/gov-logo.svg";
import { NavLink } from "react-router-dom";
import "./govcard.css";

const GovCard = () => {
  return (
    <a href="https://superbridge.app/base" className="govcard-wrapper" target="_blank" rel="noreferrer">
      <div
        className="purplediv"
        style={{ background: "#8890C4", top: "23px" }}
      ></div>
      <div className="d-flex flex-column gap-2 justify-content-between h-100">
        <div className="">
          <h6 className="governancecard-title d-flex justify-content-between gap-2 align-items-center">
          Bridge on Base <img src={govLogo} alt="" style={{height:39, width:39}}/>
          </h6>
        </div>
        <div className="d-flex flex-column h-100 justify-content-between">
          <div>
            <h6 className="governancecard-desc">
            Seamlessly swap DYP to Base via the official Base Super Bridge
            </h6>
          </div>

          <h6 className="govcard-btntext d-flex justify-content-end gap-2 align-items-center">
            <img src={filledArrow} alt="" />
          </h6>
        </div>
      </div>
    </a>
  );
};

export default GovCard;
