import React, { useState } from "react";
import walletIcon from "../assets/wallet.svg";
import votesIcon from "../assets/votesIcon.svg";
import tooltipIcon from "../assets/tooltipIcon.svg";
import dropdownIndicator from "../assets/dropdownIndicator.svg";

const GovernanceBalance = () => {
  const [proposalType, setProposalType] = useState("disburse");

  const tooltipButton = document.getElementById("tooltip-icon");
  const tooltip = document.querySelector(".tooltip-wrapper");

  const showTooltip = () => {
    tooltip.classList.add("tooltip-wrapper-show");
  };

  const hideTooltip = () => {
    tooltip.classList.remove("tooltip-wrapper-show");
  };

  tooltipButton?.addEventListener("mouseenter", showTooltip);
  tooltipButton?.addEventListener("mouseleave", hideTooltip);

  const dropdownPools = [
    {
      title: "Ether Pools",
      icon: "eth.svg",
    },
    {
      title: "BNB Pools",
      icon: "bnb.svg",
    },
    {
      title: "AVAX Pools",
      icon: "avax.svg",
    },
  ];

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPool, setSelectedPool] = useState(dropdownPools[0]);

  return (
    <div className="row w-100 mt-5 justify-content-between ">
      <div className="col-5 ps-0">
        <div className="submit-proposal-wrapper p-4 position-relative">
          <div className="tooltip-wrapper p-3">
            <p className="tooltip-content">
              Submitting a proposal requires a minimum of 0.00 DYP Governance
              Token Balance
            </p>
          </div>
          <div className="d-flex w-100 justify-content-between align-items-center">
            <h3
              className="text-white"
              style={{ fontSize: "19px", fontWeight: "600" }}
            >
              Submit a proposal
            </h3>
            <img
              src={tooltipIcon}
              id="tooltip-icon"
              alt=""
              width={25}
              height={25}
            />
          </div>
          <div className="proposal-types mt-4">
            <span
              className={`proposal-type ${
                proposalType === "disburse" && "proposal-type-active"
              }`}
              onClick={() => setProposalType("disburse")}
            >
              Disburse/Burn
            </span>
            <span
              className={`proposal-type ${
                proposalType === "other" && "proposal-type-active"
              }`}
              onClick={() => setProposalType("other")}
            >
              Other/Free Text
            </span>
          </div>
          {proposalType === "disburse" ? (
            <div className="position-relative my-4">
              <h6 className="amount-txt">Select pool</h6>
              <div
                className="styledinput d-flex justify-content-between align-items-center px-2"
                style={{ width: "60%", cursor: "pointer" }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={
                      require(`../../calculator/assets/${selectedPool.icon}`)
                        .default
                    }
                    alt=""
                  />
                  <span
                    className="text-white"
                    style={{ fontSize: "15px", fontWeight: "500" }}
                  >
                    {selectedPool.title}
                  </span>
                </div>
                <img
                  src={dropdownIndicator}
                  alt=""
                  style={{ minHeight: "20px", minWidth: "20px" }}
                />
              </div>
              <div
                className={`${
                  showDropdown ? "d-flex" : "d-none"
                } pools-dropdown styledinput h-auto p-2 flex-column gap-3`}
              >
                {dropdownPools.map((pool, index) => (
                  <div
                    key={index}
                    className="pool-item p-2 d-flex align-items-center justify-content-start gap-2"
                    onClick={() => {
                      setSelectedPool(pool);
                      setShowDropdown(false);
                    }}
                  >
                    <img
                      src={
                        require(`../../calculator/assets/${pool.icon}`).default
                      }
                      alt=""
                    />
                    <span
                      className="text-white"
                      style={{ fontSize: "15px", fontWeight: "500" }}
                    >
                      {pool.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="position-relative mt-4">
              <h6 className="amount-txt">Enter proposal text</h6>
              <textarea
                type={"text"}
                className="styledinput w-100 h-100"
                rows={5}
              />
            </div>
          )}

          <hr className="balance-divider" />
          <button className="btn filledbtn w-100 withdraw-btn">
            Submit proposal
          </button>
        </div>
      </div>
      <div className="col-7 pe-0">
        <div className="balance-wrapper d-flex flex-column position-relative p-4">
          <div className="purplediv" style={{ background: "#7770E0" }}></div>
          <div className="d-flex w-100 justify-content-between">
            <div className="d-flex flex-column align-items-start gap-2">
              <div className="d-flex gap-2 justify-content-center align-items-center">
                <img src={walletIcon} alt="" />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "400",
                    color: "#7770E0",
                  }}
                >
                  My DYP Balance
                </span>
              </div>
              <h4
                style={{
                  fontSize: "21px",
                  fontWeight: "500",
                  color: "#C0CBF7",
                }}
              >
                346.1321321 DYP
              </h4>
            </div>
            <div className="d-flex flex-column align-items-start gap-2">
              <div className="d-flex gap-2 justify-content-center align-items-center">
                <img src={votesIcon} alt="" />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "400",
                    color: "#7770E0",
                  }}
                >
                  My number of votes
                </span>
              </div>
              <h4
                style={{
                  fontSize: "21px",
                  fontWeight: "500",
                  color: "#C0CBF7",
                }}
              >
                0 DYP
              </h4>
            </div>
          </div>
          <hr className="balance-divider" />
          <div className="d-flex w-100 justify-content-between">
            <div className="col-5 d-flex flex-column align-items-start gap-3">
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "400",
                  color: "#7770E0",
                }}
              >
                Total in voting
              </span>
              <div className="total-votes-dyp">0.000000 DYP</div>
            </div>
            <div className="col-6 d-flex justify-content-center align-items-end">
              <button className="btn green-btn w-100 withdraw-btn">
                Withdraw All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceBalance;
