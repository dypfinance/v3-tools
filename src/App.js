import React, { useState, useEffect } from "react";
import GoogleAnalyticsReporter from "./functions/analytics";
import Locker from "./components/locker";
import Account from "./components/account";
import Admin from "./components/admin";
import Farms from "./components/farms";
import News from "./components/news/news";
import Sidebar from "./components/sidebar/sidebar";
import Header from "./components/header/header";
import { Route, Routes } from "react-router-dom";
import { RedirectPathToHomeOnly } from "./functions/redirects";
import Earn from "./components/earn/Earn";
import Dashboard from "./components/dashboard/Dashboard";
import Governancedev from "./components/governance/dev/governance-new-avax";
import Governancebsc from "./components/governance/dev/governance-new-bsc";
import GovernanceEth from "./components/governance/dev/governance-new";
import { Navigate } from "react-router-dom";
import Bridge from "./components/bridge/BridgeGeneral";
import Footer from "./components/Footer/footer";
import BuyDyp from "./components/buydyp/BuyDyp";
import MobileMenu from "./components/sidebar/MobileMenu";
import Disclaimer from "./components/disclaimer/Disclaimer";
import DypMigration from "./components/bridge/DypMigration";
import AlertRibbon from "./components/alert-ribbon/AlertRibbon";
import EarnOther from "./components/earnOther/EarnOther";
import EarnOtherNft from "./components/earnOther/EarnOtherNft";
import WalletModal from "./components/WalletModal";
import axios from "axios";
import MobileFlyout from "./components/mobileFlyout/MobileFlyout";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { MobileView, BrowserView } from "react-device-detect";
import Whitelist from "./components/whitelist/Whitelist";
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
import LaunchpadMidle from "./components/whitelist/LaunchpadMidle.js";
import LaunchpadDetails from "./components/launchpad/launchpaddetails/LaunchpadDetails.js";
import PricingPackages from "./components/pricingpackages/PricingPackages.js";
import BundleTOS from "./components/pricingpackages/BundleTOS.js";

import { getWeb3Connector } from "@binance/w3w-web3-connector";
import { useWeb3React } from "@web3-react/core";
import { isMobile } from "react-device-detect";
import WhitelistPopup from "./components/whitelistPopup/WhitelistPopup.js";
import NewMigration from "./components/migration-portal/NewMigration.js";
// import MigrationPopup from "./components/MigrationPopup/MigrationPopup.js";
const LockerWrapper = (props) => {
  const { pair_id } = useParams();

  return <Locker {...props} pair_id={pair_id} />;
};

const Connector = getWeb3Connector();
const binanceConnector = new Connector({
  lng: "en-US",
  supportedChainIds: [1, 56, 204, 8453, 43114],
  rpc: {
    56: "https://bsc-dataseed.binance.org/",
    1: window.config.infura_endpoint,
    204: window.config.opbnb_endpoint,
    8453: window.config.base_endpoint,
    43114: window.config.avax_endpoint,
  },
});

function App() {
  const [theme, setTheme] = useState("theme-dark");

  const [isOpenInMobile, setisOpenInMobile] = useState(false);
  const [isConnected, setisConnected] = useState(false);
  const [coinbase, setcoinbase] = useState(null);
  const [the_graph_result_ETH_V2, setthe_graph_result_ETH_V2] = useState(
    JSON.stringify(window.the_graph_result_eth_v2),
  );
  const [the_graph_result_AVAX_V2, setthe_graph_result_AVAX_V2] = useState(
    JSON.stringify(window.the_graph_result_avax_v2),
  );
  const [the_graph_result_BSC_V2, setthe_graph_result_BSC_V2] = useState(
    JSON.stringify(window.the_graph_result_bsc_v2),
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
  const [whitelistPopup, setwhitelistPopup] = useState(true);
  const [aggregatorPools, setaggregatorPools] = useState([]);
  const [userCurencyBalance, setuserCurencyBalance] = useState(0);
  const [fireAppcontent, setFireAppContent] = useState(false);
  const [syncStatus, setsyncStatus] = useState("initial");
  const [isonSync, setisonSync] = useState(false);

  const [chests, setChests] = useState([]);
  const [openedChests, setOpenedChests] = useState([]);
  const [chestCount, setChestCount] = useState(0);
  const [balanceCount, setBalanceCount] = useState(0);

  const [opbnbchests, setopbnbChests] = useState([]);
  const [opbnbopenedChests, setopbnbOpenedChests] = useState([]);
  const [opbnbchestCount, setopbnbChestCount] = useState(0);

  const [isonlink, setIsOnLink] = useState(false);
  const [hasDypBalance, sethasDypBalance] = useState(false);
  const [hasiDypBalance, sethasiDypBalance] = useState(false);
  const [baseBalance, setbaseBalance] = useState(0);
  const [opBnbBalance, setopBnbBalance] = useState(0);

  const [dypBalance, setDypBalance] = useState(0);
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

  const [weeklyplayerDataOpbnb, setweeklyplayerDataOpbnb] = useState([]);
  const [activePlayerWeeklyOpbnb, setActivePlayerWeeklyOpbnb] = useState(false);
  const [weeklyUserOpbnb, setWeeklyUserOpbnb] = useState({});
  const [monthlyplayerDataOpbnb, setmonthlyplayerDataOpbnb] = useState([]);
  const [activePlayerMonthlyOpbnb, setActivePlayerMonthlyOpbnb] =
    useState(false);
  const [monthlyUserOpbnb, setMonthlyUserOpbnb] = useState([]);
  const [previousWeeklyVersionOpbnb, setpreviousWeeklyVersionOpbnb] =
    useState(0);
  const [previousMonthlyVersionOpbnb, setpreviousMonthlyVersionOpbnb] =
    useState(0);

  const [kittyDashRecords, setkittyDashRecords] = useState([]);
  const [activePlayerKitty, setActivePlayerKitty] = useState(false);
  const [kittyUser, setKittyUser] = useState({});

  const [activePlayerCaws2d, setActivePlayerCaws2d] = useState(false);
  const [caws2dUser, setCaws2dUser] = useState({});
  const [binanceData, setbinanceData] = useState();
  const [success, setSuccess] = useState(false);
  const { connector, account, chainId, active } = useWeb3React();

  const { activate, deactivate, library, provider } = useWeb3React();

  const backendApi =
    "https://axf717szte.execute-api.eu-central-1.amazonaws.com/prod";

  const handleConnectBinance = async () => {
    await activate(binanceConnector)
      .then(async () => {
        setSuccess(true);
        setshowWalletPopup(false);
        window.WALLET_TYPE = "binance";
        localStorage.setItem("logout", "false");
        if (isMobile) {
          window.getCoinbase();
          const data = JSON.parse(localStorage.getItem("connect-session"));
          if (data && data !== null) {
            setbinanceData(data);
          } else {
            window.WALLET_TYPE = "binance";
            await window.ethereum?.enable();
            let coinbase_address = await window.ethereum?.request({
              method: "eth_accounts",
            });

            if (coinbase_address && coinbase_address.length > 0) {
              setcoinbase(coinbase_address[0]);
              setisConnected(true);
              window.ethereum
                .request({ method: "eth_chainId" })
                .then((data) => {
                  setnetworkId(parseInt(data).toString());
                })
                .catch(console.error);
            }
          }
        }
      })
      .catch((e) => {
        console.error(e);
        window.WALLET_TYPE = "";
      });
  };

  const checkBinanceData = async () => {
    const data = JSON.parse(localStorage.getItem("connect-session"));
    setbinanceData(data);
  };

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

  const onOpbnbChestClaimed = () => {
    setopbnbChestCount(opbnbchestCount + 1);
  };

  const fetchAggregatorPools = async () => {
    const result = await axios
      .get(
        "https://dypiusstakingaggregator.azurewebsites.net/api/GetAggregatedPools?code=2qyv7kEpn13ZZUDkaU-f7U5YjiQLVAawRITtvj34rci0AzFuZp7JWQ%3D%3D",
      )
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      const pools = result.data.stakingLists;
      console.log("pools", pools);
      setaggregatorPools(pools);
    }
  };

  const checkNetworkId = () => {
    if (!window.location.pathname.includes("migration")) {
      if (
        window.ethereum &&
        !window.coin98 &&
        (window.ethereum.isMetaMask === true ||
          window.ethereum.isCoinbaseWallet === true) &&
        window.WALLET_TYPE !== "binance"
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
            } else if (data === "0xcc") {
              setnetworkId("204");
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
        (window.ethereum.isTrust === true || window.ethereum?.isTrustWallet) &&
        window.WALLET_TYPE !== "binance"
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
        !window.ethereum.isCoinbaseWallet &&
        window.WALLET_TYPE !== "binance"
      ) {
        const chainId = window.ethereum.selectedProvider.chainId;

        if (chainId === "0x1") {
          setnetworkId("1");
        } else if (chainId === "0xa86a") {
          setnetworkId("43114");
        } else if (chainId === "0x2105") {
          setnetworkId("8453");
        } else if (chainId === "0xcc") {
          setnetworkId("204");
        } else if (chainId === "0x38") {
          setnetworkId("56");
        } else if (chainId === "0x2105") {
          setnetworkId("8453");
        } else if (chainId !== "undefined") {
          setnetworkId("0");
        } else {
          setnetworkId("1");
        }
      } else if (
        window.ethereum &&
        window.coin98 &&
        window.WALLET_TYPE !== "binance"
      ) {
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
      } else if (
        window.WALLET_TYPE === "binance" ||
        (binanceData !== undefined && binanceData !== null)
      ) {
        if (binanceData !== undefined && binanceData !== null) {
          setnetworkId(binanceData.chainId.toString());
        } else {
          setnetworkId(chainId?.toString() ?? "1");
        }
      } else {
        setnetworkId("1");
      }
    }
  };

  const handleSwitchNetwork = async (chainId) => {
    const CHAINLIST = {
      1: {
        chainId: 1,
        chainName: "Ethereum",
        rpcUrls: ["https://mainnet.infura.io/v3/"],
        nativeCurrency: {
          symbol: "eth",
          decimals: 18,
        },
        blockExplorerUrls: ["https://etherscan.io"],
      },
      56: {
        chainId: 56,
        chainName: "BSC",
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        nativeCurrency: {
          symbol: "bnb",
          decimals: 18,
        },
        blockExplorerUrls: ["https://bscscan.com"],
      },

      204: {
        chainId: 204,
        chainName: "opBNB",
        rpcUrls: ["https://opbnb.publicnode.com"],
        nativeCurrency: {
          symbol: "bnb",
          decimals: 18,
        },

        blockExplorerUrls: ["https://mainnet.opbnbscan.com"],
      },
      43314: {
        chainId: 43314,
        chainName: "Avalanche Network",
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        nativeCurrency: {
          symbol: "AVAX",
          decimals: 18,
        },

        blockExplorerUrls: ["https://snowtrace.io/"],
      },
      8453: {
        chainId: 8453,
        chainName: "Base Mainnet",
        rpcUrls: ["https://rpc.ankr.com/base"],
        nativeCurrency: {
          symbol: "ETH",
          decimals: 18,
        },

        blockExplorerUrls: ["https://basescan.org"],
      },
    };

    if (window.WALLET_TYPE === "binance" && binanceData) {
      try {
        await binanceConnector.binanceW3WProvider
          .request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId:
                  chainId === "1"
                    ? "0x1"
                    : chainId === "56"
                      ? "0x38"
                      : chainId === "204"
                        ? "0xcc"
                        : chainId === "43114"
                          ? "0xa86a"
                          : chainId === "8453"
                            ? "0x2105"
                            : "0x38",
              },
            ],
          })
          .then(async () => {
            setnetworkId(chainId);
            checkBinanceData();
          })
          .catch((e) => {
            console.error(e);
            setnetworkId(chainId);
          });
        // if (window.ethereum && window.gatewallet) {
        //   window.location.reload();
        // }
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        console.log(switchError, "switch");

        if (switchError.code === 4902) {
          try {
            await library.request({
              method: "wallet_addEthereumChain",
              params: CHAINLIST[Number(chainId)],
            });
            // if (window.ethereum && window.gatewallet) {
            //   window.location.reload();
            // }
          } catch (addError) {
            console.log(addError);
            setnetworkId(chainId);
          }
        }
        // handle other "switch" errors
      }
    } else if (
      window.WALLET_TYPE === "binance" &&
      !binanceData &&
      window.ethereum?.isBinance
    ) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId:
                chainId === "1"
                  ? "0x1"
                  : chainId === "56"
                    ? "0x38"
                    : chainId === "204"
                      ? "0xcc"
                      : chainId === "43114"
                        ? "0xa86a"
                        : chainId === "8453"
                          ? "0x2105"
                          : "0x38",
            },
          ],
        });
        // if (window.ethereum && window.gatewallet) {
        //   window.location.reload();
        // }
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        console.log(switchError, "switch");
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: CHAINLIST[Number(chainId)],
            });
            // if (window.ethereum && window.gatewallet) {
            //   window.location.reload();
            // }
          } catch (addError) {
            console.log(addError);
          }
        }
        // handle other "switch" errors
      }
    }
    setnetworkId(chainId);
  };

  const fetchUserPools = async () => {
    if (coinbase && coinbase.includes("0x") && isConnected === true) {
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

  const refreshSubscription = async (userWallet) => {
    let subscribedPlatformTokenAmountNewETH;
    let subscribedPlatformTokenAmountNewAvax;
    let subscribedPlatformTokenAmountNewBNB;
    let subscribedPlatformTokenAmountNewBNB2;
    let subscribedPlatformTokenAmountNewBNBNFT;
    let subscribedPlatformTokenAmountBase;

    const web3eth = window.infuraWeb3;
    const web3avax = window.avaxWeb3;
    const web3bnb = window.bscWeb3;
    const web3base = window.baseWeb3;

    const AvaxNewABI = window.SUBSCRIPTION_NEWAVAX_ABI;
    const EthNewABI = window.SUBSCRIPTION_NEWETH_ABI;
    const BnbNewABI = window.SUBSCRIPTION_NEWBNB_ABI;
    const BnbNew2ABI = window.SUBSCRIPTION_NEWBNB2_ABI;
    const BnbNewBNFTABI = window.SUBSCRIPTION_NEWBNBNFT_ABI;

    const BaseABI = window.SUBSCRIPTION_BASE_ABI;

    const ethsubscribeNewAddress = window.config.subscription_neweth_address;
    const avaxsubscribeNewAddress = window.config.subscription_newavax_address;
    const bnbsubscribeNewAddress = window.config.subscription_newbnb_address;
    const bnbsubscribeNewAddress2 = window.config.subscription_newbnb2_address;
    const bnbsubscribeNewAddressnft =
      window.config.subscription_newbnbnft_address;

    const basesubscribeAddress = window.config.subscription_base_address;

    const ethNewcontract = new web3eth.eth.Contract(
      EthNewABI,
      ethsubscribeNewAddress,
    );

    const avaxNewcontract = new web3avax.eth.Contract(
      AvaxNewABI,
      avaxsubscribeNewAddress,
    );

    const bnbNewcontract = new web3bnb.eth.Contract(
      BnbNewABI,
      bnbsubscribeNewAddress,
    );
    const bnbNewcontract2 = new web3bnb.eth.Contract(
      BnbNew2ABI,
      bnbsubscribeNewAddress2,
    );

    const bnbNewcontractnft = new web3bnb.eth.Contract(
      BnbNewBNFTABI,
      bnbsubscribeNewAddressnft,
    );

    const basecontract = new web3base.eth.Contract(
      BaseABI,
      basesubscribeAddress,
    );

    if (userWallet) {
      subscribedPlatformTokenAmountNewBNBNFT = await bnbNewcontractnft.methods
        .subscriptionPlatformTokenAmount(userWallet)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

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

      subscribedPlatformTokenAmountBase = await basecontract.methods
        .subscriptionPlatformTokenAmount(userWallet)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      if (
        Number(subscribedPlatformTokenAmountNewBNBNFT) === 0 &&
        Number(subscribedPlatformTokenAmountNewETH) === 0 &&
        Number(subscribedPlatformTokenAmountBase) === 0 &&
        Number(subscribedPlatformTokenAmountNewAvax) === 0 &&
        Number(subscribedPlatformTokenAmountNewBNB) === 0 &&
        Number(subscribedPlatformTokenAmountNewBNB2) === 0
      ) {
        // setsubscribedPlatformTokenAmount("0");
        setisPremium(false);
      } else if (
        Number(subscribedPlatformTokenAmountNewBNBNFT) !== 0 ||
        Number(subscribedPlatformTokenAmountNewETH) !== 0 ||
        Number(subscribedPlatformTokenAmountBase) !== 0 ||
        Number(subscribedPlatformTokenAmountNewAvax) !== 0 ||
        Number(subscribedPlatformTokenAmountNewBNB) !== 0 ||
        Number(subscribedPlatformTokenAmountNewBNB2) !== 0
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
        JSON.parse(JSON.stringify(the_graph_result_ETH_V2)),
      );
      checkConnection();
      setshowWalletPopup(false);
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
          JSON.parse(JSON.stringify(the_graph_result_ETH_V2)),
        );
      } else if (networkId === "56") {
        let the_graph_result_BSC_V2 = await window.get_the_graph_bsc_v2();

        setthe_graph_result_BSC_V2(
          JSON.parse(JSON.stringify(the_graph_result_BSC_V2)),
        );
      } else if (networkId === "43114") {
        let the_graph_result_AVAX_V2 = await window.get_the_graph_avax_v2();

        setthe_graph_result_AVAX_V2(
          JSON.parse(JSON.stringify(the_graph_result_AVAX_V2)),
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
    const tokenAddress_opbnb = window.config.token_dypius_new_opbnb_address;

    const walletAddress = coinbase;
    const TokenABI = window.ERC20_ABI;

    if (coinbase && coinbase !== undefined && isConnected) {
      const contract1 = new window.infuraWeb3.eth.Contract(
        TokenABI,
        tokenAddress,
      );
      const contract2 = new window.avaxWeb3.eth.Contract(
        TokenABI,
        tokenAddress_bsc,
      );
      const contract3 = new window.bscWeb3.eth.Contract(
        TokenABI,
        tokenAddress_bsc,
      );

      const contract4 = new window.baseWeb3.eth.Contract(
        TokenABI,
        tokenAddress_base,
      );
      const contract5 = new window.opbnbWeb3.eth.Contract(
        TokenABI,
        tokenAddress_opbnb,
      );

      const contract1_idyp = new window.infuraWeb3.eth.Contract(
        TokenABI,
        window.config.reward_token_idyp_address,
      );
      const contract2_idyp = new window.avaxWeb3.eth.Contract(
        TokenABI,
        window.config.reward_token_idyp_address,
      );
      const contract3_idyp = new window.bscWeb3.eth.Contract(
        TokenABI,
        window.config.reward_token_idyp_address,
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

      setDypBalance(ethBalance);

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
      setbaseBalance(Number(baseBalance));

      let opbnbBalance = await contract5.methods
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
      setopBnbBalance(Number(opbnbBalance));

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
    // fetchAggregatorPools();
    // setwhitelistPopup(true);
    if (window.location.hash === "#mobile-app") {
      setdownloadClick(true);
    }

    if (window.ethereum && !window.coin98) {
      console.log("yes");
      handleEthereum();
      checkNetworkId();
    } else {
      console.log("no");
      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
    }
  }, []);

  // const checkConnection = async () => {
  //   tvl();
  //   const logout = localStorage.getItem("logout");

  //   if (
  //     logout !== "true" &&
  //     window.ethereum &&
  //     (window.ethereum.isMetaMask === true ||
  //       window.ethereum.isTrust === true ||
  //       window.ethereum?.isTrustWallet ||
  //       !window.ethereum.isCoin98 ||
  //       !window.ethereum.overrideIsMetaMask ||
  //       !window.ethereum.isCoinbaseWallet)
  //   ) {
  //     await window.ethereum
  //       .request({ method: "eth_accounts" })
  //       .then((data) => {
  //         setisConnected(data.length === 0 ? false : true);
  //         setcoinbase(data.length === 0 ? undefined : data[0]);

  //         if (data.length === 0) {
  //           localStorage.setItem("logout", "true");
  //         }
  //       })
  //       .catch(console.error);
  //   } else {
  //     setisConnected(false);
  //   }
  // };
  const checkConnection = async () => {
    await window.getCoinbase().then((data) => {
      setcoinbase(data);
    });
  };
  // console.log(isConnected, coinbase);
  const checkConnection2 = async () => {
    const logout = localStorage.getItem("logout");
    if (logout !== "true") {
      await window.getCoinbase().then((data) => {
        if (data) {
          // fetchAvatar(data);
          setcoinbase(data);
          setisConnected(true);
        } else {
          setcoinbase();
          setisConnected(false);
        }
      });
    } else {
      setisConnected(false);
      setcoinbase();
    }
  };
  const handlelogout = () => {
    localStorage.removeItem("connect-session");
    setTimeout(() => {
      checkBinanceData();
      window.disconnectWallet();
      deactivate();
      localStorage.setItem("logout", "true");
      setSuccess(false);
      setcoinbase();
      setisConnected(false);
      setisPremium(false);
      window.WALLET_TYPE = "";
    }, 500);
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

  if (!window.location.pathname.includes("migration")) {
    ethereum?.on("chainChanged", checkNetworkId);
    ethereum?.on("accountsChanged", checkConnection2);
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
    if (window.ethereum && window.WALLET_TYPE !== "binance") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(coinbase);
        const signature = await signer.signMessage(
          `Signing one-time nonce: ${dataNonce?.generateWalletNonce?.nonce}`,
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
    } else if (coinbase && library) {
      try {
        const provider = library;
        const signer = provider.getSigner();
        const signature = await signer.signMessage(
          `Signing one-time nonce: ${dataNonce?.generateWalletNonce?.nonce}`,
        );
        verifyWallet({
          variables: {
            publicAddress: coinbase,
            signature: signature,
          },
        }).then(() => {
          // if (isonlink) {
          //   handleFirstTask(binanceWallet);
          // }
        });
      } catch (error) {
        console.log("🚀 ~ file: App.js:2248 ~ getTokens ~ error", error);
      }
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
            data?.getPlayer?.wallet?.publicAddress?.toLowerCase(),
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
        }),
      ) > 20
    ) {
      setActivePlayerCaws2d(false);
      setCaws2dUser(...testArray);
    } else {
      setCaws2dUser([]);
    }
  };

  const fetchPreviousCawsAdvWinners = async () => {
    let leaderboard2 = [];
    try {
      leaderboard2 = await (
        await fetch("https://game.dypius.com/api/leaderboard-previous")
      ).json();
    } catch (e) {
      console.warn(e);
    }
    leaderboard2 = leaderboard2.sort((a, b) => b.score - a.score);

    fillRecordsCaws2d(leaderboard2);
  };

  const getAllChests = async () => {
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({ emailAddress: email, chainid: "base" });

    let response = await fetch(
      "https://worldofdypiansdailybonus.azurewebsites.net/api/GetRewardsDypius?code=H9zoL4Hdr7fr7rzSZLTzilDT99fgwth006S7bO3J3Ua9AzFucS1HoA%3D%3D",
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      },
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

  const getAllOpbnbChests = async () => {
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({ emailAddress: email, chainid: "opbnb" });

    let response = await fetch(
      "https://worldofdypiansdailybonus.azurewebsites.net/api/GetRewardsDypius?code=H9zoL4Hdr7fr7rzSZLTzilDT99fgwth006S7bO3J3Ua9AzFucS1HoA%3D%3D",
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      },
    ).catch((err) => {
      console.log(err);
    });
    if (response && response.status === 200) {
      let data = await response.json();

      setopbnbChests(data.chestOrder);
      let standardChestsArray = [];
      let premiumChestsArray = [];
      let openedChests = [];
      // let openedStandardChests = [];
      // let openedPremiumChests = [];

      if (data.chestOrder.length > 0) {
        for (let item = 0; item < data.chestOrder.length; item++) {
          if (data.chestOrder[item].chestType === "Standard") {
            if (data.chestOrder[item].isOpened === true) {
              {
                openedChests.push(data.chestOrder[item]);
                // openedStandardChests.push(data.chestOrder[item]);
              }
            }
            standardChestsArray.push(data.chestOrder[item]);
          } else if (data.chestOrder[item].chestType === "Premium") {
            if (data.chestOrder[item].isOpened === true) {
              {
                openedChests.push(data.chestOrder[item]);
                // openedPremiumChests.push(data.chestOrder[item]);
              }
            }
            premiumChestsArray.push(data.chestOrder[item]);
          }
        }
        setopbnbOpenedChests(openedChests);
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

  const fillRecordsWeeklyOpbnb = (itemData) => {
    if (itemData.length === 0) {
      setweeklyplayerDataOpbnb(placeholderplayerData);
    } else if (itemData.length <= 10) {
      const testArray = itemData;
      const placeholderArray = placeholderplayerData.slice(itemData.length, 10);
      const finalData = [...testArray, ...placeholderArray];
      setweeklyplayerDataOpbnb(finalData);
    }
  };
  const fillRecordsMonthlyOpbnb = (itemData) => {
    if (itemData.length === 0) {
      setmonthlyplayerDataOpbnb(placeholderplayerData);
    } else if (itemData.length <= 10) {
      const testArray = itemData;
      const placeholderArray = placeholderplayerData.slice(itemData.length, 10);
      const finalData = [...testArray, ...placeholderArray];
      setmonthlyplayerDataOpbnb(finalData);
    }
  };

  const fetchRecordsAroundPlayerWeeklyOpbnb = async (itemData) => {
    const data = {
      StatisticName: "LeaderboardDypiusOpBNBWeekly",
      MaxResultsCount: 6,
      PlayerId: userId,
    };
    if (userId) {
      const result = await axios.post(
        `${backendApi}/auth/GetLeaderboardAroundPlayer`,
        data,
      );
      var testArray = result.data.data.leaderboard.filter(
        (item) => item.displayName === username,
      );
      if (itemData.length > 0) {
        var testArray2 = Object.values(itemData).filter(
          (item) => item.displayName === username,
        );

        if (testArray.length > 0 && testArray2.length > 0) {
          setActivePlayerWeeklyOpbnb(true);
          setWeeklyUserOpbnb([]);
        } else if (testArray.length > 0 && testArray2.length === 0) {
          setActivePlayerWeeklyOpbnb(false);
          setWeeklyUserOpbnb(...testArray);
        }
      } else if (testArray.length > 0) {
        setActivePlayerWeeklyOpbnb(false);
        setWeeklyUserOpbnb(...testArray);
      }
    } else {
      setActivePlayerWeeklyOpbnb(true);
      setWeeklyUserOpbnb([]);
    }
  };

  const fetchWeeklyOpbnbWinners = async () => {
    const data = {
      StatisticName: "LeaderboardDypiusOpBNBWeekly",
      StartPosition: 0,
      MaxResultsCount: 10,
    };
    const result = await axios
      .post(`${backendApi}/auth/GetLeaderboard`, data)
      .catch((err) => {
        console.log(err);
      });
    setpreviousWeeklyVersionOpbnb(parseInt(result.data.data.version));
    setweeklyplayerDataOpbnb(result.data.data.leaderboard);
    var testArray = result.data.data.leaderboard.filter(
      (item) => item.displayName === username,
    );
    fillRecordsWeeklyOpbnb(result.data.data.leaderboard);
    if (testArray.length > 0) {
      setActivePlayerWeeklyOpbnb(true);
      fetchRecordsAroundPlayerWeeklyOpbnb(result.data.data.leaderboard);
    } else if (testArray.length === 0) {
      setActivePlayerWeeklyOpbnb(false);
      fetchRecordsAroundPlayerWeeklyOpbnb(result.data.data.leaderboard);
    }
  };

  const fetchPreviousWeeklyOpbnbWinners = async () => {
    if (previousWeeklyVersionOpbnb != 0) {
      const data = {
        StatisticName: "LeaderboardDypiusOpBNBWeekly",
        StartPosition: 0,
        MaxResultsCount: 10,
        Version: previousWeeklyVersionOpbnb - 1,
      };
      const result = await axios
        .post(`${backendApi}/auth/GetLeaderboard?Version=-1`, data)
        .catch((err) => {
          console.log(err);
        });

      setweeklyplayerDataOpbnb(result.data.data.leaderboard);
    }
  };

  const fetchRecordsAroundPlayerMonthlyOpbnb = async (itemData) => {
    const data = {
      StatisticName: "LeaderboardDypiusOpBNBMonthly",
      MaxResultsCount: 6,
      PlayerId: userId,
    };
    if (userId) {
      const result = await axios.post(
        `${backendApi}/auth/GetLeaderboardAroundPlayer`,
        data,
      );
      var testArray = result.data.data.leaderboard.filter(
        (item) => item.displayName === username,
      );

      if (itemData.length > 0) {
        var testArray2 = Object.values(itemData).filter(
          (item) => item.displayName === username,
        );

        if (testArray.length > 0 && testArray2.length > 0) {
          setActivePlayerMonthlyOpbnb(true);
          setMonthlyUserOpbnb([]);
        } else if (testArray.length > 0 && testArray2.length === 0) {
          setActivePlayerMonthlyOpbnb(false);
          setMonthlyUserOpbnb(...testArray);
        }
      } else if (testArray.length > 0) {
        setActivePlayerMonthlyOpbnb(false);
        setMonthlyUserOpbnb(...testArray);
      }
    } else {
      setActivePlayerMonthlyOpbnb(true);
      setMonthlyUserOpbnb([]);
    }
  };

  const fetchMonthlyOpbnbWinners = async () => {
    const data = {
      StatisticName: "LeaderboardDypiusOpBNBMonthly",
      StartPosition: 0,
      MaxResultsCount: 10,
    };
    const result = await axios
      .post(`${backendApi}/auth/GetLeaderboard`, data)
      .catch((err) => {
        console.log(err);
      });
    setpreviousMonthlyVersionOpbnb(parseInt(result.data.data.version));
    setmonthlyplayerDataOpbnb(result.data.data.leaderboard);
    var testArray = result.data.data.leaderboard.filter(
      (item) => item.displayName === username,
    );
    fillRecordsMonthlyOpbnb(result.data.data.leaderboard);
    if (testArray.length > 0) {
      setActivePlayerMonthlyOpbnb(true);
      fetchRecordsAroundPlayerMonthlyOpbnb(result.data.data.leaderboard);
    } else if (testArray.length === 0) {
      setActivePlayerMonthlyOpbnb(false);
      fetchRecordsAroundPlayerMonthlyOpbnb(result.data.data.leaderboard);
    }
  };

  const fetchPreviousMonthlyOpbnbWinners = async () => {
    if (previousMonthlyVersionOpbnb != 0) {
      const data = {
        StatisticName: "LeaderboardDypiusOpBNBMonthly",
        StartPosition: 0,
        MaxResultsCount: 10,
        Version: previousMonthlyVersionOpbnb - 1,
      };
      const result = await axios
        .post(`${backendApi}/auth/GetLeaderboard?Version=-1`, data)
        .catch((err) => {
          console.log(err);
        });

      setmonthlyplayerDataOpbnb(result.data.data.leaderboard);
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
        data,
      );
      var testArray = result.data.data.leaderboard.filter(
        (item) => item.displayName === username,
      );
      if (itemData.length > 0) {
        var testArray2 = Object.values(itemData).filter(
          (item) => item.displayName === username,
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
      (item) => item.displayName === username,
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
        data,
      );
      var testArray = result.data.data.leaderboard.filter(
        (item) => item.displayName === username,
      );

      if (itemData.length > 0) {
        var testArray2 = Object.values(itemData).filter(
          (item) => item.displayName === username,
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
      (item) => item.displayName === username,
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
        data,
      );
      var testArray = result.data.data.leaderboard.filter(
        (item) => item.displayName === username,
      );
      if (itemData.length > 0) {
        var testArray2 = Object.values(itemData).filter(
          (item) => item.displayName === username,
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
      (item) => item.displayName === username,
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
  const logoutstorage = localStorage.getItem("logout");
  useEffect(() => {
    if (
      binanceData &&
      binanceData !== null &&
      window.WALLET_TYPE === "binance"
    ) {
      setcoinbase(binanceData.accounts[0]);
      setisConnected(binanceData.connected);
      setnetworkId(binanceData.chainId.toString());
      window.coinbase_address = binanceData.accounts[0];
      window.WALLET_TYPE = "binance";
    } else if (
      window.WALLET_TYPE === "binance" ||
      account ||
      (binanceData != null && binanceData !== undefined)
    ) {
      if (binanceData != null && binanceData !== undefined) {
        activate(binanceConnector);

        setcoinbase(binanceData.accounts[0]);
        setisConnected(binanceData.connected);
        setnetworkId(binanceData.chainId.toString());
        window.coinbase_address = binanceData.accounts[0];
        window.WALLET_TYPE = "binance";
      } else if (
        account !== undefined &&
        chainId !== undefined &&
        logoutstorage === "false"
      ) {
        window.WALLET_TYPE = "binance";
        setcoinbase(account);
        setisConnected(true);
        setnetworkId(chainId?.toString() ?? "1");
      }
    }
  }, [binanceData, account, chainId, logoutstorage]);

  useEffect(() => {
    if (
      !window.coin98 &&
      window.ethereum &&
      (window.ethereum.isMetaMask === true ||
        window.ethereum.isTrust === true) &&
      window.WALLET_TYPE !== "binance"
    ) {
      window.WALLET_TYPE = "metamask";
      if (
        logoutstorage === "false" ||
        window.coinbase_address === "0x0000000000000000000000000000000000000000"
      ) {
        checkConnection2();
      } else {
        setisConnected(false);
        setcoinbase();
        localStorage.setItem("logout", "true");
      }
    } else if (
      (logoutstorage === "false" ||
        window.coinbase_address ===
        "0x0000000000000000000000000000000000000000" ||
        window.coin98) &&
      window.WALLET_TYPE !== "binance"
    ) {
      checkConnection2();
    } else if (window.WALLET_TYPE !== "binance") {
      setisConnected(false);
      setcoinbase();
      localStorage.setItem("logout", "true");
    } else if (
      window.ethereum &&
      window.WALLET_TYPE === "binance" &&
      window.ethereum?.isBinance &&
      logoutstorage === "false"
    ) {
      if (account) {
        // fetchAvatar(account);
        setcoinbase(account);
        setisConnected(true);
      } else {
        setcoinbase();
        setisConnected(false);
      }
    }
    // checkNetworkId();
  }, [coinbase, networkId, active, account, logoutstorage]);

  useEffect(() => {
    if (email) {
      getAllChests();
    } else {
      setChests([]);
      setOpenedChests([]);
    }
  }, [email, chestCount]);

  useEffect(() => {
    if (email) {
      getAllOpbnbChests();
    } else {
      setopbnbChests([]);
      setopbnbOpenedChests([]);
    }
  }, [email, opbnbchestCount]);

  // useEffect(() => {
  //   loadLeaderboardDataCaws2dGame();
  // }, [data]);

  useEffect(() => {
    if (isConnected && coinbase) {
      refreshSubscription(coinbase);
    } else if (
      email !== undefined &&
      data?.getPlayer?.wallet?.publicAddress !== undefined
    ) {
      refreshSubscription(data?.getPlayer?.wallet?.publicAddress);
    } else {
      setisPremium(false);
    }
  }, [isConnected, coinbase, email, data]);

  useEffect(() => {
    if (isConnected && coinbase) {
      fetchUserPools();
    }
    checkBinanceData();
  }, [isConnected, coinbase]);

  useEffect(() => {
    if (isConnected && coinbase) {
      getAllBalance();
    }
  }, [isConnected, coinbase, balanceCount]);

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
            handleSwitchChainBinanceWallet={handleSwitchNetwork}
            handleConnection={() => {
              setshowWalletPopup(true);
            }}
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
                checkConnection={checkConnection2}
                isPremium={isPremium}
                network={networkId}
                showRibbon={showRibbon}
              />
            </div>
            <div
              className={`${windowSize.width < 991
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
                        handleConnectBinance={handleConnectBinance}
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
                        fetchCawsAdvLeaderboard={loadLeaderboardDataCaws2dGame}
                        fetchPreviousCawsAdvWinners={
                          fetchPreviousCawsAdvWinners
                        }
                        handleSwitchChainBinanceWallet={handleSwitchNetwork}
                        handleConnection={() => {
                          setshowWalletPopup(true);
                        }}
                        binanceW3WProvider={library}
                        isConnected={isConnected}
                        networkId={parseInt(networkId)}
                        onSelectChain={onSelectChain}
                        coinbase={coinbase}
                        onChestClaimed={() => {
                          onChestClaimed();
                          fetchWeeklyWinners();
                        }}
                        onOpbnbChestClaimed={() => {
                          onOpbnbChestClaimed();
                          fetchWeeklyOpbnbWinners();
                        }}
                        dummypremiumChests={dummyPremiums}
                        isPremium={isPremium}
                        bnbImages={chestImagesBnb}
                        email={email}
                        chests={chests}
                        opbnbchests={opbnbchests}
                        openedChests={openedChests}
                        openedOpbnbChests={opbnbopenedChests}
                        address={data?.getPlayer?.wallet?.publicAddress}
                        userId={data?.getPlayer?.playerId}
                        username={username}
                        handleSwitchNetwork={handleSwitchNetwork}
                        monthlyplayerData={monthlyplayerData}
                        monthlyplayerDataOpbnb={monthlyplayerDataOpbnb}
                        previousMonthlyVersion={previousMonthlyVersion}
                        previousMonthlyVersionOpbnb={
                          previousMonthlyVersionOpbnb
                        }
                        previousWeeklyVersion={previousWeeklyVersion}
                        previousWeeklyVersionOpbnb={previousWeeklyVersionOpbnb}
                        weeklyplayerData={weeklyplayerData}
                        weeklyUser={weeklyUser}
                        monthlyUser={monthlyUser}
                        weeklyplayerDataOpbnb={weeklyplayerDataOpbnb}
                        weeklyUserOpbnb={weeklyUserOpbnb}
                        monthlyUserOpbnb={monthlyUserOpbnb}
                        previousKittyDashVersion={previousKittyDashVersion}
                        kittyDashRecords={kittyDashRecords}
                        fetchKittyDashWinners={fetchKittyDashWinners}
                        fetchPreviousKittyDashWinners={
                          fetchPreviousKittyDashWinners
                        }
                        kittyUser={kittyUser}
                        caws2dUser={caws2dUser}
                        activePlayerKitty={activePlayerKitty}
                        activePlayerCaws2d={activePlayerCaws2d}
                        fetchWeeklyWinners={fetchWeeklyWinners}
                        fetchPreviousWeeklyWinners={fetchPreviousWeeklyWinners}
                        activePlayerWeekly={activePlayerWeekly}
                        fetchMonthlyWinners={fetchMonthlyWinners}
                        fetchPreviousMonthlyWinners={
                          fetchPreviousMonthlyWinners
                        }
                        activePlayerMonthly={activePlayerMonthly}
                        fetchWeeklyOpbnbWinners={fetchWeeklyOpbnbWinners}
                        fetchPreviousWeeklyOpbnbWinners={
                          fetchPreviousWeeklyOpbnbWinners
                        }
                        activePlayerWeeklyOpbnb={activePlayerWeeklyOpbnb}
                        fetchMonthlyOpbnbWinners={fetchMonthlyOpbnbWinners}
                        fetchPreviousMonthlyOpbnbWinners={
                          fetchPreviousMonthlyOpbnbWinners
                        }
                        activePlayerMonthlyOpbnb={activePlayerMonthlyOpbnb}
                        baseBalance={baseBalance}
                        opBnbBalance={opBnbBalance}
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
                        handleSwitchChainBinanceWallet={handleSwitchNetwork}
                        handleConnection={() => {
                          setshowWalletPopup(true);
                        }}
                        binanceW3WProvider={library}
                        handleSwitchNetwork={handleSwitchNetwork}
                        referrer={referrer}
                        isPremium={isPremium}
                        showRibbon={showRibbon2}
                        onConnectWallet={showModal}
                      />
                    }
                  />
                  {/* <Route
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
                  /> */}

                  <Route
                    exact
                    path="/launchpad/worldofdypians"
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
                    path="/launchpad"
                    element={
                      <LaunchpadMidle
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
                    path="/accelerator-program"
                    element={
                      <PricingPackages
                        dypBalance={dypBalance}
                        networkId={parseInt(networkId)}
                        isConnected={isConnected}
                        coinbase={coinbase}
                        onRefreshBalance={() => {
                          setBalanceCount(balanceCount + 1);
                        }}
                        handleSwitchChainBinanceWallet={handleSwitchNetwork}
                        handleConnection={() => {
                          setshowWalletPopup(true);
                        }}
                        binanceW3WProvider={library}
                        handleSwitchNetwork={handleSwitchNetwork}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/bundles-terms-of-service"
                    element={<BundleTOS />}
                  />

                  <Route
                    exact
                    path="/launchpad/midle"
                    element={
                      <LaunchpadDetails
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
                        handleSwitchChainBinanceWallet={handleSwitchNetwork}
                        handleConnection={() => {
                          setshowWalletPopup(true);
                        }}
                        binanceW3WProvider={library}
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
                        handleConnection={() => {
                          setshowWalletPopup(true);
                        }}
                        binanceW3WProvider={library}
                        coinbase={coinbase}
                        handleSwitchChainBinanceWallet={handleSwitchNetwork}
                        handleSwitchNetwork={handleSwitchNetwork}
                      />
                    }
                  />

                  {/* <Route
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
                  /> */}
                  <Route
                    exact
                    path="/migration-portal"
                    element={
                      <NewMigration
                        networkId={parseInt(networkId)}
                        isConnected={isConnected}
                        handleConnection={handleConnection}
                        coinbase={coinbase}
                        binanceW3WProvider={library}
                        handleSwitchChainBinanceWallet={handleSwitchNetwork}
                        handleSwitchNetwork={handleSwitchNetwork}
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
                        handleSwitchChainBinanceWallet={handleSwitchNetwork}
                        handleConnection={() => {
                          setshowWalletPopup(true);
                        }}
                        binanceW3WProvider={library}
                        referrer={referrer}
                        isPremium={isPremium}
                        onConnectWallet={() => {
                          setshowWalletPopup(true);
                        }}
                        // aggregatorPools={aggregatorPools}
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
                        onSubscribe={() => {
                          refreshSubscription(coinbase);
                        }}
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
                        handleSwitchChainBinanceWallet={handleSwitchNetwork}
                        binanceW3WProvider={library}
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
              setwhitelistPopup(false)
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
          handleConnectBinance={handleConnectBinance}
        />
      )}
    </div>
  );
}

export default App;
