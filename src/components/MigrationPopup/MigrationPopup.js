import React, { useEffect, useState } from "react";
import "./migrationPopup.css";
import migrationBanner from "./migrationBanner.png";
import closePopup from "./closePopup.svg";
import OutsideClickHandler from "react-outside-click-handler";
import { NavLink } from "react-router-dom";

const MigrationPopup = () => {
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
        className={`migrate-popup-wrapper ${
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
          <h6 className="popup-title metaverse mb-2">
            DYP/iDYP migration is now Live
          </h6>
          <span className="popup-span mb-0">
          Easily migrate your DYP and iDYP tokens from Ethereum, BNB Chain, and Avalanche with premium rates available until the snapshot date.
          </span>
        </div>
        <img src={migrationBanner} className="land-nft-image" alt="land nft" />
        <span className="popup-content">
          Premium migration rates until February 23, 2026
        </span>
        <NavLink
          to="/migration-portal"
          onClick={() => setActive(false)}
        >
          <button
            className="btn filled-btn m-3"
            style={{ fontSize: "16px", padding: "12px 24px" }}
          >
            Migrate
          </button>
        </NavLink>
      </div>
    </OutsideClickHandler>
  );
};

export default MigrationPopup;
