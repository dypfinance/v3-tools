import React from "react";
import Arrow from "../../assets/arrow.svg";

const SvgArrow = () => {
  return (
    <div>
      <img src={Arrow} alt="" style={{ position: "relative",  cursor: 'pointer' }} />
    </div>
  );
};

export default SvgArrow;
