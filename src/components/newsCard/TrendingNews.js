import React from "react"; 
import "./newscard.css";

const TrendingNews = ({ image, title, date, link }) => {
  var options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Date(date);
  return (
    <a
      href={`https://app.dypius.com/news/${link}`}
      className="newscard-wrapper d-flex"
      style={{ width: "49%" }}
    >
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-2 position-relative">
        <img src={image} alt="" className="newsimg2" />
        <div className="d-flex flex-column gap-4 justify-content-between">
          <h6 className="nc-hot-trend">
            {" "}
            <img src={'https://cdn.worldofdypians.com/tools/sparkle.svg'} alt="" /> Hot Trending
          </h6>
          <h6 className="nc-title">{title}</h6>
          <div className="d-flex m-0 justify-content-between align-items-center gap-2">
            <h6 className="nc-date">
              {" "}
              <img
                src={"https://cdn.worldofdypians.com/tools/calendar.svg"}
                alt=""
              />
              {formattedDate.toLocaleDateString("en-US", options)}
            </h6>
            <img
              src={"https://cdn.worldofdypians.com/tools/filledArrow.svg"}
              alt=""
              className=""
            />
          </div>{" "}
        </div>
      </div>
    </a>
  );
};

export default TrendingNews;
