import React from "react";
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
          Bridge on Base <img src={'https://cdn.worldofdypians.com/tools/gov-logo.svg'} alt="" style={{height:39, width:39}}/>
          </h6>
        </div>
        <div className="d-flex flex-column h-100 justify-content-between">
          <div>
            <h6 className="governancecard-desc">
            Seamlessly bridge DYP to Base via the official Base SuperBridge
            </h6>
          </div>

          <h6 className="govcard-btntext d-flex justify-content-end gap-2 align-items-center">
            <img src={'https://cdn.worldofdypians.com/tools/filledArrow.svg'} alt="" />
          </h6>
        </div>
      </div>
    </a>
  );
};

export default GovCard;
