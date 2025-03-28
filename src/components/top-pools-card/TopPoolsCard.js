import React, { useEffect, useState } from "react";
import "./top-pools.css";

const TopPoolsCard = ({
  isAccount,
  tokenLogo,
  cardId,
  tokenName,
  apr,
  lockTime,
  tvl,
  onShowDetailsClick,
  onHideDetailsClick,
  top_pick,
  cardType,
  chain,
  renderedPage,
  details,
  isStaked,
  isNewPool,
  tag,
  display,
  expired,
  network,
  isPremium,
}) => {
  const ethCoins = ["ethereum", "wbtc", "usdc", "usdt"];
  const bscCoins = [
    "bsc",
    "btcb",
    "ethereum",
    "busd",
    "pancakeswap",
    "idypius",
  ];
  const bscCoins2 = ["bsc"];
  const avaxCoins = [
    "avax",
    "ethereum",
    "wbtc",
    "usdt",
    "usdc",
    "dai",
    "idypius",
    "pangolin",
    "benqi",
    "xava",
    "link",
  ];

  const avaxCoins2 = ["avax"];

  const [showDetails, setShowDetails] = useState(false);
  const [coins, setCoins] = useState(ethCoins);

  const handleDetails = () => {
    if (details === false) {
      setShowDetails(true);
      onShowDetailsClick();
    } else if (details === true) {
      setShowDetails(false);
      onHideDetailsClick();
    }
  };

  useEffect(() => {
    if (chain === "eth") {
      setCoins(ethCoins);
    } else if (chain === "bnb" && expired === false) {
      setCoins(bscCoins2);
    } else if (chain === "bnb" && expired === true) {
      setCoins(bscCoins);
    } else if (chain === "avax" && expired === false) {
      setCoins(avaxCoins2);
    } else if (chain === "avax" && expired === true) {
      setCoins(avaxCoins);
    }
  }, [chain]);

  return (
    <>
      <div
        className={`${
          expired === true
            ? "poolscardwrapperexpired"
            : network === "0"
            ? "blurryCard"
            : "poolscardwrapper"
        } cursor-pointer position-relative ${details && "pools-card-open"}  ${
          renderedPage === "dashboard" && !details ? "pools-card-hover" : ""
        }`}
        onClick={() => handleDetails()}
        style={{ display: display }}
      >
        {isStaked && isPremium && (
          <img
            src={"https://cdn.worldofdypians.com/tools/staked.svg"}
            className="staked"
            alt="staked"
            style={{ right: isAccount === true ? 60 : "" }}
          />
        )}
        {top_pick === true && (
          <img
            src={"https://cdn.worldofdypians.com/tools/toppick.svg"}
            className="toppick"
            alt="top pick"
          />
        )}
        {tvl === "--" && (
          <img
            src={"https://cdn.worldofdypians.com/tools/comingSoon.svg"}
            className="comingsoon"
            alt="top pick"
          />
        )}
        {isNewPool && (
          <img
            src={"https://cdn.worldofdypians.com/tools/newPool.png"}
            className="new-pool"
            alt="new pool"
          />
        )}
        {tag && (
          <img
            src={
              tag === "stake"
                ? "https://cdn.worldofdypians.com/tools/stakeTag.svg"
                : tag === "vault"
                ? "https://cdn.worldofdypians.com/tools/vaultTag.svg"
                : tag === "nft"
                ? "https://cdn.worldofdypians.com/tools/cawsLabel.svg"
                : "https://cdn.worldofdypians.com/tools/buybackTag.svg"
            }
            alt="pool-tag"
            className="dashboard-pool-tag d-none d-lg-flex"
          />
        )}

        <div
          className="purplediv"
          style={{ background: details ? "#7770e0" : "#8890C4", top: "12px" }}
        ></div>
        <div className="d-flex flex-column gap-0">
          <div className="d-flex m-0 justify-content between gap-2 align-items-center justify-content-between title-apr-wrapper">
            <div className="d-flex align-items-center">
              {(cardType === "Farming" || cardType === "Buyback") &&
              tokenLogo !== "bsc.svg"
                ? coins.length > 0 &&
                  coins.slice(0, 5).map((coin, index) => (
                    <h6 className="token-name d-flex align-items-center gap-2">
                      <img
                        key={index}
                        src={`https://cdn.worldofdypians.com/tools/${coin}.svg`}
                        alt=""
                        className="pool-coins"
                      />
                      {tokenName}
                    </h6>
                  ))
                : tokenLogo !== undefined && (
                    <h6 className="token-name d-flex align-items-center gap-2">
                      <img
                        src={`https://cdn.worldofdypians.com/tools/${tokenLogo}`}
                        alt=""
                        className="tokenlogo"
                        width={32}
                        height={32}
                      />{" "}
                      {tokenName}
                    </h6>
                  )}
            </div>
            <div className="d-flex align-items-baseline gap-1">
              <h6 className="apr-amount">{apr}</h6>
              <h6 className="apr-title">APR</h6>
            </div>
          </div>
          <div
            className={`d-flex m-0 justify-content between gap-2 align-items-center justify-content-between ${
              expired === true ? "bottomwrapperExpired" : "bottomwrapper"
            } } `}
          >
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

              <h6 className="locktime-amount">{lockTime}</h6>
            </div>
          </div>
          {tvl != "--" && (
            <div
              className={
                expired === true ? "details-wrapperexpired" : "details-wrapper"
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
                {details === false && expired === false
                  ? "Deposit"
                  : details === false && expired === true
                  ? "Details"
                  : "Close"}
                <img
                  src={
                    details === false && expired === false
                      ? "https://cdn.worldofdypians.com/tools/greenarrow.svg"
                      : details === false && expired === true
                      ? "https://cdn.worldofdypians.com/tools/purpleArrow.svg"
                      : details === true && expired === true
                      ? "https://cdn.worldofdypians.com/tools/orangearrow.svg"
                      : "https://cdn.worldofdypians.com/tools/orangearrow.svg"
                  }
                  alt=""
                />
              </h6>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopPoolsCard;
