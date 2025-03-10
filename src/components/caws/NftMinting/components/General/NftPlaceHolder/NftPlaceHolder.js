import React from "react";
import "./_nftPlaceHolder.scss";

const NftPlaceHolder = ({ onMintClick, width }) => {
  return (
    <div className="placeholder-wrapper nft-caw-card" style={{ width: width }}>
      <a
        className="placeholder-button"
        href="https://www.worldofdypians.com/marketplace/caws"
        target={"_blank"}
        rel="noreferrer"
      >
        <div className="placeholder-content">
          <img
            src={"https://cdn.worldofdypians.com/tools/cat_desktop.jpeg"}
            alt=""
            className="placeholder-content-img"
          />
          <p className="placeholder-content-text">
            You can view all your NFTs to manage them
          </p>
          <a
            className="placeholder-button"
            href="https://www.worldofdypians.com/marketplace/caws"
            target={"_blank"}
            rel="noreferrer"
          >
            Buy on Marketplace
          </a>
        </div>
      </a>
    </div>
  );
};

export default NftPlaceHolder;
