import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import getFormattedNumber from "../../../functions/getFormattedNumber2";
import useWindowSize from "../../../functions/useWindowSize";
import TopOtherPoolsCard from "../TopOtherPoolsCard";
import TopOtherPoolsListCard from "../TopOtherPoolsListCard";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import closeX from "../assets/closeX.svg";
import { FadeLoader } from "react-spinners";
import searchIcon from "../assets/searchIcon.svg";
import EarnInnerPool from "./EarnInnerPool";
import arrowUp from "../assets/arrowUp.svg";
import arrowUpActive from "../assets/arrowUpActive.svg";
import arrowDown from "../assets/arrowDown.svg";
import arrowDownActive from "../assets/arrowDownActive.svg";
import StakeDypiusAvaxOther from "../stakingPools/avaxStakeDypiusOther";
import StakeDypiusBscOther from "../stakingPools/bscStakeDypiusOther";
import StakeDypiusEthOther from "../stakingPools/ethStakeDypiusOther";

const EarnOtherContent = ({
  aggregatorPools,
  coinbase,
  the_graph_result,
  poolClickedType,
  poolClicked,
  type,
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
  onConnectWallet,
  userCurencyBalance,
  onCloseCard,totalTvl,isPremium
}) => {
  const windowSize = useWindowSize();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width:
      windowSize.width > 1400 ? "auto" : windowSize.width > 786 ? "50%" : "95%",
    // windowSize.width > 1400 ? "25%" : windowSize.width > 786 ? "50%" : "90%",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    minHeight: 200,
    overflowX: "hidden",
    borderRadius: "10px",
    height: windowSize.width < 500 ? "480px" : "auto",
    background: `#1A1A36`,
  };

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

  const dummyData_base = [
    {
      lockTime: "Locked",
      chain: "Base",
      apr: "15%",
      aprInt: 15,
      chainLogo: "baseActive.svg",
      tokenLogo: "ethereum.svg",
      expired: false,
      top_pick: false,
      hot: true,
      coming_soon: true,
      staked: false,
      nft: true,
      tokenName: "Base",
      tokenTicker: "ETH",
      pool: "BASE",
      new_pool: "Yes",
      lockTime: 60,
      apy_percent: 12.5,
      performancefee: 12.5,
    },
  ];

  const dummyData_bnb = [
    {
      lockTime: "Locked",
      chain: "BNB Chain",
      apr: "25%",
      aprInt: 25,
      tokenLogo: "bnbChain.svg",
      chainLogo: "bsc.svg",
      expired: false,
      top_pick: false,
      hot: false,
      staked: false,
      nft: false,
      tokenName: "BNB",
      tokenTicker: "BNB",
      coming_soon: true,
      pool: "BNB",
      new_pool: "Yes",
      lockTime: 90,
      apy_percent: 12.5,
      performancefee: 0,
    },
  ];

  const dummyData_avax = [
    {
      lockTime: "Locked",
      chain: "Avalanche",
      apr: "10%",
      aprInt: 10,

      tokenLogo: "avax.svg",
      chainLogo: "avax.svg",
      expired: false,
      top_pick: false,
      hot: true,
      coming_soon: true,
      staked: true,
      nft: false,
      tokenName: "Avalanche",
      tokenTicker: "AVAX",
      pool: "AVAX",
      new_pool: "Yes",
      lockTime: 30,
      apy_percent: 12.5,
      performancefee: 12.5,
    },
  ];

  const cloneArray = aggregatorPools;

  const [stake, setStake] = useState("allchains");
  const [option, setOption] = useState(routeOption);
  const [showDetails, setshowDetails] = useState(false);
  const [cardIndex, setcardIndex] = useState(777);
  const [selectedTab, setselectedTab] = useState("deposit");
  const [selectedBtn, setselectedBtn] = useState("flexible");
  const [selectedPool, setselectedPool] = useState([]);

  const [listStyle, setListStyle] = useState("list");
  const [myStakes, setMyStakes] = useState(false);
  const [expiredPools, setExpiredPools] = useState(false);
  const [allPools, setallPools] = useState([]);

  const [tvl, setTvl] = useState();
  const [ethApr, setEthApr] = useState();
  const [bnbApr, setBnbApr] = useState();
  const [avaxApr, setavaxApr] = useState();
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState("");
  const [livePremiumOnly, setlivePremiumOnly] = useState(true);

  const handleQuery = (item) => (event) => {
    if (event.key === "Enter") {
      const tokenSearch = item.value;
      if (tokenSearch && tokenSearch !== "") {
        const result = aggregatorPools.filter((item) => {
          return item.name.toLowerCase().includes(tokenSearch.toLowerCase());
        });
        if (result && result.length > 0) {
          setallPools(result);
        }
        console.log(result, allPools);
      }
    }
  };

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
  // console.log(allPools)
  const handleSortPools = (order) => {
    if (allPools.length > 0) {
      if (order === "lth") {
        const newPools = allPools.sort((a, b) => {
          const aprA = a.maxAPR.slice(0, 2);
          const aprB = b.maxAPR.slice(0, 2);

          return Number(aprA) - Number(aprB);
        });

        setallPools(newPools);
      } else if (order === "htl") {
        const newPools2 = allPools.sort((a, b) => {
          const aprA2 = a.maxAPR.slice(0, 2);
          const aprB2 = b.maxAPR.slice(0, 2);

          return Number(aprB2) - Number(aprA2);
        });

        setallPools(newPools2);
      }
    }
  };

  const handleSorting = () => {
    if (sorting === "") {
      setSorting(true);
      handleSortPools("lth");
    } else if (sorting === false) {
      setSorting(true);
      handleSortPools("lth");
    } else if (sorting === true) {
      setSorting(false);
      handleSortPools("htl");
    }
  };

  useEffect(() => {
    const finalArray = aggregatorPools;
    setallPools(finalArray);
  }, [aggregatorPools]);

  useEffect(() => {
    if (query === "") {
      setallPools(cloneArray);
    }
  }, [query]);

  useEffect(() => {
    if (
      poolClicked === true &&
      poolClickedType !== "" &&
      aggregatorPools.length > 0
    ) {
      const selectedpool = allPools.filter((item) => {
        return item.name.toLowerCase() === poolClickedType;
      });

      if (selectedpool) {
        setselectedPool(...selectedpool);
        setshowDetails(true);
      }
    }
  }, [poolClicked, poolClickedType, allPools]);

  const handleManageDetails = (obj, index) => {
    if (obj.name.toLowerCase() === "bnb") {
      setshowDetails(!showDetails);
      setcardIndex(!showDetails ? index : 777);
      setselectedBtn(obj.lockTime);
      setselectedPool(obj);
    }
  };

  return (
    <>
      <div className="row mx-0 justify-content-center w-100 ">
        {windowSize.width > 786 ? (
          <div
            className="row justify-content-between align-items-center py-2 px-0 options-container bg-transparent"
            style={{ marginTop: "30px", marginBottom: "0px" }}
          >
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
            <div className="col-5 px-0">
              <div className="d-flex position-relative">
                <div className="position-absolute searchwrapper">
                  <img src={searchIcon} alt="" />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleQuery({
                    type: "Search",
                    value: query,
                  })}
                  type="text"
                  id="search-bar"
                  autoComplete="off"
                  placeholder="Search by coin..."
                  style={{
                    background: "transparent",
                    border: "1px solid #8E97CD",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-lg-4 col-xl-3 px-0">
              <div className="total-value-locked-container p-2 d-flex justify-content-between align-items-center">
                <span style={{ fontWeight: "300", fontSize: "13px" }}>
                  Total value locked
                </span>
                <h6
                  className="text-white"
                  style={{ fontWeight: "600", fontSize: "17px" }}
                >
                  ${getFormattedNumber(totalTvl, 2)}
                </h6>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="row justify-content-center align-items-center p-2 options-container gap-3 bg-transparent"
            style={{ marginTop: "24px", marginBottom: "24px" }}
          >
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
            <div className="d-block p-0">
              <div className="d-flex position-relative">
                <div className="position-absolute searchwrapper">
                  <img src={searchIcon} alt="" />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleQuery({
                    type: "Search",
                    value: query,
                  })}
                  type="text"
                  id="search-bar"
                  autoComplete="off"
                  placeholder="Search by coin..."
                  style={{
                    background: "transparent",
                    border: "1px solid #8E97CD",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-lg-4 col-xl-3 px-0">
              <div className="total-value-locked-container p-2 d-flex justify-content-between align-items-center">
                <span style={{ fontWeight: "300", fontSize: "13px" }}>
                  Total value locked
                </span>
                <h6
                  className="text-white"
                  style={{ fontWeight: "600", fontSize: "17px" }}
                >
                  ${getFormattedNumber(totalTvl, 2)}
                </h6>
              </div>
            </div>
          </div>
        )}

        <div
          className={`row m-0 flex-column flex-xxl-row flex-lg-row flex-md-row align-items-center gap-5 gap-lg-0 justify-content-between px-0 `}
          // style={{ minHeight: "55px" }}
        >
          <div className="col-12 col-lg-8 col-xl-5 d-flex flex-column flex-xxl-row flex-lg-row flex-md-row  gap-3 align-items-center justify-content-around justify-content-lg-end justify-content-xl-start px-0 px-xl-2">
            <div className="d-flex flex-column flex-xxl-row flex-lg-row flex-md-row align-items-center gap-2">
              {/* <div className="d-flex align-items-center gap-2 items-wrapper-other">
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
              </div> */}
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
        </div>
      </div>

      {listStyle === "list" &&
        (allPools.length > 0 ? (
          <>
            <div className="row mx-0 justify-content-between align-items-center px-0 py-3 w-100">
              {windowSize.width > 768 && (
                <div
                  className="row mx-0 justify-content-between align-items-center px-2 py-2 w-100 options-container"
                  style={{ marginBottom: "10px" }}
                >
                  <table className="earnother-table">
                    <thead className="d-flex w-100 align-items-center justify-content-around">
                      <th className="earnother-th col-2">
                        <div className="d-flex justify-content-center w-75">
                          Pool
                        </div>
                      </th>
                      <th
                        className="earnother-th col-2 d-flex justify-content-center gap-1 align-items-center arrowBtns"
                        onClick={handleSorting}
                      >
                        APR
                        <div className="d-flex flex-column">
                          <img
                            src={sorting === true ? arrowUpActive : arrowUp}
                            alt=""
                            className=""
                          />
                          <img
                            src={
                              sorting === false ? arrowDownActive : arrowDown
                            }
                            alt=""
                            className="arrowBtns"
                            onClick={() => {
                              console.log("down");
                              setSorting("lth");
                            }}
                          />
                        </div>
                      </th>
                      <th className="earnother-th col-2">Method</th>
                      <th className="earnother-th col-2">Chain</th>
                      <th className="earnother-th col-2">Action</th>
                    </thead>
                  </table>
                </div>
              )}
              <div className="d-flex flex-column gap-1 px-0">
                {allPools.map((item, index) => {
                  return (
                    <TopOtherPoolsListCard
                      chainLogo={item.poolList[0].iconURL}
                      tokenLogo={item.iconURL}
                      chain={item.chains[0]}
                      tokenName={item.name}
                      tokenTicker={item.name}
                      apr={item.maxAPR}
                      lockTime={item.lockType}
                      expired={item.no}
                      isNewPool={true}
                      isComingSoon={item.name.toLowerCase() === 'bnb' ? false : true}
                      isHot={
                        item.tags.find((obj) => {
                          return obj === "Hot";
                        })
                          ? true
                          : false
                      }
                      isNft={
                        item.tags.find((obj) => {
                          return obj === "NFT";
                        })
                          ? true
                          : false
                      }
                      isStaked={false}
                      onCardClick={() => {
                        // setshowDetails(!showDetails);
                        // setcardIndex(!showDetails ? index : 777);
                        // setselectedBtn(item.lockTime);
                        // setselectedPool(item);
                        handleManageDetails(item);
                      }}
                      cardIndex={cardIndex}
                      showDetails={showDetails}
                      cardId={index}
                      onCountDownComplete={(value)=>{setlivePremiumOnly(value)}}
                      isPremium={isPremium}
                    />
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div
            className="w-100 d-flex justify-content-center align-items-center mt-5"
            style={{ minHeight: "240px" }}
          >
            <FadeLoader color="#7770DF" />
          </div>
        ))}

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
                      setshowDetails(false);
                      setselectedTab("deposit");
                      onCloseCard();
                      setshowDetails(false);
                    }}
                    style={{
                      bottom: "17px",
                      alignSelf: "end",
                      width: 16,
                      height: 16,
                    }}
                  />
                </div>

                {selectedPool.id === "bnbChainPool" ? (
                  <StakeDypiusBscOther
                    selectedTab={selectedTab}
                    selectedBtn={selectedBtn}
                    selectedPool={selectedPool}
                    staking={window.constant_staking_dypius_bscother1}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    expiration_time={"09 Nov 2024"}
                    lockTime={parseInt(selectedPool.poolList[0].lockTime)}
                    finalApr={selectedPool.maxAPR}
                    fee={selectedPool.poolList[0].performancefee}
                    apr={selectedPool?.poolList[0].aprPercent}
                    earlyFee={selectedPool?.poolList[0].earlyFee}
                    expired={
                      selectedPool?.poolList[0].expired === "No" ? false : true
                    }
                    maximumDeposit={selectedPool?.poolList[0].maximumDeposit}
                    poolCap={selectedPool?.poolList[0].poolCap}
                    chainId={chainId}
                    onConnectWallet={() => {
                      onConnectWallet();
                      setshowDetails(false);
                      setselectedPool([]);
                    }}
                    is_wallet_connected={isConnected}
                    userCurencyBalance={userCurencyBalance}
                    livePremiumOnly={livePremiumOnly}
                    isPremium={isPremium}
                  />
                ) : selectedPool.id === "avaxChainPool" ? (
                  <StakeDypiusAvaxOther
                    selectedTab={selectedTab}
                    selectedBtn={selectedBtn}
                    selectedPool={selectedPool}
                    staking={window.constant_staking_dypius_avax1}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    expiration_time={"09 Nov 2024"}
                    lockTime={parseInt(selectedPool.poolList[0].lockTime)}
                    finalApr={selectedPool.maxAPR}
                    fee_s={selectedPool.poolList[0].performancefee}
                    apr={selectedPool?.poolList[0].aprPercent}
                    earlyFee={selectedPool?.poolList[0].earlyFee}
                    expired={
                      selectedPool?.poolList[0].expired === "No" ? false : true
                    }
                    maximumDeposit={selectedPool?.poolList[0].maximumDeposit}
                    poolCap={selectedPool?.poolList[0].poolCap}
                    chainId={chainId}
                    onConnectWallet={() => {
                      onConnectWallet();
                      setshowDetails(false);
                      setselectedPool([]);
                    }}
                    is_wallet_connected={isConnected}
                    userCurencyBalance={userCurencyBalance}
                  />
                ) : (
                  <StakeDypiusEthOther
                    selectedTab={selectedTab}
                    selectedBtn={selectedBtn}
                    selectedPool={selectedPool}
                    staking={window.constant_staking_dypius_eth1}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    expiration_time={"09 Nov 2024"}
                    lockTime={parseInt(selectedPool.poolList[0].lockTime)}
                    finalApr={selectedPool.maxAPR}
                    fee={selectedPool.poolList[0].performancefee}
                    apr={selectedPool?.poolList[0].aprPercent}
                    earlyFee={selectedPool?.poolList[0].earlyFee}
                    expired={
                      selectedPool?.poolList[0].expired === "No" ? false : true
                    }
                    maximumDeposit={selectedPool?.poolList[0].maximumDeposit}
                    poolCap={selectedPool?.poolList[0].poolCap}
                    chainId={chainId}
                    onConnectWallet={() => {
                      onConnectWallet();
                      setshowDetails(false);
                      setselectedPool([]);
                    }}
                    is_wallet_connected={isConnected}
                    userCurencyBalance={userCurencyBalance}
                  />
                )}

                {/* <EarnInnerPool
                  selectedTab={selectedTab}
                  selectedBtn={selectedBtn}
                  selectedPool={selectedPool}
                  staking={
                    chainId == 1
                      ? window.constant_staking_idyp_5
                      : chainId == 56
                      ? window.constant_stakingidyp_7
                      : window.constant_staking_idypavax_7
                  }
                  coinbase={coinbase}
                  the_graph_result={the_graph_result}
                /> */}
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default EarnOtherContent;
