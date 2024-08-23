import React, { useState } from "react";
import "./whitelist.css";
import dyp from "./assets/dyp.svg";
import idyp from "./assets/idyp.svg";
import premium from "./assets/premium.png";
import tooltipIcon from "./assets/tooltipIcon.svg";
import usdt from "./assets/usdt.svg";
import eth from "./assets/eth.svg";
import bnb from "./assets/bnb.svg";
import dropArrow from "./assets/dropArrow.svg";
import { shortAddress } from "../../functions/shortAddress";
import getFormattedNumber from "../../functions/get-formatted-number";
import { Tooltip } from "@material-ui/core";
import usdc from "./assets/usdc.svg";
import checkIcon from "./assets/checkIcon.svg";
import OutsideClickHandler from "react-outside-click-handler";
import buyToken from "./assets/buyToken.svg";

const Whitelist = ({ networkId, isConnected, handleConnection, coinbase }) => {
  const dummyTable = [
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Successful",
    },
    {
      date: "25 Aug 2024",
      network: "Ethereum",
      networkIcon: eth,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Approved",
    },
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Refund",
    },
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Successful",
    },
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Successful",
    },
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Successful",
    },
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Successful",
    },
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Successful",
    },
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Successful",
    },
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Successful",
    },
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Successful",
    },
    {
      date: "25 Aug 2024",
      network: "BNB Chain",
      networkIcon: bnb,
      wallet: "0x7FB568db21Af9B9adab8b9bDb5a4dD05a3283c6C",
      commited: 22500,
      amount: 22500000,
      status: "Successful",
    },
  ];

  const [coinDropdown, setCoinDropdown] = useState(false);
  const [chainDropdown, setChainDropdown] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({
    coin: "USDT",
    icon: usdt,
  });
  const [selectedChain, setSelectedChain] = useState({
    chain: "BNB Chain",
    icon: bnb,
  });

  const [slice, setSlice] = useState(5);
  const [loading, setLoading] = useState(false);

  const requirements = [
    {
      icon: dyp,
      coin: "DYP Token",
      value: "Holder/Staker",
      active: false,
    },
    {
      icon: idyp,
      coin: "iDYP Token",
      value: "Holder/Staker",
      active: true,
    },
    {
      icon: premium,
      coin: "Premium",
      value: "Subscriber",
      active: true,
    },
  ];

  const handleViewMore = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (slice >= dummyTable.length) {
        setSlice(5);
      } else {
        setSlice(slice + 3);
      }
    }, 2000);
  };

  return (
    <div className="container-lg p-0">
      <div className="whitelist-banner d-flex flex-column flex-lg-row p-4 gap-3 gap-lg-0 align-items-center mb-4">
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-3">
            <h6 className="migration-banner-title mb-0">WOD Token Whitelist</h6>
            <p className="migration-banner-desc mb-0">
              WOD Token Whitelist grants early access to our exclusive token
              sale. Join now to secure your spot and be among the first to
              unlock unique benefits within the World of Dypians ecosystem.
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-4 d-flex justify-content-center justify-content-lg-end">
          <div className="position-relative d-flex align-items-center flex-column">
            <div className="commiting-wrapper p-3">
              <div className="d-flex flex-column gap-2">
                <span className="commiting-amount">$123k</span>
                <span className="migration-status-text-2">
                  Total Committed Value
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="whitelist-info-grid">
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Token Distribution</span>
          <h6 className="mb-0 whitelist-info-title">Private Round</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Token Price</span>
          <h6 className="mb-0 whitelist-info-title">$0.0325</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Fully Market Cap</span>
          <h6 className="mb-0 whitelist-info-title">$42,500,000</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Cliff/Vesting Period</span>
          <h6 className="mb-0 whitelist-info-title">3/16 Months</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Network</span>
          <div className="d-flex align-items-center gap-2">
            <img src={bnb} width={24} height={24} alt="" />
            <h6 className="mb-0 whitelist-info-title">BNB Chain</h6>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 col-lg-7">
          <div className="whitelist-info-item d-flex flex-column w-100 p-3 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0 whitelist-deposit-title">Whitelist</h6>
                <span className="whitelist-days-left">9 days left</span>
              </div>
              <img src={tooltipIcon} alt="" />
            </div>
            <div className="whitelist-deposit-wrapper mt-3  d-flex flex-column gap-2">
              <div className="whitelist-deposit-wrapper-header p-2 d-flex align-items-center justify-content-between">
                <span className="commitment-text">Commitment</span>
                <div className="d-flex align-items-center gap-1">
                  <span className="whitelist-my-balance">My Balance</span>
                  <span className="whitelist-my-balance-value">2500 WOD</span>
                </div>
              </div>
              <div className="d-flex flex-column gap-2 w-100 p-3">
                <div className="d-flex flex-column flex-lg-row align-items-center w-100 gap-2">
                  <div className="d-flex flex-column gap-1 commitment-deposit-wrapper">
                    <span className="commitment-input-span">Deposit</span>
                    <div className="d-flex align-items-center">
                      <div className="position-relative coin-select-dropdown">
                        {coinDropdown && (
                          <OutsideClickHandler
                            onOutsideClick={() => setCoinDropdown(false)}
                          >
                            <div className="coins-dropdown-list d-flex flex-column ">
                              <div
                                className="d-flex align-items-center gap-2 coin-dropdown-item p-2"
                                onClick={() => {
                                  setSelectedCoin({
                                    icon: usdt,
                                    coin: "USDT",
                                  });
                                  setCoinDropdown(false);
                                }}
                              >
                                <img src={usdt} width={20} height={20} alt="" />
                                <span className="whitelist-token-text">
                                  USDT
                                </span>
                              </div>
                              <div
                                className="d-flex align-items-center gap-2 coin-dropdown-item p-2"
                                onClick={() => {
                                  setSelectedCoin({
                                    icon: usdc,
                                    coin: "USDC",
                                  });
                                  setCoinDropdown(false);
                                }}
                              >
                                <img src={usdc} width={20} height={20} alt="" />
                                <span className="whitelist-token-text">
                                  USDC
                                </span>
                              </div>
                            </div>
                          </OutsideClickHandler>
                        )}
                        <div
                          className="text-input2 d-flex align-items-center justify-content-between coin-dropdown position-relative"
                          onClick={() => setCoinDropdown(true)}
                        >
                          <div className="d-flex align-items-center gap-1">
                            <img
                              src={selectedCoin.icon}
                              width={20}
                              height={20}
                              alt=""
                            />
                            <span className="whitelist-token-text">
                              {selectedCoin.coin}
                            </span>
                          </div>
                          <img src={dropArrow} alt="" />
                        </div>
                      </div>
                      <div className="position-relative coin-input d-flex">
                        <input
                          className="text-input2 commitment-input w-100"
                          style={{
                            height: "39px",
                            borderRadius: "0 8px 8px 0",
                          }}
                          type="number"
                          autoComplete="off"
                          name="amount_deposit"
                          id="amount_deposit"
                          key="amount_deposit"
                          placeholder={`100 USDT`}
                        />
                        <button className="inner-max-btn position-absolute">
                          Max
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="commitment-chain-wrapper d-flex flex-column gap-1 ms-2">
                    <span className="commitment-input-span">
                      Select Network
                    </span>
                    <div className="position-relative w-100">
                      {chainDropdown && (
                        <OutsideClickHandler
                          onOutsideClick={() => setChainDropdown(false)}
                        >
                          <div className="coins-dropdown-list d-flex flex-column ">
                            <div
                              className="d-flex align-items-center gap-2 coin-dropdown-item p-2"
                              onClick={() => {
                                setSelectedChain({
                                  icon: bnb,
                                  chain: "BNB Chain",
                                });
                                setChainDropdown(false);
                              }}
                            >
                              <img src={bnb} width={20} height={20} alt="" />
                              <span className="whitelist-token-text">
                                BNB Chain
                              </span>
                            </div>
                            <div
                              className="d-flex align-items-center gap-2 coin-dropdown-item p-2"
                              onClick={() => {
                                setSelectedChain({
                                  icon: eth,
                                  chain: "Ethereum",
                                });
                                setChainDropdown(false);
                              }}
                            >
                              <img src={eth} width={20} height={20} alt="" />
                              <span className="whitelist-token-text">
                                Ethereum
                              </span>
                            </div>
                          </div>
                        </OutsideClickHandler>
                      )}
                      <div
                        className="text-input2 d-flex align-items-center justify-content-between"
                        style={{ height: "39px", cursor: "pointer" }}
                        onClick={() => setChainDropdown(true)}
                      >
                        <div className="d-flex align-items-center gap-1">
                          <img
                            src={selectedChain.icon}
                            width={20}
                            height={20}
                            alt=""
                          />
                          <span className="whitelist-token-text">
                            {selectedChain.chain}
                          </span>
                        </div>
                        <img src={dropArrow} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-2 gap-1">
                  <span className="commitment-input-span">Estimation:</span>
                  <span className="wod-tokens-commited">200,000 WOD</span>
                  <span className="commitment-input-span">
                    (distributed on BNB Chain)
                  </span>
                </div>
              </div>
              <div className="d-flex w-100 justify-content-center mb-3">
                <button className="btn filledbtn">Deposit</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <div className="d-flex flex-column gap-2">
            <div className="my-commitment-wrapper py-4 w-100 d-flex flex-column align-items-center gap-2">
              <h6 className="mb-0 my-commitment-value">$22,435</h6>
              <span className="my-commitment-span">My Commitment</span>
            </div>
            <div className="whitelist-info-item d-flex flex-column w-100 p-3">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="mb-0 whitelist-deposit-title">Requirements</h6>
                <Tooltip
                  title={
                    <>
                      <div className="whitelist-tooltip-content-text">
                        You only need to complete one of the requirements to be
                        eligible for the whitelist.
                      </div>
                    </>
                  }
                >
                  <img src={tooltipIcon} alt="" />
                </Tooltip>
              </div>
              <div className="requirements-grid mt-3">
                {requirements.map((item, index) => (
                  <div
                    key={index}
                    className={`requirements-item ${
                      item.active && "requirements-active"
                    } p-3 d-flex align-items-center justify-content-center gap-2`}
                  >
                    {item.active && (
                      <img src={checkIcon} className="req-check" alt="" />
                    )}
                    <img src={item.icon} height={36} width={36} alt="" />
                    <div className="d-flex flex-column gap-1">
                      <span className="requirement-token">{item.coin}</span>
                      <span className="requirement-title">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="requirements-divider mt-3"></div>
              <span className="eligible-span mt-3">
                You are eligible for the whitelist.
              </span>
              {/* <div className="req-buy-dyp-wrapper mt-2 d-flex align-items-center justify-content-between w-100 p-2">
                <span className="req-buy-dyp">Buy DYP tokens to become eligible for the whitelist</span>
                <img src={buyToken} alt="" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="whitelist-info-item-2 d-flex flex-column">
            <div className="d-flex align-items-center p-3 justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0 whitelist-deposit-title">
                  Commitment History
                </h6>
              </div>
              <Tooltip
                title={
                  <>
                    <div className="d-flex flex-column gap-2">
                      <span className="whitelist-tooltip-content-text">
                        After making a commitment, your status will initially be
                        set to <b>Successful.</b>
                      </span>
                      <span className="whitelist-tooltip-content-text">
                        Once the team reviews your commitment, there are two
                        possible outcomes:
                      </span>
                      <ul>
                        <li className="whitelist-tooltip-content-text mb-2">
                          <b>Approved:</b> You are eligible to receive the WOD
                          token.
                        </li>
                        <li className="whitelist-tooltip-content-text mb-2">
                          <b>Refund:</b> You can withdraw your initial
                          commitment.
                        </li>
                      </ul>
                    </div>
                  </>
                }
              >
                <img src={tooltipIcon} alt="" />
              </Tooltip>
            </div>
            <div className="outer-table-wrapper p-3">
              <table
                border={0}
                className="table item-history-table"
                style={{ borderSpacing: "10px" }}
              >
                <thead className="item-history-table-thead">
                  <th className="item-history-table-th text-center">No.</th>
                  <th className="item-history-table-th text-center">Date</th>
                  <th className="item-history-table-th text-center">Network</th>
                  <th className="item-history-table-th text-center">Wallet</th>
                  <th className="item-history-table-th text-center">
                    Commited
                  </th>
                  <th className="item-history-table-th text-center">
                    WOD Amount
                  </th>
                  <th className="item-history-table-th text-center">Status</th>
                </thead>
                <tbody>
                  {dummyTable.slice(0, slice).map((item, index) => (
                    <tr key={index}>
                      <td className="item-history-table-td first-td left-border">
                        #{index + 1}
                      </td>
                      <td className="item-history-table-td text-center">
                        {item.date}
                      </td>
                      <td className="item-history-table-td text-center">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <img src={item.networkIcon} alt="" />
                          {item.network}
                        </div>
                      </td>
                      <td className="item-history-table-td table-greentext text-center">
                        {shortAddress(item.wallet)}
                      </td>
                      <td className="item-history-table-td text-center">
                        {getFormattedNumber(item.commited, 0)} USDT
                      </td>
                      <td className="item-history-table-td right-border text-center">
                        {getFormattedNumber(item.amount, 0)} WOD
                      </td>
                      <td className="item-history-table-td last-td table-greentext right-border text-center">
                        {item.status === "Refund" ? (
                          <button className="refund-btn">{item.status}</button>
                        ) : (
                          <>{item.status}</>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {loading && (
              <div className="d-flex w-100 justify-content-center">
                <div class="spinner-border text-info" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <div className="d-flex my-3 w-100 align-items-center justify-content-center">
              <button className="btn filledbtn" onClick={handleViewMore}>
                {slice >= dummyTable.length ? "View Less" : "View More"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whitelist;
