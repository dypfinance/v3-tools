import React, { useState } from "react";
import allchain from "../../../assets/earnAssets/allchain.svg";
import allchainActive from "../../../assets/earnAssets/allchainActive.svg";
import ethStake from "../../../assets/earnAssets/ethStake.svg";
import bnbStake from "../../../assets/earnAssets/bnbStake.svg";
import avaxStake from "../../../assets/earnAssets/avaxStake.svg";
import baseStake from "../../../assets/earnAssets/baseInactive.svg";
import baseStakeActive from "../../../assets/earnAssets/baseActive.svg";
import ethStakeActive from "../../../assets/earnAssets/ethStakeActive.svg";
import bnbStakeActive from "../../../assets/earnAssets/bnbStakeActive.svg";
import avaxStakeActive from "../../../assets/earnAssets/avaxStakeActive.svg";
import listIcon from "../../../assets/earnAssets/listIcon.svg";
import tableIcon from "../../../assets/earnAssets/tableIcon.svg";
import tableIconActive from "../../../assets/earnAssets/tableIconActive.svg";
import listIconActive from "../../../assets/earnAssets/listIconActive.svg";
import axios from "axios";
import { useEffect } from "react";
import getFormattedNumber from "../../../functions/getFormattedNumber2";
import useWindowSize from "../../../functions/useWindowSize";
import TopOtherPoolsCard from "../TopOtherPoolsCard";
import TopOtherPoolsListCard from "../TopOtherPoolsListCard";
import { NavLink } from "react-router-dom";

const EarnOtherContent = ({
  coinbase,
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
      lockTime: "Locked",
      chain: "Ethereum",
      apr: "30%",
      tokenLogo: "ethereum.svg",
      expired: false,
      top_pick: false,
      tokenName: "Ethereum",
      tokenTicker: "ETH",
      pool: "ETH",
    },
  ];

  const dummyData_base = [
    {
      lockTime: "Locked",
      chain: "Base",
      apr: "15%",
      tokenLogo: "baseActive.svg",
      expired: false,
      top_pick: false,
      tokenName: "Base",
      tokenTicker: "ETH",
      pool: "BASE",
      new_pool: 'Yes'

    },
  ];

  const dummyData_bnb2 = [
    {
      lockTime: "Flexible & Locked",
      chain: "BNB Chain",
      apr: "10%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
      pool: "DYP-BNB",
    },
    {
      lockTime: "Flexible & Locked",
      chain: "BNB Chain",
      apr: "25%",
      tokenLogo: "bsc.svg",
      expired: false,
      top_pick: true,
      tokenName: "BNB",
      tokenTicker: "WBNB",
      pool: "BNB",
    },
  ];

  const dummyData_bnb = [
    {
      lockTime: "Locked",
      chain: "BNB Chain",
      apr: "25%",
      tokenLogo: "bsc.svg",
      expired: false,
      top_pick: false,
      tokenName: "BNB",
      tokenTicker: "BNB",
      pool: "BNB",
      new_pool: 'Yes'

    },
  ];

  const dummyData_avax = [
    {
      lockTime: "Locked",
      chain: "Avalanche",
      apr: "10%",
      tokenLogo: "avax.svg",
      expired: false,
      top_pick: false,
      tokenName: "Avalanche",
      tokenTicker: "AVAX",
      pool: "AVAX",
      new_pool: 'Yes'
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
    await axios.get(`https://api.dyp.finance/api/highest-apy`).then((res) => {
      setEthApr(res.data.highestAPY.highestAPY_ETH_V2);
      // setBnbApr(res.data.highestAPY.highestAPY_BSC_V2);
      // if(expiredPools === true){

      //   setBnbApr(138.44)
      // }else{
      //   fetchBnbPool();
      // }
      setavaxApr(res.data.highestAPY.highestAPY_AVAX_V2);
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

  return (
    <>
      <div className="row justify-content-center w-100">
        {windowSize.width > 786 ? (
          <div
            className="row justify-content-between align-items-center p-2 options-container"
            style={{ marginTop: "30px", marginBottom: "40px" }}
          >
            <div className="col-2 d-flex justify-content-start align-items-center gap-3">
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
            </div>
          </div>
        ) : (
          <div
            className="row justify-content-center align-items-center p-2 options-container"
            style={{ marginTop: "24px", marginBottom: "24px" }}
          >
            <div className="col-6 d-flex px-0 px-lg-2 justify-content-start align-items-center gap-3">
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
            </div>
          </div>
        )}

        <div
          className={`row m-0 flex-column flex-xxl-row flex-lg-row flex-md-row align-items-center gap-5 gap-lg-0 justify-content-between px-0 `}
          style={{ minHeight: "55px" }}
        >
          <div className="col-12 col-lg-8 col-xl-5 d-flex flex-column flex-xxl-row flex-lg-row flex-md-row  gap-3 align-items-center justify-content-around justify-content-lg-end justify-content-xl-start px-0 px-xl-2">
            <div className="d-flex flex-column flex-xxl-row flex-lg-row flex-md-row align-items-center gap-2">
              <div className="d-flex align-items-center gap-2 items-wrapper-other">
                <div
                  className={`stake-other-item ${
                    option === "Farming" &&
                    expiredPools === false &&
                    "blur-stake"
                  } position-relative flex-column flex-lg-row d-flex align-items-center gap-2 ${
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
                <div
                  className={`stake-other-item ${
                    option === "Farming" &&
                    expiredPools === false &&
                    "blur-stake"
                  } position-relative flex-column flex-lg-row d-flex align-items-center gap-2 ${
                    stake === "avax" ? "avax-item-active" : null
                  }`}
                  onClick={() => {
                    setStake("avax");
                  }}
                >
                  <img
                    src={stake === "avax" ? avaxStakeActive : avaxStake}
                    alt=""
                    style={{ width: 18, height: 18 }}
                  />
                  <div className="d-flex flex-column align-items-center align-items-lg-start">
                    <p
                      className="text-white"
                      style={{ fontSize: "12px", fontWeight: "300" }}
                    >
                      Avalanche
                    </p>
                  </div>
                </div>
                <div
                  className={`stake-other-item position-relative flex-column flex-lg-row d-flex align-items-center gap-2 ${
                    stake === "bnb" ? "bsc-item-active" : null
                  }`}
                  onClick={() => {
                    setStake("bnb");
                  }}
                >
                  <img
                    src={stake === "bnb" ? bnbStakeActive : bnbStake}
                    alt=""
                    style={{ width: 18, height: 18 }}
                  />
                  <div className="d-flex flex-column align-items-center align-items-lg-start">
                    <p
                      className="text-white"
                      style={{ fontSize: "12px", fontWeight: "300" }}
                    >
                      BNB Chain
                    </p>
                  </div>
                </div>
                <div
                  className={`stake-other-item ${
                    option === "Farming" &&
                    expiredPools === false &&
                    "blur-stake"
                  } position-relative flex-column flex-lg-row d-flex align-items-center gap-2 ${
                    stake === "base" ? "eth-item-active" : null
                  }`}
                  onClick={() => {
                    setStake("base");
                  }}
                >
                  <img
                    src={stake === "base" ? baseStakeActive : baseStake}
                    alt=""
                    style={{ width: 18, height: 18 }}
                  />
                  <div className="d-flex flex-column align-items-center align-items-lg-start">
                    <p
                      className="text-white"
                      style={{ fontSize: "12px", fontWeight: "300" }}
                    >
                      Base
                    </p>
                  </div>
                </div>
              </div>
              {/*  <div className="d-flex align-items-center gap-2">
                 <div
                  className={`stake-other-item ${
                    option === "Farming" &&
                    expiredPools === false &&
                    "blur-stake"
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
             
              </div>
              <div className="d-flex align-items-center gap-2">
              
              </div>*/}
            </div>
          </div>

          <div className="col-12 col-lg-4 col-xl-3 px-0">
            {option !== "Farming" && (
              <div className="total-value-locked-container p-2 d-flex justify-content-between align-items-center">
                <span style={{ fontWeight: "300", fontSize: "13px" }}>
                  Total value locked
                </span>
                <h6
                  className="text-white"
                  style={{ fontWeight: "600", fontSize: "17px" }}
                >
                  ${getFormattedNumber("2585417", 0)}
                </h6>
              </div>
            )}
          </div>
        </div>
      </div>
      {listStyle === "table" && (
        <div className="w-100 otherpools-wrapper">
          {stake === "eth"
            ? dummyData_eth.map((item, index) => {
                return (
                  <NavLink to={`/earn/defi-staking/${item.pool}`}>
                    <TopOtherPoolsCard
                      key={index}
                      lockTime={item.lockTime}
                      chain={item.chain}
                      apr={item.apr}
                      tokenLogo={item.tokenLogo}
                      expired={item.expired}
                      top_pick={item.top_pick}
                      tokenName={item.tokenName}
                      isNewPool={item.new_pool === "Yes" ? true : false}
                    />
                  </NavLink>
                );
              })
            : stake == "base"
            ? dummyData_base.map((item, index) => {
                return (
                  <NavLink to={`/earn/defi-staking/${item.pool}`}>
                    <TopOtherPoolsCard
                      key={index}
                      lockTime={item.lockTime}
                      chain={item.chain}
                      apr={item.apr}
                      tokenLogo={item.tokenLogo}
                      expired={item.expired}
                      top_pick={item.top_pick}
                      tokenName={item.tokenName}
                      isNewPool={item.new_pool === "Yes" ? true : false}
                    />
                  </NavLink>
                );
              })
            : stake === "bnb"
            ? dummyData_bnb.map((item, index) => {
                return (
                  <NavLink to={`/earn/defi-staking/${item.pool}`}>
                    <TopOtherPoolsCard
                      key={index}
                      lockTime={item.lockTime}
                      chain={item.chain}
                      apr={item.apr}
                      tokenLogo={item.tokenLogo}
                      expired={item.expired}
                      top_pick={item.top_pick}
                      tokenName={item.tokenName}
                      isNewPool={item.new_pool === "Yes" ? true : false}
                    />
                  </NavLink>
                );
              })
            : stake === "avax"
            ? dummyData_avax.map((item, index) => {
                return (
                  <NavLink to={`/earn/defi-staking/${item.pool}`}>
                    <TopOtherPoolsCard
                      key={index}
                      lockTime={item.lockTime}
                      chain={item.chain}
                      apr={item.apr}
                      tokenLogo={item.tokenLogo}
                      expired={item.expired}
                      top_pick={item.top_pick}
                      tokenName={item.tokenName}
                      isNewPool={item.new_pool === "Yes" ? true : false}
                    />
                  </NavLink>
                );
              })
            : [...dummyData_avax, ...dummyData_base, ...dummyData_bnb].map(
                (item, index) => {
                  return (
                    <NavLink to={`/earn/defi-staking/${item.pool}`}>
                      <TopOtherPoolsCard
                        key={index}
                        lockTime={item.lockTime}
                        chain={item.chain}
                        apr={item.apr}
                        tokenLogo={item.tokenLogo}
                        expired={item.expired}
                        top_pick={item.top_pick}
                        tokenName={item.tokenName}
                        isNewPool={item.new_pool === "Yes" ? true : false}
                      />
                    </NavLink>
                  );
                }
              )}
        </div>
      )}
      {listStyle === "list" && (
        <div className="row mx-0 justify-content-between align-items-center px-2 py-3 w-100">
          {windowSize.width > 768 && (
            <div
              className="row mx-0 justify-content-between align-items-center px-2 py-3 w-100 options-container"
              style={{ marginBottom: "10px" }}
            >
              <table className="earnother-table">
                <thead className="d-flex w-100 align-items-center justify-content-around">
                  <th className="earnother-th">Pool Name</th>
                  <th className="earnother-th">Ticker</th>
                  <th className="earnother-th">Network</th>
                  <th className="earnother-th">APR</th>
                  <th className="earnother-th">Method</th>
                  <th className="earnother-th">Stake</th>
                </thead>
              </table>
            </div>
          )}
          <div className="d-flex flex-column gap-1 px-0">
            {stake === "eth"
              ? dummyData_eth.map((item, index) => {
                  return (
                    <NavLink to={`/earn/defi-staking/${item.pool}`}>
                      <TopOtherPoolsListCard
                        tokenLogo={item.tokenLogo}
                        chain={item.chain}
                        tokenName={item.tokenName}
                        tokenTicker={item.tokenTicker}
                        apr={item.apr}
                        lockTime={item.lockTime}
                        isNewPool={item.new_pool === "Yes" ? true : false}
                        expired={item.expired}
                      />
                    </NavLink>
                  );
                })
              : stake === "base"
              ? dummyData_base.map((item, index) => {
                  return (
                    <NavLink to={`/earn/defi-staking/${item.pool}`}>
                      <TopOtherPoolsListCard
                        tokenLogo={item.tokenLogo}
                        chain={item.chain}
                        tokenName={item.tokenName}
                        tokenTicker={item.tokenTicker}
                        apr={item.apr}
                        lockTime={item.lockTime}
                        expired={item.expired}
                        isNewPool={item.new_pool === "Yes" ? true : false}
                      />
                    </NavLink>
                  );
                })
              : stake === "bnb"
              ? dummyData_bnb.map((item, index) => {
                  return (
                    <NavLink to={`/earn/defi-staking/${item.pool}`}>
                      <TopOtherPoolsListCard
                        tokenLogo={item.tokenLogo}
                        chain={item.chain}
                        tokenName={item.tokenName}
                        tokenTicker={item.tokenTicker}
                        apr={item.apr}
                        lockTime={item.lockTime}
                        isNewPool={item.new_pool === "Yes" ? true : false}
                        expired={item.expired}
                      />
                    </NavLink>
                  );
                })
              : stake === "avax"
              ? dummyData_avax.map((item, index) => {
                  return (
                    <NavLink to={`/earn/defi-staking/${item.pool}`}>
                      <TopOtherPoolsListCard
                        tokenLogo={item.tokenLogo}
                        chain={item.chain}
                        tokenName={item.tokenName}
                        tokenTicker={item.tokenTicker}
                        apr={item.apr}
                        lockTime={item.lockTime}
                        isNewPool={item.new_pool === "Yes" ? true : false}
                        expired={item.expired}
                      />
                    </NavLink>
                  );
                })
              : [...dummyData_avax, ...dummyData_base, ...dummyData_bnb].map(
                  (item, index) => {
                    return (
                      <NavLink to={`/earn/defi-staking/${item.pool}`}>
                        <TopOtherPoolsListCard
                          tokenLogo={item.tokenLogo}
                          chain={item.chain}
                          tokenName={item.tokenName}
                          tokenTicker={item.tokenTicker}
                          apr={item.apr}
                          lockTime={item.lockTime}
                          expired={item.expired}
                          isNewPool={item.new_pool === "Yes" ? true : false}
                        />
                      </NavLink>
                    );
                  }
                )}
          </div>
        </div>
      )}
    </>
  );
};

export default EarnOtherContent;
