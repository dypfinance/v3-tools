import React, { useEffect, useState } from "react";
import useWindowSize from "../../functions/useWindowSize";
import "../top-pools-card/top-pools.css";
import TopPoolsListCardInner from "../top-pools-card/TopPoolsListCardInner";
import nftTag from "./assets/nftTag.svg";
import stakeTag from "./assets/stakeTag.svg";
import hotTag from "./assets/hotTag.svg";
import watch from "./assets/watch.svg";
import premium24hrstag from "../top-pools-card/assets/24hrsPremiumTag.svg";
import CountDown from "react-countdown";

const TopOtherPoolsListCard = ({
  tokenLogo,
  tokenName,
  tokenTicker,
  apr,
  lockTime,
  chainLogo,
  tvl,
  onShowDetailsClick,
  theBnbPool,
  onHideDetailsClick,
  top_pick,
  isNewPool,
  cardType,
  chain,
  topList,
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
  cardIndex,
  showDetails,
  onCardClick,
  cardId,
  isHot,
  isNft,
  isStaked,
  isComingSoon,
  onCountDownComplete,
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

  const dummyData_avax2 = [
    {
      chain: "Avalanche",
      apr: 10,
      tokenLogo: "avax.svg",
      expired: false,
      top_pick: false,
      tokenName: "AVAX",
      tokenTicker: "AVAX",
      pool: "AVAX",
      id: "0x8652d1817f5a95172001685a28facb1d57e78a11",
      coming_soon: true,
      lockTime: "30 days",
      poolCap: "7413",
      new_pool: "Yes",
    },
  ];

  const dummyData_base2 = [
    {
      chain: "Base",
      apr: 15,
      tokenLogo: "baseActive.svg",
      expired: false,
      top_pick: false,
      tokenName: "ETH",
      tokenTicker: "ETH",
      pool: "ETH",
      id: "",
      lockTime: "60 days",
      poolCap: "234",
      coming_soon: true,
      new_pool: "Yes",
    },
  ];

  const dummyData_bnb2 = [
    {
      chain: "BNB Chain",
      apr: 25,
      tokenLogo: "bsc.svg",
      expired: false,
      top_pick: false,
      tokenName: "BNB",
      tokenTicker: "WBNB",
      pool: "BNB",
      id: "0x8652d1817f5a95172001685a28facb1d57e78a11",
      lockTime: "90 days",
      poolCap: "467",
      coming_soon: true,
      new_pool: "Yes",
    },
  ];

  const [coins, setCoins] = useState(ethCoins);
  const windowSize = useWindowSize();
  const [livePremiumOnly, setlivePremiumOnly] = useState(true);

  let premiumDay = new Date("2024-04-11T23:59:59.000+00:00");

  useEffect(() => {
    if (chain === "eth") {
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
        className={`row w-100 flex-column gap-3 gap-lg-0 flex-lg-row align-items-center justify-content-between  mx-0 cursor-pointer ${
          expired === true ? "poolscardwrapperexpired" : "list-pool-card2"
        } ${showDetails && "pools-card-hover"} `}
        // onMouseEnter={() => setShowDetails(true)}
        // onMouseLeave={() => setShowDetails(false)}
        style={{ display: display }}
        onClick={onCardClick}
      >
        <div className="d-none">
          <CountDown
            date={premiumDay}
            onComplete={() => {
              setlivePremiumOnly(false);
              onCountDownComplete(false);
            }}
          />
        </div>
        <div className="px-0 d-flex justify-content-between align-items-center">
          <table className="earnother-table">
            <tbody>
              {windowSize.width && windowSize.width > 768 ? (
                <tr className="d-flex w-100 align-items-center justify-content-between">
                  <td className="earnother-td col-2">
                    <div
                      className={`col-6 d-flex align-items-center gap-2 justify-content-start`}
                    >
                      <img
                        src={tokenLogo}
                        style={{ width: 36, height: 36 }}
                        alt=""
                      />
                      <h5
                        className="text-white"
                        style={{ fontSize: "16px", fontWeight: "600" }}
                      >
                        {tokenTicker}
                      </h5>
                      {livePremiumOnly && tokenTicker === "BNB" && (
                        <img src={premium24hrstag} alt="" />
                      )}
                      {/* {isHot && <img src={hotTag} alt="" />} */}
                    </div>
                  </td>
                  <td className="earnother-td col-2">
                    <div className="d-flex align-items-center gap-2">
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "300",
                          color: "#F7F7FC",
                          // marginLeft: 30,
                        }}
                      >
                        {apr}
                      </h5>
                      {isNft && <img src={nftTag} alt="" />}
                    </div>
                  </td>

                  <td className="earnother-td col-2">
                    <h5
                      style={{
                        fontSize: "16px",
                        fontWeight: "300",
                        color: "#F7F7FC",
                        // marginLeft: 30,
                      }}
                    >
                      {/* {lockTime} */}
                      Fixed
                    </h5>
                  </td>
                  <td className="earnother-td col-2">
                    <h5
                      className="text-white d-flex align-items-center gap-1"
                      style={{
                        fontSize: "12px",
                        fontWeight: "300",
                        color: "#F7F7FC",
                      }}
                    >
                      <img src={chainLogo} width={24} height={24} alt="" />
                      {chain}
                    </h5>
                  </td>
                  <td className="earnother-td col-2">
                    {isComingSoon ? (
                      <h6 className="details-text2 gap-1 d-flex align-items-center cursor-pointer justify-content-center w-75">
                        <img src={watch} alt="" /> Coming Soon
                      </h6>
                    ) : (
                      <h6 className="details-text2 gap-1 d-flex align-items-center w-75 cursor-pointer justify-content-center">
                        Stake
                      </h6>
                    )}
                  </td>
                </tr>
              ) : windowSize.width && windowSize.width <= 768 ? (
                <>
                  <tr className="d-flex w-100 align-items-center justify-content-between mb-3">
                    <td className="earnother-td w-100">
                      <div className="d-flex align-items-center w-100  justify-content-between gap-2">
                        <div className={` d-flex align-items-center gap-1`}>
                          <img src={chainLogo} width={28} height={28} alt="" />
                          <div className="d-flex flex-column gap-1">
                            <h5
                              className="text-white"
                              style={{ fontSize: "16px", fontWeight: "600" }}
                            >
                              {chain}
                            </h5>
                            <h5
                              className="text-white"
                              style={{
                                fontSize: "14px",
                                fontWeight: "300",
                                color: "#F7F7FC",
                              }}
                            >
                              {tokenTicker}
                            </h5>
                            
                          </div>{livePremiumOnly && tokenTicker === "BNB" && (
                        <img src={premium24hrstag} alt="" />
                      )}
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <h5
                            style={{
                              fontSize: "16px",
                              fontWeight: "300",
                              color: "#F7F7FC",
                            }}
                          >
                            {apr}
                          </h5>
                          <h5
                            style={{
                              fontSize: "14px",
                              fontWeight: "300",
                              color: "#F7F7FC",
                            }}
                          >
                            APR
                          </h5>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="d-flex w-100 align-items-center justify-content-around">
                    <td className="earnother-td w-100">
                      {isComingSoon ? (
                        <h6 className="details-text2 m-0 gap-1 d-flex align-items-center cursor-pointer justify-content-center w-100">
                          <img src={watch} alt="" /> Coming Soon
                        </h6>
                      ) : (
                        <h6 className="details-text2 m-0 gap-1 d-flex align-items-center cursor-pointer justify-content-center w-100">
                          Stake
                        </h6>
                      )}
                    </td>
                  </tr>
                </>
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TopOtherPoolsListCard;
