import React, { useState } from "react";
import "./games.scss";
import getFormattedNumber from "../../functions/get-formatted-number";
import { handleSwitchNetworkhook } from "../../functions/hooks";
import winConfetti from "./assets/winConfetti.png";
import NewChestItem from "./NewChestItem";
import useWindowSize from "../../functions/useWindowSize";
import danger from "./assets/danger.svg";
import warning from "./assets/warning.svg";
import baseLogo from "./assets/baseLogo.svg";
import stoneCrack from "./assets/stoneCrack.svg";
import mainChest from "./assets/mainChest.webp";
import kittyDash from "./assets/kittyDash.webp";
import stoneCrackBanner from "./assets/stoneCrack.webp";
import cawsAdventures from "./assets/cawsAdventures.webp";

const Games = ({
  handleConnection,
  isConnected,
  networkId,
  handleSwitchNetwork,
  coinbase,
  isPremium,
  dummypremiumChests,
  bnbImages,
}) => {
  const [chain, setChain] = useState("bnb");
  const [message, setMessage] = useState("");
  const [rewardData, setRewardData] = useState([]);
  const [isActive, setIsActive] = useState();
  const [isActiveIndex, setIsActiveIndex] = useState();
  const [claimingChest, setClaimingChest] = useState(false);
  const [selectedChest, setSelectedChest] = useState(null);
  const [disable, setDisable] = useState(false);

  const handleBasePool = async () => {
    await handleSwitchNetworkhook("0x2105")
      .then(() => {
        handleSwitchNetwork("8453");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const windowSize = useWindowSize();

  const dummyRewards = [
    {
      title: "Points",
      amount: "Points",
      img: "points",
      error: true,
      threshold: [1, 200000],
    },
    {
      title: "Money",
      amount: "$0.5 - $5",
      img: 2,
      error: false,
      threshold: [],
      min: 0.5,
      max: 5,
    },
    {
      title: "Money",
      amount: "$15-$20",
      img: 5,
      error: true,
      threshold: [],
      min: 15,
      max: 20,
    },
    {
      title: "Money",
      amount: "$20-$30",
      img: 30,
      error: false,
      threshold: [],
      min: 20,
      max: 30,
    },
  ];

  return (
    <div className="container-lg p-0">
      <div className="games-banner d-flex flex-column flex-lg-row px-4 py-3 gap-3 gap-lg-0 align-items-center mb-4">
        <div className="col-12 col-lg-6">
          <div className="d-flex flex-column gap-2">
            <h6 className="migration-banner-title mb-0">Games on Base</h6>
            <p className="migration-banner-desc mb-0">
              Experience the best of gaming on Base, with a variety of fun and
              engaging minigames. Whether you prefer puzzles, action-packed
              challenges, or casual games, Base has something for everyone to
              enjoy.
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-6 position-relative">
          <div className="leaderboard-wrapper">
            <div className="d-flex gap-2 position-relative">
              <div className="d-flex align-items-center justify-content-center position-relative">
                <img src={stoneCrackBanner} alt="" />
                <div className="d-flex flex-column position-absolute rankwrapper">
                    <h6 className="rank-text-stone text-center">Rank</h6>
                    <h6 className="rank-value-stone text-center">1,250</h6>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center position-relative">
                <img src={kittyDash} alt="" />
                <div className="d-flex flex-column position-absolute rankwrapper">
                    <h6 className="rank-text-dash text-center">Rank</h6>
                    <h6 className="rank-value-dash text-center">250</h6>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center position-relative">
                <img src={cawsAdventures} alt="" />
                <div className="d-flex flex-column position-absolute rankwrapper">
                    <h6 className="rank-text-caws text-center">Rank</h6>
                    <h6 className="rank-value-caws text-center">50</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="game-wrapper-container p-3">
        <div className="d-flex flex-column-reverse flex-lg-row gap-3">
          <div className="col-lg-5 left-games-banner">
            <div className="d-flex flex-column justify-content-between gap-0 gap-lg-3">
              <div className="chest-wrapper grid-overall-wrapper p-2">
                <div className="new-chests-grid">
                  {[...Array(20)].map((item, index) => (
                    <NewChestItem
                      coinbase={coinbase}
                      claimingChest={claimingChest}
                      setClaimingChest={setClaimingChest}
                      buyNftPopup={false}
                      chainId={networkId}
                      chain={chain}
                      key={index}
                      item={item}
                      image={bnbImages[index]}
                      // openChest={openChest}
                      selectedChest={selectedChest}
                      isPremium={isPremium}
                      //   onClaimRewards={(value) => {
                      //     setLiveRewardData(value);
                      //     onChestClaimed();
                      //     showLiveRewardData(value);
                      //     setIsActive(item.chestId);
                      //     setIsActiveIndex(index + 1);
                      //   }}
                      //   handleShowRewards={(value, value2) => {
                      //     showSingleRewardData(value, value2);
                      //     setIsActive(value);
                      //     setIsActiveIndex(index + 1);
                      //   }}
                      onLoadingChest={(value) => {
                        setDisable(value);
                      }}
                      onChestStatus={(val) => {
                        setMessage(val);
                      }}
                      address={coinbase}
                      email={"email"}
                      rewardTypes={index >= 10 ? "premium" : "standard"}
                      chestId={index + 1}
                      chestIndex={index + 1}
                      open={false}
                      disableBtn={disable}
                      isActive={isActive}
                      isActiveIndex={isActiveIndex}
                      dummypremiumChests={
                        dummypremiumChests[index - 10]?.closedImg
                      }
                      //   binanceW3WProvider={binanceW3WProvider}
                    />
                  ))}
                </div>
              </div>

              <div className="col-12 p-2 pt-0 mt-0 message-height-wrapper">
                {message === "" ||
                message === "initial" ||
                message === "waiting" ? (
                  <div
                    className="d-flex align-items-center flex-column justify-content-center p-0 p-lg-2 w-100 chest-progress-wrapper"
                    style={{
                      background: "rgba(33, 31, 69,0.8)",
                      border: "1px solid #10C5C5",
                    }}
                  >
                    <div
                      className={`loader ${
                        message === "waiting" && "loader-waiting"
                      }`}
                    >
                      <div className="dot" style={{ "--i": 0 }}></div>
                      <div className="dot" style={{ "--i": 1 }}></div>
                      <div className="dot" style={{ "--i": 2 }}></div>
                      <div className="dot" style={{ "--i": 3 }}></div>
                      <div className="dot" style={{ "--i": 4 }}></div>
                      <div className="dot" style={{ "--i": 5 }}></div>
                      <div className="dot" style={{ "--i": 6 }}></div>
                      <div className="dot" style={{ "--i": 7 }}></div>
                      <div className="dot" style={{ "--i": 8 }}></div>
                      <div className="dot" style={{ "--i": 9 }}></div>
                    </div>
                    <h6 className="loader-text mb-0">
                      {message === "waiting" ? "Processing" : "Ready to claim"}
                    </h6>
                    <div
                      className={`loader ${
                        message === "waiting" && "loader-waiting-2"
                      }`}
                    >
                      <div className="dot" style={{ "--i": 0 }}></div>
                      <div className="dot" style={{ "--i": 1 }}></div>
                      <div className="dot" style={{ "--i": 2 }}></div>
                      <div className="dot" style={{ "--i": 3 }}></div>
                      <div className="dot" style={{ "--i": 4 }}></div>
                      <div className="dot" style={{ "--i": 5 }}></div>
                      <div className="dot" style={{ "--i": 6 }}></div>
                      <div className="dot" style={{ "--i": 7 }}></div>
                      <div className="dot" style={{ "--i": 8 }}></div>
                      <div className="dot" style={{ "--i": 9 }}></div>
                    </div>
                  </div>
                ) : message === "switch" ? (
                  <div
                    className="d-flex align-items-center flex-column justify-content-center p-0 p-lg-2 w-100 chest-progress-wrapper"
                    style={{
                      background: "#1A1C39",
                      border: "1px solid #ce5d1b",
                    }}
                  >
                    <div className="loader red-loader">
                      <div className="dot" style={{ "--i": 0 }}></div>
                      <div className="dot" style={{ "--i": 1 }}></div>
                      <div className="dot" style={{ "--i": 2 }}></div>
                      <div className="dot" style={{ "--i": 3 }}></div>
                      <div className="dot" style={{ "--i": 4 }}></div>
                      <div className="dot" style={{ "--i": 5 }}></div>
                      <div className="dot" style={{ "--i": 6 }}></div>
                      <div className="dot" style={{ "--i": 7 }}></div>
                      <div className="dot" style={{ "--i": 8 }}></div>
                      <div className="dot" style={{ "--i": 9 }}></div>
                    </div>

                    <h6
                      className="loader-text mb-0"
                      style={{ color: "#ce5d1b" }}
                    >
                      Switch to{" "}
                      <span
                        span
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        onClick={handleBasePool}
                      >
                        BASE
                      </span>{" "}
                    </h6>

                    <div className="loader red-loader">
                      <div className="dot" style={{ "--i": 0 }}></div>
                      <div className="dot" style={{ "--i": 1 }}></div>
                      <div className="dot" style={{ "--i": 2 }}></div>
                      <div className="dot" style={{ "--i": 3 }}></div>
                      <div className="dot" style={{ "--i": 4 }}></div>
                      <div className="dot" style={{ "--i": 5 }}></div>
                      <div className="dot" style={{ "--i": 6 }}></div>
                      <div className="dot" style={{ "--i": 7 }}></div>
                      <div className="dot" style={{ "--i": 8 }}></div>
                      <div className="dot" style={{ "--i": 9 }}></div>
                    </div>
                  </div>
                ) : message === "notsupported" ? (
                  <div
                    className="d-flex align-items-center flex-column justify-content-center p-0 p-lg-2 w-100 chest-progress-wrapper"
                    style={{
                      background: "#1A1C39",
                      border: "1px solid #ce5d1b",
                    }}
                  >
                    <div className="loader red-loader">
                      <div className="dot" style={{ "--i": 0 }}></div>
                      <div className="dot" style={{ "--i": 1 }}></div>
                      <div className="dot" style={{ "--i": 2 }}></div>
                      <div className="dot" style={{ "--i": 3 }}></div>
                      <div className="dot" style={{ "--i": 4 }}></div>
                      <div className="dot" style={{ "--i": 5 }}></div>
                      <div className="dot" style={{ "--i": 6 }}></div>
                      <div className="dot" style={{ "--i": 7 }}></div>
                      <div className="dot" style={{ "--i": 8 }}></div>
                      <div className="dot" style={{ "--i": 9 }}></div>
                    </div>
                    <h6
                      className="loader-text mb-0"
                      style={{ color: "#ce5d1b" }}
                    >
                      Not available
                    </h6>
                    <div className="loader red-loader">
                      <div className="dot" style={{ "--i": 0 }}></div>
                      <div className="dot" style={{ "--i": 1 }}></div>
                      <div className="dot" style={{ "--i": 2 }}></div>
                      <div className="dot" style={{ "--i": 3 }}></div>
                      <div className="dot" style={{ "--i": 4 }}></div>
                      <div className="dot" style={{ "--i": 5 }}></div>
                      <div className="dot" style={{ "--i": 6 }}></div>
                      <div className="dot" style={{ "--i": 7 }}></div>
                      <div className="dot" style={{ "--i": 8 }}></div>
                      <div className="dot" style={{ "--i": 9 }}></div>
                    </div>
                  </div>
                ) : message === "error" ? (
                  <div
                    className="d-flex align-items-center flex-column justify-content-center p-0 p-lg-2 w-100 chest-progress-wrapper"
                    style={{
                      background: "#1A1C39",
                      border: "1px solid #D75853",
                    }}
                  >
                    <div className="loader red-loader">
                      <div className="dot" style={{ "--i": 0 }}></div>
                      <div className="dot" style={{ "--i": 1 }}></div>
                      <div className="dot" style={{ "--i": 2 }}></div>
                      <div className="dot" style={{ "--i": 3 }}></div>
                      <div className="dot" style={{ "--i": 4 }}></div>
                      <div className="dot" style={{ "--i": 5 }}></div>
                      <div className="dot" style={{ "--i": 6 }}></div>
                      <div className="dot" style={{ "--i": 7 }}></div>
                      <div className="dot" style={{ "--i": 8 }}></div>
                      <div className="dot" style={{ "--i": 9 }}></div>
                    </div>
                    <h6
                      className="loader-text mb-0"
                      style={{ color: "#D75853" }}
                    >
                      Something went wrong. Try again.
                    </h6>
                    <div className="loader red-loader">
                      <div className="dot" style={{ "--i": 0 }}></div>
                      <div className="dot" style={{ "--i": 1 }}></div>
                      <div className="dot" style={{ "--i": 2 }}></div>
                      <div className="dot" style={{ "--i": 3 }}></div>
                      <div className="dot" style={{ "--i": 4 }}></div>
                      <div className="dot" style={{ "--i": 5 }}></div>
                      <div className="dot" style={{ "--i": 6 }}></div>
                      <div className="dot" style={{ "--i": 7 }}></div>
                      <div className="dot" style={{ "--i": 8 }}></div>
                      <div className="dot" style={{ "--i": 9 }}></div>
                    </div>
                  </div>
                ) : message === "complete" ? (
                  <div className="d-flex align-items-center justify-content-center complete-bg p-0 p-lg-2 w-100 chest-progress-wrapper">
                    <h6 className="completed-text mb-0">Completed</h6>
                  </div>
                ) : message === "won" ? (
                  <div className="d-flex align-items-center position-relative flex-column flex-lg-row justify-content-between p-0 p-lg-2 w-100 chest-progress-wrapper">
                    <div
                      className="chain-desc-wrapper p-2 d-flex flex-column"
                      style={{
                        filter: "brightness(1)",
                        position: "relative",
                      }}
                    >
                      <h6 className="win-text mb-0">You Won</h6>
                    </div>
                    <div className="d-flex align-items-center gap-2 win-rewards-container">
                      <div className="d-flex flex-column align-items-center neutral-border p-1">
                        <h6 className="win-amount mb-0">
                          {getFormattedNumber(
                            rewardData.rewards
                              ? rewardData.rewards.find((obj) => {
                                  return obj.rewardType === "Points";
                                }).reward
                              : 0,
                            0
                          )}
                        </h6>

                        <span className="win-amount-desc">
                          Leaderboard Points
                        </span>
                      </div>
                      <h6 className="win-amount mb-0">+</h6>
                      <div className="d-flex flex-column align-items-center p-1">
                        <h6 className="win-amount mb-0">
                          $
                          {getFormattedNumber(
                            rewardData.rewards
                              ? rewardData.rewards.find((obj) => {
                                  return obj.rewardType === "Money";
                                }).reward
                              : 0,
                            2
                          )}
                        </h6>

                        <span className="win-amount-desc">Rewards</span>
                      </div>
                    </div>

                    <img src={winConfetti} alt="" className="win-confetti" />
                  </div>
                ) : message === "wonPoints" ? (
                  <div className="d-flex align-items-center position-relative flex-column flex-lg-row justify-content-between p-0 p-lg-2 w-100 chest-progress-wrapper">
                    <div
                      className="chain-desc-wrapper p-2 d-flex flex-column"
                      style={{
                        filter: "brightness(1)",
                        position: "relative",
                      }}
                    >
                      <h6 className="win-text mb-0">You Won</h6>
                    </div>
                    <div className="d-flex align-items-center gap-2 win-rewards-container">
                      <div className="d-flex flex-column align-items-center neutral-border p-1">
                        <h6 className="win-amount mb-0">
                          {getFormattedNumber(
                            rewardData.rewards
                              ? rewardData.rewards.find((obj) => {
                                  return obj.rewardType === "Points";
                                }).reward
                              : 0,
                            0
                          )}
                        </h6>
                        <span className="win-amount-desc">
                          Leaderboard Points
                        </span>
                      </div>
                    </div>

                    <img src={winConfetti} alt="" className="win-confetti" />
                  </div>
                ) : message === "login" ? (
                  <div
                    className="d-flex align-items-center flex-column flex-lg-row justify-content-between p-0 p-lg-2 w-100 chest-progress-wrapper"
                    style={{
                      border: "1px solid #8262D0",
                      background:
                        "linear-gradient(180deg, #8262D0 0%, #482293 100%)",
                    }}
                  >
                    <div
                      className="chain-desc-wrapper p-2 d-flex flex-column"
                      style={{
                        filter: "brightness(1)",
                        position: "relative",
                      }}
                    >
                      <h6 className="desc-title mb-0" style={{ color: "#fff" }}>
                        Sign in with Your Game Account
                      </h6>
                      <span className="chain-desc mb-0">
                        Sign in to access Daily Bonus and earn tailored rewards!
                      </span>
                    </div>
                    {/* <div className="d-flex align-items-center justify-content-end get-premium-wrapper p-3 p-lg-0">
                    <NavLink
                      className="sign-in-btn px-4 py-1"
                      to="/auth"
                      onClick={() => {
                        html.classList.remove("hidescroll");
                      }}
                    >
                      Sign In
                    </NavLink>
                  </div> */}
                  </div>
                ) : message === "comingsoon" ? (
                  <div
                    className="d-flex align-items-center flex-column justify-content-center p-0 p-lg-2 w-100 chest-progress-wrapper"
                    style={{
                      background: "#1A1C39",
                      border: "1px solid #D75853",
                    }}
                  >
                    <div className="loader red-loader">
                      <div className="dot" style={{ "--i": 0 }}></div>
                      <div className="dot" style={{ "--i": 1 }}></div>
                      <div className="dot" style={{ "--i": 2 }}></div>
                      <div className="dot" style={{ "--i": 3 }}></div>
                      <div className="dot" style={{ "--i": 4 }}></div>
                      <div className="dot" style={{ "--i": 5 }}></div>
                      <div className="dot" style={{ "--i": 6 }}></div>
                      <div className="dot" style={{ "--i": 7 }}></div>
                      <div className="dot" style={{ "--i": 8 }}></div>
                      <div className="dot" style={{ "--i": 9 }}></div>
                    </div>
                    <h6
                      className="loader-text mb-0"
                      style={{ color: "#D75853" }}
                    >
                      Coming Soon
                    </h6>
                    <div className="loader red-loader">
                      <div className="dot" style={{ "--i": 0 }}></div>
                      <div className="dot" style={{ "--i": 1 }}></div>
                      <div className="dot" style={{ "--i": 2 }}></div>
                      <div className="dot" style={{ "--i": 3 }}></div>
                      <div className="dot" style={{ "--i": 4 }}></div>
                      <div className="dot" style={{ "--i": 5 }}></div>
                      <div className="dot" style={{ "--i": 6 }}></div>
                      <div className="dot" style={{ "--i": 7 }}></div>
                      <div className="dot" style={{ "--i": 8 }}></div>
                      <div className="dot" style={{ "--i": 9 }}></div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="left-games-banner p-2">
            <div className="d-flex flex-column gap-3 h-100">
              <div className="main-image-game h-100 position-relative">
                <div className="position-absolute w-100">
                  <div className="d-flex justify-content-between align-items-center w-100 p-2">
                    <div className="base-network-wrapper p-1 d-flex align-items-center gap-2">
                      <img src={baseLogo} alt="" />{" "}
                      <span className="base-text d-none d-lg-block d-md-block d-sm-block">
                        Base Network
                      </span>
                    </div>
                    <img src={stoneCrack} alt="" />
                  </div>
                </div>
                <img src={mainChest} alt="" className="h-100" />
              </div>
              <div className="rewards-bottom-wrapper">
                {windowSize.width > 992 ? (
                  <div className="new-rewards-grid">
                    <div className="new-rewards-item p-2 d-flex align-items-center justify-content-center gap-2">
                      <h6 className="mb-0  new-reward-amount">Rewards</h6>
                    </div>
                    {dummyRewards.map((item, index) => (
                      <div
                        key={index}
                        className="new-rewards-item p-2 d-flex align-items-center gap-2"
                        style={{
                          filter:
                            item.title2 !== "needPremium"
                              ? (rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return (
                                      obj.rewardType === "Points" &&
                                      Number(obj.reward) <= item.threshold[1]
                                    );
                                  })) ||
                                (rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return (
                                      obj.rewardType !== "Points" &&
                                      Number(obj.reward) > item.min &&
                                      Number(obj.reward) <= item.max
                                    );
                                  }) &&
                                  message != "needPremium")
                                ? "brightness(1)"
                                : "brightness(0.5)"
                              : (rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return (
                                      obj.rewardType === "Points" &&
                                      Number(obj.reward) <= item.threshold[1]
                                    );
                                  })) ||
                                (rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return (
                                      obj.rewardType !== "Points" &&
                                      Number(obj.reward) > item.min &&
                                      Number(obj.reward) <= item.max &&
                                      message === "needPremium"
                                    );
                                  }))
                              ? "brightness(1)"
                              : "brightness(0.5)",
                        }}
                      >
                        <div className="position-relative">
                          <img
                            src={require(`./assets/${item.img}${
                              item.title2 !== "needPremium"
                                ? (rewardData &&
                                    rewardData.rewards?.find((obj) => {
                                      return (
                                        obj.rewardType === "Points" &&
                                        Number(obj.reward) <= item.threshold[1]
                                      );
                                    })) ||
                                  (rewardData &&
                                    rewardData.rewards?.find((obj) => {
                                      return (
                                        obj.rewardType !== "Points" &&
                                        Number(obj.reward) > item.min &&
                                        Number(obj.reward) <= item.max
                                      );
                                    }) &&
                                    message != "needPremium")
                                  ? "Active"
                                  : ""
                                : (rewardData &&
                                    rewardData.rewards?.find((obj) => {
                                      return (
                                        obj.rewardType === "Points" &&
                                        Number(obj.reward) <= item.threshold[1]
                                      );
                                    })) ||
                                  (rewardData &&
                                    rewardData.rewards?.find((obj) => {
                                      return (
                                        obj.rewardType !== "Points" &&
                                        Number(obj.reward) > item.min &&
                                        Number(obj.reward) <= item.max
                                      );
                                    }) &&
                                    message === "needPremium")
                                ? "Active"
                                : ""
                            }Icon.png`)}
                            width={60}
                            height={60}
                            alt=""
                          />
                          {item.title2 !== "needPremium" ? (
                            rewardData &&
                            rewardData.rewards?.find((obj) => {
                              return obj.rewardType === item.title;
                            }) &&
                            rewardData &&
                            rewardData.rewards?.find((obj) => {
                              return (
                                obj.rewardType === item.title &&
                                obj.status === "Unclaimed" &&
                                obj.reward > item.min &&
                                obj.reward <= item.max
                              );
                            }) &&
                            message !== "needPremium" ? (
                              <img
                                src={warning}
                                width={20}
                                height={20}
                                className="reward-warning"
                                alt=""
                              />
                            ) : rewardData &&
                              rewardData.rewards?.find((obj) => {
                                return obj.rewardType === item.title;
                              }) &&
                              rewardData &&
                              rewardData.rewards?.find((obj) => {
                                return (
                                  obj.rewardType === item.title &&
                                  obj.status === "Unclaimable" &&
                                  obj.reward > item.min &&
                                  obj.reward <= item.max
                                );
                              }) &&
                              message !== "needPremium" ? (
                              <img
                                src={danger}
                                width={20}
                                height={20}
                                className="reward-warning"
                                alt=""
                              />
                            ) : (
                              <></>
                            )
                          ) : rewardData &&
                            rewardData.rewards?.find((obj) => {
                              return obj.rewardType === item.title;
                            }) &&
                            rewardData &&
                            rewardData.rewards?.find((obj) => {
                              return (
                                obj.rewardType === item.title &&
                                obj.status === "Unclaimed" &&
                                obj.reward > item.min &&
                                obj.reward <= item.max
                              );
                            }) &&
                            message === "needPremium" ? (
                            <img
                              src={warning}
                              width={20}
                              height={20}
                              className="reward-warning"
                              alt=""
                            />
                          ) : rewardData &&
                            rewardData.rewards?.find((obj) => {
                              return obj.rewardType === item.title;
                            }) &&
                            rewardData &&
                            rewardData.rewards?.find((obj) => {
                              return (
                                obj.rewardType === item.title &&
                                obj.status === "Unclaimable" &&
                                obj.reward > item.min &&
                                obj.reward <= item.max
                              );
                            }) &&
                            message === "needPremium" ? (
                            <img
                              src={danger}
                              width={20}
                              height={20}
                              className="reward-warning"
                              alt=""
                            />
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="d-flex align-items-bottom gap-1">
                          <h6
                            className="mb-0  new-reward-amount"
                            style={{
                              color:
                                rewardData &&
                                rewardData.rewards?.find((obj) => {
                                  return (
                                    obj.rewardType === "Points" &&
                                    Number(obj.reward) <= item.threshold[1]
                                  );
                                })
                                  ? "#F2C624"
                                  : item.title2 !== "needPremium"
                                  ? rewardData.rewards?.find((obj) => {
                                      return (
                                        obj.rewardType === item.title &&
                                        (obj.status !== "Unclaimed" ||
                                          obj.status !== "Unclaimable") &&
                                        obj.reward > item.min &&
                                        obj.reward <= item.max
                                      );
                                    }) && message !== "needPremium"
                                    ? "#F2C624"
                                    : "#fff"
                                  : rewardData.rewards?.find((obj) => {
                                      return (
                                        obj.rewardType === item.title &&
                                        (obj.status !== "Unclaimed" ||
                                          obj.status !== "Unclaimable") &&
                                        obj.reward > item.min &&
                                        obj.reward <= item.max
                                      );
                                    }) && message === "needPremium"
                                  ? "#F2C624"
                                  : "#fff",
                            }}
                          >
                            {item.amount}
                          </h6>
                          {/* <span className="mb-0  new-reward-type">{item.title}</span> */}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
