import React, { useState, useEffect } from "react"; 

const MainNews = ({
  link,
  image,
  title,
  month,
  day,
  year,
  onShowModalClick,
  newsId,
  upvotes,
  downvotes,
  onUpVoteClick,
  isConnected,
  onDownVoteClick,
  isPremium,
  onVotesFetch,
  coinbase,
  bal1,
  bal2,
  bal3,
  bal4,
  bal5,
  bal6,
}) => {
  const [likeIndicator, setLikeIndicator] = useState(false);
  const [dislikeIndicator, setDislikeIndicator] = useState(false);
  const [alreadyVoted, setalreadyVoted] = useState(true);
  const [canVote, setCanVote] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [upvote, setUpvote] = useState(upvotes);
  const [downvote, setDownvote] = useState(downvotes);
  const [bannerShadow, setBannerShadow] = useState(false);

  const logout = localStorage.getItem("logout");

  useEffect(() => {
    if (
      bal1 === "0" &&
      bal2 === "0" &&
      bal3 === "0" &&
      bal4 === "0" &&
      bal5 === "0" &&
      bal6 === "0" &&
      isPremium === true
    ) {
      setCanVote(true);
    } else if (
      bal1 !== "0" &&
      bal2 !== "0" &&
      bal3 !== "0" &&
      bal4 !== "0" &&
      bal5 !== "0" &&
      bal6 !== "0" &&
      isPremium === true
    ) {
      setCanVote(true);
    } else if (
      (bal1 !== "0" ||
        bal2 !== "0" ||
        bal3 !== "0" ||
        bal4 !== "0" ||
        bal5 !== "0" ||
        bal6 !== "0") &&
      isPremium === false
    ) {
      setCanVote(true);
    }else if (
      (bal1 !== "0" ||
        bal2 !== "0" ||
        bal3 !== "0" ||
        bal4 !== "0" ||
        bal5 !== "0" ||
        bal6 !== "0") &&
      isPremium === true
    ) {
      setCanVote(true);
    } else if (
      bal1 === "0" &&
      bal2 === "0" &&
      bal3 !== "0" &&
      isPremium === false
    ) {
      setCanVote(false);
    } else if (logout === "true") {
      setCanVote(false);
    }
  }, [
    alreadyVoted,
    bal1,
    bal2,
    bal3,
    bal4,
    bal5,
    bal6,
    isPremium,
    logout,
    coinbase,
  ]);

  var options = { year: "numeric", month: "short", day: "numeric" };

  const formattedDate = new Date(day);

  return (
    <div className="main-news-image" key={newsId}>
      <div className="banner-item">
        {/* <a target="_blank" href={link}> */}
        <div className="main-image position-relative">
          <div className="d-flex align-items-center gap-2 main-date-item">
            <img src={'https://cdn.worldofdypians.com/tools/calendar.svg'} alt="calendar" />
            <span className="news-date-text">
              {formattedDate.toLocaleDateString("en-US", options)}
            </span>
          </div>
          <img
            src={'https://cdn.worldofdypians.com/tools/featuredNewsShadow.png'}
            alt=""
            className={`featured-shadow w-100 ${
              bannerShadow && "featured-shadow-hover"
            }`}
          />
          <img
            src={image}
            alt="Image not found"
            className="news-image"
            onMouseEnter={() => setBannerShadow(true)}
            onMouseLeave={() => setBannerShadow(false)}
            onClick={(e) => {
              e.preventDefault();
              onShowModalClick();
            }}
          />
          <div className="tag-wrapper">
            <div className="d-flex" style={{ gap: 10 }}>
              <h2
                className="main-title-text"
                onClick={(e) => {
                  e.preventDefault();
                  onShowModalClick();
                }}
              >
                {title}
              </h2>
            </div>
          </div>

          {/* <div className="news-bottom-wrapper mt-3 justify-content-between">
          <div className="like-wrapper">
            <img
              src={
                likeIndicator === false && dislikeIndicator === false
                  ? VotePassive
                  : likeIndicator === true
                  ? Upvote
                  : VotePassive
              }
              alt=""
              className="like-indicator"
              onClick={() => {
                handleLikeStates();
              }}
            />
            <span> {Number(upvotes) - Number(downvotes)}</span>
            {showTooltip === true ? (
              <OutsideClickHandler
                onOutsideClick={() => {
                  setShowTooltip(false);
                }}
              >
                <ToolTip
                  bottom={0}
                  left={"auto"}
                  status={
                    logout === "false" && canVote === false
                      ? "You need to be holding DYP to vote"
                      : logout === "true"
                      ? "Please connect your wallet"
                      : alreadyVoted === true && canVote === true
                      ? "You have already voted"
                      : "You have already voted"
                  }
                />
              </OutsideClickHandler>
            ) : (
              <></>
            )}
            <img
              src={
                likeIndicator === false && dislikeIndicator === false
                  ? VotePassive
                  : dislikeIndicator === true
                  ? Downvote
                  : VotePassive
              }
              alt=""
              className="like-indicator"
              id="dislike"
              onClick={() => {
                handleDisLikeStates();
              }}
            />
          </div>

          <div className="date-wrapper">
            <img src={Clock} alt="" style={{ width: "auto" }} />
            <h6 className="date-content">
              {month} {day} {year}
            </h6>
          </div>
        </div> */}
        </div>

        {/* </a> */}
      </div>
    </div>
  );
};

export default MainNews;
