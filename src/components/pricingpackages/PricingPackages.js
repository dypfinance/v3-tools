import React, { useEffect, useState } from "react";
import "./pricingpackages.css";
import greenCheck from "./assets/greenCheck.svg";
import OutsideClickHandler from "react-outside-click-handler";
import BundlePopup from "./BundlePopup";
import UnlockPopup from "./UnlockPopup";
import axios from "axios";
import getFormattedNumber from "../../functions/get-formatted-number";
import Web3 from "web3";
import { handleSwitchNetworkhook } from "../../functions/hooks";
import { ethers } from "ethers";

const PricingPackages = ({
  dypBalance,
  networkId,
  isConnected,
  coinbase,
  handleConnection,
  onRefreshBalance,
  handleSwitchNetwork,
  handleSwitchChainBinanceWallet,
  binanceW3WProvider,
}) => {
  const [popup, setPopup] = useState(false);
  const [withdrawPopup, setWithdrawPopup] = useState(false);
  const [firstLock, setFirstLock] = useState(false);
  const [secondLock, setSecondLock] = useState(false);
  const [thirdLock, setThirdLock] = useState(false);

  const [activeBundle, setActiveBundle] = useState(null);
  const [bundlePrices, setBundlePrices] = useState({
    basic: {
      priceInDyp: 0,
      priceInUsd: 0,
    },
    advanced: {
      priceInDyp: 0,
      priceInUsd: 0,
    },
    enterprise: {
      priceInDyp: 0,
      priceInUsd: 0,
    },
  });

  const [cliffTime, setcliffTime] = useState(0);
  const [cliffTimeAdvanced, setcliffTimeAdvanced] = useState(0);
  const [cliffTimeEnterprise, setcliffTimeEnterprise] = useState(0);

  const [pendingTokens, setpendingTokens] = useState(0);
  const [userClaimedTokens, setuserClaimedTokens] = useState(0);
  const [userVestedTokens, setuserVestedTokens] = useState(0);

  const [pendingTokensAdvanced, setpendingTokensAdvanced] = useState(0);
  const [userClaimedTokensAdvanced, setuserClaimedTokensAdvanced] = useState(0);
  const [userVestedTokensAdvanced, setuserVestedTokensAdvanced] = useState(0);

  const [pendingTokensEnterprise, setpendingTokensEnterprise] = useState(0);
  const [userClaimedTokensEnterprise, setuserClaimedTokensEnterprise] =
    useState(0);
  const [userVestedTokensEnterprise, setuserVestedTokensEnterprise] =
    useState(0);

  const [canUnlock, setcanUnlock] = useState(false);
  const [unlockLoading, setunlockLoading] = useState(false);
  const [unlockStatus, setunlockStatus] = useState("initial");

  const [canUnlockAdvanced, setcanUnlockAdvanced] = useState(false);
  const [unlockLoadingAdvanced, setunlockLoadingAdvanced] = useState(false);
  const [unlockStatusAdvanced, setunlockStatusAdvanced] = useState("initial");

  const [canUnlockEnterprise, setcanUnlockEnterprise] = useState(false);
  const [unlockLoadingEnterprise, setunlockLoadingEnterprise] = useState(false);
  const [unlockStatusEnterprise, setunlockStatusEnterprise] =
    useState("initial");

  const { BigNumber } = window;

  const basicBenefits = [
    "Token Contract Development",
    "Token Lock, Vesting, and TimeLock Contracts",
    "Audit Advisory",
    "Governance Setup",
    "Tokenomics Advisory",
    "Wallet Integration Support",
    "Marketing Strategy Guidance",
    "Partnership Consultation",
    "3-Month Ongoing Support",
  ];

  const premiumBenefits = [
    "Everything in Basic Plan plus:",
    "Staking Smart Contracts",
    "Farming Smart Contracts",
    "NFT Smart Contract Development",
    "API Contract Integrations",
    "Pitch Deck Creation",
    "Dedicated Marketing Campaign",
    "Access to Partner Networks",
    "6-Month Ongoing Support",
  ];

  const enterpriseBenefits = [
    "Everything in Advanced Plan plus:",
    "Bridge Development (Cross-Chain Integration)",
    "Utility Smart Contracts",
    "Telegram Mini-App Development",
    "Launchpool Development",
    "Web3 Mini-Game Development",
    "World of Dypians Marketing Collaboration",
    "Access to VC Network",
    "12-Month Ongoing Support",
  ];

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

  const getBundlePrices = async () => {
    const basic_bundle_sc = new window.infuraWeb3.eth.Contract(
      window.BASIC_BUNDLE_ABI,
      window.config.basic_bundle_address
    );

    const advanced_bundle_sc = new window.infuraWeb3.eth.Contract(
      window.ADVANCED_BUNDLE_ABI,
      window.config.advanced_bundle_address
    );

    const enterprise_bundle_sc = new window.infuraWeb3.eth.Contract(
      window.ENTERPRISE_BUNDLE_ABI,
      window.config.enterprise_bundle_address
    );

    let priceInDypBasic = await basic_bundle_sc.methods
      .getAmountMinDeposit()
      .call()
      .catch((e) => {
        console.error(e);
        return 0;
      });

    let priceInDypBasic2 = new BigNumber(priceInDypBasic)
      .times(1002)
      .div(1000)
      .toFixed(6);

    let formatted_priceInDypBasic = priceInDypBasic2 / 10 ** 18;

    let priceInDollarBasic = await basic_bundle_sc.methods
      .minAmountDollar()
      .call()
      .catch((e) => {
        console.error(e);
        return 0;
      });
    priceInDollarBasic = new BigNumber(priceInDollarBasic).toFixed(0);

    let formatted_priceInDollarBasic = (priceInDollarBasic / 10 ** 18).toFixed(
      0
    );

    let priceInDypAdvanced = await advanced_bundle_sc.methods
      .getAmountMinDeposit()
      .call()
      .catch((e) => {
        console.error(e);
        return 0;
      });

    let priceInDypAdvanced2 = new BigNumber(priceInDypAdvanced)
      .times(1002)
      .div(1000)
      .toFixed(6);

    let formatted_priceInDypAdvanced = priceInDypAdvanced2 / 10 ** 18;

    let priceInDollarAdvanced = await advanced_bundle_sc.methods
      .minAmountDollar()
      .call()
      .catch((e) => {
        console.error(e);
        return 0;
      });

    priceInDollarAdvanced = new BigNumber(priceInDollarAdvanced).toFixed(0);

    let formatted_priceInDollarAdvanced = (
      priceInDollarAdvanced /
      10 ** 18
    ).toFixed(0);

    let priceInDypEnterprise = await enterprise_bundle_sc.methods
      .getAmountMinDeposit()
      .call()
      .catch((e) => {
        console.error(e);
        return 0;
      });

    let priceInDypEnterprise2 = new BigNumber(priceInDypEnterprise)
      .times(1002)
      .div(1000)
      .toFixed(6);

    let formatted_priceInDypEnterprise = priceInDypEnterprise2 / 10 ** 18;

    let priceInDollarEnterprise = await enterprise_bundle_sc.methods
      .minAmountDollar()
      .call()
      .catch((e) => {
        console.error(e);
        return 0;
      });

    priceInDollarEnterprise = new BigNumber(priceInDollarEnterprise).toFixed(0);

    let formatted_priceInDollarEnterprise = (
      priceInDollarEnterprise /
      10 ** 18
    ).toFixed(0);
    setBundlePrices({
      basic: {
        priceInDyp: formatted_priceInDypBasic,
        priceInUsd: formatted_priceInDollarBasic,
      },
      advanced: {
        priceInDyp: formatted_priceInDypAdvanced,
        priceInUsd: formatted_priceInDollarAdvanced,
      },
      enterprise: {
        priceInDyp: formatted_priceInDypEnterprise,
        priceInUsd: formatted_priceInDollarEnterprise,
      },
    });
  };

  const getInfo = async () => {
    const basic_bundle_sc = new window.infuraWeb3.eth.Contract(
      window.BASIC_BUNDLE_ABI,
      window.config.basic_bundle_address
    );

    const advanced_bundle_sc = new window.infuraWeb3.eth.Contract(
      window.ADVANCED_BUNDLE_ABI,
      window.config.advanced_bundle_address
    );

    const enterprise_bundle_sc = new window.infuraWeb3.eth.Contract(
      window.ENTERPRISE_BUNDLE_ABI,
      window.config.enterprise_bundle_address
    );

    //getPendingUnlocked(address _holder) -> It will give you the pending tokens that are available to Claim;
    let tokensToClaimAmount = 0;
    if (coinbase) {
      tokensToClaimAmount = await basic_bundle_sc.methods
        .getPendingUnlocked(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
          return 0;
        });
    }

    const tokensToClaimAmount_formatted = new window.BigNumber(
      tokensToClaimAmount / 1e18
    ).toFixed(6);
    setcanUnlock(tokensToClaimAmount_formatted > 0);
    setpendingTokens(tokensToClaimAmount_formatted);

    let tokensToClaimAmountAdvanced = 0;
    if (coinbase) {
      tokensToClaimAmountAdvanced = await advanced_bundle_sc.methods
        .getPendingUnlocked(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
          return 0;
        });
    }

    const tokensToClaimAmountAdvanced_formatted = new window.BigNumber(
      tokensToClaimAmountAdvanced / 1e18
    ).toFixed(6);
    setcanUnlockAdvanced(tokensToClaimAmountAdvanced_formatted > 0);
    setpendingTokensAdvanced(tokensToClaimAmountAdvanced_formatted);

    let tokensToClaimAmountEnterprise = 0;
    if (coinbase) {
      tokensToClaimAmountEnterprise = await enterprise_bundle_sc.methods
        .getPendingUnlocked(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
          return 0;
        });
    }

    const tokensToClaimAmountEnterprise_formatted = new window.BigNumber(
      tokensToClaimAmountEnterprise / 1e18
    ).toFixed(6);
    setcanUnlockEnterprise(tokensToClaimAmountEnterprise_formatted > 0);
    setpendingTokensEnterprise(tokensToClaimAmountEnterprise_formatted);

    let totalClaimedTokensByUser = 0;
    if (coinbase) {
      totalClaimedTokensByUser = await basic_bundle_sc.methods
        .claimedTokens(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
          return 0;
        });
      const totalClaimedTokensByUser_formatted = new window.BigNumber(
        totalClaimedTokensByUser / 1e18
      ).toFixed(6);

      setuserClaimedTokens(totalClaimedTokensByUser_formatted);
    }

    let totalClaimedTokensByUserAdvanced = 0;
    if (coinbase) {
      totalClaimedTokensByUserAdvanced = await advanced_bundle_sc.methods
        .claimedTokens(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
          return 0;
        });
      const totalClaimedTokensByUserAdvanced_formatted = new window.BigNumber(
        totalClaimedTokensByUserAdvanced / 1e18
      ).toFixed(6);

      setuserClaimedTokensAdvanced(totalClaimedTokensByUserAdvanced_formatted);
    }

    let totalClaimedTokensByUserEnterprise = 0;
    if (coinbase) {
      totalClaimedTokensByUserEnterprise = await enterprise_bundle_sc.methods
        .claimedTokens(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
          return 0;
        });
      const totalClaimedTokensByUserEnterprise_formatted = new window.BigNumber(
        totalClaimedTokensByUserEnterprise / 1e18
      ).toFixed(6);

      setuserClaimedTokensEnterprise(
        totalClaimedTokensByUserEnterprise_formatted
      );
    }

    //claimedTokens(address) -> Return total WOD tokens Claimed in general by single user;
    let totalVestedTokensPerUser = 0;
    if (coinbase) {
      totalVestedTokensPerUser = await basic_bundle_sc.methods
        .vestedTokens(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
          return 0;
        });
      const totalClaimedTokensByUser_formatted = new window.BigNumber(
        totalVestedTokensPerUser / 1e18
      ).toFixed(6);

      setuserVestedTokens(totalClaimedTokensByUser_formatted);
    }

    let totalVestedTokensPerUserAdvanced = 0;
    if (coinbase) {
      totalVestedTokensPerUserAdvanced = await advanced_bundle_sc.methods
        .vestedTokens(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
          return 0;
        });
      const totalVestedTokensPerUserAdvanced_formatted = new window.BigNumber(
        totalVestedTokensPerUserAdvanced / 1e18
      ).toFixed(6);

      setuserVestedTokensAdvanced(totalVestedTokensPerUserAdvanced_formatted);
    }

    let totalVestedTokensPerUserEnterprise = 0;
    if (coinbase) {
      totalVestedTokensPerUserEnterprise = await enterprise_bundle_sc.methods
        .vestedTokens(coinbase)
        .call()
        .catch((e) => {
          console.error(e);
          return 0;
        });
      const totalVestedTokensPerUserEnterprise_formatted = new window.BigNumber(
        totalVestedTokensPerUserEnterprise / 1e18
      ).toFixed(6);

      setuserVestedTokensEnterprise(
        totalVestedTokensPerUserEnterprise_formatted
      );
    }
  };

  const getInfoTimer = async () => {
    const basic_bundle_sc = new window.infuraWeb3.eth.Contract(
      window.BASIC_BUNDLE_ABI,
      window.config.basic_bundle_address
    );

    const advanced_bundle_sc = new window.infuraWeb3.eth.Contract(
      window.ADVANCED_BUNDLE_ABI,
      window.config.advanced_bundle_address
    );

    const enterprise_bundle_sc = new window.infuraWeb3.eth.Contract(
      window.ENTERPRISE_BUNDLE_ABI,
      window.config.enterprise_bundle_address
    );

    const lastClaimedTime = await basic_bundle_sc.methods
      .lastClaimedTime(coinbase)
      .call()
      .catch((e) => {
        console.error(e);
        return 0;
      });

    const lastClaimedTimeAdvanced = await advanced_bundle_sc.methods
      .lastClaimedTime(coinbase)
      .call()
      .catch((e) => {
        console.error(e);
        return 0;
      });

    const lastClaimedTimeEnterprise = await enterprise_bundle_sc.methods
      .lastClaimedTime(coinbase)
      .call()
      .catch((e) => {
        console.error(e);
        return 0;
      });

    setcliffTime(Number(lastClaimedTime * 1000));

    setcliffTimeAdvanced(Number(lastClaimedTimeAdvanced * 1000));

    setcliffTimeEnterprise(Number(lastClaimedTimeEnterprise * 1000));
  };

  const handleWithdraw = async () => {
    setunlockLoading(true);
    if (window.WALLET_TYPE !== "binance") {
      let web3 = new Web3(window.ethereum);
      const basic_bundle_sc = new web3.eth.Contract(
        window.BASIC_BUNDLE_ABI,
        window.config.basic_bundle_address
      );

      const gasPrice = await window.infuraWeb3.eth.getGasPrice();
      console.log("gasPrice", gasPrice);
      const currentGwei = web3.utils.fromWei(gasPrice, "gwei");

      const transactionParameters = {
        gasPrice: web3.utils.toWei(currentGwei.toString(), "gwei"),
      };

      await basic_bundle_sc.methods
        .claim()
        .estimateGas({ from: await window.getCoinbase() })
        .then((gas) => {
          transactionParameters.gas = web3.utils.toHex(gas);
        })
        .catch(function (error) {
          console.log(error);
        });

      await basic_bundle_sc.methods
        .claim()
        .send({ from: await window.getCoinbase(), ...transactionParameters })
        .then(() => {
          setunlockStatus("success");
          setunlockLoading(false);

          setTimeout(() => {
            setunlockStatus("initial");
            getInfo();
            getInfoTimer();
            onRefreshBalance();
          }, 5000);
        })
        .catch((e) => {
          console.error(e);
          window.alertify.error(e?.message);

          setunlockStatus("failed");
          setunlockLoading(false);
          setTimeout(() => {
            setunlockStatus("initial");
          }, 5000);
        });
    } else if (window.WALLET_TYPE === "binance") {
      const basic_bundle_sc = new ethers.Contract(
        window.config.basic_bundle_address,
        window.BASIC_BUNDLE_ABI,
        binanceW3WProvider.getSigner()
      );

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
        gasLimit = await basic_bundle_sc.estimateGas.claim();
        transactionParameters.gasLimit = gasLimit;
        console.log("transactionParameters", transactionParameters);
      } catch (error) {
        console.error(error);
      }

      const txResponse = await basic_bundle_sc
        .claim({ from: coinbase, ...transactionParameters })
        .catch((e) => {
          console.error(e);
          window.alertify.error(e?.message);

          setunlockStatus("failed");
          setunlockLoading(false);
          setTimeout(() => {
            setunlockStatus("initial");
          }, 5000);
        });

      const txReceipt = await txResponse.wait();
      if (txReceipt) {
        setunlockStatus("success");
        setunlockLoading(false);
        setTimeout(() => {
          setunlockStatus("initial");
          getInfo();
          getInfoTimer();
          onRefreshBalance();
        }, 5000);
      }
    }
  };

  const handleWithdrawAdvanced = async () => {
    setunlockLoadingAdvanced(true);
    if (window.WALLET_TYPE !== "binance") {
      let web3 = new Web3(window.ethereum);
      const advanced_bundle_sc = new web3.eth.Contract(
        window.ADVANCED_BUNDLE_ABI,
        window.config.advanced_bundle_address
      );

      const gasPrice = await window.infuraWeb3.eth.getGasPrice();
      console.log("gasPrice", gasPrice);
      const currentGwei = web3.utils.fromWei(gasPrice, "gwei");
      const transactionParameters = {
        gasPrice: web3.utils.toWei(currentGwei.toString(), "gwei"),
      };

      await advanced_bundle_sc.methods
        .claim()
        .estimateGas({ from: await window.getCoinbase() })
        .then((gas) => {
          transactionParameters.gas = web3.utils.toHex(gas);
        })
        .catch(function (error) {
          console.log(error);
        });

      await advanced_bundle_sc.methods
        .claim()
        .send({ from: await window.getCoinbase(), ...transactionParameters })
        .then(() => {
          setunlockStatusAdvanced("success");
          setunlockLoadingAdvanced(false);

          setTimeout(() => {
            setunlockStatusAdvanced("initial");
            getInfo();
            getInfoTimer();
            onRefreshBalance();
          }, 5000);
        })
        .catch((e) => {
          console.error(e);
          window.alertify.error(e?.message);

          setunlockStatusAdvanced("failed");
          setunlockLoadingAdvanced(false);
          setTimeout(() => {
            setunlockStatusAdvanced("initial");
          }, 5000);
        });
    } else if (window.WALLET_TYPE === "binance") {
      const advanced_bundle_sc = new ethers.Contract(
        window.config.advanced_bundle_address,
        window.ADVANCED_BUNDLE_ABI,
        binanceW3WProvider.getSigner()
      );

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
        gasLimit = await advanced_bundle_sc.estimateGas.claim();
        transactionParameters.gasLimit = gasLimit;
        console.log("transactionParameters", transactionParameters);
      } catch (error) {
        console.error(error);
      }

      const txResponse = await advanced_bundle_sc
        .claim({ from: coinbase, ...transactionParameters })
        .catch((e) => {
          console.error(e);
          window.alertify.error(e?.message);

          setunlockStatusAdvanced("failed");
          setunlockLoadingAdvanced(false);
          setTimeout(() => {
            setunlockStatusAdvanced("initial");
          }, 5000);
        });
      const txReceipt = await txResponse.wait();
      if (txReceipt) {
        setunlockStatusAdvanced("success");
        setunlockLoadingAdvanced(false);

        setTimeout(() => {
          setunlockStatusAdvanced("initial");
          getInfo();
          getInfoTimer();
          onRefreshBalance();
        }, 5000);
      }
    }
  };

  const handleWithdrawEnterprise = async () => {
    setunlockLoadingEnterprise(true);
    if (window.WALLET_TYPE !== "binance") {
      let web3 = new Web3(window.ethereum);
      const enterprise_bundle_sc = new web3.eth.Contract(
        window.ENTERPRISE_BUNDLE_ABI,
        window.config.enterprise_bundle_address
      );
      await enterprise_bundle_sc.methods
        .claim()
        .send({ from: await window.getCoinbase() })
        .then(() => {
          setunlockStatusEnterprise("success");
          setunlockLoadingEnterprise(false);

          setTimeout(() => {
            setunlockStatusEnterprise("initial");
            getInfo();
            getInfoTimer();
            onRefreshBalance();
          }, 5000);
        })
        .catch((e) => {
          console.error(e);
          window.alertify.error(e?.message);

          setunlockStatusEnterprise("failed");
          setunlockLoadingEnterprise(false);
          setTimeout(() => {
            setunlockStatusEnterprise("initial");
          }, 5000);
        });
    } else if (window.WALLET_TYPE === "binance") {
      const enterprise_bundle_sc = new ethers.Contract(
        window.config.enterprise_bundle_address,
        window.ENTERPRISE_BUNDLE_ABI,
        binanceW3WProvider.getSigner()
      );
      const txResponse = await enterprise_bundle_sc
        .claim({ from: coinbase })
        .catch((e) => {
          console.error(e);
          window.alertify.error(e?.message);

          setunlockStatusEnterprise("failed");
          setunlockLoadingEnterprise(false);
          setTimeout(() => {
            setunlockStatusEnterprise("initial");
          }, 5000);
        });
      const txReceipt = await txResponse.wait();
      if (txReceipt) {
        setunlockStatusEnterprise("success");
        setunlockLoadingEnterprise(false);

        setTimeout(() => {
          setunlockStatusEnterprise("initial");
          getInfo();
          getInfoTimer();
          onRefreshBalance();
        }, 5000);
      }
    }
  };

  useEffect(() => {
    getInfo();
  }, [coinbase, withdrawPopup]);

  useEffect(() => {
    if (coinbase && isConnected) {
      getInfoTimer();
    }
  }, [coinbase, isConnected]);

  useEffect(() => {
    getBundlePrices();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setFirstLock(userVestedTokens > 0 ? true : false);
    setSecondLock(userVestedTokensAdvanced > 0 ? true : false);
    setThirdLock(userVestedTokensEnterprise > 0 ? true : false);
  }, [userVestedTokens, userVestedTokensAdvanced, userVestedTokensEnterprise]);

  return (
    <>
      <div className="container-lg p-0">
        <div className="row">
          <div className="col-12">
            <div className="migration-banner d-flex flex-column flex-lg-row p-4 gap-3 gap-lg-0 align-items-center justify-content-between mb-4">
              <div className="col-12 col-lg-6">
                <div className="d-flex flex-column gap-2">
                  <h6 className="migration-banner-title mb-0">
                    Build and Grow Your Web3 Project
                  </h6>
                  <p className="migration-banner-desc mb-0">
                    We provide the tools, services, and free support you need to
                    bring your project to life. From development to marketing,
                    our team is here to help you every step of the way.
                  </p>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="d-flex w-100 align-items-center justify-content-end">
                  <div
                    className="pricing-package-buy-wrapper p-3 d-flex align-items-center justify-content-center position-relative"
                    style={{ width: "fit-content" }}
                  >
                    <div className="d-flex flex-column">
                      <span className="package-amount-needed">My Balance:</span>
                      <h6 className="package-plan-price mb-0 text-white">
                        {getFormattedNumber(dypBalance, 2)} DYP
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pricing-grid mt-3">
            <div className="package-plan-wrapper d-flex flex-column justify-content-between">
              <div className="d-flex flex-column gap-2">
                <div className="package-plan-header-holder p-3 d-flex align-items-center justify-content-center flex-column gap-2">
                  <h6 className="package-plan-price text-white mb-0">Basic</h6>
                  {/* <h6 className="mb-0 package-plan-price text-white">
                  5,000 DYP
                </h6> */}
                  <span className="package-benefit text-center">
                    Ideal for projects just starting in Web3.
                  </span>
                </div>
                <div className="d-flex flex-column gap-3 p-3">
                  {basicBenefits.map((item, index) => (
                    <div
                      className="d-flex align-items-center gap-2"
                      key={index}
                    >
                      <img src={greenCheck} alt="" />
                      <span className="package-benefit text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {firstLock ? (
                <div
                  className="pricing-package-buy-wrapper p-3 d-flex flex-column gap-2 align-items-center justify-content-center w-100"
                  style={{ minHeight: "108.8px" }}
                >
                  <div className="d-flex gap-3 align-items-center justify-content-center w-100">
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSf9l087pAlIjiyJQniUXDfbl5OwXUA6nvehCDr-dpsNYVcwEg/viewform"
                      target="_blank"
                      className="btn contact-btn px-5 py-2"
                      style={{ fontSize: "14px" }}
                    >
                      Contact
                    </a>
                    <button
                      className="btn filledbtn px-5 py-2"
                      style={{ fontSize: "14px" }}
                      onClick={() => {
                        setWithdrawPopup(true);
                        setActiveBundle(1);
                      }}
                    >
                      {userVestedTokens - userClaimedTokens > 0
                        ? "Unlock"
                        : "Unlocked"}
                    </button>
                  </div>
                  {userVestedTokens - userClaimedTokens === 0 && (
                    <div
                      className="actionwrapper3 h-auto p-2"
                      style={{ background: "#3a377a" }}
                    >
                      <img
                        src="https://cdn.worldofdypians.com/tools/more-info.svg"
                        alt=""
                        className=""
                      />
                      <span className="actionText3">
                        You are currently using this bundle. You need to upgrade
                        to another bundle to receive support
                      </span>
                    </div>
                  )}
                </div>
              ) : ( null
              
              )}
            </div>
            <div className="package-plan-wrapper main-package-wrapper d-flex flex-column justify-content-between">
              <div className="d-flex flex-column gap-2">
                <div className="package-plan-header-holder main-package-holder position-relative p-3 d-flex align-items-center justify-content-center flex-column gap-2">
                  <div className="top-package-pick px-2 py-1 d-flex align-items-center justify-content-center">
                    <span className="top-package-pick-span">Top Pick</span>
                  </div>
                  <h6 className="package-plan-price text-white mb-0 ">
                    Advanced
                  </h6>
                  {/* <h6 className="mb-0 package-plan-price text-white">15,000 DYP</h6> */}
                  <span className="package-benefit text-center">
                    Perfect for growing teams needing advanced tools and
                    support.
                  </span>
                </div>
                <div className="d-flex flex-column gap-3 p-3">
                  {premiumBenefits.map((item, index) => (
                    <div
                      className="d-flex align-items-center gap-2"
                      key={index}
                    >
                      <img src={greenCheck} alt="" />
                      <span className="package-benefit text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {secondLock ? (
                <div
                  className="pricing-package-buy-wrapper p-3 d-flex flex-column gap-2 align-items-center justify-content-center w-100"
                  style={{ minHeight: "108.8px" }}
                >
                  <div className="d-flex gap-3 align-items-center justify-content-center w-100">
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSf9l087pAlIjiyJQniUXDfbl5OwXUA6nvehCDr-dpsNYVcwEg/viewform"
                      target="_blank"
                      className="btn contact-btn px-5 py-2"
                      style={{ fontSize: "14px" }}
                    >
                      Contact
                    </a>
                    <button
                      className="btn filledbtn px-5 py-2"
                      style={{ fontSize: "14px" }}
                      onClick={() => {
                        setWithdrawPopup(true);
                        setActiveBundle(2);
                      }}
                    >
                      {userVestedTokensAdvanced - userClaimedTokensAdvanced > 0
                        ? "Unlock"
                        : "Unlocked"}
                    </button>
                  </div>
                  {userVestedTokensAdvanced - userClaimedTokensAdvanced ===
                    0 && (
                    <div
                      className="actionwrapper3 h-auto p-2"
                      style={{ background: "#3a377a" }}
                    >
                      <img
                        src="https://cdn.worldofdypians.com/tools/more-info.svg"
                        alt=""
                        className=""
                      />
                      <span className="actionText3">
                        You are currently using this bundle. You need to upgrade
                        to another bundle to receive support
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                null
              
              )}
            </div>
            <div className="package-plan-wrapper d-flex flex-column justify-content-between">
              <div className="d-flex flex-column gap-2">
                <div className="package-plan-header-holder p-3 d-flex align-items-center justify-content-center flex-column gap-2">
                  <h6 className="package-plan-price text-white mb-0">
                    Enterprise
                  </h6>
                  {/* <h6 className="mb-0 package-plan-price text-white">30,000 DYP</h6> */}
                  <span className="package-benefit text-center">
                    Designed for large organizations with custom needs and
                    full-scale solutions.
                  </span>
                </div>
                <div className="d-flex flex-column gap-3 p-3">
                  {enterpriseBenefits.map((item, index) => (
                    <div
                      className="d-flex align-items-center gap-2"
                      key={index}
                    >
                      <img src={greenCheck} alt="" />
                      <span className="package-benefit text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {thirdLock ? (
                <div
                  className="pricing-package-buy-wrapper p-3 d-flex flex-column gap-2 align-items-center justify-content-center w-100"
                  style={{ minHeight: "108.8px" }}
                >
                  <div className="d-flex gap-3 align-items-center justify-content-center w-100">
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSf9l087pAlIjiyJQniUXDfbl5OwXUA6nvehCDr-dpsNYVcwEg/viewform"
                      target="_blank"
                      className="btn contact-btn px-5 py-2"
                      style={{ fontSize: "14px" }}
                    >
                      Contact
                    </a>
                    <button
                      className="btn filledbtn px-5 py-2"
                      style={{ fontSize: "14px" }}
                      onClick={() => {
                        setWithdrawPopup(true);
                        setActiveBundle(3);
                      }}
                    >
                      {userVestedTokensEnterprise -
                        userClaimedTokensEnterprise >
                      0
                        ? "Unlock"
                        : "Unlocked"}
                    </button>
                  </div>
                  {userVestedTokensEnterprise - userClaimedTokensEnterprise ===
                    0 && (
                    <div
                      className="actionwrapper3 h-auto p-2"
                      style={{ background: "#3a377a" }}
                    >
                      <img
                        src="https://cdn.worldofdypians.com/tools/more-info.svg"
                        alt=""
                        className=""
                      />
                      <span className="actionText3">
                        You are currently using this bundle. You need to upgrade
                        to another bundle to receive support
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                null
               
              )}
            </div>
          </div>
        </div>
      </div>
      <OutsideClickHandler onOutsideClick={() => setPopup(false)}>
        <BundlePopup
          dypBalance={dypBalance}
          activeBundle={activeBundle}
          bundlePrices={bundlePrices}
          coinbase={coinbase}
          isConnected={isConnected}
          chainId={networkId}
          handleSwitchNetwork={handleEthPool}
          onConnectWallet={handleConnection}
          setFirstLock={setFirstLock}
          setSecondLock={setSecondLock}
          setThirdLock={setThirdLock}
          active={popup}
          onClose={() => setPopup(false)}
          onRefreshBalance={() => {
            onRefreshBalance();
            getInfoTimer();
            getInfo();
          }}
          binanceW3WProvider={binanceW3WProvider}
        />
      </OutsideClickHandler>
      <OutsideClickHandler onOutsideClick={() => setWithdrawPopup(false)}>
        <UnlockPopup
          active={withdrawPopup}
          onClose={() => setWithdrawPopup(false)}
          isConnected={isConnected}
          chainId={networkId}
          handleSwitchNetwork={handleEthPool}
          onConnectWallet={handleConnection}
          cliffTime={
            activeBundle === 1
              ? cliffTime
              : activeBundle === 2
              ? cliffTimeAdvanced
              : cliffTimeEnterprise
          }
          onTimerFinished={(value) => {
            activeBundle === 1
              ? setcanUnlock(value)
              : activeBundle === 2
              ? setcanUnlockAdvanced(value)
              : setcanUnlockEnterprise(value);
          }}
          canUnlock={
            activeBundle === 1
              ? canUnlock
              : activeBundle === 2
              ? canUnlockAdvanced
              : canUnlockEnterprise
          }
          pendingTokens={
            activeBundle === 1
              ? pendingTokens
              : activeBundle === 2
              ? pendingTokensAdvanced
              : pendingTokensEnterprise
          }
          userClaimedTokens={
            activeBundle === 1
              ? userClaimedTokens
              : activeBundle === 2
              ? userClaimedTokensAdvanced
              : userClaimedTokensEnterprise
          }
          totalVestedTokens={
            activeBundle === 1
              ? userVestedTokens
              : activeBundle === 2
              ? userVestedTokensAdvanced
              : userVestedTokensEnterprise
          }
          handleUnlock={() => {
            activeBundle === 1
              ? handleWithdraw()
              : activeBundle === 2
              ? handleWithdrawAdvanced()
              : handleWithdrawEnterprise();
          }}
          unlockStatus={
            activeBundle === 1
              ? unlockStatus
              : activeBundle === 2
              ? unlockStatusAdvanced
              : unlockStatusEnterprise
          }
          unlockLoading={
            activeBundle === 1
              ? unlockLoading
              : activeBundle === 2
              ? unlockLoadingAdvanced
              : unlockLoadingEnterprise
          }
        />
      </OutsideClickHandler>
    </>
  );
};

export default PricingPackages;
