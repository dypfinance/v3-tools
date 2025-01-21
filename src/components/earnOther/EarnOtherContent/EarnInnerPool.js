import React, { useState, useEffect } from "react";
import { ClickAwayListener } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip"; 
import getFormattedNumber from "../../../functions/get-formatted-number";
import moment from "moment";
import axios from "axios";
import { shortAddress } from "../../../functions/shortAddress"; 

const EarnInnerPool = ({
  selectedBtn,
  selectedTab,
  the_graph_result,
  staking,
  coinbase,
  isPremium,
  lockTime,
  other_info,
  apr,
  selectedPool,
}) => {
  const [poolCapTooltip, setPoolCapTooltip] = useState(false);
  const [quotaTooltip, setQuotaTooltip] = useState(false);
  const [maxDepositTooltip, setMaxDepositTooltip] = useState(false);
  const [earlyWithdrawTooltip, setEarlyWithdrawTooltip] = useState(false);
  const [poolFeeTooltip, setPoolFeeTooltip] = useState(false);
  const [startDateTooltip, setStartDateTooltip] = useState(false);
  const [endDateTooltip, setEndDateTooltip] = useState(false);
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
 
  const [errorMsg, seterrorMsg] = useState("");
  const [errorMsg2, seterrorMsg2] = useState("");
  const [errorMsg3, seterrorMsg3] = useState("");
  const [contractDeployTime, setcontractDeployTime] = useState("");
  const [disburseDuration, setdisburseDuration] = useState("");
  const [tvlDyps, setsettvlDyps] = useState("");
  const [total_stakers, settotal_stakers] = useState("");

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

  const TOKEN_DECIMALS = window.config.token_decimals;

  let {
    reward_token,
    BigNumber,
    alertify,
    reward_token_idyp,
    token_dypsbsc,
    reward_token_daibsc,
  } = window;
  let token_symbol = "DYP";

 

  const refreshBalance = async () => {
    let coinbase = coinbase2;

    if (window.coinbase_address) {
      coinbase = window.coinbase_address;
      setcoinbase(coinbase);
    }
    let lp_data;
    let usd_per_dyps;
    if (the_graph_result) {
      lp_data = the_graph_result.token_data;
      //console.log({lp_data})

      //Calculate APY

      // let usd_per_idyp = the_graph_result.token_data ? the_graph_result.token_data["0xbd100d061e120b2c67a24453cf6368e63f1be056"].token_price_usd : 1
      // let apy = apr;
      // setap
      // this.setState({ apy });

      usd_per_dyps = the_graph_result.price_DYPS
        ? the_graph_result.price_DYPS
        : 1;
    }
    try {
      let _bal = reward_token.balanceOf(coinbase);
      if (staking) {
        let _pDivs = staking.getTotalPendingDivs(coinbase);
        let _tEarned = staking.totalEarnedTokens(coinbase);
        let _stakingTime = staking.stakingTime(coinbase);
        let _dTokens = staking.depositedTokens(coinbase);
        let _lClaimTime = staking.lastClaimedTime(coinbase);
        let _tvl = reward_token.balanceOf(staking._address);
        let _rFeeEarned = staking.totalReferralFeeEarned(coinbase);
        let tStakers = staking.getNumberOfHolders();

        //Take DAI Balance on Staking
        let _tvlConstantDAI = reward_token_daibsc.balanceOf(
          staking._address
        ); /* TVL of DAI on Staking */

        //Take DYPS Balance
        let _tvlDYPS = token_dypsbsc.balanceOf(
          staking._address
        ); /* TVL of DYPS */

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
          tvlConstantDAI,
          tvlDYPS,
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
          _tvlDYPS,
        ]);

        //console.log({tvl, tvlConstantiDYP, _amountOutMin})

        let usdValueDAI = new BigNumber(tvlConstantDAI).toFixed(18);
        let usd_per_lp = lp_data
          ? lp_data[window.reward_token["_address"]].token_price_usd
          : 0;
        let tvlUSD = new BigNumber(tvl)
          .times(usd_per_lp)
          .plus(usdValueDAI)
          .toFixed(18);
        //console.log({tvlUSD})

        let tvlDyps = new BigNumber(tvlDYPS).times(usd_per_dyps).toFixed(18);

        let balance_formatted = new BigNumber(token_balance)
          .div(1e18)
          .toString(10);
        settoken_balance(balance_formatted);

        let usd_per_bnb = the_graph_result.token_data
          ? the_graph_result.usd_per_eth
          : 1;

        let divs_formatted = new BigNumber(pendingDivs)
          .div(10 ** TOKEN_DECIMALS)
          .div(usd_per_bnb)
          .toString(10);

        setpendingDivs(getFormattedNumber(divs_formatted, 6));

        let earnedTokens_formatted = new BigNumber(totalEarnedTokens)
          .div(10 ** TOKEN_DECIMALS)
          .toString(10);
        settotalEarnedTokens(getFormattedNumber(earnedTokens_formatted, 6));

        setstakingTime(stakingTime);
        let depositedTokens_formatted = new BigNumber(depositedTokens)
          .div(1e18)
          .toString(10);

        setdepositedTokens(depositedTokens_formatted);

        setlastClaimedTime(lastClaimedTime);

        let tvl_formatted = new BigNumber(tvl).div(1e18).toString(10);
        settvl(tvl_formatted);

        setsettvlDyps(tvlDyps);
        setreferralFeeEarned(referralFeeEarned);
        settotal_stakers(total_stakers);

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
    refreshBalance();
    if (depositAmount !== "") {
      checkApproval(depositAmount);
    }
  }, [coinbase, coinbase2, staking]);

  useEffect(() => {
    setdepositAmount("");
    setdepositStatus("initial");
  }, [staking]);

  const handleApprove = (e) => {
    setdepositLoading(true);

    if (other_info) {
      window.$.alert("This pool no longer accepts deposits!");
      setdepositLoading(false);

      return;
    }

    let amount = depositAmount;
    amount = new BigNumber(amount).times(1e18).toFixed(0);
    reward_token
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
        }, 10000);
      });
  };

  const handleStake = async (e) => {
    //   e.preventDefault();
    setdepositLoading(true);

    if (other_info) {
      window.$.alert("This pool no longer accepts deposits!");
      setdepositLoading(false);

      return;
    }

    let amount = depositAmount;
    amount = new BigNumber(amount).times(1e18).toFixed(0);
    let referrer = window.config.ZERO_ADDRESS;

    let deadline = Math.floor(
      Date.now() / 1e3 + window.config.tx_max_wait_seconds
    );

    const isPremiumStake = await staking.premiumStake();

    if (isPremiumStake === false) {
      staking
        .stake(amount, referrer, 0, deadline)
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
            setdepositStatus("initial");
            seterrorMsg("");
          }, 10000);
        });
    } else if (isPremiumStake === true && isPremium === true) {
      staking
        .premiumStaking(amount, referrer, 0, deadline)
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
            setdepositStatus("initial");
            seterrorMsg("");
          }, 10000);
        });
    } else if (isPremiumStake === true && isPremium === false) {
      window.$.alert(
        "This pool is avaliable only to premium users at the moment! Check back later or upgrade to premium!"
      );
      setdepositLoading(false);
      return;
    }
    //NO REFERRER HERE
  };

  const handleWithdraw = async (e) => {
    //   e.preventDefault();
    setwithdrawLoading(true);
    let amount = new BigNumber(withdrawAmount).times(1e18).toFixed(0);

    let deadline = Math.floor(
      Date.now() / 1e3 + window.config.tx_max_wait_seconds
    );

    staking
      .unstake(amount, 0, deadline)
      .then(() => {
        setwithdrawStatus("success");
        setwithdrawLoading(false);
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

  const handleClaimDivs = async (e) => {
    //   e.preventDefault();
    setclaimLoading(true);

    let address = coinbase;
    let amount = await staking.getTotalPendingDivs(address);

    let router = await window.getPancakeswapRouterContract();
    let WETH = await router.methods.WETH().call();
    let platformTokenAddress = window.config.reward_token_address;
    let rewardTokenAddress = window.config.reward_tokenbsc_address2;
    let path = [
      ...new Set(
        [rewardTokenAddress, WETH, platformTokenAddress].map((a) =>
          a.toLowerCase()
        )
      ),
    ];
    let _amountOutMin = await router.methods
      .getAmountsOut(amount, path)
      .call()
      .catch((e) => {
        setclaimStatus("failed");
        setclaimLoading(false);
        seterrorMsg2(e?.message);

        setTimeout(() => {
          setclaimStatus("initial");
          seterrorMsg2("");
        }, 2000);
      });
    _amountOutMin = _amountOutMin[_amountOutMin.length - 1];
    _amountOutMin = new BigNumber(_amountOutMin)
      .times(100 - window.config.slippage_tolerance_percent)
      .div(100)
      .toFixed(0);

    let referralFee = new BigNumber(_amountOutMin)
      .times(500)
      .div(1e4)
      .toFixed(0);
    referralFee = referralFee.toString();

    let deadline = Math.floor(
      Date.now() / 1e3 + window.config.tx_max_wait_seconds
    );

    console.log({ referralFee, _amountOutMin, deadline });

    staking
      .claim(0, _amountOutMin, deadline)
      .then(() => {
        setclaimStatus("success");
        setclaimLoading(false);
        setpendingDivs(getFormattedNumber(0, 6));
        refreshBalance();
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
    const depositAmountFormatted = token_balance;
    checkApproval(token_balance);

    setdepositAmount(depositAmountFormatted);
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

  const getApproxReturn = () => {
    if (the_graph_result) {
      let usd_per_token = the_graph_result.token_data
        ? the_graph_result.token_data[
            "0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17"
          ].token_price_usd
        : 1;
      let usd_per_eth = the_graph_result.token_data
        ? the_graph_result.usd_per_eth
        : 1;

      return (
        ((approxDeposit * usd_per_token * apr) / usd_per_eth / 100 / 365) *
        approxDays
      );
    }
  };

  const getReferralLink = () => {
    return window.location.origin + window.location.pathname + "?r=" + coinbase;
  };

  const handleReinvest = async (e) => {
    //   e.preventDefault();
    setreInvestStatus("invest");
    setreInvestLoading(true);

    if (stakingTime != 0 && Date.now() - stakingTime >= cliffTime) {
      window.$.alert(
        "Contract Expired! Your lock time ended so please withdraw your funds and move " +
          "to a new pool. Any unclaimed rewards will be automatically distributed to your wallet within 24 hours!"
      );
      setreInvestLoading(false);

      return;
    }

    let address = coinbase;
    let amount = await staking.getTotalPendingDivs(address);

    let router = await window.getPancakeswapRouterContract();
    let WETH = await router.methods.WETH().call();
    // let platformTokenAddress = window.config.reward_token_address
    let rewardTokenAddress = window.config.reward_token_daibsc_address;
    let path = [
      ...new Set([rewardTokenAddress, WETH].map((a) => a.toLowerCase())),
    ];
    let _amountOutMin = await router.methods
      .getAmountsOut(amount, path)
      .call()
      .catch((e) => {
        setreInvestStatus("failed");
        setreInvestLoading(false);
        seterrorMsg2(e?.message);

        setTimeout(() => {
          setreInvestStatus("initial");
          seterrorMsg2("");
        }, 10000);
      });
    _amountOutMin = _amountOutMin[_amountOutMin.length - 1];
    _amountOutMin = new BigNumber(_amountOutMin)
      .times(100 - window.config.slippage_tolerance_percent)
      .div(100)
      .toFixed(0);

    let referralFee = new BigNumber(_amountOutMin)
      .times(500)
      .div(1e4)
      .toFixed(0);
    referralFee = referralFee.toString();

    // _amountOutMin = _amountOutMin - referralFee
    // _amountOutMin = _amountOutMin.toString()

    let deadline = Math.floor(
      Date.now() / 1e3 + window.config.tx_max_wait_seconds
    );

    console.log({ amount, _amountOutMin, deadline });

    staking
      .reInvest(0, _amountOutMin, deadline)
      .then(() => {
        setreInvestStatus("success");
        setreInvestLoading(false);
        setpendingDivs(getFormattedNumber(0, 6));
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

  const aprClose = () => {
    setaprTooltip(false);
  };

  const aprOpen = () => {
    setaprTooltip(true);
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

  const earlyWithdrawClose = () => {
    setEarlyWithdrawTooltip(false);
  };

  const earlyWithdrawOpen = () => {
    setEarlyWithdrawTooltip(true);
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

  let tvl_usd = tvl * tokendata;

  let tvlDYPS = tvlDyps / 1e18;

  tvl_usd = tvl_usd + tvlDYPS;

  tvl_usd = getFormattedNumber(tvl_usd, 2);

  let id = Math.random().toString(36);

  const focusInput = (field) => {
    document.getElementById(field).focus();
  };

  const checkApproval = async (amount) => {
    const result = await window
      .checkapproveStakePool(coinbase, reward_token._address, staking._address)
      .then((data) => {
        console.log(data);
        return data;
      });

    let result_formatted = new BigNumber(result).div(1e18).toFixed(6);

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
  }, []);

  return (
    <div className="d-flex flex-column gap-2 w-100">
      <div className="locktimewrapper align-items-center gap-2">
        <button
          className={
            selectedBtn === "flexible"
              ? "method-btn-active"
              : "method-btn-disabled"
          }
        >
          Flexible
        </button>
        <button
          className={
            selectedBtn === "30days"
              ? "method-btn-active"
              : "method-btn-disabled"
          }
        >
          30 Days
        </button>
        <button
          className={
            selectedBtn === "60days"
              ? "method-btn-active"
              : "method-btn-disabled"
          }
        >
          60 Days
        </button>
        <button
          className={
            selectedBtn === "90days"
              ? "method-btn-active"
              : "method-btn-disabled"
          }
        >
          90 Days
        </button>
        <button
          className={
            selectedBtn === "120days"
              ? "method-btn-active"
              : "method-btn-disabled"
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
                    <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={aprOpen} />
                  </Tooltip>
                </ClickAwayListener>
              </span>
              <span className="info-pool-right-text">{selectedPool.apr}</span>
            </div>
          </div>
          <div className="info-pool-item p-2">
            <div className="d-flex justify-content-between gap-1 align-items-center">
              <span className="info-pool-left-text">Chain</span>
              <span className="info-pool-right-text d-flex gap-1 align-items-center">
                <img
                  src={require(`../../top-pools-card/assets/${selectedPool.chainLogo}`)}
                  width={12}
                  height={12}
                  alt=""
                />{" "}
                {selectedPool.chain}
              </span>
            </div>
          </div>
          <div className="info-pool-item p-2">
            <div className="d-flex justify-content-between gap-1 align-items-center">
              <span className="info-pool-left-text">TVL</span>
              <span className="info-pool-right-text">$161,696.37</span>
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
                25,250.52 {selectedPool.tokenTicker}
              </span>
            </div>
          </div>
          <div className="d-flex flex-column w-100 gap-1">
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
                placeholder={`Minimum 0.001 ${selectedPool.tokenTicker}`}
              />
              <button
                className="inner-max-btn position-absolute"
                onClick={handleSetMaxDeposit}
              >
                Max
              </button>
            </div>
            <div className="d-flex w-100 justify-content-between gap-1 align-items-center">
              {errorMsg && <h6 className="errormsg m-0">{errorMsg}</h6>}

              <div className="d-flex gap-1 align-items-baseline">
                <span className="bal-smallTxt">Approved:</span>
                <span className="bal-bigTxt2">
                  20.52 {selectedPool.tokenTicker}
                </span>
              </div>
            </div>
          </div>
          <div className="info-pool-wrapper p-3 w-100">
            <div className="d-flex w-100 justify-content-between align-items-start align-items-lg-center gap-2 flex-column flex-lg-row">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-2">
                  <span className="bal-smallTxt">Pool Cap:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    20 {selectedPool.tokenTicker}
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
                    8 {selectedPool.tokenTicker}
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
                        <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={quotaOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="bal-smallTxt">Maximum deposit:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    2 {selectedPool.tokenTicker}
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
                  0.250 {selectedPool.tokenTicker}
                </span>
              </div>
            </div>
          </div>

          {pendingDivs > 0 && (
            <>
              {" "}
              <div className="separator my-2"></div>
              <span className="deposit-popup-txt">Reinvest</span>
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
                    10%
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
                    2%
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
                <div className="d-flex align-items-center gap-2">
                  <span className="bal-smallTxt">Pool address:</span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${window.config.bscscan_baseURL}address/${staking?._address}`}
                    className="stats-link2"
                  >
                    {shortAddress(staking._address)}{" "}
                    <img src={'https://cdn.worldofdypians.com/tools/statsLinkIcon.svg'} alt="" />
                  </a>
                </div>
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-1">
                  <span className="bal-smallTxt">Start date:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    09 Nov 2023{" "}
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
                        <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={startDateOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span className="bal-smallTxt">End date:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    08 November 2024{" "}
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
                        <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={endDateOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
              </div>
            </div>
          </div>
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
        </div>
      ) : (
        <div className="d-flex flex-column w-100 gap-2">
          <div className="d-flex align-items-center gap-2 justify-content-between w-100">
            <span className="deposit-popup-txt">Withdraw</span>
            <div className="d-flex gap-1 align-items-baseline">
              <span className="bal-smallTxt">Deposited:</span>
              <span className="bal-bigTxt">
                {" "}
                {getFormattedNumber(depositedTokens, 2)}{" "}
                {selectedPool.tokenTicker}
              </span>
            </div>
          </div>
          <div className="d-flex flex-column w-100 gap-1">
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
                placeholder={`Minimum 0.001 ${selectedPool.tokenTicker}`}
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
          <div className="separator my-2"></div>
          <div className="info-pool-wrapper p-3 w-100">
            <div className="d-flex w-100 flex-column flex-lg-row justify-content-between align-items-start align-items-lg-end gap-2">
              <div className="d-flex flex-column">
                <span className="deposit-popup-txt">Summary</span>

                <div className="d-flex align-items-center gap-2">
                  <span className="bal-smallTxt">Early withdraw fee:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    10%
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
                    2%
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
                <div className="d-flex align-items-center gap-2">
                  <span className="bal-smallTxt">Pool address:</span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${window.config.bscscan_baseURL}address/${staking?._address}`}
                    className="stats-link2"
                  >
                    {shortAddress(staking._address)}{" "}
                    <img src={'https://cdn.worldofdypians.com/tools/statsLinkIcon.svg'} alt="" />
                  </a>
                </div>
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-1">
                  <span className="bal-smallTxt">Start date:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    09 Nov 2023{" "}
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
                        <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={startDateOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span className="bal-smallTxt">End date:</span>
                  <span className="deposit-popup-txt d-flex align-items-center gap-1">
                    08 November 2024{" "}
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
                        <img src={'https://cdn.worldofdypians.com/tools/more-info.svg'} alt="" onClick={endDateOpen} />
                      </Tooltip>
                    </ClickAwayListener>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarnInnerPool;
