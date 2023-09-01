import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import useWindowSize from "../../functions/useWindowSize";
import { shortAddress } from "../../functions/shortAddress";
import modalBg from "./assets/modalBg.svg";
import closeX from "./assets/closeX.svg";
import eth from "./assets/eth.svg";
import bnb from "./assets/bnb.svg";
import avax from "./assets/avax.svg";
import loop from "./assets/loop.svg";
import greenDot from "./assets/greendot.svg";
import metamask from "./assets/metamask.png";
import "./_switchmodal.scss";

const SwitchChainModal = ({
  open,
  onclose,
  currentChain,
  targetChain,
  onSwitchChain,
  walletType,
  coinbase
}) => {
  const windowSize = useWindowSize();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    // windowSize.width > 1400 ? "25%" : windowSize.width > 786 ? "50%" : "90%",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    minHeight: 200,
    overflowX: "hidden",
    borderRadius: "10px",
    height: windowSize.width < 500 ? "480px" : "auto",
    background: `url(${modalBg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="d-flex flex-column justify-content-center position-relative">
          <img
            src={closeX}
            alt=""
            className="close-x position-relative cursor-pointer "
            onClick={() => {
              onclose();
            }}
            style={{ bottom: "17px", alignSelf: "end", width: 16, height: 16 }}
          />

          <div className="d-flex flex-column gap-3 align-items-center justify-content-between">
            <img src={eth} alt="" style={{ width: "40px", height: "40px" }} />
            <span className="switchchain-txt">Switch Network</span>
            <span className="switchchain-desc">
              We've detected that you're connected to BNB Chain.
            </span>
            <div className="walletinfo-wrapper p-3 w-100">
              <div className="d-flex align-items-center justify-content-between gap-2">
                <div className="d-flex align-items-center gap-2">
                  <img
                    alt=""
                    src={metamask}
                    style={{ width: "32px", height: "32px" }}
                  />
                  <div className="d-flex flex-column gap-1">
                    <span className="switchchain-wallettype">
                      {walletType} Wallet
                    </span>
                    <span className="switchchain-wallet">{shortAddress(coinbase)}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <img src={greenDot} alt="" />
                  <span className="switchchain-current-chain">{currentChain}</span>
                </div>
              </div>
            </div>
            <button className="btn filled-btn d-flex align-items-center gap-2">
              <img src={loop} alt /> Switch to Ethereum Network
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default SwitchChainModal;
