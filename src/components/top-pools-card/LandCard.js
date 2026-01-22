import React, { useEffect, useState } from "react";
import "./top-pools.css";  
import landNftIcon from "./assets/lanft-poolicon.png";
import purpleArrow from "./assets/purpleArrow.svg";

const LandCard = ({
  cardId,
  onShowDetailsClick,
  onHideDetailsClick,
  cardType,
  renderedPage,
  details,
  listType,
  tvl,
  apr,
  network, expired
  // showDetails,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleDetails = () => {
    if (details === false) {
      setShowDetails(true);
      onShowDetailsClick();
    } else if (details === true) {
      setShowDetails(false);
      onHideDetailsClick();
    }
  };

  return (
    <>
      <div
        className={`poolscardwrapper cursor-pointer position-relative ${
          expired === true
            ? "poolscardwrapperexpired"
            : network === "0"
            ? "blurryCard"
            : "poolscardwrapper"
        }   ${
          renderedPage === "dashboard" && !details ? "pools-cardcaws-hover" : ""
        } ${network === '0' ? 'blurryCard' : 'poolscardwrapper'}`
         }
        onClick={() => handleDetails()}
      >
        {/* <img src={newPool} className="new-pool" alt="top pick" /> */}
        <div
          className="purplediv"
          style={{ background: details ? "#7770e0" : "#8890C4", top: "12px" }}
        ></div>
        <div className="d-flex flex-column gap-0">
          <div
            className="d-flex m-0 justify-content between gap-2 align-items-center justify-content-between"
            style={{ padding: "0px 16px" }}
          >
            <h6 className="token-name d-flex align-items-center gap-2">
              <img
                src={landNftIcon}
                alt=""
                className="tokenlogo"
                style={{ height: 36, width: 36 }}
              />{" "}
              Genesis Land
            </h6>

            <div className="d-flex align-items-baseline gap-1">
              <h6 className="apr-amount">{apr}%</h6>
              <h6 className="apr-title">APR</h6>
            </div>
          </div>
          <div className={`d-flex m-0 justify-content between gap-2 align-items-center justify-content-between  ${
              expired === true ? "bottomwrapperExpired" : "bottomwrapper"
            }`}>
            {cardType !== "Vault" && (
              <div className="d-flex flex-column">
                <h6 className="tvl-text">Total Value Locked</h6>
                <h6 className="tvl-amount">{tvl}</h6>
              </div>
            )}
            <div
              className={`d-flex flex-column ${
                cardType !== "Vault" && "align-items-end"
              }`}
            >
              <h6 className="tvl-text">Lock Time</h6>

              <h6 className="locktime-amount">No Lock</h6>
            </div>
          </div>
          <div
            className={
              expired === true ? "cawsdetails-wrapperexpired" : "details-wrapper"
            }
            onClick={() => {
              handleDetails();
            }}
          >
            <h6
              className="details-text gap-1 d-flex align-items-center"
              style={{
                color:
                  details === false && expired === false
                    ? "#75CAC2"
                    : details === false && expired === true
                    ? "#C1CCF8"
                    : "#C0C9FF",
              }}
            >
              {details === false ? "Details" : "Close"}
              <img
                src={
                  details === false && expired === false
                    ? 'https://cdn.worldofdypians.com/tools/greenarrow.svg'
                    : details === false && expired === true
                    ? purpleArrow
                    : details === true && expired === true
                    ? 'https://cdn.worldofdypians.com/tools/orangearrow.svg'
                    : 'https://cdn.worldofdypians.com/tools/orangearrow.svg'
                }
                alt=""
              />
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandCard;
