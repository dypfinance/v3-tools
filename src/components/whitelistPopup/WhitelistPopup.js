import React, { useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import closeX from "../earnOther/assets/closeX.svg";
import Slider from "react-slick";
import migrationPopup from "./migrationPopup.webp";
import dypBaseBg from "./dypBaseBg.webp";
import "./whitelist.css";
import OutsideClickHandler from "react-outside-click-handler";
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
    transition: "all .25s ease-in-out",
  };

  const slider = useRef();

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
    fade: true,
  };
  return (
    // <OutsideClickHandler onOutsideClick={onClose}>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
          <div className="d-flex flex-column justify-content-center position-relative">
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
                    bottom: "-5px",
                    alignSelf: "end",
                    width: 23,
                    height: 23,
                  }}
                />
              </div>
              <Slider {...settings} ref={slider}>
                <div className="d-flex flex-column gap-3 justify-content-center align-items-center px-3">
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex align-items-center justify-content-center mb-2 popup-title-wrapper gap-2 p-2 px-4">
                      <h6 className="popup-title d-flex align-items-center gap-2 mb-0">
                        WOD Token
                      </h6>
                      <h6 className="popup-title metaverse mb-0">Whitelist</h6>
                    </div>
                    <span className="popup-span mb-0">
                      As part of the Dypius ecosystem, we’re enhancing our user
                      utilities with the upcoming WOD Token launch. Secure your
                      spot now as we are offering early access to the exclusive
                      WOD token sale through a Whitelist for our members.
                    </span>
                  </div>
                  <img
                    src={migrationPopup}
                    className="land-nft-image w-100"
                    alt="land nft"
                  />
                  {/* <span className="popup-content">
          Total Genesis land supply limited to 1,000 plots
        </span> */}
                  <NavLink
                    to="/launchpad"
                    // onClick={onClose}
                  >
                    <button className="btn filled-btn m-3">
                      Join the whitelist
                    </button>
                  </NavLink>
                </div>
                <div className="d-flex flex-column gap-3 justify-content-center align-items-center px-3">
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex align-items-center justify-content-center mb-2 popup-title-wrapper gap-2 p-2 px-4">
                      <h6 className="popup-title d-flex align-items-center gap-2 mb-0">
                        Dypius Expands to
                      </h6>
                      <h6 className="popup-title metaverse mb-0">Base</h6>
                    </div>
                    <span className="popup-span mb-0">
                      Seamlessly bridge DYP to Base via the official Base Super
                      Bridge
                    </span>
                  </div>
                  <img
                    src={dypBaseBg}
                    className="land-nft-image"
                    alt="land nft"
                  />
                  {/* <span className="popup-content">
          Total Genesis land supply limited to 1,000 plots
        </span> */}
                  <a
                    href="https://superbridge.app/base"
                    target={"_blank"}
                    onClick={onClose}
                  >
                    <button className="btn filled-btn m-3">
                      Bridge DYP on Base
                    </button>
                  </a>
                </div>
              </Slider>
            </div>
          </div>
        </Box>
      </Modal>
    // </OutsideClickHandler>
  );
};

export default WhitelistPopup;
