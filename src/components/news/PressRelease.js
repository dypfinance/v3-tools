import React, { useState, useEffect } from "react";
import axios from "axios";
import ToolTip from "./ToolTip";
import OutsideClickHandler from "react-outside-click-handler";


const PressRealease = ({
  title,
  image,
  date,
  link,
  onSinglePressHighlightClick,
  isPremium,
  newsId,
  upvotes,
  downvotes,
  isConnected,
  onDownVoteClick,
  onUpVoteClick,
  onVotesFetch,
  votes,
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [alreadyVoted, setalreadyVoted] = useState(false);
  const [canVote, setCanVote] = useState(false);
  const [upvote, setUpvote] = useState(upvotes);
  const [downvote, setDownvote] = useState(downvotes);
  // const [votes, setVotes] = useState([])

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
        setLikeIndicator(false);
        setDislikeIndicator(true);
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
        } else if (data.data.status === "already voted") {
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

  const formattedDate = new Date(date);

  return (
    <div className="single-press-wrapper" onClick={onSinglePressHighlightClick}>
      <div
        className="d-flex justify-content-center flex-column flex-lg-row gap-3"
        // style={{ gap: 20, height: "100%", width: "100%" }}
      >
        <img src={image} alt="" className="press-image" />
        <div className="date-wrapper-press">
          {/* <a href={link} target="_blank"> */}
          <h6 className="press-title">{title?.slice(0, 50) + "..."}</h6>
          {/* </a> */}

          <div className="d-flex align-items-center gap-3 position-relative">
            <div className="d-flex align-items-center justify-content-center gap-2 ">
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
                }}
              />

              <span className="votes-amount d-none">
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
                  style={{ width: 195 }}
                />
              </OutsideClickHandler>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressRealease;
