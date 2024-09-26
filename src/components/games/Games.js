import React, { useState, useEffect, useRef } from "react";
import "./games.scss";
import getFormattedNumber from "../../functions/get-formatted-number";
import { handleSwitchNetworkhook } from "../../functions/hooks";
import winConfetti from "./assets/winConfetti.png";
import NewChestItem from "./NewChestItem";
import useWindowSize from "../../functions/useWindowSize";
import danger from "./assets/danger.svg";
// import warning from "./assets/warning.svg";
// import baseLogo from "./assets/baseLogo.svg";
import stoneCrack from "./assets/stoneCrack.svg";
import mainChest from "./assets/mainChest.webp";
import mainChestCracked from "./assets/mainChestCracked.webp";

// import kittyDash from "./assets/kittyDash.webp";
import stoneCrackBanner from "./assets/stoneCrackBanner.png";
import cawsAdventureBanner from "./assets/cawsAdventureBanner.png";
import kittyDashBanner from "./assets/kittyDashBanner.png";
import cawsAdventures from "./assets/cawsAdventures.webp";
import Leaderboard from "../leaderboard/Leaderboard";
import pointsIcon from "./assets/pointsIcon.png";
import gemIcon from "./assets/gemIcon.png";
import spark from "./assets/spark.svg";
import leaderboardsCup from "./assets/leaderboardsCup.png";
import StoneCrackPopup from "./components/StoneCrackPopup";
import KittyDashPopup from "./components/KittyDashPopup";
import CawsAdventurePopup from "./components/CawsAdventurePopup";
import { NavLink } from "react-router-dom";
import errorSound from "./assets/error.mp3";
import crackStoneSound from "./assets/stone-crack-sound.mp3";
import crackedStoneSound from "./assets/stone-cracked-sound.mp3";
import crackedGemSound from "./assets/crackedGem.mp3";


const Games = ({
  handleConnection,
  isConnected,
  networkId,
  handleSwitchNetwork,
  coinbase,
  isPremium,
  dummypremiumChests,
  bnbImages,
  onChestClaimed,
  email,
  address,
  userId,
  chests,
  openedChests,
  monthlyplayerData,
  previousMonthlyVersion,
  previousWeeklyVersion,
  weeklyplayerData,
  previousKittyDashVersion,
  kittyDashRecords,
  fetchWeeklyWinners,
  fetchMonthlyWinners,
  fetchKittyDashWinners,
  fetchPreviousMonthlyWinners,
  fetchPreviousWeeklyWinners,
  fetchPreviousKittyDashWinners,
  kittyUser,
  weeklyUser,
  monthlyUser,
  activePlayerKitty,
  activePlayerWeekly,
  activePlayerMonthly,
  username,
  leaderboardCaws2d
}) => {
  const [chain, setChain] = useState("base");
  const [message, setMessage] = useState("");
  const [rewardData, setRewardData] = useState([]);
  // const [rockData, setRockData] = useState([]);
  const [active, setActive] = useState(false);
  const [isActive, setIsActive] = useState();
  const [isActiveIndex, setIsActiveIndex] = useState();
  const [claimingChest, setClaimingChest] = useState(false);
  const [selectedChest, setSelectedChest] = useState(null);
  const [selectedChest2, setSelectedChest2] = useState(null);
  const [openChestIds, setopenChestIds] = useState([]);

  const [liverewardData, setLiveRewardData] = useState([]);

  const [sparkles, setSparkles] = useState({
    show: false,
    position: 1,
  });
  const [disable, setDisable] = useState(false);
  const [loading, setloading] = useState(false);
  const [type, setType] = useState("stoneCrack");
  const [popups, setPopups] = useState({
    stoneCrack: false,
    kittyDash: false,
    cawsAdventure: false,
  });
  const [totalPoints, settotalPoints] = useState(0);
  const [totalUsdETH, settotalUsdETH] = useState(0);
  const [totalUsdDYP, settotalUsdDYP] = useState(0);
  const dataFetchedRef = useRef(false);
  const html = document.querySelector("html");
  const audiostart = new Audio(crackStoneSound);
  const audioerror = new Audio(errorSound);
  const audiosuccess = new Audio(crackedStoneSound);
  const audiosuccessGem = new Audio(crackedGemSound);


  const countEarnedRewards = () => {
    if (openedChests && openedChests.length > 0) {
      let resultPoints = 0;
      let resultUsdDYP = 0;
      let resultUsdETH = 0;

      openedChests.forEach((chest) => {
        if (chest.isOpened === true && chest.rewards) {
          if (chest.rewards.length > 1) {
            chest.rewards.forEach((innerChest) => {
              if (innerChest.rewardType === "Points") {
                resultPoints += Number(innerChest.reward);
              }
              if (
                innerChest.rewardType === "MoneyETH" &&
                innerChest.status === "Claimed"
              ) {
                resultUsdETH += Number(innerChest.reward);
              } else if (
                innerChest.rewardType === "MoneyDYP" &&
                innerChest.status === "Claimed"
              ) {
                resultUsdDYP += Number(innerChest.reward);
              }
            });
          } else if (chest.rewards.length === 1) {
            chest.rewards.forEach((innerChest) => {
              if (innerChest.rewardType === "Points") {
                resultPoints += Number(innerChest.reward);
              }
            });
          }
        }
      });

      settotalPoints(resultPoints);
      settotalUsdDYP(resultUsdDYP);
      settotalUsdETH(resultUsdETH);
    }
  };

  useEffect(() => {
    if (
      popups.stoneCrack === true ||
      popups.kittyDash === true ||
      popups.cawsAdventure === true ||
      active === true
    ) {
      html.classList.add("hidescroll");
    } else {
      html.classList.remove("hidescroll");
    }
  }, [popups.stoneCrack, popups.kittyDash, popups.cawsAdventure, active]);

  const handleBasePool = async () => {
    await handleSwitchNetworkhook("0x2105")
      .then(() => {
        handleSwitchNetwork("8453");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onCrackStone = (event) => {
    if (event === "start") {
      if (!audiostart.loop) {
        audiostart.loop = true;
      }
      audiostart.play();
    }
    if (event === "error") {
      if (audiostart.loop) {
        audiostart.loop = false;
      }
      audiostart.loop = false;
      audiostart.currentTime = 0;
      audiostart.pause();
      audioerror.play();
    }
    if (event === "success") {
      if (audiostart.loop) {
        audiostart.loop = false;
      }

      audiostart.loop = false;
      audiostart.currentTime = 0;
      audiostart.pause();
      audiosuccess.play();
    }
    if (event === "successGem") {

      audiostart.loop = false;
      audiostart.currentTime = 0;
      audiostart.pause();
      audiosuccessGem.play();
    }
  };

  const windowSize = useWindowSize();

  const showLiveRewardData = (value) => {
    const filteredResult = value;
    if (filteredResult && filteredResult.rewards) {
      const resultWonETH = filteredResult.rewards.find((obj) => {
        return obj.rewardType === "MoneyETH" && obj.status === "Claimed";
      });
      const resultWonDYP = filteredResult.rewards.find((obj) => {
        return obj.rewardType === "MoneyDYP" && obj.status === "Claimed";
      });

      const resultWonETHGem = filteredResult.rewards.find((obj) => {
        return obj.rewardType === "MoneyETH" && obj.status === "Unclaimable";
      });
      const resultPoints = filteredResult.rewards.length === 1;

      if (resultWonETH) {
        setMessage("woneth");
      } else if (resultWonETHGem) {
        setMessage("gem");
      } else if (resultWonDYP) {
        setMessage("wondyp");
      } else if (resultPoints) {
        setMessage("wonPoints");
      }

      setLiveRewardData(filteredResult);
      setRewardData(filteredResult);
    } else {
      setLiveRewardData([]);
    }
  };

  const showSingleRewardData = (chestID, chestIndex) => {
    const filteredResult = openedChests.find(
      (el) => el.chestId === chestID && chests.indexOf(el) === chestIndex
    );

    setIsActive(chestID);
    setIsActiveIndex(chestIndex + 1);
    // console.log("filteredResult", filteredResult);
    if (filteredResult && filteredResult.rewards) {
      const resultWonETH = filteredResult.rewards.find((obj) => {
        return obj.rewardType === "MoneyETH" && obj.status === "Claimed";
      });
      const resultWonETHGem = filteredResult.rewards.find((obj) => {
        return obj.rewardType === "MoneyETH" && obj.status === "Unclaimable";
      });
      const resultWonDYP = filteredResult.rewards.find((obj) => {
        return obj.rewardType === "MoneyDYP" && obj.status === "Claimed";
      });
      const resultPoints = filteredResult.rewards.length === 1;

      if (resultWonETH) {
        setMessage("woneth");
      } else if (resultWonETHGem) {
        setMessage("gem");
      } else if (resultWonDYP) {
        setMessage("wondyp");
      } else if (resultPoints) {
        setMessage("wonPoints");
      }

      setLiveRewardData(filteredResult);
      setRewardData(filteredResult);
    } else {
      setLiveRewardData([]);
    }
  };

  const randomOpenedChests = [
    2, 4, 18, 12, 19, 5, 16, 6, 1, 15, 17, 3, 7, 9, 14, 11, 13, 8, 10,
  ];

  const getIds = () => {
    if (openedChests && openedChests.length > 0) {
      let arrayFiltered = [];
      window.range(0, 19).map((item, index) => {
        if (chests[index].isOpened === true) {
          if (randomOpenedChests[index] === undefined) {
            const index2 = getFirstUnopenedChest(index - 1, chests);
            if (index2!==undefined) {
              arrayFiltered.push(randomOpenedChests[index2]);
            }
          } else {
            arrayFiltered.push(randomOpenedChests[index]);
          }
        }
      });

      setopenChestIds(arrayFiltered);
    }
  };

  const getFirstUnopenedChest = (index, chests) => {
    let found = 0;
    for (let i = index; i >= 0; i--) {
      if (!chests[i].isOpened) {
        found = 1;
        // console.log(i, found)
        return i;
      }
    }

    if (found === 0) {
      for (let i = index; i <= 19; i++) {
        if (!chests[i].isOpened) {
          found = 1;
          return i;
        }
      }
    }

    return index;
  };

  const handleChestSelection = (index, chests, openedChests) => {
    // Case: All chests are opened
    if (openedChests.length === 19) {
      // selectedChestid(3);
      return 3;
    }

    // Case: No chests opened, and last button (19) clicked
    if (openedChests.length === 0 && index === 19) {
      return index - 1;
    }

    // Case: No chests opened, first button (0) clicked
    if (index === 0) {
      return index;
    }

    // Case: Other buttons clicked when no chests opened (index 1 to 18)
    if (openedChests.length === 0 && index >= 1 && index <= 18) {
      // const unopenedChest = getFirstUnopenedChest(index - 1, chests);

      // return unopenedChest;
      return index;
    }

    if (
      openedChests.length > 0 &&
      index !== 19 &&
      index !== 0 &&
      chests[index].isOpened === false &&
      chests[index - 1].isOpened === false &&
      chests[index + 1].isOpened === true
    ) {
      // const unopenedChest = getFirstUnopenedChest(index, chests);

      // return unopenedChest;
      if (!openChestIds.includes(randomOpenedChests[index])) {
        return index;
      } else {
        const unopenedChest = getFirstUnopenedChest(index-1, chests);

        return unopenedChest;
      }
    }

    if (openedChests.length > 0 && index === 19) {
      const unopenedChest = getFirstUnopenedChest(index - 1, chests);

      return unopenedChest;
    }

    // // Case: Chests opened, index is 18, chest is not opened
    if (
      openedChests.length > 0 &&
      index !== 19 &&
      index !== 0 &&
      !chests[index].isOpened &&
      chests[index + 1].isOpened === true &&
      chests[index - 1].isOpened === true
    ) {
      if (!openChestIds.includes(randomOpenedChests[index])) {
        return index;
      } else {
        const unopenedChest = getFirstUnopenedChest(index - 1, chests);

        return unopenedChest;
      }

      // console.log('yes')
    }

    // // Default Case: Any other button clicked when some chests are opened
    if (
      openedChests.length > 0 &&
      index >= 0 &&
      index <= 18 &&
      !chests[index].isOpened
    ) {
      const unopenedChest = getFirstUnopenedChest(index, chests);
      return unopenedChest;
    }
  };

  useEffect(() => {
    if (chain === "base") {
      if (!email) {
        setMessage("login");
        setDisable(true);
      } else if (coinbase && isConnected && email && address) {
        if (coinbase.toLowerCase() === address.toLowerCase()) {
          if (isPremium) {
            if (
              openedChests &&
              openedChests.length === 20 &&
              rewardData.length === 0 &&
              address.toLowerCase() === coinbase.toLowerCase()
            ) {
              setMessage("complete");
            } else if (
              openedChests &&
              openedChests.length < 20 &&
              rewardData.length === 0 &&
              address.toLowerCase() === coinbase.toLowerCase() &&
              networkId === 8453
            ) {
              setMessage("");
              setDisable(false);
            } else if (
              rewardData.length === 0 &&
              networkId !== 8453 &&
              address.toLowerCase() === coinbase.toLowerCase()
            ) {
              setMessage("switch");
              setDisable(true);
            } else if (
              rewardData.length === 0 &&
              address.toLowerCase() === coinbase.toLowerCase()
            ) {
              setMessage("");
              setDisable(false);
            }
          } else if (!isPremium) {
            if (
              openedChests &&
              openedChests.length === 20 &&
              rewardData.length === 0 &&
              address.toLowerCase() === coinbase.toLowerCase() &&
              networkId === 8453
            ) {
              setMessage("complete");
            } else if (
              openedChests &&
              openedChests.length < 20 &&
              rewardData.length === 0 &&
              address.toLowerCase() === coinbase.toLowerCase() &&
              networkId === 8453
            ) {
              setMessage("");
              setDisable(false);
            } else if (
              rewardData.length === 0 &&
              networkId !== 8453 &&
              address.toLowerCase() === coinbase.toLowerCase()
            ) {
              setMessage("switch");
              setDisable(true);
            } else if (
              rewardData.length === 0 &&
              address.toLowerCase() === coinbase.toLowerCase()
            ) {
              setMessage("");
              setDisable(false);
            }
          }
        } else {
          setMessage("switchAccount");
          setDisable(true);
        }
      } else {
        setMessage("connect");
        setDisable(true);
      }
    }
  }, [
    chain,
    networkId,
    coinbase,
    address,
    isPremium,
    email,
    isConnected,
    rewardData,
    openedChests,
  ]);

  useEffect(() => {
    countEarnedRewards();
    getIds();
  }, [openedChests]);

  // console.log(selectedChest2, openChestIds);
  return (
    <>
      <div className="container-lg p-0">
        <div className="row">
          <div className="col-12 col-lg-4">
            <NavLink to="/loyalty-program">
              <div className="games-banner loyalty-game-banner d-flex flex-column  flex-lg-row px-4 py-3 gap-3 gap-lg-0 align-items-start align-items-lg-center mb-4 position-relative">
                <div className="d-flex flex-column gap-2">
                  <h6 className="migration-banner-title mb-0">
                    Loyalty Program
                  </h6>
                  <p className="games-banner-desc mb-0">
                    90 days of gas-free transactions
                  </p>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="col-12 col-lg-5">
            <div className="games-banner d-flex flex-column flex-lg-row px-4 py-3 gap-3 gap-lg-0 align-items-start align-items-lg-center mb-4 position-relative">
              <div className="d-flex flex-column gap-2">
                <h6 className="migration-banner-title mb-0">Games</h6>
                <p className="games-banner-desc mb-0">
                  Enjoy the best gaming experience
                </p>
              </div>
              <div className="leaderboard-wrapper">
                <div className="d-flex gap-2 position-relative">
                  <div
                    className="d-flex align-items-center justify-content-center position-relative leaderboard-item-banner"
                    onClick={() =>
                      setPopups((prev) => ({ ...prev, stoneCrack: true }))
                    }
                  >
                    <img
                      src={stoneCrackBanner}
                      className="game-leaderboard-img"
                      alt=""
                    />
                    {/* <div className="d-flex flex-column position-absolute rankwrapper">
                      <h6 className="rank-text-stone text-center">Rank</h6>
                      <h6 className="rank-value-stone text-center">1,250</h6>
                    </div> */}
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative leaderboard-item-banner"
                    onClick={() =>
                      setPopups((prev) => ({ ...prev, kittyDash: true }))
                    }
                  >
                    <img
                      src={kittyDashBanner}
                      className="game-leaderboard-img"
                      alt=""
                    />
                    {/* <div className="d-flex flex-column position-absolute rankwrapper">
                      <h6 className="rank-text-dash text-center">Rank</h6>
                      <h6 className="rank-value-dash text-center">250</h6>
                    </div> */}
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-center position-relative leaderboard-item-banner"
                    onClick={() =>
                      setPopups((prev) => ({ ...prev, cawsAdventure: true }))
                    }
                  >
                    <img
                      src={cawsAdventureBanner}
                      className="game-leaderboard-img"
                      alt=""
                    />
                    {/* <div className="d-flex flex-column position-absolute rankwrapper">
                      <h6 className="rank-text-caws text-center">Rank</h6>
                      <h6 className="rank-value-caws text-center">50</h6>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3">
            <div
              className="games-banner d-flex flex-column flex-lg-row px-4 py-3 gap-3 gap-lg-0 align-items-center mb-4 position-relative"
              onClick={() => setActive(true)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex flex-column gap-2">
                  <h6 className="migration-banner-title mb-0">Leaderboards</h6>
                  <p className="games-banner-desc mb-0">See where you stand</p>
                </div>
                <img
                  src={leaderboardsCup}
                  width={50}
                  alt=""
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
          <div className="position-relative" style={{ width: "100px" }}></div>
          <div className="col-12 col-lg-6 position-relative"></div>
        </div>
        <div className="game-wrapper-container p-3">
          <div className="d-flex flex-column-reverse flex-lg-row gap-3">
            <div className="col-lg-5 left-games-banner">
              <div className="h-100 d-flex flex-column justify-content-between gap-0 gap-lg-3">
                <div className="chest-wrapper grid-overall-wrapper p-2">
                  <div className="new-chests-grid">
                    {chests.length > 0 ? (
                      <>
                        {chests.map((item, index) => (
                          <NewChestItem
                            coinbase={coinbase}
                            claimingChest={claimingChest}
                            setClaimingChest={setClaimingChest}
                            buyNftPopup={false}
                            openedChests={openedChests}
                            chainId={networkId}
                            chain={chain}
                            key={index}
                            item={item}
                            image={bnbImages[index]}
                            onCrackStone={onCrackStone}
                            selectedChest={selectedChest}
                            isPremium={isPremium}
                            onClaimRewards={(value) => {
                              // handleAddNewRock(value);
                              setRewardData(value);
                              setLiveRewardData(value);
                              onChestClaimed();
                              showLiveRewardData(value);
                              setIsActive(item.chestId);
                              setIsActiveIndex(index + 1);
                            }}
                            handleShowRewards={(value, value2) => {
                              showSingleRewardData(value, value2);
                              setIsActive(value);
                              setIsActiveIndex(index + 1);
                            }}
                            onLoadingChest={(value) => {
                              setTimeout(() => {
                                setSparkles({
                                  show: value,
                                  position:
                                    randomOpenedChests[
                                      handleChestSelection(
                                        index,
                                        chests,
                                        openedChests
                                      )
                                    ],
                                });
                              }, 350);
                              setDisable(value);
                              setloading(value);
                              setSelectedChest(index + 1);

                              setSelectedChest2(
                                randomOpenedChests[
                                  handleChestSelection(
                                    index,
                                    chests,
                                    openedChests
                                  )
                                ]
                              );
                            }}
                            onChestStatus={(val) => {
                              setMessage(val);
                            }}
                            address={coinbase}
                            email={email}
                            rewardTypes={item.chestType?.toLowerCase()}
                            chestId={item.chestId}
                            chestIndex={index + 1}
                            open={item.isOpened}
                            disableBtn={disable}
                            isActive={isActive}
                            isActiveIndex={isActiveIndex}
                            dummypremiumChests={
                              dummypremiumChests[index - 10]?.closedImg
                            }
                          />
                        ))}
                      </>
                    ) : (
                      <>
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
                            onClaimRewards={(value) => {
                              console.log(value);
                              // handleAddNewRock(value);

                              // setLiveRewardData(value);
                              // onChestClaimed();
                              // showLiveRewardData(value);
                              // setIsActive(item.chestId);
                              // setIsActiveIndex(index + 1);
                            }}
                            //   handleShowRewards={(value, value2) => {
                            //     showSingleRewardData(value, value2);
                            //     setIsActive(value);
                            //     setIsActiveIndex(index + 1);
                            //   }}
                            onLoadingChest={(value) => {
                              setTimeout(() => {
                                setSparkles({
                                  show: value,
                                  position: index + 1,
                                });
                              }, 350);
                              setDisable(value);
                              setloading(value);
                              setSelectedChest(index + 1);
                            }}
                            onChestStatus={(val) => {
                              setMessage(val);
                            }}
                            address={coinbase}
                            email={"email"}
                            rewardTypes={"standard"}
                            chestId={index + 1}
                            chestIndex={index + 1}
                            open={false}
                            disableBtn={true}
                            isActive={isActive}
                            isActiveIndex={isActiveIndex}
                            dummypremiumChests={
                              dummypremiumChests[index - 10]?.closedImg
                            }
                            //   binanceW3WProvider={binanceW3WProvider}
                          />
                        ))}
                      </>
                    )}
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
                        border: "1px solid #55FFFB",
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
                        {message === "waiting"
                          ? "Processing"
                          : "Ready to claim"}
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
                            color: "#ce5d1b",
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
                  ) : message === "switchAccount" ? (
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
                        <div className="dot" style={{ "--i": 10 }}></div>
                      </div>

                      <h6
                        className="loader-text mb-0"
                        style={{ color: "#ce5d1b" }}
                      >
                        Use the wallet associated to your game account.
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
                        <div className="dot" style={{ "--i": 10 }}></div>
                      </div>
                    </div>
                  ) : message === "complete" ? (
                    <div className="d-flex align-items-center justify-content-center complete-bg p-0 p-lg-2 w-100 chest-progress-wrapper">
                      <h6 className="completed-text mb-0">Completed</h6>
                    </div>
                  ) : message === "woneth" ? (
                    <div className="d-flex align-items-center position-relative flex-column flex-lg-row justify-content-between p-0 p-lg-2 w-100 chest-progress-wrapper">
                      <div
                        className="chain-desc-wrapper w-100 p-2 d-flex flex-column"
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
                                    return obj.rewardType === "MoneyETH";
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
                  ) : message === "gem" ? (
                    <div className="d-flex align-items-center flex-column flex-lg-row justify-content-between p-0 p-lg-2 w-100 chest-progress-wrapper">
                      <div
                        className="chain-desc-wrapper d-flex flex-column w-100"
                        style={{
                          filter: "brightness(1)",
                          position: "relative",
                        }}
                      >
                        <h6 className="win-text mb-0">You won</h6>
                        <div className="d-flex align-items-center gap-2">
                          <img src={danger} alt="" width={20} height={20} />
                          <span className="win-desc mb-0">
                            The{" "}
                            <span style={{ color: "#F2C624" }}>
                              $
                              {getFormattedNumber(
                                rewardData.rewards
                                  ? rewardData.rewards.find((obj) => {
                                      return obj.rewardType === "MoneyETH";
                                    }).reward
                                  : 0,
                                2
                              )}
                            </span>{" "}
                            reward cannot be claimed as you need to hold at
                            least $1,000 worth of DYP tokens.
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 win-rewards-container position-static m-0">
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
                        <div className="d-flex flex-column align-items-center danger-border p-1">
                          <h6 className="win-amount mb-0 p-1">
                            {" "}
                            $
                            {getFormattedNumber(
                              rewardData.rewards
                                ? rewardData.rewards.find((obj) => {
                                    return obj.rewardType === "MoneyETH";
                                  }).reward
                                : 0,
                              2
                            )}
                          </h6>
                          <span className="win-amount-desc">Rewards</span>
                        </div>
                      </div>
                    </div>
                  ) : message === "wondyp" ? (
                    <div className="d-flex align-items-center position-relative flex-column flex-lg-row justify-content-between p-0 p-lg-2 w-100 chest-progress-wrapper">
                      <div
                        className="chain-desc-wrapper w-100 p-2 d-flex flex-column"
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
                                    return obj.rewardType === "MoneyDYP";
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
                    <div
                      className="d-flex align-items-center position-relative flex-column flex-lg-row justify-content-between p-0 p-lg-2 w-100 chest-progress-wrapper"
                      style={{ border: "1px solid #f2c624" }}
                    >
                      <div
                        className="chain-desc-wrapper w-100 p-2 d-flex flex-column"
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
                        className="chain-desc-wrapper w-100 p-2 d-flex flex-column"
                        style={{
                          filter: "brightness(1)",
                          position: "relative",
                        }}
                      >
                        <h6
                          className="desc-title mb-0"
                          style={{ color: "#fff" }}
                        >
                          Sign in with Your Game Account
                        </h6>
                        <span className="chain-desc mb-0">
                          Sign in to access Stone Crack and earn tailored
                          rewards!
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-end get-premium-wrapper p-3 p-lg-0">
                        <NavLink
                          className="sign-in-btn px-4 py-1"
                          to="/sign-in"
                        >
                          Sign In
                        </NavLink>
                      </div>
                    </div>
                  ) : message === "connect" ? (
                    <div
                      className="d-flex align-items-center flex-column flex-lg-row justify-content-between p-0 p-lg-2 w-100 chest-progress-wrapper"
                      style={{
                        border: "1px solid #8262D0",
                        background:
                          "linear-gradient(180deg, #8262D0 0%, #482293 100%)",
                      }}
                    >
                      <div
                        className="chain-desc-wrapper w-100 p-2 d-flex flex-column"
                        style={{
                          filter: "brightness(1)",
                          position: "relative",
                        }}
                      >
                        <h6
                          className="desc-title mb-0"
                          style={{ color: "#fff" }}
                        >
                          Connect wallet
                        </h6>
                        <span className="chain-desc mb-0">
                          Connect wallet in order to access Stone Crack and earn
                          tailored rewards!
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-end get-premium-wrapper p-3 p-lg-0">
                        <button
                          className="sign-in-btn px-4 py-1"
                          onClick={() => {
                            handleConnection();
                          }}
                        >
                          Connect Wallet
                        </button>
                      </div>
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
              <div className="d-flex flex-column h-100">
                <div className="main-image-game h-100 position-relative overflow-hidden">
                  {sparkles.show && (
                    <div
                      class={`animation-container position-${sparkles.position}`}
                    >
                      <div class="spark-wrapper">
                        <img src={spark} class="spark-1" alt="Spark" />
                        <img src={spark} class="spark-2" alt="Spark" />
                        <img src={spark} class="spark-3" alt="Spark" />
                      </div>
                    </div>
                  )}
                  <div className="dynamic-position w-100">
                    <div className="d-flex flex-column flex-lg-row flex-md-row flex-sm-row justify-content-between align-items-start w-100 p-2">
                      <img
                        src={stoneCrack}
                        alt=""
                        className="stonecrack-logo"
                      />
                      <div className="d-flex w-100 flex-row-reverse gap-1">
                        <div className="col-lg-3 d-flex flex-column align-items-center ">
                          <div className="w-100 points-upper-bg">
                            <h6 className="points-text text-center m-0">
                              Points
                            </h6>
                          </div>
                          <h6 className="w-100 text-center totalpoints-wrapper px-3 totalpoints-value">
                            {getFormattedNumber(totalPoints, 0)}
                          </h6>
                        </div>
                        <div className="d-flex flex-column align-items-center dynamic-width">
                          <div className="px-3 usd-upper-bg w-100">
                            <h6 className="usdreward-text m-0 text-center dynamic-width">
                              Rewards
                            </h6>
                          </div>
                          <div className="h-100 d-flex gap-3 align-items-center justify-content-center px-3 usdreward-wrapper dynamic-width">
                            <div className="d-flex flex-column">
                              <h6 className="usdreward-value-crypto">DYP</h6>
                              <h6 className="usdreward-value">
                                ${getFormattedNumber(totalUsdDYP, 2)}
                              </h6>
                            </div>
                            <div className="d-flex flex-column">
                              <h6 className="usdreward-value-crypto">ETH</h6>
                              <h6 className="usdreward-value">
                                ${getFormattedNumber(totalUsdETH, 2)}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {openedChests && openedChests.length === 20 ? (
                    <img src={mainChestCracked} alt="" className="h-100" />
                  ) : openedChests && openedChests.length < 20 ? (
                    <img src={mainChest} alt="" className="h-100" />
                  ) : (
                    <img src={mainChest} alt="" className="h-100" />
                  )}

                  <div className="position-absolute rocks-wrapper">
                    <div className="d-flex flex-column justify-content-center align-items-center position-relative w-100 h-100">
                      {[...Array(4)].map((item, index) => {
                        return (
                          <div
                            key={index}
                            className={`rockitem rockitem${index + 1} ${
                              loading === true &&
                              selectedChest2 === index + 1 &&
                              "chest-pulsate"
                            } 
                           
                          `}
                            style={{
                              display: openChestIds.includes(index + 1)
                                ? "none"
                                : "block",
                            }}
                          >
                            <img
                              src={require(`./assets/rocksBg/${index + 1}.png`)}
                              className="rock-img"
                              alt=""
                            />
                          </div>
                        );
                      })}

                      {[...Array(5)].map((item, index) => {
                        return (
                          <div
                            key={index}
                            className={`rockitem  ${
                              loading === true &&
                              selectedChest2 === index + 5 &&
                              "chest-pulsate"
                            } rockitem${index + 5}`}
                            style={{
                              display: openChestIds.includes(index + 5)
                                ? "none"
                                : "",
                              // index + 5 <= openedChests.length ? "none" : "",
                            }}
                          >
                            <img
                              src={require(`./assets/rocksBg/${index + 5}.png`)}
                              className="rock-img"
                              alt=""
                            />
                          </div>
                        );
                      })}

                      {[...Array(5)].map((item, index) => {
                        return (
                          <div
                            key={index}
                            className={`rockitem rockitem${index + 10} ${
                              loading === true &&
                              selectedChest2 === index + 10 &&
                              "chest-pulsate"
                            }`}
                            style={{
                              display: openChestIds.includes(index + 10)
                                ? "none"
                                : "",
                              // index + 10 <= openedChests.length ? "none" : "",
                            }}
                          >
                            <img
                              src={require(`./assets/rocksBg/${
                                index + 10
                              }.png`)}
                              className="rock-img"
                              alt=""
                            />
                          </div>
                        );
                      })}

                      {[...Array(5)].map((item, index) => {
                        return (
                          <div
                            key={index}
                            className={`rockitem rockitem${index + 15} ${
                              loading === true &&
                              selectedChest2 === index + 15 &&
                              "chest-pulsate"
                            }`}
                            style={{
                              display: openChestIds.includes(index + 15)
                                ? "none"
                                : "",
                              // display:
                              //   index + 15 <= openedChests.length ? "none" : "",
                            }}
                          >
                            <img
                              src={require(`./assets/rocksBg/${
                                index + 15
                              }.png`)}
                              className="rock-img"
                              alt=""
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="d-none d-lg-flex d-md-flex w-100 align-items-center gap-2">
                  <div className="left-separator"></div>
                  <h6 className="reward-bottom-text px-2">Rewards</h6>
                  <div className="right-separator"></div>
                </div>
                <div className="d-none d-lg-block d-md-block rewards-bottom-wrapper p-1">
                  {windowSize.width > 992 ? (
                    <div className="new-rewards-grid">
                      <div
                        className={` ${
                          rewardData &&
                          rewardData.rewards?.find((obj) => {
                            return obj.rewardType === "Points";
                          }) &&
                          "new-rewards-item-active"
                        } new-rewards-item p-2 d-flex align-items-center gap-2`}
                      >
                        <img
                          src={pointsIcon}
                          alt=""
                          style={{
                            width: 48,
                            filter:
                              rewardData &&
                              rewardData.rewards?.find((obj) => {
                                return obj.rewardType === "Points";
                              })
                                ? ""
                                : "grayscale(1)",
                          }}
                        />
                        <div className="d-flex flex-column">
                          <h6
                            className={`${
                              rewardData &&
                              rewardData.rewards?.find((obj) => {
                                return obj.rewardType === "Points";
                              }) &&
                              "reward-title-active"
                            } reward-title`}
                          >
                            Points
                          </h6>
                          <h6
                            className={` ${
                              rewardData &&
                              rewardData.rewards?.find((obj) => {
                                return obj.rewardType === "Points";
                              }) &&
                              "reward-amount-active"
                            } reward-amount d-flex align-items-center gap-1`}
                          >
                            1,000-6,000
                          </h6>
                        </div>
                      </div>
                      <div
                        className={`${
                          rewardData &&
                          rewardData.rewards?.find((obj) => {
                            return obj.rewardType === "dypRewards";
                          }) &&
                          "new-rewards-item-active2"
                        } new-rewards-item p-2 d-flex align-items-center gap-2`}
                      >
                        <div className="h-100 d-flex flex-column justify-content-between w-100">
                          <h6
                            className={`${
                              rewardData &&
                              rewardData.rewards?.find((obj) => {
                                return obj.rewardType === "MoneyDYP";
                              }) &&
                              "reward-title-active"
                            } reward-title text-center`}
                          >
                            DYP Rewards
                          </h6>
                          <div className="d-flex align-items-center gap-1">
                            <div
                              className={`${
                                rewardData.rewards?.find((obj) => {
                                  return obj.rewardType === "MoneyDYP";
                                }) &&
                                rewardData &&
                                rewardData.rewards?.find((obj) => {
                                  return (
                                    obj.rewardType === "MoneyDYP" &&
                                    Number(obj.reward) >= 0.5 &&
                                    Number(obj.reward) <= 5
                                  );
                                }) &&
                                "small-reward-wrapper-active"
                              } small-reward-wrapper w-100 p-1`}
                            >
                              <h6
                                className={`${
                                  rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return obj.rewardType === "MoneyDYP";
                                  }) &&
                                  rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return (
                                      obj.rewardType === "MoneyDYP" &&
                                      Number(obj.reward) >= 0.5 &&
                                      Number(obj.reward) <= 5
                                    );
                                  }) &&
                                  "reward-amount-active"
                                } reward-amount text-center`}
                              >
                                $0.5-$5
                              </h6>
                            </div>
                            <div
                              className={`${
                                rewardData &&
                                rewardData.rewards?.find((obj) => {
                                  return obj.rewardType === "MoneyDYP";
                                }) &&
                                rewardData &&
                                rewardData.rewards?.find((obj) => {
                                  return (
                                    obj.rewardType === "MoneyDYP" &&
                                    Number(obj.reward) >= 20 &&
                                    Number(obj.reward) <= 300
                                  );
                                }) &&
                                "small-reward-wrapper-active"
                              } small-reward-wrapper w-100 p-1`}
                            >
                              <h6
                                className={`${
                                  rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return obj.rewardType === "MoneyDYP";
                                  }) &&
                                  rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return (
                                      obj.rewardType === "MoneyDYP" &&
                                      Number(obj.reward) >= 20 &&
                                      Number(obj.reward) <= 300
                                    );
                                  }) &&
                                  "reward-amount-active"
                                } reward-amount text-center`}
                              >
                                $20-$300
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${
                          rewardData &&
                          rewardData.rewards?.find((obj) => {
                            return obj.rewardType === "MoneyETH";
                          }) &&
                          message === "woneth" &&
                          "new-rewards-item-active2"
                        } new-rewards-item p-2 d-flex align-items-center gap-2`}
                      >
                        <div className="h-100 d-flex flex-column justify-content-between w-100">
                          <h6
                            className={`${
                              rewardData &&
                              rewardData.rewards?.find((obj) => {
                                return obj.rewardType === "MoneyETH";
                              }) &&
                              message === "woneth" &&
                              "reward-title-active"
                            } reward-title text-center`}
                          >
                            ETH Rewards
                          </h6>
                          <div className="d-flex align-items-center gap-1">
                            <div
                              className={`${
                                rewardData &&
                                rewardData.rewards?.find((obj) => {
                                  return obj.rewardType === "MoneyETH";
                                }) &&
                                rewardData &&
                                rewardData.rewards?.find((obj) => {
                                  return (
                                    obj.rewardType === "MoneyETH" &&
                                    Number(obj.reward) >= 0.5 &&
                                    Number(obj.reward) <= 5
                                  );
                                }) &&
                                message === "woneth" &&
                                "small-reward-wrapper-active"
                              } small-reward-wrapper w-100 p-1`}
                            >
                              <h6
                                className={`${
                                  rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return obj.rewardType === "MoneyETH";
                                  }) &&
                                  rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return (
                                      obj.rewardType === "MoneyETH" &&
                                      Number(obj.reward) >= 0.5 &&
                                      Number(obj.reward) <= 5
                                    );
                                  }) &&
                                  message === "woneth" &&
                                  "reward-amount-active"
                                } reward-amount text-center`}
                              >
                                $0.5-$5
                              </h6>
                            </div>
                            <div
                              className={`${
                                rewardData &&
                                rewardData.rewards?.find((obj) => {
                                  return obj.rewardType === "MoneyETH";
                                }) &&
                                rewardData &&
                                rewardData.rewards?.find((obj) => {
                                  return (
                                    obj.rewardType === "MoneyETH" &&
                                    Number(obj.reward) >= 20 &&
                                    Number(obj.reward) <= 300
                                  );
                                }) &&
                                message === "woneth" &&
                                "small-reward-wrapper-active"
                              } small-reward-wrapper w-100 p-1`}
                            >
                              <h6
                                className={`${
                                  rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return obj.rewardType === "MoneyETH";
                                  }) &&
                                  rewardData &&
                                  rewardData.rewards?.find((obj) => {
                                    return (
                                      obj.rewardType === "MoneyETH" &&
                                      Number(obj.reward) >= 20 &&
                                      Number(obj.reward) <= 300
                                    );
                                  }) &&
                                  message === "woneth" &&
                                  "reward-amount-active"
                                } reward-amount text-center`}
                              >
                                $20-$300
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={` ${
                          rewardData &&
                          rewardData.rewards?.find((obj) => {
                            return obj.rewardType === "MoneyETH";
                          }) &&
                          message === "gem" &&
                          "new-rewards-item-active"
                        } new-rewards-item p-2 d-flex align-items-center gap-2 position-relative`}
                      >
                        {rewardData &&
                          rewardData.rewards?.find((obj) => {
                            return obj.rewardType === "MoneyETH";
                          }) &&
                          message === "gem" && (
                            <img
                              src={danger}
                              width={20}
                              height={20}
                              className="reward-warning"
                              alt=""
                            />
                          )}
                        <img
                          src={gemIcon}
                          alt=""
                          style={{
                            width: 48,
                            filter:
                              rewardData &&
                              rewardData.rewards?.find((obj) => {
                                return obj.rewardType === "MoneyETH";
                              }) &&
                              message === "gem"
                                ? ""
                                : "grayscale(1)",
                          }}
                        />
                        <div className="d-flex flex-column">
                          <h6
                            className={`${
                              rewardData &&
                              rewardData.rewards?.find((obj) => {
                                return obj.rewardType === "MoneyETH";
                              }) &&
                              message === "gem" &&
                              "reward-title-active"
                            } reward-title text-center`}
                          >
                            Base Gem
                          </h6>
                          <h6
                            className={`${
                              rewardData &&
                              rewardData.rewards?.find((obj) => {
                                return obj.rewardType === "MoneyETH";
                              }) &&
                              message === "gem" &&
                              "reward-amount-active"
                            } reward-amount d-flex align-items-center gap-1`}
                          >
                            $500-$2,000
                          </h6>
                        </div>
                      </div>
                      {/* {dummyRewards.map((item, index) => (
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
                        </div>
                      </div>
                    ))} */}
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
      <div
        id="popup"
        className={`popup-wrapper  ${
          type === "kittyDash"
            ? "kittydash-bg"
            : type === "stoneCrack"
            ? "stonecrack-bg"
            : "cawsadventure-bg"
        } ${
          active && "popup-active"
        } p-3 d-flex flex-column gap-3 justify-content-center align-items-center`}
        style={{ borderRadius: "8px", background: "#1A1A36" }}
      >
        <div
          className="d-flex align-items-center justify-content-end w-100"
          style={{ zIndex: 2 }}
        >
          <img
            src={require("./assets/xMark.svg").default}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => setActive(false)}
          />
        </div>
        <Leaderboard
          type={type}
          setType={setType}
          monthlyplayerData={monthlyplayerData}
          previousMonthlyVersion={previousMonthlyVersion}
          previousWeeklyVersion={previousWeeklyVersion}
          weeklyplayerData={weeklyplayerData}
          previousKittyDashVersion={previousKittyDashVersion}
          kittyDashRecords={kittyDashRecords}
          fetchWeeklyWinners={fetchWeeklyWinners}
          fetchMonthlyWinners={fetchMonthlyWinners}
          fetchKittyDashWinners={fetchKittyDashWinners}
          fetchPreviousMonthlyWinners={fetchPreviousMonthlyWinners}
          fetchPreviousWeeklyWinners={fetchPreviousWeeklyWinners}
          fetchPreviousKittyDashWinners={fetchPreviousKittyDashWinners}
          kittyUser={kittyUser}
          weeklyUser={weeklyUser}
          monthlyyUser={monthlyUser}
          activePlayerKitty={activePlayerKitty}
          activePlayerWeekly={activePlayerWeekly}
          activePlayerMonthly={activePlayerMonthly}
          email={email}
          username={username}
          leaderboardCaws2d={leaderboardCaws2d}
        />
      </div>
      <StoneCrackPopup
        active={popups.stoneCrack}
        onClose={() => setPopups((prev) => ({ ...prev, stoneCrack: false }))}
      />
      <KittyDashPopup
        active={popups.kittyDash}
        onClose={() => setPopups((prev) => ({ ...prev, kittyDash: false }))}
      />
      <CawsAdventurePopup
        active={popups.cawsAdventure}
        onClose={() => setPopups((prev) => ({ ...prev, cawsAdventure: false }))}
      />
    </>
  );
};

export default Games;
