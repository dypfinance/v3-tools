import React from "react";
import './_nftPlaceHolder.scss'

const NftPlaceHolder = ({onMintClick}) => {
  return (
    <div className="placeholder-wrapper nft-caw-card" style={{width: 195}}>
      <div className="placeholder-content">
        <img
          src={require("./cat_desktop.jpeg").default}
          alt=""
          className="placeholder-content-img"
        />
        <p className="placeholder-content-text">
         You can view all your NFTs to manage them
        </p>
        <button className="placeholder-button" onClick={onMintClick}>Mint more NFTs</button>
      </div>
      
     
   
    </div>
  );
};

export default NftPlaceHolder;