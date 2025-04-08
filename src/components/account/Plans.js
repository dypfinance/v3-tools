import React from "react";
import Web3 from "web3";
import getFormattedNumber from "../../functions/get-formatted-number";
import axios from "axios";
import "./account.css";
import { handleSwitchNetworkhook } from "../../functions/hooks";

const { BigNumber } = window;

export default class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coinbase: "",
      networkId: 0,
      selectedSubscriptionToken: Object.keys(
        window.config.subscription_tokens
      )[0],
      tokenBalance: 0,
      price: "",
      formattedPrice: "0.0",
      favorites: [],
      favoritesETH: [],
      selectedFile: null,
      image: "https://cdn.worldofdypians.com/tools/person.svg",
      lockActive: false,
      status: "",
      loadspinner: false,
      loadspinnerSub: false,
      loadspinnerSave: false,
      loadspinnerRemove: false,
      showSavebtn: false,
      showRemovebtn: false,
      subscribe_now: true,
      wethAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      wavaxAddress: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
      wbnbAddress: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      wbaseAddress: "0x4200000000000000000000000000000000000006",

      triggerText: "See more V",
      isApproved: false,
      approveStatus: "initial",
      chainDropdown: {
        name: "Ethereum",
        symbol: "eth",
      },
      viewall: false,
      showInput: false,
      openTooltip: false,
      dropdownTitle: "",
      dropdownIcon: "",
    };
  }

  componentDidUpdate(prevProps) {
    // if (this.props.isPremium) {
    //   window.location.href = "https://app.dypius.com/account";
    // }

    // Typical usage (don't forget to compare props):
    const chainDropdowns = [
      {
        name: "Ethereum",
        symbol: "eth",
      },
      {
        name: "BNB Chain",
        symbol: "bnb",
      },
      {
        name: "Avalanche",
        symbol: "wavax",
      },
      {
        name: "Base",
        symbol: "base",
      },
    ];
    if (this.props.networkId !== prevProps.networkId) {
      // this.setState({ subscribe_now: false });
      if (this.props.networkId === 43114) {
        this.setState({
          dropdownIcon: "wavax",
          dropdownTitle: "WAVAX",
        });
        this.handleSubscriptionTokenChange(this.state.wavaxAddress);
      } else if (this.props.networkId === 1) {
        this.handleSubscriptionTokenChange(this.state.wethAddress);
        this.setState({
          dropdownIcon: "weth",
          dropdownTitle: "WETH",
        });
        this.setState({ chainDropdown: chainDropdowns[0] });
      } else if (this.props.networkId === 56) {
        this.handleSubscriptionTokenChange(this.state.wbnbAddress);
        this.setState({
          dropdownIcon: "wbnb",
          dropdownTitle: "WBNB",
        });
        this.setState({ chainDropdown: chainDropdowns[1] });
      }   else if (this.props.networkId === 8453) {
        this.handleSubscriptionTokenChange(this.state.wbaseAddress);
        this.setState({
          dropdownIcon: "weth",
          dropdownTitle: "WETH",
        });
        this.setState({ chainDropdown: chainDropdowns[4] });
      }   else {
        this.setState({
          dropdownIcon: "weth",
          dropdownTitle: "WETH",
        });
        this.setState({ chainDropdown: chainDropdowns[0] });
      }
    }
  }

  componentDidMount() {
    // if (this.props.isPremium) {
    //   window.location.href = "https://app.dypius.com/account";
    // }
    const chainDropdowns = [
      {
        name: "Ethereum",
        symbol: "eth",
      },
      {
        name: "BNB Chain",
        symbol: "bnb",
      },

      {
        name: "Avalanche",
        symbol: "wavax",
      },
      
      {
        name: "Base",
        symbol: "base",
      },
       
    ];

    if (this.props.networkId === 43114) {
      this.setState({
        dropdownIcon: "wavax",
        dropdownTitle: "WAVAX",
      });
      this.setState({ chainDropdown: chainDropdowns[2] });

      this.handleSubscriptionTokenChange(this.state.wavaxAddress);
    } else if (this.props.networkId === 1) {
      this.handleSubscriptionTokenChange(this.state.wethAddress);
      this.setState({
        dropdownIcon: "weth",
        dropdownTitle: "WETH",
      });
      this.setState({ chainDropdown: chainDropdowns[0] });
    } else if (this.props.networkId === 56) {
      this.handleSubscriptionTokenChange(this.state.wbnbAddress);
      this.setState({
        dropdownIcon: "wbnb",
        dropdownTitle: "WBNB",
      });
      this.setState({ chainDropdown: chainDropdowns[1] });
    } else if (this.props.networkId === 8453) {
      this.handleSubscriptionTokenChange(this.state.wbaseAddress);
      this.setState({
        dropdownIcon: "weth",
        dropdownTitle: "WETH",
      });
      this.setState({ chainDropdown: chainDropdowns[4] });
    }  else {
      this.setState({
        dropdownIcon: "weth",
        dropdownTitle: "WETH",
      });
      this.setState({ chainDropdown: chainDropdowns[0] });
    }
    this.setState({ coinbase: this.props.coinbase });
    window.scrollTo(0, 0);
  }

  handleSubscriptionTokenChange = async (tokenAddress) => {
    const token = tokenAddress;
    let tokenDecimals =
      this.props.networkId === 1
        ? window.config.subscriptioneth_tokens[token]?.decimals
        : this.props.networkId === 56
        ? window.config.subscriptionbnb_tokens[token]?.decimals
        
        : this.props.networkId === 8453
        ? window.config.subscriptionbase_tokens[token]?.decimals
         
        : window.config.subscription_tokens[token]?.decimals;

    console.log("tokenDecimals", tokenDecimals);
    this.setState({
      selectedSubscriptionToken: token,
      tokenBalance: 0,
      formattedPrice: "",
      price: "",
    });

    let price =
      this.props.networkId === 1
        ? await window.getEstimatedTokenSubscriptionAmountETH(token)
        : this.props.networkId === 56
        ? await window.getEstimatedTokenSubscriptionAmountBNB(token)
        
        : this.props.networkId === 8453
        ? await window.getEstimatedTokenSubscriptionAmountBase(token)
        
        : await window.getEstimatedTokenSubscriptionAmount(token);
    price = new BigNumber(price).toFixed(0);
    console.log("price", price);

    let formattedPrice = getFormattedNumber(
      price / 10 ** tokenDecimals,
      tokenDecimals
    );
    if (this.props.coinbase && this.props.isConnected === true) {
      let tokenBalance = await window.getTokenHolderBalance(
        token,
        this.props.coinbase
      );
      this.setState({ tokenBalance });
    }

    this.setState({ price, formattedPrice });
  };

  handleApprove = async (e) => {
    // e.preventDefault();
    const web3 = new Web3(window.ethereum);
    let tokenContract = new web3.eth.Contract(
      window.ERC20_ABI,
      this.state.selectedSubscriptionToken
    );

    const ethsubscribeAddress = window.config.subscription_neweth_address;
    const avaxsubscribeAddress = window.config.subscription_newavax_address;
    const bnbsubscribeAddress = window.config.subscription_newbnb_address;
    
    const basesubscribeAddress = window.config.subscription_base_address;
    

    this.setState({ loadspinner: true });

  

    await tokenContract.methods
      .approve(
        this.props.networkId === 1
          ? ethsubscribeAddress
          : this.props.networkId === 56
          ? bnbsubscribeAddress
           
          : this.props.networkId === 8453
          ? basesubscribeAddress
           
          : avaxsubscribeAddress,
        this.state.price
      )
      .send({ from: this.props.coinbase })
      .then(() => {
        this.setState({ lockActive: true });
        this.setState({ loadspinner: false });
        this.setState({ isApproved: true, approveStatus: "deposit" });
      })
      .catch((e) => {
        this.setState({ status: e?.message });
        this.setState({ loadspinner: false, approveStatus: "fail" });
        setTimeout(() => {
          this.setState({
            status: "",
            loadspinner: false,
            approveStatus: "initial",
          });
        }, 8000);
      });
  };

  handleUpdatePremiumUser = async () => {
    const wallet = await window.getCoinbase();
    await axios
      .get(`https://api.worldofdypians.com/api/sub/${wallet}`)
      .catch((e) => {
        console.error(e);
      });
  };

  handleSubscribe = async (e) => {
    // e.preventDefault();
    let subscriptionContract = await window.getContract({
      key:
        this.props.networkId === 1
          ? "SUBSCRIPTION_NEWETH"
          : this.props.networkId === 56
          ? "SUBSCRIPTION_NEWBNB"
           
          : this.props.networkId === 8453
          ? "SUBSCRIPTION_BASE"
           
          : "SUBSCRIPTION_NEWAVAX",
    });

    this.setState({ loadspinnerSub: true });

    // let price =
    // this.props.networkId === 1
    //   ? await window.getEstimatedTokenSubscriptionAmountETH(this.state.selectedSubscriptionToken)
    //   : this.props.networkId === 56
    //   ? await window.getEstimatedTokenSubscriptionAmountBNB(this.state.selectedSubscriptionToken)
    //   : await window.getEstimatedTokenSubscriptionAmount(this.state.selectedSubscriptionToken);
    // console.log(this.state.price, this.state.selectedSubscriptionToken)
    console.log(this.state.selectedSubscriptionToken, this.state.price);
    await subscriptionContract.methods
      .subscribe(this.state.selectedSubscriptionToken, this.state.price)
      .send({ from: await window.getCoinbase() })
      .then(() => {
        this.setState({ loadspinnerSub: false, approveStatus: "success" });
        this.props.onSubscribe(this.props.coinbase);
        this.handleUpdatePremiumUser();
        window.location.href = "https://app.dypius.com/account";
      })
      .catch((e) => {
        this.setState({ status: e?.message });
        this.setState({
          loadspinner: false,
          approveStatus: "fail",
          loadspinnerSub: false,
        });
        setTimeout(() => {
          this.setState({
            status: "",
            loadspinner: false,
            loadspinnerSub: false,
            approveStatus: "initial",
          });
        }, 8000);
      });
  };

  handleUnsubscribe = async (e) => {
    e.preventDefault();
    let subscriptionContract = await window.getContract({
      key:
        this.props.networkId === 1
          ? "SUBSCRIPTION_NEWETH"
          : this.props.networkId === 56
          ? "SUBSCRIPTION_NEWBNB"
          : "SUBSCRIPTION_NEWAVAX",
    });
    await subscriptionContract.methods
      .unsubscribe()
      .send({ from: await window.getCoinbase() })
      .then(() => {
        // this.setState({ loadspinner: false });
      })
      .catch((e) => {
        this.setState({ status: "An error occurred. Please try again" });
        // this.setState({ loadspinner: false });
      });
  };

  handleCheckIfAlreadyApproved = async () => {
    const web3eth = new Web3(
      "https://mainnet.infura.io/v3/94608dc6ddba490697ec4f9b723b586e"
    );

    const ethsubscribeAddress = window.config.subscriptioneth_address;
    const avaxsubscribeAddress = window.config.subscription_address;
    const subscribeToken = this.state.selectedSubscriptionToken;
    const subscribeTokencontract = new web3eth.eth.Contract(
      window.ERC20_ABI,
      subscribeToken
    );

    if (this.props.coinbase) {
      if (this.props.networkId === 1) {
        const result = await subscribeTokencontract.methods
          .allowance(this.props.coinbase, ethsubscribeAddress)
          .call()
          .then()
          .catch((e) => {
            console.error(e);
            return 0;
          });

        if (result != 0) {
          this.setState({ lockActive: true });
          this.setState({ loadspinner: false });
          this.setState({ isApproved: true });
        } else if (result == 0) {
          this.setState({ lockActive: false });
          this.setState({ loadspinner: false });
          this.setState({ isApproved: false });
        }
      } else {
        const result = await subscribeTokencontract.methods
          .allowance(this.props.coinbase, avaxsubscribeAddress)
          .call()
          .then()
          .catch((e) => {
            console.error(e);
            return 0;
          });

        if (result != 0) {
          this.setState({ lockActive: true });
          this.setState({ loadspinner: false });
          this.setState({ isApproved: true });
        } else if (result == 0) {
          this.setState({ lockActive: false });
          this.setState({ loadspinner: false });
          this.setState({ isApproved: false });
        }
      }
    }
  };

  GetSubscriptionForm = () => {
    let tokenDecimals =
      this.props.networkId === 1
        ? window.config.subscriptioneth_tokens[
            this.state.selectedSubscriptionToken
          ]?.decimals
        : this.props.networkId === 56
        ? window.config.subscriptionbnb_tokens[
            this.state.selectedSubscriptionToken
          ]?.decimals
         
        : this.props.networkId === 8453
        ? window.config.subscriptionbase_tokens[
            this.state.selectedSubscriptionToken
          ]?.decimals
         
        : window.config.subscription_tokens[
            this.state.selectedSubscriptionToken
          ]?.decimals;
    // this.handleCheckIfAlreadyApproved()

    const focusInput = (input) => {
      document.getElementById(input).focus();
    };

 

    const benefits = [
      "DYP Tools administrative dashboard",
      "Priority access to dedicated DeFi pools",
      "Voting capabilities in the News section",
      "Early access to upcoming features and updates",
    ];
    const metaverseBenefits = [
      "Exclusive access to World of Dypians",
      "Access to Daily Bonus Event",
      "Access every Treasure Hunt Event",
      "Early access to upcoming features and updates",
    ];

 

    const handleEthPool = async () => {
      await handleSwitchNetworkhook("0x1")
        .then(() => {
          this.props.handleSwitchNetwork("1");
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const handleBnbPool = async () => {
      await handleSwitchNetworkhook("0x38")
        .then(() => {
          this.props.handleSwitchNetwork("56");
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const handleBasePool = async () => {
      await handleSwitchNetworkhook("0x2105")
        .then(() => {
          this.props.handleSwitchNetwork("8453");
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const handleAvaxPool = async () => {
      await handleSwitchNetworkhook("0xa86a")
        .then(() => {
          this.props.handleSwitchNetwork("43114");
        })
        .catch((e) => {
          console.log(e);
        });
    };

 
    return (
      <div>
        {/* <div className="row mt-5 gap-4 gap-lg-0">
        <div className="col-12 col-lg-6 position-relative d-flex justify-content-center">
          <div
            className={`purplediv`}
            style={{
              top: "15px",
              zIndex: 1,
              left: "12px",
              background:
                this.props.isPremium === false
                  ? "#50AF95"
                  : "#8E97CD",
            }}
          ></div>
          <div
            className={`row free-plan-container p-3 position-relative w-100 ${
              this.props.isPremium === false && "green-border"
            }`}
          >
            <div className="d-flex align-items-center gap-2">
              <img
                src={require("./assets/freePlanIcon.svg")}
                alt=""
              />
              <h6 className="free-plan-title">Free plan</h6>
            </div>
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-1 mt-3">
                {freePlanItems.map((item, index) => (
                  <div
                    key={index}
                    className="free-plan-item d-flex align-items-center justify-content-between p-2"
                  >
                    <span className="free-plain-item-text">{item}</span>
                    <img
                      src={require("./assets/freeCheck.svg")}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-6 free-plan-image"></div>
            <div className="col-12 d-flex flex-column justify-content-end">
              <hr className="form-divider my-4" style={{ height: "2px" }} />
              <div className="d-flex flex-column">
                <span className="inactive-plan">Active</span>
                <span className="inactive-plan">Free plan</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 position-relative d-flex justify-content-center">
          <div
            className="purplediv"
            style={{
              top: "15px",
              zIndex: 1,
              left: "12px",
              background:
                this.props.isPremium === true
                  ? "#50AF95"
                  : "#8E97CD",
            }}
          ></div>
          <div
            className={`row free-plan-container p-3 position-relative w-100 ${
              this.props.isPremium === true && "green-border"
            }`}
          >
            <div className="d-flex align-items-center gap-2">
              <img
                src={require("./assets/paidPlanIcon.svg")}
                alt=""
              />
              <h6 className="free-plan-title">Dypian plan</h6>
            </div>
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-1 mt-3">
                {paidPlanItems.map((item, index) => (
                  <div
                    key={index}
                    className="free-plan-item d-flex align-items-center justify-content-between p-2"
                  >
                    <span className="free-plain-item-text">{item}</span>
                    <img
                      src={require("./assets/freeCheck.svg")}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-6 paid-plan-image"></div>
            <div className="col-12">
              {!this.props.isPremium ? (
                <>
                  <div className="premiumbanner">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                        }}
                      >
                        <h3 className="subscr-title">
                          Lifetime subscription{" "}
                        </h3>
                        <p className="subscr-subtitle">
                          The subscription tokens will be used to buy DYP
                        </p>
                      </div>
                      <div>
                        <div className="d-flex gap-2 flex-column flex-lg-row">
                          <h3 className="subscr-price">75 USD</h3>
                        </div>
                        <p className="subscr-note">*Exclusive offer</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div
                      style={{
                        color: "#F7F7FC",
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "20px",
                      }}
                    >
                      Subscribe <br></br> to the Dypian plan
                    </div>
                    <div
                      className="btn filledbtn px-3 px-lg-5"
                      style={{ whiteSpace: "pre" }}
                      type=""
                      onClick={() => {
                        this.setState({
                          subscribe_now: !this.state.subscribe_now,
                        });
                        this.props.networkId === 1
                          ? this.handleSubscriptionTokenChange(
                              this.state.wethAddress
                            )
                          : this.props.networkId === 56
                          ? this.handleSubscriptionTokenChange(
                              this.state.wbnbAddress
                            )
                          : this.handleSubscriptionTokenChange(
                              this.state.wavaxAddress
                            );
                        this.handleCheckIfAlreadyApproved(
                          this.props.networkId === 1
                            ? this.state.wethAddress
                            : this.props.networkId === 56
                            ? this.state.wbnbAddress
                            : this.state.wavaxAddress
                        );
                        this.props.networkId === 1
                          ? this.setState({
                              dropdownIcon: "weth",
                              dropdownTitle: "WETH",
                            })
                          : this.props.networkId === 56
                          ? this.setState({
                              dropdownIcon: "wbnb",
                              dropdownTitle: "WBNB",
                            })
                          : this.setState({
                              dropdownIcon: "wavax",
                              dropdownTitle: "WAVAX",
                            });
                      }}
                    >
                      Subscribe now
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="premiumbanner">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                        }}
                      >
                        <h3 className="subscr-title">Welcome premium user</h3>
                      </div>
                    
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div
                      style={{
                        color: "#4FAD93",
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "20px",
                      }}
                    >
                      Active <br></br> Dypian plan
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div> */}
        <div className="">
          {/* <div className="d-flex flex-column">
            <h6 className="plans-page-title">
              Upgrade to Premium Membership and Unlock Exclusive Benefits Today!
            </h6>
            <p className="plans-page-desc mt-4">
              The premium membership is designed to enhance your experience and
              provide you with outstanding value.
            </p>
          </div> */}
          <div className="d-flex flex-column flex-lg-row align-items-center align-items-lg-end justify-content-center justify-content-lg-between all-plans-wrapper mt-4">
            {/* <div className="plans-benefits d-flex align-items-center p-3">
              <ul className="d-flex flex-column gap-3">
                {benefits.map((item, index) => (
                  <li key={index} className="d-flex align-items-center gap-2">
                    <img
                      src={greenCheck}
                      className="green-check"
                      alt="checkmark"
                    />
                    <span className="plans-benefit-title mb-0">{item}</span>
                  </li>
                ))}
              </ul>
            </div> */}
            {/* <div className="premium-subscribe-wrapper col-3 p-3">
              <div className="premium-gradient d-flex align-items-center justify-content-between p-3">
                <div className="d-flex flex-column">
                  <span className="premium-span">Premium</span>
                  <h6 className="premium-price">$100</h6>
                </div>
                <img src={premiumDypTag} alt="premium dyp" />
              </div>
              <div
                className="d-flex flex-column"
                style={{ position: "relative", top: "-25px" }}
              >
                <span className="lifetime-subscription text-center">
                  Lifetime subscription
                </span>
              </div>
              <div className="d-flex justify-content-center mt-0 mt-lg-3">
                <div
                  className="btn filledbtn px-3 px-lg-5"
                  style={{ whiteSpace: "pre" }}
                  type=""
                  onClick={() => {
                    this.setState({
                      subscribe_now: !this.state.subscribe_now,
                    });
                    this.props.networkId === 1
                      ? this.handleSubscriptionTokenChange(
                          this.state.wethAddress
                        )
                      : this.props.networkId === 56
                      ? this.handleSubscriptionTokenChange(
                          this.state.wbnbAddress
                        )
                      : this.props.networkId === 1030
                      ? this.handleSubscriptionTokenChange(
                          this.state.wcfxAddress
                        )
                      : this.props.networkId === 1482601649
                      ? this.handleSubscriptionTokenChange(
                          this.state.wskaleaddress
                        )
                      : this.props.networkId === 8453
                      ? this.handleSubscriptionTokenChange(
                          this.state.wbaseAddress
                        )
                      : this.handleSubscriptionTokenChange(
                          this.state.wavaxAddress
                        );
                    this.handleCheckIfAlreadyApproved(
                      this.props.networkId === 1
                        ? this.state.wethAddress
                        : this.props.networkId === 56
                        ? this.state.wbnbAddress
                        : this.props.networkId === 1030
                        ? this.state.wcfxAddress
                        : this.props.networkId === 1482601649
                        ? this.state.wskaleaddress
                        : this.props.networkId === 8453
                        ? this.state.wbaseAddress
                        : this.state.wavaxAddress
                    );
                    this.props.networkId === 1
                      ? this.setState({
                          dropdownIcon: "weth",
                          dropdownTitle: "WETH",
                        })
                      : this.props.networkId === 56
                      ? this.setState({
                          dropdownIcon: "wbnb",
                          dropdownTitle: "WBNB",
                        })
                      : this.props.networkId === 1030
                      ? this.setState({
                          dropdownIcon: "wcfx",
                          dropdownTitle: "WCFX",
                        })
                      : this.props.networkId === 1482601649
                      ? this.setState({
                          dropdownIcon: "usdc",
                          dropdownTitle: "USDC",
                        })
                      : this.props.networkId === 8453
                      ? this.setState({
                          dropdownIcon: "weth",
                          dropdownTitle: "WETH",
                        })
                      : this.setState({
                          dropdownIcon: "wavax",
                          dropdownTitle: "WAVAX",
                        });
                  }}
                >
                  Subscribe now
                </div>
              </div>
            </div> */}
            {/* <div className="premium-dyp-wrapper">
              <img
                src={premiumDypBanner}
                className="premium-dyp-banner"
                alt=""
              />
            </div> */}
            {/* <img src={premiumDyp} alt="premium dyp banner" className="premium-dyp-banner" /> */}
          </div>
          {/* <div className="features-wrapper w-100 d-flex align-items-center justify-content-between my-5 flex-column flex-lg-row gap-3 gap-lg-0">
            {keyFeatures.map((item) => (
              <KeyFeaturesCard
                icon={item.icon}
                plansClass={"plans-feature"}
                content={item.content}
              />
            ))}
          </div> */}
        </div>

        {this.state.subscribe_now === true ? (
          <div
            className="subscribe-wrapper row mt-4 justify-content-end"
            id="subscribe"
          >
            <div className="subscribe-container p-3 position-relative">
              <div
                className="purplediv"
                style={{ background: "#8E97CD" }}
              ></div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={
                      "https://cdn.worldofdypians.com/tools/coinStackIcon.svg"
                    }
                    alt="coin stack"
                  />
                  <h6 className="free-plan-title">Dypian Plan Subscription</h6>
                </div>
                <img
                  src={`https://cdn.worldofdypians.com/tools/clearFieldIcon.svg`}
                  height={28}
                  width={28}
                  className="cursor-pointer"
                  onClick={() => {
                    this.setState({ subscribe_now: false });
                    this.props.onClose();
                  }}
                  alt="close subscription"
                />
              </div>
              <div className="premium-gold-bg d-flex flex-column flex-lg-row gap-3 gap-lg-0 align-items-center justify-content-between p-3 mt-4">
                <div className="d-flex flex-column gap-2">
                  <span className="lifetime-plan mb-0">Lifetime plan</span>
                  <h6 className="plan-cost mb-0">$100</h6>
                </div>
                <div className="d-flex flex-column flex-lg-row align-items-center gap-3">
                  <div className="premium-chains-wrapper">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={"https://cdn.worldofdypians.com/wod/eth.svg"}
                        style={{ width: 18, height: 18 }}
                        alt=""
                      />
                      <span className="subscription-chain mb-0">Ethereum</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={"https://cdn.worldofdypians.com/wod/bnbIcon.svg"}
                        style={{ width: 18, height: 18 }}
                        alt=""
                      />
                      <span className="subscription-chain mb-0">BNB Chain</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={"https://cdn.worldofdypians.com/wod/avaxIcon.svg"}
                        style={{ width: 18, height: 18 }}
                        alt=""
                      />
                      <span className="subscription-chain mb-0">Avalanche</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={"https://cdn.worldofdypians.com/wod/base.svg"}
                        alt=""
                        style={{ width: 18, height: 18 }}
                      />
                      <span className="subscription-chain mb-0">Base</span>
                    </div>
                  </div>
                  <img
                    src={
                      "https://cdn.worldofdypians.com/tools/premiumIconPopup.svg"
                    }
                    alt=""
                  />
                </div>
              </div>
              <div className="my-3">
                <h6 className="popup-subtitle mb-0">Benefits</h6>
              </div>
              <div className="premium-benefits-wrapper d-flex flex-column flex-lg-row gap-3 gap-lg-0 align-items-center justify-content-between p-3">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={
                        "https://cdn.worldofdypians.com/tools/metaverseIcon.svg"
                      }
                      alt=""
                    />
                    <h6 className="premium-benefits-title mb-0">Metaverse</h6>
                  </div>
                  {metaverseBenefits.map((item, index) => (
                    <div
                      className="d-flex align-items-center gap-2"
                      key={index}
                    >
                      <img
                        src={
                          "https://cdn.worldofdypians.com/tools/greendot.svg"
                        }
                        alt=""
                      />
                      <span className="premium-benefits-item mb-0">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={"https://cdn.worldofdypians.com/tools/dappsIcon.svg"}
                      alt=""
                    />
                    <h6 className="premium-benefits-title mb-0">Dapps</h6>
                  </div>
                  {benefits.map((item, index) => (
                    <div
                      className="d-flex align-items-center gap-2"
                      key={index}
                    >
                      <img
                        src={
                          "https://cdn.worldofdypians.com/tools/greendot.svg"
                        }
                        alt=""
                      />
                      <span className="premium-benefits-item mb-0">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="d-flex mt-4 align-items-end justify-content-between flex-column-reverse flex-lg-row w-100">
                <div className="d-flex flex-column gap-1 subscribe-input-container w-100">
                  <div className="d-flex gap-1 align-items-center justify-content-start">
                    <span className="my-premium-balance-text">
                      Select Chain
                    </span>
                  </div>
                  <div className=" d-flex align-items-center gap-3 justify-content-between">
                    <div class="dropdown position relative">
                      <button
                        class={`btn launchpad-dropdown d-flex justify-content-between align-items-center dropdown-toggle`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div
                          className="d-flex align-items-center gap-2 me-2"
                          style={{ color: "#fff" }}
                        >
                          <img
                            src={`https://cdn.worldofdypians.com/tools/${this.state.chainDropdown.symbol}Icon.svg`}
                            alt=""
                            style={{ width: 18, height: 18 }}
                          />
                          {this.state.chainDropdown.name}
                        </div>
                        <img
                          src={
                            "https://cdn.worldofdypians.com/wod/launchpadIndicator.svg"
                          }
                          alt=""
                        />
                      </button>
                      <ul class="dropdown-menu w-100">
                        <li
                          className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                          onClick={handleEthPool}
                        >
                          <img
                            src={"https://cdn.worldofdypians.com/wod/eth.svg"}
                            style={{ width: 18, height: 18 }}
                            alt=""
                          />
                          Ethereum
                        </li>

                        <li
                          className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                          onClick={handleBnbPool}
                        >
                          <img
                            src={
                              "https://cdn.worldofdypians.com/wod/bnbIcon.svg"
                            }
                            style={{ width: 18, height: 18 }}
                            alt=""
                          />
                          BNB Chain
                        </li>
                        <li
                          className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                          onClick={handleAvaxPool}
                        >
                          <img
                            src={
                              "https://cdn.worldofdypians.com/wod/avaxIcon.svg"
                            }
                            style={{ width: 18, height: 18 }}
                            alt=""
                          />
                          Avalanche
                        </li>
                        <li
                          className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                          onClick={handleBasePool}
                        >
                          <img
                            src={"https://cdn.worldofdypians.com/wod/base.svg"}
                            alt=""
                            style={{
                              width: "18px",
                              height: "18px",
                            }}
                          />
                          Base Network
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column gap-1 subscribe-input-container w-100">
                  <div className="d-flex gap-1 align-items-center justify-content-lg-end">
                    <span className="my-premium-balance-text">
                      My balance:{" "}
                      {getFormattedNumber(
                        this.state.tokenBalance / 10 ** tokenDecimals,
                        6
                      )}{" "}
                      {this.state.dropdownTitle}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-3 justify-content-between">
                    <span className="token-amount-placeholder">
                      Subscription price:
                    </span>
                    <div className="d-flex align-items-center gap-2">
                      <div class="dropdown position relative">
                        <button
                          class={`btn launchpad-dropdown d-flex justify-content-between align-items-center dropdown-toggle`}
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <div
                            className="d-flex align-items-center gap-2"
                            style={{ color: "#fff" }}
                          >
                            {this.state.dropdownIcon !== "" && (
                              <img
                                src={`https://cdn.worldofdypians.com/tools/${this.state.dropdownIcon.toLowerCase()}Icon.svg`}
                                alt=""
                                className="me-2"
                              />
                            )}
                            {/* {this.state.dropdownTitle} */}
                          </div>
                          <img
                            src={
                              "https://cdn.worldofdypians.com/wod/launchpadIndicator.svg"
                            }
                            alt=""
                          />
                        </button>
                        <ul class="dropdown-menu w-100">
                          {/* <li className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                    onClick={() => {
                      this.setState({dropdownTitle: 'WETH', dropdownIcon: 'wethIcon.svg'})
                    }}
                    >
                      <img
                        src={require(`./assets/wethIcon.svg`)}
                        alt=""
                      />
                      WETH
                    </li>
                    <li className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                    onClick={() => {
                      this.setState({dropdownTitle: 'USDT', dropdownIcon: 'usdtIcon.svg'})
                    }}
                    >
                      <img
                        src={require(`./assets/usdtIcon.svg`)}
                        alt=""
                      />
                      USDT
                    </li>
                    <li className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                    onClick={() => {
                      this.setState({dropdownTitle: 'USDC', dropdownIcon: 'usdcIcon.svg'})
                    }}
                    >
                      <img
                        src={require(`./assets/usdcIcon.svg`)}
                        alt=""
                      />
                      USDC
                    </li> */}
                          {Object.keys(
                            this.props.networkId === 1
                              ? window.config.subscriptioneth_tokens
                              : this.props.networkId === 56
                              ? window.config.subscriptionbnb_tokens
                              : this.props.networkId === 8453
                              ? window.config.subscriptionbase_tokens
                              : window.config.subscription_tokens
                          ).map((t, i) => (
                            // <span className="radio-wrapper" key={t}>
                            //   <input
                            //     type="radio"
                            //     value={t}
                            //     name={"tokensymbol"}
                            //     checked={
                            //       t == this.state.selectedSubscriptionToken
                            //     }
                            //     disabled={!this.props.appState.isConnected}
                            //     onChange={
                            //       (e) => {
                            //         this.handleSubscriptionTokenChange(
                            //           e.target.value
                            //         );
                            //         this.handleCheckIfAlreadyApproved();
                            //       console.log(e.target.value);

                            //       }

                            //     }
                            //   />
                            //   {this.props.networkId === 1
                            //     ? window.config.subscriptioneth_tokens[t]?.symbol
                            //     : window.config.subscription_tokens[t]?.symbol}
                            // </span>
                            <li
                              key={i}
                              className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                              onClick={() => {
                                window.cached_contracts = Object.create(null);
                                setTimeout(() => {
                                  this.setState({
                                    dropdownTitle:
                                      this.props.networkId === 1
                                        ? window.config.subscriptioneth_tokens[
                                            t
                                          ]?.symbol
                                        : this.props.networkId === 56
                                        ? window.config.subscriptionbnb_tokens[
                                            t
                                          ]?.symbol
                                        : this.props.networkId === 8453
                                        ? window.config.subscriptionbase_tokens[
                                            t
                                          ]?.symbol
                                        : window.config.subscription_tokens[t]
                                            ?.symbol,
                                    dropdownIcon:
                                      this.props.networkId === 1
                                        ? window.config.subscriptioneth_tokens[
                                            t
                                          ]?.symbol
                                        : this.props.networkId === 56
                                        ? window.config.subscriptionbnb_tokens[
                                            t
                                          ]?.symbol
                                        : this.props.networkId === 8453
                                        ? window.config.subscriptionbase_tokens[
                                            t
                                          ]?.symbol
                                        : window.config.subscription_tokens[t]
                                            ?.symbol,
                                  });
                                  // console.log(t);
                                  this.handleSubscriptionTokenChange(t);
                                  this.handleCheckIfAlreadyApproved(t);
                                }, 200);
                              }}
                            >
                              <img
                                src={
                                  this.props.networkId === 1
                                    ? `https://cdn.worldofdypians.com/tools/${window.config.subscriptioneth_tokens[
                                        t
                                      ]?.symbol.toLowerCase()}Icon.svg`
                                    : this.props.networkId === 56
                                    ? `https://cdn.worldofdypians.com/tools/${window.config.subscriptionbnb_tokens[
                                        t
                                      ]?.symbol.toLowerCase()}Icon.svg`
                                    : this.props.networkId === 8453
                                    ? `https://cdn.worldofdypians.com/tools/${window.config.subscriptionbase_tokens[
                                        t
                                      ]?.symbol.toLowerCase()}Icon.svg`
                                    : `https://cdn.worldofdypians.com/tools/${window.config.subscription_tokens[
                                        t
                                      ]?.symbol.toLowerCase()}Icon.svg`
                                }
                                alt=""
                              />
                              {this.props.networkId === 1
                                ? window.config.subscriptioneth_tokens[t]
                                    ?.symbol
                                : this.props.networkId === 56
                                ? window.config.subscriptionbnb_tokens[t]
                                    ?.symbol
                                : this.props.networkId === 8453
                                ? window.config.subscriptionbase_tokens[t]
                                    ?.symbol
                                : window.config.subscription_tokens[t]?.symbol}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <span className="usdt-text">
                        {this.state.formattedPrice.slice(0, 9)}
                      </span>
                      {/* {this.state.dropdownIcon !== "" && (
                    <img
                      src={require(`./assets/${this.state.dropdownIcon.toLowerCase()}Icon.svg`)}
                      alt=""
                      height={24}
                      width={24}
                    />
                  )} */}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="form-divider my-4" />
              <div
                className={`d-flex flex-column gap-2 align-items-center justify-content-center`}
              >
                {!this.props.coinbase && (
                  <span style={{ color: "rgb(227, 6 ,19)" }}>
                    Please connect your wallet first
                  </span>
                )}
                {this.props.isConnected && this.props.coinbase && (
                  <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                    <button
                      className={"btn success-btn px-4 "}
                      disabled={
                        this.state.approveStatus === "fail" ||
                        !this.props.coinbase
                          ? true
                          : false
                      }
                      style={{
                        background:
                          this.state.approveStatus === "fail"
                            ? "linear-gradient(90.74deg, #f8845b 0%, #f0603a 100%)"
                            : "linear-gradient(90.74deg, #75CAC2 0%, #57B6AB 100%)",
                      }}
                      onClick={(e) =>
                        this.state.isApproved === false
                          ? this.handleApprove(e)
                          : this.handleSubscribe()
                      }
                    >
                      {this.state.isApproved === true &&
                      this.state.loadspinner === false &&
                      this.state.loadspinnerSub === false &&
                      (this.state.approveStatus === "deposit" ||
                        this.state.approveStatus === "initial") ? (
                        "Subscribe"
                      ) : this.state.isApproved === false &&
                        this.state.loadspinner === false &&
                        this.state.approveStatus === "initial" &&
                        this.state.loadspinnerSub === false ? (
                        "Approve"
                      ) : this.state.loadspinner === false &&
                        this.state.approveStatus === "fail" &&
                        this.state.loadspinnerSub === false ? (
                        "Failed"
                      ) : (
                        <div
                          className="spinner-border "
                          role="status"
                          style={{ height: "1.5rem", width: "1.5rem" }}
                        ></div>
                      )}
                    </button>
                    <span style={{ color: "#E30613" }}>
                      {this.state.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* <form onSubmit={this.handleSubscribe}>     
        <div>
          {!this.props.isPremium ? (
            <table className="w-100">
              <tr
                className="tablerow"
                style={{ position: "relative", top: "-10px" }}
              >
                <th className="tableheader"></th>
                <th className="tableheader freetext">
                  <img
                    src={this.props.theme === "theme-dark" ? FreeWhite : Free}
                    alt=""
                  />{" "}
                  Free
                </th>
                <th className="tableheader premiumtext">
                  <img src={Premium} alt="" /> Premium
                </th>
              </tr>
              {benefits.length > 0 &&
                benefits.map((item, key) => {
                  return (
                    <>
                      <tr key={key} className="tablerow">
                        <td className="tabledata">{item.title}</td>
                        <td className="tabledata">
                          <img
                            src={item.free === "yes" ? Check : Cross}
                            alt=""
                            className="itemdataimg"
                          />{" "}
                        </td>
                        <td className="tabledata">
                          <img
                            src={item.premium === "yes" ? Check : Cross}
                            alt=""
                          />
                        </td>
                      </tr>
                    </>
                  );
                })}
            </table>
          ) : (
            <>
              <table className="w-100">
                <tr
                  className="tablerow"
                  style={{ position: "relative", top: "-10px" }}
                >
                  <th className="tableheader"></th>
                  <th className="tableheader freetext">
                    <img
                      src={
                        this.props.theme === "theme-dark" ? FreeWhite : Free
                      }
                      alt=""
                    />{" "}
                    Free
                  </th>
                  <th className="tableheader premiumtext">
                    <img src={Premium} alt="" /> Premium
                  </th>
                </tr>
                {benefits.length > 0 &&
                  benefits.slice(0, 1).map((item, key) => {
                    return (
                      <>
                        <tr key={key} className="tablerow">
                          <td className="tabledata" style={{ width: "79%" }}>
                            {item.title}
                          </td>
                          <td className="tabledata">
                            <img
                              src={item.free === "yes" ? Check : Cross}
                              alt=""
                            />{" "}
                          </td>
                          <td className="tabledata">
                            <img
                              src={item.premium === "yes" ? Check : Cross}
                              alt=""
                            />
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </table>

              <Collapsible
                trigger={this.state.triggerText}
                onClose={() => {
                  this.setState({ triggerText: "See more V" });
                }}
                onOpen={() => {
                  this.setState({ triggerText: "See less Ʌ" });
                }}
              >
                <table className="w-100">
                  {benefits.length > 0 &&
                    benefits.slice(1, benefits.length).map((item, key) => {
                      return (
                        <>
                          <tr key={key} className="tablerow">
                            <td
                              className="tabledata"
                              style={{ width: "77%" }}
                            >
                              {item.title}
                            </td>
                            <td className="tabledata">
                              <img
                                src={item.free === "yes" ? Check : Cross}
                                alt=""
                              />
                            </td>
                            <td className="tabledata">
                              <img
                                src={item.premium === "yes" ? Check : Cross}
                                alt=""
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </table>
              </Collapsible>
            </>
          )}

         
        </div>
        {!this.props.isPremium ? (   
          this.state.subscribe_now === true ? (
            <>
              <div className="mt-4 ml-0">
                <div className="row m-0" style={{ gap: 100 }}>
                  <div
                    className="form-group"
                    style={{ maxWidth: 490, width: "100%" }}
                  >
                    <p>Select Subscription Token</p>
                    <div className="row m-0" style={{ gap: 10 }}>
                      {Object.keys(
                        this.props.networkId === 1
                          ? window.config.subscriptioneth_tokens
                          : window.config.subscription_tokens
                      ).map((t, i) => (
                        <span className="radio-wrapper" key={t}>
                          <input
                            type="radio"
                            value={t}
                            name={"tokensymbol"}
                            checked={
                              t == this.state.selectedSubscriptionToken
                            }
                            disabled={!this.props.appState.isConnected}
                            onChange={
                              (e) => {
                                this.handleSubscriptionTokenChange(
                                  e.target.value
                                );
                                this.handleCheckIfAlreadyApproved();
                              console.log(e.target.value);

                              }

                            }
                          />
                          {this.props.networkId === 1
                            ? window.config.subscriptioneth_tokens[t]?.symbol
                            : window.config.subscription_tokens[t]?.symbol}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <div>
                      <p>Token Amount</p>
                      <span className="subscription-subtitle">
                        Subcription token amount
                      </span>
                      <div
                        className="align-items-center row m-0"
                        style={{ gap: 40 }}
                      >
                        <input
                          style={{ width: "266px", height: 42 }}
                          disabled
                          onChange={(e) => {
                            let amount = new window.BigNumber(e.target.value);
                            amount = amount.times(1e18).toFixed(0);
                            this.setState({ amount });
                          }}
                          value={this.state.formattedPrice}
                          type="number"
                          placeholder="Subscription Token Amount"
                          className="form-control"
                        />
                        <div className="d-flex flex-column">
                          <span className="balance-placeholder">
                            Balance:
                          </span>
                          <span className="balance-text">
                            {getFormattedNumber(
                              this.state.tokenBalance / 10 ** tokenDecimals,
                              6
                            )}
                          </span>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
                <div className="row m-0" style={{ gap: 30 }}>
                  <button
                    disabled={!this.props.appState.isConnected}
                    onClick={this.handleApprove}
                    className="btn v1"
                    style={{
                      background:
                        this.state.lockActive === false
                          ? "linear-gradient(51.32deg, #E30613 -12.3%, #FA4A33 50.14%)"
                          : "#C4C4C4",
                      width: 230,
                      pointerEvents:
                        this.state.lockActive === false ? "auto" : "none",
                    }}
                    type="button"
                  >
                    {this.state.loadspinner === true ? (
                      <>
                        <div
                          className="spinner-border "
                          role="status"
                          style={{ height: "1.5rem", width: "1.5rem" }}
                        ></div>
                      </>
                    ) : (
                      "APPROVE"
                    )}
                  </button>
                  <button
                    disabled={!this.props.appState.isConnected}
                    className="btn v1 ml-0"
                    type="submit"
                    style={{
                      background:
                        this.state.lockActive === false
                          ? "#C4C4C4"
                          : "linear-gradient(51.32deg, #E30613 -12.3%, #FA4A33 50.14%)",
                      width: 230,
                      pointerEvents:
                        this.state.lockActive === false ? "none" : "auto",
                    }}
                  >
                    {this.state.loadspinnerSub === true ? (
                      <>
                        <div
                          className="spinner-border "
                          role="status"
                          style={{ height: "1.5rem", width: "1.5rem" }}
                        ></div>
                      </>
                    ) : (
                      "SUBSCRIBE"
                    )}
                  </button>
                </div>
                {this.state.status !== "" && (
                  <div className="status-wrapper">
                    <p style={{ color: "#E30613" }}>
                      <img src={Error} alt="" /> {this.state.status}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <></>
          )
        ) : (
          <>
            <div>
            <p>
              <i className="fas fa-check-circle"></i> Premium Member 
            </p>
            <p>
              DYP Locked in Subscription:{" "}
              {getFormattedNumber(
                this.props.appState.subscribedPlatformTokenAmount / 1e18,
                6
              )}{" "}
              DYP
            </p>
            
          </div>
            <div className="premiumbanner2">
              <div className="row m-0 justify-content-between">
                <div
                  style={{
                    maxWidth: 335,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <h3 className="subscr-title">Welcome Premium User</h3>
                  <p className="subscr-subtitle">
                    When you unsubscribe the DYP will be unlocked and sent to
                    your wallet
                  </p>
                </div>
                <div>
                  <button
                    disabled={!this.props.appState.isConnected}
                    onClick={this.handleUnsubscribe}
                    className="savebtn w-auto mt-2 v1"
                    type="button"
                    style={{ padding: "10px 20px" }}
                  >
                    Unsubscribe
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </form> */}

        {/* <h4 className="d-block mb-5 mt-5" id="my-fav">
        My favourite pairs
      </h4>
      <div className="row p-0 m-0 favorites-grid">
        {this.state.favorites.map((lock, index) => {
          return (
            <NavLink
              key={index}
              className="p-0"
              to={`/pair-explorer/${lock.id}`}
            >
              <div style={{ position: "relative" }}>
                <div
                  className="d-flex avax"
                  style={{
                    border: "2px solid #565891",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      position: "absolute",
                      top: "-17px",
                      left: "50%",
                      width: "115px",
                      height: "34px",
                      transform: "translateX(-50%)",
                      borderRadius: "50px",
                      background:
                        "linear-gradient(93.99deg, #DF2C2D 0%, #F86465 100%)",
                      gap: "5px",
                    }}
                  >
                    <img
                      src={require("../../assets/wavax.svg")}
                      alt=""
                      style={{ height: 20, width: 20 }}
                    ></img>
                    <div style={{ color: "#F7F7FC" }}>Avalanche</div>
                  </div>

                  <div className="pair-locks-wrapper">
                    <div className="row-wrapper">
                      <span className="left-info-text">ID</span>
                      <span className="right-info-text">{index + 1}</span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">Pair Address</span>
                      <span className="right-info-text">
                        ...{lock.id.slice(35)}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">Tokens</span>
                      <span className="right-info-text">
                        {lock.token0.symbol}/{lock.token1.symbol}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">Total liquidity</span>
                      <span className="right-info-text">
                        {getFormattedNumber(lock.reserveUSD, 2)}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">
                        Pooled {lock.token0.symbol}
                      </span>
                      <span className="right-info-text">
                        {getFormattedNumber(lock.reserve0, 2)}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">
                        Pooled {lock.token1.symbol}
                      </span>
                      <span className="right-info-text">
                        {getFormattedNumber(lock.reserve1, 2)}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">LP Holders</span>
                      <span className="right-info-text">
                        {lock.liquidityProviderCount}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">
                        Pair transactions:
                      </span>
                      <span className="right-info-text">{lock.txCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </NavLink>
          );
        })}
        {this.state.favoritesETH.map((lock, index) => {
          return (
            <NavLink
              key={index}
              className="p-0"
              to={`/pair-explorer/${lock.id}`}
              onClick={() => {
                this.props.handleSwitchNetwork(1);
              }}
            >
              <div style={{ position: "relative" }}>
                <div
                  className="d-flex"
                  style={{
                    border: "2px solid #565891",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      position: "absolute",
                      top: "-17px",
                      left: "50%",
                      width: "106px",
                      height: "34px",
                      transform: "translateX(-50%)",
                      borderRadius: "50px",
                      background:
                        "linear-gradient(93.99deg, #4ED5CD 0%, #524FD8 100%)",
                      gap: "5px",
                    }}
                  >
                    <img src="/assets/img/ethereum.svg"></img>
                    <div style={{ color: "#F7F7FC" }}>Ethereum</div>
                  </div>
                  <div className="pair-locks-wrapper">
                    <div className="row-wrapper">
                      <span className="left-info-text">ID</span>
                      <span className="right-info-text">{index + 1}</span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">Pair Address</span>
                      <span className="right-info-text">
                        ...{lock.id.slice(35)}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">Tokens</span>
                      <span className="right-info-text">
                        {lock.token0.symbol}/{lock.token1.symbol}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">Total liquidity</span>
                      <span className="right-info-text">
                        {getFormattedNumber(lock.reserveUSD, 2)}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">
                        Pooled {lock.token0.symbol}
                      </span>
                      <span className="right-info-text">
                        {getFormattedNumber(lock.reserve0, 2)}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">
                        Pooled {lock.token1.symbol}
                      </span>
                      <span className="right-info-text">
                        {getFormattedNumber(lock.reserve1, 2)}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">LP Holders</span>
                      <span className="right-info-text">
                        {lock.liquidityProviderCount}
                      </span>
                    </div>
                    <div className="row-wrapper">
                      <span className="left-info-text">
                        Pair transactions:
                      </span>
                      <span className="right-info-text">{lock.txCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div> */}
      </div>
    );
  };

  render() {
    return (
      <div className="locker container-lg">
        <div>
          <div className="mb-4">{this.GetSubscriptionForm()}</div>
        </div>
      </div>
    );
  }
}
