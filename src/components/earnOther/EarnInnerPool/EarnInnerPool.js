import React, { useState, useEffect } from "react";
import "./earnInnerpool.css";
import "../earnOther.css";
import "../../earn/earn.css";
import whiteArrow from "../../../assets/earnOtherAssets/backWhiteArrow.svg";
import innerHero from "../../../assets/earnOtherAssets/innerhero.png";
import TopPoolsListCardInner from "../../top-pools-card/TopPoolsListCardInner";
import axios from "axios";
import ethStakeActive from "../../../assets/earnAssets/ethStakeActive.svg";
import greenArrow from "../../../assets/earnOtherAssets/greenArrow.svg";
import { NavLink } from "react-router-dom";
import { shortAddress } from "../../../functions/shortAddress";

const EarnInnerPool = ({
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
}) => {
  const [myStakes, setMyStakes] = useState(false);
  const [expiredPools, setExpiredPools] = useState([]);
  const [activePools, setActivePools] = useState([]);
  const [activeCard, setActiveCard] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [topPools, setTopPools] = useState([]);
  const [count, setCount] = useState(0);

  const toggleInactive = () => {
    setCount(count + 1);
  };

  const fetchEthStaking = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_staking_info_eth`)
      .then((res) => {
        const dypIdyp = res.data.stakingInfoDYPEth.concat(
          res.data.stakingInfoiDYPEth
        );

        const expiredEth = dypIdyp.filter((item) => {
          return item.expired !== "No";
        });
        const activeEth = dypIdyp.filter((item) => {
          return item.expired !== "Yes";
        });

        const sortedExpired = expiredEth.sort(function (a, b) {
          return b.tvl_usd - a.tvl_usd;
        });
        setTopPools(dypIdyp);

        setActivePools(activeEth);
        setExpiredPools(sortedExpired);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchEthStaking();
  }, []);

  return (
    <div className="container-lg earn-wrapper d-flex flex-column justify-content-center align-items-center p-0 position-relative">
      <NavLink to={"/earn/other"} style={{ alignSelf: "flex-start" }}>
        <span className="w-100 text-white cursor-pointer d-flex align-items-center gap-2">
          <img alt="" src={whiteArrow} /> Back to Homepage
        </span>
      </NavLink>
      <div className="earn-inner-wrapper-hero mt-4">
        <div className="d-flex flex-column gap-3 justify-content-between">
          <div className="d-flex flex-column flex-xxl-row flex-xl-row flex-lg-row flex-md-row align-items-start align-items-xxl-center align-items-lg-center align-items-md-center gap-2 justify-content-between px-4 py-2">
            <div className="d-flex flex-column gap-1">
              <span className="earn-inner-title">Dypius (DYP)</span>
              <span className="earn-inner-desc">
                Exclusive staking offer. Locked staking available.
              </span>
            </div>
            <div className="d-flex flex-column gap-1">
              <span className="earn-inner-title">25%</span>
              <span className="earn-inner-desc">Max APR</span>
            </div>
          </div>
          <div className="inner-hero-bg">
            <img alt="" src={innerHero} className="inner-hero-img" />
          </div>
          <div className="d-flex justify-content-between gap-3 align-items-center px-4 pb-3 pt-2 items-big-wrapper">
            <div className="single-item-wrapper">
              <div className="d-flex flex-column gap-2">
                <span className="earn-inner-greentxt">Category</span>
                <span className="earn-inner-whitetxt">DeFi Staking</span>
              </div>
            </div>
            <div className="single-item-wrapper">
              <div className="d-flex flex-column gap-2">
                <span className="earn-inner-greentxt">Network</span>
                <span className="earn-inner-whitetxt d-flex align-items-center gap-1">
                  <img
                    src={ethStakeActive}
                    alt=""
                    style={{ width: 12, height: 12 }}
                  />
                  Ethereum
                </span>
              </div>
            </div>
            <div className="single-item-wrapper">
              <div className="d-flex flex-column gap-2">
                <span className="earn-inner-greentxt">Method</span>
                <span className="earn-inner-whitetxt">Flexible & Locked</span>
              </div>
            </div>

            <div className="single-item-wrapper">
              <div className="d-flex flex-column gap-2">
                <span className="earn-inner-greentxt">
                  Total Value Locked (USD)
                </span>
                <span className="earn-inner-whitetxt">$524,255.00</span>
              </div>
            </div>

            <div className="single-item-wrapper">
              <div className="d-flex flex-column gap-2">
                <span className="earn-inner-greentxt">Total DYP locked</span>
                <span className="earn-inner-whitetxt">256,458.00 DYP</span>
              </div>
            </div>

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
                  href="https://etherscan.io/token/0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17"
                  target="_blank"
                  rel="noreferrer"
                >
                  {shortAddress("0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17")}{" "}
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
          <span>Dypius Offers</span>
        </div>

        <div className="col-2 d-flex justify-content-end align-items-center gap-1 gap-lg-3">
          <h5 className="text-white inactive-pools">Inactive pools</h5>
          <div
            className={`pill-box ${myStakes && "pill-box-active"}`}
            onClick={() => {
              setMyStakes(!myStakes);
              // setExpiredPools(!expiredPools);
              // option === "Farming" && fetchFarmingApr();
              toggleInactive();
            }}
          >
            <div className="pill"></div>
          </div>
        </div>
      </div>
      {activePools.map((pool, index) => {
        return (
          <TopPoolsListCardInner
            key={index}
            expiredPools={expiredPools}
            activePools={activePools}
            tokenName={
              pool.tokenName
                ? pool.tokenName
                : pool.pair_name
                ? pool.pair_name
                : ""
            }
            topList={"Staking"}
            onShowDetailsClick={() => {
              setShowDetails(!showDetails);
              setActiveCard(topPools[index + 1]);
            }}
            top_pick={pool.top_pick}
            expired={false}
            tokenLogo={
              pool.icon
                ? pool.icon
                : pool.pair_name === "iDYP"
                ? "idypius.svg"
                : "dyplogo.svg"
            }
            apr={pool.apy_percent + "%"}
            lockTime={"No lock"}
            poolCap={"48,000.00"}
            chain={"eth"}
            display={
              pool.expired ? (pool.expired === "Yes" ? "none" : "flex") : "flex"
            }
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
          />
        );
      })}
    </div>
  );
};

export default EarnInnerPool;
