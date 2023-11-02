import React, { useState, useEffect } from "react";
import "./bridge.css";
import { useLocation } from "react-router-dom";
import initMigration from "./migration";
import Web3 from "web3";

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
      <div className="col-12 col-lg-5 d-flex flex-column justify-content-center gap-3 mb-4">
        <h3 className="text-white">Dypius Migration</h3>
        <p className="text-white">
          Migrate your DYP Tokens to the new Ecosystem
          <br />
          Every transaction is instant and secure.
        </p>
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
