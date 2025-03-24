import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import getFormattedNumber from "../../../functions/getFormattedNumber2";
import useWindowSize from "../../../functions/useWindowSize";
import TopOtherPoolsNftListCard from "../TopOtherPoolsNftListCard";
import TopPoolsNftListCardInner from "../../top-pools-card/TopPoolsNftListCardInner";

const EarnOtherContentNft = ({
  coinbase,
  poolClickedType,
  poolClicked,
  type,
  the_graph_result,
  lp_id,
  isConnected,
  chainId,
  handleConnection,
  the_graph_resultavax,
  the_graph_resultbsc,
  referrer,
  routeOption,
  routeChain,
  routeSection,
  pool,
  customChain,
  faqIndex,
  networkId,
  handleSwitchNetwork,
  isPremium,
  onCloseCard,
  totalTvl,
}) => {
  const options = [
    {
      title: "Staking",
      content:
        "Staking ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut ipsum quis ligula commodo sollicitudin ut dictum augue. Curabitur massa justo",
      tvl: 244533.54234234,
    },
    // {
    //   title: "Buyback",
    //   content:
    //     "Buyback ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut ipsum quis ligula commodo sollicitudin ut dictum augue. Curabitur massa justo",
    //   tvl: 53312.422334,
    // },
    {
      title: "Vault",
      content:
        "Vault ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut ipsum quis ligula commodo sollicitudin ut dictum augue. Curabitur massa justo",
      tvl: 1122553.74424,
    },
    {
      title: "Farming",
      content:
        "Farming ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut ipsum quis ligula commodo sollicitudin ut dictum augue. Curabitur massa justo",
    },
  ];

  const dummyData_eth = [
    {
      chain: "Ethereum",
      apr: 25,
      tokenLogo: "cawslogo.svg",
      expired: false,
      top_pick: false,
      tokenName: "CAWS",
      tokenTicker: "ETH",
      pool: "CAWS",
      id: "",
      coming_soon: false,
      lockTime: "No lock",
      poolCap: "100",
      new_pool: "Yes",
    },
  ];

  const dummyData_eth_expired = [
    {
      chain: "Ethereum",
      apr: 25,
      tokenLogo: ["lanft-poolicon.png"],
      expired: true,
      top_pick: false,
      tokenName: "WOD",
      tokenTicker: "ETH",
      pool: "WOD",
      id: "",
      coming_soon: false,
      lockTime: "No lock",
      poolCap: "100",
      new_pool: "Yes",
    },
    {
      chain: "Ethereum",
      apr: 50,
      tokenLogo: ["cawslogo.svg"],
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
      top_pick: false,
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
      tokenLogo: ["lanft-poolicon.png"],
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

  const [stake, setStake] = useState("allchains");
  const [option, setOption] = useState(routeOption);
  const [content, setContent] = useState(options[0].content);
  const [listStyle, setListStyle] = useState("list");
  const [myStakes, setMyStakes] = useState(false);
  const [expiredPools, setExpiredPools] = useState(false);
  const [tvl, setTvl] = useState();
  const [ethApr, setEthApr] = useState();
  const [bnbApr, setBnbApr] = useState();
  const [avaxApr, setavaxApr] = useState();
  const [count, setCount] = useState(0);
  const [clickedCawsPool, setclickedCawsPool] = useState(false);

  const fetchBnbPool = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_bsc_v2")
      .then((res) => {
        let temparray = Object.entries(res.data.the_graph_bsc_v2.lp_data);
        let bnbpool = temparray.find((item) => {
          return (
            item[0] ===
            "0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb-0x5bc3a80a1f2c4fb693d9dddcebbb5a1b5bb15d65"
          );
        });
        setBnbApr(bnbpool[1].apy_percent);
      })
      .catch((err) => console.error(err));
  };

  const toggleInactive = () => {
    setCount(count + 1);
    setExpiredPools(!expiredPools);
    if (option === "Farming" && count % 2 === 0) {
      fetchFarmingApr();
      setBnbApr(138);
    } else if (option === "Farming" && count % 2 !== 0) fetchBnbPool();
  };

  var tempTvl = 0;
  var farming = [];

  const windowSize = useWindowSize();

  const fetchEthTvl = async () => {
    await axios
      .get(`https://api.dyp.finance/api/the_graph_eth_v2`)
      .then((res) => {
        let temparray = Object.entries(res.data.the_graph_eth_v2.lp_data);
        temparray.map((item) => {
          farming.push(item[1]);
        });
        farming.map((item) => {
          tempTvl += item.tvl_usd;
        });

        setTvl(tempTvl);
        tempTvl = 0;
      })
      .catch((err) => console.error(err));
  };

  const fetchBscTvl = async () => {
    await axios
      .get(`https://api.dyp.finance/api/the_graph_bsc_v2`)
      .then((res) => {
        let temparray = Object.entries(res.data.the_graph_bsc_v2.lp_data);
        temparray.map((item) => {
          farming.push(item[1]);
        });
        farming.map((item) => {
          tempTvl += item.tvl_usd;
        });

        setTvl(tempTvl);
        tempTvl = 0;
      })
      .catch((err) => console.error(err));
  };

  const fetchAvaxTvl = async () => {
    await axios
      .get(`https://api.dyp.finance/api/the_graph_avax_v2`)
      .then((res) => {
        let temparray = Object.entries(res.data.the_graph_avax_v2.lp_data);
        temparray.map((item) => {
          farming.push(item[1]);
        });
        farming.map((item) => {
          tempTvl += item.tvl_usd;
        });

        setTvl(tempTvl);
        tempTvl = 0;
      })
      .catch((err) => console.error(err));
  };

  const fetchVaultTvl = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_vault_info`)
      .then((res) => {
        setTvl(res.data.VaultTotalTVL[0].tvl);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchEthApr = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_staking_info_eth`)
      .then((res) => {
        setEthApr(res.data.highestAPY_ETH[0].highest_apy);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchBnbApr = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_staking_info_bnb`)
      .then((res) => {
        setBnbApr(res.data.highestAPY_BNB[0].highest_apy);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchAvaxApr = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_staking_info_avax`)
      .then((res) => {
        setavaxApr(res.data.highestAPY_AVAX[0].highest_apy);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchEthBuybackApr = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_buyback_info_eth`)
      .then((res) => {
        setEthApr(res.data.BuybackHighestApy[0].highest_apy);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBnbBuybackApr = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_buyback_info_bnb`)
      .then((res) => {
        setBnbApr(res.data.BuybackHighestApyBNB[0].highest_apy);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAvaxBuybackApr = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_buyback_info_avax`)
      .then((res) => {
        setavaxApr(res.data.BuybackHighestApyAVAX[0].highest_apy);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchFarmingApr = async () => {
    await axios
      .get(`https://api.dyp.finance/api/highest-apy`)
      .then((res) => {
        setEthApr(res.data.highestAPY.highestAPY_ETH_V2);
        // setBnbApr(res.data.highestAPY.highestAPY_BSC_V2);
        // if(expiredPools === true){

        //   setBnbApr(138.44)
        // }else{
        //   fetchBnbPool();
        // }
        setavaxApr(res.data.highestAPY.highestAPY_AVAX_V2);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchEthStaking = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_staking_info_eth`)
      .then((res) => {
        setTvl(res.data.totalTVL_ETH);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBnbStaking = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_staking_info_bnb`)
      .then((res) => {
        setTvl(res.data.totalTVL_BNB);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAvaxStaking = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_staking_info_avax`)
      .then((res) => {
        setTvl(res.data.totalTVL_AVAX);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchEthBuyback = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_buyback_info_eth`)
      .then((res) => {
        setTvl(res.data.totalTVL_BUYBACK_ETH);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBnbBuyback = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_buyback_info_bnb`)
      .then((res) => {
        setTvl(res.data.totalTVL_BUYBACK_BNB);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAvaxBuyback = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_buyback_info_avax`)
      .then((res) => {
        setTvl(res.data.totalTVL_BUYBACK_AVAX);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (option === "Staking") {
      fetchEthApr();
      fetchAvaxApr();
      fetchBnbApr();
      setEthApr(7.35);
    } else if (option === "Buyback") {
      fetchEthBuybackApr();
      fetchBnbBuybackApr();
      fetchAvaxBuybackApr();
    } else if (option === "Farming" && expiredPools === false) {
      // fetchFarmingApr();
      fetchBnbPool();
      setEthApr(0);
      setavaxApr(0);
    } else if (option === "Farming" && expiredPools === true) {
      // fetchFarmingApr();
      fetchFarmingApr();
    }

    if (option === "Staking" && stake === "eth") {
      fetchEthStaking();
    } else if (option === "Staking" && stake === "bnb") {
      fetchBnbStaking();
    } else if (option === "Staking" && stake === "avax") {
      fetchAvaxStaking();
    } else if (option === "Buyback" && stake === "eth") {
      fetchEthBuyback();
    } else if (option === "Buyback" && stake === "bnb") {
      fetchBnbBuyback();
    } else if (option === "Buyback" && stake === "avax") {
      fetchAvaxBuyback();
    } else if (option === "Farming" && stake === "eth") {
      fetchEthTvl();
    } else if (option === "Farming" && stake === "bnb") {
      fetchBscTvl();
    } else if (option === "Farming" && stake === "avax") {
      fetchAvaxTvl();
    } else {
      fetchVaultTvl();
    }
  }, [option, stake, chainId]);

  useEffect(() => {
    if (option === "Farming" && expiredPools === false) {
      setStake("bnb");
    }
  }, [option, expiredPools]);

  useEffect(() => {
    if (
      poolClickedType === "details-nft" &&
      poolClicked === true &&
      clickedCawsPool === false
    ) {
      setMyStakes(false);
      setExpiredPools(false);
      setclickedCawsPool(true);
    } else if (
      poolClickedType === "details-land-nft" &&
      poolClicked === true &&
      clickedCawsPool === false
    ) {
      setMyStakes(false);
      setExpiredPools(false);
      setclickedCawsPool(true);
    }
  }, [poolClickedType, poolClicked, clickedCawsPool]);

  return (
    <>
      <div className="row justify-content-center w-100 mx-0">
        {windowSize.width > 786 ? (
          <div
            className="row justify-content-between align-items-center p-2 options-container bg-transparent"
            style={{ marginTop: "30px" }}
          >
            <div className="col-12 col-lg-3 px-0">
              <div className="total-value-locked-container p-2 d-flex justify-content-between align-items-center">
                <span style={{ fontWeight: "300", fontSize: "13px" }}>
                  Total value locked
                </span>
                <h6
                  className="text-white"
                  style={{ fontWeight: "600", fontSize: "17px" }}
                >
                  ${getFormattedNumber(totalTvl, 0)}
                </h6>
              </div>
            </div>
            {/* <div className="col-2 d-flex justify-content-start align-items-center gap-3">
              <div
                className={`list-style ${
                  listStyle === "list" && "list-style-active"
                }`}
                onClick={() => setListStyle("list")}
              >
                <img
                  src={listStyle === "list" ? listIconActive : listIcon}
                  alt=""
                />
              </div>
              <div
                className={`list-style ${
                  listStyle === "table" && "list-style-active"
                }`}
                onClick={() => setListStyle("table")}
              >
                <img
                  src={listStyle === "table" ? tableIconActive : tableIcon}
                  alt=""
                />
              </div>
            </div> */}
            <div className="col-lg-2 d-flex justify-content-end align-items-center gap-1 gap-lg-3 px-0">
              <h5 className="text-white inactive-pools">Past pools</h5>
              <div
                className={`pill-box ${myStakes && "pill-box-active"}`}
                onClick={() => {
                  setMyStakes(!myStakes);
                  toggleInactive();
                }}
              >
                <div className="pill"></div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="d-flex gap-3 justify-content-between flex-row-reverse align-items-center p-2 options-container"
            style={{ marginTop: "24px", marginBottom: "24px" }}
          >
            <div className="col-lg-2 d-flex justify-content-end align-items-center gap-1 gap-lg-3">
              <h5 className="text-white inactive-pools">Past pools</h5>
              <div
                className={`pill-box ${myStakes && "pill-box-active"}`}
                onClick={() => {
                  setMyStakes(!myStakes);
                  toggleInactive();
                }}
              >
                <div className="pill"></div>
              </div>
            </div>
            <div className="col-lg-4 col-xl-3 px-0 w-100">
              <div className="total-value-locked-container p-2 d-flex flex-column justify-content-between align-items-start">
                <span style={{ fontWeight: "300", fontSize: "13px" }}>
                  Total value locked &nbsp;
                </span>
                <h6
                  className="text-white"
                  style={{ fontWeight: "600", fontSize: "17px" }}
                >
                  ${getFormattedNumber(totalTvl, 0)}
                </h6>
              </div>
            </div>
            {/* <div className="col-6 d-flex px-0 px-lg-2 justify-content-start align-items-center gap-3">
              <div
                className={`list-style ${
                  listStyle === "table" && "list-style-active"
                }`}
                onClick={() => setListStyle("table")}
              >
                <img
                  src={listStyle === "table" ? tableIconActive : tableIcon}
                  alt=""
                />
              </div>
              <div
                className={`list-style ${
                  listStyle === "list" && "list-style-active"
                }`}
                onClick={() => setListStyle("list")}
              >
                <img
                  src={listStyle === "list" ? listIconActive : listIcon}
                  alt=""
                />
              </div>
            </div> */}
          </div>
        )}

        <div
          className={`row m-0 flex-column flex-xxl-row flex-lg-row flex-md-row align-items-center gap-5 gap-lg-0 justify-content-between px-0 `}
          // style={{ minHeight: "55px" }}
        >
          <div className="col-12 col-lg-8 col-xl-5 d-flex flex-column flex-xxl-row flex-lg-row flex-md-row  gap-3 align-items-center justify-content-around justify-content-lg-end justify-content-xl-start px-0 px-xl-2">
            {/* <div className="d-flex flex-row flex-xxl-row flex-lg-row flex-md-row align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <div
                  className={`stake-other-item  position-relative flex-column flex-lg-row d-flex align-items-center gap-2 ${
                    stake === "allchains" ? "all-item-active" : null
                  }`}
                  onClick={() => {
                    setStake("allchains");
                  }}
                >
                  <img
                    src={stake === "allchains" ? allchainActive : allchain}
                    alt=""
                    style={{ width: 18, height: 18 }}
                  />
                  <div className="d-flex flex-column align-items-center align-items-lg-start">
                    <p
                      className="text-white"
                      style={{ fontSize: "12px", fontWeight: "300" }}
                    >
                      All Chains
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`stake-other-item ${
                  option === "Farming" && expiredPools === false && "blur-stake"
                } position-relative flex-column flex-lg-row d-flex align-items-center gap-2 ${
                  stake === "eth" ? "eth-item-active" : null
                }`}
                onClick={() => {
                  setStake("eth");
                }}
              >
                <img
                  src={stake === "eth" ? ethStakeActive : ethStake}
                  alt=""
                  style={{ width: 18, height: 18 }}
                />
                <div className="d-flex flex-column align-items-center align-items-lg-start">
                  <p
                    className="text-white"
                    style={{ fontSize: "12px", fontWeight: "300" }}
                  >
                    Ethereum
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {listStyle === "list" && (
        <div className="row mx-0 justify-content-between align-items-center px-0 py-3 w-100">
          {windowSize.width > 768 && (
            <div
              className="row mx-0 justify-content-between align-items-center px-2 py-2 w-100 options-container"
              style={{ marginBottom: "10px" }}
            >
              <table className="earnother-table">
                <thead className="d-flex w-100 align-items-center justify-content-around">
                  <th className="earnother-th col-2">Pool</th>
                  <th className="earnother-th col-2">Network</th>
                  <th className="earnother-th col-2">APR</th>
                  <th className="earnother-th col-2">Method</th>
                  <th className="earnother-th col-2">Action</th>
                </thead>
              </table>
            </div>
          )}
          <div className="d-flex flex-column gap-3 px-0">
            {expiredPools === false &&
              dummyData_eth.map((item, index) => {
                return (
                  <div key={index}>
                    <TopOtherPoolsNftListCard
                      tokenLogo={item.tokenLogo}
                      chain={item.chain}
                      tokenName={item.tokenName}
                      tokenTicker={item.tokenTicker}
                      apr={item.apr}
                      coming_soon={item.coming_soon}
                      lockTime={item.lockTime}
                      expired={item.expired}
                      chainId={chainId}
                      cardIndex={index}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      isConnected={isConnected}
                      coinbase={coinbase}
                      isNewPool={item.new_pool === "Yes" ? true : false}
                      isPremium={isPremium}
                      clickedCawsPool={clickedCawsPool}
                      onCloseCard={() => {
                        onCloseCard();
                        setclickedCawsPool(false);
                      }}
                      poolClickedType={poolClickedType}
                    />
                  </div>
                );
              })}
            {expiredPools === true &&
              dummyData_eth_expired.map((pool, index) => {
                return (
                  <TopPoolsNftListCardInner
                    key={index}
                    activePools={dummyData_eth_expired}
                    tokenName={pool.pool}
                    tokenTicker={pool.tokenTicker}
                    topList={"Staking"}
                    onShowDetailsClick={() => {
                      // setShowDetails(!showDetails);
                      // setActiveCard(topPools[index + 1]);
                    }}
                    top_pick={pool.top_pick}
                    comingSoon={pool.coming_soon}
                    expired={pool.expired}
                    tokenLogo={pool.tokenLogo}
                    apr={pool.apr}
                    lockTime={pool.lockTime}
                    poolCap={pool.poolCap}
                    chain={pool.chain}
                    display={"flex"}
                    isNewPool={pool.new_pool === "Yes" ? true : false}
                    totalTvl={pool.tvl_usd}
                    // showDetails={showDetails}
                    cardIndex={index + 1}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    coinbase={coinbase}
                    referrer={referrer}
                    // lp_id={lp_id[index + 1]}
                    // the_graph_result={the_graph_result}
                    // the_graph_resultbsc={the_graph_resultbsc}
                    isConnected={isConnected}
                    // the_graph_resultavax={the_graph_resultavax}
                    // isPremium={isPremium}
                    // network={network}
                  />
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default EarnOtherContentNft;
