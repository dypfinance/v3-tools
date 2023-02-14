import React, { useEffect, useState } from "react";
import metamaskVideo from "../../assets/earnAssets/metamaskVideo.png";
import stakeVideo from "./comingsoon.svg";
import axios from "axios";
import arrowActive from "./assets/arrowActive.svg";
import arrowPassive from "./assets/arrowPassive.svg";

import Collapse from "react-bootstrap/Collapse";

const BridgeFAQ = ({faqIndex}) => {
  const categories = [
    {
      id: "63488995062d4b709c4a2535",
      title: "Bridge",
      icon: "bridge",
    },
  ];

  const [faqItems, setFaqItems] = useState([]);
  const [faqTitle, setFaqTitle] = useState("");
  const [open, setOpen] = useState(faqIndex);

  const fetchFaq = async (category) => {
    await axios
      .get(`https://news-manage.dyp.finance/api/faqs/${category.id}`)
      .then((res) => {
        setFaqItems(res.data);
        setFaqTitle(category.title);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchFaq(categories[0]);
  }, []);

  return (
    <div id="bridgeFaq" className="row mx-0 flex-column-reverse gap-4 gap-lg-0 flex-lg-row w-100 my-5 p-0 faq-container justify-content-between">
      <div className="col-12 col-lg-7 px-0 px-lg-2 ps-xl-0">
        <h3 className="mb-3" style={{ color: "#f7f7fc" }}>
          {faqTitle} FAQs
        </h3>
        <div className="faq-items-container p-3">
          {faqItems.map((faqItem, index) => (
            <div key={index} className="faqwrapper">
              <h2 id="headingOne">
                <button
                  onClick={() => setOpen(open === index ? -1 : index)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                  className={
                    open === index && index !== -1
                      ? "headingtitle-active"
                      : "headingtitle-passive"
                  }
                  style={{
                    borderRadius:
                      index === -1
                        ? 0
                        : index === 0
                        ? "8px 8px 0 0"
                        : index === faqItems.length - 1
                        ? "0 0 8px 8px"
                        : 0,
                  }}
                >
                  {faqItem.title}
                  <img
                    src={
                      open === -1
                        ? arrowPassive
                        : open === index
                        ? arrowActive
                        : arrowPassive
                    }
                    alt=""
                  />
                </button>
              </h2>
              {open === index ? (
                <Collapse in={open < 0 ? false : true}>
                  <div
                    id="example-collapse-text"
                    dangerouslySetInnerHTML={{ __html: faqItem.content }}
                  ></div>
                </Collapse>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="col-12 col-lg-5 px-0 px-lg-2 pe-xl-0">
        <h3 className="mb-3" style={{ color: "#f7f7fc" }}>
          Video guide
        </h3>
        <div className="video-container p-3">
          <div className="video-item">
            <div className="video-wrapper position-relative">
            <img src={stakeVideo} alt="" className="video" />
            </div>
            <p style={{ color: "#7a81b4", fontSize: "13px" }}>How to set up</p>
            <h5 style={{ color: "#C0CBF7", fontSize: "17px" }}>
              DYP for Metamask
            </h5>
          </div>
          <div className="video-item">
            <div className="video-wrapper position-relative">
              <img src={stakeVideo} alt="" className="video" />
            </div>
            <p style={{ color: "#7a81b4", fontSize: "13px" }}>How to stake</p>
            <h5 style={{ color: "#C0CBF7", fontSize: "17px" }}>
              DYP for Stake
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgeFAQ;
