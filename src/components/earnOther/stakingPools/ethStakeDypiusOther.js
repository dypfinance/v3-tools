import React, { useState, useEffect } from "react";
import moment from "moment";
import getFormattedNumber from "../../../functions/get-formatted-number";  
import Tooltip from "@material-ui/core/Tooltip"; 
import { shortAddress } from "../../../functions/shortAddress";
import { ClickAwayListener } from "@material-ui/core";
import { handleSwitchNetworkhook } from "../../../functions/hooks";
import axios from "axios";
import Modal from "../../Modal/Modal";
import Web3 from "web3";

const StakeDypiusEthOther = ({
  totalTvl,
  selectedPool,
  selectedTab,
  staking,
  is_wallet_connected,
  apr,
  liquidity = "ETH",
  lock,
  expiration_time,
  other_info,
  fee_s,
  fee_u,
  chainId,
  handleConnection,
  lockTime,
  listType,
  handleSwitchNetwork,
  expired,
  finalApr,
  the_graph_result,
  lp_id,
  coinbase,
  referrer,
  fee,
  renderedPage,
  onConnectWallet,
  earlyFee,
  maximumDeposit,
  poolCap,
  livePremiumOnly,
  isPremium,onRefreshTvl
}) => {
  let {
    reward_token_dypius_base,
    BigNumber,
    alertify,
    reward_token_idyp,
    token_dyps,
  } = window;
  let token_symbol = "WETH";

  // token, staking

  const TOKEN_DECIMALS = window.config.token_decimals;

  function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function jsonToCsv(items) {
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(items[0]);
    let csv = items.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    );
    csv.unshift(header.join(","));
    csv = csv.join("\r\n");
    return csv;
  }

  window.handleDownload = ({
    stakers,
    stakingTimes,
    lastClaimedTimes,
    stakedTokens,
  }) => {
    let list = [];
    stakers.forEach((staker, index) => {
      list.push({
        staker_address: staker,
        staking_timestamp_unix: stakingTimes[index],
        lastclaimed_timestamp_unix: lastClaimedTimes[index],
        staking_time: getDate(stakingTimes[index] * 1e3),
        lastclaimed_time: getDate(lastClaimedTimes[index] * 1e3),
        staked_tokens: stakedTokens[index],
      });
    });
    download("stakers-list.csv", jsonToCsv(list));

    function getDate(timestamp) {
      let a = new Date(timestamp);
      return a.toUTCString();
    }
  };

  const [token_balance, settoken_balance] = useState(0);
  const [wethBalance, setWethBalance] = useState(0);
  const [maxDepositAllowed, setmaxDepositAllowed] = useState(0);

  const [pendingDivs, setpendingDivs] = useState("");
  const [totalEarnedTokens, settotalEarnedTokens] = useState("");
  const [cliffTime, setcliffTime] = useState("");
  const [stakingTime, setstakingTime] = useState("");
  const [depositedTokens, setdepositedTokens] = useState("");
  const [canStake, setCanStake] = useState(true);
  const [amountLeft, setamountLeft] = useState(3);

  const [lastClaimedTime, setlastClaimedTime] = useState("");
  const [reInvestLoading, setreInvestLoading] = useState(false);
  const [reInvestStatus, setreInvestStatus] = useState("initial");
  const [depositAmount, setdepositAmount] = useState("");
  const [withdrawAmount, setwithdrawAmount] = useState("");
  const [depositLoading, setdepositLoading] = useState(false);
  const [depositStatus, setdepositStatus] = useState("initial");
  const [claimLoading, setclaimLoading] = useState(false);
  const [claimStatus, setclaimStatus] = useState("initial");
  const [withdrawLoading, setwithdrawLoading] = useState(false);
  const [withdrawStatus, setwithdrawStatus] = useState("initial");
  const [coinbase2, setcoinbase] = useState(
    "0x0000000000000000000000000000000000000111"
  );
  const [tvl, settvl] = useState("");
  const [tvlusd, settvlusd] = useState("");

  const [referralFeeEarned, setreferralFeeEarned] = useState("");
  const [stakingOwner, setstakingOwner] = useState(null);
  const [approxDeposit, setapproxDeposit] = useState(100);
  const [approxDays, setapproxDays] = useState(365);
  const [showCalculator, setshowCalculator] = useState(false);
  const [usdPerToken, setusdPerToken] = useState("");
  const [errorMsg, seterrorMsg] = useState("");
  const [errorMsg2, seterrorMsg2] = useState("");
  const [errorMsg3, seterrorMsg3] = useState("");
  const [contractDeployTime, setcontractDeployTime] = useState("");
  const [disburseDuration, setdisburseDuration] = useState("");
  const [ethPrice, setETHPrice] = useState(0);
  const [settotal_stakers, setsettotal_stakers] = useState("");

  const [show, setshow] = useState(false);
  const [showWithdrawModal, setshowWithdrawModal] = useState(false);
  const [popup, setpopup] = useState(false);

  const [apy, setapy] = useState(false);

  const [performanceTooltip, setperformanceTooltip] = useState(false);
  const [aprTooltip, setaprTooltip] = useState(false);
  const [lockTooltip, setlockTooltip] = useState(false);
  const [depositTooltip, setdepositTooltip] = useState(false);
  const [rewardsTooltip, setrewardsTooltip] = useState(false);
  const [withdrawTooltip, setwithdrawTooltip] = useState(false);
  const [unlockDate, setunlockDate] = useState("");
  const [tokendata, settokendata] = useState();

  const [poolFeeTooltip, setPoolFeeTooltip] = useState(false);
  const [startDateTooltip, setStartDateTooltip] = useState(false);
  const [endDateTooltip, setEndDateTooltip] = useState(false);
  const [poolCapTooltip, setPoolCapTooltip] = useState(false);
  const [quotaTooltip, setQuotaTooltip] = useState(false);
  const [maxDepositTooltip, setMaxDepositTooltip] = useState(false);
  const [approvedAmount, setapprovedAmount] = useState("0.00");
  const [earlyWithdrawTooltip, setEarlyWithdrawTooltip] = useState(false);

  const earlyWithdrawClose = () => {
    setEarlyWithdrawTooltip(false);
  };

  const earlyWithdrawOpen = () => {
    setEarlyWithdrawTooltip(true);
  };

  const poolCapClose = () => {
    setPoolCapTooltip(false);
  };

  const poolCapOpen = () => {
    setPoolCapTooltip(true);
  };

  const quotaClose = () => {
    setQuotaTooltip(false);
  };

  const quotaOpen = () => {
    setQuotaTooltip(true);
  };

  const maxDepositClose = () => {
    setMaxDepositTooltip(false);
  };

  const maxDepositOpen = () => {
    setMaxDepositTooltip(true);
  };

  const poolFeeClose = () => {
    setPoolFeeTooltip(false);
  };

  const poolFeeOpen = () => {
    setPoolFeeTooltip(true);
  };

  const startDateClose = () => {
    setStartDateTooltip(false);
  };

  const startDateOpen = () => {
    setStartDateTooltip(true);
  };

  const endDateClose = () => {
    setEndDateTooltip(false);
  };

  const endDateOpen = () => {
    setEndDateTooltip(true);
  };

  const showModal = () => {
    setshow(true);
  };

  const hideModal = () => {
    setshow(true);
  };

  const showPopup = () => {
    setpopup(true);
  };

  const hidePopup = () => {
    setpopup(false);
  };

  const getETHPrice = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_eth_v2")
      .then((data) => {
        setETHPrice(data.data.the_graph_eth_v2.usd_per_eth);
      });
  };

  const getPriceDYP = async () => {
    const dypprice = await axios
      .get(
        "https://api.geckoterminal.com/api/v2/networks/eth/pools/0x7c81087310a228470db28c1068f0663d6bf88679"
      )
      .then((res) => {
        return res.data.data.attributes.base_token_price_usd;
      })
      .catch((e) => {
        console.log(e);
      });

    setusdPerToken(dypprice);
  };

  const getBalance = async () => {
    try {
      let TOKEN_ABI = window.ERC20_ABI;

      let selectedBuybackToken2 = "0x4200000000000000000000000000000000000006"; // wbnb/wavax
      let web3 = window.baseWeb3;
      let tokenContract = new web3.eth.Contract(
        TOKEN_ABI,
        selectedBuybackToken2
      );
      const result = await tokenContract.methods
        .balanceOf(coinbase)
        .call()
        .catch((e) => {
          console.log(e);
        });

      const result_formatted = new BigNumber(result).div(1e18).toFixed(6);
      setWethBalance(result_formatted);
    } catch (e) {
      console.warn(e);
    }
  };

  const refreshBalance = async () => {
    let coinbase = coinbase2;

    if (window.coinbase_address) {
      coinbase = window.coinbase_address;
      setcoinbase(coinbase);
    }

    try {
      let _bal;
      if (chainId === "8453" && coinbase && is_wallet_connected) {
        _bal = reward_token_dypius_base.balanceOf(coinbase);
      }
      if (staking && coinbase !== undefined && coinbase !== null) {
        let _pDivs = staking.getTotalPendingDivs(coinbase);

        let _tEarned = staking.totalEarnedTokens(coinbase);
        let _stakingTime = staking.stakingTime(coinbase);
        let _dTokens = staking.depositedTokens(coinbase);
        let _lClaimTime = staking.lastClaimedTime(coinbase);
        let _tvl = reward_token_dypius_base.balanceOf(staking._address);
        // console.log('tvl', _tvl)
        let _rFeeEarned = staking.totalReferralFeeEarned(coinbase);
        let tStakers = staking.getNumberOfHolders();

        let [
          token_balance,
          pendingDivs,
          totalEarnedTokens,
          stakingTime,
          depositedTokens,
          lastClaimedTime,
          tvl,
          referralFeeEarned,
          total_stakers,
        ] = await Promise.all([
          _bal,
          _pDivs,
          _tEarned,
          _stakingTime,
          _dTokens,
          _lClaimTime,
          _tvl,
          _rFeeEarned,
          tStakers,
        ]);

        let balance_formatted = new BigNumber(token_balance ?? 0)
          .div(1e18)
          .toString(10);
        settoken_balance(balance_formatted);

        let divs_formatted = new BigNumber(pendingDivs).div(1e18).toFixed(6);
        setpendingDivs(divs_formatted);

        let earnedTokens_formatted = new BigNumber(totalEarnedTokens)
          .div(1e18)
          .toFixed(6);
        settotalEarnedTokens(earnedTokens_formatted);

        setstakingTime(stakingTime);

        let depositedTokens_formatted = new BigNumber(depositedTokens)
          .div(1e18)
          .toString(10);

          const amountLeftToStake = 3 - Number(depositedTokens_formatted);
          setamountLeft(amountLeftToStake);
          if (Number(depositedTokens_formatted) ===3) {
            setCanStake(false);
            seterrorMsg("Maximum deposit per wallet reached!");
          }

        setdepositedTokens(depositedTokens_formatted);

        setlastClaimedTime(lastClaimedTime);

        let tvl_formatted = new BigNumber(tvl).div(1e18).toFixed(6);
        settvl(tvl_formatted);

        setreferralFeeEarned(referralFeeEarned);
        setsettotal_stakers(total_stakers);

        //console.log({tvlUSD})

        let stakingOwner = await staking.owner();
        setstakingOwner(stakingOwner);
      }
    } catch (e) {
      console.error(e);
    }
    if (staking) {
      staking
        .LOCKUP_TIME()
        .then((cliffTime) => {
          setcliffTime(Number(cliffTime));
        })
        .catch(console.error);

      staking.contractStartTime().then((contractDeployTime) => {
        setcontractDeployTime(contractDeployTime);
      });

      staking.REWARD_INTERVAL().then((disburseDuration) => {
        setdisburseDuration(disburseDuration);
      });
    }
  };

  useEffect(() => {
    if (coinbase !== coinbase2 && coinbase !== null && coinbase !== undefined) {
      setcoinbase(coinbase);
    }
  }, [coinbase, coinbase2]);

  useEffect(() => {
    getPriceDYP();
  }, []);

  useEffect(() => {
    if (chainId === "8453") {
      refreshBalance();
      if (depositAmount !== "") {
        checkApproval(depositAmount);
      }
    }
  }, [coinbase, coinbase2, staking, is_wallet_connected, chainId]);

  useEffect(() => {
    if (coinbase && is_wallet_connected) {
      getBalance();
    }
  }, [coinbase, is_wallet_connected]);

  useEffect(() => {
    setdepositAmount("");
    setdepositStatus("initial");
  }, [staking]);

  const handleApprove = async (e) => {
    window.cached_contracts = Object.create(null);
    let selectedBuybackToken2 = "0x4200000000000000000000000000000000000006";
    setdepositLoading(true);

    const web3 = new Web3(window.ethereum)
    let tokenContract = new web3.eth.Contract(window.ERC20_ABI,selectedBuybackToken2);

    let amount = depositAmount;
    amount = new BigNumber(amount).times(1e18).toFixed(0);
    await tokenContract.methods.approve(staking._address, amount).send({from: await window.getCoinbase()})
      .then(() => {
        console.log('success approve')
        setdepositLoading(false);
        setdepositStatus("deposit");
        refreshBalance();
      })
      .catch((e) => {
        setdepositLoading(false);
        setdepositStatus("fail");
        seterrorMsg(e?.message);
        setTimeout(() => {
          setdepositAmount("");
          setdepositStatus("initial");
          seterrorMsg("");
        }, 10000);
      });
  };
  // console.log(staking)
  const handleStake = async (e) => {
    setdepositLoading(true);
    const web3 = new Web3(window.ethereum)
    const stakingSc = new web3.eth.Contract(window.CONSTANT_STAKING_DEFI_ABI, staking._address);

    if (other_info) {
      window.$.alert("This pool no longer accepts deposits!");
      setdepositLoading(false);

      return;
    }

    let amount = depositAmount;
    amount = new BigNumber(amount).times(1e18).toFixed(0);

    // if (referrer) {
    //   referrer = String(referrer).trim().toLowerCase();
    // }

    // if (!window.web3.utils.isAddress(referrer)) {
      referrer = window.config.ZERO_ADDRESS;
    // }
    await stakingSc.methods
      .stake(amount, referrer).send({from: await window.getCoinbase()})
      .then(() => {
        setdepositLoading(false);
        setdepositStatus("success");
        refreshBalance();
        getBalance();
        onRefreshTvl();

        setTimeout(() => {
          setdepositAmount("");
          setdepositStatus("initial");
          seterrorMsg("");
        }, 5000);
      })
      .catch((e) => {
        setdepositLoading(false);
        setdepositStatus("fail");
        seterrorMsg(e?.message);
        setTimeout(() => {
          setdepositAmount("");
          setdepositStatus("initial");
          seterrorMsg("");
        }, 10000);
      });
  };

  const handleWithdraw = async (e) => {
    if (
      moment
        .duration((Number(stakingTime) + 86400 * 60) * 1000 - Date.now())
        .humanize(true)
        ?.includes("ago")
    ) {
      // e.preventDefault();
      let amount = new BigNumber(withdrawAmount).times(1e18).toFixed(0);
      setwithdrawLoading(true);
      const web3 = new Web3(window.ethereum)
      const stakingSc = new web3.eth.Contract(window.CONSTANT_STAKING_DEFI_ABI, staking._address);

      await stakingSc.methods
        .unstake(amount).send({from: await window.getCoinbase()})
        .then(() => {
          setwithdrawLoading(false);
          setwithdrawStatus("success");
          refreshBalance();
          onRefreshTvl();
          setTimeout(() => {
            setwithdrawStatus("initial");
            setwithdrawAmount("");
          }, 3000);
        })
        .catch((e) => {
          setwithdrawLoading(false);
          setwithdrawStatus("failed");
          seterrorMsg3(e?.message);

          setTimeout(() => {
            setwithdrawStatus("initial");
            seterrorMsg3("");
            setwithdrawAmount("");
          }, 10000);
        });
    } else if (
      !moment
        .duration((Number(stakingTime) + Number(cliffTime)) * 1000 - Date.now())
        .humanize(true)
        ?.includes("ago")
    ) {
      setshowWithdrawModal(true);
    }
  };

  const handleWithdraw2 = async (e) => {
    // e.preventDefault();
    let amount = new BigNumber(withdrawAmount).times(1e18).toFixed(0);
    setwithdrawLoading(true);
    const web3 = new Web3(window.ethereum)
    const stakingSc = new web3.eth.Contract(window.CONSTANT_STAKING_DEFI_ABI, staking._address);

    await stakingSc.methods
      .unstake(amount).send({from: await window.getCoinbase()})
      .then(() => {
        setwithdrawLoading(false);
        setwithdrawStatus("success");
        refreshBalance();
        onRefreshTvl();

        setTimeout(() => {
          setwithdrawStatus("initial");
          setwithdrawAmount("");
          setshowWithdrawModal(false);
        }, 3000);
      })
      .catch((e) => {
        setwithdrawLoading(false);
        setwithdrawStatus("failed");
        seterrorMsg3(e?.message);

        setTimeout(() => {
          setwithdrawStatus("initial");
          seterrorMsg3("");
          setwithdrawAmount("");
        }, 10000);
      });
  };

  const handleClaimDivs = async (e) => {
    // e.preventDefault();
    setclaimLoading(true);
    const web3 = new Web3(window.ethereum)
    const stakingSc = new web3.eth.Contract(window.CONSTANT_STAKING_DEFI_ABI, staking._address);

    await stakingSc.methods
      .claim().send({from: await window.getCoinbase()})
      .then(() => {
        setclaimStatus("success");
        setclaimLoading(false);
        setpendingDivs(getFormattedNumber(0, 6));
        refreshBalance();
        setTimeout(() => {
          setclaimStatus("initial");
          seterrorMsg2("");
        }, 5000);
      })
      .catch((e) => {
        setclaimStatus("failed");
        setclaimLoading(false);
        seterrorMsg2(e?.message);

        setTimeout(() => {
          setclaimStatus("initial");
          seterrorMsg2("");
        }, 10000);
      });
  };

  const getMaxDepositAllowed = async () => {
    const stakingContract = new window.baseWeb3.eth.Contract(window.CONSTANT_STAKING_DEFI_ABI, staking?._address);
    const result = await stakingContract.methods.MAX_DEPOSIT().call().catch((e)=>{console.error(e); return 0});
    const result_formatted = new BigNumber(result).div(1e18).toFixed(0);
    setmaxDepositAllowed(Number(result_formatted));
  };

  const handleSetMaxDeposit = (e) => {
    const depositAmount = wethBalance;

    if(Number(depositAmount) > Number(amountLeft)) {
      seterrorMsg("Please add a smaller amount");
      setdepositAmount(amountLeft)
      checkApproval(amountLeft);
    } else if(Number(depositAmount) <= Number(amountLeft)) {
      seterrorMsg("");
      setdepositAmount(depositAmount)
      checkApproval(depositAmount);
    }
  };

  const handleSetMaxWithdraw = async (e) => {
    // e.preventDefault();
    let amount;
    await staking
      .depositedTokens(coinbase)
      .then((data) => {
        amount = data;
      })
      .catch((e) => {
        console.log(e);
        return 0;
      });

    let depositedTokens_formatted = new BigNumber(amount)
      .div(1e18)
      .toString(10);
    setwithdrawAmount(depositedTokens_formatted);
  };

  const getApproxReturn = (depositAmount, days) => {
    return ((depositAmount * apr) / 100 / 365) * days;
  };

  const getReferralLink = () => {
    return window.location.origin + window.location.pathname + "?r=" + coinbase;
  };

  const convertTimestampToDate = (timestamp) => {
    const result = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(timestamp * 1000);
    return result;
  };

  const handleReinvest = async (e) => {
    // e.preventDefault();
    setreInvestStatus("invest");
    setreInvestLoading(true);
    const web3 = new Web3(window.ethereum)
    const stakingSc = new web3.eth.Contract(window.CONSTANT_STAKING_DEFI_ABI, staking._address);

    await stakingSc.methods
      .reInvest().send({from: await window.getCoinbase()})
      .then(() => {
        setreInvestStatus("success");
        setreInvestLoading(false);
        setpendingDivs(getFormattedNumber(0, 6));
        refreshBalance();
      })
      .catch((e) => {
        setreInvestStatus("failed");
        setreInvestLoading(false);
        seterrorMsg2(e?.message);

        setTimeout(() => {
          setreInvestStatus("initial");
          seterrorMsg2("");
        }, 10000);
      });
  };

  const handleEthPool = async () => {
    await handleSwitchNetworkhook("0x2105")
      .then(() => {
        handleSwitchNetwork("8453");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const performanceOpen = () => {
    setperformanceTooltip(true);
  };
  const performanceClose = () => {
    setperformanceTooltip(false);
  };
  const aprOpen = () => {
    setaprTooltip(true);
  };
  const aprClose = () => {
    setaprTooltip(false);
  };
  const lockOpen = () => {
    setlockTooltip(true);
  };
  const lockClose = () => {
    setlockTooltip(false);
  };
  const depositOpen = () => {
    setdepositTooltip(true);
  };
  const depositClose = () => {
    setdepositTooltip(false);
  };
  const rewardsOpen = () => {
    setrewardsTooltip(true);
  };
  const rewardsClose = () => {
    setrewardsTooltip(false);
  };
  const withdrawOpen = () => {
    setwithdrawTooltip(true);
  };
  const withdrawClose = () => {
    setwithdrawTooltip(false);
  };


  const handleCheckAmount = (amount)=>{
    if(Number(amount) > Number(amountLeft)) {
      seterrorMsg("Please add a smaller amount");
      setdepositAmount(amountLeft)
    } else if(Number(amount) <= Number(amountLeft)) {
      seterrorMsg("");
      setdepositAmount(amount)
    }
    checkApproval(amount);
  }

  

  let showDeposit = true;

  if (!isNaN(disburseDuration) && !isNaN(contractDeployTime)) {
    let lastDay = parseInt(disburseDuration) + parseInt(contractDeployTime);
    let lockTimeExpire = parseInt(Date.now()) + parseInt(cliffTime);
    lockTimeExpire = lockTimeExpire.toString().substr(0, 10);
    //console.log("now " + lockTimeExpire)
    //console.log('last ' + lastDay)
    if (lockTimeExpire > lastDay) {
      showDeposit = false;
    }
  }

  let cliffTimeInWords = "lockup period";

  const focusInput = (field) => {
    document.getElementById(field).focus();
  };

  let canWithdraw = true;
  if (lockTime === "No Lock") {
    canWithdraw = true;
  }
  if (!isNaN(cliffTime) && !isNaN(stakingTime)) {
    if (
      Number(stakingTime) + Number(cliffTime) >= Date.now() / 1000 &&
      lockTime !== "No Lock"
    ) {
      canWithdraw = false;
      cliffTimeInWords = moment
        .duration(cliffTime - (Date.now() - stakingTime))
        .humanize(true);
    }
  }

  let tvl_usd = tvlusd / 1e18;

  // tvl_usd = tvl_usd + tvlDYPS;

  tvl_usd = getFormattedNumber(tvl_usd, 2);

  const checkApproval = async (amount) => {
    let selectedBuybackToken2 = "0x4200000000000000000000000000000000000006";

    const result = await window
      .checkapproveStakePool(coinbase, selectedBuybackToken2, staking._address)
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((e) => {
        console.log(e);
        return 0;
      });

    let result_formatted = new BigNumber(result).div(1e18).toFixed(6);
    let result_formatted2 = new BigNumber(result).div(1e18).toFixed(6);

    setapprovedAmount(result_formatted2);
    if (
      Number(result_formatted) >= Number(amount) &&
      Number(result_formatted) !== 0
    ) {
      setdepositStatus("deposit");
    } else {
      setdepositStatus("initial");
    }
  };

  const getUsdPerDyp = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_eth_v2")
      .then((data) => {
        const propertyDyp = Object.entries(
          data.data.the_graph_eth_v2.token_data
        );
        settokendata(propertyDyp[0][1].token_price_usd);
        return propertyDyp[0][1].token_price_usd;
      });
  };



  useEffect(() => {
    getUsdPerDyp();
    getETHPrice();
    getMaxDepositAllowed()
  }, []);

  return (
    <>
      <div className="d-flex flex-column gap-2 w-100">
        <div className="locktimewrapper align-items-center gap-2">
          <button
            className={
              lockTime === "No Lock"
                ? "method-btn-active"
                : "method-btn-disabled"
            }
          >
            Flexible
          </button>
          <button
            className={
              lockTime === 30 ? "method-btn-active" : "method-btn-disabled"
            }
          >
            30 Days
          </button>
          <button
            className={
              lockTime === 60 ? "method-btn-active" : "method-btn-disabled"
            }
          >
            60 Days
          </button>
          <button
            className={
              lockTime === 90 ? "method-btn-active" : "method-btn-disabled"
            }
          >
            90 Days
          </button>
          <button
            className={
              lockTime === 120 ? "method-btn-active" : "method-btn-disabled"
            }
          >
            120 Days
          </button>
        </div>
        <div className="info-pool-wrapper p-3 w-100">
          <div className="info-pool-inner-wrapper d-flex flex-column flex-lg-row align-items-center gap-2">
            <div className="info-pool-item p-2">
              <div className="d-flex justify-content-between gap-1 align-items-center">
                <span className="info-pool-left-text">
                  APR{" "}
                  <ClickAwayListener onClickAway={aprClose}>
                    <Tooltip
                      open={aprTooltip}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      placement="top"
                      title={
                        <div className="tooltip-text">
                          {
                            "APR reflects the interest rate of earnings on an account over the course of one year."
                          }
                        </div>
                      }
                    >
                      <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={aprOpen} />
                    </Tooltip>
                  </ClickAwayListener>
                </span>
                <span className="info-pool-right-text">{finalApr}</span>
              </div>
            </div>
            <div className="info-pool-item p-2">
              <div className="d-flex justify-content-between gap-1 align-items-center">
                <span className="info-pool-left-text">Chain</span>
                <span className="info-pool-right-text d-flex gap-1 align-items-center">
                  <img
                    src={
                     'https://cdn.worldofdypians.com/wod/base.svg'
                    }
                    width={12}
                    height={12}
                    alt=""
                  />{" "}
                  Base
                </span>
              </div>
            </div>
            <div className="info-pool-item p-2">
              <div className="d-flex justify-content-between gap-1 align-items-center">
                <span className="info-pool-left-text">TVL</span>
                <span className="info-pool-right-text">
                  $
                  {getFormattedNumber(
                    totalTvl,
                    2
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="separator my-2"></div>
        {selectedTab === "deposit" ? (
          <div className="d-flex flex-column w-100 gap-2">
            <div className="d-flex align-items-center gap-2 justify-content-between w-100">
              <span className="deposit-popup-txt">Deposit</span>
              <div className="d-flex gap-1 align-items-baseline">
                <span className="bal-smallTxt">My Balance:</span>
                <span className="bal-bigTxt">
                  {getFormattedNumber(wethBalance, 6)} WETH
                </span>
              </div>
            </div>
            <div
              className={`d-flex flex-column w-100 gap-1 ${
                (chainId !== "8453" ||
                  !is_wallet_connected) &&
                "blurrypool"
              } `}
            >
              <div className="position-relative w-100 d-flex">
                <input
                  className="text-input2 w-100"
                  type="number"
                  autoComplete="off"
                  value={
                    Number(depositAmount) > 0 ? depositAmount : depositAmount
                  }
                  onChange={(e) => {
                    handleCheckAmount(e.target.value)
                  }}
                  name="amount_deposit"
                  id="amount_deposit"
                  key="amount_deposit"
                  placeholder={`0.0`}
                />
                <button
                  className="inner-max-btn position-absolute"
                  onClick={handleSetMaxDeposit}
                >
                  Max
                </button>
              </div>
              <div
                className={`d-flex w-100 ${
                  errorMsg ? "justify-content-between" : "justify-content-end"
                } gap-1 align-items-center`}
              >
                {errorMsg && <h6 className="errormsg m-0">{errorMsg}</h6>}

                <div className="d-flex flex-column">
                <div className="d-flex gap-1 align-items-baseline">
                  <span className="bal-smallTxt">Approved:</span>
                  <span className="bal-bigTxt2">{approvedAmount} WETH</span>
                </div>
                <div className="d-flex gap-1 align-items-baseline">
                  <span className="bal-smallTxt">Allowance Left:</span>
                  <span className="bal-bigTxt2">{getFormattedNumber(amountLeft)} WETH</span>
                </div>
                </div>
              </div>
            </div>
            <div className="info-pool-wrapper p-3 w-100">
              <div className="d-flex w-100 justify-content-between align-items-start align-items-lg-center gap-2 flex-column flex-lg-row">
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-2">
                    <span className="bal-smallTxt">Pool Cap:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                      {getFormattedNumber(poolCap, 0)} WETH
                      <ClickAwayListener onClickAway={poolCapClose}>
                        <Tooltip
                          open={poolCapTooltip}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          placement="top"
                          title={
                            <div className="tooltip-text">
                              {
                                "The maximum amount of funds that can be staked in the pool."
                              }
                            </div>
                          }
                        >
                          <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={poolCapOpen} />
                        </Tooltip>
                      </ClickAwayListener>
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="bal-smallTxt">Available Quota:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                      {getFormattedNumber(poolCap - tvl, 0)} WETH
                      <ClickAwayListener onClickAway={quotaClose}>
                        <Tooltip
                          open={quotaTooltip}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          placement="top"
                          title={
                            <div className="tooltip-text">
                              {
                                "The remaining capacity for staking in the pool."
                              }
                            </div>
                          }
                        >
                          <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={quotaOpen} />
                        </Tooltip>
                      </ClickAwayListener>
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="bal-smallTxt">Maximum deposit:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                      {getFormattedNumber(maxDepositAllowed, 0)} WETH
                      <ClickAwayListener onClickAway={maxDepositClose}>
                        <Tooltip
                          open={maxDepositTooltip}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          placement="top"
                          title={
                            <div className="tooltip-text">
                              {
                                "The highest amount that can be staked by an individual user."
                              }
                            </div>
                          }
                        >
                          <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={maxDepositOpen} />
                        </Tooltip>
                      </ClickAwayListener>
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <span className="bal-smallTxt">Total Est. Rewards</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    <span
                      className="deposit-popup-txt d-flex align-items-center gap-1"
                      style={{ fontSize: 16 }}
                    >
                      {getFormattedNumber(
                        getApproxReturn(
                          depositAmount,
                          lockTime === "No Lock" ? 365 : lockTime
                        ),
                        2
                      )}{" "}
                      WETH
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {pendingDivs > 0 && (
              <>
                {" "}
                <div className="separator my-2"></div>
                <span className="deposit-popup-txt">Reinvest</span>
                <div
                  className={`d-flex flex-column w-100 gap-1 ${
                    (chainId !== "8453" ||
                      !is_wallet_connected ) &&
                    "blurrypool"
                  } `}
                >
                  <div className="info-pool-wrapper p-3 w-100">
                    <div className="d-flex w-100 justify-content-between align-items-end gap-2">
                      <div className="d-flex flex-column align-items-baseline">
                        <span className="bal-smallTxt">Rewards</span>
                        <span className="bal-bigTxt2">
                          {getFormattedNumber(pendingDivs,6)} WETH
                        </span>
                      </div>
                      <button
                        className={`btn py-2 claim-inner-btn ${
                          (reInvestStatus === "claimed" &&
                            reInvestStatus === "initial") ||
                          pendingDivs <= 0
                            ? "disabled-btn"
                            : reInvestStatus === "failed"
                            ? "fail-button"
                            : reInvestStatus === "success"
                            ? "success-button"
                            : null
                        } d-flex justify-content-center align-items-center gap-2`}
                        style={{ height: "fit-content" }}
                        onClick={handleReinvest}
                        disabled={
                          reInvestStatus === "claimed" ||
                          reInvestStatus === "success" ||
                          pendingDivs <= 0
                            ? true
                            : false
                        }
                      >
                        {" "}
                        {reInvestLoading ? (
                          <div
                            class="spinner-border spinner-border-sm text-light"
                            role="status"
                          >
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        ) : reInvestStatus === "failed" ? (
                          <>
                            {/* <img src={failMark} alt="" /> */}
                            Failed
                          </>
                        ) : reInvestStatus === "success" ? (
                          <>Success</>
                        ) : (
                          <>Reinvest</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>{" "}
              </>
            )}
            <div className="separator my-2"></div>
            <div className="info-pool-wrapper p-3 w-100">
              <div className="d-flex w-100 flex-column flex-lg-row justify-content-between align-items-start align-items-lg-end gap-2">
                <div className="d-flex flex-column">
                  <span className="deposit-popup-txt">Summary</span>
                  <div className="d-flex align-items-center gap-2">
                    <span className="bal-smallTxt">Early withdraw fee:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                      {earlyFee}%
                      <ClickAwayListener onClickAway={earlyWithdrawClose}>
                        <Tooltip
                          open={earlyWithdrawTooltip}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          placement="top"
                          title={
                            <div className="tooltip-text">
                              {
                                "The fee charged for withdrawing funds from the pool before the specified period."
                              }
                            </div>
                          }
                        >
                          <img
                            src={'https://cdn.worldofdypians.com/tools/more-info.svg'}
                            alt=""
                            onClick={earlyWithdrawOpen}
                          />
                        </Tooltip>
                      </ClickAwayListener>
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="bal-smallTxt">Pool fee:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    0%
                      <ClickAwayListener onClickAway={poolFeeClose}>
                        <Tooltip
                          open={poolFeeTooltip}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          placement="top"
                          title={
                            <div className="tooltip-text">
                              {
                                "The percentage of staking rewards or deposits for maintaining the pool."
                              }
                            </div>
                          }
                        >
                          <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={poolFeeOpen} />
                        </Tooltip>
                      </ClickAwayListener>
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-2">
                    <span className="bal-smallTxt">Pool address:</span>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${window.config.basescan_baseURL}/address/${staking?._address}`}
                      className="stats-link2 text-decoration-underline"
                    >
                      {shortAddress(staking?._address)}{" "}
                      {/* <img src={'https://cdn.worldofdypians.com/tools/statsLinkIcon.svg'} alt="" /> */}
                    </a>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span className="bal-smallTxt">Start date:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                      12 Apr 2024{" "}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span className="bal-smallTxt">End date:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                      {/* {new Date(
                        selectedPool?.poolList[0].endDate * 1000
                      ).toDateString()} */}
                     09 Jun 2024
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {is_wallet_connected &&
              chainId === "8453"  && (
                <button
                  disabled={
                    (depositAmount === "" || depositLoading === true || canStake === false)
                      ? true
                      : false
                  }
                  className={`btn filledbtn ${
                    depositAmount === "" &&
                    depositStatus === "initial" &&
                    "disabled-btn"
                  } ${
                    depositStatus === "deposit" || depositStatus === "success"
                      ? "success-button"
                      : depositStatus === "fail"
                      ? "fail-button"
                      : null
                  } d-flex justify-content-center align-items-center gap-2 m-auto`}
                  onClick={() => {
                    depositStatus === "deposit"
                      ? handleStake()
                      : depositStatus === "initial" && depositAmount !== ""
                      ? handleApprove()
                      : console.log("");
                  }}
                  style={{ width: "fit-content" }}
                >
                  {" "}
                  {depositLoading ? (
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
                    <>Failed</>
                  )}
                </button>
              )}
          </div>
        ) : (
          <div className="d-flex flex-column w-100 gap-2">
            <div className="d-flex align-items-center gap-2 justify-content-between w-100">
              <span className="deposit-popup-txt">Withdraw</span>
              <div className="d-flex gap-1 align-items-baseline">
                <span className="bal-smallTxt">Deposited:</span>
                <span className="bal-bigTxt">
                  {" "}
                  {getFormattedNumber(depositedTokens, 6)} WETH
                </span>
              </div>
            </div>
            <div
              className={`d-flex flex-column w-100 gap-1 ${
                (chainId !== "8453" ||
                  !is_wallet_connected) &&
                "blurrypool"
              } `}
            >
              <div className="position-relative w-100 d-flex">
                <input
                  className="text-input2 w-100"
                  type="number"
                  autoComplete="off"
                  value={withdrawAmount}
                  onChange={(e) => setwithdrawAmount(e.target.value)}
                  name="amount_withdraw"
                  id="amount_withdraw"
                  key="amount_withdraw"
                  placeholder={`0.0`}
                />
                <button
                  className="inner-max-btn position-absolute"
                  onClick={handleSetMaxWithdraw}
                >
                  Max
                </button>
              </div>
              <div className="d-flex w-100 justify-content-between gap-1 align-items-center">
                {errorMsg3 && <h6 className="errormsg m-0">{errorMsg3}</h6>}
                {!moment
                  .duration(
                    (Number(stakingTime) + 86400 * 60) * 1000 - Date.now()
                  )
                  .humanize(true)
                  ?.includes("ago") &&
                  depositedTokens != "" && (
                    <div className="d-flex gap-1 align-items-baseline">
                      <span className="bal-smallTxt">Unlocks:</span>
                      <span className="bal-bigTxt2">
                        ~
                        {moment
                          .duration(
                            (Number(stakingTime) + 86400 * 60) * 1000 -
                              Date.now()
                          )
                          .humanize(true)}
                      </span>
                    </div>
                  )}
              </div>
              <button
                disabled={
                  withdrawStatus === "failed" ||
                  withdrawStatus === "success" ||
                  withdrawAmount === ""
                    ? true
                    : false
                }
                className={`btn filledbtn ${
                  // withdrawStatus === "failed"
                  //   ? "fail-button"
                  //   : withdrawStatus === "success"
                  //   ? "success-button"
                  withdrawAmount === "" && withdrawStatus === "initial"
                    ? "disabled-btn"
                    : null
                } w-50 d-flex align-items-center justify-content-center m-auto`}
                style={{ height: "fit-content" }}
                onClick={() => {
                  handleWithdraw();
                }}
              >
                {/* {withdrawLoading ? (
                  <div
                    class="spinner-border spinner-border-sm text-light"
                    role="status"
                  >
                    <spaokayn class="visually-hidden">Loading...</span>
                  </div>
                ) : withdrawStatus === "failed" ? (
                  <>Failed</>
                ) : withdrawStatus === "success" ? (
                  <>Success</>
                ) : (
                  <>Withdraw</>
                )} */}
                Withdraw
              </button>
            </div>
            <div className="separator my-2"></div>

            <span className="deposit-popup-txt">Earnings</span>
            <div
              className={`d-flex flex-column w-100 gap-1 ${
                (chainId !== "8453" ||
                  !is_wallet_connected ) &&
                "blurrypool"
              } `}
            >
              <div className="info-pool-wrapper p-3 w-100">
                <div className="d-flex w-100 justify-content-between align-items-end gap-2">
                  <div className="d-flex flex-column align-items-baseline">
                    <span className="bal-smallTxt">Rewards</span>
                    <span className="bal-bigTxt2">
                      {getFormattedNumber(pendingDivs,6)} WETH
                    </span>
                  </div>
                  <button
                    className={`btn py-2 claim-inner-btn ${
                      (claimStatus === "claimed" &&
                        claimStatus === "initial") ||
                      pendingDivs <= 0
                        ? "disabled-btn"
                        : claimStatus === "failed"
                        ? "fail-button"
                        : claimStatus === "success"
                        ? "success-button"
                        : null
                    } d-flex justify-content-center align-items-center gap-2`}
                    style={{ height: "fit-content" }}
                    onClick={handleClaimDivs}
                    disabled={
                      claimStatus === "claimed" ||
                      claimStatus === "success" ||
                      pendingDivs <= 0
                        ? true
                        : false
                    }
                  >
                    {" "}
                    {claimLoading ? (
                      <div
                        class="spinner-border spinner-border-sm text-light"
                        role="status"
                      >
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    ) : claimStatus === "failed" ? (
                      <>Failed</>
                    ) : claimStatus === "success" ? (
                      <>Success</>
                    ) : (
                      <>Claim</>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="separator my-2"></div>
            <div className="info-pool-wrapper p-3 w-100">
              <div className="d-flex w-100 flex-column flex-lg-row justify-content-between align-items-start align-items-lg-end gap-2">
                <div className="d-flex flex-column">
                  <span className="deposit-popup-txt">Summary</span>
                  <div className="d-flex align-items-center gap-2">
                    <span className="bal-smallTxt">Early withdraw fee:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                      {earlyFee}%
                      <ClickAwayListener onClickAway={earlyWithdrawClose}>
                        <Tooltip
                          open={earlyWithdrawTooltip}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          placement="top"
                          title={
                            <div className="tooltip-text">
                              {
                                "The fee charged for withdrawing funds from the pool before the specified period."
                              }
                            </div>
                          }
                        >
                          <img
                            src={'https://cdn.worldofdypians.com/tools/more-info.svg'}
                            alt=""
                            onClick={earlyWithdrawOpen}
                          />
                        </Tooltip>
                      </ClickAwayListener>
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="bal-smallTxt">Pool fee:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    0%
                      <ClickAwayListener onClickAway={poolFeeClose}>
                        <Tooltip
                          open={poolFeeTooltip}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          placement="top"
                          title={
                            <div className="tooltip-text">
                              {
                                "The percentage of staking rewards or deposits for maintaining the pool."
                              }
                            </div>
                          }
                        >
                          <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={poolFeeOpen} />
                        </Tooltip>
                      </ClickAwayListener>
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-2">
                    <span className="bal-smallTxt">Pool address:</span>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${window.config.basescan_baseURL}address/${staking?._address}`}
                      className="stats-link2 text-decoration-underline"
                    >
                      {shortAddress(staking?._address)}{" "}
                      {/* <img src={'https://cdn.worldofdypians.com/tools/statsLinkIcon.svg'} alt="" /> */}
                    </a>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span className="bal-smallTxt">Start date:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                      12 Apr 2024
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span className="bal-smallTxt">End date:</span>
                    <span className="deposit-popup-txt d-flex align-items-center gap-1">
                      {/* {new Date(
                        selectedPool?.poolList[0].endDate * 1000
                      ).toDateString()} */}
                      09 Jun 2024
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {coinbase === null ||
        coinbase === undefined ||
        is_wallet_connected === false ? (
          <button className="connectbtn btn m-auto" onClick={onConnectWallet}>
            <img src={'https://cdn.worldofdypians.com/tools/walletIcon.svg'} alt="" /> Connect wallet
          </button>
        ) : chainId !== "8453" ? (
          <button
            className="connectbtn btn m-auto"
            onClick={() => {
              handleEthPool();
            }}
          >
            Change Network
          </button>
        )  : (
          <></>
        )}
      </div>

      {showWithdrawModal && (
        <Modal
          visible={showWithdrawModal}
          modalId="withdrawmodal"
          title="withdraw"
          setIsVisible={() => {
            setshowWithdrawModal(false);
          }}
          width="90%"
        >
          <div className="earn-hero-content p4token-wrapper">
            <div className="l-box pl-3 pr-3">
              <div className="container px-0">
                <div className="row" style={{ marginLeft: "0px" }}>
                  <h6 className="withdrawdesc mt-2 p-0">
                    There is a {earlyFee}% early withdrawal fee for this pool.
                    Do you want to proceed?
                  </h6>
                </div>

                <div className="d-flex flex-column mt-2">
                  <div className="d-flex flex-column flex-lg-row flex-md-row  gap-2 justify-content-between align-items-start align-items-lg-center mb-4">
                    <div className="d-flex flex-column gap-1">
                      <h6 className="withsubtitle">My Deposit</h6>
                      <h6 className="withtitle2">
                        {getFormattedNumber(depositedTokens, 6)} WETH
                      </h6>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <h6 className="withsubtitle">Withdraw</h6>
                      <h6 className="withtitle2">
                        {getFormattedNumber(
                          withdrawAmount - withdrawAmount * 0.1,
                          6
                        )}{" "}
                        WETH
                      </h6>
                    </div>
                  </div>

                  <div className="d-flex flex-column align-items-start justify-content-between gap-2 mt-4">
                    <button
                      disabled={
                        withdrawStatus === "failed" ||
                        withdrawStatus === "success" ||
                        withdrawAmount === ""
                          ? true
                          : false
                      }
                      className={` w-50 m-auto btn filledbtn ${
                        withdrawStatus === "failed"
                          ? "fail-button"
                          : withdrawStatus === "success"
                          ? "success-button"
                          : withdrawAmount === "" &&
                            withdrawStatus === "initial"
                          ? "disabled-btn"
                          : null
                      } d-flex justify-content-center align-items-center`}
                      style={{ height: "fit-content" }}
                      onClick={() => {
                        handleWithdraw2();
                      }}
                    >
                      {withdrawLoading ? (
                        <div
                          class="spinner-border spinner-border-sm text-light"
                          role="status"
                        >
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      ) : withdrawStatus === "failed" ? (
                        <>
                          {/* <img src={failMark} alt="" /> */}
                          Failed
                        </>
                      ) : withdrawStatus === "success" ? (
                        <>Success</>
                      ) : (
                        <>Withdraw</>
                      )}
                    </button>
                    {/* <span
                      className="mt-2"
                      style={{
                        fontWeight: "400",
                        fontSize: "12px",
                        lineHeight: "18px",
                        color: "#C0C9FF",
                      }}
                    >
                      *No withdrawal fee
                    </span> */}
                    {/* <button
                          className="btn filledbtn w-100"
                          onClick={(e) => {
                            // e.preventDefault();
                            this.handleWithdraw();
                          }}
                          title={
                            canWithdraw
                              ? ""
                              : `You recently staked, you can unstake ${cliffTimeInWords}`
                          }
                        >
                          Withdraw
                        </button> */}

                    {/* <div className="form-row">
                              <div className="col-6">
                                <button
                                  title={
                                    canWithdraw
                                      ? ""
                                      : `You recently staked, you can unstake ${cliffTimeInWords}`
                                  }
                                  disabled={!canWithdraw || !is_connected}
                                  className="btn  btn-primary btn-block l-outline-btn"
                                  type="submit"
                                >
                                  WITHDRAW
                                </button>
                              </div>
                              <div className="col-6">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.handleWithdrawDyp();
                                  }}
                                  title={
                                    canWithdraw
                                      ? ""
                                      : `You recently staked, you can unstake ${cliffTimeInWords}`
                                  }
                                  disabled={!canWithdraw || !is_connected}
                                  className="btn  btn-primary btn-block l-outline-btn"
                                  type="submit"
                                >
                                  WITHDRAW
                                </button>
                              </div>
                            </div> */}
                  </div>
                  {errorMsg3 && <h6 className="errormsg">{errorMsg3}</h6>}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
    // <div className="container-lg p-0">
    //   <div
    //     className={`allwrapper ${listType === "table" && "my-4"}`}
    //     style={{
    //       border: listType !== "table" && "none",
    //       borderRadius: listType !== "table" && "0px",
    //     }}
    //   >
    //     <div className="leftside2 w-100">
    //       <div className="activewrapper">
    //         <div
    //           className={`d-flex flex-column flex-lg-row w-100 align-items-start align-items-lg-center justify-content-between ${
    //             renderedPage === "dashboard"
    //               ? "gap-3 gap-lg-4"
    //               : "gap-3 gap-lg-5"
    //           }`}
    //         >
    //         {expired === true ? (
    //             <h6 className="expiredtxt caws-active-txt">Expired Pool</h6>
    //           ) : (
    //             <h6 className="activetxt">
    //               <img
    //                 src={ellipse}
    //                 alt=""
    //                 className="position-relative"
    //                 style={{ top: "-1px" }}
    //               />
    //               Active status
    //             </h6>
    //           )}
    //           {/* <div className="d-flex align-items-center justify-content-between gap-2">
    //                 <h6 className="earnrewards-text">Earn rewards in:</h6>
    //                 <h6 className="earnrewards-token d-flex align-items-center gap-1">
    //                   DYP
    //                 </h6>
    //               </div> */}
    //           <div className="d-flex flex-row-reverse flex-lg-row align-items-center justify-content-between earnrewards-container">
    //             <div className="d-flex flex-column flex-lg-row align-items-end align-items-lg-center gap-3 gap-lg-5">
    //               <div className="d-flex align-items-center justify-content-between gap-2">
    //                 <h6 className="earnrewards-text">Performance fee:</h6>
    //                 <h6 className="earnrewards-token d-flex align-items-center gap-1">
    //                   {fee}%
    //                   <ClickAwayListener onClickAway={performanceClose}>
    //                     <Tooltip
    //                       open={performanceTooltip}
    //                       disableFocusListener
    //                       disableHoverListener
    //                       disableTouchListener
    //                       placement="top"
    //                       title={
    //                         <div className="tooltip-text">
    //                           {
    //                             "Performance fee is subtracted from the displayed APR."
    //                           }
    //                         </div>
    //                       }
    //                     >
    //                       <img
    //                         src={'https://cdn.worldofdypians.com/tools/more-info.svg'}
    //                         alt=""
    //                         onClick={performanceOpen}
    //                       />
    //                     </Tooltip>
    //                   </ClickAwayListener>
    //                 </h6>
    //               </div>

    //               <div className="d-flex align-items-center justify-content-between gap-2">
    //                 <h6 className="earnrewards-text">APR:</h6>
    //                 <h6 className="earnrewards-token d-flex align-items-center gap-1">
    //                   {finalApr}%
    //                   <ClickAwayListener onClickAway={aprClose}>
    //                     <Tooltip
    //                       open={aprTooltip}
    //                       disableFocusListener
    //                       disableHoverListener
    //                       disableTouchListener
    //                       placement="top"
    //                       title={
    //                         <div className="tooltip-text">
    //                           {
    //                             "APR reflects the interest rate of earnings on an account over the course of one year. "
    //                           }
    //                         </div>
    //                       }
    //                     >
    //                       <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={aprOpen} />
    //                     </Tooltip>
    //                   </ClickAwayListener>
    //                 </h6>
    //               </div>
    //               <div className="d-flex align-items-center justify-content-between gap-2">
    //                 <h6 className="earnrewards-text">Lock time:</h6>
    //                 <h6 className="earnrewards-token d-flex align-items-center gap-1">
    //                   {lockTime} {lockTime !== "No Lock" ? "Days" : ""}
    //                   <ClickAwayListener onClickAway={lockClose}>
    //                     <Tooltip
    //                       open={lockTooltip}
    //                       disableFocusListener
    //                       disableHoverListener
    //                       disableTouchListener
    //                       placement="top"
    //                       title={
    //                         <div className="tooltip-text">
    //                           {
    //                             "The amount of time your deposited assets will be locked."
    //                           }
    //                         </div>
    //                       }
    //                     >
    //                       <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={lockOpen} />
    //                     </Tooltip>
    //                   </ClickAwayListener>
    //                 </h6>
    //               </div>
    //             </div>
    //             <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3">
    //               <h6
    //                 className="bottomitems"
    //                 onClick={() => setshowCalculator(true)}
    //               >
    //                 <img src={'https://cdn.worldofdypians.com/tools/poolsCalculatorIcon.svg'} alt="" />
    //                 Calculator
    //               </h6>
    //               <a
    //                 href={
    //                   // chainId === 1
    //                   // ?
    //                   "https://app.uniswap.org/#/swap?outputCurrency=0x39b46B212bDF15b42B166779b9d1787A68b9D0c3"
    //                   // : "https://app.pangolin.exchange/#/swap?outputCurrency=0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17"
    //                 }
    //                 target={"_blank"}
    //                 rel="noreferrer"
    //               >
    //                 <h6 className="bottomitems">
    //                   <img src={arrowup} alt="" />
    //                   Get DYP
    //                 </h6>
    //               </a>
    //               <div
    //                 onClick={() => {
    //                   showPopup();
    //                 }}
    //               >
    //                 <h6 className="bottomitems">
    //                   <img src={'https://cdn.worldofdypians.com/tools/purpleStat.svg'} alt="" />
    //                   Stats
    //                 </h6>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="pools-details-wrapper d-flex m-0  container-lg border-0">
    //       <div className="row w-100 flex-column flex-lg-row gap-4 gap-lg-0 justify-content-between">
    //         <div className="firstblockwrapper col-12 col-md-6 col-lg-2">
    //           <div
    //             className="d-flex flex-row flex-lg-column align-items-center align-items-lg-start justify-content-between gap-4"
    //             style={{ height: "100%" }}
    //           >
    //             <h6 className="start-title">Start Staking</h6>
    //             {/* <h6 className="start-desc">
    //                   {this.props.coinbase === null
    //                     ? "Connect wallet to view and interact with deposits and withdraws"
    //                     : "Interact with deposits and withdraws"}
    //                 </h6> */}
    //             {coinbase === null ||
    //             coinbase === undefined ||
    //             is_wallet_connected === false ? (
    //               <button className="connectbtn btn" onClick={showModal}>
    //                 <img src={'https://cdn.worldofdypians.com/tools/walletIcon.svg'} alt="" /> Connect wallet
    //               </button>
    //             ) : chainId === "1" ? (
    //               <div className="addressbtn btn">
    //                 <Address a={coinbase} chainId={1} />
    //               </div>
    //             ) : (
    //               <button
    //                 className="connectbtn btn"
    //                 onClick={() => {
    //                   handleEthPool();
    //                 }}
    //               >
    //                 Change Network
    //               </button>
    //             )}
    //           </div>
    //         </div>
    //         {/* <div className="otherside">
    //           <button className="btn green-btn">
    //             TBD Claim reward 0.01 ETH
    //           </button>
    //         </div> */}
    //         <div
    //           className={`otherside-border col-12 col-md-12 col-lg-4  ${
    //             chainId !== "1" || expired === true || !is_wallet_connected ? "blurrypool" : ""
    //           }`}
    //         >
    //           <div className="d-flex justify-content-between align-items-center gap-2">
    //             <div className="d-flex justify-content-center align-items-center gap-3">
    //               <h6 className="deposit-txt">Deposit</h6>
    //               {/* <div className="d-flex gap-2 align-items-center">
    //                     <img
    //                       src={require(`./assets/dyp.svg`).default}
    //                       alt=""
    //                       style={{ width: 15, height: 15 }}
    //                     />
    //                     <h6
    //                       className="text-white"
    //                       style={{ fontSize: "11px", fontWeight: "600" }}
    //                     >
    //                       DYP
    //                     </h6>
    //                   </div> */}
    //               <h6 className="mybalance-text">
    //                 Balance:
    //                 <b>
    //                   {token_balance !== "..."
    //                     ? getFormattedNumber(token_balance, 6)
    //                     : getFormattedNumber(0, 6)}{" "}
    //                   {token_symbol}
    //                 </b>
    //               </h6>
    //             </div>
    //             <ClickAwayListener onClickAway={depositClose}>
    //               <Tooltip
    //                 open={depositTooltip}
    //                 disableFocusListener
    //                 disableHoverListener
    //                 disableTouchListener
    //                 placement="top"
    //                 title={
    //                   <div className="tooltip-text">
    //                     {
    //                       "The initial pool size is capped at 11.5M DYP. Additional opportunities to stake DYP are planned to be introduced over time."
    //                     }
    //                   </div>
    //                 }
    //               >
    //                 <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={depositOpen} />
    //               </Tooltip>
    //             </ClickAwayListener>
    //           </div>
    //           <div className="d-flex flex-column gap-2 justify-content-between">
    //             <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-2">
    //               <div className="d-flex align-items-center justify-content-between justify-content-lg-start w-100 gap-2">
    //                 <div className="input-container px-0">
    //                   <input
    //                     type="number"
    //                     autoComplete="off"
    //                     value={
    //                       Number(depositAmount) > 0
    //                         ? depositAmount
    //                         : depositAmount
    //                     }
    //                     onChange={(e) => {
    //                       setdepositAmount(e.target.value);
    //                       checkApproval(e.target.value);
    //                     }}
    //                     placeholder=" "
    //                     className="text-input"
    //                     style={{ width: "100%" }}
    //                     name="amount_deposit"
    //                     id="amount_deposit"
    //                     key="amount_deposit"
    //                   />
    //                   <label
    //                     htmlFor="usd"
    //                     className="label"
    //                     onClick={() => focusInput("amount_deposit")}
    //                   >
    //                     Amount
    //                   </label>
    //                 </div>
    //                 {/* <div
    //                     className="input-container px-0"
    //                     style={{ width: "32%" }}
    //                   >
    //                     <input
    //                       type="number"
    //                       min={1}
    //                       id="amount"
    //                       name="amount"
    //                       value={ Number(depositAmount) > 0
    //                         ? depositAmount
    //                         : depositAmount
    //                       }
    //                       placeholder=" "
    //                       className="text-input"
    //                       onChange={(e) => this.setState({depositAmount: e.target.value})}
    //                       style={{ width: "100%" }}
    //                     />
    //                     <label
    //                       htmlFor="usd"
    //                       className="label"
    //                       onClick={() => focusInput("amount")}
    //                     >
    //                       DYP Amount
    //                     </label>
    //                   </div> */}
    //                 <button
    //                   className="btn maxbtn"
    //                   onClick={handleSetMaxDeposit}
    //                 >
    //                   Max
    //                 </button>
    //               </div>
    //               {/* <button
    //                   className="btn filledbtn"
    //                   onClick={this.handleApprove}
    //                 >
    //                   Approve
    //                 </button> */}
    //               <button
    //                 disabled={
    //                   depositAmount === "" || depositLoading === true
    //                     ? true
    //                     : false
    //                 }
    //                 className={`btn filledbtn ${
    //                   depositAmount === "" &&
    //                   depositStatus === "initial" &&
    //                   "disabled-btn"
    //                 } ${
    //                   depositStatus === "deposit" || depositStatus === "success"
    //                     ? "success-button"
    //                     : depositStatus === "fail"
    //                     ? "fail-button"
    //                     : null
    //                 } d-flex justify-content-center align-items-center gap-2`}
    //                 onClick={() => {
    //                   depositStatus === "deposit"
    //                     ? handleStake()
    //                     : depositStatus === "initial" && depositAmount !== ""
    //                     ? handleApprove()
    //                     : console.log("");
    //                 }}
    //               >
    //                 {depositLoading ? (
    //                   <div
    //                     class="spinner-border spinner-border-sm text-light"
    //                     role="status"
    //                   >
    //                     <span class="visually-hidden">Loading...</span>
    //                   </div>
    //                 ) : depositStatus === "initial" ? (
    //                   <>Approve</>
    //                 ) : depositStatus === "deposit" ? (
    //                   <>Deposit</>
    //                 ) : depositStatus === "success" ? (
    //                   <>Success</>
    //                 ) : (
    //                   <>
    //                     <img src={failMark} alt="" />
    //                     Failed
    //                   </>
    //                 )}
    //               </button>
    //             </div>
    //             {errorMsg && <h6 className="errormsg">{errorMsg}</h6>}
    //           </div>
    //         </div>
    //         <div
    //           className={`otherside-border col-12 col-md-12 col-lg-4 ${
    //             (chainId !== "1"|| !is_wallet_connected) && "blurrypool"
    //           }`}
    //         >
    //           <div className="d-flex justify-content-between gap-2 ">
    //             <h6 className="withdraw-txt">Rewards</h6>
    //             <h6
    //               className="withdraw-littletxt d-flex align-items-center gap-2"
    //               style={{
    //                 fontSize: renderedPage === "dashboard" && "9px",
    //               }}
    //             >
    //               Rewards are displayed in real-time
    //               <ClickAwayListener onClickAway={rewardsClose}>
    //                 <Tooltip
    //                   open={rewardsTooltip}
    //                   disableFocusListener
    //                   disableHoverListener
    //                   disableTouchListener
    //                   placement="top"
    //                   title={
    //                     <div className="tooltip-text">
    //                       {
    //                         "Rewards earned by your deposit to the staking smart contract are displayed in real-time. The reinvest function does not reset the lock-in period."
    //                       }
    //                     </div>
    //                   }
    //                 >
    //                   <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={rewardsOpen} />
    //                 </Tooltip>
    //               </ClickAwayListener>
    //             </h6>
    //           </div>
    //           <div className="d-flex flex-column gap-2 justify-content-between">
    //             {/* <div className="d-flex align-items-center justify-content-between gap-2"></div> */}
    //             <div className="form-row flex-column flex-lg-row gap-2 d-flex  align-items-start align-items-lg-center justify-content-between">
    //               <div className="position-relative d-flex flex-column">
    //                 <span
    //                   style={{
    //                     fontWeight: "500",
    //                     fontSize: "12px",
    //                     lineHeight: "18px",
    //                     color: "#c0c9ff",
    //                   }}
    //                 >
    //                   DYP
    //                 </span>
    //                 <span>{pendingDivs}</span>
    //                 {/* <input
    //                       disabled
    //                       value={
    //                         Number(pendingDivs) > 0
    //                           ? `${pendingDivs}`
    //                           : `${pendingDivs}`
    //                       }
    //                       onChange={(e) =>
    //                         this.setState({
    //                           pendingDivs:
    //                             Number(e.target.value) > 0
    //                               ? e.target.value
    //                               : e.target.value,
    //                         })
    //                       }
    //                       className=" left-radius inputfarming styledinput2"
    //                       placeholder="0"
    //                       type="text"
    //                       style={{ fontSize: "14px", width: renderedPage === "dashboard" && '120px', padding: 0 }}
    //                     /> */}
    //               </div>
    //               <div className="claim-reinvest-container d-flex justify-content-between align-items-center gap-3">
    //                 <button
    //                   disabled={
    //                     claimStatus === "claimed" ||
    //                     claimStatus === "success" ||
    //                     pendingDivs <= 0
    //                       ? //
    //                         true
    //                       : false
    //                   }
    //                   className={`btn filledbtn ${
    //                     (claimStatus === "claimed" &&
    //                       claimStatus === "initial") ||
    //                     pendingDivs <= 0
    //                       ? //
    //                         "disabled-btn"
    //                       : claimStatus === "failed"
    //                       ? "fail-button"
    //                       : claimStatus === "success"
    //                       ? "success-button"
    //                       : null
    //                   } d-flex justify-content-center align-items-center gap-2`}
    //                   style={{ height: "fit-content" }}
    //                   // onClick={handleClaimDivs}
    //                   onClick={() => {handleClaimDivs();
    //                   }}
    //                 >
    //                   {claimLoading ? (
    //                     <div
    //                       class="spinner-border spinner-border-sm text-light"
    //                       role="status"
    //                     >
    //                       <span class="visually-hidden">Loading...</span>
    //                     </div>
    //                   ) : claimStatus === "failed" ? (
    //                     <>
    //                       <img src={failMark} alt="" />
    //                       Failed
    //                     </>
    //                   ) : claimStatus === "success" ? (
    //                     <>Success</>
    //                   ) : (
    //                     <>Claim</>
    //                   )}
    //                 </button>
    //                 {expired === false && (
    //                   <button
    //                     disabled={pendingDivs > 0 ? false : true}
    //                     className={`btn outline-btn ${
    //                       reInvestStatus === "invest" || pendingDivs <= 0
    //                         ? "disabled-btn"
    //                         : reInvestStatus === "failed"
    //                         ? "fail-button"
    //                         : reInvestStatus === "success"
    //                         ? "success-button"
    //                         : null
    //                     } d-flex justify-content-center align-items-center gap-2`}
    //                     style={{ height: "fit-content" }}
    //                     onClick={handleReinvest}
    //                   >
    //                     {reInvestLoading ? (
    //                       <div
    //                         class="spinner-border spinner-border-sm text-light"
    //                         role="status"
    //                       >
    //                         <span class="visually-hidden">Loading...</span>
    //                       </div>
    //                     ) : reInvestStatus === "failed" ? (
    //                       <>
    //                         <img src={failMark} alt="" />
    //                         Failed
    //                       </>
    //                     ) : reInvestStatus === "success" ? (
    //                       <>Success</>
    //                     ) : (
    //                       <>Reinvest</>
    //                     )}
    //                   </button>
    //                 )}
    //               </div>
    //             </div>
    //             {errorMsg2 && <h6 className="errormsg">{errorMsg2}</h6>}
    //           </div>
    //         </div>

    //         <div
    //           className={`otherside-border col-12 col-md-12 col-lg-2 ${
    //             (chainId !== "1" || !is_wallet_connected) && "blurrypool"
    //           }`}
    //         >
    //           <h6 className="deposit-txt d-flex align-items-center gap-2 justify-content-between">
    //             WITHDRAW
    //             <ClickAwayListener onClickAway={withdrawClose}>
    //               <Tooltip
    //                 open={withdrawTooltip}
    //                 disableFocusListener
    //                 disableHoverListener
    //                 disableTouchListener
    //                 placement="top"
    //                 title={
    //                   <div className="tooltip-text">
    //                     {
    //                       "Withdraw your deposited assets from the staking smart contract."
    //                     }
    //                   </div>
    //                 }
    //               >
    //                 <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={withdrawOpen} />
    //               </Tooltip>
    //             </ClickAwayListener>
    //           </h6>

    //           <button
    //             disabled={Number(depositedTokens) > 0 ? false : true}
    //             className={"outline-btn btn"}
    //             onClick={() => {
    //               setshowWithdrawModal(true);
    //             }}
    //           >
    //             Withdraw
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   {popup && (
    //     <Modal
    //       visible={popup}
    //       modalId="tymodal"
    //       title="stats"
    //       setIsVisible={() => {
    //         setpopup(false);
    //       }}
    //       width="fit-content"
    //     >
    //       <div className="earn-hero-content p4token-wrapper">
    //         <div className="l-box pl-3 pr-3">
    //           <div className="container px-0">
    //             {/* <div className="row" style={{ marginLeft: "0px" }}>
    //                   <div className="d-flex justify-content-between gap-2 align-items-center p-0">
    //                     <h6 className="d-flex gap-2 align-items-center statstext">
    //                       <img src={stats} alt="" />
    //                       Stats
    //                     </h6>
    //                     <h6 className="d-flex gap-2 align-items-center myaddrtext">
    //                       My address
    //                       <a
    //                         href={`${window.config.etherscan_baseURL}/address/${this.props.coinbase}`}
    //                         target={"_blank"}
    //                         rel="noreferrer"
    //                       >
    //                         <h6 className="addresstxt">
    //                           {this.props.coinbase?.slice(0, 10) + "..."}
    //                         </h6>
    //                       </a>
    //                       <img src={arrowup} alt="" />
    //                     </h6>
    //                   </div>
    //                 </div> */}
    //             {/* <table className="table-stats table table-sm table-borderless mt-2">
    //                   <tbody>
    //                     <tr>
    //                       <td className="text-right">
    //                         <th>My DYP Deposit</th>
    //                         <div>
    //                           <strong>{depositedTokens}</strong>{" "}
    //                           <small>DYP</small>
    //                         </div>
    //                       </td>

    //                       <td className="text-right">
    //                         <th>My DYP Balance</th>
    //                         <div>
    //                           <strong>{token_balance}</strong>{" "}
    //                           <small>DYP</small>
    //                         </div>
    //                       </td>
    //                       <td className="text-right">
    //                         <th>Referral Fee Earned</th>
    //                         <div>
    //                           <strong>{referralFeeEarned}</strong>{" "}
    //                           <small>DYP</small>
    //                         </div>
    //                       </td>

    //                     </tr>

    //                     <tr>
    //                       <td className="text-right">
    //                         <th>Total DYP Locked</th>
    //                         <div>
    //                           <strong>{tvl}</strong> <small>DYP</small>
    //                         </div>
    //                       </td>
    //                       <td className="text-right">
    //                         <th>TVL USD</th>
    //                         <div>
    //                           <strong>${tvl_usd}</strong> <small>USD</small>
    //                         </div>
    //                       </td>

    //                       <td className="text-right">
    //                         <th>Contract Expiration</th>
    //                         <small>{expiration_time}</small>
    //                       </td>
    //                     </tr>
    //                   </tbody>
    //                 </table> */}
    //             <div className="stats-container my-4">
    //               <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
    //                 <span className="stats-card-title">My DYP Deposit</span>
    //                 <h6 className="stats-card-content">
    //                   {getFormattedNumber(depositedTokens, 6)} DYP
    //                 </h6>
    //               </div>
    //               <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
    //                 <span className="stats-card-title">My DYP Balance</span>
    //                 <h6 className="stats-card-content">{token_balance} DYP</h6>
    //               </div>
    //               <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
    //                 <span className="stats-card-title">
    //                   Referral Fee Earned
    //                 </span>
    //                 <h6 className="stats-card-content">
    //                   {referralFeeEarned} DYP
    //                 </h6>
    //               </div>
    //               <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
    //                 <span className="stats-card-title">Total DYP Locked</span>
    //                 <h6 className="stats-card-content">
    //                   {getFormattedNumber(tvl, 6)} DYP
    //                 </h6>
    //               </div>
    //               <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
    //                 <span className="stats-card-title">TVL USD</span>
    //                 <h6 className="stats-card-content">${getFormattedNumber(Number(tvl) * usdPerToken,4) } USD</h6>
    //               </div>
    //               <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
    //                 <span className="stats-card-title">
    //                   Contract Expiration
    //                 </span>
    //                 <h6 className="stats-card-content">{expiration_time}</h6>
    //               </div>
    //             </div>
    //             <div className="d-flex flex-column flex-lg-row gap-3 gap-lg-0 align-items-center justify-content-between">
    //               <div className="referralwrapper col-12 col-lg-8">
    //                 <div className="d-flex gap-2 align-items-start justify-content-between">
    //                   <img src={referralimg} alt="" />
    //                   <div
    //                     className="d-flex gap-2 flex-column"
    //                     style={{ width: "60%" }}
    //                   >
    //                     <div>
    //                       <span style={{ fontSize: ".8rem" }}>
    //                         <h6
    //                           className="referraltitle"
    //                           style={{ cursor: "pointer" }}
    //                         >
    //                           <Clipboard
    //                             component="h6"
    //                             onSuccess={(e) => {
    //                               setTimeout(() => ReactTooltip.hide(), 2000);
    //                             }}
    //                             data-event="click"
    //                             data-for={id}
    //                             data-tip="Copied To Clipboard!"
    //                             data-clipboard-text={getReferralLink()}
    //                             className="referraltitle"
    //                           >
    //                             Referral Link:
    //                             <span
    //                               title="Copy link to clipboard"
    //                               style={{
    //                                 cursor: "pointer",
    //                               }}
    //                             ></span>
    //                           </Clipboard>
    //                           <ReactTooltip id={id} effect="solid" />
    //                         </h6>
    //                         <br />
    //                         {/* <a
    //                             className="text-muted small"
    //                             href={this.getReferralLink()}
    //                           >
    //                             {" "}
    //                             {this.getReferralLink()}{" "}
    //                           </a> */}
    //                       </span>
    //                     </div>

    //                     <h6 className="referraldesc">
    //                       Refferal link gives you 5% for each invite friend you
    //                       bring to buy DYP example
    //                     </h6>
    //                   </div>
    //                   <Clipboard
    //                     component="div"
    //                     onSuccess={(e) => {
    //                       setTimeout(() => ReactTooltip.hide(), 2000);
    //                     }}
    //                     data-event="click"
    //                     data-for={id}
    //                     data-tip="Copied To Clipboard!"
    //                     data-clipboard-text={getReferralLink()}
    //                     className=""
    //                   >
    //                     <button className="copybtn btn">
    //                       <img src={copy} alt="" /> Copy{" "}
    //                     </button>{" "}
    //                   </Clipboard>
    //                   <ReactTooltip id={id} effect="solid" />
    //                   &nbsp;{" "}
    //                 </div>
    //               </div>
    //               <div className="col-12 col-lg-3 d-flex flex-column gap-1">
    //                 <span
    //                   style={{
    //                     fontWeight: "400",
    //                     fontSize: "12px",
    //                     lineHeight: "18px",
    //                     color: "#C0C9FF",
    //                   }}
    //                 >
    //                   My address
    //                 </span>
    //                 <a
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   href={`${window.config.etherscan_baseURL}/address/${coinbase}`}
    //                   className="stats-link"
    //                 >
    //                   {shortAddress(coinbase)}{" "}
    //                   <img src={'https://cdn.worldofdypians.com/tools/statsLinkIcon.svg'} alt="" />
    //                 </a>
    //                 <a
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   href={`https://github.com/dypfinance/staking-governance-security-audits`}
    //                   className="stats-link"
    //                 >
    //                   Audit <img src={'https://cdn.worldofdypians.com/tools/statsLinkIcon.svg'} alt="" />
    //                 </a>
    //                 <a
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   href={`${window.config.etherscan_baseURL}/token/${reward_token_dypius_eth._address}?a=${coinbase}`}
    //                   className="stats-link"
    //                 >
    //                   View transaction <img src={'https://cdn.worldofdypians.com/tools/statsLinkIcon.svg'} alt="" />
    //                 </a>
    //               </div>
    //             </div>
    //             {/* <div className="mt-4">
    //                   <a
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                     href={`${window.config.etherscan_baseURL}/token/${reward_token._address}?a=${coinbase}`}
    //                     className="maxbtn"
    //                     style={{ color: "#7770e0" }}
    //                   >
    //                     Etherscan
    //                     <img src={arrowup} alt="" />
    //                   </a>
    //                 </div> */}
    //           </div>
    //         </div>
    //       </div>
    //     </Modal>
    //   )}

    //   {show && (
    //     <WalletModal
    //       show={show}
    //       handleClose={hideModal}
    //       handleConnection={() => {
    //         handleConnection();
    //         setshow(false);
    //       }}
    //     />
    //   )}
    //   {/* <div
    //         className="calculator-btn d-flex justify-content-center align-items-center gap-2 text-white"
    //         onClick={() => this.setState({ showCalculator: true })}
    //       >
    //         <img
    //           src={calculatorIcon}
    //           alt=""
    //           style={{ width: 30, height: 30 }}
    //         />{" "}
    //         Calculator
    //       </div> */}

    //   {showCalculator && (
    //     <Modal
    //       visible={showCalculator}
    //       modalId="calculatormodal"
    //       title="calculator"
    //       setIsVisible={() => {
    //         setshowCalculator(false);
    //       }}
    //     >
    //       <div className="pools-calculator">
    //         {/* <div className="d-flex align-items-center justify-content-between">
    //             <div className="d-flex align-items-center gap-3">
    //               <img src={calculatorIcon} alt="" />
    //               <h5
    //                 style={{
    //                   fontSize: "23px",
    //                   fontWeight: "500",
    //                   color: "#f7f7fc",
    //                 }}
    //               >
    //                 Calculator
    //               </h5>
    //             </div>
    //             <img
    //               src={xMark}
    //               alt=""
    //               onClick={() => {
    //                 this.setState({ showCalculator: false });
    //               }}
    //               className="cursor-pointer"
    //             />
    //           </div> */}
    //         <hr />
    //         <div className="d-flex align-items-center justify-content-between">
    //           <div className="d-flex flex-column gap-3 w-50 me-5">
    //             <span style={{ fontSize: "15px", fontWeight: "500" }}>
    //               Days to stake
    //             </span>
    //             <input
    //               style={{ height: "40px" }}
    //               type="number"
    //               className="form-control calcinput w-100"
    //               id="days"
    //               name="days"
    //               placeholder="Days*"
    //               value={approxDays}
    //               onChange={(e) => setapproxDays(e.target.value)}
    //             />
    //           </div>
    //           <div className="d-flex flex-column gap-3 w-50 me-5">
    //             <span style={{ fontSize: "15px", fontWeight: "500" }}>
    //               Amount to stake
    //             </span>
    //             <input
    //               style={{ height: "40px" }}
    //               type="number"
    //               className="form-control calcinput w-100"
    //               id="days"
    //               name="days"
    //               placeholder="Value of deposit in USD"
    //               value={approxDeposit}
    //               onChange={(e) => setapproxDeposit(e.target.value)}
    //             />
    //           </div>
    //         </div>
    //         <div className="d-flex flex-column gap-2 mt-4">
    //           <h3 style={{ fontWeight: "500", fontSize: "39px" }}>
    //             {" "}
    //             ${getFormattedNumber(getApproxReturn() * usdPerToken, 6)} USD
    //           </h3>
    //           <h6
    //             style={{
    //               fontWeight: "300",
    //               fontSize: "15px",
    //               color: "#f7f7fc",
    //             }}
    //           >
    //             Approx {getFormattedNumber(getApproxReturn(), 6)}
    //             DYP
    //           </h6>
    //         </div>
    //         <div className="mt-4">
    //           <p
    //             style={{
    //               fontWeight: "400",
    //               fontSize: "13px",
    //               color: "#f7f7fc",
    //             }}
    //           >
    //             *This calculator is for informational purposes only. Calculated
    //             yields assume that prices of the deposited assets don't change.
    //           </p>
    //         </div>
    //       </div>
    //     </Modal>
    //   )}
    // </div>
  );
};

export default StakeDypiusEthOther;
