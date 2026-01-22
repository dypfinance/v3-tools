import { useEffect, useState } from "react";
import { ArrowDown, AlertCircle, Clock, HelpCircle } from "lucide-react";
import Tooltip from "@material-ui/core/Tooltip";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "../migration.scss";
import getFormattedNumber from "../../../functions/get-formatted-number";
import Web3 from "web3";
import { handleSwitchNetworkhook } from "../../../functions/hooks";

const TOKEN_RATES = {
  DYP: 0.004,
  iDYP: 0.00008,
};

const SNAPSHOT_DATE = new Date("2026-02-23T00:00:00Z");

export function MigrationPortal({
  coinbase,
  networkId,
  isConnected,
  handleConnection,
  binanceW3WProvider,
  handleSwitchChainBinanceWallet,
  handleSwitchNetwork,
}) {
  const [selectedToken, setSelectedToken] = useState("DYP");
  const [selectedChain, setSelectedChain] = useState({
    name: "Ethereum",
    chainId: 1,
  });
  const [amount, setAmount] = useState("");
  const [depositLoading, setdepositLoading] = useState(false);
  const [depositStatus, setdepositStatus] = useState("initial");
  const [claimLoading, setclaimLoading] = useState(false);
  const [claimStatus, setclaimStatus] = useState("initial");

  const [dypDeposits, setDypDeposits] = useState({
    bnb: { amount: 0, count: 0 },
    eth: { amount: 0, count: 0 },
    avax: { amount: 0, count: 0 },
    opbnb: { amount: 0, count: 0 },
    base: { amount: 0, count: 0 },
  });

  const [idypDeposits, setIdypDeposits] = useState({
    bnb: { amount: 0, count: 0 },
    eth: { amount: 0, count: 0 },
    avax: { amount: 0, count: 0 },
  });

  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenAddress, setTokenAddress] = useState(
    window.config.token_dypius_new_address,
  );
  const [errorMsg, seterrorMsg] = useState("");
  const [errorMsg2, seterrorMsg2] = useState("");

  const now = new Date();
  const daysUntilSnapshot = Math.ceil(
    (SNAPSHOT_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const isBeforeSnapshot = now < SNAPSHOT_DATE;

  const handleChangeNetwork = async (chainId) => {
    let hexChainId = "0x" + chainId.toString(16);

    await handleSwitchNetworkhook(hexChainId)
      .then(() => {
        handleSwitchNetwork(chainId.toString());
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getTokenBalance = async (token, sourceChain) => {
    if (!coinbase) return;
    const tokenAddress = window.config.token_dypius_new_address;
    const tokenAddress_bsc = window.config.token_dypius_new_bsc_address;
    const tokenAddress_avax = window.config.token_dypius_new_avax_address;
    const tokenAddress_opbnb = window.config.token_dypius_new_opbnb_address;
    if (token === "DYP") {
      if (sourceChain === "eth") {
        const token_contract_eth = new window.infuraWeb3.eth.Contract(
          window.TOKEN_ABI,
          tokenAddress,
        );
        await token_contract_eth.methods
          .balanceOf(coinbase)
          .call()
          .then((data) => {
            setTokenBalance(data);
          })
          .catch((e) => {
            console.error(e);
            return 0;
          });
      } else if (sourceChain === "bnb") {
        const token_contract_bsc = new window.bscWeb3.eth.Contract(
          window.TOKENBSC_ABI,
          tokenAddress_bsc,
        );
        await token_contract_bsc.methods
          .balanceOf(coinbase)
          .call()
          .then((data) => {
            setTokenBalance(data);
          })
          .catch((e) => {
            console.error(e);
            return 0;
          });
      } else if (sourceChain === "opbnb") {
        const token_contract_opbnb = new window.opbnbWeb3.eth.Contract(
          window.TOKENBSC_ABI,
          tokenAddress_opbnb,
        );
        await token_contract_opbnb.methods
          .balanceOf(coinbase)
          .call()
          .then((data) => {
            setTokenBalance(data);
          })
          .catch((e) => {
            console.error(e);
            return 0;
          });
      } else if (sourceChain === "avax") {
        const token_contract_avax = new window.avaxWeb3.eth.Contract(
          window.TOKENAVAX_ABI,
          tokenAddress_avax,
        );
        await token_contract_avax.methods
          .balanceOf(coinbase)
          .call()
          .then((data) => {
            setTokenBalance(data);
          })
          .catch((e) => {
            console.error(e);
            return 0;
          });
      }
    } else if (token === "iDYP") {
      const tokenAddress = window.config.token_idyp_eth_address;

      if (sourceChain === "eth") {
        const token_contract_eth = new window.infuraWeb3.eth.Contract(
          window.TOKEN_ABI,
          tokenAddress,
        );
        await token_contract_eth.methods
          .balanceOf(coinbase)
          .call()
          .then((data) => {
            setTokenBalance(data);
          })
          .catch((e) => {
            console.error(e);
            return 0;
          });
      } else if (sourceChain === "bnb") {
        const token_contract_bsc = new window.bscWeb3.eth.Contract(
          window.TOKENBSC_ABI,
          tokenAddress,
        );
        await token_contract_bsc.methods
          .balanceOf(coinbase)
          .call()
          .then((data) => {
            setTokenBalance(data);
          })
          .catch((e) => {
            console.error(e);
            return 0;
          });
      } else if (sourceChain === "avax") {
        const token_contract_avax = new window.avaxWeb3.eth.Contract(
          window.TOKENAVAX_ABI,
          tokenAddress,
        );
        await token_contract_avax.methods
          .balanceOf(coinbase)
          .call()
          .then((data) => {
            setTokenBalance(data);
          })
          .catch((e) => {
            console.error(e);
            return 0;
          });
      }
    }
  };

  const calculateValue = () => {
    if (!amount || isNaN(parseFloat(amount))) return "0.00";
    const rate = isBeforeSnapshot
      ? TOKEN_RATES[selectedToken]
      : TOKEN_RATES[selectedToken] / 4.5;
    return (parseFloat(amount) * rate).toFixed(6);
  };

  const handleDeposit = async () => {
    setdepositLoading(true);
    window.web3 = new Web3(window.ethereum);
    let contract = new window.web3.eth.Contract(
      window.MIGRATIONBNB_ABI,
      window.config.migrationbnb_address,
    );
    let amount2 = window.web3.utils.toWei(amount.toString(), "ether");
    await contract.methods
      .deposit(tokenAddress, amount2, networkId)
      .send({ from: coinbase, maxPriorityFeePerGas: null, maxFeePerGas: null })
      .then(() => {
        setdepositLoading(false);
        setdepositStatus("success");
        getTokenBalance(
          selectedToken,
          selectedChain.name === "Ethereum"
            ? "eth"
            : selectedChain.name === "BNB Chain"
              ? "bnb"
              : selectedChain.name === "opBNB Chain"
                ? "opbnb"
                : "avax",
        );
        getAllDepositsByUser();
        setTimeout(() => {
          setAmount("");
          setdepositStatus("initial");
          seterrorMsg("");
        }, 5000);
      })
      .catch((e) => {
        setdepositLoading(false);
        setdepositStatus("fail");
        seterrorMsg(e?.message);
        setTimeout(() => {
          setAmount("");
          setdepositStatus("initial");
          seterrorMsg("");
        }, 5000);
      });
  };
  const handleApprove = async () => {
    setdepositLoading(true);
    window.web3 = new Web3(window.ethereum);
    let contract = new window.web3.eth.Contract(window.TOKEN_ABI, tokenAddress);
    console.log(
      tokenAddress,
      coinbase,
      window.web3.utils.toWei(amount.toString(), "ether"),
    );
    await contract.methods
      .approve(
        window.config.migrationbnb_address,
        window.web3.utils.toWei(amount.toString(), "ether"),
      )
      .send({ from: coinbase, maxPriorityFeePerGas: null, maxFeePerGas: null })
      .then(() => {
        setdepositLoading(false);
        setdepositStatus("deposit");
      })
      .catch((e) => {
        setdepositLoading(false);
        setdepositStatus("fail");
        seterrorMsg(e?.message);
        setTimeout(() => {
          setAmount("");
          setdepositStatus("initial");
          seterrorMsg("");
        }, 10000);
      });
  };

  const handleClaim = async () => {
    setclaimLoading(true);
    window.web3 = new Web3(window.ethereum);
    let contract = new window.web3.eth.Contract(
      window.MIGRATIONBNB_ABI,
      window.config.migrationbnb_address,
    );

    await contract.methods
      .claim()
      .send({ from: coinbase })
      .then(() => {
        setclaimStatus("success");
        setclaimLoading(false);
        getTokenBalance();
        setTimeout(() => {
          setclaimStatus("initial");
          seterrorMsg2("");
        }, 6000);
      })
      .catch((e) => {
        setclaimStatus("failed");
        setclaimLoading(false);
        seterrorMsg2(e?.message);
        setTimeout(() => {
          setclaimStatus("initial");
          seterrorMsg2("");
        }, 6000);
      });
  };

  const getAllDepositsByUser = async () => {
    if (!coinbase) return;
    let contract_eth = new window.infuraWeb3.eth.Contract(
      window.MIGRATIONBNB_ABI,
      window.config.migrationeth_address,
    );
    let contract_bnb = new window.bscWeb3.eth.Contract(
      window.MIGRATIONBNB_ABI,
      window.config.migrationbnb_address,
    );
    let contract_opbnb = new window.opbnbWeb3.eth.Contract(
      window.MIGRATIONBNB_ABI,
      window.config.migrationopbnb_address,
    );
    let contract_avax = new window.avaxWeb3.eth.Contract(
      window.MIGRATIONBNB_ABI,
      window.config.migrationavax_address,
    );
    let contract_base = new window.baseWeb3.eth.Contract(
      window.MIGRATIONBNB_ABI,
      window.config.migrationbase_address,
    );

    // Fetch DYP deposits for all chains
    const depositCounts_dyp_bnb = await contract_bnb.methods
      .depositsCount(coinbase)
      .call()
      .catch((e) => {
        console.error(e);
        return 0;
      });

    let dypAmountBNB = await contract_bnb.methods
      .totalDepositedByToken(
        coinbase,
        window.config.token_dypius_new_bsc_address,
      )
      .call()
      .catch((e) => {
        return 0;
      });
    let dypAmountFormatted = Web3.utils.fromWei(
      dypAmountBNB.toString(),
      "ether",
    );

    setDypDeposits((prev) => ({
      ...prev,
      bnb: {
        amount: Number(dypAmountFormatted),
        count: Number(depositCounts_dyp_bnb),
      },
    }));
  };

  useEffect(() => {
    getTokenBalance(
      selectedToken,
      selectedChain.name === "Ethereum"
        ? "eth"
        : selectedChain.name === "BNB Chain"
          ? "bnb"
          : selectedChain.name === "opBNB Chain"
            ? "opbnb"
            : "avax",
    );
  }, [selectedToken, selectedChain, coinbase]);

  useEffect(() => {
    if (selectedToken === "DYP") {
      if (selectedChain.name === "Ethereum") {
        setTokenAddress(window.config.token_dypius_new_address);
      } else if (selectedChain.name === "BNB Chain") {
        setTokenAddress(window.config.token_dypius_new_bsc_address);
      } else if (selectedChain.name === "opBNB Chain") {
        setTokenAddress(window.config.token_dypius_new_opbnb_address);
      } else if (selectedChain.name === "Avalanche") {
        setTokenAddress(window.config.token_dypius_new_avax_address);
      }
    } else if (selectedToken === "iDYP") {
      setTokenAddress(window.config.token_idyp_eth_address);
    }
  }, [selectedToken, selectedChain]);

  useEffect(() => {
    getAllDepositsByUser();
  }, [coinbase]);

  return (
    <div className="space-y-5 d-flex flex-lg-row flex-column justify-content-between gap-4">
      <div className="w-100 d-flex flex-column gap-4">
        {/* Rate Warning Banner */}
        {isBeforeSnapshot ? (
          <div className="bg-[#3d3e6f]/60 backdrop-blur-sm bordertw border-[#5a5b8c] rounded-xl p-4">
            <div className="flex items-start gap-3">
              {/* <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" /> */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">
                    Premium Rate - {daysUntilSnapshot} days remaining
                  </h3>
                  <Tooltip
                    placement="top"
                    title={
                      <div className="tooltip-text">
                        <div className="space-y-2">
                          <p className="font-semibold">
                            Snapshot: Feb 23, 2026 at 00:00 UTC
                          </p>
                          <p className="text-xs">
                            • Only tokens held at snapshot time are eligible
                          </p>
                          <p className="text-xs">
                            • Keep tokens in the same wallet after snapshot
                          </p>
                          <p className="text-xs">
                            • Tokens purchased/moved after snapshot are NOT
                            eligible
                          </p>
                          <p className="text-xs">
                            • After snapshot: standard rate applies (4-5x lower)
                          </p>
                        </div>
                      </div>
                    }
                  >
                    <HelpCircle className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                  </Tooltip>
                </div>
                <p className="text-gray-300 text-sm">
                  Current favorable rates available until February 23, 2026.
                  After the snapshot, standard rates will be 4-5x lower.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#3d3e6f]/60 backdrop-blur-sm bordertw border-[#5a5b8c] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">
                    Standard Rate Active
                  </h3>
                  <Tooltip
                    placement="top"
                    title={
                      <div className="tooltip-text">
                        <div className="space-y-2">
                          <p className="text-xs">
                            You can still migrate if you:
                          </p>
                          <p className="text-xs">
                            • Held tokens at snapshot time (Feb 23, 2026 00:00
                            UTC)
                          </p>
                          <p className="text-xs">
                            • Kept them in the same wallet
                          </p>
                          <p className="text-xs">
                            Current rate is based on 30-day average (4-5x lower
                            than premium)
                          </p>
                        </div>
                      </div>
                    }
                  >
                    <img
                      src={"https://cdn.worldofdypians.com/tools/more-info.svg"}
                      alt=""
                    />
                  </Tooltip>
                </div>
                <p className="text-gray-300 text-sm">
                  The snapshot has been taken. You can still migrate if you held
                  eligible tokens at snapshot time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Migration Card */}
        <div className="bg-[#2a2b5e]/80 backdrop-blur-sm bordertw border-[#5a5b8c] rounded-xl p-6">
          <div className="d-flex flex-lg-row flex-column align-items-lg-center align-items-start gap-2">
            {/* Token Selection */}
            <div className="mb-lg-6 mb-2 w-100">
              <label className="text-gray-300 text-sm mb-3 block">
                Select Token
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedToken("DYP")}
                  className={`px-3 py-2 rounded-lg bordertw transition-all h-12 ${
                    selectedToken === "DYP"
                      ? "border-[#4ed5d2] bg-[#7c7df5]/10"
                      : "border-[#5a5b8c] bg-[#3d3e6f]/40 hover:border-[#4ed5d2]/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src="https://cdn.worldofdypians.com/tools/dyplogo.svg"
                        className="w-6 h-6"
                        alt=""
                      />

                      <div className="text-white font-semibold text-sm">
                        DYP
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {isBeforeSnapshot
                        ? `$${TOKEN_RATES.DYP}`
                        : `$${(TOKEN_RATES.DYP / 4.5).toFixed(6)}`}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedToken("iDYP")}
                  className={`px-3 py-2 rounded-lg bordertw transition-all h-12 ${
                    selectedToken === "iDYP"
                      ? "border-[#4ed5d2] bg-[#7c7df5]/10"
                      : "border-[#5a5b8c] bg-[#3d3e6f]/40 hover:border-[#4ed5d2]/50"
                  }`}
                >
                  <div className="flex items-center justify-content-between gap-2 mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src="https://cdn.worldofdypians.com/tools/idyp2.png"
                        className="w-6 h-6"
                        alt=""
                      />
                      <div className="text-white font-semibold text-sm">
                        iDYP
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {isBeforeSnapshot
                        ? `$${TOKEN_RATES.iDYP}`
                        : `$${(TOKEN_RATES.iDYP / 4.5).toFixed(8)}`}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Chain Selection */}
            <div className="mb-lg-6 mb-2 col-lg-3 col-12 px-0">
              <label className="text-gray-300 text-sm mb-3 block">
                Select Chain
              </label>
              <DropdownButton
                id="dropdown-basic-button-migration"
                className="w-100 d-flex align-items-center justify-content-center h-12"
                title={
                  <span className="dropdown-title justify-content-between w-100 d-flex align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={
                          selectedChain.name === "Ethereum"
                            ? "https://cdn.worldofdypians.com/wod/eth.svg"
                            : selectedChain.name === "BNB Chain" ||
                                selectedChain.name === "opBNB Chain"
                              ? "https://cdn.worldofdypians.com/wod/bnbIcon.svg"
                              : selectedChain.name === "Avalanche"
                                ? "https://cdn.worldofdypians.com/wod/avaxIcon.svg"
                                : "https://cdn.worldofdypians.com/wod/base.svg"
                        }
                        height={16}
                        width={16}
                        alt=""
                      />
                      <span className="change-chain-text d-flex">
                        {selectedChain.name}
                      </span>
                    </div>
                    <img
                      src={"https://cdn.worldofdypians.com/wod/dropdown.svg"}
                      alt=""
                    />
                  </span>
                }
              >
                <Dropdown.Item
                  onClick={() =>
                    setSelectedChain({ name: "Ethereum", chainId: 1 })
                  }
                >
                  <img
                    src={"https://cdn.worldofdypians.com/wod/eth.svg"}
                    alt=""
                    height={20}
                    width={20}
                  />
                  Ethereum
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    setSelectedChain({ name: "BNB Chain", chainId: 56 })
                  }
                >
                  <img
                    src={"https://cdn.worldofdypians.com/wod/bnbIcon.svg"}
                    alt=""
                    height={20}
                    width={20}
                  />
                  BNB Chain
                </Dropdown.Item>
                {selectedToken === "DYP" && (
                  <Dropdown.Item
                    onClick={() =>
                      setSelectedChain({ name: "opBNB Chain", chainId: 204 })
                    }
                  >
                    <img
                      src={"https://cdn.worldofdypians.com/wod/bnbIcon.svg"}
                      alt=""
                      height={20}
                      width={20}
                    />
                    opBNB Chain
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  onClick={() =>
                    setSelectedChain({ name: "Avalanche", chainId: 43114 })
                  }
                >
                  <img
                    src={"https://cdn.worldofdypians.com/wod/avaxIcon.svg"}
                    alt=""
                    height={20}
                    width={20}
                  />
                  Avalanche
                </Dropdown.Item>
                {selectedToken === "DYP" && (
                  <Dropdown.Item
                    onClick={() =>
                      setSelectedChain({ name: "Base", chainId: 8453 })
                    }
                  >
                    <img
                      src={"https://cdn.worldofdypians.com/wod/base.svg"}
                      alt=""
                      height={20}
                      width={20}
                    />
                    Base
                  </Dropdown.Item>
                )}
              </DropdownButton>
            </div>
          </div>
          {/* Amount Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-gray-300 text-sm">Amount</label>
              <span className="text-gray-400 text-sm">
                Balance: {getFormattedNumber(tokenBalance / 1e18)}{" "}
                {selectedToken}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#312f69] bordertw border-[#5a5b8c] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7c7df5] transition-colors"
              />
              <button
                onClick={() => {
                  setAmount(tokenBalance / 1e18);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#7c7df5] hover:bg-[#6b6ce5] text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-4">
            <div className="bg-[#3d3e6f] bordertw border-[#5a5b8c] rounded-full p-2">
              <ArrowDown className="w-5 h-5 text-[#7c7df5]" />
            </div>
          </div>

          {/* Value Output */}
          <div className="mb-6">
            <label className="text-gray-300 text-sm mb-3 block">
              Estimated Value (USD)
            </label>
            <div className="bg-[#1e1f3f] bordertw border-[#5a5b8c] rounded-xl px-4 py-3">
              <div className="text-white font-semibold">
                ${calculateValue()}
              </div>
              {!isBeforeSnapshot && (
                <div className="text-amber-400 text-xs mt-1">
                  Standard rate applied
                </div>
              )}
            </div>
          </div>

          {/* Rate Info */}
          <div className="bg-[#3d3e6f]/50 bordertw border-[#5a5b8c] rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Current Rate</span>
              <span className="text-white font-medium">
                1 {selectedToken} = $
                {isBeforeSnapshot
                  ? TOKEN_RATES[selectedToken]
                  : (TOKEN_RATES[selectedToken] / 4.5).toFixed(8)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rate Type</span>
              <span
                className={`font-medium ${isBeforeSnapshot ? "text-amber-400" : "text-blue-400"}`}
              >
                {isBeforeSnapshot ? "Premium" : "Standard"}
              </span>
            </div>
          </div>

          {/* Deposit Button */}
          {isConnected && coinbase && networkId === selectedChain.chainId && (
            <button
              onClick={() => {
                depositStatus === "deposit"
                  ? handleDeposit()
                  : depositStatus === "initial" && amount !== ""
                    ? handleApprove()
                    : console.log("");
              }}
              disabled={!amount || parseFloat(amount) <= 0 || depositLoading}
              className="w-full bg-gradient-to-r from-[#7c7df5] to-[#5a5bf5] hover:from-[#6b6ce5] hover:to-[#4a4be5] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3.5 rounded-xl transition-all shadow-lg shadow-[#7c7df5]/20"
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
          )}
          {isConnected && coinbase && networkId !== selectedChain.chainId && (
            <button
              onClick={() => {
                handleChangeNetwork(selectedChain.chainId);
              }}
              className="w-full fail-button hover:from-[#6b6ce5] hover:to-[#4a4be5] text-white py-3.5 rounded-xl transition-all shadow-lg shadow-[#7c7df5]/20"
            >
              Switch Network to {selectedChain.name}
            </button>
          )}
          {!isConnected && (
            <button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 m-auto w-full py-3.5 rounded-xl text-white"
              onClick={handleConnection}
            >
              Connect wallet
            </button>
          )}
        </div>
      </div>
      {/* Deposit History - Aggregated */}

      <div className="w-100 bg-[#2a2b5e]/80 backdrop-blur-sm bordertw border-[#5a5b8c] rounded-xl h-fit p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          {/* <Clock className="w-5 h-5 text-[#7c7df5]" /> */}
          My Deposits
        </h2>
        <div className="space-y-3">
          {/* DYP Aggregate */}
          {/* {deposits.filter((d) => d.token === "DYP").length > 0 && ( */}
          <div className="bg-[#1e1f3f]/60 rounded-xl p-4 bordertw border-[#5a5b8c]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="https://cdn.worldofdypians.com/tools/dyplogo.svg"
                    className="w-6 h-6"
                    alt=""
                  />
                  <div className="text-white font-semibold">DYP</div>
                </div>
                <div className="text-gray-400 text-sm">
                  Total:{" "}
                  {getFormattedNumber(
                    Object.values(dypDeposits).reduce(
                      (sum, chain) => sum + chain.amount,
                      0,
                    ),
                    2,
                  )}{" "}
                  DYP
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {Object.values(dypDeposits).reduce(
                    (sum, chain) => sum + chain.count,
                    0,
                  )}{" "}
                  deposit
                  {Object.values(dypDeposits).reduce(
                    (sum, chain) => sum + chain.count,
                    0,
                  ) > 1
                    ? "s"
                    : ""}
                </div>
              </div>
              {Object.values(dypDeposits).reduce(
                (sum, chain) => sum + chain.amount,
                0,
              ) > 0 && (
                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-lg bordertw border-amber-500/30">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">
                    Pending
                  </span>
                </div>
              )}
            </div>
            {Object.values(dypDeposits).reduce(
              (sum, chain) => sum + chain.amount,
              0,
            ) > 0 && (
              <div className="text-gray-300 text-sm bg-[#3d3e6f]/50 bordertw border-[#5a5b8c] rounded-lg p-3">
                Migration in progress. Check back later for distribution status.
              </div>
            )}
          </div>
          {/* )} */}

          {/* iDYP Aggregate */}
          {/* {deposits.filter((d) => d.token === "iDYP").length > 0 && ( */}
          <div className="bg-[#1e1f3f]/60 rounded-xl p-4 bordertw border-[#5a5b8c]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="https://cdn.worldofdypians.com/tools/idyp2.png"
                    className="w-6 h-6"
                    alt=""
                  />
                  <div className="text-white font-semibold">iDYP</div>
                </div>
                <div className="text-gray-400 text-sm">
                  Total:{" "}
                  {getFormattedNumber(
                    Object.values(idypDeposits).reduce(
                      (sum, chain) => sum + chain.amount,
                      0,
                    ),
                    2,
                  )}{" "}
                  iDYP
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {Object.values(idypDeposits).reduce(
                    (sum, chain) => sum + chain.count,
                    0,
                  )}{" "}
                  deposit
                  {Object.values(idypDeposits).reduce(
                    (sum, chain) => sum + chain.count,
                    0,
                  ) > 1
                    ? "s"
                    : ""}
                </div>
              </div>
              {Object.values(idypDeposits).reduce(
                (sum, chain) => sum + chain.amount,
                0,
              ) > 0 && (
                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-lg bordertw border-amber-500/30">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">
                    Pending
                  </span>
                </div>
              )}
            </div>
            {Object.values(idypDeposits).reduce(
              (sum, chain) => sum + chain.amount,
              0,
            ) > 0 && (
              <div className="text-gray-300 text-sm bg-[#3d3e6f]/50 bordertw border-[#5a5b8c] rounded-lg p-3">
                Migration in progress. Check back later for distribution status.
              </div>
            )}
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
