import React from "react";
import { NavLink } from "react-router-dom";
import useWindowSize from "../../functions/useWindowSize";

const Footer = () => {
  const windowSize = useWindowSize();

  return (
    <div className="footer container-fluid d-flex justify-content-center justify-content-lg-start">
      <div className="row w-100">
        <div className="col-1"></div>
        <div
          className={`${
            windowSize.width < 991
              ? "col-12"
              : windowSize.width < 1490
              ? "col-11"
              : "col-10"
          }`}
        >
          <div className="py-4 flex-column flex-lg-row px-0 container-lg d-flex justify-content-between gap-3 align-items-start align-items-lg-center">
            <div className="d-flex flex-row flex-lg-column justify-content-between justify-content-lg-center align-items-center align-items-lg-start col-12 col-lg-4 gap-2">
              <a target={"_blank"} href="https://dypius.com/">
                <img src="https://cdn.worldofdypians.com/tools/dypiusFooter.svg" alt="Dypius"></img>
              </a>
              {/* <a
                target={"_blank"}
                href="https://www.worldofdypians.com/"
                style={{ position: "relative" }}
              >
                <img
                  src="https://cdn.worldofdypians.com/wod/metaverse.svg"
                  alt="METAVERSE"
                  style={{ height: "30px" }}
                />
              </a> */}
            </div>
            <hr
              className="form-divider my-2 d-flex d-lg-none"
              style={{ height: "2px" }}
            />
            <div className="social-and-links d-flex align-items-end flex-column-reverse flex-lg-column justify-content-center gap-4">

              <div className="footer-menu">
                <span className="mobile-footer-title d-flex d-lg-none mb-3">
                  Links
                </span>
                <ul className="external-links">
                  
                  <li>
                    <NavLink to="/terms-of-service">Terms of Service</NavLink>
                  </li>
                  <li>
                    <a target={"_blank"} href="https://dypius.com//support">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
      </div>
    </div>
  );
};

export default Footer;
