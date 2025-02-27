import React, { useState, useEffect } from "react";
import xMark from "./assets/xMark.svg";
import dyp from "./assets/dyp.svg";
import eth from "./assets/eth.svg";
import "./pricingpackages.css";
import Countdown from "react-countdown";
import getFormattedNumber from "../../functions/get-formatted-number";

const renderer = ({ days, hours, minutes }) => {
  // Render a countdown
  return (
    <div className="d-flex align-items-center gap-2">
      <span className="unlock-timer">{days} days</span>
      <span className="unlock-timer">{hours} hours</span>
      <span className="unlock-timer">{minutes} minutes</span>
    </div>
  );
};

const UnlockPopup = ({
  active,
  onClose,
  cliffTime,
  onTimerFinished,
  canUnlock,
  pendingTokens,
  userClaimedTokens,
  totalVestedTokens,
  handleUnlock,
  unlockStatus,
  unlockLoading,
  isConnected,
  chainId,
  handleSwitchNetwork,
  onConnectWallet,
}) => {
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  const [timerFinished, setTimerFinished] = useState(false);
  const today = new Date();

  useEffect(() => {
    if (today.getTime() > cliffTime) {
      setTimerFinished(true);
      onTimerFinished(true);
    } else if (Number(userClaimedTokens) === 0) {
      setTimerFinished(true);
    }
  }, [userClaimedTokens, cliffTime]);

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
        <h6 className="games-popup-title mb-0">Unlock</h6>
        <img
          src={xMark}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={onClose}
        />
      </div>
      <p className="bundle-popup-list-item">
        Once you lock the required DYP, a contact form will appear to initiate
        collaboration with our team.
      </p>
      <div
        className="d-flex flex-column gap-2 w-100 pb-2"
        style={{ borderBottom: "1px solid #3B3C68" }}
      >
        <span className="unlock-timer-span">Timer</span>
        {cliffTime > 0 ? (
          <Countdown
            date={cliffTime}
            onComplete={() => setTimerFinished(true)}
            renderer={renderer}
          />
        ) : (
          <div className="d-flex align-items-center gap-2">
            <span className="unlock-timer">0 days</span>
            <span className="unlock-timer">0 hours</span>
            <span className="unlock-timer">0 min</span>
          </div>
        )}
      </div>
      <div className="unlock-bundle-wrapper d-flex flex-column w-100">
        <div className="unlock-bundle-wrapper-inner d-flex align-items-center justify-content-between ">
          <div className="unlock-dyp-wrapper d-flex align-items-center gap-2 p-3">
            <img src={dyp} width={32} height={32} alt="" />
            <span className="unlock-dyp">DYP</span>
          </div>
          <div className="unlock-eth-wrapper d-flex flex-column  p-3">
            <span className="unlock-network">Network</span>
            <div className="d-flex align-items-center gap-2">
              <img src={eth} width={20} height={20} alt="" />
              <span className="unlock-eth">Ethereum</span>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-0 align-items-lg-center justify-content-between w-100 px-3 py-4">
          <span className="bundle-dyp-available-span">Available to Claim</span>
          <h6 className="mb-0 bundle-dyp-available">
            {getFormattedNumber(pendingTokens)} DYP
          </h6>
        </div>
        <div className="unlock-bundle-wrapper-inner bundle-wrapper-grid p-3">
          <div className="d-flex flex-column align-items-center">
            <span className="lock-dyp-stat">
              {" "}
              {getFormattedNumber(totalVestedTokens)}
            </span>
            <span className="lock-dyp-stat-span">Total DYP</span>
          </div>
          <div className="d-flex flex-column align-items-center">
            <span className="lock-dyp-stat">
              {getFormattedNumber(userClaimedTokens, 2)}
            </span>
            <span className="lock-dyp-stat-span">DYP Withdrew</span>
          </div>
          <div className="d-flex flex-column align-items-center">
            <span className="lock-dyp-stat">
              {getFormattedNumber(totalVestedTokens - userClaimedTokens)}
            </span>
            <span className="lock-dyp-stat-span">DYP Remaining</span>
          </div>
        </div>
      </div>

      {!isConnected && (
        <button className="connectbtn w-100 py-2" onClick={onConnectWallet}>
          Connect Wallet
        </button>
      )}
      {isConnected && chainId !== 1 && (
        <button
          className="fail-button w-100 py-2"
          onClick={handleSwitchNetwork}
        >
          Switch to Ethereum
        </button>
      )}
      {isConnected && chainId === 1 && (
        <button
          className={`py-2 ${
            ((unlockStatus === "claimed" || unlockStatus === "initial") &&
              Number(pendingTokens) === 0) ||
            canUnlock === false ||
            timerFinished === false
              ? "disabled-btn"
              : unlockStatus === "failed"
              ? "fail-button"
              : unlockStatus === "success"
              ? "success-button"
              : "filledbtn"
          }`}
          disabled={
            canUnlock === false ||
            timerFinished === false ||
            Number(pendingTokens) === 0
              ? true
              : false
          }
          onClick={handleUnlock}
        >
          {unlockLoading ? (
            <div
              class="spinner-border spinner-border-sm text-light"
              role="status"
            ></div>
          ) : unlockStatus === "failed" ? (
            <>Failed</>
          ) : unlockStatus === "success" ? (
            <>Success</>
          ) : (
            <>Unlock</>
          )}
        </button>
      )}
    </div>
  );
};

export default UnlockPopup;
