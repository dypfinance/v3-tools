import React, { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";
import getFormattedNumber from "../../functions/get-formatted-number";
import Address from "./address";
import WalletModal from "../WalletModal";
import "./top-pools.css";
import Tooltip from "@material-ui/core/Tooltip";

import NftStakeCheckListModal from "../caws/NftMinting/components/NftMinting/NftStakeChecklistModal/NftStakeChecklistModal";
import { handleSwitchNetworkhook } from "../../functions/hooks";
import useWindowSize from "../../functions/useWindowSize";
import OutsideClickHandler from "react-outside-click-handler";
import { ethers } from "ethers";

const CawsDetails = ({
  coinbase,
  isConnected,
  listType,
  handleSwitchNetwork,
  chainId,
  handleConnection,
  renderedPage,
  expired,
  binanceW3WProvider,
  handleSwitchChainBinanceWallet,
}) => {
  const [myNFTs, setMyNFTs] = useState([]);
  const [amountToStake, setamountToStake] = useState("");
  const [mystakes, setMystakes] = useState([]);
  const [color, setColor] = useState("#F13227");
  const [status, setStatus] = useState("");
  const [showApprove, setshowApprove] = useState(true);
  const [showChecklistModal, setshowChecklistModal] = useState(false);
  const [EthRewards, setEthRewards] = useState(0);
  const [showStaked, setshowStaked] = useState(true);
  const [showToStake, setshowToStake] = useState(false);
  const [ethToUSD, setethToUSD] = useState(0);
  const [openStakeChecklist, setOpenStakeChecklist] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countDownLeft, setCountDownLeft] = useState(59000);
  const [totalStakes, settotalStakes] = useState(0);
  const [approvedNfts, setApprovedNfts] = useState([]);
  const [cawspopup, setCawspopup] = useState(false);

  const [hide, setHide] = useState("");
  const windowSize = useWindowSize();

  const checkApproval = async () => {
    const address = coinbase;
    const stakeApr50 = await window.config.nftstaking_address50;

    if (address !== null) {
      const result = await window.nft
        .checkapproveStake(address, stakeApr50)
        .then((data) => {
          return data;
        });

      if (result === true) {
        setshowApprove(false);
        setStatus("");
        setColor("#939393");
      } else if (result === false) {
        setStatus(" *Please approve before deposit");
        setshowApprove(true);
      }
    }
  };

  const myNft = async () => {
    let myNft = await window.myNftListContract(coinbase);

    let nfts = myNft.map((nft) => window.getNft(nft));

    nfts = await Promise.all(nfts);

    nfts.reverse();

    setMyNFTs(nfts);
  };

  const getStakesIds = async () => {
    const address = coinbase;
    let staking_contract = new window.infuraWeb3.eth.Contract(
      window.NFTSTAKING_ABI,
      window.config.nftstaking_address
    );
    let stakenft = [];
    let myStakes = await staking_contract.methods
      .depositsOf(address)
      .call()
      .then((result) => {
        for (let i = 0; i < result.length; i++)
          stakenft.push(parseInt(result[i]));
        return stakenft;
      });

    return myStakes;
  };

  const myStakes = async () => {
    let myStakes = await getStakesIds();

    let stakes = myStakes.map((stake) => window.getNft(stake));

    stakes = await Promise.all(stakes);
    stakes.reverse();
    setMystakes(stakes);
  };

  const handleClaimAll = async () => {
    const address = coinbase;
    let myStakes = await getStakesIds();
    let calculateRewards = [];
    let result = 0;
    let staking_contract = new window.infuraWeb3.eth.Contract(
      window.NFTSTAKING_ABI,
      window.config.nftstaking_address
    );
    if (address !== null) {
      if (myStakes && myStakes.length > 0) {
        calculateRewards = await staking_contract.methods
          .calculateRewards(address, myStakes)
          .call()
          .then((data) => {
            return data;
          });
      }
    }
    let a = 0;
    const infuraWeb3 = new Web3(window.config.infura_endpoint);
    for (let i = 0; i < calculateRewards.length; i++) {
      a = infuraWeb3.utils.fromWei(calculateRewards[i], "ether");

      result = result + Number(a);
    }

    setEthRewards(result);
  };

  const claimRewards = async () => {
    let myStakes = await getStakesIds();

    if (window.WALLET_TYPE !== "binance") {
      let staking_contract = await window.getContractNFT("NFTSTAKING");
      await staking_contract.methods
        .claimRewards(myStakes)
        .send()
        .then(() => {
          setEthRewards(0);
        })
        .catch((err) => {
          window.alertify.error(err?.message);
        });
    } else if (window.WALLET_TYPE == "binance") {
      let staking_contract = new ethers.Contract(
        window.config.nftstaking_address,
        window.NFTSTAKING_ABI,
        binanceW3WProvider.getSigner()
      );

      const txResponse = await staking_contract
        .claimRewards(myStakes)
        .catch((err) => {
          window.alertify.error(err?.message);
        });
      const txReceipt = await txResponse.wait();
      if (txReceipt) {
        setEthRewards(0);
      }
    }
  };

  const convertEthToUsd = async () => {
    const res = axios
      .get("https://api.coinbase.com/v2/prices/ETH-USD/spot")
      .then((data) => {
        return data.data.data.amount;
      });
    return res;
  };

  const setUSDPrice = async () => {
    const ethprice = await convertEthToUsd();
    setethToUSD(Number(ethprice) * Number(EthRewards));
  };

  const calculateCountdown = async () => {
    const address = coinbase;

    let staking_contract = new window.infuraWeb3.eth.Contract(
      window.NFTSTAKING_ABI,
      window.config.nftstaking_address
    );
    if (address !== null) {
      let finalDay = await staking_contract.methods
        .stakingTime(address)
        .call()
        .then((data) => {
          return data;
        })
        .catch((err) => {
          // window.alertify.error(err?.message);
        });

      let lockup_time = await staking_contract.methods
        .LOCKUP_TIME()
        .call()
        .then((data) => {
          return data;
        })
        .catch((err) => {
          // window.alertify.error(err?.message);
        });

      finalDay = parseInt(finalDay) + parseInt(lockup_time);

      setCountDownLeft(parseInt(finalDay * 1000) - Date.now());
    }
  };

  const handleUnstakeAll = async () => {
    let myStakes = await getStakesIds();
    if (window.WALLET_TYPE !== "binance") {
      let stake_contract = await window.getContractNFT("NFTSTAKING");

      await stake_contract.methods
        .emergencyWithdraw(myStakes)
        .send()
        .then(() => {
          window.alertify.message("Successfully unstaked all!");
          setTimeout(() => {
            setShowUnstakeModal(false);
          }, 2000);
        })
        .catch((err) => {
          window.alertify.error(err?.message);
          setShowUnstakeModal(false);
        });
    } else if (window.WALLET_TYPE === "binance") {
      let stake_contract = new ethers.Contract(
        window.config.nftstaking_address,
        window.NFTSTAKING_ABI,
        binanceW3WProvider.getSigner()
      );

      const txResponse = await stake_contract
        .emergencyWithdraw(myStakes)
        .catch((err) => {
          window.alertify.error(err?.message);
          setShowUnstakeModal(false);
        });
      const txReceipt = await txResponse.wait();
      if (txReceipt) {
        window.alertify.message("Successfully unstaked all!");
        setTimeout(() => {
          setShowUnstakeModal(false);
        }, 2000);
      }
    }
  };

  const handleEthPool = async () => {
    if (window.ethereum) {
      if (window.WALLET_TYPE !== "binance") {
        await handleSwitchNetworkhook("0x1")
          .then(() => {
            handleSwitchNetwork(1);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (window.WALLET_TYPE === "binance") {
        handleSwitchChainBinanceWallet(1);
      }
    } else if (window.WALLET_TYPE === "binance") {
      handleSwitchChainBinanceWallet(1);
    } else {
      window.alertify.error("No web3 detected. Please install Metamask!");
    }
  };

  const totalStakedNft = async () => {
    let staking_contract = await new window.infuraWeb3.eth.Contract(
      window.NFT_ABI,
      window.config.nft_address,
      { from: undefined }
    );

    await staking_contract.methods
      .balanceOf(window.config.nftstaking_address)
      .call()
      .then((data) => {
        settotalStakes(data);
      });
  };

  const showCawsPopup = () => {
    setCawspopup(true);
  };

  useEffect(() => {
    totalStakedNft().then();
  }, []);

  useEffect(() => {
    if (isConnected && chainId === "1") {
      myNft().then();
      myStakes().then();
      checkApproval().then();
      handleClaimAll();
      calculateCountdown().then();
    }
  }, [isConnected, chainId]);

  const getApprovedNfts = (data) => {
    setApprovedNfts(data);
    return data;
  };

  useEffect(() => {
    if (isConnected) {
      setUSDPrice().then();
    }
  }, [isConnected, EthRewards]);

  return (
    <div className="container-lg p-0">
      <div
        className={`allwrappercaws allwrapper-active mb-2 `}
        style={{
          borderRadius: listType !== "table" && "0px",
        }}
      >
        <div className="leftside2 w-100">
          <div className="activewrapper position-relative flex-row-reverse flex-lg-row align-items-end align-items-lg-center">
            <div className="d-flex flex-column flex-lg-row align-items-end align-items-lg-center justify-content-between gap-3 gap-lg-5">
              <h6 className="expiredtxt caws-active-txt">Expired Pool</h6>
              {/* <div className="d-flex align-items-center justify-content-between gap-2">
                    <h6 className="earnrewards-text">Earn rewards in:</h6>
                    <h6 className="earnrewards-token d-flex align-items-center gap-1">
                      DYP
                    </h6>
                  </div> */}

              <div className="d-flex align-items-center justify-content-between gap-2">
                <h6 className="earnrewards-text">APR:</h6>
                <h6 className="earnrewards-token d-flex align-items-center gap-1">
                  50%
                  <Tooltip
                    placement="top"
                    title={
                      <div className="tooltip-text">
                        {
                          "APR reflects the interest rate of earnings on an account over the course of one year. "
                        }
                      </div>
                    }
                  >
                    <img
                      src={"https://cdn.worldofdypians.com/tools/more-info.svg"}
                      alt=""
                    />
                  </Tooltip>
                </h6>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-2">
                <h6 className="earnrewards-text">Lock time:</h6>
                <h6 className="earnrewards-token d-flex align-items-center gap-1">
                  30 days
                  <Tooltip
                    placement="top"
                    title={
                      <div className="tooltip-text">
                        {
                          "The amount of time your deposited assets will be locked."
                        }
                      </div>
                    }
                  >
                    <img
                      src={"https://cdn.worldofdypians.com/tools/more-info.svg"}
                      alt=""
                    />
                  </Tooltip>
                </h6>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-2">
                <h6 className="earnrewards-text">Total NFTs staked</h6>
                <h6 className="earnrewards-token d-flex align-items-center gap-1">
                  {totalStakes}/10000
                </h6>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-3 position-relative">
              <div
                className="d-flex align-items-center justify-content-between gap-3 cursor-pointer"
                onClick={showCawsPopup}
              >
                <h6 className="bottomitems">Get CAWS</h6>
              </div>
              {cawspopup === true && (
                <div className="position-absolute">
                  <OutsideClickHandler
                    onOutsideClick={() => {
                      setCawspopup(false);
                    }}
                  >
                    <div
                      className="tooltip d-flex justify-content-center"
                      style={{ opacity: 1, width: 145 }}
                    >
                      <div className="d-flex flex-column gap-2 align-items-start">
                        <a
                          href="https://www.worldofdypians.com/shop/caws"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            setCawspopup(false);
                          }}
                        >
                          <h6 className="bottomitems">
                            <img
                              src={
                                "https://cdn.worldofdypians.com/tools/arrow-up.svg"
                              }
                              alt=""
                            />
                            WOD Shop
                          </h6>
                        </a>
                        <a
                          href="https://nft.coinbase.com/collection/catsandwatches"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            setCawspopup(false);
                          }}
                        >
                          <h6 className="bottomitems">
                            <img
                              src={
                                "https://cdn.worldofdypians.com/tools/arrow-up.svg"
                              }
                              alt=""
                            />
                            Coinbase
                          </h6>
                        </a>

                        <a
                          href="https://opensea.io/collection/catsandwatchessocietycaws"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            setCawspopup(false);
                          }}
                        >
                          <h6 className="bottomitems">
                            <img
                              src={
                                "https://cdn.worldofdypians.com/tools/arrow-up.svg"
                              }
                              alt=""
                            />
                            OpenSea
                          </h6>
                        </a>
                      </div>
                    </div>
                  </OutsideClickHandler>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pools-details-wrapper d-flex m-0 container-lg border-0 ">
          <div className="row w-100 justify-content-between gap-4 gap-lg-0">
            <div className="firstblockwrapper col-12 col-md-6 col-lg-2">
              <div
                className="d-flex flex-row flex-lg-column align-items-center align-items-lg-start justify-content-between  gap-4"
                style={{ height: "100%" }}
              >
                <h6 className="start-title">Start Staking</h6>

                {coinbase === null ||
                coinbase === undefined ||
                isConnected === false ? (
                  <button
                    className="connectbtn btn"
                    onClick={() => {
                      handleConnection();
                    }}
                  >
                    <img
                      src={
                        "https://cdn.worldofdypians.com/tools/walletIcon.svg"
                      }
                      alt=""
                    />{" "}
                    Connect wallet
                  </button>
                ) : chainId === "1" ? (
                  <div className="addressbtn btn">
                    <Address a={coinbase} chainId={1} />
                  </div>
                ) : (
                  <button
                    className="connectbtn btn"
                    onClick={() => {
                      handleEthPool();
                    }}
                  >
                    Change Network
                  </button>
                )}
              </div>
            </div>
            <div
              className={`otherside-border col-12 col-md-6 ${
                renderedPage === "dashboard" ? "col-lg-3" : "col-lg-4"
              } ${chainId !== "1" && "blurrypool"} ${
                expired === true && "blurrypool"
              }`}
            >
              <div className="d-flex justify-content-between align-items-center gap-2">
                <div className="d-flex align-items-center gap-3">
                  <h6 className="deposit-txt">Stake</h6>

                  <h6 className="mybalance-text">
                    Avaliable NFTs:{" "}
                    <b>{isConnected === false ? 0 : myNFTs.length} CAWS</b>
                  </h6>
                </div>
                <Tooltip
                  placement="top"
                  title={
                    <div className="tooltip-text">
                      {"Deposit your CAWS NFTs to the staking smart contract."}
                    </div>
                  }
                >
                  <img
                    src={"https://cdn.worldofdypians.com/tools/more-info.svg"}
                    alt=""
                  />
                </Tooltip>
              </div>
              <div className="d-flex flex-column gap-2 justify-content-between">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <div className="position-relative">
                    <h6 className="amount-txt">Amount 1/{myNFTs.length}</h6>
                    <input
                      type={"number"}
                      disabled={
                        (myNFTs.length === 0 && mystakes.length === 0) ||
                        isConnected === false
                          ? true
                          : false
                      }
                      className="styledinput"
                      placeholder="0.0"
                      style={{ width: "100%" }}
                      value={amountToStake}
                      onChange={(e) => {
                        setamountToStake(e.target.value);
                        setshowChecklistModal(true);
                        setOpenStakeChecklist(true);
                        setHide("staked");
                      }}
                    />
                  </div>

                  <button
                    className={`btn ${
                      amountToStake !== "" && myNFTs.length > 0
                        ? "filledbtn"
                        : "disabled-btn"
                    } d-flex justify-content-center align-items-center gap-2`}
                    disabled={
                      amountToStake !== "" && myNFTs.length > 0 ? false : true
                    }
                    onClick={() => {}}
                  >
                    {showApprove === false ? "Deposit" : "Approve"}
                  </button>
                </div>
                {/* {this.state.errorMsg && (
                  <h6 className="errormsg">{this.state.errorMsg}</h6>
                )} */}
              </div>
            </div>
            <div
              className={`otherside-border col-12 col-md-6 ${
                renderedPage === "dashboard" ? "col-lg-5" : "col-lg-4"
              }  ${chainId !== "1" && "blurrypool"} ${
                expired === true && "blurrypool"
              }`}
            >
              <div className="d-flex justify-content-between gap-2 flex-column flex-lg-row">
                <h6 className="withdraw-txt d-flex gap-2 align-items-center">
                  REWARDS
                  <h6
                    className="mybalance-text"
                    style={{ textTransform: "capitalize" }}
                  >
                    NFTs Staked:{""}
                    <b>{isConnected === false ? 0 : mystakes.length} CAWS</b>
                  </h6>
                </h6>
                <h6 className="withdraw-littletxt d-flex align-items-center gap-2">
                  Rewards are displayed in real-time
                  <Tooltip
                    placement="top"
                    title={
                      <div className="tooltip-text">
                        {
                          "Rewards earned by your CAWS NFTs deposit to the staking smart contract are displayed in real-time."
                        }
                      </div>
                    }
                  >
                    <img
                      src={"https://cdn.worldofdypians.com/tools/more-info.svg"}
                      alt=""
                    />
                  </Tooltip>
                </h6>
              </div>
              <div className="d-flex flex-column gap-2 justify-content-between">
                <div className="d-flex align-items-center justify-content-between gap-2"></div>
                <div className="form-row d-flex gap-2 align-items-end justify-content-between">
                  <h6 className="rewardstxtCaws d-flex align-items-center gap-2">
                    <img
                      src={
                        "https://cdn.worldofdypians.com/tools/ethStakeActive.svg"
                      }
                      alt=""
                      style={{ height: 25, width: 25 }}
                    />{" "}
                    {getFormattedNumber(EthRewards, 6)} WETH ($
                    {getFormattedNumber(ethToUSD, 6)})
                  </h6>
                  <button
                    className={`btn ${
                      EthRewards === 0 ? "disabled-btn" : "filledbtn"
                    } d-flex justify-content-center align-items-center`}
                    style={{ height: "fit-content" }}
                    onClick={claimRewards}
                    disabled={true}
                  >
                    <>Claim</>
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`otherside-border col-12 col-md-6 col-lg-2 ${
                chainId !== "1" && "blurrypool"
              }`}
            >
              <h6 className="deposit-txt d-flex align-items-center gap-2 justify-content-between">
                Unstake
                <Tooltip
                  placement="top"
                  title={
                    <div className="tooltip-text">
                      {
                        "Withdraw your deposited NFTs from the staking smart contract."
                      }
                    </div>
                  }
                >
                  <img
                    src={"https://cdn.worldofdypians.com/tools/more-info.svg"}
                    alt=""
                  />
                </Tooltip>
              </h6>

              <button
                className="btn outline-btn"
                onClick={() => {
                  setshowChecklistModal(true);
                  setOpenStakeChecklist(true);
                  setHide("");
                }}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
      {showChecklistModal === true && (
        <NftStakeCheckListModal
          onClose={() => {
            setshowChecklistModal(false);
            setamountToStake("");
          }}
          getApprovedNfts={getApprovedNfts}
          // nftItem={showStaked ? mystakes : showToStake ? myNFTs : showStaked}
          nftItem={
            hide === "" || hide === "tostake" || hide === "mystakes2"
              ? mystakes
              : myNFTs
          }
          onshowStaked={() => {
            setshowStaked(true);
            setshowToStake(false);
            setHide("mystakes2");
          }}
          onshowToStake={() => {
            setshowStaked(false);
            setshowToStake(true);
            setHide("tostake2");
          }}
          onClaimAll={() => {
            claimRewards();
          }}
          onUnstake={() => handleUnstakeAll()}
          isConnected={isConnected}
          coinbase={coinbase}
          ETHrewards={EthRewards}
          countDownLeft={countDownLeft}
          open={openStakeChecklist ? true : false}
          hideItem={hide}
          showbutton={true}
          binanceW3WProvider={binanceW3WProvider}
        />
      )}
    </div>
  );
};

export default CawsDetails;
