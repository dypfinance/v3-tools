import React, { useState, useEffect } from "react";
import initBridge from "./bridge";
import BridgeFAQ from "./BridgeFAQ";
import initBridgeidyp from "./bridge-idyp";
import dyp from "./assets/dyp.svg";
import idyp from "./assets/idyp.svg";
import eth from "./assets/eth.svg";
import bnb from "./assets/bnb.svg";
import avax from "./assets/avax.svg";
import base from "./assets/base.svg";

import whiteArrow from "./assets/whiteArrow.svg";
import whiteBase from "./assets/white-base.svg";
import superBridge from "./assets/superbridge.svg";



import "./bridge.css";
import { useLocation } from "react-router-dom";
import Web3 from "web3";

const Bridge = ({ networkId, isConnected, handleConnection, coinbase }) => {
  const [sourceChain, setSourceChain] = useState("");
  const [sourceChainiDyp, setSourceChainiDyp] = useState("");
  const [destinationChainiDyp, setDestinationChainiDyp] = useState("");
  const [destinationChain, setDestinationChain] = useState("");
  const [activebtn, setActiveBtn] = useState("");

  const [sourceBridge, setSourceBridge] = useState(
    window.new_dypius_bridge_ethbsc
  );
  const [destinationBridge, setDestinationBridge] = useState(
    window.new_dypius_bridge_bsc
  );
  const [sourceToken, setSourceToken] = useState(window.token_dypius_new);
  const [destinationToken, setDestinationToken] = useState(
    window.token_dypius_new_bsc
  );

  const [sourceBridgeiDyp, setSourceBridgeiDyp] = useState(
    window.bridge_idypeth
  );
  const [destinationBridgeiDyp, setDestinationBridgeiDyp] = useState(
    window.bridge_idypbsceth
  );
  const [sourceTokeniDyp, setSourceTokeniDyp] = useState(window.token_idyp_eth);
  const [destinationTokeniDyp, setDestinationTokeniDyp] = useState(
    window.token_idyp_bsceth
  );

  const routeData = useLocation();
  const [faqSection, setFaqSection] = useState(routeData.state?.section);
  const [ethBalance, setEthBalance] = useState("0.0");
  const [bnbBalance, setBnbBalance] = useState("0.0");
  const [avaxBalance, setAvaxBalance] = useState("0.0");

  const [ethBalanceidyp, setEthBalanceidyp] = useState("0.0");
  const [bnbBalanceidyp, setBnbBalanceidyp] = useState("0.0");
  const [avaxBalanceidyp, setAvaxBalanceidyp] = useState("0.0");

  // const getAllBalance = async () => {
  //   const tokenAddress = "0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17";
  //   const walletAddress = coinbase;
  //   const TokenABI = window.ERC20_ABI;

  //   if (coinbase != undefined) {
  //     const contract1 = new window.infuraWeb3.eth.Contract(
  //       TokenABI,
  //       tokenAddress
  //     );
  //     const contract2 = new window.avaxWeb3.eth.Contract(
  //       TokenABI,
  //       tokenAddress
  //     );
  //     const contract3 = new window.bscWeb3.eth.Contract(TokenABI, tokenAddress);

  //     await contract1.methods
  //       .balanceOf(walletAddress)
  //       .call()
  //       .then((data) => {
  //         setEthBalance(data);
  //       });
  //     await contract2.methods
  //       .balanceOf(walletAddress)
  //       .call()
  //       .then((data) => {
  //         setAvaxBalance(data);
  //       });

  //     await contract3.methods
  //       .balanceOf(walletAddress)
  //       .call()
  //       .then((data) => {
  //         setBnbBalance(data);
  //       });
  //   }
  // };

  const getAllBalanceiDyp = async () => {
    const tokenAddress = "0xbd100d061e120b2c67a24453cf6368e63f1be056";
    const walletAddress = coinbase;
    const TokenABI = window.ERC20_ABI;
    let bal1, bal2, bal3;
    if (coinbase != undefined) {
      const contract1 = new window.infuraWeb3.eth.Contract(
        TokenABI,
        tokenAddress
      );
      const contract2 = new window.avaxWeb3.eth.Contract(
        TokenABI,
        tokenAddress
      );
      const contract3 = new window.bscWeb3.eth.Contract(TokenABI, tokenAddress);

      bal1 = await contract1.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          setEthBalanceidyp(data);
        });
      bal2 = await contract2.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          setAvaxBalanceidyp(data);
        });

      bal3 = await contract3.methods
        .balanceOf(walletAddress)
        .call()
        .then((data) => {
          setBnbBalanceidyp(data);
        });
    }
  };

  const handleSourceChain = async (chainText) => {
    if (activebtn === "1") {
      if (chainText === "eth") {
        window.cached_contracts = Object.create(null);
        setSourceChain(chainText);
        setTimeout(() => {
          setSourceBridge(window.new_dypius_bridge_ethbsc);
          setDestinationBridge(window.new_dypius_bridge_bsc);
          setSourceToken(window.token_dypius_new);
          setDestinationToken(window.token_dypius_new_bsc);
        }, 500);
      } else if (chainText === "bnb") {
        window.cached_contracts = Object.create(null);
        setSourceChain(chainText);
        setTimeout(() => {
          setDestinationBridge(window.new_dypius_bridge_ethbsc);
          setSourceBridge(window.new_dypius_bridge_bsc);
          setDestinationToken(window.token_dypius_new);
          setSourceToken(window.token_dypius_new_bsc);
        }, 500);
      }
    } else if (activebtn === "2") {
      if (chainText === "eth") {
        window.cached_contracts = Object.create(null);
        setSourceChain(chainText);
        setTimeout(() => {
          setSourceBridge(window.new_dypius_bridge_ethavax);
          setDestinationBridge(window.new_dypius_bridge_avax);
          setSourceToken(window.token_dypius_new);
          setDestinationToken(window.token_dypius_new_avax);
        }, 500);
      } else if (chainText === "avax") {
        window.cached_contracts = Object.create(null);
        setSourceChain(chainText);
        setTimeout(() => {
          setSourceBridge(window.new_dypius_bridge_avax);
          setDestinationBridge(window.new_dypius_bridge_ethavax);
          setDestinationToken(window.token_dypius_new);
          setSourceToken(window.token_dypius_new_avax);
        }, 500);
      }
    }
  };

  const handleSourceChainiDyp = async (chainText) => {
    if (activebtn === "5") {
      if (chainText === "eth") {
        window.cached_contracts = Object.create(null);
        setTimeout(() => {
          setSourceChainiDyp(chainText);
          setSourceBridgeiDyp(window.bridge_idypbsceth);
          setDestinationBridgeiDyp(window.bridge_idypbscbsc);
          setSourceTokeniDyp(window.token_idyp_bsceth);
          setDestinationTokeniDyp(window.token_idyp_bscbsc);
        }, 500);
      } else if (chainText === "bnb") {
        window.cached_contracts = Object.create(null);
        setTimeout(() => {
          setSourceChainiDyp(chainText);
          setSourceBridgeiDyp(window.bridge_idypbscbsc);
          setDestinationBridgeiDyp(window.bridge_idypbsceth);
          setSourceTokeniDyp(window.token_idyp_bscbsc);
          setDestinationTokeniDyp(window.token_idyp_bsceth);
        }, 500);
      }
    } else if (activebtn === "7") {
      if (chainText === "eth") {
        window.cached_contracts = Object.create(null);
        setTimeout(() => {
          setSourceChainiDyp(chainText);
          setSourceBridgeiDyp(window.bridge_idypeth);
          setDestinationBridgeiDyp(window.bridge_idypbsc);
          setSourceTokeniDyp(window.token_idyp_eth);
          setDestinationTokeniDyp(window.token_idyp_bsc);
        }, 500);
      } else if (chainText === "avax") {
        window.cached_contracts = Object.create(null);
        setTimeout(() => {
          setSourceChainiDyp(chainText);
          setSourceBridgeiDyp(window.bridge_idypbsc);
          setDestinationBridgeiDyp(window.bridge_idypeth);
          setSourceTokeniDyp(window.token_idyp_bsc);
          setDestinationTokeniDyp(window.token_idyp_eth);
        }, 500);
      }
    }
  };

  useEffect(() => {
    // getAllBalance();
    getAllBalanceiDyp();
  }, [
    sourceChain,
    destinationChain,
    sourceChainiDyp,
    destinationChainiDyp,
    coinbase,
  ]);

  // useEffect(() => {
  //   setSourceChain("eth");
  //   setSourceBridge(window.new_dypius_bridge_ethbsc);
  //   setDestinationBridge(window.new_dypius_bridge_bsc);
  //   setSourceToken(window.token_dypius_new);
  //   setDestinationToken(window.token_dypius_new_bsc);
  // }, []);

  const BridgeModal = initBridge({
    bridgeETH: sourceBridge,
    bridgeBSC: destinationBridge,
    tokenETH: sourceToken,
    tokenBSC: destinationToken,
  });

  const BridgeiDYPModal = initBridgeidyp({
    bridgeETH: sourceBridgeiDyp,
    bridgeBSC: destinationBridgeiDyp,
    tokenETH: sourceTokeniDyp,
    tokenBSC: destinationTokeniDyp,
  });

  return (
    <div className="container-lg p-0">
      <div className="general-bridge-wrapper px-4 py-5 mb-4">
        <div className="col-12 col-lg-5 d-flex flex-column justify-content-center gap-3">
          <h3 className="text-white">Dypius Bridge</h3>
          <p className="text-white">
            Send tokens from Ethereum to BNB Chain, Base and Avalanche chains
            with ease.
            <br />
            Every transaction is instant and secure.
          </p>
        </div>
      </div>
      <a href="https://superbridge.app/base" target="_blank" rel="noreferrer">
      <div className="base-bridge-wrapper px-3 py-2 mb-4">
        <div className="d-flex flex-column flex-lg-row align-items-center gap-2 justify-content-between">
          <div className="d-flex align-items-center gap-1">
          <img src={whiteBase} alt='' />
          <span className="base-bridge-text">Seamlessly swap DYP to Base via the official Base Super Bridge</span></div>
          <img src={superBridge} alt='' />

        </div>
      </div></a>
      <div>
        <h3 className="text-white mb-4">
          <img src={dyp} alt="" /> DYP Bridge
        </h3>
        <h5 className="text-white mb-2">Choose route</h5>
        <div className="d-flex gap-3 mb-2">
          <div
            className={
              activebtn === "1"
                ? "optionbtn-active activeethbnb"
                : "optionbtn-passive bridge-passive"
            }
            onClick={() => {
              window.cached_contracts = Object.create(null);
              setActiveBtn("1");
              setSourceChain("eth");
              setDestinationChain("bnb");
              setTimeout(() => {
                setSourceBridge(window.new_dypius_bridge_ethbsc);
                setDestinationBridge(window.new_dypius_bridge_bsc);
                setSourceToken(window.token_dypius_new);
                setDestinationToken(window.token_dypius_new_bsc);
              }, 500);
            }}
          >
            <h6 className="optiontext d-flex align-items-center gap-2">
              <img src={eth} alt="" /> <img src={bnb} alt="" />
              <p className=" mb-0 optiontext d-none d-lg-flex">ETH/BSC</p>
            </h6>
          </div>
          <div
            className={
              activebtn === "2"
                ? "optionbtn-active activeethavax"
                : "optionbtn-passive bridge-passive"
            }
            onClick={() => {
              window.cached_contracts = Object.create(null);
              setActiveBtn("2");
              setSourceChain("eth");
              setDestinationChain("avax");
              setTimeout(() => {
                setSourceBridge(window.new_dypius_bridge_ethavax);
                setDestinationBridge(window.new_dypius_bridge_avax);
                setSourceToken(window.token_dypius_new);
                setDestinationToken(window.token_dypius_new_avax);
              }, 500);
            }}
          >
            <h6 className="optiontext d-flex align-items-center gap-2">
              <img src={eth} alt="" /> <img src={avax} alt="" />
              <p className=" mb-0 optiontext d-none d-lg-flex">ETH/AVAX</p>
            </h6>
          </div>
          <a
            className={"optionbtn-passive bridge-passive"}
            href="https://superbridge.app/base"
            target="_blank"
            rel="noreferrer"
          >
            <h6 className="optiontext d-flex align-items-center gap-2">
              <img src={eth} alt="" /> <img src={base} alt="" />
              <p className=" mb-0 optiontext d-none d-lg-flex">ETH/BASE</p>
            </h6>
          </a>
        </div>
        <BridgeModal
          isConnected={isConnected}
          networkId={networkId}
          handleConnection={handleConnection}
          destinationChain={destinationChain}
          onSelectChain={(value) => {
            setDestinationChain(value);
          }}
          onSelectSourceChain={(value) => {
            handleSourceChain(value);
          }}
          coinbase={coinbase}
          sourceChain={sourceChain}
          activebtn={activebtn}
        />
      </div>
      <div className="bigseparator mt-5 mb-5 col-6 col-xxl-5"></div>
      <div>
        <h3 className="text-white mb-4">
          <img src={idyp} alt="" style={{ width: 32, height: 32 }} /> iDYP
          Bridge
        </h3>
        <h5 className="text-white mb-2">Choose route</h5>
        <div className="d-flex gap-3 mb-2">
          <div
            className={
              activebtn === "5"
                ? "optionbtn-active activeethbnb"
                : "optionbtn-passive bridge-passive"
            }
            onClick={() => {
              window.cached_contracts = Object.create(null);
              setActiveBtn("5");
              setSourceChainiDyp("eth");
              setDestinationChainiDyp("bnb");
              setTimeout(() => {
                setSourceBridgeiDyp(window.bridge_idypbsceth);
                setDestinationBridgeiDyp(window.bridge_idypbscbsc);
                setSourceTokeniDyp(window.token_idyp_bsceth);
                setDestinationTokeniDyp(window.token_idyp_bscbsc);
              }, 500);
            }}
          >
            <h6 className="optiontext d-flex align-items-center gap-2">
              <img src={eth} alt="" /> <img src={bnb} alt="" />
              <p className=" mb-0 optiontext d-none d-lg-flex">ETH/BNB</p>
            </h6>
          </div>

          <div
            className={
              activebtn === "7"
                ? "optionbtn-active activeethavax"
                : "optionbtn-passive bridge-passive"
            }
            onClick={() => {
              window.cached_contracts = Object.create(null);
              setSourceChainiDyp("eth");
              setDestinationChainiDyp("avax");
              setActiveBtn("7");
              setTimeout(() => {
                setSourceBridgeiDyp(window.bridge_idypeth);
                setDestinationBridgeiDyp(window.bridge_idypbsc);
                setSourceTokeniDyp(window.token_idyp_eth);
                setDestinationTokeniDyp(window.token_idyp_bsc);
              }, 500);
            }}
          >
            <h6 className="optiontext d-flex align-items-center gap-2">
              <img src={eth} alt="" /> <img src={avax} alt="" />
              <p className=" mb-0 optiontext d-none d-lg-flex">ETH/AVAX</p>
            </h6>
          </div>
        </div>
        <BridgeiDYPModal
          isConnected={isConnected}
          networkId={networkId}
          handleConnection={handleConnection}
          destinationChain={destinationChainiDyp}
          onSelectChain={(value) => {
            setDestinationChainiDyp(value);
          }}
          onSelectSourceChain={(value) => {
            handleSourceChainiDyp(value);
          }}
          sourceChain={sourceChainiDyp}
          coinbase={coinbase}
          activebtn={activebtn}
          ethBalance={ethBalanceidyp}
          bnbBalance={bnbBalanceidyp}
          avaxBalance={avaxBalanceidyp}
        />
      </div>

      <div className="bigseparator mt-5 mb-5 col-6 col-xxl-5"></div>
      <div className="swiftwrapper p-3">
        <div className="d-flex flex-column gap-3">
          <h4>Bridge DYP on SWFT</h4>
          <a
            href="https://defi.swft.pro/#/?sourceFlag=DYP"
            target="_blank"
            rel="noreferrer"
            className="d-flex align-items-center gap-1 btn bridgenow-btn"
          >
            Bridge now <img src={whiteArrow} alt="" />{" "}
          </a>
        </div>
      </div>
      <div className="bigseparator mt-5 mb-5 col-6 col-xxl-5"></div>

      <BridgeFAQ faqIndex={routeData.state ? routeData.state.faqIndex : -1} />
    </div>
  );
};

export default Bridge;
