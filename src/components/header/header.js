import "./header.css";
import getFormattedNumber from "../../functions/get-formatted-number";
import React, { useEffect, useState } from "react";
import coin from "./assets/coins.svg";
import avax from "./assets/avax.svg";
import bnb from "./assets/bnb.svg";
import eth from "./assets/eth.svg";
import dropdown from "./assets/dropdown.svg";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ellipse from "./assets/ellipse.svg";
import user from "./assets/user.svg";
import logoutimg from "./assets/logout.svg";
import walletIcon from "./assets/walletIcon.svg";
import { NavLink } from "react-router-dom";
import useWindowSize from "../../functions/useWindowSize";
import toolsLogo from "../../assets/sidebarIcons/toolsLogo.svg";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Header = ({
  toggleMobileSidebar,
  toggleTheme,
  theme,
  chainId,
  coinbase,
  logout,
  handleSwitchNetwork,
  showModal,
  show,
  hideModal,
  handleConnection,
  isConnected,
}) => {
  // const [chainId, setChainId] = useState(1)


  const windowSize = useWindowSize();

  const [avatar, setAvatar] = useState("../../assets/img/person.svg");
  const routeData = useLocation();

  return (
    <>
      <header className="header-wrap" style={{ zIndex: 5 }}>
        <div className="container-fluid d-flex justify-content-center justify-content-lg-start">
          <div className="row w-100">
            <div className="col-1"></div>
            <div
              className={`${
                windowSize.width < 786
                  ? "col-12"
                  : windowSize.width < 1490
                  ? "col-11"
                  : "col-10"
              }`}
            >
              <div
                className="container-lg px-0 d-flex justify-content-between gap-3 align-items-center w-100"
                // style={{ maxWidth: "calc(100% - 215px)"}}
              >
                {/* marginLeft: "240px" */}
                <div className="d-none d-lg-flex flex-column text-start">
                  <h4
                    className="text-white"
                    style={{ fontSize: "23px", fontWeight: "600" }}
                  >
                    Good afternoon, Dypian
                  </h4>
                  <span className="text-white headerdesc">
                  Discover the latest trends, breaking news, and gain access 
                  to powerful dApps.
                  </span>
                </div>
                <a href="https://app.dypius.com" >
                  <img src={toolsLogo} className="d-flex d-lg-none" alt="" />
                </a>
                <div className="d-flex m-0 justify-content-between gap-3 align-items-center">
                  <a href="https://app.dypius.com/buydyp" className="buydyp-btn btn" >
                    <img src={coin} alt="" />
                    <span className="buy-dyp-text"> Buy DYP </span>
                  </a>
                  <div className="d-flex justify-content-between gap-3 align-items-center">
                    {/* <DropdownButton
                id="dropdown-basic-button2"
                onClick={checklogout === "true" && showModal}
                title={
                  <span className="dropdown-title walletaccount">
                    {checklogout === "false" && (
                      <img
                        src={avatar}
                        style={{
                          height: 18,
                          borderRadius: "50%",
                          border: "1px solid #00D849",
                        }}
                        alt=""
                      />
                    )}
                    {checklogout === "false" ? (
                      shortAddress(coinbase)
                    ) : (
                      <span className="d-flex align-items-center gap-2 connecttitle position-relative" style={{bottom: '5px'}}>
                        <img
                          src={walletIcon}
                          alt=""
                          className="position-relative"
                          // style={{ top: 4 }}
                        />
                        Connect Wallet
                      </span>
                    )}
                    {checklogout === "false" && <img src={dropdown} alt="" />}
                  </span>
                }
              >
                <Dropdown.Item
                  onClick={() => window.location.assign("/account")}
                >
                  <img src={user} alt="" />
                  Your account
                </Dropdown.Item>
                {checklogout === "false" && (
                  <Dropdown.Item onClick={() => logout()}>
                    <img src={logoutimg} alt="" />
                    Disconnect wallet
                  </Dropdown.Item>
                )}
              </DropdownButton> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </header>

    </>
  );
};

export default Header;
    