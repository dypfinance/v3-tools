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
import Swap from "./components/swap/Swap";
import MobileMenu from "./components/sidebar/MobileMenu";
import Disclaimer from "./components/disclaimer/Disclaimer";
import ScrollToTop from "./functions/ScrollToTop";
import LandPopup from "./components/LandPopup/LandPopup";
import { withRouter } from "react-router-dom";
import GenesisStaking from "./components/genesisStaking/GenesisStaking";
import CawsStaking from "./components/genesisStaking/CawsStaking";

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
      the_graph_result_AVAX_V2: JSON.parse(
        JSON.stringify(window.the_graph_result_avax_v2)
      ),
      the_graph_result_BSC_V2: JSON.parse(
        JSON.stringify(window.the_graph_result_bsc_v2)
      ),
      windowWidth: 0,
      windowHeight: 0,
      subscribedPlatformTokenAmount: "...",
      isPremium: false,
      hotPairs: [],
      networkId: 1,
      explorerNetworkId: 1,
      show: false,
      referrer: "",
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

  checkNetworkId = () => {
    if (!this.props.history.location.pathname.includes("bridge")) {
      if (
        window.ethereum &&
        (window.ethereum.isMetaMask === true ||
          window.ethereum.isCoin98 === true ||
          window.ethereum.isTrust === true)
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
            } else if (data === "0x38") {
              this.setState({
                networkId: "56",
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

            this.refreshSubscription().then();
          })
          .catch(console.error);
      } else if (window.ethereum && !window.ethereum?.isMetaMask) {
        window.ethereum
          .request({ method: "net_version" })
          .then((data) => {
            this.setState({
              networkId: data,
            });
            this.refreshSubscription().then();
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
    if (!this.state.isConnected) return;

    // // detect Network account change
    // window.ethereum?.on('chainChanged', function(networkId){
    //   console.log('networkChanged',networkId);
    //   const chainId = async() => await window.web3.eth.getChainId();
    //   if (chainId == '1') {
    //     this.setState({isNetwork: 'ethereum'})
    //   }
    //   else{
    //     this.setState({isNetwork: 'binance'})
    //   }
    // }.bind(this))

    let coinbase = this.state.coinbase;
    let subscribedPlatformTokenAmountETH;
    let subscribedPlatformTokenAmountAvax;

    const web3eth = new Web3(
      "https://mainnet.infura.io/v3/94608dc6ddba490697ec4f9b723b586e"
    );
    const web3avax = new Web3("https://api.avax.network/ext/bc/C/rpc");
    const AvaxABI = window.SUBSCRIPTION_ABI;
    const EthABI = window.SUBSCRIPTIONETH_ABI;
    const ethsubscribeAddress = window.config.subscriptioneth_address;
    const avaxsubscribeAddress = window.config.subscription_address;

    const ethcontract = new web3eth.eth.Contract(EthABI, ethsubscribeAddress);
    const avaxcontract = new web3avax.eth.Contract(
      AvaxABI,
      avaxsubscribeAddress
    );

    if (coinbase) {
      subscribedPlatformTokenAmountETH = await ethcontract.methods
        .subscriptionPlatformTokenAmount(coinbase)
        .call();

      subscribedPlatformTokenAmountAvax = await avaxcontract.methods
        .subscriptionPlatformTokenAmount(coinbase)
        .call();

      if (
        subscribedPlatformTokenAmountAvax === "0" &&
        subscribedPlatformTokenAmountETH === "0"
      ) {
        this.setState({ subscribedPlatformTokenAmount: "0", isPremium: false });
      }
      if (subscribedPlatformTokenAmountAvax !== "0") {
        this.setState({
          subscribedPlatformTokenAmount: subscribedPlatformTokenAmountAvax,
          isPremium: true,
        });
      }
      if (subscribedPlatformTokenAmountETH !== "0") {
        this.setState({
          subscribedPlatformTokenAmount: subscribedPlatformTokenAmountETH,
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
    let coinbase = await window.getCoinbase();
    if (coinbase != null || coinbase != undefined) {
      this.setState({ coinbase: coinbase });
    }
    this.setState({ show: false });
    return isConnected;
  };

  tvl = async () => {
    try {
      let the_graph_result_ETH_V2 = await window.get_the_graph_eth_v2();

      let the_graph_result_AVAX_V2 = await window.get_the_graph_avax_v2();

      let the_graph_result_BSC_V2 = await window.get_the_graph_bsc_v2();

      this.setState({
        the_graph_result_ETH_V2: JSON.parse(
          JSON.stringify(the_graph_result_ETH_V2)
        ),
      });
      this.setState({
        the_graph_result_AVAX_V2: JSON.parse(
          JSON.stringify(the_graph_result_AVAX_V2)
        ),
      });

      this.setState({
        the_graph_result_BSC_V2: JSON.parse(
          JSON.stringify(the_graph_result_BSC_V2)
        ),
      });
    } catch (e) {
      // window.alertify.error("Cannot fetch TVL");
      console.error("TVL ETH V2 error: " + e);
    }

    try {
      let the_graph_result = await window.refresh_the_graph_result();
      let the_graph_resultavax = await window.refresh_the_graph_resultavax();
      let the_graph_resultbsc = await window.refresh_the_graph_resultavax();

      this.setState({
        the_graph_result: JSON.parse(JSON.stringify(the_graph_result)),
      });

      this.setState({
        the_graph_resultavax: JSON.parse(JSON.stringify(the_graph_resultavax)),
      });

      this.setState({
        the_graph_resultbsc: JSON.parse(JSON.stringify(the_graph_resultbsc)),
      });
    } catch (e) {
      // window.alertify.error("Cannot fetch TVL");
      console.error("Cannot fetch TVL: " + e);
    }
  };

  handleEthereum() {
    const { ethereum } = window;
    if (ethereum && (ethereum.isMetaMask || ethereum.isTrust)) {
      console.log("Ethereum successfully detected!");
      this.checkNetworkId();
      // Access the decentralized web!
    } else {
      console.log("Please install MetaMask!");
    }
  }

  componentDidMount() {
    this.tvl().then();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    if (window.ethereum && !window.ethereum.isCoin98 && window.ethereum.isMetaMask) {
      this.checkConnection();
    }
    this.checkNetworkId();
    this.refreshSubscription();

    if (window.ethereum && !window.ethereum.isCoin98) {
      this.handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", this.handleEthereum, {
        once: true,
      });

      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
      setTimeout(this.handleEthereum, 3000); // 3 seconds
    }

    let toBeAdded = {
      "theme-dark": "theme-dark",
    };
    let { theme } = this.state;
    document.body.classList.add(toBeAdded[theme]);
    // this.subscriptionInterval = setInterval(this.refreshSubscription, 6e4);
  }

 checkConnection = async () => {
    const logout = localStorage.getItem("logout");
    if (logout !== "true" && window.ethereum && !window.ethereum.isCoin98) {
      await window.ethereum
        ?.request({ method: "eth_requestAccounts" })
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

  handleTrustChain = () => {
    window.location.reload();
  };

  render() {
    const { LP_IDs_V2 } = window;
    const { ethereum } = window;

    const LP_ID_Array = [
      LP_IDs_V2.weth[3],
      LP_IDs_V2.weth[2],
      LP_IDs_V2.weth[0],
      LP_IDs_V2.weth[1],
      LP_IDs_V2.weth[4],
    ];

    if (!this.props.location.pathname.includes("bridge")) {
      ethereum?.on("chainChanged", this.checkNetworkId);
      ethereum?.on("accountsChanged", this.checkConnection);
    }

    if (window.ethereum && window.ethereum.isTrust === true) {
      ethereum?.on("chainChanged", this.handleTrustChain);
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
                        onSelectChain={this.onSelectChain}
                      />
                    )}
                  />

                  <Route
                    exact
                    path="/earn"
                    render={() => (
                      <Earn
                        coinbase={this.state.coinbase}
                        the_graph_result={this.state.the_graph_result_ETH_V2}
                        the_graph_resultavax={
                          this.state.the_graph_result_AVAX_V2
                        }
                        the_graph_resultbsc={this.state.the_graph_result_BSC_V2}
                        lp_id={LP_ID_Array}
                        isConnected={this.state.isConnected}
                        network={this.state.networkId}
                        handleConnection={this.handleConnection}
                        handleSwitchNetwork={this.handleSwitchNetwork}
                        referrer={this.state.referrer}
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
                    path="/caws"
                    render={() => (
                      <NftMinting
                        isConnected={this.state.isConnected}
                        coinbase={this.state.coinbase}
                        handleConnection={this.handleConnection}
                      />
                    )}
                  />

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
                  <Route exact path="/swap" component={Swap} />

                  {/* <Route
                    exact
                    path="/governance"
                    render={() => <Governance />}
                  /> */}
                  <Route exact path="/launchpad" render={() => <Launchpad />} />
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
                  />
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
                        the_graph_resultbsc={this.state.the_graph_result_BSC_V2}
                        coinbase={this.state.coinbase}
                        the_graph_result={this.state.the_graph_result_ETH_V2}
                        lp_id={LP_ID_Array}
                        isConnected={this.state.isConnected}
                        network={parseInt(this.state.networkId)}
                        handleConnection={this.handleConnection}
                        referrer={this.state.referrer}
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
                  <Route
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
                  />

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
        {(this.props?.location?.pathname === "/genesis" &&
          window.innerWidth < 786) ||
        (this.props?.location?.pathname === "/caws-staking" &&
          window.innerWidth < 786) ? null : (
          <Footer></Footer>
        )}
      </div>
    );
  }
}

export default withRouter(App);
