import { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import './_alloxpopup.scss';

const AlloxPopup = () => {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  setTimeout(() => {
    if (count === 0) {
      setActive(true);
      setCount(1);
    }
  }, 500);

  const html = document.querySelector("html");

  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  useEffect(() => {
    if (active === true) {
      html.classList.add("hidescroll");
    } else {
      html.classList.remove("hidescroll");
    }
  }, [active]);

  return (
    <OutsideClickHandler onOutsideClick={() => setActive(false)}>
      <div
        id="popup"
        className={`popup-wrapper ${active && "popup-active"} p-3`}
      >
        <div className="d-flex pt-3 pe-3 align-items-center justify-content-end w-100 close-wrapper">
          <img
            src={"https://cdn.worldofdypians.com/dypius/closePopup.svg"}
            onClick={() => setActive(false)}
            width={20}
            height={20}
            alt="close"
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="d-flex flex-column gap-3 justify-content-center align-items-center px-4">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex align-items-center justify-content-center mb-2 allox-popup-title-wrapper gap-2 p-2 px-4">
              <h6 className="allox-popup-title mb-0 text-center">
                Allox is now{" "}
                <span
                  className="allox-popup-title mb-0"
                  style={{ color: "#7770E0" }}
                >
                  Live
                </span>
              </h6>
            </div>
            <span className="allox-popup-span mb-0 mt-3">
              Reinventing the way the world connects with finance, unlocking a
              smarter and more unified future.
            </span>
          </div>
          <img
            src={`https://cdn.allox.ai/allox/alloxPopup.svg`}
            className="allox-popup-image basepopup my-3"
            alt="Allox Banner"
          />
          <div className="allox-popup-second-wrapper d-flex align-items-center justify-content-center p-2">
            <h6 className="allox-popup-desc mb-0">Bridging TradFi & DeFi</h6>
          </div>
          <div className="d-flex align-items-center gap-2 mt-3">
            <a
              href="https://x.com/alloxdotai"
              target={"_blank"}
              onClick={() => setActive(false)}
            >
              <button className="btn py-2 px-3 allox-black-btn  d-flex align-items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                >
                  <path
                    d="M14.1563 0H16.9141L10.8906 6.88281L17.9766 16.25H12.4297L8.08203 10.5703L3.11328 16.25H0.351562L6.79297 8.88672L0 0H5.6875L9.61328 5.19141L14.1563 0ZM13.1875 14.6016H14.7148L4.85547 1.5625H3.21484L13.1875 14.6016Z"
                    fill="white"
                  />
                </svg>
                Follow
              </button>
            </a>
            <a
              href="https://allox.ai/"
              target={"_blank"}
              onClick={() => setActive(false)}
            >
              <button className="btn py-2 px-3 allox-white-btn d-flex align-items-center gap-2">
                Website
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M3.98438 10H15.651"
                    stroke="#0F172A"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10 4.16602L15.8333 9.99935L10 15.8327"
                    stroke="#0F172A"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </a>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default AlloxPopup;
