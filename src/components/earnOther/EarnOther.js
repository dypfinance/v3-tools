import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import EarnOtherHero from "./EarnOtherHero/EarnOtherHero";
import EarnOtherContent from "./EarnOtherContent/EarnOtherContent";
import "./earnOther.css";
import axios from "axios";

const EarnOther = ({
  coinbase,
  the_graph_result,
  lp_id,
  isConnected,
  network,
  handleConnection,
  the_graph_resultavax,
  the_graph_resultbsc,
  referrer,
  handleSwitchNetwork,
  isPremium,
  type,
  onConnectWallet,aggregatorPools
}) => {
  const routeData = useLocation();
  const [poolClicked, setPoolClicked] = useState(false);
  const [poolClickedType, setPoolClickedType] = useState("");
 

 
  const handleSliderClick = (obj) => {
    setPoolClicked(true);
    setPoolClickedType(obj);
  };
 

  return (
    <div className="container-lg earn-wrapper d-flex flex-column justify-content-center align-items-center p-0 position-relative">
      <EarnOtherHero
        type={type}
        isPremium={isPremium}
        onSliderClick={handleSliderClick}
      />
      <EarnOtherContent
        aggregatorPools={aggregatorPools}
        coinbase={coinbase}
        type={type}
        poolClicked={poolClicked}
        poolClickedType={poolClickedType}
        the_graph_result={the_graph_result}
        lp_id={lp_id}
        isConnected={isConnected}
        chainId={network}
        networkId={network}
        handleConnection={handleConnection}
        the_graph_resultavax={the_graph_resultavax}
        the_graph_resultbsc={the_graph_resultbsc}
        referrer={referrer}
        routeOption={routeData.state ? routeData.state.option : "Staking"}
        routeChain={routeData.state ? routeData.state.chain : ""}
        pool={routeData.state ? routeData.state.pool : null}
        customChain={routeData.state ? routeData.state.customChain : "eth"}
        faqIndex={routeData.state ? routeData.state.faqIndex : -1}
        handleSwitchNetwork={handleSwitchNetwork}
        onConnectWallet={onConnectWallet}
      />
    </div>
  );
};

export default EarnOther;
