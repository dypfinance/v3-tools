import React from "react";
import "./launchpad.css";
import { NavLink } from "react-router-dom";

const LaunchpadCard = ({ type }) => {
  return (
    <NavLink
      to="/governance"
      className="launchpad-wrapper"
      rel="noreferrer"
      style={{ marginTop: "12px" }}
    >
      <div className="d-flex flex-column gap-2 align-items-center justify-content-between">
        <img
          src={"https://cdn.worldofdypians.com/tools/govhero.png"}
          alt=""
          className="launchpadbg"
          style={{ height: 120 }}
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
            {/* Discover excitement like never before! */}
            Dypius Governance
          </h6>
          <img
            src={"https://cdn.worldofdypians.com/tools/filledArrow.svg"}
            alt=""
          />
        </div>
      </div>
    </NavLink>
  );
};

export default LaunchpadCard;
