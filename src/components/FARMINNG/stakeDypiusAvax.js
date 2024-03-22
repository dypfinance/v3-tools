import React, { useState, useEffect } from "react";
import moment from "moment";
import getFormattedNumber from "../../functions/getFormattedNumber2";
import Modal from "../Modal/Modal";
import Address from "./address";
import WalletModal from "../WalletModal";
import "./top-pools.css";
import { shortAddress } from "../../functions/shortAddress";
import ellipse from "./assets/ellipse.svg";
import Clipboard from "react-clipboard.js";
import failMark from "../../assets/failMark.svg";
import ReactTooltip from "react-tooltip";
import arrowup from "./assets/arrow-up.svg";
import moreinfo from "./assets/more-info.svg";
import purplestats from "./assets/purpleStat.svg";
import referralimg from "./assets/referral.svg";
import copy from "./assets/copy.svg";
import wallet from "./assets/wallet.svg";
import Tooltip from "@material-ui/core/Tooltip";
import Countdown from "react-countdown";
import statsLinkIcon from "./assets/statsLinkIcon.svg";
import poolsCalculatorIcon from "./assets/poolsCalculatorIcon.svg";
import { ClickAwayListener } from "@material-ui/core";
import { handleSwitchNetworkhook } from "../../functions/hooks";
import axios from "axios";

const renderer = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="d-flex gap-3 justify-content-center align-items-center">
      <div className="d-flex gap-1 align-items-baseline">
        <span>{days < 10 ? "0" + days : days}</span>
        <span style={{ fontSize: "13px" }}>days</span>
      </div>
      <div className="d-flex gap-1 align-items-baseline">
        <span>{hours < 10 ? "0" + hours : hours}</span>
        <span style={{ fontSize: "13px" }}>hours</span>
      </div>
      <div className="d-flex gap-1 align-items-baseline">
        <span>{minutes < 10 ? "0" + minutes : minutes}</span>
        <span style={{ fontSize: "13px" }}>minutes</span>
      </div>
      <span className="d-none">{seconds < 10 ? "0" + seconds : seconds}</span>
      <span className="d-none">seconds</span>
    </div>
  );
};

const StakeDypiusAvax = ({
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
  onConnectWallet,
}) => {
  let {
    reward_token_dypius_bsc,
    BigNumber,
    alertify,
    reward_token_idyp,
    reward_token_daiavax,
  } = window;
  let token_symbol = "DYP";

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

  const [token_balance, settoken_balance] = useState("...");
  const [pendingDivs, setpendingDivs] = useState("");
  const [totalEarnedTokens, settotalEarnedTokens] = useState("");
  const [cliffTime, setcliffTime] = useState("");
  const [stakingTime, setstakingTime] = useState("");
  const [depositedTokens, setdepositedTokens] = useState("");
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
  const [tvlDyps, setsettvlDyps] = useState(0);
  const [settotal_stakers, setsettotal_stakers] = useState("");

  const [show, setshow] = useState(false);
  const [showWithdrawModal, setshowWithdrawModal] = useState(false);
  const [popup, setpopup] = useState(false);
  const [apy1, setapy1] = useState(false);
  const [apy2, setapy2] = useState(false);
  const [performanceTooltip, setperformanceTooltip] = useState(false);
  const [aprTooltip, setaprTooltip] = useState(false);
  const [lockTooltip, setlockTooltip] = useState(false);
  const [depositTooltip, setdepositTooltip] = useState(false);
  const [rewardsTooltip, setrewardsTooltip] = useState(false);
  const [withdrawTooltip, setwithdrawTooltip] = useState(false);
  const [tokendata, settokendata] = useState();
  const [tvlUSD, settvlUSD] = useState(0);
  const [passivePool, setPassivePool] = useState(false);

  const [poolFeeTooltip, setPoolFeeTooltip] = useState(false);
  const [startDateTooltip, setStartDateTooltip] = useState(false);
  const [endDateTooltip, setEndDateTooltip] = useState(false);
  const [poolCapTooltip, setPoolCapTooltip] = useState(false);
  const [quotaTooltip, setQuotaTooltip] = useState(false);
  const [maxDepositTooltip, setMaxDepositTooltip] = useState(false);
  const [approvedAmount, setapprovedAmount] = useState("0.00");

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

  const refreshBalance = async () => {
    let coinbase = coinbase2;

    if (window.coinbase_address) {
      coinbase = window.coinbase_address;
      setcoinbase(coinbase);
    }

    let lp_data = the_graph_result.token_data;
    //console.log({lp_data})

    //Calculate APY

    try {
      let _bal = reward_token_dypius_bsc.balanceOf(coinbase);
      let _pDivs = staking.getTotalPendingDivs(coinbase);

      let _tEarned = staking.totalEarnedTokens(coinbase);

      let _stakingTime = staking.stakingTime(coinbase);

      let _dTokens = staking.depositedTokens(coinbase);

      let _lClaimTime = staking.lastClaimedTime(coinbase);

      let _tvl = reward_token_dypius_bsc.balanceOf(staking._address);

      let _rFeeEarned = staking.totalReferralFeeEarned(coinbase);

      let tStakers = staking.getNumberOfHolders();

      //Take DAI Balance on Staking
      let _tvlConstantDAI = reward_token_daiavax.balanceOf(
        staking._address
      ); /* TVL of DAI on Staking */

      //Take DYPS Balance
      //   let _tvlDYPS = token_dypsavax.balanceOf(
      //     staking._address
      //   ); /* TVL of DYPS */

      let [
        token_balance,
        pendingDivs,
        totalEarnedTokens,
        stakingTime,
        depositedTokens,
        lastClaimedTime,
        tvl2,
        referralFeeEarned,
        total_stakers,
        tvlConstantDAI,
        // tvlDYPS,
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
        _tvlConstantDAI,
        // _tvlDYPS,
      ]);

      //console.log({tvl, tvlConstantiDYP, _amountOutMin})
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

      let usdValueDAI = new BigNumber(tvlConstantDAI).toFixed(18);
      let usd_per_lp = lp_data ? dypprice : 0;

      let tvlUSD = new BigNumber(tvl)
        .times(usd_per_lp)
        .plus(usdValueDAI)
        .toFixed(18);
      settvlUSD(tvlUSD);
      //console.log({tvlUSD})
      //   let tvlDyps = new BigNumber(tvlDYPS).times(tokendata).toFixed(18);

      //   setsettvlDyps(tvlDyps)
      let balance_formatted = new BigNumber(token_balance)
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

      setdepositedTokens(depositedTokens_formatted);

      setlastClaimedTime(lastClaimedTime);
      let tvl_formatted = new BigNumber(tvl2).div(1e18).toString(10);

      settvl(tvl_formatted);

      setreferralFeeEarned(referralFeeEarned);
      setsettotal_stakers(total_stakers);

      let stakingOwner = await staking.owner();
      setstakingOwner(stakingOwner);
    } catch (e) {
      console.error(e);
    }

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
  };

  useEffect(() => {
    if (coinbase !== coinbase2 && coinbase !== null && coinbase !== undefined) {
      setcoinbase(coinbase);
    }
    if (
      staking &&
      staking._address === "0x6eb643813f0b4351b993f98bdeaef6e0f79573e9"
    ) {
      setPassivePool(true);
    }
    getTotalTvl();
  }, [coinbase, coinbase2]);

  useEffect(() => {
    if (chainId === "43114") {
      refreshBalance();
      if (depositAmount !== "") {
        checkApproval(depositAmount);
      }
    }
  }, [coinbase, coinbase2, staking]);

  useEffect(() => {
    setdepositAmount("");
    setdepositStatus("initial");
  }, [staking]);

  const getTotalTvl = async () => {
    let apy1 = 15;

    let apy2 = 30;
    setapy1(apy1);
    setapy2(apy2);
  };

  const handleApprove = async (e) => {
    if (passivePool === false) {
      setdepositLoading(true);

      if (other_info) {
        window.$.alert("This pool no longer accepts deposits!");
        setdepositLoading(false);
        return;
      }

      let amount = depositAmount;
      amount = new BigNumber(amount).times(1e18).toFixed(0);
      await reward_token_dypius_bsc
        .approve(staking._address, amount)
        .then(() => {
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
          }, 2000);
        });
    } else if (passivePool === true) {
      window.$.alert("This pool no longer accepts deposits!");
      return;
    }
  };

  const handleStake = async (e) => {
    if (passivePool === false) {
      setdepositLoading(true);
      if (other_info) {
        window.$.alert("This pool no longer accepts deposits!");
        setdepositLoading(false);

        return;
      }

      let amount = depositAmount;
      amount = new BigNumber(amount).times(1e18).toFixed(0);
      let referrer = window.config.ZERO_ADDRESS;

      await staking
        .stake(amount, referrer)
        .then(() => {
          setdepositLoading(false);
          setdepositStatus("success");
          refreshBalance();
        })
        .catch((e) => {
          setdepositLoading(false);
          setdepositStatus("fail");
          seterrorMsg(e?.message);
          setTimeout(() => {
            setdepositAmount("");
            setdepositStatus("fail");
            seterrorMsg("");
          }, 10000);
        });
    } else if (passivePool === true) {
      window.$.alert("This pool no longer accepts deposits!");
      return;
    }
  };

  const handleWithdraw = async (e) => {
    // e.preventDefault();
    setwithdrawLoading(true);

    let amount = new BigNumber(withdrawAmount).times(1e18).toFixed(0);

    await staking
      .unstake(amount)
      .then(() => {
        setwithdrawLoading(false);
        setwithdrawStatus("success");
        refreshBalance();
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

  const handleClaimDivs = () => {
    setclaimLoading(true);

    staking
      .claim()
      .then(() => {
        setclaimStatus("success");
        setclaimLoading(false);
        setpendingDivs(getFormattedNumber(0, 6));
        refreshBalance();
        setTimeout(() => {
          setclaimStatus("initial");
        }, 2000);
      })

      .catch((e) => {
        setclaimStatus("failed");
        setclaimLoading(false);
        seterrorMsg2(e?.message);

        setTimeout(() => {
          setclaimStatus("initial");
          seterrorMsg2("");
        }, 2000);
      });
  };

  const handleSetMaxDeposit = () => {
    const depositAmount = token_balance;
    checkApproval(depositAmount);
    setdepositAmount(depositAmount);
  };

  const handleSetMaxWithdraw = async (e) => {
    // e.preventDefault();
    let amount;
    await staking.depositedTokens(coinbase).then((data) => {
      amount = data;
    });

    let depositedTokens_formatted = new BigNumber(amount)
      .div(1e18)
      .toString(10);
    setwithdrawAmount(depositedTokens_formatted);
  };
  const getAPY = () => {
    return apr;
  };

  const getUsdPerETH = () => {
    return the_graph_result.usd_per_eth || 0;
  };

  const getApproxReturn = (depositAmount, days) => {
    let APY = getAPY() - fee_s;

    return ((depositAmount * APY) / 100 / 365) * days;
  };

  const getReferralLink = () => {
    return window.location.origin + window.location.pathname + "?r=" + coinbase;
  };

  const handleAvaxPool = async () => {
    await handleSwitchNetworkhook("0xa86a")
      .then(() => {
        this.props.handleSwitchNetwork("43114");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleReinvest = () => {
    setreInvestStatus("invest");
    setreInvestLoading(true);

    staking
      .reInvest()
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
        }, 2000);
      });
  };

  const convertTimestampToDate = (timestamp) => {
    const result = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(timestamp);
    return result;
  };

  let id = Math.random().toString(36);

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

  const focusInput = (field) => {
    document.getElementById(field).focus();
  };

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
  // console.log(convertTimestampToDate((Number(stakingTime) + Number(cliffTime)) * 1000), convertTimestampToDate(Date.now()));
  // let tvl_usd = tvl * tokendata;

  // let tvlDYPS = tvlDyps / 1e18;

  // tvl_usd = tvl_usd + tvlDYPS;

  // tvl_usd = getFormattedNumber(tvl_usd, 2);

  //let tvl_usd = this.state.tvl / 1e18 * this.state.usdPerToken
  let tvl_usd = tvlUSD / 1e18;

  const finalTvlUsd = Number(tvl) * usdPerToken;

  // let tvlDYPS2 = tvlDyps / 1e18;
  // tvl_usd = tvl_usd + tvlDYPS2;

  // tvl_usd = getFormattedNumber(tvl_usd, 2);

  const checkApproval = async (amount) => {
    const result = await window
      .checkapproveStakePool(
        coinbase,
        reward_token_dypius_bsc._address,
        staking._address
      )
      .then((data) => {
        console.log(data);
        return data;
      });

    let result_formatted = new BigNumber(result).div(1e18).toFixed(6);
    let result_formatted2 = new BigNumber(result).div(1e18).toFixed(2);

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
      .get("https://api.dyp.finance/api/the_graph_avax_v2")
      .then((data) => {
        const propertyiDyp = Object.entries(
          data.data.the_graph_avax_v2.token_data
        );
        settokendata(propertyiDyp[0][1].token_price_usd);
        return propertyiDyp[0][1].token_price_usd;
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

    // let usdPerToken = await window.getPrice("defi-yield-protocol");
    setusdPerToken(dypprice);
  };

  useEffect(() => {
    getUsdPerDyp();
    getPriceDYP();
  }, [coinbase, popup, show]);



  return (
    <div className="d-flex flex-column gap-2 w-100">
      {/* <div className="locktimewrapper align-items-center gap-2">
        <button
          className={
            lockTime === "No Lock" ? "method-btn-active" : "method-btn-disabled"
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
                Apr{" "}
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
                    <img src={moreinfo} alt="" onClick={aprOpen} />
                  </Tooltip>
                </ClickAwayListener>
              </span>
              <span className="info-pool-right-text">{finalApr}%</span>
            </div>
          </div>
          <div className="info-pool-item p-2">
            <div className="d-flex justify-content-between gap-1 align-items-center">
              <span className="info-pool-left-text">Chain</span>
              <span className="info-pool-right-text d-flex gap-1 align-items-center">
                <img
                  src={require(`../top-pools-card/assets/avax.svg`).default}
                  width={12}
                  height={12}
                  alt=""
                />{" "}
                Avalanche
              </span>
            </div>
          </div>
          <div className="info-pool-item p-2">
            <div className="d-flex justify-content-between gap-1 align-items-center">
              <span className="info-pool-left-text">TVL</span>
              <span className="info-pool-right-text">
                $
                {getFormattedNumber(
                  Number(tvl) * usdPerToken === 0
                    ? selectedPool.tvl_usd
                    : Number(tvl) * usdPerToken,
                  2
                )}
              </span>
            </div>
          </div>
        </div>
      </div> */}
      <div className="separator my-2"></div>
      {selectedTab === "deposit" ? (
        <div className="d-flex flex-column w-100 gap-2">
          <div className="d-flex align-items-center gap-2 justify-content-between w-100">
            <span className="deposit-popup-txt">Deposit</span>
            <div className="d-flex gap-1 align-items-baseline">
              <span className="bal-smallTxt">My Balance:</span>
              <span className="bal-bigTxt">
                {token_balance !== "..."
                  ? getFormattedNumber(token_balance, 6)
                  : getFormattedNumber(0, 6)}{" "}
                {token_symbol}
              </span>
            </div>
          </div>
          <div
            className={`d-flex flex-column w-100 gap-1 ${
              (chainId !== "43114" || !is_wallet_connected) && "blurrypool"
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
                  setdepositAmount(e.target.value);
                  checkApproval(e.target.value);
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

              <div className="d-flex gap-1 align-items-baseline">
                <span className="bal-smallTxt">Approved:</span>
                <span className="bal-bigTxt2">{approvedAmount} DYP</span>
              </div>
            </div>
          </div>
          <div className="info-pool-wrapper p-3 w-100">
            <div className="d-flex w-100 justify-content-between align-items-start align-items-lg-center gap-2 flex-column flex-lg-row">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-2">
                  <span className="bal-smallTxt">Pool Cap:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    1.5M DYP
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
                        <img src={moreinfo} alt="" onClick={poolCapOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="bal-smallTxt">Available Quota:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    N/A
                    <ClickAwayListener onClickAway={quotaClose}>
                      <Tooltip
                        open={quotaTooltip}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="top"
                        title={
                          <div className="tooltip-text">
                            {"The remaining capacity for staking in the pool."}
                          </div>
                        }
                      >
                        <img src={moreinfo} alt="" onClick={quotaOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="bal-smallTxt">Maximum deposit:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    N/A
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
                        <img src={moreinfo} alt="" onClick={maxDepositOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
              </div>
              <div className="d-flex flex-column">
                <span className="bal-smallTxt">Total Est. Rewards</span>
                <span className="deposit-popup-txt d-flex align-items-center gap-1">
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    {getFormattedNumber(
                      getApproxReturn(
                        depositAmount,
                        lockTime === "No Lock" ? 365 : lockTime
                      ),
                      2
                    )}{" "}
                    DYP
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
                  (chainId !== "43114" || !is_wallet_connected) && "blurrypool"
                } `}
              >
                <div className="info-pool-wrapper p-3 w-100">
                  <div className="d-flex w-100 justify-content-between align-items-end gap-2">
                    <div className="d-flex flex-column align-items-baseline">
                      <span className="bal-smallTxt">Rewards</span>
                      <span className="bal-bigTxt2">
                        {getFormattedNumber(pendingDivs)} DYP
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
                  <span className="bal-smallTxt">Pool fee:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    {fee_s}%
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
                        <img src={moreinfo} alt="" onClick={poolFeeOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="bal-smallTxt">Pool address:</span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${window.config.snowtrace_baseURL}/address/${staking?._address}`}
                    className="stats-link2"
                  >
                    {shortAddress(staking?._address)}{" "}
                    <img src={statsLinkIcon} alt="" />
                  </a>
                </div>
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-1">
                  <span className="bal-smallTxt">Start date:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    09 November 2023{" "}
                    <ClickAwayListener onClickAway={startDateClose}>
                      <Tooltip
                        open={startDateTooltip}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="top"
                        title={
                          <div className="tooltip-text">
                            {
                              "The date when the staking pool became available for participation."
                            }
                          </div>
                        }
                      >
                        <img src={moreinfo} alt="" onClick={startDateOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span className="bal-smallTxt">End date:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    {expiration_time}{" "}
                    <ClickAwayListener onClickAway={endDateClose}>
                      <Tooltip
                        open={endDateTooltip}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="top"
                        title={
                          <div className="tooltip-text">
                            {
                              "The date when the staking pool will no longer accept new deposits."
                            }
                          </div>
                        }
                      >
                        <img src={moreinfo} alt="" onClick={endDateOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
              </div>
            </div>
          </div>
          {is_wallet_connected && chainId === "43114" && (
            <button
              disabled={
                depositAmount === "" || depositLoading === true ? true : false
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
                {getFormattedNumber(depositedTokens, 2)} {token_symbol}
              </span>
            </div>
          </div>
          <div
            className={`d-flex flex-column w-100 gap-1 ${
              (chainId !== "43114" || !is_wallet_connected) && "blurrypool"
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
                  (Number(stakingTime) + Number(cliffTime)) * 1000 - Date.now()
                )
                .humanize(true)
                ?.includes("ago") && (
                <div className="d-flex gap-1 align-items-baseline">
                  <span className="bal-smallTxt">Unlocks:</span>
                  <span className="bal-bigTxt2">
                    ~
                    {moment
                      .duration(
                        (Number(stakingTime) + Number(cliffTime)) * 1000 -
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
                withdrawAmount === "" ||
                canWithdraw === false
                  ? true
                  : false
              }
              className={`btn filledbtn ${
                withdrawStatus === "failed"
                  ? "fail-button"
                  : withdrawStatus === "success"
                  ? "success-button"
                  : (withdrawAmount === "" && withdrawStatus === "initial") ||
                    canWithdraw === false
                  ? "disabled-btn"
                  : null
              } w-25 d-flex align-items-center justify-content-center m-auto`}
              style={{ height: "fit-content" }}
              onClick={() => {
                handleWithdraw();
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
                <>Failed</>
              ) : withdrawStatus === "success" ? (
                <>Success</>
              ) : (
                <>Withdraw</>
              )}
            </button>
          </div>
          <div className="separator my-2"></div>

          <span className="deposit-popup-txt">Earnings</span>
          <div
            className={`d-flex flex-column w-100 gap-1 ${
              (chainId !== "43114" || !is_wallet_connected) && "blurrypool"
            } `}
          >
            <div className="info-pool-wrapper p-3 w-100">
              <div className="d-flex w-100 justify-content-between align-items-end gap-2">
                <div className="d-flex flex-column align-items-baseline">
                  <span className="bal-smallTxt">Rewards</span>
                  <span className="bal-bigTxt2">
                    {getFormattedNumber(pendingDivs)} DYP
                  </span>
                </div>
                <button
                  className={`btn py-2 claim-inner-btn ${
                    (claimStatus === "claimed" && claimStatus === "initial") ||
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
                  <span className="bal-smallTxt">Pool fee:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    {fee_s}%
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
                        <img src={moreinfo} alt="" onClick={poolFeeOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="bal-smallTxt">Pool address:</span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${window.config.snowtrace_baseURL}address/${staking?._address}`}
                    className="stats-link2"
                  >
                    {shortAddress(staking?._address)}{" "}
                    <img src={statsLinkIcon} alt="" />
                  </a>
                </div>
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-1">
                  <span className="bal-smallTxt">Start date:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    09 November 2023{" "}
                    <ClickAwayListener onClickAway={startDateClose}>
                      <Tooltip
                        open={startDateTooltip}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="top"
                        title={
                          <div className="tooltip-text">
                            {
                              "The date when the staking pool became available for participation."
                            }
                          </div>
                        }
                      >
                        <img src={moreinfo} alt="" onClick={startDateOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span className="bal-smallTxt">End date:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    {expiration_time}{" "}
                    <ClickAwayListener onClickAway={endDateClose}>
                      <Tooltip
                        open={endDateTooltip}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="top"
                        title={
                          <div className="tooltip-text">
                            {
                              "The date when the staking pool will no longer accept new deposits."
                            }
                          </div>
                        }
                      >
                        <img src={moreinfo} alt="" onClick={endDateOpen} />
                      </Tooltip>
                    </ClickAwayListener>
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
          <img src={wallet} alt="" /> Connect wallet
        </button>
      ) : chainId !== "43114" ? (
        <button
          className="connectbtn btn m-auto"
          onClick={() => {
            handleAvaxPool();
          }}
        >
          Change Network
        </button>
      ) : (
        <></>
      )}
    </div>

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
    //         <div className="d-flex flex-column flex-lg-row w-100 align-items-start align-items-lg-center justify-content-between gap-3 gap-lg-5">
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

    //           <div className="d-flex flex-row-reverse flex-lg-row align-items-center justify-content-between earnrewards-container">
    //             <div className="d-flex flex-column flex-lg-row align-items-end align-items-lg-center gap-3 gap-lg-5">
    //               <div className="d-flex align-items-center justify-content-between gap-2">
    //                 <h6 className="earnrewards-text">Performance fee:</h6>
    //                 <h6 className="earnrewards-token d-flex align-items-center gap-1">
    //                   {fee_s}%
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
    //                         src={moreinfo}
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
    //                       <img src={moreinfo} alt="" onClick={aprOpen} />
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
    //                       <img src={moreinfo} alt="" onClick={lockOpen} />
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
    //                 <img src={poolsCalculatorIcon} alt="" />
    //                 Calculator
    //               </h6>
    //               <a
    //                 href={
    //                   "https://traderjoexyz.com/avalanche/trade?outputCurrency=0x1a3264f2e7b1cfc6220ec9348d33ccf02af7aaa4"
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
    //                   <img src={purplestats} alt="" />
    //                   Stats
    //                 </h6>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="pools-details-wrapper d-flex m-0 container-lg border-0">
    //       <div className="row gap-4 gap-lg-0 w-100 justify-content-between">
    //         <div className="firstblockwrapper col-12 col-md-6 col-lg-2">
    //           <div
    //             className="d-flex flex-row flex-lg-column align-items-center align-items-lg-start justify-content-between gap-4"
    //             style={{ height: "100%" }}
    //           >
    //             <h6 className="start-title">Start Staking</h6>

    //             {coinbase === null ||
    //             coinbase === undefined ||
    //             is_wallet_connected === false ? (
    //               <button className="connectbtn btn" onClick={showModal}>
    //                 <img src={wallet} alt="" /> Connect wallet
    //               </button>
    //             ) : chainId === "43114" ? (
    //               <div className="addressbtn btn">
    //                 <Address a={coinbase} chainId={43114} />
    //               </div>
    //             ) : (
    //               <button
    //                 className="connectbtn btn"
    //                 onClick={() => {
    //                   handleAvaxPool();
    //                 }}
    //               >
    //                 Change Network
    //               </button>
    //             )}
    //           </div>
    //         </div>

    //         <div
    //           className={`otherside-border col-12 col-md-12 col-lg-4  ${
    //             chainId !== "43114" || expired === true ? "blurrypool" : ""
    //           }`}
    //         >
    //           <div className="d-flex justify-content-between align-items-center gap-2">
    //             <div className="d-flex justify-content-center align-items-center gap-3">
    //               <h6 className="deposit-txt">Deposit</h6>

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
    //                     { lockTime === 'No Lock' ? 'The initial pool size is capped at 1M DYP. Additional opportunities to stake DYP are planned to be introduced over time.' :
    //                       "Deposit your assets to the staking smart contract. For lock time pools, the lock time resets if you add more deposits after making one previously."
    //                     }
    //                   </div>
    //                 }
    //               >
    //                 <img src={moreinfo} alt="" onClick={depositOpen} />
    //               </Tooltip>
    //             </ClickAwayListener>
    //           </div>
    //           <div className="d-flex flex-column gap-2 justify-content-between">
    //             <div className="d-flex align-items-center justify-content-between gap-2">
    //               <div className="input-container px-0">
    //                 <input
    //                   type="number"
    //                   autoComplete="off"
    //                   value={
    //                     Number(depositAmount) > 0
    //                       ? depositAmount
    //                       : depositAmount
    //                   }
    //                   onChange={(e) => {
    //                     setdepositAmount(e.target.value);
    //                     checkApproval(e.target.value);
    //                   }}
    //                   placeholder=" "
    //                   className="text-input"
    //                   style={{ width: "100%" }}
    //                   name="amount_deposit"
    //                   id="amount_deposit"
    //                   key="amount_deposit"
    //                 />
    //                 <label
    //                   className="label"
    //                   onClick={() => {
    //                     focusInput("amount_deposit");
    //                   }}
    //                 >
    //                   Amount
    //                 </label>
    //               </div>

    //               <button className="btn maxbtn" onClick={handleSetMaxDeposit}>
    //                 Max
    //               </button>

    //               <button
    //                 disabled={
    //                   depositAmount === "" || depositLoading === true ||
    //                   depositStatus === "success" ||
    //                   staking?._address.toLowerCase() ===
    //                     "0xdb2e1287aac9974ab28a66fabf9bcb34c5f37712".toLowerCase()
    //                     ? true
    //                     : false
    //                 }
    //                 className={`btn filledbtn ${
    //                   ((depositAmount === "" && depositStatus === "initial") ||
    //                   staking?._address.toLowerCase() ===
    //                     "0xdb2e1287aac9974ab28a66fabf9bcb34c5f37712".toLowerCase()) &&
    //                   "disabled-btn"
    //                 } ${
    //                   (depositStatus === "deposit" ||
    //                     depositStatus === "success") &&
    //                   staking?._address.toLowerCase() !==
    //                     "0xdb2e1287aac9974ab28a66fabf9bcb34c5f37712".toLowerCase()
    //                     ? "success-button"
    //                     : depositStatus === "fail"
    //                     ? "fail-button"
    //                     : null
    //                 } d-flex justify-content-center align-items-center gap-2`}
    //                 onClick={() => {
    //                   depositStatus === "deposit" &&
    //                   staking?._address.toLowerCase() !==
    //                     "0xdb2e1287aac9974ab28a66fabf9bcb34c5f37712".toLowerCase()
    //                     ? handleStake()
    //                     : depositStatus === "initial" &&  depositAmount !== "" &&
    //                     staking?._address.toLowerCase() !==
    //                       "0xdb2e1287aac9974ab28a66fabf9bcb34c5f37712".toLowerCase()
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
    //             chainId !== "43114" && "blurrypool"
    //           }`}
    //         >
    //           <div className="d-flex justify-content-between gap-2">
    //             <h6 className="withdraw-txt">Rewards</h6>
    //             <h6 className="withdraw-littletxt d-flex align-items-center gap-2">
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
    //                   <img src={moreinfo} alt="" onClick={rewardsOpen} />
    //                 </Tooltip>
    //               </ClickAwayListener>
    //             </h6>
    //           </div>

    //           <div className="form-row flex-column flex-lg-row d-flex gap-2 align-item-start align-items-lg-center justify-content-between">
    //             <div className="d-flex flex-column">
    //               <span
    //                 style={{
    //                   fontWeight: "500",
    //                   fontSize: "12px",
    //                   lineHeight: "18px",
    //                   color: "#c0c9ff",
    //                 }}
    //               >
    //                 DYP
    //               </span>
    //               <span>{pendingDivs}</span>
    //             </div>
    //             <div className="claim-reinvest-container d-flex justify-content-between align-items-center gap-3">
    //             <button
    //                   disabled={
    //                     claimStatus === "claimed" || claimStatus === "success" || pendingDivs <= 0
    //                       ? //
    //                         true
    //                       : false
    //                   }
    //                   className={`btn filledbtn ${
    //                     claimStatus === "claimed" && claimStatus === "initial" ||  pendingDivs <= 0
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
    //                   onClick={() => {handleClaimDivs()
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
    //               {expired === false && (
    //                 <button
    //                   disabled={pendingDivs > 0 ? false : true}
    //                   className={`btn outline-btn ${
    //                     reInvestStatus === "invest" || pendingDivs <= 0
    //                       ? "disabled-btn"
    //                       : reInvestStatus === "failed"
    //                       ? "fail-button"
    //                       : reInvestStatus === "success"
    //                       ? "success-button"
    //                       : null
    //                   } d-flex justify-content-center align-items-center gap-2`}
    //                   style={{ height: "fit-content" }}
    //                   onClick={handleReinvest}
    //                 >
    //                   {reInvestLoading ? (
    //                     <div
    //                       class="spinner-border spinner-border-sm text-light"
    //                       role="status"
    //                     >
    //                       <span class="visually-hidden">Loading...</span>
    //                     </div>
    //                   ) : reInvestStatus === "failed" ? (
    //                     <>
    //                       <img src={failMark} alt="" />
    //                       Failed
    //                     </>
    //                   ) : reInvestStatus === "success" ? (
    //                     <>Success</>
    //                   ) : (
    //                     <>Reinvest</>
    //                   )}
    //                 </button>
    //               )}
    //             </div>
    //           </div>
    //           {errorMsg2 && <h6 className="errormsg">{errorMsg2}</h6>}
    //         </div>
    //         <div
    //           className={`otherside-border col-12 col-md-12 col-lg-2 ${
    //             chainId !== "43114" && "blurrypool"
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
    //                 <img src={moreinfo} alt="" onClick={withdrawOpen} />
    //               </Tooltip>
    //             </ClickAwayListener>
    //           </h6>

    //           <button
    //             disabled={Number(depositedTokens) > 0 ? false : true}
    //             className="btn outline-btn"
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
    //       icon="stats"
    //       title="stats"
    //       setIsVisible={() => {
    //         setpopup(false);
    //       }}
    //       width="fit-content"
    //     >
    //       <div className="earn-hero-content p4token-wrapper">
    //         <div className="l-box pl-3 pr-3">
    //           <div className="container px-0">
    //             <div className="stats-container my-4">
    //               <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
    //                 <span className="stats-card-title">My DYP Deposit</span>
    //                 <h6 className="stats-card-content">
    //                   {getFormattedNumber(depositedTokens,6) } DYP
    //                 </h6>
    //               </div>
    //               <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
    //                 <span className="stats-card-title">My DYP Balance</span>
    //                 <h6 className="stats-card-content">
    //                   {getFormattedNumber(token_balance,6) } {token_symbol}
    //                 </h6>
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
    //                   {getFormattedNumber(tvl,6) } {token_symbol}
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
    //             <div className="d-flex align-items-center justify-content-between">
    //               <div className="referralwrapper col-8">
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
    //                             data-clipboard-text={getReferralLink}
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
    //                     data-clipboard-text={getReferralLink}
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
    //               <div className="col-3 d-flex flex-column gap-1">
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
    //                   href={`${window.config.snowtrace_baseURL}/address/${coinbase}`}
    //                   className="stats-link"
    //                 >
    //                   {shortAddress(coinbase)}{" "}
    //                   <img src={statsLinkIcon} alt="" />
    //                 </a>
    //                 <a
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   href={`https://github.com/dypfinance/staking-governance-security-audits`}
    //                   className="stats-link"
    //                 >
    //                   Audit <img src={statsLinkIcon} alt="" />
    //                 </a>
    //                 <a
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   href={`${window.config.snowtrace_baseURL}/token/${reward_token_dypius_bsc._address}?a=${coinbase}`}
    //                   className="stats-link"
    //                 >
    //                   View transaction <img src={statsLinkIcon} alt="" />
    //                 </a>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </Modal>
    //   )}

    //   {showWithdrawModal && (
    //     <Modal
    //       visible={showWithdrawModal}
    //       modalId="withdrawmodal"
    //       title="withdraw"
    //       setIsVisible={() => {
    //         setshowWithdrawModal(false);
    //       }}
    //       width="fit-content"
    //     >
    //       <div className="earn-hero-content p4token-wrapper">
    //         <div className="l-box pl-3 pr-3">
    //           <div className="container px-0">
    //             <div className="row" style={{ marginLeft: "0px" }}>
    //               <h6 className="withdrawdesc mt-2 p-0">
    //                 {lockTime === "No Lock"
    //                   ? "Your deposit has no lock-in period. You can withdraw your assets anytime, or continue to earn rewards every day."
    //                   : `The pool has a lock time. You can withdraw your deposited assets after the lock time expires.`}
    //               </h6>
    //             </div>

    //             <div className="d-flex flex-column mt-2">
    //               <div className="d-flex  gap-2 justify-content-between align-items-center mt-2">
    //                 <div className="d-flex flex-column gap-1">
    //                   <h6 className="withsubtitle mt-3">Timer</h6>
    //                   <h6 className="withtitle" style={{ fontWeight: 300 }}>
    //                     {lockTime === "No Lock" ? (
    //                       "No Lock"
    //                     ) : (
    //                       <Countdown
    //                       date={
    //                         (Number(stakingTime) + Number(cliffTime)) *
    //                         1000
    //                       }
    //                         renderer={renderer}
    //                       />
    //                     )}
    //                   </h6>
    //                 </div>
    //               </div>
    //               <div className="separator"></div>
    //               <div className="d-flex  gap-2 justify-content-between align-items-center mb-4">
    //                 <div className="d-flex flex-column gap-1">
    //                   <h6 className="withsubtitle">Balance</h6>
    //                   <h6 className="withtitle">
    //                   {getFormattedNumber(depositedTokens,6)} {token_symbol}
    //                   </h6>
    //                 </div>
    //               </div>

    //               <div className="d-flex align-items-center justify-content-between gap-2">
    //                 <div className="input-container px-0">
    //                   <input
    //                     type="number"
    //                     autoComplete="off"
    //                     value={withdrawAmount}
    //                     onChange={(e) => setwithdrawAmount(e.target.value)}
    //                     placeholder=" "
    //                     className="text-input"
    //                     style={{ width: "100%" }}
    //                     name="amount_withdraw"
    //                     id="amount_withdraw"
    //                     key="amount_withdraw"
    //                   />
    //                   <label
    //                     className="label"
    //                     onClick={() => focusInput("amount_withdraw")}
    //                   >
    //                     Withdraw Amount
    //                   </label>
    //                 </div>

    //                 <button
    //                   className="btn maxbtn"
    //                   onClick={handleSetMaxWithdraw}
    //                 >
    //                   Max
    //                 </button>
    //               </div>

    //               <div className="d-flex flex-column align-items-start justify-content-between gap-2 mt-4">
    //                 <button
    //                   disabled={
    //                     withdrawAmount === "" ||
    //                     withdrawStatus === "failed" ||
    //                     withdrawStatus === "success" ||
    //                     canWithdraw === false
    //                       ? true
    //                       : false
    //                   }
    //                   className={` w-100 btn filledbtn ${
    //                     (withdrawAmount === "" &&
    //                       withdrawStatus === "initial") ||
    //                     canWithdraw === false
    //                       ? "disabled-btn"
    //                       : withdrawStatus === "failed"
    //                       ? "fail-button"
    //                       : withdrawStatus === "success"
    //                       ? "success-button"
    //                       : null
    //                   } d-flex justify-content-center align-items-center`}
    //                   style={{ height: "fit-content" }}
    //                   onClick={() => handleWithdraw()}
    //                 >
    //                   {withdrawLoading ? (
    //                     <div
    //                       class="spinner-border spinner-border-sm text-light"
    //                       role="status"
    //                     >
    //                       <span class="visually-hidden">Loading...</span>
    //                     </div>
    //                   ) : withdrawStatus === "failed" ? (
    //                     <>
    //                       <img src={failMark} alt="" />
    //                       Failed
    //                     </>
    //                   ) : withdrawStatus === "success" ? (
    //                     <>Success</>
    //                   ) : (
    //                     <>Withdraw</>
    //                   )}
    //                 </button>
    //                 {/* <span
    //                   className="mt-2"
    //                   style={{
    //                     fontWeight: "400",
    //                     fontSize: "12px",
    //                     lineHeight: "18px",
    //                     color: "#C0C9FF",
    //                   }}
    //                 >
    //                   *No withdrawal fee
    //                 </span> */}
    //                 {/* <div className="form-row">
    //                         <div className="col-6">
    //                           <button
    //                             title={
    //                               canWithdraw
    //                                 ? ""
    //                                 : `You recently staked, you can unstake ${cliffTimeInWords}`
    //                             }
    //                             disabled={!canWithdraw || !is_connected}
    //                             className="btn  btn-primary btn-block l-outline-btn"
    //                             type="submit"
    //                           >
    //                             WITHDRAW
    //                           </button>
    //                         </div>
    //                         <div className="col-6">
    //                           <button
    //                             onClick={(e) => {
    //                               e.preventDefault();
    //                               this.handleWithdrawDyp();
    //                             }}
    //                             title={
    //                               canWithdraw
    //                                 ? ""
    //                                 : `You recently staked, you can unstake ${cliffTimeInWords}`
    //                             }
    //                             disabled={!canWithdraw || !is_connected}
    //                             className="btn  btn-primary btn-block l-outline-btn"
    //                             type="submit"
    //                           >
    //                             WITHDRAW
    //                           </button>
    //                         </div>
    //                       </div> */}
    //               </div>
    //               {errorMsg3 && <h6 className="errormsg">{errorMsg3}</h6>}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </Modal>
    //   )}

    //   {show === true && (
    //     <WalletModal
    //       show={show}
    //       handleClose={hideModal}
    //       handleConnection={()=>{handleConnection(); setshow(false)}}
    //     />
    //   )}

    //   {showCalculator === true && (
    //     <Modal
    //       visible={showCalculator}
    //       title="calculator"
    //       modalId="calculatormodal"
    //       setIsVisible={() => setshowCalculator(false)}
    //     >
    //       <div className="pools-calculator">
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
    //               DYP to Deposit
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
    //             $ {getFormattedNumber(getApproxReturn() * usdPerToken, 3)} USD
    //           </h3>
    //           <h6
    //             style={{
    //               fontWeight: "300",
    //               fontSize: "15px",
    //               color: "#f7f7fc",
    //             }}
    //           >
    //             Approx {getFormattedNumber(getApproxReturn(), 2)} DYP
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

export default StakeDypiusAvax;
