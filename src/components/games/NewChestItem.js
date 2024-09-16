import React, { useState, useEffect } from "react";
import premiumLock from "./assets/premiumLock.png";
import errorSound from "./assets/error.mp3";
import crackStoneSound from "./assets/stone-crack-sound.mp3";
import crackedStoneSound from "./assets/stone-cracked-sound.mp3";

import axios from "axios";
import Web3 from "web3";

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
  const [approved, setApproved] = useState(false);

  const audiostart = new Audio(crackStoneSound);
  const audioerror = new Audio(errorSound);
  const audiosuccess = new Audio(crackedStoneSound);

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

  const handleCheckIfAlreadyApproved = async () => {
    window.web3 = new Web3(window.ethereum);

    const dypBaseSc = new window.web3.eth.Contract(
      window.TOKEN_ABI,
      window.config.reward_token_dypiusv2_base_address
    );

    const result = await dypBaseSc.methods
      .allowance(coinbase, window.config.daily_bonus_base_address)
      .call()
      .catch((e) => {
        console.error(e);
        return false;
      });
      console.log(Number(result))
    if (result != 0 && Number(result) / 1e18 >= 0.001) {
      setApproved(true);
    } else setApproved(false);
  };

  const handleApprove = async () => {
    onChestStatus("waiting");
    onLoadingChest(true);
    setLoading(true);
    setClaimingChest(true);

    window.web3 = new Web3(window.ethereum);
    const dypBaseSc = new window.web3.eth.Contract(
      window.TOKEN_ABI,
      window.config.reward_token_dypiusv2_base_address
    );

    await dypBaseSc.methods
      .approve(window.config.daily_bonus_base_address, "99999999999900000000")
      .send({ from: coinbase })
      .then(() => {
        setApproved(true);
        setTimeout(() => {
          handleOpenChest();
        }, 1500);
      })
      .catch((e) => {
        console.error(e);
        setApproved(false);
        onChestStatus("");
        onLoadingChest(false);
        setLoading(false);
        setClaimingChest(false);
      });
  };

  const handleOpenChest = async () => {
    onChestStatus("waiting");
    onLoadingChest(true);
    setLoading(true);
    setClaimingChest(true);
    onCrackStone("start");

    window.web3 = new Web3(window.ethereum);
    const daily_bonus_contract = new window.web3.eth.Contract(
      window.DAILY_BONUS_BASE_ABI,
      window.config.daily_bonus_base_address
    );

    if (chainId === 8453) {
      if (rewardTypes === "premium" && isPremium) {

       
        const gasPrice = await window.baseWeb3.eth.getGasPrice();
        console.log("gasPrice", gasPrice);
        const currentGwei = window.web3.utils.fromWei(gasPrice, "gwei");
        const transactionParameters = {
          gasPrice: window.web3.utils.toWei(currentGwei.toString(), "gwei"),
        };

        await daily_bonus_contract.methods
          .openPremiumChest()
          .estimateGas({ from: address })
          .then((gas) => {
            transactionParameters.gas = window.web3.utils.toHex(gas);
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log(transactionParameters);

        await daily_bonus_contract.methods
          .openPremiumChest()
          .send({
            from: address,
            ...transactionParameters
          })
          .then((data) => {
            // getUserRewardsByChest(
            //   email,
            //   data.transactionHash,
            //   chestIndex - 1,
            //   "base"
            // );
            onCrackStone("success");
            setTimeout(() => {
              onClaimRewards(chestId);
              setIsChestOpen(true);
              onChestStatus("initial");
              onLoadingChest(false);
              setLoading(false);
              setClaimingChest(false);
            }, 1000);
          })
          .catch((e) => {
            window.alertify.error(e?.message);
            onChestStatus("error");
            setTimeout(() => {
              onChestStatus("initial");
            }, 3000);
              onCrackStone("error");
            onLoadingChest(false);
            setLoading(false);
            setClaimingChest(false);

            console.error(e);
          });
      } else if (rewardTypes === "standard") {

        const gasPrice = await window.baseWeb3.eth.getGasPrice();
        console.log("gasPrice", gasPrice);
        const currentGwei = window.web3.utils.fromWei(gasPrice, "gwei");
        const transactionParameters = {
          gasPrice: window.web3.utils.toWei(currentGwei.toString(), "gwei"),
        };

        await daily_bonus_contract.methods
          .openChest()
          .estimateGas({ from: address })
          .then((gas) => {
            transactionParameters.gas = window.web3.utils.toHex(gas);
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log(transactionParameters);

        await daily_bonus_contract.methods
          .openChest()
          .send({
            from: address,
            ...transactionParameters
          })
          .then((data) => {
            // getUserRewardsByChest(
            //   email,
            //   data.transactionHash,
            //   chestIndex - 1,
            //   "base"
            // );
            onCrackStone("success");
            setTimeout(() => {
              onClaimRewards(chestId);
              setIsChestOpen(true);
              onChestStatus("initial");
              onLoadingChest(false);
              setLoading(false);
              setClaimingChest(false);
            }, 1000);
          })
          .catch((e) => {
            console.error(e);
            window.alertify.error(e?.message);
            onChestStatus("error");
            setTimeout(() => {
              onChestStatus("initial");
            }, 3000);
              onCrackStone("error");
            onLoadingChest(false);
            setLoading(false);
            setClaimingChest(false);
          });
      }
    }
  };

  const handleChestClick = () => {
    if (!isPremium && rewardTypes === "premium") {
      onShake();
      return;
    }
    if (!disableBtn || open) {
      if (!open && !ischestOpen) {
        if (approved) {
          handleOpenChest();
        } else handleApprove();
        // handleShowRewards(100, 100);
      } else {
        // handleShowRewards(chestId, chestIndex - 1);
        console.log();
      }
    }
  };

  const onShake = () => {
    setShake(true);
    new Audio(errorSound).play();
    setTimeout(() => {
      setShake(false);
    }, 1000);
  };

  const onCrackStone = (event) => {
    if (event === "start") {
      if (!audiostart.loop) {
        audiostart.loop = true;
      }
      audiostart.play();
    }
    if (event === "error") {
      if (audiostart.loop) {
        audiostart.loop = false;
      }
      audiostart.pause();
      audiostart.currentTime = 0;
      audioerror.play();
    }
    if (event === "success") {
      if (audiostart.loop) {
        audiostart.loop = false;
      }
      audiostart.pause();
      audiostart.loop = false;
      audiostart.currentTime = 0;
      audiosuccess.play();
    }
  };

  useEffect(() => {
    setIsChestOpen(false);
  }, [isPremium, rewardTypes]);

  useEffect(() => {
    if (!isPremium && rewardTypes === "premium") {
      setIsChestOpen(false);
    }
  }, [isPremium, rewardTypes]);

  useEffect(() => {
    if (coinbase) {
      handleCheckIfAlreadyApproved();
    }
  }, [coinbase]);

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
          src={require(`./assets/axes/${chestId}.png`)}
          alt=""
          style={{
            position: "relative",
            bottom: "5px",
            filter: rewardTypes === "premium" && !isPremium && "blur(5px)",
          }}
        />
      ) : rewardTypes === "premium" && dummypremiumChests ? (
        <img
          className={`new-chest-item-img ${loading ? "chest-shake" : ""}`}
          src={require(`./assets/${chestId}.png`)}
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
