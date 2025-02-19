import React, { useState, useEffect } from "react";
import axios from "axios";
import ToolTip from "./ToolTip";
import OutsideClickHandler from "react-outside-click-handler";
 
const OtherNews = ({
  image,
  link,
  title,
  date,
  year,
  month,
  onOtherNewsClick,
  newsId,
  upvotes,
  downvotes,
  onUpVoteClick,
  onDownVoteClick,
  isConnected,
  onHandlePressDownvote,
  onVotesFetch,
  onHandlePressUpvote,
  isPremium,
  coinbase,
  fulldate,
  bal1,
  bal2,
  bal3,
  bal4,
  bal5,
  bal6,
}) => {
  const [likeIndicator, setLikeIndicator] = useState(false);
  const [dislikeIndicator, setDislikeIndicator] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [alreadyVoted, setalreadyVoted] = useState(false);
  const [canVote, setCanVote] = useState(false);
  const [upvote, setUpvote] = useState(upvotes);
  const [downvote, setDownvote] = useState(downvotes);

  const logout = localStorage.getItem("logout");

  useEffect(()=>{
    setUpvote(upvotes)
    setDownvote(downvotes)
  },[upvotes, downvotes])

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
      (bal1 !== "0" ||
        bal2 !== "0" ||
        bal3 !== "0" ||
        bal4 !== "0" ||
        bal5 !== "0" ||
        bal6 !== "0") &&
      isPremium === true
    ) {
      setCanVote(true);
    }else if (
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

  const handleLikeStates = () => {
    if (
      logout === "false" &&
      (bal1 !== "0" ||
        bal2 !== "0" ||
        bal3 !== "0" ||
        bal4 !== "0" ||
        bal5 !== "0" ||
        bal6 !== "0" ||
        isPremium !== false)
    ) {
      
      checkUpVoting(newsId);
    }  
   else if (
      (bal1 === "0" &&
        bal2 === "0" &&
        bal3 === "0" &&
        bal4 === "0" &&
        bal5 === "0" &&
        bal6 === "0" &&
        isPremium === false) ||
      logout === "true" 
    ) {
      setLikeIndicator(false);
      setShowTooltip(true);
      setDislikeIndicator(false);
    } else {
      if (likeIndicator === true) {
        setLikeIndicator(false);
        // onDownVoteClick(newsId);
      } else if (likeIndicator === false) {
        setLikeIndicator(true);
        setDislikeIndicator(false);
        // onUpVoteClick(newsId);
      }
    }
  };

  const handleDisLikeStates = () => {
    if (
      logout === "false" &&
      (bal1 !== "0" ||
        bal2 !== "0" ||
        bal3 !== "0" ||
        bal4 !== "0" ||
        bal5 !== "0" ||
        bal6 !== "0" ||
        isPremium !== false)
    ) {
      checkDownVoting(newsId);
    } else if (
      (bal1 === "0" &&
        bal2 === "0" &&
        bal3 === "0" &&
        bal4 === "0" &&
        bal5 === "0" &&
        bal6 === "0" &&
        isPremium === false) ||
      logout === "true" 
    ) {
      setLikeIndicator(false);
      setShowTooltip(true);
    } else {
      if (dislikeIndicator === true) {
        setDislikeIndicator(false);
        // onUpVoteClick(newsId);
      } else if (dislikeIndicator === false) {
        // onDownVoteClick(newsId);
        setDislikeIndicator(true);
        setLikeIndicator(false);
      }
    }
  };

  const checkUpVoting = async (itemId) => {
    return await axios
      .get(
        `https://news-manage.dyp.finance/api/v1/vote/${itemId}/${coinbase}/up`
      )
      .then((data) => {
        
        if (data.data.status === "success") {
          setUpvote(upvotes + 1);
          setShowTooltip(false);
          setLikeIndicator(true)
        } else if (data.data.status === "already voted") {
          setalreadyVoted(true);
          setUpvote(upvotes);
          setShowTooltip(true);
          setLikeIndicator(false);
        } else {
          setalreadyVoted(false);
          setShowTooltip(false);
          setLikeIndicator(false);
        }
      })
      .catch(console.error);
  };

  const checkDownVoting = async (itemId) => {
    return await axios
      .get(
        `https://news-manage.dyp.finance/api/v1/vote/${itemId}/${coinbase}/down`
      )
      .then((data) => {
        if (data.data.status === "success") {
          setShowTooltip(false)
          setDownvote(downvotes + 1);
          setLikeIndicator(true)
        } else  if (data.data.status === "already voted") {
          setalreadyVoted(true)
          setDownvote(downvotes);
          setLikeIndicator(false);
        } else {
          setalreadyVoted(false);
          setLikeIndicator(false);
          setDislikeIndicator(false);
        }
      })
      .catch(console.error);
  };

  var options = { year: "numeric", month: "short", day: "numeric" };

  const formattedDate = new Date(fulldate);


  return (
    <div
      className="other-news-singlewrapper w-100"
      onClick={() => {
        onOtherNewsClick(newsId);
        setLikeIndicator(false);
        setDislikeIndicator(false);
      }}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <img src={image} alt="" className="other-news-image" />
        <div
          // style={{ padding: 12, gap: 10, height: "40%" }}
          className="d-flex othernews-content flex-column justify-content-between p-3 gap-4"
        >
          {/* <a href={link} target={"_blank"}> */}
          <h4 className="singlenews-title">{title}</h4>
          {/* </a> */}
          <div
            className="news-bottom-wrapper"
            style={{ justifyContent: "space-between" }}
          >
            <div className="d-flex align-items-center justify-content-center gap-2 position-relative">
              <img
                src={
                  likeIndicator === false && dislikeIndicator === false
                    ? 'https://cdn.worldofdypians.com/tools/passiveUpvote.svg'
                    : dislikeIndicator === true
                    ? 'https://cdn.worldofdypians.com/tools/activeDownvote.svg'
                    : 'https://cdn.worldofdypians.com/tools/passiveUpvote.svg'
                }
                alt=""
                className="like-indicator"
                onClick={(e) => {
                  handleLikeStates();
                  e.stopPropagation();
                  // console.log(upvotes, downvotes);
                }}
              />

              <span className="votes-amount d-none">
                {" "}
                {Number(upvote) - Number(downvote)}
              </span>
              <img
                style={{ transform: "rotate(0deg)" }}
                src={
                  likeIndicator === false && dislikeIndicator === false
                  ? 'https://cdn.worldofdypians.com/tools/passiveDownvote.svg'
                  : dislikeIndicator === true
                  ? 'https://cdn.worldofdypians.com/tools/activeDownvote.svg'
                  : 'https://cdn.worldofdypians.com/tools/passiveDownvote.svg'
                }
                alt=""
                className="like-indicator"
                id="dislike"
                onClick={(e) => {
                  handleDisLikeStates();
                  e.stopPropagation();
                }}
              />
              {showTooltip === true ? (
                <OutsideClickHandler
                  onOutsideClick={() => {
                    setShowTooltip(false);
                  }}
                >
                  <ToolTip
                    status={
                      logout === "false" && canVote === false
                        ? "You need to be holding DYPv1 or DYPv2 to vote"
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
            </div>
            {/* <img
              src={theme === "theme-dark" ? WhiteDots : Dots}
              alt=""
              style={{ width: "auto" }}
            /> */}
            <div className="date-wrapper">
              <img src={'https://cdn.worldofdypians.com/tools/calendar.svg'} alt="calendar" />
              <span className="news-date-text">
                {formattedDate.toLocaleDateString("en-US", options)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherNews;
