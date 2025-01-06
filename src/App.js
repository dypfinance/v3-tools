// import Web3 from "web3";
import React, { useState, useEffect } from "react";
import GoogleAnalyticsReporter from "./functions/analytics";
// import PoolExplorer from "./components/pool-explorer";
// import PairExplorer from "./components/pair-explorer";
// import BigSwapExplorer from "./components/big-swap-explorer";
// import TopTokens from "./components/top-tokens";
import Locker from "./components/locker";
import Account from "./components/account";
import Admin from "./components/admin";
import Farms from "./components/farms";
import News from "./components/news/news";
import Sidebar from "./components/sidebar/sidebar";
import Header from "./components/header/header";
import { Route, Routes } from "react-router-dom";
// import SubmitInfo from "./components/submit-info/SubmitInfo";
import { RedirectPathToHomeOnly } from "./functions/redirects";
import Earn from "./components/earn/Earn";
import Dashboard from "./components/dashboard/Dashboard";
// import Governance from "./components/governance/Governance";
// import navRadius from "./assets/navRadius.svg";
import Governancedev from "./components/governance/dev/governance-new-avax";
import Governancebsc from "./components/governance/dev/governance-new-bsc";
import GovernanceEth from "./components/governance/dev/governance-new";
import { Navigate } from "react-router-dom";
// import LandFlyout from "./components/LandFlyout/LandFlyout";
// import NftMinting from "./components/caws/NftMinting/index";
import Bridge from "./components/bridge/BridgeGeneral";
import Footer from "./components/Footer/footer";
import BuyDyp from "./components/buydyp/BuyDyp";
// import Swap from "./components/swap/Swap";
import MobileMenu from "./components/sidebar/MobileMenu";
import Disclaimer from "./components/disclaimer/Disclaimer";
// import ScrollToTop from "./functions/ScrollToTop";
// import LandPopup from "./components/LandPopup/LandPopup";
// import { withRouter } from "react-router-dom";
// import GenesisStaking from "./components/genesisStaking/GenesisStaking";
// import CawsStaking from "./components/genesisStaking/CawsStaking";
// import Plans from "./components/account/Plans";
import DypMigration from "./components/bridge/DypMigration";
import AlertRibbon from "./components/alert-ribbon/AlertRibbon";
import EarnOther from "./components/earnOther/EarnOther";
import EarnOtherNft from "./components/earnOther/EarnOtherNft";
// import EarnInnerPoolNft from "./components/earnOther/EarnInnerPool/EarnInnerPoolNft";
import WalletModal from "./components/WalletModal";
import axios from "axios";
import MobileFlyout from "./components/mobileFlyout/MobileFlyout";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { MobileView, BrowserView } from "react-device-detect";
import Whitelist from "./components/whitelist/Whitelist";
// import WhitelistPopup from "./components/whitelistPopup/WhitelistPopup";
import Games from "./components/games/Games";
import useWindowSize from "./functions/useWindowSize";
import { useAuth } from "./functions/AuthDetails";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import awsExports from "./functions/aws-exports";
import Auth from "./components/gameAccount/Auth/Auth";
import ForgotPassword from "./components/gameAccount/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/gameAccount/ResetPassword/ResetPassword";
import PlayerCreation from "./components/gameAccount/PlayerCreation/PlayerCreation";
import LandingScreen from "./components/gameAccount/LandingScreen/LandingScreen";
import { useMutation, useQuery } from "@apollo/client";
import {
  GENERATE_NONCE,
  GET_PLAYER,
  VERIFY_WALLET,
} from "./functions/Dashboard.schema";
import { ethers } from "ethers";
import LoyaltyProgram from "./components/loyalty/LoyaltyProgram.js";
import { useParams } from "react-router-dom";

const LockerWrapper = (props) => {
  const { pair_id } = useParams();

  return (
    <Locker
      {...props} // Passing down existing props like handleConnection, isConnected, etc.
      pair_id={pair_id} // Explicitly passing pair_id as a prop
    />
  );
};

function App() {
  const [theme, setTheme] = useState("theme-dark");

  const [isOpenInMobile, setisOpenInMobile] = useState(false);
  const [isConnected, setisConnected] = useState(false);
  const [coinbase, setcoinbase] = useState(null);
  const [the_graph_result_ETH_V2, setthe_graph_result_ETH_V2] = useState(
    JSON.stringify(window.the_graph_result_eth_v2)
  );

  const [the_graph_result_AVAX_V2, setthe_graph_result_AVAX_V2] = useState(
    JSON.stringify(window.the_graph_result_avax_v2)
  );
  const [the_graph_result_BSC_V2, setthe_graph_result_BSC_V2] = useState(
    JSON.stringify(window.the_graph_result_bsc_v2)
  );

  // const [subscribedPlatformTokenAmount, setsubscribedPlatformTokenAmount] =
  //   useState(0);
  const [isPremium, setisPremium] = useState(false);
  const [networkId, setnetworkId] = useState(1);
  const [explorerNetworkId, setexplorerNetworkId] = useState(1);
  const [show, setshow] = useState(false);
  const [referrer, setreferrer] = useState("");
  const [showRibbon, setshowRibbon] = useState(true);
  const [showRibbon2, setshowRibbon2] = useState(true);
  const [showFlyout, setshowFlyout] = useState(true);
  const [downloadClick, setdownloadClick] = useState(false);
  const [showMobilePopup, setshowMobilePopup] = useState(false);
  const [showWalletPopup, setshowWalletPopup] = useState(false);
  // const [whitelistPopup, setwhitelistPopup] = useState(true);
  const [aggregatorPools, setaggregatorPools] = useState([]);
  const [userCurencyBalance, setuserCurencyBalance] = useState(0);
  const [fireAppcontent, setFireAppContent] = useState(false);
  const [syncStatus, setsyncStatus] = useState("initial");
  const [isonSync, setisonSync] = useState(false);

  const [chests, setChests] = useState([]);
  const [openedChests, setOpenedChests] = useState([]);
  const [chestCount, setChestCount] = useState(0);
  const [isonlink, setIsOnLink] = useState(false);
  const [hasDypBalance, sethasDypBalance] = useState(false);
  const [hasiDypBalance, sethasiDypBalance] = useState(false);
  const [userPools, setuserPools] = useState([]);
  const [previousWeeklyVersion, setpreviousWeeklyVersion] = useState(0);
  const [previousMonthlyVersion, setpreviousMonthlyVersion] = useState(0);
  const [previousKittyDashVersion, setpreviousKittyDashVersion] = useState(0);
  const [leaderboard, setleaderboard] = useState([]);

  const [weeklyplayerData, setweeklyplayerData] = useState([]);
  const [activePlayerWeekly, setActivePlayerWeekly] = useState(false);
  const [weeklyUser, setWeeklyUser] = useState({});
  const [monthlyplayerData, setmonthlyplayerData] = useState([]);
  const [activePlayerMonthly, setActivePlayerMonthly] = useState(false);
  const [monthlyUser, setMonthlyUser] = useState([]);
  const [kittyDashRecords, setkittyDashRecords] = useState([]);
  const [activePlayerKitty, setActivePlayerKitty] = useState(false);
  const [kittyUser, setKittyUser] = useState({});

  const [activePlayerCaws2d, setActivePlayerCaws2d] = useState(false);
  const [caws2dUser, setCaws2dUser] = useState({});

  const backendApi =
    "https://axf717szte.execute-api.eu-central-1.amazonaws.com/prod";

  const showModal = () => {
    setshow(true);
  };

  const hideModal = () => {
    setshow(false);
  };

  const onSelectChain = (chainText) => {
    if (chainText === "eth") {
      setexplorerNetworkId(1);
    } else if (chainText === "bnb") {
      setexplorerNetworkId(56);
    } else if (chainText === "avax") {
      setexplorerNetworkId(43114);
    }
  };

  const onChestClaimed = () => {
    setChestCount(chestCount + 1);
  };

  const fetchAggregatorPools = async () => {
    const result = await axios
      .get(
        "https://dypiusstakingaggregator.azurewebsites.net/api/GetAggregatedPools?code=2qyv7kEpn13ZZUDkaU-f7U5YjiQLVAawRITtvj34rci0AzFuZp7JWQ%3D%3D"
      )
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      const pools = result.data.stakingLists;
      setaggregatorPools(pools);
    }
  };

  const checkNetworkId = () => {
    if (
      !window.location.pathname.includes("bridge") &&
      !window.location.pathname.includes("migration")
    ) {
      if (
        window.ethereum &&
        !window.coin98 &&
        (window.ethereum.isMetaMask === true ||
          window.ethereum.isCoinbaseWallet === true)
      ) {
        window.ethereum
          .request({ method: "eth_chainId" })
          .then((data) => {
            if (data === "0x1") {
              setnetworkId("1");
            } else if (data === "0xa86a") {
              setnetworkId("43114");
            } else if (data === "0x2105") {
              setnetworkId("8453");
            } else if (data === "0x406") {
              setnetworkId("1030");
            } else if (data === "0x38") {
              setnetworkId("56");
            } else if (data === "0x585eb4b1") {
              setnetworkId("1482601649");
            } else if (data === "0x2105") {
              setnetworkId("8453");
            } else if (data !== "undefined") {
              setnetworkId("0");
            } else {
              setnetworkId("1");
            }
          })
          .catch(console.error);
      } else if (
        window.ethereum &&
        !window.coin98 &&
        (window.ethereum.isTrust === true || window.ethereum?.isTrustWallet)
      ) {
        window.ethereum
          .request({ method: "net_version" })
          .then((data) => {
            setnetworkId(data.toString());
          })
          .catch(console.error);
      } else if (
        window.ethereum &&
        window.ethereum.overrideIsMetaMask === true &&
        !window.coin98 &&
        !window.ethereum.isCoinbaseWallet
      ) {
        const chainId = window.ethereum.selectedProvider.chainId;

        if (chainId === "0x1") {
          setnetworkId("1");
        } else if (chainId === "0xa86a") {
          setnetworkId("43114");
        } else if (chainId === "0x2105") {
          setnetworkId("8453");
        } else if (chainId === "0x406") {
          setnetworkId("1030");
        } else if (chainId === "0x38") {
          setnetworkId("56");
        } else if (chainId === "0x2105") {
          setnetworkId("8453");
        } else if (chainId !== "undefined") {
          setnetworkId("0");
        } else {
          setnetworkId("1");
        }
      } else if (window.ethereum && window.coin98) {
        window.ethereum
          .request({ method: "net_version" })
          .then((data) => {
            if (data !== undefined) {
              setnetworkId(data);
            } else if (data !== "undefined") {
              setnetworkId("0");
            }
          })
          .catch(console.error);
      } else {
        setnetworkId("1");
      }
    }
  };

  const handleSwitchNetwork = (chainId) => {
    setnetworkId(chainId);
  };

  const fetchUserPools = async () => {
    if (coinbase && coinbase.includes("0x") && isConnected === true) {
      const result = await axios
        .get(`https://api.dyp.finance/api/user_pools/${coinbase}`)
        .then((data) => {
          return data.data.PoolsUserIn;
        });
      setuserPools(result);
    }
  };

  const refreshSubscription = async (userWallet) => {
    let subscribedPlatformTokenAmountNewETH;
    let subscribedPlatformTokenAmountNewAvax;
    let subscribedPlatformTokenAmountNewBNB;
    let subscribedPlatformTokenAmountNewBNB2;
    let subscribedPlatformTokenAmountCfx;
    let subscribedPlatformTokenAmountBase;
    let subscribedPlatformTokenAmountSkale;

    const web3eth = window.infuraWeb3;
    const web3avax = window.avaxWeb3;
    const web3bnb = window.bscWeb3;
    const web3cfx = window.confluxWeb3;
    const web3base = window.baseWeb3;
    const web3skale = window.skaleWeb3;

    const AvaxNewABI = window.SUBSCRIPTION_NEWAVAX_ABI;
    const EthNewABI = window.SUBSCRIPTION_NEWETH_ABI;
    const BnbNewABI = window.SUBSCRIPTION_NEWBNB_ABI;
    const BnbNew2ABI = window.SUBSCRIPTION_NEWBNB2_ABI;

    const CfxABI = window.SUBSCRIPTION_CFX_ABI;
    const BaseABI = window.SUBSCRIPTION_BASE_ABI;
    const SkaleABI = window.SUBSCRIPTION_SKALE_ABI;

    const ethsubscribeNewAddress = window.config.subscription_neweth_address;
    const avaxsubscribeNewAddress = window.config.subscription_newavax_address;
    const bnbsubscribeNewAddress = window.config.subscription_newbnb_address;
    const bnbsubscribeNewAddress2 = window.config.subscription_newbnb2_address;

    const cfxsubscribeAddress = window.config.subscription_cfx_address;
    const basesubscribeAddress = window.config.subscription_base_address;
    const skalesubscribeAddress = window.config.subscription_skale_address;

    const ethNewcontract = new web3eth.eth.Contract(
      EthNewABI,
      ethsubscribeNewAddress
    );

    const avaxNewcontract = new web3avax.eth.Contract(
      AvaxNewABI,
      avaxsubscribeNewAddress
    );

    const bnbNewcontract = new web3bnb.eth.Contract(
      BnbNewABI,
      bnbsubscribeNewAddress
    );
    const bnbNewcontract2 = new web3bnb.eth.Contract(
      BnbNew2ABI,
      bnbsubscribeNewAddress2
    );

    const cfxcontract = new web3cfx.eth.Contract(CfxABI, cfxsubscribeAddress);

    const basecontract = new web3base.eth.Contract(
      BaseABI,
      basesubscribeAddress
    );

    const skalecontract = new web3skale.eth.Contract(
      SkaleABI,
      skalesubscribeAddress
    );

    if (userWallet && isConnected === true) {
      subscribedPlatformTokenAmountNewETH = await ethNewcontract.methods
        .subscriptionPlatformTokenAmount(userWallet)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountNewAvax = await avaxNewcontract.methods
        .subscriptionPlatformTokenAmount(userWallet)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountNewBNB = await bnbNewcontract.methods
        .subscriptionPlatformTokenAmount(userWallet)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountNewBNB2 = await bnbNewcontract2.methods
        .subscriptionPlatformTokenAmount(userWallet)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountCfx = await cfxcontract.methods
        .subscriptionPlatformTokenAmount(userWallet)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountBase = await basecontract.methods
        .subscriptionPlatformTokenAmount(userWallet)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountSkale = await skalecontract.methods
        .subscriptionPlatformTokenAmount(userWallet)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      if (
        Number(subscribedPlatformTokenAmountNewETH) === 0 &&
        Number(subscribedPlatformTokenAmountCfx) === 0 &&
        Number(subscribedPlatformTokenAmountBase) === 0 &&
        Number(subscribedPlatformTokenAmountNewAvax) === 0 &&
        Number(subscribedPlatformTokenAmountNewBNB) === 0 &&
        Number(subscribedPlatformTokenAmountNewBNB2) === 0 &&
        Number(subscribedPlatformTokenAmountSkale) === 0
      ) {
        // setsubscribedPlatformTokenAmount("0");
        setisPremium(false);
      } else if (
        Number(subscribedPlatformTokenAmountNewETH) !== 0 ||
        Number(subscribedPlatformTokenAmountCfx) !== 0 ||
        Number(subscribedPlatformTokenAmountBase) !== 0 ||
        Number(subscribedPlatformTokenAmountNewAvax) !== 0 ||
        Number(subscribedPlatformTokenAmountNewBNB) !== 0 ||
        Number(subscribedPlatformTokenAmountNewBNB2) !== 0 ||
        Number(subscribedPlatformTokenAmountSkale) !== 0
      ) {
        setisPremium(true);
      }
    } else setisPremium(false);
  };

  const handleConnection = async () => {
    let referrer2 = window.param("r");
    let isConnected2 = await window.connectWallet(undefined, false);
    try {
      localStorage.setItem("logout", "false");

      if (isConnected2) {
        if (referrer2) {
          referrer2 = String(referrer2).trim().toLowerCase();
        }
        if (!window.web3.utils.isAddress(referrer2)) {
          referrer2 = window.config.ZERO_ADDRESS;
        }
      }

      setreferrer(referrer2);

      let the_graph_result_ETH_V2 = await window.get_the_graph_eth_v2();
      setthe_graph_result_ETH_V2(
        JSON.parse(JSON.stringify(the_graph_result_ETH_V2))
      );
    } catch (e) {
      setshow(false);

      window.alertify.error(String(e) || "Cannot connect wallet!");
      console.log(e);
      return;
    }
    setisConnected(isConnected2);

    // console.log(window.coinbase_address)
    let coinbase2 = await window.getCoinbase();
    if (coinbase2 !== null || coinbase2 !== undefined) {
      setcoinbase(coinbase2);
    }
    setshow(false);

    return isConnected2;
  };

  const tvl = async () => {
    try {
      if (networkId === "1") {
        let the_graph_result_ETH_V2 = await window.get_the_graph_eth_v2();
        setthe_graph_result_ETH_V2(
          JSON.parse(JSON.stringify(the_graph_result_ETH_V2))
        );
      } else if (networkId === "56") {
        let the_graph_result_BSC_V2 = await window.get_the_graph_bsc_v2();

        setthe_graph_result_BSC_V2(
          JSON.parse(JSON.stringify(the_graph_result_BSC_V2))
        );
      } else if (networkId === "43114") {
        let the_graph_result_AVAX_V2 = await window.get_the_graph_avax_v2();

        setthe_graph_result_AVAX_V2(
          JSON.parse(JSON.stringify(the_graph_result_AVAX_V2))
        );
      }
    } catch (e) {
      // window.alertify.error("Cannot fetch TVL");
      console.error("TVL ETH V2 error: " + e);
    }
  };

  const handleEthereum = async () => {
    const { ethereum } = window;
    if (
      ethereum &&
      (ethereum.isMetaMask === true ||
        window.ethereum.isTrust === true ||
        window.ethereum?.isTrustWallet)
    ) {
      console.log("Ethereum successfully detected!");
      tvl();
      checkNetworkId();
      await window.getCoinbase();
      // Access the decentralized web!
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const getAllBalance = async () => {
    const tokenAddress = window.config.token_dypius_new_address;
    const tokenAddress_bsc = window.config.token_dypius_new_bsc_address;
    const tokenAddress_base = window.config.reward_token_dypiusv2_base_address;

    const walletAddress = coinbase;
    const TokenABI = window.ERC20_ABI;

    if (coinbase && coinbase !== undefined && isConnected) {
      const contract1 = new window.infuraWeb3.eth.Contract(
        TokenABI,
        tokenAddress
      );
      const contract2 = new window.avaxWeb3.eth.Contract(
        TokenABI,
        tokenAddress_bsc
      );
      const contract3 = new window.bscWeb3.eth.Contract(
        TokenABI,
        tokenAddress_bsc
      );

      const contract4 = new window.baseWeb3.eth.Contract(
        TokenABI,
        tokenAddress_base
      );

      const contract1_idyp = new window.infuraWeb3.eth.Contract(
        TokenABI,
        window.config.reward_token_idyp_address
      );
      const contract2_idyp = new window.avaxWeb3.eth.Contract(
        TokenABI,
        window.config.reward_token_idyp_address
      );
      const contract3_idyp = new window.bscWeb3.eth.Contract(
        TokenABI,
        window.config.reward_token_idyp_address
      );

      let ethBalance = await contract1.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          let depositedTokens = new window.BigNumber(data)
            .div(1e18)
            .toString(10);
          return depositedTokens;
        })
        .catch((e) => {
          console.error(e);
          return 0;
        });

      let ethBalance_idyp = await contract1_idyp.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          let depositedTokens = new window.BigNumber(data)
            .div(1e18)
            .toString(10);
          return depositedTokens;
        })
        .catch((e) => {
          console.error(e);
          return 0;
        });

      let avaxBalance = await contract2.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          let depositedTokens = new window.BigNumber(data)
            .div(1e18)
            .toString(10);
          return depositedTokens;
        })
        .catch((e) => {
          console.error(e);
          return 0;
        });

      let baseBalance = await contract4.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          let depositedTokens = new window.BigNumber(data)
            .div(1e18)
            .toString(10);
          return depositedTokens;
        })
        .catch((e) => {
          console.error(e);
          return 0;
        });

      let avaxBalance_idyp = await contract2_idyp.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          let depositedTokens = new window.BigNumber(data)
            .div(1e18)
            .toString(10);
          return depositedTokens;
        })
        .catch((e) => {
          console.error(e);
          return 0;
        });

      let bnbBalance = await contract3.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          let depositedTokens = new window.BigNumber(data)
            .div(1e18)
            .toString(10);

          return depositedTokens;
        })
        .catch((e) => {
          console.error(e);
          return 0;
        });

      let bnbBalance_idyp = await contract3_idyp.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          let depositedTokens = new window.BigNumber(data)
            .div(1e18)
            .toString(10);

          return depositedTokens;
        })
        .catch((e) => {
          console.error(e);
          return 0;
        });

      if (
        (ethBalance !== undefined && ethBalance > 0) ||
        (bnbBalance !== undefined && bnbBalance > 0) ||
        (avaxBalance !== undefined && avaxBalance > 0) ||
        (baseBalance !== undefined && baseBalance > 0)
      ) {
        sethasDypBalance(true);
      } else {
        sethasDypBalance(false);
      }
      if (
        (ethBalance_idyp !== undefined && ethBalance_idyp > 0) ||
        (bnbBalance_idyp !== undefined && bnbBalance_idyp > 0) ||
        (avaxBalance_idyp !== undefined && avaxBalance_idyp > 0)
      ) {
        sethasiDypBalance(true);
      } else {
      }
    } else {
      sethasiDypBalance(false);
      sethasDypBalance(false);
    }
  };

  useEffect(() => {
    setTheme("theme-dark");
    tvl();
    fetchAggregatorPools();
    // setwhitelistPopup(true);
    if (window.location.hash === "#mobile-app") {
      setdownloadClick(true);
    }

    

    if (window.ethereum && !window.coin98) {
      console.log("yes");
      handleEthereum();
      checkConnection();
      checkNetworkId();
    } else {
      console.log("no");
      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
    }
  }, []);

  const checkConnection = async () => {
    tvl();
    const logout = localStorage.getItem("logout");

    if (
      logout !== "true" &&
      window.ethereum &&
      (window.ethereum.isMetaMask === true ||
        window.ethereum.isTrust === true ||
        window.ethereum?.isTrustWallet ||
        !window.ethereum.isCoin98 ||
        !window.ethereum.overrideIsMetaMask ||
        !window.ethereum.isCoinbaseWallet)
    ) {
      await window.ethereum
        .request({ method: "eth_accounts" })
        .then((data) => {
          setisConnected(data.length === 0 ? false : true);
          setcoinbase(data.length === 0 ? undefined : data[0]);

          if (data.length === 0) {
            localStorage.setItem("logout", "true");
          }
        })
        .catch(console.error);
    } else {
      setisConnected(false);
    }
  };

  const handlelogout = () => {
    localStorage.setItem("logout", "true");
    setisConnected(false);
    setisPremium(false);
    checkConnection();
  };

  // const toggleMinimizeSidebar = () => {
  //   const f = () => window.dispatchEvent(new Event("resize"));
  //   setisMinimized(!isMinimized, () => f());

  //   f();
  //   let newInterval = setInterval(f, 16);
  //   setTimeout(() => clearInterval(newInterval), 1000);
  // };

  const toggleMobileSidebar = () => {
    setisOpenInMobile(!isOpenInMobile);
  };

  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 540,
    width: "100%",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    minHeight: 200,
    overflowX: "hidden",
    borderRadius: "10px",
    height: "auto",
    background: `#1A1A36`,
  };

  const dummyPremiums = [
    {
      chestTitle: "Jewel Coffer",
      closedImg: "greenCrystal",
      chestId: 1,
    },
    {
      chestTitle: "Gold Hoard",
      closedImg: "blueCrystal",
      chestId: 2,
    },
    {
      chestTitle: "Pirate's Bounty",
      closedImg: "yellowCrystal",
      chestId: 3,
    },
    {
      chestTitle: "Gem Trove",
      closedImg: "purpleCrystal",
      chestId: 4,
    },
    {
      chestTitle: "Coin Chest",
      closedImg: "cyanCrystal",
      chestId: 5,
    },
    {
      chestTitle: "Silver Cache",
      closedImg: "greenCrystal",
      chestId: 6,
    },
    {
      chestTitle: "Ruby Stash",
      closedImg: "blueCrystal",
      chestId: 7,
    },
    {
      chestTitle: "Mystic Reliquary",
      closedImg: "yellowCrystal",
      chestId: 8,
    },
    {
      chestTitle: "Ancient Relics",
      closedImg: "purpleCrystal",
      chestId: 9,
    },
    {
      chestTitle: "Emerald Trove",
      closedImg: "cyanCrystal",
      chestId: 10,
    },
  ];

  const chestImagesBnb = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ];

  const { LP_IDs_V2 } = window;
  const { ethereum } = window;
  // console.log("the_graph_resultbsc", the_graph_resultbsc);
  const LP_ID_Array = [
    LP_IDs_V2.weth[0],
    LP_IDs_V2.weth[1],
    LP_IDs_V2.weth[2],
    LP_IDs_V2.weth[3],
    LP_IDs_V2.weth[4],
  ];

  if (
    !window.location.pathname.includes("bridge") &&
    !window.location.pathname.includes("migration")
  ) {
    ethereum?.on("chainChanged", checkNetworkId);
    ethereum?.on("accountsChanged", checkConnection);
    // ethereum?.on("accountsChanged", refreshSubscription);
  }

  Amplify.configure(awsExports);

  function UnAuthenticatedContent() {
    setFireAppContent(false);

    return (
      <React.Fragment>
        <Navigate to="/account" />
      </React.Fragment>
    );
  }

  const AppContent = () => {
    const { isLoading, isAuthenticated, playerId } = useAuth();

    useEffect(() => {
      if (!isLoading || !isAuthenticated || !playerId) {
        setFireAppContent(false);
      } else if (!isLoading && isAuthenticated && playerId) {
        setFireAppContent(true);
      }
    }, [isLoading, isAuthenticated, playerId]);

    if (isLoading) {
      return <LandingScreen />;
    }

    if (isAuthenticated) {
      if (!playerId) {
        return (
          <React.Fragment>
            <Navigate to="/player" />
          </React.Fragment>
        );
      }

      return (
        <React.Fragment>
          <Navigate to="/account" />
        </React.Fragment>
      );
    }

    return <UnAuthenticatedContent />;
  };

  document.addEventListener("touchstart", { passive: true });
  const windowSize = useWindowSize();

  const { email, logout } = useAuth();
  const { data, refetch: refetchPlayer } = useQuery(GET_PLAYER, {
    fetchPolicy: "network-only",
  });

  const userId = data?.getPlayer?.playerId;
  const username = data?.getPlayer?.displayName;

  const placeholderplayerData = [
    {
      position: "0",
      displayName: "...",
      reward: "---",
      premium: false,
      statValue: "---",
    },
    {
      position: "1",
      displayName: "...",
      reward: "---",
      premium: false,
      statValue: "---",
    },
    {
      position: "2",
      displayName: "...",
      reward: "---",
      premium: false,
      statValue: "---",
    },
    {
      position: "3",
      displayName: "...",
      reward: "---",
      statValue: "---",
      premium: false,
    },

    {
      position: "4",
      displayName: "...",
      reward: "---",
      premium: false,
      statValue: "---",
    },
    {
      position: "5",
      displayName: "...",
      reward: "---",
      premium: false,
      statValue: "---",
    },
    {
      position: "6",
      displayName: "...",
      reward: "---",
      premium: false,
      statValue: "---",
    },
    {
      position: "7",
      displayName: "...",
      reward: "---",
      premium: false,
      statValue: "---",
    },
    {
      position: "8",
      displayName: "...",
      reward: "---",
      premium: false,
      statValue: "---",
    },
    {
      position: "9",
      displayName: "...",
      reward: "---",
      premium: false,
      statValue: "---",
    },
  ];

  const [generateNonce, { data: dataNonce }] = useMutation(GENERATE_NONCE);
  const [verifyWallet, { data: dataVerify }] = useMutation(VERIFY_WALLET);

  const fillRecordsCaws2d = (itemData) => {
    if (itemData.length === 0) {
      setleaderboard(placeholderplayerData);
    } else if (itemData.length <= 10) {
      const testArray = itemData;
      const placeholderArray = placeholderplayerData.slice(itemData.length, 10);
      const finalData = [...testArray, ...placeholderArray];
      setleaderboard(finalData);
    } else if (itemData.length > 10) {
      setleaderboard(itemData);
    }
  };

  const signWalletPublicAddress = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(coinbase);
      const signature = await signer.signMessage(
        `Signing one-time nonce: ${dataNonce?.generateWalletNonce?.nonce}`
      );
      verifyWallet({
        variables: {
          publicAddress: coinbase,
          signature: signature,
        },
      }).then(() => {
        if (isonSync) {
          setsyncStatus("success");
          setTimeout(() => {
            setsyncStatus("initial");
          }, 1000);
        }
        refreshSubscription(coinbase);

        if (isonlink) {
          window.location.reload();
        }
      });
    } catch (error) {
      if (isonSync) {
        setsyncStatus("error");
        setTimeout(() => {
          setsyncStatus("initial");
        }, 3000);
      }
      console.log("🚀 ~ file: Dashboard.js:30 ~ getTokens ~ error", error);
    }
  };

  const loadLeaderboardDataCaws2dGame = async () => {
    let leaderboard2 = [];
    try {
      leaderboard2 = await (
        await fetch("https://game.dypius.com/api/leaderboard")
      ).json();
    } catch (e) {
      console.warn(e);
    }
    leaderboard2 = leaderboard2.sort((a, b) => b.score - a.score);

    var testArray =
      leaderboard2.length > 0
        ? leaderboard2.filter(
            (item) =>
              item.address.toLowerCase() ===
              data?.getPlayer?.wallet?.publicAddress?.toLowerCase()
          )
        : [];

    fillRecordsCaws2d(leaderboard2);
    if (
      testArray.length > 0 &&
      leaderboard2.indexOf(
        leaderboard2.find((item) => {
          return (
            item.address ===
            data?.getPlayer?.wallet?.publicAddress?.toLowerCase()
          );
        })
      ) > 20
    ) {
      setActivePlayerCaws2d(false);
      setCaws2dUser(...testArray);
    } else {
      setCaws2dUser([]);
    }
  };

  const getAllChests = async () => {
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({ emailAddress: email });

    let response = await fetch(
      "https://worldofdypiansdailybonus.azurewebsites.net/api/GetRewardsDypius?code=H9zoL4Hdr7fr7rzSZLTzilDT99fgwth006S7bO3J3Ua9AzFucS1HoA%3D%3D",
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    ).catch((err) => {
      console.log(err);
    });
    if (response && response.status === 200) {
      let data = await response.json();

      setChests(data.chestOrder);
      let standardChestsArray = [];
      let premiumChestsArray = [];
      let openedChests = [];
      // let openedStandardChests = [];
      // let openedPremiumChests = [];

      if (data.chestOrder.length > 0) {
        for (let item = 0; item < data.chestOrder.length; item++) {
          if (data.chestOrder[item].chestType === "Standard") {
            if (data.chestOrder[item].isOpened === true) {
              openedChests.push(data.chestOrder[item]);
            }
            standardChestsArray.push(data.chestOrder[item]);
          } else if (data.chestOrder[item].chestType === "Premium") {
            if (data.chestOrder[item].isOpened === true) {
              openedChests.push(data.chestOrder[item]);
            }
            premiumChestsArray.push(data.chestOrder[item]);
          }
        }
        setOpenedChests(openedChests);
      }

      // setOpenedChests(
      //   data.chestOrder.filter((item) => {
      //     return (item.isOpened = true);
      //   })
      // );
    }
  };

  const fillRecordsWeekly = (itemData) => {
    if (itemData.length === 0) {
      setweeklyplayerData(placeholderplayerData);
    } else if (itemData.length <= 10) {
      const testArray = itemData;
      const placeholderArray = placeholderplayerData.slice(itemData.length, 10);
      const finalData = [...testArray, ...placeholderArray];
      setweeklyplayerData(finalData);
    }
  };
  const fillRecordsMonthly = (itemData) => {
    if (itemData.length === 0) {
      setmonthlyplayerData(placeholderplayerData);
    } else if (itemData.length <= 10) {
      const testArray = itemData;
      const placeholderArray = placeholderplayerData.slice(itemData.length, 10);
      const finalData = [...testArray, ...placeholderArray];
      setmonthlyplayerData(finalData);
    }
  };

  const fetchRecordsAroundPlayerWeekly = async (itemData) => {
    const data = {
      StatisticName: "LeaderboardDypiusWeekly",
      MaxResultsCount: 6,
      PlayerId: userId,
    };
    if (userId) {
      const result = await axios.post(
        `${backendApi}/auth/GetLeaderboardAroundPlayer`,
        data
      );
      var testArray = result.data.data.leaderboard.filter(
        (item) => item.displayName === username
      );
      if (itemData.length > 0) {
        var testArray2 = Object.values(itemData).filter(
          (item) => item.displayName === username
        );

        if (testArray.length > 0 && testArray2.length > 0) {
          setActivePlayerWeekly(true);
          setWeeklyUser([]);
        } else if (testArray.length > 0 && testArray2.length === 0) {
          setActivePlayerWeekly(false);
          setWeeklyUser(...testArray);
        }
      } else if (testArray.length > 0) {
        setActivePlayerWeekly(false);
        setWeeklyUser(...testArray);
      }
    } else {
      setActivePlayerWeekly(true);
      setWeeklyUser([]);
    }
  };

  const fetchWeeklyWinners = async () => {
    const data = {
      StatisticName: "LeaderboardDypiusWeekly",
      StartPosition: 0,
      MaxResultsCount: 10,
    };
    const result = await axios
      .post(`${backendApi}/auth/GetLeaderboard`, data)
      .catch((err) => {
        console.log(err);
      });
    setpreviousWeeklyVersion(parseInt(result.data.data.version));
    setweeklyplayerData(result.data.data.leaderboard);
    var testArray = result.data.data.leaderboard.filter(
      (item) => item.displayName === username
    );
    fillRecordsWeekly(result.data.data.leaderboard);
    if (testArray.length > 0) {
      setActivePlayerWeekly(true);
      fetchRecordsAroundPlayerWeekly(result.data.data.leaderboard);
    } else if (testArray.length === 0) {
      setActivePlayerWeekly(false);
      fetchRecordsAroundPlayerWeekly(result.data.data.leaderboard);
    }
  };

  const fetchPreviousWeeklyWinners = async () => {
    if (previousWeeklyVersion !== 0) {
      const data = {
        StatisticName: "LeaderboardDypiusWeekly",
        StartPosition: 0,
        MaxResultsCount: 10,
        Version: previousWeeklyVersion - 1,
      };
      const result = await axios
        .post(`${backendApi}/auth/GetLeaderboard?Version=-1`, data)
        .catch((err) => {
          console.log(err);
        });

      setweeklyplayerData(result.data.data.leaderboard);
    }
  };

  const fetchRecordsAroundPlayerMonthly = async (itemData) => {
    const data = {
      StatisticName: "LeaderboardDypiusMonthly",
      MaxResultsCount: 6,
      PlayerId: userId,
    };
    if (userId) {
      const result = await axios.post(
        `${backendApi}/auth/GetLeaderboardAroundPlayer`,
        data
      );
      var testArray = result.data.data.leaderboard.filter(
        (item) => item.displayName === username
      );

      if (itemData.length > 0) {
        var testArray2 = Object.values(itemData).filter(
          (item) => item.displayName === username
        );

        if (testArray.length > 0 && testArray2.length > 0) {
          setActivePlayerMonthly(true);
          setMonthlyUser([]);
        } else if (testArray.length > 0 && testArray2.length === 0) {
          setActivePlayerMonthly(false);
          setMonthlyUser(...testArray);
        }
      } else if (testArray.length > 0) {
        setActivePlayerMonthly(false);
        setMonthlyUser(...testArray);
      }
    } else {
      setActivePlayerMonthly(true);
      setMonthlyUser([]);
    }
  };

  const fetchMonthlyWinners = async () => {
    const data = {
      StatisticName: "LeaderboardDypiusMonthly",
      StartPosition: 0,
      MaxResultsCount: 10,
    };
    const result = await axios
      .post(`${backendApi}/auth/GetLeaderboard`, data)
      .catch((err) => {
        console.log(err);
      });
    setpreviousMonthlyVersion(parseInt(result.data.data.version));
    setmonthlyplayerData(result.data.data.leaderboard);
    var testArray = result.data.data.leaderboard.filter(
      (item) => item.displayName === username
    );
    fillRecordsMonthly(result.data.data.leaderboard);
    if (testArray.length > 0) {
      setActivePlayerMonthly(true);
      fetchRecordsAroundPlayerMonthly(result.data.data.leaderboard);
    } else if (testArray.length === 0) {
      setActivePlayerMonthly(false);
      fetchRecordsAroundPlayerMonthly(result.data.data.leaderboard);
    }
  };

  const fetchPreviousMonthlyWinners = async () => {
    if (previousMonthlyVersion !== 0) {
      const data = {
        StatisticName: "LeaderboardDypiusMonthly",
        StartPosition: 0,
        MaxResultsCount: 10,
        Version: previousMonthlyVersion - 1,
      };
      const result = await axios
        .post(`${backendApi}/auth/GetLeaderboard?Version=-1`, data)
        .catch((err) => {
          console.log(err);
        });

      setmonthlyplayerData(result.data.data.leaderboard);
    }
  };

  const fetchRecordsAroundPlayerKitty = async (itemData) => {
    const data = {
      StatisticName: "MobileGameDailyLeaderboard",
      MaxResultsCount: 6,
      PlayerId: userId,
    };
    if (userId) {
      const result = await axios.post(
        `${backendApi}/auth/GetLeaderboardAroundPlayer`,
        data
      );
      var testArray = result.data.data.leaderboard.filter(
        (item) => item.displayName === username
      );
      if (itemData.length > 0) {
        var testArray2 = Object.values(itemData).filter(
          (item) => item.displayName === username
        );

        if (testArray.length > 0 && testArray2.length > 0) {
          setActivePlayerKitty(true);
          setKittyUser([]);
        } else if (testArray.length > 0 && testArray2.length === 0) {
          setActivePlayerKitty(false);
          setKittyUser(...testArray);
        }
      } else if (testArray.length > 0) {
        setActivePlayerKitty(false);
        setKittyUser(...testArray);
      }
    } else {
      setActivePlayerKitty(true);
      setKittyUser([]);
    }
  };

  const fetchKittyDashWinners = async () => {
    const data = {
      StatisticName: "MobileGameDailyLeaderboard",
      StartPosition: 0,
      MaxResultsCount: 10,
    };
    const result = await axios
      .post(`${backendApi}/auth/GetLeaderboard`, data)
      .catch((err) => {
        console.log(err);
      });
    setpreviousKittyDashVersion(parseInt(result?.data?.data?.version));
    setkittyDashRecords(result?.data?.data?.leaderboard);

    var testArray = result.data.data.leaderboard.filter(
      (item) => item.displayName === username
    );
    if (testArray.length > 0) {
      setActivePlayerKitty(true);
      fetchRecordsAroundPlayerKitty(result.data.data.leaderboard);
    } else if (testArray.length === 0) {
      setActivePlayerKitty(false);
      fetchRecordsAroundPlayerKitty(result.data.data.leaderboard);
    }
  };

  const fetchPreviousKittyDashWinners = async () => {
    if (previousKittyDashVersion !== 0) {
      const data = {
        StatisticName: "MobileGameDailyLeaderboard",
        StartPosition: 0,
        MaxResultsCount: 10,
        Version: previousKittyDashVersion - 1,
      };
      const result = await axios
        .post(`${backendApi}/auth/GetLeaderboard?Version=-1`, data)
        .catch((err) => {
          console.log(err);
        });

      setkittyDashRecords(result?.data?.data?.leaderboard);
    }
  };

  useEffect(() => {
    if (email) {
      getAllChests();
    } else {
      setChests([]);
      setOpenedChests([]);
    }
  }, [email, chestCount]);

  useEffect(() => {
    loadLeaderboardDataCaws2dGame();
  }, [data]);

  useEffect(() => {
    if (email && data?.getPlayer?.wallet?.publicAddress !== undefined) {
      refreshSubscription(data?.getPlayer?.wallet?.publicAddress);
    } else if (isConnected && coinbase) {
      refreshSubscription(coinbase);
      getAllBalance();
      fetchUserPools();
    } else {
      setisPremium(false);
    }
  }, [isConnected, coinbase, email, data]);

  const onPlayerFetch = () => {
    refetchPlayer();
  };

  const onLogout = () => {
    logout();
    setTimeout(() => {
      refetchPlayer();
    }, 1000);
  };

  const handleSync = async () => {
    setsyncStatus("loading");
    setisonSync(true);
    try {
      await generateNonce({
        variables: {
          publicAddress: coinbase,
        },
      });
    } catch (error) {
      setsyncStatus("error");
      setTimeout(() => {
        setsyncStatus("initial");
      }, 3000);
      console.log("🚀 ~ file: Dashboard.js:30 ~ getTokens ~ error", error);
    }
  };

  const onLinkWallet = async () => {
    if (isConnected) {
      setIsOnLink(true);
      await generateNonce({
        variables: {
          publicAddress: coinbase,
        },
      });
    } else {
      setshow(true);
    }
  };

  useEffect(() => {
    if (dataVerify?.verifyWallet) {
      refetchPlayer();
    }
  }, [dataVerify]);

  useEffect(() => {
    if (dataNonce?.generateWalletNonce) {
      signWalletPublicAddress();
    }
  }, [dataNonce]);

  return (
    <div className={`page_wrapper`}>
      {/* <img src={navRadius} className="nav-radius" alt="" /> */}
      {/* <LandFlyout />   */}

      <div className="body_overlay"></div>
      {showRibbon && (
        <AlertRibbon
          onClose={() => {
            setshowRibbon(false);
          }}
          onComplete={() => {
            setshowRibbon(false);
            setshowRibbon2(false);
          }}
        />
      )}

      {showFlyout && (
        <MobileFlyout
          onClose={() => {
            setshowFlyout(false);
          }}
          onDownloadClick={() => {
            setdownloadClick(true);
          }}
        />
      )}
      <div>
        {(window.location?.pathname === "/genesis" &&
          window.innerWidth < 786) ||
        (window.location?.pathname === "/caws-staking" &&
          window.innerWidth < 786) ? null : (
          <Header
            coinbase={coinbase}
            toggleMobileSidebar={toggleMobileSidebar}
            isOpenInMobile={isOpenInMobile}
            chainId={parseInt(networkId)}
            logout={handlelogout}
            handleSwitchNetwork={handleSwitchNetwork}
            handleConnection={handleConnection}
            showModal={showModal}
            hideModal={hideModal}
            show={show}
            isConnected={isConnected}
            isPremium={isPremium}
            onSetCurrencyAmount={(value) => {
              setuserCurencyBalance(value);
            }}
            showFlyout={showFlyout}
          />
        )}

        {fireAppcontent === true && <AppContent />}

        <div className="content-wrapper container-fluid d-flex justify-content-center justify-content-lg-start">
          <div className="row w-100">
            <div className="col-1">
              <Sidebar
                isConnected={isConnected}
                toggleMobileSidebar={toggleMobileSidebar}
                isOpenInMobile={isOpenInMobile}
                showModal={showModal}
                hideModal={hideModal}
                show={show}
                checkConnection={checkConnection}
                isPremium={isPremium}
                network={networkId}
                showRibbon={showRibbon}
              />
            </div>
            <div
              className={`${
                windowSize.width < 991
                  ? "col-12 px-1"
                  : windowSize.width < 1490
                  ? "col-11"
                  : "col-10"
              }`}
            >
              <div className="right-content pr-0 my-4 my-lg-5">
                <Routes>
                  <Route element={GoogleAnalyticsReporter} />

                  {/* <Route
                    exact
                    path="/pool-explorer"
                    render={() => (
                      <PoolExplorer
                        theme={theme}
                        networkId={parseInt(explorerNetworkId)}
                        handleConnection={this.handleConnection}
                        isConnected={isConnected}
                        appState={this.state}
                        onSelectChain={this.onSelectChain}
                      />
                    )}
                  /> */}

                  {/* <Route
                    exact
                    path="/big-swap-explorer"
                    render={() => (
                      <BigSwapExplorer
                        theme={theme}
                        networkId={parseInt(explorerNetworkId)}
                        isConnected={isConnected}
                        appState={this.state}
                        onSelectChain={this.onSelectChain}
                      />
                    )}
                  /> */}
                  {/* <Route
                    exact
                    path="/pair-explorer/:pair_id?"
                    render={(props) => (
                      // to do
                      <PairExplorer
                        appState={this.state}
                        isPremium={isPremium}
                        key={props.match.params.pair_id}
                        theme={theme}
                        networkId={parseInt(explorerNetworkId)}
                        onSelectChain={this.onSelectChain}
                        {...props}
                      />
                    )}
                  /> */}

                  {/* <Route
                    exact
                    path="/top-tokens"
                    render={() => (
                      <TopTokens
                        theme={theme}
                        networkId={parseInt(explorerNetworkId)}
                        isConnected={isConnected}
                        onSelectChain={this.onSelectChain}
                      />
                    )}
                  /> */}
                  <Route
                    exact
                    path="/loyalty-program"
                    element={
                      <LoyaltyProgram
                        coinbase={coinbase}
                        isConnected={isConnected}
                        handleConnection={handleConnection}
                      />
                    }
                  />

                  <Route
                    exact
                    path="/farms"
                    element={
                      <Farms
                        handleConnection={handleConnection}
                        isConnected={isConnected}
                        networkId={parseInt(explorerNetworkId)}
                        onSelectChain={onSelectChain}
                      />
                    }
                  />

                  <Route
                    exact
                    path="/sign-in"
                    element={
                      <Auth isConnected={isConnected} coinbase={coinbase} />
                    }
                  />

                  <Route
                    exact
                    path="/forgotPassword"
                    element={<ForgotPassword />}
                  />
                  <Route
                    exact
                    path="/ResetPassword"
                    element={<ResetPassword />}
                  />
                  <Route exact path="/player" element={<PlayerCreation />} />

                  <Route
                    exact
                    path="/games"
                    element={
                      <Games
                        leaderboardCaws2d={leaderboard}
                        handleConnection={showModal}
                        isConnected={isConnected}
                        networkId={parseInt(networkId)}
                        onSelectChain={onSelectChain}
                        coinbase={coinbase}
                        onChestClaimed={onChestClaimed}
                        dummypremiumChests={dummyPremiums}
                        isPremium={isPremium}
                        bnbImages={chestImagesBnb}
                        email={email}
                        chests={chests}
                        openedChests={openedChests}
                        address={data?.getPlayer?.wallet?.publicAddress}
                        userId={data?.getPlayer?.playerId}
                        username={username}
                        handleSwitchNetwork={handleSwitchNetwork}
                        monthlyplayerData={monthlyplayerData}
                        previousMonthlyVersion={previousMonthlyVersion}
                        previousWeeklyVersion={previousWeeklyVersion}
                        weeklyplayerData={weeklyplayerData}
                        previousKittyDashVersion={previousKittyDashVersion}
                        kittyDashRecords={kittyDashRecords}
                        fetchWeeklyWinners={fetchWeeklyWinners}
                        fetchMonthlyWinners={fetchMonthlyWinners}
                        fetchKittyDashWinners={fetchKittyDashWinners}
                        fetchPreviousMonthlyWinners={
                          fetchPreviousMonthlyWinners
                        }
                        fetchPreviousWeeklyWinners={fetchPreviousWeeklyWinners}
                        fetchPreviousKittyDashWinners={
                          fetchPreviousKittyDashWinners
                        }
                        kittyUser={kittyUser}
                        caws2dUser={caws2dUser}
                        weeklyUser={weeklyUser}
                        monthlyUser={monthlyUser}
                        activePlayerKitty={activePlayerKitty}
                        activePlayerCaws2d={activePlayerCaws2d}
                        activePlayerWeekly={activePlayerWeekly}
                        activePlayerMonthly={activePlayerMonthly}
                      />
                    }
                  />
                  {/* setmonthlyplayerData
setpreviousMonthlyVersion
setpreviousWeeklyVersion
setweeklyplayerData
setweeklyplayerData
setpreviousKittyDashVersion
setkittyDashRecords */}

                  <Route
                    exact
                    path="/earn/dypius"
                    element={
                      <Earn
                        coinbase={coinbase}
                        the_graph_result={the_graph_result_ETH_V2}
                        the_graph_resultavax={the_graph_result_AVAX_V2}
                        the_graph_resultbsc={the_graph_result_BSC_V2}
                        lp_id={LP_ID_Array}
                        isConnected={isConnected}
                        network={networkId}
                        handleConnection={handleConnection}
                        handleSwitchNetwork={handleSwitchNetwork}
                        referrer={referrer}
                        isPremium={isPremium}
                        showRibbon={showRibbon2}
                        onConnectWallet={showModal}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/earn/defi-staking"
                    element={
                      <EarnOther
                        type={"defi"}
                        isPremium={isPremium}
                        coinbase={coinbase}
                        the_graph_result={the_graph_result_ETH_V2}
                        the_graph_resultavax={the_graph_result_AVAX_V2}
                        the_graph_resultbsc={the_graph_result_BSC_V2}
                        lp_id={LP_ID_Array}
                        isConnected={isConnected}
                        network={networkId}
                        handleConnection={handleConnection}
                        handleSwitchNetwork={handleSwitchNetwork}
                        referrer={referrer}
                        onConnectWallet={showModal}
                        aggregatorPools={aggregatorPools}
                        userCurencyBalance={userCurencyBalance}
                      />
                    }
                  />

                  <Route
                    exact
                    path="/launchpad"
                    element={
                      <Whitelist
                        networkId={parseInt(networkId)}
                        isConnected={isConnected}
                        handleConnection={showModal}
                        coinbase={coinbase}
                        isPremium={isPremium}
                        userPools={userPools}
                        hasDypBalance={hasDypBalance}
                        hasiDypBalance={hasiDypBalance}
                      />
                    }
                  />

                  <Route
                    exact
                    path="/earn/nft-staking"
                    element={
                      <EarnOtherNft
                        type={"nft"}
                        isPremium={isPremium}
                        coinbase={coinbase}
                        isConnected={isConnected}
                        network={networkId}
                        handleConnection={handleConnection}
                        handleSwitchNetwork={handleSwitchNetwork}
                      />
                    }
                  />

                  <Route
                    exact
                    path="/bridge"
                    element={
                      <Bridge
                        networkId={parseInt(networkId)}
                        isConnected={isConnected}
                        handleConnection={handleConnection}
                        coinbase={coinbase}
                      />
                    }
                  />

                  <Route
                    exact
                    path="/launchpad"
                    element={
                      <Whitelist
                        networkId={parseInt(networkId)}
                        isConnected={isConnected}
                        handleConnection={handleConnection}
                        coinbase={coinbase}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/migration"
                    element={
                      <DypMigration
                        networkId={parseInt(networkId)}
                        isConnected={isConnected}
                        handleConnection={handleConnection}
                        coinbase={coinbase}
                      />
                    }
                  />

                  {/* <Route
                    exact
                    path="/caws"
                    render={() => (
                      <NftMinting
                        isConnected={isConnected}
                        coinbase={coinbase}
                        handleConnection={this.handleConnection}
                      />
                    )}
                  /> */}

                  {/* <Route
                    exact
                    path="/submit-info"
                    render={() => <SubmitInfo theme={theme} />}
                  /> */}
                  <Route
                    exact
                    path="/terms-of-service"
                    element={<Disclaimer />}
                  />
                  {/* <Route exact path="/swap" component={Swap} /> */}

                  {/* <Route
                    exact
                    path="/governance"
                    render={() => <Governance />}
                  /> */}
                  {/* <Route
                      exact
                      path="/launchpad"
                      render={() => <Launchpad />}
                    />
                    <Route
                      exact
                      path="/launchpad/details/:id"
                      render={() => <LaunchpadDetails />}
                    />
                    <Route
                      exact
                      path="/launchpad/form"
                      render={() => <LaunchpadForm />}
                    />
                    <Route
                      exact
                      path="/launchpad/tiers"
                      render={() => (
                        <TierLevels
                          coinbase={coinbase}
                          chainId={networkId}
                          handleConnection={this.handleConnection}
                          the_graph_result={the_graph_result_ETH_V2}
                          lp_id={LP_ID_Array}
                          isConnected={isConnected}
                        />
                      )}
                    /> */}
                  <Route exact path="/buydyp" element={<BuyDyp />} />

                  <Route
                    exact
                    path="/governance"
                    element={
                      networkId === "56" ? (
                        <Governancebsc
                          coinbase={coinbase}
                          connected={isConnected}
                          handleConnection={handleConnection}
                          networkId={parseInt(networkId)}
                        />
                      ) : networkId === "43114" ? (
                        <Governancedev
                          coinbase={coinbase}
                          connected={isConnected}
                          handleConnection={handleConnection}
                          networkId={parseInt(networkId)}
                        />
                      ) : (
                        <GovernanceEth
                          coinbase={coinbase}
                          connected={isConnected}
                          handleConnection={handleConnection}
                          networkId={parseInt(networkId)}
                        />
                      )
                    }
                  />

                  <Route
                    exact
                    path="/"
                    element={
                      <Dashboard
                        the_graph_resultavax={the_graph_result_AVAX_V2}
                        the_graph_resultbsc={the_graph_result_BSC_V2}
                        coinbase={coinbase}
                        the_graph_result={the_graph_result_ETH_V2}
                        lp_id={LP_ID_Array}
                        isConnected={isConnected}
                        network={parseInt(networkId)}
                        handleConnection={handleConnection}
                        referrer={referrer}
                        isPremium={isPremium}
                        onConnectWallet={showModal}
                        aggregatorPools={aggregatorPools}
                        onMobileClick={() => {
                          setshowMobilePopup(true);
                        }}
                      />
                    }
                  />

                  <Route
                    exact
                    path="/news/:news_id?"
                    element={<News isPremium={isPremium} coinbase={coinbase} />}
                  />

                  <Route
                    exact
                    path="/account"
                    element={
                      <Account
                        networkId={parseInt(networkId)}
                        handleSwitchNetwork={handleSwitchNetwork}
                        coinbase={coinbase}
                        isConnected={isConnected}
                        isPremium={isPremium}
                        onSubscribe={refreshSubscription}
                        showRibbon={showRibbon2}
                        email={email}
                        address={data?.getPlayer?.wallet?.publicAddress}
                        game_username={data?.getPlayer?.displayName}
                        onLogout={onLogout}
                        onLinkWallet={onLinkWallet}
                        userId={data?.getPlayer?.playerId}
                        onPlayerFetch={onPlayerFetch}
                        onSyncClick={handleSync}
                        syncStatus={syncStatus}
                      />
                    }
                  />
                  {/* <Route
                    exact
                    path="/plans"
                    element={
                      <Plans
                        networkId={parseInt(networkId)}
                        handleSwitchNetwork={handleSwitchNetwork}
                        coinbase={coinbase}
                        isPremium={isPremium}
                        isConnected={isConnected}
                        onSubscribe={refreshSubscription}
                      />
                    }
                  /> */}
                  <Route
                    exact
                    path="/locker/:pair_id?"
                    element={
                      <LockerWrapper
                        handleConnection={handleConnection}
                        isConnected={isConnected}
                        theme={theme}
                        coinbase={coinbase}
                        networkId={networkId}
                        // {...props}
                      />
                    }
                  />

                  <Route
                    exact
                    path="/admin"
                    element={
                      <Admin
                        handleConnection={handleConnection}
                        isConnected={isConnected}
                        // {...props}
                      />
                    }
                  />
                  {/* <Route
                    exact
                    path="/genesis"
                    element={
                      <GenesisStaking
                        coinbase={coinbase}
                        isConnected={isConnected}
                        chainId={networkId}
                        handleConnection={handleConnection}
                        handleSwitchNetwork={handleSwitchNetwork}
                      />
                    }
                  /> */}
                  {/* <Route
                    exact
                    path="/caws-staking"
                    render={(props) => (
                      <CawsStaking
                        coinbase={coinbase}
                        isConnected={isConnected}
                        chainId={networkId}
                        handleConnection={this.handleConnection}
                        handleSwitchNetwork={this.handleSwitchNetwork}
                      />
                    )}
                  /> */}

                  <Route element={RedirectPathToHomeOnly} />
                </Routes>

                {/* <Footer /> */}
              </div>
            </div>
            <div className="col-1"></div>
          </div>
          {window.location?.pathname === "/genesis" ||
          window.location?.pathname === "/caws-staking" ? null : (
            <MobileMenu />
          )}
        </div>
      </div>
      {(window.location?.pathname === "/genesis" && window.innerWidth < 786) ||
      (window.location?.pathname === "/caws-staking" &&
        window.innerWidth < 786) ? null : (
        <Footer />
      )}

      {(showMobilePopup === true || downloadClick === true) && (
        <Modal
          open={showMobilePopup || downloadClick}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style2}>
            <div className="d-flex flex-column justify-content-center position-relative">
              <div className="d-flex flex-column gap-3 align-items-center justify-content-between">
                <div className="d-flex align-items-center  justify-content-between gap-5 w-100">
                  <h4 className="mobile-popup-title">Dypius Mobile App</h4>

                  <img
                    src={"https://cdn.worldofdypians.com/wod/popupXmark.svg"}
                    alt=""
                    className="close-x position-relative cursor-pointer "
                    onClick={() => {
                      setdownloadClick(false);
                      setshowMobilePopup(false);
                    }}
                    style={{
                      bottom: "17px",
                      alignSelf: "end",
                      width: 16,
                      height: 16,
                    }}
                  />
                </div>
                <div className="mobile-popup-content-wrapper p-3">
                  <div className="d-flex flex-column gap-3">
                    <ul className="mobile-content-list">
                      <li className="mobile-content-text">
                        Available exclusively in APK format for{" "}
                        <b style={{ color: "#4ED5D2" }}>Android</b> devices.
                      </li>
                      <li className="mobile-content-text">
                        Early release with some fully functional features.
                      </li>
                      <li className="mobile-content-text">
                        Other features are in view-only mode, relying on the
                        MetaMask Unity SDK.
                      </li>
                      <li className="mobile-content-text">
                        MetaMask-related issues are beyond our control; we're
                        seeking support to resolve them.
                      </li>
                      <li className="mobile-content-text">
                        Your feedback is valuable as we continue to improve the
                        app.
                      </li>
                      <li className="mobile-content-text">
                        Thank you for your understanding and patience.
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="separator my-2"></div>
                <div className="d-flex align-items-center justify-content-center">
                  <BrowserView>
                    <button className={`btn disabled-btn `} disabled={true}>
                      Download on mobile
                    </button>
                  </BrowserView>
                  <MobileView>
                    <a
                      href="https://drive.google.com/file/d/1EArSD0-cSIx4M48fFaOflFHMGoKIguR9/view?usp=sharing"
                      target="_blank"
                      rel="noreferrer"
                      className={`btn filledbtn `}
                    >
                      Download on mobile
                    </a>
                  </MobileView>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      )}

      {/* {whitelistPopup === true && (
          <WhitelistPopup
            open={whitelistPopup === true}
            onClose={() => {
              this.setState({ whitelistPopup: false });
            }}
          />
        )} */}

      {showWalletPopup === true && (
        <WalletModal
          show={showWalletPopup}
          handleClose={() => {
            setshowWalletPopup(false);
          }}
          handleConnection={handleConnection}
        />
      )}
    </div>
  );
}

export default App;
