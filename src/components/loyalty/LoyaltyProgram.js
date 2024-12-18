import React, { useEffect, useState } from "react";
import "./loyaltyprogram.css";
import "../LandPopup/landpopup.css";
import { shortAddress } from "../../functions/shortAddress";
import Countdown from "react-countdown";
import getFormattedNumber from "../../functions/get-formatted-number";
import { loyaltyAddresses } from ".";
import moment from "moment";
import axios from "axios";
    


const renderer = ({ days, hours, minutes }) => {
  return (
    <h6 className="loyalty-timer mb-0">
      {days}d : {hours}h : {minutes}m{/* Season two */}
    </h6>
  );
};

const LoyaltyProgram = ({ coinbase, isConnected, handleConnection }) => {
  const baseUrl = "https://api.worldofdypians.com/api";

  const [popup, setPopup] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    emailAddress: "",
    twitterUser: "",
  });
  const [latestUsers, setLatestUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [expired, setisExpired] = useState(false);
  const [selectedLoyalty, setSelectedLoyalty] = useState("opbnb");

  const [isWinner, setisWinner] = useState(false);

  // const [dypPrice, setDypPrice] = useState(0);
  // const [ethPrice, setEthPrice] = useState(0);

  let loyaltyCd = new Date("2024-12-19T17:59:59.000+02:00");
  const label = { inputProps: { "aria-label": "Switch demo" } };
  // const convertEthToUsd = async () => {
  //   const res = axios
  //     .get("https://api.coinbase.com/v2/prices/ETH-USD/spot")
  //     .then((data) => {
  //       return data.data.data.amount;
  //     });
  //   return res;
  // };

  // const getPriceDYP = async () => {
  //   const dypprice = await axios
  //     .get(
  //       "https://api.geckoterminal.com/api/v2/networks/eth/pools/0x7c81087310a228470db28c1068f0663d6bf88679"
  //     )
  //     .then((res) => {
  //       return res.data.data.attributes.base_token_price_usd;
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });

  //   const ethprice = await convertEthToUsd();
  //   setEthPrice(ethprice);

  //   setDypPrice(dypprice);
  // };

  const fetchLatestUsers = async () => {
    await axios
      .get(`${baseUrl}/loyalty/opbnb/latest`)
      .then((data) => {
        setLatestUsers(data.data.participants);
        setTotalUsers(data.data.totalCount);
      })
      .catch((err) => console.log(err));
  };

  const loyaltyCheck = async () => {
    await axios
      .get(`${baseUrl}/loyalty/opbnb/check/${coinbase}`)
      .then((data) => {
        if (data.data.user) {
          setStep(5);
        } else {
          setStep(3);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEmailChange = (e) => {
    setFormData({
      ...formData,
      emailAddress: e.target.value, // Update only the email field
    });
  };

  // Handler for the twitter input change
  const handleTwitterChange = (e) => {
    setFormData({
      ...formData,
      twitterUser: e.target.value, // Update only the twitter field
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .post(`${baseUrl}/loyalty/opbnb/add`, {
        ...formData,
        walletAddress: coinbase,
        chains: ["opbnb"],
      })
      .then((res) => {
        setLoading(false);
        setRefresh(true);
        setStep(4);
      })
      .catch((err) => {
        console.log(err);
        setStep(6);
      });
  };

  const checkIfWinner = () => {
    if (selectedLoyalty === "base") {
      let found = 0;
      for (let i of loyaltyAddresses) {
        if (coinbase.toLowerCase() === i.toLowerCase()) {
          found = 1;
        }
      }
      if (found === 0) {
        setisWinner(false);
      } else if (found === 1) {
        setisWinner(true);
      }
    } else setisWinner(false);
  };

  const html = document.querySelector("html");

  useEffect(() => {
    if (popup === true) {
      html.classList.add("hidescroll");
    } else {
      html.classList.remove("hidescroll");
    }
  }, [popup]);

  useEffect(() => {
    if (coinbase && isConnected) {
      loyaltyCheck();
      checkIfWinner();
    } else {
      setStep(1);
      setisWinner(false);
    }
  }, [coinbase, isConnected]);

  useEffect(() => {
    fetchLatestUsers();
  }, [refresh]);

  useEffect(() => {
    // getPriceDYP();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="container-lg p-0">
        <div className="row gap-3 gap-lg-0">
          <div className="col-12">
            <div
              className={` ${
                selectedLoyalty === "opbnb"
                  ? "loyalty-banneropbnb"
                  : "loyalty-banner"
              }  loyalty-container d-flex flex-column flex-lg-row p-4 gap-3 gap-lg-5 align-items-center mb-4`}
            >
              <div className="d-flex flex-column gap-2 loyalty-banner-content">
                <h6 className="loyalty-banner-title mb-0">Loyalty Program</h6>
                <p className="loyalty-banner-desc mb-0">
                  This program rewards your interactions within Dypius ecosystem
                  by offering gas fee rebates on{" "}
                  {selectedLoyalty === "opbnb" ? "opBNB Chain" : "Base"}. Join
                  us in exploring the ecosystem with lower costs and great
                  benefits for loyal participants!
                </p>
              </div>
              <div className={` ${selectedLoyalty === 'base' && 'invisible'} loyalty-banner-timer px-5 py-4 position-relative d-flex align-items-center justify-content-center`}>
                <img src={'https://cdn.worldofdypians.com/tools/clock.svg'} alt="" className="loyalty-clock" />
                <div className="d-flex flex-column align-items-center ">
                  <Countdown
                    renderer={renderer}
                    date={loyaltyCd}
                    onComplete={() => {
                      setisExpired(true);
                    }}
                  />

                  <span className="loyalty-time-left">Time left</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6 ">
            <div className="loyalty-container p-3 h-100">
              <div className="row h-100 gap-3 gap-lg-0">
                <div className="col-12 col-lg-5 d-flex flex-column gap-4 justify-content-start align-items-center">
                  <div className="d-flex flex-column justify-content-start gap-3">
                    <h6 className="loyalty-banner-title text-center mb-0">
                      90 days gas free
                    </h6>
                    <div className="d-flex flex-column gap-5 h-100 justify-content-start align-items-center pt-3">
                      <p className="loyalty-desc mb-0 align-items-center  d-flex">
                        Winners will enjoy 90 days of gas-free transactions in
                        the Dypius ecosystem on{" "}
                        {selectedLoyalty === "opbnb" ? "opBNB Chain" : "Base"},
                        with {selectedLoyalty === "opbnb" ? "BNB" : "ETH"} and
                        DYPv2 reimbursed to cover the gas costs for one
                        transaction per day.
                      </p>
                      {step !== 5 &&
                        step !== 4 &&
                        expired === false &&
                        selectedLoyalty === "opbnb" && (
                          <button
                            className="btn hero-stake-eth-btn2 w-75"
                            onClick={() => setPopup(true)}
                          >
                            Apply
                          </button>
                        )}

                      {(expired === true || selectedLoyalty === "base") && (
                        <button className="disabled-btn pe-none" disabled>
                          Ended
                        </button>
                      )}
                    </div>
                    {/* <div className="d-flex flex-column w-100 mb-3 mb-lg-0">
                      <div className="d-flex align-items-center justify-content-center p-2 my-reimbursement">
                        My Reimbursement
                      </div>
                      <div className="d-flex p-3 flex-column align-items-center justify-content-center gap-2 reimbursement-wrapper">
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="d-flex align-items-center gap-2">
                            <img src={dyp} alt="" />
                            <h6 className="mb-0 reimbursement-token">
                              {step === 5 && isConnected ? 0.1 : 0} DYP
                            </h6>
                          </div>
                          <span className="reimbursement-usd">
                            $
                            {step === 5 && isConnected
                              ? getFormattedNumber(0.1 * dypPrice, 4)
                              : 0}
                          </span>
                        </div>
                        <div className="reimbursement-divider"></div>
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="d-flex align-items-center gap-2">
                            <img src={eth} alt="" />
                            <h6 className="mb-0 reimbursement-token">
                              {step === 5 && isConnected ? 0.000004 : 0} ETH
                            </h6>
                          </div>
                          <span className="reimbursement-usd">
                            $
                            {step === 5 && isConnected
                              ? getFormattedNumber(0.000004 * ethPrice, 4)
                              : 0}
                          </span>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div className="d-flex flex-column w-100 mb-3 mb-lg-0 align-items-center">
                    {step === 5 &&
                        selectedLoyalty === "opbnb" && (
                      <img src={'https://cdn.worldofdypians.com/tools/appliedBadge.webp'} alt="" className="appliedbadge" />
                    )}
                    {isWinner && (
                      <img src={'https://cdn.worldofdypians.com/tools/winnerBadge.webp'} alt="" className="appliedbadge" />
                    )}
                  </div>
                </div>
                <div className="col-12 col-lg-7">
                  <div
                    className="reimbursement-wrapper h-100 d-flex flex-column align-items-center gap-2 justify-content-between w-100"
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="px-3 pt-3 d-flex flex-column align-items-center gap-2 w-100">
                      <h6 className="participants-title mb-0">Participants</h6>
                      <div className="d-flex align-items-center gap-2">
                        <img src={'https://cdn.worldofdypians.com/tools/fireIcon.svg'} alt="" />
                        <span className="participants-desc">
                          <span style={{ color: "#FCE202" }}>
                            {getFormattedNumber(
                              selectedLoyalty === "opbnb" ? totalUsers : 359639,
                              0
                            )}
                          </span>{" "}
                          joined the Loyalty Program
                        </span>
                      </div>
                      <div className="d-flex flex-column w-100">
                        {(selectedLoyalty === "opbnb"
                          ? latestUsers
                          : loyaltyAddresses
                        )
                          .slice(0, 7)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="participant-item d-flex align-items-center justify-content-between w-100 py-2"
                            >
                              <span className="participant-name">
                                {shortAddress(
                                  selectedLoyalty === "opbnb"
                                    ? item.walletAddress
                                    : item
                                )}{" "}
                                joined
                              </span>
                              <span className="participant-time-ago">
                                {moment
                                  .duration(
                                    (selectedLoyalty !== "opbnb"
                                      ? 1726576825000
                                      : new Date(item.timestamp).getTime()) -
                                      Date.now()
                                  )
                                  .humanize(true)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="viewprevious-wrapper d-flex w-100 px-3 py-1 align-items-center gap-2 justify-content-between">
                      <span className="viewWinners">View previous season</span>
                      <div class="form-check form-switch p-0 m-0">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckChecked"
                          onChange={() => {
                            setSelectedLoyalty(
                              selectedLoyalty === "base" ? "opbnb" : "base"
                            );
                          }}
                          style={{ cursor: "pointer" }}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="loyalty-container h-100 p-3 d-flex flex-column align-items-center gap-2">
              <h6 className="loyalty-banner-title mb-0">Benefits</h6>
              <div className="loyalty-benefits-grid w-100">
                <div className="loyalty-benefit-item p-3 d-flex flex-column gap-2">
                  <div className="benefit-icon-wrapper d-flex align-items-center justify-content-center">
                    <img src={'https://cdn.worldofdypians.com/tools/contractIcon.svg'} alt="" />
                  </div>
                  <p className="loyalty-benefits-desc mb-0">
                    Rewards for consistent engagement and participation
                  </p>
                </div>
                <div className="loyalty-benefit-item p-3 d-flex flex-column gap-2">
                  <div className="benefit-icon-wrapper d-flex align-items-center justify-content-center">
                    <img src={'https://cdn.worldofdypians.com/tools/starIcon.svg'} alt="" />
                  </div>
                  <p className="loyalty-benefits-desc mb-0">
                    Gas fee rebates for interactions with Dypius products
                  </p>
                </div>
                <div className="loyalty-benefit-item p-3 d-flex flex-column gap-2">
                  <div className="benefit-icon-wrapper d-flex align-items-center justify-content-center">
                    <img src={'https://cdn.worldofdypians.com/tools/coinsIcon.svg'} alt="" />
                  </div>
                  <p className="loyalty-benefits-desc mb-0">
                    Exclusive incentives for{" "}
                    {selectedLoyalty === "opbnb"
                      ? "opBNB Chain"
                      : "Base network"}{" "}
                    users
                  </p>
                </div>
                <div className="loyalty-benefit-item p-3 d-flex flex-column gap-2">
                  <div className="benefit-icon-wrapper d-flex align-items-center justify-content-center">
                    <img src={'https://cdn.worldofdypians.com/tools/moneyIcon.svg'} alt="" />
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
            src={'https://cdn.worldofdypians.com/wod/xMark.svg'}
            onClick={() => setPopup(false)}
            alt="close"
            style={{ cursor: "pointer" }}
          />
        </div>
        {step <= 3 && (
          <>
            <p className="loyalty-popup-desc mb-0">
              Submit your application to join the Loyalty Program, tailored
              specifically for{" "}
              {selectedLoyalty === "opbnb" ? "opBNB Chain" : "Base Network"}{" "}
              users, providing tangible benefits that make participation in the
              ecosystem more cost-effective.
            </p>
            <div className="reimbursement-divider"></div>
          </>
        )}
        {step === 1 ? (
          <button className="btn filled-btn" onClick={() => setStep(2)}>
            Connect wallet
          </button>
        ) : step === 2 ? (
          <div className="d-flex flex-column gap-2 w-100">
            <div
              className="connect-wallet-item p-3 w-100 d-flex align-items-center justify-content-between"
              onClick={handleConnection}
            >
              <span className="loyalty-wallet-title">Metamask</span>
              <img src={'https://cdn.worldofdypians.com/wod/metamaskConnect.svg'} width={30} height={30} alt="" />
            </div>
            <div
              className="connect-wallet-item p-3 w-100 d-flex align-items-center justify-content-between"
              onClick={handleConnection}
            >
              <span className="loyalty-wallet-title">Coinbase</span>
              <img src={'https://cdn.worldofdypians.com/wod/coinbaseConnect.svg'} width={30} height={30} alt="" />
            </div>
            <div
              className="connect-wallet-item p-3 w-100 d-flex align-items-center justify-content-between"
              onClick={handleConnection}
            >
              <span className="loyalty-wallet-title">Coin98</span>
              <img src={'https://cdn.worldofdypians.com/wod/coin98Connect.svg'} width={30} height={30} alt="" />
            </div>
            <div
              className="connect-wallet-item p-3 w-100 d-flex align-items-center justify-content-between"
              onClick={handleConnection}
            >
              <span className="loyalty-wallet-title">Trustwallet</span>
              <img src={'https://cdn.worldofdypians.com/wod/trustwalletConnect.svg'} width={30} height={30} alt="" />
            </div>
            <div
              className="connect-wallet-item p-3 w-100 d-flex align-items-center justify-content-between"
              onClick={handleConnection}
            >
              <span className="loyalty-wallet-title">SafePal</span>
              <img src={'https://cdn.worldofdypians.com/wod/safepalConnect.svg'} width={30} height={30} alt="" />
            </div>
          </div>
        ) : step === 3 ? (
          <>
            <div className="d-flex w-100 align-items-center justify-content-between">
              <span className="loyalty-popup-span">Wallet Address</span>
              <span className="loyalty-popup-span-2">
                {shortAddress(coinbase)}
              </span>
            </div>

            <div className="reimbursement-divider "></div>
            <form className="d-flex flex-column gap-3 w-100">
              <span className="loyalty-popup-span">
                Other Details (optional)
              </span>
              <input
                type="email"
                placeholder="Email Address"
                className="loyalty-popup-input p-2"
                value={formData.emailAddress}
                onChange={handleEmailChange}
              />
              <input
                type="text"
                placeholder="Twitter username"
                className="loyalty-popup-input p-2"
                value={formData.twitterUser}
                onChange={handleTwitterChange}
              />
            </form>
            <div className="d-flex w-100 justify-content-center">
              <button
                type="submit"
                className="btn filled-btn"
                style={{ width: "fit-content" }}
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <div
                    class="spinner-border spinner-border-sm text-light"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </>
        ) : step === 4 ? (
          <div className="d-flex flex-column w-100 align-items-center gap-3">
            <img src={'https://cdn.worldofdypians.com/tools/successful.svg'} alt="" />
            <p
              className="loyalty-popup-desc"
              style={{ textAlign: "center", width: "75%" }}
            >
              Congratulations! Your application for the Loyalty Program was
              successful. Please stay tuned to our official social media
              channels for the winners announcement.
            </p>
            <h6 className="loyalty-popup-close" onClick={() => setPopup(false)}>
              Close
            </h6>
          </div>
        ) : step === 6 ? (
          <div className="d-flex flex-column w-100 align-items-center gap-3">
            <img src={'https://cdn.worldofdypians.com/tools/denied.svg'} alt="" />
            <p
              className="loyalty-popup-desc"
              style={{ textAlign: "center", width: "75%" }}
            >
              An error occured. Please try again later.
            </p>
            <h6 className="loyalty-popup-close" onClick={() => setPopup(false)}>
              Close
            </h6>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default LoyaltyProgram;
