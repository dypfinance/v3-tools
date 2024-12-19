import React from "react";  

const StoneCrackPopup = ({ active, onClose }) => {
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
        <h6 className="games-popup-title mb-0">Stone Crack</h6>
        <img
          src={'https://cdn.worldofdypians.com/wod/xMark.svg'}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={onClose}
        />
      </div>
     <div className="games-popup-scroll-wrapper d-flex flex-column gap-3">
     <p className="games-popup-desc mb-0">
        In this exciting game, your goal is to break open the massive gem by
        hitting the stone 20 times using different pickaxes. Each pickaxe
        requires an on-chain transaction on either the Base Network or opBNB Chain, and every
        transaction incurs gas fees, payable in ETH or BNB and DYP v2.
      </p>
      <div className="d-flex w-100 align-items-start">
        <h6 className="games-popup-subtitle text-start mb-0">How to Play?</h6>
      </div>
      <p className="games-popup-desc mb-0">
        The stone is divided into 20 parts, and your objective is to break them
        all using a pickaxe. Each pickaxe you use breaks one part of the stone
        and requires an on-chain transaction on the Base network. After 19 hits,
        you’ll need to use a final pickaxe to break open the gem.
      </p>
      <p className="games-popup-desc mb-0">
        Every hit earns you points, which contribute to your rank on the Weekly
        and Monthly leaderboards. Additionally, each hit offers direct rewards
        in ETH/BNB and DYP v2. Rewards follow a probability-based system, where
        smaller rewards are more likely to be acquired, while higher-value
        rewards are rarer. This system adds a layer of unpredictability and
        excitement, rewarding daily play with increased chances of earning more
        valuable prizes. The game resets at 00:00 UTC every day.
      </p>
      <div className="games-popup-image-wrapper p-2 d-flex flex-column flex-lg-row align-items-center gap-2">
        <div className="d-flex flex-column align-items-center gap-2">
          <span className="games-popup-desc">Stone</span>
          <img src={'https://cdn.worldofdypians.com/tools/stone.png'} alt="" />
        </div>
        <div className="d-flex flex-column align-items-center gap-2">
          <span className="games-popup-desc">Broken Gem</span>
          <img src={'https://cdn.worldofdypians.com/tools/brokenGem.png'} alt="" />
        </div>
      </div>
      <div className="games-popup-danger-wrapper p-2 d-flex flex-column gap-2">
        <div className="d-flex align-items-center gap-2">
          <img src={"https://cdn.worldofdypians.com/tools/danger.svg"} alt="" />
          <h6
            className="mb-0 games-popup-subtitle"
            style={{ color: "#FD5D5D" }}
          >
            No Action Sign - No Action Possible
          </h6>
        </div>
        <p className="games-popup-desc mb-0">
          Some of the rewards might not be allocated because you do not fulfill
          certain requirements, which will be shown when you use a pickaxe. This
          does not require any action, as the reward will not be allocated.
        </p>
      </div>
      <p className="games-popup-desc mb-0">
        All rewards earned will be distributed weekly every Monday and monthly
        at the beginning of each month.
      </p>
      <div className="d-flex w-100 align-items-start">
        <p className="games-popup-desc mb-0">
          Keep playing daily to increase your chances of claiming valuable
          rewards!
        </p>
      </div>
     </div>
    </div>
  );
};

export default StoneCrackPopup;
