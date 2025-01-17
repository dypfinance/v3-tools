import React, { useState, useEffect } from "react";
import "./whitelist.css";
import { Tooltip } from "@material-ui/core";
import { handleSwitchNetworkhook } from "../../functions/hooks";
import Web3 from "web3";
import axios from "axios";
import { shortAddress } from "../../functions/shortAddress";
import getFormattedNumber from "../../functions/get-formatted-number";
import KeyFeaturesCard from "../launchpad/launchpadhero/KeyFeaturesCard";
import "../launchpad/launchpadhero/launchpadhero.css";
import LaunchpadDetails from "../launchpad/launchpaddetails/LaunchpadDetails";
import LaunchpadProjects from "../launchpad/launchpadprojects/LaunchpadProjects";
import { useNavigate } from "react-router-dom";

const LaunchpadMidle = ({
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
    icon: "https://cdn.worldofdypians.com/tools/usdt.svg",
    address: "",
  });
  const [selectedChain, setSelectedChain] = useState({
    chain: "BNB Chain",
    icon: "https://cdn.worldofdypians.com/wod/bnbIcon.svg",
  });

  const keyFeatures = [
    {
      icon: "firstKeyIcon",
      content: "Project mission, outline, detailed reports and more",
    },
    {
      icon: "secondKeyIcon",
      content: "Multiple tiers depending on the amount of locked DYP",
    },
    {
      icon: "thirdKeyIcon",
      content: "Varied max token buy available at different tiers",
    },
    {
      icon: "fourthKeyIcon",
      content: "Increase tier by depositing assets to Launchpools",
    },
  ];

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
  const [totalCommitmentValue, settotalCommitmentValue] = useState(0);

  const [allUserCommitments, setAllUserCommitments] = useState([]);
  let expireDay = new Date("2024-10-16T14:00:00.000+02:00");

  const poolCap = 20000;

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
    "0xFdD3CFF22CF846208E3B37b47Bc36b2c61D2cA8b",
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

  const getTotalCommitment = async () => {
    const result = await axios
      .get("https://api.worldofdypians.com/api/latest-commitments")
      .catch((e) => {
        console.error(e);
        return 0;
      });

    if (result && result.status === 200) {
      const total = result.data.total;
      settotalCommitmentValue(total);
    }
  };

  const requirements = [
    {
      icon: "https://cdn.worldofdypians.com/tools/dyplogo.svg",
      coin: "DYP Token",
      value: "Holder/Staker",
      active: hasDypStaked || hasDypBalance,
    },
    {
      icon: "https://cdn.worldofdypians.com/tools/idypius.svg",
      coin: "iDYP Token",
      value: "Holder/Staker",
      active: hasiDypStaked || hasiDypBalance,
    },
    {
      icon: "https://cdn.worldofdypians.com/tools/premium.png",
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

  const navigate = useNavigate();

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
        icon: "https://cdn.worldofdypians.com/wod/eth.svg",
        chain: "Ethereum",
      });
      setSelectedCoin({
        icon: `https://cdn.worldofdypians.com/tools/${window.config.commitmenteth_tokens[0].symbol.toLowerCase()}.svg`,
        coin: window.config.commitmenteth_tokens[0].symbol,
        address: window.config.commitmenteth_tokens[0].address,
      });
      getUserBalanceForToken(window.config.commitmenteth_tokens[0]);
      setselectedToken(window.config.commitmenteth_tokens[0]);
    } else if (networkId === 56) {
      setSelectedChain({
        icon: "https://cdn.worldofdypians.com/wod/bnbIcon.svg",
        chain: "BNB Chain",
      });

      setSelectedCoin({
        icon: `https://cdn.worldofdypians.com/tools/${window.config.commitmentbnb_tokens[0].symbol.toLowerCase()}.svg`,
        coin: window.config.commitmentbnb_tokens[0].symbol,
        address: window.config.commitmentbnb_tokens[0].address,
      });
      getUserBalanceForToken(window.config.commitmentbnb_tokens[0]);
      setselectedToken(window.config.commitmentbnb_tokens[0]);
    } else {
      setSelectedChain({
        icon: "https://cdn.worldofdypians.com/wod/eth.svg",
        chain: "Ethereum",
      });

      setSelectedCoin({
        icon: `https://cdn.worldofdypians.com/tools/${window.config.commitmenteth_tokens[0].symbol.toLowerCase()}.svg`,
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

  useEffect(() => {
    getTotalCommitment();
  }, []);

  return (
    <div className="container-lg p-0">
      <div className="launchpad-rocket-banner d-flex flex-column flex-lg-row p-4 gap-3 gap-lg-0 align-items-center mb-4">
        <div className="col-12 col-lg-5">
          <div className="d-flex flex-column gap-3">
            <h6 className="migration-banner-title mb-0">
              Where Visionaries Meet Early Backers
            </h6>
            <p className="migration-banner-desc mb-0">
              Your exclusive platform to discover and invest in the most
              promising Web3 projects. Empower emerging blockchain innovators
              while gaining early access to potential industry leaders.
            </p>
          </div>
        </div>
      </div>

      <div className="features-wrapper d-flex align-items-center justify-content-between my-5 flex-column flex-lg-row gap-3 gap-lg-0">
        {keyFeatures.map((item) => (
          <KeyFeaturesCard icon={item.icon} content={item.content} />
        ))}
      </div>
      <LaunchpadProjects />
      <h6 className="launchpad-hero-title mb-4 mt-3">Past Deals</h6>
      <div className="row mt-4">
        <div className="col-12">
          <div className="whitelist-info-item-2 d-flex flex-column gap-3">
            <div className="outer-table-wrapper p-3">
              <table
                border={0}
                className="table item-history-table"
                style={{ borderSpacing: "10px" }}
              >
                <thead className="item-history-table-thead">
                  <th className="item-history-table-th text-center">Project</th>
                  <th className="item-history-table-th text-center">Type</th>
                  <th className="item-history-table-th text-center">Network</th>
                  <th className="item-history-table-th text-center">
                    Commited
                  </th>
                  <th className="item-history-table-th text-center">ATH</th>
                  <th className="item-history-table-th text-center">Ended</th>
                  <th className="item-history-table-th text-center"></th>
                </thead>
                <tbody>
                  <tr
                    onClick={() => navigate("/launchpad/worldofdypians")}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="item-history-table-td first-td left-border text-center">
                      <div className="d-flex align-items-center gap-1">
                        <img
                          src={
                            "https://cdn.worldofdypians.com/tools/squareWod.svg"
                          }
                          alt=""
                        />
                        <div className="d-flex flex-column align-items-start">
                          World of Dypians
                          <span style={{ color: "#828FBB" }}>WOD</span>
                        </div>
                      </div>
                    </td>
                    <td className="item-history-table-td text-center">
                      Private Sale
                    </td>
                    <td className="item-history-table-td text-center">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <img
                          src={"https://cdn.worldofdypians.com/wod/bnbIcon.svg"}
                          alt=""
                        />
                        BNB Chain
                      </div>
                    </td>
                    <td className="item-history-table-td table-greentext text-center">
                      ${getFormattedNumber(totalCommitmentValue,0)}
                    </td>
                    <td className="item-history-table-td text-center">5.4x</td>
                    <td className="item-history-table-td right-border text-center">
                      24 November 2024
                    </td>
                    <td className="item-history-table-td last-td table-greentext right-border text-center">
                      <div className="right-arrow-holder">
                        <img
                          src={
                            "https://cdn.worldofdypians.com/tools/rightlogo.svg"
                          }
                          alt=""
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* {loading && (
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
            )} */}
          </div>
        </div>
      </div>

      {/* <LaunchpadDetails /> */}
    </div>
  );
};

export default LaunchpadMidle;
