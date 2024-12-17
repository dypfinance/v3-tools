import React from "react";
import "./launchpad.css";

const LaunchpadCard = ({ type }) => {
  return (
    <a
      href="https://www.worldofdypians.com/"
      className="launchpad-wrapper"
      rel="noreferrer"
      target="_blank"
      style={{ marginTop: "12px" }}
    >
      <div className="d-flex flex-column gap-2 align-items-center justify-content-between">
        <img src={'https://cdn.worldofdypians.com/tools/defiBg.webp'} alt="" className="launchpadbg" />
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
            Discover excitement like never before!
          </h6>
          <img
            src={"https://cdn.worldofdypians.com/tools/filledArrow.svg"}
            alt=""
          />
        </div>
      </div>
    </a>
  );
};

export default LaunchpadCard;
