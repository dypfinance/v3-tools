import React from "react";
import '../caws/NftMinting/components/General/NftPlaceHolder/_nftPlaceHolder.scss'

const NftPlaceHolder = ({onMintClick}) => {
  return (
    <div className="placeholder-wrapper nft-caw-card" style={{width: 195}}>
      <div className="placeholder-content">
        <div className="d-flex align-items-center justify-content-center p-3" style={{border: '1px grey dashed', borderRadius: '8px'}}>
        <img
          src={require("./landplaceholder.svg").default}
          alt=""
          className="placeholder-content-img"
        />
        </div>
        <p className="placeholder-content-text">
         You can view all your NFTs to manage them
        </p>
        <a href="https://www.worldofdypians.com/land" target="_blank" className="placeholder-button" onClick={onMintClick}>Mint more NFTs</a>
      </div>
      
     
   
    </div>
  );
};

export default NftPlaceHolder;