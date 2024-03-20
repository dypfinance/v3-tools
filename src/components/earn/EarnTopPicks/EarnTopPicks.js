import React, { useEffect, useState } from "react";
import TopPoolsCard from "../../top-pools-card/TopPoolsCard";
import CawsCard from "../../top-pools-card/CawsCard";
import TopPoolsListCard from "../../top-pools-card/TopPoolsListCard";
import axios from "axios";
import getFormattedNumber from "../../../functions/getFormattedNumber2";
import initStakingNew from "../../FARMINNG/staking-new-front";
import initConstantStakingiDYP from "../../FARMINNG/constant-staking-idyp-new-front";
import initFarmAvax from "../../FARMINNG/farmAvax";
import stakeAvax from "../../FARMINNG/stakeAvax";
import stakeAvax30 from "../../FARMINNG/stakeAvax30";
import CawsDetails from "../../FARMINNG/caws";
import { FadeLoader } from "react-spinners";
import useWindowSize from "../../../functions/useWindowSize";
import initBscFarming from "../../FARMINNG/bscFarming";
import InitConstantStakingiDYP from "../../FARMINNG/constant-staking-idyp-new-front";
import StakeAvaxIDyp from "../../FARMINNG/stakeAvaxiDyp";
import StakeBscIDyp from "../../FARMINNG/bscConstantStakeiDyp";
import StakeBsc from "../../FARMINNG/bscConstantStake";
import StakeDypiusEth from "../../FARMINNG/constant-staking-dypius-new";
import Vault from "../../FARMINNG/vault-new";
import StakeNewEth from "../../FARMINNG/stakeNewEth";
import BscFarmingFunc from "../../FARMINNG/BscFarmingFunc";
import FarmAvaxFunc from "../../FARMINNG/FarmAvaxFunc";
import StakeDypiusBsc from "../../FARMINNG/bscConstantStakeDypius";
import StakeDypiusAvax from "../../FARMINNG/stakeDypiusAvax";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import closeX from "../../earnOther/assets/closeX.svg";

const EarnTopPicks = ({
  topList,
  listType,
  coinbase,
  the_graph_result,
  lp_id,
  isConnected,
  chain,
  chainId,
  handleConnection,
  the_graph_resultavax,
  the_graph_resultbsc,
  referrer,
  pool,
  routeOption,
  customChain,
  handleSwitchNetwork,
  expiredPools,
  networkId,
  isPremium,
  showRibbon,
}) => {
  const vault = [
    {
      icon: "weth.svg",
      pair_name: "WETH",
      apy_percent: "3 - 13",
      tvl_usd: ``,
      lock_time: "No lock",
      top_pick: true,
      new_badge: false,
      link: "https://vault.dyp.finance/vault-weth",
    },
    {
      icon: "wbtc.svg",
      pair_name: "WBTC",
      apy_percent: "3 - 13",
      tvl_usd: ``,
      lock_time: "No lock",
      link: "https://vault.dyp.finance/vault-wbtc",
    },
    {
      icon: "usdc.svg",
      pair_name: "USDC",
      apy_percent: "8 - 22",
      tvl_usd: ``,
      lock_time: "No lock",
      new_badge: false,
      top_pick: false,
      link: "https://vault.dyp.finance/vault-usdc",
    },
    {
      icon: "usdt.svg",
      pair_name: "USDT",
      apy_percent: "9 - 23",
      tvl_usd: ``,
      lock_time: "No lock",
      new_badge: false,
      top_pick: false,
      link: "https://vault.dyp.finance/vault-usdt",
    },
    {
      icon: "dai.svg",
      pair_name: "DAI",
      apy_percent: "8 - 21",
      tvl_usd: ``,
      lock_time: "No lock",
      new_badge: false,
      top_pick: false,
      link: "https://vault.dyp.finance/vault-dai",
    },
  ];

  const vaultNew = [
    {
      icon: "weth.svg",
      pair_name: "WETH",
      apy_percent: "1.9 - 3.7",
      tvl_usd: ``,
      lock_time: "No lock",
      top_pick: true,
      new_badge: false,
    },
    {
      icon: "wbtc.svg",
      pair_name: "WBTC",
      apy_percent: "1.6 - 3.4",
      tvl_usd: ``,
      lock_time: "No lock",
    },
    {
      icon: "usdc.svg",
      pair_name: "USDC",
      apy_percent: "2.1 - 4.2",
      tvl_usd: ``,
      lock_time: "No lock",
      new_badge: false,
      top_pick: false,
    },
    {
      icon: "usdt.svg",
      pair_name: "USDT",
      apy_percent: "2.2 - 4.9",
      tvl_usd: ``,
      lock_time: "No lock",
      new_badge: false,
      top_pick: false,
    },
    {
      icon: "dai.svg",
      pair_name: "DAI",
      apy_percent: "2.3 - 5.3",
      tvl_usd: ``,
      lock_time: "No lock",
      new_badge: false,
      top_pick: false,
    },
  ];

  const [farmingItem, setFarming] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [topPools, setTopPools] = useState([]);
  const [activePools, setActivePools] = useState([]);
  const [expiredDYPPools, setExpiredPools] = useState([]);
  const [listing, setListing] = useState(listType);
  const [cawsCard, setCawsCard] = useState([]);
  const [cawsCard2, setCawsCard2] = useState([]);
  const [landCard, setLandCard] = useState({});
  const [userPools, setuserPools] = useState([]);
  const [cawsLandCard, setCawsLandCard] = useState([]);
  const [customIndex, setCustomIndex] = useState(3);
  const [theBnbPool, setTheBnbPool] = useState({});
  const [tvlTotal, setTvlTotal] = useState();
  const [wbnbPrice, setWbnbPrice] = useState();
  const [selectedTab, setselectedTab] = useState("deposit");
  const [selectedBtn, setselectedBtn] = useState("flexible");
  const [selectedPool, setselectedPool] = useState([]);

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
      const dypData = eth_result2.data.stakingInfoDYPEth;
      const object2 = dypData.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd };
      });
      const expiredEth = dypIdyp.filter((item) => {
        return item.expired !== "No";
      });
      const activeEth = dypIdyp.filter((item) => {
        return item.expired !== "Yes";
      });

      const expiredEth2 = object2.filter((item) => {
        return item.expired !== "No";
      });
      const activeEth2 = object2.filter((item) => {
        return item.expired !== "Yes";
      });

      const allActiveEth = [...activeEth, ...activeEth2];
      const allExpireEth = [...expiredEth, ...expiredEth2];

      const sortedActive = allActiveEth.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });
      const sortedExpired = allExpireEth.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });

      setActivePools(sortedActive);
      setExpiredPools(sortedExpired);
      setTopPools([...dypIdyp, ...object2]);
      setCawsCard(eth_result.data.stakingInfoCAWS);
      setCawsCard2(eth_result.data.stakingInfoCAWS[0]);
      setLandCard(eth_result.data.stakingInfoLAND[0]);
      const land = eth_result.data.stakinginfoCAWSLAND[0];
      setCawsLandCard(land);
    }
  };

  const fetchBnbStaking = async () => {
    const bnb_result = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_bnb`)
      .catch((err) => {
        console.log(err);
      });

    const bnb_result2 = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_bnb_new`)
      .catch((err) => {
        console.log(err);
      });

    if (
      bnb_result &&
      bnb_result.status === 200 &&
      bnb_result2 &&
      bnb_result2.status === 200
    ) {
      const dypIdypBnb = bnb_result.data.stakingInfoDYPBnb.concat(
        bnb_result.data.stakingInfoiDYPBnb
      );

      const dypBnb = bnb_result2.data.stakingInfoDYPBnb;
      const object2 = dypBnb.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd };
      });

      const expiredBnb = dypIdypBnb.filter((item) => {
        return item.expired !== "No";
      });
      const activeBnb = dypIdypBnb.filter((item) => {
        return item.expired !== "Yes";
      });

      const activeBnb2 = object2.filter((item) => {
        return item.expired === "No";
      });

      const expiredBnb2 = object2.filter((item) => {
        return item.expired === "Yes";
      });

      const allActiveBnb = [...activeBnb, ...activeBnb2];
      const allExpireBnb = [...expiredBnb, ...expiredBnb2];

      const sortedActive = allActiveBnb.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });
      const sortedExpired = allExpireBnb.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });

      setActivePools(sortedActive);
      setExpiredPools(sortedExpired);
      setTopPools([...dypIdypBnb, ...object2]);
    }
  };
  const fetchAvaxStaking = async () => {
    const avax_result = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_avax`)
      .catch((err) => {
        console.log(err);
      });

    const avax_result2 = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_avax_new`)
      .catch((err) => {
        console.log(err);
      });

    if (
      avax_result &&
      avax_result.status === 200 &&
      avax_result2 &&
      avax_result2.status === 200
    ) {
      const dypIdypAvax = avax_result.data.stakingInfoiDYPAvax.concat(
        avax_result.data.stakingInfoDYPAvax
      );
      const dypAvax = avax_result2.data.stakingInfoDYPAvax;
      const object2 = dypAvax.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd };
      });
      const expiredAvax = dypIdypAvax.filter((item) => {
        return item.expired !== "No";
      });

      const activeAvax = dypIdypAvax.filter((item) => {
        return item.expired !== "Yes";
      });

      const expiredAvax2 = object2.filter((item) => {
        return item.expired !== "No";
      });

      const activeAvax2 = object2.filter((item) => {
        return item.expired !== "Yes";
      });

      const allActiveAvax = [...activeAvax, ...activeAvax2];
      const allExpireAvax = [...expiredAvax, ...expiredAvax2];

      const sortedActive = allActiveAvax.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });
      const sortedExpired = allExpireAvax.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });

      setActivePools(sortedActive);
      setExpiredPools(sortedExpired);
      setTopPools([...dypIdypAvax, ...object2]);
    }
  };

  const fetchEthFarming = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_eth_v2")
      .then((res) => {
        let temparray = Object.entries(res.data.the_graph_eth_v2.lp_data);
        let farming2 = [];

        temparray.map((item) => {
          farming2.push(item[1]);
        });

        const expiredFarmingEth = farming2.filter((item) => {
          return item.expired !== "No";
        });

        const sortedExpired = expiredFarmingEth.sort(function (a, b) {
          return b.tvl_usd - a.tvl_usd;
        });
        setTopPools(sortedExpired);

        setExpiredPools(sortedExpired);
        // setFarming(farming);
      })
      .catch((err) => console.error(err));
  };
  const fetchBscFarming = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_bsc_v2")
      .then((res) => {
        let temparray = Object.entries(res.data.the_graph_bsc_v2.lp_data);
        let bnbpool = temparray.filter((item) => {
          return (
            item.id ===
            "0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb-0x5bc3a80a1f2c4fb693d9dddcebbb5a1b5bb15d65"
          );
        });
        setTheBnbPool(bnbpool);
        let farming2 = [];
        temparray.map((item) => {
          farming2.push(item[1]);
        });
        const expiredFarmingBsc = farming2.filter((item) => {
          return item.expired !== "No";
        });

        const sortedExpired = expiredFarmingBsc.sort(function (a, b) {
          return b.tvl_usd - a.tvl_usd;
        });
        setTopPools(sortedExpired);

        setExpiredPools(sortedExpired);
      })
      .catch((err) => console.error(err));
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
        setWbnbPrice(res.data.the_graph_bsc_v2.usd_per_eth);
        setTheBnbPool(bnbpool[1]);
      })
      .catch((err) => console.error(err));
  };
  const fetchAvaxFarming = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_avax_v2")
      .then((res) => {
        let temparray = Object.entries(res.data.the_graph_avax_v2.lp_data);
        let farming2 = [];
        temparray.map((item) => {
          farming2.push(item[1]);
        });
        const expiredFarmingAvax = farming2.filter((item) => {
          return item.expired !== "No";
        });

        const sortedExpired = expiredFarmingAvax.sort(function (a, b) {
          return b.tvl_usd - a.tvl_usd;
        });
        setTopPools(sortedExpired);

        setExpiredPools(sortedExpired);
      })
      .catch((err) => console.error(err));
  };

  const [customPool, setCustomPool] = useState(pool);
  const [activeCard, setActiveCard] = useState();
  const [activeCardNFT, setActiveCardNFT] = useState();
  const [activeCardLandNFT, setActiveCardLandNFT] = useState();
  const [activeCardCawsLand, setActiveCardCawsLand] = useState();
  const [activeCard2, setActiveCard2] = useState();
  const [activeCard3, setActiveCard3] = useState();
  const [activeCard4, setActiveCard4] = useState();
  const [activeCard5, setActiveCard5] = useState();
  const [activeCard6, setActiveCard6] = useState();
  const [activeCard7, setActiveCard7] = useState();
  const [activeCard8, setActiveCard8] = useState();
  const [activeCard9, setActiveCard9] = useState();
  const [activeCard10, setActiveCard10] = useState();
  const [activeCard11, setActiveCard11] = useState();
  const [activeCard12, setActiveCard12] = useState();
  const [cardIndex, setcardIndex] = useState(0);
  const [cardIndexiDyp, setcardIndexiDyp] = useState(0);
  const [cardIndexavax30, setcardIndexavax30] = useState(0);
  const [cardIndexavaxiDyp, setcardIndexavaxiDyp] = useState(0);
  const [details, setDetails] = useState(0);

  const eth_address = "ETH";
  const wbnb_address = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
  const wbsc_address = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";

  const avax_address = "AVAX";

  const { rebase_factors, rebase_factorsavax, rebase_factorsbsc } = window;

  const stakeArray = [
    window.farming_new_1,
    window.farming_new_2,
    window.farming_new_3,
    window.farming_new_4,
    window.farming_new_5,
  ];

  const constantArray = [
    window.constant_staking_new5,
    window.constant_staking_new6,
    window.constant_staking_new7,
    window.constant_staking_new8,
    window.constant_staking_new9,
  ];

  const feeArray = [0.8, 0.4, 0.3, 0.3, 1.2];

  const stakeArrayiDYPActive = [
    window.constant_staking_idyp_3,
    window.constant_staking_idyp_4,
  ];

  const withdrawFeeiDyp = [1, 0, 0, 0];

  const lockarrayFarm = ["No Lock", 3, 30, 60, 90];

  const StakingNew1 = initStakingNew({
    token: window.token_new,
    finalApr: expiredDYPPools[cardIndex]?.apy_percent,
    staking: stakeArray[cardIndex],
    chainId: chainId,
    constant: constantArray[cardIndex],
    liquidity: eth_address,
    lp_symbol: "USD",
    reward: "30,000",
    lock: "3 Days",
    rebase_factor: rebase_factors[0],
    expiration_time: "14 December 2022",
    fee: feeArray[cardIndex],
    handleConnection: handleConnection,
    lockTime: lockarrayFarm[cardIndex],
    listType: listType,
    handleSwitchNetwork: handleSwitchNetwork,
  });

  const bscFarmArrayStake = [
    window.farming_newbsc_1,
    window.farming_newbsc_2,
    window.farming_newbsc_3,
    window.farming_newbsc_4,
    window.farming_newbsc_5,
  ];
  const bscFarmArrayConst = [
    window.constant_stakingnewbsc_new5,
    window.constant_stakingnewbsc_new6,
    window.constant_stakingnewbsc_new7,
    window.constant_stakingnewbsc_new8,
    window.constant_stakingnewbsc_new9,
  ];
  const bscFarmArrayFee = [0.3, 1.2, 0.3, 0.8, 0.4];
  const lockarrayFarmbsc = ["No Lock", 3, 30, 60, 90];

  const BscFarming = initBscFarming({
    staking: bscFarmArrayStake[cardIndex],
    token: window.token_newbsc,
    chainId: chainId,
    constant: bscFarmArrayConst[cardIndex],
    liquidity: wbsc_address,
    lp_symbol: "USD",
    reward: "30,000",
    lock: "3 Days",
    rebase_factor: rebase_factorsbsc[0],
    expiration_time: "19 November 2022",
    fee: bscFarmArrayFee[cardIndex],
    handleConnection: handleConnection,
    finalApr: expiredDYPPools[cardIndex]?.apy_percent,
    lockTime: lockarrayFarmbsc[cardIndex],
    listType: listType,
    handleSwitchNetwork: handleSwitchNetwork,
  });

  const lockarrayFarmAvax = ["No Lock", 3, 30, 60, 90];
  const feearrayFarmAvax = [0.3, 0.3, 1.2, 0.4, 0.8];

  const constantArrayFarmAvax = [
    window.constant_staking_newavax5,
    window.constant_staking_newavax6,
    window.constant_staking_newavax7,
    window.constant_staking_newavax8,
    window.constant_staking_newavax9,
  ];

  const stakeArrayFarmAvax = [
    window.farming_newavax_1,
    window.farming_newavax_2,
    window.farming_newavax_3,
    window.farming_newavax_4,
    window.farming_newavax_5,
  ];

  const { LP_IDs_V2Avax, LP_IDs_V2BNB } = window;

  const LP_IDAVAX_Array = [
    LP_IDs_V2Avax.wavax[0],
    LP_IDs_V2Avax.wavax[1],
    LP_IDs_V2Avax.wavax[2],
    LP_IDs_V2Avax.wavax[3],
    LP_IDs_V2Avax.wavax[4],
  ];

  const LP_IDBNB_Array = [
    LP_IDs_V2BNB.wbnb[0],
    LP_IDs_V2BNB.wbnb[1],
    LP_IDs_V2BNB.wbnb[2],
    LP_IDs_V2BNB.wbnb[3],
    LP_IDs_V2BNB.wbnb[4],
  ];

  const FarmAvax = initFarmAvax({
    token: window.token_newavax,
    staking: stakeArrayFarmAvax[cardIndex],
    constant: constantArrayFarmAvax[cardIndex],
    liquidity: wbnb_address,
    lp_symbol: "USD",
    reward: "30,000",
    lock: lockarrayFarmAvax[cardIndex],
    rebase_factor: rebase_factorsavax[0],
    expiration_time: "6 December 2022",
    fee: feearrayFarmAvax[cardIndex],
    coinbase: coinbase,
    lockTime: lockarrayFarmAvax[cardIndex],
    chainId: chainId,
    listType: listType,
    finalApr: expiredDYPPools[cardIndex]?.apy_percent,
    handleSwitchNetwork: handleSwitchNetwork,
  });

  //Buyback New

  const expirearrayStakeBscExpired = ["17 November 2022", "17 November 2022"];

  const stakearrayStakeBscExpired = [
    window.constant_stakingbsc_new13,
    window.constant_stakingbsc_new12,
  ];

  const stakearrayStakeBsciDyp2 = [
    window.constant_stakingidyp_6,
    window.constant_stakingidyp_5,
  ];

  const stakearrayStakeBsciDyp2Expired = [
    window.constant_stakingidyp_2,
    window.constant_stakingidyp_1,
  ];

  const expirearrayStakeBsciDyp2 = ["15 August 2023", "15 August 2023"];
  const expirearrayStakeBsciDyp2Expired = [
    "28 February 2023",
    "28 February 2023",
  ];

  const stakingarrayStakeAvax30 = [
    window.constant_staking_newavax2,
    window.constant_staking_newavax1,
  ];

  const StakeAvax30 = stakeAvax30({
    staking:
      expiredDYPPools[cardIndex]?.id ===
      "0x5566B51a1B7D5E6CAC57a68182C63Cb615cAf3f9"
        ? window.constant_staking_newavax2
        : window.constant_staking_newavax1,
    apr: expiredDYPPools[cardIndex]?.apy_percent,
    liquidity: avax_address,
    expiration_time: "6 December 2022",
    finalApr: expiredDYPPools[cardIndex]?.apy_performancefee,
    fee: expiredDYPPools[cardIndex]?.performancefee,
    coinbase: coinbase,
    chainId: chainId,
    lockTime:
      expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0] === "No"
        ? "No Lock"
        : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0],
    listType: listType,
    handleSwitchNetwork: handleSwitchNetwork,
  });

  const feeUarrayStakeAvaxiDyp = [0, 0.25, 0, 0.25];

  const expirearrayStakeAvaxiDyp = [
    "15 August 2023",
    "15 August 2023",
    "28 February 2023",
    "28 February 2023",
    "28 February 2023",
  ];

  const stakingarrayStakeAvaxiDypActive = [
    window.constant_staking_idypavax_6,
    window.constant_staking_idypavax_5,
  ];

  const stakingarrayStakeAvaxiDypExpired = [
    window.constant_staking_idypavax_2,
    window.constant_staking_idypavax_1,
  ];

  const stakeArrayStakeNew = [
    window.constant_staking_new2,
    window.constant_staking_new1,
  ];

  const stakeArrayiDYP = [
    window.constant_staking_idyp_2,
    window.constant_staking_idyp_1,
  ];

  const expirationArray = [
    "28 February 2023",
    "28 February 2023",
    "15 August 2023",
    "15 August 2023",
  ];

  // const ConstantStakingiDYP1Active = initConstantStakingiDYP();

  const vaultArrayNew = [
    window.vault_wethnew,
    window.vault_wbtcnew,
    window.vault_usdcnew,
    window.vault_usdtnew,
    window.vault_dainew,
  ];
  const tokenvaultArrayNew = [
    window.token_weth,
    window.token_wbtc,
    window.token_usdc,
    window.token_usdt,
    window.token_dai,
  ];
  const vaultplatformArrayNew = [3.08, 3.02, 3.94, 4.46, 4.8];
  const vaultdecimalsArrayNew = [18, 8, 6, 6, 18];
  const vaultsymbolArrayNew = ["WETH", "WBTC", "USDC", "USDT", "DAI"];

  const locktimeFarm = ["No Lock", "3 Days", "30 Days", "60 Days", "90 Days"];

  const fetchStakingData = async () => {
    if (topList === "Staking") {
      // setTopPools([]);
      if (chain !== "eth" && chain !== "bnb" && chain === "avax") {
        // setTimeout(() => {
        await fetchAvaxStaking();
        // }, 500);
      } else if (
        chain === "eth" &&
        chain !== "bnb" &&
        chain !== "avax" &&
        topList === "Staking"
      ) {
        // setTimeout(() => {
        await fetchEthStaking();
        // }, 500);
      } else if (chain !== "eth" && chain === "bnb" && chain !== "avax") {
        // setTimeout(() => {
        await fetchBnbStaking();
        // }, 500);
      }
    }
  };

  useEffect(() => {
    setActiveCard();
    setActiveCard2();
    setActiveCard3();
    setActiveCard4();
    setActiveCard5();
    setActiveCard6();
    setActiveCard7();
    setActiveCard8();
    setActiveCard9();
    setActiveCard10();
    setActiveCard11();
    setActiveCard12();
    setcardIndex();
    setcardIndexiDyp();
    setcardIndexavax30();
    setcardIndexavaxiDyp();
    setDetails();
    setActiveCardNFT();
    setActiveCardLandNFT();
    setActiveCardCawsLand();
  }, [topList, chain]);

  useEffect(() => {
    if (topList === "Staking" && chain === "eth") {
      setCustomIndex(2);
    } else {
      setCustomIndex(3);
    }
    if (customPool !== null) {
      if (routeOption === "Staking" && chain === "eth") {
        setDetails(0);
        setActiveCard(topPools[0]);
        handleCardIndexStake(0);
        handleCardIndexStake30(0);
        handleCardIndexStakeiDyp(0);
      }
      if (routeOption === "Staking" && chain === "bnb") {
        setDetails(1);
        setActiveCard(topPools[1]);
        handleCardIndexStake(1);
        handleCardIndexStake30(1);
        handleCardIndexStakeiDyp(1);
      }
      if (routeOption === "Staking" && chain === "avax") {
        setDetails(2);
        setActiveCard(topPools[2]);
        handleCardIndexStake(2);
        handleCardIndexStake30(2);
        handleCardIndexStakeiDyp(2);
      }

      if (
        routeOption === "Farming" &&
        chain === "eth" &&
        expiredPools === true
      ) {
        setDetails(4);
        setActiveCard2(topPools[4]);
        handleCardIndexStake(4);
        handleCardIndexStake30(4);
        handleCardIndexStakeiDyp(4);
      }
      if (
        routeOption === "Farming" &&
        chain === "bnb" &&
        expiredPools === true
      ) {
        setDetails(3);
        setActiveCard2(topPools[3]);
        handleCardIndexStake(3);
        handleCardIndexStake30(3);
        handleCardIndexStakeiDyp(3);
      }
      if (
        routeOption === "Farming" &&
        chain === "avax" &&
        expiredPools === true
      ) {
        setDetails(4);
        setActiveCard2(topPools[4]);
        handleCardIndexStake(4);
        handleCardIndexStake30(4);
        handleCardIndexStakeiDyp(4);
      }
    } else {
      setDetails();
      setActiveCard(null);
    }

    setCustomPool(null);

    if (networkId === "1" && topList === "Farming" && expiredPools === true) {
      fetchEthFarming();
    } else if (
      networkId === "56" &&
      topList === "Farming" &&
      expiredPools === true
    ) {
      fetchBscFarming();
    } else if (
      networkId === "43114" &&
      topList === "Farming" &&
      expiredPools === true
    ) {
      fetchAvaxFarming();
    }
    setShowDetails(false);
    setListing(listType);
    fetchBnbPool();
  }, [
    topList,
    listType,
    networkId,
    expiredPools,
    customChain,
    routeOption,
    chain,
  ]);

  useEffect(() => {
    if (topList === "Vault" && chainId === "1" && expiredPools === true) {
      setTopPools(vault);
      setExpiredPools(vault);
    } else if (
      topList === "Vault" &&
      chainId === "1" &&
      expiredPools === false
    ) {
      setTopPools(vaultNew);
      setActivePools(vaultNew);
    }
  }, [topList, chainId, chain, coinbase, expiredPools]);

  useEffect(() => {
    fetchUserPools();
    setActiveCard();
    fetchStakingData();
  }, [topList, chain, coinbase, networkId, chainId, expiredPools, listType]);

  // useEffect(() => {
  //   console.log("Helloooo");
  //   setActiveCard(null)

  //  setDetails(null)
  // }, [topList]);

  const handleCardIndexStake = (index) => {
    if (topList === "Staking") {
      if (index >= 3) {
        const newIndex = index - 3;
        setcardIndexiDyp(newIndex);
        setcardIndex(index);
      } else setcardIndex(index);
    } else setcardIndex(index);
  };

  const handleCardIndexStake30 = (index) => {
    if (topList === "Staking" && chain === "avax") {
      if (index >= 2) {
        const newIndex = index - 2;
        setcardIndexavax30(newIndex);
        setcardIndex(index);
      } else setcardIndex(index);
    } else setcardIndex(index);
  };

  const handleCardIndexStakeiDyp = (index) => {
    if (topList === "Staking" && chain === "avax") {
      if (index >= 2) {
        const newIndex = index - 2;
        setcardIndexavaxiDyp(newIndex);
        setcardIndex(index);
      } else setcardIndex(index);
    } else setcardIndex(index);
  };

  useEffect(() => {
    if (
      (topList === "Farming" && chain === "bnb" && expiredPools === false) ||
      (topList === "Farming" && chain === "avax" && expiredPools === false)
    ) {
      setTopPools(["1", "2"]);
      setActivePools([]);
    }
  }, [topList, chain, expiredPools]);

  return (
    <>
      <div className={`row w-100 justify-content-center gap-4`}>
        {listing === "table" ? (
          windowSize.width > 1300 ? (
            <div className="px-0">
              <>
                <div className="top-picks-container">
                  {activePools.slice(0, 3).map((pool, index) => (
                    <TopPoolsCard
                      key={index}
                      chain={chain}
                      top_pick={pool.top_pick}
                      tokenName={pool.pair_name}
                      apr={pool.apy_percent + "%"}
                      tvl={
                        pool.tvl_usd === "--"
                          ? pool.tvl_usd
                          : "$" + getFormattedNumber(pool.tvl_usd)
                      }
                      lockTime={
                        pool.lock_time ? pool.lock_time : locktimeFarm[index]
                      }
                      tokenLogo={
                        pool.icon
                          ? pool.icon
                          : pool.pair_name === "DYP"
                          ? "dyplogo.svg"
                          : "idypius.svg"
                      }
                      onShowDetailsClick={() => {
                        setActiveCard(topPools[index]);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCardCawsLand(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(index);
                        handleCardIndexStake30(index);
                        handleCardIndexStakeiDyp(index);
                        setDetails(index);
                        setselectedPool(pool);
                        setShowDetails(true);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === index ? true : false}
                      isNewPool={pool.new_pool === "Yes" ? true : false}
                      isStaked={
                        userPools.length > 0
                          ? userPools.find(
                              (obj) => obj.contract_address === pool.id
                            )
                            ? true
                            : false
                          : false
                      }
                      expired={false}
                      network={chainId}
                      isPremium={isPremium}
                    />
                  ))}

                  {topList === "Farming" && chain === "bnb" && (
                    <TopPoolsCard
                      chain={chain}
                      top_pick={false}
                      tokenName={"WBNB"}
                      apr={`${getFormattedNumber(theBnbPool.apy_percent, 0)}%`}
                      tvl={`$${getFormattedNumber(theBnbPool.tvl_usd, 2)}`}
                      lockTime={"3 Days"}
                      tokenLogo={"bnb.svg"}
                      onShowDetailsClick={() => {
                        setActiveCard(topPools[0]);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCardCawsLand(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(0);
                        handleCardIndexStake30(0);
                        handleCardIndexStakeiDyp(0);
                        setDetails(0);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === 0 ? true : false}
                      isNewPool={true}
                      isStaked={false}
                      expired={false}
                      network={chainId}
                      isPremium={isPremium}
                    />
                  )}
                </div>

                {activeCard && topList === "Farming" ? (
                  chain === "eth" ? (
                    <></>
                  ) : chain === "bnb" ? (
                    <BscFarmingFunc
                      is_wallet_connected={isConnected}
                      wbnbPrice={wbnbPrice}
                      coinbase={coinbase}
                      latestTvl={theBnbPool.tvl_usd}
                      the_graph_result={the_graph_resultbsc}
                      lp_id={LP_IDBNB_Array[cardIndex]}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      expired={false}
                      handleSwitchNetwork={handleSwitchNetwork}
                      liquidity={wbsc_address}
                      constant={window.farming_activebsc_1}
                      staking={window.constant_staking_newbscactive1}
                      token={window.token_newbsc}
                      lp_symbol={"USD"}
                      lock="3 Days"
                      rebase_factor={1}
                      expiration_time={"18 July 2024"}
                      fee="0.4"
                      finalApr={activePools[cardIndex]?.apy_percent}
                      latestApr={theBnbPool.apy_percent}
                      lockTime={3}
                      listType={listType}
                    />
                  ) : null
                ) : activeCard && topList === "Vault" && chain === "eth" ? (
                  <Vault
                    vault={vaultArrayNew[cardIndex]}
                    token={tokenvaultArrayNew[cardIndex]}
                    platformTokenApyPercent={vaultplatformArrayNew[cardIndex]}
                    UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex]}
                    UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex]}
                    expiration_time={"1 August 2024"}
                    coinbase={coinbase}
                    lockTime={"No Lock"}
                    handleConnection={handleConnection}
                    chainId={chainId}
                    listType={listType}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    isConnected={isConnected}
                    the_graph_result={the_graph_result}
                  />
                ) : (
                  <></>
                )}
              </>
              <div
                className="top-picks-container"
                style={{ marginTop: "25px" }}
              >
                {activePools.slice(3, 6).map((pool, index) => (
                  <TopPoolsCard
                    display={
                      pool.expired ? (pool.expired === "Yes" ? "none" : "") : ""
                    }
                    key={index}
                    chain={chain}
                    top_pick={pool.top_pick}
                    tokenName={
                      pool.tokenName
                        ? pool.tokenName
                        : pool.pair_name
                        ? pool.pair_name
                        : ""
                    }
                    apr={
                      pool.apy_percent ? pool.apy_percent + "%" : pool.apy + "%"
                    }
                    tvl={
                      pool.tvl_usd === "--"
                        ? pool.tvl_usd
                        : "$" + getFormattedNumber(pool.tvl_usd)
                    }
                    lockTime={
                      pool.lock_time ? pool.lock_time : locktimeFarm[index + 3]
                    }
                    tokenLogo={
                      pool.icon
                        ? pool.icon
                        : pool.pair_name === "DYP"
                        ? "dyplogo.svg"
                        : "idypius.svg"
                    }
                    onShowDetailsClick={() => {
                      setActiveCard(null);
                      setActiveCard2(topPools[index + 3]);
                      setActiveCard3(null);
                      setActiveCardNFT(false);
                      setActiveCardLandNFT(false);
                      handleCardIndexStake(index + 3);
                      handleCardIndexStake30(index + 3);
                      handleCardIndexStakeiDyp(index + 3);
                      setDetails(index + 3);
                      setselectedPool(pool);
                      setShowDetails(true);
                    }}
                    onHideDetailsClick={() => {
                      setActiveCard2(null);
                      setDetails();
                    }}
                    cardType={topList}
                    details={details === index + 3 ? true : false}
                    isNewPool={pool.new_pool === "Yes" ? true : false}
                    isStaked={
                      userPools.length > 0
                        ? userPools.find(
                            (obj) => obj.contract_address === pool.id
                          )
                          ? true
                          : false
                        : false
                    }
                    expired={false}
                    network={chainId}
                    isPremium={isPremium}
                  />
                ))}
              </div>
              {
                // activeCard2 &&
                // topList === "Staking" &&
                // chain === "avax" &&
                // activePools[cardIndex]?.id ===
                //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                //   <StakeAvaxIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idypavax_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={avax_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :
                // activeCard2 &&
                // topList === "Staking" &&
                // activePools[cardIndex]?.id ===
                //   "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                // chain === "eth" ? (
                //   <StakeDypiusEth
                //     staking={window.constant_staking_dypius_eth1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                // : activeCard2 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "bnb" ? (
                //   <StakeDypiusBsc
                //     staking={window.constant_staking_dypius_bsc1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                // : activeCard2 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "avax" ? (
                //   <StakeDypiusAvax
                //     staking={window.constant_staking_dypius_avax1}
                //     apr={activePools[cardIndex]?.apy_percent}
                //     liquidity={avax_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                activeCard2 &&
                activePools[cardIndex]?.id ===
                  "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                topList === "Staking" &&
                chain === "bnb" ? (
                  <StakeBscIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_stakingidyp_7}
                    listType={listType}
                    finalApr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_performancefee
                        : expiredDYPPools[cardIndex]?.apy_performancefee
                    }
                    apr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_percent
                        : expiredDYPPools[cardIndex]?.apy_percent
                    }
                    liquidity={wbsc_address}
                    expiration_time={"18 July 2024"}
                    other_info={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : expiredDYPPools[cardIndex]?.expired === "Yes"
                          ? true
                          : false
                        : false
                    }
                    fee_s={
                      expiredPools === false
                        ? activePools[cardIndex]?.performancefee
                        : expiredDYPPools[cardIndex]?.performancefee
                    }
                    fee_u={0}
                    lockTime={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                            "No"
                            ? "No Lock"
                            : parseInt(
                                activePools[cardIndex]?.lock_time?.split(" ")[0]
                              )
                          : expiredDYPPools[cardIndex]?.lock_time?.split(
                              " "
                            )[0] === "No"
                          ? "No Lock"
                          : parseInt(
                              expiredDYPPools[cardIndex]?.lock_time?.split(
                                " "
                              )[0]
                            )
                        : "No Lock"
                    }
                  />
                ) : //  : activeCard2 &&
                //   topList === "Staking" &&
                //   chain === "eth" &&
                //   activePools[cardIndex]?.id ===
                //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                //   <InitConstantStakingiDYP
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     lp_id={lp_id[cardIndex]}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idyp_5}
                //     listType={listType}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={withdrawFeeiDyp[cardIndex]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // )
                activeCard2 && topList === "Vault" && chain === "eth" ? (
                  <Vault
                    vault={vaultArrayNew[cardIndex]}
                    token={tokenvaultArrayNew[cardIndex]}
                    platformTokenApyPercent={vaultplatformArrayNew[cardIndex]}
                    UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex]}
                    UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex]}
                    expiration_time={"1 August 2024"}
                    coinbase={coinbase}
                    lockTime={"No Lock"}
                    handleConnection={handleConnection}
                    chainId={chainId}
                    listType={listType}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    isConnected={isConnected}
                    the_graph_result={the_graph_result}
                  />
                ) : (
                  <></>
                )
              }
              <div
                className="top-picks-container"
                style={{ marginTop: "25px" }}
              >
                {activePools.slice(6, 9).map((pool, index) => (
                  <TopPoolsCard
                    network={chainId}
                    display={
                      pool.expired ? (pool.expired === "Yes" ? "none" : "") : ""
                    }
                    key={index}
                    chain={chain}
                    top_pick={pool.top_pick}
                    tokenName={
                      pool.tokenName
                        ? pool.tokenName
                        : pool.pair_name
                        ? pool.pair_name
                        : ""
                    }
                    apr={pool.apy_percent + "%"}
                    tvl={
                      pool.tvl_usd === "--"
                        ? pool.tvl_usd
                        : "$" + getFormattedNumber(pool.tvl_usd)
                    }
                    lockTime={
                      pool.lock_time ? pool.lock_time : locktimeFarm[index]
                    }
                    tokenLogo={
                      pool.icon
                        ? pool.icon
                        : pool.pair_name === "iDYP"
                        ? "idypius.svg"
                        : "dyplogo.svg"
                    }
                    onShowDetailsClick={() => {
                      setActiveCard(null);
                      setActiveCard2(null);
                      setActiveCard3(topPools[index + 6]);
                      setActiveCardNFT(false);
                      setActiveCardLandNFT(false);
                      handleCardIndexStake(index + 6);
                      handleCardIndexStake30(index + 6);
                      handleCardIndexStakeiDyp(index + 6);
                      setDetails(index + 6);
                      setselectedPool(pool);
                      setShowDetails(true);
                    }}
                    onHideDetailsClick={() => {
                      setActiveCard3(null);
                      setDetails();
                    }}
                    cardType={topList}
                    details={details === index + 6 ? true : false}
                    isNewPool={pool.new_pool === "Yes" ? true : false}
                    isStaked={
                      userPools.length > 0
                        ? userPools.find(
                            (obj) => obj.contract_address === pool.id
                          )
                          ? true
                          : false
                        : false
                    }
                    expired={false}
                    isPremium={isPremium}
                  />
                ))}
              </div>
              {
                // activeCard3 &&
                // topList === "Staking" &&
                // chain === "avax" &&
                // activePools[cardIndex]?.id ===
                //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                //   <StakeAvaxIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idypavax_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={avax_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :
                // activeCard3 &&
                // topList === "Staking" &&
                // activePools[cardIndex]?.id ===
                //   "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                // chain === "eth" ? (
                //   <StakeDypiusEth
                //     staking={window.constant_staking_dypius_eth1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                // : activeCard3 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "bnb" ? (
                //   <StakeDypiusBsc
                //     staking={window.constant_staking_dypius_bsc1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                //  : activeCard3 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "avax" ? (
                //   <StakeDypiusAvax
                //     staking={window.constant_staking_dypius_avax1}
                //     apr={activePools[cardIndex]?.apy_percent}
                //     liquidity={avax_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                activeCard3 &&
                activePools[cardIndex]?.id ===
                  "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                topList === "Staking" &&
                chain === "bnb" ? (
                  <StakeBscIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_stakingidyp_7}
                    listType={listType}
                    finalApr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_performancefee
                        : expiredDYPPools[cardIndex]?.apy_performancefee
                    }
                    apr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_percent
                        : expiredDYPPools[cardIndex]?.apy_percent
                    }
                    liquidity={wbsc_address}
                    expiration_time={"18 July 2024"}
                    other_info={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : expiredDYPPools[cardIndex]?.expired === "Yes"
                          ? true
                          : false
                        : false
                    }
                    fee_s={
                      expiredPools === false
                        ? activePools[cardIndex]?.performancefee
                        : expiredDYPPools[cardIndex]?.performancefee
                    }
                    fee_u={0}
                    lockTime={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                            "No"
                            ? "No Lock"
                            : parseInt(
                                activePools[cardIndex]?.lock_time?.split(" ")[0]
                              )
                          : expiredDYPPools[cardIndex]?.lock_time?.split(
                              " "
                            )[0] === "No"
                          ? "No Lock"
                          : parseInt(
                              expiredDYPPools[cardIndex]?.lock_time?.split(
                                " "
                              )[0]
                            )
                        : "No Lock"
                    }
                  />
                ) : (
                  //  : activeCard3 &&
                  //   topList === "Staking" &&
                  //   chain === "eth" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                  //   <InitConstantStakingiDYP
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_result}
                  //     lp_id={lp_id[cardIndex]}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idyp_5}
                  //     listType={listType}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={eth_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={withdrawFeeiDyp[cardIndex]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // )
                  <></>
                )
              }
              <div
                className="top-picks-container"
                style={{ marginTop: activePools.length > 9 && "25px" }}
              >
                {activePools.slice(9, activePools.length).map((pool, index) => (
                  <TopPoolsCard
                    network={chainId}
                    display={
                      pool.expired ? (pool.expired === "Yes" ? "none" : "") : ""
                    }
                    key={index}
                    chain={chain}
                    top_pick={pool.top_pick}
                    tokenName={
                      pool.tokenName
                        ? pool.tokenName
                        : pool.pair_name
                        ? pool.pair_name
                        : ""
                    }
                    apr={pool.apy + "%"}
                    tvl={
                      pool.tvl_usd === "--"
                        ? pool.tvl_usd
                        : "$" + getFormattedNumber(pool.tvl_usd)
                    }
                    lockTime={
                      pool.lock_time ? pool.lock_time : locktimeFarm[index]
                    }
                    tokenLogo={
                      pool.icon
                        ? pool.icon
                        : pool.pair_name === "iDYP"
                        ? "idypius.svg"
                        : "dyplogo.svg"
                    }
                    onShowDetailsClick={() => {
                      setActiveCard(null);
                      setActiveCard2(null);
                      setActiveCard3(null);
                      setActiveCard4(topPools[index + 9]);
                      setActiveCardNFT(false);
                      setActiveCardLandNFT(false);
                      handleCardIndexStake(index + 9);
                      handleCardIndexStake30(index + 9);
                      handleCardIndexStakeiDyp(index + 9);
                      setDetails(index + 9);
                      setselectedPool(pool);
                      setShowDetails(true);
                    }}
                    onHideDetailsClick={() => {
                      setActiveCard4(null);
                      setDetails();
                    }}
                    cardType={topList}
                    details={details === index + 9 ? true : false}
                    isNewPool={pool.new_pool === "Yes" ? true : false}
                    expired={false}
                    isStaked={
                      userPools.length > 0
                        ? userPools.find(
                            (obj) => obj.contract_address === pool.id
                          )
                          ? true
                          : false
                        : false
                    }
                    isPremium={isPremium}
                  />
                ))}
              </div>
              {
                // activeCard4 &&
                // topList === "Staking" &&
                // chain === "avax" &&
                // activePools[cardIndex]?.id ===
                //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                //   <StakeAvaxIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idypavax_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={avax_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :
                // activeCard4 &&
                // topList === "Staking" &&
                // activePools[cardIndex]?.id ===
                //   "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                // chain === "eth" ? (
                //   <StakeDypiusEth
                //     staking={window.constant_staking_dypius_eth1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                // : activeCard4 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "bnb" ? (
                //   <StakeDypiusBsc
                //     staking={window.constant_staking_dypius_bsc1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )

                // : activeCard4 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "avax" ? (
                //   <StakeDypiusAvax
                //     staking={window.constant_staking_dypius_avax1}
                //     apr={activePools[cardIndex]?.apy_percent}
                //     liquidity={avax_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                activeCard4 &&
                activePools[cardIndex]?.id ===
                  "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                topList === "Staking" &&
                chain === "bnb" ? (
                  <StakeBscIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_stakingidyp_7}
                    listType={listType}
                    finalApr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_performancefee
                        : expiredDYPPools[cardIndex]?.apy_performancefee
                    }
                    apr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_percent
                        : expiredDYPPools[cardIndex]?.apy_percent
                    }
                    liquidity={wbsc_address}
                    expiration_time={"18 July 2024"}
                    other_info={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : expiredDYPPools[cardIndex]?.expired === "Yes"
                          ? true
                          : false
                        : false
                    }
                    fee_s={
                      expiredPools === false
                        ? activePools[cardIndex]?.performancefee
                        : expiredDYPPools[cardIndex]?.performancefee
                    }
                    fee_u={0}
                    lockTime={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                            "No"
                            ? "No Lock"
                            : parseInt(
                                activePools[cardIndex]?.lock_time?.split(" ")[0]
                              )
                          : expiredDYPPools[cardIndex]?.lock_time?.split(
                              " "
                            )[0] === "No"
                          ? "No Lock"
                          : parseInt(
                              expiredDYPPools[cardIndex]?.lock_time?.split(
                                " "
                              )[0]
                            )
                        : "No Lock"
                    }
                  />
                ) : //  : activeCard4 &&
                //   topList === "Staking" &&
                //   chain === "eth" &&
                //   activePools[cardIndex]?.id ===
                //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                //   <InitConstantStakingiDYP
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     lp_id={lp_id[cardIndex]}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idyp_5}
                //     listType={listType}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={withdrawFeeiDyp[cardIndex]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // )
                activeCard4 &&
                  cardIndex >= 0 &&
                  topList === "Staking" &&
                  chain === "eth" ? (
                  <InitConstantStakingiDYP
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    lp_id={lp_id[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                  />
                ) : activeCard4 &&
                  cardIndex >= 5 &&
                  topList === "Staking" &&
                  chain === "bnb" ? (
                  <StakeBscIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={
                      expiredPools === false
                        ? stakearrayStakeBsciDyp2[cardIndex - 2]
                        : stakearrayStakeBsciDyp2Expired[cardIndex - 3]
                    }
                    listType={listType}
                    finalApr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_performancefee
                        : expiredDYPPools[cardIndex]?.apy_performancefee
                    }
                    apr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_percent
                        : expiredDYPPools[cardIndex]?.apy_percent
                    }
                    liquidity={wbsc_address}
                    expiration_time={
                      expiredPools === false
                        ? expirearrayStakeBsciDyp2[cardIndex - 2]
                        : expirearrayStakeBsciDyp2Expired[cardIndex - 3]
                    }
                    other_info={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : expiredDYPPools[cardIndex]?.expired === "Yes"
                          ? true
                          : false
                        : false
                    }
                    fee_s={
                      expiredPools === false
                        ? activePools[cardIndex]?.performancefee
                        : expiredDYPPools[cardIndex]?.performancefee
                    }
                    fee_u={0}
                    lockTime={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                            "No"
                            ? "No Lock"
                            : parseInt(
                                activePools[cardIndex]?.lock_time?.split(" ")[0]
                              )
                          : expiredDYPPools[cardIndex]?.lock_time?.split(
                              " "
                            )[0] === "No"
                          ? "No Lock"
                          : parseInt(
                              expiredDYPPools[cardIndex]?.lock_time?.split(
                                " "
                              )[0]
                            )
                        : "No Lock"
                    }
                  />
                ) : (
                  <></>
                )
              }
            </div>
          ) : windowSize.width > 786 ? (
            <div className="px-0">
              <div className="top-picks-container">
                {activePools.slice(0, 2).map((pool, index) => (
                  <TopPoolsCard
                    network={chainId}
                    display={
                      pool.expired ? (pool.expired === "Yes" ? "none" : "") : ""
                    }
                    key={index}
                    chain={chain}
                    top_pick={pool.top_pick}
                    tokenName={
                      pool.tokenName
                        ? pool.tokenName
                        : pool.pair_name
                        ? pool.pair_name
                        : ""
                    }
                    apr={pool.apy_percent + "%"}
                    tvl={
                      pool.tvl_usd === "--"
                        ? pool.tvl_usd
                        : "$" + getFormattedNumber(pool.tvl_usd)
                    }
                    lockTime={
                      pool.lockTime
                        ? pool.lockTime
                        : pool.lock_time
                        ? pool.lock_time
                        : locktimeFarm[index]
                    }
                    tokenLogo={
                      pool.icon
                        ? pool.icon
                        : pool.pair_name === "iDYP"
                        ? "idypius.svg"
                        : "dyplogo.svg"
                    }
                    onShowDetailsClick={() => {
                      setActiveCard(topPools[index]);
                      setActiveCard2(null);
                      setActiveCard3(null);
                      setActiveCard4(null);
                      setActiveCard5(null);
                      setActiveCard6(null);
                      setActiveCardCawsLand(null);

                      setActiveCardNFT(false);
                      setActiveCardLandNFT(false);
                      handleCardIndexStake(index);
                      handleCardIndexStake30(index);
                      handleCardIndexStakeiDyp(index);
                      setDetails(index);
                      setselectedPool(pool);
                      setShowDetails(true);
                    }}
                    onHideDetailsClick={() => {
                      setActiveCard(null);
                      setDetails();
                    }}
                    cardType={topList}
                    details={details === index ? true : false}
                    isNewPool={pool.new_pool === "Yes" ? true : false}
                    isStaked={
                      userPools.length > 0
                        ? userPools.find(
                            (obj) => obj.contract_address === pool.id
                          )
                          ? true
                          : false
                        : false
                    }
                    expired={false}
                    isPremium={isPremium}
                  />
                ))}
                {topList === "Farming" && chain === "bnb" && (
                  <TopPoolsCard
                    chain={chain}
                    top_pick={false}
                    tokenName={"WBNB"}
                    apr={`${getFormattedNumber(theBnbPool.apy_percent, 0)}%`}
                    tvl={`$${getFormattedNumber(theBnbPool.tvl_usd, 2)}`}
                    lockTime={"3 Days"}
                    tokenLogo={"bnb.svg"}
                    onShowDetailsClick={() => {
                      setActiveCard(topPools[0]);
                      setActiveCard2(null);
                      setActiveCard3(null);
                      setActiveCard4(null);
                      setActiveCardCawsLand(null);
                      setActiveCardNFT(false);
                      setActiveCardLandNFT(false);
                      handleCardIndexStake(0);
                      handleCardIndexStake30(0);
                      handleCardIndexStakeiDyp(0);

                      setDetails(0);
                    }}
                    onHideDetailsClick={() => {
                      setActiveCard(null);
                      setDetails();
                    }}
                    cardType={topList}
                    details={details === 0 ? true : false}
                    isNewPool={true}
                    isStaked={false}
                    expired={false}
                    network={chainId}
                    isPremium={isPremium}
                  />
                )}
                {topList === "Farming" && chain === "avax" && (
                  <TopPoolsCard
                    chain={chain}
                    top_pick={false}
                    tokenName={"WAVAX"}
                    apr={"8%"}
                    tvl={"$60,000"}
                    lockTime={"3 Days"}
                    tokenLogo={"wavax.svg"}
                    onShowDetailsClick={() => {
                      setActiveCard(topPools[0]);
                      setActiveCard2(null);
                      setActiveCard3(null);
                      setActiveCard4(null);
                      setActiveCardCawsLand(null);
                      setActiveCardNFT(false);
                      setActiveCardLandNFT(false);
                      handleCardIndexStake(0);
                      handleCardIndexStake30(0);
                      handleCardIndexStakeiDyp(0);
                      setDetails(0);
                    }}
                    onHideDetailsClick={() => {
                      setActiveCard(null);
                      setDetails();
                    }}
                    cardType={topList}
                    details={details === 0 ? true : false}
                    isNewPool={true}
                    isStaked={false}
                    expired={false}
                    network={chainId}
                    isPremium={isPremium}
                  />
                )}
              </div>

              {activeCard &&
              topList === "Staking" &&
              cardIndex === 0 &&
              chain === "eth" ? (
                <StakeNewEth
                  staking={window.constant_staking_newi3}
                  apr={
                    expiredPools === false
                      ? activePools[cardIndex]?.apy_percent
                      : expiredDYPPools[cardIndex]?.apy_percent
                  }
                  liquidity={eth_address}
                  expiration_time={"11 January 2024"}
                  finalApr={
                    expiredPools === false
                      ? activePools[cardIndex]?.apy_performancefee
                      : expiredDYPPools[cardIndex]?.apy_performancefee
                  }
                  fee_s={0}
                  lockTime={
                    cardIndex !== undefined
                      ? expiredPools === false
                        ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                          "No"
                          ? "No Lock"
                          : activePools[cardIndex]?.lock_time?.split(" ")[0]
                        : expiredDYPPools[cardIndex]?.lock_time?.split(
                            " "
                          )[0] === "No"
                        ? "No Lock"
                        : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                      : "No Lock"
                  }
                  lp_id={LP_IDBNB_Array[cardIndex]}
                  listType={listType}
                  other_info={
                    cardIndex !== undefined
                      ? expiredPools === false
                        ? activePools[cardIndex]?.expired === "Yes"
                          ? true
                          : false
                        : expiredDYPPools[cardIndex]?.expired === "Yes"
                        ? true
                        : false
                      : false
                  }
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_result}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={false}
                  referrer={referrer}
                  totalTvl={activePools[cardIndex].tvl_usd}
                />
              ) : //  : activeCard &&
              //   topList === "Staking" &&
              //   activePools[cardIndex]?.id ===
              //     "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
              //   chain === "eth" ? (
              //   <StakeDypiusEth
              //     staking={window.constant_staking_dypius_eth1}
              //     apr={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.apy_percent
              //         : expiredDYPPools[cardIndex]?.apy_percent
              //     }
              //     liquidity={eth_address}
              //     expiration_time={"09 November 2024"}
              //     finalApr={activePools[cardIndex]?.apy_performancefee}
              //     lockTime={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
              //             "No"
              //             ? "No Lock"
              //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(
              //               " "
              //             )[0] === "No"
              //           ? "No Lock"
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
              //         : "No Lock"
              //     }
              //     listType={listType}
              //     other_info={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.expired === "Yes"
              //             ? true
              //             : false
              //           : expiredDYPPools[cardIndex]?.expired === "Yes"
              //           ? true
              //           : false
              //         : false
              //     }
              //     fee={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.performancefee
              //         : expiredDYPPools[cardIndex]?.performancefee
              //     }
              //     is_wallet_connected={isConnected}
              //     coinbase={coinbase}
              //     the_graph_result={the_graph_result}
              //     chainId={chainId}
              //     handleConnection={handleConnection}
              //     handleSwitchNetwork={handleSwitchNetwork}
              //     expired={false}
              //     referrer={referrer}
              //   />
              // )
              // : activeCard &&
              //   topList === "Staking" &&
              //   activePools[cardIndex]?.id ===
              //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
              //   chain === "bnb" ? (
              //   <StakeDypiusBsc
              //     staking={window.constant_staking_dypius_bsc1}
              //     apr={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.apy_percent
              //         : expiredDYPPools[cardIndex]?.apy_percent
              //     }
              //     liquidity={wbsc_address}
              //     expiration_time={"09 November 2024"}
              //     finalApr={activePools[cardIndex]?.apy_performancefee}
              //     lockTime={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
              //             "No"
              //             ? "No Lock"
              //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(
              //               " "
              //             )[0] === "No"
              //           ? "No Lock"
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
              //         : "No Lock"
              //     }
              //     listType={listType}
              //     other_info={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.expired === "Yes"
              //             ? true
              //             : false
              //           : expiredDYPPools[cardIndex]?.expired === "Yes"
              //           ? true
              //           : false
              //         : false
              //     }
              //     fee={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.performancefee
              //         : expiredDYPPools[cardIndex]?.performancefee
              //     }
              //     is_wallet_connected={isConnected}
              //     coinbase={coinbase}
              //     the_graph_result={the_graph_resultbsc}
              //     chainId={chainId}
              //     handleConnection={handleConnection}
              //     handleSwitchNetwork={handleSwitchNetwork}
              //     expired={false}
              //     referrer={referrer}
              //   />
              // )
              // : activeCard &&
              //   topList === "Staking" &&
              //   activePools[cardIndex]?.id ===
              //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
              //   chain === "avax" ? (
              //   <StakeDypiusAvax
              //     staking={window.constant_staking_dypius_avax1}
              //     apr={activePools[cardIndex]?.apy_percent}
              //     liquidity={avax_address}
              //     expiration_time={"09 November 2024"}
              //     finalApr={activePools[cardIndex]?.apy_performancefee}
              //     lockTime={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
              //             "No"
              //             ? "No Lock"
              //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(
              //               " "
              //             )[0] === "No"
              //           ? "No Lock"
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
              //         : "No Lock"
              //     }
              //     listType={listType}
              //     other_info={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.expired === "Yes"
              //             ? true
              //             : false
              //           : expiredDYPPools[cardIndex]?.expired === "Yes"
              //           ? true
              //           : false
              //         : false
              //     }
              //     fee_s={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.performancefee
              //         : expiredDYPPools[cardIndex]?.performancefee
              //     }
              //     is_wallet_connected={isConnected}
              //     coinbase={coinbase}
              //     the_graph_result={the_graph_resultavax}
              //     chainId={chainId}
              //     handleConnection={handleConnection}
              //     handleSwitchNetwork={handleSwitchNetwork}
              //     expired={false}
              //     referrer={referrer}
              //   />
              // )
              // : activeCard &&
              //   topList === "Staking" &&
              //   chain === "avax" &&
              //   activePools[cardIndex]?.id ===
              //     "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
              //   <StakeAvaxIDyp
              //     is_wallet_connected={isConnected}
              //     coinbase={coinbase}
              //     the_graph_result={the_graph_resultavax}
              //     chainId={chainId}
              //     handleConnection={handleConnection}
              //     handleSwitchNetwork={handleSwitchNetwork}
              //     expired={false}
              //     staking={window.constant_staking_idypavax_7}
              //     listType={listType}
              //     finalApr={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.apy_performancefee
              //         : expiredDYPPools[cardIndex]?.apy_performancefee
              //     }
              //     apr={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.apy_percent
              //         : expiredDYPPools[cardIndex]?.apy_percent
              //     }
              //     liquidity={avax_address}
              //     expiration_time={"18 July 2024"}
              //     other_info={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.expired === "Yes"
              //             ? true
              //             : false
              //           : expiredDYPPools[cardIndex]?.expired === "Yes"
              //           ? true
              //           : false
              //         : false
              //     }
              //     fee_s={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.performancefee
              //         : expiredDYPPools[cardIndex]?.performancefee
              //     }
              //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
              //     lockTime={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
              //             "No"
              //             ? "No Lock"
              //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(
              //               " "
              //             )[0] === "No"
              //           ? "No Lock"
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
              //         : "No Lock"
              //     }
              //   />
              // )
              //  : activeCard &&
              //   activePools[cardIndex]?.id ===
              //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
              //   topList === "Staking" &&
              //   chain === "bnb" ? (
              //   <StakeBscIDyp
              //     is_wallet_connected={isConnected}
              //     coinbase={coinbase}
              //     the_graph_result={the_graph_resultbsc}
              //     chainId={chainId}
              //     handleConnection={handleConnection}
              //     handleSwitchNetwork={handleSwitchNetwork}
              //     expired={false}
              //     staking={window.constant_stakingidyp_7}
              //     listType={listType}
              //     finalApr={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.apy_performancefee
              //         : expiredDYPPools[cardIndex]?.apy_performancefee
              //     }
              //     apr={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.apy_percent
              //         : expiredDYPPools[cardIndex]?.apy_percent
              //     }
              //     liquidity={wbsc_address}
              //     expiration_time={"18 July 2024"}
              //     other_info={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.expired === "Yes"
              //             ? true
              //             : false
              //           : expiredDYPPools[cardIndex]?.expired === "Yes"
              //           ? true
              //           : false
              //         : false
              //     }
              //     fee_s={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.performancefee
              //         : expiredDYPPools[cardIndex]?.performancefee
              //     }
              //     fee_u={0}
              //     lockTime={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
              //             "No"
              //             ? "No Lock"
              //             : parseInt(
              //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
              //               )
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0] ===
              //             "No"
              //           ? "No Lock"
              //           : parseInt(
              //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
              //             )
              //         : "No Lock"
              //     }
              //   />
              // )

              // activeCard &&
              //   topList === "Staking" &&
              //   chain === "eth" &&
              //   activePools[cardIndex]?.id ===
              //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
              //   <InitConstantStakingiDYP
              //     is_wallet_connected={isConnected}
              //     coinbase={coinbase}
              //     the_graph_result={the_graph_result}
              //     lp_id={lp_id[cardIndex]}
              //     chainId={chainId}
              //     handleConnection={handleConnection}
              //     handleSwitchNetwork={handleSwitchNetwork}
              //     expired={false}
              //     staking={window.constant_staking_idyp_5}
              //     listType={listType}
              //     finalApr={activePools[cardIndex]?.apy_performancefee}
              //     apr={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.apy_percent
              //         : expiredDYPPools[cardIndex]?.apy_percent
              //     }
              //     liquidity={eth_address}
              //     expiration_time={"18 July 2024"}
              //     other_info={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.expired === "Yes"
              //             ? true
              //             : false
              //           : expiredDYPPools[cardIndex]?.expired === "Yes"
              //           ? true
              //           : false
              //         : false
              //     }
              //     fee_s={
              //       expiredPools === false
              //         ? activePools[cardIndex]?.performancefee
              //         : expiredDYPPools[cardIndex]?.performancefee
              //     }
              //     fee_u={withdrawFeeiDyp[cardIndex]}
              //     lockTime={
              //       cardIndex !== undefined
              //         ? expiredPools === false
              //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
              //             "No"
              //             ? "No Lock"
              //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(
              //               " "
              //             )[0] === "No"
              //           ? "No Lock"
              //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
              //         : "No Lock"
              //     }
              //   />
              // )
              activeCard && topList === "Farming" && chain === "bnb" ? (
                <BscFarmingFunc
                  is_wallet_connected={isConnected}
                  wbnbPrice={wbnbPrice}
                  coinbase={coinbase}
                  latestTvl={theBnbPool.tvl_usd}
                  the_graph_result={the_graph_resultbsc}
                  lp_id={LP_IDBNB_Array[cardIndex]}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  expired={false}
                  handleSwitchNetwork={handleSwitchNetwork}
                  latestApr={theBnbPool.apy_percent}
                  liquidity={wbsc_address}
                  constant={window.farming_activebsc_1}
                  staking={window.constant_staking_newbscactive1}
                  token={window.token_newbsc}
                  lp_symbol={"USD"}
                  lock="3 Days"
                  rebase_factor={1}
                  expiration_time={"18 July 2024"}
                  fee="0.4"
                  finalApr={activePools[cardIndex]?.apy_percent}
                  lockTime={3}
                  listType={listType}
                />
              ) : activeCard &&
                topList === "Farming" &&
                chain === "avax" ? null : activeCard && // /> //   listType={listType} //   lockTime={3} //   finalApr={activePools[cardIndex]?.apy_percent} //   fee="0.4" //   expiration_time="7 June 2024" //   rebase_factor={1} //   lock="3 Days" //   lp_symbol={"USD"} //   token={window.token_newavax} //   staking={window.constant_staking_newavaxactive1} //   constant={window.farming_activeavax_1} //   liquidity={wbnb_address} //   handleSwitchNetwork={handleSwitchNetwork} //   expired={false} //   handleConnection={handleConnection} //   chainId={chainId} //   lp_id={LP_IDAVAX_Array[cardIndex]} //   the_graph_result={the_graph_resultavax} //   coinbase={coinbase} //   is_wallet_connected={isConnected} //   <FarmAvaxFunc
                topList === "Vault" &&
                chain === "eth" ? (
                <Vault
                  vault={vaultArrayNew[cardIndex]}
                  token={tokenvaultArrayNew[cardIndex]}
                  platformTokenApyPercent={vaultplatformArrayNew[cardIndex]}
                  UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex]}
                  UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex]}
                  expiration_time={"1 August 2024"}
                  coinbase={coinbase}
                  lockTime={"No Lock"}
                  handleConnection={handleConnection}
                  chainId={chainId}
                  listType={listType}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={false}
                  isConnected={isConnected}
                  the_graph_result={the_graph_result}
                />
              ) : (
                <></>
              )}
              <div
                className="top-picks-container"
                style={{ marginTop: "26px" }}
              >
                {/* {topList === "Staking" && chain === "eth" && (
                    <CawsCard
                      onShowDetailsClick={() => {
                        setActiveCardNFT(true);
                        setActiveCardLandNFT(false);
                        setActiveCard(null);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCardCawsLand(null)
                        setDetails();
                      }}
                      onHideDetailsClick={() => {
                        setActiveCardNFT(false);
                        setDetails();
                      }}
                      cardType={topList}
                      details={activeCardNFT === true ? true : false}
                      listType={listType}
                      tvl={"$" + getFormattedNumber(cawsCard2.tvl_usd)}
                      network={chainId}
                    />
                  )} */}
                {activePools.slice(2, 4).map((pool, index) => (
                  <TopPoolsCard
                    network={chainId}
                    display={
                      pool.expired ? (pool.expired === "Yes" ? "none" : "") : ""
                    }
                    expired={false}
                    key={index}
                    chain={chain}
                    top_pick={pool.top_pick}
                    tokenName={
                      pool.tokenName
                        ? pool.tokenName
                        : pool.pair_name
                        ? pool.pair_name
                        : ""
                    }
                    apr={pool.apy_percent + "%"}
                    tvl={
                      pool.tvl_usd === "--"
                        ? pool.tvl_usd
                        : "$" + getFormattedNumber(pool.tvl_usd)
                    }
                    lockTime={
                      pool.lockTime
                        ? pool.lockTime
                        : pool.lock_time
                        ? pool.lock_time
                        : locktimeFarm[index]
                    }
                    tokenLogo={
                      pool.icon
                        ? pool.icon
                        : pool.pair_name === "iDYP"
                        ? "idypius.svg"
                        : "dyplogo.svg"
                    }
                    onShowDetailsClick={() => {
                      setActiveCard(null);
                      setActiveCard2(topPools[index + 2]);
                      setActiveCard3(null);
                      setActiveCard4(null);
                      setActiveCard5(null);
                      setActiveCard6(null);
                      setActiveCardNFT(false);
                      setActiveCardLandNFT(false);
                      handleCardIndexStake(index + 2);
                      handleCardIndexStake30(index + 2);
                      handleCardIndexStakeiDyp(index + 2);
                      setDetails(index + 2);
                      setselectedPool(pool);
                      setShowDetails(true);
                    }}
                    onHideDetailsClick={() => {
                      setActiveCard2(null);
                      setDetails();
                    }}
                    cardType={topList}
                    details={details === index + 2 ? true : false}
                    isNewPool={pool.new_pool === "Yes" ? true : false}
                    isStaked={
                      userPools.length > 0
                        ? userPools.find(
                            (obj) => obj.contract_address === pool.id
                          )
                          ? true
                          : false
                        : false
                    }
                    isPremium={isPremium}
                  />
                ))}
              </div>

              {
                // activeCard2 &&
                // topList === "Staking" &&
                // chain === "avax" &&
                // activePools[cardIndex]?.id ===
                //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                //   <StakeAvaxIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idypavax_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={avax_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // )
                // :
                //  : activeCard2 &&
                //   activePools[cardIndex]?.id ===
                //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                //   topList === "Staking" &&
                //   chain === "bnb" ? (
                //   <StakeBscIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_stakingidyp_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={0}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : parseInt(
                //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                //               )
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //           ? "No Lock"
                //           : parseInt(
                //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //             )
                //         : "No Lock"
                //     }
                //   />
                // )
                // activeCard2 &&
                // topList === "Staking" &&
                // activePools[cardIndex]?.id ===
                //   "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                // chain === "eth" ? (
                //   <StakeDypiusEth
                //     staking={window.constant_staking_dypius_eth1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                // : activeCard2 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "bnb" ? (
                //   <StakeDypiusBsc
                //     staking={window.constant_staking_dypius_bsc1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                // : activeCard2 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "avax" ? (
                //   <StakeDypiusAvax
                //     staking={window.constant_staking_dypius_avax1}
                //     apr={activePools[cardIndex]?.apy_percent}
                //     liquidity={avax_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                // : activeCard2 &&
                //   topList === "Staking" &&
                //   chain === "eth" &&
                //   activePools[cardIndex]?.id ===
                //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                //   <InitConstantStakingiDYP
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     lp_id={lp_id[cardIndex]}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idyp_5}
                //     listType={listType}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={withdrawFeeiDyp[cardIndex]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // )
                activeCard2 && topList === "Vault" && chain === "eth" ? (
                  <Vault
                    vault={vaultArrayNew[cardIndex]}
                    token={tokenvaultArrayNew[cardIndex]}
                    platformTokenApyPercent={vaultplatformArrayNew[cardIndex]}
                    UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex]}
                    UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex]}
                    expiration_time={"1 August 2024"}
                    coinbase={coinbase}
                    lockTime={"No Lock"}
                    handleConnection={handleConnection}
                    chainId={chainId}
                    listType={listType}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    isConnected={isConnected}
                    the_graph_result={the_graph_result}
                  />
                ) : (
                  <></>
                )
              }
              <div
                className="top-picks-container"
                style={{ marginTop: "25px" }}
              >
                {/* {topList === "Staking" && chain === "eth" && (
                    <>
                      {activePools.slice(2, 3).map((pool, index) => (
                        <TopPoolsCard
                          network={chainId}
                          display={
                            pool.expired
                              ? pool.expired === "Yes"
                                ? "none"
                                : ""
                              : ""
                          }
                          expired={false}
                          key={index}
                          chain={chain}
                          top_pick={pool.top_pick}
                          tokenName={
                            pool.tokenName
                              ? pool.tokenName
                              : pool.pair_name
                              ? pool.pair_name
                              : ""
                          }
                          apr={pool.apy_percent + "%"}
                          tvl={
                            pool.tvl_usd === "--"
                              ? pool.tvl_usd
                              : "$" + getFormattedNumber(pool.tvl_usd)
                          }
                          lockTime={
                            pool.lockTime
                              ? pool.lockTime
                              : pool.lock_time
                              ? pool.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool.icon
                              ? pool.icon
                              : pool.pair_name === "iDYP"
                              ? "idypius.svg"
                              : "dyplogo.svg"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard(null);
                            setActiveCard2(null);
                            setActiveCard3(true);
                            setActiveCard4(null);
                            setActiveCard5(null);
                            setActiveCard6(null);
                            setActiveCardNFT(false);
                            setActiveCardLandNFT(false);
                            handleCardIndexStake(index + 2);
                            handleCardIndexStake30(index + 2);
                            handleCardIndexStakeiDyp(index + 2);
                            setDetails(index + 2);
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard3(null);
                            setDetails();
                          }}
                          cardType={topList}
                          details={details === index + 2 ? true : false}
                          isNewPool={pool.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool.id
                                )
                                ? true
                                : false
                              : false
                          }
                        />
                      ))}
                    </>
                  )} */}
                {activePools.slice(4, 6).map((pool, index) => (
                  <TopPoolsCard
                    network={chainId}
                    display={
                      pool.expired ? (pool.expired === "Yes" ? "none" : "") : ""
                    }
                    expired={false}
                    key={index}
                    chain={chain}
                    top_pick={pool.top_pick}
                    tokenName={
                      pool.tokenName
                        ? pool.tokenName
                        : pool.pair_name
                        ? pool.pair_name
                        : ""
                    }
                    apr={pool.apy_percent + "%"}
                    tvl={
                      pool.tvl_usd === "--"
                        ? pool.tvl_usd
                        : "$" + getFormattedNumber(pool.tvl_usd)
                    }
                    lockTime={
                      pool.lockTime
                        ? pool.lockTime
                        : pool.lock_time
                        ? pool.lock_time
                        : locktimeFarm[index]
                    }
                    tokenLogo={
                      pool.icon
                        ? pool.icon
                        : pool.pair_name === "iDYP"
                        ? "idypius.svg"
                        : "dyplogo.svg"
                    }
                    onShowDetailsClick={() => {
                      setActiveCard(null);
                      setActiveCard3(topPools[index + 4]);
                      setActiveCard2(null);
                      setActiveCard4(null);
                      setActiveCard5(null);
                      setActiveCard6(null);
                      setActiveCardNFT(false);
                      setActiveCardLandNFT(false);
                      handleCardIndexStake(index + 4);
                      handleCardIndexStake30(index + 4);
                      handleCardIndexStakeiDyp(index + 4);
                      setDetails(index + 4);
                      setselectedPool(pool);
                      setShowDetails(true);
                    }}
                    onHideDetailsClick={() => {
                      setActiveCard2(null);
                      setActiveCard3(null);

                      setDetails();
                    }}
                    cardType={topList}
                    details={details === index + 4 ? true : false}
                    isNewPool={pool.new_pool === "Yes" ? true : false}
                    isStaked={
                      userPools.length > 0
                        ? userPools.find(
                            (obj) => obj.contract_address === pool.id
                          )
                          ? true
                          : false
                        : false
                    }
                    isPremium={isPremium}
                  />
                ))}
              </div>
              {
                // activeCard3 &&
                // topList === "Staking" &&
                // chain === "avax" &&
                // activePools[cardIndex]?.id ===
                //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                //   <StakeAvaxIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idypavax_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={avax_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :
                // activeCard3 &&
                // topList === "Staking" &&
                // activePools[cardIndex]?.id ===
                //   "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                // chain === "eth" ? (
                //   <StakeDypiusEth
                //     staking={window.constant_staking_dypius_eth1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                //  : activeCard3 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "bnb" ? (
                //   <StakeDypiusBsc
                //     staking={window.constant_staking_dypius_bsc1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                //  : activeCard3 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "avax" ? (
                //   <StakeDypiusAvax
                //     staking={window.constant_staking_dypius_avax1}
                //     apr={activePools[cardIndex]?.apy_percent}
                //     liquidity={avax_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                //  : activeCard3 &&
                //   activePools[cardIndex]?.id ===
                //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                //   topList === "Staking" &&
                //   chain === "bnb" ? (
                //   <StakeBscIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_stakingidyp_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={0}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : parseInt(
                //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                //               )
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //           ? "No Lock"
                //           : parseInt(
                //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //             )
                //         : "No Lock"
                //     }
                //   />
                // )
                // activeCard3 &&
                //   topList === "Staking" &&
                //   chain === "eth" &&
                //   activePools[cardIndex]?.id ===
                //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                //   <InitConstantStakingiDYP
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     lp_id={lp_id[cardIndex]}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idyp_5}
                //     listType={listType}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={withdrawFeeiDyp[cardIndex]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :
                activeCard3 &&
                cardIndex >= 0 &&
                topList === "Staking" &&
                chain === "eth" ? (
                  <InitConstantStakingiDYP
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    lp_id={lp_id[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                  />
                ) : //  : activeCard3 &&
                //   activePools[cardIndex]?.id ===
                //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                //   topList === "Staking" &&
                //   chain === "bnb" ? (
                //   <StakeBscIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_stakingidyp_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={0}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : parseInt(
                //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                //               )
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //           ? "No Lock"
                //           : parseInt(
                //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //             )
                //         : "No Lock"
                //     }
                //   />
                // )
                activeCard3 && topList === "Vault" && chain === "eth" ? (
                  <Vault
                    vault={vaultArrayNew[cardIndex]}
                    token={tokenvaultArrayNew[cardIndex]}
                    platformTokenApyPercent={vaultplatformArrayNew[cardIndex]}
                    UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex]}
                    UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex]}
                    expiration_time={"1 August 2024"}
                    coinbase={coinbase}
                    lockTime={"No Lock"}
                    handleConnection={handleConnection}
                    chainId={chainId}
                    listType={listType}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    isConnected={isConnected}
                    the_graph_result={the_graph_result}
                  />
                ) : (
                  <></>
                )
              }
              <div
                className="top-picks-container"
                style={{ marginTop: "25px" }}
              >
                {activePools.slice(6, 8).map((pool, index) => (
                  <TopPoolsCard
                    network={chainId}
                    display={
                      pool.expired ? (pool.expired === "Yes" ? "none" : "") : ""
                    }
                    expired={false}
                    key={index}
                    chain={chain}
                    top_pick={pool.top_pick}
                    tokenName={
                      pool.tokenName
                        ? pool.tokenName
                        : pool.pair_name
                        ? pool.pair_name
                        : ""
                    }
                    apr={pool.apy_percent + "%"}
                    tvl={
                      pool.tvl_usd === "--"
                        ? pool.tvl_usd
                        : "$" + getFormattedNumber(pool.tvl_usd)
                    }
                    lockTime={
                      pool.lockTime
                        ? pool.lockTime
                        : pool.lock_time
                        ? pool.lock_time
                        : locktimeFarm[index]
                    }
                    tokenLogo={
                      pool.icon
                        ? pool.icon
                        : pool.pair_name === "iDYP"
                        ? "idypius.svg"
                        : "dyplogo.svg"
                    }
                    onShowDetailsClick={() => {
                      setActiveCard(null);
                      setActiveCard2(null);
                      setActiveCard3(null);
                      setActiveCard4(topPools[index + 6]);
                      setActiveCard5(null);
                      setActiveCard6(null);
                      setActiveCardNFT(false);
                      setActiveCardLandNFT(false);
                      handleCardIndexStake(index + 6);
                      handleCardIndexStake30(index + 6);
                      handleCardIndexStakeiDyp(index + 6);
                      setDetails(index + 6);
                      setselectedPool(pool);
                      setShowDetails(true);
                    }}
                    onHideDetailsClick={() => {
                      setActiveCard4(null);
                      setDetails();
                    }}
                    cardType={topList}
                    details={details === index + 6 ? true : false}
                    isNewPool={pool.new_pool === "Yes" ? true : false}
                    isStaked={
                      userPools.length > 0
                        ? userPools.find(
                            (obj) => obj.contract_address === pool.id
                          )
                          ? true
                          : false
                        : false
                    }
                    isPremium={isPremium}
                  />
                ))}
              </div>
              {
                // activeCard4 &&
                // topList === "Staking" &&
                // chain === "avax" &&
                // activePools[cardIndex]?.id ===
                //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                //   <StakeAvaxIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idypavax_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={avax_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :

                // activeCard4 &&
                // topList === "Staking" &&
                // activePools[cardIndex]?.id ===
                //   "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                // chain === "eth" ? (
                //   <StakeDypiusEth
                //     staking={window.constant_staking_dypius_eth1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                // : activeCard4 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "bnb" ? (
                //   <StakeDypiusBsc
                //     staking={window.constant_staking_dypius_bsc1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )

                //  : activeCard4 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "avax" ? (
                //   <StakeDypiusAvax
                //     staking={window.constant_staking_dypius_avax1}
                //     apr={activePools[cardIndex]?.apy_percent}
                //     liquidity={avax_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                //  : activeCard4 &&
                //   activePools[cardIndex]?.id ===
                //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                //   topList === "Staking" &&
                //   chain === "bnb" ? (
                //   <StakeBscIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_stakingidyp_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={0}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : parseInt(
                //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                //               )
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //           ? "No Lock"
                //           : parseInt(
                //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //             )
                //         : "No Lock"
                //     }
                //   />
                // )
                // activeCard4 &&
                //   topList === "Staking" &&
                //   chain === "eth" &&
                //   activePools[cardIndex]?.id ===
                //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                //   <InitConstantStakingiDYP
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     lp_id={lp_id[cardIndex]}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idyp_5}
                //     listType={listType}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={withdrawFeeiDyp[cardIndex]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :
                activeCard4 &&
                cardIndex >= 0 &&
                topList === "Staking" &&
                chain === "eth" ? (
                  <InitConstantStakingiDYP
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    lp_id={lp_id[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                  />
                ) : activeCard4 &&
                  cardIndex >= 2 &&
                  topList === "Staking" &&
                  chain === "bnb" ? (
                  <StakeBscIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={
                      expiredPools === false
                        ? stakearrayStakeBsciDyp2[cardIndex - 2]
                        : stakearrayStakeBsciDyp2Expired[cardIndex - 3]
                    }
                    listType={listType}
                    finalApr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_performancefee
                        : expiredDYPPools[cardIndex]?.apy_performancefee
                    }
                    apr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_percent
                        : expiredDYPPools[cardIndex]?.apy_percent
                    }
                    liquidity={wbsc_address}
                    expiration_time={
                      expiredPools === false
                        ? expirearrayStakeBsciDyp2[cardIndex - 2]
                        : expirearrayStakeBsciDyp2Expired[cardIndex - 3]
                    }
                    other_info={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : expiredDYPPools[cardIndex]?.expired === "Yes"
                          ? true
                          : false
                        : false
                    }
                    fee_s={
                      expiredPools === false
                        ? activePools[cardIndex]?.performancefee
                        : expiredDYPPools[cardIndex]?.performancefee
                    }
                    fee_u={0}
                    lockTime={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                            "No"
                            ? "No Lock"
                            : parseInt(
                                activePools[cardIndex]?.lock_time?.split(" ")[0]
                              )
                          : expiredDYPPools[cardIndex]?.lock_time?.split(
                              " "
                            )[0] === "No"
                          ? "No Lock"
                          : parseInt(
                              expiredDYPPools[cardIndex]?.lock_time?.split(
                                " "
                              )[0]
                            )
                        : "No Lock"
                    }
                  />
                ) : (
                  <></>
                )
              }
              <div
                className="top-picks-container"
                style={{ marginTop: activePools.length > 8 && "25px" }}
              >
                {activePools.slice(8, activePools.length).map((pool, index) => (
                  <TopPoolsCard
                    network={chainId}
                    display={
                      pool.expired ? (pool.expired === "Yes" ? "none" : "") : ""
                    }
                    expired={false}
                    key={index}
                    chain={chain}
                    top_pick={pool.top_pick}
                    tokenName={
                      pool.tokenName
                        ? pool.tokenName
                        : pool.pair_name
                        ? pool.pair_name
                        : ""
                    }
                    apr={pool.apy_percent + "%"}
                    tvl={
                      pool.tvl_usd === "--"
                        ? pool.tvl_usd
                        : "$" + getFormattedNumber(pool.tvl_usd)
                    }
                    lockTime={
                      pool.lockTime
                        ? pool.lockTime
                        : pool.lock_time
                        ? pool.lock_time
                        : locktimeFarm[index]
                    }
                    tokenLogo={
                      pool.icon
                        ? pool.icon
                        : pool.pair_name === "iDYP"
                        ? "idypius.svg"
                        : "dyplogo.svg"
                    }
                    onShowDetailsClick={() => {
                      setActiveCard(null);
                      setActiveCard2(null);
                      setActiveCard3(null);
                      setActiveCard4(null);
                      setActiveCard5(topPools[index + 6]);
                      setActiveCard6(null);
                      setActiveCardNFT(false);
                      setActiveCardLandNFT(false);
                      handleCardIndexStake(index + 6);
                      handleCardIndexStake30(index + 6);
                      handleCardIndexStakeiDyp(index + 6);
                      setDetails(index + 6);
                      setselectedPool(pool);
                      setShowDetails(true);
                    }}
                    onHideDetailsClick={() => {
                      setActiveCard5(null);
                      setDetails();
                    }}
                    cardType={topList}
                    details={details === index + 6 ? true : false}
                    isNewPool={pool.new_pool === "Yes" ? true : false}
                    isStaked={
                      userPools.length > 0
                        ? userPools.find(
                            (obj) => obj.contract_address === pool.id
                          )
                          ? true
                          : false
                        : false
                    }
                    isPremium={isPremium}
                  />
                ))}
              </div>
              {
                // activeCard5 &&
                // topList === "Staking" &&
                // chain === "avax" &&
                // activePools[cardIndex]?.id ===
                //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                //   <StakeAvaxIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idypavax_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={avax_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :

                //  : activeCard5 &&
                //   activePools[cardIndex]?.id ===
                //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                //   topList === "Staking" &&
                //   chain === "bnb" ? (
                //   <StakeBscIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_stakingidyp_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={0}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : parseInt(
                //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                //               )
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //           ? "No Lock"
                //           : parseInt(
                //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //             )
                //         : "No Lock"
                //     }
                //   />
                // )
                // activeCard5 &&
                //   topList === "Staking" &&
                //   chain === "eth" &&
                //   activePools[cardIndex]?.id ===
                //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                //   <InitConstantStakingiDYP
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     lp_id={lp_id[cardIndex]}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idyp_5}
                //     listType={listType}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={withdrawFeeiDyp[cardIndex]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :
                activeCard5 &&
                cardIndex >= 0 &&
                topList === "Staking" &&
                chain === "eth" ? (
                  <InitConstantStakingiDYP
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    lp_id={lp_id[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                  />
                ) : activeCard5 &&
                  cardIndex >= 2 &&
                  topList === "Staking" &&
                  chain === "bnb" ? (
                  <StakeBscIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={
                      expiredPools === false
                        ? stakearrayStakeBsciDyp2[cardIndex - 2]
                        : stakearrayStakeBsciDyp2Expired[cardIndex - 3]
                    }
                    listType={listType}
                    finalApr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_performancefee
                        : expiredDYPPools[cardIndex]?.apy_performancefee
                    }
                    apr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_percent
                        : expiredDYPPools[cardIndex]?.apy_percent
                    }
                    liquidity={wbsc_address}
                    expiration_time={
                      expiredPools === false
                        ? expirearrayStakeBsciDyp2[cardIndex - 2]
                        : expirearrayStakeBsciDyp2Expired[cardIndex - 3]
                    }
                    other_info={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : expiredDYPPools[cardIndex]?.expired === "Yes"
                          ? true
                          : false
                        : false
                    }
                    fee_s={
                      expiredPools === false
                        ? activePools[cardIndex]?.performancefee
                        : expiredDYPPools[cardIndex]?.performancefee
                    }
                    fee_u={0}
                    lockTime={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                            "No"
                            ? "No Lock"
                            : parseInt(
                                activePools[cardIndex]?.lock_time?.split(" ")[0]
                              )
                          : expiredDYPPools[cardIndex]?.lock_time?.split(
                              " "
                            )[0] === "No"
                          ? "No Lock"
                          : parseInt(
                              expiredDYPPools[cardIndex]?.lock_time?.split(
                                " "
                              )[0]
                            )
                        : "No Lock"
                    }
                  />
                ) : (
                  <></>
                )
              }
              <div
                className="top-picks-container"
                style={{ marginTop: activePools.length > 9 && "25px" }}
              >
                {activePools
                  .slice(10, activePools.length)
                  .map((pool, index) => (
                    <TopPoolsCard
                      network={chainId}
                      display={
                        pool.expired
                          ? pool.expired === "Yes"
                            ? "none"
                            : ""
                          : ""
                      }
                      expired={false}
                      key={index}
                      chain={chain}
                      top_pick={pool.top_pick}
                      tokenName={
                        pool.tokenName
                          ? pool.tokenName
                          : pool.pair_name
                          ? pool.pair_name
                          : ""
                      }
                      apr={pool.apy_percent + "%"}
                      tvl={
                        pool.tvl_usd === "--"
                          ? pool.tvl_usd
                          : "$" + getFormattedNumber(pool.tvl_usd)
                      }
                      lockTime={
                        pool.lockTime
                          ? pool.lockTime
                          : pool.lock_time
                          ? pool.lock_time
                          : locktimeFarm[index]
                      }
                      tokenLogo={
                        pool.icon
                          ? pool.icon
                          : pool.pair_name === "iDYP"
                          ? "idypius.svg"
                          : "dyplogo.svg"
                      }
                      onShowDetailsClick={() => {
                        setActiveCard(null);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCard5(null);
                        setActiveCard6(topPools[index + 10]);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(index + 10);
                        handleCardIndexStake30(index + 10);
                        handleCardIndexStakeiDyp(index + 10);
                        setDetails(index + 10);
                        setselectedPool(pool);
                        setShowDetails(true);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard6(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === index + 10 ? true : false}
                      isNewPool={pool.new_pool === "Yes" ? true : false}
                      isStaked={
                        userPools.length > 0
                          ? userPools.find(
                              (obj) => obj.contract_address === pool.id
                            )
                            ? true
                            : false
                          : false
                      }
                      isPremium={isPremium}
                    />
                  ))}
              </div>
              {
                // activeCard6 &&
                // topList === "Staking" &&
                // chain === "avax" &&
                // activePools[cardIndex]?.id ===
                //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                //   <StakeAvaxIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idypavax_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={avax_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :

                // : activeCard6 &&
                //   activePools[cardIndex]?.id ===
                //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                //   topList === "Staking" &&
                //   chain === "bnb" ? (
                //   <StakeBscIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_stakingidyp_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={0}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : parseInt(
                //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                //               )
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //           ? "No Lock"
                //           : parseInt(
                //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //             )
                //         : "No Lock"
                //     }
                //   />
                // )
                // activeCard6 &&
                //   topList === "Staking" &&
                //   chain === "eth" &&
                //   activePools[cardIndex]?.id ===
                //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                //   <InitConstantStakingiDYP
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     lp_id={lp_id[cardIndex]}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idyp_5}
                //     listType={listType}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={withdrawFeeiDyp[cardIndex]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :
                activeCard6 &&
                cardIndex >= 0 &&
                topList === "Staking" &&
                chain === "eth" ? (
                  <InitConstantStakingiDYP
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    lp_id={lp_id[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                  />
                ) : activeCard6 &&
                  cardIndex >= 2 &&
                  topList === "Staking" &&
                  chain === "bnb" ? (
                  <StakeBscIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={
                      expiredPools === false
                        ? stakearrayStakeBsciDyp2[cardIndex - 2]
                        : stakearrayStakeBsciDyp2Expired[cardIndex - 3]
                    }
                    listType={listType}
                    finalApr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_performancefee
                        : expiredDYPPools[cardIndex]?.apy_performancefee
                    }
                    apr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_percent
                        : expiredDYPPools[cardIndex]?.apy_percent
                    }
                    liquidity={wbsc_address}
                    expiration_time={
                      expiredPools === false
                        ? expirearrayStakeBsciDyp2[cardIndex - 2]
                        : expirearrayStakeBsciDyp2Expired[cardIndex - 3]
                    }
                    other_info={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : expiredDYPPools[cardIndex]?.expired === "Yes"
                          ? true
                          : false
                        : false
                    }
                    fee_s={
                      expiredPools === false
                        ? activePools[cardIndex]?.performancefee
                        : expiredDYPPools[cardIndex]?.performancefee
                    }
                    fee_u={0}
                    lockTime={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                            "No"
                            ? "No Lock"
                            : parseInt(
                                activePools[cardIndex]?.lock_time?.split(" ")[0]
                              )
                          : expiredDYPPools[cardIndex]?.lock_time?.split(
                              " "
                            )[0] === "No"
                          ? "No Lock"
                          : parseInt(
                              expiredDYPPools[cardIndex]?.lock_time?.split(
                                " "
                              )[0]
                            )
                        : "No Lock"
                    }
                  />
                ) : activeCard6 &&
                  topList === "Staking" &&
                  chain === "avax" &&
                  cardIndex >= 2 ? (
                  <StakeAvaxIDyp
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultavax}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={
                      expiredPools === false
                        ? stakingarrayStakeAvaxiDypActive[cardIndex - 2]
                        : stakingarrayStakeAvaxiDypExpired[cardIndex - 3]
                    }
                    listType={listType}
                    finalApr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_performancefee
                        : expiredDYPPools[cardIndex]?.apy_performancefee
                    }
                    apr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_percent
                        : expiredDYPPools[cardIndex]?.apy_percent
                    }
                    liquidity={avax_address}
                    expiration_time={expirearrayStakeAvaxiDyp[cardIndex]}
                    other_info={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : expiredDYPPools[cardIndex]?.expired === "Yes"
                          ? true
                          : false
                        : false
                    }
                    fee_s={
                      expiredPools === false
                        ? activePools[cardIndex]?.performancefee
                        : expiredDYPPools[cardIndex]?.performancefee
                    }
                    fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                    lockTime={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                            "No"
                            ? "No Lock"
                            : activePools[cardIndex]?.lock_time?.split(" ")[0]
                          : expiredDYPPools[cardIndex]?.lock_time?.split(
                              " "
                            )[0] === "No"
                          ? "No Lock"
                          : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                        : "No Lock"
                    }
                  />
                ) : (
                  <></>
                )
              }
            </div>
          ) : (
            <div className="px-0">
              <>
                <div className="top-picks-container">
                
                  {activePools.slice(0, 1).map((pool, index) => (
                    <TopPoolsCard
                      network={chainId}
                      display={
                        pool.expired
                          ? pool.expired === "Yes"
                            ? "none"
                            : ""
                          : ""
                      }
                      expired={false}
                      key={index}
                      chain={chain}
                      top_pick={pool.top_pick}
                      tokenName={
                        pool.tokenName
                          ? pool.tokenName
                          : pool.pair_name
                          ? pool.pair_name
                          : ""
                      }
                      apr={pool.apy_percent + "%"}
                      tvl={
                        pool.tvl_usd === "--"
                          ? pool.tvl_usd
                          : "$" + getFormattedNumber(pool.tvl_usd)
                      }
                      lockTime={
                        pool.lockTime
                          ? pool.lockTime
                          : pool.lock_time
                          ? pool.lock_time
                          : locktimeFarm[index]
                      }
                      tokenLogo={
                        pool.icon
                          ? pool.icon
                          : pool.pair_name === "iDYP"
                          ? "idypius.svg"
                          : "dyplogo.svg"
                      }
                      onShowDetailsClick={() => {
                        setActiveCard(topPools[index]);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCard5(null);
                        setActiveCard6(null);
                        setActiveCard7(null);
                        setActiveCard8(null);
                        setActiveCard9(null);
                        setActiveCard10(null);
                        setActiveCard11(null);
                        setActiveCard12(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        setActiveCardCawsLand(null);
                        setselectedPool(pool);
                        setShowDetails(true);
                        handleCardIndexStake(index);
                        handleCardIndexStake30(index);
                        handleCardIndexStakeiDyp(index);
                        setDetails(index);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === index ? true : false}
                      isNewPool={pool.new_pool === "Yes" ? true : false}
                      isStaked={
                        userPools.length > 0
                          ? userPools.find(
                              (obj) => obj.contract_address === pool.id
                            )
                            ? true
                            : false
                          : false
                      }
                      isPremium={isPremium}
                    />
                  ))}
                  {topList === "Farming" && chain === "bnb" && (
                    <TopPoolsCard
                      chain={chain}
                      top_pick={false}
                      tokenName={"WBNB"}
                      apr={`${getFormattedNumber(theBnbPool.apy_percent, 0)}%`}
                      tvl={`$${getFormattedNumber(theBnbPool.tvl_usd, 2)}`}
                      lockTime={"3 Days"}
                      tokenLogo={"bnb.svg"}
                      onShowDetailsClick={() => {
                        setActiveCard(topPools[0]);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCardCawsLand(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(0);
                        handleCardIndexStake30(0);
                        handleCardIndexStakeiDyp(0);
                        setDetails(0);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === 0 ? true : false}
                      isNewPool={true}
                      isStaked={false}
                      expired={false}
                      network={chainId}
                      isPremium={isPremium}
                    />
                  )}
                  {topList === "Farming" && chain === "avax" && (
                    <TopPoolsCard
                      chain={chain}
                      top_pick={false}
                      tokenName={"WAVAX"}
                      apr={"8%"}
                      tvl={"$60,000"}
                      lockTime={"3 Days"}
                      tokenLogo={"wavax.svg"}
                      onShowDetailsClick={() => {
                        setActiveCard(topPools[0]);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCardCawsLand(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(0);
                        handleCardIndexStake30(0);
                        handleCardIndexStakeiDyp(0);
                        setDetails(0);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === 0 ? true : false}
                      isNewPool={true}
                      isStaked={false}
                      expired={false}
                      network={chainId}
                      isPremium={isPremium}
                    />
                  )}
                </div>
                {
                  // activeCard &&
                  // topList === "Staking" &&
                  // chain === "avax" &&
                  // activePools[cardIndex]?.id ===
                  //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                  //   <StakeAvaxIDyp
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultavax}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idypavax_7}
                  //     listType={listType}
                  //     finalApr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_performancefee
                  //         : expiredDYPPools[cardIndex]?.apy_performancefee
                  //     }
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={avax_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // ) :

                  // activeCard &&
                  // topList === "Staking" &&
                  // activePools[cardIndex]?.id ===
                  //   "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                  // chain === "eth" ? (
                  //   <StakeDypiusEth
                  //     staking={window.constant_staking_dypius_eth1}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={eth_address}
                  //     expiration_time={"09 November 2024"}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0]
                  //         : "No Lock"
                  //     }
                  //     listType={listType}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_result}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     referrer={referrer}
                  //   />
                  // )
                  // : activeCard &&
                  //   topList === "Staking" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                  //   chain === "bnb" ? (
                  //   <StakeDypiusBsc
                  //     staking={window.constant_staking_dypius_bsc1}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={wbsc_address}
                  //     expiration_time={"09 November 2024"}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0]
                  //         : "No Lock"
                  //     }
                  //     listType={listType}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultbsc}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     referrer={referrer}
                  //   />
                  // )

                  // : activeCard &&
                  //   topList === "Staking" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                  //   chain === "avax" ? (
                  //   <StakeDypiusAvax
                  //     staking={window.constant_staking_dypius_avax1}
                  //     apr={activePools[cardIndex]?.apy_percent}
                  //     liquidity={avax_address}
                  //     expiration_time={"09 November 2024"}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0]
                  //         : "No Lock"
                  //     }
                  //     listType={listType}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultavax}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     referrer={referrer}
                  //   />
                  // )
                  //  : activeCard &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                  //   topList === "Staking" &&
                  //   chain === "bnb" ? (
                  //   <StakeBscIDyp
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultbsc}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_stakingidyp_7}
                  //     listType={listType}
                  //     finalApr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_performancefee
                  //         : expiredDYPPools[cardIndex]?.apy_performancefee
                  //     }
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={wbsc_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={0}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : parseInt(
                  //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //               )
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : parseInt(
                  //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //             )
                  //         : "No Lock"
                  //     }
                  //   />
                  // )
                  // activeCard &&
                  //   topList === "Staking" &&
                  //   chain === "eth" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                  //   <InitConstantStakingiDYP
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_result}
                  //     lp_id={lp_id[cardIndex]}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idyp_5}
                  //     listType={listType}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={eth_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={withdrawFeeiDyp[cardIndex]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // ) :
                  activeCard &&
                  topList === "Staking" &&
                  activePools[cardIndex]?.id === "testId" &&
                  chain === "bnb" ? (
                    <StakeBsc
                      lp_id={LP_IDBNB_Array[cardIndex]}
                      staking={window.constant_stakingbsc_new14}
                      apr={
                        expiredPools === false
                          ? activePools[cardIndex]?.apy_percent
                          : expiredDYPPools[cardIndex]?.apy_percent
                      }
                      liquidity={wbsc_address}
                      expiration_time={"5 August 2023"}
                      finalApr={
                        expiredPools === false
                          ? activePools[cardIndex]?.apy_performancefee
                          : expiredDYPPools[cardIndex]?.apy_performancefee
                      }
                      fee={
                        expiredPools === false
                          ? activePools[cardIndex]?.performancefee
                          : expiredDYPPools[cardIndex]?.performancefee
                      }
                      lockTime={
                        cardIndex !== undefined
                          ? expiredPools === false
                            ? activePools[cardIndex]?.lock_time?.split(
                                " "
                              )[0] === "No"
                              ? "No Lock"
                              : parseInt(
                                  activePools[cardIndex]?.lock_time?.split(
                                    " "
                                  )[0]
                                )
                            : expiredDYPPools[cardIndex]?.lock_time?.split(
                                " "
                              )[0] === "No"
                            ? "No Lock"
                            : parseInt(
                                expiredDYPPools[cardIndex]?.lock_time?.split(
                                  " "
                                )[0]
                              )
                          : "No Lock"
                      }
                      listType={listType}
                      other_info={
                        cardIndex !== undefined
                          ? expiredPools === false
                            ? activePools[cardIndex]?.expired === "Yes"
                              ? true
                              : false
                            : expiredDYPPools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : false
                      }
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_resultbsc}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      referrer={referrer}
                    />
                  ) : activeCard && topList === "Farming" && chain === "bnb" ? (
                    <BscFarmingFunc
                      is_wallet_connected={isConnected}
                      latestApr={theBnbPool.apy_percent}
                      wbnbPrice={wbnbPrice}
                      coinbase={coinbase}
                      latestTvl={theBnbPool.tvl_usd}
                      the_graph_result={the_graph_resultbsc}
                      lp_id={LP_IDBNB_Array[cardIndex]}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      expired={false}
                      handleSwitchNetwork={handleSwitchNetwork}
                      liquidity={wbsc_address}
                      constant={window.farming_activebsc_1}
                      staking={window.constant_staking_newbscactive1}
                      token={window.token_newbsc}
                      lp_symbol={"USD"}
                      lock="3 Days"
                      rebase_factor={1}
                      expiration_time={"18 July 2024"}
                      fee="0.4"
                      finalApr={activePools[cardIndex]?.apy_percent}
                      lockTime={3}
                      listType={listType}
                    />
                  ) : activeCard &&
                    topList === "Farming" &&
                    chain === "avax" ? null : activeCard && // /> //   listType={listType} //   lockTime={3} //   finalApr={activePools[cardIndex]?.apy_percent} //   fee="0.4" //   expiration_time="7 June 2024" //   rebase_factor={1} //   lock="3 Days" //   lp_symbol={"USD"} //   token={window.token_newavax} //   staking={window.constant_staking_newavaxactive1} //   constant={window.farming_activeavax_1} //   liquidity={wbnb_address} //   handleSwitchNetwork={handleSwitchNetwork} //   expired={false} //   handleConnection={handleConnection} //   chainId={chainId} //   lp_id={LP_IDAVAX_Array[cardIndex]} //   the_graph_result={the_graph_resultavax} //   coinbase={coinbase} //   is_wallet_connected={isConnected} //   <FarmAvaxFunc
                    topList === "Vault" &&
                    chain === "eth" ? (
                    <Vault
                      vault={vaultArrayNew[cardIndex]}
                      token={tokenvaultArrayNew[cardIndex]}
                      platformTokenApyPercent={vaultplatformArrayNew[cardIndex]}
                      UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex]}
                      UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex]}
                      expiration_time={"1 August 2024"}
                      coinbase={coinbase}
                      lockTime={"No Lock"}
                      handleConnection={handleConnection}
                      chainId={chainId}
                      listType={listType}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      isConnected={isConnected}
                      the_graph_result={the_graph_result}
                    />
                  ) : (
                    <></>
                  )
                }
              </>
              <>
                <div
                  className="top-picks-container"
                  style={{ marginTop: "25px" }}
                >
                  {activePools.slice(1, 2).map((pool, index) => (
                    <TopPoolsCard
                      network={chainId}
                      display={
                        pool.expired
                          ? pool.expired === "Yes"
                            ? "none"
                            : ""
                          : ""
                      }
                      expired={false}
                      key={index}
                      chain={chain}
                      top_pick={pool.top_pick}
                      tokenName={
                        pool.tokenName
                          ? pool.tokenName
                          : pool.pair_name
                          ? pool.pair_name
                          : ""
                      }
                      apr={pool.apy_percent + "%"}
                      tvl={
                        pool.tvl_usd === "--"
                          ? pool.tvl_usd
                          : "$" + getFormattedNumber(pool.tvl_usd)
                      }
                      lockTime={
                        pool.lockTime
                          ? pool.lockTime
                          : pool.lock_time
                          ? pool.lock_time
                          : locktimeFarm[index]
                      }
                      tokenLogo={
                        pool.icon
                          ? pool.icon
                          : pool.pair_name === "iDYP"
                          ? "idypius.svg"
                          : "dyplogo.svg"
                      }
                      onShowDetailsClick={() => {
                        setActiveCard(null);
                        setActiveCard2(topPools[index + 1]);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCard5(null);
                        setActiveCard6(null);
                        setActiveCard7(null);
                        setActiveCard8(null);
                        setActiveCard9(null);
                        setActiveCard10(null);
                        setActiveCard11(null);
                        setActiveCard12(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(index + 1);
                        handleCardIndexStake30(index + 1);
                        handleCardIndexStakeiDyp(index + 1);
                        setDetails(index + 1);
                        setselectedPool(pool);
                        setShowDetails(true);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard2(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === index + 1 ? true : false}
                      isNewPool={pool.new_pool === "Yes" ? true : false}
                      isStaked={
                        userPools.length > 0
                          ? userPools.find(
                              (obj) => obj.contract_address === pool.id
                            )
                            ? true
                            : false
                          : false
                      }
                      isPremium={isPremium}
                    />
                  ))}
                </div>

                {
                  // activeCard2 &&
                  // topList === "Staking" &&
                  // chain === "avax" &&
                  // activePools[cardIndex]?.id ===
                  //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                  //   <StakeAvaxIDyp
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultavax}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idypavax_7}
                  //     listType={listType}
                  //     finalApr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_performancefee
                  //         : expiredDYPPools[cardIndex]?.apy_performancefee
                  //     }
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={avax_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // ) :

                  // activeCard2 &&
                  // topList === "Staking" &&
                  // activePools[cardIndex]?.id ===
                  //   "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                  // chain === "eth" ? (
                  //   <StakeDypiusEth
                  //     staking={window.constant_staking_dypius_eth1}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={eth_address}
                  //     expiration_time={"09 November 2024"}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0]
                  //         : "No Lock"
                  //     }
                  //     listType={listType}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_result}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     referrer={referrer}
                  //   />
                  // )
                  // : activeCard2 &&
                  //   topList === "Staking" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                  //   chain === "bnb" ? (
                  //   <StakeDypiusBsc
                  //     staking={window.constant_staking_dypius_bsc1}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={wbsc_address}
                  //     expiration_time={"09 November 2024"}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0]
                  //         : "No Lock"
                  //     }
                  //     listType={listType}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultbsc}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     referrer={referrer}
                  //   />
                  // )
                  // : activeCard2 &&
                  //   topList === "Staking" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                  //   chain === "avax" ? (
                  //   <StakeDypiusAvax
                  //     staking={window.constant_staking_dypius_avax1}
                  //     apr={activePools[cardIndex]?.apy_percent}
                  //     liquidity={avax_address}
                  //     expiration_time={"09 November 2024"}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0]
                  //         : "No Lock"
                  //     }
                  //     listType={listType}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultavax}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     referrer={referrer}
                  //   />
                  // )
                  // : activeCard2 &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                  //   topList === "Staking" &&
                  //   chain === "bnb" ? (
                  //   <StakeBscIDyp
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultbsc}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_stakingidyp_7}
                  //     listType={listType}
                  //     finalApr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_performancefee
                  //         : expiredDYPPools[cardIndex]?.apy_performancefee
                  //     }
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={wbsc_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={0}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : parseInt(
                  //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //               )
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : parseInt(
                  //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //             )
                  //         : "No Lock"
                  //     }
                  //   />
                  // )
                  // activeCard2 &&
                  //   topList === "Staking" &&
                  //   chain === "eth" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                  //   <InitConstantStakingiDYP
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_result}
                  //     lp_id={lp_id[cardIndex]}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idyp_5}
                  //     listType={listType}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={eth_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={withdrawFeeiDyp[cardIndex]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // ) :
                  activeCard2 && topList === "Vault" && chain === "eth" ? (
                    <Vault
                      vault={vaultArrayNew[cardIndex]}
                      token={tokenvaultArrayNew[cardIndex]}
                      platformTokenApyPercent={vaultplatformArrayNew[cardIndex]}
                      UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex]}
                      UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex]}
                      expiration_time={"1 August 2024"}
                      coinbase={coinbase}
                      lockTime={"No Lock"}
                      handleConnection={handleConnection}
                      chainId={chainId}
                      listType={listType}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      isConnected={isConnected}
                      the_graph_result={the_graph_result}
                    />
                  ) : (
                    <></>
                  )
                }
              </>
              <>
                <div
                  className="top-picks-container"
                  style={{ marginTop: "25px" }}
                >
                  {activePools.slice(2, 3).map((pool, index) => (
                    <TopPoolsCard
                      network={chainId}
                      display={
                        pool.expired
                          ? pool.expired === "Yes"
                            ? "none"
                            : ""
                          : ""
                      }
                      expired={false}
                      key={index}
                      chain={chain}
                      top_pick={pool.top_pick}
                      tokenName={
                        pool.tokenName
                          ? pool.tokenName
                          : pool.pair_name
                          ? pool.pair_name
                          : ""
                      }
                      apr={pool.apy_percent + "%"}
                      tvl={
                        pool.tvl_usd === "--"
                          ? pool.tvl_usd
                          : "$" + getFormattedNumber(pool.tvl_usd)
                      }
                      lockTime={
                        pool.lockTime
                          ? pool.lockTime
                          : pool.lock_time
                          ? pool.lock_time
                          : locktimeFarm[index]
                      }
                      tokenLogo={
                        pool.icon
                          ? pool.icon
                          : pool.pair_name === "iDYP"
                          ? "idypius.svg"
                          : "dyplogo.svg"
                      }
                      onShowDetailsClick={() => {
                        setActiveCard(null);
                        setActiveCard2(null);
                        setActiveCard3(topPools[index + 2]);
                        setActiveCard4(null);
                        setActiveCard5(null);
                        setActiveCard6(null);
                        setActiveCard7(null);
                        setActiveCard8(null);
                        setActiveCard9(null);
                        setActiveCard10(null);
                        setActiveCard11(null);
                        setActiveCard12(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(index + 2);
                        handleCardIndexStake30(index + 2);
                        handleCardIndexStakeiDyp(index + 2);
                        setDetails(index + 2);
                        setselectedPool(pool);
                        setShowDetails(true);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard3(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === index + 2 ? true : false}
                      isNewPool={pool.new_pool === "Yes" ? true : false}
                      isStaked={
                        userPools.length > 0
                          ? userPools.find(
                              (obj) => obj.contract_address === pool.id
                            )
                            ? true
                            : false
                          : false
                      }
                      isPremium={isPremium}
                    />
                  ))}
                </div>
                {
                  // activeCard3 &&
                  // topList === "Staking" &&
                  // chain === "avax" &&
                  // activePools[cardIndex]?.id ===
                  //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                  //   <StakeAvaxIDyp
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultavax}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idypavax_7}
                  //     listType={listType}
                  //     finalApr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_performancefee
                  //         : expiredDYPPools[cardIndex]?.apy_performancefee
                  //     }
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={avax_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // ) :

                  // activeCard3 &&
                  // topList === "Staking" &&
                  // activePools[cardIndex]?.id ===
                  //   "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                  // chain === "eth" ? (
                  //   <StakeDypiusEth
                  //     staking={window.constant_staking_dypius_eth1}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={eth_address}
                  //     expiration_time={"09 November 2024"}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0]
                  //         : "No Lock"
                  //     }
                  //     listType={listType}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_result}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     referrer={referrer}
                  //   />
                  // )
                  //  : activeCard3 &&
                  //   topList === "Staking" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                  //   chain === "bnb" ? (
                  //   <StakeDypiusBsc
                  //     staking={window.constant_staking_dypius_bsc1}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={wbsc_address}
                  //     expiration_time={"09 November 2024"}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0]
                  //         : "No Lock"
                  //     }
                  //     listType={listType}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultbsc}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     referrer={referrer}
                  //   />
                  // )
                  //  : activeCard3 &&
                  //   topList === "Staking" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                  //   chain === "avax" ? (
                  //   <StakeDypiusAvax
                  //     staking={window.constant_staking_dypius_avax1}
                  //     apr={activePools[cardIndex]?.apy_percent}
                  //     liquidity={avax_address}
                  //     expiration_time={"09 November 2024"}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0]
                  //         : "No Lock"
                  //     }
                  //     listType={listType}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultavax}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     referrer={referrer}
                  //   />
                  // )
                  // : activeCard3 &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                  //   topList === "Staking" &&
                  //   chain === "bnb" ? (
                  //   <StakeBscIDyp
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultbsc}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_stakingidyp_7}
                  //     listType={listType}
                  //     finalApr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_performancefee
                  //         : expiredDYPPools[cardIndex]?.apy_performancefee
                  //     }
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={wbsc_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={0}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : parseInt(
                  //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //               )
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : parseInt(
                  //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //             )
                  //         : "No Lock"
                  //     }
                  //   />
                  // )
                  // activeCard3 &&
                  //   topList === "Staking" &&
                  //   chain === "eth" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                  //   <InitConstantStakingiDYP
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_result}
                  //     lp_id={lp_id[cardIndex]}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idyp_5}
                  //     listType={listType}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={eth_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={withdrawFeeiDyp[cardIndex]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // ) :
                  activeCard3 && topList === "Vault" && chain === "eth" ? (
                    <Vault
                      vault={vaultArrayNew[cardIndex]}
                      token={tokenvaultArrayNew[cardIndex]}
                      platformTokenApyPercent={vaultplatformArrayNew[cardIndex]}
                      UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex]}
                      UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex]}
                      expiration_time={"1 August 2024"}
                      coinbase={coinbase}
                      lockTime={"No Lock"}
                      handleConnection={handleConnection}
                      chainId={chainId}
                      listType={listType}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      isConnected={isConnected}
                      the_graph_result={the_graph_result}
                    />
                  ) : (
                    <></>
                  )
                }
              </>
              <>
                <div
                  className="top-picks-container"
                  style={{ marginTop: "25px" }}
                >
                  {activePools.slice(3, 4).map((pool, index) => (
                    <TopPoolsCard
                      network={chainId}
                      display={
                        pool.expired
                          ? pool.expired === "Yes"
                            ? "none"
                            : ""
                          : ""
                      }
                      expired={false}
                      key={index}
                      chain={chain}
                      top_pick={pool.top_pick}
                      tokenName={
                        pool.tokenName
                          ? pool.tokenName
                          : pool.pair_name
                          ? pool.pair_name
                          : ""
                      }
                      apr={pool.apy_percent + "%"}
                      tvl={
                        pool.tvl_usd === "--"
                          ? pool.tvl_usd
                          : "$" + getFormattedNumber(pool.tvl_usd)
                      }
                      lockTime={
                        pool.lockTime
                          ? pool.lockTime
                          : pool.lock_time
                          ? pool.lock_time
                          : locktimeFarm[index]
                      }
                      tokenLogo={
                        pool.icon
                          ? pool.icon
                          : pool.pair_name === "iDYP"
                          ? "idypius.svg"
                          : "dyplogo.svg"
                      }
                      onShowDetailsClick={() => {
                        setActiveCard(null);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(topPools[index + 3]);
                        setActiveCard5(null);
                        setActiveCard6(null);
                        setActiveCard7(null);
                        setActiveCard8(null);
                        setActiveCard9(null);
                        setActiveCard10(null);
                        setActiveCard11(null);
                        setActiveCard12(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(index + 3);
                        handleCardIndexStake30(index + 3);
                        handleCardIndexStakeiDyp(index + 3);
                        setDetails(index + 3);
                        setselectedPool(pool);
                        setShowDetails(true);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard4(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === index + 3 ? true : false}
                      isNewPool={pool.new_pool === "Yes" ? true : false}
                      isStaked={
                        userPools.length > 0
                          ? userPools.find(
                              (obj) => obj.contract_address === pool.id
                            )
                            ? true
                            : false
                          : false
                      }
                      isPremium={isPremium}
                    />
                  ))}
                </div>
                {activeCard4 &&
                topList === "Staking" &&
                chain === "eth" &&
                activePools[cardIndex]?.id ===
                  "0x50014432772b4123D04181727C6EdEAB34F5F988" ? (
                  <InitConstantStakingiDYP
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    lp_id={lp_id[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_staking_idyp_3}
                    listType={listType}
                    finalApr={activePools[cardIndex]?.apy_performancefee}
                    apr={
                      expiredPools === false
                        ? activePools[cardIndex]?.apy_percent
                        : expiredDYPPools[cardIndex]?.apy_percent
                    }
                    liquidity={eth_address}
                    expiration_time={"15 August 2023"}
                    other_info={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : expiredDYPPools[cardIndex]?.expired === "Yes"
                          ? true
                          : false
                        : false
                    }
                    fee_s={
                      expiredPools === false
                        ? activePools[cardIndex]?.performancefee
                        : expiredDYPPools[cardIndex]?.performancefee
                    }
                    fee_u={withdrawFeeiDyp[cardIndex]}
                    lockTime={
                      cardIndex !== undefined
                        ? expiredPools === false
                          ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                            "No"
                            ? "No Lock"
                            : activePools[cardIndex]?.lock_time?.split(" ")[0]
                          : expiredDYPPools[cardIndex]?.lock_time?.split(
                              " "
                            )[0] === "No"
                          ? "No Lock"
                          : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                        : "No Lock"
                    }
                  />
                ) : // : activeCard4 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                //   chain === "eth" ? (
                //   <StakeDypiusEth
                //     staking={window.constant_staking_dypius_eth1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                //  : activeCard4 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "bnb" ? (
                //   <StakeDypiusBsc
                //     staking={window.constant_staking_dypius_bsc1}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                //  : activeCard4 &&
                //   topList === "Staking" &&
                //   activePools[cardIndex]?.id ===
                //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                //   chain === "avax" ? (
                //   <StakeDypiusAvax
                //     staking={window.constant_staking_dypius_avax1}
                //     apr={activePools[cardIndex]?.apy_percent}
                //     liquidity={avax_address}
                //     expiration_time={"09 November 2024"}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //     listType={listType}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     referrer={referrer}
                //   />
                // )
                // : activeCard4 &&
                //   topList === "Staking" &&
                //   chain === "avax" &&
                //   activePools[cardIndex]?.id ===
                //     "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                //   <StakeAvaxIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultavax}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idypavax_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={avax_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // )
                //  : activeCard4 &&
                //   activePools[cardIndex]?.id ===
                //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                //   topList === "Staking" &&
                //   chain === "bnb" ? (
                //   <StakeBscIDyp
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_resultbsc}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_stakingidyp_7}
                //     listType={listType}
                //     finalApr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_performancefee
                //         : expiredDYPPools[cardIndex]?.apy_performancefee
                //     }
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={wbsc_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={0}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : parseInt(
                //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                //               )
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : parseInt(
                //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //             )
                //         : "No Lock"
                //     }
                //   />
                // )
                // activeCard4 &&
                //   topList === "Staking" &&
                //   chain === "eth" &&
                //   activePools[cardIndex]?.id ===
                //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                //   <InitConstantStakingiDYP
                //     is_wallet_connected={isConnected}
                //     coinbase={coinbase}
                //     the_graph_result={the_graph_result}
                //     lp_id={lp_id[cardIndex]}
                //     chainId={chainId}
                //     handleConnection={handleConnection}
                //     handleSwitchNetwork={handleSwitchNetwork}
                //     expired={false}
                //     staking={window.constant_staking_idyp_5}
                //     listType={listType}
                //     finalApr={activePools[cardIndex]?.apy_performancefee}
                //     apr={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.apy_percent
                //         : expiredDYPPools[cardIndex]?.apy_percent
                //     }
                //     liquidity={eth_address}
                //     expiration_time={"18 July 2024"}
                //     other_info={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.expired === "Yes"
                //             ? true
                //             : false
                //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                //           ? true
                //           : false
                //         : false
                //     }
                //     fee_s={
                //       expiredPools === false
                //         ? activePools[cardIndex]?.performancefee
                //         : expiredDYPPools[cardIndex]?.performancefee
                //     }
                //     fee_u={withdrawFeeiDyp[cardIndex]}
                //     lockTime={
                //       cardIndex !== undefined
                //         ? expiredPools === false
                //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                //             "No"
                //             ? "No Lock"
                //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                //               " "
                //             )[0] === "No"
                //           ? "No Lock"
                //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                //         : "No Lock"
                //     }
                //   />
                // ) :
                activeCard4 && topList === "Vault" && chain === "eth" ? (
                  <Vault
                    vault={vaultArrayNew[cardIndex]}
                    token={tokenvaultArrayNew[cardIndex]}
                    platformTokenApyPercent={vaultplatformArrayNew[cardIndex]}
                    UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex]}
                    UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex]}
                    expiration_time={"1 August 2024"}
                    coinbase={coinbase}
                    lockTime={"No Lock"}
                    handleConnection={handleConnection}
                    chainId={chainId}
                    listType={listType}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    isConnected={isConnected}
                    the_graph_result={the_graph_result}
                  />
                ) : (
                  <></>
                )}
              </>
              <>
                <div
                  className="top-picks-container"
                  style={{ marginTop: "25px" }}
                >
                  {activePools.slice(4, 5).map((pool, index) => (
                    <TopPoolsCard
                      network={chainId}
                      display={
                        pool.expired
                          ? pool.expired === "Yes"
                            ? "none"
                            : ""
                          : ""
                      }
                      expired={false}
                      key={index}
                      chain={chain}
                      top_pick={pool.top_pick}
                      tokenName={
                        pool.tokenName
                          ? pool.tokenName
                          : pool.pair_name
                          ? pool.pair_name
                          : ""
                      }
                      apr={pool.apy_percent + "%"}
                      tvl={
                        pool.tvl_usd === "--"
                          ? pool.tvl_usd
                          : "$" + getFormattedNumber(pool.tvl_usd)
                      }
                      lockTime={
                        pool.lockTime
                          ? pool.lockTime
                          : pool.lock_time
                          ? pool.lock_time
                          : locktimeFarm[index]
                      }
                      tokenLogo={
                        pool.icon
                          ? pool.icon
                          : pool.pair_name === "iDYP"
                          ? "idypius.svg"
                          : "dyplogo.svg"
                      }
                      onShowDetailsClick={() => {
                        setActiveCard(null);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCard5(topPools[index + 4]);
                        setActiveCard6(null);
                        setActiveCard7(null);
                        setActiveCard8(null);
                        setActiveCard9(null);
                        setActiveCard10(null);
                        setActiveCard11(null);
                        setActiveCard12(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(index + 4);
                        handleCardIndexStake30(index + 4);
                        handleCardIndexStakeiDyp(index + 4);
                        setDetails(index + 4);
                        setselectedPool(pool);
                        setShowDetails(true);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard5(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === index + 4 ? true : false}
                      isNewPool={pool.new_pool === "Yes" ? true : false}
                      isStaked={
                        userPools.length > 0
                          ? userPools.find(
                              (obj) => obj.contract_address === pool.id
                            )
                            ? true
                            : false
                          : false
                      }
                      isPremium={isPremium}
                    />
                  ))}
                </div>
                {
                  // activeCard5 &&
                  // topList === "Staking" &&
                  // chain === "avax" &&
                  // activePools[cardIndex]?.id ===
                  //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                  //   <StakeAvaxIDyp
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultavax}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idypavax_7}
                  //     listType={listType}
                  //     finalApr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_performancefee
                  //         : expiredDYPPools[cardIndex]?.apy_performancefee
                  //     }
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={avax_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // ) :

                  //  : activeCard5 &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                  //   topList === "Staking" &&
                  //   chain === "bnb" ? (
                  //   <StakeBscIDyp
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultbsc}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_stakingidyp_7}
                  //     listType={listType}
                  //     finalApr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_performancefee
                  //         : expiredDYPPools[cardIndex]?.apy_performancefee
                  //     }
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={wbsc_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={0}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : parseInt(
                  //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //               )
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : parseInt(
                  //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //             )
                  //         : "No Lock"
                  //     }
                  //   />
                  // )
                  // activeCard5 &&
                  //   topList === "Staking" &&
                  //   chain === "eth" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                  //   <InitConstantStakingiDYP
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_result}
                  //     lp_id={lp_id[cardIndex]}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idyp_5}
                  //     listType={listType}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={eth_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={withdrawFeeiDyp[cardIndex]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // ) :
                  activeCard5 && topList === "Vault" && chain === "eth" ? (
                    <Vault
                      vault={vaultArrayNew[cardIndex]}
                      token={tokenvaultArrayNew[cardIndex]}
                      platformTokenApyPercent={vaultplatformArrayNew[cardIndex]}
                      UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex]}
                      UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex]}
                      expiration_time={"1 August 2024"}
                      coinbase={coinbase}
                      lockTime={"No Lock"}
                      handleConnection={handleConnection}
                      chainId={chainId}
                      listType={listType}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      isConnected={isConnected}
                      the_graph_result={the_graph_result}
                    />
                  ) : (
                    <></>
                  )
                }
              </>
              <>
                <div
                  className="top-picks-container"
                  style={{ marginTop: activePools.length >= 7 && "25px" }}
                >
                  {activePools.slice(5, 6).map((pool, index) => (
                    <TopPoolsCard
                      network={chainId}
                      display={
                        pool.expired
                          ? pool.expired === "Yes"
                            ? "none"
                            : ""
                          : ""
                      }
                      expired={false}
                      key={index}
                      chain={chain}
                      top_pick={pool.top_pick}
                      tokenName={
                        pool.tokenName
                          ? pool.tokenName
                          : pool.pair_name
                          ? pool.pair_name
                          : ""
                      }
                      apr={pool.apy_percent + "%"}
                      tvl={
                        pool.tvl_usd === "--"
                          ? pool.tvl_usd
                          : "$" + getFormattedNumber(pool.tvl_usd)
                      }
                      lockTime={
                        pool.lockTime
                          ? pool.lockTime
                          : pool.lock_time
                          ? pool.lock_time
                          : locktimeFarm[index]
                      }
                      tokenLogo={
                        pool.icon
                          ? pool.icon
                          : pool.pair_name === "iDYP"
                          ? "idypius.svg"
                          : "dyplogo.svg"
                      }
                      onShowDetailsClick={() => {
                        setActiveCard(null);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCard5(null);
                        setActiveCard6(topPools[index + 5]);
                        setActiveCard7(null);
                        setActiveCard8(null);
                        setActiveCard9(null);
                        setActiveCard10(null);
                        setActiveCard11(null);
                        setActiveCard12(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(index + 5);
                        handleCardIndexStake30(index + 5);
                        handleCardIndexStakeiDyp(index + 5);
                        setDetails(index + 5);
                        setselectedPool(pool);
                        setShowDetails(true);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard6(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === index + 5 ? true : false}
                      isNewPool={pool.new_pool === "Yes" ? true : false}
                      isStaked={
                        userPools.length > 0
                          ? userPools.find(
                              (obj) => obj.contract_address === pool.id
                            )
                            ? true
                            : false
                          : false
                      }
                      isPremium={isPremium}
                    />
                  ))}
                </div>
                {
                  // activeCard6 &&
                  // topList === "Staking" &&
                  // chain === "avax" &&
                  // activePools[cardIndex]?.id ===
                  //   "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                  //   <StakeAvaxIDyp
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultavax}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idypavax_7}
                  //     listType={listType}
                  //     finalApr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_performancefee
                  //         : expiredDYPPools[cardIndex]?.apy_performancefee
                  //     }
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={avax_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // ) :

                  // : activeCard6 &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                  //   topList === "Staking" &&
                  //   chain === "bnb" ? (
                  //   <StakeBscIDyp
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_resultbsc}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_stakingidyp_7}
                  //     listType={listType}
                  //     finalApr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_performancefee
                  //         : expiredDYPPools[cardIndex]?.apy_performancefee
                  //     }
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={wbsc_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={0}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : parseInt(
                  //                 activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //               )
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : parseInt(
                  //               expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //             )
                  //         : "No Lock"
                  //     }
                  //   />
                  // )
                  // activeCard6 &&
                  //   topList === "Staking" &&
                  //   chain === "eth" &&
                  //   activePools[cardIndex]?.id ===
                  //     "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                  //   <InitConstantStakingiDYP
                  //     is_wallet_connected={isConnected}
                  //     coinbase={coinbase}
                  //     the_graph_result={the_graph_result}
                  //     lp_id={lp_id[cardIndex]}
                  //     chainId={chainId}
                  //     handleConnection={handleConnection}
                  //     handleSwitchNetwork={handleSwitchNetwork}
                  //     expired={false}
                  //     staking={window.constant_staking_idyp_5}
                  //     listType={listType}
                  //     finalApr={activePools[cardIndex]?.apy_performancefee}
                  //     apr={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.apy_percent
                  //         : expiredDYPPools[cardIndex]?.apy_percent
                  //     }
                  //     liquidity={eth_address}
                  //     expiration_time={"18 July 2024"}
                  //     other_info={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.expired === "Yes"
                  //             ? true
                  //             : false
                  //           : expiredDYPPools[cardIndex]?.expired === "Yes"
                  //           ? true
                  //           : false
                  //         : false
                  //     }
                  //     fee_s={
                  //       expiredPools === false
                  //         ? activePools[cardIndex]?.performancefee
                  //         : expiredDYPPools[cardIndex]?.performancefee
                  //     }
                  //     fee_u={withdrawFeeiDyp[cardIndex]}
                  //     lockTime={
                  //       cardIndex !== undefined
                  //         ? expiredPools === false
                  //           ? activePools[cardIndex]?.lock_time?.split(" ")[0] ===
                  //             "No"
                  //             ? "No Lock"
                  //             : activePools[cardIndex]?.lock_time?.split(" ")[0]
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(
                  //               " "
                  //             )[0] === "No"
                  //           ? "No Lock"
                  //           : expiredDYPPools[cardIndex]?.lock_time?.split(" ")[0]
                  //         : "No Lock"
                  //     }
                  //   />
                  // ) :
                  activeCard6 &&
                  cardIndex >= 0 &&
                  topList === "Staking" &&
                  chain === "eth" ? (
                    <InitConstantStakingiDYP
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_result}
                      lp_id={lp_id[cardIndex]}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      staking={stakeArrayiDYPActive[cardIndex]}
                      finalApr={
                        expiredPools === false
                          ? activePools[cardIndex]?.apy_performancefee
                          : expiredDYPPools[cardIndex]?.apy_performancefee
                      }
                      apr={
                        expiredPools === false
                          ? activePools[cardIndex]?.apy_percent
                          : expiredDYPPools[cardIndex]?.apy_percent
                      }
                      liquidity={eth_address}
                      expiration_time={expirationArray[cardIndex]}
                      other_info={
                        cardIndex !== undefined
                          ? expiredPools === false
                            ? activePools[cardIndex]?.expired === "Yes"
                              ? true
                              : false
                            : expiredDYPPools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : false
                      }
                      fee_s={
                        expiredPools === false
                          ? activePools[cardIndex]?.performancefee
                          : expiredDYPPools[cardIndex]?.performancefee
                      }
                      fee_u={withdrawFeeiDyp[cardIndex]}
                    />
                  ) : activeCard6 &&
                    topList === "Staking" &&
                    chain === "avax" &&
                    cardIndex >= 5 ? (
                    <StakeAvaxIDyp
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_resultavax}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      staking={
                        expiredPools === false
                          ? stakingarrayStakeAvaxiDypActive[cardIndex - 2]
                          : stakingarrayStakeAvaxiDypExpired[cardIndex - 3]
                      }
                      listType={listType}
                      finalApr={
                        expiredPools === false
                          ? activePools[cardIndex]?.apy_performancefee
                          : expiredDYPPools[cardIndex]?.apy_performancefee
                      }
                      apr={
                        expiredPools === false
                          ? activePools[cardIndex]?.apy_percent
                          : expiredDYPPools[cardIndex]?.apy_percent
                      }
                      liquidity={avax_address}
                      expiration_time={expirearrayStakeAvaxiDyp[cardIndex]}
                      other_info={
                        cardIndex !== undefined
                          ? expiredPools === false
                            ? activePools[cardIndex]?.expired === "Yes"
                              ? true
                              : false
                            : expiredDYPPools[cardIndex]?.expired === "Yes"
                            ? true
                            : false
                          : false
                      }
                      fee_s={
                        expiredPools === false
                          ? activePools[cardIndex]?.performancefee
                          : expiredDYPPools[cardIndex]?.performancefee
                      }
                      fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                      lockTime={
                        cardIndex !== undefined
                          ? expiredPools === false
                            ? activePools[cardIndex]?.lock_time?.split(
                                " "
                              )[0] === "No"
                              ? "No Lock"
                              : activePools[cardIndex]?.lock_time?.split(" ")[0]
                            : expiredDYPPools[cardIndex]?.lock_time?.split(
                                " "
                              )[0] === "No"
                            ? "No Lock"
                            : expiredDYPPools[cardIndex]?.lock_time?.split(
                                " "
                              )[0]
                          : "No Lock"
                      }
                    />
                  ) : (
                    <></>
                  )
                }
              </>
              <>
                <div
                  className="top-picks-container"
                  style={{ marginTop: activePools.length >= 8 && "25px" }}
                >
                  {activePools.slice(6, 7).map((pool, index) => (
                    <TopPoolsCard
                      network={chainId}
                      display={
                        pool.expired
                          ? pool.expired === "Yes"
                            ? "none"
                            : ""
                          : ""
                      }
                      expired={false}
                      key={index}
                      chain={chain}
                      top_pick={pool.top_pick}
                      tokenName={
                        pool.tokenName
                          ? pool.tokenName
                          : pool.pair_name
                          ? pool.pair_name
                          : ""
                      }
                      apr={pool.apy_percent + "%"}
                      tvl={
                        pool.tvl_usd === "--"
                          ? pool.tvl_usd
                          : "$" + getFormattedNumber(pool.tvl_usd)
                      }
                      lockTime={
                        pool.lockTime
                          ? pool.lockTime
                          : pool.lock_time
                          ? pool.lock_time
                          : locktimeFarm[index]
                      }
                      tokenLogo={
                        pool.icon
                          ? pool.icon
                          : pool.pair_name === "iDYP"
                          ? "idypius.svg"
                          : "dyplogo.svg"
                      }
                      onShowDetailsClick={() => {
                        setActiveCard(null);
                        setActiveCard2(null);
                        setActiveCard3(null);
                        setActiveCard4(null);
                        setActiveCard5(null);
                        setActiveCard6(null);
                        setActiveCard7(topPools[index + 6]);
                        setActiveCard8(null);
                        setActiveCard9(null);
                        setActiveCard10(null);
                        setActiveCard11(null);
                        setActiveCard12(null);
                        setActiveCardNFT(false);
                        setActiveCardLandNFT(false);
                        handleCardIndexStake(index + 6);
                        handleCardIndexStake30(index + 6);
                        handleCardIndexStakeiDyp(index + 6);
                        setDetails(index + 6);
                        setselectedPool(pool);
                        setShowDetails(true);
                      }}
                      onHideDetailsClick={() => {
                        setActiveCard7(null);
                        setDetails();
                      }}
                      cardType={topList}
                      details={details === index + 6 ? true : false}
                      isNewPool={pool.new_pool === "Yes" ? true : false}
                      isStaked={
                        userPools.length > 0
                          ? userPools.find(
                              (obj) => obj.contract_address === pool.id
                            )
                            ? true
                            : false
                          : false
                      }
                      isPremium={isPremium}
                    />
                  ))}
                </div>
              </>
            </div>
          )
        ) : (
          <div className="list-pools-container px-0">
            {topList === "Farming" &&
              chain === "bnb" &&
              expiredPools === false && (
                <TopPoolsListCard
                  theBnbPool={theBnbPool}
                  the_graph_resultbsc={the_graph_resultbsc}
                  expired={false}
                  chain={chain}
                  top_pick={false}
                  tokenName={"WBNB"}
                  apr={"3%"}
                  tvl={"$20,000"}
                  lockTime={"3 Days"}
                  cardType={topList}
                  tokenLogo={"bnb.svg"}
                  listType={listType}
                  onShowDetailsClick={() => {
                    setActiveCardNFT(false);
                    setActiveCardLandNFT(false);
                    setActiveCard(topPools[0]);
                    setActiveCard2(null);
                    setActiveCard3(null);
                    setActiveCard4(null);
                    setDetails();
                  }}
                  onHideDetailsClick={() => {
                    setActiveCardNFT(false);
                    setDetails();
                  }}
                  showDetails={activeCardNFT}
                  topList={topList}
                  coinbase={coinbase}
                  cardIndex={1}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  isPremium={isPremium}
                />
              )}

            {topList === "Farming" &&
              chain === "avax" &&
              expiredPools === false && (
                <TopPoolsListCard
                  theBnbPool={theBnbPool}
                  the_graph_resultavax={the_graph_resultavax}
                  expired={false}
                  chain={chain}
                  top_pick={false}
                  tokenName={"WAVAX"}
                  apr={"8%"}
                  tvl={"$60,000"}
                  lockTime={"3 Days"}
                  cardType={topList}
                  tokenLogo={"avax.svg"}
                  listType={listType}
                  onShowDetailsClick={() => {
                    setActiveCardNFT(false);
                    setActiveCardLandNFT(false);
                    setActiveCard(topPools[0]);
                    setActiveCard2(null);
                    setActiveCard3(null);
                    setActiveCard4(null);
                    setDetails();
                  }}
                  onHideDetailsClick={() => {
                    setActiveCardNFT(false);
                    setDetails();
                  }}
                  showDetails={activeCardNFT}
                  topList={topList}
                  coinbase={coinbase}
                  cardIndex={1}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  isPremium={isPremium}
                />
              )}

            {activePools.map((pool, index) => (
              <TopPoolsListCard
                key={index}
                theBnbPool={theBnbPool}
                expiredPools={expiredDYPPools}
                activePools={activePools}
                expired={false}
                chain={chain}
                top_pick={pool.top_pick}
                tokenName={
                  pool.tokenName
                    ? pool.tokenName
                    : pool.pair_name
                    ? pool.pair_name
                    : ""
                }
                apr={pool.apy_percent + "%"}
                tvl={
                  pool.tvl_usd === "--"
                    ? pool.tvl_usd
                    : "$" + getFormattedNumber(pool.tvl_usd)
                }
                lockTime={
                  pool.lockTime
                    ? pool.lockTime
                    : pool.lock_time
                    ? pool.lock_time
                    : locktimeFarm[index]
                }
                cardType={topList}
                tokenLogo={
                  pool.icon
                    ? pool.icon
                    : pool.pair_name === "iDYP"
                    ? "idypius.svg"
                    : "dyplogo.svg"
                }
                listType={listType}
                onShowDetailsClick={() => {
                  setActiveCard(topPools[index]);
                  handleCardIndexStake(index);
                  handleCardIndexStake30(index);
                  handleCardIndexStakeiDyp(index);
                  setselectedPool(pool);
                  setShowDetails(true);
                }}
                onHideDetailsClick={() => {
                  setActiveCard(null);
                }}
                showDetails={showDetails}
                topList={topList}
                cardIndex={index + 1}
                chainId={chainId}
                handleConnection={handleConnection}
                handleSwitchNetwork={handleSwitchNetwork}
                coinbase={coinbase}
                referrer={referrer}
                lp_id={lp_id[cardIndex]}
                the_graph_result={the_graph_result}
                the_graph_resultbsc={the_graph_resultbsc}
                isConnected={isConnected}
                the_graph_resultavax={the_graph_resultavax}
                display={
                  pool.expired
                    ? pool.expired === "Yes"
                      ? "none"
                      : "flex"
                    : "flex"
                }
                isNewPool={pool.new_pool === "Yes" ? true : false}
                totalTvl={pool.tvl_usd}
                isPremium={isPremium}
              />
            ))}
          </div>
        )}
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
                  "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" &&
                topList === "Staking" &&
                chain === "bnb" ? (
                  <StakeBscIDyp
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_stakingidyp_7}
                    listType={listType}
                    finalApr={selectedPool?.apy_performancefee}
                    apr={selectedPool?.apy_percent}
                    liquidity={wbsc_address}
                    expiration_time={"18 July 2024"}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    fee_u={0}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                  />
                ) : activeCard &&
                  topList === "Staking" &&
                  chain === "eth" &&
                  selectedPool?.id ===
                    "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
                  <InitConstantStakingiDYP
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    lp_id={lp_id[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_staking_idyp_5}
                    listType={listType}
                    finalApr={selectedPool?.apy_performancefee}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"18 July 2024"}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    fee_u={withdrawFeeiDyp[cardIndex]}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                  />
                ) : activeCard &&
                  topList === "Staking" &&
                  chain === "avax" &&
                  selectedPool?.id ===
                    "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
                  <StakeAvaxIDyp
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultavax}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    staking={window.constant_staking_idypavax_7}
                    listType={listType}
                    finalApr={selectedPool.apy_performancefee}
                    apr={selectedPool?.apy_percent}
                    liquidity={avax_address}
                    expiration_time={"18 July 2024"}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                  />
                ) : activeCard &&
                  topList === "Staking" &&
                  selectedPool?.id ===
                    "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                  chain === "bnb" ? (
                  <StakeDypiusBsc
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_bsc1}
                    apr={selectedPool?.apy_percent}
                    liquidity={wbsc_address}
                    expiration_time={"09 November 2024"}
                    finalApr={selectedPool?.apy_performancefee}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    listType={listType}
                    other_info={false}
                    fee={selectedPool?.performancefee}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    referrer={referrer}
                  />
                ) : activeCard &&
                  topList === "Staking" &&
                  selectedPool?.id ===
                    "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                  chain === "avax" ? (
                  <StakeDypiusAvax
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_avax1}
                    apr={selectedPool?.apy_percent}
                    liquidity={avax_address}
                    expiration_time={"09 November 2024"}
                    finalApr={selectedPool?.apy_performancefee}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    listType={listType}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultavax}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    referrer={referrer}
                  />
                ) : activeCard &&
                  topList === "Staking" &&
                  selectedPool?.id ===
                    "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                  chain === "eth" ? (
                  <StakeDypiusEth
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_eth1}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"09 November 2024"}
                    finalApr={selectedPool?.apy_performancefee}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    listType={listType}
                    other_info={false}
                    fee={selectedPool?.performancefee}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={false}
                    referrer={referrer}
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

export default EarnTopPicks;
