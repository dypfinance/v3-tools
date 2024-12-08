import React, { useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import closeX from "../earnOther/assets/closeX.svg";
import migrationPopup from "./migrationPopup.webp";
import basebg from "./baseBg.png";

import loyaltyPopupBanner from "./loyaltyPopupBanner.png";
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
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: false,
    autoplaySpeed: 4000,
  };

  const slider = useRef();
  let loyaltyCd = new Date("2025-01-08T12:59:59.000+02:00");
  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div id="popup" className={`popup-wrapper ${open && "popup-active"} p-3`}>
        <div style={style2}>
          <Slider {...settings} ref={slider}>
            <div className="d-flex py-3 flex-column justify-content-center position-relative align-items-center">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center mb-2 popup-title-wrapper gap-2 p-2 px-4">
                  <h6 className="popup-title metaverse mb-0">Final Call:</h6>
                  <h6 className="popup-title d-flex align-items-center gap-2 mb-0">
                    Migrate to DYP v2
                  </h6>
                </div>
                <span className="popup-span mb-0">
                  The deadline to migrate is January 8, 2025. After this,
                  migration will close permanently. Migrate your tokens today to
                  secure continued access and utility!
                </span>
              </div>
              <img
                src={migrationPopup}
                className="land-nft-image basepopup"
                alt="land nft"
              />
              <Countdown
                renderer={renderer}
                date={loyaltyCd}
                // onComplete={() => {
                //   setisExpired(true);
                // }}
              />

              <NavLink to="/migration" onClick={onClose}>
                <button className="btn filled-btn m-3">Migrate</button>
              </NavLink>
            </div>

            <div className="d-flex py-3 flex-column justify-content-center position-relative align-items-center">
              <div className="d-flex flex-column gap-3 align-items-center justify-content-between">
                <div
                  className="d-flex align-items-center  justify-content-end gap-5 w-100"
                  style={{ height: 1 }}
                >
                  <img
                    src={closeX}
                    alt=""
                    className="close-x position-relative cursor-pointer "
                    onClick={onClose}
                    style={{
                      bottom: "-25px",
                      alignSelf: "end",
                      width: 23,
                      height: 23,
                      right: 20,
                    }}
                  />
                </div>

                <div className="d-flex flex-column gap-3 justify-content-center align-items-center px-3">
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex align-items-center justify-content-center mb-2 popup-title-wrapper gap-2 p-2 px-4">
                      <h6 className="popup-title d-flex align-items-center gap-2 mb-0">
                        Games on
                      </h6>
                      <h6 className="popup-title metaverse mb-0">Base</h6>
                    </div>
                    <span className="popup-span mb-0 w-100">
                      Enjoy the ultimate gaming experience on Base.
                    </span>
                  </div>
                  <img src={basebg} className="land-nft-image" alt="land nft" />
                  {/* <span className="popup-content">
          Total Genesis land supply limited to 1,000 plots
        </span> */}
                  <NavLink to="/games" onClick={onClose}>
                    <button className="btn filled-btn m-3">Play</button>
                  </NavLink>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default WhitelistPopup;
