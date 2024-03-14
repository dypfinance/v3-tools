import React from "react";
import EarnOtherHero from "./EarnOtherHero/EarnOtherHero";
import EarnOtherContentNft from "./EarnOtherContent/EarnOtherContentNft";

const EarnOtherNft = ({
  coinbase,
  isConnected,
  network,
  handleConnection,
  handleSwitchNetwork,
}) => {
  return (
    <div className="container-lg earn-wrapper d-flex flex-column justify-content-center align-items-center p-0 position-relative">
      <EarnOtherHero />
      <EarnOtherContentNft
        coinbase={coinbase}
        isConnected={isConnected}
        chainId={network}
        networkId={network}
        handleConnection={handleConnection}
        handleSwitchNetwork={handleSwitchNetwork}
      />
    </div>
  );
};

export default EarnOtherNft;
