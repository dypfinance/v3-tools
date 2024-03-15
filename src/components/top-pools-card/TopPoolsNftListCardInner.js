import React, { useEffect, useState } from "react";
import greenArrow from "./assets/greenarrow.svg";
import orangeArrow from "./assets/orangearrow.svg";
import topPick from "./assets/toppick.svg";
import comingSoonTag from "./assets/comingSoonTag.svg";

import newPool from "./assets/newPool.png";
import getFormattedNumber from "../../functions/get-formatted-number";
import "./top-pools.css";
import LandDetails from "../FARMINNG/land";
import CawsDetails from "../FARMINNG/caws";
import CawsWodDetails from "../FARMINNG/cawsWod";
import axios from "axios";

const TopPoolsNftListCardInner = ({
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
  const [cardIndexDyp, setcardIndex] = useState();
  const [landCard, setLandCard] = useState({});

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

  const fetchEthStaking = async () => {
    const eth_result = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_eth`)
      .catch((err) => {
        console.log(err);
      });
    const eth_result2 = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_eth_new`)
      .catch((err) => {
        console.log(err);
      });

    if (
      eth_result &&
      eth_result.status === 200 &&
      eth_result2 &&
      eth_result2.status === 200
    ) {
      setLandCard(eth_result.data.stakingInfoLAND[0]);
    }
  };

  const myStakes = async () => {
    let myStakes = await getStakesIds();

    let stakes = myStakes.map((stake) => window.getNft(stake));

    stakes = await Promise.all(stakes);
    stakes.reverse();
    setMystakes(stakes);
  };

  const handleDetails = () => {
    if (!comingSoon) {
      if (showDetails === false) {
        setShowDetails(true);
        setcardIndex(cardIndex);
        // onShowDetailsClick();
      } else if (showDetails === true) {
        setShowDetails(false);
        setcardIndex();
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
        {" "}
        {isNewPool && <img src={newPool} alt="" className="new-pool2" />}
        <div className="col-12 col-lg-4 d-flex justify-content-between align-items-center">
          <div
            className={` d-flex align-items-center ${
              cardType === "Farming" || cardType === "Buyback" ? null : "gap-2"
            }`}
            style={{ width: "100px" }}
          >
            {tokenLogo !== undefined &&
            tokenLogo !== "landcaws" &&
            typeof tokenLogo === "string" ? (
              <>
                <img
                  src={require(`./assets/${tokenLogo}`).default}
                  width={32}
                  height={32}
                  alt=""
                />
                <h5
                  className="text-white"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  {tokenName}
                </h5>
              </>
            ) : tokenLogo !== undefined &&
              tokenLogo !== "landcaws" &&
              typeof tokenLogo !== "string" ? (
              <>
                {tokenLogo.length > 0 &&
                  tokenLogo.map((coin, index) => (
                    <img
                      key={index}
                      src={require(`./assets/${coin}`).default}
                      alt=""
                      className="pool-coins"
                    />
                  ))}

                <h5
                  className="text-white"
                  style={{ fontSize: "20px", fontWeight: "600" }}
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
                  style={{ fontSize: "20px", fontWeight: "600" }}
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
              { poolCap !== '∞' ? getFormattedNumber(poolCap, 0) : '∞'} {poolCap !== '∞' && 'CAWS'}
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
      {expired === true && showDetails ? (
        <>
          <CawsDetails
            coinbase={coinbase}
            isConnected={isConnected}
            listType={listType}
            chainId={chainId}
            handleSwitchNetwork={handleSwitchNetwork}
            handleConnection={handleConnection}
          />
        </>
      ) : showDetails && expired === false && cardIndex === 2 ? (
        <CawsWodDetails
          coinbase={coinbase}
          isConnected={isConnected}
          listType={listType}
          chainId={chainId}
          handleSwitchNetwork={handleSwitchNetwork}
          handleConnection={handleConnection}
          expired={false}
        />
      ) : showDetails && expired === false && cardIndex === 3 ? (
        <LandDetails
          coinbase={coinbase}
          isConnected={isConnected}
          listType={listType}
          chainId={chainId}
          handleSwitchNetwork={handleSwitchNetwork}
          handleConnection={handleConnection}
          //   apr={landCard.apy_percent}
          //   totalNftsLocked={landCard.total_nfts_locked}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default TopPoolsNftListCardInner;
