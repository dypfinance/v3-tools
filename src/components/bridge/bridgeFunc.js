import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { handleSwitchNetworkhook } from "../../functions/hooks";
import Address from "../FARMINNG/address";
import getFormattedNumber from "../../functions/get-formatted-number";
import Tooltip from "@material-ui/core/Tooltip";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Countdown from "react-countdown";
import "./bridge.css";

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
const BridgeDyp = ({
  isConnected,
  networkId,
  handleConnection,
  destinationChain,
  handleSwitchNetwork,
  onSelectChain,
  onSelectSourceChain,
  coinbase,
  sourceChain,
  activebtn,
  bridgeETH,
  bridgeBSC,
  tokenETH,
  handleSwitchChainBinanceWallet,
  binanceW3WProvider,
}) => {
  const [tokenBalance, setTokenBalance] = useState("");

  const [depositAmount, setDepositAmount] = useState("");

  const [txHash, setTxHash] = useState("");
  const [chainText, setChainText] = useState("");
  const [ethPool, setEthPool] = useState("0");

  const [withdrawableUnixTimestamp, setWithdrawableUnixTimestamp] =
    useState(null);
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositStatus, setDepositStatus] = useState("initial");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState("initial");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsg2, setErrorMsg2] = useState("");
  const [selectedChain, setSelectedChain] = useState("");

  const [destinationChainText, setDestinationChainText] = useState("");
  let TOKEN_DECIMALS = 18;
  let { BigNumber } = window;

  const checkNetworkId = () => {
    if (networkId === 1) {
      setDestinationChainText("eth");
    } else if (networkId === 43114) {
      setDestinationChainText("avax");
    } else if (networkId === 56) {
      setDestinationChainText("bnb");
    } else if (networkId === 204) {
      setDestinationChainText("opbnb");
    } else {
      setDestinationChainText("");
    }
  };

  const getSelectedChain = () => {
    if (sourceChain === "eth") {
      setSelectedChain(1);
    } else if (sourceChain === "bnb") {
      setSelectedChain(56);
    } else if (sourceChain === "avax") {
      setSelectedChain(43114);
    } else if (sourceChain === "opbnb") {
      setSelectedChain(204);
    }
  };

  const fetchData = async () => {
    //Get DYP Balance Ethereum Pool
    let ethPool = await window.getTokenHolderBalanceAll(
      sourceChain === "avax" || sourceChain === "bnb" || sourceChain === "opbnb"
        ? bridgeBSC._address
        : bridgeETH._address,
      sourceChain === "avax" || sourceChain === "bnb" || sourceChain === "opbnb"
        ? bridgeBSC.tokenAddress
        : bridgeETH.tokenAddress,
      1
    );

    ethPool = ethPool / 1e18;
    setEthPool(ethPool);
  };
  const checkApproval = async (amount) => {
    if (coinbase) {
      const result = await window
        .checkapproveStakePool(coinbase, tokenETH._address, bridgeETH._address)
        .then((data) => {
          console.log(data);
          return data;
        })
        .catch((e) => {
          return 0;
        });

      let result_formatted = new BigNumber(result).div(1e18).toFixed(6);

      if (
        Number(result_formatted) >= Number(amount) &&
        Number(result_formatted) !== 0
      ) {
        setDepositStatus("deposit");
      } else {
        setDepositStatus("initial");
      }
    }
  };
  const handleApprove = async (e) => {
    setDepositLoading(true);
    let amount = depositAmount;
    amount = new BigNumber(amount).times(10 ** TOKEN_DECIMALS).toFixed(0);
    let bridge = bridgeETH;

    if (window.WALLET_TYPE !== "binance") {
      tokenETH
        .approve(bridge._address, amount)
        .then(() => {
          setDepositLoading(false);
          setDepositStatus("deposit");
        })
        .catch((e) => {
          setDepositLoading(false);
          setDepositStatus("fail");
          setErrorMsg(e?.message);

          setTimeout(() => {
            setDepositLoading(false);
            setDepositStatus("initial");
            setErrorMsg("");
            setDepositAmount("");
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
          setDepositLoading(false);
          setDepositStatus("fail");
          setErrorMsg(e?.message);
          setTimeout(() => {
            setDepositLoading(false);
            setDepositStatus("initial");
            setErrorMsg("");
            setDepositAmount("");
          }, 8000);
        });
      const txReceipt = await txResponse.wait();
      if (txReceipt) {
        setDepositLoading(false);
        setDepositStatus("deposit");
      }
    }
  };

  const handleDeposit = async (e) => {
    let amount = depositAmount;
    setDepositLoading(true);

    amount = new BigNumber(amount).times(10 ** TOKEN_DECIMALS).toFixed(0);
    let bridge = bridgeETH;
    let chainId = networkId;
    if (window.WALLET_TYPE !== "binance") {
      const web3 = new Web3(window.ethereum);

      if (chainId !== undefined) {
        let contract = new web3.eth.Contract(
          window.NEW_BRIDGE_ABI,
          bridge._address
        );
        contract.methods
          .deposit(amount)
          .send({ from: coinbase })
          .then((data) => {
            setTxHash(data.transactionHash);
            setDepositLoading(false);
            setDepositStatus("success");
            refreshBalance();
          })
          .catch((e) => {
            setDepositLoading(false);
            setDepositStatus("fail");
            setErrorMsg(e?.message);

            setTimeout(() => {
              setDepositStatus("initial");
              setErrorMsg("");
              setDepositAmount("");
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

        const txResponse = await contract_binance.deposit(amount).catch((e) => {
          setDepositLoading(false);
          setDepositStatus("fail");
          setErrorMsg(e?.message);

          setTimeout(() => {
            setDepositStatus("initial");
            setErrorMsg("");
            setDepositAmount("");
          }, 8000);
        });

        const txReceipt = await txResponse.wait();
        if (txReceipt) {
          setTxHash(txResponse.hash);
          setDepositLoading(false);
          setDepositStatus("success");
          refreshBalance();
        }
      }
    }
  };

  const handleWithdraw = async (e) => {
    setWithdrawLoading(true);

    try {
      let signature =
        (sourceChain === "eth" && destinationChain === "avax") ||
        (sourceChain === "avax" && destinationChain === "eth")
          ? window.config.SIGNATURE_APIBRIDGE_AVAX_URL_NEW
          : (sourceChain === "eth" && destinationChain === "opbnb") ||
            (sourceChain === "opbnb" && destinationChain === "eth")
          ? window.config.SIGNATURE_APIBRIDGE_OPBNB_URL_NEW
          : window.config.SIGNATURE_APIBRIDGE_BSC_URL_NEW;
      let url =
        signature +
        `/api/withdraw-args?depositNetwork=${
          sourceChain === "bnb" || sourceChain === "opbnb"
            ? "BSC"
            : sourceChain === "eth"
            ? "ETH"
            : "BSC"
        }&txHash=${txHash}`;
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
            setWithdrawLoading(false);
            setWithdrawStatus("success");

            refreshBalance();
            window.alertify.message(
              "Congratulations on successfully withdrawing your new DYP tokens!"
            );
          })
          .catch((e) => {
            setWithdrawLoading(false);
            setWithdrawStatus("fail");
            setErrorMsg2(e?.message);

            setTimeout(() => {
              setWithdrawStatus("initial");
              setErrorMsg2("");
            }, 8000);
          });
      } else if (window.WALLET_TYPE === "binance") {
        let contract_binance = new ethers.Contract(
          bridgeBSC._address,
          window.NEW_BRIDGE_ABI,
          binanceW3WProvider.getSigner()
        );
        if (args && args.length === 4) {
          const txResponse = await contract_binance
            .withdraw(...args)
            .catch((e) => {
              setWithdrawLoading(false);
              setWithdrawStatus("fail");
              setErrorMsg2(e?.message);

              setTimeout(() => {
                setWithdrawStatus("initial");
                setErrorMsg2("");
              }, 8000);
            });

          const txReceipt = await txResponse.wait();
          if (txReceipt) {
            setWithdrawLoading(false);
            setWithdrawStatus("success");

            refreshBalance();
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

  const switchNetwork = async (hexChainId, chain) => {
    if (window.ethereum) {
      if (!window.gatewallet && window.WALLET_TYPE !== "binance") {
        await handleSwitchNetworkhook(hexChainId)
          .then(() => {
            handleSwitchNetwork(chain.toString());
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (coinbase && window.WALLET_TYPE === "binance") {
        handleSwitchChainBinanceWallet(chain.toString());
      }
    } else if (coinbase && window.WALLET_TYPE === "binance") {
      handleSwitchChainBinanceWallet(chain.toString());
    } else {
      window.alertify.error("No web3 detected. Please install Metamask!");
    }
  };

  const handleSetMaxDeposit = (e) => {
    e.preventDefault();
    let amount = new BigNumber(tokenBalance)
      .div(10 ** TOKEN_DECIMALS)
      .toFixed(TOKEN_DECIMALS);
    setDepositAmount(amount);
  };

  const refreshBalance = async () => {
    if (isConnected === true && networkId !== 0 && coinbase) {
      try {
        const tokenAddress = window.config.token_dypius_new_address;
        const tokenAddress_bsc = window.config.token_dypius_new_bsc_address;
        const tokenAddress_avax = window.config.token_dypius_new_avax_address;
        const tokenAddress_opbnb = window.config.token_dypius_new_opbnb_address;

        if (sourceChain === "eth") {
          const token_contract_eth = new window.infuraWeb3.eth.Contract(
            window.TOKEN_ABI,
            tokenAddress
          );
          await token_contract_eth.methods
            .balanceOf(coinbase)
            .call()
            .then((data) => {
              console.log("datadata", data);
              setTokenBalance(data);
            })
            .catch((e) => {
              console.error(e);
              return 0;
            });
        } else if (sourceChain === "bnb") {
          const token_contract_bsc = new window.bscWeb3.eth.Contract(
            window.TOKENBSC_ABI,
            tokenAddress_bsc
          );
          await token_contract_bsc.methods
            .balanceOf(coinbase)
            .call()
            .then((data) => {
              setTokenBalance(data);
            })
            .catch((e) => {
              console.error(e);
              return 0;
            });
        } else if (sourceChain === "opbnb") {
          const token_contract_opbnb = new window.opbnbWeb3.eth.Contract(
            window.TOKENBSC_ABI,
            tokenAddress_opbnb
          );
          await token_contract_opbnb.methods
            .balanceOf(coinbase)
            .call()
            .then((data) => {
              setTokenBalance(data);
            })
            .catch((e) => {
              console.error(e);
              return 0;
            });
        } else if (sourceChain === "avax") {
          const token_contract_avax = new window.avaxWeb3.eth.Contract(
            window.TOKENAVAX_ABI,
            tokenAddress_avax
          );
          await token_contract_avax.methods
            .balanceOf(coinbase)
            .call()
            .then((data) => {
              setTokenBalance(data);
            })
            .catch((e) => {
              console.error(e);
              return 0;
            });
        }
        if (txHash) {
          try {
            let signature =
              (sourceChain === "eth" && destinationChain === "avax") ||
              (sourceChain === "avax" && destinationChain === "eth")
                ? window.config.SIGNATURE_APIBRIDGE_AVAX_URL_NEW
                : (sourceChain === "eth" && destinationChain === "opbnb") ||
                  (sourceChain === "opbnb" && destinationChain === "eth")
                ? window.config.SIGNATURE_APIBRIDGE_OPBNB_URL_NEW
                : window.config.SIGNATURE_APIBRIDGE_BSC_URL_NEW;
            let url =
              signature +
              `/api/withdraw-args?depositNetwork=${
                sourceChain === "bnb" || sourceChain === "opbnb"
                  ? "BSC"
                  : sourceChain === "eth"
                  ? "ETH"
                  : "BSC"
              }&txHash=${txHash}&getWithdrawableUnixTimestamp=true`;
            console.log({ url });
            let { withdrawableUnixTimestamp } = await window.jQuery
              .get(url)
              .catch((e) => {
                console.error(e);
                return 0;
              });
            setWithdrawableUnixTimestamp(withdrawableUnixTimestamp);

            console.log({ withdrawableUnixTimestamp });
          } catch (e) {
            console.error(e);
            setWithdrawableUnixTimestamp(null);
          }
        } else setWithdrawableUnixTimestamp(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getChainSymbol = async () => {
    try {
      let chainId = networkId;
      if (chainId === 43114) setChainText("AVAX");
      else if (chainId === 56) setChainText("BSC");
      else if (chainId === 204) setChainText("OPBNB");
      else if (chainId === 1) setChainText("ETH");
      else {
        setChainText("");
      }
    } catch (err) {
      setChainText("ETH");
      // console.log(err);
    }
  };
  let canWithdraw = false;
  let timeDiff = null;
  if (withdrawableUnixTimestamp) {
    timeDiff = Math.max(0, withdrawableUnixTimestamp * 1e3 - Date.now());
    canWithdraw = timeDiff === 0;
  }

  useEffect(() => {
    getChainSymbol();

    fetchData();
    checkNetworkId();
    window._refreshBalInterval = setInterval(getChainSymbol, 500);
  }, []);

  useEffect(() => {
    checkNetworkId();
  }, [sourceChain, networkId]);

  useEffect(() => {
    refreshBalance();
  }, [isConnected, coinbase, networkId, sourceChain]);

  useEffect(() => {
    return () => {
      clearInterval(window._refreshBalInterval);
    };
  }, []);

  useEffect(() => {
    getSelectedChain();
  }, [sourceChain]);

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
                      sourceChain === "eth"
                        ? "optionbtn-active"
                        : "optionbtn-passive bridge-passive"
                    }
                    onClick={() => {
                      //   this.setState({
                      //     sourceChain: "eth",
                      //   });
                      onSelectSourceChain("eth");
                      onSelectChain(
                        activebtn !== "2" && activebtn !== "8"
                          ? "bnb"
                          : activebtn === "8"
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

                  {activebtn !== "2" && activebtn !== "8" && (
                    <div
                      className={
                        sourceChain === "bnb"
                          ? "optionbtn-active"
                          : "optionbtn-passive bridge-passive"
                      }
                      onClick={() => {
                        //   this.setState({
                        //     sourceChain: "bnb",
                        //   });
                        onSelectSourceChain("bnb");
                        onSelectChain("eth");
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
                  {activebtn === "2" && (
                    <div
                      className={
                        sourceChain === "avax"
                          ? "optionbtn-active"
                          : "optionbtn-passive bridge-passive"
                      }
                      onClick={() => {
                        // this.setState({
                        //   sourceChain: "avax",
                        // });
                        onSelectSourceChain("avax");
                        onSelectChain("eth");
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
                  {activebtn === "8" && (
                    <div
                      className={
                        sourceChain === "opbnb"
                          ? "optionbtn-active"
                          : "optionbtn-passive bridge-passive"
                      }
                      onClick={() => {
                        // this.setState({
                        //   sourceChain: "opbnb",
                        // });
                        onSelectSourceChain("opbnb");
                        onSelectChain("eth");
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
                {isConnected === false ? (
                  <button
                    className="connectbtn btn d-flex align-items-center gap-2"
                    style={{ width: "fit-content" }}
                    onClick={handleConnection}
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
                    <Address a={coinbase} chainId={networkId} />
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
                                {getFormattedNumber(tokenBalance / 1e18, 2)}
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
                                  // sourceChain === "bnb"
                                  //   ? getFormattedNumber(
                                  //       bnbPool,
                                  //       2
                                  //     )
                                  //   : sourceChain === "avax"
                                  //   ? getFormattedNumber(
                                  //       avaxPool,
                                  //       2
                                  //     )
                                  //   :
                                  getFormattedNumber(ethPool, 2)
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
                                Number(depositAmount) > 0
                                  ? depositAmount
                                  : depositAmount
                              }
                              onChange={(e) => {
                                setDepositAmount(e.target.value);

                                checkApproval(e.target.value);
                              }}
                              className="styledinput"
                              placeholder="0"
                              type="text"
                              disabled={destinationChain !== "" ? false : true}
                            />

                            <button
                              className="btn maxbtn"
                              disabled={destinationChain !== "" ? false : true}
                              style={{ cursor: "pointer" }}
                              onClick={handleSetMaxDeposit}
                            >
                              MAX
                            </button>
                          </div>

                          <button
                            style={{ width: "fit-content" }}
                            disabled={
                              (depositAmount === "" &&
                                selectedChain === networkId &&
                                sourceChain !== "") ||
                              depositLoading === true ||
                              depositStatus === "success" ||
                              depositStatus === "fail"
                                ? true
                                : false
                            }
                            className={`btn filledbtn ${
                              depositAmount === "" &&
                              depositStatus === "initial" &&
                              "disabled-btn"
                            } ${
                              depositStatus === "deposit" ||
                              depositStatus === "success"
                                ? "success-button"
                                : depositStatus === "fail"
                                ? "fail-button"
                                : null
                            } d-flex justify-content-center align-items-center gap-2`}
                            onClick={() => {
                              selectedChain !== networkId &&
                              sourceChain !== "" &&
                              depositAmount !== ""
                                ? switchNetwork(
                                    "0x" + selectedChain.toString(16),
                                    selectedChain
                                  )
                                : depositStatus === "deposit"
                                ? handleDeposit()
                                : depositStatus === "initial" &&
                                  depositAmount !== ""
                                ? handleApprove()
                                : console.log("");
                            }}
                          >
                            {selectedChain !== networkId &&
                            sourceChain !== "" &&
                            depositAmount !== "" ? (
                              <>Switch network</>
                            ) : depositLoading ? (
                              <div
                                class="spinner-border spinner-border-sm text-light"
                                role="status"
                              >
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            ) : depositStatus === "initial" ? (
                              <>Approve</>
                            ) : depositStatus === "deposit" ? (
                              <>Deposit</>
                            ) : depositStatus === "success" ? (
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
                        {errorMsg && <h6 className="errormsg">{errorMsg}</h6>}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <img
                src={"https://cdn.worldofdypians.com/tools/switch.svg"}
                alt=""
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
                                  destinationChain === "eth"
                                    ? "optionbtn-active"
                                    : "optionbtn-passive bridge-passive"
                                }
                                onClick={() => {
                                  // onSelectChain("avax");
                                }}
                                style={{
                                  pointerEvents:
                                    networkId === 1 || networkId === 56
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
                              {activebtn !== "2" && activebtn !== "8" && (
                                <div
                                  className={
                                    destinationChain === "bnb"
                                      ? "optionbtn-active"
                                      : "optionbtn-passive bridge-passive"
                                  }
                                  style={{
                                    pointerEvents:
                                      networkId === 1 || networkId === 56
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
                              {activebtn === "2" && (
                                <div
                                  className={
                                    destinationChain === "avax"
                                      ? "optionbtn-active"
                                      : "optionbtn-passive bridge-passive"
                                  }
                                  style={{
                                    pointerEvents:
                                      networkId === 1 || networkId === 56
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
                              {activebtn === "8" && (
                                <div
                                  className={
                                    destinationChain === "opbnb"
                                      ? "optionbtn-active"
                                      : "optionbtn-passive bridge-passive"
                                  }
                                  onClick={() => {
                                    // onSelectChain("bnb");
                                  }}
                                  style={{
                                    pointerEvents:
                                      networkId === 1 || networkId === 56
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
                          {destinationChain === "bnb"
                            ? "BNB Chain"
                            : destinationChain === "avax"
                            ? "Avalanche"
                            : "Ethereum"}{" "}
                          Pool:{" "}
                          <b>
                            {destinationChain === "bnb"
                              ? getFormattedNumber(
                                  bnbPool,
                                  2
                                )
                              : destinationChain === "avax"
                              ? getFormattedNumber(
                                  avaxPool,
                                  2
                                )
                              : getFormattedNumber(
                                  ethPool,
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
                              value={txHash}
                              onChange={(e) => setTxHash(e.target.value)}
                              className="styledinput"
                              placeholder="Enter Deposit tx hash"
                              type="text"
                              disabled={sourceChain === ""}
                            />
                          </div>

                          <button
                            style={{
                              width: "fit-content",
                              textWrap: "nowrap",
                            }}
                            disabled={
                              withdrawLoading === true ||
                              txHash === "" ||
                              withdrawStatus === "success"
                                ? true
                                : false
                            }
                            className={`btn filledbtn ${
                              ((canWithdraw === false && txHash === "") ||
                                withdrawStatus === "success") &&
                              "disabled-btn"
                            } ${
                              withdrawStatus === "deposit" ||
                              withdrawStatus === "success"
                                ? "success-button"
                                : withdrawStatus === "fail"
                                ? "fail-button"
                                : null
                            } d-flex justify-content-center align-items-center gap-2`}
                            onClick={() => {
                              destinationChainText === destinationChain
                                ? handleWithdraw()
                                : switchNetwork(
                                    destinationChain === "eth"
                                      ? "0x1"
                                      : destinationChain === "avax"
                                      ? "0xa86a"
                                      : destinationChain === "opbnb"
                                      ? "0xcc"
                                      : "0x38",
                                    destinationChain === "eth"
                                      ? "1"
                                      : destinationChain === "avax"
                                      ? "43314"
                                      : destinationChain === "opbnb"
                                      ? "204"
                                      : "56"
                                  );
                            }}
                          >
                            {withdrawLoading ? (
                              <div
                                class="spinner-border spinner-border-sm text-light"
                                role="status"
                              >
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            ) : withdrawStatus === "initial" &&
                              destinationChainText === destinationChain &&
                              txHash !== "" ? (
                              <>Withdraw</>
                            ) : withdrawStatus === "initial" &&
                              txHash === "" ? (
                              <>Withdraw</>
                            ) : withdrawStatus === "initial" &&
                              destinationChainText !== destinationChain ? (
                              <>
                                Switch{" "}
                                {destinationChain === "eth"
                                  ? "to Ethereum"
                                  : destinationChain === "bnb"
                                  ? "to BNB Chain"
                                  : destinationChain === "opbnb"
                                  ? "to opBNB Chain"
                                  : "to Avalanche"}
                              </>
                            ) : withdrawStatus === "success" ? (
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
                            {withdrawableUnixTimestamp &&
                              Date.now() < withdrawableUnixTimestamp * 1e3 && (
                                <span>
                                  &nbsp;
                                  <Countdown
                                    key="withdrawable"
                                    date={withdrawableUnixTimestamp * 1e3}
                                    renderer={getRenderer(undefined, true)}
                                  />
                                </span>
                              )}
                          </button>
                        </div>

                        <div className="separator"></div>

                        {errorMsg2 && <h6 className="errormsg">{errorMsg2}</h6>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  className={isConnected === true ? "greendot" : "passivedot"}
                />
                <TimelineConnector
                  className={isConnected === true ? "greenline" : "passiveline"}
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
                    destinationChain !== "" ? "greendot" : "passivedot"
                  }
                />
                <TimelineConnector
                  className={
                    destinationChain !== "" ? "greenline" : "passiveline"
                  }
                />
              </TimelineSeparator>
              <TimelineContent>
                <h6 className="content-text">
                  <h6 className="content-title2">
                    <b>Select chains</b>
                  </h6>
                  Select desired bridge chains at “FROM” and “TO” sections. To
                  change the "FROM” chain you need to change it in your wallet.
                </h6>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot
                  className={
                    depositAmount !== "" || txHash !== ""
                      ? "greendot"
                      : "passivedot"
                  }
                />
                <TimelineConnector
                  className={
                    depositAmount !== "" || txHash !== ""
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
                  Check your balance and fill in the desired amount you want to
                  bridge. You can use “Max” button to fill in the maximum
                  amount.
                </h6>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot
                  className={
                    depositStatus === "deposit" ||
                    depositStatus === "success" ||
                    txHash !== ""
                      ? "greendot"
                      : "passivedot"
                  }
                />
                <TimelineConnector
                  className={
                    depositStatus === "deposit" ||
                    depositStatus === "success" ||
                    txHash !== ""
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
                    depositStatus === "success" || txHash !== ""
                      ? "greendot"
                      : "passivedot"
                  }
                />
                <TimelineConnector
                  className={
                    depositStatus === "success" || txHash !== ""
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
                  Confirm the transaction and deposit the assets into the bridge
                  contract. This step needs confirmation in your wallet.
                </h6>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot
                  className={txHash !== "" ? "greendot" : "passivedot"}
                />
                <TimelineConnector
                  className={txHash !== "" ? "greenline" : "passiveline"}
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
                  className={canWithdraw === true ? "greendot" : "passivedot"}
                />
              </TimelineSeparator>
              <TimelineContent>
                <h6 className="content-text">
                  <h6 className="content-title2">
                    <b>
                      {"Switch to destination chain. Wait timer & withdraw"}
                    </b>
                  </h6>
                  Firstly go to your wallet and switch into the chain you want
                  to withdraw from. Wait for the timer to end and and click
                  withdraw button to receive the assets in the desired chain.
                </h6>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    </div>
  );
};

export default BridgeDyp;
