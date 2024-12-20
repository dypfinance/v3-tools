import React, { useState } from "react";
import xMark from "./assets/xMark.svg";
import getDypIcon from "./assets/getDypIcon.svg";
import "./pricingpackages.css";
import { Checkbox } from "@mui/material";
import { NavLink } from "react-router-dom";

const BundlePopup = ({
  active,
  onClose,
  activeBundle,
  setFirstLock,
  setSecondLock,
  setThirdLock,
}) => {
  const [buttonState, setButtonState] = useState("approve");
  const [terms, setTerms] = useState(false);

  const handleDeposit = () => {
    if (activeBundle === 1) {
      setFirstLock(true);
    } else if (activeBundle === 2) {
      setSecondLock(true);
    } else if (activeBundle === 3) {
      setThirdLock(true);
    }
    onClose();
  };

  const handleApprove = () => {
    setButtonState("loading");
    setTimeout(() => {
      setButtonState("deposit");
    }, 2000);
  };

  return (
    <div
      id="popup"
      className={`popup-wrapper  ${
        active && "popup-active"
      } p-3 d-flex flex-column gap-3 justify-content-center align-items-center`}
      style={{ borderRadius: "8px", background: "#1A1A36" }}
    >
      <div
        className="d-flex align-items-center justify-content-between w-100"
        style={{ zIndex: 2 }}
      >
        <h6 className="games-popup-title mb-0">Details</h6>
        <img
          src={xMark}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={onClose}
        />
      </div>
      <ul
        className="d-flex flex-column gap-2 ms-3"
        style={{ listStyle: "inside", listStylePosition: "initial" }}
      >
        <li
          className="bundle-popup-list-item"
          style={{ listStyle: "inside", listStylePosition: "initial" }}
        >
          Once you lock the required DYP, a contact form will appear to initiate
          collaboration with our team.
        </li>
        <li
          className="bundle-popup-list-item"
          style={{ listStyle: "inside", listStylePosition: "initial" }}
        >
          The locked tokens can be withdrawn after the lock period ends.
        </li>
        <li
          className="bundle-popup-list-item"
          style={{ listStyle: "inside", listStylePosition: "initial" }}
        >
          Free support for builders is included in every plan, ensuring a smooth
          experience as we bring your vision to life.
        </li>
        <li
          className="bundle-popup-list-item"
          style={{ listStyle: "inside", listStylePosition: "initial" }}
        >
          Enjoy ongoing communication and regular updates throughout the
          development process to keep you fully involved.
        </li>
      </ul>
      <div className="d-flex align-items-center justify-content-start w-100">
        <Checkbox onChange={() => setTerms(!terms)} />
        <span className="bundle-tos">
          I agree to the{" "}
          <NavLink
            target="_blank"
            to={"/bundles-terms-of-service"}
            className="bundle-tos-green"
            style={{ color: "#3DBDA7", textDecoration: "underline" }}
          >
            Terms Of Service
          </NavLink>
        </span>
      </div>
      <div
        className="d-flex align-items-center w-100 justify-content-between pb-1"
        style={{ borderBottom: "2px solid rgba(192, 203, 247, 0.30)" }}
      >
        <span className="not-enough-dyp">Don’t have enough DYP?</span>
        <NavLink
          target="_blank"
          to={"/buydyp"}
          className="d-flex align-items-center gap-1"
        >
          <img src={getDypIcon} alt="" />
          <span className="bundle-get-dyp">Get DYP</span>
        </NavLink>
      </div>
      <div className="d-flex w-100 align-items-center justify-content-between">
        <span className="bundle-deposit-title">Deposit</span>
        <div className="d-flex align-items-center gap-1">
          <span className="bundle-my-balance-span">My Balance:</span>
          <span className="bundle-dyp-balance">25,250.52 DYP</span>
        </div>
      </div>
      <div className="bundle-amount-wrapper w-100 d-flex p-3 align-items-center justify-content-center flex-column ">
        <h6 className="mb-0 bundle-dyp-amount">250,000 DYP</h6>
        <span className="mb-0 bundle-usd-amount">$25,000</span>
      </div>
      <button
        className={`btn ${
          terms && buttonState !== "loading" ? "filledbtn" : "disabled-btn"
        } px-5 py-2`}
        disabled={!terms || buttonState === "loading"}
        style={{ fontSize: "14px" }}
        onClick={() => {
          buttonState === "approve" ? handleApprove() : handleDeposit();
        }}
      >
        {buttonState === "loading" ? (
          <div
            class="spinner-border spinner-border-sm text-light"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        ) : buttonState === "approve" ? (
          "Approve"
        ) : (
          "Deposit"
        )}
      </button>
    </div>
  );
};

export default BundlePopup;
