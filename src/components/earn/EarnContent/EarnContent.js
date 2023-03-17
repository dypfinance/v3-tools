import React, { useState } from "react";
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
import EarnTopPicks from "../EarnTopPicks/EarnTopPicks";
import EarnFaq from "../EarnFaq/EarnFaq";
import axios from "axios";
import { useEffect } from "react";
import getFormattedNumber from "../../../functions/getFormattedNumber2";
import e from "cors";
import { useRef } from "react";
import useWindowSize from "../../../functions/useWindowSize";

const EarnContent = ({
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

  const [stake, setStake] = useState(routeChain);
  const [option, setOption] = useState(routeOption);
  const [content, setContent] = useState(options[0].content);
  const [listStyle, setListStyle] = useState("table");
  const [myStakes, setMyStakes] = useState(false);
  const [expiredPools, setExpiredPools] = useState(false);
  const [tvl, setTvl] = useState();
  const [ethApr, setEthApr] = useState();
  const [bnbApr, setBnbApr] = useState();
  const [avaxApr, setavaxApr] = useState();

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
      setBnbApr(res.data.highestAPY.highestAPY_BSC_V2);
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
    } else if (option === "Buyback") {
      fetchEthBuybackApr();
      fetchBnbBuybackApr();
      fetchAvaxBuybackApr();
    } else if (option === "Farming") {
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
        window.ethereum.isTrust === true || window.ethereum.isCoinbaseWallet === true)
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
    } else if (window.ethereum && window.ethereum.overrideIsMetaMask === true && !window.ethereum.isCoinbaseWallet) {
      const chainId = window.ethereum.selectedProvider.chainId

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
    if (option === "Farming" || option === "Buyback" || option === "Staking") {
      checkNetworkId()
    }
  }, [option, routeChain, networkId]);



  const setVaultEth = (vault) => {
    if (vault === "Vault") {
      setStake("eth");
    }
  };


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
                className={`list-style ${listStyle === "table" && "list-style-active"
                  }`}
                onClick={() => setListStyle("table")}
              >
                <img
                  src={listStyle === "table" ? tableIconActive : tableIcon}
                  alt=""
                />
              </div>
              <div
                className={`list-style ${listStyle === "list" && "list-style-active"
                  }`}
                onClick={() => setListStyle("list")}
              >
                <img
                  src={listStyle === "list" ? listIconActive : listIcon}
                  alt=""
                />
              </div>
            </div>
            <div className="col-8 row d-flex gap-0 gap-xl-3 justify-content-center p-2">
              {options.map((item, index) => (
                <div
                  className={`earn-option col-3 col-xl-2 d-flex align-items-center justify-content-center ${option === item.title ? "earn-option-active" : null
                    }`}
                  key={index}
                  onClick={() => {
                    setOption(item.title);
                    setContent(item.content);
                    setVaultEth(item.title);
                    // item.tvl
                    //   ? setTvl(item.tvl)
                    //   : stake === "eth"
                    //   ? fetchEthTvl()
                    //   : stake === "bnb"
                    //   ? fetchBscTvl()
                    //   : fetchAvaxTvl();
                  }}
                >
                  <img
                    src={
                      require(`../../calculator/assets/${item.title.toLowerCase()}Icon.svg`)
                        .default
                    }
                    alt=""
                  />
                  {item.title}
                </div>
              ))}
            </div>
            <div className="col-2 d-flex justify-content-end align-items-center gap-1 gap-lg-3">
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
        ) : (
          <div
            className="row justify-content-center align-items-center p-2 options-container"
            style={{ marginTop: "24px", marginBottom: "24px" }}
          >
            <div className="col-6 d-flex px-0 px-lg-2 justify-content-start align-items-center gap-3">
              <div
                className={`list-style ${listStyle === "table" && "list-style-active"
                  }`}
                onClick={() => setListStyle("table")}
              >
                <img
                  src={listStyle === "table" ? tableIconActive : tableIcon}
                  alt=""
                />
              </div>
              <div
                className={`list-style ${listStyle === "list" && "list-style-active"
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
            <div className="col-12 row d-flex gap-0 gap-xl-3 justify-content-center px-0 px-lg-22 mt-3">
              {options.map((item, index) => (
                <div
                  className={`earn-option col col-lg-3 col-xl-2 d-flex align-items-center justify-content-center ${option === item.title ? "earn-option-active" : null
                    }`}
                  key={index}
                  onClick={() => {
                    setOption(item.title);
                    setContent(item.content);
                    setVaultEth(item.title);
                    // item.tvl
                    //   ? setTvl(item.tvl)
                    //   : stake === "eth"
                    //   ? fetchEthTvl()
                    //   : stake === "bnb"
                    //   ? fetchBscTvl()
                    //   : fetchAvaxTvl();
                  }}
                >
                  <img
                    src={
                      require(`../../calculator/assets/${item.title.toLowerCase()}Icon.svg`)
                        .default
                    }
                    alt=""
                  />
                  {/* <div
                    className={`${option === item.title ? "d-flex" : "d-none"}`}
                  > */}
                  {item.title}
                  {/* </div> */}
                </div>
              ))}
            </div>
          </div>
        )}

        {option !== "Farming" && (
          <>
            <div
              className={`row align-items-center gap-5 gap-lg-0 justify-content-between px-0 ${option === "Vault" && expiredPools === true
                  ? "d-none"
                  : "d-flex"
                }`}
              style={{ minHeight: "55px" }}
            >
              <div className="col-12 col-lg-4 col-xl-3 px-0">
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
              </div>
              <div className="col-12 col-lg-8 col-xl-6 d-flex gap-3 justify-content-around justify-content-lg-end justify-content-xl-center px-0 px-xl-2">
                {option !== "Vault" ? (
                  <>
                    <div
                      className={`stake-item position-relative flex-column flex-lg-row d-flex align-items-center gap-2 ${stake === "eth" ? "eth-item-active" : null
                        }`}
                      onClick={() => {
                        setStake("eth");
                        // fetchEthTvl();
                      }}
                    >
                      <img
                        src={stake === "eth" ? ethStakeActive : ethStake}
                        alt=""
                      />
                      <div className="d-flex flex-column align-items-center align-items-lg-start">
                        <p
                          className="text-white"
                          style={{ fontSize: "12px", fontWeight: "300" }}
                        >
                          Ethereum
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#f7f7fc",
                            whiteSpace: "pre",
                          }}
                        >
                          7.35% APR
                        </p>
                      </div>
                    </div>
                    <div
                      className={`stake-item position-relative flex-column flex-lg-row d-flex align-items-center gap-2 ${stake === "bnb" ? "bsc-item-active" : null
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
                      />
                      <div className="d-flex flex-column align-items-center align-items-lg-start">
                        <p
                          className="text-white"
                          style={{ fontSize: "12px", fontWeight: "300" }}
                        >
                          BNB Chain
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#f7f7fc",
                            whiteSpace: "pre",
                          }}
                        >
                          {bnbApr}% APR
                        </p>
                      </div>
                    </div>
                    <div
                      className={`stake-item position-relative flex-column flex-lg-row d-flex align-items-center gap-2 ${stake === "avax" ? "avax-item-active" : null
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
                      />
                      <div className="d-flex flex-column align-items-center align-items-lg-start">
                        <p
                          className="text-white"
                          style={{ fontSize: "12px", fontWeight: "300" }}
                        >
                          Avalanche
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#f7f7fc",
                            whiteSpace: "pre",
                          }}
                        >
                          {avaxApr}% APR
                        </p>
                      </div>
                    </div>
                  </>
                ) : option === "Vault" && chainId !== "1" ? (
                  <h4 className="text-white">
                    Vault pools are available only on Ethereum Chain
                  </h4>
                ) : (
                  <>
                    <div
                      className={`stake-item d-none position-relative d-flex align-items-center gap-2 ${stake === "eth" ? "eth-item-active" : null
                        }`}
                      onClick={() => {
                        setStake("eth");
                        fetchEthTvl();
                      }}
                    >
                      <img
                        src={stake === "eth" ? ethStakeActive : ethStake}
                        alt=""
                      />
                      <div className="d-flex flex-column">
                        <p
                          className="text-white"
                          style={{ fontSize: "12px", fontWeight: "300" }}
                        >
                          Ethereum
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#f7f7fc",
                          }}
                        >
                          7.35% APR
                        </p>
                      </div>
                    </div>
                    <div
                      className={`stake-item d-none position-relative d-flex align-items-center gap-2 ${stake === "bnb" ? "bsc-item-active" : null
                        }`}
                      onClick={() => {
                        setStake("bnb");
                        // fetchBscTvl();
                      }}
                      style={{ opacity: "0.5" }}
                    >

                      <img
                        src={stake === "bnb" ? bnbStakeActive : bnbStake}
                        alt=""
                      />
                      <div className="d-flex flex-column">
                        <p
                          className="text-white"
                          style={{ fontSize: "12px", fontWeight: "300" }}
                        >
                          BNB Chain
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#f7f7fc",
                          }}
                        >
                          25% APR
                        </p>
                      </div>
                    </div>
                    <div
                      className={`stake-item d-none position-relative d-flex align-items-center gap-2 ${stake === "avax" ? "avax-item-active" : null
                        }`}
                      onClick={() => {
                        setStake("avax");
                        // fetchAvaxTvl();
                      }}
                      style={{ opacity: "0.5" }}
                    >
                      {/* <div className="new-pools d-flex justify-content-start align-items-center gap-2 position-absolute">
                    <img
                      src={addNewPools}
                      alt=""
                      style={{ width: "15px", height: "15px" }}
                    />
                    <span className="text-white d-none d-lg-flex" style={{ fontSize: "11px" }}>
                      New Pools
                    </span>
                  </div> */}
                      <img
                        src={stake === "avax" ? avaxStakeActive : avaxStake}
                        alt=""
                      />
                      <div className="d-flex flex-column">
                        <p
                          className="text-white"
                          style={{ fontSize: "12px", fontWeight: "300" }}
                        >
                          Avalanche
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#f7f7fc",
                          }}
                        >
                          25% APR
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="col-3"></div>
            </div>
            <div className="d-flex align-items-center justify-content-center  py-0 py-lg-4 px-3"></div>
          </>
        )}
      </div>
      {option !== "Farming" && expiredPools === false ? (
        <EarnTopPicks
          topList={option}
          listType={listStyle}
          chain={stake}
          coinbase={coinbase}
          the_graph_result={the_graph_result}
          lp_id={lp_id}
          isConnected={isConnected}
          chainId={chainId}
          networkId={networkId}
          handleConnection={handleConnection}
          the_graph_resultavax={the_graph_resultavax}
          the_graph_resultbsc={the_graph_resultbsc}
          referrer={referrer}
          pool={pool}
          routeOption={routeOption}
          customChain={customChain}
          handleSwitchNetwork={handleSwitchNetwork}
          expiredPools={expiredPools}
        />
      ) : option === "Farming" && expiredPools === false ? (
        <div className="row mx-0 w-100 align-items-center justify-content-center flex-column p-4 gap-4 purple-wrapper">
          <img
            src={
              require("../../../assets/earnAssets/disabledFarming.svg").default
            }
            style={{ width: "150px", height: "150px" }}
            alt=""
          />
          <h6 className="no-farms">No farming pools available</h6>
          <span className="farm-soon">New pools coming soon...</span>
        </div>
      ) : option === "Vault" && expiredPools === true ? (
        <div className="row mx-0 w-100 align-items-center justify-content-center flex-column p-4 gap-4 purple-wrapper">
          <img
            src={
              require("../../../assets/earnAssets/disabledVault.svg").default
            }
            style={{ width: "150px", height: "150px" }}
            alt=""
          />
          <h6 className="no-farms">There are no expired Vault pools</h6>
          {/* <span className="farm-soon">New pools coming soon...</span> */}
        </div>
      ) : option === "Vault" && chainId !== "1" && expiredPools === false ? (
        <div className="row mx-0 w-100 align-items-center justify-content-center flex-column p-4 gap-4 purple-wrapper">
          <img
            src={
              require("../../../assets/earnAssets/disabledVault.svg").default
            }
            style={{ width: "150px", height: "150px" }}
            alt=""
          />
          <h6 className="no-farms">There are no Vault pools in this chain</h6>
          {/* <span className="farm-soon">New pools coming soon...</span> */}
        </div>
      ) : expiredPools === true ? (
        <EarnTopPicks
          topList={option}
          listType={listStyle}
          chain={stake}
          coinbase={coinbase}
          the_graph_result={the_graph_result}
          lp_id={lp_id}
          isConnected={isConnected}
          chainId={chainId}
          networkId={networkId}
          handleConnection={handleConnection}
          the_graph_resultavax={the_graph_resultavax}
          the_graph_resultbsc={the_graph_resultbsc}
          referrer={referrer}
          pool={pool}
          routeOption={routeOption}
          customChain={customChain}
          handleSwitchNetwork={handleSwitchNetwork}
          expiredPools={expiredPools}
        />
      ) : (
        <EarnTopPicks
          topList={option}
          listType={listStyle}
          chain={stake}
          coinbase={coinbase}
          the_graph_result={the_graph_result}
          lp_id={lp_id}
          isConnected={isConnected}
          chainId={chainId}
          handleConnection={handleConnection}
          the_graph_resultavax={the_graph_resultavax}
          the_graph_resultbsc={the_graph_resultbsc}
          referrer={referrer}
          pool={pool}
          routeOption={routeOption}
          customChain={customChain}
          handleSwitchNetwork={handleSwitchNetwork}
          expiredPools={expiredPools}
        />
      )}
      <EarnFaq faqTypes={option} faqIndex={faqIndex} />
    </>
  );
};

export default EarnContent;

