import React from "react";

const VendorCard = ({
  videoAmount,
  logo,
  title,
  onSelect,
  active,
  link,
  activeLink,
}) => {
  return (
    <a
    href={link}
    target="_blank"
      className={`vendor-card p-3 ${active && "selected-vendor-card"}`}
      onClick={onSelect}
    >
      <div className="d-flex align-items-start justify-content-between gap-2 gap-lg-0">
        {activeLink ? (
          <a href={link} target={"_blank"} className="vendor-image-wrapper">
            <img
              src={`https://cdn.worldofdypians.com/tools/${logo}`}
              width={64}
              height={64}
              alt=""
            />
          </a>
        ) : (
          <img
            src={`https://cdn.worldofdypians.com/tools/${logo}`}
            width={64}
            height={64}
            alt=""
          />
        )}
        <span className="video-amount">{videoAmount}</span>
      </div>
      <h6 className="vendor-title mt-2">{title}</h6>
      <hr className="form-divider my-2" style={{ height: "2px" }} />
      {/* <div className="d-flex align-items-center justify-content-between">
        <span className="tutorial-text">View video tutorials</span>
        <img
          src={'https://cdn.worldofdypians.com/tools/filledArrow.svg'}
          alt=""
        />
      </div> */}
    </a>
  );
};

export default VendorCard;
