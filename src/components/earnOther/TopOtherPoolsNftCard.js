import React, { useEffect, useState } from "react";
import "../top-pools-card/top-pools.css";
import greenArrow from "../top-pools-card/assets/greenarrow.svg";
import purpleArrow from "../top-pools-card/assets/purpleArrow.svg";

import orangeArrow from "../top-pools-card/assets/orangearrow.svg";
import newPool from "../top-pools-card/assets/newPool.png";
import staked from "../top-pools-card/assets/staked.svg";
import topPick from "../top-pools-card/assets/toppick.svg";
import stakeTag from "../../assets/earnAssets/stakeTag.svg";
import vaultTag from "../../assets/earnAssets/vaultTag.svg";
import cawsLabel from "../top-pools-card/assets/cawsLabel.svg";

import buybackTag from "../../assets/earnAssets/buybackTag.svg";

const TopOtherPoolsNftCard = ({
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
}) => {
  const ethCoins = ["ethereum", "wbtc", "usdc", "usdt"];
 
  const [showDetails, setShowDetails] = useState(false);
  const [coins, setCoins] = useState(ethCoins);

  // console.log(network)

  return (
    <>
      <div
        className={`${
          expired === true
            ? "poolscardwrapperexpired"
            : network === "0"
            ? "blurryCard"
            : "poolscardwrapper"
        } cursor-pointer position-relative ${
          showDetails && "pools-card-open"
        }  ${
          renderedPage === "dashboard" && !showDetails ? "pools-card-hover" : ""
        }`}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
        style={{ display: display }}
      >
        {isStaked && (
          <img
            src={staked}
            className="staked"
            alt="staked"
            style={{ right: isAccount === true ? 60 : "" }}
          />
        )}
        {top_pick === true && (
          <img src={topPick} className="toppick" alt="top pick" />
        )}
        {isNewPool && <img src={newPool} className="new-pool" alt="new pool" />}
        {tag && (
          <img
            src={
              tag === "stake"
                ? stakeTag
                : tag === "vault"
                ? vaultTag
                : tag === "nft"
                ? cawsLabel
                : buybackTag
            }
            alt="pool-tag"
            className="dashboard-pool-tag d-none d-lg-flex"
          />
        )}

        <div
          className="purplediv"
          style={{
            background: showDetails ? "#7770e0" : "#8890C4",
            top: "12px",
          }}
        ></div>
        <div className="d-flex flex-column gap-0">
          <div className="d-flex m-0 justify-content between gap-2 align-items-center justify-content-between title-apr-wrapper">
            <div className="d-flex align-items-center">
              {cardType === "Farming" || cardType === "Buyback"
                ? coins.length > 0 &&
                  coins.slice(0, 5).map((coin, index) => (
                    <h6 className="token-name d-flex align-items-center gap-2">
                      <img
                        key={index}
                        src={
                          require(`../top-pools-card/assets/${coin}.svg`)
                            .default
                        }
                        alt=""
                        className="pool-coins"
                      />
                      {tokenName}
                    </h6>
                  ))
                : tokenLogo !== undefined && (
                    <h6 className="token-name d-flex align-items-center gap-2">
                      <img
                        src={
                          require(`../top-pools-card/assets/${tokenLogo}`)
                            .default
                        }
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
                <h6 className="tvl-text">Network</h6>
                <h6 className="tvl-amount">{chain}</h6>
              </div>
            )}
            <div
              className={`d-flex flex-column ${
                cardType !== "Vault" && "align-items-end"
              }`}
            >
              <h6 className="tvl-text">Method</h6>

              <h6 className="locktime-amount">{lockTime}</h6>
            </div>
          </div>
          <div
            className={
              expired === true ? "details-wrapperexpired" : "details-wrapper"
            }
          >
            <h6
              className="details-text gap-1 d-flex align-items-center"
              style={{
                color: "#75CAC2",
              }}
            >
              Stake
              <img
                src={greenArrow}
                alt=""
                style={{ transform: "rotate(270deg)" }}
              />
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopOtherPoolsNftCard;
