import React from "react";
import cawsAdventure from "../assets/popupAssets/cawsAdventure.png";

const CawsAdventurePopup = ({ active, onClose }) => {
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
        <h6 className="games-popup-title mb-0">CAWS Adventure</h6>
        <img
          src={require("../assets/xMark.svg").default}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={onClose}
        />
      </div>
    <div className="games-popup-scroll-wrapper d-flex flex-column gap-3">
    <p className="games-popup-desc mb-0">
        Play as a unique CAWS NFT-inspired character and experience the thrill
        of unlocking all 10 exciting levels. Exclusive to CAWS NFT holders, this
        adventure lets you compete against others to see who can unlock the game
        the fastest. Climb the weekly leaderboard for a chance to show off your
        skills and claim top spots!
      </p>
      <div className="d-flex w-100 align-items-start">
        <h6 className="games-popup-subtitle text-start mb-0">How to Play?</h6>
      </div>
      <p className="games-popup-desc mb-0">
        To play CAWS Adventure, you must be a holder of a CAWS NFT. Once you
        have your NFT, select your avatar and begin the adventure. The game
        features 20 levels, each designed to challenge your skills and reflexes.
      </p>
      <p className="games-popup-desc mb-0">
        The goal is to complete all levels as quickly as possible. The faster
        you finish, the better your rank will be. Players with the shortest
        completion times will top the leaderboard and win exciting rewards.
      </p>
      <div className="games-popup-image-wrapper p-2 d-flex  align-items-center justify-content-between gap-2">
        <img src={cawsAdventure} className="w-100" alt="" />
      </div>
     <div className="d-flex w-100 justify-content-center">
     <a href="https://game.dypius.com/" target="_blank" rel="noreferrer" className="btn filled-btn" style={{width: "fit-content"}}>Play</a>
     </div>
    </div>
    </div>
  );
};

export default CawsAdventurePopup;
