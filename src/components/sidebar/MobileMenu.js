import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";

const MobileMenu = () => {
  const [activeIcon, setActiveIcon] = useState("");
  const [explorerModal, setExplorerModal] = useState(false);
  const [moreModal, setMoreModal] = useState(false);
  const [earnModal, setEarnModal] = useState(false);

  const location = useLocation();

  const html = document.querySelector("html");
  const explorer = document.querySelector("#explorerModal");
  const more = document.querySelector("#moreModal");
  const earn = document.querySelector("#earnModal");

  const mobile = document.querySelector("#mobileMenu");

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveIcon("");
    }

    if (explorerModal === true || moreModal === true || earnModal === true) {
      html.classList.add("hidescroll");
      explorer.classList.add("modal-pointer-events");
      mobile.classList.add("modal-pointer-events");
      more.classList.add("modal-pointer-events");
      earn.classList.add("modal-pointer-events");
    } else {
      html.classList.remove("hidescroll");
    }
  }, [explorerModal, moreModal, location, earnModal]);

  return (
    <div
      className="container-fluid mobile-sidebar justify-content-center align-items-center d-flex d-lg-none"
      id="mobileMenu"
      onClick={() => {
        explorerModal === true && setExplorerModal(false);
        moreModal === true && setMoreModal(false);
        earnModal === true && setEarnModal(false);
      }}
    >
      <div className="row w-100">
        <NavLink
          to="/migration-portal"
          className="col"
          onClick={() => setActiveIcon("migration")}
        >
          <div
            className={`d-flex align-items-center sidebar-item ${
              activeIcon === "migration" && "active-side-link"
            } p-2 justify-content-center`}
          >
            <img
              src={
                activeIcon === "migration"
                  ? "https://cdn.worldofdypians.com/tools/swapIconActive.svg"
                  : "https://cdn.worldofdypians.com/tools/swapIcon.svg"
              }
              width={25}
              height={25}
              alt=""
            />
            {/* <h3 className={`active-text ${activeIcon === 'governance' ? 'd-flex' : 'd-none'}`}>Governance</h3> */}
          </div>
        </NavLink>
        <div
          // to="/earn/dypius"
          className="col"
          onClick={() => {
            setActiveIcon("earn");
            setEarnModal(true);
          }}
        >
          <div
            className={`d-flex align-items-center sidebar-item ${
              activeIcon === "earn" && "active-side-link"
            } p-2 justify-content-center`}
          >
            <img
              src={
                activeIcon === "earn"
                  ? "https://cdn.worldofdypians.com/tools/earnIconActive.svg"
                  : "https://cdn.worldofdypians.com/tools/earnIcon.svg"
              }
              width={25}
              height={25}
              alt=""
            />
            {/* <h3 className={`active-text ${activeIcon === 'earn' ? 'd-flex' : 'd-none'}`}>Earn</h3> */}
          </div>
        </div>
        <NavLink
          to="/governance"
          className="col"
          onClick={() => setActiveIcon("governance")}
        >
          <div
            className={`d-flex align-items-center sidebar-item ${
              activeIcon === "governance" && "active-side-link"
            } p-2 justify-content-center`}
          >
            <img
              src={
                activeIcon === "governance"
                  ? "https://cdn.worldofdypians.com/tools/governanceIconActive.svg"
                  : "https://cdn.worldofdypians.com/tools/governanceIcon.svg"
              }
              width={25}
              height={25}
              alt=""
            />
            {/* <h3 className={`active-text ${activeIcon === 'governance' ? 'd-flex' : 'd-none'}`}>Governance</h3> */}
          </div>
        </NavLink>
        <NavLink
          to="/bridge"
          className="col"
          onClick={() => setActiveIcon("bridge")}
        >
          <div
            className={`d-flex align-items-center sidebar-item ${
              activeIcon === "bridge" && "active-side-link"
            } p-2 justify-content-center`}
          >
            <img
              src={
                activeIcon === "bridge"
                  ? "https://cdn.worldofdypians.com/tools/bridgeIconActive.svg"
                  : "https://cdn.worldofdypians.com/tools/bridgeIcon.svg"
              }
              width={25}
              height={25}
              alt=""
            />
            {/* <h3 className={`active-text ${activeIcon === 'bridge' ? 'd-flex' : 'd-none'}`}>Bridge</h3> */}
          </div>
        </NavLink>
        <NavLink
          to="/games"
          className="col"
          onClick={() => setActiveIcon("games")}
        >
          <div
            className={`d-flex align-items-center sidebar-item ${
              activeIcon === "yields" && "active-side-link"
            } p-2 justify-content-center`}
          >
            <img
              src={
                activeIcon === "games"
                  ? "https://cdn.worldofdypians.com/tools/gamesIconActive.svg"
                  : "https://cdn.worldofdypians.com/tools/gamesIcon.svg"
              }
              width={25}
              height={25}
              alt=""
            />
            {/* <h3 className={`active-text ${activeIcon === 'bridge' ? 'd-flex' : 'd-none'}`}>Bridge</h3> */}
          </div>
        </NavLink>
        {/* <div
          className="col"
          onClick={() => {
            setActiveIcon("explorer");
            setExplorerModal(!explorerModal);
          }}
        >
          <div
            className={`d-flex align-items-center sidebar-item ${
              activeIcon === "explorer" && "active-side-link"
            } p-2 justify-content-center`}
          >
            <img
              src={
                activeIcon === "explorer" ? explorerIconActive : explorerIcon
              }
              width={25}
              height={25}
              alt=""
            />
          </div>
        </div> */}
        <div
          className="col"
          onClick={() => {
            setActiveIcon("more");
            setMoreModal(!moreModal);
          }}
        >
          <div
            className={`d-flex align-items-center sidebar-item ${
              activeIcon === "more" && "active-side-link"
            } p-2 justify-content-center`}
          >
            <img
              src={
                activeIcon === "more"
                  ? "https://cdn.worldofdypians.com/tools/moreIconActive.svg"
                  : "https://cdn.worldofdypians.com/tools/moreIcon.svg"
              }
              width={25}
              height={25}
              alt=""
            />
            {/* <h3 className={`active-text ${activeIcon === 'more' ? 'd-flex' : 'd-none'}`}>More</h3> */}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "5%", width: "100%" }}>
        <OutsideClickHandler onOutsideClick={() => setExplorerModal(false)}>
          <div
            className={`explorer-modal ${
              explorerModal && "explorer-modal-active"
            } d-flex flex-column gap-2  p-3`}
            id="explorerModal"
          >
            <div
              className="d-flex w-100 justify-content-end py-3"
              onClick={() => setExplorerModal(false)}
            >
              <img
                src={"https://cdn.worldofdypians.com/wod/xMark.svg"}
                alt=""
              />
            </div>
            <NavLink
              to="/pair-explorer"
              onClick={() => setExplorerModal(false)}
              className="mobile-modal-item d-flex justify-content-between align-items-center w-100 py-3"
            >
              <h3 className="sideitem-text">Pair Explorer</h3>
              <img
                src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                alt=""
              />
            </NavLink>
            <NavLink
              to="/pool-explorer"
              onClick={() => setExplorerModal(false)}
              className="mobile-modal-item d-flex justify-content-between align-items-center w-100 py-3"
            >
              <h3 className="sideitem-text">Pool explorer</h3>
              <img
                src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                alt=""
              />
            </NavLink>
            <NavLink
              to="/big-swap-explorer"
              onClick={() => setExplorerModal(false)}
              className="mobile-modal-item d-flex justify-content-between align-items-center w-100 py-3"
            >
              <h3 className="sideitem-text">Big swap</h3>
              <img
                src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                alt=""
              />
            </NavLink>
            <NavLink
              to="/top-tokens"
              onClick={() => setExplorerModal(false)}
              className="mobile-modal-item d-flex justify-content-between align-items-center w-100 py-3"
            >
              <h3 className="sideitem-text">Top tokens</h3>
              <img
                src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                alt=""
              />
            </NavLink>
            <NavLink
              to="/farms"
              onClick={() => setExplorerModal(false)}
              className="mobile-modal-item d-flex justify-content-between align-items-center w-100 py-3"
            >
              <h3 className="sideitem-text">Yields</h3>
              <img
                src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                alt=""
              />
            </NavLink>
            <NavLink
              to="/submit-info"
              onClick={() => setExplorerModal(false)}
              className="mobile-modal-item d-flex justify-content-between align-items-center w-100 py-3"
            >
              <h3 className="sideitem-text">Submit form</h3>
              <img
                src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                alt=""
              />
            </NavLink>
          </div>
        </OutsideClickHandler>
      </div>

      <div style={{ position: "absolute", left: "5%", width: "100%" }}>
        <OutsideClickHandler onOutsideClick={() => setEarnModal(false)}>
          <div
            className={`explorer-modal ${
              earnModal && "explorer-modal-active"
            } d-flex flex-column gap-2 p-3`}
            id="earnModal"
          >
            <div
              className="d-flex w-100 justify-content-end"
              onClick={() => setEarnModal(false)}
            >
              <img
                src={"https://cdn.worldofdypians.com/wod/xMark.svg"}
                alt=""
              />
            </div>
            <div className="sidebar-item active-side-link w-100 p-3">
              <div className="d-flex align-items-center gap-2">
                <h3 className="active-text">Earn</h3>
              </div>
            </div>
            <div
              onClick={() => setMoreModal(false)}
              className="mobile-modal-item d-flex flex-column justify-content-between align-items-center w-100 pb-3"
            >
              {/* <NavLink
                to="/earn/defi-staking"
                className="d-flex justify-content-between align-items-center w-100 py-2"
              >
                <h3 className="sideitem-text">Staking</h3>
                <img src={'https://cdn.worldofdypians.com/tools/rightlogo.svg'} alt="" />
              </NavLink> */}
              <NavLink
                to="/earn/dypius"
                className="d-flex justify-content-between align-items-center w-100 py-2"
              >
                <h3 className="sideitem-text">Staking</h3>
                <img
                  src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                  alt=""
                />
              </NavLink>

              <NavLink
                to="/earn/nft-staking"
                className="d-flex justify-content-between align-items-center w-100 py-2"
              >
                <h3 className="sideitem-text">NFT Staking</h3>
                <img
                  src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                  alt=""
                />
              </NavLink>
            </div>
          </div>
        </OutsideClickHandler>
      </div>

      <div style={{ position: "absolute", left: "5%", width: "100%" }}>
        <OutsideClickHandler onOutsideClick={() => setMoreModal(false)}>
          <div
            className={`explorer-modal ${
              moreModal && "explorer-modal-active"
            } d-flex flex-column gap-2 p-3`}
            id="moreModal"
          >
            <div
              className="d-flex w-100 justify-content-end"
              onClick={() => setMoreModal(false)}
            >
              <img
                src={"https://cdn.worldofdypians.com/wod/xMark.svg"}
                alt=""
              />
            </div>
            <div className="sidebar-item active-side-link w-100 p-3">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={
                    "https://cdn.worldofdypians.com/tools/projectsIconActive.svg"
                  }
                  alt=""
                />
                <h3 className="active-text">Projects</h3>
              </div>
            </div>
            <div
              onClick={() => setMoreModal(false)}
              className="mobile-modal-item d-flex flex-column justify-content-between align-items-center w-100 pb-3"
            >
              <NavLink
                to="/accelerator-program"
                className="d-flex justify-content-between align-items-center w-100 py-2"
              >
                <h3 className="sideitem-text">Accelerator Program</h3>
                <img
                  src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                  alt=""
                />
              </NavLink>
              <NavLink
                to="/launchpad"
                className="d-flex justify-content-between align-items-center w-100 py-2"
              >
                <h3 className="sideitem-text">Launchpad</h3>
                <img
                  src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                  alt=""
                />
              </NavLink>
             
              <NavLink
                to="/farms"
                className="d-flex justify-content-between align-items-center w-100 py-2"
              >
                <h3 className="sideitem-text">Yields</h3>
                <img
                  src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                  alt=""
                />
              </NavLink>
            </div>

            <NavLink
              to="/news"
              onClick={() => setMoreModal(false)}
              className="mobile-modal-item d-flex justify-content-between align-items-center w-100 py-3"
            >
              <div className="d-flex align-items-center gap-2">
                <img
                  src={"https://cdn.worldofdypians.com/tools/newsIcon.svg"}
                  alt=""
                />
                <h3 className="sideitem-text">News</h3>
              </div>
              <img
                src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
                alt=""
              />
            </NavLink>
          </div>
        </OutsideClickHandler>
      </div>
    </div>
  );
};

export default MobileMenu;
