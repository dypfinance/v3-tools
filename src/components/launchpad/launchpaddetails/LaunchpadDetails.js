import React, { useEffect, useState } from "react";
import "./launchpaddetails.css";
import getFormattedNumber from "../../../functions/get-formatted-number";
import axios from "axios";
import { handleSwitchNetworkhook } from "../../../functions/hooks";
import Web3 from "web3";
import OutsideClickHandler from "react-outside-click-handler";
import { Tooltip } from "@material-ui/core";

const LaunchpadDetails = ({
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
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Midle | Launchpad Details";
  }, []);
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
    "0x11666850EA73956afcd014E86eD2AE473939421d",
    "0x1f5c3f186795c84265eD826AD09924D0987485ba",
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

  const getTotalCommitment = async () => {
    const result = await axios
      .get("https://api.worldofdypians.com/api/latest-commitments/midle")
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
      window.config.commitment_midle_address
    );

    let commitment_contract_eth = new window.infuraWeb3.eth.Contract(
      window.COMMITMENT_ETH_ABI,
      window.config.commitment_midle_eth_address
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
    if (networkId === 56 && isConnected) {
      const result = await window
        .checkapproveStakePool(
          coinbase,
          selectedCoin.address,
          window.config.commitment_midle_address
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
    } else if (networkId === 1 && isConnected) {
      const result = await window
        .checkapproveStakePool(
          coinbase,
          selectedCoin.address,
          window.config.commitment_midle_eth_address
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
    } else setdepositStatus("initial");
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
        window.config.commitment_midle_address
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
        window.config.commitment_midle_eth_address
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
          ? window.config.commitment_midle_address
          : window.config.commitment_midle_eth_address,
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
      if (
        isConnected &&
        (hasDypBalance || hasiDypBalance || hasDypStaked || hasiDypStaked)
      ) {
        const result = Number(depositAmount) + Number(totalDeposited);
        if (result > poolCap) {
          seterrorMsg(
            "Deposit amount is greater than available quota. Please add another amount."
          );
          setCanDeposit(false);
        } else if (depositAmount < 100) {
          setCanDeposit(false);
          seterrorMsg(
            "Minimum deposit amount is 100" + " " + selectedCoin.coin
          );
        } else {
          seterrorMsg("");
          setCanDeposit(true);
        }
      } else {
        seterrorMsg("Buy DYP tokens to become eligible for the whitelist");
        setCanDeposit(false);
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
    <div className="container-lg">
      <div className="row gap-4 gap-lg-0 flex-column-reverse flex-lg-row">
        <div className="col-12 col-lg-7 p-2 p-lg-4 main-details-wrapper position-relative">
          <div
            className="purplediv"
            style={{ left: "0px", background: "#8E97CD" }}
          ></div>
          <div className="position-relative">
            <img
              src="https://cdn.worldofdypians.com/tools/midleDetailsBanner.png"
              alt=""
            />
            {/* <div className="midle-total-commited px-2 py-1 d-flex align-items-center justify-content-center gap-1">
              <span className="midle-commited-span">Commited</span>
              <span className="midle-commited-value">
                ${getFormattedNumber(totalCommitmentValue)}
              </span>
            </div> */}
          </div>
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="d-flex align-items-center gap-2">
              <img
                src="https://cdn.worldofdypians.com/tools/midleLogo.png"
                height={30}
                width={30}
                alt=""
              />
              <span className="launch-details-header">
                Introduction to Midle
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <a href="https://app.midle.io/" target="_blank">
                <img
                  src="https://cdn.worldofdypians.com/tools/detailsWebsite.svg"
                  alt=""
                />
              </a>
              <a href="https://x.com/midle_official" target="_blank">
                <img
                  src="https://cdn.worldofdypians.com/tools/detailsTwitter.svg"
                  alt=""
                />
              </a>
              <a href="https://t.me/midlecommunity" target="_blank">
                <img
                  src="https://cdn.worldofdypians.com/tools/detailsTelegram.svg"
                  alt=""
                />
              </a>
              <a
                href="https://bscscan.com/address/0x7e0d753d44d5A7492d31ffc020c9B0d07c6D05D7"
                target="_blank"
              >
                <img
                  src="https://cdn.worldofdypians.com/tools/detailsPoll.svg"
                  alt=""
                />
              </a>
            </div>
          </div>
          <p className="mt-3 launch-details-content">
            Midle is an all-in-one marketing platform that enhances user
            acquisition, engagement, and retention for both Web2 and Web3
            brands. By implementing a task-to-earn model, it incentivizes users
            to complete various social media and on-chain tasks, rewarding them
            with tokens and NFTs. Brands can create tailored campaigns
            accessible to Midle’s extensive user base across more than 140
            countries, thereby boosting brand awareness and digital presence.
            <br />
            <br />
            The platform’s data-driven approach offers detailed analytics
            through a comprehensive dashboard, enabling brands to monitor
            campaign performance and refine marketing strategies effectively.
            Midle’s anti-bot system ensures genuine user engagement, while its
            gamified clan system fosters competition and loyalty among users.
            Additionally, Midle facilitates the transition from Web2 to Web3 for
            traditional brands, providing seamless access to a diverse and
            engaged audience.
          </p>
          <h6 className="mt-3 launch-subheader">Highlights</h6>
          <ul style={{ listStyle: "disc", margin: "0", paddingLeft: "30px" }}>
            <li className="launch-details-content">
              Partnered with over 350 projects, including Linea, Sei, Scroll,
              Taiko, The Sandbox, CoreDAO, and many more!
            </li>
            <li className="launch-details-content">
              Reached clients and campaigns in more than 140 countries, with
              over 300,000 individual active users.
            </li>
            <li className="launch-details-content">
              Seven free airdrops for stakers are already live!
            </li>
            <li className="launch-details-content">
              Accelerated by CoinTelegraph and Albaraka Garaj.
            </li>
            <li className="launch-details-content">
              Backed by Castrum Capital, Nadmah, GAMI, and NovaClubAI.
            </li>
            <li className="launch-details-content">
              Supported by grants from Microsoft, Google, BNB Chain, Telos, Haqq
              Network, CovalentHQ, and Nibiru Chain.
            </li>
          </ul>
          <h6 className="mt-3 launch-subheader">
            Tokenomics & Token Utilities
          </h6>
          <ul style={{ listStyle: "disc", margin: "0", paddingLeft: "30px" }}>
            <li className="launch-details-content">Token Ticker: $MIDLE</li>
            <li className="launch-details-content">Token Standard: BEP-20</li>
            <li className="launch-details-content">Network: BNB Chain</li>
            <li className="launch-details-content">
              Total Supply: 1,000,000,000
            </li>
            <li className="launch-details-content">
              Fully Diluted Valuation: $10,000,000
            </li>
            <li className="launch-details-content">
              Initial Market Cap Without Liquidity: $261,000
            </li>
            <li className="launch-details-content">
              Initial Market Cap: $561,000
            </li>
          </ul>
          <h6 className="mt-3 launch-subheader">$MIDLE Token Utilities</h6>
          <p className="launch-details-content mt-2">
            <b>B2C Token Utilities</b>
          </p>
          <ul style={{ listStyle: "disc", margin: "0", paddingLeft: "30px" }}>
            <li className="launch-details-content">
              Participate in special campaigns and tasks by staking Midle
              tokens.
            </li>
            <li className="launch-details-content">
              Earn tickets and token rewards based on the amount of staked
              tokens.
            </li>
            <li className="launch-details-content">
              Receive whitelist rewards for token stakers.{" "}
            </li>
            <li className="launch-details-content">
              Access Midle token staking pools with different APRs.
            </li>
            <li className="launch-details-content">
              Join campaigns and tasks, including seasonal ones, based on staked
              amounts.
            </li>
            <li className="launch-details-content">
              Earn bonus tickets (1.5x, 2x, or 3x) based on staking amounts and
              pools.
            </li>
            <li className="launch-details-content">
              Gain whitelist rewards from upcoming projects using Midle tokens.
            </li>
            <li className="launch-details-content">
              Enjoy leaderboard and giveaway rewards with Midle tokens.
            </li>
          </ul>
          <p className="launch-details-content mt-2">
            <b>B2B Token Utilities</b>
          </p>
          <ul style={{ listStyle: "disc", margin: "0", paddingLeft: "30px" }}>
            <li className="launch-details-content">
              Participate in ecosystem groups.
            </li>
            <li className="launch-details-content">
              Access free automated task systems and additional features by
              staking.
            </li>
            <li className="launch-details-content">
              Benefit from Midle token staking pools with varied APRs.
            </li>
            <li className="launch-details-content">
              Use services for free by staking Midle tokens.
            </li>
            <li className="launch-details-content">
              Avail discounts on Midle Point and subscription purchases.
            </li>
          </ul>
          <p className="launch-details-content mt-2">
            <b>Mechanisms</b>
          </p>
          <ul style={{ listStyle: "disc", margin: "0", paddingLeft: "30px" }}>
            <li className="launch-details-content">
              Buyback Mechanism: 30% of project payments are used for token
              buybacks.
            </li>
            <li className="launch-details-content">
              Burn Mechanism: 100 Midle tokens are burned for each new user,
              with burns every three months post-IDO.
            </li>
            <li className="launch-details-content">
              Stake Mechanism: Both B2C and B2B stakers gain access to utilities
              like staking pools, discounts, and campaign participation.
            </li>
          </ul>
        </div>
        <div className="col-12 col-lg-5 px-0 px-lg-2">
          <div className="main-details-wrapper d-flex flex-column justify-content-between p-3 position-relative">
            <div
              className="purplediv"
              style={{ left: "0px", background: "#8E97CD", top: "25px" }}
            ></div>
            <div className="d-flex flex-column flex-lg-row align-items-center align-items-lg-start gap-3 gap-lg-0 justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={"https://cdn.worldofdypians.com/tools/coinStackIcon.svg"}
                  alt=""
                />
                <div className="d-flex flex-column gap-1">
                  <h6 className="launch-details-header">Buy Midle</h6>
                  <span className="details-warning">
                    By depositing one of the supported assets
                  </span>
                </div>
              </div>
              {/* <span className="my-rewards-text d-flex flex-column gap-1">
                Balance:{" "}
                <b>
                  {getFormattedNumber(tokenBalance, 4)} {selectedCoin.coin}
                </b>
              </span> */}
            </div>
            <div className="separator"></div>
            <div className="d-flex flex-column flex-lg-row align-items-center w-100 gap-2">
              <div className="d-flex flex-column gap-1 commitment-deposit-wrapper">
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
                                    icon: `https://cdn.worldofdypians.com/tools/${item.symbol.toLowerCase()}.svg`,
                                    coin: item.symbol,
                                    address: item.address,
                                  });
                                  setCoinDropdown(false);
                                  getUserBalanceForToken(item);
                                  setselectedToken(item);
                                }}
                              >
                                <img
                                  src={`https://cdn.worldofdypians.com/tools/${item.symbol.toLowerCase()}.svg`}
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
                      <img
                        src={
                          "https://cdn.worldofdypians.com/tools/dropArrow.svg"
                        }
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="position-relative coin-input d-flex">
                    <input
                      className="text-input2 commitment-input w-100"
                      style={{
                        height: "39px",
                        borderRadius: "0 8px 8px 0",
                      }}
                      type="text"
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
                      maxLength={10}
                      pattern="[0-9]{4}"
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
              <div className="commitment-chain-midle d-flex flex-column gap-1 ms-0 ms-lg-2">
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
                          <img
                            src={
                              "https://cdn.worldofdypians.com/wod/bnbIcon.svg"
                            }
                            width={20}
                            height={20}
                            alt=""
                          />
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
                          <img
                            src={"https://cdn.worldofdypians.com/wod/eth.svg"}
                            width={20}
                            height={20}
                            alt=""
                          />
                          <span className="whitelist-token-text">Ethereum</span>
                        </div>
                      </div>
                    </OutsideClickHandler>
                  )}
                  <div
                    className="text-input2 gap-1 d-flex align-items-center justify-content-between"
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
                    <img
                      src={"https://cdn.worldofdypians.com/tools/dropArrow.svg"}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* {errorMsg && (
              <h6 className="errormsg mt-2 justify-content-start">
                {errorMsg}
              </h6>
            )} */}
            <div className="d-flex w-100 justify-content-center my-2">
              {/* {isConnected && (networkId === 1 || networkId === 56) ? (
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
                      !hasiDypStaked)
                      ? true
                      : false
                  }
                  className={`btn filledbtn ${
                    ((depositAmount === "" && depositStatus === "initial") ||
                      (!hasDypBalance &&
                        !hasiDypBalance &&
                        !hasDypStaked &&
                        !hasiDypStaked) ||
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
                  <img
                    src={"https://cdn.worldofdypians.com/tools/walletIcon.svg"}
                    alt=""
                  />{" "}
                  Connect wallet
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
              )} */}
            </div>
          </div>

          <div className="d-flex flex-column gap-2">
            <div className="my-commitment-wrapper py-4 w-100 d-flex flex-column align-items-center gap-2 mt-3">
              <h6 className="mb-0 my-commitment-value">
                ${getFormattedNumber(totalDeposited)}
              </h6>
              <span className="my-commitment-span">My Commitment</span>
            </div>
          </div>
          <div className="details-date-wrapper p-3 mt-3">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex flex-column align-items-start">
                  <span className="date-start-span">Start Date</span>
                  <h6 className="mb-0 date-start-value">17 Jan 2025</h6>
                </div>
                <img
                  src="https://cdn.worldofdypians.com/tools/detailsTimer.svg"
                  alt=""
                />
                <div className="d-flex flex-column align-items-end">
                  <span className="date-start-span">End Date</span>
                  <h6 className="mb-0 date-start-value">21 Jan 2025</h6>
                </div>
              </div>
              <div className="whitelist-info-item d-flex flex-column w-100 p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="mb-0 whitelist-deposit-title">Requirements</h6>
                  <Tooltip
                    title={
                      <>
                        <div className="whitelist-tooltip-content-text">
                          You only need to complete one of the requirements to
                          be eligible for the whitelist. Meeting multiple
                          requirements and increasing your holding/staking value
                          will raise your accepted allocation.
                        </div>
                      </>
                    }
                    enterDelay={0}
                    leaveDelay={0}
                  >
                    <img
                      src={
                        "https://cdn.worldofdypians.com/tools/tooltipIcon.svg"
                      }
                      alt=""
                    />
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
                        <img
                          src={
                            "https://cdn.worldofdypians.com/tools/checkIcon.svg"
                          }
                          className="req-check"
                          alt=""
                        />
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
                (hasDypBalance ||
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
                    <img
                      src={"https://cdn.worldofdypians.com/tools/buyToken.svg"}
                      alt=""
                    />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="main-details-wrapper p-3 position-relative mt-3">
            <div
              className="purplediv"
              style={{ left: "0px", background: "#8E97CD", top: "25px" }}
            ></div>
            <div className="d-flex flex-column flex-lg-row align-items-center align-items-lg-start gap-3 gap-lg-0 justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={"https://cdn.worldofdypians.com/tools/coinStackIcon.svg"}
                  alt=""
                />
                <h6 className="launch-details-header">Details</h6>
              </div>
              {/* <button id="dropdown-basic-button2">Connect wallet</button> */}
            </div>
            <div className="separator"></div>
            <div className="launchpad-details-grid">
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Token Distribution</span>
                <h6 className="mb-0 midle-details-value">Private Round</h6>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Token Price</span>
                <h6 className="mb-0 midle-details-value"> $ 0.007</h6>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Cliff</span>
                <h6 className="mb-0 midle-details-value">1 Month</h6>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span d-flex align-items-center gap-2 justify-content-between">
                  Vesting Period{" "}
                  <Tooltip
                    title={
                      <>
                        <div className="whitelist-tooltip-content-text">
                          After 1 month, the vesting ia linear. Means you get
                          tokens unlocked every second for 10 months.
                        </div>
                      </>
                    }
                    enterDelay={0}
                    leaveDelay={0}
                  >
                    <img
                      src={
                        "https://cdn.worldofdypians.com/tools/tooltipIcon.svg"
                      }
                      alt=""
                    />
                  </Tooltip>
                </span>
                <h6 className="mb-0 midle-details-value">10 Months</h6>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">
                Unlocked at TGE
                </span>
                <h6 className="mb-0 midle-details-value">8%</h6>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Network</span>
                <div className="d-flex align-items-center gap-1">
                  <img
                    src={"https://cdn.worldofdypians.com/wod/bnbIcon.svg"}
                    alt=""
                  />
                  <h6 className="mb-0 midle-details-value">BNB Chain</h6>
                </div>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Fully Market Cap</span>
                <h6 className="mb-0 midle-details-value">$ 10,000,000</h6>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Listing Time</span>
                <h6 className="mb-0 midle-details-value">
                  January 22, 1 PM UTC
                </h6>
              </div>
            </div>
            <div className="launchpad-info-divider my-4"></div>
            <div className="d-flex align-items-center gap-2">
              <img
                src={"https://cdn.worldofdypians.com/tools/detailsWarning.svg"}
                alt=""
              />
              <span className="details-warning-text">Important Note</span>
            </div>
            <div className="mt-3 launch-details-content">
              The final allocation will be determined based on the amount of DYP
              you stake or hold, with priority given to stakers. Unlike
              traditional launchpads that offer fixed allocations, our unique
              approach allows users to make deposits without predefined limits.
            </div>
            <div className="mt-3 launch-details-content">
              The final allocation is decided based on overall demand, ensuring
              fairness and rewarding greater participation. The more DYP you
              stake, the larger your allocation will be.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchpadDetails;
