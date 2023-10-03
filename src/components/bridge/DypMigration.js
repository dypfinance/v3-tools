import React, { useState, useEffect } from "react";
import "./bridge.css";
import { useLocation } from "react-router-dom";
import initMigration from "./migration";
import Web3 from "web3";

const Bridge = ({ networkId, isConnected, handleConnection, coinbase }) => {
  const [sourceChain, setSourceChain] = useState("eth");
  const [destinationChain, setDestinationChain] = useState("");
  const [activebtn, setActiveBtn] = useState("");

  const [sourceBridge, setSourceBridge] = useState(window.bridge_bscavaxbsc);
  const [destinationBridge, setDestinationBridge] = useState(
    window.newbridge_eth
  );
  const [sourceToken, setSourceToken] = useState(window.token_dyp_bscavaxbsc);
  const [destinationToken, setDestinationToken] = useState(
    window.token_dyp_bscavax
  );

  const routeData = useLocation();

  const [ethBalance, setEthBalance] = useState("0.0");
  const [bnbBalance, setBnbBalance] = useState("0.0");
  const [avaxBalance, setAvaxBalance] = useState("0.0");

  const getAllBalance = async () => {
    const tokenAddress = "0xa4f5c83b19946488909273b6bef5aed63df9cc7b";
    const tokenAddress_bsc = "0x2e0a34680c72d998e327f58dedfd48f9d4282b8c";

    const walletAddress = coinbase;
    const TokenABI = window.ERC20_ABI;
    const web3 = new Web3(window.ethereum);
    if (coinbase != undefined) {
      const contract1 = new window.goerliWeb3.eth.Contract(TokenABI, tokenAddress);
      const contract2 = new window.bscTestWeb3.eth.Contract(TokenABI, tokenAddress_bsc);
      const contract3 = new window.avaxWeb3.eth.Contract(TokenABI, tokenAddress);


      await contract2.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          setBnbBalance(data);
        });

      await contract1.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          setEthBalance(data);
        });

      // await contract3.methods
      //   .balanceOf(walletAddress)
      //   .call()
      //   .then((data) => {
      //     setAvaxBalance(data);
      //   });
    }
  };
 
  const handleSourceChain = async (chainText) => {
    if (chainText === "eth") {
      setSourceChain(chainText);
      setDestinationChain("eth");
    }

    if (chainText === "bnb") {
      setSourceChain(chainText);
      setSourceBridge(window.newbridge_bsc);
      setDestinationBridge(window.newbridge_eth);
      setSourceToken(window.token_old_bsc);
      setDestinationToken(window.token_dyp_new);
      setDestinationChain("eth");
    }

    if (chainText === "avax") {
      setSourceChain(chainText);
      setSourceBridge(window.newbridge_bsc);
      setDestinationBridge(window.newbridge_eth);
      setSourceToken(window.token_old_bsc);
      setDestinationToken(window.token_dyp_new);
      setDestinationChain("eth");
    }
  };

  useEffect(() => {
    getAllBalance();
  }, [sourceChain, destinationChain, coinbase]);

  useEffect(() => {
    setSourceChain("eth");
    setDestinationChain("eth");

  }, []);

  const MigrationModal = initMigration({
    bridgeETH: sourceBridge,
    bridgeBSC: window.newbridge_eth,
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
          ethBalance={ethBalance}
          bnbBalance={bnbBalance}
          avaxBalance={avaxBalance}
          sourceBridge = {sourceBridge}
          destinationBridge = {destinationBridge}
        />
      </div>
    </div>
  );
};

export default Bridge;
