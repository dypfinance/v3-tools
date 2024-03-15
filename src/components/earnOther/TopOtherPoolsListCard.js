import React, { useEffect, useState } from "react";
import ethStake from "../../assets/earnAssets/ethStakeActive.svg";
import avaxStake from "../../assets/earnAssets/avaxStakeActive.svg";
import baseStake from "../../assets/earnAssets/baseActive.svg";

import bnbStakeActive from "../../assets/earnAssets/bnbStakeActive.svg";
import useWindowSize from "../../functions/useWindowSize";

import "../top-pools-card/top-pools.css";

const TopOtherPoolsListCard = ({
  tokenLogo,
  cardId,
  tokenName,
  tokenTicker,
  apr,
  lockTime,
  tvl,
  onShowDetailsClick,
  theBnbPool,
  onHideDetailsClick,
  top_pick,
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
  const windowSize = useWindowSize();

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
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
        style={{ display: display }}
      >
        <div className="px-0 d-flex justify-content-between align-items-center">
          <table className="earnother-table">
            <tbody>
              {windowSize.width > 768 ? (
                <tr className="d-flex w-100 align-items-center justify-content-around">
                  <td className="earnother-td col-2">
                    <div className={`col-6 d-flex align-items-center gap-2`}>
                      <img
                        src={
                          require(`../top-pools-card/assets/${tokenLogo}`)
                            .default
                        }
                        width={28}
                        height={28}
                        alt=""
                      />
                      <h5
                        className="text-white"
                        style={{ fontSize: "16px", fontWeight: "600" }}
                      >
                        {tokenName}
                      </h5>
                    </div>
                  </td>
                  <td className="earnother-td col-2">
                    <h5
                      className="text-white"
                      style={{
                        fontSize: "18px",
                        fontWeight: "300",
                        color: "#F7F7FC",
                      }}
                    >
                      {tokenTicker}
                    </h5>
                  </td>
                  {/* <td className="earnother-td col-2">
                    <h5
                      style={{
                        fontSize: "15px",
                        fontWeight: "300",
                        color: "#F7F7FC",
                      }}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src={
                          chain === "Ethereum"
                            ? ethStake
                            : chain === "BNB Chain"
                            ? bnbStakeActive : chain === 'Base' ? baseStake
                            : avaxStake
                        }
                        style={{ width: 18, height: 18 }}
                        alt=""
                        className="pool-coins"
                      />
                      {chain}
                    </h5>
                  </td> */}
                  <td className="earnother-td col-2">
                    <h5
                      style={{
                        fontSize: "16px",
                        fontWeight: "300",
                        color: "#F7F7FC",
                        marginLeft: 30,
                      }}
                    >
                      {apr}
                    </h5>
                  </td>
                  <td className="earnother-td col-2">
                    <h5
                      style={{
                        fontSize: "16px",
                        fontWeight: "300",
                        color: "#F7F7FC",
                        marginLeft: 30,
                      }}
                    >
                      {lockTime}
                    </h5>
                  </td>
                  <td className="earnother-td col-2">
                    <h6 className="details-text2 gap-1 d-flex align-items-center cursor-pointer justify-content-end">
                      Stake
                    </h6>
                  </td>
                </tr>
              ) : (
                <>
                  <tr className="d-flex w-100 align-items-center justify-content-between mb-3">
                    <td className="earnother-td w-100">
                      <div className="d-flex align-items-center w-100  justify-content-between gap-2">
                        <div className={` d-flex align-items-center gap-1`}>
                          <img
                            src={
                              require(`../top-pools-card/assets/${tokenLogo}`)
                                .default
                            }
                            width={28}
                            height={28}
                            alt=""
                          />
                          <div className="d-flex flex-column gap-1">
                            <h5
                              className="text-white"
                              style={{ fontSize: "16px", fontWeight: "600" }}
                            >
                              {tokenName}
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
                          </div>
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
                      <h6 className="details-text2 gap-1 d-flex align-items-center cursor-pointer justify-content-center m-0 w-100">
                        Stake
                      </h6>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TopOtherPoolsListCard;
