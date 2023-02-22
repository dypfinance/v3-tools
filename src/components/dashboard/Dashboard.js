import React, { useEffect, useState } from "react";
import "./dashboard.css";
import TopPoolsCard from "../top-pools-card/TopPoolsCard";
import NewsCard from "../newsCard/NewsCard";
import GovCard from "../gov-card/GovCard";
import BridgeCard from "../bridgecard/BridgeCard";
import ExplorerCard from "../explorer-card/ExplorerCard";
import Calculator from "../calculator/Calculator";
import FaqCard from "../faqcard/FaqCard";
import LaunchpadCard from "../launchpad-card/LaunchpadCard";
import ChainlinkCard from "../chainlink-card/ChainlinkCard";
import TrendingNews from "../newsCard/TrendingNews";
import rightarrow from "./assets/right-arrow.svg";
import { NavLink } from "react-router-dom";
import useWindowSize from "../../functions/useWindowSize";
import axios from "axios";
import getFormattedNumber from "../../functions/get-formatted-number";
import stakeAvax from "../FARMINNG/stakeAvax";
import { FadeLoader } from "react-spinners";
import CawsDetails from "../FARMINNG/caws";
import StakeBsc from "../FARMINNG/bscConstantStake";
import StakeNewEth from "../FARMINNG/stakeNewEth";
import StakeAvaxIDyp from "../FARMINNG/stakeAvaxiDyp";
import StakeBscIDyp from "../FARMINNG/bscConstantStakeiDyp";
import LandCard from "../top-pools-card/LandCard";
import LandDetails from "../FARMINNG/land";

const Dashboard = ({
  isConnected,
  coinbase,
  the_graph_result,
  lp_id,
  network,
  handleConnection,
  the_graph_resultbsc,
  the_graph_resultavax,
  referrer,
  handleSwitchNetwork,
}) => {
  const [topPools, setTopPools] = useState([]);

  const [userPools, setuserPools] = useState([]);
  const wbsc_address = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";

  const fetchUserPools = async () => {
    if (coinbase && coinbase.includes("0x")) {
      const result = await axios
        .get(`https://api.dyp.finance/api/user_pools/${coinbase}`)
        .then((data) => {
          return data.data.PoolsUserIn;
        });
      setuserPools(result);
    }
  };

  const fetchBnbStaking = async () => {
  
      return await axios
        .get(`https://api.dyp.finance/api/get_staking_info_bnb`)
        .then((res) => {
          const dypdypBnb = res.data.stakingInfoDYPBnb.concat(
            res.data.stakingInfoiDYPBnb
          );

          const cleanCards = dypdypBnb.filter((item) => {
            return item.expired !== "Yes";
          });

          const sortedAprs = cleanCards.sort(function (a, b) {
            return b.tvl_usd - a.tvl_usd;
          });

          setTopPools(sortedAprs);
        })
        .catch((err) => {
          console.log(err);
        });
  
  };

  const fetchAvaxStaking = async () => {
    
      return await axios
        .get(`https://api.dyp.finance/api/get_staking_info_avax`)
        .then((res) => {
          const dypIdypBnb = res.data.stakingInfoDYPAvax.concat(
            res.data.stakingInfoiDYPAvax
          );
          const cleanCards = dypIdypBnb.filter((item) => {
            return item.expired !== "Yes";
          });

          const sortedAprs = cleanCards.sort(function (a, b) {
            return b.tvl_usd - a.tvl_usd;
          });
          setTopPools(sortedAprs);
        })
        .catch((err) => {
          console.log(err);
        });
   
  };

  const fetchEthStaking = async () => {
    
      await axios
        .get(`https://api.dyp.finance/api/get_staking_info_eth`)
        .then((res) => {
          const dypIdyp = res.data.stakingInfoDYPEth;

          const cleanCards = dypIdyp.filter((item) => {
            return item.expired !== "Yes";
          });

          const sortedAprs = cleanCards.sort(function (a, b) {
            return b.tvl_usd - a.tvl_usd;
          });

          const finalEthCards = res.data.stakingInfoCAWS ;
          setTopPools(finalEthCards.slice(0, 1));
        })
        .catch((err) => {
          console.log(err);
        });
    
  };

  const [activeCard, setActiveCard] = useState();
  const [cardIndex, setcardIndex] = useState();
  const [details, setDetails] = useState();
  const [popularNewsData, setPopularNewsData] = useState([]);
  const [activeCard2, setActiveCard2] = useState();
  const [loading, setLoading] = useState(true);

  // let network = parseInt(network);

  const eth_address = "ETH";

  const stakearrayStakeBscDyp2 = [
    window.constant_stakingbsc_new10,
    window.constant_stakingbsc_new11,
  ];

  const expirearrayStakeBscDyp2 = ["14 July 2023", "5 August 2023"];

  const { LP_IDs_V2BNB } = window;

  const LP_IDBNB_Array = [
    LP_IDs_V2BNB.wbnb[0],
    LP_IDs_V2BNB.wbnb[1],
    LP_IDs_V2BNB.wbnb[2],
    LP_IDs_V2BNB.wbnb[3],
    LP_IDs_V2BNB.wbnb[4],
  ];

  const stakingarrayStakeAvax = [
    window.constant_staking_new10,
    window.constant_staking_new11,
  ];

  const avax_address = "AVAX";
  const expirearrayStakeAvax = ["14 July 2023", "05 August 2023"];

  const StakeAvax = stakeAvax({
    staking: stakingarrayStakeAvax[1],
    apr: topPools[0]?.apy_percent ? topPools[0]?.apy_percent : 30,
    finalApr: topPools[0]?.apy_performancefee
      ? topPools[0]?.apy_performancefee
      : 30,
    liquidity: avax_address,
    expiration_time: expirearrayStakeAvax[1],
    fee: topPools[0]?.performancefee,
    coinbase: coinbase,
    chainId: network.toString(),
    referrer: referrer,
    lockTime:
      parseInt(topPools[0]?.lock_time?.split(" ")[0]) === "No"
        ? "No Lock"
        : topPools[cardIndex]?.lock_time?.split(" ")[0],
    listType: "table",
  });

  const faqItems = [
    {
      title: "What is Dypius Stake?",
      option: "Staking",
      pathName: "/earn",
      section: "earnFaq",
      pool: null,
      faqIndex: 1,
    },
    {
      title: "What is the Reinvest function?",
      option: "Staking",
      pathName: "/earn",
      section: "earnFaq",
      pool: null,
      faqIndex: 14,
    },
    {
      title: "What is APR?",
      option: "Farming",
      pathName: "/earn",
      section: "earnFaq",
      pool: null,
      faqIndex: 6,
    },
    {
      title: "What is Dypius Vault?",
      option: "Vault",
      pathName: "/earn",
      section: "earnFaq",
      pool: null,
      faqIndex: 0,
    },
    {
      title: "What is Dypius Bridge?",
      option: "Bridge",
      pathName: "/bridge",
      section: "earnFaq",
      pool: null,
      faqIndex: 0,
    },
    {
      title: "Will my lock period reset if I deposit ad...",
      option: "Farming",
      pathName: "/earn",
      section: "earnFaq",
      pool: null,
      faqIndex: 4,
    },
  ];

  const fetchPopularNewsData = async () => {
    const result = await fetch(`https://news-manage.dyp.finance/api/populars/3`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPopularNewsData(data);
      })
      .catch(console.error);

    return result;
  };

  const fetchStakingData = () => {
    if (network === 1) {
      setTimeout(() => {
        fetchEthStaking();
      }, 500);
    } else if (network === 56) {
      setTimeout(() => {
        fetchBnbStaking();
      }, 500);
    } else if (network === 43114) {
      setTimeout(() => {
        fetchAvaxStaking();
      }, 500);
    }
    else {
      setTimeout(() => {
        fetchEthStaking();
      }, 500);
    }
  };

  useEffect(() => {
    fetchStakingData();
    setLoading(false);
    fetchPopularNewsData();
    fetchUserPools();
  }, [network, coinbase, loading]);

  const windowSize = useWindowSize();

  return (
    <div className="container-lg dashboardwrapper px-0">
      <div className="d-flex m-0 flex-column flex-xxl-row justify-content-between gap-4">
        <div className="d-flex flex-column gap-4 justify-content-between">
          <div className="d-flex flex-column flex-md-row m-0 gap-3 justify-content-between">
            <Calculator />
            <div className="d-flex flex-column gap-3 gap-lg-4 justify-content-between dashboard-cards-wrapper">
              <ExplorerCard />
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                <GovCard />
                <BridgeCard />
              </div>
            </div>
          </div>
          <div>
            <div className="row m-0 align-items-center justify-content-between gap-2 w-100 pb-2">
              <h6 className="top-pools-title">Top Pools</h6>
              <NavLink
                to="/earn"
                className="view-more-title d-flex justify-content-center align-items-center gap-1"
              >
                View all <img src={rightarrow} alt="" />{" "}
              </NavLink>
            </div>
            {windowSize.width > 786 ? (
              <div>
                <div className="row m-0 gap-4 toppool-allwrapper">
                { network === 1 && (
                      <LandCard
                      network={network.toString()}
                      onShowDetailsClick={() => {
                        setActiveCard(1);
                        setcardIndex(1);
                        setDetails(1);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard(null);
                        setDetails();
                      }}
                      cardType={"table"}
                      details={details === 1 ? true : false}
                      expired={false}
                        // tvl={"$" + getFormattedNumber(cawsCard2.tvl_usd)}
                      />
                    )}

                  {topPools.length > 0 && loading === false ? (
                    topPools.slice(0, 2).map((item, index) => {
                      return (
                        <TopPoolsCard
                          key={index}
                          network={network.toString()}
                          isNewPool={item.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === item.id
                                )
                                ? true
                                : false
                              : false
                          }
                          chain={network}
                          top_pick={item.top_pick}
                          tokenName={item.pair_name}
                          apr={item.apy_percent + "%"}
                          tvl={"$" + getFormattedNumber(item.tvl_usd)}
                          lockTime={item.lock_time ? item.lock_time : 30}
                          tokenLogo={
                            item.icon
                              ? item.icon
                              : item.pair_name === "iDYP"
                              ? "idypius.svg"
                              : item.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "newCawsLogo.png"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard(topPools[index]);
                            setcardIndex(index);
                            setDetails(index);
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard(null);
                            setDetails();
                          }}
                          cardType={"table"}
                          details={details === index ? true : false}
                          expired={false}
                        />
                      );
                    })
                  ) : (
                    <div
                      className="w-100 d-flex justify-content-center align-items-center mt-5"
                      style={{ gridColumn: "1 / 3" }}
                    >
                      <FadeLoader color="#7770DF" />
                    </div>
                  )}
                </div>
                {activeCard && network === 1 ? (
                activeCard && network === 1 && cardIndex === 1 ? (
                    <LandDetails
                      coinbase={coinbase}
                      isConnected={isConnected}
                      listType={"table"}
                      chainId={network.toString()}
                      handleSwitchNetwork={handleSwitchNetwork}
                      handleConnection={handleConnection}
                    />
                  ) : activeCard && network === 1 && cardIndex === 0 ? (
                    <CawsDetails
                      coinbase={coinbase}
                      isConnected={isConnected}
                      listType={"table"}
                      chainId={network.toString()}
                      handleSwitchNetwork={handleSwitchNetwork}
                      handleConnection={handleConnection}
                      expired={false}
                      renderedPage={"dashboard"}
                    />
                  ) : (
                    <></>
                  )
                ) : activeCard && network === 56 && cardIndex === 0 ? (
                  <StakeBsc
                    lp_id={LP_IDBNB_Array[cardIndex]}
                    staking={stakearrayStakeBscDyp2[1]}
                    apr={
                      topPools[0]?.apy_percent ? topPools[0]?.apy_percent : 30
                    }
                    liquidity={wbsc_address}
                    expiration_time={expirearrayStakeBscDyp2[1]}
                    finalApr={
                      topPools[0]?.apy_performancefee
                        ? topPools[0]?.apy_performancefee
                        : 30
                    }
                    fee={topPools[0]?.performancefee}
                    lockTime={
                      parseInt(topPools[0]?.lock_time?.split(" ")[0]) === "No"
                        ? "No Lock"
                        : topPools[0]?.lock_time?.split(" ")[0]
                    }
                    listType={"table"}
                    other_info={false}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    referrer={referrer}
                  />
                ) : activeCard && network === 56 && cardIndex === 1 ? (
                  <StakeBscIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_stakingidyp_6}
                    listType={"table"}
                    finalApr={
                      topPools[1]?.apy_performancefee
                        ? topPools[1]?.apy_performancefee
                        : 30
                    }
                    apr={
                      topPools[1]?.apy_percent ? topPools[1]?.apy_percent : 30
                    }
                    liquidity={wbsc_address}
                    expiration_time={"15 August 2023"}
                    other_info={false}
                    fee_s={
                      topPools[1]?.performancefee
                        ? topPools[1]?.performancefee
                        : 0
                    }
                    fee_u={0}
                    lockTime={
                      parseInt(topPools[1]?.lock_time?.split(" ")[0]) === "No"
                        ? "No Lock"
                        : topPools[1]?.lock_time?.split(" ")[0]
                    }
                  />
                ) : activeCard && network === 43114 && cardIndex === 0 ? (
                  <StakeAvax
                    is_wallet_connected={isConnected}
                    handleConnection={handleConnection}
                    the_graph_result={the_graph_resultavax}
                    chainId={network.toString()}
                    coinbase={coinbase}
                    referrer={referrer}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                  />
                ) : activeCard && network === 43114 && cardIndex === 1 ? (
                  <StakeAvaxIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultavax}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_staking_idypavax_6}
                    listType={"table"}
                    finalApr={
                      topPools[1]?.apy_performancefee
                        ? topPools[1]?.apy_performancefee
                        : 30
                    }
                    apr={
                      topPools[1]?.apy_percent ? topPools[1]?.apy_percent : 30
                    }
                    liquidity={avax_address}
                    expiration_time={"15 August 2023"}
                    other_info={false}
                    fee_s={
                      topPools[1]?.performancefee
                        ? topPools[1]?.performancefee
                        : 0
                    }
                    fee_u={0}
                    lockTime={
                      parseInt(topPools[1]?.lock_time?.split(" ")[0]) === "No"
                        ? "No Lock"
                        : topPools[1]?.lock_time?.split(" ")[0]
                    }
                  />
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                <div className="row m-0 gap-4 toppool-allwrapper">
                { network === 1 && (
                      <LandCard
                      network={network.toString()}
                      onShowDetailsClick={() => {
                        setActiveCard(1);
                        setcardIndex(1);
                        setDetails(1);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard(null);
                        setDetails();
                      }}
                      cardType={"table"}
                      details={details === 1 ? true : false}
                      expired={false}
                        // tvl={"$" + getFormattedNumber(cawsCard2.tvl_usd)}
                      />
                    )}
                    {activeCard && network === 1 && cardIndex === 1 && (
                    <LandDetails
                      coinbase={coinbase}
                      isConnected={isConnected}
                      listType={"table"}
                      chainId={network.toString()}
                      handleSwitchNetwork={handleSwitchNetwork}
                      handleConnection={handleConnection}
                    />
                  )}
                  {topPools.length > 0 && loading === false ? (
                    topPools.slice(0, 1).map((item, index) => {
                      return (
                        <TopPoolsCard
                          key={index}
                          network={network.toString()}
                          chain={network}
                          top_pick={item.top_pick}
                          tokenName={item.pair_name}
                          apr={item.apy_percent + "%"}
                          tvl={"$" + getFormattedNumber(item.tvl_usd)}
                          lockTime={item.lock_time ? item.lock_time : 30}
                          tokenLogo={
                            item.icon
                              ? item.icon
                              : item.pair_name === "iDYP"
                              ? "idypius.svg"
                              : item.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "newCawsLogo.png"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard(topPools[index]);
                            setcardIndex(index);
                            setActiveCard2(null);
                            setDetails(index);
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard(null);
                            setActiveCard2(null);
                            setDetails();
                          }}
                          cardType={"table"}
                          details={details === index ? true : false}
                          expired={false}
                          isNewPool={item.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === item.id
                                )
                                ? true
                                : false
                              : false
                          }
                        />
                      );
                    })
                  ) : (
                    <div
                      className="w-100 d-flex justify-content-center align-items-center mt-5"
                      style={{ gridColumn: "1 / 3" }}
                    >
                      <FadeLoader color="#7770DF" />
                    </div>
                  )}
                </div>
                {activeCard && network === 1 && cardIndex === 0 && (
                    <CawsDetails
                      coinbase={coinbase}
                      isConnected={isConnected}
                      listType={"table"}
                      chainId={network.toString()}
                      handleSwitchNetwork={handleSwitchNetwork}
                      handleConnection={handleConnection}
                      expired={false}
                      renderedPage={"dashboard"}
                    />
                  )}
                {
                 activeCard && network === 56 && cardIndex === 0 ? (
                  <StakeBsc
                    lp_id={LP_IDBNB_Array[cardIndex]}
                    staking={stakearrayStakeBscDyp2[1]}
                    apr={
                      topPools[0]?.apy_percent ? topPools[0]?.apy_percent : 30
                    }
                    liquidity={wbsc_address}
                    expiration_time={expirearrayStakeBscDyp2[1]}
                    finalApr={
                      topPools[0]?.apy_performancefee
                        ? topPools[0]?.apy_performancefee
                        : 30
                    }
                    fee={topPools[0]?.performancefee}
                    lockTime={
                      parseInt(topPools[0]?.lock_time?.split(" ")[0]) === "No"
                        ? "No Lock"
                        : topPools[0]?.lock_time?.split(" ")[0]
                    }
                    listType={"table"}
                    other_info={false}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    referrer={referrer}
                  />
                ) : activeCard && network === 56 && cardIndex === 1 ? (
                  <StakeBscIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_stakingidyp_6}
                    listType={"table"}
                    finalApr={
                      topPools[1]?.apy_performancefee
                        ? topPools[1]?.apy_performancefee
                        : 30
                    }
                    apr={
                      topPools[1]?.apy_percent ? topPools[1]?.apy_percent : 30
                    }
                    liquidity={wbsc_address}
                    expiration_time={"15 August 2023"}
                    other_info={false}
                    fee_s={
                      topPools[1]?.performancefee
                        ? topPools[1]?.performancefee
                        : 0
                    }
                    fee_u={0}
                    lockTime={
                      parseInt(topPools[1]?.lock_time?.split(" ")[0]) === "No"
                        ? "No Lock"
                        : topPools[1]?.lock_time?.split(" ")[0]
                    }
                  />
                ) : activeCard && network === 43114 && cardIndex === 0 ? (
                  <StakeAvax
                    is_wallet_connected={isConnected}
                    handleConnection={handleConnection}
                    the_graph_result={the_graph_resultavax}
                    chainId={network.toString()}
                    coinbase={coinbase}
                    referrer={referrer}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                  />
                ) : activeCard && network === 43114 && cardIndex === 1 ? (
                  <StakeAvaxIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultavax}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_staking_idypavax_6}
                    listType={"table"}
                    finalApr={
                      topPools[1]?.apy_performancefee
                        ? topPools[1]?.apy_performancefee
                        : 30
                    }
                    apr={
                      topPools[1]?.apy_percent ? topPools[1]?.apy_percent : 30
                    }
                    liquidity={avax_address}
                    expiration_time={"15 August 2023"}
                    other_info={false}
                    fee_s={
                      topPools[1]?.performancefee
                        ? topPools[1]?.performancefee
                        : 0
                    }
                    fee_u={0}
                    lockTime={
                      parseInt(topPools[1]?.lock_time?.split(" ")[0]) === "No"
                        ? "No Lock"
                        : topPools[1]?.lock_time?.split(" ")[0]
                    }
                  />
                ) : (
                  <></>
                )}
                <div className="row m-0 gap-4 toppool-allwrapper">
               
                  {topPools.length > 0 && loading === false ? (
                    topPools.slice(1, 2).map((item, index) => {
                      return (
                        <TopPoolsCard
                          network={network.toString()}
                          key={index}
                          chain={network}
                          top_pick={item.top_pick}
                          tokenName={item.pair_name}
                          apr={item.apy_percent + "%"}
                          tvl={"$" + getFormattedNumber(item.tvl_usd)}
                          lockTime={item.lock_time ? item.lock_time : 30}
                          tokenLogo={
                            item.icon
                              ? item.icon
                              : item.pair_name === "iDYP"
                              ? "idypius.svg"
                              : item.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "newCawsLogo.png"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard2(topPools[index + 1]);
                            setActiveCard(null);
                            setcardIndex(index + 1);
                            setDetails(index + 1);
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard2(null);
                            setDetails();
                            setActiveCard(null);
                          }}
                          cardType={"table"}
                          details={details === index + 1 ? true : false}
                          expired={false}
                          isNewPool={item.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === item.id
                                )
                                ? true
                                : false
                              : false
                          }
                        />
                      );
                    })
                  ) : (
                    <div
                      className="w-100 d-flex justify-content-center align-items-center mt-5"
                      style={{ gridColumn: "1 / 3" }}
                    >
                      <FadeLoader color="#7770DF" />
                    </div>
                  )}
                </div>
                {activeCard2 && network === 1 ? (
                  network === 1 && cardIndex === 2 ? (
                    <LandDetails
                    coinbase={coinbase}
                    isConnected={isConnected}
                    listType={"table"}
                    chainId={network.toString()}
                    handleSwitchNetwork={handleSwitchNetwork}
                    handleConnection={handleConnection}
                  />
                  ) : activeCard2 && network === 1 && cardIndex === 0 ? (
                    <CawsDetails
                      coinbase={coinbase}
                      isConnected={isConnected}
                      listType={"table"}
                      chainId={network.toString()}
                      handleSwitchNetwork={handleSwitchNetwork}
                      handleConnection={handleConnection}
                      expired={false}
                      renderedPage={"dashboard"}
                    />
                  ) : (
                    <></>
                  )
                ) : activeCard2 && network === 56 && cardIndex === 0 ? (
                  <StakeBsc
                    lp_id={LP_IDBNB_Array[cardIndex]}
                    staking={stakearrayStakeBscDyp2[1]}
                    apr={
                      topPools[0]?.apy_percent ? topPools[0]?.apy_percent : 30
                    }
                    liquidity={wbsc_address}
                    expiration_time={expirearrayStakeBscDyp2[1]}
                    finalApr={
                      topPools[0]?.apy_performancefee
                        ? topPools[0]?.apy_performancefee
                        : 30
                    }
                    fee={topPools[0]?.performancefee}
                    lockTime={
                      parseInt(topPools[0]?.lock_time?.split(" ")[0]) === "No"
                        ? "No Lock"
                        : topPools[0]?.lock_time?.split(" ")[0]
                    }
                    listType={"table"}
                    other_info={false}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    referrer={referrer}
                  />
                ) : activeCard2 && network === 56 && cardIndex === 1 ? (
                  <StakeBscIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_stakingidyp_6}
                    listType={"table"}
                    finalApr={
                      topPools[1]?.apy_performancefee
                        ? topPools[1]?.apy_performancefee
                        : 30
                    }
                    apr={
                      topPools[1]?.apy_percent ? topPools[1]?.apy_percent : 30
                    }
                    liquidity={wbsc_address}
                    expiration_time={"15 August 2023"}
                    other_info={false}
                    fee_s={
                      topPools[1]?.performancefee
                        ? topPools[1]?.performancefee
                        : 0
                    }
                    fee_u={0}
                    lockTime={
                      parseInt(topPools[1]?.lock_time?.split(" ")[0]) === "No"
                        ? "No Lock"
                        : topPools[1]?.lock_time?.split(" ")[0]
                    }
                  />
                ) : activeCard2 && network === 43114 && cardIndex === 0 ? (
                  <StakeAvax
                    is_wallet_connected={isConnected}
                    handleConnection={handleConnection}
                    the_graph_result={the_graph_resultavax}
                    chainId={network.toString()}
                    coinbase={coinbase}
                    referrer={referrer}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                  />
                ) : activeCard2 && network === 43114 && cardIndex === 1 ? (
                  <StakeAvaxIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultavax}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_staking_idypavax_6}
                    listType={"table"}
                    finalApr={
                      topPools[1]?.apy_performancefee
                        ? topPools[1]?.apy_performancefee
                        : 30
                    }
                    apr={
                      topPools[1]?.apy_percent ? topPools[1]?.apy_percent : 30
                    }
                    liquidity={avax_address}
                    expiration_time={"15 August 2023"}
                    other_info={false}
                    fee_s={
                      topPools[1]?.performancefee
                        ? topPools[1]?.performancefee
                        : 0
                    }
                    fee_u={0}
                    lockTime={
                      parseInt(topPools[1]?.lock_time?.split(" ")[0]) === "No"
                        ? "No Lock"
                        : topPools[1]?.lock_time?.split(" ")[0]
                    }
                  />
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
          <div className="row m-0 align-items-center justify-content-between gap-2 w-100">
            <h6 className="top-pools-title">News</h6>
            <NavLink
              className="view-more-title d-flex justify-content-center align-items-center gap-1"
              to="/news"
            >
              View all <img src={rightarrow} alt="" />
            </NavLink>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-between px-0">
              {popularNewsData !== [] && (
                <>
                  {" "}
                  <TrendingNews
                    image={popularNewsData[0]?.image}
                    title={popularNewsData[0]?.title}
                    date={popularNewsData[0]?.date}
                    link={popularNewsData[0]?.id}
                  />
                  <div className="d-flex flex-column flex-lg-row gap-3 regular-news">
                    <NewsCard
                      image={popularNewsData[1]?.image}
                      title={popularNewsData[1]?.title}
                      date={popularNewsData[1]?.date}
                      link={popularNewsData[1]?.id}
                    />
                    <NewsCard
                      image={popularNewsData[2]?.image}
                      title={popularNewsData[2]?.title}
                      date={popularNewsData[2]?.date}
                      link={popularNewsData[2]?.id}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="right-side-wrapper d-flex flex-column flex-md-row flex-xxl-column gap-4">
          <div className="launchpad-section-wrapper d-flex flex-column gap-3 gap-xxl-1">
            <h6 className="header">Launchpad</h6>
            <LaunchpadCard />
          </div>
          <ChainlinkCard />
          <div
            className="faq-items-wrapper d-flex flex-column"
            style={{ gap: "11px" }}
          >
            <h6 className="header">FAQs</h6>
            <div className="faq-grid">
              {faqItems.map((faq, index) => (
                <FaqCard
                key={index}
                  title={faq.title}
                  option={faq.option}
                  pathName={faq.pathName}
                  section={faq.section}
                  pool={faq.pool}
                  faqIndex={faq.faqIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
