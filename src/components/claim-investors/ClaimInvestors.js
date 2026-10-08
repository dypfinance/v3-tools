import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import Dropdown from "react-bootstrap/Dropdown";
import { handleSwitchNetworkhook } from "../../functions/hooks";
import "./claimInvestors.scss";

const CHAINS = {
  56: {
    name: "BNB Chain",
    icon: "https://cdn.worldofdypians.com/wod/bnbIcon.svg",
    explorer: "https://bscscan.com/tx/",
  },
  8453: {
    name: "Base",
    icon: "https://cdn.worldofdypians.com/wod/base.svg",
    explorer: "https://basescan.org/tx/",
  },
};

// ponytail: static values from the design, wire to the vesting contract when its ABI/address is available
const vesting = {
  total: 25000,
  claimed: 4375,
  claimable: 1875,
  unlockedPercent: 25,
  tgePercent: 10,
  cliffMonths: 3,
  cliffEnd: "Sep 7",
  vestingMonths: 12,
  vestingActive: true,
  fullyVested: "Aug 7, 2027",
};

const history = [
  { date: "Sep 7, 2026", type: "Monthly Unlock", chainId: 56, amount: 1875, tx: "0x3c7e000000000000000000000000000000000000000000000000000000a52d" },
  { date: "Jun 7, 2026", type: "TGE Unlock", chainId: 56, amount: 2500, tx: "0x8f2a0000000000000000000000000000000000000000000000000000000091c4" },
];

const usd = (n) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const short = (hash) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;

const ChainLabel = ({ chainId, size = 16 }) => (
  <span className="d-flex align-items-center gap-2">
    <img src={CHAINS[chainId].icon} width={size} height={size} alt="" />
    {CHAINS[chainId].name}
  </span>
);

const ClaimInvestors = ({
  isConnected,
  handleConnection,
  coinbase,
  networkId,
  handleSwitchNetwork,
}) => {
  const [selectedChainId, setSelectedChainId] = useState(
    CHAINS[networkId] ? networkId : 56
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // follow the wallet when it moves to one of the supported chains
  useEffect(() => {
    if (CHAINS[networkId]) setSelectedChainId(networkId);
  }, [networkId]);

  // same flow as the migration portal
  const handleChangeNetwork = async (chainId) => {
    if (window.ethereum) {
      if (!window.gatewallet && window.WALLET_TYPE !== "binance") {
        await handleSwitchNetworkhook("0x" + chainId.toString(16))
          .then(() => handleSwitchNetwork(chainId.toString()))
          .catch((e) => console.log(e));
      } else if (coinbase && window.WALLET_TYPE === "binance") {
        handleSwitchNetwork(chainId.toString());
      }
    } else if (coinbase && window.WALLET_TYPE === "binance") {
      handleSwitchNetwork(chainId.toString());
    } else {
      window.alertify.error("No web3 detected. Please install Metamask!");
    }
  };

  const selectChain = (chainId) => {
    setSelectedChainId(chainId);
    if (isConnected && coinbase && networkId !== chainId) {
      handleChangeNetwork(chainId);
    }
  };

  const connected = isConnected && coinbase;
  const onSelectedChain = networkId === selectedChainId;
  const remaining = vesting.total - vesting.claimed;
  const unlocked = (vesting.total * vesting.unlockedPercent) / 100;

  return (
    <div className="container-lg p-0 claim-investors">
      <div className="d-flex flex-column gap-1 mb-4">
        <h2 className="ci-page-title">Claim ALLOX</h2>
        <span className="ci-page-desc">
          Your investor allocation, unlocked monthly after the cliff.
        </span>
      </div>

      <div className="ci-banner d-flex align-items-center justify-content-between gap-3 mb-4">
        <div className="ci-banner-text">
          <span className="ci-banner-sub">Staking pools are live</span>
          <h3 className="ci-banner-title">
            Stake ALLOX · Earn up to <span className="ci-accent">30% APR</span>
          </h3>
        </div>
        <a href="/earn/dypius" className="ci-btn ci-btn-sm">
          Stake
        </a>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="ci-card h-100 d-flex flex-column">
            <h4 className="ci-card-title">ALLOX Investor Claim</h4>

            <div className="ci-box mb-3">
              <div className={`d-flex ci-box-row ${connected ? "" : "border-0"}`}>
                <div className="ci-token d-flex align-items-center gap-3">
                  <img
                    src="https://cdn.allox.ai/allox/tokens/alloxToken.svg"
                    width={28}
                    height={28}
                    alt="ALLOX"
                  />
                  <span className="ci-token-name">ALLOX</span>
                </div>
                <Dropdown className="ci-network" onSelect={(k) => selectChain(Number(k))}>
                  <Dropdown.Toggle as="div" className="ci-network-toggle">
                    <span className="ci-label-xs">Network</span>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="ci-network-name">
                        {connected && !CHAINS[networkId] ? (
                          "Switch Network"
                        ) : (
                          <ChainLabel chainId={selectedChainId} />
                        )}
                      </span>
                      <ChevronDown size={16} color="#a3a3c2" />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="ci-network-menu">
                    {Object.keys(CHAINS).map((id) => (
                      <Dropdown.Item
                        key={id}
                        eventKey={id}
                        active={Number(id) === selectedChainId}
                      >
                        <ChainLabel chainId={Number(id)} size={18} />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {connected && (
                <div className="d-flex align-items-center justify-content-between ci-claimable">
                  <span className="ci-muted">Claimable Now</span>
                  <span className="ci-claimable-amount">{usd(vesting.claimable)}</span>
                </div>
              )}
            </div>

            {connected && (
              <div className="ci-box ci-stats d-flex justify-content-around mb-3">
                {[
                  ["Total", vesting.total],
                  ["Total Claimed", vesting.claimed],
                  ["Remaining", remaining],
                ].map(([label, value]) => (
                  <div key={label} className="d-flex flex-column align-items-center">
                    <span className="ci-stat-value">{usd(value)}</span>
                    <span className="ci-label-xs">{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto">
              {!connected ? (
                <button className="ci-btn w-100" onClick={handleConnection}>
                  Connect Wallet
                </button>
              ) : !onSelectedChain ? (
                <button
                  className="ci-btn w-100"
                  onClick={() => handleChangeNetwork(selectedChainId)}
                >
                  Switch Network to {CHAINS[selectedChainId].name}
                </button>
              ) : (
                <button className="ci-btn w-100" disabled={vesting.claimable <= 0}>
                  Claim
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="ci-card h-100">
            <h4 className="ci-card-title">Cliff and Vesting</h4>

            <div className="d-flex justify-content-between mb-2">
              <span className="ci-row-label text-white">Unlocked</span>
              <span className="ci-row-value-sm">
                {vesting.unlockedPercent}%{connected && ` · ${usd(unlocked)}`}
              </span>
            </div>
            <div className="ci-progress mb-2">
              <div style={{ width: `${vesting.unlockedPercent}%` }} />
            </div>

            <div className="ci-row">
              <span className="ci-row-label">TGE Unlock</span>
              <span className="ci-row-value">{vesting.tgePercent}%</span>
            </div>
            <div className="ci-row">
              <span className="ci-row-label">Cliff</span>
              <span className="ci-row-value d-flex align-items-center gap-2">
                {vesting.cliffMonths} Months
                <span className="ci-pill">Ended {vesting.cliffEnd}</span>
              </span>
            </div>
            <div className="ci-row">
              <span className="ci-row-label">Vesting</span>
              <span className="ci-row-value d-flex align-items-center gap-2">
                {vesting.vestingMonths} Months
                {vesting.vestingActive && <span className="ci-pill ci-pill-active">Active</span>}
              </span>
            </div>
            <div className="ci-row border-0">
              <span className="ci-row-label">Fully Vested</span>
              <span className="ci-row-value">{vesting.fullyVested}</span>
            </div>
          </div>
        </div>
      </div>

      {connected && (
        <div className="ci-card">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <h4 className="ci-card-title mb-0">Claim History</h4>
            <span className="ci-accent ci-history-summary">
              {history.length} Claims · {usd(history.reduce((s, h) => s + h.amount, 0))}
            </span>
          </div>
          <div className="ci-table-wrap mt-3">
            <table className="ci-table w-100">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Network</th>
                  <th className="text-end">Amount</th>
                  <th className="text-end">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.tx}>
                    <td className="ci-muted">{h.date}</td>
                    <td className="fw-semibold">{h.type}</td>
                    <td>
                      <ChainLabel chainId={h.chainId} size={12} />
                    </td>
                    <td className="text-end fw-semibold">{usd(h.amount)}</td>
                    <td className="text-end">
                      <a
                        href={CHAINS[h.chainId].explorer + h.tx}
                        target="_blank"
                        rel="noreferrer"
                        className="ci-tx d-inline-flex align-items-center gap-2"
                      >
                        {short(h.tx)} <ExternalLink size={13} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimInvestors;
