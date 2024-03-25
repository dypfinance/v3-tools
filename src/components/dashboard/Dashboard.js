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
import LandCard from "../top-pools-card/LandCard";
import LandDetails from "../FARMINNG/land";
import StakeAvax from "../FARMINNG/stakeAvax";
import StakeNewEth from "../FARMINNG/stakeNewEth";
import CawsWodDetails from "../FARMINNG/cawsWod";
import CawsWodCard from "../top-pools-card/CawsWodCard";
import BscFarmingFunc from "../FARMINNG/BscFarmingFunc";
import MigrationBanner from "../migrationbanner/MigrationBanner";
import StakeAvaxIDyp from "../FARMINNG/stakeAvaxiDyp";
import StakeDypiusEth from "../FARMINNG/constant-staking-dypius-new";
import StakeDypiusAvax from "../FARMINNG/stakeDypiusAvax";
import StakeDypiusBsc from "../FARMINNG/bscConstantStakeDypius";
import InitConstantStakingiDYP from "../FARMINNG/constant-staking-idyp-new-front";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import closeX from "../earnOther/assets/closeX.svg";

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
  isPremium,
  onConnectWallet,
}) => {
  const [topPools, setTopPools] = useState([]);
  const [cawsLandCard, setCawsLandCard] = useState([]);
  const [theBnbPool, setTheBnbPool] = useState({});
  const [wbnbPrice, setWbnbPrice] = useState();
  const [selectedTab, setselectedTab] = useState("deposit");
  const [selectedBtn, setselectedBtn] = useState("flexible");
  const [selectedPool, setselectedPool] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

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

  const fetchBscFarming = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_bsc_v2")
      .then((res) => {
        let temparray = Object.entries(res.data.the_graph_bsc_v2.lp_data);
        let bnbpool = temparray.filter((item) => {
          setWbnbPrice(res.data.the_graph_bsc_v2.usd_per_eth);
          return (
            item[1].id ===
            "0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb-0x5bc3a80a1f2c4fb693d9dddcebbb5a1b5bb15d65"
          );
        });
        setTheBnbPool(bnbpool);
      })
      .catch((err) => console.error(err));
  };

  const fetchBnbStaking = async () => {
    const bnb_result2 = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_bnb_new`)
      .catch((err) => {
        console.log(err);
      });

    if (bnb_result2 && bnb_result2.status === 200) {
      const dypBnb = bnb_result2.data.stakingInfoDYPBnb;
      const object2 = dypBnb.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd };
      });

      const cleanCards2 = object2.filter((item) => {
        return item.expired === "No";
      });

      const sortedAprs = cleanCards2.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });

      setTopPools(sortedAprs);
    }
  };
  
  const fetchAvaxStaking = async () => {
    const result_avax = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_avax`)
      .catch((err) => {
        console.log(err);
      });

    const result_avax2 = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_avax_new`)
      .catch((err) => {
        console.log(err);
      });

    if (
      result_avax &&
      result_avax.status === 200 &&
      result_avax2 &&
      result_avax2.status === 200
    ) {
      const dypIdypAvax = result_avax.data.stakingInfoiDYPAvax;
      const dypAvax = result_avax2.data.stakingInfoDYPAvax;
      const object2 = dypAvax.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd };
      });
      const cleanCards = dypIdypAvax.filter((item) => {
        return item.expired !== "Yes";
      });

      const cleanCards2 = object2.filter((item) => {
        return item.expired !== "Yes";
      });

      const allActiveCards = [...cleanCards, ...cleanCards2];

      const sortedAprs = allActiveCards.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });

      setTopPools(sortedAprs);
    }
  };

  const [landCard, setLandCard] = useState({});

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
      const dypIdyp = eth_result.data.stakingInfoiDYPEth.concat(
        eth_result.data.stakingInfoDYPEth
      );
      const dypEth = eth_result2.data.stakingInfoDYPEth;

      const allpools = [...dypEth, ...dypIdyp];
      const object2 = allpools.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd };
      });

      const cleanCards = object2.filter((item) => {
        return item.expired !== "Yes";
      });

      const sortedAprs = cleanCards.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });

      setTopPools(sortedAprs);
      setLandCard(eth_result.data.stakingInfoLAND[0]);

      const land = eth_result.data.stakinginfoCAWSLAND;
      setCawsLandCard(land[0]);
    }
  };

  const [activeCard, setActiveCard] = useState();
  const [activeCardFarm, setActiveCardFarm] = useState();

  const [cardIndex, setcardIndex] = useState();
  const [details, setDetails] = useState();
  const [popularNewsData, setPopularNewsData] = useState([]);
  const [activeCard2, setActiveCard2] = useState();
  const [loading, setLoading] = useState(true);

  // let network = parseInt(network);

  const eth_address = "ETH";

  const expirearrayStakeBscDyp2 = ["14 July 2023", "5 August 2023"];

  const { LP_IDs_V2BNB } = window;

  const LP_IDBNB_Array = [
    LP_IDs_V2BNB.wbnb[0],
    LP_IDs_V2BNB.wbnb[1],
    LP_IDs_V2BNB.wbnb[2],
    LP_IDs_V2BNB.wbnb[3],
    LP_IDs_V2BNB.wbnb[4],
  ];

  const avax_address = "AVAX";

  const faqItems = [
    {
      title: "What is Dypius Stake?",
      option: "Staking",
      pathName: "/earn/dypius",
      section: "earnFaq",
      pool: null,
      faqIndex: 1,
    },
    {
      title: "What is the Reinvest function?",
      option: "Staking",
      pathName: "/earn/dypius",
      section: "earnFaq",
      pool: null,
      faqIndex: 14,
    },
    {
      title: "What is APR?",
      option: "Farming",
      pathName: "/earn/dypius",
      section: "earnFaq",
      pool: null,
      faqIndex: 6,
    },
    {
      title: "What is Dypius Vault?",
      option: "Vault",
      pathName: "/earn/dypius",
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
      pathName: "/earn/dypius",
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

  const fetchStakeData = async () => {
    if (network === 1) {
      await fetchEthStaking();
    } else if (network === 56) {
      await fetchBnbStaking();
    } else if (network === 43114) {
      await fetchAvaxStaking();
    } else await fetchEthStaking();
  };

  useEffect(() => {
    fetchStakeData().then();
    setTimeout(() => {
      setLoading(false);
    }, 2500);
    fetchPopularNewsData();
    fetchUserPools();
    fetchBscFarming();
  }, [network, coinbase, loading]);

  const windowSize = useWindowSize();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width:
      windowSize.width > 1400 ? "auto" : windowSize.width > 786 ? "50%" : "95%",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    minHeight: 200,
    overflowX: "hidden",
    borderRadius: "10px",
    height: windowSize.width < 500 ? "480px" : "auto",
    background: `#1A1A36`,
  };

  return (
    <>
      <div className="container-lg dashboardwrapper px-0">
        <div className="d-flex m-0 flex-column flex-xxl-row justify-content-between gap-4">
          <div className="d-flex flex-column gap-4 justify-content-between">
            <div className="d-flex flex-column flex-md-row m-0 gap-3 justify-content-between">
              {/* <Calculator /> */}
              <MigrationBanner />
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
                  to="/earn/dypius"
                  className="view-more-title d-flex justify-content-center align-items-center gap-1"
                >
                  View all <img src={rightarrow} alt="" />{" "}
                </NavLink>
              </div>
              {windowSize.width > 786 ? (
                <div>
                  <div className="row m-0 gap-4 toppool-allwrapper">
                    {topPools.length > 0 &&
                    (network === 1 ||
                      network === 1030 ||
                      network === 8453 ||
                      network === 0) &&
                    loading === false ? (
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
                            tvl={
                              item.tvl_usd === "--"
                                ? item.tvl_usd
                                : "$" + getFormattedNumber(item.tvl_usd)
                            }
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
                              setselectedPool(item);
                              setShowDetails(true);
                            }}
                            onHideDetailsClick={() => {
                              setActiveCard(null);
                              setDetails();
                            }}
                            cardType={"table"}
                            details={details === index ? true : false}
                            expired={false}
                            isPremium={isPremium}
                          />
                        );
                      })
                    ) : topPools.length > 0 &&
                      network === 43114 &&
                      loading === false ? (
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
                            tvl={
                              item.tvl_usd === "--"
                                ? item.tvl_usd
                                : "$" + getFormattedNumber(item.tvl_usd)
                            }
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
                              setActiveCard(
                                item.tvl_usd !== "--" ? topPools[index] : null
                              );
                              setcardIndex(
                                item.tvl_usd !== "--" ? index : null
                              );
                              setDetails(item.tvl_usd !== "--" ? index : null);
                              setselectedPool(item);
                              setShowDetails(true);
                            }}
                            onHideDetailsClick={() => {
                              setActiveCard(null);
                              setDetails();
                            }}
                            cardType={"table"}
                            details={details === index ? true : false}
                            expired={false}
                            isPremium={isPremium}
                          />
                        );
                      })
                    ) : topPools.length > 0 &&
                      network === 56 &&
                      loading === false ? (
                      topPools.slice(0, 1).map((item, index) => {
                        return (
                          <>
                            <TopPoolsCard
                              chain={"bnb"}
                              top_pick={false}
                              tokenName={"WBNB"}
                              apr={`${getFormattedNumber(
                                theBnbPool[0][1].apy_percent,
                                0
                              )}%`}
                              tvl={`$${getFormattedNumber(
                                theBnbPool[0][1].tvl_usd,
                                2
                              )}`}
                              lockTime={"3 Days"}
                              tokenLogo={"bnb.svg"}
                              onShowDetailsClick={() => {
                                setActiveCard(null);
                                setDetails(1);
                                setActiveCardFarm(1);
                                // setselectedPool(item);
                                setShowDetails(false);
                              }}
                              onHideDetailsClick={() => {
                                setActiveCard(null);
                                setDetails();
                                setActiveCardFarm();
                              }}
                              cardType={"Farming"}
                              details={details === 1 ? true : false}
                              isNewPool={true}
                              isStaked={false}
                              expired={false}
                              network={network.toString()}
                              isPremium={isPremium}
                            />

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
                              tvl={
                                item.tvl_usd === "--"
                                  ? item.tvl_usd
                                  : "$" + getFormattedNumber(item.tvl_usd)
                              }
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
                                setselectedPool(item);
                                setShowDetails(true);
                              }}
                              onHideDetailsClick={() => {
                                setActiveCard(null);
                                setDetails();
                              }}
                              cardType={"table"}
                              details={details === index ? true : false}
                              expired={false}
                              isPremium={isPremium}
                            />
                          </>
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
                  {
                    // activeCard &&
                    // (network === 1 || network === 1030 || network === 8453) ? (
                    //   activeCard &&
                    //   (network === 1 || network === 1030 || network === 8453) &&
                    //   topPools[cardIndex]?.id ===
                    //     "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" ? (
                    //     <StakeDypiusEth
                    //       staking={window.constant_staking_dypius_eth1}
                    //       apr={
                    //         topPools[cardIndex]?.apy_percent
                    //           ? topPools[cardIndex]?.apy_percent
                    //           : 30
                    //       }
                    //       liquidity={eth_address}
                    //       expiration_time={"09 November 2024"}
                    //       finalApr={topPools[cardIndex]?.apy_performancefee}
                    //       fee={0}
                    //       lockTime={
                    //         topPools[cardIndex]?.lock_time === "No lock"
                    //           ? "No Lock"
                    //           : topPools[cardIndex]?.lock_time?.split(" ")[0]
                    //       }
                    //       lp_id={LP_IDBNB_Array[cardIndex]}
                    //       listType={"table"}
                    //       other_info={false}
                    //       is_wallet_connected={isConnected}
                    //       coinbase={coinbase}
                    //       the_graph_result={the_graph_result}
                    //       chainId={network.toString()}
                    //       handleConnection={handleConnection}
                    //       handleSwitchNetwork={handleSwitchNetwork}
                    //       expired={false}
                    //       referrer={referrer}
                    //     />
                    //   ) :
                    //    (network === 1 ||
                    //       network === 1030 ||
                    //       network === 8453) &&
                    //     topPools[cardIndex]?.id ===
                    //       "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                    //     <InitConstantStakingiDYP
                    //       staking={window.constant_staking_idyp_5}
                    //       apr={
                    //         topPools[cardIndex]?.apy_percent
                    //           ? topPools[cardIndex]?.apy_percent
                    //           : 30
                    //       }
                    //       liquidity={eth_address}
                    //       expiration_time={"18 July 2024"}
                    //       finalApr={topPools[cardIndex]?.apy_performancefee}
                    //       fee={0}
                    //       fee_s={topPools[cardIndex]?.performancefee}
                    //       lockTime={
                    //         topPools[cardIndex]?.lock_time === "No lock"
                    //           ? "No Lock"
                    //           : topPools[cardIndex]?.lock_time?.split(" ")[0]
                    //       }
                    //       lp_id={LP_IDBNB_Array[cardIndex]}
                    //       listType={"table"}
                    //       other_info={false}
                    //       is_wallet_connected={isConnected}
                    //       coinbase={coinbase}
                    //       the_graph_result={the_graph_result}
                    //       chainId={network.toString()}
                    //       handleConnection={handleConnection}
                    //       handleSwitchNetwork={handleSwitchNetwork}
                    //       expired={false}
                    //       referrer={referrer}
                    //     />
                    //   ) : (
                    //     <></>
                    //   )
                    // ) :
                    //  activeCard &&
                    //   network === 56 &&
                    //   topPools[cardIndex]?.id ===
                    //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" ? (
                    //   <StakeDypiusBsc
                    //     lp_id={LP_IDBNB_Array[cardIndex]}
                    //     staking={window.constant_staking_dypius_bsc1}
                    //     apr={
                    //       topPools[cardIndex]?.apy_percent
                    //         ? topPools[cardIndex]?.apy_percent
                    //         : 30
                    //     }
                    //     liquidity={wbsc_address}
                    //     expiration_time={"09 November 2024"}
                    //     finalApr={topPools[cardIndex]?.apy_performancefee}
                    //     fee={topPools[cardIndex]?.performancefee}
                    //     lockTime={
                    //       topPools[cardIndex]?.lock_time === "No lock"
                    //         ? "No Lock"
                    //         : topPools[cardIndex]?.lock_time?.split(" ")[0]
                    //     }
                    //     listType={"table"}
                    //     other_info={false}
                    //     is_wallet_connected={isConnected}
                    //     coinbase={coinbase}
                    //     the_graph_result={the_graph_resultbsc}
                    //     chainId={network.toString()}
                    //     handleConnection={handleConnection}
                    //     handleSwitchNetwork={handleSwitchNetwork}
                    //     expired={false}
                    //     referrer={referrer}
                    //   />
                    // ) :
                    activeCardFarm && network === 56 ? (
                      <BscFarmingFunc
                        is_wallet_connected={isConnected}
                        wbnbPrice={wbnbPrice}
                        coinbase={coinbase}
                        latestTvl={theBnbPool[0][1].tvl_usd}
                        the_graph_result={the_graph_resultbsc}
                        lp_id={LP_IDBNB_Array[cardIndex]}
                        chainId={network.toString()}
                        handleConnection={handleConnection}
                        expired={false}
                        handleSwitchNetwork={handleSwitchNetwork}
                        latestApr={theBnbPool[0][1].apy_percent}
                        liquidity={wbsc_address}
                        constant={window.farming_activebsc_1}
                        staking={window.constant_staking_newbscactive1}
                        token={window.token_newbsc}
                        lp_symbol={"USD"}
                        lock="3 Days"
                        rebase_factor={1}
                        expiration_time={"18 July 2024"}
                        fee="0.4"
                        finalApr={theBnbPool[0][1].apy_percent}
                        lockTime={3}
                        listType={"table"}
                      />
                    ) : (
                      // : activeCard &&
                      //   network === 43114 &&
                      //   topPools[cardIndex].id ===
                      //     "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                      //   <StakeAvaxIDyp
                      //     is_wallet_connected={isConnected}
                      //     coinbase={coinbase}
                      //     the_graph_result={the_graph_resultavax}
                      //     chainId={network.toString()}
                      //     handleConnection={handleConnection}
                      //     handleSwitchNetwork={handleSwitchNetwork}
                      //     expired={false}
                      //     staking={window.constant_staking_idypavax_7}
                      //     listType={"table"}
                      //     finalApr={
                      //       topPools[cardIndex]?.apy_performancefee
                      //         ? topPools[cardIndex]?.apy_performancefee
                      //         : 30
                      //     }
                      //     apr={
                      //       topPools[cardIndex]?.apy_percent
                      //         ? topPools[cardIndex]?.apy_percent
                      //         : 30
                      //     }
                      //     liquidity={avax_address}
                      //     expiration_time={"18 July 2024"}
                      //     other_info={false}
                      //     fee_s={topPools[cardIndex]?.performancefee}
                      //     fee_u={topPools[cardIndex]?.performancefee}
                      //     lockTime={60}
                      //   />
                      // ) : activeCard &&
                      //   network === 43114 &&
                      //   topPools[cardIndex].id ===
                      //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" ? (
                      //   <StakeDypiusAvax
                      //     is_wallet_connected={isConnected}
                      //     coinbase={coinbase}
                      //     the_graph_result={the_graph_resultavax}
                      //     chainId={network.toString()}
                      //     handleConnection={handleConnection}
                      //     handleSwitchNetwork={handleSwitchNetwork}
                      //     expired={false}
                      //     staking={window.constant_staking_dypius_avax1}
                      //     listType={"table"}
                      //     finalApr={
                      //       topPools[cardIndex]?.apy_performancefee
                      //         ? topPools[cardIndex]?.apy_performancefee
                      //         : 30
                      //     }
                      //     apr={
                      //       topPools[cardIndex]?.apy_percent
                      //         ? topPools[cardIndex]?.apy_percent
                      //         : 30
                      //     }
                      //     liquidity={avax_address}
                      //     expiration_time={"09 November 2024"}
                      //     other_info={false}
                      //     fee_s={topPools[cardIndex]?.performancefee}
                      //     fee_u={topPools[cardIndex]?.performancefee}
                      //     lockTime={"No Lock"}
                      //   />
                      // )

                      <></>
                    )
                  }
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  <div className="row m-0 gap-4 toppool-allwrapper">
                    {topPools.length > 0 &&
                    (network === 1 ||
                      network === 1030 ||
                      network === 8453 ||
                      network === 0) &&
                    loading === false ? (
                      topPools.slice(0, 2).map((item, index) => {
                        return (
                          <>
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
                              tvl={
                                item.tvl_usd === "--"
                                  ? item.tvl_usd
                                  : "$" + getFormattedNumber(item.tvl_usd)
                              }
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
                                setselectedPool(item);
                                setShowDetails(true);
                              }}
                              onHideDetailsClick={() => {
                                setActiveCard(null);
                                setDetails();
                              }}
                              cardType={"table"}
                              details={details === index ? true : false}
                              expired={false}
                              isPremium={isPremium}
                            />
                            {/* {activeCard &&
                              (network === 1 ||
                                network === 1030 ||
                                network === 8453) &&
                              cardIndex === 0 && (
                                <StakeDypiusEth
                                  staking={window.constant_staking_dypius_eth1}
                                  apr={
                                    topPools[cardIndex]?.apy_percent
                                      ? topPools[cardIndex]?.apy_percent
                                      : 30
                                  }
                                  liquidity={eth_address}
                                  expiration_time={"09 November 2024"}
                                  finalApr={
                                    topPools[cardIndex]?.apy_performancefee
                                      ? topPools[cardIndex]?.apy_performancefee
                                      : 30
                                  }
                                  fee={0}
                                  lockTime={
                                    topPools[cardIndex]?.lock_time === "No lock"
                                      ? "No Lock"
                                      : topPools[cardIndex]?.lock_time?.split(
                                          " "
                                        )[0]
                                  }
                                  lp_id={LP_IDBNB_Array[cardIndex]}
                                  listType={"table"}
                                  other_info={false}
                                  is_wallet_connected={isConnected}
                                  coinbase={coinbase}
                                  the_graph_result={the_graph_result}
                                  chainId={network.toString()}
                                  handleConnection={handleConnection}
                                  handleSwitchNetwork={handleSwitchNetwork}
                                  expired={false}
                                  referrer={referrer}
                                />
                              )} */}
                          </>
                        );
                      })
                    ) : topPools.length > 0 &&
                      network === 43114 &&
                      loading === false ? (
                      topPools.slice(0, 2).map((item, index) => {
                        return (
                          <>
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
                              tvl={
                                item.tvl_usd === "--"
                                  ? item.tvl_usd
                                  : "$" + getFormattedNumber(item.tvl_usd)
                              }
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
                                setActiveCard(
                                  item.tvl_usd !== "--" ? topPools[index] : null
                                );
                                setcardIndex(
                                  item.tvl_usd !== "--" ? index : null
                                );
                                setDetails(
                                  item.tvl_usd !== "--" ? index : null
                                );
                                setselectedPool(item);
                                setShowDetails(true);
                              }}
                              onHideDetailsClick={() => {
                                setActiveCard(null);
                                setDetails();
                              }}
                              cardType={"table"}
                              details={details === index ? true : false}
                              expired={false}
                              isPremium={isPremium}
                            />
                            {/* {activeCard &&
                              network === 43114 &&
                              topPools[cardIndex].id ===
                                "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" && (
                                <StakeDypiusAvax
                                  is_wallet_connected={isConnected}
                                  coinbase={coinbase}
                                  the_graph_result={the_graph_resultavax}
                                  chainId={network.toString()}
                                  handleConnection={handleConnection}
                                  handleSwitchNetwork={handleSwitchNetwork}
                                  expired={false}
                                  staking={window.constant_staking_dypius_avax1}
                                  listType={"table"}
                                  finalApr={
                                    topPools[cardIndex]?.apy_performancefee
                                      ? topPools[cardIndex]?.apy_performancefee
                                      : 30
                                  }
                                  apr={
                                    topPools[cardIndex]?.apy_percent
                                      ? topPools[cardIndex]?.apy_percent
                                      : 30
                                  }
                                  liquidity={avax_address}
                                  expiration_time={"09 November 2024"}
                                  other_info={false}
                                  fee_s={topPools[cardIndex]?.performancefee}
                                  fee_u={topPools[cardIndex]?.performancefee}
                                  lockTime={"No Lock"}
                                />
                              )} */}
                          </>
                        );
                      })
                    ) : topPools.length > 0 &&
                      loading === false &&
                      network === 56 ? (
                      topPools.slice(0, 1).map((item, index) => {
                        return (
                          <>
                            <TopPoolsCard
                              chain={"bnb"}
                              top_pick={false}
                              tokenName={"WBNB"}
                              apr={`${getFormattedNumber(
                                theBnbPool[0][1].apy_percent,
                                0
                              )}%`}
                              tvl={`$${getFormattedNumber(
                                theBnbPool[0][1].tvl_usd,
                                2
                              )}`}
                              lockTime={"3 Days"}
                              tokenLogo={"bnb.svg"}
                              onShowDetailsClick={() => {
                                setActiveCard(null);
                                setDetails(1);
                                setActiveCardFarm(1);
                                // setselectedPool(item);
                                // setShowDetails(true);
                              }}
                              onHideDetailsClick={() => {
                                setActiveCard(null);
                                setDetails();
                                setActiveCardFarm();
                              }}
                              cardType={"Farming"}
                              details={details === 1 ? true : false}
                              isNewPool={true}
                              isStaked={false}
                              expired={false}
                              network={network.toString()}
                              isPremium={isPremium}
                            />
                            {activeCardFarm && network === 56 && (
                              <BscFarmingFunc
                                is_wallet_connected={isConnected}
                                wbnbPrice={wbnbPrice}
                                coinbase={coinbase}
                                latestTvl={theBnbPool[0][1].tvl_usd}
                                the_graph_result={the_graph_resultbsc}
                                lp_id={LP_IDBNB_Array[cardIndex]}
                                chainId={network.toString()}
                                handleConnection={handleConnection}
                                expired={false}
                                handleSwitchNetwork={handleSwitchNetwork}
                                latestApr={theBnbPool[0][1].apy_percent}
                                liquidity={wbsc_address}
                                constant={window.farming_activebsc_1}
                                staking={window.constant_staking_newbscactive1}
                                token={window.token_newbsc}
                                lp_symbol={"USD"}
                                lock="3 Days"
                                rebase_factor={1}
                                expiration_time={"18 July 2024"}
                                fee="0.4"
                                finalApr={theBnbPool[0][1].apy_percent}
                                lockTime={3}
                                listType={"table"}
                              />
                            )}

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
                              tvl={
                                item.tvl_usd === "--"
                                  ? item.tvl_usd
                                  : "$" + getFormattedNumber(item.tvl_usd)
                              }
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
                                setselectedPool(item);
                                setShowDetails(true);
                              }}
                              onHideDetailsClick={() => {
                                setActiveCard(null);
                                setDetails();
                              }}
                              cardType={"table"}
                              details={details === index ? true : false}
                              expired={false}
                              isPremium={isPremium}
                            />
                          </>
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

                  {/* {activeCard &&
                    (network === 1 || network === 1030 || network === 8453) &&
                    topPools[cardIndex].id ===
                      "0x41b8a58f4307ea722ad0a964966caa18a6011d93" && (
                      <InitConstantStakingiDYP
                        staking={window.constant_staking_idyp_5}
                        apr={
                          topPools[cardIndex]?.apy_percent
                            ? topPools[cardIndex]?.apy_percent
                            : 30
                        }
                        liquidity={eth_address}
                        expiration_time={"18 July 2024"}
                        finalApr={topPools[cardIndex]?.apy_performancefee}
                        fee={0}
                        fee_s={topPools[cardIndex]?.performancefee}
                        lockTime={
                          topPools[cardIndex]?.lock_time === "No lock"
                            ? "No Lock"
                            : topPools[cardIndex]?.lock_time?.split(" ")[0]
                        }
                        lp_id={LP_IDBNB_Array[cardIndex]}
                        listType={"table"}
                        other_info={false}
                        is_wallet_connected={isConnected}
                        coinbase={coinbase}
                        the_graph_result={the_graph_result}
                        chainId={network.toString()}
                        handleConnection={handleConnection}
                        handleSwitchNetwork={handleSwitchNetwork}
                        expired={false}
                        referrer={referrer}
                      />
                    )} */}

                  {/* {activeCard &&
                  network === 56 &&
                  topPools[cardIndex]?.id ===
                    "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" ? (
                    <StakeDypiusBsc
                      lp_id={LP_IDBNB_Array[cardIndex]}
                      staking={window.constant_staking_dypius_bsc1}
                      apr={
                        topPools[cardIndex]?.apy_percent
                          ? topPools[cardIndex]?.apy_percent
                          : 30
                      }
                      liquidity={wbsc_address}
                      expiration_time={"09 November 2024"}
                      finalApr={topPools[cardIndex]?.apy_performancefee}
                      fee={topPools[cardIndex]?.performancefee}
                      lockTime={
                        topPools[cardIndex]?.lock_time === "No lock"
                          ? "No Lock"
                          : topPools[cardIndex]?.lock_time?.split(" ")[0]
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
                  ) : activeCard &&
                    network === 43114 &&
                    topPools[cardIndex].id ===
                      "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                    <StakeAvaxIDyp
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_resultavax}
                      chainId={network.toString()}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      staking={window.constant_staking_idypavax_7}
                      listType={"table"}
                      finalApr={
                        topPools[cardIndex]?.apy_performancefee
                          ? topPools[cardIndex]?.apy_performancefee
                          : 30
                      }
                      apr={
                        topPools[cardIndex]?.apy_percent
                          ? topPools[cardIndex]?.apy_percent
                          : 30
                      }
                      liquidity={avax_address}
                      expiration_time={"18 July 2024"}
                      other_info={false}
                      fee_s={topPools[cardIndex]?.performancefee}
                      fee_u={topPools[cardIndex]?.performancefee}
                      lockTime={30}
                    />
                  ) : activeCard2 &&
                    network === 43114 &&
                    topPools[cardIndex].id ===
                      "0x6eb643813f0b4351b993f98bdeaef6e0f79573e9" ? (
                    <StakeAvax
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_resultavax}
                      chainId={network.toString()}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      staking={window.constant_staking_new12}
                      listType={"table"}
                      finalApr={
                        topPools[cardIndex]?.apy_performancefee
                          ? topPools[cardIndex]?.apy_performancefee
                          : 30
                      }
                      apr={
                        topPools[cardIndex]?.apy_percent
                          ? topPools[cardIndex]?.apy_percent
                          : 30
                      }
                      liquidity={avax_address}
                      expiration_time={"14 March 2024"}
                      other_info={false}
                      fee_s={topPools[cardIndex]?.performancefee}
                      fee_u={topPools[cardIndex]?.performancefee}
                      lockTime={"No Lock"}
                    />
                  ) : (
                    <></>
                  )} */}
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
                {popularNewsData.length !== 0 && (
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
              <h6 className="header">DeFi Staking</h6>
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
      {showDetails && (
        <Modal
          open={showDetails}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="d-flex flex-column justify-content-center position-relative">
              <div className="d-flex flex-column gap-3 align-items-center justify-content-between">
                <div className="d-flex gap-2 w-100 align-items-center">
                  <div className="d-flex align-items-center gap-5 w-100">
                    <span
                      className={
                        selectedTab === "deposit"
                          ? "switchchain-txt-active"
                          : "switchchain-txt"
                      }
                      onClick={() => {
                        setselectedTab("deposit");
                      }}
                    >
                      Deposit
                    </span>
                    <span
                      className={
                        selectedTab === "withdraw"
                          ? "switchchain-txt-active"
                          : "switchchain-txt"
                      }
                      onClick={() => {
                        setselectedTab("withdraw");
                      }}
                    >
                      Withdraw
                    </span>
                  </div>
                  <img
                    src={closeX}
                    alt=""
                    className="close-x position-relative cursor-pointer "
                    onClick={() => {
                      setShowDetails(false);
                      setselectedTab("deposit");
                      setDetails(888);
                    }}
                    style={{
                      bottom: "17px",
                      alignSelf: "end",
                      width: 16,
                      height: 16,
                    }}
                  />
                </div>

                {activeCard &&
                selectedPool?.id ===
                  "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                  <InitConstantStakingiDYP
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    lp_id={lp_id[cardIndex]}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_staking_idyp_5}
                    listType={"table"}
                    finalApr={selectedPool?.apy_performancefee}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"18 July 2024"}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    onConnectWallet={() => {
                      onConnectWallet();
                      setShowDetails(false);
                      setActiveCard();
                      setselectedPool([])
                      setDetails();
                    }}
                  />
                ) : activeCard &&
                  selectedPool?.id ===
                    "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                  <StakeAvaxIDyp
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultavax}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_staking_idypavax_7}
                    listType={"table"}
                    finalApr={selectedPool.apy_performancefee}
                    apr={selectedPool?.apy_percent}
                    liquidity={avax_address}
                    expiration_time={"18 July 2024"}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    onConnectWallet={() => {
                      onConnectWallet();
                      setShowDetails(false);
                      setActiveCard();
                      setselectedPool([])
                      setDetails();
                    }}
                  />
                ) : activeCard &&
                  network === 56 &&
                  selectedPool?.id ===
                    "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" ? (
                  <StakeDypiusBsc
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_bsc1}
                    apr={selectedPool?.apy_percent}
                    liquidity={wbsc_address}
                    expiration_time={"09 Nov 2024"}
                    finalApr={selectedPool?.apy_performancefee}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    listType={"table"}
                    other_info={false}
                    fee={selectedPool?.performancefee}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    referrer={referrer}
                    onConnectWallet={() => {
                      onConnectWallet();
                      setShowDetails(false);
                      setActiveCard();
                      setselectedPool([]);
                      setDetails();
                    }}
                  />
                ) : activeCard &&
                  selectedPool?.id ===
                    "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" ? (
                  <StakeDypiusAvax
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_avax1}
                    apr={selectedPool?.apy_percent}
                    liquidity={avax_address}
                    expiration_time={"09 Nov 2024"}
                    finalApr={selectedPool?.apy_performancefee}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    listType={"table"}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultavax}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    referrer={referrer}
                    onConnectWallet={() => {
                      onConnectWallet();
                      setShowDetails(false);
                      setActiveCard();
                      setselectedPool([]);
                      setDetails();
                    }}
                  />
                ) : activeCard &&
                  selectedPool?.id ===
                    "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" ? (
                  <StakeDypiusEth
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_eth1}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"09 Nov 2024"}
                    finalApr={selectedPool?.apy_performancefee}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    listType={"table"}
                    other_info={false}
                    fee={selectedPool?.performancefee}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    chainId={network.toString()}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    referrer={referrer}
                    onConnectWallet={() => {
                      onConnectWallet();
                      setShowDetails(false);
                      setActiveCard();
                      setselectedPool([]);
                      setDetails();
                    }}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default Dashboard;
