import React, { useEffect, useState } from "react";
import "./top-pools.css";
import LandDetails from "../FARMINNG/land";
import CawsDetails from "../FARMINNG/caws";
import CawsWodDetails from "../FARMINNG/cawsWod";
import axios from "axios";
import useWindowSize from "../../functions/useWindowSize";
import LandDetailsPremium from "../FARMINNG/landPremium";
import CawsDetailsPremium from "../FARMINNG/cawsPremium";

const TopPoolsNftListCardInner = ({
  tokenLogo,
  cardId,
  poolCap,
  tokenName,
  apr,
  lockTime,
  tokenTicker,
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
  id,
  clickedCawsPool,
  onCloseCard,
  poolClickedType,
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
  const windowSize = useWindowSize();

  const [showDetails, setShowDetails] = useState(false);
  const [coins, setCoins] = useState(ethCoins);
  const [cardIndexDyp, setcardIndex] = useState();
  const [landCard, setLandCard] = useState({});

  const cawswodcoins = ["cawslogo", "lanft-poolicon"];

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
    // if (!comingSoon) {
    //   if (showDetails === false) {
    //     setShowDetails(true);
    //     setcardIndex(cardIndex);
    //   } else if (showDetails === true) {
    //     setShowDetails(false);
    //     setcardIndex();
    //   }
    // }
    if (showDetails === false && clickedCawsPool === false) {
      setShowDetails(true);
      setcardIndex(cardIndex);
      // onShowDetailsClick();
    } else if (clickedCawsPool === true) {
      setShowDetails(false);
      setcardIndex();
      onCloseCard();
    } else if (showDetails === true && clickedCawsPool === false) {
      setShowDetails(false);
      setcardIndex();
      onCloseCard();
    }
  };

  useEffect(() => {
    if (poolClickedType === "details-land-nft") {
      setcardIndex(1);
    } else if (poolClickedType === "details-nft") {
      setcardIndex(2);
    } else {
      setcardIndex();
    }
  }, [poolClickedType]);
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
        className={`row mt-2 w-100 flex-column gap-3 gap-lg-0 flex-lg-row align-items-center justify-content-between  mx-0 cursor-pointer position-relative ${
          expired === true
            ? "poolscardwrapperexpired"
            : showDetails === false
            ? "list-pool-card mb-2"
            : "list-pool-card-active"
        }`}
        onClick={() => handleDetails()}
        style={{ display: display }}
      >
        {id && (
          <img
            src={"https://cdn.worldofdypians.com/tools/premiumIcon.svg"}
            className="position-absolute nft-premium-icon d-none d-lg-block"
            style={{ height: 56, left: "-1px" }}
          />
        )}
        <div className="px-0 d-flex justify-content-between align-items-center">
          <table className="earnother-table">
            <tbody>
              {windowSize.width && windowSize.width > 768 ? (
                <tr className="d-flex w-100 align-items-center justify-content-around">
                  <td className="earnother-td col-2">
                    <div className={`col-6 d-flex align-items-center gap-2`}>
                      {tokenLogo &&
                        tokenLogo.length > 0 &&
                        tokenLogo.map((item, index) => {
                          return (
                            <img
                              key={index}
                              src={`https://cdn.worldofdypians.com/tools/${item}`}
                              width={28}
                              height={28}
                              alt=""
                            />
                          );
                        })}

                      <h5
                        className="text-white"
                        style={{ fontSize: "16px", fontWeight: "600" }}
                      >
                        {tokenName}
                      </h5>
                    </div>
                  </td>
                  {/* <td className="earnother-td col-2">
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
                  </td> */}
                  <td className="earnother-td col-2">
                    <h5
                      style={{
                        fontSize: "15px",
                        fontWeight: "300",
                        color: "#F7F7FC",
                      }}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src={"https://cdn.worldofdypians.com/wod/eth.svg"}
                        style={{ width: 18, height: 18 }}
                        alt=""
                        className="pool-coins"
                      />
                      Ethereum
                    </h5>
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
                      {apr}%
                    </h5>
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
                      {lockTime}
                    </h5>
                  </td>
                  <td className="earnother-td col-2">
                    <h6 className="details-text2 gap-1 w-50 d-flex align-items-center cursor-pointer justify-content-center m-0">
                      Withdraw
                    </h6>
                  </td>
                </tr>
              ) : windowSize.width && windowSize.width <= 768 ? (
                <>
                  <tr className="d-flex w-100 align-items-center justify-content-between mb-3">
                    <td className="earnother-td w-100">
                      <div className="d-flex align-items-center w-100  justify-content-between gap-2">
                        <div className={` d-flex align-items-center gap-1`}>
                          {tokenLogo &&
                            tokenLogo.length > 0 &&
                            tokenLogo.map((item, index) => {
                              return (
                                <img
                                  key={index}
                                  src={`https://cdn.worldofdypians.com/tools/${item}`}
                                  width={28}
                                  height={28}
                                  alt=""
                                />
                              );
                            })}
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
                              {chain}
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
                            {apr}%
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
                        Withdraw
                      </h6>
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
      {expired === true &&
      showDetails &&
      cardIndexDyp === 3 &&
      cardIndex === 3 ? (
        <>
          <CawsDetails
            coinbase={coinbase}
            isConnected={isConnected}
            listType={listType}
            chainId={chainId}
            handleSwitchNetwork={handleSwitchNetwork}
            expired={true}
            handleConnection={handleConnection}
          />
        </>
      ) : showDetails &&
        expired === true &&
        cardIndexDyp === 4 &&
        cardIndex === 4 ? (
        <CawsWodDetails
          coinbase={coinbase}
          isConnected={isConnected}
          listType={listType}
          chainId={chainId}
          handleSwitchNetwork={handleSwitchNetwork}
          handleConnection={handleConnection}
          expired={true}
        />
      ) : showDetails &&
        expired === true &&
        cardIndexDyp === 5 &&
        cardIndex === 5 ? (
        <LandDetails
          coinbase={coinbase}
          isConnected={isConnected}
          listType={listType}
          chainId={chainId}
          handleSwitchNetwork={handleSwitchNetwork}
          handleConnection={handleConnection}
          expired={true}
          apr={25}
          totalNftsLocked={totalNftsLocked}
        />
      ) : (showDetails ||
          clickedCawsPool ||
          poolClickedType === "details-land-nft") &&
        expired === true &&
        cardIndexDyp === 1 &&
        cardIndex === 1 ? (
        <LandDetailsPremium
          coinbase={coinbase}
          isConnected={isConnected}
          listType={listType}
          chainId={chainId}
          handleSwitchNetwork={handleSwitchNetwork}
          handleConnection={handleConnection}
          expired={true}
          apr={25}
          isPremium={isPremium}
        />
      ) : (showDetails ||
          clickedCawsPool ||
          poolClickedType === "details-nft") &&
        expired === true &&
        cardIndexDyp === 2 &&
        cardIndex === 2 ? (
        <CawsDetailsPremium
          coinbase={coinbase}
          isConnected={isConnected}
          listType={listType}
          chainId={chainId}
          handleSwitchNetwork={handleSwitchNetwork}
          handleConnection={handleConnection}
          expired={true}
          apr={25}
          isPremium={isPremium}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default TopPoolsNftListCardInner;
