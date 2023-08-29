import React, { useEffect, useState } from "react";
import greenArrow from "../top-pools-card/assets/greenarrow.svg";
import orangeArrow from "../top-pools-card/assets/orangearrow.svg";
import topPick from "../top-pools-card/assets/toppick.svg";
import newPool from "../top-pools-card/assets/newPool.png";
import ethStake from "../../assets/earnAssets/ethStakeActive.svg";
import avaxStake from "../../assets/earnAssets/avaxStakeActive.svg";
import bnbStakeActive from "../../assets/earnAssets/bnbStakeActive.svg";

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
  const [cardIndexiDyp, setcardIndexiDyp] = useState();
  const [cardIndexavax30, setcardIndexavax30] = useState();
  const [cardIndexavaxiDyp, setcardIndexavaxiDyp] = useState();

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
              <tr className="d-flex w-100 align-items-center justify-content-around">
                <td className="earnother-td col-2">
                  <div className={` d-flex align-items-center gap-2`}>
                    <img
                      src={
                        require(`../top-pools-card/assets/${tokenLogo}`).default
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
                <td className="earnother-td col-2">
                  <h5
                    style={{
                      fontSize: "16px",
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
                          ? bnbStakeActive
                          : avaxStake
                      }
                      style={{ width: 18, height: 18 }}
                      alt=""
                      className="pool-coins"
                    />
                    {chain}
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
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TopOtherPoolsListCard;
