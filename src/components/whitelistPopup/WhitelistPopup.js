import React, { useRef } from "react";
import "./whitelist.css";
import OutsideClickHandler from "react-outside-click-handler";
import "../LandPopup/landpopup.css";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";
import Countdown from "react-countdown";

const renderer = ({ days, hours, minutes }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <div className="d-flex flex-column align-items-center justify-content-center unit">
        <h6 className="time-big-number">{days < 10 ? "0" + days : days}</h6>
        <h6 className="time-small-number">Days</h6>
      </div>
      <h6 className="timer-separator">:</h6>
      <div className="d-flex flex-column align-items-center justify-content-center unit">
        <h6 className="time-big-number">{hours < 10 ? "0" + hours : hours}</h6>
        <h6 className="time-small-number">Hours</h6>
      </div>
      <h6 className="timer-separator">:</h6>
      <div className="d-flex flex-column align-items-center justify-content-center unit">
        <h6 className="time-big-number">
          {minutes < 10 ? "0" + minutes : minutes}
        </h6>
        <h6 className="time-small-number">Minutes</h6>
      </div>
    </div>
  );
};

const WhitelistPopup = ({ open, onClose }) => {
  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 540,
    width: "100%",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    minHeight: 200,
    overflowX: "hidden",
    borderRadius: "10px",
    height: "auto",
    background: `#1A1A36`,
  };

  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const slider = useRef();
  let loyaltyCd = new Date("2025-01-08T12:59:59.000+02:00");
  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div id="popup" className={`popup-wrapper ${open && "popup-active"} p-3`}>
        <div style={style2}>
          <div
            className="d-flex align-items-center  justify-content-end gap-5 w-100 pt-3"
            style={{ height: 1 }}
          >
            <img
              src={"https://cdn.worldofdypians.com/wod/popupXmark.svg"}
              alt=""
              className="close-x position-relative cursor-pointer "
              onClick={onClose}
              style={{
                bottom: "-25px",
                alignSelf: "end",
                width: 23,
                height: 23,
                right: 20,
                zIndex: "1",
              }}
            />
          </div>
          <div className="d-flex py-3 flex-column justify-content-center position-relative align-items-center">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex align-items-center justify-content-center mb-2 popup-title-wrapper gap-2 p-2 px-4">
                <h6 className="popup-title d-flex align-items-center gap-2 mb-0">
                  DYP is available on SynFutures
                </h6>
              </div>
              {/* <span className="popup-span mb-0">
                  The deadline to migrate is January 8, 2025. After this,
                  migration will close permanently. Migrate your tokens today to
                  secure continued access and utility!
                </span> */}
            </div>
            <img
              src={"https://cdn.worldofdypians.com/tools/migrationPopup.webp"}
              className="land-nft-image basepopup"
              alt="land nft"
            />
            <span className="popup-content">
              You can now trade DYP/ETH with 10x leverage or provide liquidity
              to earn fees
            </span>

            <a
              href="https://oyster.synfutures.com/#/trade/base/ETH-DYP-EMG-Perpetual"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
            >
              <button className="btn filled-btn m-3">Explore</button>
            </a>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default WhitelistPopup;
