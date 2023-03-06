import React, { useEffect, useState } from "react";
import cawsOpensea from "./assets/cawsOpensea.png";
import cawsFixedApr from "./assets/cawsFixedApr.svg";
import "./genesisStaking.scss";
import cawsIcon from "./assets/cawsIcon.png";
import connectIcon from "./assets/connectIcon.svg";
import tooltip from "./assets/tooltip.svg";
import ethereumTag from "./assets/ethereumTag.png";
import ethIcon from "./assets/ethereum.svg";
import toolsIcon from "./assets/toolsIcon.svg";
import { NavLink } from "react-router-dom";
import useWindowSize from "../../functions/useWindowSize";
import Web3 from "web3";
import axios from "axios";
import { handleSwitchNetworkhook } from "../../functions/hooks";
import getFormattedNumber from "../../functions/get-formatted-number";
import Address from "../FARMINNG/address";
import { ClickAwayListener, Tooltip } from "@material-ui/core";
import WalletModal from "../WalletModal";
import NftStakeCheckListModal from "../caws/NftMinting/components/NftMinting/NftStakeChecklistModal/NftStakeChecklistModal";

const CawsStaking = ({
  coinbase,
  isConnected,
  handleSwitchNetwork,
  chainId,
  handleConnection,
}) => {
  const [cawsCard, setCawsCard] = useState({});
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
  const [stakeTooltip, setStakeTooltip] = useState(false);
  const [rewardsTooltip, setRewardsTooltip] = useState(false);
  const [unstakeTooltip, setUnstakeTooltip] = useState(false);
  const [approvedNfts, setApprovedNfts] = useState([]);

  const [hide, setHide] = useState("");
  const windowSize = useWindowSize();

  const fetchEthStaking = async () => {
    await axios
      .get(`https://api.dyp.finance/api/get_staking_info_eth`)
      .then((res) => {
        setCawsCard(res.data.stakingInfoCAWS[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
    let staking_contract = await window.getContractNFT("NFTSTAKING");
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
    let staking_contract = await window.getContractNFT("NFTSTAKING");
    if (address !== null) {
      if (myStakes.length > 0) {
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
    let staking_contract = await window.getContractNFT("NFTSTAKING");
    // setclaimAllStatus("Claiming all rewards, please wait...");
    await staking_contract.methods
      .claimRewards(myStakes)
      .send()
      .then(() => {
        setEthRewards(0);
        // setclaimAllStatus("Claimed All Rewards!");
      })
      .catch((err) => {
        // window.alertify.error(err?.message);
        // setclaimAllStatus("An error occurred, please try again");
      });
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

    let staking_contract = await window.getContractNFT("NFTSTAKING");
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
    let stake_contract = await window.getContractNFT("NFTSTAKING");
    // setunstakeAllStatus("Unstaking all please wait...");

    await stake_contract.methods
      .withdraw(myStakes)
      .send()
      .then(() => {
        // setunstakeAllStatus("Successfully unstaked all!");
      })
      .catch((err) => {
        window.alertify.error(err?.message);
        // setunstakeAllStatus("An error occurred, please try again");
        setShowUnstakeModal(false);
      });
  };

  const handleEthPool = async () => {
    await handleSwitchNetworkhook("0x1")
      .then(() => {
        handleSwitchNetwork("1");
      })
      .catch((e) => {
        console.log(e);
      });
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

  const getApprovedNfts = (data) => {
    setApprovedNfts(data);
    return data;
  };

  useEffect(() => {
    fetchEthStaking();
    totalStakedNft().then();
  }, []);

  useEffect(() => {
    if (isConnected) {
      myNft().then();
      myStakes().then();
      checkApproval().then();
      handleClaimAll();
      calculateCountdown().then();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      setUSDPrice().then();
    }
  }, [isConnected, EthRewards]);

  return (
    <div
      className="container-lg px-0 d-flex flex-column justify-content-center align-items-center gap-3"
      style={{ minHeight: "65vh" }}
    >
      <div className="d-flex justify-content-between gap-2 flex-column flex-lg-row">
        <div className="row gap-2">
          <h6 className="mobile-title">CAWS NFTs</h6>
          <p className="mobile-desc">
            Cats and Watches Society (CAWS) NFT is a unique collection of 10,000
            randomly generated, hand-drawn utility NFTs.
          </p>
        </div>
        <div className="row">
          <a
            href="https://opensea.io/collection/catsandwatchessocietycaws"
            target={"_blank"}
            className="col-6"
          >
            <img src={cawsOpensea} alt="" />
          </a>
          <div className="col-6">
            <img src={cawsFixedApr} alt="" style={{ width: "100%" }} />
          </div>
        </div>
      </div>

      <div className="row w-100 justify-content-center align-items-center">
        <div className="genesis-staking-container position-relative p-2">
          <img src={ethereumTag} alt="" className="eth-tag" />
          <div className="purplediv" style={{ background: "#09FAD2" }}></div>
          <div className="d-flex align-items-center gap-2 mt-1">
            <img src={cawsIcon} width={28} height={28} alt="" />
            <h6 className="genesis-title">Stake CAWS</h6>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <div className="d-flex flex-column">
              <span className="info-header">Total Value Locked</span>
              <span className="info-value">
                ${getFormattedNumber(cawsCard.tvl_usd)}
              </span>
            </div>
            <div className="d-flex flex-column">
              <span className="info-header">30 day lock time</span>
              <span className="info-value">{cawsCard.apy_percent}% APR</span>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <div className="d-flex flex-column">
              <span className="total-nfts">Total NFT staked:</span>
              <span className="nfts-number">{totalStakes}/1000</span>
            </div>
            {coinbase === null ||
            coinbase === undefined ||
            isConnected === false ? (
              <button
                className="connectbtn btn"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <img src={connectIcon} alt="" /> Connect wallet
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
          <div className="d-flex flex-column gap-2 mt-2">
            <div
              className={`stake-wrapper p-2 ${chainId !== "1" && "blurrypool"}`}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-end gap-2">
                  <span className="stake">Stake</span>
                  <div className="available-nfts">
                    Available NFT's:{" "}
                    <b>{isConnected === false ? 0 : myNFTs.length} CAWS</b>
                  </div>
                </div>

                <ClickAwayListener onClickAway={() => setStakeTooltip(false)}>
                  <Tooltip
                    open={stakeTooltip}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    placement="top"
                    title={
                      <div className="tooltip-text">
                        {
                          "Deposit your CAWS NFTs to the staking smart contract."
                        }
                      </div>
                    }
                  >
                    <img
                      src={tooltip}
                      onClick={() => setStakeTooltip(true)}
                      alt=""
                    />
                  </Tooltip>
                </ClickAwayListener>
              </div>
              <div className="d-flex align-items-center justify-content-between mt-2">
                <div className="position-relative">
                  {/* <div className="position-relative" style={{width: '50%'}}>
                  <input
                    type={"number"}
                    disabled={
                      (myNFTs.length === 0 && mystakes.length === 0) ||
                      isConnected === false
                        ? true
                        : false
                    }
                    className="styledinput py-1 px-2"
                    placeholder="0"
                    style={{ width: "100%" }}
                    value={amountToStake}
                    onChange={(e) => {
                      setamountToStake(e.target.value);
                      setshowChecklistModal(true);
                      setOpenStakeChecklist(true);
                      setHide("staked");
                    }}
                  />
                  <button
                    className="btn maxbtn"
                    style={{
                      position: "absolute",
                      top: "0",
                      bottom: "0",
                      right: "3%",
                      margin: "auto",
                      height: "fit-content",
                    }}
                    onClick={() => setamountToStake(myNFTs.length)}
                  >
                    Max
                  </button>
                </div> */}

                  <div className="d-flex align-items-end gap-2">
                    <button
                      className="btn filledbtn"
                      onClick={() => {
                        setshowChecklistModal(true);
                        setOpenStakeChecklist(true);
                        setApprovedNfts([]);
                        setHide("staked");
                      }}
                    >
                      Select NFTs
                    </button>
                    <div className="available-nfts">
                      Selected NFTs:{" "}
                      <b>{isConnected === false ? 0 : approvedNfts.length}</b>
                    </div>
                  </div>
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
            </div>
            <div
              className={`stake-wrapper p-2 ${chainId !== "1" && "blurrypool"}`}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-end gap-2">
                  <span className="stake">Rewards</span>
                  <div className="available-nfts">
                    Staked: <b>{isConnected === false ? 0 : mystakes.length}</b>
                  </div>
                </div>

                <ClickAwayListener onClickAway={() => setRewardsTooltip(false)}>
                  <Tooltip
                    open={rewardsTooltip}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
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
                      src={tooltip}
                      onClick={() => setRewardsTooltip(true)}
                      alt=""
                    />
                  </Tooltip>
                </ClickAwayListener>
              </div>
              <div className="d-flex align-items-center justify-content-between mt-2">
                <div className="d-flex align-items-start gap-1">
                  <img src={ethIcon} alt="" />
                  <div className="d-flex flex-column">
                    <span className="eth-value">
                      {getFormattedNumber(EthRewards, 6)}
                    </span>
                    <span className="usd-value">
                      ${getFormattedNumber(ethToUSD, 6)}
                    </span>
                  </div>
                  <span className="weth">WETH</span>
                </div>
                <button
                  className={`btn ${
                    EthRewards === 0 ? "disabled-btn" : "filledbtn"
                  } d-flex justify-content-center align-items-center`}
                  style={{ height: "fit-content" }}
                  onClick={claimRewards}
                  disabled={EthRewards === 0 ? true : false}
                >
                  <>Claim</>
                </button>
              </div>
            </div>
            <div
              className={`stake-wrapper p-2 ${chainId !== "1" && "blurrypool"}`}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-end gap-2">
                  <span className="stake">Unstake</span>
                </div>

                <ClickAwayListener onClickAway={() => setUnstakeTooltip(false)}>
                  <Tooltip
                    open={unstakeTooltip}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
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
                      src={tooltip}
                      onClick={() => setUnstakeTooltip(true)}
                      alt=""
                    />
                  </Tooltip>
                </ClickAwayListener>
              </div>
              <div className="d-flex align-items-center justify-content-center mt-2">
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
      </div>
      <div className="row d-flex d-lg-none align-items-center justify-content-center w-100">
        <NavLink
          to="/earn"
          className="d-flex align-items-center gap-2"
          style={{ width: "fit-content" }}
        >
          <img src={toolsIcon} alt="" />
          <span className="earn-link mb-0">app.dypius.com/earn</span>
        </NavLink>
      </div>
      {showChecklistModal === true && (
        <NftStakeCheckListModal
          getApprovedNfts={getApprovedNfts}
          onClose={() => {
            setshowChecklistModal(false);
            setamountToStake("");
          }}
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
        />
      )}

      {showModal === true && (
        <WalletModal
          coin98={true}
          show={showModal}
          handleClose={() => {
            setShowModal(false);
          }}
          handleConnection={() => {
            handleConnection();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CawsStaking;
