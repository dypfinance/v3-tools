import React, { useState} from "react";
import EarnOtherHero from "./EarnOtherHero/EarnOtherHero";
import EarnOtherContentNft from "./EarnOtherContent/EarnOtherContentNft";

const EarnOtherNft = ({
  coinbase,
  isConnected,
  network,
  handleConnection,
  handleSwitchNetwork,
  isPremium,
  type,
}) => {

  const [poolClicked, setPoolClicked]=useState(false)
  const [poolClickedType, setPoolClickedType]=useState('')


  const handleSliderClick = (obj) => {
      setPoolClicked(true)
      setPoolClickedType(obj)
  };

  return (
    <div className="container-lg earn-wrapper d-flex flex-column justify-content-center align-items-center p-0 position-relative">
      <EarnOtherHero type={type} isPremium={isPremium} onSliderClick={handleSliderClick}/>
      <EarnOtherContentNft
        coinbase={coinbase}
        type={type}
        poolClicked={poolClicked}
        poolClickedType={poolClickedType}
        isConnected={isConnected}
        chainId={network}
        networkId={network}
        handleConnection={handleConnection}
        handleSwitchNetwork={handleSwitchNetwork}
        isPremium={isPremium} 
        onCloseCard={()=>{setPoolClicked(false); setPoolClickedType('')}}
      />
    </div>
  );
};

export default EarnOtherNft;
