import React, { useEffect, useState } from "react";
import "./loyaltyprogram.css";
import clock from "./assets/clock.svg";
import coinsIcon from "./assets/coinsIcon.svg";
import contractIcon from "./assets/contractIcon.svg";
import dyp from "./assets/dyp.svg";
import eth from "./assets/eth.svg";
import fireIcon from "./assets/fireIcon.svg";
import moneyIcon from "./assets/moneyIcon.svg";
import starIcon from "./assets/starIcon.svg";
import xMark from "./assets/xMark.svg";
import successful from "./assets/successful.svg";
import denied from "./assets/denied.svg";
import metamask from "./assets/metamask.png";
import coinbase from "./assets/coinbase.png";
import coin98 from "./assets/coin98.png";
import trustwallet from "./assets/trustwallet.png";
import safepal from "./assets/safepal.png";

const LoyaltyProgram = ({coinbase, isConnected, handleConnection}) => {
  const [popup, setPopup] = useState(false);
  const [step, setStep] = useState(1);

  const html = document.querySelector("html");

  useEffect(() => {
    if (popup === true) {
      html.classList.add("hidescroll");
    } else {
      html.classList.remove("hidescroll");
    }
  }, [popup]);


  useEffect(() => {
   if(coinbase && isConnected){
    setStep(3)
   }
  }, [coinbase, isConnected])
  

  return (
    <>
      <div className="container-lg p-0">
        <div className="row">
          <div className="col-12">
            <div className="loyalty-banner loyalty-container d-flex flex-column flex-lg-row p-4 gap-3 gap-lg-5 align-items-center mb-4">
              <div className="d-flex flex-column gap-2 loyalty-banner-content">
                <h6 className="loyalty-banner-title mb-0">Loyalty Program</h6>
                <p className="loyalty-banner-desc mb-0">
                  This program rewards your interactions within Dypius ecosystem
                  by offering gas fee rebates on Base. Join us in exploring the
                  ecosystem with lower costs and great benefits for loyal
                  participants!
                </p>
                <button
                  className="btn filled-btn"
                  style={{ width: "fit-content" }}
                  onClick={() => setPopup(true)}
                >
                  Apply
                </button>
              </div>
              <div className="loyalty-banner-timer px-5 py-4 position-relative d-flex align-items-center justify-content-center">
                <img src={clock} alt="" className="loyalty-clock" />
                <div className="d-flex flex-column align-items-center ">
                  <h6 className="loyalty-timer mb-0">2d : 15h : 14m</h6>
                  <span className="loyalty-time-left">Time left</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="loyalty-container p-3">
              <div className="row">
                <div className="col-12 col-lg-5 d-flex align-items-end">
                  <div className="d-flex flex-column gap-3">
                    <h6 className="loyalty-title mb-0">90 days gas free</h6>
                    <p className="loyalty-desc mb-0">
                      Winners will enjoy 90 days of gas-free transactions in the
                      Dypius ecosystem on Base, with ETH and DYPv2 reimbursed to
                      cover the gas costs for one transaction per day.
                    </p>
                    <div className="d-flex flex-column w-100 mb-3 mb-lg-0">
                      <div className="d-flex align-items-center justify-content-center p-2 my-reimbursement">
                        My Reimbursement
                      </div>
                      <div className="d-flex p-3 flex-column align-items-center justify-content-center gap-2 reimbursement-wrapper">
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="d-flex align-items-center gap-2">
                            <img src={dyp} alt="" />
                            <h6 className="mb-0 reimbursement-token">
                              2,500.20 DYP
                            </h6>
                          </div>
                          <span className="reimbursement-usd">$57.92</span>
                        </div>
                        <div className="reimbursement-divider"></div>
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="d-flex align-items-center gap-2">
                            <img src={eth} alt="" />
                            <h6 className="mb-0 reimbursement-token">
                              2,500.20 ETH
                            </h6>
                          </div>
                          <span className="reimbursement-usd">$57.92</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-7">
                  <div
                    className="reimbursement-wrapper p-3 d-flex flex-column align-items-center gap-2"
                    style={{ borderRadius: "12px" }}
                  >
                    <h6 className="participants-title mb-0">Participants</h6>
                    <div className="d-flex align-items-center gap-2">
                      <img src={fireIcon} alt="" />
                      <span className="participants-desc">
                        {" "}
                        <span style={{ color: "#FCE202" }}>252,654</span> joined
                        the Loyalty Program
                      </span>
                    </div>
                    <div className="d-flex flex-column gap-2 w-100">
                      <div className="participant-item d-flex align-items-center justify-content-between w-100 py-1">
                        <span className="participant-name">
                          0x66...f506 joined the{" "}
                          <span style={{ color: "#fff" }}>Loyalty Program</span>
                        </span>
                        <span className="participant-time-ago">3 min ago</span>
                      </div>
                      <div className="participant-item d-flex align-items-center justify-content-between w-100 py-1">
                        <span className="participant-name">
                          0x66...f506 joined the{" "}
                          <span style={{ color: "#fff" }}>Loyalty Program</span>
                        </span>
                        <span className="participant-time-ago">3 min ago</span>
                      </div>
                      <div className="participant-item d-flex align-items-center justify-content-between w-100 py-1">
                        <span className="participant-name">
                          0x66...f506 joined the{" "}
                          <span style={{ color: "#fff" }}>Loyalty Program</span>
                        </span>
                        <span className="participant-time-ago">3 min ago</span>
                      </div>
                      <div className="participant-item d-flex align-items-center justify-content-between w-100 py-1">
                        <span className="participant-name">
                          0x66...f506 joined the{" "}
                          <span style={{ color: "#fff" }}>Loyalty Program</span>
                        </span>
                        <span className="participant-time-ago">3 min ago</span>
                      </div>
                      <div className="participant-item d-flex align-items-center justify-content-between w-100 py-1">
                        <span className="participant-name">
                          0x66...f506 joined the{" "}
                          <span style={{ color: "#fff" }}>Loyalty Program</span>
                        </span>
                        <span className="participant-time-ago">3 min ago</span>
                      </div>
                      <div className="participant-item d-flex align-items-center justify-content-between w-100 py-1">
                        <span className="participant-name">
                          0x66...f506 joined the{" "}
                          <span style={{ color: "#fff" }}>Loyalty Program</span>
                        </span>
                        <span className="participant-time-ago">3 min ago</span>
                      </div>
                      <div className="participant-item d-flex align-items-center justify-content-between w-100 py-1">
                        <span className="participant-name">
                          0x66...f506 joined the{" "}
                          <span style={{ color: "#fff" }}>Loyalty Program</span>
                        </span>
                        <span className="participant-time-ago">3 min ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="loyalty-container p-3 d-flex flex-column align-items-center gap-2">
              <h6 className="loyalty-banner-title mb-0">Benefits</h6>
              <div className="loyalty-benefits-grid w-100">
                <div className="loyalty-benefit-item p-3 d-flex flex-column gap-2">
                  <div className="benefit-icon-wrapper d-flex align-items-center justify-content-center">
                    <img src={contractIcon} alt="" />
                  </div>
                  <p className="loyalty-benefits-desc mb-0">
                    Rewards for consistent engagement and participation
                  </p>
                </div>
                <div className="loyalty-benefit-item p-3 d-flex flex-column gap-2">
                  <div className="benefit-icon-wrapper d-flex align-items-center justify-content-center">
                    <img src={starIcon} alt="" />
                  </div>
                  <p className="loyalty-benefits-desc mb-0">
                    Gas fee rebates for interactions with Dypius products
                  </p>
                </div>
                <div className="loyalty-benefit-item p-3 d-flex flex-column gap-2">
                  <div className="benefit-icon-wrapper d-flex align-items-center justify-content-center">
                    <img src={coinsIcon} alt="" />
                  </div>
                  <p className="loyalty-benefits-desc mb-0">
                    Exclusive incentives for Base network users
                  </p>
                </div>
                <div className="loyalty-benefit-item p-3 d-flex flex-column gap-2">
                  <div className="benefit-icon-wrapper d-flex align-items-center justify-content-center">
                    <img src={moneyIcon} alt="" />
                  </div>
                  <p className="loyalty-benefits-desc mb-0">
                    Lower costs to explore and engage in the ecosystem
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="popup"
        className={`popup-wrapper ${
          popup && "popup-active"
        } p-3 d-flex flex-column gap-3 justify-content-center align-items-center`}
        style={{ borderRadius: "8px", background: "#312F69" }}
      >
        <div className="d-flex py-3 align-items-center justify-content-between w-100">
          <h6 className="loyalty-popup-title mb-0">Loyalty Program</h6>
          <img
            src={xMark}
            onClick={() => setPopup(false)}
            alt="close"
            style={{ cursor: "pointer" }}
          />
        </div>
        {step <= 3 && (
          <>
            <p className="loyalty-popup-desc mb-0">
              Submit your application to join the Loyalty Program, tailored
              specifically for Base users, providing tangible benefits that make
              participation in the ecosystem more cost-effective.
            </p>
            <div className="reimbursement-divider"></div>
          </>
        )}
        {step === 1 ? (
          <button className="btn filled-btn" onClick={() => setStep(2)}>Connect wallet</button>
        ) : step === 2 ? (
          <div className="d-flex flex-column gap-2 w-100">
            <div className="connect-wallet-item p-3 w-100 d-flex align-items-center justify-content-between" onClick={handleConnection}>
              <span className="loyalty-wallet-title">Metamask</span>
              <img src={metamask} width={30} height={30} alt="" />
            </div>
            <div className="connect-wallet-item p-3 w-100 d-flex align-items-center justify-content-between" onClick={handleConnection}>
              <span className="loyalty-wallet-title">Coinbase</span>
              <img src={coinbase} width={30} height={30} alt="" />
            </div>
            <div className="connect-wallet-item p-3 w-100 d-flex align-items-center justify-content-between" onClick={handleConnection}>
              <span className="loyalty-wallet-title">Coin98</span>
              <img src={coin98} width={30} height={30} alt="" />
            </div>
            <div className="connect-wallet-item p-3 w-100 d-flex align-items-center justify-content-between" onClick={handleConnection}>
              <span className="loyalty-wallet-title">Trustwallet</span>
              <img src={trustwallet} width={30} height={30} alt="" />
            </div>
            <div className="connect-wallet-item p-3 w-100 d-flex align-items-center justify-content-between" onClick={handleConnection}>
              <span className="loyalty-wallet-title">SafePal</span>
              <img src={safepal} width={30} height={30} alt="" />
            </div>
          </div>
        ) : step === 3 ? (
          <>
            <div className="d-flex w-100 align-items-center justify-content-between">
              <span className="loyalty-popup-span">Wallet Address</span>
              <span className="loyalty-popup-span-2">0xB329...bDe8</span>
            </div>
            <div className="reimbursement-divider "></div>
            <div className="d-flex flex-column gap-3 w-100">
              <span className="loyalty-popup-span">Other Details</span>
              <input
                type="text"
                placeholder="Email Address"
                className="loyalty-popup-input p-2"
              />
              <input
                type="text"
                placeholder="Twitter username"
                className="loyalty-popup-input p-2"
              />
            </div>
            <div className="d-flex w-100 justify-content-center">
              <button
                className="btn filled-btn"
                style={{ width: "fit-content" }}
              >
                Submit
              </button>
            </div>
          </>
        ) : step === 4 ? (
          <div className="d-flex flex-column w-100 align-items-center gap-3">
            <img src={successful} alt="" />
            <p className="loyalty-popup-desc" style={{ textAlign: "center", width: "75%" }}>
              Congratulations! Your application for the Loyalty Program was
              successful. Please stay tuned to our official social media
              channels for the winners announcement.
            </p>
            <h6 className="loyalty-popup-close" onClick={() => setPopup(false)}>Close</h6>
          </div>
        ) : step === 5 ?  (
          <div className="d-flex flex-column w-100 align-items-center gap-3">
            <img src={denied} alt="" />
            <p className="loyalty-popup-desc" style={{ textAlign: "center", width: "75%" }}>
            Your application for the Loyalty Program has already been received. Please check back soon.
            </p>
            <h6 className="loyalty-popup-close" onClick={() => setPopup(false)}>Close</h6>
          </div>
          
        ) : <></>
      }
      </div>
    </>
  );
};

export default LoyaltyProgram;
