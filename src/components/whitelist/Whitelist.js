import React, { useState, useEffect } from "react";
import "./whitelist.css";
import dyp from "./assets/dyp.svg";
import idyp from "./assets/idyp.svg";
import premium from "./assets/premium.png";
import tooltipIcon from "./assets/tooltipIcon.svg";
import usdt from "./assets/usdt.svg";
import eth from "./assets/eth.svg";
import bnb from "./assets/bnb.svg";
import dropArrow from "./assets/dropArrow.svg";
import { shortAddress } from "../../functions/shortAddress";
import getFormattedNumber from "../../functions/get-formatted-number";
import { Tooltip } from "@material-ui/core";
import checkIcon from "./assets/checkIcon.svg";
import OutsideClickHandler from "react-outside-click-handler";
import buyToken from "./assets/buyToken.svg";
import { handleSwitchNetworkhook } from "../../functions/hooks";
import Web3 from "web3";
import wallet from "../FARMINNG/assets/wallet.svg";
import moment from "moment";

const Whitelist = ({
  networkId,
  isConnected,
  handleConnection,
  coinbase,
  handleSwitchNetwork,
  isPremium,
  userPools,
  hasDypBalance,
  hasiDypBalance,
}) => {
  const [coinDropdown, setCoinDropdown] = useState(false);
  const [chainDropdown, setChainDropdown] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({
    coin: "USDT",
    icon: usdt,
    address: "",
  });
  const [selectedChain, setSelectedChain] = useState({
    chain: "BNB Chain",
    icon: bnb,
  });

  const [slice, setSlice] = useState(5);
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState();
  const [canDeposit, setCanDeposit] = useState(true);
  const [hasDypStaked, sethasDypStaked] = useState(false);
  const [hasiDypStaked, sethasiDypStaked] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [depositLoading, setdepositLoading] = useState(false);
  const [depositStatus, setdepositStatus] = useState("initial");
  const [selectedToken, setselectedToken] = useState();
  const [allUserCommitments, setAllUserCommitments] = useState([]);
  let expireDay = new Date("2024-09-30T14:00:00.000+02:00");

  const poolCap = 25000;

  const idyp_pools = [
    "0x41b8a58f4307ea722ad0a964966caa18a6011d93",
    "0xf6DC9E51D4E0FCc19ca6426fB5422f1E9a24F2eE",
    "0xFBe84Af34CdC22455f82e18B76Ca50D21d3aBF84",
    "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d",
    "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603",
    "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d",
  ];

  const dyp_pools = [
    "0x92A84052Fe6945949A295AF14a7506e3dc085492",
    "0xbE030A667d9ee75a9FCdF2162A2C14ccCAB573dD",
    "0x0fafe78e471b52bc4003984a337948ed55284573",
    "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0",
    "0x998A9F0DF7DAF20c2B0Bb379Dcae394636926a96",
    "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603",
    "0x9845a667b1A603FF21596FDdec51968a2bccAc11",
    "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603",
  ];

  const checkStakedPools = () => {
    const dypResult = userPools.filter((item) => {
      return dyp_pools.includes(item.contract_address.toLowerCase());
    });
    const idypResult = userPools.filter((item) => {
      return idyp_pools.includes(item.contract_address.toLowerCase());
    });
    if (idypResult.length > 0) {
      sethasiDypStaked(true);
    }
    if (dypResult.length > 0) {
      sethasDypStaked(true);
    }
  };

  const requirements = [
    {
      icon: dyp,
      coin: "DYP Token",
      value: "Holder/Staker",
      active: hasDypStaked || hasDypBalance,
    },
    {
      icon: idyp,
      coin: "iDYP Token",
      value: "Holder/Staker",
      active: hasiDypStaked || hasiDypBalance,
    },
    {
      icon: premium,
      coin: "Premium",
      value: "Subscriber",
      active: isPremium,
    },
  ];

  const handleViewMore = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (slice >= allUserCommitments.length) {
        setSlice(5);
      } else {
        setSlice(slice + 3);
      }
    }, 2000);
  };

  const handleChangeChain = async (hexChain, chain) => {
    await handleSwitchNetworkhook(hexChain)
      .then(() => {
        handleSwitchNetwork(chain);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getUserBalanceForToken = async (token) => {
    if (coinbase) {
      //1 is for eth chain, 2 for avax and 3 for bnb chain
      let tokenBalance = await window.getTokenHolderBalanceAll(
        coinbase,
        token.address,
        networkId === 1 ? 1 : networkId === 56 ? 3 : 1
      );

      const balance_formatted = new window.BigNumber(tokenBalance)
        .div(10 ** token.decimals)
        .toString(10);
      setTokenBalance(balance_formatted);
    } else setTokenBalance(0);
  };

  const getUserCommitment = async () => {
    let commitment_contract = new window.bscWeb3.eth.Contract(
      window.COMMITMENT_ABI,
      window.config.commitment_address
    );

    let commitment_contract_eth = new window.infuraWeb3.eth.Contract(
      window.COMMITMENT_ETH_ABI,
      window.config.commitment_eth_address
    );

    const total_commitments = await commitment_contract.methods
      .commitmentCountForUser(
        coinbase,
        window.config.commitmentbnb_tokens[0].address
      )
      .call()
      .catch((e) => {
        console.error(e);
        return [];
      });

    const total_commitments_eth_usdt = await commitment_contract_eth.methods
      .commitmentCountForUser(
        coinbase,
        window.config.commitmenteth_tokens[0].address
      )
      .call()
      .catch((e) => {
        console.error(e);
        return [];
      });

    const total_commitments_eth_usdc = await commitment_contract_eth.methods
      .commitmentCountForUser(
        coinbase,
        window.config.commitmenteth_tokens[1].address
      )
      .call()
      .catch((e) => {
        console.error(e);
        return [];
      });
    let totalTokenDeposited = 0;
    let totalCommitmentArray_bnb = [];
    let totalCommitmentArray_eth_usdt = [];
    let totalCommitmentArray_eth_usdc = [];

    if (total_commitments && total_commitments > 0) {
      const finalResult = await Promise.all(
        window.range(0, total_commitments - 1).map(async (i) => {
          const commitment_list = await commitment_contract.methods
            .commitments(
              coinbase,
              window.config.commitmentbnb_tokens[0].address,
              i
            )
            .call()
            .catch((e) => {
              console.error(e);
              return [];
            });
          if (commitment_list) {
            totalTokenDeposited += commitment_list.amount / 1e18;
            return {
              commitment_list,
              network: "BNB Chain",
              token: "USDT",
            };
          }
        })
      );
      const finalResult_sorted = finalResult.sort(function (a, b) {
        return a.commitment_list.timestamp - b.commitment_list.timestamp;
      });
      totalCommitmentArray_bnb = finalResult_sorted;
    }
    if (total_commitments_eth_usdt && total_commitments_eth_usdt > 0) {
      const finalResult = await Promise.all(
        window.range(0, total_commitments_eth_usdt - 1).map(async (i) => {
          const commitment_list = await commitment_contract_eth.methods
            .commitments(
              coinbase,
              window.config.commitmenteth_tokens[0].address,
              i
            )
            .call()
            .catch((e) => {
              console.error(e);
              return [];
            });
          if (commitment_list) {
            totalTokenDeposited += commitment_list.amount / 1e6;
            return {
              commitment_list,
              network: "Ethereum",
              token: "USDT",
            };
          }
        })
      );
      const finalResult_sorted = finalResult.sort(function (a, b) {
        return a.commitment_list.timestamp - b.commitment_list.timestamp;
      });
      
      totalCommitmentArray_eth_usdt = finalResult_sorted;
    }
    if (total_commitments_eth_usdc && total_commitments_eth_usdc > 0) {
      const finalResult = await Promise.all(
        window.range(0, total_commitments_eth_usdc - 1).map(async (i) => {
          const commitment_list = await commitment_contract_eth.methods
            .commitments(
              coinbase,
              window.config.commitmenteth_tokens[1].address,
              i
            )
            .call()
            .catch((e) => {
              console.error(e);
              return [];
            });
          if (commitment_list) {
            totalTokenDeposited += commitment_list.amount / 1e6;
            return {
              commitment_list,
              network: "Ethereum",
              token: "USDC",
            };
          }
        })
      );
      const finalResult_sorted = finalResult.sort(function (a, b) {
        return a.commitment_list.timestamp - b.commitment_list.timestamp;
      });
      totalCommitmentArray_eth_usdc = finalResult_sorted;
    } else if (
      total_commitments &&
      total_commitments === 0 &&
      total_commitments_eth_usdt &&
      total_commitments_eth_usdt === 0 &&
      total_commitments_eth_usdc &&
      total_commitments_eth_usdc === 0
    ) {
      setAllUserCommitments([]);
      setTotalDeposited(0);
    }
    const finalCommitmentArray = [
      ...totalCommitmentArray_bnb,
      ...totalCommitmentArray_eth_usdc,
      ...totalCommitmentArray_eth_usdt,
    ];
    if (finalCommitmentArray && finalCommitmentArray.length > 0) {
      const finalResult_sorted = finalCommitmentArray.sort(function (a, b) {
        return a.commitment_list.timestamp - b.commitment_list.timestamp;
      });
      setAllUserCommitments(finalResult_sorted);
      setTotalDeposited(totalTokenDeposited);
    } else setAllUserCommitments([]);
  };
  // console.log("userPools", userPools);
  const checkApproval = async (amount) => {
    if (networkId === 56) {
      const result = await window
        .checkapproveStakePool(
          coinbase,
          selectedCoin.address,
          window.config.commitment_address
        )
        .then((data) => {
          return data;
        });

      let result_formatted = new window.BigNumber(result)
        .div(10 ** selectedToken.decimals)
        .toFixed(6);

      if (
        Number(result_formatted) >= Number(amount) &&
        Number(result_formatted) !== 0 &&
        Number(amount) >= 100
      ) {
        setdepositStatus("deposit");
      } else {
        setdepositStatus("initial");
      }
    } else if (networkId === 1) {
      const result = await window
        .checkapproveStakePool(
          coinbase,
          selectedCoin.address,
          window.config.commitment_eth_address
        )
        .then((data) => {
          return data;
        });

      let result_formatted = new window.BigNumber(result)
        .div(10 ** selectedToken.decimals)
        .toFixed(6);
      console.log(Number(result_formatted), result, Number(amount));
      if (
        Number(result_formatted) >= Number(amount) &&
        Number(result_formatted) !== 0 &&
        Number(amount) >= 100
      ) {
        setdepositStatus("deposit");
      } else {
        setdepositStatus("initial");
      }
    }
  };

  const handleUserMaxDeposit = () => {
    const depositAmount = tokenBalance;
    if (depositAmount >= poolCap) {
      setDepositAmount(poolCap);
      checkApproval(poolCap);

      seterrorMsg(
        "Maximum amount allowed to commit is" + poolCap + selectedCoin.coin
      );
      setCanDeposit(true);
    } else if (depositAmount < poolCap && depositAmount >= 100) {
      setDepositAmount(tokenBalance);
      checkApproval(tokenBalance);
      setCanDeposit(true);
    } else if (depositAmount < 100 && depositAmount >= 0) {
      checkApproval(tokenBalance);
      setDepositAmount(tokenBalance);
      seterrorMsg("Deposit amount is lower than minimum amount required.");
      setCanDeposit(false);
    }
  };

  const handleStake = async () => {
    if (networkId === 56) {
      setdepositLoading(true);

      let amount = depositAmount;
      amount = new window.BigNumber(amount)
        .times(10 ** selectedToken.decimals)
        .toFixed(0);

      window.web3 = new Web3(window.ethereum);
      let commitment_contract = new window.web3.eth.Contract(
        window.COMMITMENT_ABI,
        window.config.commitment_address
      );

      const gasPrice = await window.web3.eth.getGasPrice();
      console.log("gasPrice", gasPrice);
      const currentGwei = window.web3.utils.fromWei(gasPrice, "gwei");

      const transactionParameters = {
        gasPrice: window.web3.utils.toWei(currentGwei.toString(), "gwei"),
      };

      await commitment_contract.methods
        .commit(selectedToken.address, amount)
        .estimateGas({ from: coinbase })
        .then((gas) => {
          transactionParameters.gas = window.web3.utils.toHex(gas);
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log(transactionParameters);

      await commitment_contract.methods
        .commit(selectedToken.address, amount)
        .send({ from: coinbase, ...transactionParameters })
        .then(() => {
          setdepositLoading(false);
          setdepositStatus("success");
          getUserBalanceForToken(selectedToken);
          getUserCommitment();
          setTimeout(() => {
            setdepositStatus("initial");
            setDepositAmount("");
          }, 5000);
        })
        .catch((e) => {
          setdepositLoading(false);
          setdepositStatus("fail");
          seterrorMsg(e?.message);
          setTimeout(() => {
            setDepositAmount("");
            setdepositStatus("initial");
            seterrorMsg("");
          }, 10000);
        });
    } else if (networkId === 1) {
      setdepositLoading(true);

      let amount = depositAmount;
      amount = new window.BigNumber(amount)
        .times(10 ** selectedToken.decimals)
        .toFixed(0);

      window.web3 = new Web3(window.ethereum);
      let commitment_contract = new window.web3.eth.Contract(
        window.COMMITMENT_ETH_ABI,
        window.config.commitment_eth_address
      );

      const gasPrice = await window.web3.eth.getGasPrice();
      console.log("gasPrice", gasPrice);
      const currentGwei = window.web3.utils.fromWei(gasPrice, "gwei");

      const transactionParameters = {
        gasPrice: window.web3.utils.toWei(currentGwei.toString(), "gwei"),
      };

      await commitment_contract.methods
        .commit(selectedToken.address, amount)
        .estimateGas({ from: coinbase })
        .then((gas) => {
          transactionParameters.gas = window.web3.utils.toHex(gas);
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log(transactionParameters);

      await commitment_contract.methods
        .commit(selectedToken.address, amount)
        .send({ from: coinbase, ...transactionParameters })
        .then(() => {
          setdepositLoading(false);
          setdepositStatus("success");
          getUserBalanceForToken(selectedToken);
          getUserCommitment();
          setTimeout(() => {
            setdepositStatus("initial");
            setDepositAmount("");
          }, 5000);
        })
        .catch((e) => {
          setdepositLoading(false);
          setdepositStatus("fail");
          seterrorMsg(e?.message);
          setTimeout(() => {
            setDepositAmount("");
            setdepositStatus("initial");
            seterrorMsg("");
          }, 10000);
        });
    }
  };

  const handleApprove = async () => {
    setdepositLoading(true);
    window.web3 = new Web3(window.ethereum);
    let token_contract = new window.web3.eth.Contract(
      window.TOKEN_ABI,
      selectedCoin.address
    );

    let amount = depositAmount;
    amount = new window.BigNumber(amount)
      .times(10 ** selectedToken.decimals)
      .toFixed(0);
    await token_contract.methods
      .approve(
        networkId === 56
          ? window.config.commitment_address
          : window.config.commitment_eth_address,
        amount
      )
      .send({ from: coinbase })
      .then(() => {
        setdepositLoading(false);
        setdepositStatus("deposit");
      })
      .catch((e) => {
        setdepositLoading(false);
        setdepositStatus("fail");
        seterrorMsg(e?.message);
        setTimeout(() => {
          setDepositAmount("");
          setdepositStatus("initial");
          seterrorMsg("");
        }, 10000);
      });
  };

  useEffect(() => {
    if (depositAmount > 0) {
      const result = Number(depositAmount) + Number(totalDeposited);
      if (result > poolCap) {
        seterrorMsg(
          "Deposit amount is greater than available quota. Please add another amount."
        );
        setCanDeposit(false);
      } else if (depositAmount < 100) {
        setCanDeposit(false);
        seterrorMsg("Minimum deposit amount is 100" + " " + selectedCoin.coin);
      } else {
        seterrorMsg("");
        setCanDeposit(true);
      }
    } else if (depositAmount === 0) {
      setCanDeposit(false);
    }
  }, [depositAmount, totalDeposited, poolCap]);

  useEffect(() => {
    if (networkId === 1) {
      setSelectedChain({
        icon: eth,
        chain: "Ethereum",
      });
      setSelectedCoin({
        icon: require(`./assets/${window.config.commitmenteth_tokens[0].symbol.toLowerCase()}.svg`),
        coin: window.config.commitmenteth_tokens[0].symbol,
        address: window.config.commitmenteth_tokens[0].address,
      });
      getUserBalanceForToken(window.config.commitmenteth_tokens[0]);
      setselectedToken(window.config.commitmenteth_tokens[0]);
    } else if (networkId === 56) {
      setSelectedChain({
        icon: bnb,
        chain: "BNB Chain",
      });

      setSelectedCoin({
        icon: require(`./assets/${window.config.commitmentbnb_tokens[0].symbol.toLowerCase()}.svg`),
        coin: window.config.commitmentbnb_tokens[0].symbol,
        address: window.config.commitmentbnb_tokens[0].address,
      });
      getUserBalanceForToken(window.config.commitmentbnb_tokens[0]);
      setselectedToken(window.config.commitmentbnb_tokens[0]);
    } else {
      setSelectedChain({
        icon: eth,
        chain: "Ethereum",
      });

      setSelectedCoin({
        icon: require(`./assets/${window.config.commitmenteth_tokens[0].symbol.toLowerCase()}.svg`),
        coin: window.config.commitmenteth_tokens[0].symbol,
        address: window.config.commitmenteth_tokens[0].address,
      });
      setTokenBalance(0);
      setselectedToken(window.config.commitmenteth_tokens[0]);
    }
  }, [isConnected, networkId, coinbase]);

  useEffect(() => {
    if (isConnected && coinbase) {
      getUserCommitment();
    } else {
      setAllUserCommitments([]);
    }
  }, [isConnected, coinbase]);

  useEffect(() => {
    if (userPools && userPools.length > 0) {
      checkStakedPools();
    } else {
      sethasDypStaked(false);
      sethasiDypStaked(false);
    }
  }, [userPools]);

  return (
    <div className="container-lg p-0">
      <div className="whitelist-banner d-flex flex-column flex-lg-row p-4 gap-3 gap-lg-0 align-items-center mb-4">
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-3">
            <h6 className="migration-banner-title mb-0">WOD Token Whitelist</h6>
            <p className="migration-banner-desc mb-0">
              WOD Token Whitelist grants early access to our exclusive token
              sale. Join now to secure your spot and be among the first to
              unlock unique benefits within the World of Dypians ecosystem.
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-4 d-flex justify-content-center justify-content-lg-end">
          <div className="position-relative d-flex align-items-center flex-column">
            <div className="commiting-wrapper p-3">
              <div className="d-flex flex-column gap-2">
                <span className="commiting-amount">--</span>
                <span className="migration-status-text-2">
                  Total Committed Value
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="whitelist-info-grid">
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Token Distribution</span>
          <h6 className="mb-0 whitelist-info-title">Private Round</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Token Price</span>
          <h6 className="mb-0 whitelist-info-title">$0.0325</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Fully Diluted Valuation</span>
          <h6 className="mb-0 whitelist-info-title">$42,500,000</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Cliff/Vesting Period</span>
          <h6 className="mb-0 whitelist-info-title">3/16 Months</h6>
        </div>
        <div className="whitelist-info-item p-3 d-flex flex-column gap-1 align-items-start">
          <span className="whitelist-info-span">Network</span>
          <div className="d-flex align-items-center gap-2">
            <img src={bnb} width={24} height={24} alt="" />
            <h6 className="mb-0 whitelist-info-title">BNB Chain</h6>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 col-lg-7">
          <div className="whitelist-info-item d-flex flex-column w-100 p-3 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0 whitelist-deposit-title">Whitelist</h6>
                <span className="whitelist-days-left">
                  {moment
                    .duration(expireDay.getTime() - Date.now())
                    .humanize(true)
                    .slice(
                      3,
                      moment
                        .duration(expireDay.getTime() - Date.now())
                        .humanize(true).length
                    )}{" "}
                  left
                </span>
              </div>
              <img src={tooltipIcon} alt="" />
            </div>
            <div className="whitelist-deposit-wrapper mt-3  d-flex flex-column gap-2">
              <div className="whitelist-deposit-wrapper-header p-2 d-flex align-items-center justify-content-between">
                <span className="commitment-text">Commitment</span>
                <div className="d-flex align-items-center gap-1">
                  <span className="whitelist-my-balance">My Balance</span>
                  <span className="whitelist-my-balance-value">
                    {getFormattedNumber(tokenBalance, 4)} {selectedCoin.coin}
                  </span>
                </div>
              </div>
              <div className="d-flex flex-column gap-2 w-100 p-3">
                <div className="d-flex flex-column flex-lg-row align-items-center w-100 gap-2">
                  <div className="d-flex flex-column gap-1 commitment-deposit-wrapper">
                    <span className="commitment-input-span">Deposit</span>
                    <div className="d-flex align-items-center">
                      <div className="position-relative coin-select-dropdown">
                        {coinDropdown && (
                          <OutsideClickHandler
                            onOutsideClick={() => setCoinDropdown(false)}
                          >
                            <div className="coins-dropdown-list d-flex flex-column ">
                              {(networkId === 1
                                ? window.config.commitmenteth_tokens
                                : networkId === 56
                                ? window.config.commitmentbnb_tokens
                                : window.config.commitmenteth_tokens
                              ).map((item, index) => {
                                return (
                                  <div
                                    className="d-flex align-items-center gap-2 coin-dropdown-item p-2"
                                    key={index}
                                    onClick={() => {
                                      setSelectedCoin({
                                        icon: require(`./assets/${item.symbol.toLowerCase()}.svg`),
                                        coin: item.symbol,
                                        address: item.address,
                                      });
                                      setCoinDropdown(false);
                                      getUserBalanceForToken(item);
                                      setselectedToken(item);
                                    }}
                                  >
                                    <img
                                      src={require(`./assets/${item.symbol.toLowerCase()}.svg`)}
                                      width={20}
                                      height={20}
                                      alt=""
                                    />
                                    <span className="whitelist-token-text">
                                      {item.symbol}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </OutsideClickHandler>
                        )}
                        <div
                          className="text-input2 d-flex align-items-center justify-content-between coin-dropdown position-relative"
                          onClick={() => setCoinDropdown(true)}
                        >
                          <div className="d-flex align-items-center gap-1">
                            <img
                              src={selectedCoin.icon}
                              width={20}
                              height={20}
                              alt=""
                            />
                            <span className="whitelist-token-text">
                              {selectedCoin.coin}
                            </span>
                          </div>
                          <img src={dropArrow} alt="" />
                        </div>
                      </div>
                      <div className="position-relative coin-input d-flex">
                        <input
                          className="text-input2 commitment-input w-100"
                          style={{
                            height: "39px",
                            borderRadius: "0 8px 8px 0",
                          }}
                          type="number"
                          autoComplete="off"
                          name="amount_deposit"
                          id="amount_deposit"
                          key="amount_deposit"
                          placeholder={`Min 100 USDT`}
                          value={depositAmount}
                          onChange={(e) => {
                            setDepositAmount(e.target.value);
                            checkApproval(e.target.value);
                          }}
                          min={100}
                        />
                        <button
                          className="inner-max-btn position-absolute"
                          onClick={handleUserMaxDeposit}
                        >
                          Max
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="commitment-chain-wrapper d-flex flex-column gap-1 ms-0 ms-lg-2">
                    <span className="commitment-input-span">
                      Select Network
                    </span>
                    <div className="position-relative w-100">
                      {chainDropdown && (
                        <OutsideClickHandler
                          onOutsideClick={() => setChainDropdown(false)}
                        >
                          <div className="coins-dropdown-list d-flex flex-column ">
                            <div
                              className="d-flex align-items-center gap-2 coin-dropdown-item p-2"
                              onClick={() => {
                                setChainDropdown(false);
                                handleChangeChain("0x38", "56");
                              }}
                            >
                              <img src={bnb} width={20} height={20} alt="" />
                              <span className="whitelist-token-text">
                                BNB Chain
                              </span>
                            </div>
                            <div
                              className="d-flex align-items-center gap-2 coin-dropdown-item p-2"
                              onClick={() => {
                                setChainDropdown(false);
                                handleChangeChain("0x1", "1");
                              }}
                            >
                              <img src={eth} width={20} height={20} alt="" />
                              <span className="whitelist-token-text">
                                Ethereum
                              </span>
                            </div>
                          </div>
                        </OutsideClickHandler>
                      )}
                      <div
                        className="text-input2 d-flex align-items-center justify-content-between"
                        style={{ height: "39px", cursor: "pointer" }}
                        onClick={() => setChainDropdown(true)}
                      >
                        <div className="d-flex align-items-center gap-1">
                          <img
                            src={selectedChain.icon}
                            width={20}
                            height={20}
                            alt=""
                          />
                          <span className="whitelist-token-text">
                            {selectedChain.chain}
                          </span>
                        </div>
                        <img src={dropArrow} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {errorMsg && (
                  <h6 className="errormsg m-0 justify-content-start">
                    {errorMsg}
                  </h6>
                )}
                <div className="d-flex align-items-center mt-2 gap-1">
                  <span className="commitment-input-span">Estimation:</span>
                  <span className="wod-tokens-commited">
                    {getFormattedNumber((depositAmount ?? 0) / 0.0325, 4)} WOD
                  </span>
                  <span className="commitment-input-span">
                    (distributed on BNB Chain)
                  </span>
                </div>
              </div>
              <div className="d-flex w-100 justify-content-center mb-3">
                {isConnected && (networkId === 1 || networkId === 56) ? (
                  <button
                    disabled={
                      depositAmount === "" ||
                      depositLoading === true ||
                      canDeposit === false ||
                      !isConnected ||
                      !depositAmount ||
                      (!hasDypBalance &&
                        !hasiDypBalance &&
                        !hasDypStaked &&
                        !hasiDypStaked &&
                        !isPremium)
                        ? true
                        : false
                    }
                    className={`btn filledbtn ${
                      ((depositAmount === "" && depositStatus === "initial") ||
                        (!hasDypBalance &&
                          !hasiDypBalance &&
                          !hasDypStaked &&
                          !hasiDypStaked &&
                          !isPremium) ||
                        canDeposit === false ||
                        !isConnected ||
                        !depositAmount) &&
                      "disabled-btn"
                    }  ${
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
                      <>Failed</>
                    )}
                  </button>
                ) : !isConnected ? (
                  <button
                    className="connectbtn btn m-auto"
                    onClick={handleConnection}
                  >
                    <img src={wallet} alt="" /> Connect wallet
                  </button>
                ) : (
                  <button
                    className="connectbtn btn m-auto"
                    onClick={() => {
                      handleChangeChain("0x38", "56");
                    }}
                  >
                    Change Network
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-5 mt-2 mt-lg-0">
          <div className="d-flex flex-column gap-2">
            <div className="my-commitment-wrapper py-4 w-100 d-flex flex-column align-items-center gap-2">
              <h6 className="mb-0 my-commitment-value">
                ${getFormattedNumber(totalDeposited)}
              </h6>
              <span className="my-commitment-span">My Commitment</span>
            </div>
            <div className="whitelist-info-item d-flex flex-column w-100 p-3">
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="mb-0 whitelist-deposit-title">Requirements</h6>
                <Tooltip
                  title={
                    <>
                      <div className="whitelist-tooltip-content-text">
                        You only need to complete one of the requirements to be
                        eligible for the whitelist.
                      </div>
                    </>
                  }
                  enterDelay={0}
                  leaveDelay={2000}
                >
                  <img src={tooltipIcon} alt="" />
                </Tooltip>
              </div>
              <div className="requirements-grid mt-3">
                {requirements.map((item, index) => (
                  <div
                    key={index}
                    className={`requirements-item ${
                      item.active && "requirements-active"
                    } p-3 d-flex align-items-center justify-content-center gap-2`}
                  >
                    {item.active && (
                      <img src={checkIcon} className="req-check" alt="" />
                    )}
                    <img src={item.icon} height={36} width={36} alt="" />
                    <div className="d-flex flex-column gap-1">
                      <span className="requirement-token">{item.coin}</span>
                      <span className="requirement-title">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="requirements-divider mt-3"></div>
              {isConnected &&
              (isPremium ||
                hasDypBalance ||
                hasiDypBalance ||
                hasDypStaked ||
                hasiDypStaked) ? (
                <span className="eligible-span mt-3">
                  You are eligible for the whitelist.
                </span>
              ) : (
                <a
                  className="req-buy-dyp-wrapper mt-2 d-flex align-items-center justify-content-between w-100 p-2"
                  href="https://app.uniswap.org/swap?use=V2&inputCurrency=0x39b46B212bDF15b42B166779b9d1787A68b9D0c3"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <span className="req-buy-dyp">
                    Buy DYP tokens to become eligible for the whitelist
                  </span>
                  <img src={buyToken} alt="" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {allUserCommitments && allUserCommitments.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="whitelist-info-item-2 d-flex flex-column">
              <div className="d-flex align-items-center p-3 justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <h6 className="mb-0 whitelist-deposit-title">
                    Commitment History
                  </h6>
                </div>
                <Tooltip
                  title={
                    <>
                      <div className="d-flex flex-column gap-2">
                        <span className="whitelist-tooltip-content-text">
                          After making a commitment, your status will initially
                          be set to <b>Successful.</b>
                        </span>
                        <span className="whitelist-tooltip-content-text">
                          Once the team reviews your commitment, there are two
                          possible outcomes:
                        </span>
                        <ul>
                          <li className="whitelist-tooltip-content-text mb-2">
                            <b>Approved:</b> You are eligible to receive the WOD
                            token.
                          </li>
                          <li className="whitelist-tooltip-content-text mb-2">
                            <b>Refund:</b> You can withdraw your initial
                            commitment.
                          </li>
                        </ul>
                      </div>
                    </>
                  }
                  enterDelay={0}
                  leaveDelay={2000}
                >
                  <img src={tooltipIcon} alt="" />
                </Tooltip>
              </div>
              <div className="outer-table-wrapper p-3">
                <table
                  border={0}
                  className="table item-history-table"
                  style={{ borderSpacing: "10px" }}
                >
                  <thead className="item-history-table-thead">
                    <th className="item-history-table-th text-center">No.</th>
                    <th className="item-history-table-th text-center">Date</th>
                    <th className="item-history-table-th text-center">
                      Network
                    </th>
                    <th className="item-history-table-th text-center">
                      Wallet
                    </th>
                    <th className="item-history-table-th text-center">
                      Commited
                    </th>
                    <th className="item-history-table-th text-center">
                      WOD Amount
                    </th>
                    <th className="item-history-table-th text-center">
                      Status
                    </th>
                  </thead>
                  <tbody>
                    {allUserCommitments.slice(0, slice).map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="item-history-table-td first-td left-border text-center">
                            #{index + 1}
                          </td>
                          <td className="item-history-table-td text-center">
                            {new Intl.DateTimeFormat("en-GB", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            }).format(item.commitment_list.timestamp * 1000)}
                          </td>
                          <td className="item-history-table-td text-center">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <img
                                src={item.network === "BNB Chain" ? bnb : eth}
                                alt=""
                              />
                              {item.network}
                            </div>
                          </td>
                          <td className="item-history-table-td table-greentext text-center">
                            <a
                              className="table-greentext"
                              href={item.network === "BNB Chain" ? `https://bscscan.com/address/${coinbase}` : `https://etherscan.io/address/${coinbase}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {shortAddress(coinbase)}
                            </a>
                          </td>
                          <td className="item-history-table-td text-center">
                            {getFormattedNumber(
                              item.network === "BNB Chain"
                                ? item.commitment_list.amount / 1e18
                                : item.commitment_list.amount / 1e6,
                              2
                            )}{" "}
                            {item.token}
                          </td>
                          <td className="item-history-table-td right-border text-center">
                            {getFormattedNumber(
                              item.network === "BNB Chain"
                                ? item.commitment_list.amount / 1e18 / 0.0325
                                : item.commitment_list.amount / 1e6 / 0.0325,

                              0
                            )}{" "}
                            WOD
                          </td>
                          <td className="item-history-table-td last-td table-greentext right-border text-center">
                            {/* {item.commitment_list.refunded === true ? (
                              <button className="refund-btn">
                                {item.status}
                              </button>
                            ) : (
                              <> */}
                            {item.commitment_list.accepted === false &&
                            item.commitment_list.refunded === false
                              ? "Successful"
                              : item.commitment_list.accepted === true
                              ? "Approved"
                              : "Refund"}
                            {/* </> */}
                            {/* )} */}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {loading && (
                <div className="d-flex w-100 justify-content-center">
                  <div class="spinner-border text-info" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              {allUserCommitments && allUserCommitments.length > 5 && (
                <div className="d-flex my-3 w-100 align-items-center justify-content-center">
                  <button className="btn filledbtn" onClick={handleViewMore}>
                    {slice >= allUserCommitments.length
                      ? "View Less"
                      : "View More"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Whitelist;
