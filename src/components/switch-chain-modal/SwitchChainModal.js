import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import useWindowSize from "../../functions/useWindowSize";
import modalBg from "./assets/modalBg.svg";

const SwitchChainModal = ({ open, onclose }) => {
  const windowSize = useWindowSize();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width:
      windowSize.width > 1400 ? "30%" : windowSize.width > 786 ? "50%" : "90%",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    minHeight: 200,
    overflowX: "hidden",
    borderRadius: "10px",
    background: `${url(modalBg)}`,
    height: windowSize.width < 500 ? "480px" : "auto",
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>test</Box>
    </Modal>
  );
};

export default SwitchChainModal;
