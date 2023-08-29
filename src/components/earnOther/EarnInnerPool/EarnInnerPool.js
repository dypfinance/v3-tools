import React from "react";
import whiteArrow from "../../../assets/earnOtherAssets/backWhiteArrow.svg";

const EarnInnerPool = () => {
  return (
    <div className="container-lg earn-wrapper d-flex flex-column justify-content-center align-items-center p-0 position-relative">
      <span className="text-white cursor-pointer d-flex align-items-center gap-2">
        {" "}
        <img alt="" src={whiteArrow} /> Back to Homepage
      </span>
    </div>
  );
};

export default EarnInnerPool;
