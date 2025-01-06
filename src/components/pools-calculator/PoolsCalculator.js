import React from "react";
import "./poolscalculator.css";
 
import xMark from "../calculator/assets/xMark.svg";

const PoolsCalculator = ({ onClose, handleInputChangeAmount, handleInputChangeDays }) => {
  return (
    <div className="pools-calculator p-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <img src={'https://cdn.worldofdypians.com/tools/calculator.svg'} alt="" />
          <h5 style={{ fontSize: "23px", fontWeight: "500", color: "#f7f7fc" }}>
            Calculator
          </h5>
        </div>
        <img src={xMark} alt="" onClick={onClose} className="cursor-pointer" />
      </div>
      <hr />
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex flex-column gap-3 w-50 me-5">
          <span style={{ fontSize: "15px", fontWeight: "500" }}>
            Days to stake
          </span>
          <input
            style={{ height: "40px" }}
            type="number"
            className="form-control calcinput w-100"
            id="days"
            name="days"
            placeholder="Days*"
            onChange={handleInputChangeDays}
          />
        </div>
        <div className="d-flex flex-column gap-3 w-50 me-5">
          <span style={{ fontSize: "15px", fontWeight: "500" }}>
            Amount to stake
          </span>
          <input
            style={{ height: "40px" }}
            type="number"
            className="form-control calcinput w-100"
            id="days"
            name="days"
            placeholder="USD to deposit*"
            onChange={handleInputChangeAmount}

          />
        </div>
      </div>
      <div className="d-flex flex-column gap-2 mt-4">
        <h3 style={{ fontWeight: "500", fontSize: "39px" }}>$250.00</h3>
        <h6 style={{ fontWeight: "300", fontSize: "15px", color: "#f7f7fc" }}>
          Approx (1.351085WETH)
        </h6>
      </div>
      <div className="mt-4">
        <p style={{ fontWeight: "400", fontSize: "13px", color: "#f7f7fc" }}>
          *This calculator is for informational purposes only. Calculated yields
          assume that prices of the deposited assets don't change.
        </p>
      </div>
    </div>
  );
};

export default PoolsCalculator;
