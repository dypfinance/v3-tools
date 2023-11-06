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
import migrationIcon from "./assets/migrationIcon.svg";
import infoIcon from "./assets/infoIcon.svg";
import dypIcon from "./assets/dypIcon.svg";
import downArrow from "./assets/downArrow.svg";
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
        token_balance: 0,
        network: "BSC",
        depositAmount: 1,
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
        ethBalance: 0,
        bnbBalance: 0,
        avaxBalance: 0,
        destinationChain: "",
      };
    }
    static propTypes = {
      match: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
    };
    componentDidMount() {
      this.refreshBalance();
      this.getAllBalance();
      this.checkNetworkId();
      window._refreshBalInterval = setInterval(this.refreshBalance, 4000);
    }

    componentWillUnmount() {
      clearInterval(window._refreshBalInterval);
    }

    checkNetworkId = async () => {
      if (window.ethereum) {
        await window.ethereum
          .request({ method: "eth_chainId" })
          .then((data) => {
            console.log(data);
            if (data === "0x1") {
              this.setState({
                destinationChain: "eth",
              });
            }
          });
      }
    };

    checkAllowance = async (amount) => {
      if (this.props.sourceChain === "eth") {
        const oldDyp_address = window.config.token_old_address;
        const claimDyp_address = window.config.claim_newdyp_eth_address;
        const token_contract = new window.infuraWeb3.eth.Contract(
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

      amount = new BigNumber(amount).times(10 ** TOKEN_DECIMALS).toFixed(0);
      let bridge =
        this.props.sourceChain === "bsc"
          ? window.config.bridge_bsc_new_address
          : window.config.bridge_avax_new_address;

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
      let bridge =
        this.props.sourceChain === "bsc"
          ? window.config.bridge_bsc_new_address
          : window.config.bridge_avax_new_address;
      let chainId = this.props.networkId;
      const web3 = new Web3(window.ethereum);

      if (chainId !== undefined) {
        let contract = new web3.eth.Contract(window.NEW_BRIDGE_ABI, bridge);

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

    switchToEthereum = async () => {
      if (window.ethereum) {
        await window.ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: "0x1",
              },
            ],
          })
          .then((data) => {
            this.setState({ destinationChain: "eth" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    getAllBalance = async () => {
      const tokenAddress = window.config.token_old_address;
      const tokenAddress_bsc = window.config.token_old_bsc_address;
      const tokenAddress_avax = window.config.token_old_avax_address;

      const walletAddress = this.props.coinbase;
      const TokenABI = window.ERC20_ABI;

      if (walletAddress != undefined) {
        const contract1 = new window.infuraWeb3.eth.Contract(
          TokenABI,
          tokenAddress
        );
        const contract2 = new window.bscWeb3.eth.Contract(
          TokenABI,
          tokenAddress_bsc
        );
        const contract3 = new window.avaxWeb3.eth.Contract(
          TokenABI,
          tokenAddress_avax
        );

        await contract2.methods
          .balanceOf(walletAddress)
          .call()
          .then((data) => {
            this.setState({ bnbBalance: data });
          });

        await contract1.methods
          .balanceOf(walletAddress)
          .call()
          .then((data) => {
            this.setState({ ethBalance: data });
          });

        await contract3.methods
          .balanceOf(walletAddress)
          .call()
          .then((data) => {
            this.setState({ avaxBalance: data });
          });
      }
    };

    handleWithdraw = async (e) => {
      this.setState({ withdrawLoading: true });
      try {
        let signature =
          this.props.sourceChain === "bnb"
            ? window.config.SIGNATURE_API_URL_NEW_BSC
            : window.config.SIGNATURE_API_URL_NEW_AVAX;
        let url =
          signature +
          `/api/withdraw-args?depositNetwork=${
            this.props.sourceChain === "bnb"
              ? "BSC"
              : this.props.sourceChain === "avax"
              ? "BSC"
              : "BSC"
          }&txHash=${this.state.txHash}`;
        console.log({ url });
        let args = await window.jQuery.get(url);
        console.log({ args });
        const bridge =
          this.props.sourceChain === "bnb"
            ? window.newbridge_eth_bsc
            : window.newbridge_eth_avax;

        bridge
          .withdraw(args)
          .then(() => {
            this.setState({
              withdrawLoading: false,
              withdrawStatus: "success",
            });
            this.getAllBalance();
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
        this.setState({ withdrawLoading: false, withdrawStatus: "fail" });
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
        // let coinbase = this.props.coinbase;
        // this.setState({ coinbase });
        try {
          const tokenAddress = window.config.token_old_address;
          const tokenAddress_bsc = window.config.token_old_bsc_address;
          const tokenAddress_avax = window.config.token_old_avax_address;

          if (this.props.sourceChain === "eth") {
            const token_contract_eth = new window.infuraWeb3.eth.Contract(
              window.TOKEN_ABI,
              tokenAddress
            );
            await token_contract_eth.methods
              .balanceOf(this.props.coinbase)
              .call()
              .then((data) => {
                this.setState({ token_balance: data });
              });
          } else if (this.props.sourceChain === "bnb") {
            const token_contract_bsc = new window.bscWeb3.eth.Contract(
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
            const token_contract_avax = new window.avaxWeb3.eth.Contract(
              window.TOKEN_ABI,
              tokenAddress_avax
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
              let signature =
                this.props.sourceChain === "bnb"
                  ? window.config.SIGNATURE_API_URL_NEW_BSC
                  : window.config.SIGNATURE_API_URL_NEW_AVAX;
              let url =
                signature +
                `/api/withdraw-args?depositNetwork=${
                  this.props.sourceChain === "bnb"
                    ? "BSC"
                    : this.props.sourceChain === "avax"
                    ? "BSC"
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
                  {/* <h6 className="fromtitle mb-2">Deposit</h6> */}
                  <div className="d-flex align-items-end justify-content-between mb-3">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <img src={migrationIcon} alt="" />
                        <h6 className="migration-title">DYP Migration</h6>
                      </div>
                      <span className="migration-span">
                        Migrate your DYP tokens to the new DYP v2 tokens.
                      </span>
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
                  <hr className="migration-divider" />
                  <span className="fromtitle mb-2">Select Chain</span>
                  <div className="d-flex flex-column flex-lg-row align-items-center  justify-content-between gap-2">
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
                  </div>
                  <div className="conversion-rate-wrapper d-flex align-items-center my-3 justify-content-between p-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="conversion-rate-title">
                        Conversion Rate:
                      </span>
                      <span className="conversion-rate">
                        1 DYP (old) ={" "}
                        {this.props.sourceChain === "eth" ? "6" : "1"} DYP (new)
                      </span>
                    </div>
                    <img src={infoIcon} alt="" />
                  </div>
                  <hr className="migration-divider" />
                </div>
                <span className="fromtitle mt-3">Deposit</span>
                <div className="otherside my-2 w-100 p-3">
                  <div className="d-flex flex-column">
                    <div
                      className="d-flex w-100 flex-column align-items-center justify-content-center gap-2
                    "
                    >
                      <div className="d-flex flex-column w-100">
                        <span className="conversion-rate-title">
                          My Balance:{" "}
                          {this.props.sourceChain === "avax"
                            ? getFormattedNumber(
                                this.state.avaxBalance / 1e18,
                                2
                              )
                            : this.props.sourceChain === "eth"
                            ? getFormattedNumber(
                                this.state.ethBalance / 1e18,
                                2
                              )
                            : getFormattedNumber(
                                this.state.bnbBalance / 1e18,
                                2
                              )}
                          DYP
                        </span>
                        <div className="conversion-input-container p-2 d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <img src={dypIcon} alt="" />
                            <input
                              type="number"
                              className="conversion-input"
                              onChange={(e) => {
                                this.setState({
                                  depositAmount: e.target.value,
                                });
                                this.checkAllowance(e.target.value);
                              }}
                              value={
                                this.state.depositAmount === ""
                                  ? this.state.depositAmount
                                  : Number(this.state.depositAmount)
                              }
                              disabled={
                                this.props.destinationChain !== ""
                                  ? false
                                  : true
                              }
                              placeholder={"0.0"}
                            />
                          </div>
                          <div className="d-flex align-items-center gap-2">
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
                            <span className="conversion-rate">DYP (old)</span>
                          </div>
                        </div>
                      </div>
                      <img
                        src={downArrow}
                        style={{ position: "relative", top: "5px" }}
                        alt=""
                      />
                      <div className="d-flex flex-column w-100">
                        <span className="conversion-rate-title">
                          You will recieve:
                        </span>
                        <div className="conversion-input-container p-2 d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <img src={dypIcon} alt="" />
                            <input
                              type="number"
                              className="conversion-input"
                              value={
                                this.props.sourceChain === "eth"
                                  ? 6 * this.state.depositAmount
                                  : this.state.depositAmount
                              }
                              disabled
                            />
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="conversion-rate">DYP (new)</span>
                          </div>
                        </div>
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
                            <span class="visually-hidden">Loading...</span>
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
                  </div>
                </div>
                {this.state.sourceChain !== "eth" && (
                  <>
                    <span className="fromtitle">Withdraw</span>
                    <div className="otherside mt-2 w-100 p-3">
                      <div className="d-flex align-items-end justify-content-between">
                        <div className="d-flex flex-column w-50">
                          <span className="conversion-rate-title">
                            Recieve new DYP on Ethereum
                          </span>
                          <input
                            value={this.state.txHash}
                            onChange={(e) =>
                              this.setState({ txHash: e.target.value })
                            }
                            className="styledinput w-100"
                            placeholder="Enter deposit transaction hash"
                            type="text"
                            disabled={
                              this.props.destinationChain !== "" ? false : true
                            }
                          />
                        </div>
                        <button
                          style={{ width: "fit-content" }}
                          disabled={
                            this.state.withdrawLoading === true ||
                            this.state.txHash === "" ||
                            this.state.withdrawStatus === "success"
                              ? true
                              : false
                            //  ? false : true
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
                            this.state.destinationChain === "eth"
                              ? this.handleWithdraw()
                              : this.switchToEthereum();
                          }}
                        >
                          {this.state.withdrawLoading ? (
                            <div
                              class="spinner-border spinner-border-sm text-light"
                              role="status"
                            >
                              <span class="visually-hidden">Loading...</span>
                            </div>
                          ) : this.state.withdrawStatus === "initial" &&
                            this.state.destinationChain === "eth" &&
                            this.state.txHash !== "" ? (
                            <>Withdraw</>
                          ) : this.state.withdrawStatus === "initial" &&
                          this.state.txHash === "" ? (
                          <>Withdraw</>
                        ) : this.state.withdrawStatus === "initial" &&
                            
                            this.state.destinationChain !== "eth" ? (
                            <>Switch to Ethereum</>
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
                              this.state.withdrawableUnixTimestamp * 1e3 && (
                              <span>
                                &nbsp;
                                <Countdown
                                  onComplete={() => this.forceUpdate()}
                                  key="withdrawable"
                                  date={
                                    this.state.withdrawableUnixTimestamp * 1e3
                                  }
                                  renderer={getRenderer(undefined, true)}
                                />
                              </span>
                            )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
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
                        this.props.destinationChain !== "" &&
                        this.props.isConnected === true
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.props.destinationChain !== "" &&
                        this.props.isConnected === true
                          ? "greenline"
                          : "passiveline"
                      }
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <h6 className="content-text">
                      <h6 className="content-title2">
                        <b>Select chain</b>
                      </h6>
                      Select the chain of your DYP tokens that you want to
                      migrate.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      className={
                        this.state.depositAmount !== "" &&
                        this.props.isConnected === true
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.state.depositAmount !== "" &&
                        this.props.isConnected === true
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
                        this.state.depositStatus === "deposit" ||
                        this.state.depositStatus === "success"
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.state.depositStatus === "deposit" ||
                        this.state.depositStatus === "success"
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
                      Approve the transaction and then claim your assets. These
                      steps need confirmation in your wallet.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                {this.props.sourceChain !== "eth" && (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        className={
                          this.state.depositStatus === "success"
                            ? "greendot"
                            : "passivedot"
                        }
                      />
                      <TimelineConnector
                        className={
                          this.state.depositStatus === "success"
                            ? "greenline"
                            : "passiveline"
                        }
                      />
                    </TimelineSeparator>
                    <TimelineContent>
                      <h6 className="content-text">
                        <h6 className="content-title2">
                          <b>Deposit tokens</b>
                        </h6>
                        Deposit your DYP tokens into the bridge contract. These
                        step needs confirmation in your wallet.
                      </h6>
                    </TimelineContent>
                  </TimelineItem>
                )}
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
                        token. Check your wallet after the transaction has been
                        approved.
                      </h6>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        className={
                          canWithdraw === true &&
                          this.state.destinationChain === "eth"
                            ? "greendot"
                            : "passivedot"
                        }
                      />
                    </TimelineSeparator>
                    <TimelineContent>
                      <h6 className="content-text">
                        <h6 className="content-title2">
                          <b>
                            {
                              "Switch to Ethereum network. Wait timer & withdraw"
                            }
                          </b>
                        </h6>
                        Firstly go to your wallet and switch into Ethereum network. Wait for the timer to end and and
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

{
  /* <div className="row token-staking-form gap-3">
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
                        this.state.avaxBalance / 1e18,
                        2
                      )
                    : this.props.sourceChain === "eth"
                    ? getFormattedNumber(
                        this.state.ethBalance / 1e18,
                        2
                      )
                    : getFormattedNumber(
                        this.state.bnbBalance / 1e18,
                        2
                      )}
                </b>
                DYP
              </h6>
            </label>
            <div className="">
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
            </div>
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
  onClick={this.handleSwapChains}
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
            <div className="d-flex align-items-center gap-2">
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
            </div>
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
                canWithdraw === false ||
                this.state.withdrawLoading === true ||
                this.state.withdrawStatus === "success"
                  ? true
                  : false
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
</div> */
}
