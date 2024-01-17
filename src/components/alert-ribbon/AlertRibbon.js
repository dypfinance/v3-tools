import React from "react";
import "./alertribon.css";
import Countdown from "react-countdown";
import close from "../general/close.svg";

const renderer = ({ days }) => {
  return <>{days < 10 ? "0" + days : days}</>;
};

const AlertRibbon = ({ onClose }) => {
  let daysUntilFutureDate = new Date("2024-02-16T23:59:59.000+02:00");

  return (
    <div className="ribbon-wrapper p-2">
      <div className="d-flex align-items-center gap-1 justify-content-between">
        <div className="d-flex align-items-center gap-1 justify-content-center w-100">
          <span className="ribbon-text">
            🚨 &nbsp; Attention: You have{" "}
            <Countdown date={daysUntilFutureDate} renderer={renderer} /> days
            remaining to unstake your assets from the inactive earn pools!&nbsp;
            🚨
          </span>
        </div>
        <img src={close} alt="" className="ribbon-x" onClick={onClose} />
      </div>
    </div>
  );
};

export default AlertRibbon;
