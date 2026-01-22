import React from "react";
import "./launchpad.css";
import { NavLink } from "react-router-dom"; 

const LoyaltyCard = () => {
  return (
    <NavLink
      to={`/loyalty-program`}
      className="launchpad-wrapper wrapper2"
    >
      <div className="d-flex flex-column gap-2 align-items-center justify-content-between">
        <img
          src={'https://cdn.worldofdypians.com/tools/loyaltyBanner.png'}
          alt=""
          className="launchpadbg"
        />
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
             Join and earn gas rebates now!
          </h6>
          <img src={'https://cdn.worldofdypians.com/tools/filledArrow.svg'} alt="" />
        </div>
      </div>
    </NavLink>
  );
};

export default LoyaltyCard;
