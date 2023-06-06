import React, { useState, useEffect } from "react";
import moment from "moment";
import getFormattedNumber from "../../functions/get-formatted-number";
import Modal from "../Modal/Modal";
import Address from "./address";
import WalletModal from "../WalletModal";
import "./top-pools.css";
import Countdown from "react-countdown";
import ellipse from "./assets/ellipse.svg";
import empty from "./assets/empty.svg";
import check from "./assets/check.svg";
import failMark from "../../assets/failMark.svg";
import arrowup from "./assets/arrow-up.svg";
import whiteArrowUp from "./assets/whiteArrowUp.svg";
import moreinfo from "./assets/more-info.svg";
import stats from "./assets/stats.svg";
import purplestats from "./assets/purpleStat.svg";
import wallet from "./assets/wallet.svg";
import Tooltip from "@material-ui/core/Tooltip";
import dropdownVector from "./assets/dropdownVector.svg";
import axios from "axios";
import statsLinkIcon from "./assets/statsLinkIcon.svg";
import { shortAddress } from "../../functions/shortAddress";
import poolStatsIcon from "./assets/poolStatsIcon.svg";
import poolsCalculatorIcon from "./assets/poolsCalculatorIcon.svg";
import calculatorIcon from "../calculator/assets/calculator.svg";
import xMark from "../calculator/assets/xMark.svg";
import { ClickAwayListener } from "@material-ui/core";
import { handleSwitchNetworkhook } from "../../functions/hooks";

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

const FarmAvaxFunc = ({
  token,
  staking,
  constant,
  liquidity,
  lp_symbol,
  reward,
  lock,
  rebase_factor,
  expiration_time,
  fee,
  chainId,
  handleConnection,
  lockTime,
  coinbase,
  listType,
  handleSwitchNetwork,
  expired,
  finalApr,
  the_graph_result,
  lp_id,
  isConnected,
}) => {
  let { reward_token, BigNumber, alertify, reward_token_idyp, token_dypsavax } =
    window;
  const LP_AMPLIFY_FACTOR = rebase_factor || window.config.lp_amplify_factor;
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
  const [iDypUSD, setIDypUSD] = useState(0);
  const [dypUSD, setDypUSD] = useState(0);
  const [tvlUSD, setTvlUSD] = useState("");
  const [dypPerAvaxPrice, setDypPerAvaxPrice] = useState(0);
  const [totalValueLocked, setTotalValueLocked] = useState("");
  const [depositedTokensDYP, setDepositedTokensDYP] = useState("");
  const [tvlConstantDYP, setTvlConstantDYP] = useState("");
  const [pendingDivsStaking, setPendingDivsStaking] = useState("");
  const [depositedTokensUSD, setDepositedTokensUSD] = useState("");
  const [token_balance, setToken_balance] = useState("");
  const [reward_token_balance, setReward_token_balance] = useState("");
  const [pendingDivs, setPendingDivs] = useState("");
  const [totalEarnedTokens, setTotalEarnedTokens] = useState("");
  const [cliffTime, setCliffTime] = useState("");
  const [stakingTime, setStakingTime] = useState("");
  const [depositedTokens, setDepositedTokens] = useState("");
  const [lastClaimedTime, setlastClaimedTime] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [totalEarnedEth, setTotalEarnedEth] = useState("");
  const [pendingDivsEth, setPendingDivsEth] = useState("");
  const [wethBalance, setWethBalance] = useState("");
  const [usdPerToken, setUsdPerToken] = useState(0);
  const [tokensToBeSwapped, setTokensToBeSwapped] = useState("");
  const [tokensToBeDisbursedOrBurnt, setTokensToBeDisbursedOrBurnt] =
    useState("");
  const [coinbase2, setCoinbase2] = useState(
    "0x0000000000000000000000000000000000000111"
  );
  const [selectedPool, setSelectedPool] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositStatus, setDepositStatus] = useState("initial");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState("initial");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState("initial");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsg2, setErrorMsg2] = useState("");
  const [errorMsg3, setErrorMsg3] = useState("");
  const [tvl, setTvl] = useState("");
  const [tvlDyps, setTvlDyps] = useState("");
  const [stakingOwner, setStakingOwner] = useState(null);
  const [approxDeposit, setApproxDeposit] = useState(100 / LP_AMPLIFY_FACTOR);
  const [approxDays, setApproxDays] = useState(365);
  const [lastSwapExecutionTime, setLastSwapExecutionTime] = useState("");
  const [swapAttemptPeriod, setSwapAttemptPeriod] = useState("");
  const [contractDeployTime, setContractDeployTime] = useState("");
  const [disburseDuration, setDisburseDuration] = useState("");
  const [selectedBuybackToken, setselectedBuybackToken] = useState(
    Object.keys(window.buyback_activetokens_farmingavax)[0]
  );
  const [selectedTokenDecimals, setselectedTokenDecimals] = useState(
    window.buyback_activetokens_farmingavax[
      Object.keys(window.buyback_activetokens_farmingavax)[0]
    ].decimals
  );
  const [selectedTokenBalance, setSelectedTokenBalance] = useState("");
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(
    window.buyback_activetokens_farmingavax[
      Object.keys(window.buyback_activetokens_farmingavax)[0]
    ].symbol
  );
  const [selectedBuybackTokenWithdraw, setSelectedBuybackTokenWithdraw] =
    useState(Object.keys(window.buyback_activetokens_farmingavax)[0]);
  const [selectedClaimToken, setSelectedClaimToken] = useState(0);
  const [show, setShow] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [popup, setPopup] = useState(false);
  const [is_wallet_connected, setIs_wallet_connected] = useState(false);
  const [selectedTokenLogo, setSelectedTokenLogo] = useState("wavax");
  const [selectedRewardTokenLogo1, setSelectedRewardTokenLogo1] =
    useState("wavax");
  const [selectedRewardTokenLogo2, setSelectedRewardTokenLogo2] =
    useState("dyp");
  const [performanceTooltip, setPerformanceTooltip] = useState(false);
  const [aprTooltip, setAprTooltip] = useState(false);
  const [lockTooltip, setLockTooltip] = useState(false);
  const [depositTooltip, setDepositTooltip] = useState(false);
  const [rewardsTooltip, setRewardsTooltip] = useState(false);
  const [withdrawTooltip, setWithdrawTooltip] = useState(false);
  const [myDepositedLpTokens, setMyDepositedLpTokens] = useState("");
  const [myShare, setmyShare] = useState("");

  const showModal = () => {
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  const showPopup = () => {
    setPopup(true);
  };

  const hidePopup = () => {
    setPopup(false);
  };

  const getTokenData = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_avax_v2")
      .then((data) => {
        const propertyDyp = Object.entries(
          data.data.the_graph_avax_v2.token_data
        );
        setDypUSD(propertyDyp[0][1].token_price_usd);

        const propertyIDyp = Object.entries(
          data.data.the_graph_avax_v2.token_data
        );

        const dypPerAvax = data.data.the_graph_avax_v2.price_DYPS;
        setDypPerAvaxPrice(dypPerAvax);

        setIDypUSD(propertyIDyp[1][1].token_price_usd);
      });
  };

  const getPriceDYP = async () => {
    let usdPerToken2 = await window.getPrice("defi-yield-protocol");
    setUsdPerToken(usdPerToken2);
  };

  const handleApprove = (e) => {
    setDepositLoading(true);
    let amount = depositAmount;
    amount = new BigNumber(amount)
      .times(10 ** selectedTokenDecimals)
      .toFixed(0);
    console.log("approve amount", amount);
    window
      .approveToken(selectedBuybackToken, constant._address, amount)
      .then(() => {
        setDepositLoading(false);
        setDepositStatus("deposit");
      })
      .catch((e) => {
        setDepositLoading(false);
        setDepositStatus("fail");
        setErrorMsg(e?.message);
        setTimeout(() => {
          setDepositStatus("initial");
          setDepositAmount("");
          setErrorMsg("");
        }, 2000);
      });
  };

  const handleStake = async (e) => {
    let selectedBuybackToken = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"; // wbnb/wavax
    let amount = depositAmount;
    setDepositLoading(true);
    amount = new BigNumber(amount).times(10 ** 18).toFixed(0);
    console.log("deposit amount", amount);

    let _80Percent = new BigNumber(amount).times(80e2).div(100e2).toFixed(0);

    let _20Percent = new BigNumber(amount).times(20e2).div(100e2).toFixed(0);
    let deadline = Math.floor(
      Date.now() / 1e3 + window.config.tx_max_wait_seconds
    ).toFixed(0);

    let router = await window.getPangolinRouterContract();
    let WETH = await router.methods.WAVAX().call();

    let platformTokenAddress = "0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17"; //dyp address
    let rewardTokenAddress = "0xBD100d061E120b2c67A24453CF6368E63f1Be056"; // idyp address
    _80Percent = new BigNumber(_80Percent).div(2).toFixed(0);

    let path1 = [
      ...new Set(
        [selectedBuybackToken, platformTokenAddress].map((a) => a.toLowerCase())
      ),
    ];

    let path2 = [
      ...new Set(
        [rewardTokenAddress, selectedBuybackToken].map((a) => a.toLowerCase())
      ),
    ];

    let _amountOutMin_baseTokenReceived = new BigNumber(_80Percent)
      .times(100 - window.config.slippage_tolerance_percent)
      .div(100)
      .toFixed(0);
    let minAmountLiquidityB = new BigNumber(_amountOutMin_baseTokenReceived)
      .times(100 - window.config.slippage_tolerance_percent_liquidity)
      .div(100)
      .toFixed(0);

    let path = [
      ...new Set(
        [selectedBuybackToken, rewardTokenAddress].map((a) => a.toLowerCase())
      ),
    ];

    let _amountOutMin_80Percent = await router.methods
      .getAmountsOut(_80Percent, path)
      .call()
      .catch((e) => {
        console.log(e);
      });

    let _amountOutMin_20Percent = await router.methods
      .getAmountsOut(_20Percent, path1)
      .call()
      .catch((e) => {
        console.log(e);
      });

    console.log(_amountOutMin_80Percent, _80Percent, path);
    if (_amountOutMin_80Percent) {
      _amountOutMin_80Percent =
        _amountOutMin_80Percent[_amountOutMin_80Percent.length - 1];
      _amountOutMin_80Percent = new BigNumber(_amountOutMin_80Percent)
        .times(100 - window.config.slippage_tolerance_percent)
        .div(100)
        .toFixed(0);

      _amountOutMin_20Percent =
        _amountOutMin_20Percent[_amountOutMin_20Percent.length - 1];
      _amountOutMin_20Percent = new BigNumber(_amountOutMin_20Percent)
        .times(100 - window.config.slippage_tolerance_percent)
        .div(100)
        .toFixed(0);

      let minAmountLiquidityA = new BigNumber(_amountOutMin_80Percent)
        .times(100 - window.config.slippage_tolerance_percent_liquidity)
        .div(100)
        .toFixed(0);

      let _amountOutMinSwap_real = 0;
      let _amountOutMinSwap = 0;
      let lastSwap = await constant.lastSwapExecutionTime();
      let now = Math.floor(Date.now() / 1000);
      let tokensToBeSwapped = await constant.tokensToBeSwapped();
      let tokensToBeDisbursedOrBurnt =
        await constant.tokensToBeDisbursedOrBurnt();
      let MaxSwappableAmount = await constant.getMaxSwappableAmount();
      let getPendingDisbursement = await constant.getPendingDisbursement();
      let _SwapTokens = new BigNumber(tokensToBeSwapped)
        .plus(tokensToBeDisbursedOrBurnt)
        .plus(getPendingDisbursement)
        .toFixed(0);

      if (now - lastSwap > 86400 && _SwapTokens > 0) {
        console.log(1);

        console.log(tokensToBeSwapped);
        console.log(tokensToBeDisbursedOrBurnt);
        console.log(MaxSwappableAmount);
        console.log(_SwapTokens);

        if (BigNumber(_SwapTokens).gte(MaxSwappableAmount)) {
          _amountOutMinSwap = MaxSwappableAmount;
        }

        if (BigNumber(_SwapTokens).lt(MaxSwappableAmount)) {
          _amountOutMinSwap = _SwapTokens;
        }

        console.log(_amountOutMinSwap);
        _amountOutMinSwap_real = await router.methods
          .getAmountsOut(_amountOutMinSwap, path2)
          .call();
        _amountOutMinSwap_real =
          _amountOutMinSwap_real[_amountOutMinSwap_real.length - 1];
        _amountOutMinSwap_real = new BigNumber(_amountOutMinSwap_real)
          .times(100 - window.config.slippage_tolerance_percent_liquidity)
          .div(100)
          .toFixed(0);
        _amountOutMinSwap_real.toString();
      }

      let _amountOutMin_dypReceived = new BigNumber(0).toFixed(0);
      let pendingDivs = await constant.getPendingDivsEth(coinbase);

      if (pendingDivs > 0) {
        _amountOutMin_dypReceived = new BigNumber(pendingDivs)
          .times(100 - window.config.slippage_tolerance_percent)
          .div(100)
          .toFixed(0);
      }

      let minAmounts = [
        _amountOutMin_20Percent,
        0,
        minAmountLiquidityA,
        minAmountLiquidityB,
        _amountOutMin_80Percent,
        _amountOutMin_baseTokenReceived,
        _amountOutMin_dypReceived,
        _amountOutMinSwap_real,
      ];

      console.log(minAmounts);

      //console.log({selectedBuybackToken ,amount, minAmounts, deadline})

      constant
        .deposit(selectedBuybackToken, amount, minAmounts, deadline)
        .then(() => {
          setDepositLoading(false);
          setDepositStatus("success");
          refreshBalance();
          setTimeout(() => {
            setDepositAmount("");
            setDepositStatus("initial");
            setErrorMsg("");
          }, 5000);
        })
        .catch((e) => {
          setDepositLoading(false);
          setDepositStatus("fail");
          setErrorMsg(e?.message);
          setTimeout(() => {
            setDepositAmount("");
            setDepositStatus("initial");
            setErrorMsg("");
          }, 10000);
        });
    } else console.log("no");
  };

  const checkApproval = async (amount) => {
    let selectedBuybackToken = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"; // wbnb/wavax

    const result = await window
      .checkapproveStakePool(coinbase, selectedBuybackToken, constant._address)
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((e) => {
        console.log(e);
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
  };

  const handleSelectedTokenChange = async (tokenAddress) => {
    let tokenDecimals =
      window.buyback_activetokens_farmingavax[tokenAddress].decimals;
    let selectedTokenSymbol =
      window.buyback_activetokens_farmingavax[tokenAddress].symbol;

    setselectedBuybackToken(tokenAddress);
    setSelectedTokenBalance("");
    setselectedTokenDecimals(tokenDecimals);
    setSelectedTokenSymbol(selectedTokenSymbol);
    setSelectedTokenLogo(
      window.buyback_activetokens_farmingavax[tokenAddress].symbol
    );

    let selectedTokenBalance = await window.getTokenHolderBalance(
      tokenAddress,
      coinbase
    );
    setSelectedTokenBalance(selectedTokenBalance);
  };

  const handleSelectedTokenChangeWithdraw = async (tokenAddress) => {
    setSelectedBuybackTokenWithdraw(tokenAddress);
  };

  const handleClaimToken = async (token) => {
    setSelectedClaimToken(token);
  };

  const handleWithdrawDyp = async () => {
    let amountConstant = await constant.depositedTokens(coinbase);
    amountConstant = new BigNumber(amountConstant).toFixed(0);
    setWithdrawLoading(true);

    let deadline = Math.floor(
      Date.now() / 1e3 + window.config.tx_max_wait_seconds
    );

    try {
      constant
        .unstake(amountConstant, 0, deadline)
        .then(() => {
          setWithdrawStatus("success");
          setWithdrawLoading(false);
        })
        .catch((e) => {
          setWithdrawStatus("failed");
          setWithdrawLoading(false);
          setErrorMsg3(e?.message);
          setTimeout(() => {
            setWithdrawStatus("initial");
            setSelectedPool("");
            setErrorMsg3("");
          }, 10000);
        });
    } catch (e) {
      setErrorMsg3(e);

      console.error(e);
      return;
    }
  };
  const handleWithdraw = async (e) => {
    let selectedBuybackToken = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"; // can only be WETH
    let rewardTokenAddress = "0xBD100d061E120b2c67A24453CF6368E63f1Be056"; // idyp address

    let amount = await constant.depositedTokens(coinbase);
    let PAIR_ABI = window.PAIRAVAX_ABI;
    let pair_token_address = "0x66eecc97203704d9e2db4a431cb0e9ce92539d5a";
    let web3 = window.avaxWeb3;
    let pair = new web3.eth.Contract(PAIR_ABI, pair_token_address);

    let totalSupply = await pair.methods.totalSupply().call();
    let reserves = await pair.methods.getReserves().call();
    let maxETH = reserves[0];
    let maxToken = reserves[1];

    console.log(maxETH);
    console.log(maxToken);
    console.log(amount);
    console.log(totalSupply);

    let maxUserEth = (amount * maxETH) / totalSupply;
    maxUserEth = new BigNumber(maxUserEth).toFixed(0);
    let maxUserEth1 =
      (maxUserEth *
        (100 - window.config.slippage_tolerance_percent_liquidity)) /
      100;
    maxUserEth1 = new BigNumber(maxUserEth1).toFixed(0);
    let maxUserToken = (amount * maxToken) / totalSupply;
    maxUserToken = new BigNumber(maxUserToken).toFixed(0);
    let maxUserToken1 = new BigNumber(maxUserToken)
      .times(100 - window.config.slippage_tolerance_percent_liquidity)
      .div(100)
      .toFixed(0);

    console.log(maxUserEth);
    console.log(maxUserToken);

    let deadline = Math.floor(
      Date.now() / 1e3 + window.config.tx_max_wait_seconds
    ).toFixed(0);

    let router = await window.getPangolinRouterContract();
    let WETH = await router.methods.WAVAX().call();

    let platformTokenAddress = window.config.reward_token_address; //these will be the same addresses
    let path2 = [
      ...new Set(
        [rewardTokenAddress, selectedBuybackToken].map((a) => a.toLowerCase())
      ),
    ];
    let _amountOutMinSwap_real = 0;
    let _amountOutMinSwap = 0;
    let lastSwap = await constant.lastSwapExecutionTime();
    let now = Math.floor(Date.now() / 1000);
    let tokensToBeSwapped = await constant.tokensToBeSwapped();
    let tokensToBeDisbursedOrBurnt =
      await constant.tokensToBeDisbursedOrBurnt();
    let MaxSwappableAmount = await constant.getMaxSwappableAmount();
    let getPendingDisbursement = await constant.getPendingDisbursement();
    let _SwapTokens = new BigNumber(tokensToBeSwapped)
      .plus(tokensToBeDisbursedOrBurnt)
      .plus(getPendingDisbursement)
      .toFixed(0);

    if (now - lastSwap > 86400 && _SwapTokens > 0) {
      console.log(1);

      console.log(tokensToBeSwapped);
      console.log(tokensToBeDisbursedOrBurnt);
      console.log(MaxSwappableAmount);
      console.log(_SwapTokens);

      if (BigNumber(_SwapTokens).gte(MaxSwappableAmount)) {
        _amountOutMinSwap = MaxSwappableAmount;
      }

      if (BigNumber(_SwapTokens).lt(MaxSwappableAmount)) {
        _amountOutMinSwap = _SwapTokens;
      }

      console.log(_amountOutMinSwap);
      _amountOutMinSwap_real = await router.methods
        .getAmountsOut(_amountOutMinSwap, path2)
        .call();
      _amountOutMinSwap_real =
        _amountOutMinSwap_real[_amountOutMinSwap_real.length - 1];
      _amountOutMinSwap_real = new BigNumber(_amountOutMinSwap_real)
        .times(100 - window.config.slippage_tolerance_percent_liquidity)
        .div(100)
        .toFixed(0);
      _amountOutMinSwap_real.toString();
    }

    let _amountOutMin_crazReceived = new BigNumber(0).toFixed(0);
    let pendingDivs = await constant.getPendingDivsEth(coinbase);
    console.log(pendingDivs);
    if (pendingDivs > 0) {
      _amountOutMin_crazReceived = new BigNumber(pendingDivs)
        .times(100 - window.config.slippage_tolerance_percent)
        .div(100)
        .toFixed(0);
    }
    let minAmounts = [
      maxUserToken1,
      maxUserEth1,
      0,
      0,
      _amountOutMin_crazReceived,
      _amountOutMinSwap_real,
    ];

    console.log(minAmounts);
    constant
      .withdraw(selectedBuybackToken, amount, minAmounts, deadline)
      .then(() => {
        setWithdrawLoading(false);
        setWithdrawStatus("success");
        refreshBalance();
        // getBalance();
      })
      .catch((e) => {
        setWithdrawLoading(false);
        setWithdrawStatus("fail");
        setErrorMsg3(e?.message);
      });
  };

  const handleClaimDivs = async () => {
    let deadline = Math.floor(
      Date.now() / 1e3 + window.config.tx_max_wait_seconds
    );
    setClaimLoading(true);
    let address = coinbase;
    let selectedBuybackToken2 = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"; // wbnb/wavax
    let rewardTokenAddress = "0xBD100d061E120b2c67A24453CF6368E63f1Be056"; // idyp address

    let amount = await constant.getPendingDivs(address);

    let amountETH = await constant.getPendingDivsEth(address);

    let router = await window.getPangolinRouterContract();
    let WETH = await router.methods.WAVAX().call();

    let platformTokenAddress = window.config.reward_token_address;

    let _amountOutMinConstant = 0;

    let path = [
      ...new Set([WETH, platformTokenAddress].map((a) => a.toLowerCase())),
    ];

    let path2 = [
      ...new Set(
        [rewardTokenAddress, selectedBuybackToken2].map((a) => a.toLowerCase())
      ),
    ];

    if (amount > 0) {
      let _amountOutMinConstant = await router.methods
        .getAmountsOut(amount, path)
        .call();

      _amountOutMinConstant =
        _amountOutMinConstant[_amountOutMinConstant.length - 1];

      _amountOutMinConstant = new BigNumber(_amountOutMinConstant)
        .times(100 - window.config.slippage_tolerance_percent)
        .div(100)
        .toFixed(0);
    }

    let _amountOutMinConstantETH = new BigNumber(amountETH)
      .times(100 - window.config.slippage_tolerance_percent)
      .div(100)
      .toFixed(0);
    console.log(_amountOutMinConstant);

    let path1 = [
      ...new Set([platformTokenAddress, WETH].map((a) => a.toLowerCase())),
    ];

    let _amountOutMinSwap_real = 0;
    let _amountOutMinSwap = 0;
    let lastSwap = await constant.lastSwapExecutionTime();
    let now = Math.floor(Date.now() / 1000);

    let tokensToBeSwapped = await constant.tokensToBeSwapped();
    let tokensToBeDisbursedOrBurnt =
      await constant.tokensToBeDisbursedOrBurnt();
    let MaxSwappableAmount = await constant.getMaxSwappableAmount();
    let getPendingDisbursement = await constant.getPendingDisbursement();
    let _SwapTokens = new BigNumber(tokensToBeSwapped)
      .plus(tokensToBeDisbursedOrBurnt)
      .plus(getPendingDisbursement)
      .toFixed(0);

    if (now - lastSwap > 86400 && _SwapTokens > 0) {
      if (BigNumber(_SwapTokens).gte(MaxSwappableAmount)) {
        _amountOutMinSwap = MaxSwappableAmount;
      }

      if (BigNumber(_SwapTokens).lt(MaxSwappableAmount)) {
        _amountOutMinSwap = _SwapTokens;
      }

      console.log(_amountOutMinSwap);
      _amountOutMinSwap_real = await router.methods
        .getAmountsOut(_amountOutMinSwap, path2)
        .call();
      _amountOutMinSwap_real =
        _amountOutMinSwap_real[_amountOutMinSwap_real.length - 1];
      _amountOutMinSwap_real = new BigNumber(_amountOutMinSwap_real)
        .times(100 - window.config.slippage_tolerance_percent_liquidity)
        .div(100)
        .toFixed(0);
      _amountOutMinSwap_real.toString();
    }

    console.log({
      _amountOutMinConstant,
      _amountOutMinConstantETH,
      _amountOutMinSwap_real,
      deadline,
    });

    try {
      constant
        .claimAs(
          window.config.weth_address,
          _amountOutMinConstantETH,
          _amountOutMinConstant,
          _amountOutMinSwap_real,
          deadline
        )
        .then(() => {
          setClaimStatus("success");
          setClaimLoading(false);
          setPendingDivs(getFormattedNumber(0, 6));
          refreshBalance();
        })
        .catch((e) => {
          setClaimStatus("fail");
          setClaimLoading(false);
          setErrorMsg2(e?.message);
          console.log(e);
          setTimeout(() => {
            setClaimStatus("initial");
            setErrorMsg2("");
          }, 10000);
        });
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const handleClaimDyp = async () => {
    setClaimLoading(true);

    let deadline = Math.floor(
      Date.now() / 1e3 + window.config.tx_max_wait_seconds
    );

    let address = coinbase;

    let amount = await constant.getTotalPendingDivs(address);
    let router = await window.getPancakeswapRouterContract();
    let WETH = await router.methods.getPangolinRouterContract().call();
    let platformTokenAddress = window.config.reward_token_address;
    let rewardTokenAddress = window.config.reward_token_idyp_address;
    let path = [
      ...new Set(
        [rewardTokenAddress, WETH, platformTokenAddress].map((a) =>
          a.toLowerCase()
        )
      ),
    ];
    let _amountOutMinConstant = await router.methods
      .getAmountsOut(amount, path)
      .call()
      .catch((e) => {
        setClaimStatus("failed");
        setClaimLoading(false);
        setErrorMsg2(e?.message);
        setTimeout(() => {
          setClaimStatus("initial");
          setSelectedPool("");
          setErrorMsg2("");
        }, 10000);
      });
    _amountOutMinConstant =
      _amountOutMinConstant[_amountOutMinConstant.length - 1];
    _amountOutMinConstant = new BigNumber(_amountOutMinConstant)
      .times(100 - window.config.slippage_tolerance_percent)
      .div(100)
      .toFixed(0);

    let referralFee = new BigNumber(_amountOutMinConstant)
      .times(500)
      .div(1e4)
      .toFixed(0);
    referralFee = referralFee.toString();

    try {
      constant
        .claim(referralFee, _amountOutMinConstant, deadline)
        .then(() => {
          setClaimStatus("success");
          setClaimLoading(false);
        })
        .catch((e) => {
          setClaimStatus("failed");
          setClaimLoading(false);
          setErrorMsg2(e?.message);
          setTimeout(() => {
            setClaimStatus("initial");
            setSelectedPool("");
            setErrorMsg2("");
          }, 10000);
        });
    } catch (e) {
      setErrorMsg2(e?.message);

      console.error(e);
      return;
    }
  };

  const handleSetMaxDeposit = (e) => {
    e.preventDefault();

    setDepositAmount(
      new BigNumber(selectedTokenBalance)
        .div(10 ** selectedTokenDecimals)
        .toFixed(selectedTokenDecimals)
    );
  };
  const handleSetMaxWithdraw = (e) => {
    e.preventDefault();
    setWithdrawAmount(new BigNumber(depositedTokens).div(1e18).toFixed(18));
  };

  const getAPY = () => {
    let lp_data = the_graph_result.lp_data;
    let apy = lp_data ? lp_data[lp_id].apy : 0;
    return Number(apy) || 0;
  };

  const refreshBalance = async () => {
    let coinbase = coinbase;

    if (window.coinbase_address) {
      coinbase = window.coinbase_address;
      setCoinbase2(coinbase);
    }

    let lp_data = the_graph_result.lp_data;

    // let usd_per_dyps = the_graph_result.price_DYPS ? the_graph_result.price_DYPS : 1
    let usd_per_dyps = 0.00001;

    try {
      let amount = new BigNumber(1000000000000000000).toFixed(0);
      let router = await window.getPangolinRouterContract();
      let WETH = await router.methods.WAVAX().call();
      let platformTokenAddress = window.config.USDCe_address;
      let rewardTokenAddress = window.config.reward_token_idyp_address;
      let path = [
        ...new Set(
          [rewardTokenAddress, WETH, platformTokenAddress].map((a) =>
            a.toLowerCase()
          )
        ),
      ];
      let _amountOutMin = await router.methods
        .getAmountsOut(amount, path)
        .call();
      _amountOutMin = _amountOutMin[_amountOutMin.length - 1];
      _amountOutMin = new BigNumber(_amountOutMin).div(1e6).toFixed(18);

      let _bal = token.balanceOf(coinbase);

      let _rBal = reward_token.balanceOf(coinbase);

      let _pDivs = constant.getPendingDivs(coinbase);

      let _pDivsEth = constant.getPendingDivsEth(coinbase);

      let _tEarned = constant.totalEarnedTokens(coinbase);

      let _tEarnedEth = constant.totalEarnedEth(coinbase);

      let _stakingTime = constant.depositTime(coinbase);

      let _dTokens = constant.depositedTokens(coinbase);

      let _lClaimTime = constant.lastClaimedTime(coinbase);

      let _tvl = token.balanceOf(constant._address); //not zero

      //Take iDYP Balance on Staking & Farming
      let _tvlConstantiDYP = reward_token_idyp.balanceOf(
        constant._address
      ); /* TVL of iDYP on Staking */

      let _tvlConstantDYP = reward_token.balanceOf(
        constant._address
      ); /* TVL of iDYP on Staking */

      //not zero
      let _tvliDYP = reward_token_idyp.balanceOf(
        constant._address
      ); /* TVL of iDYP on Farming */

      let _dTokensDYP = constant.depositedTokens(coinbase);

      // let _pendingDivsStaking = constant.getTotalPendingDivs(coinbase);

      //Take DYPS Balance
      let _tvlDYPS = token_dypsavax.balanceOf(
        constant._address
      ); /* TVL of DYPS */

      let [
        token_balance2,
        reward_token_balance2,
        pendingDivs2,
        totalEarnedTokens2,
        stakingTime2,
        depositedTokens2,
        lastClaimedTime2,
        tvl2,
        totalEarnedEth2,
        pendingDivsEth2,
        tvlConstantiDYP2,
        tvlConstantDYP2,
        tvliDYP2,
        depositedTokensDYP2,
        // pendingDivsStaking2,
        tvlDYPS2,
      ] = await Promise.all([
        _bal,
        _rBal,
        _pDivs,
        _tEarned,
        _stakingTime,
        _dTokens,
        _lClaimTime,
        _tvl,
        _tEarnedEth,
        _pDivsEth,
        _tvlConstantiDYP,
        _tvlConstantDYP,
        _tvliDYP,
        _dTokensDYP,
        // _pendingDivsStaking,
        _tvlDYPS,
      ]);

      let tvlValueConstantDYP = new BigNumber(tvlConstantDYP2)
        .times(usdPerToken)
        .toFixed(18);
      let tvlValueiDYP = new BigNumber(tvlConstantiDYP2)
        .times(_amountOutMin)
        .toFixed(18);
      let tvlValueiDYPFarming = new BigNumber(tvliDYP2)
        .times(_amountOutMin)
        .toFixed(18);
      let usd_per_lp = lp_data ? lp_data[lp_id].usd_per_lp : 0;

      /* USD VALUE OF MY LP DEPOSITED */
      // let myDepositedLpTokens = new BigNumber(depositedTokens).times(usd_per_lp).toFixed(18)
      let myDepositedLpTokens = new BigNumber(depositedTokens2).toFixed(18);

      /* USD VALUE OF WITHDRAW OF LP + iDYP */
      // let depositedTokensUSD = new BigNumber(depositedTokens).times(usd_per_lp).plus(tvlValueConstantDYP).toFixed(18)

      // let tvlUSD = new BigNumber(tvl).times(usd_per_lp).plus(tvlValueiDYP).toFixed(18)

      /* USD VALUE OF TOTAL LP DEPOSITED */
      let tvlUSD = new BigNumber(tvl2).times(usd_per_lp).toFixed(18);
      // let tvlUSD = new BigNumber(tvl).toFixed(18)

      //console.log({tvlValueConstantDYP})

      let tvlDyps = new BigNumber(tvlDYPS2).times(usd_per_dyps).toFixed(18);
      setTvlDyps(tvlDyps);

      let token_balance_formatted = new BigNumber(
        token_balance2 * LP_AMPLIFY_FACTOR
      )
        .div(1e18)
        .toString(10);
      setToken_balance(token_balance_formatted);

      let reward_token_balance_formatted = new BigNumber(reward_token_balance2)
        .div(10 ** TOKEN_DECIMALS)
        .toString(10);
      setReward_token_balance(reward_token_balance_formatted);

      // let pendingDivs_formatted = new BigNumber(pendingDivsStaking2)
      //   .div(10 ** TOKEN_DECIMALS)
      //   .times(usd_per_idyp)
      //   .div(usd_per_token)
      //   .toString(10);
      // setPendingDivs(pendingDivs_formatted);

      let totalEarnedTokens_formatted = new BigNumber(totalEarnedTokens2)
        .div(10 ** TOKEN_DECIMALS)
        .toString(10);
      setTotalEarnedTokens(totalEarnedTokens_formatted);

      setStakingTime(stakingTime2 * 1e3);

      let depositedTokensUSD = new BigNumber(depositedTokens2).toFixed(18);
      let depositedTokens_formatted = new BigNumber(
        depositedTokensUSD * LP_AMPLIFY_FACTOR
      )
        .div(1e18)
        .toString(10);
      setDepositedTokens(depositedTokens_formatted);

      setlastClaimedTime(lastClaimedTime2);

      let tvlConstantDYP_formatted = new BigNumber(tvlConstantDYP2)
        .div(1e18)
        .toString(10);
      setTvlConstantDYP(tvlConstantDYP_formatted);

      let tvl_formatted = new BigNumber(tvlUSD * LP_AMPLIFY_FACTOR)
        .div(1e18)
        .toString(10);

      setTvl(tvl_formatted);

      let totalEarnedEth_formatted = new BigNumber(totalEarnedEth2)
        .div(1e18)
        .toString(10);
      setTotalEarnedEth(totalEarnedEth_formatted);

      let pendingDivsEth_formatted = new BigNumber(pendingDivsEth2)
        .div(1e18)
        .toString(10);
      setPendingDivsEth(pendingDivsEth_formatted);

      let myDepositedLpTokens_formatted = new BigNumber(
        depositedTokens2
      ).toFixed(18);
      let myDepositedLpTokens_formatted2 =
        myDepositedLpTokens_formatted * LP_AMPLIFY_FACTOR;
      if (tvl2 == "0") {
        setmyShare(0);
      }
      if (tvl2 != "0") {
        let myShare2 = ((depositedTokens2 / tvl2) * 100).toFixed(2);
        setmyShare(myShare2);
      }

      setMyDepositedLpTokens(myDepositedLpTokens_formatted);

      let depositedTokensUSD_formatted = new BigNumber(
        depositedTokens2
      ).toFixed(18);
      setDepositedTokensUSD(depositedTokensUSD_formatted);

      setTvlUSD(tvlUSD);

      let totalValueLocked = new BigNumber(tvlUSD)
        .plus(tvlValueiDYP)
        .plus(tvlValueiDYPFarming)
        .plus(tvlValueConstantDYP)
        .toFixed(18);

      setTotalValueLocked(totalValueLocked);

      let depositedTokensDYP_formatted = new BigNumber(depositedTokensDYP2)
        .div(1e18)
        .toString(10);

      setDepositedTokensDYP(depositedTokensDYP_formatted);

      // setPendingDivsStaking(pendingDivsStaking2);
      let stakingOwner2 = await constant.owner();
      setStakingOwner(stakingOwner2);
    } catch (e) {
      console.error(e);
    }

    constant
      .cliffTime()
      .then((cliffTime2) => {
        setCliffTime(cliffTime2 * 1e3);
      })
      .catch(console.error);

    constant
      .tokensToBeDisbursedOrBurnt()
      .then((tokensToBeDisbursedOrBurnt2) => {
        let tokensToBeDisbursedOrBurnt_formatted = new BigNumber(
          tokensToBeDisbursedOrBurnt2
        )
          .div(1e18)
          .toString(10);
        setTokensToBeDisbursedOrBurnt(tokensToBeDisbursedOrBurnt_formatted);
      })
      .catch(console.error);

    constant.tokensToBeSwapped().then((tokensToBeSwapped2) => {
      let tokensToBeSwapped_formatted = new BigNumber(tokensToBeSwapped2)
        .div(1e18)
        .toString(10);
      setTokensToBeSwapped(tokensToBeSwapped_formatted);
    });

    constant.lastSwapExecutionTime().then((lastSwapExecutionTime2) => {
      setLastSwapExecutionTime(lastSwapExecutionTime2 * 1e3);
    });

    constant.swapAttemptPeriod().then((swapAttemptPeriod2) => {
      setSwapAttemptPeriod(swapAttemptPeriod2 * 1e3);
    });

    constant.contractDeployTime().then((contractDeployTime2) => {
      setContractDeployTime(contractDeployTime2);
    });

    constant.disburseDuration().then((disburseDuration2) => {
      setDisburseDuration(disburseDuration2);
    });

    //Set Value $ of iDYP & DYP for Withdraw Input
    let withdrawAmount_formatted = new BigNumber(depositedTokensUSD)
      .div(1e18)
      .toFixed(2);
    setWithdrawAmount(withdrawAmount_formatted);

    //console.log(disburseDuration)
    //console.log(contractDeployTime)

    try {
      let selectedTokenBalance2 = await window.getTokenHolderBalance(
        selectedBuybackToken,
        coinbase
      );
      setSelectedTokenBalance(selectedTokenBalance2);
    } catch (e) {
      console.warn(e);
    }
  };
  const getUsdPerETH = () => {
    return the_graph_result.usd_per_eth || 0;
  };

  const getApproxReturnUSD = () => {
    let APY = getAPY();
    let approxDays = approxDays;
    let approxDeposit = approxDeposit;
    //let lp_data = the_graph_result.lp_data
    //let usd_per_lp = lp_data ? lp_data[lp_id].usd_per_lp : 0

    return ((approxDeposit * APY) / 100 / 365) * approxDays;
  };

  const convertTimestampToDate = (timestamp) => {
    const result = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(timestamp * 1000);
    return result;
  };

  const handleAvaxPool = async () => {
    await handleSwitchNetworkhook("0xa86a")
      .then(() => {
        handleSwitchNetwork("43114");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (coinbase !== coinbase2) {
      setCoinbase2(coinbase);
    }
    getPriceDYP();
    getTokenData();
  }, []);

  let is_connected = is_wallet_connected;

  let usd_per_token = the_graph_result.token_data
    ? the_graph_result.token_data["0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17"]
        .token_price_usd
    : 1;
  let usd_per_idyp = the_graph_result.token_data
    ? the_graph_result.token_data["0xbd100d061e120b2c67a24453cf6368e63f1be056"]
        .token_price_usd
    : 1;

  let showDeposit = true;

  if (!isNaN(disburseDuration) && !isNaN(contractDeployTime)) {
    let lastDay = parseInt(disburseDuration) + parseInt(contractDeployTime);
    let lockTimeExpire = parseInt(Date.now()) + parseInt(cliffTime);
    lockTimeExpire = lockTimeExpire.toString().substr(0, 10);
    if (lockTimeExpire > lastDay) {
      showDeposit = false;
    }
  }

  let cliffTimeInWords = "lockup period";

  let claimTitle = "Feel free to execute claim";

  if (!isNaN(swapAttemptPeriod) && !isNaN(lastSwapExecutionTime)) {
    if (Date.now() - lastSwapExecutionTime <= swapAttemptPeriod) {
      claimTitle = `You can execute claim for the latest rewards ${moment
        .duration(swapAttemptPeriod - (Date.now() - lastSwapExecutionTime))
        .humanize(true)}`;
    }
  }

  let canWithdraw = true;
  if (lockTime === "No Lock") {
    canWithdraw = true;
  }
  if (!isNaN(cliffTime) && !isNaN(stakingTime)) {
    if (
      convertTimestampToDate(Number(stakingTime) + Number(cliffTime)) >=
        convertTimestampToDate(Date.now()) &&
      lockTime !== "No Lock"
    ) {
      canWithdraw = false;
      cliffTimeInWords = moment
        .duration(cliffTime - (Date.now() - stakingTime))
        .humanize(true);
    }
  }

  let lp_data = the_graph_result.lp_data;
  let apy = lp_data ? lp_data[lp_id].apy : 0;

  let total_stakers = lp_data ? lp_data[lp_id].stakers_num : 0;
  // let tvl_usd = lp_data ? lp_data[lp_id].tvl_usd : 0

  apy = getFormattedNumber(apy, 2);
  total_stakers = getFormattedNumber(total_stakers, 0);

  //console.log(total_stakers)

  let isOwner =
    String(coinbase).toLowerCase() ===
    String(window.config.admin_address).toLowerCase();

  let apr2 = 50;
  let ApyStake = new BigNumber(apr2)
    .div(1e2)
    .times(usd_per_idyp)
    .div(usd_per_token)
    .times(1e2)
    .toFixed(2);

  let infoItems = [
    "75% from your deposit is added to Pangolin AVAX/iDYP LP",
    "25% from your deposit is sent to DYP Staking with " + ApyStake + "% APR",
  ];
  let tooltip1 = infoItems.join("\n");

  let infoItems2 = ["75% WAVAX/ETH rewards", "25% DYP rewards"];
  let tooltip2 = infoItems2.join("\n");

  const performanceOpen = () => {
    setPerformanceTooltip(true);
  };
  const performanceClose = () => {
    setPerformanceTooltip(false);
  };
  const aprOpen = () => {
    setAprTooltip(true);
  };
  const aprClose = () => {
    setAprTooltip(false);
  };
  const lockOpen = () => {
    setLockTooltip(true);
  };
  const lockClose = () => {
    setLockTooltip(false);
  };
  const depositOpen = () => {
    setDepositTooltip(true);
  };
  const depositClose = () => {
    setDepositTooltip(false);
  };
  const rewardsOpen = () => {
    setRewardsTooltip(true);
  };
  const rewardsClose = () => {
    setRewardsTooltip(false);
  };
  const withdrawOpen = () => {
    setWithdrawTooltip(true);
  };
  const withdrawClose = () => {
    setWithdrawTooltip(false);
  };

  const focusInput = (field) => {
    document.getElementById(field).focus();
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      refreshBalance();
    }, 1000);
    return () => clearInterval(interval);
  }, [coinbase, coinbase2]);

  return (
    <div className="container-lg p-0">
      <div
        className={`allwrapper ${listType === "table" && "my-4"}`}
        style={{
          border: listType !== "table" && "none",
          borderRadius: listType !== "table" && "0px",
        }}
      >
        <div className="leftside2 w-100">
          <div className="activewrapper activewrapper-vault">
            <div className="d-flex flex-column flex-lg-row w-100 align-items-start align-items-lg-center justify-content-between">
              <h6 className="activetxt position-relative activetxt-vault">
                <img
                  src={ellipse}
                  alt=""
                  className="position-relative"
                  style={{ top: "-1px" }}
                />
                Active status
              </h6>
              {/* <div className="d-flex align-items-center justify-content-between gap-2">
              <h6 className="earnrewards-text">Earn rewards in:</h6>
              <h6 className="earnrewards-token d-flex align-items-center gap-1">
                {token_symbol}
              </h6>
            </div> */}
              <div className="d-flex flex-row-reverse flex-lg-row align-items-end justify-content-between earnrewards-container">
                <div className="d-flex flex-column flex-lg-row align-items-end align-items-lg-center gap-3 gap-lg-5">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <h6 className="earnrewards-text">Performance fee:</h6>
                    <h6 className="earnrewards-token d-flex align-items-center gap-1">
                      0%
                      <ClickAwayListener onClickAway={performanceClose}>
                        <Tooltip
                          open={performanceTooltip}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          placement="top"
                          title={
                            <div className="tooltip-text">
                              {
                                "Performance fee is subtracted from the displayed APR."
                              }
                            </div>
                          }
                        >
                          <img
                            src={moreinfo}
                            alt=""
                            onClick={performanceOpen}
                          />
                        </Tooltip>
                      </ClickAwayListener>
                    </h6>
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <h6 className="earnrewards-text">APR:</h6>
                    <h6 className="earnrewards-token d-flex align-items-center gap-1">
                      {finalApr}%
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
                                "APR reflects the interest rate of earnings on an account over the course of one year. "
                              }
                            </div>
                          }
                        >
                          <img src={moreinfo} alt="" onClick={aprOpen} />
                        </Tooltip>
                      </ClickAwayListener>
                    </h6>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <h6 className="earnrewards-text">Lock time:</h6>
                    <h6 className="earnrewards-token d-flex align-items-center gap-1">
                      {lockTime} {lockTime !== "No Lock" ? "Days" : ""}
                      <ClickAwayListener onClickAway={lockClose}>
                        <Tooltip
                          open={lockTooltip}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          placement="top"
                          title={
                            <div className="tooltip-text">
                              {
                                "The amount of time your deposited assets will be locked."
                              }
                            </div>
                          }
                        >
                          <img src={moreinfo} alt="" onClick={lockOpen} />
                        </Tooltip>
                      </ClickAwayListener>
                    </h6>
                  </div>
                </div>
                <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3">
                  {/* <a
              href={
                chainId === 1
                  ? "https://app.uniswap.org/#/swap?outputCurrency=0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17"
                  : "https://app.pangolin.exchange/#/swap?outputCurrency=0x961c8c0b1aad0c0b10a51fef6a867e3091bcef17"
              }
              target={"_blank"}
              rel="noreferrer"
            >
              <h6 className="bottomitems">
                <img src={arrowup} alt="" />
                Get DYP
              </h6>
            </a> */}
                  <h6
                    className="bottomitems"
                    onClick={() => setShowCalculator(true)}
                  >
                    <img src={poolsCalculatorIcon} alt="" />
                    Calculator
                  </h6>
                  <div
                    onClick={() => {
                      showPopup();
                    }}
                  >
                    <h6 className="bottomitems">
                      <img src={purplestats} alt="" />
                      Stats
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pools-details-wrapper d-flex m-0 container-lg border-0">
          <div className="row w-100 gap-4 gap-lg-0 justify-content-between">
            <div className="firstblockwrapper col-12 col-md-6 col-lg-2">
              <div
                className="d-flex flex-row flex-lg-column align-items-center align-items-lg-start justify-content-between gap-4"
                style={{ height: "100%" }}
              >
                <h6 className="start-title">Start Farming</h6>
                {/* <h6 className="start-desc">
                {coinbase === null
                  ? "Connect wallet to view and interact with deposits and withdraws"
                  : "Interact with deposits and withdraws"}
              </h6> */}
                {coinbase === null ||
                coinbase === undefined ||
                isConnected === false ? (
                  <button className="connectbtn btn" onClick={showModal}>
                    {" "}
                    <img src={wallet} alt="" /> Connect wallet
                  </button>
                ) : chainId === "43114" ? (
                  <div className="addressbtn btn">
                    <Address a={coinbase} chainId={43114} />
                  </div>
                ) : (
                  <button
                    className="connectbtn btn"
                    onClick={() => {
                      handleAvaxPool();
                    }}
                  >
                    Change Network
                  </button>
                )}
              </div>
            </div>
            {/* <div className="otherside">
        <button className="btn green-btn">
          TBD Claim reward 0.01 ETH
        </button>
      </div> */}
            <div
              className={`otherside-border col-12 col-md-12 col-lg-4  ${
                chainId !== "43114" || expired === true ? "blurrypool" : ""
              }`}
            >
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div className="d-flex flex-column flex-lg-row align-items-start gap-3">
                  <div className="d-flex align-items-start gap-3">
                    <h6 className="deposit-txt">Deposit</h6>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="dropdown">
                        <button
                          class="btn farming-dropdown inputfarming d-flex align-items-center justify-content-center gap-1"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ position: "relative", bottom: "4px" }}
                        >
                          <img
                            src={
                              require(`./assets/avax/${selectedTokenLogo.toLowerCase()}.svg`)
                                .default
                            }
                            alt=""
                            style={{ width: 14, height: 14 }}
                          />
                          {selectedTokenLogo.toUpperCase()}
                          <img
                            src={dropdownVector}
                            alt=""
                            style={{ width: 10, height: 10 }}
                          />
                        </button>
                        <ul
                          className="dropdown-menu"
                          style={{ minWidth: "100%" }}
                        >
                          {Object.keys(
                            window.buyback_activetokens_farmingavax
                          ).map((t) => (
                            <span
                              className="d-flex align-items-center justify-content-start ps-2 gap-1 inputfarming farming-dropdown-item py-1 w-100"
                              onClick={() => handleSelectedTokenChange(t)}
                            >
                              <img
                                src={
                                  require(`./assets/avax/${window.buyback_activetokens_farmingavax[
                                    t
                                  ].symbol.toLowerCase()}.svg`).default
                                }
                                alt=""
                                style={{ width: 14, height: 14 }}
                              />
                              {
                                window.buyback_activetokens_farmingavax[t]
                                  .symbol
                              }
                            </span>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <h6 className="mybalance-text">
                    Balance:
                    <b>
                      {getFormattedNumber(
                        selectedTokenBalance / 10 ** selectedTokenDecimals,
                        6
                      )}{" "}
                      {selectedTokenSymbol}
                    </b>
                  </h6>
                </div>
                <ClickAwayListener onClickAway={depositClose}>
                  <Tooltip
                    open={depositTooltip}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    placement="top"
                    title={
                      <div className="tooltip-text">
                        {
                          "Deposit your assets to the farming smart contract. 75% of your assets goes for creation of LP tokens and 25% goes for buying DYP and depositing to staking smart contract to generate rewards."
                        }
                      </div>
                    }
                  >
                    <img src={moreinfo} alt="" onClick={depositOpen} />
                  </Tooltip>
                </ClickAwayListener>
              </div>
              <div className="d-flex flex-column gap-2 justify-content-between">
                <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-2">
                  <div className="d-flex align-items-center justify-content-between justify-content-lg-start gap-2 w-100">
                    <div className="input-container px-0">
                      <input
                        type="number"
                        autoComplete="off"
                        value={
                          Number(depositAmount) > 0
                            ? depositAmount
                            : depositAmount
                        }
                        onChange={(e) => {
                          setDepositAmount(e.target.value);
                          checkApproval(e.target.value);
                        }}
                        placeholder=" "
                        className="text-input"
                        style={{ width: "100%" }}
                        name="amount_deposit"
                        id="amount_deposit"
                        key="amount_deposit"
                      />
                      <label
                        htmlFor="usd"
                        className="label"
                        onClick={() => focusInput("amount_deposit")}
                      >
                        Amount
                      </label>
                    </div>
                    <button
                      className="btn maxbtn"
                      onClick={handleSetMaxDeposit}
                    >
                      Max
                    </button>
                  </div>

                  <button
                    disabled={
                      depositAmount === "" ||
                      depositLoading === true ||
                      depositStatus === "success"
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
                    } d-flex justify-content-center align-items-center gap-2`}
                    onClick={() => {
                      depositStatus === "deposit"
                        ? handleStake()
                        : depositStatus === "initial" && depositAmount !== ""
                        ? handleApprove()
                        : console.log("");
                    }}
                  >
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
                      <>
                        <img src={failMark} alt="" />
                        Failed
                      </>
                    )}
                  </button>
                </div>
                {errorMsg && <h6 className="errormsg">{errorMsg}</h6>}
              </div>
            </div>
            <div
              className={`otherside-border col-12 col-md-12 col-lg-4 ${
                chainId !== "43114" && "blurrypool"
              }`}
            >
              <div className="d-flex justify-content-between gap-2 ">
                <h6 className="withdraw-txt">Rewards</h6>
                <h6 className="withdraw-littletxt d-flex align-items-center gap-2">
                  Rewards are displayed in real-time
                  <ClickAwayListener onClickAway={rewardsClose}>
                    <Tooltip
                      open={rewardsTooltip}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      placement="top"
                      title={
                        <div className="tooltip-text">
                          {
                            "Rewards earned by your deposit to the farming smart contract are distributed automatically and can be claimed every day. You need to select assets individually and claim them to your wallet."
                          }
                        </div>
                      }
                    >
                      <img src={moreinfo} alt="" onClick={rewardsOpen} />
                    </Tooltip>
                  </ClickAwayListener>
                </h6>
              </div>
              <div className="d-flex flex-column gap-2 justify-content-between">
                <div className="d-flex align-items-center justify-content-between gap-2"></div>
                <div className="form-row d-flex flex-column flex-lg-row gap-2 align-items-center align-items-lg-end justify-content-between">
                  <div className="d-flex align-items-center justify-content-between justify-content-lg-center gap-5">
                    <div
                      className="gap-1 claimreward-wrapper"
                      onClick={() => {
                        setSelectedPool("wavax");
                      }}
                      style={{
                        // padding: '3px',
                        background:
                          selectedPool === "wavax" ? "#141333" : "#26264F",
                        border:
                          selectedPool === "wavax"
                            ? "1px solid #57B6AB"
                            : "1px solid #8E97CD",
                      }}
                    >
                      <img
                        src={selectedPool === "wavax" ? check : empty}
                        alt=""
                        className="activestate"
                      />
                      <div className="position-relative">
                        <input
                          disabled
                          value={
                            Number(pendingDivsEth) > 0
                              ? `${pendingDivsEth} WAVAX`
                              : `${getFormattedNumber(0, 2)} WAVAX`
                          }
                          onChange={(e) =>
                            setPendingDivsEth(
                              Number(e.target.value) > 0
                                ? e.target.value
                                : e.target.value
                            )
                          }
                          className=" left-radius inputfarming styledinput2"
                          placeholder="0"
                          type="text"
                          style={{
                            width: "120px",
                            padding: "0px 15px 0px 15px",
                            height: 35,
                          }}
                        />
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center w-100 claimreward-header"
                        // style={{ paddingLeft: "10px" }}
                      >
                        {/* <img
                      src={
                        require(`./assets/avax/${selectedRewardTokenLogo1.toLowerCase()}.svg`)
                          .default
                      }
                      alt=""
                      style={{ width: 14, height: 14 }}
                    />
                    <select
                      disabled={!is_connected}
                      value={selectedClaimToken}
                      onChange={(e) => {
                        handleClaimToken(e.target.value);
                        setState({
                          selectedRewardTokenLogo1:
                            e.target.value === "1" ? "usdt" : "weth",
                        });
                      }}
                      className=" inputfarming"
                      style={{ border: "none" }}
                    >
                      <option value="0"> WAVAX </option>
                      <option value="1"> WETH.e </option>
                    </select> */}
                        <div class="dropdown">
                          <button
                            class="btn reward-dropdown inputfarming d-flex align-items-center justify-content-center gap-1"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img
                              src={
                                require(`./assets/avax/${selectedRewardTokenLogo1.toLowerCase()}.svg`)
                                  .default
                              }
                              alt=""
                              style={{ width: 14, height: 14 }}
                            />
                            {selectedRewardTokenLogo1.toUpperCase()}
                            <img
                              src={dropdownVector}
                              alt=""
                              style={{ width: 10, height: 10 }}
                            />
                          </button>
                          <ul
                            class="dropdown-menu"
                            style={{ minWidth: "100%" }}
                          >
                            <span
                              className="d-flex align-items-center justify-content-center  gap-1 inputfarming farming-dropdown-item py-1 w-100"
                              onClick={() => {
                                handleClaimToken("1");

                                setSelectedRewardTokenLogo1("wavax");
                              }}
                            >
                              <img
                                src={require(`./assets/avax/wavax.svg`).default}
                                alt=""
                                style={{ width: 14, height: 14 }}
                              />
                              WAVAX
                            </span>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={
                      selectedPool === "" ||
                      claimStatus === "claimed" ||
                      claimStatus === "failed" ||
                      claimStatus === "success" ||
                      pendingDivs <= 0
                        ? true
                        : false
                    }
                    className={`btn filledbtn ${
                      claimStatus === "claimed" ||
                      selectedPool === "" ||
                      selectedPool === "wavax2" ||
                      selectedPool === "dyp2" ||
                      pendingDivs <= 0
                        ? "disabled-btn"
                        : claimStatus === "failed"
                        ? "fail-button"
                        : claimStatus === "success"
                        ? "success-button"
                        : null
                    } d-flex justify-content-center align-items-center`}
                    style={{ height: "fit-content" }}
                    onClick={handleClaimDivs}
                  >
                    {claimLoading ? (
                      <div
                        class="spinner-border spinner-border-sm text-light"
                        role="status"
                      >
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    ) : claimStatus === "failed" ? (
                      <>
                        <img src={failMark} alt="" />
                        Failed
                      </>
                    ) : claimStatus === "success" ? (
                      <>Success</>
                    ) : (
                      <>Claim</>
                    )}
                  </button>
                </div>
                {errorMsg2 && <h6 className="errormsg">{errorMsg2}</h6>}
                {/* <button
              title={claimTitle}
              disabled={!is_connected}
              className="btn  btn-primary btn-block l-outline-btn"
              type="submit"
              onClick={handleClaimDivs}
            >
              CLAIM
            </button> */}
                {/* <button
            onClick={(e) => {
              e.preventDefault();
              handleClaimDyp();
            }}
            title={claimTitle}
            disabled={!is_connected}
            className="btn  btn-primary btn-block l-outline-btn"
            type="submit"
          >
            CLAIM
          </button> */}
              </div>
            </div>

            <div
              className={`otherside-border col-12 col-md-12 col-lg-2 ${
                chainId !== "43114" && "blurrypool"
              }`}
            >
              <h6 className="deposit-txt d-flex align-items-center gap-2 justify-content-between">
                WITHDRAW
                <ClickAwayListener onClickAway={withdrawClose}>
                  <Tooltip
                    open={withdrawTooltip}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    placement="top"
                    title={
                      <div className="tooltip-text">
                        {
                          "Withdraw your deposited assets from the farming smart contract."
                        }
                      </div>
                    }
                  >
                    <img src={moreinfo} alt="" onClick={withdrawOpen} />
                  </Tooltip>
                </ClickAwayListener>
              </h6>

              <button
                disabled={Number(depositedTokens) > 0 ? false : true}
                className={
                  // depositStatus === "success" ?
                  "outline-btn btn"
                  // :
                  //  "btn disabled-btn"
                }
                onClick={() => {
                  setShowWithdrawModal(true);
                }}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
      {popup && (
        <Modal
          visible={popup}
          modalId="tymodal"
          title="stats"
          setIsVisible={() => {
            setPopup(false);
          }}
          width="fit-content"
        >
          <div className="earn-hero-content p4token-wrapper">
            <div className="l-box pl-3 pr-3">
              {/* <div className="container">
              <div className="row" style={{ marginLeft: "0px" }}>
                <div className="d-flex justify-content-between gap-2 align-items-center p-0">
                  <h6 className="d-flex gap-2 align-items-center statstext">
                    <img src={stats} alt="" />
                    My Stats
                  </h6>
                  <h6 className="d-flex gap-2 align-items-center myaddrtext">
                    My address
                    <a
                      href={`${window.config.etherscan_baseURL}/address/${coinbase}`}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      <h6 className="addresstxt">
                        {coinbase?.slice(0, 10) + "..."}
                      </h6>
                    </a>
                    <img src={arrowup} alt="" />
                  </h6>
                </div>
              </div>
              <table className="table-stats table table-sm table-borderless mt-2">
                <tbody>
                  <tr>
                    <td className="text-right">
                      <th>MY LP Deposit</th>
                      <div>
                        <strong>{myDepositedLpTokens}</strong>{" "}
                        <small>iDYP/WAVAX</small>
                      </div>
                    </td>

                    <td className="text-right">
                      <th>Total LP Deposited</th>
                      <div>
                        <strong style={{ fontSize: 9 }}>{tvl}</strong>{" "}
                        <small>iDYP/WAVAX</small>
                      </div>
                    </td>
                    <td className="text-right">
                      <th>My DYP Stake</th>
                      <div>
                        <strong>{reward_token_balance}</strong>{" "}
                        <small>DYP</small>
                      </div>
                    </td>
                    
                  </tr>

                  <tr>
                    <td className="text-right">
                      <th>Total Earned DYP</th>
                      <div>
                        <strong>{totalEarnedTokens}</strong>{" "}
                        <small>DYP</small>
                      </div>
                    </td>

                    <td className="text-right">
                      <th>Total Earned WAVAX</th>
                      <div>
                        <strong>{totalEarnedEth}</strong>{" "}
                        <small>WAVAX</small>
                      </div>
                    </td>
                    <td className="text-right">
                      <th>My Share</th>
                      <div>
                        <strong>{myShare}</strong> <small>%</small>
                      </div>
                    </td>
                  </tr>
                  <tr></tr>
                </tbody>
              </table>
            </div> */}
              <div className="stats-container my-4">
                <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                  <span className="stats-card-title">My LP Deposit</span>
                  <h6 className="stats-card-content">
                    {getFormattedNumber(myDepositedLpTokens, 3)} iDYP/WAVAX
                  </h6>
                  <span className="stats-usd-value">
                    ${getFormattedNumber(myDepositedLpTokens * iDypUSD)}
                  </span>
                </div>
                <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                  <span className="stats-card-title">Total LP Deposited</span>
                  <h6 className="stats-card-content">
                    {getFormattedNumber(tvl, 3)} iDYP/WAVAX
                  </h6>
                  <span className="stats-usd-value">
                    ${getFormattedNumber(tvl * iDypUSD)}
                  </span>
                </div>
                <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                  <span className="stats-card-title">My DYP Stake</span>
                  <h6 className="stats-card-content">
                    {getFormattedNumber(reward_token_balance, 3)} DYP
                  </h6>
                  <span className="stats-usd-value">
                    ${getFormattedNumber(reward_token_balance * dypUSD)}
                  </span>
                </div>
                <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                  <span className="stats-card-title">Total Earned DYP</span>
                  <h6 className="stats-card-content">
                    {getFormattedNumber(totalEarnedTokens, 3)} DYP
                  </h6>
                  <span className="stats-usd-value">
                    ${getFormattedNumber(totalEarnedTokens * dypUSD)}
                  </span>
                </div>
                <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                  <span className="stats-card-title">Total Earned WAVAX</span>
                  <h6 className="stats-card-content">
                    {getFormattedNumber(totalEarnedEth, 3)} WAVAX
                  </h6>
                  <span className="stats-usd-value">{/* $23,674,64 */}</span>
                </div>
                <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                  <span className="stats-card-title">My Share</span>
                  <h6 className="stats-card-content">{myShare}%</h6>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-center gap-2">
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "12px",
                    lineHeight: "18px",
                    color: "#C0C9FF",
                  }}
                >
                  My address
                </span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${window.config.snowtrace_baseURL}/address/${coinbase}`}
                  className="stats-link"
                >
                  {shortAddress(coinbase)} <img src={statsLinkIcon} alt="" />
                </a>
              </div>
              <hr />
              <div className="container">
                <div className="row" style={{ marginLeft: "0px" }}>
                  <div className="d-flex justify-content-between gap-2 align-items-center p-0">
                    <h6
                      className="d-flex gap-2 align-items-center statstext"
                      style={{
                        fontWeight: "500",
                        fontSize: "20px",
                        lineHeight: "28px",
                        color: "#f7f7fc",
                      }}
                    >
                      <img src={poolStatsIcon} alt="" />
                      Pool stats
                    </h6>
                    {/* <h6 className="d-flex gap-2 align-items-center myaddrtext">
                    My address
                    <a
                      href={`${window.config.etherscan_baseURL}/token/${reward_token._address}?a=${coinbase}`}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      <h6 className="addresstxt">
                        {coinbase?.slice(0, 10) + "..."}
                      </h6>
                    </a>
                    <img src={arrowup} alt="" />
                  </h6> */}
                  </div>
                </div>
                {/* <table className="table-stats table table-sm table-borderless mt-2">
                <tbody>
                  <tr>
                    <td className="text-right">
                      <th>TVL USD</th>
                      <div>
                        <strong>${tvl_usd}</strong> <small>USD</small>
                      </div>
                    </td>

                    <td className="text-right">
                      <th>Total LP deposited</th>
                      <div>
                        <strong style={{ fontSize: 11 }}>{tvl}</strong>{" "}
                        <small>iDYP/WAVAX</small>
                      </div>
                    </td>

                    <td className="text-right">
                      <th>To be swapped</th>
                      <div>
                        <strong>{tokensToBeSwapped}</strong>{" "}
                        <small>iDYP</small>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-right">
                      <th>To be burnt / disbursed</th>
                      <div>
                        <strong>{tokensToBeDisbursedOrBurnt}</strong>{" "}
                        <small>iDYP</small>
                      </div>
                    </td>

                    <td className="text-right">
                      <th>Contract Expiration</th>
                      <small>{expiration_time}</small>
                    </td>
                    <td
                      style={{
                        background: "transparent",
                        border: "none",
                        gap: 5,
                      }}
                    >
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://github.com/dypfinance/Buyback-Farm-Stake-Governance-V2/tree/main/Audit`}
                        className="maxbtn d-flex align-items-center"
                        style={{ height: "25px" }}
                      >
                        Audit
                        <img src={arrowup} alt="" />
                      </a>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${window.config.etherscan_baseURL}/token/${reward_token._address}?a=${coinbase}`}
                        className="text-white mt-2"
                        style={{
                          height: "25px",
                          textDecoration: "underline",
                          fontSize: "9px",
                        }}
                      >
                        View on Etherscan
                        <img src={whiteArrowUp} alt="" className="ms-1" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table> */}
                <div className="stats-container my-4">
                  <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                    <span className="stats-card-title">TVL USD</span>
                    <h6 className="stats-card-content">
                      ${getFormattedNumber(tvlUSD, 3)} USD
                    </h6>
                  </div>
                  <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                    <span className="stats-card-title">Total LP Deposited</span>
                    <h6 className="stats-card-content">
                      {getFormattedNumber(tvl, 3)} iDYP/WAVAX
                    </h6>
                  </div>
                  <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                    <span className="stats-card-title">To be swapped</span>
                    <h6 className="stats-card-content">
                      {getFormattedNumber(tokensToBeSwapped, 3)} DYP
                    </h6>
                  </div>
                  <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                    <span className="stats-card-title">To be burnt</span>
                    <h6 className="stats-card-content">
                      {getFormattedNumber(tokensToBeDisbursedOrBurnt, 3)} iDYP
                    </h6>
                  </div>
                  <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                    <span className="stats-card-title">
                      Contract Expiration
                    </span>
                    <h6 className="stats-card-content">{expiration_time}</h6>
                  </div>
                  <div className="d-flex flex-column align-items-start justify-content-center gap-2">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://github.com/dypfinance/staking-governance-security-audits`}
                      className="stats-link"
                    >
                      Audit <img src={statsLinkIcon} alt="" />
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${window.config.snowtrace_baseURL}/token/${reward_token._address}?a=${coinbase}`}
                      className="stats-link"
                    >
                      View transaction <img src={statsLinkIcon} alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showWithdrawModal && (
        <Modal
          visible={showWithdrawModal}
          modalId="withdrawmodal"
          title="withdraw"
          setIsVisible={() => {
            setShowWithdrawModal(false);
          }}
          width="fit-content"
        >
          <div className="earn-hero-content p4token-wrapper">
            <div className="l-box pl-3 pr-3">
              <div className="container">
                <div className="row" style={{ marginLeft: "0px" }}>
                  <h6 className="withdrawdesc mt-2 p-0">
                    {lockTime === "No Lock"
                      ? "Your deposit has no lock-in period. You can withdraw your assets anytime, or continue to earn rewards every day."
                      : `The pool has a lock time. You can withdraw your deposited assets after the lock time expires.`}
                  </h6>
                </div>
                <div className="d-flex flex-column mt-2">
                  <div className="d-flex  gap-2 justify-content-between align-items-center">
                    <div className="d-flex flex-column gap-1">
                      <h6 className="withsubtitle mt-3">Timer</h6>
                      <h6 className="withtitle" style={{ fontWeight: 300 }}>
                        {lockTime === "No Lock" ? (
                          "No Lock"
                        ) : (
                          <Countdown
                            date={Number(stakingTime) + Number(cliffTime)}
                            renderer={renderer}
                          />
                        )}
                      </h6>
                    </div>
                  </div>
                  <div className="separator"></div>

                  <div className="d-flex flex-column gap-1 mt-2">
                    <h6
                      className="withsubtitle mb-2"
                      style={{ color: "#4ED5D2" }}
                    >
                      Select assets
                    </h6>
                    <div className="row d-flex align-items-start justify-content-between gap-1 ">
                      <div className="col-5 d-flex flex-column gap-1">
                        <div
                          className="gap-1 claimreward-wrapper w-100"
                          onClick={() => {
                            setSelectedPool("wavax2");
                          }}
                          style={{
                            background:
                              selectedPool === "wavax2" ? "#141333" : "#26264F",
                            border:
                              selectedPool === "wavax2"
                                ? "1px solid #57B6AB"
                                : "1px solid #8E97CD",
                          }}
                        >
                          <img
                            src={selectedPool === "wavax2" ? check : empty}
                            alt=""
                            className="activestate"
                            style={{ top: "65px" }}
                          />
                          <div className="d-flex flex-column align-items-center gap-2 justify-content-between w-100">
                            <div className="position-relative">
                              <h6
                                className="withsubtitle"
                                style={{ padding: "5px 0 0 15px" }}
                              >
                                Value
                              </h6>

                              <input
                                disabled
                                value={
                                  Number(withdrawAmount) > 0
                                    ? `${withdrawAmount * LP_AMPLIFY_FACTOR} LP`
                                    : `${withdrawAmount} LP`
                                }
                                onChange={(e) =>
                                  setWithdrawAmount(
                                    Number(e.target.value) > 0
                                      ? e.target.value / LP_AMPLIFY_FACTOR
                                      : e.target.value
                                  )
                                }
                                className=" left-radius inputfarming styledinput2"
                                placeholder="0"
                                type="text"
                                style={{
                                  width: "165px",
                                  padding: "0px 15px 0px 15px",
                                  height: 35,
                                  fontSize: 20,
                                  fontWeight: 300,
                                }}
                              />
                            </div>
                            {/* <div
                          className="d-flex flex-column gap-1"
                          style={{ paddingRight: "15px" }}
                        >
                          <h6 className="withsubtitle"></h6>
                          <h6
                            className="withtitle"
                            style={{ color: "#C0CBF7" }}
                          >
                            $200
                          </h6>
                        </div> */}
                            <div className="d-flex flex-column align-items-center gap-2 justify-content-between w-100">
                              <div className="position-relative">
                                <h6
                                  className="withsubtitle"
                                  style={{ padding: "5px 0 0 15px" }}
                                >
                                  LP balance
                                </h6>

                                <input
                                  disabled
                                  value={
                                    Number(withdrawAmount) > 0
                                      ? `${
                                          withdrawAmount * LP_AMPLIFY_FACTOR
                                        } LP`
                                      : `${withdrawAmount} LP`
                                  }
                                  onChange={(e) =>
                                    setWithdrawAmount(
                                      Number(e.target.value) > 0
                                        ? e.target.value / LP_AMPLIFY_FACTOR
                                        : e.target.value
                                    )
                                  }
                                  className=" left-radius inputfarming styledinput2"
                                  placeholder="0"
                                  type="text"
                                  style={{
                                    width: "165px",
                                    padding: "0px 15px 0px 15px",
                                    height: 35,
                                    fontSize: 20,
                                    fontWeight: 300,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            className="d-flex align-items-center justify-content-center w-100 claimreward-header"
                            // style={{ padding: "10px 0 0 10px" }}
                          >
                            {/* <img
                          src={
                            require(`./assets/avax/${selectedRewardTokenLogo1.toLowerCase()}.svg`)
                              .default
                          }
                          alt=""
                          style={{ width: 14, height: 14 }}
                        />
                        <select
                          disabled={!is_connected}
                          value={selectedClaimToken}
                          onChange={(e) => {
                            handleClaimToken(e.target.value);
                            setState({
                              selectedRewardTokenLogo1:
                                e.target.value === "0"
                                  ? "wavax"
                                  : "weth.e",
                            });
                          }}
                          className=" inputfarming"
                          style={{ border: "none" }}
                        >
                          <option value="0"> WAVAX </option>
                          <option value="1"> WETH.e </option>
                        </select> */}
                            <div class="dropdown">
                              <button
                                class="btn reward-dropdown inputfarming d-flex align-items-center justify-content-center gap-1"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <img
                                  src={
                                    require(`./assets/${selectedRewardTokenLogo1.toLowerCase()}.svg`)
                                      .default
                                  }
                                  alt=""
                                  style={{ width: 14, height: 14 }}
                                />
                                {selectedRewardTokenLogo1.toUpperCase()}
                                <img
                                  src={dropdownVector}
                                  alt=""
                                  style={{ width: 10, height: 10 }}
                                />
                              </button>
                              <ul
                                class="dropdown-menu"
                                style={{ minWidth: "100%" }}
                              >
                                <span
                                  className="d-flex align-items-center justify-content-center  gap-1 inputfarming farming-dropdown-item py-1 w-100"
                                  onClick={() => {
                                    handleClaimToken("1");

                                    setSelectedRewardTokenLogo1("wavax");
                                  }}
                                >
                                  <img
                                    src={require(`./assets/wavax.svg`).default}
                                    alt=""
                                    style={{ width: 14, height: 14 }}
                                  />
                                  WAVAX
                                </span>
                              
                              </ul>
                            </div>
                          </div>
                        </div>
                        <h6 className="withsubtitle d-flex justify-content-start w-100 mb-2">
                          Total LP deposited{" "}
                        </h6>
                      </div>
                   
                    </div>
                  </div>

                  <div className="separator"></div>
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    {/* <button
                  className="btn filledbtn w-100"
                  onClick={(e) => {
                    handleWithdrawDyp();
                  }}
                  title={
                    canWithdraw
                      ? ""
                      : `You recently staked, you can unstake ${cliffTimeInWords}`
                  }
                >
                  Withdraw
                </button> */}

                    <button
                      disabled={
                        selectedPool === "" ||
                        withdrawStatus === "failed" ||
                        withdrawStatus === "success"
                          ? true
                          : false
                      }
                      className={` w-100 btn filledbtn ${
                        selectedPool === ""
                          ? "disabled-btn"
                          : withdrawStatus === "failed"
                          ? "fail-button"
                          : withdrawStatus === "success"
                          ? "success-button"
                          : null
                      } d-flex justify-content-center align-items-center`}
                      style={{ height: "fit-content" }}
                      onClick={() => {
                        selectedPool === "wavax2"
                          ? handleWithdraw()
                          : handleWithdrawDyp();
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
                          <img src={failMark} alt="" />
                          Failed
                        </>
                      ) : withdrawStatus === "success" ? (
                        <>Success</>
                      ) : (
                        <>Withdraw</>
                      )}
                    </button>

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
                              handleWithdrawDyp();
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
                  {/* <h6 className="withsubtitle d-flex justify-content-start w-100 mt-1">
                  *No withdrawal fee
                </h6> */}
                  {errorMsg3 && <h6 className="errormsg">{errorMsg3}</h6>}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {show && (
        <WalletModal
          show={show}
          handleClose={hideModal}
          handleConnection={() => {
            handleConnection();
            setShow(false);
          }}
        />
      )}

      {/* <div
      className="calculator-btn d-flex justify-content-center align-items-center gap-2 text-white"
      onClick={() => setState({ showCalculator: true })}
    >
      <img
        src={calculatorIcon}
        alt=""
        style={{ width: 30, height: 30 }}
      />
      Calculator
    </div> */}

      {showCalculator && (
        <Modal
          title="calculator"
          modalId="calculatormodal"
          setIsVisible={() => showCalculator(false)}
          visible={showCalculator}
        >
          <div className="pools-calculator">
            {/* <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <img src={calculatorIcon} alt="" />
            <h5
              style={{
                fontSize: "23px",
                fontWeight: "500",
                color: "#f7f7fc",
              }}
            >
              Calculator
            </h5>
          </div>
          <img
            src={xMark}
            alt=""
            onClick={() => {
              setState({ showCalculator: false });
            }}
            className="cursor-pointer"
          />
        </div> */}
            <hr />
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column gap-3 w-50 me-5">
                <span style={{ fontSize: "15px", fontWeight: "500" }}>
                  Days to stake
                </span>
                <input
                  style={{ height: "40px" }}
                  type="number"
                  className="form-control calcinput w-100"
                  id="days"
                  name="days"
                  placeholder="Days*"
                  value={approxDays}
                  onChange={(e) => setApproxDays(e.target.value)}
                />
              </div>
              <div className="d-flex flex-column gap-3 w-50 me-5">
                <span style={{ fontSize: "15px", fontWeight: "500" }}>
                  Amount to stake
                </span>
                <input
                  style={{ height: "40px" }}
                  type="number"
                  className="form-control calcinput w-100"
                  id="days"
                  name="days"
                  placeholder="Value of deposit in USD"
                  value={
                    Number(approxDeposit) > 0
                      ? approxDeposit * LP_AMPLIFY_FACTOR
                      : approxDeposit
                  }
                  onChange={(e) =>
                    setApproxDeposit(
                      Number(e.target.value) > 0
                        ? e.target.value / LP_AMPLIFY_FACTOR
                        : e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="d-flex flex-column gap-2 mt-4">
              <h3 style={{ fontWeight: "500", fontSize: "39px" }}>
                $ {getFormattedNumber(getApproxReturnUSD() / getUsdPerETH(), 6)}
                USD
              </h3>
              <h6
                style={{
                  fontWeight: "300",
                  fontSize: "15px",
                  color: "#f7f7fc",
                }}
              >
                Approx {getFormattedNumber(getApproxReturnUSD(), 2)} WAVAX
              </h6>
            </div>
            <div className="mt-4">
              <p
                style={{
                  fontWeight: "400",
                  fontSize: "13px",
                  color: "#f7f7fc",
                }}
              >
                *This calculator is for informational purposes only. Calculated
                yields assume that prices of the deposited assets don't change.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FarmAvaxFunc;
