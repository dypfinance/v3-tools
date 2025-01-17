import React, { useState } from "react";
import "./launchpadprojects.css";
import timerIcon from "../assets/timerIcon.svg";
import UpcomingProjects from "./UpcomingProjects";
import commingSoon from "../assets/commingSoonTag.svg";
import ProjectsLaunched from "./ProjectsLaunched";
import Countdown from "react-countdown";
import { NavLink } from "react-router-dom";

const renderer = ({ days, hours, minutes }) => {
  return (
    <span className="project-timer mb-0">
      {days}D:{hours}H:{minutes}M
      {/* Season two */}
    </span>
  );
};
const LaunchpadProjects = () => {
  let midleCd = new Date("2025-01-21T17:59:59.000+02:00");
  const [expired, setisExpired] = useState(true);

  return (
    <div className="projects-container d-flex flex-column gap-5">
      <div className="active-projects">
        <h6 className="launchpad-hero-title mb-4">Active Projects</h6>
        <div className="row align-items-center justify-content-end">
          <div className="col-12 col-lg-11 active-projects-container p-3 position-relative">
            <img src={'https://cdn.worldofdypians.com/tools/midleLaunchpadBanner.webp'} alt="" className="project-banner" />
            <img src={'https://cdn.worldofdypians.com/tools/midleLive.png'} alt="" className="live"  style={{height: 24}}/>
            <div className="row align-items-center justify-content-end">
              <div className="col-12 col-lg-9 ps-lg-5 d-flex flex-column gap-3">
                <div className="d-flex gap-3 flex-column flex-lg-row align-items-start justify-content-between">
                  <div className="d-flex flex-column gap-3">
                    <h6 className="active-projects-title">Midle</h6>
                    <p className="launchpad-hero-desc">
                    Midle is the go-to marketing platform for brands aiming to supercharge user acquisition, engagement, and retention. 
                    </p>
                  </div>
                  <div className="project-timer-wrapper ms-5 ms-lg-0 d-flex align-items-center gap-3 position-relative">
                    <img src={timerIcon} alt="" className="timer-icon"/>
                    <span className="time-left">Time left:</span>
                    {/* <span className="project-timer"> */}
                      <Countdown
                        renderer={renderer}
                        date={midleCd}
                        onComplete={() => {
                          setisExpired(true);
                        }}
                      />
                    {/* </span> */}
                  </div>
                </div>

                <div className="d-flex flex-column flex-lg-row align-items-center gap-3 gap-lg-5">
                  <div className="d-flex align-items-center gap-2">
                    <span className="time-left">Start time:</span>
                    <span className="project-date">17.01.2025</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="time-left">End time:</span>
                    <span className="project-date">21.01.2025</span>
                  </div>
                </div>
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center align-items-lg-end gap-3 gap-lg-0">
                  <div className="active-project-info p-3">
                    <div className="d-flex flex-column flex-lg-row align-items-start gap-3 gap-lg-5">
                      <div className="d-flex flex-column gap-2">
                        <span className="time-left">Type</span>
                        <span className="project-date">
                        Private Sale
                        </span>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <span className="time-left">Sale price</span>
                        <span className="project-date">$0.007</span>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <span className="time-left">Total comitted</span>
                        <span className="project-date">7,534,403.5465 DYP</span>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <span className="time-left">Participants</span>
                        <span className="project-date">260,343</span>
                      </div>
                    </div>
                  </div>
                  <NavLink className="btn filledbtn" to='/launchpad/midle'>View More</NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <UpcomingProjects /> */}
      {/* <ProjectsLaunched /> */}
    </div>
  );
};

export default LaunchpadProjects;
