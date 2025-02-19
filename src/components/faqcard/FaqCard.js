import React from "react";
import "./faqcard.css";
import { HashLink } from "react-router-hash-link";

const FaqCard = ({ option, pathName, title, section, pool, faqIndex }) => {
  return (
    <HashLink
      to={{
        pathname: pathName,
        state: {
          option: option,
          chain: "eth",
          section: section,
          pool: pool,
          faqIndex: faqIndex,
        },
      }}
      className="faq-wrapper"
    >
      <div className="d-flex gap-2 align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img
            src={"https://cdn.worldofdypians.com/tools/faqlogo.svg"}
            alt=""
          />
          <h6 className="faqtitle">{title}</h6>
        </div>
        <img
          src={"https://cdn.worldofdypians.com/tools/rightlogo.svg"}
          style={{ position: "relative", right: "5px" }}
          alt=""
        />
      </div>
    </HashLink>
  );
};

export default FaqCard;
