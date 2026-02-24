import React, { useState, useEffect } from "react";
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
  isConnected,
  onCrackStone,
  openedChests,
}) => {
  const [shake, setShake] = useState(false);
  const [ischestOpen, setIsChestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

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
          "https://worldofdypiansdailybonus.azurewebsites.net/api/ClaimRewardsDypius?code=Q6OVWg82RaFtFXAvCUI4pgoLwnUYsW2o1_ViSOTUp7ugAzFuGxIghw%3D%3D",
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
        if (chainText === "base" && openedChests.length === 19) {
          onCrackStone("successGem");
          setTimeout(() => {
            onClaimRewards(result.data);
            setIsChestOpen(true);
            // onChestStatus("initial");
            onLoadingChest(false);
            setLoading(false);
            setClaimingChest(false);
          }, 1000);
        } else if (chainText === "opbnb" && openedChests.length === 19) {
          onCrackStone("successGem");
          setTimeout(() => {
            onClaimRewards(result.data);
            setIsChestOpen(true);
            // onChestStatus("initial");
            onLoadingChest(false);
            setLoading(false);
            setClaimingChest(false);
          }, 1000);
        } else {
          onCrackStone("success");
          setTimeout(() => {
            onClaimRewards(result.data);
            setIsChestOpen(true);
            // onChestStatus("initial");
            onLoadingChest(false);
            setLoading(false);
            setClaimingChest(false);
          }, 1000);
        }
      }
    } else {
      const result = await axios
        .post(
          "https://worldofdypiansdailybonus.azurewebsites.net/api/ClaimRewardsDypius?code=Q6OVWg82RaFtFXAvCUI4pgoLwnUYsW2o1_ViSOTUp7ugAzFuGxIghw%3D%3D",
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
        onClaimRewards(result.data);
        setIsChestOpen(true);
        // onChestStatus("success");
        onLoadingChest(false);
        setLoading(false);
        setClaimingChest(false);
      }
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
          "https://worldofdypiansdailybonus.azurewebsites.net/api/ClaimRewardsDypius?code=Q6OVWg82RaFtFXAvCUI4pgoLwnUYsW2o1_ViSOTUp7ugAzFuGxIghw%3D%3D",
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
        if (chainText === "base" && openedChests.length === 19) {
          onCrackStone("successGem");
          setTimeout(() => {
            onClaimRewards(result.data);
            setIsChestOpen(true);
            // onChestStatus("initial");
            onLoadingChest(false);
            setLoading(false);
            setClaimingChest(false);
          }, 1000);
        } else if (chainText === "opbnb" && openedChests.length === 19) {
          onCrackStone("successGem");
          setTimeout(() => {
            onClaimRewards(result.data);
            setIsChestOpen(true);
            // onChestStatus("initial");
            onLoadingChest(false);
            setLoading(false);
            setClaimingChest(false);
          }, 1000);
        } else {
          onCrackStone("success");
          setTimeout(() => {
            onClaimRewards(result.data);
            setIsChestOpen(true);
            // onChestStatus("initial");
            onLoadingChest(false);
            setLoading(false);
            setClaimingChest(false);
          }, 1000);
        }
      }
    } else {
      const result = await axios
        .post(
          "https://worldofdypiansdailybonus.azurewebsites.net/api/ClaimRewardsDypius?code=Q6OVWg82RaFtFXAvCUI4pgoLwnUYsW2o1_ViSOTUp7ugAzFuGxIghw%3D%3D",
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
        onCrackStone("success");
        setTimeout(() => {
          onClaimRewards(result.data);
          setIsChestOpen(true);
          // onChestStatus("initial");
          onLoadingChest(false);
          setLoading(false);
          setClaimingChest(false);
        }, 1000);
      }
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

  // const handleCheckIfAlreadyApproved = async () => {
  //   window.web3 = new Web3(window.ethereum);

  //   const dypBaseSc = new window.web3.eth.Contract(
  //     window.TOKEN_ABI,
  //     window.config.reward_token_dypiusv2_base_address
  //   );

  //   const result = await dypBaseSc.methods
  //     .allowance(coinbase, window.config.daily_bonus_base_address)
  //     .call()
  //     .catch((e) => {
  //       console.error(e);
  //       return false;
  //     });
  //     console.log(Number(result))
  //   if (result != 0 && Number(result) / 1e18 >= 0.001) {
  //     setApproved(true);
  //   } else setApproved(false);
  // };

  const checkStates = async () => {
    if (window.WALLET_TYPE !== "binance") {
      window.web3 = new Web3(window.ethereum);

      const dypBaseSc = new window.web3.eth.Contract(
        window.TOKEN_ABI,
        window.config.reward_token_dypiusv2_base_address
      );
      const dypOpbnbSc = new window.web3.eth.Contract(
        window.TOKEN_ABI,
        window.config.token_dypius_new_opbnb_address
      );

      // chain
      if (chain === "base") {
        const result = await dypBaseSc.methods
          .allowance(coinbase, window.config.daily_bonus_base_address)
          .call()
          .catch((e) => {
            console.error(e);
            return false;
          });

        if (result != 0 && Number(result) / 1e18 >= 0.001) {
          handleOpenChest();
        } else handleApprove();
      } else if (chain === "opbnb") {
        const result = await dypOpbnbSc.methods
          .allowance(coinbase, window.config.daily_bonus_opbnb_address)
          .call()
          .catch((e) => {
            console.error(e);
            return false;
          });

        if (result != 0 && Number(result) / 1e18 >= 0.001) {
          handleOpenChest();
        } else handleApprove();
      }
    } else if (window.WALLET_TYPE === "binance") {
      const dypBaseSc_binance = new ethers.Contract(
        window.config.reward_token_dypiusv2_base_address,
        window.TOKEN_ABI,
        binanceW3WProvider.getSigner()
      );
      const dypOpbnbSc_binance = new ethers.Contract(
        window.config.token_dypius_new_opbnb_address,
        window.TOKEN_ABI,
        binanceW3WProvider.getSigner()
      );
      if (chain === "base") {
        const result = await dypBaseSc_binance
          .allowance(coinbase, window.config.daily_bonus_base_address)
          .catch((e) => {
            console.error(e);
            return false;
          });

        if (result != 0 && Number(result) / 1e18 >= 0.001) {
          handleOpenChest();
        } else handleApprove();
      } else if (chain === "opbnb") {
        const result = await dypOpbnbSc_binance
          .allowance(coinbase, window.config.daily_bonus_opbnb_address)
          .catch((e) => {
            console.error(e);
            return false;
          });

        if (result != 0 && Number(result) / 1e18 >= 0.001) {
          handleOpenChest();
        } else handleApprove();
      }
    }
  };

  const handleApprove = async () => {
    onChestStatus("waiting");
    onLoadingChest(true);
    setLoading(true);
    setClaimingChest(true);
    onCrackStone("start");
    if (window.WALLET_TYPE !== "binance") {
      window.web3 = new Web3(window.ethereum);
      const dypBaseSc = new window.web3.eth.Contract(
        window.TOKEN_ABI,
        window.config.reward_token_dypiusv2_base_address
      );

      const dypOpbnbSc = new window.web3.eth.Contract(
        window.TOKEN_ABI,
        window.config.token_dypius_new_opbnb_address
      );

      if (chain === "base") {
        await dypBaseSc.methods
          .approve(
            window.config.daily_bonus_base_address,
            "99999999999900000000"
          )
          .send({ from: coinbase })
          .then(() => {
            setApproved(true);
            setTimeout(() => {
              handleOpenChest();
            }, 1500);
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
      } else if (chain === "opbnb") {
        await dypOpbnbSc.methods
          .approve(
            window.config.daily_bonus_opbnb_address,
            "99999999999900000000"
          )
          .send({ from: coinbase })
          .then(() => {
            setApproved(true);
            setTimeout(() => {
              handleOpenChest();
            }, 1500);
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
      }
    } else if (window.WALLET_TYPE === "binance") {
      const dypBaseSc_binance = new ethers.Contract(
        window.config.reward_token_dypiusv2_base_address,
        window.TOKEN_ABI,
        binanceW3WProvider.getSigner()
      );

      const dypOpbnbSc_binance = new ethers.Contract(
        window.config.token_dypius_new_opbnb_address,
        window.TOKEN_ABI,
        binanceW3WProvider.getSigner()
      );

      if (chain === "base") {
        const txResponse = await dypBaseSc_binance
          .approve(
            window.config.daily_bonus_base_address,
            "99999999999900000000",
            { from: coinbase }
          )
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

        const txReceipt = await txResponse.wait();
        if (txReceipt) {
          setApproved(true);
          setTimeout(() => {
            handleOpenChest();
          }, 1500);
        }
      } else if (chain === "opbnb") {
        const txResponse = await dypOpbnbSc_binance
          .approve(
            window.config.daily_bonus_opbnb_address,
            "99999999999900000000",
            { from: coinbase }
          )
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

        const txReceipt = await txResponse.wait();
        if (txReceipt) {
          setApproved(true);
          setTimeout(() => {
            handleOpenChest();
          }, 1500);
        }
      }
    }
  };

  const handleOpenChest = async () => {
    onChestStatus("waiting");
    onLoadingChest(true);
    setLoading(true);
    setClaimingChest(true);
    onCrackStone("start");
    if (window.WALLET_TYPE !== "binance") {
      window.web3 = new Web3(window.ethereum);
      const daily_bonus_contract = new window.web3.eth.Contract(
        window.DAILY_BONUS_BASE_ABI,
        window.config.daily_bonus_base_address
      );

      const daily_bonus_opbnb_contract = new window.web3.eth.Contract(
        window.DAILY_BONUS_OPBNB_ABI,
        window.config.daily_bonus_opbnb_address
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
              ...transactionParameters,
            })
            .then((data) => {
              getUserRewardsByChest(
                email,
                data.transactionHash,
                chestIndex - 1,
                "base"
              );
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
              ...transactionParameters,
            })
            .then((data) => {
              getUserRewardsByChest(
                email,
                data.transactionHash,
                chestIndex - 1,
                "base"
              );
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
      } else if (chainId === 204) {
        if (rewardTypes === "premium" && isPremium) {
          const gasPrice = await window.opbnbWeb3.eth.getGasPrice();
          console.log("gasPrice", gasPrice);
          const currentGwei = window.web3.utils.fromWei(gasPrice, "gwei");
          const transactionParameters = {
            gasPrice: window.web3.utils.toWei(currentGwei.toString(), "gwei"),
          };

          await daily_bonus_opbnb_contract.methods
            .openPremiumChest()
            .estimateGas({ from: address })
            .then((gas) => {
              transactionParameters.gas = window.web3.utils.toHex(gas);
            })
            .catch(function (error) {
              console.log(error);
            });
          console.log(transactionParameters);

          await daily_bonus_opbnb_contract.methods
            .openPremiumChest()
            .send({
              from: address,
              ...transactionParameters,
            })
            .then((data) => {
              getUserRewardsByChest(
                email,
                data.transactionHash,
                chestIndex - 1,
                "opbnb"
              );
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
          const gasPrice = await window.opbnbWeb3.eth.getGasPrice();
          console.log("gasPrice", gasPrice);
          const currentGwei = window.web3.utils.fromWei(gasPrice, "gwei");
          const transactionParameters = {
            gasPrice: window.web3.utils.toWei(currentGwei.toString(), "gwei"),
          };

          await daily_bonus_opbnb_contract.methods
            .openChest()
            .estimateGas({ from: address })
            .then((gas) => {
              transactionParameters.gas = window.web3.utils.toHex(gas);
            })
            .catch(function (error) {
              console.log(error);
            });
          console.log(transactionParameters);

          await daily_bonus_opbnb_contract.methods
            .openChest()
            .send({
              from: address,
              ...transactionParameters,
            })
            .then((data) => {
              getUserRewardsByChest(
                email,
                data.transactionHash,
                chestIndex - 1,
                "opbnb"
              );
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
    } else if (window.WALLET_TYPE === "binance") {
      const daily_bonus_contract_binance = new ethers.Contract(
        window.config.daily_bonus_base_address,
        window.DAILY_BONUS_BASE_ABI,
        binanceW3WProvider.getSigner()
      );

      const daily_bonus_opbnb_contract_binance = new ethers.Contract(
        window.config.daily_bonus_opbnb_address,
        window.DAILY_BONUS_OPBNB_ABI,
        binanceW3WProvider.getSigner()
      );

      if (chainId === 8453) {
        if (rewardTypes === "premium" && isPremium) {
          const gasPrice = await binanceW3WProvider.getGasPrice();
          const currentGwei = ethers.utils.formatUnits(gasPrice, "gwei");
          const gasPriceInWei = ethers.utils.parseUnits(
            currentGwei.toString().slice(0, 14),
            "gwei"
          );

          const transactionParameters = {
            gasPrice: gasPriceInWei,
          };

          let gasLimit;
          try {
            gasLimit =
              await daily_bonus_contract_binance.estimateGas.openPremiumChest();
            transactionParameters.gasLimit = gasLimit;
            console.log("transactionParameters", transactionParameters);
          } catch (error) {
            console.error(error);
          }

          const txResponse = await daily_bonus_contract_binance
            .openPremiumChest({
              from: address,
              ...transactionParameters,
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
          const txReceipt = await txResponse.wait();
          if (txReceipt) {
            getUserRewardsByChest(
              email,
              txResponse.hash,
              chestIndex - 1,
              "base"
            );
          }
        } else if (rewardTypes === "standard") {
          const gasPrice = await binanceW3WProvider.getGasPrice();
          const currentGwei = ethers.utils.formatUnits(gasPrice, "gwei");
          const gasPriceInWei = ethers.utils.parseUnits(
            currentGwei.toString().slice(0, 14),
            "gwei"
          );

          const transactionParameters = {
            gasPrice: gasPriceInWei,
          };

          let gasLimit;
          try {
            gasLimit =
              await daily_bonus_contract_binance.estimateGas.openChest();
            transactionParameters.gasLimit = gasLimit;
            console.log("transactionParameters", transactionParameters);
          } catch (error) {
            console.error(error);
          }

          const txResponse = await daily_bonus_contract_binance
            .openChest({
              from: address,
              ...transactionParameters,
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
          const txReceipt = await txResponse.wait();
          if (txReceipt) {
            getUserRewardsByChest(
              email,
              txResponse.hash,
              chestIndex - 1,
              "base"
            );
          }
        }
      } else if (chainId === 204) {
        if (rewardTypes === "premium" && isPremium) {
          const gasPrice = await binanceW3WProvider.getGasPrice();
          const currentGwei = ethers.utils.formatUnits(gasPrice, "gwei");
          const gasPriceInWei = ethers.utils.parseUnits(
            currentGwei.toString().slice(0, 14),
            "gwei"
          );

          const transactionParameters = {
            gasPrice: gasPriceInWei,
          };

          let gasLimit;
          try {
            gasLimit =
              await daily_bonus_opbnb_contract_binance.estimateGas.openPremiumChest();
            transactionParameters.gasLimit = gasLimit;
            console.log("transactionParameters", transactionParameters);
          } catch (error) {
            console.error(error);
          }

          const txResponse = await daily_bonus_opbnb_contract_binance
            .openPremiumChest({
              from: address,
              ...transactionParameters,
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
          const txReceipt = await txResponse.wait();
          if (txReceipt) {
            getUserRewardsByChest(
              email,
              txResponse.hash,
              chestIndex - 1,
              "opbnb"
            );
          }
        } else if (rewardTypes === "standard") {
          const gasPrice = await binanceW3WProvider.getGasPrice();
          const currentGwei = ethers.utils.formatUnits(gasPrice, "gwei");
          const gasPriceInWei = ethers.utils.parseUnits(
            currentGwei.toString().slice(0, 14),
            "gwei"
          );

          const transactionParameters = {
            gasPrice: gasPriceInWei,
          };

          let gasLimit;
          try {
            gasLimit =
              await daily_bonus_opbnb_contract_binance.estimateGas.openChest();
            transactionParameters.gasLimit = gasLimit;
            console.log("transactionParameters", transactionParameters);
          } catch (error) {
            console.error(error);
          }
          const txResponse = await daily_bonus_opbnb_contract_binance
            .openChest({
              from: address,
              ...transactionParameters,
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
          const txReceipt = await txResponse.wait();
          if (txReceipt) {
            getUserRewardsByChest(
              email,
              txResponse.hash,
              chestIndex - 1,
              "opbnb"
            );
          }
        }
      }
    }
  };

  const handleChestClick = () => {
    if (!isPremium && rewardTypes === "premium") {
      // onShake();
      return;
    }
    if (!disableBtn || open) {
      if (!open && !ischestOpen) {
        handleOpenChest();
        // if (approved) {
        //   handleOpenChest();
        // } else handleApprove();
        // handleShowRewards(100, 100);
      } else {
        handleShowRewards(chestId, chestIndex - 1);
      }
    }
  };

  // const onShake = () => {
  //   setShake(true);
  //   new Audio(errorSound).play();
  //   setTimeout(() => {
  //     setShake(false);
  //   }, 1000);
  // };

  useEffect(() => {
    setIsChestOpen(false);
  }, [isPremium, rewardTypes]);

  useEffect(() => {
    if (!isPremium && rewardTypes === "premium") {
      setIsChestOpen(false);
    }
  }, [isPremium, rewardTypes]);

  return (
    <div
      className={`new-chest-item ${open && "new-chest-item-open"}  ${
        isActive === chestId &&
        isActiveIndex === chestIndex &&
        "chest-item-active"
      }   
      ${claimingChest === true ? "disable-chest" : ""}
      d-flex align-items-center justify-content-center position-relative`}
      onClick={() => handleChestClick()}
      style={{
        pointerEvents: !disableBtn && !buyNftPopup ? "auto" : "none",
      }}
    >
      <img
        className={` ${"new-chest-item-img"} ${loading ? "chest-shake" : ""}`}
        src={`https://cdn.worldofdypians.com/tools/axes/${chestIndex}.png`}
        alt=""
        style={{
          position: "relative",
          bottom: "5px",
          filter: rewardTypes === "premium" && !isPremium && "blur(5px)",
        }}
      />

      {rewardTypes === "premium" && !isPremium && (
        <img
          src={"https://cdn.worldofdypians.com/tools/premiumLock.png"}
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
