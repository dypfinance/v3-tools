import React from "react";
import filledArrow from "./assets/filledarrow.svg";
import zoom from "./assets/zoom.svg";
import yieldsIcon from "../../assets/sidebarIcons/yieldsIcon.svg";
import explorerChart from "./assets/explorerChart.webp";
import swapBanner from "./assets/swapBanner.webp";
import "./explorer-card.css";
import { NavLink } from "react-router-dom";

const ExplorerCard = () => {
  return (
    <NavLink
      to="/launchpad"
      className="explorercard-wrapper gap-2 justify-content-between d-flex position-relative"
    >
      <div
        className="purplediv"
        style={{ background: "#8890C4", top: "15px" }}
      ></div>
      <div className="d-flex justify-content-center align-items-center">
        <img src={swapBanner} className="explorer-chart d-none d-lg-flex" alt="" />
      </div>
      <div className="col-12 col-lg-7 d-flex flex-column gap-3 justify-content-between">
        <div className=" d-flex justify-content-between gap-2 align-items-center">
          <h6 className="explorercard-title d-flex gap-2">
          WOD Token Whitelist
          <div className="launchpad-tag d-flex align-items-center p-1"><span className="launchpad-tag-title">Launchpad</span></div>
          </h6>
          <div className="d-flex flex-column gap-0">
            {/* <h6 className="topapr-title">Top APR</h6> */}
            {/* <h6 className="topapr-amount">1.09%</h6> */}
          </div>
        </div>
        <div>
          <h6 className="explorercard-desc">
          Join the WOD Token Whitelist for early access and exclusive benefits in World of Dypians. Secure your spot now!
          </h6>
        </div>
        <div className="">
          <h6 className="explorercard-btntext d-flex gap-2 align-items-center">
            Explore more <img src={filledArrow} alt="" />
          </h6>
        </div>
      </div>
      
    </NavLink>
  );
};

export default ExplorerCard;
