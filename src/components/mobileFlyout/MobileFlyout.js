import React from "react";
import "./mobileFlyout.css";
import newTag from "./newTag.svg";

const MobileFlyout = ({ onClose,onDownloadClick }) => {
  return (
    <div className="mobile-flyout-wrapper p-2 w-100 d-block d-lg-none d-md-none">
      <div className="d-flex align-items-center gap-2">
        <img src={newTag} alt="" />
        <span className="mobile-flyout-text w-100">Dypius Mobile App</span>
        <div className="d-flex w-100 justify-content-end">
          <button className="download-button px-3 py-1" onClick={onDownloadClick}>Download</button>
        </div>
        <div className="d-flex justify-content-end">
          <img
            src={'https://cdn.worldofdypians.com/wod/xMark.svg'}
            alt=""
            onClick={onClose}
            style={{ width: 22, height: 22 }}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileFlyout;
