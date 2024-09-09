import Web3 from "web3";
import React from "react";
import GoogleAnalyticsReporter from "./functions/analytics";
import PoolExplorer from "./components/pool-explorer";
import PairExplorer from "./components/pair-explorer";
import BigSwapExplorer from "./components/big-swap-explorer";
import TopTokens from "./components/top-tokens";
import Locker from "./components/locker";
import Account from "./components/account";
import Admin from "./components/admin";
import Farms from "./components/farms";
import News from "./components/news/news";
import Sidebar from "./components/sidebar/sidebar";
import Header from "./components/header/header";
import { Route } from "react-router-dom";
import SubmitInfo from "./components/submit-info/SubmitInfo";
import { Switch } from "react-router-dom";
import { RedirectPathToHomeOnly } from "./functions/redirects";
import Earn from "./components/earn/Earn";
import Dashboard from "./components/dashboard/Dashboard";
import Governance from "./components/governance/Governance";
import navRadius from "./assets/navRadius.svg";
import Governancedev from "./components/governance/dev/governance-new-avax";
import Governancebsc from "./components/governance/dev/governance-new-bsc";
import GovernanceEth from "./components/governance/dev/governance-new";
import LandFlyout from "./components/LandFlyout/LandFlyout";
import Launchpad from "./components/launchpad/Launchpad";
import LaunchpadForm from "./components/launchpad/launchpadform/LaunchpadForm";
import LaunchpadDetails from "./components/launchpad/launchpaddetails/LaunchpadDetails";
import TierLevels from "./components/launchpad/tierlevels/TierLevels";
import NftMinting from "./components/caws/NftMinting/index";
import Bridge from "./components/bridge/BridgeGeneral";
import Footer from "./components/Footer/footer";
import BuyDyp from "./components/buydyp/BuyDyp";
// import Swap from "./components/swap/Swap";
import MobileMenu from "./components/sidebar/MobileMenu";
import Disclaimer from "./components/disclaimer/Disclaimer";
import ScrollToTop from "./functions/ScrollToTop";
import LandPopup from "./components/LandPopup/LandPopup";
import { withRouter } from "react-router-dom";
import GenesisStaking from "./components/genesisStaking/GenesisStaking";
import CawsStaking from "./components/genesisStaking/CawsStaking";
import Plans from "./components/account/Plans";
import DypMigration from "./components/bridge/DypMigration";
import AlertRibbon from "./components/alert-ribbon/AlertRibbon";
import EarnOther from "./components/earnOther/EarnOther";
import EarnInnerPool from "./components/earnOther/EarnInnerPool/EarnInnerPool";
import EarnOtherNft from "./components/earnOther/EarnOtherNft";
import EarnInnerPoolNft from "./components/earnOther/EarnInnerPool/EarnInnerPoolNft";
import WalletModal from "./components/WalletModal";
import axios from "axios";
import MobileFlyout from "./components/mobileFlyout/MobileFlyout";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { isMobile, MobileView, BrowserView } from "react-device-detect";
import closeX from "./components/earnOther/assets/closeX.svg";
import Whitelist from "./components/whitelist/Whitelist";
import WhitelistPopup from "./components/whitelistPopup/WhitelistPopup";
import Games from "./components/games/Games";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "theme-dark",
      ethPrice: "...",
      gasPrice: "...",
      isMinimized: false && window.innerWidth >= 992,
      isOpenInMobile: false,
      isConnected: false,
      chainId: undefined,
      coinbase: null,
      the_graph_result_ETH_V2: JSON.parse(
        JSON.stringify(window.the_graph_result_eth_v2)
      ),
      the_graph_result: JSON.parse(
        JSON.stringify(window.the_graph_result_eth_v2)
      ),
      the_graph_result_AVAX_V2: JSON.parse(
        JSON.stringify(window.the_graph_result_avax_v2)
      ),
      the_graph_result_BSC_V2: JSON.parse(
        JSON.stringify(window.the_graph_result_bsc_v2)
      ),
      the_graph_resultbsc: JSON.parse(
        JSON.stringify(window.the_graph_result_bsc_v2)
      ),
      the_graph_resultavax: JSON.parse(
        JSON.stringify(window.the_graph_result_avax_v2)
      ),
      windowWidth: 0,
      windowHeight: 0,
      subscribedPlatformTokenAmount: "...",
      isPremium: null,
      hotPairs: [],
      networkId: 1,
      explorerNetworkId: 1,
      show: false,
      referrer: "",
      showRibbon: true,
      showRibbon2: true,
      showFlyout: true,
      downloadClick: false,
      showMobilePopup: false,
      showWalletPopup: false,
      whitelistPopup: true,
      aggregatorPools: [],
      userCurencyBalance: 0,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  onSelectChain = (chainText) => {
    if (chainText === "eth") {
      this.setState({ explorerNetworkId: 1 });
    } else if (chainText === "bnb") {
      this.setState({ explorerNetworkId: 56 });
    } else if (chainText === "avax") {
      this.setState({ explorerNetworkId: 43114 });
    }
  };

  fetchAggregatorPools = async () => {
    const result = await axios
      .get(
        "https://dypiusstakingaggregator.azurewebsites.net/api/GetAggregatedPools?code=2qyv7kEpn13ZZUDkaU-f7U5YjiQLVAawRITtvj34rci0AzFuZp7JWQ%3D%3D"
      )
      .catch((e) => {
        console.error(e);
      });

    if (result && result.status === 200) {
      const pools = result.data.stakingLists;
      this.setState({ aggregatorPools: pools });
    }
  };
  checkNetworkId = () => {
    if (
      !this.props.history.location.pathname.includes("bridge") &&
      !this.props.history.location.pathname.includes("migration")
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
              this.setState({
                networkId: "1",
              });
            } else if (data === "0xa86a") {
              this.setState({
                networkId: "43114",
              });
            } else if (data === "0x2105") {
              this.setState({
                networkId: "8453",
              });
            } else if (data === "0x406") {
              this.setState({
                networkId: "1030",
              });
            } else if (data === "0x38") {
              this.setState({
                networkId: "56",
              });
            } else if (data === "0x585eb4b1") {
              this.setState({
                networkId: "1482601649 ",
              });
            } else if (data === "0x2105") {
              this.setState({
                networkId: "8453",
              });
            } else if (data !== "undefined") {
              this.setState({
                networkId: "0",
              });
            } else {
              this.setState({
                networkId: "1",
              });
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
            this.setState({
              networkId: data.toString(),
            });
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
          this.setState({
            networkId: "1",
          });
        } else if (chainId === "0xa86a") {
          this.setState({
            networkId: "43114",
          });
        } else if (chainId === "0x2105") {
          this.setState({
            networkId: "8453",
          });
        } else if (chainId === "0x406") {
          this.setState({
            networkId: "1030",
          });
        } else if (chainId === "0x38") {
          this.setState({
            networkId: "56",
          });
        } else if (chainId === "0x2105") {
          this.setState({
            networkId: "8453",
          });
        } else if (chainId !== "undefined") {
          this.setState({
            networkId: "0",
          });
        } else {
          this.setState({
            networkId: "1",
          });
        }
      } else if (window.ethereum && window.coin98) {
        window.ethereum
          .request({ method: "net_version" })
          .then((data) => {
            if (data !== undefined) {
              this.setState({
                networkId: data,
              });
            } else if (data !== "undefined") {
              this.setState({
                networkId: "0",
              });
            }
          })
          .catch(console.error);
      } else {
        this.setState({
          networkId: "1",
        });
      }
    }
  };

  handleSwitchNetwork = (chainId) => {
    this.setState({ networkId: chainId });
  };

  refreshSubscription = async () => {
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
    const userAddr = await window.getCoinbase();

    if (userAddr) {
      subscribedPlatformTokenAmountNewETH = await ethNewcontract.methods
        .subscriptionPlatformTokenAmount(userAddr)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountNewAvax = await avaxNewcontract.methods
        .subscriptionPlatformTokenAmount(userAddr)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountNewBNB = await bnbNewcontract.methods
        .subscriptionPlatformTokenAmount(userAddr)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountNewBNB2 = await bnbNewcontract2.methods
        .subscriptionPlatformTokenAmount(userAddr)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountCfx = await cfxcontract.methods
        .subscriptionPlatformTokenAmount(userAddr)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountBase = await basecontract.methods
        .subscriptionPlatformTokenAmount(userAddr)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      subscribedPlatformTokenAmountSkale = await skalecontract.methods
        .subscriptionPlatformTokenAmount(userAddr)
        .call()
        .catch((e) => {
          console.log(e);
          return 0;
        });

      if (
        subscribedPlatformTokenAmountNewETH == "0" &&
        subscribedPlatformTokenAmountCfx == "0" &&
        subscribedPlatformTokenAmountBase == "0" &&
        subscribedPlatformTokenAmountNewAvax == "0" &&
        subscribedPlatformTokenAmountNewBNB == "0" &&
        subscribedPlatformTokenAmountNewBNB2 === "0" &&
        subscribedPlatformTokenAmountSkale == "0"
      ) {
        this.setState({ subscribedPlatformTokenAmount: "0", isPremium: false });
      } else if (
        subscribedPlatformTokenAmountNewETH != "0" ||
        subscribedPlatformTokenAmountCfx != "0" ||
        subscribedPlatformTokenAmountBase != "0" ||
        subscribedPlatformTokenAmountNewAvax != "0" ||
        subscribedPlatformTokenAmountNewBNB != "0" ||
        subscribedPlatformTokenAmountNewBNB2 != "0" ||
        subscribedPlatformTokenAmountSkale != "0"
      ) {
        this.setState({
          isPremium: true,
        });
      }
    }
  };

  handleConnection = async () => {
    let isConnected = this.state.isConnected;
    let referrer = window.param("r");

    try {
      localStorage.setItem("logout", "false");
      isConnected = await window.connectWallet(undefined, false);
      if (isConnected) {
        if (referrer) {
          referrer = String(referrer).trim().toLowerCase();
        }
        if (!window.web3.utils.isAddress(referrer)) {
          referrer = window.config.ZERO_ADDRESS;
        }
      }
      this.setState({
        referrer,
      });

      let the_graph_result_ETH_V2 = await window.get_the_graph_eth_v2();
      this.setState({
        the_graph_result_ETH_V2: JSON.parse(
          JSON.stringify(the_graph_result_ETH_V2)
        ),
      });
    } catch (e) {
      this.setState({ show: false });
      window.alertify.error(String(e) || "Cannot connect wallet!");
      console.log(e);
      return;
    }

    this.setState({ isConnected });
    // console.log(window.coinbase_address)
    let coinbase = await window.getCoinbase();
    if (coinbase != null || coinbase != undefined) {
      this.setState({ coinbase: coinbase });
    }
    this.setState({ show: false });
    return isConnected;
  };

  tvl = async () => {
    try {
      if (this.state.networkId === "1") {
        let the_graph_result_ETH_V2 = await window.get_the_graph_eth_v2();
        this.setState({
          the_graph_result_ETH_V2: JSON.parse(
            JSON.stringify(the_graph_result_ETH_V2)
          ),
        });
      } else if (this.state.networkId === "56") {
        let the_graph_result_BSC_V2 = await window.get_the_graph_bsc_v2();
        this.setState({
          the_graph_result_BSC_V2: JSON.parse(
            JSON.stringify(the_graph_result_BSC_V2)
          ),
        });
      } else if (this.state.networkId === "43114") {
        let the_graph_result_AVAX_V2 = await window.get_the_graph_avax_v2();
        this.setState({
          the_graph_result_AVAX_V2: JSON.parse(
            JSON.stringify(the_graph_result_AVAX_V2)
          ),
        });
      }
    } catch (e) {
      // window.alertify.error("Cannot fetch TVL");
      console.error("TVL ETH V2 error: " + e);
    }

    try {
      if (this.state.networkId === "1") {
        let the_graph_result = await window.refresh_the_graph_result();
        this.setState({
          the_graph_result: JSON.parse(JSON.stringify(the_graph_result)),
        });
      } else if (this.state.networkId === "56") {
        let the_graph_resultbsc = await window.refresh_the_graph_resultavax();
        this.setState({
          the_graph_resultbsc: JSON.parse(JSON.stringify(the_graph_resultbsc)),
        });
      } else if (this.state.networkId === "43114") {
        let the_graph_resultavax = await window.refresh_the_graph_resultavax();

        this.setState({
          the_graph_resultavax: JSON.parse(
            JSON.stringify(the_graph_resultavax)
          ),
        });
      }
    } catch (e) {
      // window.alertify.error("Cannot fetch TVL");
      console.error("Cannot fetch TVL: " + e);
    }
  };

  async handleEthereum() {
    const { ethereum } = window;
    if (
      ethereum &&
      (ethereum.isMetaMask === true ||
        window.ethereum.isTrust === true ||
        window.ethereum?.isTrustWallet)
    ) {
      console.log("Ethereum successfully detected!");
      this.tvl();
      this.checkNetworkId();
      await window.getCoinbase();
      // Access the decentralized web!
    } else {
      console.log("Please install MetaMask!");
    }
  }

  componentDidMount() {
    this.tvl();
    this.updateWindowDimensions();
    this.fetchAggregatorPools();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.setState({ whitelistPopup: true });

    if (window.location.hash === "#mobile-app") {
      this.setState({ downloadClick: true });
    }
    if (
      window.ethereum &&
      !window.coin98 &&
      (window.ethereum.isMetaMask === true ||
        window.ethereum.isTrust === true ||
        window.ethereum?.isTrustWallet)
    ) {
      this.checkConnection();
    }
    this.checkNetworkId();

    if (window.ethereum && !window.coin98) {
      console.log("yes");
      this.handleEthereum();
      this.refreshSubscription();
    } else {
      console.log("no");
      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
    }

    let toBeAdded = {
      "theme-dark": "theme-dark",
    };
    let { theme } = this.state;
    document.body.classList.add(toBeAdded[theme]);
    // this.subscriptionInterval = setInterval(this.refreshSubscription, 6e4);
  }

  checkConnection = async () => {
    this.tvl();
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
          this.setState({
            isConnected: data.length === 0 ? false : true,
            coinbase: data.length === 0 ? undefined : data[0],
          });
          if (data.length === 0) {
            localStorage.setItem("logout", "true");
          }
        })
        .catch(console.error);
    } else {
      this.setState({
        isConnected: false,
      });
    }
  };

  logout = () => {
    localStorage.setItem("logout", "true");
    this.setState({ isConnected: false });
    this.checkConnection();
  };
  componentWillUnmount() {
    // clearInterval(this.subscriptionInterval);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  }

  toggleTheme = () => {
    let toBeAdded = {
      "theme-dark": "theme-white",
      "theme-white": "theme-dark",
    };
    let { theme } = this.state;
    document.body.classList.add(toBeAdded[theme]);
    document.body.classList.remove(theme);
    this.setState({ theme: toBeAdded[theme] });
  };

  toggleNetwork = (network) => {
    console.log("aaa");
    // this.setState({ network: network });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location !== prevProps.location) {
      this.checkNetworkId();
      this.refreshSubscription();
    }
    if (this.state.networkId !== prevState.networkId) {
      this.checkNetworkId();
    }

    if (this.state.coinbase !== prevState.coinbase) {
      this.refreshSubscription();
      this.checkNetworkId();
      this.checkConnection();
    }

    if (this.state.isConnected !== prevState.isConnected) {
      this.checkNetworkId();
      this.checkConnection();
    }
  }

  toggleMinimizeSidebar = () => {
    const f = () => window.dispatchEvent(new Event("resize"));
    this.setState({ isMinimized: !this.state.isMinimized }, () => f());
    f();
    let newInterval = setInterval(f, 16);
    setTimeout(() => clearInterval(newInterval), 1000);
  };

  toggleMobileSidebar = () => {
    this.setState({ isOpenInMobile: !this.state.isOpenInMobile });
  };

  render() {
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
    // console.log("the_graph_resultbsc", this.state.the_graph_resultbsc);
    const LP_ID_Array = [
      LP_IDs_V2.weth[0],
      LP_IDs_V2.weth[1],
      LP_IDs_V2.weth[2],
      LP_IDs_V2.weth[3],
      LP_IDs_V2.weth[4],
    ];

    if (
      !this.props.location.pathname.includes("bridge") &&
      !this.props.location.pathname.includes("migration")
    ) {
      ethereum?.on("chainChanged", this.checkNetworkId);
      ethereum?.on("accountsChanged", this.checkConnection);
      ethereum?.on("accountsChanged", this.refreshSubscription);
    }

    document.addEventListener("touchstart", { passive: true });
    return (
      <div
        className={`page_wrapper ${this.state.isMinimized ? "minimize" : ""}`}
      >
        {/* <img src={navRadius} className="nav-radius" alt="" /> */}
        {/* <LandFlyout />   */}
        <Route component={GoogleAnalyticsReporter} />

        <div className="body_overlay"></div>
        {this.state.showRibbon && (
          <AlertRibbon
            onClose={() => {
              this.setState({ showRibbon: false });
            }}
            onComplete={() => {
              this.setState({ showRibbon: false });
              this.setState({ showRibbon2: false });
            }}
          />
        )}

        {this.state.showFlyout && (
          <MobileFlyout
            onClose={() => {
              this.setState({ showFlyout: false });
            }}
            onDownloadClick={() => {
              this.setState({ downloadClick: true });
            }}
          />
        )}
        <div>
          {(this.props?.location?.pathname === "/genesis" &&
            window.innerWidth < 786) ||
          (this.props?.location?.pathname === "/caws-staking" &&
            window.innerWidth < 786) ? null : (
            <Header
              coinbase={this.state.coinbase}
              theme={this.state.theme}
              toggleMobileSidebar={this.toggleMobileSidebar}
              isOpenInMobile={this.state.isOpenInMobile}
              chainId={parseInt(this.state.networkId)}
              logout={this.logout}
              handleSwitchNetwork={this.handleSwitchNetwork}
              handleConnection={this.handleConnection}
              showModal={this.showModal}
              hideModal={this.hideModal}
              show={this.state.show}
              isConnected={this.state.isConnected}
              appState={this.state}
              onSetCurrencyAmount={(value) => {
                this.setState({ userCurencyBalance: value });
              }}
              showFlyout={this.state.showFlyout}
            />
          )}
          <div className="content-wrapper container-fluid d-flex justify-content-center justify-content-lg-start">
            <div className="row w-100">
              <div className="col-1">
                <Sidebar
                  appState={this.state}
                  theme={this.state.theme}
                  isConnected={this.state.isConnected}
                  toggleMobileSidebar={this.toggleMobileSidebar}
                  isOpenInMobile={this.state.isOpenInMobile}
                  showModal={this.showModal}
                  hideModal={this.hideModal}
                  show={this.state.show}
                  checkConnection={this.checkConnection}
                  isPremium={this.state.isPremium}
                  network={this.state.networkId}
                  showRibbon={this.state.showRibbon}
                />
              </div>
              <div
                className={`${
                  this.state.windowWidth < 991
                    ? "col-12 px-1"
                    : this.state.windowWidth < 1490
                    ? "col-11"
                    : "col-10"
                }`}
              >
                <div className="right-content pr-0 my-4 my-lg-5">
                  <ScrollToTop />
                  <Switch>
                    {/* <Route
                    exact
                    path="/pool-explorer"
                    render={() => (
                      <PoolExplorer
                        theme={this.state.theme}
                        networkId={parseInt(this.state.explorerNetworkId)}
                        handleConnection={this.handleConnection}
                        isConnected={this.state.isConnected}
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
                        theme={this.state.theme}
                        networkId={parseInt(this.state.explorerNetworkId)}
                        isConnected={this.state.isConnected}
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
                        isPremium={this.state.isPremium}
                        key={props.match.params.pair_id}
                        theme={this.state.theme}
                        networkId={parseInt(this.state.explorerNetworkId)}
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
                        theme={this.state.theme}
                        networkId={parseInt(this.state.explorerNetworkId)}
                        isConnected={this.state.isConnected}
                        onSelectChain={this.onSelectChain}
                      />
                    )}
                  /> */}

                    <Route
                      exact
                      path="/farms"
                      render={(props) => (
                        <Farms
                          handleConnection={this.handleConnection}
                          isConnected={this.state.isConnected}
                          appState={this.state}
                          theme={this.state.theme}
                          {...props}
                          networkId={parseInt(this.state.explorerNetworkId)}
                          handleSwitchNetwork={this.handleSwitchNetwork}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/games"
                      render={(props) => (
                        <Games
                          handleConnection={this.showModal}
                          isConnected={this.state.isConnected}
                          appState={this.state}
                          theme={this.state.theme}
                          {...props}
                          networkId={parseInt(this.state.networkId)}
                          onSelectChain={this.onSelectChain}
                          coinbase={this.state.coinbase}
                          dummypremiumChests={dummyPremiums}
                          isPremium={this.state.isPremium}
                          bnbImages={chestImagesBnb}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/earn/defi-staking/:pool"
                      render={(props) => (
                        <EarnInnerPool
                          coinbase={this.state.coinbase}
                          handleSwitchNetwork={this.handleSwitchNetwork}
                          handleConnection={this.handleConnection}
                          isConnected={this.state.isConnected}
                          chainId={this.state.networkId}
                          the_graph_result={this.state.the_graph_result_ETH_V2}
                          the_graph_resultavax={
                            this.state.the_graph_result_AVAX_V2
                          }
                          the_graph_resultbsc={
                            this.state.the_graph_result_BSC_V2
                          }
                          lp_id={LP_ID_Array}
                          referrer={this.state.referrer}
                          isPremium={this.state.isPremium}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/earn/dypius"
                      render={() => (
                        <Earn
                          coinbase={this.state.coinbase}
                          the_graph_result={this.state.the_graph_result_ETH_V2}
                          the_graph_resultavax={
                            this.state.the_graph_result_AVAX_V2
                          }
                          the_graph_resultbsc={
                            this.state.the_graph_result_BSC_V2
                          }
                          lp_id={LP_ID_Array}
                          isConnected={this.state.isConnected}
                          network={this.state.networkId}
                          handleConnection={this.handleConnection}
                          handleSwitchNetwork={this.handleSwitchNetwork}
                          referrer={this.state.referrer}
                          isPremium={this.state.isPremium}
                          showRibbon={this.state.showRibbon2}
                          onConnectWallet={this.showModal}
                        />
                      )}
                    />
                    <Route
                      exact
                      path="/earn/defi-staking"
                      render={() => (
                        <EarnOther
                          type={"defi"}
                          isPremium={this.state.isPremium}
                          coinbase={this.state.coinbase}
                          the_graph_result={this.state.the_graph_result_ETH_V2}
                          the_graph_resultavax={
                            this.state.the_graph_result_AVAX_V2
                          }
                          the_graph_resultbsc={
                            this.state.the_graph_result_BSC_V2
                          }
                          lp_id={LP_ID_Array}
                          isConnected={this.state.isConnected}
                          network={this.state.networkId}
                          handleConnection={this.handleConnection}
                          handleSwitchNetwork={this.handleSwitchNetwork}
                          referrer={this.state.referrer}
                          onConnectWallet={this.showModal}
                          aggregatorPools={this.state.aggregatorPools}
                          userCurencyBalance={this.state.userCurencyBalance}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/earn/nft-staking"
                      render={() => (
                        <EarnOtherNft
                          type={"nft"}
                          isPremium={this.state.isPremium}
                          coinbase={this.state.coinbase}
                          isConnected={this.state.isConnected}
                          network={this.state.networkId}
                          handleConnection={this.handleConnection}
                          handleSwitchNetwork={this.handleSwitchNetwork}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/earn/nft-staking/:pool"
                      render={(props) => (
                        <EarnInnerPoolNft
                          coinbase={this.state.coinbase}
                          handleSwitchNetwork={this.handleSwitchNetwork}
                          handleConnection={this.handleConnection}
                          isConnected={this.state.isConnected}
                          chainId={this.state.networkId}
                          the_graph_result={this.state.the_graph_result_ETH_V2}
                          the_graph_resultavax={
                            this.state.the_graph_result_AVAX_V2
                          }
                          the_graph_resultbsc={
                            this.state.the_graph_result_BSC_V2
                          }
                          lp_id={LP_ID_Array}
                          referrer={this.state.referrer}
                          isPremium={this.state.isPremium}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/bridge"
                      render={() => (
                        <Bridge
                          networkId={parseInt(this.state.networkId)}
                          isConnected={this.state.isConnected}
                          handleConnection={this.handleConnection}
                          coinbase={this.state.coinbase}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/launchpad"
                      render={() => (
                        <Whitelist
                          networkId={parseInt(this.state.networkId)}
                          isConnected={this.state.isConnected}
                          handleConnection={this.handleConnection}
                          coinbase={this.state.coinbase}
                        />
                      )}
                    />
                    <Route
                      exact
                      path="/migration"
                      render={() => (
                        <DypMigration
                          networkId={parseInt(this.state.networkId)}
                          isConnected={this.state.isConnected}
                          handleConnection={this.handleConnection}
                          coinbase={this.state.coinbase}
                        />
                      )}
                    />

                    {/* <Route
                    exact
                    path="/caws"
                    render={() => (
                      <NftMinting
                        isConnected={this.state.isConnected}
                        coinbase={this.state.coinbase}
                        handleConnection={this.handleConnection}
                      />
                    )}
                  /> */}

                    {/* <Route
                    exact
                    path="/submit-info"
                    render={() => <SubmitInfo theme={this.state.theme} />}
                  /> */}
                    <Route
                      exact
                      path="/disclaimer"
                      render={() => <Disclaimer />}
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
                          coinbase={this.state.coinbase}
                          chainId={this.state.networkId}
                          handleConnection={this.handleConnection}
                          the_graph_result={this.state.the_graph_result_ETH_V2}
                          lp_id={LP_ID_Array}
                          isConnected={this.state.isConnected}
                        />
                      )}
                    /> */}
                    <Route exact path="/buydyp" render={() => <BuyDyp />} />

                    <Route
                      exact
                      path="/governance"
                      render={() =>
                        this.state.networkId === "56" ? (
                          <Governancebsc
                            coinbase={this.state.coinbase}
                            connected={this.state.isConnected}
                            handleConnection={this.handleConnection}
                            networkId={parseInt(this.state.networkId)}
                          />
                        ) : this.state.networkId === "43114" ? (
                          <Governancedev
                            coinbase={this.state.coinbase}
                            connected={this.state.isConnected}
                            handleConnection={this.handleConnection}
                            networkId={parseInt(this.state.networkId)}
                          />
                        ) : (
                          <GovernanceEth
                            coinbase={this.state.coinbase}
                            connected={this.state.isConnected}
                            handleConnection={this.handleConnection}
                            networkId={parseInt(this.state.networkId)}
                          />
                        )
                      }
                    />

                    <Route
                      exact
                      path="/"
                      render={() => (
                        <Dashboard
                          the_graph_resultavax={
                            this.state.the_graph_result_AVAX_V2
                          }
                          the_graph_resultbsc={
                            this.state.the_graph_result_BSC_V2
                          }
                          coinbase={this.state.coinbase}
                          the_graph_result={this.state.the_graph_result_ETH_V2}
                          lp_id={LP_ID_Array}
                          isConnected={this.state.isConnected}
                          network={parseInt(this.state.networkId)}
                          handleConnection={this.handleConnection}
                          referrer={this.state.referrer}
                          isPremium={this.state.isPremium}
                          onConnectWallet={this.showModal}
                          aggregatorPools={this.state.aggregatorPools}
                          onMobileClick={() => {
                            this.setState({ showMobilePopup: true });
                          }}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/news/:news_id?"
                      render={(props) => (
                        <News
                          theme={this.state.theme}
                          isPremium={this.state.isPremium}
                          key={props.match.params.news_id}
                          {...props}
                          coinbase={this.state.coinbase}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/account"
                      render={() => (
                        <Account
                          appState={this.state}
                          theme={this.state.theme}
                          networkId={parseInt(this.state.networkId)}
                          handleSwitchNetwork={this.handleSwitchNetwork}
                          coinbase={this.state.coinbase}
                          isConnected={this.state.isConnected}
                          isPremium={this.state.isPremium}
                          onSubscribe={this.refreshSubscription}
                          showRibbon={this.state.showRibbon2}
                        />
                      )}
                    />
                    <Route
                      exact
                      path="/plans"
                      render={() => (
                        <Plans
                          appState={this.state}
                          theme={this.state.theme}
                          networkId={parseInt(this.state.networkId)}
                          handleSwitchNetwork={this.handleSwitchNetwork}
                          coinbase={this.state.coinbase}
                          isPremium={this.state.isPremium}
                          isConnected={this.state.isConnected}
                          onSubscribe={this.refreshSubscription}
                        />
                      )}
                    />
                    <Route
                      exact
                      path="/locker/:pair_id?"
                      render={(props) => (
                        <Locker
                          handleConnection={this.handleConnection}
                          isConnected={this.state.isConnected}
                          key={props.match.params.pair_id}
                          theme={this.state.theme}
                          coinbase={this.state.coinbase}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/admin"
                      render={(props) => (
                        <Admin
                          handleConnection={this.handleConnection}
                          isConnected={this.state.isConnected}
                          appState={this.state}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      exact
                      path="/genesis"
                      render={(props) => (
                        <GenesisStaking
                          coinbase={this.state.coinbase}
                          isConnected={this.state.isConnected}
                          chainId={this.state.networkId}
                          handleConnection={this.handleConnection}
                          handleSwitchNetwork={this.handleSwitchNetwork}
                        />
                      )}
                    />
                    {/* <Route
                    exact
                    path="/caws-staking"
                    render={(props) => (
                      <CawsStaking
                        coinbase={this.state.coinbase}
                        isConnected={this.state.isConnected}
                        chainId={this.state.networkId}
                        handleConnection={this.handleConnection}
                        handleSwitchNetwork={this.handleSwitchNetwork}
                      />
                    )}
                  /> */}

                    <Route component={RedirectPathToHomeOnly} />
                  </Switch>

                  {/* <Footer /> */}
                </div>
              </div>
              <div className="col-1"></div>
            </div>
            {this.props?.location?.pathname === "/genesis" ||
            this.props?.location?.pathname === "/caws-staking" ? null : (
              <MobileMenu />
            )}
          </div>
        </div>
        {(this.props?.location?.pathname === "/genesis" &&
          window.innerWidth < 786) ||
        (this.props?.location?.pathname === "/caws-staking" &&
          window.innerWidth < 786) ? null : (
          <Footer></Footer>
        )}

        {(this.state.showMobilePopup === true ||
          this.state.downloadClick === true) && (
          <Modal
            open={this.state.showMobilePopup || this.state.downloadClick}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style2}>
              <div className="d-flex flex-column justify-content-center position-relative">
                <div className="d-flex flex-column gap-3 align-items-center justify-content-between">
                  <div className="d-flex align-items-center  justify-content-between gap-5 w-100">
                    <h4 className="mobile-popup-title">Dypius Mobile App</h4>

                    <img
                      src={closeX}
                      alt=""
                      className="close-x position-relative cursor-pointer "
                      onClick={() => {
                        this.setState({ downloadClick: false });
                        this.setState({ showMobilePopup: false });
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
                          Your feedback is valuable as we continue to improve
                          the app.
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

        {/* {this.state.whitelistPopup === true && (
          <WhitelistPopup
            open={this.state.whitelistPopup === true}
            onClose={() => {
              this.setState({ whitelistPopup: false });
            }}
          />
        )} */}

        {this.showWalletPopup === true && (
          <WalletModal
            show={this.showWalletPopup}
            handleClose={() => {
              this.setState({ showWalletPopup: false });
            }}
            handleConnection={this.handleConnection}
          />
        )}
      </div>
    );
  }
}

export default withRouter(App);
