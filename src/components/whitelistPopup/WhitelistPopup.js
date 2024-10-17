import React, { useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import closeX from "../earnOther/assets/closeX.svg";
import migrationPopup from "./migrationPopup.webp";
import basebg from "./baseBg.png";

import loyaltyPopupBanner from "./loyaltyPopupBanner.png";
import "./whitelist.css";
import OutsideClickHandler from "react-outside-click-handler";
import '../LandPopup/landpopup.css'
import { NavLink } from "react-router-dom";

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

  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div id="popup" className={`popup-wrapper ${open && "popup-active"} p-3`}>
        <div style={style2}>
          <div className="d-flex py-3 flex-column justify-content-center position-relative">
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
                <img
                  src={basebg}
                  className="land-nft-image"
                  alt="land nft"
                />
                {/* <span className="popup-content">
          Total Genesis land supply limited to 1,000 plots
        </span> */}
                <NavLink
                  to="/games"
                  onClick={onClose}
                >
                  <button className="btn filled-btn m-3">Play</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default WhitelistPopup;
