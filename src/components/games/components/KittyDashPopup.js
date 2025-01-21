import React from "react";

import { BrowserView, MobileView } from "react-device-detect";

const KittyDashPopup = ({ active, onClose }) => {
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
        <h6 className="games-popup-title mb-0">Kitty Dash</h6>
        <img
          src={"https://cdn.worldofdypians.com/wod/xMark.svg"}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={onClose}
        />
      </div>
      <div className="games-popup-scroll-wrapper d-flex flex-column gap-3">
        <p className="games-popup-desc mb-0">
          Run as fast as you can with your adorable cat and aim to achieve the
          highest score. Compete in exciting weekly competitions for a chance to
          earn amazing rewards. The more you dash, the better your chances of
          climbing the leaderboards and claiming top prizes!
        </p>
        <div className="d-flex w-100 align-items-start">
          <h6 className="games-popup-subtitle text-start mb-0">How to Play?</h6>
        </div>
        <p className="games-popup-desc mb-0">
          In Kitty Dash, your goal is to run as fast as you can with your
          adorable cat while collecting coins and avoiding obstacles. The game
          is simple: swipe left or right to change lanes, swipe up to jump, and
          swipe down to slide. The longer you run, the higher your score climbs.
        </p>
        <p className="games-popup-desc mb-0">
          As you dash, collect coins that can be used in the shop to purchase
          items and companions that can boost your performance. Weekly
          competitions allow you to compete for top spots on the leaderboards
          and earn exciting rewards. The more you play, the better your chances
          of climbing the ranks and claiming top prizes!
        </p>
        <div className="games-popup-image-wrapper p-2 d-flex  align-items-center justify-content-between gap-2">
          <img
            src={"https://cdn.worldofdypians.com/tools/kittyDash1.png"}
            style={{ width: "32%" }}
            alt=""
          />
          <img
            src={"https://cdn.worldofdypians.com/tools/kittyDash2.png"}
            style={{ width: "32%" }}
            alt=""
          />
          <img
            src={"https://cdn.worldofdypians.com/tools/kittyDash3.png"}
            style={{ width: "32%" }}
            alt=""
          />
        </div>
        <div className="d-flex w-100 justify-content-center">
          <BrowserView>
            <button className={`btn disabled-btn `} disabled={true}>
              Download Mobile App
            </button>
          </BrowserView>
          <MobileView>
            <a
              href="https://drive.google.com/file/d/1EArSD0-cSIx4M48fFaOflFHMGoKIguR9/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className={`btn filledbtn `}
            >
              Download Mobile App
            </a>
          </MobileView>
        </div>
      </div>
    </div>
  );
};

export default KittyDashPopup;
