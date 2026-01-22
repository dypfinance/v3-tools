import { NavLink, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useWindowSize from "../../functions/useWindowSize";
import "./sidebar.css";

const Sidebar = (props) => {
  const [activeLink, setActiveLink] = useState(null);
  const [hover, setHover] = useState(null);
  const [activePath, setactivePath] = useState(null);

  const [activeSidebar, setActiveSidebar] = useState(false);

  const windowSize = useWindowSize();
  const location = useLocation();

  const openSidebar = () => {
    if (windowSize.width < 1800) {
      setActiveSidebar(true);
    } else if (windowSize.width > 1800) {
      setActiveSidebar(true);
    }
  };

  const closeSidebar = () => {
    if (windowSize.width < 1800) {
      setActiveSidebar(false);
    } else if (windowSize.width > 1800) {
      setActiveSidebar(true);
    }
  };

  const sidebar = document.querySelector(".testbar");

  sidebar?.addEventListener("mouseover", openSidebar);
  sidebar?.addEventListener("mouseleave", closeSidebar);

  useEffect(() => {
    // const fetchInterval = setInterval(
    //   () => setlocation(window.location.pathname),
    //   1000
    // );
    if (windowSize.width > 1800) {
      setActiveSidebar(true);
    } else if (windowSize.width < 1800) {
      setActiveSidebar(false);
    }
  }, [windowSize]);

  const sidebarItems = [
    {
      label: "Migration Portal",
      icon: "swapIcon",
      link: "/migration-portal",
    },
    {
      label: "Earn",
      icon: "earnIcon",
      link: "/earn",
      children: [
        // {
        //   title: "Staking",
        //   link: "/earn/defi-staking",
        // },
        {
          title: "Staking",
          link: "/earn/dypius",
        },

        {
          title: "NFT Staking",
          link: "/earn/nft-staking",
        },
      ],
    },
    {
      label: "Growth",
      icon: "launchpadIcon",
      link: "/accelerator-program",
      children: [
        // {
        //   title: "Staking",
        //   link: "/earn/defi-staking",
        // },
        {
          title: "Accelerator",
          link: "/accelerator-program",
        },

        {
          title: "Launchpad",
          link: "/launchpad",
        },
        {
          title: "DYP Locker",
          link: "/locker",
        },
      ],
    },

    {
      label: "Games",
      icon: "gamesIcon",
      link: "/games",
    },
    {
      label: "Loyalty",
      icon: "loyaltyIcon",
      link: "/loyalty-program",
    },

    {
      label: "Governance",
      icon: "governanceIcon",
      link: "/governance",
    },

    {
      label: "Bridge",
      icon: "bridgeIcon",
      link: "/bridge",
    },

    {
      label: "Yields",
      icon: "yieldsIcon",
      link: "/farms",
      // children: [
      //   {
      //     title: "Pair explorer",
      //     link: "/pair-explorer",
      //   },
      //   {
      //     title: "Pool explorer",
      //     link: "/pool-explorer",
      //   },
      //   {
      //     title: "Big Swap",
      //     link: "/big-swap-explorer",
      //   },
      //   {
      //     title: "Top Tokens",
      //     link: "/top-tokens",
      //   },
      //   {
      //     title: "Yields",
      //     link: "/farms",
      //   },
      //   {
      //     title: "Submit Form",
      //     link: "/submit-info",
      //   },
      // ],
    },

    // {
    //   label: "Projects",
    //   icon: "projectsIcon",
    //   children: [
    //     {
    //       title: "Launchpad",
    //       link: "/launchpad",
    //     },
    //     {
    //       title: "DYP Locker",
    //       link: "/locker",
    //     },
    //   ],
    // },
    // {
    //   label: "Swap",
    //   icon: "swapIcon",
    //   link: "/swap",
    // },
    {
      label: "News",
      icon: "newsIcon",
      link: "/news",
    },
  ];

  // const sidebarItem = document.querySelectorAll(".sidebar-item");

  const windowUrl = window.location.href;

  useEffect(() => {
    setactivePath(location.pathname);
  }, [location?.pathname]);

  return (
    <div
      id="sidebar"
      style={{
        padding: props.showRibbon === true ? "70px 0 2.5rem 0px" : "2.5rem 0",
      }}
      className={`testbar ${
        activeSidebar ? "testbar-open" : null
      } d-none d-lg-flex flex-column gap-3 justify-content-between align-items-start`}
    >
      <img
        src={"https://cdn.worldofdypians.com/tools/navRadius.svg"}
        className={`nav-radius ${activeSidebar && "nav-radius-open"}`}
        alt=""
      />
      <div className="w-100">
        <div className="d-flex w-100 justify-content-center align-items-center pb-5">
          <NavLink to="/" onClick={() => setActiveLink("")}>
            <img
              src={
                activeSidebar
                  ? "https://cdn.worldofdypians.com/tools/toolsLogoActive.svg"
                  : "https://cdn.worldofdypians.com/tools/toolsLogo.svg"
              }
              alt=""
              style={{ height: "40px" }}
            />
          </NavLink>
        </div>
        <div
          className={`sidebar-container w-100 justify-content-center ${
            activeSidebar ? "align-items-start" : "align-items-center"
          } d-flex flex-column gap-4`}
          style={{ gap: 35 }}
        >
          <div
            className={`sidebar-container w-100 accordion justify-content-center ${
              activeSidebar ? "align-items-start" : "align-items-center"
            } d-flex flex-column gap-2`}
            id="accordionExample2"
          >
            {sidebarItems.map((sideItem, index) =>
              sideItem.children?.length > 0 ? (
                <div key={index}>
                  <div
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${sideItem.label}`}
                    aria-expanded="true"
                    aria-controls={`collapse${sideItem.label}`}
                    id={`heading${sideItem.label}`}
                    className={`sidebar-item gap-3 p-2 d-flex ${
                      activeSidebar
                        ? "active-width justify-content-start ms-4"
                        : "justify-content-center"
                    } align-items-center ${
                      location.pathname ===
                      sideItem.children.find((item) => {
                        return item.link === activePath;
                      })?.link
                        ? "active-side-link"
                        : "test"
                    }`}
                    onClick={() => setActiveLink(sideItem.label)}
                    onMouseEnter={() => setHover(sideItem.label)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <img
                      src={`https://cdn.worldofdypians.com/tools/${
                        activeLink === sideItem.label ||
                        hover === sideItem.label ||
                        activePath === sideItem.link
                          ? sideItem.icon + "Active.svg"
                          : sideItem.icon + ".svg"
                      }`}
                      alt=""
                      style={{ width: 32, height: 32 }}
                    />
                    {activeSidebar && (
                      <div className="d-flex w-100 flex-row align-items-center justify-content-between">
                        <h3
                          className={
                            activeLink === sideItem.label ||
                            hover === sideItem.label ||
                            activePath === sideItem.link
                              ? "active-text"
                              : "sideitem-text"
                          }
                        >
                          {sideItem.label}
                        </h3>
                        <img
                          src={
                            "https://cdn.worldofdypians.com/tools/accordionIndicator.svg"
                          }
                          alt="indicator"
                          id="indicator"
                        />
                      </div>
                    )}
                  </div>
                  <div
                    id={`collapse${sideItem.label}`}
                    className={`accordion-collapse collapse ${
                      sideItem.children.filter((obj) => {
                        return windowUrl.includes(obj.link);
                      })
                        ? "open"
                        : null
                    }`}
                    aria-labelledby={`heading${sideItem.label}`}
                    data-bs-parent="#accordionExample2"
                  >
                    {activeSidebar ? (
                      <div className="accordion-container d-flex flex-column gap-2 ms-5">
                        {sideItem.children.map((child, index) => (
                          <NavLink
                            key={index}
                            to={child.link}
                            onClick={() => {
                              setactivePath(child.link);
                              setActiveLink(sideItem.label);
                            }}
                            className={(isActive) =>
                              location.pathname === child.link
                                ? "accordion-child accordion-child-active d-flex align-items-center gap-1"
                                : "accordion-child d-flex align-items-center gap-1"
                            }
                          >
                            {child.title}
                            {child.title === "Dypius" && (
                              <div className="new-beta-sidebar">
                                <span className="new-beta-text">New</span>
                              </div>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                sideItem.link?.length > 0 && (
                  <NavLink to={sideItem.link}>
                    <div
                      key={index}
                      id={sideItem.label}
                      className={`sidebar-item gap-3 p-2 d-flex ${
                        activeSidebar
                          ? "active-width justify-content-start ms-4"
                          : "justify-content-center"
                      } align-items-center ${
                        activeLink === sideItem.label ||
                        activePath === sideItem.link
                          ? "active-side-link"
                          : null
                      }`}
                      onClick={() => {
                        setActiveLink(sideItem.label);
                        setactivePath(sideItem.link);
                      }}
                      onMouseEnter={() => setHover(sideItem.label)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <img
                        src={`https://cdn.worldofdypians.com/tools/${
                          activeLink === sideItem.label ||
                          hover === sideItem.label ||
                          activePath === sideItem.link
                            ? sideItem.icon + "Active.svg"
                            : sideItem.icon + ".svg"
                        }`}
                        alt=""
                        style={{ width: 32, height: 32 }}
                      />
                      {activeSidebar && (
                        <h3
                          className={
                            activeLink === sideItem.label ||
                            hover === sideItem.label ||
                            activePath === sideItem.link
                              ? "active-text"
                              : "sideitem-text"
                          }
                        >
                          {sideItem.label}
                        </h3>
                      )}{" "}
                      {sideItem.label === "Bridge" && activeSidebar && (
                        <div className="new-beta-sidebar">
                          <span className="new-beta-text">New</span>
                        </div>
                      )}
                    </div>
                  </NavLink>
                )
              ),
            )}
          </div>
        </div>
      </div>
      {activeSidebar &&
        (props.isPremium === false || props.isPremium === null) && (
          <NavLink
            to={"/account"}
            className="d-flex align-items-center justify-content-center"
          >
            <img
              src={"https://cdn.worldofdypians.com/tools/sidebarPremium.png"}
              alt=""
              style={{ width: "80%" }}
            />
          </NavLink>
        )}
    </div>
  );
};

export default Sidebar;
