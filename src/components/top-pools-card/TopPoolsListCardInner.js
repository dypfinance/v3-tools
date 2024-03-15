import React, { useEffect, useState } from "react";
import greenArrow from "./assets/greenarrow.svg";
import orangeArrow from "./assets/orangearrow.svg";
import topPick from "./assets/toppick.svg";
import comingSoonTag from "./assets/comingSoonTag.svg";

import newPool from "./assets/newPool.png";
import getFormattedNumber from "../../functions/get-formatted-number";
import "./top-pools.css";
import StakeBscOtherDai from "../earnOther/poolFiles/bscConstantStakeOtherDai";
import StakeBscOther from "../earnOther/poolFiles/bscConstantStakeOther";

import StakeAvaxDai from "../FARMINNG/stakeAvax3";
import StakeAvax from "../FARMINNG/stakeAvax";

const TopPoolsListCardInner = ({
  tokenLogo,
  cardId,
  poolCap,
  tokenName,
  apr,
  lockTime,
  tvl,
  onShowDetailsClick,
  theBnbPool,
  onHideDetailsClick,
  top_pick,
  comingSoon,
  isNewPool,
  cardType,
  chain,
  topList,
  cardIndex,
  chainId,
  handleConnection,
  handleSwitchNetwork,
  coinbase,
  referrer,
  isConnected,
  the_graph_result,
  lp_id,
  the_graph_resultavax,
  the_graph_resultbsc,
  listType,
  display,
  expired,
  expiredPools,
  activePools,
  totalTvl,
  totalNftsLocked,
  isPremium,
  network,
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
  const [cardIndexiDyp, setcardIndexiDyp] = useState();
  const [cardIndexavax30, setcardIndexavax30] = useState();
  const [cardIndexavaxiDyp, setcardIndexavaxiDyp] = useState();

  const eth_address = "ETH";
  const wbnb_address = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
  const wbsc_address = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";

  const cawswodcoins = ["newCawsLogo", "lanft-poolicon"];

  const [mystakes, setMystakes] = useState([]);

  const getStakesIds = async () => {
    const address = coinbase;
    let staking_contract = await window.getContractNFT("NFTSTAKING");
    let stakenft = [];
    if (address) {
      let myStakes = await staking_contract.methods
        .depositsOf(address)
        .call()
        .then((result) => {
          for (let i = 0; i < result.length; i++)
            stakenft.push(parseInt(result[i]));
          return stakenft;
        });

      return myStakes;
    }
  };

  const myStakes = async () => {
    let myStakes = await getStakesIds();

    let stakes = myStakes.map((stake) => window.getNft(stake));

    stakes = await Promise.all(stakes);
    stakes.reverse();
    setMystakes(stakes);
  };

  const { LP_IDs_V2Avax, LP_IDs_V2BNB } = window;

  const LP_IDAVAX_Array = [
    LP_IDs_V2Avax.wavax[0],
    LP_IDs_V2Avax.wavax[1],
    LP_IDs_V2Avax.wavax[2],
    LP_IDs_V2Avax.wavax[3],
    LP_IDs_V2Avax.wavax[4],
  ];

  const feeUarrayStakeAvaxiDyp = [0.25, 0.25, 0, 0];

  const withdrawFeeiDyp = [0, 0];

  const LP_IDBNB_Array = [
    LP_IDs_V2BNB.wbnb[0],
    LP_IDs_V2BNB.wbnb[1],
    LP_IDs_V2BNB.wbnb[2],
    LP_IDs_V2BNB.wbnb[3],
    LP_IDs_V2BNB.wbnb[4],
  ];

  const handleDetails = () => {
    if (!comingSoon) {
      if (showDetails === false) {
        setShowDetails(true);
        // onShowDetailsClick();
      } else if (showDetails === true) {
        setShowDetails(false);
      }
    }
  };

  useEffect(() => {
    if (chain === "eth") {
      // myStakes();
      setCoins(ethCoins);
    } else if (chain === "bnb" && expired === false) {
      setCoins(bscCoins2);
    } else if (chain === "bnb" && expired === true) {
      setCoins(bscCoins);
    } else if (chain === "avax" && expired === true) {
      setCoins(avaxCoins);
    } else if (chain === "avax" && expired === false) {
      setCoins(avaxCoins2);
    }
  }, [chain]);

  useEffect(() => {
    if (topList === "Staking") {
      if (cardIndex >= 2) {
        const newIndex = cardIndex - 2;
        setcardIndexiDyp(newIndex);
      }
    }

    if (topList === "Staking" && chain === "avax") {
      if (cardIndex >= 2) {
        const newIndex = cardIndex - 2;
        setcardIndexavax30(newIndex);
      }
    }

    if (topList === "Staking" && chain === "avax") {
      if (cardIndex >= 5) {
        const newIndex = cardIndex - 5;
        setcardIndexavaxiDyp(newIndex);
      }
    }
  }, [cardIndex, topList, chain]);

  return (
    <>
      <div
        className={`row w-100 flex-column gap-3 gap-lg-0 flex-lg-row align-items-center justify-content-between  mx-0 cursor-pointer position-relative ${
          expired === true
            ? "poolscardwrapperexpired"
            : showDetails === false
            ? "list-pool-card mb-2"
            : "list-pool-card-active"
        }`}
        onClick={() => handleDetails()}
        style={{ display: display }}
      >
        {isNewPool && <img src={newPool} alt="" className="new-pool2" />}
        <div className="col-12 col-lg-4 d-flex justify-content-between align-items-center">
          <div
            className={` d-flex align-items-center ${
              cardType === "Farming" || cardType === "Buyback" ? null : "gap-2"
            }`}
            style={{ width: "100px" }}
          >
            {cardType === "Farming" || cardType === "Buyback" ? (
              coins.length > 0 &&
              coins.slice(0, 5).map((coin, index) => (
                <>
                  <img
                    key={index}
                    src={require(`./assets/${coin}.svg`).default}
                    alt=""
                    className="pool-coins"
                  />
                  <h5
                    className="text-white mx-3"
                    style={{ fontSize: "25px", fontWeight: "600" }}
                  >
                    {tokenName}
                  </h5>
                </>
              ))
            ) : tokenLogo !== undefined && tokenLogo !== "landcaws" ? (
              <>
                <img
                  src={require(`./assets/${tokenLogo}`).default}
                  width={32}
                  height={32}
                  alt=""
                />
                <h5
                  className="text-white"
                  style={{ fontSize: "25px", fontWeight: "600" }}
                >
                  {tokenName}
                </h5>
              </>
            ) : (
              <>
                {coins.length > 0 &&
                  cawswodcoins.map((coin, index) => (
                    <img
                      key={index}
                      src={require(`./assets/${coin}.png`).default}
                      alt=""
                      className="pool-coins"
                    />
                  ))}
                <h5
                  className="text-white"
                  style={{ fontSize: "25px", fontWeight: "600" }}
                >
                  {tokenName}
                </h5>
              </>
            )}
          </div>
          <div className=" col-lg-4 d-flex flex-column gap-2">
            <div className="d-flex flex-column gap-2">
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "#C0C9FF",
                }}
              >
                APR
              </span>
              <h5
                style={{
                  fontSize: "18px",
                  fontWeight: "300",
                  color: "#F7F7FC",
                }}
              >
                {apr}%
              </h5>
            </div>
          </div>
        </div>
        <div className="d-flex col-12 col-lg-6 align-items-center justify-content-between">
          {cardType !== "Vault" && (
            <div className=" col-lg-4 d-flex flex-column gap-2">
              <div className="d-flex flex-column gap-2">
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "#C0C9FF",
                  }}
                >
                  Lock Time
                </span>
                <h5
                  style={{
                    fontSize: "18px",
                    fontWeight: "300",
                    color: "#F7F7FC",
                  }}
                >
                  {lockTime}
                </h5>
              </div>
            </div>
          )}
          <div className="col-lg-4 d-flex flex-column gap-2">
            <span
              style={{
                fontSize: "12px",
                fontWeight: "400",
                color: "#C0C9FF",
              }}
            >
              Pool Cap
            </span>
            <h5
              style={{
                fontSize: "20px",
                fontWeight: "500",
                color: "#F7F7FC",
              }}
            >
              {tokenName} {getFormattedNumber(poolCap, 0)}
            </h5>
          </div>
          <div className="d-none d-xxl-flex d-xl-flex d-lg-flex d-md-flex flex-column gap-2">
            {/* <div className="d-flex align-items-center gap-2 justify-content-between">
              <span className="rewardsleft-txt">Rewards left</span>
              <span className="rewardsleft-value">
                29.16{" "}
                {network === "Ethereum"
                  ? "WETH"
                  : network === "BNB Chain"
                  ? "WBNB"
                  : network === "Avalanche"
                  ? "WAVAX"
                  : "BASE"}{" "}
                (100%)
              </span>
            </div> */}

            <div className="progress-bar-wrapper" style={{ marginBottom: 0 }}>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `100%`, background: "#4ed5d2" }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-12 col-lg-2 d-flex justify-content-center justify-content-xxl-end justify-content-xl-end justify-content-lg-end justify-content-md-end gap-5"
          style={{ width: "170px" }}
        >
          {top_pick && <img src={topPick} alt="" />}
          {comingSoon && <img src={comingSoonTag} alt="" />}

          <h6
            className="details-text gap-1 d-flex align-items-center cursor-pointer justify-content-end"
            style={{
              color: showDetails === false ? "#75CAC2" : "#C0C9FF",
            }}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails === false ? "Deposit" : "Close"}
            <img
              src={showDetails === false ? greenArrow : orangeArrow}
              alt=""
            />
          </h6>
        </div>
      </div>
      {/* {expired === false ? (
        <>
          {showDetails &&
          activePools &&
          topList === "Staking" &&
          activePools[cardIndex - 1].id ===
            "0x215bD6eDa2A5372aeA17360c166761c4Eec60497" &&
          chain === "bnb" ? (
            <StakeBscOtherDai
              lp_id={LP_IDBNB_Array[cardIndex]}
              staking={window.constant_stakingotherdaibsc}
              apr={activePools[cardIndex - 1]?.apr}
              liquidity={wbsc_address}
              expiration_time={"5 August 2024"}
              finalApr={activePools[cardIndex - 1]?.apr}
              fee={10}
              lockTime={30}
              listType={listType}
              other_info={false}
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_resultbsc}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={false}
              referrer={referrer}
              showDetails={showDetails}
              isPremium={isPremium}
            />
          ) : showDetails &&
            activePools &&
            topList === "Staking" &&
            activePools[cardIndex - 1].id ===
              "0x8652d1817f5a95172001685a28facb1d57e78a11" &&
            chain === "bnb" ? (
            <StakeBscOther
              lp_id={LP_IDBNB_Array[cardIndex]}
              staking={window.constant_stakingbscother_new1}
              apr={activePools[cardIndex - 1]?.apr}
              liquidity={wbsc_address}
              expiration_time={"5 August 2023"}
              finalApr={activePools[cardIndex - 1]?.apr}
              fee={activePools[cardIndex - 1]?.apr}
              lockTime={
                30
              }
              listType={listType}
              other_info={
                activePools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_resultbsc}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={false}
              referrer={referrer}
              showDetails={showDetails}
              isPremium={isPremium}
            />
          ) : showDetails &&
            activePools &&
            topList === "Staking" &&
            activePools[cardIndex - 1].id ===
              "0x215bD6eDa2A5372aeA17360c166761c4Eec60497" &&
            chain === "avax" ? (
            <StakeAvaxDai
              lp_id={LP_IDBNB_Array[cardIndex]}
              staking={window.constant_stakingdaiavax}
              apr={activePools[cardIndex - 1]?.apr}
              liquidity={wbsc_address}
              expiration_time={"5 August 2023"}
              finalApr={activePools[cardIndex - 1]?.apr}
              fee={activePools[cardIndex - 1]?.apr}
              lockTime={
                activePools[cardIndex - 1]?.lockTime?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      activePools[cardIndex - 1]?.lockTime?.split(" ")[0]
                    )
              }
              listType={listType}
              other_info={
                activePools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_resultbsc}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={false}
              referrer={referrer}
              showDetails={showDetails}
              isPremium={isPremium}
            />
          ) : showDetails &&
            activePools &&
            topList === "Staking" &&
            activePools[cardIndex - 1].id ===
              "0x8652d1817f5a95172001685a28facb1d57e78a11" &&
            chain === "avax" ? (
            <StakeAvax
              lp_id={LP_IDBNB_Array[cardIndex]}
              staking={window.constant_staking_new11}
              apr={activePools[cardIndex - 1]?.apr}
              liquidity={wbsc_address}
              expiration_time={"5 August 2023"}
              finalApr={activePools[cardIndex - 1]?.apr}
              fee_s={activePools[cardIndex - 1]?.apr}
              lockTime={
                activePools[cardIndex - 1]?.lockTime?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      activePools[cardIndex - 1]?.lockTime?.split(" ")[0]
                    )
              }
              listType={listType}
              other_info={
                activePools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_resultbsc}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={false}
              referrer={referrer}
              showDetails={showDetails}
              isPremium={isPremium}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )} */}
    </>
  );
};

export default TopPoolsListCardInner;
