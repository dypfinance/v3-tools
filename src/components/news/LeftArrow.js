import React from "react";
import Arrow from "../../assets/arrow.svg";

const LeftArrow = () => {
  return (
    <div>
      <img src={Arrow} alt="" style={{ position: "relative", cursor: 'pointer', transform: 'rotate(180deg)' }} />
    </div>
  );
};

export default LeftArrow;
