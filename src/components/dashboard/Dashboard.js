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
import { FadeLoader } from "react-spinners";
import BscFarmingFunc from "../FARMINNG/BscFarmingFunc";
import MigrationBanner from "../migrationbanner/MigrationBanner";
import StakeAvaxIDyp from "../FARMINNG/stakeAvaxiDyp";
import StakeDypiusEth from "../FARMINNG/constant-staking-dypius-new";
import StakeDypiusAvax from "../FARMINNG/stakeDypiusAvax";
import StakeDypiusBsc from "../FARMINNG/bscConstantStakeDypius";
import StakeDypiusEth3Phase2 from "../FARMINNG/stakingDypiusEth3Phase2";
import StakeDypiusEth1Phase2 from "../FARMINNG/stakingDypiusEth1Phase2";
import StakeDypiusEth2Phase2 from "../FARMINNG/stakingDypiusEth2Phase2";
import StakingiDypPhase2 from "../FARMINNG/stakingiDypPhase2";

import InitConstantStakingiDYP from "../FARMINNG/constant-staking-idyp-new-front";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import closeX from "../earnOther/assets/closeX.svg";
import ethereumIcon from "../top-pools-card/assets/ethereum.svg";
import bnbIcon from "../top-pools-card/assets/bsc.svg";
import avaxIcon from "../top-pools-card/assets/avax.svg";
import { ClickAwayListener } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import moreinfo from "../FARMINNG/assets/more-info.svg";
import warning from "../FARMINNG/assets/warning.svg";
import StakeDypiusBscOther from "../earnOther/stakingPools/bscStakeDypiusOther";
import StakeDypiusEthOther from "../earnOther/stakingPools/ethStakeDypiusOther";
import StakeDypiusAvaxOther from "../earnOther/stakingPools/avaxStakeDypiusOther";
import CountDown from "react-countdown";

import eth from "../earn/assets/eth.svg";
import ethActive from "../earn/assets/ethActive.svg";

import bnb from "../earn/assets/bnb.svg";
import bnbActive from "../earn/assets/bnbActive.svg";

import avax from "../earn/assets/avax.svg";
import avaxActive from "../earn/assets/avaxActive.svg";

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
  aggregatorPools,
  onMobileClick,
}) => {
  const [topPools, setTopPools] = useState([]);
  const [cawsLandCard, setCawsLandCard] = useState([]);
  const [theBnbPool, setTheBnbPool] = useState({});
  const [totalTvl, settotalTvl] = useState(0);
  const [totalTvlETH, settotalTvlETH] = useState(0);
  const [totalTvlBNB, settotalTvlBNB] = useState(0);
  const [totalTvlAVAX, settotalTvlAVAX] = useState(0);
  const [count, setCount] = useState(0);

  const [wbnbPrice, setWbnbPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [avaxPrice, setAvaxPrice] = useState(0);

  const [selectedTab, setselectedTab] = useState("deposit");
  const [selectedBtn, setselectedBtn] = useState("flexible");
  const [selectedPool, setselectedPool] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [aprTooltip, setaprTooltip] = useState(false);
  const [livePremiumOnly, setlivePremiumOnly] = useState(true);

  const [landCard, setLandCard] = useState({});
  const [activeCard, setActiveCard] = useState();
  const [activeCardFarm, setActiveCardFarm] = useState();

  const [cardIndex, setcardIndex] = useState();
  const [details, setDetails] = useState();
  const [popularNewsData, setPopularNewsData] = useState([]);
  const [activeCard2, setActiveCard2] = useState();
  const [loading, setLoading] = useState(true);
  const [userPools, setuserPools] = useState([]);
  const [ethPools, setEthPools] = useState([]);
  const [bnbPools, setBnbPools] = useState([]);
  const [avaxPools, setAvaxPools] = useState([]);

  const wbsc_address = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";
  let premiumDay = new Date("2024-04-17T15:00:00.000+02:00");

  const { BigNumber } = window;

  const [selectedpoolType, setselectedpoolType] = useState("");

  const [ethPoolsDyp, setethPoolsDyp] = useState([]);
  const [ethPoolsiDyp, setethPoolsiDyp] = useState([]);
  const [bnbPoolsDyp, setbnbPoolsDyp] = useState([]);
  const [bnbPoolsiDyp, setbnbPoolsiDyp] = useState([]);
  const [avaxPoolsDyp, setavaxPoolsDyp] = useState([]);
  const [avaxPoolsiDyp, setavaxPoolsiDyp] = useState([]);
  const [selectedchain, setselectedchain] = useState("");
  const [showMobilePopup, setshowMobilePopup] = useState(false);
  const [resultFilteredPool, setresultFilteredPool] = useState([]);
  const [selectedIndex, setselectedIndex] = useState();

  const phase2_pools = [
    {
      id: "0x0fafe78e471b52bc4003984a337948ed55284573",
      apy_percent: 15,
      tvl_usd: 46682.3565666875,
      link_logo: "https://www.dypius.com/logo192.png",
      link_pair: "https://app.dyp.finance/constant-staking-3",
      pool_name: "DYP Constant Staking ETH",
      pair_name: "DYP",
      return_types: "DYP",
      lock_time: "60 days",
      expired: "No",
      new_pool: "Yes",
      apy_performancefee: 15,
      performancefee: 0,
      type: "dyp",
      chain: "eth",
    },
    {
      id: "0xFdD3CFF22CF846208E3B37b47Bc36b2c61D2cA8b",
      apy_percent: 25,
      tvl_usd: 462.3565666875,
      link_logo: "https://www.dypius.com/logo192.png",
      link_pair: "https://app.dyp.finance/constant-staking-3",
      pool_name: "DYP Constant Staking ETH",
      pair_name: "DYP",
      return_types: "iDYP",
      lock_time: "90 days",
      expired: "No",
      new_pool: "Yes",
      apy_performancefee: 25,
      performancefee: 0,
      type: "dyp",
      chain: "eth",
    },
  ];

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

  const getBSCPrice = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_bsc_v2")
      .then((data) => {
        setWbnbPrice(data.data.the_graph_bsc_v2.usd_per_eth);
      });
  };

  const getETHPrice = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_eth_v2")
      .then((data) => {
        setEthPrice(data.data.the_graph_eth_v2.usd_per_eth);
      });
  };

  const getAvaxPrice = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_avax_v2")
      .then((data) => {
        setAvaxPrice(data.data.the_graph_avax_v2.usd_per_eth);
      });
  };

  const fetchTotalTvl = async () => {
    const staking = window.constant_staking_dypius_bscother1;
    const staking_eth = window.constant_staking_dypius_ethother1;
    const staking_avax = window.constant_staking_dypius_avaxother1;

    const wbnbContract = new window.bscWeb3.eth.Contract(
      window.TOKEN_ABI,
      window.config.reward_token_wbnb_address
    );
    const baseContract = new window.baseWeb3.eth.Contract(
      window.TOKEN_ABI,
      window.config.reward_token_dypius_base_address
    );

    const wavaxContract = new window.avaxWeb3.eth.Contract(
      window.TOKEN_ABI,
      window.config.wavax_address
    );

    const tvl = await wbnbContract.methods
      .balanceOf(staking._address)
      .call()
      .catch((e) => {
        console.log(e);
        return 0;
      });

    const tvl_eth = await baseContract.methods
      .balanceOf(staking_eth._address)
      .call()
      .catch((e) => {
        console.log(e);
        return 0;
      });

    const tvl_avax = await wavaxContract.methods
      .balanceOf(staking_avax._address)
      .call()
      .catch((e) => {
        console.log(e);
        return 0;
      });

    const tvlFormatted = new BigNumber(tvl).div(1e18).toFixed(4);
    const tvlEthFormatted = new BigNumber(tvl_eth).div(1e18).toFixed(4);
    const tvlAvaxFormatted = new BigNumber(tvl_avax).div(1e18).toFixed(4);

    if (wbnbPrice !== 0 && ethPrice !== 0 && avaxPrice !== 0) {
      const finalTvl = tvlFormatted * wbnbPrice;
      const finalEthTvl = tvlEthFormatted * ethPrice;
      const finalAvaxTvl = tvlAvaxFormatted * avaxPrice;

      settotalTvlETH(finalEthTvl);
      settotalTvlBNB(finalTvl);
      settotalTvlAVAX(finalAvaxTvl);

      // settotalTvl(
      //   Number(finalTvl) + Number(finalEthTvl) + Number(finalAvaxTvl)
      // );
    }
  };

  const fetchAllPools = async () => {
    const bnbFarmingPool = await axios
      .get("https://api.dyp.finance/api/the_graph_bsc_v2")
      .catch((err) => console.error(err));

    const bnbStakingPool = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_bnb_new`)
      .catch((err) => {
        console.log(err);
      });

    const avaxStakingPool = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_avax`)
      .catch((err) => {
        console.log(err);
      });

    const avaxStakingPoolNew = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_avax_new`)
      .catch((err) => {
        console.log(err);
      });

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
      bnbStakingPool &&
      bnbStakingPool.status === 200 &&
      avaxStakingPool &&
      avaxStakingPool.status === 200 &&
      avaxStakingPoolNew &&
      avaxStakingPoolNew.status === 200 &&
      eth_result &&
      eth_result.status === 200 &&
      eth_result2 &&
      eth_result2.status === 200 &&
      bnbFarmingPool &&
      bnbFarmingPool.status === 200 &&
      aggregatorPools.length > 0
    ) {
      let temparray = Object.entries(
        bnbFarmingPool.data.the_graph_bsc_v2.lp_data
      );
      let bnbpool = temparray.filter((item) => {
        setWbnbPrice(bnbFarmingPool.data.the_graph_bsc_v2.usd_per_eth);
        return (
          item[1].id ===
          "0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb-0x5bc3a80a1f2c4fb693d9dddcebbb5a1b5bb15d65"
        );
      });
      setTheBnbPool(bnbpool);
      const testbnbFarming = bnbpool[0];
      const finalBnbFarmingpool = testbnbFarming[1];

      const dypBnb = bnbStakingPool.data.stakingInfoDYPBnb;
      const avaxIdyp = avaxStakingPool.data.stakingInfoiDYPAvax;
      const avaxDyp = avaxStakingPoolNew.data.stakingInfoDYPAvax;
      const ethereumIdyp = eth_result.data.stakingInfoiDYPEth;
      const ethereumDyp = eth_result2.data.stakingInfoDYPEth;

      const object2_phase2_eth = phase2_pools.filter((pools) => {
        return pools.type === "dyp";
      });

      const object2Avax2 = avaxDyp.map((item) => {
        return {
          ...item,
          tvl_usd: item.tvl_usd,
          tokenType: "dyp",
          chain: "avax",
        };
      });

      const activeAvax = avaxIdyp.filter((item) => {
        return item.expired !== "Yes";
      });
      const object2activeAvax = activeAvax.map((item) => {
        return {
          ...item,
          tvl_usd: item.tvl_usd,
          tokenType: "idyp",
          chain: "avax",
        };
      });

      const activeAvax2 = object2Avax2.filter((item) => {
        return item.expired !== "Yes";
      });

      const allActiveAvax = [...object2activeAvax, ...activeAvax2];
      const sortedActiveAvax = allActiveAvax.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });
      setAvaxPools(sortedActiveAvax);

      setavaxPoolsDyp(activeAvax2);
      setavaxPoolsiDyp(object2activeAvax);

      const object2bnb = dypBnb.map((item) => {
        return {
          ...item,
          tvl_usd: item.tvl_usd,
          tokenType: "dyp",
          chain: "bnb",
        };
      });

      const activeBnb2 = object2bnb.filter((item) => {
        return item.expired === "No";
      });

      const allActiveBnb = [...activeBnb2];
      const sortedActive = allActiveBnb.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });
      setBnbPools(sortedActive);
      setbnbPoolsDyp(activeBnb2);

      const bnbAggregatorPool = aggregatorPools.find((item) => {
        return item.name.toLowerCase() === "bnb";
      });

      const bnbAggregatorPool_formatted = [bnbAggregatorPool].map((item) => {
        return {
          ...item,
          chain: "bnb",
          type: "staking",
          tvl_usd: item.poolList[0].tvl,
          id: item.poolList[0].contractAddress,
          apy_percent: item.poolList[0].aprPercent,
          lock_time: item.poolList[0].lockTime + " days",
          pair_name: item.name,
        };
      });

      const ethAggregatorPool = aggregatorPools.find((item) => {
        return item.name.toLowerCase() === "eth";
      });

      const avaxAggregatorPool = aggregatorPools.find((item) => {
        return item.name.toLowerCase() === "avax";
      });

      const avaxAggregatorPool_formatted = [avaxAggregatorPool].map((item) => {
        return {
          ...item,
          chain: "avax",
          type: "staking",
          tvl_usd: item.poolList[0].tvl,
          id: item.poolList[0].contractAddress,
          apy_percent: item.poolList[0].aprPercent,
          lock_time: item.poolList[0].lockTime + " days",
          pair_name: item.name,
        };
      });

      const ethAggregatorPool_formatted = [ethAggregatorPool].map((item) => {
        return {
          ...item,
          chain: "base",
          type: "staking",
          tvl_usd: item.poolList[0].tvl,
          id: item.poolList[0].contractAddress,
          apy_percent: item.poolList[0].aprPercent,
          lock_time: item.poolList[0].lockTime + " days",
          pair_name: item.name,
        };
      });

      const allpoolsEthereum = [
        ...ethereumDyp,
        ...object2_phase2_eth,
        ...ethereumIdyp,
        // ...phase2_pools,
      ];

      const object2 = [...ethereumDyp, ...object2_phase2_eth].map((item) => {
        return {
          ...item,
          tvl_usd: item.tvl_usd,
          tokenType: "dyp",
          chain: "eth",
        };
      });

      const activeEth = ethereumIdyp.filter((item) => {
        return item.expired !== "Yes";
      });
      const object2activeEth = activeEth.map((item) => {
        return {
          ...item,
          tvl_usd: item.tvl_usd,
          tokenType: "idyp",
          chain: "eth",
        };
      });

      const activeEth2 = object2.filter((item) => {
        return item.expired !== "Yes";
      });

      const object2Ethereum = allpoolsEthereum.map((item) => {
        return {
          ...item,
          tvl_usd: item.tvl_usd,
          chain: "eth",
          type: "staking",
        };
      });

      const cleanCardsEthereum = object2Ethereum.filter((item) => {
        return item.expired !== "Yes";
      });

      const sortedAprsEthereum = cleanCardsEthereum.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });
      const allActiveEth = [...activeEth2, ...object2activeEth];

      const sortedActiveeth = allActiveEth.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });
      setEthPools(sortedActiveeth);
      setethPoolsDyp(activeEth2);
      setethPoolsiDyp(object2activeEth);

      const object2Avax = avaxDyp.map((item) => {
        return {
          ...item,
          tvl_usd: item.tvl_usd,
          chain: "avax",
          type: "staking",
        };
      });
      const cleanCardsAvax = avaxIdyp.filter((item) => {
        return item.expired !== "Yes";
      });

      const object2idypAvax = cleanCardsAvax.map((item) => {
        return {
          ...item,
          tvl_usd: item.tvl_usd,
          chain: "avax",
          type: "staking",
        };
      });

      const cleanCards2Avax = object2Avax.filter((item) => {
        return item.expired !== "Yes";
      });

      const allActiveCardsAvax = [...object2idypAvax, ...cleanCards2Avax];

      const sortedAprsAvax = allActiveCardsAvax.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });

      const object2Bnb = dypBnb.map((item) => {
        return {
          ...item,
          tvl_usd: item.tvl_usd,
          chain: "bnb",
          type: "staking",
        };
      });

      const cleanCards2Bnb = object2Bnb.filter((item) => {
        return item.expired === "No";
      });

      const sortedAprsBnb = cleanCards2Bnb.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });

      const allPools = [
        ...sortedActiveeth,
        ...sortedActiveAvax,
        ...sortedActive,
        // ...bnbAggregatorPool_formatted,
        // ...ethAggregatorPool_formatted,
        // ...avaxAggregatorPool_formatted,
        // finalBnbFarmingpool,
      ].sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });
      const finalPools = [sortedAprsEthereum[0], allPools[1]];

      setTopPools(allPools);
    }
  };

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

  const getClassName = (
    chain,
    locktimeToCheck,
    tokentype,
    selectedPool,
    ethDypPool,
    ethiDypPool,
    bnbDypPool,
    bnbIdypPool,
    avaxDyppool,
    avaxiDypPool
  ) => {
    if (chain === "eth") {
      if (tokentype === "dyp") {
        if (locktimeToCheck === selectedPool.lock_time) {
          return "method-btn-active";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          ethDypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          !ethDypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn-disabled";
        }
      } else if (tokentype === "idyp") {
        if (locktimeToCheck === selectedPool.lock_time) {
          return "method-btn-active";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          ethiDypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          !ethiDypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn-disabled";
        }
      }
    } else if (chain === "bnb") {
      if (tokentype === "dyp") {
        if (locktimeToCheck === selectedPool.lock_time) {
          return "method-btn-active";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          bnbDypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          !bnbDypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn-disabled";
        }
      } else if (tokentype === "idyp") {
        if (locktimeToCheck === selectedPool.lock_time) {
          return "method-btn-active";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          bnbIdypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          !bnbIdypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn-disabled";
        }
      }
    } else if (chain === "avax") {
      if (tokentype === "dyp") {
        if (locktimeToCheck === selectedPool.lock_time) {
          return "method-btn-active";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          avaxDyppool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          !avaxDyppool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn-disabled";
        }
      } else if (tokentype === "idyp") {
        if (locktimeToCheck === selectedPool.lock_time) {
          return "method-btn-active";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          avaxiDypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          !avaxiDypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn-disabled";
        }
      }
    }
  };

  const handleSelectPool = (
    selectedchain,
    locktime,
    selectedpoolType,
    ethPoolsDyp,
    ethPoolsiDyp,
    bnbPoolsDyp,
    bnbPoolsiDyp,
    avaxPoolsDyp,
    avaxPoolsiDyp
  ) => {
    if (selectedchain === "eth") {
      if (selectedpoolType === "dyp") {
        const result = ethPoolsDyp.filter((item) => {
          return item.lock_time === locktime;
        });

        if (result) {
          setresultFilteredPool(result);
          setselectedPool(...result);
        }
      } else if (selectedpoolType === "idyp") {
        const result = ethPoolsiDyp.filter((item) => {
          return item.lock_time === locktime;
        });
        if (result) {
          setresultFilteredPool(result);

          setselectedPool(...result);
        }
      }
    } else if (selectedchain === "bnb") {
      if (selectedpoolType === "dyp") {
        const result = bnbPoolsDyp.filter((item) => {
          return item.lock_time === locktime;
        });
        if (result) {
          setresultFilteredPool(result);

          setselectedPool(...result);
        }
      } else if (selectedpoolType === "idyp") {
        const result = bnbPoolsiDyp.filter((item) => {
          return item.lock_time === locktime;
        });
        if (result) {
          setresultFilteredPool(result);

          setselectedPool(...result);
        }
      }
    } else if (selectedchain === "avax") {
      if (selectedpoolType === "dyp") {
        const result = avaxPoolsDyp.filter((item) => {
          return item.lock_time === locktime;
        });
        if (result) {
          setresultFilteredPool(result);

          setselectedPool(...result);
        }
      } else if (selectedpoolType === "idyp") {
        const result = avaxPoolsiDyp.filter((item) => {
          return item.lock_time === locktime;
        });
        if (result) {
          setresultFilteredPool(result);

          setselectedPool(...result);
        }
      }
    }
  };

  useEffect(() => {
    fetchUserPools();
  }, [network, coinbase]);

  useEffect(() => {
    fetchAllPools();
    fetchPopularNewsData();
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, [aggregatorPools]);

  const windowSize = useWindowSize();

  const aprOpen = () => {
    setaprTooltip(true);
  };
  const aprClose = () => {
    setaprTooltip(false);
  };

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

  useEffect(() => {
    fetchTotalTvl();
  }, [wbnbPrice, ethPrice, avaxPrice, count]);

  useEffect(() => {
    getBSCPrice();
    getETHPrice();
    getAvaxPrice();
  }, []);

  useEffect(() => {
    if (selectedPool && selectedPool.chain) {
      setselectedchain(selectedPool?.chain);
    }
  }, [selectedPool]);
  
  return (
    <>
      <div className="d-none">
        <CountDown
          date={premiumDay}
          onComplete={() => {
            setlivePremiumOnly(false);
          }}
        />
      </div>
      <div className="container-lg dashboardwrapper px-0">
        <div className="d-flex m-0 flex-column flex-xxl-row justify-content-between gap-4">
          <div className="d-flex flex-column gap-4 justify-content-between">
            <div className="d-flex flex-column flex-md-row m-0 gap-3 justify-content-between">
              {/* <Calculator /> */}
              <MigrationBanner />
              <div className="d-flex flex-column gap-3 gap-lg-4 justify-content-between dashboard-cards-wrapper">
                <ExplorerCard />
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                  <BridgeCard
                    onMobileClick={() => {
                      onMobileClick();
                    }}
                  />{" "}
                  <GovCard />
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
                    //  && (network === 1 ||
                    //   network === 1030 ||
                    //   network === 8453 ||
                    //   network === 0 ||
                    //   network === 1482601649)
                    loading === false ? (
                      topPools.slice(0, 2).map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="poolscardwrapper cursor-pointer position-relative p-0 position-relative"
                          >
                            {item.chain === "bnb" && (
                              <div className="d-flex justify-content-end align-items-center bnbTagwrapper pe-2">
                                <img
                                  src={require("./assets/bnblogo.svg").default}
                                  alt=""
                                  style={{ height: 20, width: 20 }}
                                  className="popup-chains-icon"
                                ></img>
                                <h6
                                  className={`d-flex justify-content-center align-items-center chain-popup-text-active`}
                                >
                                  BNB Chain
                                </h6>
                              </div>
                            )}
                            {item.chain === "eth" && (
                              <div className="d-flex justify-content-end pe-2 align-items-center ethereumTagwrapper">
                                <img
                                  src={require("./assets/ethereum.svg").default}
                                  alt=""
                                  style={{ height: 20, width: 20 }}
                                  className="popup-chains-icon"
                                ></img>
                                <h6
                                  className={`d-flex justify-content-center align-items-center chain-popup-text-active`}
                                >
                                  Ethereum
                                </h6>
                              </div>
                            )}
                            {item.chain === "base" && (
                              <div className="d-flex justify-content-end pe-2 align-items-center baseTagwrapper">
                                <img
                                  src={require("./assets/base.svg").default}
                                  alt=""
                                  style={{ height: 20, width: 20 }}
                                  className="popup-chains-icon"
                                ></img>
                                <h6
                                  className={`d-flex justify-content-center align-items-center chain-popup-text-active`}
                                >
                                  Base Chain
                                </h6>
                              </div>
                            )}
                            {item.chain === "avax" && (
                              <div className="d-flex justify-content-end align-items-center pe-2 avaxTagWrapper">
                                <img
                                  src={require("./assets/avaxlogo.svg").default}
                                  alt=""
                                  style={{ height: 20, width: 20 }}
                                  className="popup-chains-icon"
                                ></img>
                                <h6
                                  className={`d-flex justify-content-center align-items-center chain-popup-text-active`}
                                >
                                  Avalanche
                                </h6>
                              </div>
                            )}

                            <TopPoolsCard
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
                                item.type === "staking" &&
                                item.pair_name === "ETH"
                                  ? "$" + getFormattedNumber(totalTvlETH)
                                  : item.type === "staking" &&
                                    item.pair_name === "BNB"
                                  ? "$" + getFormattedNumber(totalTvlBNB)
                                  : item.pair_name === "AVAX" &&
                                    item.type === "staking"
                                  ? "$" + getFormattedNumber(totalTvlAVAX)
                                  : item.tvl_usd === "--"
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
                                  : item.pair_name === "BNB"
                                  ? "bnbChain.svg"
                                  : item.pair_name === "ETH"
                                  ? "ethereum.svg"
                                  : item.pair_name === "AVAX"
                                  ? "avax.svg"
                                  : "newCawsLogo.png"
                              }
                              onShowDetailsClick={() => {
                                setActiveCard(topPools[index]);
                                setcardIndex(index);
                                setDetails(index);
                                setselectedPool(item);
                                setShowDetails(true);
                                setselectedpoolType(item.tokenType);
                                setselectedIndex(index);
                                handleSelectPool(
                                  item.chain,
                                  item.lock_time,
                                  item.tokenType,
                                  ethPoolsDyp,
                                  ethPoolsiDyp,
                                  bnbPoolsDyp,
                                  bnbPoolsiDyp,
                                  avaxPoolsDyp,
                                  avaxPoolsiDyp
                                );
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
                          </div>
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
                  {activeCardFarm && network === 56 ? (
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
                    <></>
                  )}
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  <div className="row m-0 gap-4 toppool-allwrapper">
                    {topPools.length > 0 &&
                    // (network === 1 ||
                    //   network === 1030 ||
                    //   network === 8453 ||
                    //   network === 0 ||
                    //   network === 1482601649)&&
                    loading === false ? (
                      topPools.slice(0, 2).map((item, index) => {
                        return (
                          <div className="poolscardwrapper cursor-pointer position-relative p-0 position-relative">
                            {item.chain === "bnb" && (
                              <div className="d-flex justify-content-end align-items-center bnbTagwrapper pe-2">
                                <img
                                  src={require("./assets/bnblogo.svg").default}
                                  alt=""
                                  style={{ height: 20, width: 20 }}
                                  className="popup-chains-icon"
                                ></img>
                                <h6
                                  className={`d-flex justify-content-center align-items-center chain-popup-text-active`}
                                >
                                  BNB Chain
                                </h6>
                              </div>
                            )}
                            {item.chain === "eth" && (
                              <div className="d-flex justify-content-end pe-2 align-items-center ethereumTagwrapper">
                                <img
                                  src={require("./assets/ethereum.svg").default}
                                  alt=""
                                  style={{ height: 20, width: 20 }}
                                  className="popup-chains-icon"
                                ></img>
                                <h6
                                  className={`d-flex justify-content-center align-items-center chain-popup-text-active`}
                                >
                                  Ethereum
                                </h6>
                              </div>
                            )}
                            {item.chain === "base" && (
                              <div className="d-flex justify-content-end pe-2 align-items-center baseTagwrapper">
                                <img
                                  src={require("./assets/base.svg").default}
                                  alt=""
                                  style={{ height: 20, width: 20 }}
                                  className="popup-chains-icon"
                                ></img>
                                <h6
                                  className={`d-flex justify-content-center align-items-center chain-popup-text-active`}
                                >
                                  Base
                                </h6>
                              </div>
                            )}
                            {item.chain === "avax" && (
                              <div className="d-flex justify-content-end align-items-center pe-2 avaxTagWrapper">
                                <img
                                  src={require("./assets/avaxlogo.svg").default}
                                  alt=""
                                  style={{ height: 20, width: 20 }}
                                  className="popup-chains-icon"
                                ></img>
                                <h6
                                  className={`d-flex justify-content-center align-items-center chain-popup-text-active`}
                                >
                                  Avalanche
                                </h6>
                              </div>
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
                                item.type === "staking" &&
                                item.pair_name === "ETH"
                                  ? "$" + getFormattedNumber(totalTvlETH)
                                  : item.type === "staking" &&
                                    item.pair_name === "BNB"
                                  ? "$" + getFormattedNumber(totalTvlBNB)
                                  : item.pair_name === "AVAX" &&
                                    item.type === "staking"
                                  ? "$" + getFormattedNumber(totalTvlAVAX)
                                  : item.tvl_usd === "--"
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
                                  : item.pair_name === "BNB"
                                  ? "bnbChain.svg"
                                  : item.pair_name === "ETH"
                                  ? "ethereum.svg"
                                  : item.pair_name === "AVAX"
                                  ? "avax.svg"
                                  : "newCawsLogo.png"
                              }
                              onShowDetailsClick={() => {
                                setActiveCard(topPools[index]);
                                setcardIndex(index);
                                setDetails(index);
                                setselectedPool(item);
                                setselectedpoolType(item.tokenType);
                                setShowDetails(true);
                                setselectedIndex(index);
                                handleSelectPool(
                                  item.chain,
                                  item.lock_time,
                                  item.tokenType,
                                  ethPoolsDyp,
                                  ethPoolsiDyp,
                                  bnbPoolsDyp,
                                  bnbPoolsiDyp,
                                  avaxPoolsDyp,
                                  avaxPoolsiDyp
                                );
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
                          </div>
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
                {selectedPool?.name !== "BNB" &&
                  selectedPool?.name !== "ETH" &&
                  selectedPool?.name !== "AVAX" && (
                    <div className="locktimewrapper align-items-center gap-2">
                      <button
                        className={getClassName(
                          selectedchain,
                          "No lock",
                          selectedpoolType,
                          selectedPool,
                          ethPoolsDyp,
                          ethPoolsiDyp,
                          bnbPoolsDyp,
                          bnbPoolsiDyp,
                          avaxPoolsDyp,
                          avaxPoolsiDyp
                        )}
                        onClick={() => {
                          handleSelectPool(
                            selectedchain,
                            "No lock",
                            selectedpoolType,
                            ethPoolsDyp,
                            ethPoolsiDyp,
                            bnbPoolsDyp,
                            bnbPoolsiDyp,
                            avaxPoolsDyp,
                            avaxPoolsiDyp
                          );
                        }}
                      >
                        Flexible
                      </button>
                      <button
                        className={getClassName(
                          selectedchain,
                          "30 days",
                          selectedpoolType,
                          selectedPool,
                          ethPoolsDyp,
                          ethPoolsiDyp,
                          bnbPoolsDyp,
                          bnbPoolsiDyp,
                          avaxPoolsDyp,
                          avaxPoolsiDyp
                        )}
                        onClick={() => {
                          handleSelectPool(
                            selectedchain,
                            "30 days",
                            selectedpoolType,
                            ethPoolsDyp,
                            ethPoolsiDyp,
                            bnbPoolsDyp,
                            bnbPoolsiDyp,
                            avaxPoolsDyp,
                            avaxPoolsiDyp
                          );
                        }}
                      >
                        30 Days
                      </button>
                      <button
                        className={getClassName(
                          selectedchain,
                          "60 days",
                          selectedpoolType,
                          selectedPool,
                          ethPoolsDyp,
                          ethPoolsiDyp,
                          bnbPoolsDyp,
                          bnbPoolsiDyp,
                          avaxPoolsDyp,
                          avaxPoolsiDyp
                        )}
                        onClick={() => {
                          handleSelectPool(
                            selectedchain,
                            "60 days",
                            selectedpoolType,
                            ethPoolsDyp,
                            ethPoolsiDyp,
                            bnbPoolsDyp,
                            bnbPoolsiDyp,
                            avaxPoolsDyp,
                            avaxPoolsiDyp
                          );
                        }}
                      >
                        60 Days
                      </button>
                      <button
                        className={getClassName(
                          selectedchain,
                          "90 days",
                          selectedpoolType,
                          selectedPool,
                          ethPoolsDyp,
                          ethPoolsiDyp,
                          bnbPoolsDyp,
                          bnbPoolsiDyp,
                          avaxPoolsDyp,
                          avaxPoolsiDyp
                        )}
                        onClick={() => {
                          handleSelectPool(
                            selectedchain,
                            "90 days",
                            selectedpoolType,
                            ethPoolsDyp,
                            ethPoolsiDyp,
                            bnbPoolsDyp,
                            bnbPoolsiDyp,
                            avaxPoolsDyp,
                            avaxPoolsiDyp
                          );
                          setselectedIndex(0);
                        }}
                      >
                        90 Days
                      </button>
                      <button
                        className={getClassName(
                          selectedchain,
                          "120 days",
                          selectedpoolType,
                          selectedPool,
                          ethPoolsDyp,
                          ethPoolsiDyp,
                          bnbPoolsDyp,
                          bnbPoolsiDyp,
                          avaxPoolsDyp,
                          avaxPoolsiDyp
                        )}
                        onClick={() => {
                          handleSelectPool(
                            selectedchain,
                            "120 days",
                            selectedpoolType,
                            ethPoolsDyp,
                            ethPoolsiDyp,
                            bnbPoolsDyp,
                            bnbPoolsiDyp,
                            avaxPoolsDyp,
                            avaxPoolsiDyp
                          );
                        }}
                      >
                        120 Days
                      </button>
                    </div>
                  )}
                {selectedPool?.name !== "BNB" &&
                  selectedPool?.name !== "ETH" &&
                  selectedPool?.name !== "AVAX" && (
                    <div className="info-pool-wrapper p-3 w-100">
                      <div className="info-pool-inner-wrapper d-flex flex-column flex-lg-row align-items-center gap-2">
                        <div className="info-pool-item p-2">
                          <div className="d-flex justify-content-between gap-1 align-items-center">
                            <span className="info-pool-left-text">
                              APR{" "}
                              <ClickAwayListener onClickAway={aprClose}>
                                <Tooltip
                                  open={aprTooltip}
                                  disableFocusListener
                                  disableHoverListener
                                  disableTouchListener
                                  placement="top"
                                  title={
                                    <div className="tooltip-text">
                                      {selectedPool?.id ===
                                        "0x92A84052Fe6945949A295AF14a7506e3dc085492" ||
                                      selectedPool?.id ===
                                        "0xFdD3CFF22CF846208E3B37b47Bc36b2c61D2cA8b"
                                        ? "APR reflects the interest rate of earnings on an account over the course of one year. In order to get to the 25% APR for a pool with DYP deposits and iDYP rewards, there was a snapshot for both $DYP and $iDYP, at the prices of 0.048$ respectively 0.0015$, therefore for a 25% APR, the ratio for 1 $DYP staked will be 8 $iDYP received."
                                        : "APR reflects the interest rate of earnings on an account over the course of one year."}
                                    </div>
                                  }
                                >
                                  <img
                                    src={
                                      selectedPool?.id ===
                                        "0x92A84052Fe6945949A295AF14a7506e3dc085492" ||
                                      selectedPool?.id ===
                                        "0xFdD3CFF22CF846208E3B37b47Bc36b2c61D2cA8b"
                                        ? warning
                                        : moreinfo
                                    }
                                    alt=""
                                    onClick={aprOpen}
                                    style={{ width: 16, height: 16 }}
                                  />
                                </Tooltip>
                              </ClickAwayListener>
                            </span>
                            <span className="info-pool-right-text">
                              {selectedPool?.apy_performancefee}%
                            </span>
                          </div>
                        </div>
                        {/* <div
                          className={`info-pool-item d-flex gap-2 justify-content-between p-2`}
                        >
                          <span className="info-pool-left-text">Chain</span>
                          <span className="info-pool-right-text d-flex gap-1 align-items-center">
                            <img
                              src={
                                selectedPool?.chain === "bnb"
                                  ? bnbIcon
                                  : selectedPool.chain === "eth"
                                  ? ethereumIcon
                                  : avaxIcon
                              }
                              alt=""
                              width={12}
                              height={12}
                            />
                            {selectedPool?.chain === "bnb"
                              ? "BNB Chain"
                              : selectedPool.chain === "eth"
                              ? "Ethereum"
                              : "Avalanche"}
                          </span>
                        </div> */}
                        <div className="info-pool-item p-2">
                          <div className="d-flex justify-content-between gap-1 align-items-center">
                            <span className="info-pool-left-text">TVL</span>
                            <span className="info-pool-right-text">
                              ${getFormattedNumber(selectedPool.tvl_usd, 2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                <div className="d-flex gap-3 align-items-center justify-content-start w-100">
                  <div
                    className={`position-relative col-lg-3 ${
                      selectedchain === "eth"
                        ? "chain-popup-item-eth"
                        : "chain-popup-item"
                    }`}
                    onClick={() => {
                      setselectedchain("eth");
                      // onChainSelect("eth");
                      setselectedPool(
                        selectedPool.tokenType === "dyp"
                          ? ethPools.find((item) => {
                              return item.tokenType === "dyp";
                            })
                          : ethPools.find((item) => {
                              return item.tokenType === "idyp";
                            })
                      );
                    }}
                  >
                    <h6
                      className={`d-flex justify-content-center align-items-center chain-popup-text`}
                    >
                      <img
                        src={selectedchain === "eth" ? ethActive : eth}
                        alt=""
                        className="popup-chains-icon"
                      />
                      Ethereum
                    </h6>
                  </div>
                  <div
                    className={`position-relative col-lg-3 ${
                      selectedchain === "bnb"
                        ? "chain-popup-item-bnb"
                        : "chain-popup-item"
                    }`}
                    onClick={() => {
                      setselectedchain("bnb");
                      // onChainSelect("bnb");

                      setselectedPool(
                        selectedPool.tokenType === "dyp"
                          ? bnbPools.find((item) => {
                              return item.tokenType === "dyp";
                            })
                          : bnbPools.find((item) => {
                              return item.tokenType === "idyp";
                            })
                      );
                    }}
                  >
                    <h6
                      className={`d-flex justify-content-center align-items-center chain-popup-text`}
                    >
                      <img
                        src={selectedchain === "bnb" ? bnbActive : bnb}
                        alt=""
                        className="popup-chains-icon"
                      />
                      BNB Chain
                    </h6>
                  </div>
                  <div
                    className={`position-relative col-lg-3 ${
                      selectedchain === "avax"
                        ? "chain-popup-item-avax"
                        : "chain-popup-item"
                    }`}
                    onClick={() => {
                      setselectedchain("avax");
                      // onChainSelect("avax");
                      setselectedPool(
                        selectedPool.tokenType === "dyp"
                          ? avaxPools.find((item) => {
                              return item.tokenType === "dyp";
                            })
                          : avaxPools.find((item) => {
                              return item.tokenType === "idyp";
                            })
                      );
                    }}
                  >
                    <h6
                      className={`d-flex justify-content-center align-items-center chain-popup-text`}
                    >
                      <img
                        src={selectedchain === "avax" ? avaxActive : avax}
                        alt=""
                        className="popup-chains-icon"
                      />
                      Avalanche
                    </h6>
                  </div>
                </div>

                {resultFilteredPool && resultFilteredPool.length > 1 && (
                  <>
                    <div className="separator my-1"></div>
                    <div className="d-flex align-items-center gap-2 w-100">
                      {resultFilteredPool.map((obj, index) => {
                        return (
                          <button
                            className={` w-100 ${
                              selectedIndex === index
                                ? "method-btn-active"
                                : "method-btn"
                            }`}
                            onClick={() => {
                              setselectedIndex(index);
                              setselectedPool(obj);
                            }}
                          >
                            Pool {index + 1}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

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
                      setselectedPool([]);
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
                      setselectedPool([]);
                      setDetails();
                    }}
                  />
                ) : activeCard &&
                  selectedPool?.chain === "bnb" &&
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
                  selectedPool?.chain === "avax" &&
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
                    "0x92A84052Fe6945949A295AF14a7506e3dc085492" &&
                  selectedPool.name !== "AVAX" ? (
                  <StakeDypiusEth3Phase2
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_phase2_eth3}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"07 Jun 2025"}
                    start_date={"07 Jun 2024"}
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
                    poolCap={625000}
                  />
                ) : activeCard &&
                  selectedPool?.id ===
                    "0xFdD3CFF22CF846208E3B37b47Bc36b2c61D2cA8b" &&
                  selectedPool.name !== "AVAX" ? (
                  <StakeDypiusEth3Phase2
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_phase2_eth5}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"12 Jul 2025"}
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
                    poolCap={1500000}
                    start_date={"12 Jul 2024"}
                  />
                ) : activeCard &&
                  selectedPool?.id ===
                    "0x998A9F0DF7DAF20c2B0Bb379Dcae394636926a96" ? (
                  <StakeDypiusEth1Phase2
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_phase2_eth1}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"07 Jun 2025"}
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
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    poolCap={1000000}
                    start_date={"07 Jun 2024"}
                  />
                ) : activeCard &&
                  selectedPool?.id ===
                    "0x0fafe78e471b52bc4003984a337948ed55284573" ? (
                  <StakeDypiusEth1Phase2
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_phase2_eth4}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"12 Jul 2025"}
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
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    poolCap={3700000}
                    start_date={"12 Jul 2024"}
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
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                  />
                ) : activeCard &&
                  selectedPool?.id ===
                    "0xbE030A667d9ee75a9FCdF2162A2C14ccCAB573dD" ? (
                  <StakeDypiusEth2Phase2
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_phase2_eth2}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"07 Jun 2025"}
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
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                  />
                ) : activeCard && selectedPool.name === "BNB" ? (
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
                    chainId={network.toString()}
                    onConnectWallet={() => {
                      onConnectWallet();
                      setShowDetails(false);
                      setActiveCard();
                      setselectedPool([]);
                      setDetails();
                    }}
                    is_wallet_connected={isConnected}
                    livePremiumOnly={false}
                    isPremium={isPremium}
                    totalTvl={totalTvlBNB}
                    onRefreshTvl={() => {
                      setCount(count + 1);
                    }}
                  />
                ) : activeCard && selectedPool.name === "ETH" ? (
                  <StakeDypiusEthOther
                    selectedTab={selectedTab}
                    selectedBtn={selectedBtn}
                    selectedPool={selectedPool}
                    staking={window.constant_staking_dypius_ethother1}
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
                    poolCap={113}
                    chainId={network.toString()}
                    onConnectWallet={() => {
                      onConnectWallet();
                      setShowDetails(false);
                      setActiveCard();
                      setselectedPool([]);
                      setDetails();
                    }}
                    is_wallet_connected={isConnected}
                    livePremiumOnly={livePremiumOnly}
                    isPremium={isPremium}
                    totalTvl={totalTvlETH}
                    onRefreshTvl={() => {
                      setCount(count + 1);
                    }}
                  />
                ) : activeCard && selectedPool.name === "AVAX" ? (
                  <StakeDypiusAvaxOther
                    selectedTab={selectedTab}
                    selectedBtn={selectedBtn}
                    selectedPool={selectedPool}
                    staking={window.constant_staking_dypius_avaxother1}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    expiration_time={"09 Nov 2024"}
                    lockTime={30}
                    finalApr={selectedPool.maxAPR}
                    fee_s={selectedPool.poolList[0].performancefee}
                    apr={selectedPool?.poolList[0].aprPercent}
                    earlyFee={selectedPool?.poolList[0].earlyFee}
                    expired={
                      selectedPool?.poolList[0].expired === "No" ? false : true
                    }
                    maximumDeposit={selectedPool?.poolList[0].maximumDeposit}
                    poolCap={selectedPool?.poolList[0].poolCap}
                    chainId={network.toString()}
                    onConnectWallet={() => {
                      onConnectWallet();
                      setShowDetails(false);
                      setActiveCard();
                      setselectedPool([]);
                      setDetails();
                    }}
                    is_wallet_connected={isConnected}
                    isPremium={isPremium}
                    livePremiumOnly={livePremiumOnly}
                    totalTvl={totalTvlAVAX}
                    onRefreshTvl={() => {
                      setCount(count + 1);
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
