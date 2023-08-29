import React, { useState } from "react";
import allchain from "../../../assets/earnAssets/allchain.svg";
import allchainActive from "../../../assets/earnAssets/allchainActive.svg";
import ethStake from "../../../assets/earnAssets/ethStake.svg";
import bnbStake from "../../../assets/earnAssets/bnbStake.svg";
import avaxStake from "../../../assets/earnAssets/avaxStake.svg";
import ethStakeActive from "../../../assets/earnAssets/ethStakeActive.svg";
import bnbStakeActive from "../../../assets/earnAssets/bnbStakeActive.svg";
import avaxStakeActive from "../../../assets/earnAssets/avaxStakeActive.svg";
import addNewPools from "../../../assets/earnAssets/addNewPools.svg";
import listIcon from "../../../assets/earnAssets/listIcon.svg";
import tableIcon from "../../../assets/earnAssets/tableIcon.svg";
import tableIconActive from "../../../assets/earnAssets/tableIconActive.svg";
import listIconActive from "../../../assets/earnAssets/listIconActive.svg";
import EarnFaq from "../../earn/EarnFaq/EarnFaq";
import axios from "axios";
import { useEffect } from "react";
import getFormattedNumber from "../../../functions/getFormattedNumber2";
import useWindowSize from "../../../functions/useWindowSize";
import TopOtherPoolsCard from "../TopOtherPoolsCard";
import TopOtherPoolsListCard from "../TopOtherPoolsListCard";

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
      lockTime: "Flexible & Locked",
      chain: "Ethereum",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "No lock",
      chain: "Ethereum",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "Locked",
      chain: "Ethereum",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "Locked",
      chain: "Ethereum",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "Flexible & Locked",
      chain: "Ethereum",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "No lock",
      chain: "Ethereum",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
  ];

  const dummyData_bnb = [
    {
      lockTime: "No lock",
      chain: "BNB Chain",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "Flexible & Locked",
      chain: "BNB Chain",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "Locked",
      chain: "BNB Chain",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "No lock",
      chain: "BNB Chain",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "Locked",
      chain: "BNB Chain",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "Flexible & Locked",
      chain: "BNB Chain",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
  ];

  const dummyData_avax = [
    {
      lockTime: "Flexible & Locked",
      chain: "Avalanche",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "No lock",
      chain: "Avalanche",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "Flexible & Locked",
      chain: "Avalanche",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "No lock",
      chain: "Avalanche",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "Locked",
      chain: "Avalanche",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
    {
      lockTime: "Locked",
      chain: "Avalanche",
      apr: "12%",
      tokenLogo: "dyplogo.svg",
      expired: false,
      top_pick: true,
      tokenName: "Dypius",
      tokenTicker: "DYP",
    },
  ];

  const [stake, setStake] = useState(routeChain);
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

  const checkNetworkId = () => {
    if (
      window.ethereum &&
      (window.ethereum.isMetaMask === true ||
        window.coin98 === true ||
        window.trustwallet ||
        window.ethereum.isCoinbaseWallet === true)
    ) {
      window.ethereum
        .request({ method: "eth_chainId" })
        .then((data) => {
          if (data === "0x1") {
            setStake("eth");
          } else if (data === "0xa86a") {
            setStake("avax");
          } else if (data === "0x38") {
            setStake("bnb");
          } else if (data !== "undefined") {
            setStake("eth");
          } else {
            setStake("eth");
          }
        })
        .catch(console.error);
    } else if (
      window.ethereum &&
      window.ethereum.overrideIsMetaMask === true &&
      !window.ethereum.isCoinbaseWallet
    ) {
      const chainId = window.ethereum.selectedProvider.chainId;

      if (chainId === "0x1") {
        setStake("eth");
      } else if (chainId === "0xa86a") {
        setStake("avax");
      } else if (chainId === "0x38") {
        setStake("bnb");
      } else if (chainId !== "undefined") {
        setStake("eth");
      } else {
        setStake("eth");
      }
    } else {
      setStake("eth");
    }
  };

  useEffect(() => {
    if (option !== "Farming" && expiredPools === false) {
      checkNetworkId();
    }
  }, [option, routeChain, networkId, chainId, expiredPools]);

  const setVaultEth = (vault) => {
    if (vault === "Vault") {
      setStake("eth");
    }
  };

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
            <div className="col-6 px-0 px-lg-2 d-flex justify-content-end align-items-center gap-1 gap-lg-3">
              <h5 className="text-white inactive-pools">Inactive pools</h5>
              <div
                className={`pill-box ${myStakes && "pill-box-active"}`}
                onClick={() => {
                  setMyStakes(!myStakes);
                  setExpiredPools(!expiredPools);
                }}
              >
                <div className="pill"></div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`row m-0 flex-column flex-xxl-row flex-lg-row flex-md-row align-items-center gap-5 gap-lg-0 justify-content-between px-0 `}
          style={{ minHeight: "55px" }}
        >
          <div className="col-12 col-lg-8 col-xl-6 d-flex flex-column flex-xxl-row flex-lg-row flex-md-row  gap-3 align-items-center justify-content-around justify-content-lg-end justify-content-xl-center px-0 px-xl-2">
            <span className="select-network-text">Select network:</span>
            <div className="d-flex flex-column flex-xxl-row flex-lg-row flex-md-row align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
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
                    stake === "eth" ? "eth-item-active" : null
                  }`}
                  onClick={() => {
                    setStake("eth");
                    // fetchEthTvl();
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
                    {/* <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#f7f7fc",
                            whiteSpace: "pre",
                          }}
                        >
                          {ethApr}% APR
                        </p> */}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div
                  className={`stake-other-item position-relative flex-column flex-lg-row d-flex align-items-center gap-2 ${
                    stake === "bnb" ? "bsc-item-active" : null
                  }`}
                  onClick={() => {
                    setStake("bnb");
                    // fetchBscTvl();
                  }}
                >
                  {/* <div className="new-pools d-flex justify-content-start align-items-center gap-2 position-absolute">
                    <img
                      src={addNewPools}
                      alt=""
                      style={{ width: "15px", height: "15px" }}
                    />
                    <span
                      className="text-white d-none d-lg-flex"
                      style={{ fontSize: "11px" }}
                    >
                      New Pools
                    </span>
                  </div> */}
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
                    {/* <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#f7f7fc",
                            whiteSpace: "pre",
                          }}
                        >
                          {getFormattedNumber(bnbApr, 0)}% APR
                        </p> */}
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
                    // fetchAvaxTvl();
                  }}
                >
                  {/* <div className="new-pools d-flex justify-content-start align-items-center gap-2 position-absolute">
                  <img
                    src={addNewPools}
                    alt=""
                    style={{ width: "15px", height: "15px" }}
                  />
                  <span
                    className="text-white d-none d-lg-flex"
                    style={{ fontSize: "11px" }}
                  >
                    New Pools
                  </span>
                </div> */}
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
                    {/* <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#f7f7fc",
                            whiteSpace: "pre",
                          }}
                        >
                          {avaxApr}% APR
                        </p> */}
                  </div>
                </div>
              </div>
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
                  ${getFormattedNumber(tvl)}
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
                  <TopOtherPoolsCard
                    key={index}
                    lockTime={item.lockTime}
                    chain={item.chain}
                    apr={item.apr}
                    tokenLogo={item.tokenLogo}
                    expired={item.expired}
                    top_pick={item.top_pick}
                    tokenName={item.tokenName}
                  />
                );
              })
            : stake === "bnb"
            ? dummyData_bnb.map((item, index) => {
                return (
                  <TopOtherPoolsCard
                    key={index}
                    lockTime={item.lockTime}
                    chain={item.chain}
                    apr={item.apr}
                    tokenLogo={item.tokenLogo}
                    expired={item.expired}
                    top_pick={item.top_pick}
                    tokenName={item.tokenName}
                  />
                );
              })
            : stake === "avax"
            ? dummyData_avax.map((item, index) => {
                return (
                  <TopOtherPoolsCard
                    key={index}
                    lockTime={item.lockTime}
                    chain={item.chain}
                    apr={item.apr}
                    tokenLogo={item.tokenLogo}
                    expired={item.expired}
                    top_pick={item.top_pick}
                    tokenName={item.tokenName}
                  />
                );
              })
            : [...dummyData_eth, ...dummyData_bnb, ...dummyData_avax].map(
                (item, index) => {
                  return (
                    <TopOtherPoolsCard
                      key={index}
                      lockTime={item.lockTime}
                      chain={item.chain}
                      apr={item.apr}
                      tokenLogo={item.tokenLogo}
                      expired={item.expired}
                      top_pick={item.top_pick}
                      tokenName={item.tokenName}
                    />
                  );
                }
              )}
        </div>
      )}
      {listStyle === "list" && (
        <div className="row mx-0 justify-content-between align-items-center px-2 py-3 w-100">
          {windowSize.width > 768 &&
          <div
            className="row mx-0 justify-content-between align-items-center px-2 py-3 w-100 options-container"
            style={{ marginBottom: "10px" }}
          >
            <table className="earnother-table">
              <thead className="d-flex w-100 align-items-center justify-content-around">
                <th className="earnother-th">Pool Name</th>
                <th className="earnother-th">Ticker</th>
                <th className="earnother-th">Network</th>
                <th className="earnother-th">Max. APR</th>
                <th className="earnother-th">Method</th>
                <th className="earnother-th">Stake</th>
              </thead>
            </table>
          </div> }
          <div className="d-flex flex-column gap-1 px-0">
            {stake === "eth"
              ? dummyData_eth.map((item, index) => {
                  return (
                    <TopOtherPoolsListCard
                      tokenLogo={item.tokenLogo}
                      chain={item.chain}
                      tokenName={item.tokenName}
                      tokenTicker={item.tokenTicker}
                      apr={item.apr}
                      lockTime={item.lockTime}
                      expired={item.expired}
                    />
                  );
                })
              : stake === "bnb"
              ? dummyData_bnb.map((item, index) => {
                  return (
                    <TopOtherPoolsListCard
                      tokenLogo={item.tokenLogo}
                      chain={item.chain}
                      tokenName={item.tokenName}
                      tokenTicker={item.tokenTicker}
                      apr={item.apr}
                      lockTime={item.lockTime}
                      expired={item.expired}
                    />
                  );
                })
              : stake === "avax"
              ? dummyData_avax.map((item, index) => {
                  return (
                    <TopOtherPoolsListCard
                      tokenLogo={item.tokenLogo}
                      chain={item.chain}
                      tokenName={item.tokenName}
                      tokenTicker={item.tokenTicker}
                      apr={item.apr}
                      lockTime={item.lockTime}
                      expired={item.expired}
                    />
                  );
                })
              : [...dummyData_eth, ...dummyData_bnb, ...dummyData_avax].map(
                  (item, index) => {
                    return (
                      <TopOtherPoolsListCard
                        tokenLogo={item.tokenLogo}
                        chain={item.chain}
                        tokenName={item.tokenName}
                        tokenTicker={item.tokenTicker}
                        apr={item.apr}
                        lockTime={item.lockTime}
                        expired={item.expired}
                      />
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
