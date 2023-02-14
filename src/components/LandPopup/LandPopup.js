import React, { useEffect, useState } from "react";
import "./landpopup.css";
import landPopup from "./landPopup.webp";
import closePopup from "./closePopup.svg";
import OutsideClickHandler from "react-outside-click-handler";

const LandPopup = () => {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  setTimeout(() => {
    if (count === 0) {
      setActive(true);
      setCount(1);
    }
  }, 500);

  const popup = document.querySelector("#popup");
  const html = document.querySelector("html");

  useEffect(() => {
    if (active === true) {
      html.classList.add("hidescroll");
    } else {
      html.classList.remove("hidescroll");
    }
  }, [active]);

  return (
    <OutsideClickHandler onOutsideClick={() => setActive(false)}>
      <div
        id="popup"
        className={`popup-wrapper ${
          active && "popup-active"
        } p-3 d-flex flex-column gap-3 justify-content-center align-items-center`}
      >
        <div className="d-flex p-3 align-items-center justify-content-end w-100">
          <img
            src={closePopup}
            onClick={() => setActive(false)}
            alt="close"
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <h6 className="popup-title metaverse mb-0">
            Genesis Land NFT Launch
          </h6>
          <span className="popup-span mb-0">
          Become an original World of Dypians land owner by minting a Genesis Land NFT and gain early access to rewards and benefits
          </span>
        </div>
        <img src={landPopup} className="land-nft-image" alt="land nft" />
        <span className="popup-content">
          Total Genesis land supply limited to 1,000 plots
        </span>
        <a
          href="https://www.worldofdypians.com/land"
          target={"_blank"}
          onClick={() => setActive(false)}
        >
          <button
            className="btn filled-btn m-3"
            style={{ fontSize: "16px", padding: "12px 24px" }}
          >
            Explore more
          </button>
        </a>
      </div>
    </OutsideClickHandler>
  );
};

export default LandPopup;
