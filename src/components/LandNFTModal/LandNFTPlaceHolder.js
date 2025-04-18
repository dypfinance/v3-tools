import React from "react";
import "../caws/NftMinting/components/General/NftPlaceHolder/_nftPlaceHolder.scss";

const NftPlaceHolder = ({ onMintClick }) => {
  return (
    <div className="placeholder-wrapper nft-caw-card" style={{ width: 155 }}>
      <a
        href="https://www.worldofdypians.com/shop/land"
        target="_blank"
        className="placeholder-button"
        rel="noreferrer"
      >
        <div className="placeholder-content">
          <div
            className="d-flex align-items-center justify-content-center p-0"
            style={{ border: "1px grey dashed", borderRadius: "8px" }}
          >
            <img
              src={"https://cdn.worldofdypians.com/tools/landplaceholder.svg"}
              alt=""
              className="placeholder-content-img"
              style={{ width: 135, height: 110, scale: "0.8" }}
            />
          </div>
          <p className="placeholder-content-text">
            You can view all your NFTs to manage them
          </p>
          <a
            href="https://www.worldofdypians.com/shop/land"
            target="_blank"
            className="placeholder-button"
            rel="noreferrer"
          >
            Buy on WOD Shop
          </a>
        </div>
      </a>
    </div>
  );
};

export default NftPlaceHolder;
