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
import axios from "axios";
import Countdown from "react-countdown";
const renderer = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <div className="d-flex flex-column align-items-center justify-content-center unit2">
        <h6 className="time-big-number2">{days < 10 ? "0" + days : days}</h6>
        <h6 className="time-small-number2">Days</h6>
      </div>
      <h6 className="timer-separator2">:</h6>
      <div className="d-flex flex-column align-items-center justify-content-center unit2">
        <h6 className="time-big-number2">{hours < 10 ? "0" + hours : hours}</h6>
        <h6 className="time-small-number2">Hours</h6>
      </div>
      <h6 className="timer-separator2">:</h6>
      <div className="d-flex flex-column align-items-center justify-content-center unit2">
        <h6 className="time-big-number2">
          {minutes < 10 ? "0" + minutes : minutes}
        </h6>
        <h6 className="time-small-number2">Minutes</h6>
      </div>
    </div>
  );
};

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
  const [migrationPercentage, setMigrationPercentage] = useState(true);

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

  const getMigrationData = async () => {
    const result = await axios.get(
      "https://api.dyp.finance/api/migratedTokens"
    );
    if (result && result.status === 200) {
      const percentage = result.data.tokenPercentage;
      setMigrationPercentage(percentage);
    }
  };

  useEffect(() => {
    getMigrationData();
  }, []);

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

  let loyaltyCd = new Date("2025-01-08T12:59:59.000+02:00");

  return (
    <div className="container-lg p-0">
      <div className="migration-banner d-flex flex-column flex-lg-row p-4 gap-3 gap-lg-0 align-items-center mb-4">
        <div className="col-12 col-lg-6">
          <div className="d-flex flex-column gap-3">
            <h6 className="migration-banner-title mb-0">
              Final Call: Migrate DYP tokens
            </h6>
          
            <p className="migration-banner-desc mb-0">
              The deadline to migrate is January 8, 2025. After this, migration
              will close permanently. Migrate your tokens today to secure
              continued access and utility!
            </p>
          <Countdown date={loyaltyCd} renderer={renderer} />

          </div>
        </div>

        <div className="col-12 col-lg-2 d-flex flex-column justify-content-center align-items-center">
          <div className="position-relative d-flex align-items-center flex-column">
            <ReviewsBar score={migrationPercentage} />
            <div className="position-relative migration-text-wrapper">
              <span className="migration-status-text">Migration Status</span>
            </div>
          </div>
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
              <a
                href="https://etherscan.io/address/0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17"
                target="_blank"
                className="old-dyp-address mb-0"
              >
                0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17
              </a>
              <div className="d-flex align-items-center gap-2">
                <a
                  href="https://etherscan.io/address/0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17"
                  target="_blank"
                >
                  <img src={eth} alt="" />
                </a>
                <a
                  href="https://bscscan.com/address/0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17"
                  target="_blank"
                >
                  <img src={bnb} alt="" />
                </a>
                <a
                  href="https://snowtrace.io/address/0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17"
                  target="_blank"
                >
                  <img src={avax} alt="" />
                </a>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column">
            <span className="smart-contract-announce">
              New DYP smart contract address:
            </span>
            <div className="d-flex align-items-center gap-3">
              <a
                href="https://etherscan.io/address/0x39b46b212bdf15b42b166779b9d1787a68b9d0c3"
                className="new-dyp-address mb-0"
                target="_blank"
              >
                0x39b46b212bdf15b42b166779b9d1787a68b9d0c3
              </a>
              <a
                href="https://etherscan.io/address/0x39b46b212bdf15b42b166779b9d1787a68b9d0c3"
                target="_blank"
              >
                <img src={eth} alt="" />
              </a>
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
            The swap ratio for DYP V2 varies depending on the respective
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
          <div className="d-flex align-items-center gap-2 justify-content-between">
            <a
              href="https://medium.com/@dypius/how-to-convert-your-old-dyp-to-the-new-dyp-v2-63b8965bbfa5"
              target="_blank"
              style={{ width: "fit-content" }}
              rel="noreferrer"
            >
              <div className="d-flex align-items-center.gap-2">
                <span className="explore-migration">Explore the Guide</span>
                <img src={require("./assets/greenArrow.svg").default} alt="" />
              </div>
            </a>
            <a
              href="https://dypius.medium.com/dyp-migration-faqs-e1b052da868c"
              target="_blank"
              style={{ width: "fit-content" }}
              rel="noreferrer"
            >
              <div className="d-flex align-items-center.gap-2">
                <span className="explore-migration">FAQs</span>
                <img src={require("./assets/greenArrow.svg").default} alt="" />
              </div>
            </a>
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
