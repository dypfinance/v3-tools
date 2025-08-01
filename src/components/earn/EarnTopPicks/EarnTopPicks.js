import React, { useEffect, useRef, useState } from "react";
import { FadeLoader } from "react-spinners";
import useWindowSize from "../../../functions/useWindowSize";
import axios from "axios";
import getFormattedNumber from "../../../functions/getFormattedNumber2";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { ClickAwayListener } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

import TopPoolsCard from "../../top-pools-card/TopPoolsCard";
import TopPoolsListCard from "../../top-pools-card/TopPoolsListCard";
import InitConstantStakingiDYP from "../../FARMINNG/constant-staking-idyp-new-front";
import StakeAvaxIDyp from "../../FARMINNG/stakeAvaxiDyp";
import StakeBscIDyp from "../../FARMINNG/bscConstantStakeiDyp";
import StakeDypiusEth from "../../FARMINNG/constant-staking-dypius-new";
import StakeDypiusEth1Phase2 from "../../FARMINNG/stakingDypiusEth1Phase2";
import StakeDypiusEth2Phase2 from "../../FARMINNG/stakingDypiusEth2Phase2";
import StakeDypiusEth3Phase2 from "../../FARMINNG/stakingDypiusEth3Phase2";
import Vault from "../../FARMINNG/vault-new";
import BscFarmingFunc from "../../FARMINNG/BscFarmingFunc";
import StakeDypiusBsc from "../../FARMINNG/bscConstantStakeDypius";
import StakeDypiusAvax from "../../FARMINNG/stakeDypiusAvax";
import StakingDypiusBase1 from "../../FARMINNG/stakingDypiusBase1";
import "../../../components/switch-chain-modal/_switchmodal.scss";

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
  onConnectWallet,
  onChainSelect,
  binanceW3WProvider,
  handleSwitchChainBinanceWallet,
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
  const [ethPools, setEthPools] = useState([]);
  const [bnbPools, setBnbPools] = useState([]);
  const [basePools, setBasePools] = useState([]);

  const [avaxPools, setAvaxPools] = useState([]);

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
  const [resultFilteredPool, setresultFilteredPool] = useState([]);
  const [selectedIndex, setselectedIndex] = useState();

  const [aprTooltip, setaprTooltip] = useState(false);
  const [selectedchain, setselectedchain] = useState(chain);
  const [selectedpoolType, setselectedpoolType] = useState("");

  const [ethPoolsDyp, setethPoolsDyp] = useState([]);
  const [ethPoolsiDyp, setethPoolsiDyp] = useState([]);
  const [ethPoolsiDypExpired, setethPoolsiDypExpired] = useState([]);
  const [ethPoolsDypExpired, setethPoolsDypExpired] = useState([]);

  const [bnbPoolsDyp, setbnbPoolsDyp] = useState([]);
  const [bnbPoolsiDyp, setbnbPoolsiDyp] = useState([]);
  const [bnbPoolsiDypExpired, setbnbPoolsiDypExpired] = useState([]);
  const [bnbPoolsDypExpired, setbnbPoolsDypExpired] = useState([]);

  const [avaxPoolsDyp, setavaxPoolsDyp] = useState([]);
  const [avaxPoolsiDyp, setavaxPoolsiDyp] = useState([]);
  const [avaxPoolsiDypExpired, setavaxPoolsiDypExpired] = useState([]);
  const [avaxPoolsDypExpired, setavaxPoolsDypExpired] = useState([]);

  const [basePoolsDyp, setbasePoolsDyp] = useState([]);
  const [basePoolsiDyp, setbaseoolsiDyp] = useState([]);
  const [basePoolsiDypExpired, setbasePoolsiDypExpired] = useState([]);

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

  const phase2_pools = [
    {
      id: "0x1f5c3f186795c84265eD826AD09924D0987485ba",
      apy_percent: 20,
      tvl_usd: 46682.3565666875,
      link_logo: "https://www.dypius.com/logo192.png",
      link_pair: "https://app.dyp.finance/constant-staking-3",
      pool_name: "DYP Constant Staking ETH",
      pair_name: "DYP",
      return_types: "DYP",
      lock_time: "90 days",
      expired: "No",
      new_pool: "Yes",
      apy_performancefee: 20,
      performancefee: 0,
      type: "dyp",
      chain: "eth",
    },
    {
      id: "0x11666850EA73956afcd014E86eD2AE473939421d",
      apy_percent: 35,
      tvl_usd: 462.3565666875,
      link_logo: "https://www.dypius.com/logo192.png",
      link_pair: "https://app.dyp.finance/constant-staking-3",
      pool_name: "DYP Constant Staking ETH",
      pair_name: "DYP",
      return_types: "DYP",
      lock_time: "180 days",
      expired: "No",
      new_pool: "Yes",
      apy_performancefee: 35,
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
        })
        .catch((e) => {
          console.log(e);
        });
      setuserPools(result);
    }
  };

  const aprOpen = () => {
    setaprTooltip(true);
  };
  const aprClose = () => {
    setaprTooltip(false);
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
      const dypIdyp = eth_result.data.stakingInfoiDYPEth;
      const dypData = eth_result2.data.stakingInfoDYPEth;

      const ethexpired = dypIdyp.filter((item) => {
        return item.id === "0x41b8a58f4307ea722ad0a964966caa18a6011d93";
      });

      const ethexpiredDyp = dypData.filter((item) => {
        return item.id === "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0";
      });

      const objectexpired = ethexpired.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "eth" };
      });

      const objectexpiredDyp = ethexpiredDyp.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "eth" };
      });

      setethPoolsiDypExpired(objectexpired);
      setethPoolsDypExpired(objectexpiredDyp);

      // const object2_phase2 = phase2_pools.filter((pools) => {
      //   return pools.type === "dyp";
      // });

      const object2 = [...dypData].map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "eth" };
      });

      const activeEth = dypIdyp.filter((item) => {
        return item.expired !== "Yes";
      });
      const object2activeEth = [...activeEth].map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "eth" };
      });

      const activeEth2 = object2.filter((item) => {
        return item.expired !== "Yes";
      });

      const allActiveEth = [...activeEth2, ...object2activeEth];

      const sortedActive = [...allActiveEth].sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });
      setethPoolsDyp([...activeEth2]);
      setethPoolsiDyp(object2activeEth);
      setEthPools(sortedActive);
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
      const dypIdypBnb = bnb_result.data.stakingInfoiDYPBnb;
      const dypBnb = bnb_result2.data.stakingInfoDYPBnb;

      const expiredBnb = dypIdypBnb.filter((item) => {
        return item.id === "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d";
      });

      const expiredBnbDYP = dypBnb.filter((item) => {
        return item.id === "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603";
      });

      const object2expired = expiredBnb.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "bnb" };
      });

      const object2expiredDyp = expiredBnbDYP.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "bnb" };
      });

      setbnbPoolsiDypExpired(object2expired);
      setbnbPoolsDypExpired(object2expiredDyp);

      const object2 = dypBnb.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "bnb" };
      });

      const activeBnb = dypIdypBnb.filter((item) => {
        return item.expired !== "Yes";
      });

      const object2Idyp = activeBnb.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "bnb" };
      });

      const activeBnb2 = object2.filter((item) => {
        return item.expired === "No";
      });

      const allActiveBnb = [...object2Idyp, ...activeBnb2];
      const sortedActive = allActiveBnb.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });

      setbnbPoolsDyp(activeBnb2);
      setbnbPoolsiDyp(object2Idyp);
      setBnbPools(sortedActive);
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
      const dypIdypAvax = avax_result.data.stakingInfoiDYPAvax;
      const dypAvax = avax_result2.data.stakingInfoDYPAvax;

      const expiredAvax = dypIdypAvax.filter((item) => {
        return item.id === "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d";
      });

      const expiredAvaxDyp = dypIdypAvax.filter((item) => {
        return item.id === "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603";
      });

      const objectexpiredAvax = expiredAvax.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "avax" };
      });

      const objectexpiredAvaxDyp = expiredAvaxDyp.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "avax" };
      });

      setavaxPoolsiDypExpired(objectexpiredAvax);
      setavaxPoolsDypExpired(objectexpiredAvaxDyp);

      const object2 = dypAvax.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "avax" };
      });

      const activeAvax = dypIdypAvax.filter((item) => {
        return item.expired !== "Yes";
      });
      const object2activeAvax = activeAvax.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "avax" };
      });

      const activeAvax2 = object2.filter((item) => {
        return item.expired !== "Yes";
      });

      const allActiveAvax = [...object2activeAvax, ...activeAvax2];

      setavaxPoolsDyp(activeAvax2);
      setavaxPoolsiDyp(object2activeAvax);

      const sortedActive = allActiveAvax.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });
      setAvaxPools(sortedActive);
    }
  };

  const fetchBaseStaking = async () => {
    const base_result = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_base_new`)
      .catch((err) => {
        console.log(err);
      });

    if (base_result && base_result.status === 200) {
      const dypbase = base_result.data.stakingInfoDYPBASE;
      if (dypbase) {
        const object2 = dypbase.map((item) => {
          return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "base" };
        });

        const activebase = object2.filter((item) => {
          return item.expired === "Yes";
        });

        const allActivebase = [...activebase];

        setbasePoolsDyp(allActivebase);

        const sortedActive = allActivebase.sort(function (a, b) {
          return b.apy_percent - a.apy_percent;
        });
        setBasePools(sortedActive);
      }
    }
  };

  const fetchBaseStaking2 = async () => {
    const base_result = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_base_new`)
      .catch((err) => {
        console.log(err);
      });

    if (base_result && base_result.status === 200) {
      const dypData = base_result.data.stakingInfoDYPBASE;

      // const object2_phase2 = phase2_pools.filter((pools) => {
      //   return pools.type === "dyp";
      // });
      if (dypData) {
        const object2 = [...dypData].map((item) => {
          return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "base" };
        });

        const activeEth2 = object2.filter((item) => {
          return item.expired === "Yes";
        });

        const allActiveEth = activeEth2;

        const sortedActiveDYP = allActiveEth.sort(function (a, b) {
          return b.apy_percent - a.apy_percent;
        });

        setExpiredPools([sortedActiveDYP[0]]);
        setTopPools([...sortedActiveDYP, ...activeEth2]);
      }
    }
  };

  const fetchEthStaking2 = async () => {
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
      const dypIdyp = eth_result.data.stakingInfoiDYPEth;
      const dypData = eth_result2.data.stakingInfoDYPEth;

      const ethexpired = dypIdyp.filter((item) => {
        return item.id === "0x41b8a58f4307ea722ad0a964966caa18a6011d93";
      });

      const ethexpiredDyp = dypData.filter((item) => {
        return item.id === "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0";
      });

      // const object2_phase2 = phase2_pools.filter((pools) => {
      //   return pools.type === "dyp";
      // });

      const object2 = [...dypData].map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "eth" };
      });

      const activeEth = dypIdyp.filter((item) => {
        return item.expired !== "Yes";
      });

      const object2activeEth = [...activeEth].map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "eth" };
      });

      const objectexpired = ethexpired.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "eth" };
      });

      const objectexpiredDyp = ethexpiredDyp.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "eth" };
      });

      setethPoolsiDypExpired(objectexpired);
      setethPoolsDypExpired(objectexpiredDyp);

      const activeEth2 = object2.filter((item) => {
        return item.expired !== "Yes";
      });

      const allActiveEth = activeEth2;

      const sortedActive = allActiveEth.sort(function (a, b) {
        return b.tvl_usd - a.tvl_usd;
      });

      const sortedActiveDYP = [...activeEth2].sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });

      const sortedActiveiDYP = object2activeEth.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });

      setActivePools(sortedActiveDYP);
      setTopPools([...object2activeEth, ...activeEth2]);
      setExpiredPools([...objectexpired, ...objectexpiredDyp]);
      setCawsCard(eth_result.data.stakingInfoCAWS);
      setCawsCard2(eth_result.data.stakingInfoCAWS[0]);
      setLandCard(eth_result.data.stakingInfoLAND[0]);
      const land = eth_result.data.stakinginfoCAWSLAND[0];
      setCawsLandCard(land);
    }
  };

  const fetchBnbStaking2 = async () => {
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
      const dypIdypBnb = bnb_result.data.stakingInfoiDYPBnb;

      const dypBnb = bnb_result2.data.stakingInfoDYPBnb;

      const object2 = dypBnb.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "bnb" };
      });

      const expiredBnb = dypIdypBnb.filter((item) => {
        return item.id === "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d";
      });

      const expiredBnbDYP = dypBnb.filter((item) => {
        return item.id === "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603";
      });

      const activeBnb = dypIdypBnb.filter((item) => {
        return item.expired !== "Yes";
      });

      const object2activeBnb = activeBnb.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "bnb" };
      });

      const activeBnb2 = object2.filter((item) => {
        return item.expired === "No";
      });

      const expiredBnb2 = object2.filter((item) => {
        return item.expired === "Yes";
      });

      const object2expired = expiredBnb.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "bnb" };
      });

      const object2expiredDyp = expiredBnbDYP.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "bnb" };
      });

      setbnbPoolsiDypExpired(object2expired);
      setbnbPoolsDypExpired(object2expiredDyp);

      const allActiveBnb = [...object2activeBnb, ...activeBnb2];
      const allExpireBnb = [...object2expired, ...object2expiredDyp];

      const sortedActive = allActiveBnb.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });
      const sortedExpired = allExpireBnb.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });

      const sortedActiveDYP = activeBnb2.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });

      const sortedActiveiDYP = object2activeBnb.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });
      const allpools = [...sortedActiveDYP, ...sortedActiveiDYP];

      setActivePools(allpools);
      setExpiredPools(sortedExpired);
      setTopPools([...dypIdypBnb, ...object2]);
    }
  };
  const fetchAvaxStaking2 = async () => {
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
      const dypIdypAvax = avax_result.data.stakingInfoiDYPAvax;
      const dypAvax = avax_result2.data.stakingInfoDYPAvax;
      const object2 = dypAvax.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "avax" };
      });

      const expiredAvax = dypIdypAvax.filter((item) => {
        return item.id === "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d";
      });

      const expiredAvaxDyp = dypAvax.filter((item) => {
        return item.id === "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603";
      });

      const activeAvax = dypIdypAvax.filter((item) => {
        return item.expired !== "Yes";
      });

      const object2activeAvax = activeAvax.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "avax" };
      });

      const objectexpiredAvax = expiredAvax.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "idyp", chain: "avax" };
      });

      const objectexpiredAvaxDyp = expiredAvaxDyp.map((item) => {
        return { ...item, tvl_usd: item.tvl_usd, type: "dyp", chain: "avax" };
      });

      setavaxPoolsiDypExpired(objectexpiredAvax);
      setavaxPoolsDypExpired(objectexpiredAvaxDyp);

      const activeAvax2 = object2.filter((item) => {
        return item.expired !== "Yes";
      });

      const allActiveAvax = [...activeAvax2];

      const sortedActive = allActiveAvax.sort(function (a, b) {
        return b.apy_percent - a.apy_percent;
      });

      setExpiredPools([...objectexpiredAvax, ...objectexpiredAvaxDyp]);
      setActivePools(sortedActive);
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

        // setExpiredPools(sortedExpired);
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

        // setExpiredPools(sortedExpired);
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

        // setExpiredPools(sortedExpired);
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

  const getClassName = (
    chain,
    locktimeToCheck,
    tokentype,
    selectedPool,
    ethDypPool,
    baseDypPool,

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
    }
    if (chain === "base") {
      if (tokentype === "dyp") {
        if (locktimeToCheck === selectedPool.lock_time) {
          return "method-btn-active";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          baseDypPool?.find((obj) => {
            return obj.lock_time === locktimeToCheck;
          })
        ) {
          return "method-btn";
        } else if (
          locktimeToCheck !== selectedPool.lock_time &&
          !baseDypPool?.find((obj) => {
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

    // if (lockTime === dynamicLockTime) return 'method-btn-active';

    // const poolHasDynamicLock = poolsDyp?.some(obj => obj.lock_time === dynamicLockTime);
    // const pooliDypHasDynamicLock = poolsiDyp?.some(obj => obj.lock_time === dynamicLockTime);

    // if (lockTime !== dynamicLockTime) {
    //   if (poolType === 'dyp') {
    //     return poolHasDynamicLock ? 'method-btn' : 'method-btn-disabled';
    //   } else if (poolType === 'idyp') {
    //     return pooliDypHasDynamicLock ? 'method-btn' : 'method-btn-disabled';
    //   }
    // }

    // return 'method-btn-disabled';
  };

  const handleSelectPool = (
    id,
    selectedchain,
    locktime,
    selectedpoolType,
    ethPoolsDyp,
    basePoolsDyp,
    ethPoolsiDyp,
    bnbPoolsDyp,
    bnbPoolsiDyp,
    avaxPoolsDyp,
    avaxPoolsiDyp
  ) => {
    if (selectedchain === "eth") {
      if (id) {
        if (selectedpoolType === "dyp") {
          const result = ethPoolsDyp.filter((item) => {
            return (
              item.lock_time === locktime &&
              item.id?.toLowerCase() === id.toLowerCase()
            );
          });

          const result2 = ethPoolsDyp.filter((item) => {
            return item.lock_time === locktime;
          });

          if (result) {
            setresultFilteredPool(result2);
            setselectedPool(...result);
          }
        } else if (selectedpoolType === "idyp") {
          const result = ethPoolsiDyp.filter((item) => {
            return (
              item.lock_time === locktime &&
              item.id?.toLowerCase() === id.toLowerCase()
            );
          });
          const result2 = ethPoolsDyp.filter((item) => {
            return item.lock_time === locktime;
          });
          if (result) {
            setresultFilteredPool(result2);
            setselectedPool(...result);
          }
        }
      } else {
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
      }
    }
    if (selectedchain === "base") {
      if (id) {
        if (selectedpoolType === "dyp") {
          const result = basePoolsDyp.filter((item) => {
            return (
              item.lock_time === locktime &&
              item.id?.toLowerCase() === id.toLowerCase()
            );
          });
          const result2 = basePoolsDyp.filter((item) => {
            return item.lock_time === locktime;
          });
          if (result) {
            setresultFilteredPool(result2);
            setselectedPool(...result);
          }
        } else if (selectedpoolType === "idyp") {
          const result = basePoolsDyp.filter((item) => {
            return (
              item.lock_time === locktime &&
              item.id?.toLowerCase() === id.toLowerCase()
            );
          });
          const result2 = basePoolsDyp.filter((item) => {
            return item.lock_time === locktime;
          });
          if (result) {
            setresultFilteredPool(result2);

            setselectedPool(...result);
          }
        }
      } else {
        if (selectedpoolType === "dyp") {
          const result = basePoolsDyp.filter((item) => {
            return item.lock_time === locktime;
          });

          if (result) {
            setresultFilteredPool(result);
            setselectedPool(...result);
          }
        } else if (selectedpoolType === "idyp") {
          const result = basePoolsDyp.filter((item) => {
            return item.lock_time === locktime;
          });
          if (result) {
            setresultFilteredPool(result);

            setselectedPool(...result);
          }
        }
      }
    } else if (selectedchain === "bnb") {
      if (id) {
        if (selectedpoolType === "dyp") {
          const result = bnbPoolsDyp.filter((item) => {
            return (
              item.lock_time === locktime &&
              item.id?.toLowerCase() === id.toLowerCase()
            );
          });

          const result2 = bnbPoolsDyp.filter((item) => {
            return item.lock_time === locktime;
          });

          if (result) {
            setresultFilteredPool(result2);

            setselectedPool(...result);
          }
        } else if (selectedpoolType === "idyp") {
          const result = bnbPoolsiDyp.filter((item) => {
            return (
              item.lock_time === locktime &&
              item.id?.toLowerCase() === id.toLowerCase()
            );
          });

          const result2 = bnbPoolsiDyp.filter((item) => {
            return (
              item.lock_time === locktime &&
              item.id?.toLowerCase() === id.toLowerCase()
            );
          });

          if (result) {
            setresultFilteredPool(result2);

            setselectedPool(...result);
          }
        }
      } else {
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
      }
    } else if (selectedchain === "avax") {
      if (id) {
        if (selectedpoolType === "dyp") {
          const result = avaxPoolsDyp.filter((item) => {
            return (
              item.lock_time === locktime &&
              item.id?.toLowerCase() === id.toLowerCase()
            );
          });
          const result2 = avaxPoolsDyp.filter((item) => {
            return item.lock_time === locktime;
          });

          if (result) {
            setresultFilteredPool(result2);

            setselectedPool(...result);
          }
        } else if (selectedpoolType === "idyp") {
          const result = avaxPoolsiDyp.filter((item) => {
            return (
              item.lock_time === locktime &&
              item.id?.toLowerCase() === id.toLowerCase()
            );
          });

          const result2 = avaxPoolsiDyp.filter((item) => {
            return item.lock_time === locktime;
          });

          if (result) {
            setresultFilteredPool(result2);
            setselectedPool(...result);
          }
        }
      } else {
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
    }
  };

  const withdrawFeeiDyp = [1, 0, 0, 0];

  const { LP_IDs_V2Avax, LP_IDs_V2BNB } = window;

  const LP_IDBNB_Array = [
    LP_IDs_V2BNB.wbnb[0],
    LP_IDs_V2BNB.wbnb[1],
    LP_IDs_V2BNB.wbnb[2],
    LP_IDs_V2BNB.wbnb[3],
    LP_IDs_V2BNB.wbnb[4],
  ];

  //Buyback New

  const feeUarrayStakeAvaxiDyp = [0, 0.25, 0, 0.25];

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
      if (chain === "avax") {
        await fetchAvaxStaking2();
      } else if (chain === "eth" && topList === "Staking") {
        await fetchEthStaking2();
      } else if (chain === "base" && topList === "Staking") {
        await fetchBaseStaking2();
      } else if (chain === "bnb") {
        await fetchBnbStaking2();
      }
    }
  };
  // console.log(chain, activePools)
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
    if (chainId === "1") {
      setselectedchain("eth");
    } else if (chainId === "56") {
      setselectedchain("bnb");
    } else if (chainId === "43114") {
      setselectedchain("avax");
    } else if (chainId === "8453") {
      setselectedchain("base");
    } else {
      setselectedchain("eth");
    }
  }, [chainId]);

  // useEffect(() => {
  //   setShowDetails(false);
  //   setselectedPool([]);
  // }, [topList]);

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
  }, [topList, chain, coinbase, networkId, chainId, expiredPools, listType]);

  useEffect(() => {
    fetchStakingData();
  }, [topList, chain]);

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

  useEffect(() => {
    // if (chain === "avax" && topList === "Staking") {
    fetchAvaxStaking();
    // } else if (chain === "eth" && topList === "Staking") {
    fetchEthStaking();
    // } else if (chain === "bnb" && topList === "Staking") {
    fetchBnbStaking();
    // } else if (chain === "base" && topList === "Staking") {
    fetchBaseStaking();
    // }
  }, [chain, topList]);

  return (
    <>
      <div className={`row w-100 justify-content-center gap-4`}>
        {listing === "table" && topPools.length > 0 ? (
          <div className="px-0">
            <>
              <div className="top-picks-container">
                {expiredPools === false &&
                activePools &&
                activePools.length > 0 &&
                topList === "Staking"
                  ? activePools.map((pool, index) => (
                      <TopPoolsCard
                        key={index}
                        chain={chain}
                        top_pick={false}
                        tokenName={pool?.pair_name}
                        apr={pool?.apy_percent + "%"}
                        tvl={
                          pool?.tvl_usd === "--"
                            ? pool?.tvl_usd
                            : "$" + getFormattedNumber(pool?.tvl_usd)
                        }
                        lockTime={
                          pool?.lock_time
                            ? pool?.lock_time
                            : locktimeFarm[index]
                        }
                        tokenLogo={
                          pool?.icon
                            ? pool?.icon
                            : pool?.pair_name === "DYP"
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
                          setselectedPool(topList !== "Vault" && pool);
                          setShowDetails(topList !== "Vault" && true);
                          setselectedpoolType(pool?.type);
                          setselectedIndex(index);
                          handleSelectPool(
                            pool?.id,
                            pool?.chain,
                            pool?.lock_time,
                            pool?.type,
                            ethPoolsDyp,
                            basePoolsDyp,
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
                          setselectedpoolType("");
                        }}
                        cardType={topList}
                        details={details === index ? true : false}
                        isNewPool={pool?.new_pool === "Yes" ? true : false}
                        isStaked={
                          userPools.length > 0
                            ? userPools.find(
                                (obj) => obj.contract_address === pool?.id
                              )
                              ? true
                              : false
                            : false
                        }
                        expired={false}
                        network={chainId}
                        isPremium={isPremium}
                      />
                    ))
                  : expiredPools === true &&
                    expiredDYPPools &&
                    expiredDYPPools.length > 0 &&
                    topList === "Staking" &&
                    expiredDYPPools.slice(0, 2).map((pool, index) => (
                      <TopPoolsCard
                        key={index}
                        chain={chain}
                        top_pick={false}
                        tokenName={pool?.pair_name}
                        apr={pool?.apy_percent + "%"}
                        tvl={
                          pool?.tvl_usd === "--"
                            ? pool?.tvl_usd
                            : "$" + getFormattedNumber(pool?.tvl_usd)
                        }
                        lockTime={
                          pool?.lock_time
                            ? pool?.lock_time
                            : locktimeFarm[index]
                        }
                        tokenLogo={
                          pool?.icon
                            ? pool?.icon
                            : pool?.pair_name === "DYP"
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
                          setselectedPool(topList !== "Vault" && pool);
                          setShowDetails(topList !== "Vault" && true);
                          setselectedpoolType(pool?.type);
                          setselectedIndex(index);
                          handleSelectPool(
                            pool?.id,
                            pool?.chain,
                            pool?.lock_time,
                            pool?.type,
                            ethPoolsDypExpired,
                            basePoolsDyp,
                            ethPoolsiDypExpired,
                            bnbPoolsDypExpired,
                            bnbPoolsiDypExpired,
                            avaxPoolsDypExpired,
                            avaxPoolsiDypExpired
                          );
                        }}
                        onHideDetailsClick={() => {
                          setActiveCard(null);
                          setDetails();
                          setselectedpoolType("");
                        }}
                        cardType={topList}
                        details={details === index ? true : false}
                        isNewPool={pool?.new_pool === "Yes" ? true : false}
                        isStaked={
                          userPools.length > 0
                            ? userPools.find(
                                (obj) => obj.contract_address === pool?.id
                              )
                              ? true
                              : false
                            : false
                        }
                        expired={true}
                        network={chainId}
                        isPremium={isPremium}
                      />
                    ))}

                {topList === "Farming" &&
                  chain === "bnb" &&
                  expiredPools === true && (
                    <TopPoolsCard
                      chain={"bnb"}
                      top_pick={false}
                      tokenName={"WBNB"}
                      apr={`${getFormattedNumber(theBnbPool.apy_percent, 0)}%`}
                      tvl={`$${getFormattedNumber(theBnbPool.tvl_usd, 2)}`}
                      lockTime={"3 Days"}
                      tokenLogo={"bsc.svg"}
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
                      expired={true}
                      network={chainId}
                      isPremium={isPremium}
                    />
                  )}
              </div>

              {windowSize && windowSize.width > 1300 && topList === "Vault" ? (
                <>
                  <div className="top-picks-container">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(0, 3).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
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
                            setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
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
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}
                  <div className="top-picks-container pt-3">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(3, 6).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "idypius.svg"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard();
                            setActiveCard2(topPools[index + 3]);
                            setActiveCard3(null);
                            setActiveCard4(null);
                            setActiveCardCawsLand(null);
                            setActiveCardNFT(false);
                            setActiveCardLandNFT(false);
                            handleCardIndexStake(index + 3);
                            handleCardIndexStake30(index + 3);
                            handleCardIndexStakeiDyp(index + 3);
                            setDetails(index + 3);
                            // setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index + 3);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
                              ethPoolsiDyp,
                              bnbPoolsDyp,
                              bnbPoolsiDyp,
                              avaxPoolsDyp,
                              avaxPoolsiDyp
                            );
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard2();
                            setDetails();
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index + 3 ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard2 && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}

              {windowSize &&
              windowSize.width <= 1300 &&
              windowSize.width >= 787 &&
              topList === "Vault" ? (
                <>
                  <div className="top-picks-container">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(0, 2).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
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
                            setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
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
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}
                  <div className="top-picks-container pt-3">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(2, 4).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "idypius.svg"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard();
                            setActiveCard2(topPools[index + 2]);
                            setActiveCard3(null);
                            setActiveCard4(null);
                            setActiveCardCawsLand(null);
                            setActiveCardNFT(false);
                            setActiveCardLandNFT(false);
                            handleCardIndexStake(index + 2);
                            handleCardIndexStake30(index + 2);
                            handleCardIndexStakeiDyp(index + 2);
                            setDetails(index + 2);
                            setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index + 2);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
                              ethPoolsiDyp,
                              bnbPoolsDyp,
                              bnbPoolsiDyp,
                              avaxPoolsDyp,
                              avaxPoolsiDyp
                            );
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard2();
                            setDetails();
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index + 2 ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard2 && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}

                  <div className="top-picks-container pt-3">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(4, 6).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "idypius.svg"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard();
                            setActiveCard2();
                            setActiveCard3(topPools[index + 4]);
                            setActiveCard4(null);
                            setActiveCardCawsLand(null);
                            setActiveCardNFT(false);
                            setActiveCardLandNFT(false);
                            handleCardIndexStake(index + 4);
                            handleCardIndexStake30(index + 4);
                            handleCardIndexStakeiDyp(index + 4);
                            setDetails(index + 4);
                            setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index + 4);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
                              ethPoolsiDyp,
                              bnbPoolsDyp,
                              bnbPoolsiDyp,
                              avaxPoolsDyp,
                              avaxPoolsiDyp
                            );
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard3();
                            setDetails();
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index + 4 ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard3 && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}

              {windowSize && windowSize.width < 787 && topList === "Vault" ? (
                <>
                  <div className="top-picks-container">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(0, 1).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
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
                            setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
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
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}
                  <div className="top-picks-container pt-3">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(1, 2).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "idypius.svg"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard();
                            setActiveCard2(topPools[index + 1]);
                            setActiveCard3(null);
                            setActiveCard4(null);
                            setActiveCardCawsLand(null);
                            setActiveCardNFT(false);
                            setActiveCardLandNFT(false);
                            handleCardIndexStake(index + 1);
                            handleCardIndexStake30(index + 1);
                            handleCardIndexStakeiDyp(index + 1);
                            setDetails(index + 1);
                            setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index + 1);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
                              ethPoolsiDyp,
                              bnbPoolsDyp,
                              bnbPoolsiDyp,
                              avaxPoolsDyp,
                              avaxPoolsiDyp
                            );
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard2();
                            setDetails();
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index + 1 ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard2 && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}

                  <div className="top-picks-container pt-3">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(2, 3).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "idypius.svg"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard();
                            setActiveCard2();
                            setActiveCard3(topPools[index + 2]);
                            setActiveCard4(null);
                            setActiveCardCawsLand(null);
                            setActiveCardNFT(false);
                            setActiveCardLandNFT(false);
                            handleCardIndexStake(index + 2);
                            handleCardIndexStake30(index + 2);
                            handleCardIndexStakeiDyp(index + 2);
                            setDetails(index + 2);
                            setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index + 2);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
                              ethPoolsiDyp,
                              bnbPoolsDyp,
                              bnbPoolsiDyp,
                              avaxPoolsDyp,
                              avaxPoolsiDyp
                            );
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard3();
                            setDetails();
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index + 2 ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard3 && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}

                  <div className="top-picks-container pt-3">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(3, 4).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "idypius.svg"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard();
                            setActiveCard2();
                            setActiveCard3();
                            setActiveCard4(topPools[index + 3]);
                            setActiveCardCawsLand(null);
                            setActiveCardNFT(false);
                            setActiveCardLandNFT(false);
                            handleCardIndexStake(index + 3);
                            handleCardIndexStake30(index + 3);
                            handleCardIndexStakeiDyp(index + 3);
                            setDetails(index + 3);
                            setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index + 3);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
                              ethPoolsiDyp,
                              bnbPoolsDyp,
                              bnbPoolsiDyp,
                              avaxPoolsDyp,
                              avaxPoolsiDyp
                            );
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard4();
                            setDetails();
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index + 3 ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard4 && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}

                  <div className="top-picks-container pt-3">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(4, 5).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "idypius.svg"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard();
                            setActiveCard2();
                            setActiveCard3();
                            setActiveCard4();
                            setActiveCard5(topPools[index + 4]);
                            setActiveCardCawsLand(null);
                            setActiveCardNFT(false);
                            setActiveCardLandNFT(false);
                            handleCardIndexStake(index + 4);
                            handleCardIndexStake30(index + 4);
                            handleCardIndexStakeiDyp(index + 4);
                            setDetails(index + 4);
                            setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index + 4);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
                              ethPoolsiDyp,
                              bnbPoolsDyp,
                              bnbPoolsiDyp,
                              avaxPoolsDyp,
                              avaxPoolsiDyp
                            );
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard5();
                            setDetails();
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index + 4 ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard5 && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}

                  <div className="top-picks-container pt-3">
                    {expiredPools === false &&
                    activePools &&
                    activePools.length > 0 &&
                    topList === "Vault" ? (
                      topPools.slice(5, 6).map((pool, index) => (
                        <TopPoolsCard
                          key={index}
                          chain={chain}
                          top_pick={false}
                          tokenName={pool?.pair_name}
                          apr={pool?.apy_percent + "%"}
                          tvl={
                            pool?.tvl_usd === "--"
                              ? pool?.tvl_usd
                              : "$" + getFormattedNumber(pool?.tvl_usd)
                          }
                          lockTime={
                            pool?.lock_time
                              ? pool?.lock_time
                              : locktimeFarm[index]
                          }
                          tokenLogo={
                            pool?.icon
                              ? pool?.icon
                              : pool?.pair_name === "DYP"
                              ? "dyplogo.svg"
                              : "idypius.svg"
                          }
                          onShowDetailsClick={() => {
                            setActiveCard();
                            setActiveCard2();
                            setActiveCard3();
                            setActiveCard4();
                            setActiveCard5();
                            setActiveCard6(topPools[index + 5]);
                            setActiveCardCawsLand(null);
                            setActiveCardNFT(false);
                            setActiveCardLandNFT(false);
                            handleCardIndexStake(index + 5);
                            handleCardIndexStake30(index + 5);
                            handleCardIndexStakeiDyp(index + 5);
                            setDetails(index + 5);
                            setselectedPool(topList !== "Vault" && pool);
                            setShowDetails(topList !== "Vault" && true);
                            setselectedpoolType(pool?.type);
                            setselectedIndex(index + 5);
                            handleSelectPool(
                              pool?.id,
                              pool?.chain,
                              pool?.lock_time,
                              pool?.type,
                              ethPoolsDyp,
                              basePoolsDyp,
                              ethPoolsiDyp,
                              bnbPoolsDyp,
                              bnbPoolsiDyp,
                              avaxPoolsDyp,
                              avaxPoolsiDyp
                            );
                          }}
                          onHideDetailsClick={() => {
                            setActiveCard6();
                            setDetails();
                            setselectedpoolType("");
                          }}
                          cardType={topList}
                          details={details === index + 4 ? true : false}
                          isNewPool={pool?.new_pool === "Yes" ? true : false}
                          isStaked={
                            userPools.length > 0
                              ? userPools.find(
                                  (obj) => obj.contract_address === pool?.id
                                )
                                ? true
                                : false
                              : false
                          }
                          expired={false}
                          network={chainId}
                          isPremium={isPremium}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                  {activeCard6 && topList === "Vault" && chain === "eth" ? (
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
                      binanceW3WProvider={binanceW3WProvider}
                      handleSwitchChainBinanceWallet={
                        handleSwitchChainBinanceWallet
                      }
                    />
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}

              {activeCard && topList === "Farming" ? (
                chain === "bnb" && listing === "table" ? (
                  <BscFarmingFunc
                    isConnected={isConnected}
                    wbnbPrice={wbnbPrice}
                    coinbase={coinbase}
                    latestTvl={theBnbPool.tvl_usd}
                    the_graph_result={the_graph_resultbsc}
                    lp_id={LP_IDBNB_Array[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    expired={true}
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
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : null
              ) : (
                <></>
              )}
            </>
          </div>
        ) : listing !== "table" && topPools.length > 0 ? (
          <div className="list-pools-container px-0">
            {topList === "Farming" &&
              chain === "bnb" &&
              expiredPools === true && (
                <TopPoolsListCard
                  theBnbPool={theBnbPool}
                  the_graph_resultbsc={the_graph_resultbsc}
                  expired={true}
                  chain={chain}
                  top_pick={false}
                  tokenName={"WBNB"}
                  apr={"3%"}
                  tvl={"$20,000"}
                  lockTime={"3 Days"}
                  cardType={topList}
                  tokenLogo={"bsc.svg"}
                  listType={listType}
                  onShowDetailsClick={() => {
                    setActiveCardNFT(false);
                    setActiveCardLandNFT(false);
                    setActiveCard(topPools[0]);
                    setActiveCard2(null);
                    setActiveCard3(null);
                    setActiveCard4(null);
                    setDetails();
                    // setselectedpoolType(pool.type);
                  }}
                  onHideDetailsClick={() => {
                    setActiveCard(false);
                    setDetails();
                    setselectedpoolType("");
                  }}
                  showDetails={activeCard}
                  topList={topList}
                  coinbase={coinbase}
                  cardIndex={1}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  isPremium={isPremium}
                />
              )}

            {/* {activeCard && topList === "Farming" &&
                 chain === "bnb" && listing !== "table" ? (
                  <BscFarmingFunc
                    isConnected={isConnected}
                    wbnbPrice={wbnbPrice}
                    coinbase={coinbase}
                    latestTvl={theBnbPool.tvl_usd}
                    the_graph_result={the_graph_resultbsc}
                    lp_id={LP_IDBNB_Array[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    expired={true}
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
              } */}

            {/* {topList === "Farming" &&
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
              )} */}

            {expiredPools === false && topList !== "Farming" ? (
              activePools.map((pool, index) => (
                <TopPoolsListCard
                  key={index}
                  theBnbPool={theBnbPool}
                  expiredPools={expiredDYPPools}
                  activePools={activePools}
                  expired={false}
                  chain={chain}
                  top_pick={false}
                  tokenName={
                    pool.tokenName
                      ? pool.tokenName
                      : pool.pair_name
                      ? pool.pair_name
                      : ""
                  }
                  apr={pool?.apy_percent + "%"}
                  tvl={
                    pool?.tvl_usd === "--"
                      ? pool?.tvl_usd
                      : "$" + getFormattedNumber(pool?.tvl_usd)
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
                    setselectedpoolType(pool?.type);
                  }}
                  onHideDetailsClick={() => {
                    setActiveCard(null);
                    setselectedpoolType("");
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
                  isNewPool={pool?.new_pool === "Yes" ? true : false}
                  totalTvl={pool?.tvl_usd}
                  isPremium={isPremium}
                />
              ))
            ) : (
              <></>
            )}
          </div>
        ) : topPools.length === 0 ? (
          <div
            className="w-100 d-flex justify-content-center align-items-center mt-5"
            style={{ minHeight: "240px" }}
          >
            <FadeLoader color="#7770DF" />
          </div>
        ) : (
          <div
            className="w-100 d-flex justify-content-center align-items-center mt-5"
            style={{ minHeight: "240px" }}
          >
            <FadeLoader color="#7770DF" />
          </div>
        )}
      </div>
      {showDetails && topList !== "Vault" && (
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
                    src={"https://cdn.worldofdypians.com/wod/popupXmark.svg"}
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
                <div className="locktimewrapper align-items-center gap-2">
                  <button
                    className={getClassName(
                      selectedchain,
                      "No lock",
                      selectedpoolType,
                      selectedPool,
                      expiredPools === true ? ethPoolsDypExpired : ethPoolsDyp,
                      basePoolsDyp,
                      expiredPools === true
                        ? ethPoolsiDypExpired
                        : ethPoolsiDyp,
                      expiredPools === true ? bnbPoolsDypExpired : bnbPoolsDyp,
                      expiredPools === true
                        ? bnbPoolsiDypExpired
                        : bnbPoolsiDyp,
                      expiredPools === true
                        ? avaxPoolsDypExpired
                        : avaxPoolsDyp,
                      expiredPools === true
                        ? avaxPoolsiDypExpired
                        : avaxPoolsiDyp
                    )}
                    onClick={() => {
                      handleSelectPool(
                        undefined,
                        selectedchain,
                        "No lock",
                        selectedpoolType,
                        expiredPools === true
                          ? ethPoolsDypExpired
                          : ethPoolsDyp,
                        basePoolsDyp,
                        expiredPools === true
                          ? ethPoolsiDypExpired
                          : ethPoolsiDyp,
                        expiredPools === true
                          ? bnbPoolsDypExpired
                          : bnbPoolsDyp,
                        expiredPools === true
                          ? bnbPoolsiDypExpired
                          : bnbPoolsiDyp,
                        expiredPools === true
                          ? avaxPoolsDypExpired
                          : avaxPoolsDyp,
                        expiredPools === true
                          ? avaxPoolsiDypExpired
                          : avaxPoolsiDyp
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
                      expiredPools === true ? ethPoolsDypExpired : ethPoolsDyp,
                      basePoolsDyp,
                      expiredPools === true
                        ? ethPoolsiDypExpired
                        : ethPoolsiDyp,
                      expiredPools === true ? bnbPoolsDypExpired : bnbPoolsDyp,
                      expiredPools === true
                        ? bnbPoolsiDypExpired
                        : bnbPoolsiDyp,
                      expiredPools === true
                        ? avaxPoolsDypExpired
                        : avaxPoolsDyp,
                      expiredPools === true
                        ? avaxPoolsiDypExpired
                        : avaxPoolsiDyp
                    )}
                    onClick={() => {
                      handleSelectPool(
                        undefined,
                        selectedchain,
                        "30 days",
                        selectedpoolType,
                        expiredPools === true
                          ? ethPoolsDypExpired
                          : ethPoolsDyp,
                        basePoolsDyp,
                        expiredPools === true
                          ? ethPoolsiDypExpired
                          : ethPoolsiDyp,
                        expiredPools === true
                          ? bnbPoolsDypExpired
                          : bnbPoolsDyp,
                        expiredPools === true
                          ? bnbPoolsiDypExpired
                          : bnbPoolsiDyp,
                        expiredPools === true
                          ? avaxPoolsDypExpired
                          : avaxPoolsDyp,
                        expiredPools === true
                          ? avaxPoolsiDypExpired
                          : avaxPoolsiDyp
                      );
                    }}
                  >
                    30 Days
                  </button>
                  <button
                    className={` position-relative ${getClassName(
                      selectedchain,
                      "60 days",
                      selectedpoolType,
                      selectedPool,
                      expiredPools === true ? ethPoolsDypExpired : ethPoolsDyp,
                      basePoolsDyp,
                      expiredPools === true
                        ? ethPoolsiDypExpired
                        : ethPoolsiDyp,
                      expiredPools === true ? bnbPoolsDypExpired : bnbPoolsDyp,
                      expiredPools === true
                        ? bnbPoolsiDypExpired
                        : bnbPoolsiDyp,
                      expiredPools === true
                        ? avaxPoolsDypExpired
                        : avaxPoolsDyp,
                      expiredPools === true
                        ? avaxPoolsiDypExpired
                        : avaxPoolsiDyp
                    )}`}
                    onClick={() => {
                      handleSelectPool(
                        undefined,
                        selectedchain,
                        "60 days",
                        selectedpoolType,
                        expiredPools === true
                          ? ethPoolsDypExpired
                          : ethPoolsDyp,
                        basePoolsDyp,
                        expiredPools === true
                          ? ethPoolsiDypExpired
                          : ethPoolsiDyp,
                        expiredPools === true
                          ? bnbPoolsDypExpired
                          : bnbPoolsDyp,
                        expiredPools === true
                          ? bnbPoolsiDypExpired
                          : bnbPoolsiDyp,
                        expiredPools === true
                          ? avaxPoolsDypExpired
                          : avaxPoolsDyp,
                        expiredPools === true
                          ? avaxPoolsiDypExpired
                          : avaxPoolsiDyp
                      );
                    }}
                  >
                    {selectedpoolType === "dyp" && selectedchain === "eth" ? (
                      <div className="new-beta-sidebar2 position-absolute">
                        <span className="new-beta-text2">New</span>
                      </div>
                    ) : (
                      <></>
                    )}
                    60 Days
                  </button>
                  <button
                    className={` position-relative ${getClassName(
                      selectedchain,
                      "90 days",
                      selectedpoolType,
                      selectedPool,
                      expiredPools === true ? ethPoolsDypExpired : ethPoolsDyp,
                      basePoolsDyp,
                      expiredPools === true
                        ? ethPoolsiDypExpired
                        : ethPoolsiDyp,
                      expiredPools === true ? bnbPoolsDypExpired : bnbPoolsDyp,
                      expiredPools === true
                        ? bnbPoolsiDypExpired
                        : bnbPoolsiDyp,
                      expiredPools === true
                        ? avaxPoolsDypExpired
                        : avaxPoolsDyp,
                      expiredPools === true
                        ? avaxPoolsiDypExpired
                        : avaxPoolsiDyp
                    )}`}
                    onClick={() => {
                      handleSelectPool(
                        undefined,
                        selectedchain,
                        "90 days",
                        selectedpoolType,
                        expiredPools === true
                          ? ethPoolsDypExpired
                          : ethPoolsDyp,
                        basePoolsDyp,
                        expiredPools === true
                          ? ethPoolsiDypExpired
                          : ethPoolsiDyp,
                        expiredPools === true
                          ? bnbPoolsDypExpired
                          : bnbPoolsDyp,
                        expiredPools === true
                          ? bnbPoolsiDypExpired
                          : bnbPoolsiDyp,
                        expiredPools === true
                          ? avaxPoolsDypExpired
                          : avaxPoolsDyp,
                        expiredPools === true
                          ? avaxPoolsiDypExpired
                          : avaxPoolsiDyp
                      );
                      setselectedIndex(0);
                    }}
                  >
                    {(selectedchain === "eth" && selectedpoolType === "dyp") ||
                    (selectedchain === "bnb" &&
                      selectedpoolType === "idyp" &&
                      expiredPools === false) ? (
                      <div className="new-beta-sidebar2 position-absolute">
                        <span className="new-beta-text2">New</span>
                      </div>
                    ) : (
                      <></>
                    )}
                    90 Days
                  </button>
                  <button
                    className={`position-relative ${getClassName(
                      selectedchain,
                      "120 days",
                      selectedpoolType,
                      selectedPool,
                      expiredPools === true ? ethPoolsDypExpired : ethPoolsDyp,
                      basePoolsDyp,
                      expiredPools === true
                        ? ethPoolsiDypExpired
                        : ethPoolsiDyp,
                      expiredPools === true ? bnbPoolsDypExpired : bnbPoolsDyp,
                      expiredPools === true
                        ? bnbPoolsiDypExpired
                        : bnbPoolsiDyp,
                      expiredPools === true
                        ? avaxPoolsDypExpired
                        : avaxPoolsDyp,
                      expiredPools === true
                        ? avaxPoolsiDypExpired
                        : avaxPoolsiDyp
                    )}`}
                    onClick={() => {
                      handleSelectPool(
                        undefined,
                        selectedchain,
                        "120 days",
                        selectedpoolType,
                        expiredPools === true
                          ? ethPoolsDypExpired
                          : ethPoolsDyp,
                        basePoolsDyp,
                        expiredPools === true
                          ? ethPoolsiDypExpired
                          : ethPoolsiDyp,
                        expiredPools === true
                          ? bnbPoolsDypExpired
                          : bnbPoolsDyp,
                        expiredPools === true
                          ? bnbPoolsiDypExpired
                          : bnbPoolsiDyp,
                        expiredPools === true
                          ? avaxPoolsDypExpired
                          : avaxPoolsDyp,
                        expiredPools === true
                          ? avaxPoolsiDypExpired
                          : avaxPoolsiDyp
                      );
                    }}
                  >
                    {selectedpoolType === "idyp" &&
                    selectedchain === "bnb" &&
                    expiredPools === false ? (
                      <div className="new-beta-sidebar2 position-absolute">
                        <span className="new-beta-text2">New</span>
                      </div>
                    ) : (
                      <></>
                    )}
                    120 Days
                  </button>
                  <button
                    className={`position-relative ${getClassName(
                      selectedchain,
                      "180 days",
                      selectedpoolType,
                      selectedPool,
                      expiredPools === true ? ethPoolsDypExpired : ethPoolsDyp,
                      basePoolsDyp,
                      expiredPools === true
                        ? ethPoolsiDypExpired
                        : ethPoolsiDyp,
                      expiredPools === true ? bnbPoolsDypExpired : bnbPoolsDyp,
                      expiredPools === true
                        ? bnbPoolsiDypExpired
                        : bnbPoolsiDyp,
                      expiredPools === true
                        ? avaxPoolsDypExpired
                        : avaxPoolsDyp,
                      expiredPools === true
                        ? avaxPoolsiDypExpired
                        : avaxPoolsiDyp
                    )}`}
                    onClick={() => {
                      handleSelectPool(
                        undefined,
                        selectedchain,
                        "180 days",
                        selectedpoolType,
                        expiredPools === true
                          ? ethPoolsDypExpired
                          : ethPoolsDyp,
                        basePoolsDyp,
                        expiredPools === true
                          ? ethPoolsiDypExpired
                          : ethPoolsiDyp,
                        expiredPools === true
                          ? bnbPoolsDypExpired
                          : bnbPoolsDyp,
                        expiredPools === true
                          ? bnbPoolsiDypExpired
                          : bnbPoolsiDyp,
                        expiredPools === true
                          ? avaxPoolsDypExpired
                          : avaxPoolsDyp,
                        expiredPools === true
                          ? avaxPoolsiDypExpired
                          : avaxPoolsiDyp
                      );
                    }}
                  >
                    {selectedpoolType === "dyp" &&
                    selectedchain === "eth" &&
                    expiredPools === false ? (
                      <div className="new-beta-sidebar2 position-absolute">
                        <span className="new-beta-text2">New</span>
                      </div>
                    ) : (
                      <></>
                    )}
                    180 Days
                  </button>
                </div>
                <div className="d-flex gap-1 gap-lg-3 align-items-center justify-content-start w-100">
                  <div
                    className={`position-relative w-100 ${
                      selectedchain === "eth"
                        ? "chain-popup-item-eth"
                        : selectedpoolType === "idyp" && expiredPools === false
                        ? "chain-popup-item-disabled"
                        : "chain-popup-item"
                    }`}
                    onClick={() => {
                      setselectedchain("eth");
                      onChainSelect("eth");
                      setselectedPool(
                        selectedPool.type === "dyp"
                          ? ethPools.find((item) => {
                              return item.type === "dyp";
                            })
                            ? ethPools.find((item) => {
                                return item.type === "dyp";
                              })
                            : ethPools.find((item) => {
                                return item.type === "idyp";
                              })
                          : selectedPool.type === "idyp" &&
                            expiredPools === false
                          ? ethPools.find((item) => {
                              return item.type === "idyp";
                            })
                            ? ethPools.find((item) => {
                                return item.type === "idyp";
                              })
                            : ethPools.find((item) => {
                                return item.type === "dyp";
                              })
                          : ethPoolsiDypExpired.find((item) => {
                              return item.type === "idyp";
                            })
                          ? ethPoolsiDypExpired.find((item) => {
                              return item.type === "idyp";
                            })
                          : ethPoolsiDypExpired.find((item) => {
                              return item.type === "dyp";
                            })
                      );
                    }}
                  >
                    <h6
                      className={`d-flex justify-content-center align-items-center chain-popup-text`}
                    >
                      <img
                        src={
                          selectedchain === "eth"
                            ? "https://cdn.worldofdypians.com/wod/eth.svg"
                            : "https://cdn.worldofdypians.com/tools/ethGray.svg"
                        }
                        alt=""
                        className="popup-chains-icon"
                      />
                      Ethereum
                    </h6>
                  </div>
                  <div
                    className={`position-relative w-100 ${
                      selectedchain === "bnb"
                        ? "chain-popup-item-bnb"
                        : "chain-popup-item"
                    }`}
                    onClick={() => {
                      setselectedchain("bnb");
                      onChainSelect("bnb");

                      setselectedPool(
                        selectedPool.type === "dyp"
                          ? expiredPools === false
                            ? bnbPools.find((item) => {
                                return item.type === "dyp";
                              })
                              ? bnbPools.find((item) => {
                                  return item.type === "dyp";
                                })
                              : bnbPools.find((item) => {
                                  return item.type === "idyp";
                                })
                            : bnbPoolsDypExpired.find((item) => {
                                return item.type === "dyp";
                              })
                            ? bnbPoolsDypExpired.find((item) => {
                                return item.type === "dyp";
                              })
                            : bnbPoolsiDypExpired.find((item) => {
                                return item.type === "idyp";
                              })
                          : selectedPool.type === "idyp" &&
                            expiredPools === false
                          ? bnbPools.find((item) => {
                              return item.type === "idyp";
                            })
                            ? bnbPools.find((item) => {
                                return item.type === "idyp";
                              })
                            : bnbPools.find((item) => {
                                return item.type === "dyp";
                              })
                          : bnbPoolsiDypExpired.find((item) => {
                              return item.type === "idyp";
                            })
                          ? bnbPoolsiDypExpired.find((item) => {
                              return item.type === "idyp";
                            })
                          : bnbPoolsDypExpired.find((item) => {
                              return item.type === "dyp";
                            })
                      );
                    }}
                  >
                    <h6
                      className={`d-flex justify-content-center align-items-center chain-popup-text`}
                    >
                      <img
                        src={
                          selectedchain === "bnb"
                            ? "https://cdn.worldofdypians.com/wod/bnbIcon.svg"
                            : "https://cdn.worldofdypians.com/tools/bnbGray.svg"
                        }
                        alt=""
                        className="popup-chains-icon"
                      />
                      BNB Chain
                    </h6>
                  </div>
                  <div
                    className={`position-relative w-100 ${
                      selectedchain === "base"
                        ? "chain-popup-item-base"
                        : "chain-popup-item"
                    }`}
                    onClick={() => {
                      setselectedchain("base");
                      onChainSelect("base");

                      setselectedPool(
                        selectedPool.type === "dyp"
                          ? basePools.find((item) => {
                              return item.type === "dyp";
                            })
                            ? basePools.find((item) => {
                                return item.type === "dyp";
                              })
                            : basePools.find((item) => {
                                return item.type === "idyp";
                              })
                          : selectedPool.type === "idyp" &&
                            expiredPools === false
                          ? basePools.find((item) => {
                              return item.type === "idyp";
                            })
                            ? basePools.find((item) => {
                                return item.type === "idyp";
                              })
                            : basePools.find((item) => {
                                return item.type === "dyp";
                              })
                          : basePoolsiDypExpired.find((item) => {
                              return item.type === "idyp";
                            })
                          ? basePoolsiDypExpired.find((item) => {
                              return item.type === "idyp";
                            })
                          : basePoolsDyp.find((item) => {
                              return item.type === "dyp";
                            })
                      );
                    }}
                  >
                    <h6
                      className={`d-flex justify-content-center align-items-center chain-popup-text`}
                    >
                      <img
                        src={
                          selectedchain === "base"
                            ? "https://cdn.worldofdypians.com/wod/baseBlueLogo.svg"
                            : "https://cdn.worldofdypians.com/tools/baseGray.svg"
                        }
                        alt=""
                        className="popup-chains-icon"
                      />
                      BASE
                    </h6>
                  </div>
                  <div
                    className={`position-relative w-100 ${
                      selectedchain === "avax"
                        ? "chain-popup-item-avax"
                        : selectedpoolType === "idyp" && expiredPools === false
                        ? "chain-popup-item-disabled"
                        : "chain-popup-item"
                    }`}
                    onClick={() => {
                      setselectedchain("avax");
                      onChainSelect("avax");
                      setselectedPool(
                        selectedPool.type === "dyp"
                          ? avaxPools.find((item) => {
                              return item.type === "dyp";
                            })
                            ? avaxPools.find((item) => {
                                return item.type === "dyp";
                              })
                            : avaxPools.find((item) => {
                                return item.type === "idyp";
                              })
                          : selectedPool.type === "idyp" &&
                            expiredPools === false
                          ? avaxPools.find((item) => {
                              return item.type === "idyp";
                            })
                            ? avaxPools.find((item) => {
                                return item.type === "idyp";
                              })
                            : avaxPools.find((item) => {
                                return item.type === "dyp";
                              })
                          : selectedPool?.type === "idyp"
                          ? avaxPoolsiDypExpired.find((item) => {
                              return item.type === "idyp";
                            })
                            ? avaxPoolsiDypExpired.find((item) => {
                                return item.type === "idyp";
                              })
                            : avaxPools.find((item) => {
                                return item.type === "dyp";
                              })
                          : avaxPoolsDypExpired.find((item) => {
                              return item.type === "dyp";
                            })
                          ? avaxPoolsDypExpired.find((item) => {
                              return item.type === "dyp";
                            })
                          : avaxPoolsiDypExpired.find((item) => {
                              return item.type === "idyp";
                            })
                      );
                    }}
                  >
                    <h6
                      className={`d-flex justify-content-center align-items-center chain-popup-text`}
                    >
                      <img
                        src={
                          selectedchain === "avax"
                            ? "https://cdn.worldofdypians.com/wod/avaxIcon.svg"
                            : "https://cdn.worldofdypians.com/tools/avaxGray.svg"
                        }
                        alt=""
                        className="popup-chains-icon"
                      />
                      Avalanche
                    </h6>
                  </div>
                </div>
                {resultFilteredPool &&
                  resultFilteredPool.length > 1 &&
                  selectedchain === "eth" && (
                    <>
                      <div className="separator my-1"></div>
                      <div className="d-flex align-items-center gap-2 w-100">
                        {resultFilteredPool.map((obj, index) => {
                          return (
                            <button
                              className={` w-100 position-relative ${
                                selectedIndex === index
                                  ? "method-btn-active"
                                  : "method-btn"
                              }`}
                              onClick={() => {
                                setselectedIndex(index);
                                setselectedPool(obj);
                              }}
                            >
                              {selectedpoolType === "dyp" && index == 0 && (
                                <div className="new-beta-sidebar2 position-absolute">
                                  <span className="new-beta-text2">New</span>
                                </div>
                              )}
                              Pool {index + 1}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
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
                                    ? "https://cdn.worldofdypians.com/tools/warning.svg"
                                    : "https://cdn.worldofdypians.com/tools/more-info.svg"
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

                {selectedPool?.id ===
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
                    expired={true}
                    staking={window.constant_stakingidyp_7}
                    listType={listType}
                    finalApr={selectedPool?.apy_performancefee}
                    apr={selectedPool?.apy_percent}
                    liquidity={wbsc_address}
                    expiration_time={"18 July 2024"}
                    poolCap={0}
                    start_date={"18 July 2023"}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    fee_u={0}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : selectedPool?.id ===
                    "0xFBe84Af34CdC22455f82e18B76Ca50D21d3aBF84" &&
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
                    staking={window.constant_stakingidyp_8}
                    listType={listType}
                    finalApr={selectedPool?.apy_performancefee}
                    apr={selectedPool?.apy_percent}
                    liquidity={wbsc_address}
                    expiration_time={"22 July 2025"}
                    poolCap={20000000}
                    start_date={"22 Jul 2024"}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    fee_u={0}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : selectedPool?.id ===
                    "0xf6DC9E51D4E0FCc19ca6426fB5422f1E9a24F2eE" &&
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
                    staking={window.constant_stakingidyp_9}
                    listType={listType}
                    finalApr={selectedPool?.apy_performancefee}
                    apr={selectedPool?.apy_percent}
                    liquidity={wbsc_address}
                    expiration_time={"22 July 2025"}
                    poolCap={25000000}
                    start_date={"22 Jul 2024"}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    fee_u={0}
                    lockTime={
                      selectedPool?.lock_time?.split(" ")[0] === "No"
                        ? "No Lock"
                        : parseInt(selectedPool?.lock_time?.split(" ")[0])
                    }
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
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
                    expired={true}
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
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
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
                    expired={true}
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
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  selectedPool?.id ===
                    "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                  chain === "bnb" ? (
                  <StakeDypiusBsc
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_bsc1}
                    apr={selectedPool?.apy_percent}
                    liquidity={wbsc_address}
                    expiration_time={"09 Nov 2024"}
                    start_date={"09 Nov 2023"}
                    poolCap={3500000}
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
                    expired={true}
                    referrer={referrer}
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  selectedPool?.id ===
                    "0x1f5c3f186795c84265eD826AD09924D0987485ba" &&
                  chain === "eth" ? (
                  <StakeDypiusEth1Phase2
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_phase2_eth6}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"08 Jan 2026"}
                    poolCap={20000000}
                    start_date={"08 Jan 2025"}
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
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  selectedPool?.id ===
                    "0x11666850EA73956afcd014E86eD2AE473939421d" &&
                  chain === "eth" ? (
                  <StakeDypiusEth1Phase2
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_phase2_eth7}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"08 Jan 2026"}
                    poolCap={40000000}
                    start_date={"08 Jan 2025"}
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
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  selectedPool?.id ===
                    "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
                  chain === "avax" ? (
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
                    listType={listType}
                    other_info={false}
                    fee_s={selectedPool?.performancefee}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultavax}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={true}
                    referrer={referrer}
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  selectedPool?.id ===
                    "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
                  chain === "eth" ? (
                  <StakeDypiusEth
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_eth1}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"09 Nov 2024"}
                    start_date={"09 Nov 2023"}
                    poolCap={13000000}
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
                    expired={true}
                    referrer={referrer}
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  (selectedPool?.id ===
                    "0x13a3EA792db25d6E239f4b785bA17FB5B9faf84e" ||
                    selectedPool?.id ===
                      "0x9845a667b1A603FF21596FDdec51968a2bccAc11") &&
                  chain === "base" ? (
                  <StakingDypiusBase1
                    selectedPool={selectedPool}
                    selectedTab={selectedTab}
                    staking={window.constant_staking_dypius_base1}
                    apr={selectedPool?.apy_percent}
                    liquidity={eth_address}
                    expiration_time={"01 Mar 2025"}
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
                    expired={true}
                    referrer={referrer}
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    poolCap={10000000}
                    start_date={"01 Sep 2024"}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  selectedPool?.id ===
                    "0x998A9F0DF7DAF20c2B0Bb379Dcae394636926a96" &&
                  chain === "eth" ? (
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
                    listType={listType}
                    other_info={false}
                    fee={selectedPool?.performancefee}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={true}
                    referrer={referrer}
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    poolCap={1000000}
                    start_date={"07 Jun 2024"}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  selectedPool?.id ===
                    "0x0fafe78e471b52bc4003984a337948ed55284573" &&
                  chain === "eth" ? (
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
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    poolCap={3700000}
                    start_date={"12 Jul 2024"}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  selectedPool?.id ===
                    "0xbE030A667d9ee75a9FCdF2162A2C14ccCAB573dD" &&
                  chain === "eth" ? (
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
                    listType={listType}
                    other_info={false}
                    fee={selectedPool?.performancefee}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={true}
                    referrer={referrer}
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  selectedPool?.id ===
                    "0xFdD3CFF22CF846208E3B37b47Bc36b2c61D2cA8b" &&
                  chain === "eth" ? (
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
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    poolCap={1500000}
                    start_date={"12 Jul 2024"}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
                  />
                ) : topList === "Staking" &&
                  selectedPool?.id ===
                    "0x92A84052Fe6945949A295AF14a7506e3dc085492" &&
                  chain === "eth" ? (
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
                    listType={listType}
                    other_info={false}
                    fee={selectedPool?.performancefee}
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={true}
                    referrer={referrer}
                    onConnectWallet={() => {
                      setShowDetails(false);
                      onConnectWallet();
                      setselectedPool([]);
                      setDetails(999);
                    }}
                    poolCap={625000}
                    binanceW3WProvider={binanceW3WProvider}
                    handleSwitchChainBinanceWallet={
                      handleSwitchChainBinanceWallet
                    }
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
