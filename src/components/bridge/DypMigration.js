import React, { useState, useEffect } from "react";
import "./bridge.css";
import { useLocation } from "react-router-dom";
import initMigration from "./migration";
import Web3 from "web3";
import avax from "./assets/avax.svg";
import eth from "./assets/eth.svg";
import bnb from "./assets/bnb.svg";
import { CircularProgressbar } from "react-circular-progressbar";
import ReviewsBar from "./ProgressBar/ReviewsBar";

const DypMigration = ({
  networkId,
  isConnected,
  handleConnection,
  coinbase,
}) => {
  const [sourceChain, setSourceChain] = useState("eth");
  const [destinationChain, setDestinationChain] = useState("");
  const [activebtn, setActiveBtn] = useState("");

  const [sourceBridge, setSourceBridge] = useState();
  const [destinationBridge, setDestinationBridge] = useState();
  const [sourceToken, setSourceToken] = useState();
  const [destinationToken, setDestinationToken] = useState();

  const handleSourceChain = async (chainText) => {
    if (chainText === "eth") {
      setSourceChain(chainText);
      setDestinationChain("eth");
    } else if (chainText === "bnb") {
      window.cached_contracts = Object.create(null);
      setSourceChain(chainText);
      setTimeout(() => {
        setSourceBridge(window.newbridge_bsc);
        setDestinationBridge(window.newbridge_eth_bsc);
        setSourceToken(window.token_old_bsc);
        setDestinationToken(window.token_dypius_new);
        setDestinationChain("eth");
      }, 500);
    } else if (chainText === "avax") {
      window.cached_contracts = Object.create(null);
      setSourceChain(chainText);
      setTimeout(() => {
        setSourceBridge(window.newbridge_avax);
        setDestinationBridge(window.newbridge_eth_avax);
        setSourceToken(window.token_old_avax);
        setDestinationToken(window.token_dypius_new);
        setDestinationChain("eth");
      }, 500);
    }
  };

  useEffect(() => {
    setSourceChain("eth");
    setDestinationChain("eth");
  }, []);

  const MigrationModal = initMigration({
    bridgeETH: sourceBridge,
    bridgeBSC: destinationBridge,
    tokenETH: sourceToken,
    tokenBSC: destinationToken,
  });

  return (
    <div className="container-lg p-0">
      <div className="migration-banner d-flex p-4 align-items-center mb-4">
        <div className="col-12 col-lg-6">
          <div className="d-flex flex-column gap-3">
            <h6 className="migration-banner-title mb-0">Migrate DYP tokens</h6>
            <p className="migration-banner-desc mb-0">
              Easily migrate your old DYP tokens from Ethereum, BNB Chain, and
              Avalanche to the new DYP v2 token on Ethereum. This upgrade
              ensures that you will benefit from the latest features and
              improvements in the Dypius ecosystem.
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-2 d-flex justify-content-end">
          <ReviewsBar score={75} />
        </div>
      </div>
      <h3 className="text-white mb-2">Migration Details</h3>
      <div className="d-flex flex-column flex-lg-row gap-4 gap-lg-0 align-items-center justify-content-between mb-4">
        <div className="migration-details-wrapper p-3 d-flex flex-column gap-3 position-relative">
          <div className="purplediv"></div>
          <h6 className="migration-details-title">Smart Contract</h6>
          <div className="d-flex flex-column">
            <span className="smart-contract-announce">
              Old DYP smart contract address:
            </span>
            <div className="d-flex align-items-center gap-3">
              <span className="old-dyp-address mb-0">
                0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17
              </span>
              <div className="d-flex align-items-center gap-2">
                <img src={eth} alt="" />
                <img src={bnb} alt="" />
                <img src={avax} alt="" />
              </div>
            </div>
          </div>
          <div className="d-flex flex-column">
            <span className="smart-contract-announce">
              New DYP smart contract address:
            </span>
            <div className="d-flex align-items-center gap-3">
              <span className="new-dyp-address mb-0">
                0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17
              </span>
              <img src={eth} alt="" />
            </div>
          </div>
          <span className="contract-audit-text mb-0">
            *Smart Contracts are audited by: CertiK and PeckShield
          </span>
        </div>
        <div className="migration-details-wrapper p-3 d-flex flex-column gap-3 position-relative">
          <div className="purplediv"></div>
          <h6 className="migration-details-title">Swap Ratio</h6>
          <span className="smart-contract-announce">
            The swap ratio for DYP V2 vary depending on the respective
            blockchain.
          </span>
          <ul>
            <li className="migration-swap-item">
              1 DYP ERC20 - 6 DYP ERC20 V2
            </li>
            <li className="migration-swap-item">
              1 DYP BEP20 - 1 DYP ERC20 V2
            </li>
            <li className="migration-swap-item">
              1 DYP ARC20 - 1 DYP ERC20 V2
            </li>
          </ul>
        </div>
        <div className="migration-details-wrapper p-3 d-flex flex-column gap-3 position-relative">
          <div className="purplediv"></div>
          <h6 className="migration-details-title">Help Guide</h6>
          <span className="smart-contract-announce">
            Read the article to gain a better understanding of the migration
            process and learn how to follow the correct steps for converting
            your old DYP tokens to the new DYP v2 tokens.
          </span>
          <div className="d-flex align-items-center.gap-2">
            <span className="explore-migration">Explore the Guide</span>
            <img src={require("./assets/greenArrow.svg").default} alt="" />
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-5 d-flex flex-column justify-content-center gap-3 mb-4">
        <h3 className="text-white">Migration</h3>
      </div>
      <div>
        <MigrationModal
          isConnected={isConnected}
          networkId={networkId}
          handleConnection={handleConnection}
          destinationChain={destinationChain}
          onSelectSourceChain={(value) => {
            handleSourceChain(value);
          }}
          coinbase={coinbase}
          sourceChain={sourceChain}
          activebtn={activebtn}
          sourceBridge={sourceBridge}
          destinationBridge={destinationBridge}
        />
      </div>
    </div>
  );
};

export default DypMigration;
