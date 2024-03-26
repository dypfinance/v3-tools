import React, { useState, useEffect } from "react";
import "./earnInnerpool.css";
import "../earnOther.css";
import "../../earn/earn.css";
import whiteArrow from "../../../assets/earnOtherAssets/backWhiteArrow.svg";
import innerHero from "../../../assets/earnOtherAssets/innerhero.jpg";
import innerHeroAvax from "../../../assets/earnOtherAssets/innerheroAvax.jpg";
import innerHeroBnb from "../../../assets/earnOtherAssets/innerheroBnb.jpg";

import axios from "axios";
import ethStakeActive from "../../../assets/earnAssets/ethStakeActive.svg";
import bnbStakeActive from "../../../assets/earnAssets/bnbStakeActive.svg";
import avaxStakeActive from "../../../assets/earnAssets/avaxStakeActive.svg";
import baseStakeActive from "../../../assets/earnAssets/baseActive.svg";

import greenArrow from "../../../assets/earnOtherAssets/greenArrow.svg";
import { NavLink } from "react-router-dom";
import { shortAddress } from "../../../functions/shortAddress";
import SwitchChainModal from "../../switch-chain-modal/SwitchChainModal";
import { useParams } from "react-router-dom";
import TopPoolsNftListCardInner from "../../top-pools-card/TopPoolsNftListCardInner";

const EarnInnerPoolNft = ({
  chainId,
  handleConnection,
  handleSwitchNetwork,
  coinbase,
  referrer,
  lp_id,
  the_graph_result,
  the_graph_resultbsc,
  the_graph_resultavax,
  isConnected,
  isPremium,
}) => {
  const [myStakes, setMyStakes] = useState(false);
  const [expiredPools, setExpiredPools] = useState(false);
  const [activePools, setActivePools] = useState([]);
  const [activeCard, setActiveCard] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [topPools, setTopPools] = useState([]);
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(0);
  const [network, setNetwork] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenTicker, setTokenTicker] = useState("");

  const { pool, contractId } = useParams();

  const dummyData_eth2 = [
    {
      chain: "Ethereum",
      apr: 25,
      tokenLogo: "cawslogo.svg",
      expired: false,
      top_pick: false,
      tokenName: "ETH",
      tokenTicker: "ETH",
      pool: "CAWS",
      id: "",
      coming_soon: true,
      lockTime: "No lock",
      poolCap: "100",
      new_pool: "Yes",
    },
  ];

  const dummyData_eth_expired = [
    {
      chain: "Ethereum",
      apr: 50,
      tokenLogo: "cawslogo.svg",
      expired: true,
      top_pick: false,
      tokenName: "ETH",
      tokenTicker: "ETH",
      pool: "CAWS",
      id: "",
      coming_soon: false,
      lockTime: "30 days",
      poolCap: "∞",
      new_pool: "No",
    },
    {
      chain: "Ethereum",
      apr: 50,
      tokenLogo: ["cawslogo.svg", "lanft-poolicon.png"],
      expired: true,
      top_pick: true,
      tokenName: "ETH",
      tokenTicker: "ETH",
      pool: "CAWS+WOD",
      id: "",
      coming_soon: false,
      lockTime: "No lock",
      poolCap: "∞",
      new_pool: "No",
    },

    {
      chain: "Ethereum",
      apr: 25,
      tokenLogo: "lanft-poolicon.png",
      expired: true,
      top_pick: false,
      tokenName: "ETH",
      tokenTicker: "ETH",
      pool: "Land",
      id: "",
      coming_soon: false,
      lockTime: "No lock",
      poolCap: "∞",
      new_pool: "No",
    },
  ];

  const toggleInactive = () => {
    setExpiredPools(!expiredPools);
    setCount(count + 1);
  };

  useEffect(() => {
    if (pool && pool.includes("BNB")) {
      setNetwork("BNB Chain");
      setTokenName("BNB Chain");
      setTokenTicker("BNB");
    }
    if (pool && pool.includes("ETH")) {
      setNetwork("Ethereum");
      setTokenName("Ethereum");
      setTokenTicker("ETH");
    }
    if (pool && pool.includes("AVAX")) {
      setNetwork("Avalanche");
      setTokenName("Avalanche");
      setTokenTicker("AVAX");
    }
    if (pool && pool.includes("BASE")) {
      setNetwork("Base");
      setTokenName("Base");
      setTokenTicker("ETH");
    }
  }, [pool]);

  return (
    <>
      <div className="container-lg earn-wrapper d-flex flex-column justify-content-center align-items-center p-0 position-relative">
        <NavLink to={"/earn/nft-staking"} style={{ alignSelf: "flex-start" }}>
          <span className="w-100 text-white cursor-pointer d-flex align-items-center gap-2">
            <img alt="" src={whiteArrow} /> Back to Homepage
          </span>
        </NavLink>
        <div className="earn-inner-wrapper-hero mt-4">
          <div className="d-flex flex-column gap-3 justify-content-between">
            <div className="d-flex flex-column flex-xxl-row flex-xl-row flex-lg-row flex-md-row align-items-start align-items-xxl-center align-items-lg-center align-items-md-center gap-2 justify-content-between px-4 py-2">
              <div className="d-flex flex-column gap-1">
                <span
                  className="earn-inner-title"
                  // onClick={() => {
                  //   setShowModal(true);
                  // }}
                >
                  {tokenName} ({tokenTicker})
                </span>
                <span className="earn-inner-desc">
                  Exclusive staking offer. Locked staking available.
                </span>
              </div>
              <div className="d-flex flex-column gap-1">
                <span className="earn-inner-title">
                  {dummyData_eth2[0].apr}%
                </span>
                <span className="earn-inner-desc">APR</span>
              </div>
            </div>
            <div className="inner-hero-bg">
              <img
                alt=""
                src={
                  network === "Ethereum"
                    ? innerHero
                    : network === "Avalanche"
                    ? innerHeroAvax
                    : innerHeroBnb
                }
                className="inner-hero-img"
              />
            </div>
            <div className="d-flex justify-content-between gap-3 align-items-center px-4 pb-3 pt-2 items-big-wrapper">
              <div className="single-item-wrapper">
                <div className="d-flex flex-column gap-2">
                  <span className="earn-inner-greentxt">Category</span>
                  <span className="earn-inner-whitetxt">NFT Staking</span>
                </div>
              </div>
              <div className="single-item-wrapper">
                <div className="d-flex flex-column gap-2">
                  <span className="earn-inner-greentxt">Network</span>
                  <span className="earn-inner-whitetxt d-flex align-items-center gap-1">
                    <img
                      src={
                        network === "Ethereum"
                          ? ethStakeActive
                          : network === "BNB Chain"
                          ? bnbStakeActive
                          : network === "Avalanche"
                          ? avaxStakeActive
                          : baseStakeActive
                      }
                      alt=""
                      style={{ width: 12, height: 12 }}
                    />
                    {network}
                  </span>
                </div>
              </div>
              <div className="single-item-wrapper">
                <div className="d-flex flex-column gap-2">
                  <span className="earn-inner-greentxt">Method</span>
                  <span className="earn-inner-whitetxt">Flexible</span>
                </div>
              </div>

              <div className="single-item-wrapper">
                <div className="d-flex flex-column gap-2">
                  <span className="earn-inner-greentxt">
                    Total Value Locked (USD)
                  </span>
                  <span className="earn-inner-whitetxt">$0</span>
                </div>
              </div>
              {/* 
              <div className="single-item-wrapper">
                <div className="d-flex flex-column gap-2">
                  <span className="earn-inner-greentxt">Total locked</span>
                  <span className="earn-inner-whitetxt">256,458.00 {tokenTicker}</span>
                </div>
              </div> */}

              <div className="single-item-wrapper">
                <div className="d-flex flex-column gap-2">
                  <span className="earn-inner-greentxt">Offer Creator</span>

                  <a
                    className="earn-inner-whitetxt d-flex align-items-center gap-1"
                    href="https://www.dypius.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Dypius <img alt="" src={greenArrow} />
                  </a>
                </div>
              </div>

              <div className="single-item-wrapper">
                <div className="d-flex flex-column gap-2">
                  <span className="earn-inner-greentxt">Token Address</span>
                  <a
                    className="earn-inner-whitetxt d-flex align-items-center gap-1"
                    href={
                      network === "Base"
                        ? "https://basescan.org/token/0x4200000000000000000000000000000000000006"
                        : network === "Avalanche"
                        ? "https://snowtrace.io/token/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"
                        : "https://bscscan.com/token/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shortAddress(
                      network === "BNB Chain"
                        ? "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
                        : network === "Avalanche"
                        ? "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"
                        : "0x4200000000000000000000000000000000000006"
                    )}{" "}
                    <img alt="" src={greenArrow} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="row mx-0 w-100 justify-content-between align-items-center px-2 py-4 options-container"
          style={{ marginTop: "30px", marginBottom: "40px" }}
        >
          <div className="col-2 d-flex justify-content-start align-items-center gap-3">
            <span>{network} Offers</span>
          </div>

         
        </div>

        {network === "Ethereum" &&
          expiredPools === false &&
          dummyData_eth2.map((pool, index) => {
            return (
              <TopPoolsNftListCardInner
                key={index}
                activePools={dummyData_eth2}
                tokenName={pool.pool}
                topList={"Staking"}
                onShowDetailsClick={() => {
                  setShowDetails(!showDetails);
                  setActiveCard(topPools[index + 1]);
                }}
                top_pick={pool.top_pick}
                comingSoon={pool.coming_soon}
                expired={pool.expired}
                tokenLogo={pool.tokenLogo}
                apr={pool.apr}
                lockTime={pool.lockTime}
                poolCap={pool.poolCap}
                chain={"eth"}
                display={"flex"}
                isNewPool={pool.new_pool === "Yes" ? true : false}
                totalTvl={pool.tvl_usd}
                showDetails={showDetails}
                cardIndex={index + 1}
                chainId={chainId}
                handleConnection={handleConnection}
                handleSwitchNetwork={handleSwitchNetwork}
                coinbase={coinbase}
                referrer={referrer}
                lp_id={lp_id[index + 1]}
                the_graph_result={the_graph_result}
                the_graph_resultbsc={the_graph_resultbsc}
                isConnected={isConnected}
                the_graph_resultavax={the_graph_resultavax}
                isPremium={isPremium}
                network={network}
              />
            );
          })}

        {network === "Ethereum" &&
          expiredPools === true &&
          dummyData_eth_expired.map((pool, index) => {
            return (
              <TopPoolsNftListCardInner
                key={index}
                activePools={dummyData_eth_expired}
                tokenName={pool.pool}
                topList={"Staking"}
                onShowDetailsClick={() => {
                  setShowDetails(!showDetails);
                  setActiveCard(topPools[index + 1]);
                }}
                top_pick={pool.top_pick}
                comingSoon={pool.coming_soon}
                expired={pool.expired}
                tokenLogo={pool.tokenLogo}
                apr={pool.apr}
                lockTime={pool.lockTime}
                poolCap={pool.poolCap}
                chain={"eth"}
                display={"flex"}
                isNewPool={pool.new_pool === "Yes" ? true : false}
                totalTvl={pool.tvl_usd}
                showDetails={showDetails}
                cardIndex={index + 1}
                chainId={chainId}
                handleConnection={handleConnection}
                handleSwitchNetwork={handleSwitchNetwork}
                coinbase={coinbase}
                referrer={referrer}
                lp_id={lp_id[index + 1]}
                the_graph_result={the_graph_result}
                the_graph_resultbsc={the_graph_resultbsc}
                isConnected={isConnected}
                the_graph_resultavax={the_graph_resultavax}
                isPremium={isPremium}
                network={network}
              />
            );
          })}
      </div>

      {showModal && (
        <SwitchChainModal
          open={showModal}
          onclose={() => {
            setShowModal(false);
          }}
          currentChain={
            chainId === "56"
              ? "BNB Chain"
              : chainId === "1"
              ? "Ethereum"
              : "Avalanche"
          }
          targetChain={"Ethereum"}
          walletType={"Metamask"}
          coinbase={coinbase}
        />
      )}
    </>
  );
};

export default EarnInnerPoolNft;
