import React from "react";
import getFormattedNumber from "../../functions/get-formatted-number";
import Countdown from "react-countdown";
import "./bridge.css";
import eth from "./assets/eth.svg";
import bnb from "./assets/bnb.svg";
import avax from "./assets/avax.svg";
import wallet from "./assets/wallet.svg";
import moreinfo from "./assets/more-info.svg";
import switchicon from "./assets/switch.svg";
import failMark from "../../assets/failMark.svg";
import Tooltip from "@material-ui/core/Tooltip";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import routeIcon from "./assets/route-icon.svg";
import Address from "../FARMINNG/address";
import WalletModal from "../WalletModal";
import PropTypes from "prop-types";
import Web3 from "web3";

// Renderer callback with condition
const getRenderer =
  (completedText = "0s", braces = false) =>
  ({ days, hours, minutes, seconds, completed }) => {
    if (braces && completedText === "0s") {
      completedText = "( 0s )";
    }
    if (completed) {
      // Render a complete state
      return <span>{completedText}</span>;
    } else {
      // Render a countdown
      return (
        <span>
          {braces ? "(" : ""} {days > 0 ? days + "d " : ""}
          {hours > 0 || days > 0 ? hours + "h " : ""}
          {minutes > 0 || hours > 0 || days > 0 ? minutes + "m " : ""}
          {seconds}s {braces ? ")" : ""}
          {/* {days}d {hours}h {minutes}m {seconds}s Left */}
        </span>
      );
    }
  };

export default function initMigration({
  bridgeETH,
  bridgeBSC,
  tokenETH,
  tokenBSC,
  TOKEN_DECIMALS = 18,
  TOKEN_SYMBOL = "DYP",
}) {
  let { BigNumber } = window;

  class Migration extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        token_balance: "",
        network: "BSC",
        depositAmount: "",
        coinbase: "",
        gasPrice: "",
        txHash: "",
        chainText: "",
        ethPool: "...",
        avaxPool: "...",
        bnbPool: "...",
        withdrawableUnixTimestamp: null,
        depositLoading: false,
        depositStatus: "initial",
        withdrawLoading: false,
        withdrawStatus: "initial",
        errorMsg: "",
        errorMsg2: "",
        showWalletModal: false,
        destinationChain: this.props.destinationChain,
        sourceChain: this.props.sourceChain,
      };
    }
    static propTypes = {
      match: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
    };
    componentDidMount() {
      this.refreshBalance();
      this.checkAllowance();
      window._refreshBalInterval = setInterval(this.refreshBalance, 4000);
    }

    componentWillUnmount() {
      clearInterval(window._refreshBalInterval);
    }

    checkAllowance = async (amount) => {
      if (this.props.sourceChain === "eth") {
        const oldDyp_address = window.config.token_old_address;
        const claimDyp_address = window.config.claim_newdyp_eth_address;
        const token_contract = new window.goerliWeb3.eth.Contract(
          window.TOKEN_ABI,
          oldDyp_address
        );

        const result = await token_contract.methods
          .allowance(this.props.coinbase, claimDyp_address)
          .call();

        let result_formatted = new BigNumber(result).div(1e18).toFixed(6);

        if (
          Number(result_formatted) >= Number(amount) &&
          Number(result_formatted) !== 0
        ) {
          this.setState({ depositStatus: "deposit" });
        } else {
          this.setState({ depositStatus: "initial" });
        }
      }
    };

    handleApprove = (e) => {
      let amount = this.state.depositAmount;
      this.setState({ depositLoading: true });
      console.log(tokenETH);
      amount = new BigNumber(amount).times(10 ** TOKEN_DECIMALS).toFixed(0);
      let bridge = this.props.sourceChain === 'bsc' ? window.config.bridge_bsc_old_address : window.config.bridge_bsc_old_address;;
      tokenETH
        .approve(bridge, amount)
        .then(() => {
          this.setState({ depositLoading: false, depositStatus: "deposit" });
        })
        .catch((e) => {
          this.setState({ depositLoading: false, depositStatus: "fail" });
          this.setState({ errorMsg: e?.message });
          setTimeout(() => {
            this.setState({
              depositStatus: "initial",
              depositAmount: "",
              errorMsg: "",
            });
          }, 8000);
        });
    };

    handleApproveClaim = async () => {
      let amount = this.state.depositAmount;
      this.setState({ depositLoading: true });
      if (this.props.sourceChain === "eth") {
        const oldDyp_address = window.config.token_old_address;
        const claimDyp_address = window.config.claim_newdyp_eth_address;
        const web3 = new Web3(window.ethereum);
        amount = new BigNumber(amount).times(10 ** TOKEN_DECIMALS).toFixed(0);

        const token_contract = new web3.eth.Contract(
          window.TOKEN_ABI,
          oldDyp_address
        );

        token_contract.methods
          .approve(claimDyp_address, amount)
          .send({ from: this.props.coinbase })
          .then(() => {
            this.setState({ depositLoading: false, depositStatus: "deposit" });
          })
          .catch((e) => {
            this.setState({ depositLoading: false, depositStatus: "fail" });
            this.setState({ errorMsg: e?.message });
            setTimeout(() => {
              this.setState({
                depositStatus: "initial",
                depositAmount: "",
                errorMsg: "",
              });
            }, 8000);
          });
      }
    };

    handleDeposit = async (e) => {
      let amount = this.state.depositAmount;
      this.setState({ depositLoading: true });
      const web3 = new Web3(window.ethereum);

      if (this.props.sourceChain === "eth") {
        amount = new BigNumber(amount).times(10 ** TOKEN_DECIMALS).toFixed(0);

        const contract = new web3.eth.Contract(
          window.CLAIM_NEW_DYP_ABI,
          window.config.claim_newdyp_eth_address
        );
        contract.methods
          .claim(amount)
          .send({ from: this.props.coinbase })
          .then(() => {
            this.setState({ depositLoading: false, depositStatus: "success" });
            this.refreshBalance();
          })
          .catch((e) => {
            this.setState({
              depositLoading: false,
              depositStatus: "fail",
              errorMsg: e?.message,
            });
            setTimeout(() => {
              this.setState({
                depositStatus: "initial",
                depositAmount: "",
                errorMsg: "",
              });
            }, 8000);
          });
      }
    };

    handledepositBridge = async () => {
      let amount = this.state.depositAmount;
      this.setState({ depositLoading: true });

      amount = new BigNumber(amount).times(10 ** TOKEN_DECIMALS).toFixed(0);
      let bridge = this.props.sourceChain === 'bsc' ? window.config.bridge_bsc_old_address : window.config.bridge_bsc_old_address;
      let chainId = this.props.networkId;

      if (chainId !== undefined) {
        let contract = await window.getNewBridgeContract(bridge);
        contract.methods
          .deposit(amount)
          .send({ from: await window.getCoinbase() }, (err, txHash) => {
            this.setState({ txHash });
          })
          .then(() => {
            this.setState({ depositLoading: false, depositStatus: "success" });
            // this.refreshBalance();
          })
          .catch((e) => {
            this.setState({
              depositLoading: false,
              depositStatus: "fail",
              errorMsg: e?.message,
            });
            setTimeout(() => {
              this.setState({
                depositStatus: "initial",
                depositAmount: "",
                errorMsg: "",
              });
            }, 8000);
          });
      }
    };

    handleWithdraw = async (e) => {
      this.setState({ withdrawLoading: true });
      try {
        let signature = window.config.SIGNATURE_API_URL_NEW_BSC;
        let url =
          signature +
          `/api/withdraw-args?depositNetwork=${
            this.props.sourceChain === "bnb"
              ? "BSC"
              : this.props.sourceChain === "avax"
              ? "AVAX"
              : "BSC"
          }&txHash=${this.state.txHash}`;
        console.log({ url });
        let args = await window.jQuery.get(url);
        console.log({ args });
        const bridge = window.newbridge_eth;

        bridge
          .withdraw(args)
          .then(() => {
            this.setState({
              withdrawLoading: false,
              withdrawStatus: "success",
            });
          })
          .catch((e) => {
            this.setState({ withdrawLoading: false, withdrawStatus: "fail" });
            this.setState({ errorMsg2: e?.message });
            setTimeout(() => {
              this.setState({
                withdrawStatus: "initial",
                withdrawAmount: "",
                errorMsg2: "",
              });
            }, 8000);
          });
      } catch (e) {
        window.alertify.error("Something went wrong!");
        console.error(e);
      }
    };

    handleSetMaxDeposit = (e) => {
      e.preventDefault();
      this.setState({
        depositAmount: new BigNumber(this.state.token_balance)
          .div(10 ** TOKEN_DECIMALS)
          .toFixed(TOKEN_DECIMALS),
      });
    };

    refreshBalance = async () => {
      if (this.props.isConnected === true && this.props.networkId !== 0) {
        let coinbase = this.props.coinbase;
        this.setState({ coinbase });
        try {
          const oldDyp_address = window.config.token_old_address;
          const tokenAddress_bsc = "0x2e0a34680c72d998e327f58dedfd48f9d4282b8c";

          if (this.props.sourceChain === "eth") {
            const token_contract_eth = new window.goerliWeb3.eth.Contract(
              window.TOKEN_ABI,
              oldDyp_address
            );
            await token_contract_eth.methods
              .balanceOf(this.props.coinbase)
              .call()
              .then((data) => {
                this.setState({ token_balance: data });
              });
          } else if (this.props.sourceChain === "bnb") {
            const token_contract_bsc = new window.bscTestWeb3.eth.Contract(
              window.TOKENBSC_ABI,
              tokenAddress_bsc
            );
            await token_contract_bsc.methods
              .balanceOf(this.props.coinbase)
              .call()
              .then((data) => {
                this.setState({ token_balance: data });
              });
          } else if (this.props.sourceChain === "avax") {
            const token_contract_avax = new window.bscTestWeb3.eth.Contract(
              window.TOKEN_ABI,
              tokenAddress_bsc
            );
            await token_contract_avax.methods
              .balanceOf(this.props.coinbase)
              .call()
              .then((data) => {
                this.setState({ token_balance: data });
              });
          }
          // let chainId = this.props.networkId;

          // let network = window.config.chain_ids[chainId] || "UNKNOWN";

          // let token_balance = await (network === "AVAX" || network === "BSC"
          //   ? tokenBSC
          //   : tokenETH
          // ).balanceOf(coinbase);

          // this.setState({
          //   token_balance,
          //   network,
          // });

          if (this.state.txHash) {
            try {
              let signature = window.config.SIGNATURE_API_URL_NEW_BSC;
              let url =
                signature +
                `/api/withdraw-args?depositNetwork=${
                  this.props.sourceChain === "bnb"
                    ? "BSC"
                    : this.props.sourceChain === "avax"
                    ? "AVAX"
                    : "BSC"
                }&txHash=${
                  this.state.txHash
                }&getWithdrawableUnixTimestamp=true`;
              console.log({ url });
              let { withdrawableUnixTimestamp } = await window.jQuery.get(url);
              this.setState({ withdrawableUnixTimestamp });
              console.log({ withdrawableUnixTimestamp });
            } catch (e) {
              console.error(e);
              this.setState({ withdrawableUnixTimestamp: null });
            }
          } else this.setState({ withdrawableUnixTimestamp: null });
        } catch (e) {
          console.error(e);
        }
      }
    };

    render() {
      let canWithdraw = false;
      let timeDiff = null;

      if (this.state.withdrawableUnixTimestamp) {
        timeDiff = Math.max(
          0,
          this.state.withdrawableUnixTimestamp * 1e3 - Date.now()
        );
        canWithdraw = timeDiff === 0;
      }
      return (
        <div className="row w-100 mx-0 gap-4 justify-content-between">
          <div
            className="token-staking col-12 col-lg-6 col-xxl-5"
            style={{ height: "fit-content" }}
          >
            <div className="purplediv"></div>
            <div className="row">
              <div>
                <div className="d-flex flex-column">
                  <h6 className="fromtitle mb-2">Deposit</h6>
                  <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center justify-content-between gap-3">
                      <div
                        className={
                          this.props.sourceChain === "eth"
                            ? "optionbtn-active"
                            : "optionbtn-passive bridge-passive"
                        }
                        onClick={() => {
                          // this.props.activebtn === "5"
                          //   ? this.props.onSelectChain("bnb")
                          //   : this.props.onSelectChain("avax");
                          this.props.onSelectSourceChain("eth");
                        }}
                      >
                        <h6 className="optiontext d-flex align-items-center gap-2">
                          <img src={eth} alt="" />
                          <p className=" mb-0 optiontext d-none d-lg-flex">
                            Ethereum
                          </p>
                        </h6>
                      </div>

                      {this.props.activebtn !== "2" && (
                        <div
                          className={
                            this.props.sourceChain === "bnb"
                              ? "optionbtn-active"
                              : "optionbtn-passive bridge-passive"
                          }
                          onClick={() => {
                            this.setState({
                              sourceChain: "bnb",
                            });
                            this.props.onSelectSourceChain("bnb");
                            // this.props.onSelectChain("avax");
                          }}
                        >
                          <h6 className="optiontext d-flex align-items-center gap-2">
                            <img src={bnb} alt="" />
                            <p className=" mb-0 optiontext d-none d-lg-flex">
                              BNB Chain
                            </p>
                          </h6>
                        </div>
                      )}

                      <div
                        className={
                          this.props.sourceChain === "avax"
                            ? "optionbtn-active"
                            : "optionbtn-passive bridge-passive"
                        }
                        onClick={() => {
                          this.setState({
                            sourceChain: "avax",
                          });
                          this.props.onSelectSourceChain("avax");
                          // this.props.onSelectChain("bnb");
                        }}
                      >
                        <h6 className="optiontext d-flex align-items-center gap-2">
                          <img src={avax} alt="" />
                          <p className=" mb-0 optiontext d-none d-lg-flex">
                            Avalanche
                          </p>
                        </h6>
                      </div>
                    </div>
                    {this.props.isConnected === false ? (
                      <button
                        className="connectbtn btn d-flex align-items-center gap-2"
                        style={{ width: "fit-content" }}
                        onClick={() => {
                          this.setState({ showWalletModal: true });
                        }}
                      >
                        <img src={wallet} alt="" />
                        Connect wallet
                      </button>
                    ) : (
                      <div className="addressbtn btn">
                        <Address a={this.props.coinbase} chainId={43114} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="row token-staking-form gap-3">
                  <div className="col-12">
                    <div className="l-box">
                      <div>
                        <div className="form-group">
                          <div className="row m-0">
                            <div className="activewrapper flex-column flex-lg-row mt-3 mb-3">
                              <label
                                htmlFor="deposit-amount"
                                className="chainWrapper text-left"
                              >
                                <h6 className="mybalance-text">
                                  Balance:
                                  <b>
                                    {" "}
                                    {this.props.sourceChain === "avax"
                                      ? getFormattedNumber(
                                          this.props.avaxBalance / 1e18,
                                          2
                                        )
                                      : this.props.sourceChain === "eth"
                                      ? getFormattedNumber(
                                          this.props.ethBalance / 1e18,
                                          2
                                        )
                                      : getFormattedNumber(
                                          this.props.bnbBalance / 1e18,
                                          2
                                        )}
                                  </b>
                                  DYP
                                </h6>
                              </label>
                              {/* <div className="">
                                <h6
                                  className="poolbalance-text"
                                  style={{ gap: "6px" }}
                                >
                                  {this.props.sourceChain !== "avax"
                                    ? "BNB Chain"
                                    : "Avalanche"}{" "}
                                  Pool:{" "}
                                  <b>
                                    {this.state.sourceChain === "avax"
                                      ? getFormattedNumber(
                                          this.state.avaxPool,
                                          2
                                        )
                                      : getFormattedNumber(
                                          this.state.bnbPool,
                                          2
                                        )}{" "}
                                    DYP
                                  </b>
                                </h6>
                              </div> */}
                            </div>
                          </div>
                          <div className="mt-4 otherside w-100">
                            <h6 className="fromtitle d-flex justify-content-between align-items-center mt-1 mb-2">
                              Deposit
                              <Tooltip
                                placement="top"
                                title={
                                  <div className="tooltip-text">
                                    {
                                      "Choose the amount of tokens you wish to convert. The conversion will be in a 1:5 ratio."
                                    }
                                  </div>
                                }
                              >
                                <img src={moreinfo} alt="" />
                              </Tooltip>
                            </h6>

                            <div className="d-flex gap-2 flex-column flex-lg-row align-items-center justify-content-between">
                              <div className="d-flex gap-2 align-items-center">
                                <input
                                  value={
                                    Number(this.state.depositAmount) > 0
                                      ? this.state.depositAmount
                                      : this.state.depositAmount
                                  }
                                  onChange={(e) => {
                                    this.setState({
                                      depositAmount: e.target.value,
                                    });
                                    this.checkAllowance(e.target.value);
                                  }}
                                  className="styledinput"
                                  placeholder="0"
                                  type="text"
                                  disabled={
                                    this.props.destinationChain !== ""
                                      ? false
                                      : true
                                  }
                                />

                                <button
                                  className="btn maxbtn"
                                  disabled={
                                    this.props.destinationChain !== ""
                                      ? false
                                      : true
                                  }
                                  style={{ cursor: "pointer" }}
                                  onClick={this.handleSetMaxDeposit}
                                >
                                  MAX
                                </button>
                              </div>

                              <button
                                style={{ width: "fit-content" }}
                                disabled={
                                  this.state.depositAmount === "" ||
                                  this.state.depositLoading === true ||
                                  this.state.depositStatus === "success"
                                    ? true
                                    : false
                                }
                                className={`btn filledbtn ${
                                  this.state.depositAmount === "" &&
                                  this.state.depositStatus === "initial" &&
                                  "disabled-btn"
                                } ${
                                  this.state.depositStatus === "deposit" ||
                                  this.state.depositStatus === "success"
                                    ? "success-button"
                                    : this.state.depositStatus === "fail"
                                    ? "fail-button"
                                    : null
                                } d-flex justify-content-center align-items-center gap-2`}
                                onClick={() => {
                                  this.props.sourceChain === "eth" &&
                                  this.state.depositStatus === "deposit"
                                    ? this.handleDeposit()
                                    : this.state.depositStatus === "deposit" &&
                                      this.props.sourceChain !== "eth"
                                    ? this.handledepositBridge()
                                    : this.state.depositStatus === "initial" &&
                                      this.props.sourceChain !== "eth" &&
                                      this.state.depositAmount !== ""
                                    ? this.handleApprove()
                                    : this.props.sourceChain === "eth" &&
                                      this.state.depositStatus === "initial"
                                    ? this.handleApproveClaim()
                                    : console.log("");
                                }}
                              >
                                {this.state.depositLoading ? (
                                  <div
                                    class="spinner-border spinner-border-sm text-light"
                                    role="status"
                                  >
                                    <span class="visually-hidden">
                                      Loading...
                                    </span>
                                  </div>
                                ) : this.state.depositStatus === "initial" &&
                                  this.props.sourceChain !== "eth" ? (
                                  <>Approve</>
                                ) : this.state.depositStatus === "deposit" &&
                                  this.props.sourceChain === "eth" ? (
                                  <>Claim</>
                                ) : this.state.depositStatus === "initial" &&
                                  this.props.sourceChain === "eth" ? (
                                  <>Approve</>
                                ) : this.state.depositStatus === "deposit" ? (
                                  <>Deposit</>
                                ) : this.state.depositStatus === "success" ? (
                                  <>Success</>
                                ) : (
                                  <>
                                    <img src={failMark} alt="" />
                                    Failed
                                  </>
                                )}
                              </button>
                            </div>
                            <p
                              style={{ fontSize: "10px" }}
                              className="mt-1 text-center mb-0"
                              id="firstPlaceholder"
                            >
                              Please approve before deposit.
                            </p>
                            {this.state.errorMsg && (
                              <h6 className="errormsg">
                                {this.state.errorMsg}
                              </h6>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img
                    src={switchicon}
                    alt=""
                    // onClick={this.handleSwapChains}
                    style={{
                      width: 55,
                      height: 55,
                      margin: "auto",
                      boxShadow: "0px 6px 12px rgba(78, 213, 210, 0.32)",
                      padding: 0,
                      borderRadius: 8,
                      // cursor: "pointer",
                      display: this.props.sourceChain === "eth" ? "none" : "",
                    }}
                  />
                  <div className="col-12 position-relative">
                    <div
                      className="purplediv"
                      style={{
                        display: this.props.sourceChain === "eth" ? "none" : "",
                      }}
                    ></div>
                    <div
                      className="l-box"
                      style={{
                        display: this.props.sourceChain === "eth" ? "none" : "",
                      }}
                    >
                      <div className="pb-0">
                        <div className="form-group">
                          <label
                            htmlFor="deposit-amount"
                            className="d-block text-left"
                          >
                            <div className="d-flex flex-column">
                              <h6 className="fromtitle mb-2">Withdraw</h6>
                              <div className="d-flex align-items-center justify-content-between gap-2">
                                <div className="d-flex align-items-center justify-content-between gap-3">
                                  <div className={"optionbtn-active"}>
                                    <h6 className="optiontext d-flex align-items-center gap-2">
                                      <img src={eth} alt="" />
                                      <p className=" mb-0 optiontext d-none d-lg-flex">
                                        Ethereum
                                      </p>
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </label>

                          <div className="mt-4 otherside w-100">
                            <h6 className="fromtitle flex-column flex-lg-row d-flex justify-content-between align-items-start align-items-lg-center mt-1 mb-2">
                              RECEIVE
                              {/* <div className="d-flex align-items-center gap-2">
                                <h6
                                  className="poolbalance-text"
                                  style={{ gap: "6px" }}
                                >
                                  {this.props.destinationChain === "bnb"
                                    ? "BNB Chain"
                                    : "Avalanche"}{" "}
                                  Pool:{" "}
                                  <b>
                                    {this.props.destinationChain === "avax"
                                      ? getFormattedNumber(
                                          this.state.avaxPool,
                                          2
                                        )
                                      : getFormattedNumber(
                                          this.state.bnbPool,
                                          2
                                        )}{" "}
                                    DYP
                                  </b>
                                </h6>

                                <Tooltip
                                  placement="top"
                                  title={
                                    <div className="tooltip-text">
                                      {
                                        " Receive the assets in the selected chain."
                                      }
                                    </div>
                                  }
                                >
                                  <img src={moreinfo} alt="" />
                                </Tooltip>
                              </div> */}
                            </h6>

                            <div className="d-flex gap-2 flex-column flex-lg-row align-items-center justify-content-between">
                              <div className="d-flex gap-2 align-items-center">
                                <input
                                  value={this.state.txHash}
                                  onChange={(e) =>
                                    this.setState({ txHash: e.target.value })
                                  }
                                  className="styledinput"
                                  placeholder="Enter Deposit tx hash"
                                  type="text"
                                  // disabled={!canWithdraw}
                                />
                              </div>

                              <button
                                style={{ width: "fit-content" }}
                                disabled={
                                  // canWithdraw === false ||
                                  // this.state.withdrawLoading === true ||
                                  // this.state.withdrawStatus === "success"
                                  //   ? true
                                  //   : false
                                  this.state.txHash !== "" ? false : true
                                }
                                className={`btn filledbtn ${
                                  (canWithdraw === false &&
                                    this.state.txHash === "") ||
                                  (this.state.withdrawStatus === "success" &&
                                    "disabled-btn")
                                } ${
                                  this.state.withdrawStatus === "deposit" ||
                                  this.state.withdrawStatus === "success"
                                    ? "success-button"
                                    : this.state.withdrawStatus === "fail"
                                    ? "fail-button"
                                    : null
                                } d-flex justify-content-center align-items-center gap-2`}
                                onClick={() => {
                                  this.handleWithdraw();
                                }}
                              >
                                {this.state.withdrawLoading ? (
                                  <div
                                    class="spinner-border spinner-border-sm text-light"
                                    role="status"
                                  >
                                    <span class="visually-hidden">
                                      Loading...
                                    </span>
                                  </div>
                                ) : this.state.withdrawStatus === "initial" ? (
                                  <>Withdraw</>
                                ) : this.state.withdrawStatus === "success" ? (
                                  <>Success</>
                                ) : (
                                  <>
                                    <img src={failMark} alt="" />
                                    Failed
                                  </>
                                )}
                                {this.state.withdrawableUnixTimestamp &&
                                  Date.now() <
                                    this.state.withdrawableUnixTimestamp *
                                      1e3 && (
                                    <span>
                                      &nbsp;
                                      <Countdown
                                        onComplete={() => this.forceUpdate()}
                                        key="withdrawable"
                                        date={
                                          this.state.withdrawableUnixTimestamp *
                                          1e3
                                        }
                                        renderer={getRenderer(undefined, true)}
                                      />
                                    </span>
                                  )}
                              </button>
                            </div>

                            <div className="separator"></div>

                            {this.state.errorMsg2 && (
                              <h6 className="errormsg">
                                {this.state.errorMsg2}
                              </h6>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.state.showWalletModal === true && (
            <WalletModal
              show={this.state.showWalletModal}
              handleClose={() => {
                this.setState({ showWalletModal: false });
              }}
              handleConnection={this.props.handleConnection}
            />
          )}
          <div className="col-6 d-none d-lg-flex guidewrapper">
            <div className="purplediv" style={{ left: "0px" }}>
              {" "}
            </div>
            <div>
              <h6 className="guidetitle">
                <img src={routeIcon} alt="" />
                Migration process guide
              </h6>
              <div className="separator"></div>
              <Timeline
                sx={{
                  [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                  },
                }}
              >
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      className={
                        this.props.isConnected === true
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.props.isConnected === true
                          ? "greenline"
                          : "passiveline"
                      }
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <h6 className="content-text">
                      <h6 className="content-title2">
                        <b>Connect wallet</b>
                      </h6>
                      Connect your wallet in order to start migration process.
                      Your wallet chain will be associated as default.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      className={
                        this.props.destinationChain !== ""
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.props.destinationChain !== ""
                          ? "greenline"
                          : "passiveline"
                      }
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <h6 className="content-text">
                      <h6 className="content-title2">
                        <b>Select chains</b>
                      </h6>
                      Select desired bridge chains at “Deposit” section. To
                      change the "FROM” chain you need to change it in your
                      wallet.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      className={
                        this.state.depositAmount !== ""
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.state.depositAmount !== ""
                          ? "greenline"
                          : "passiveline"
                      }
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <h6 className="content-text">
                      <h6 className="content-title2">
                        <b>Fill in amount</b>
                      </h6>
                      Check your balance and fill in the desired amount you want
                      to convert. You can use “Max” button to fill in the
                      maximum amount.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      className={
                        this.state.depositStatus === "deposit"
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.state.depositStatus === "deposit"
                          ? "greenline"
                          : "passiveline"
                      }
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <h6 className="content-text">
                      <h6 className="content-title2">
                        <b>
                          {" "}
                          {this.props.sourceChain === "eth"
                            ? "Approve amount to claim"
                            : "Approve deposit"}{" "}
                        </b>
                      </h6>
                      Approve the transaction and then{" "}
                      {this.props.sourceChain === "eth"
                        ? "claim your assets"
                        : " deposit the assets"}
                      . These steps need confirmation in your wallet.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                {this.props.sourceChain === "eth" ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        className={
                          this.state.depositStatus === "success" &&
                          this.props.sourceChain === "eth"
                            ? "greendot"
                            : "passivedot"
                        }
                      />
                    </TimelineSeparator>
                    <TimelineContent>
                      <h6 className="content-text">
                        <h6 className="content-title2">
                          <b>Claim new DYP token</b>
                        </h6>
                        After successful approval, you can claim your new DYP
                        token. Check your wallet after tx has been approved.
                      </h6>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        className={
                          canWithdraw === true ? "greendot" : "passivedot"
                        }
                      />
                    </TimelineSeparator>
                    <TimelineContent>
                      <h6 className="content-text">
                        <h6 className="content-title2">
                          <b>
                            {
                              "Switch to destination chain. Wait timer & withdraw"
                            }
                          </b>
                        </h6>
                        Firstly go to your wallet and switch into the chain you
                        want to withdraw from. Wait for the timer to end and and
                        click withdraw button to receive the assets in the
                        desired chain.
                      </h6>
                    </TimelineContent>
                  </TimelineItem>
                )}
              </Timeline>
            </div>
          </div>
        </div>
      );
    }
  }

  return Migration;
}
