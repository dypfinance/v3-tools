import React, { useEffect, useState } from "react";
import xMark from "./assets/xMark.svg";
import getDypIcon from "./assets/getDypIcon.svg";
import "./pricingpackages.css";
import { Checkbox } from "@mui/material";
import { NavLink } from "react-router-dom";
import getFormattedNumber from "../../functions/get-formatted-number";
import Web3 from "web3";
const BundlePopup = ({
  dypBalance,
  bundlePrices,
  active,
  coinbase,
  isConnected,
  chainId,
  onClose,
  activeBundle,
  setFirstLock,
  setSecondLock,
  setThirdLock,
  onRefreshBalance,
  handleSwitchNetwork,
  onConnectWallet,
}) => {
  const [terms, setTerms] = useState(false);
  const [terms2, setTerms2] = useState(false);
  const [terms3, setTerms3] = useState(false);

  const [depositLoading, setdepositLoading] = useState(false);
  const [depositStatus, setdepositStatus] = useState("initial");
  const [errorMsg, seterrorMsg] = useState("");

  const [depositLoading2, setdepositLoading2] = useState(false);
  const [depositStatus2, setdepositStatus2] = useState("initial");
  const [errorMsg2, seterrorMsg2] = useState("");

  const [depositLoading3, setdepositLoading3] = useState(false);
  const [depositStatus3, setdepositStatus3] = useState("initial");
  const [errorMsg3, seterrorMsg3] = useState("");

  let { reward_token_dypius_eth, BigNumber } = window;

  const handleDeposit = async (depositAmount) => {
    setdepositLoading(true);

    const web3 = new Web3(window.ethereum);
    let amount = depositAmount;
    amount = new BigNumber(amount).times(1e18).toFixed(0);
    const basic_bundle_sc = new web3.eth.Contract(
      window.BASIC_BUNDLE_ABI,
      window.config.basic_bundle_address
    );
    await basic_bundle_sc.methods
      .addVestingWallet(amount)
      .send({ from: coinbase })
      .then(() => {
        setdepositLoading(false);
        setdepositStatus("success");
        onRefreshBalance();
        setTimeout(() => {
          setFirstLock(true);
          setdepositStatus("deposit");
          onClose();
        }, 2000);
      })
      .catch((e) => {
        setdepositLoading(false);
        setdepositStatus("fail");
        seterrorMsg(e?.message);
        setTimeout(() => {
          setdepositStatus("initial");
          seterrorMsg("");
        }, 3000);
      });
  };
  const handleDeposit2 = async (depositAmount) => {
    setdepositLoading2(true);

    const web3 = new Web3(window.ethereum);
    let amount = depositAmount;
    amount = new BigNumber(amount).times(1e18).toFixed(0);
    const advanced_bundle_sc = new web3.eth.Contract(
      window.ADVANCED_BUNDLE_ABI,
      window.config.advanced_bundle_address
    );

    await advanced_bundle_sc.methods
      .addVestingWallet(amount)
      .send({ from: coinbase })
      .then(() => {
        setdepositLoading2(false);
        setdepositStatus2("success");
        onRefreshBalance();
        setTimeout(() => {
          setdepositStatus2("deposit");
          setSecondLock(true);
          onClose();
        }, 2000);
      })
      .catch((e) => {
        setdepositLoading2(false);
        setdepositStatus2("fail");
        seterrorMsg2(e?.message);
        setTimeout(() => {
          setdepositStatus2("initial");
          seterrorMsg2("");
        }, 3000);
      });
  };
  const handleDeposit3 = async (depositAmount) => {
    setdepositLoading3(true);

    const web3 = new Web3(window.ethereum);
    let amount = depositAmount;
    amount = new BigNumber(amount).times(1e18).toFixed(0);
    const enterprise_bundle_sc = new web3.eth.Contract(
      window.ENTERPRISE_BUNDLE_ABI,
      window.config.enterprise_bundle_address
    );

    await enterprise_bundle_sc.methods
      .addVestingWallet(amount)
      .send({ from: coinbase })
      .then(() => {
        setdepositLoading3(false);
        setdepositStatus3("success");
        onRefreshBalance();
        setTimeout(() => {
          setdepositStatus3("deposit");
          setThirdLock(true);
          onClose();
        }, 2000);
      })
      .catch((e) => {
        setdepositLoading3(false);
        setdepositStatus3("fail");
        seterrorMsg3(e?.message);
        setTimeout(() => {
          setdepositStatus3("initial");
          seterrorMsg3("");
        }, 3000);
      });
  };

  const handleApprove = async (depositAmount) => {
    setdepositLoading(true);

    let amount = depositAmount;
    amount = new BigNumber(amount).times(1e18).toFixed(0);
    await reward_token_dypius_eth
      .approve(window.config.basic_bundle_address, amount)
      .then(() => {
        setdepositLoading(false);
        setdepositStatus("deposit");
        onRefreshBalance();
      })
      .catch((e) => {
        setdepositLoading(false);
        setdepositStatus("fail");
        seterrorMsg(e?.message);
        setTimeout(() => {
          setdepositStatus("initial");
          seterrorMsg("");
        }, 3000);
      });
  };
  const handleApprove2 = async (depositAmount) => {
    setdepositLoading2(true);

    let amount = depositAmount;
    amount = new BigNumber(amount).times(1e18).toFixed(0);
    await reward_token_dypius_eth
      .approve(window.config.advanced_bundle_address, amount)
      .then(() => {
        setdepositLoading2(false);
        setdepositStatus2("deposit");
        onRefreshBalance();
      })
      .catch((e) => {
        setdepositLoading2(false);
        setdepositStatus2("fail");
        seterrorMsg2(e?.message);
        setTimeout(() => {
          setdepositStatus2("initial");
          seterrorMsg2("");
        }, 3000);
      });
  };
  const handleApprove3 = async (depositAmount) => {
    setdepositLoading3(true);

    let amount = depositAmount;
    amount = new BigNumber(amount).times(1e18).toFixed(0);
    await reward_token_dypius_eth
      .approve(window.config.enterprise_bundle_address, amount)
      .then(() => {
        setdepositLoading3(false);
        setdepositStatus3("deposit");
        onRefreshBalance();
      })
      .catch((e) => {
        setdepositLoading3(false);
        setdepositStatus3("fail");
        seterrorMsg3(e?.message);
        setTimeout(() => {
          setdepositStatus3("initial");
          seterrorMsg3("");
        }, 3000);
      });
  };

  const checkApproval = async (amount) => {
    const result = await window
      .checkapproveStakePool(
        coinbase,
        reward_token_dypius_eth._address,
        window.config.basic_bundle_address
      )
      .then((data) => {
        console.log(data);
        return data;
      });

    const result2 = await window
      .checkapproveStakePool(
        coinbase,
        reward_token_dypius_eth._address,
        window.config.advanced_bundle_address
      )
      .then((data) => {
        console.log(data);
        return data;
      });

    const result3 = await window
      .checkapproveStakePool(
        coinbase,
        reward_token_dypius_eth._address,
        window.config.enterprise_bundle_address
      )
      .then((data) => {
        console.log(data);
        return data;
      });

    let result_formatted = new BigNumber(result).div(1e18).toFixed(6);
    let result_formatted2 = new BigNumber(result2).div(1e18).toFixed(6);
    let result_formatted3 = new BigNumber(result3).div(1e18).toFixed(6);

    if (
      Number(result_formatted) >= Number(amount) &&
      Number(result_formatted) !== 0
    ) {
      setdepositStatus("deposit");
    } else {
      setdepositStatus("initial");
    }

    if (
      Number(result_formatted2) >= Number(amount) &&
      Number(result_formatted2) !== 0
    ) {
      setdepositStatus2("deposit");
    } else {
      setdepositStatus2("initial");
    }

    if (
      Number(result_formatted3) >= Number(amount) &&
      Number(result_formatted3) !== 0
    ) {
      setdepositStatus3("deposit");
    } else {
      setdepositStatus3("initial");
    }
  };

  useEffect(() => {
    if (isConnected && coinbase) {
      checkApproval(
        activeBundle === 1
          ? bundlePrices.basic.priceInDyp
          : activeBundle === 2
          ? bundlePrices.advanced.priceInDyp
          : bundlePrices.enterprise.priceInDyp,
        activeBundle
      );
    }
  }, [activeBundle, isConnected, coinbase]);

  useEffect(() => {
    setTerms(false);
    setTerms2(false);
    setTerms3(false);
  }, [active]);

  return (
    <div
      id="popup"
      className={`popup-wrapper  ${
        active && "popup-active"
      } p-3 d-flex flex-column gap-3 justify-content-center align-items-center`}
      style={{ borderRadius: "8px", background: "#1A1A36" }}
    >
      <div
        className="d-flex align-items-center justify-content-between w-100"
        style={{ zIndex: 2 }}
      >
        <h6 className="games-popup-title mb-0">Details</h6>
        <img
          src={xMark}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={onClose}
        />
      </div>
      <ul
        className="d-flex flex-column gap-2 ms-3"
        style={{ listStyle: "inside", listStylePosition: "initial" }}
      >
        <li
          className="bundle-popup-list-item"
          style={{ listStyle: "inside", listStylePosition: "initial" }}
        >
          Once you lock the required DYP, a contact form will appear to initiate
          collaboration with our team.
        </li>
        <li
          className="bundle-popup-list-item"
          style={{ listStyle: "inside", listStylePosition: "initial" }}
        >
          The full amount of locked tokens will be returned after the lock
          period ends, ensuring no cost to the user.
        </li>
        <li
          className="bundle-popup-list-item"
          style={{ listStyle: "inside", listStylePosition: "initial" }}
        >
          Free support for builders is included in every plan, ensuring a smooth
          experience as we bring your vision to life.
        </li>
        <li
          className="bundle-popup-list-item"
          style={{ listStyle: "inside", listStylePosition: "initial" }}
        >
          Enjoy ongoing communication and regular updates throughout the
          development process to keep you fully involved.
        </li>
      </ul>
      <div className="d-flex align-items-center justify-content-start w-100">
        {activeBundle === 1 ? (
          <Checkbox checked={terms} onChange={() => setTerms(!terms)} />
        ) : activeBundle === 2 ? (
          <Checkbox checked={terms2} onChange={() => setTerms2(!terms2)} />
        ) : (
          <Checkbox checked={terms3} onChange={() => setTerms3(!terms3)} />
        )}
        <span className="bundle-tos">
          I agree to the{" "}
          <NavLink
            target="_blank"
            to={"/bundles-terms-of-service"}
            className="bundle-tos-green"
            style={{ color: "#3DBDA7", textDecoration: "underline" }}
          >
            Terms Of Service
          </NavLink>
        </span>
      </div>
      <div
        className="d-flex align-items-center w-100 justify-content-between pb-1"
        style={{ borderBottom: "2px solid rgba(192, 203, 247, 0.30)" }}
      >
        <span className="not-enough-dyp">Don't have enough DYP?</span>
        <NavLink
          target="_blank"
          to={"/buydyp"}
          className="d-flex align-items-center gap-1"
        >
          <img src={getDypIcon} alt="" />
          <span className="bundle-get-dyp">Get DYP</span>
        </NavLink>
      </div>
      <div className="d-flex w-100 align-items-center justify-content-between">
        <span className="bundle-deposit-title">Deposit</span>
        <div className="d-flex align-items-center gap-1">
          <span className="bundle-my-balance-span">My Balance:</span>
          <span className="bundle-dyp-balance">
            {getFormattedNumber(dypBalance)} DYP
          </span>
        </div>
      </div>
      <div className="bundle-amount-wrapper w-100 d-flex p-3 align-items-center justify-content-center flex-column ">
        <h6 className="mb-0 bundle-dyp-amount">
          {activeBundle === 1
            ? getFormattedNumber(bundlePrices.basic.priceInDyp, 0)
            : activeBundle === 2
            ? getFormattedNumber(bundlePrices.advanced.priceInDyp, 0)
            : getFormattedNumber(bundlePrices.enterprise.priceInDyp, 0)}{" "}
          DYP
        </h6>
        <span className="mb-0 bundle-usd-amount">
          $
          {activeBundle === 1
            ? getFormattedNumber(bundlePrices.basic.priceInUsd, 0)
            : activeBundle === 2
            ? getFormattedNumber(bundlePrices.advanced.priceInUsd, 0)
            : getFormattedNumber(bundlePrices.enterprise.priceInUsd, 0)}
        </span>
      </div>
      {activeBundle === 1 ? (
        <>
          {isConnected && chainId === 1 && (
            <button
              className={`btn ${
                terms && !depositLoading && depositStatus !== "fail"
                  ? "filledbtn"
                  : depositStatus === "fail"
                  ? "fail-button"
                  : "disabled-btn"
              } px-5 py-2`}
              disabled={!terms || depositLoading || depositStatus === "fail"}
              style={{ fontSize: "14px" }}
              onClick={() => {
                depositStatus === "initial"
                  ? handleApprove(bundlePrices.basic.priceInDyp)
                  : handleDeposit(bundlePrices.basic.priceInDyp);
              }}
            >
              {depositLoading ? (
                <div
                  class="spinner-border spinner-border-sm text-light"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : depositStatus === "initial" ? (
                <>Approve</>
              ) : depositStatus === "deposit" ? (
                <>Deposit</>
              ) : depositStatus === "success" ? (
                <>Success</>
              ) : (
                <>Failed</>
              )}
            </button>
          )}
          {isConnected && chainId !== 1 && (
            <button
              className="connectbtn btn m-auto"
              onClick={() => {
                handleSwitchNetwork();
              }}
            >
              Change Network
            </button>
          )}
          {!isConnected && (
            <button className="connectbtn btn m-auto" onClick={onConnectWallet}>
              <img
                src={"https://cdn.worldofdypians.com/tools/walletIcon.svg"}
                alt=""
              />{" "}
              Connect wallet
            </button>
          )}
        </>
      ) : activeBundle === 2 ? (
        <>
          {isConnected && chainId === 1 && (
            <button
              className={`btn ${
                terms2 && !depositLoading2 && depositStatus2 !== "fail"
                  ? "filledbtn"
                  : depositStatus2 === "fail"
                  ? "fail-button"
                  : "disabled-btn"
              } px-5 py-2`}
              disabled={!terms2 || depositLoading2 || depositStatus2 === "fail"}
              style={{ fontSize: "14px" }}
              onClick={() => {
                depositStatus2 === "initial"
                  ? handleApprove2(bundlePrices.advanced.priceInDyp)
                  : handleDeposit2(bundlePrices.advanced.priceInDyp);
              }}
            >
              {depositLoading2 ? (
                <div
                  class="spinner-border spinner-border-sm text-light"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : depositStatus2 === "initial" ? (
                <>Approve</>
              ) : depositStatus2 === "deposit" ? (
                <>Deposit</>
              ) : depositStatus2 === "success" ? (
                <>Success</>
              ) : (
                <>Failed</>
              )}
            </button>
          )}
          {isConnected && chainId !== 1 && (
            <button
              className="connectbtn btn m-auto"
              onClick={() => {
                handleSwitchNetwork();
              }}
            >
              Change Network
            </button>
          )}
          {!isConnected && (
            <button className="connectbtn btn m-auto" onClick={onConnectWallet}>
              <img
                src={"https://cdn.worldofdypians.com/tools/walletIcon.svg"}
                alt=""
              />{" "}
              Connect wallet
            </button>
          )}
        </>
      ) : (
        <>
          {isConnected && chainId === 1 && (
            <button
              className={`btn ${
                terms3 && !depositLoading3 && depositStatus3 !== "fail"
                  ? "filledbtn"
                  : depositStatus3 === "fail"
                  ? "fail-button"
                  : "disabled-btn"
              } px-5 py-2`}
              disabled={!terms3 || depositLoading3 || depositStatus3 === "fail"}
              style={{ fontSize: "14px" }}
              onClick={() => {
                depositStatus2 === "initial"
                  ? handleApprove3(bundlePrices.enterprise.priceInDyp)
                  : handleDeposit3(bundlePrices.enterprise.priceInDyp);
              }}
            >
              {depositLoading3 ? (
                <div
                  class="spinner-border spinner-border-sm text-light"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : depositStatus3 === "initial" ? (
                <>Approve</>
              ) : depositStatus3 === "deposit" ? (
                <>Deposit</>
              ) : depositStatus3 === "success" ? (
                <>Success</>
              ) : (
                <>Failed</>
              )}
            </button>
          )}
          {isConnected && chainId !== 1 && (
            <button
              className="connectbtn btn m-auto"
              onClick={() => {
                handleSwitchNetwork();
              }}
            >
              Change Network
            </button>
          )}
          {!isConnected && (
            <button className="connectbtn btn m-auto" onClick={onConnectWallet}>
              <img
                src={"https://cdn.worldofdypians.com/tools/walletIcon.svg"}
                alt=""
              />{" "}
              Connect wallet
            </button>
          )}
        </>
      )}
      {errorMsg && <h6 className="errormsg m-0">{errorMsg}</h6>}
      {errorMsg2 && <h6 className="errormsg m-0">{errorMsg2}</h6>}
      {errorMsg3 && <h6 className="errormsg m-0">{errorMsg3}</h6>}
    </div>
  );
};

export default BundlePopup;
