import React, { useState, useEffect } from "react";
import axios from "axios";
import ToolTip from "./ToolTip";
import OutsideClickHandler from "react-outside-click-handler";

 

const SingleNews = ({
  title,
  image,
  link,
  month,
  day,
  year,
  onNewsClick,
  upvotes,
  downvotes,
  isConnected,
  onSingleUpVoteClick,
  onSingleDownVoteClick,
  fullDate,
  isPremium,
  newsId,
  onVotesFetch,
  coinbase,
  bal1,
  bal2,
  bal3,
  bal4,
  bal5,
  bal6,
  votes,
}) => {
  const [likeIndicator, setLikeIndicator] = useState(false);
  const [dislikeIndicator, setDislikeIndicator] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [alreadyVoted, setalreadyVoted] = useState(false);
  const [canVote, setCanVote] = useState(false);
  const [upvote, setUpvote] = useState(upvotes);
  const [downvote, setDownvote] = useState(downvotes);
  // const [votes, setVotes] = useState([]);

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
      setDislikeIndicator(false);
      setShowTooltip(true);
    } else {
      if (likeIndicator === true) {
        setLikeIndicator(false);
        // onSingleDownVoteClick();
      } else if (likeIndicator === false) {
        setLikeIndicator(true);
        setDislikeIndicator(false);
        // onSingleUpVoteClick();
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
      setDislikeIndicator(false);

      setShowTooltip(true);
    } else {
      if (dislikeIndicator === true) {
        setDislikeIndicator(false);
        // onSingleUpVoteClick();
      } else if (dislikeIndicator === false) {
        // onSingleDownVoteClick();
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
        console.log(data.data)
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

  // const fetchVotingdata = async () => {
  //   const result = await fetch(
  //     `https://news-manage.dyp.finance/api/v1/votes/all`
  //   )
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setVotes(data.Data);
  //     })
  //     .catch(console.error);

  //   return result;
  // };

  // useEffect(() => {
  //   fetchVotingdata();
  // }, []);

  var options = { year: "numeric", month: "short", day: "numeric" };

  const formattedDate = new Date(fullDate);


  return (
    <div className="singlenews-body">
      <div className="row m-0 justify-content-between" style={{ gap: 20 }}>
        <div className="singlenews-wrapper px-0">
          {/* <a href={link} target={"_blank"}> */}
          <h4 className="rightside-news-title" onClick={onNewsClick}>
            {title}
          </h4>
          {/* </a> */}

          {/* <div className="news-bottom-wrapper justify-content-between">
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
                onClick={(e) => {
                  handleLikeStates();
                  e.stopPropagation();
                }}
              />
              {showTooltip === true ? (
                <OutsideClickHandler
                  onOutsideClick={() => {
                    setShowTooltip(false);
                  }}
                >
                  <ToolTip status={
                    logout === "false" && canVote === false
                          ? "You need to be holding DYP to vote"
                          : logout === 'true'
                         ? "Please connect your wallet"
                         :   alreadyVoted === true && canVote === true
                         ? "You have already voted"
                         : "You have already voted"
                  }/>
                </OutsideClickHandler>
              ) : (
                <></>
              )}
            <span> {Number(upvotes) - Number(downvotes)}</span>

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
                onClick={(e) => {
                  handleDisLikeStates();
                  e.stopPropagation();
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
          <div
            className="news-bottom-wrapper"
            style={{ justifyContent: "space-between" }}
          >
            <div className="d-flex align-items-center justify-content-center gap-2 position-relative">
              <img
                src={
                  likeIndicator === false && dislikeIndicator === false
                    ? 'https://cdn.worldofdypians.com/tools/passiveUpvote.svg'
                    : likeIndicator === true
                    ? 'https://cdn.worldofdypians.com/tools/activeUpvote.svg'
                    : 'https://cdn.worldofdypians.com/tools/passiveUpvote.svg'
                }
                alt=""
                className="like-indicator"
                onClick={(e) => {
                  handleLikeStates();
                  e.stopPropagation();
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

export default SingleNews;
