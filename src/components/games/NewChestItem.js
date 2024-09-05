import React, { useState, useEffect } from "react";
import premiumLock from "./assets/premiumLock.png";
import errorSound from "./assets/error.mp3";
import axios from "axios";
import Web3 from "web3";
import { ethers } from "ethers";

const NewChestItem = ({
  item,
  selectedChest,
  chainId,
  chain,
  isPremium,
  onClaimRewards,
  onLoadingChest,
  onChestStatus,
  handleShowRewards,
  address,
  email,
  rewardTypes,
  chestId,
  chestIndex,
  open,
  disableBtn,
  isActive,
  isActiveIndex,
  buyNftPopup,
  dummypremiumChests,
  claimingChest,
  setClaimingChest,
  image,
  coinbase,
  binanceW3WProvider,
}) => {
  const [shake, setShake] = useState(false);
  const [ischestOpen, setIsChestOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUserRewardsByChest2 = async (
    userEmail,
    txHash,
    chestId,
    chainText
  ) => {
    const userData = {
      transactionHash: txHash,
      emailAddress: userEmail,
      chestIndex: chestId,
    };

    const userData_bnb = {
      transactionHash: txHash,
      emailAddress: userEmail,
      chestIndex: chestId,
      chainId: chainText,
    };

    if (chainText) {
      const result = await axios
        .post(
          "https://worldofdypiansdailybonus.azurewebsites.net/api/CollectChest",
          userData_bnb
        )
        .catch((e) => {
          onLoadingChest(false);
          setLoading(false);
          setClaimingChest(false);

          setIsChestOpen(false);
          window.alertify.error(e?.message);
          onChestStatus("error");
          setTimeout(() => {
            onChestStatus("initial");
          }, 3000);
        });
      if (result && result.status === 200) {
        onClaimRewards(result.data);
        setIsChestOpen(true);

        // onChestStatus("success");
        onLoadingChest(false);
        setLoading(false);
        setClaimingChest(false);
      }
    } else {
      const result = await axios
        .post(
          "https://worldofdypiansdailybonus.azurewebsites.net/api/CollectChest",
          userData
        )
        .catch((e) => {
          onLoadingChest(false);
          setLoading(false);
          setClaimingChest(false);

          setIsChestOpen(false);
          window.alertify.error(e?.message);
          onChestStatus("error");
          setTimeout(() => {
            onChestStatus("initial");
          }, 3000);
        });
      if (result && result.status === 200) {
        if (chainText === "opbnb" || chainText === "bnb") {
          handleSecondTask(coinbase);
        }
        onClaimRewards(result.data);
        setIsChestOpen(true);
        // onChestStatus("success");
        onLoadingChest(false);
        setLoading(false);
        setClaimingChest(false);
      }
    }
  };

  const handleSecondTask = async (wallet) => {
    const result2 = await axios
      .get(`https://api.worldofdypians.com/api/olympiad/task2/${wallet}`)
      .catch((err) => {
        console.error(err);
      });

    if (result2 && result2.status === 200) {
      console.log(result2);
    }
  };

  const getUserRewardsByChest = async (
    userEmail,
    txHash,
    chestId,
    chainText
  ) => {
    const userData = {
      transactionHash: txHash,
      emailAddress: userEmail,
      chestIndex: chestId,
    };

    const userData_bnb = {
      transactionHash: txHash,
      emailAddress: userEmail,
      chestIndex: chestId,
      chainId: chainText,
    };

    if (chainText) {
      const result = await axios
        .post(
          "https://worldofdypiansdailybonus.azurewebsites.net/api/CollectChest",
          userData_bnb
        )
        .catch((e) => {
          if (e.response.status === 400) {
            setTimeout(() => {
              getUserRewardsByChest2(userEmail, txHash, chestId, chainText);
            }, 2000);
          } else {
            onLoadingChest(false);
            setLoading(false);
            setClaimingChest(false);
            setIsChestOpen(false);
            window.alertify.error(e?.message);
            console.error(e);
            onChestStatus("error");
            setTimeout(() => {
              onChestStatus("initial");
            }, 3000);
          }
        });
      if (result && result.status === 200) {
        if (chainText === "opbnb" || chainText === "bnb") {
          handleSecondTask(coinbase);
        }
        onClaimRewards(result.data);
        setIsChestOpen(true);
        // onChestStatus("success");
        onLoadingChest(false);
        setLoading(false);
        setClaimingChest(false);
      }
    } else {
      const result = await axios
        .post(
          "https://worldofdypiansdailybonus.azurewebsites.net/api/CollectChest",
          userData
        )
        .catch((e) => {
          if (e.response.status === 400) {
            setTimeout(() => {
              getUserRewardsByChest2(userEmail, txHash, chestId, chainText);
            }, 2000);
          } else {
            onLoadingChest(false);
            setLoading(false);
            setClaimingChest(false);
            setIsChestOpen(false);
            window.alertify.error(e?.message);
            console.error(e);
            onChestStatus("error");
            setTimeout(() => {
              onChestStatus("initial");
            }, 3000);
          }
        });
      if (result && result.status === 200) {
        onClaimRewards(result.data);
        setIsChestOpen(true);
        // onChestStatus("success");
        onLoadingChest(false);
        setLoading(false);
        setClaimingChest(false);
      }
      //  else {
      //   onLoadingChest(false);
      //   setLoading(false);
      //   setClaimingChest(false);

      //   setIsChestOpen(false);
      //   window.alertify.error(result?.message);
      //   onChestStatus("error");
      //   setTimeout(() => {
      //     onChestStatus("initial");
      //   }, 3000);
      // }
    }
  };

  let count = 1;

  const handleCheckIfTxExists = async (
    email,
    txHash,
    chestIndex,
    chainText
  ) => {
    if (window.WALLET_TYPE !== "binance") {
      const txResult = await window.web3.eth
        .getTransaction(txHash)
        .catch((e) => {
          console.error(e);
        });

      console.log(txResult);

      if (txResult) {
        getUserRewardsByChest(email, txHash, chestIndex, chainText);
      } else {
        if (count < 10) {
          setTimeout(
            () => {
              handleCheckIfTxExists(txHash);
            },
            count === 9 ? 5000 : 2000
          );
        } else {
          window.alertify.error("Something went wrong.");
          onChestStatus("error");
          onLoadingChest(false);
          setLoading(false);
          setClaimingChest(false);
          setTimeout(() => {
            onChestStatus("initial");
          }, 3000);
        }
      }
      count = count + 1;
    } else if (window.WALLET_TYPE === "binance") {
      const txResult_binance = await binanceW3WProvider
        .getTransaction(txHash)
        .catch((e) => {
          console.error(e);
        });
      console.log(txResult_binance);

      if (txResult_binance) {
        getUserRewardsByChest(email, txHash, chestIndex, chainText);
      } else {
        if (count < 10) {
          setTimeout(
            () => {
              handleCheckIfTxExists(txHash);
            },
            count === 9 ? 5000 : 2000
          );
        } else {
          window.alertify.error("Something went wrong.");
          onChestStatus("error");
          onLoadingChest(false);
          setLoading(false);
          setClaimingChest(false);
          setTimeout(() => {
            onChestStatus("initial");
          }, 3000);
        }
      }
      count = count + 1;
    }
  };

  const handleOpenChest = async () => {
    onChestStatus("waiting");
    onLoadingChest(true);
    setLoading(true);
    setClaimingChest(true);

    setTimeout(() => {
      onClaimRewards(chestId) 
        // setIsChestOpen(true);
        onChestStatus("initial");
        onLoadingChest(false);
        setLoading(false);
        setClaimingChest(false);
    }, 2000);

    // window.web3 = new Web3(window.ethereum);
    // const daily_bonus_contract = new window.web3.eth.Contract(
    //   window.DAILY_BONUS_ABI,
    //   window.config.daily_bonus_address
    // );

    // const daily_bonus_contract_bnb = new window.web3.eth.Contract(
    //   window.DAILY_BONUS_BNB_ABI,
    //   window.config.daily_bonus_bnb_address
    // );

    // const daily_bonus_contract_skale = new window.web3.eth.Contract(
    //   window.DAILY_BONUS_SKALE_ABI,
    //   window.config.daily_bonus_skale_address
    // );

    // const daily_bonus_contract_core = new window.web3.eth.Contract(
    //   window.DAILY_BONUS_CORE_ABI,
    //   window.config.daily_bonus_core_address
    // );

    // const daily_bonus_contract_viction = new window.web3.eth.Contract(
    //   window.DAILY_BONUS_VICTION_ABI,
    //   window.config.daily_bonus_viction_address
    // );

    // const daily_bonus_contract_manta = new window.web3.eth.Contract(
    //   window.DAILY_BONUS_MANTA_ABI,
    //   window.config.daily_bonus_manta_address
    // );

    // const daily_bonus_contract_taiko = new window.web3.eth.Contract(
    //   window.DAILY_BONUS_TAIKO_ABI,
    //   window.config.daily_bonus_taiko_address
    // );

    // console.log(daily_bonus_contract);
    // if (chainId === 204) {
    //   if (window.WALLET_TYPE !== "binance") {
    //     if (rewardTypes === "premium" && isPremium) {
    //       await daily_bonus_contract.methods
    //         .openPremiumChest()
    //         .send({
    //           from: address,
    //         })
    //         .then((data) => {
    //           getUserRewardsByChest(
    //             email,
    //             data.transactionHash,
    //             chestIndex - 1,
    //             "opbnb"
    //           );
    //         })
    //         .catch((e) => {
    //           window.alertify.error(e?.message);
    //           onChestStatus("error");
    //           setTimeout(() => {
    //             onChestStatus("initial");
    //           }, 3000);
    //           onLoadingChest(false);
    //           setLoading(false);
    //           setClaimingChest(false);

    //           console.error(e);
    //         });
    //     } else if (rewardTypes === "standard") {
    //       await daily_bonus_contract.methods
    //         .openChest()
    //         .send({
    //           from: address,
    //         })
    //         .then((data) => {
    //           getUserRewardsByChest(
    //             email,
    //             data.transactionHash,
    //             chestIndex - 1,
    //             "opbnb"
    //           );
    //         })
    //         .catch((e) => {
    //           console.error(e);
    //           window.alertify.error(e?.message);
    //           onChestStatus("error");
    //           setTimeout(() => {
    //             onChestStatus("initial");
    //           }, 3000);
    //           onLoadingChest(false);
    //           setLoading(false);
    //           setClaimingChest(false);
    //         });
    //     }
    //   } else if (window.WALLET_TYPE === "binance") {
    //     const daily_bonus_contract_opbnb_binance = new ethers.Contract(
    //       window.config.daily_bonus_address,
    //       window.DAILY_BONUS_ABI,
    //       binanceW3WProvider.getSigner()
    //     );
    //     if (rewardTypes === "premium" && isPremium) {
    //       const txResponse = await daily_bonus_contract_opbnb_binance
    //         .openPremiumChest()
    //         .catch((e) => {
    //           window.alertify.error(e?.message);
    //           onChestStatus("error");
    //           setTimeout(() => {
    //             onChestStatus("initial");
    //           }, 3000);
    //           onLoadingChest(false);
    //           setLoading(false);
    //           setClaimingChest(false);

    //           console.error(e);
    //         });
    //       const txReceipt = await txResponse.wait();
    //       if (txReceipt) {
    //         getUserRewardsByChest(
    //           email,
    //           txResponse.hash,
    //           chestIndex - 1,
    //           "opbnb"
    //         );
    //       }
    //     } else if (rewardTypes === "standard") {
    //       const txResponse = await daily_bonus_contract_opbnb_binance
    //         .openChest()
    //         .catch((e) => {
    //           console.error(e);
    //           window.alertify.error(e?.message);
    //           onChestStatus("error");
    //           setTimeout(() => {
    //             onChestStatus("initial");
    //           }, 3000);
    //           onLoadingChest(false);
    //           setLoading(false);
    //           setClaimingChest(false);
    //         });

    //       const txReceipt = await txResponse.wait();
    //       if (txReceipt) {
    //         getUserRewardsByChest(
    //           email,
    //           txResponse.hash,
    //           chestIndex - 1,
    //           "opbnb"
    //         );
    //       }
    //     }
    //   }
    // }
  };

  const handleChestClick = () => {
    if (!isPremium && rewardTypes === "premium") {
      onShake();
      return;
    }
    if (!disableBtn || open) {
      if (!open && !ischestOpen) {
        handleOpenChest();
        // handleShowRewards(100, 100);
      } else {
        // handleShowRewards(chestId, chestIndex - 1);
        console.log();
      }
    }
  };

  useEffect(() => {
    if (!isPremium && rewardTypes === "premium") {
      setIsChestOpen(false);
    }
  }, [isPremium, rewardTypes]);

  useEffect(() => {
    setIsChestOpen(false);
  }, [isPremium, rewardTypes]);

  const onShake = () => {
    setShake(true);
    new Audio(errorSound).play();
    setTimeout(() => {
      setShake(false);
    }, 1000);
  };

  return (
    <div
      className={`new-chest-item ${open && "new-chest-item-open"}  ${
        isActive === chestId &&
        isActiveIndex === chestIndex &&
        "chest-item-active"
      } ${selectedChest === chestId ? "selected-new-chest" : ""} 
      ${claimingChest === true ? "disable-chest" : ""}
      d-flex align-items-center justify-content-center position-relative`}
      onClick={() => handleChestClick()}
      style={{
        pointerEvents: !disableBtn && !buyNftPopup ? "auto" : "none",
      }}
    >
      {/* <img
    className='new-chest-item-img'
      src={require(`../../screens/Account/src/Components/WalletBalance/chestImages/premium/blueCrystal${
        !open ? "" :  "OpenGems"
      }.png`)}
      
      alt=""
      style={{ position: "relative", bottom: "5px", filter: item.premium && "blur(5px)" }}
    /> */}
      {rewardTypes !== "premium" ? (
        <img
          className={` ${"new-chest-item-img"} ${loading ? "chest-shake" : ""}`}
          src={require(`./assets/${
            'axe'
          }.png`)}
          alt=""
          style={{
            position: "relative",
            bottom: "5px",
            filter: rewardTypes === "premium" && !isPremium && "blur(5px)",
          }}
        />
      ) : rewardTypes === "premium" && dummypremiumChests ? (
        <img
          className={`new-chest-item-img ${
            loading ? ("chest-shake") : ""
          }`}
          src={require(`./assets/${
            'axe'
          }.png`)}
          alt=""
          style={{
            position: "relative",
            bottom: "5px",
            filter: rewardTypes === "premium" && !isPremium && "blur(5px)",
          }}
        />
      ) : (
        <></>
      )}
      {rewardTypes === "premium" && !isPremium && (
        <img
          src={premiumLock}
          className={`premium-lock ${shake && "shake-lock"}`}
          alt=""
        />
      )}
      <div className="new-claim-chest-btn d-flex align-items-center justify-content-center">
        {open ? "Claimed" : rewardTypes === "premium" ? "Hit" : "Hit "}
      </div>
    </div>
  );
};

export default NewChestItem;
