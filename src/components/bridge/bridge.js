import React from "react";
import getFormattedNumber from "../../functions/get-formatted-number";
import Countdown from "react-countdown";
import "./bridge.css";

import Tooltip from "@material-ui/core/Tooltip";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Address from "../FARMINNG/address";
import WalletModal from "../WalletModal";

import Web3 from "web3";
import { ethers } from "ethers";

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

export default function initBridge({
  bridgeETH,
  bridgeBSC,
  tokenETH,
  tokenBSC,
  TOKEN_DECIMALS = 18,
  TOKEN_SYMBOL = "DYP",
  binanceW3WProvider,
  library,
  binanceConnector,
}) {
  let { BigNumber } = window;

  class Bridge extends React.Component {
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
        ethPool: "0",
        avaxPool: "0",
        bnbPool: "0",
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
        opbnbBalance: 0,
        destinationChainText: "",
      };
    }

    componentDidMount() {
      this.refreshBalance();
      this.getChainSymbol();
      this.getAllBalance();
      this.fetchData();
      this.checkNetworkId();
      window._refreshBalInterval = setInterval(this.refreshBalance, 4000);
      window._refreshBalInterval = setInterval(this.getChainSymbol, 500);
    }

    checkNetworkId = async () => {
      if (window.WALLET_TYPE === "binance") {
        let binanceData = JSON.parse(localStorage.getItem("connect-session"));
        if (binanceData !== undefined && binanceData !== null) {
          if (binanceData.chainId.toString() === "0x1") {
            this.setState({
              destinationChainText: "eth",
            });
          } else if (binanceData.chainId.toString() === "0xa86a") {
            this.setState({
              destinationChainText: "avax",
            });
          } else if (binanceData.chainId.toString() === "0x38") {
            this.setState({
              destinationChainText: "bnb",
            });
          } else if (binanceData.chainId.toString() === "0xcc") {
            this.setState({
              destinationChainText: "opbnb",
            });
          } else {
            this.setState({
              destinationChainText: "",
            });
          }
        }
      } else if (window.ethereum) {
        await window.ethereum
          .request({ method: "eth_chainId" })
          .then((data) => {
            console.log("data", data);
            if (data === "0x1") {
              this.setState({
                destinationChainText: "eth",
              });
            } else if (data === "0xa86a") {
              this.setState({
                destinationChainText: "avax",
              });
            } else if (data === "0x38") {
              this.setState({
                destinationChainText: "bnb",
              });
            } else if (data === "0xcc") {
              this.setState({
                destinationChainText: "opbnb",
              });
            } else {
              this.setState({
                destinationChainText: "",
              });
            }
          });
      }
    };

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.sourceChain != this.props.sourceChain) {
        this.checkNetworkId();
      }
    }

    componentWillUnmount() {
      clearInterval(window._refreshBalInterval);
    }

    fetchData = async () => {
      //Get DYP Balance Ethereum Pool
      let ethPool = await window.getTokenHolderBalanceAll(
        this.props.sourceChain === "avax" ||
          this.props.sourceChain === "bnb" ||
          this.props.sourceChain === "opbnb"
          ? bridgeBSC._address
          : bridgeETH._address,
        this.props.sourceChain === "avax" ||
          this.props.sourceChain === "bnb" ||
          this.props.sourceChain === "opbnb"
          ? bridgeBSC.tokenAddress
          : bridgeETH.tokenAddress,
        1
      );

      ethPool = ethPool / 1e18;
      this.setState({ ethPool: ethPool });
 
    };
    checkApproval = async (amount) => {
      if (this.props.coinbase) {
        const result = await window
          .checkapproveStakePool(
            this.props.coinbase,
            tokenETH._address,
            bridgeETH._address
          )
          .then((data) => {
            console.log(data);
            return data;
          });

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
    handleApprove = async (e) => {
      this.setState({ depositLoading: true });
      let amount = this.state.depositAmount;
      amount = new BigNumber(amount).times(10 ** TOKEN_DECIMALS).toFixed(0);
      let bridge = bridgeETH;

      if (window.WALLET_TYPE !== "binance") {
        tokenETH
          .approve(bridge._address, amount)
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
      } else if (window.WALLET_TYPE === "binance") {
        let reward_token_Sc = new ethers.Contract(
          tokenETH._address,
          window.TOKEN_ABI,
          binanceW3WProvider.getSigner()
        );
        const txResponse = await reward_token_Sc
          .approve(bridge._address, amount)
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
        const txReceipt = await txResponse.wait();
        if (txReceipt) {
          this.setState({ depositLoading: false, depositStatus: "deposit" });
        }
      }
    };

    handleDeposit = async (e) => {
      let amount = this.state.depositAmount;
      this.setState({ depositLoading: true });
      this.checkNetworkId();

      amount = new BigNumber(amount).times(10 ** TOKEN_DECIMALS).toFixed(0);
      let bridge = bridgeETH;
      let chainId = this.props.networkId;
      if (window.WALLET_TYPE !== "binance") {
        const web3 = new Web3(window.ethereum);

        if (chainId !== undefined) {
          let contract = new web3.eth.Contract(
            window.NEW_BRIDGE_ABI,
            bridge._address
          );
          contract.methods
            .deposit(amount)
            .send({ from: await window.getCoinbase() }, (err, txHash) => {
              this.setState({ txHash });
            })
            .then(() => {
              this.setState({
                depositLoading: false,
                depositStatus: "success",
              });
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
      } else if (window.WALLET_TYPE === "binance") {
        if (chainId !== undefined) {
          let contract_binance = new ethers.Contract(
            bridge._address,
            window.NEW_BRIDGE_ABI,
            binanceW3WProvider.getSigner()
          );

          const txResponse = await contract_binance
            .deposit(amount)
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

          const txReceipt = await txResponse.wait();
          if (txReceipt) {
            this.setState({
              depositLoading: false,
              depositStatus: "success",
              txHash: txResponse.hash,
            });
            this.refreshBalance();
          }
        }
      }
    };

    handleWithdraw = async (e) => {
      this.setState({ withdrawLoading: true });

      try {
        let signature =
          (this.props.sourceChain === "eth" &&
            this.props.destinationChain === "avax") ||
          (this.props.sourceChain === "avax" &&
            this.props.destinationChain === "eth")
            ? window.config.SIGNATURE_APIBRIDGE_AVAX_URL_NEW
            : (this.props.sourceChain === "eth" &&
                this.props.destinationChain === "opbnb") ||
              (this.props.sourceChain === "opbnb" &&
                this.props.destinationChain === "eth")
            ? window.config.SIGNATURE_APIBRIDGE_OPBNB_URL_NEW
            : window.config.SIGNATURE_APIBRIDGE_BSC_URL_NEW;
        let url =
          signature +
          `/api/withdraw-args?depositNetwork=${
            this.props.sourceChain === "bnb" ||
            this.props.sourceChain === "opbnb"
              ? "BSC"
              : this.props.sourceChain === "eth"
              ? "ETH"
              : "BSC"
          }&txHash=${this.state.txHash}`;
        console.log({ url });
        // let args = await window.jQuery.get(url);
        let args = await fetch(url)
          .then((response) => response.json())
          .then((data) => {
            return data;
          })
          .catch((error) => console.error("Error:", error));
        console.log({ args }, "withdraw");
        let bridge = bridgeBSC;
        if (window.WALLET_TYPE !== "binance") {
          bridge
            .withdraw(args)
            .then(() => {
              this.setState({
                withdrawLoading: false,
                withdrawStatus: "success",
              });
              this.getAllBalance();
              this.refreshBalance();
              window.alertify.message(
                "Congratulations on successfully withdrawing your new DYP tokens!"
              );
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
        } else if (window.WALLET_TYPE === "binance") {
          let contract_binance = new ethers.Contract(
            bridgeBSC._address,
            window.NEW_BRIDGE_ABI,
            binanceW3WProvider.getSigner()
          );
          if (args && args.length === 4) {
            console.log("yes", args);
            const txResponse = await contract_binance
              .withdraw(...args)
              .catch((e) => {
                this.setState({
                  withdrawLoading: false,
                  withdrawStatus: "fail",
                });
                this.setState({ errorMsg2: e?.message });
                setTimeout(() => {
                  this.setState({
                    withdrawStatus: "initial",
                    withdrawAmount: "",
                    errorMsg2: "",
                  });
                }, 8000);
              });

            const txReceipt = await txResponse.wait();
            if (txReceipt) {
              this.setState({
                withdrawLoading: false,
                withdrawStatus: "success",
              });
              this.getAllBalance();
              this.refreshBalance();
              window.alertify.message(
                "Congratulations on successfully withdrawing your new DYP tokens!"
              );
            }
          }
        }
      } catch (e) {
        window.alertify.error("Something went wrong!");
        console.error(e);
      }
    };

    switchToDestinationChain = async (chainID, chainText) => {
      const OPBNBPARAMS = {
        chainId: "0xcc", // A 0x-prefixed hexadecimal string
        rpcUrls: ["https://opbnb.publicnode.com"],
        chainName: "opBNB Mainnet",
        nativeCurrency: {
          name: "opBNB",
          symbol: "BNB", // 2-6 characters long
          decimals: 18,
        },

        blockExplorerUrls: ["https://mainnet.opbnbscan.com"],
      };

      const AVAXPARAMS = {
        chainId: "0xa86a", // A 0x-prefixed hexadecimal string
        chainName: "Avalanche Network",
        nativeCurrency: {
          name: "Avalanche",
          symbol: "AVAX", // 2-6 characters long
          decimals: 18,
        },
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://snowtrace.io/"],
      };

      const ETHPARAMS = {
        chainId: "0x1", // A 0x-prefixed hexadecimal string
        chainName: "Ethereum Mainnet",
        nativeCurrency: {
          name: "Ethereum",
          symbol: "ETH", // 2-6 characters long
          decimals: 18,
        },
        rpcUrls: ["https://mainnet.infura.io/v3/"],
        blockExplorerUrls: ["https://etherscan.io"],
      };

      const BNBPARAMS = {
        chainId: "0x38", // A 0x-prefixed hexadecimal string
        chainName: "Smart Chain",
        nativeCurrency: {
          name: "Smart Chain",
          symbol: "BNB", // 2-6 characters long
          decimals: 18,
        },
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ["https://bscscan.com"],
      };
      if (window.WALLET_TYPE === "binance") {
        try {
          await binanceConnector.binanceW3WProvider
            .request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: chainID,
                },
              ],
            })
            .then(async () => {
              this.setState({ destinationChainText: chainText });
            })
            .catch((e) => {
              console.error(e);
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
                params: [
                  chainID === "0x1"
                    ? ETHPARAMS
                    : chainID === "0xa86a"
                    ? AVAXPARAMS
                    : chainID === "0x38"
                    ? BNBPARAMS
                    : chainID === "0xcc"
                    ? OPBNBPARAMS
                    : OPBNBPARAMS,
                ],
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
      } else {
        if (window.ethereum) {
          await window.ethereum
            .request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: chainID,
                },
              ],
            })
            .then((data) => {
              this.setState({ destinationChainText: chainText });
            })
            .catch(async (err) => {
              if (
                err.code === 4902 ||
                (chainID === "0xcc" && err.code.toString().includes("32603")) ||
                (chainID === "0x38" && err.code.toString().includes("32603")) ||
                (chainID === "0xa86a" && err.code.toString().includes("32603"))
              ) {
                await window.ethereum
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      chainID === "0x1"
                        ? ETHPARAMS
                        : chainID === "0xa86a"
                        ? AVAXPARAMS
                        : chainID === "0x38"
                        ? BNBPARAMS
                        : chainID === "0xcc"
                        ? OPBNBPARAMS
                        : OPBNBPARAMS,
                    ],
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              }
              console.log(err);
            });
        }
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
          const tokenAddress = window.config.token_dypius_new_address;
          const tokenAddress_bsc = window.config.token_dypius_new_bsc_address;
          const tokenAddress_avax = window.config.token_dypius_new_avax_address;
          const tokenAddress_opbnb =
            window.config.token_dypius_new_opbnb_address;

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
              })
              .catch((e) => {
                console.error(e);
                return 0;
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
              })
              .catch((e) => {
                console.error(e);
                return 0;
              });
          } else if (this.props.sourceChain === "opbnb") {
            const token_contract_opbnb = new window.opbnbWeb3.eth.Contract(
              window.TOKENBSC_ABI,
              tokenAddress_opbnb
            );
            await token_contract_opbnb.methods
              .balanceOf(this.props.coinbase)
              .call()
              .then((data) => {
                this.setState({ token_balance: data });
              })
              .catch((e) => {
                console.error(e);
                return 0;
              });
          } else if (this.props.sourceChain === "avax") {
            const token_contract_avax = new window.avaxWeb3.eth.Contract(
              window.TOKENAVAX_ABI,
              tokenAddress_avax
            );
            await token_contract_avax.methods
              .balanceOf(this.props.coinbase)
              .call()
              .then((data) => {
                this.setState({ token_balance: data });
              })
              .catch((e) => {
                console.error(e);
                return 0;
              });
          }
          if (this.state.txHash) {
            try {
              let signature =
                (this.props.sourceChain === "eth" &&
                  this.props.destinationChain === "avax") ||
                (this.props.sourceChain === "avax" &&
                  this.props.destinationChain === "eth")
                  ? window.config.SIGNATURE_APIBRIDGE_AVAX_URL_NEW
                  : (this.props.sourceChain === "eth" &&
                      this.props.destinationChain === "opbnb") ||
                    (this.props.sourceChain === "opbnb" &&
                      this.props.destinationChain === "eth")
                  ? window.config.SIGNATURE_APIBRIDGE_OPBNB_URL_NEW
                  : window.config.SIGNATURE_APIBRIDGE_BSC_URL_NEW;
              let url =
                signature +
                `/api/withdraw-args?depositNetwork=${
                  this.props.sourceChain === "bnb" ||
                  this.props.sourceChain === "opbnb"
                    ? "BSC"
                    : this.props.sourceChain === "eth"
                    ? "ETH"
                    : "BSC"
                }&txHash=${
                  this.state.txHash
                }&getWithdrawableUnixTimestamp=true`;
              console.log({ url });
              let { withdrawableUnixTimestamp } = await window.jQuery
                .get(url)
                .catch((e) => {
                  console.error(e);
                  return 0;
                });
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

    getAllBalance = async () => {
      const tokenAddress = window.config.token_dypius_new_address;
      const tokenAddress_bsc = window.config.token_dypius_new_bsc_address;
      const tokenAddress_avax = window.config.token_dypius_new_avax_address;
      const tokenAddress_opbnb = window.config.token_dypius_new_opbnb_address;

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
        const contract4 = new window.opbnbWeb3.eth.Contract(
          TokenABI,
          tokenAddress_opbnb
        );
        if (this.props.sourceChain === "eth") {
          await contract1.methods
            .balanceOf(walletAddress)
            .call()
            .then((data) => {
              this.setState({ ethBalance: data });
            })
            .catch((e) => {
              console.error(e);
              return 0;
            });
        } else if (this.props.sourceChain === "bnb") {
          await contract2.methods
            .balanceOf(walletAddress)
            .call()
            .then((data) => {
              this.setState({ bnbBalance: data });
            })
            .catch((e) => {
              console.error(e);
              return 0;
            });
        } else if (this.props.sourceChain === "opbnb") {
          await contract4.methods
            .balanceOf(walletAddress)
            .call()
            .then((data) => {
              this.setState({ opbnbBalance: data });
            })
            .catch((e) => {
              console.error(e);
              return 0;
            });
        } else if (this.props.sourceChain === "avax") {
          await contract3.methods
            .balanceOf(walletAddress)
            .call()
            .then((data) => {
              this.setState({ avaxBalance: data });
            })
            .catch((e) => {
              console.error(e);
              return 0;
            });
        }
      }
    };

    getChainSymbol = async () => {
      try {
        let chainId = this.props.networkId;
        if (chainId === 43114) this.setState({ chainText: "AVAX" });
        else if (chainId === 56) this.setState({ chainText: "BSC" });
        else if (chainId === 204) this.setState({ chainText: "OPBNB" });
        else if (chainId === 1) this.setState({ chainText: "ETH" });
        else {
          this.setState({ chainText: "" });
        }
      } catch (err) {
        this.setState({ chainText: "ETH" });
        // console.log(err);
      }
    };

    handleSwapChains = () => {
      // if (this.props.activebtn === "1") {
      //   if (this.props.sourceChain === "bnb") {
      //     this.props.onSelectChain("bnb");
      //     this.props.onSelectSourceChain("avax");
      //   } else if (this.props.sourceChain === "avax") {
      //     this.props.onSelectChain("avax");
      //     this.props.onSelectSourceChain("bnb");
      //   }
      // } else if (this.props.activebtn === "2") {
      //   if (this.props.sourceChain === "eth") {
      //     this.props.onSelectChain("eth");
      //     this.props.onSelectSourceChain("avax");
      //   } else if (this.props.sourceChain === "avax") {
      //     this.props.onSelectChain("avax");
      //     this.props.onSelectSourceChain("eth");
      //   }
      // }
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
          <div className="token-staking col-12 col-lg-6 col-xxl-5">
            <div className="purplediv"></div>
            <div className="row">
              <div>
                <div className="d-flex flex-column">
                  {/* <h6 className="fromtitle mb-2">Deposit</h6> */}
                  <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center justify-content-between gap-3">
                      <div
                        className={
                          this.props.sourceChain === "eth"
                            ? "optionbtn-active"
                            : "optionbtn-passive bridge-passive"
                        }
                        onClick={() => {
                          this.setState({
                            sourceChain: "eth",
                          });
                          this.props.onSelectSourceChain("eth");
                          this.props.onSelectChain(
                            this.props.activebtn !== "2" &&
                              this.props.activebtn !== "8"
                              ? "bnb"
                              : this.props.activebtn === "8"
                              ? "opbnb"
                              : "avax"
                          );
                        }}
                      >
                        <h6 className="optiontext d-flex align-items-center gap-2">
                          <img
                            src={
                              "https://cdn.worldofdypians.com/tools/ethSquare.svg"
                            }
                            alt=""
                          />
                          <p className=" mb-0 optiontext d-none d-lg-flex">
                            Ethereum
                          </p>
                        </h6>
                      </div>

                      {this.props.activebtn !== "2" &&
                        this.props.activebtn !== "8" && (
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
                              this.props.onSelectChain("eth");
                            }}
                          >
                            <h6 className="optiontext d-flex align-items-center gap-2">
                              <img
                                src={
                                  "https://cdn.worldofdypians.com/tools/bnbSquare.svg"
                                }
                                alt=""
                              />
                              <p className=" mb-0 optiontext d-none d-lg-flex">
                                BNB Chain
                              </p>
                            </h6>
                          </div>
                        )}
                      {this.props.activebtn === "2" && (
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
                            this.props.onSelectChain("eth");
                          }}
                        >
                          <h6 className="optiontext d-flex align-items-center gap-2">
                            <img
                              src={
                                "https://cdn.worldofdypians.com/tools/avaxSquare.svg"
                              }
                              alt=""
                            />
                            <p className=" mb-0 optiontext d-none d-lg-flex">
                              Avalanche
                            </p>
                          </h6>
                        </div>
                      )}
                      {this.props.activebtn === "8" && (
                        <div
                          className={
                            this.props.sourceChain === "opbnb"
                              ? "optionbtn-active"
                              : "optionbtn-passive bridge-passive"
                          }
                          onClick={() => {
                            this.setState({
                              sourceChain: "opbnb",
                            });
                            this.props.onSelectSourceChain("opbnb");
                            this.props.onSelectChain("eth");
                          }}
                        >
                          <h6 className="optiontext d-flex align-items-center gap-2">
                            <img
                              src={
                                "https://cdn.worldofdypians.com/tools/bnbSquare.svg"
                              }
                              alt=""
                            />
                            <p className=" mb-0 optiontext d-none d-lg-flex">
                              opBNB Chain
                            </p>
                          </h6>
                        </div>
                      )}
                    </div>
                    {this.props.isConnected === false ? (
                      <button
                        className="connectbtn btn d-flex align-items-center gap-2"
                        style={{ width: "fit-content" }}
                        onClick={() => {
                          this.setState({ showWalletModal: true });
                        }}
                      >
                        <img
                          src={
                            "https://cdn.worldofdypians.com/tools/walletIcon.svg"
                          }
                          alt=""
                          style={{ height: 20, width: 20 }}
                        />
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
                      <form onSubmit={(e) => e.preventDefault()}>
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
                                    {this.props.sourceChain === "eth"
                                      ? getFormattedNumber(
                                          this.state.ethBalance / 1e18,
                                          2
                                        )
                                      : this.props.sourceChain === "avax"
                                      ? getFormattedNumber(
                                          this.state.avaxBalance / 1e18,
                                          2
                                        )
                                      : this.props.sourceChain === "opbnb"
                                      ? getFormattedNumber(
                                          this.state.opbnbBalance / 1e18,
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
                                  Ethereum Pool:{" "}
                                  <b>
                                    {
                                      // this.props.sourceChain === "bnb"
                                      //   ? getFormattedNumber(
                                      //       this.state.bnbPool,
                                      //       2
                                      //     )
                                      //   : this.props.sourceChain === "avax"
                                      //   ? getFormattedNumber(
                                      //       this.state.avaxPool,
                                      //       2
                                      //     )
                                      //   :
                                      getFormattedNumber(this.state.ethPool, 2)
                                    }{" "}
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
                                      "Deposit your assets to bridge smart contract."
                                    }
                                  </div>
                                }
                              >
                                <img
                                  src={
                                    "https://cdn.worldofdypians.com/tools/more-info.svg"
                                  }
                                  alt=""
                                />
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
                                    this.checkApproval(e.target.value);
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
                                  this.state.depositStatus === "deposit"
                                    ? this.handleDeposit()
                                    : this.state.depositStatus === "initial" &&
                                      this.state.depositAmount !== ""
                                    ? this.handleApprove()
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
                                ) : this.state.depositStatus === "initial" ? (
                                  <>Approve</>
                                ) : this.state.depositStatus === "deposit" ? (
                                  <>Deposit</>
                                ) : this.state.depositStatus === "success" ? (
                                  <>Success</>
                                ) : (
                                  <>
                                    <img
                                      src={
                                        "https://cdn.worldofdypians.com/wod/failMark.svg"
                                      }
                                      alt=""
                                    />
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
                      </form>
                    </div>
                  </div>
                  <img
                    src={"https://cdn.worldofdypians.com/tools/switch.svg"}
                    alt=""
                    onClick={this.handleSwapChains}
                    style={{
                      width: 55,
                      height: 55,
                      margin: "auto",
                      boxShadow: "0px 6px 12px rgba(78, 213, 210, 0.32)",
                      padding: 0,
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  />
                  <div className="col-12">
                    <div className="purplediv"></div>
                    <div className="l-box">
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
                                  <div
                                    className={
                                      this.props.destinationChain === "eth"
                                        ? "optionbtn-active"
                                        : "optionbtn-passive bridge-passive"
                                    }
                                    onClick={() => {
                                      // this.props.onSelectChain("avax");
                                    }}
                                    style={{
                                      pointerEvents:
                                        this.props.networkId === 1 ||
                                        this.props.networkId === 56
                                          ? "none"
                                          : "auto",
                                    }}
                                  >
                                    <h6 className="optiontext d-flex align-items-center gap-2">
                                      <img
                                        src={
                                          "https://cdn.worldofdypians.com/tools/ethSquare.svg"
                                        }
                                        alt=""
                                      />
                                      <p className=" mb-0 optiontext d-none d-lg-flex">
                                        Ethereum
                                      </p>
                                    </h6>
                                  </div>
                                  {this.props.activebtn !== "2" &&
                                    this.props.activebtn !== "8" && (
                                      <div
                                        className={
                                          this.props.destinationChain === "bnb"
                                            ? "optionbtn-active"
                                            : "optionbtn-passive bridge-passive"
                                        }
                                        onClick={() => {
                                          // this.props.onSelectChain("bnb");
                                        }}
                                        style={{
                                          pointerEvents:
                                            this.props.networkId === 1 ||
                                            this.props.networkId === 56
                                              ? "none"
                                              : "auto",
                                        }}
                                      >
                                        <h6 className="optiontext d-flex align-items-center gap-2">
                                          <img
                                            src={
                                              "https://cdn.worldofdypians.com/tools/bnbSquare.svg"
                                            }
                                            alt=""
                                          />
                                          <p className=" mb-0 optiontext d-none d-lg-flex">
                                            BNB Chain
                                          </p>
                                        </h6>
                                      </div>
                                    )}
                                  {this.props.activebtn === "2" && (
                                    <div
                                      className={
                                        this.props.destinationChain === "avax"
                                          ? "optionbtn-active"
                                          : "optionbtn-passive bridge-passive"
                                      }
                                      onClick={() => {
                                        // this.props.onSelectChain("bnb");
                                      }}
                                      style={{
                                        pointerEvents:
                                          this.props.networkId === 1 ||
                                          this.props.networkId === 56
                                            ? "none"
                                            : "auto",
                                      }}
                                    >
                                      <h6 className="optiontext d-flex align-items-center gap-2">
                                        <img
                                          src={
                                            "https://cdn.worldofdypians.com/tools/avaxSquare.svg"
                                          }
                                          alt=""
                                        />
                                        <p className=" mb-0 optiontext d-none d-lg-flex">
                                          Avalanche
                                        </p>
                                      </h6>
                                    </div>
                                  )}
                                  {this.props.activebtn === "8" && (
                                    <div
                                      className={
                                        this.props.destinationChain === "opbnb"
                                          ? "optionbtn-active"
                                          : "optionbtn-passive bridge-passive"
                                      }
                                      onClick={() => {
                                        // this.props.onSelectChain("bnb");
                                      }}
                                      style={{
                                        pointerEvents:
                                          this.props.networkId === 1 ||
                                          this.props.networkId === 56
                                            ? "none"
                                            : "auto",
                                      }}
                                    >
                                      <h6 className="optiontext d-flex align-items-center gap-2">
                                        <img
                                          src={
                                            "https://cdn.worldofdypians.com/tools/bnbSquare.svg"
                                          }
                                          alt=""
                                        />
                                        <p className=" mb-0 optiontext d-none d-lg-flex">
                                          opBNB Chain
                                        </p>
                                      </h6>
                                    </div>
                                  )}
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
                                    : this.props.destinationChain === "avax"
                                    ? "Avalanche"
                                    : "Ethereum"}{" "}
                                  Pool:{" "}
                                  <b>
                                    {this.props.destinationChain === "bnb"
                                      ? getFormattedNumber(
                                          this.state.bnbPool,
                                          2
                                        )
                                      : this.props.destinationChain === "avax"
                                      ? getFormattedNumber(
                                          this.state.avaxPool,
                                          2
                                        )
                                      : getFormattedNumber(
                                          this.state.ethPool,
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
                                  <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" />
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
                                  disabled={this.props.sourceChain === ""}
                                />
                              </div>

                              <button
                                style={{
                                  width: "fit-content",
                                  textWrap: "nowrap",
                                }}
                                disabled={
                                  this.state.withdrawLoading === true ||
                                  this.state.txHash === "" ||
                                  this.state.withdrawStatus === "success"
                                    ? true
                                    : false
                                }
                                className={`btn filledbtn ${
                                  ((canWithdraw === false &&
                                    this.state.txHash === "") ||
                                    this.state.withdrawStatus === "success") &&
                                  "disabled-btn"
                                } ${
                                  this.state.withdrawStatus === "deposit" ||
                                  this.state.withdrawStatus === "success"
                                    ? "success-button"
                                    : this.state.withdrawStatus === "fail"
                                    ? "fail-button"
                                    : null
                                } d-flex justify-content-center align-items-center gap-2`}
                                onClick={() => {
                                  this.state.destinationChainText ===
                                  this.props.destinationChain
                                    ? this.handleWithdraw()
                                    : this.switchToDestinationChain(
                                        this.props.destinationChain === "eth"
                                          ? "0x1"
                                          : this.props.destinationChain ===
                                            "avax"
                                          ? "0xa86a"
                                          : this.props.destinationChain ===
                                            "opbnb"
                                          ? "0xcc"
                                          : "0x38",
                                        this.props.destinationChain
                                      );
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
                                ) : this.state.withdrawStatus === "initial" &&
                                  this.state.destinationChainText ===
                                    this.props.destinationChain &&
                                  this.state.txHash !== "" ? (
                                  <>Withdraw</>
                                ) : this.state.withdrawStatus === "initial" &&
                                  this.state.txHash === "" ? (
                                  <>Withdraw</>
                                ) : this.state.withdrawStatus === "initial" &&
                                  this.state.destinationChainText !==
                                    this.props.destinationChain ? (
                                  <>
                                    Switch{" "}
                                    {this.props.destinationChain === "eth"
                                      ? "to Ethereum"
                                      : this.props.destinationChain === "bnb"
                                      ? "to BNB Chain"
                                      : this.props.destinationChain === "opbnb"
                                      ? "to opBNB Chain"
                                      : "to Avalanche"}
                                  </>
                                ) : this.state.withdrawStatus === "success" ? (
                                  <>Success</>
                                ) : (
                                  <>
                                    <img
                                      src={
                                        "https://cdn.worldofdypians.com/wod/failMark.svg"
                                      }
                                      alt=""
                                    />
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
                <img
                  src={"https://cdn.worldofdypians.com/tools/route-icon.svg"}
                  alt=""
                />
                Bridge process guide
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
                      Connect your wallet in order to start using Dypius Bridge.
                      Your wallet chain will be associated as default.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      className={
                        this.state.destinationChain !== ""
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.state.destinationChain !== ""
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
                      Select desired bridge chains at “FROM” and “TO” sections.
                      To change the "FROM” chain you need to change it in your
                      wallet.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      className={
                        this.state.depositAmount !== "" ||
                        this.state.txHash !== ""
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.state.depositAmount !== "" ||
                        this.state.txHash !== ""
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
                      to bridge. You can use “Max” button to fill in the maximum
                      amount.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      className={
                        this.state.depositStatus === "deposit" ||
                        this.state.depositStatus === "success" ||
                        this.state.txHash !== ""
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.state.depositStatus === "deposit" ||
                        this.state.depositStatus === "success" ||
                        this.state.txHash !== ""
                          ? "greenline"
                          : "passiveline"
                      }
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <h6 className="content-text">
                      <h6 className="content-title2">
                        <b>Approve deposit</b>
                      </h6>
                      Approve the transaction and then deposit the assets. These
                      steps need confirmation in your wallet.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      className={
                        this.state.depositStatus === "success" ||
                        this.state.txHash !== ""
                          ? "greendot"
                          : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.state.depositStatus === "success" ||
                        this.state.txHash !== ""
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
                      Confirm the transaction and deposit the assets into the
                      bridge contract. This step needs confirmation in your
                      wallet.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      className={
                        this.state.txHash !== "" ? "greendot" : "passivedot"
                      }
                    />
                    <TimelineConnector
                      className={
                        this.state.txHash !== "" ? "greenline" : "passiveline"
                      }
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <h6 className="content-text">
                      <h6 className="content-title2">
                        <b>Fill in transaction hash</b>
                      </h6>
                      After successful deposit, fill in the transaction hash and
                      switch your wallet to the chosen bridge network.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
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
                          {"Switch to destination chain. Wait timer & withdraw"}
                        </b>
                      </h6>
                      Firstly go to your wallet and switch into the chain you
                      want to withdraw from. Wait for the timer to end and and
                      click withdraw button to receive the assets in the desired
                      chain.
                    </h6>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </div>
          </div>
        </div>
      );
    }
  }

  return Bridge;
}
