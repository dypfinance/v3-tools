import React, { useEffect, useState } from "react";
import "./leaderboard.scss";
import Switch from "@mui/material/Switch";
import getFormattedNumber from "../../functions/get-formatted-number";
import { Tooltip } from "@material-ui/core";

const Leaderboard = ({
  userId,
  address,
  username,
  type,
  setType,
  monthlyplayerData,
  weeklyplayerData,
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
  email,
  leaderboardCaws2d,
  activePlayerCaws2d,
  caws2dUser,
  monthlyplayerDataOpbnb,
  weeklyplayerDataOpbnb,
  fetchWeeklyOpbnbWinners,
  fetchMonthlyOpbnbWinners,
  fetchPreviousWeeklyOpbnbWinners,
  fetchPreviousMonthlyOpbnbWinners,
  weeklyUserOpbnb,
  monthlyUserOpbnb,
  activePlayerWeeklyOpbnb,
  activePlayerMonthlyOpbnb,
  fetchCawsAdvLeaderboard,
  fetchPreviousCawsAdvWinners,
}) => {
  const weeklyPrizes = ["25", "15", "10", "8", "0", "0", "0", "0", "0", "0"];
  const monthlyPrizes = [
    "250",
    "150",
    "100",
    "50",
    "50",
    "20",
    "20",
    "10",
    "10",
    "10",
  ];

  const stoneHeaders = {
    scoreColor: "#FFBE6F",
    rewardColor: "#FBF1CA",
    headers: [
      {
        name: "Rank",
        class: "col-1",
      },
      {
        name: "Player",
        class: "col-3",
      },
      {
        name: "Score",
        class: "col-4 text-center",
      },
      {
        name: "Reward",
        class: "col-2 text-center leaderboard-rewards-bg",
      },
    ],
  };

  const kittyHeaders = {
    scoreColor: "#F6B67E",
    rewardColor: "#3ED2FF",
    headers: [
      {
        name: "Rank",
        class: "col-1",
      },
      {
        name: "Player",
        class: "col-3",
      },
      {
        name: "Score",
        class: "col-4 text-center",
      },
      {
        name: "Reward",
        class: "col-4 text-center",
      },
      ,
    ],
  };

  const cawsHeaders = {
    scoreColor: "#FF8961",
    rewardColor: "#FFECCC",
    headers: [
      {
        name: "Rank",
        class: "col-2",
      },
      {
        name: "Player",
        class: "col-2",
      },
      {
        name: "Score",
        class: "col-2 text-center",
      },
      {
        name: "Level",
        class: "col-2 text-center",
      },
      {
        name: "Time",
        class: "col-2 text-center",
      },
      {
        name: "Reward",
        class: "col-2 text-center",
      },
    ],
  };

  const stoneCrackRewards = [
    {
      reward: 40,
    },
    {
      reward: 30,
    },
    {
      reward: 20,
    },
    {
      reward: 15,
    },
    {
      reward: 10,
    },
    {
      reward: 10,
    },
    {
      reward: 10,
    },
    {
      reward: 10,
    },
    {
      reward: 10,
    },
    {
      reward: 10,
    },
  ];

  const stoneCrackRewardsMonthly = [
    {
      rewards: 200,
    },
    {
      rewards: 100,
    },
    {
      rewards: 50,
    },
    {
      rewards: 30,
    },
    {
      rewards: 20,
    },
    {
      rewards: 20,
    },
    {
      rewards: 20,
    },
    {
      rewards: 20,
    },
    {
      rewards: 20,
    },
    {
      rewards: 20,
    },
  ];

  const kittyDashRewards = [120, 80, 40, 40, 20, 20, 20, 20, 20, 20];

  const caws2dRewards = [
    100, 60, 40, 30, 20, 20, 20, 20, 20, 20, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  ];

  const [optionText, setOptionText] = useState("weekly");
  const [inactiveBoard, setInactiveBoard] = useState(false);
  const [prizes, setPrizes] = useState(weeklyPrizes);
  const [prevStatus, setPrevStatus] = useState(false);
  const [selectedChain, setselectedChain] = useState("base");

  const handleOption = (item) => {
    setOptionText(item);
    if (item === "weekly" && inactiveBoard === false) {
      setPrizes(weeklyPrizes);
    } else if (item === "weekly" && inactiveBoard === true) {
      setPrizes(weeklyPrizes);
    } else if (item === "monthly" && inactiveBoard === false) {
      setPrizes(monthlyPrizes);
    } else if (item === "monthly" && inactiveBoard === true) {
      setPrizes(monthlyPrizes);
    }
  };

  useEffect(() => {
    fetchWeeklyWinners();
    fetchMonthlyWinners();
    fetchWeeklyOpbnbWinners();
    fetchMonthlyOpbnbWinners();
    fetchKittyDashWinners();
    fetchCawsAdvLeaderboard();
  }, [userId, username]);

  const switchPrev = () => {
    setPrevStatus((prevStatus) => {
      const newStatus = !prevStatus;
      if (newStatus) {
        fetchPreviousWeeklyWinners();
        fetchPreviousMonthlyWinners();
        fetchPreviousWeeklyOpbnbWinners();
        fetchPreviousMonthlyOpbnbWinners();
        fetchPreviousKittyDashWinners();
        fetchPreviousCawsAdvWinners();
      } else {
        fetchWeeklyWinners();
        fetchMonthlyWinners();
        fetchWeeklyOpbnbWinners();
        fetchMonthlyOpbnbWinners();
        fetchKittyDashWinners();
        fetchCawsAdvLeaderboard();
      }

      return newStatus;
    });
  };

  const formatTimeByLevelAndSecond = (bestTime, level) => {
    if (level === 10) {
      let check = Number(bestTime);

      if (check !== 0) {
        let date = new Date(null);

        date.setSeconds(bestTime);
        return date.toISOString().substr(11, 8);
      }
    } else {
      return "DNF";
    }
  };
  return (
    <div
      className="main-wrapper py-4 w-100 d-flex gap-4 mt-xxl-0 mt-lg-0 justify-content-center align-items-start"
      // style={{ minHeight: "560px" }}
    >
      <div className="row w-100 align-items-start gap-4 gap-lg-0">
        <div className="d-flex flex-column gap-3 col-12  px-0">
          <div className="d-flex leaderboards-flag-wrapper align-items-center gap-2 justify-content-center">
            <img
              src={"https://cdn.worldofdypians.com/tools/stoneCrackFlag.png"}
              onClick={() => setType("stoneCrack")}
              className="leaderboard-flag"
              alt=""
            />
            <img
              src={"https://cdn.worldofdypians.com/tools/kittyDashFlag.png"}
              onClick={() => {
                setType("kittyDash");
                handleOption("monthly");
              }}
              className="leaderboard-flag"
              alt=""
            />
            <img
              src={
                "https://cdn.worldofdypians.com/tools/cawsAdventuresFlag.png"
              }
              onClick={() => {
                setType("cawsAdventure");
                handleOption("monthly");
              }}
              className="leaderboard-flag"
              alt=""
            />
          </div>
          <div className="d-flex align-items-center gap-1 mt-5">
            <div
              className={`optionsWrapper col-12 ${
                type === "stoneCrack" &&
                "d-flex flex-column flex-lg-row w-100 justify-content-between gap-2"
              } `}
            >
              {type === "stoneCrack" && (
                <div className="d-flex align-items-center gap-2 col-lg-5">
                  <button
                    className={`w-100 ${
                      selectedChain === "base"
                        ? "new-chain-active-btn"
                        : "new-chain-inactive-btn "
                    } d-flex gap-1 align-items-center`}
                    onClick={() => {
                      setselectedChain("base");
                    }}
                  >
                    <img
                      src={
                        "https://cdn.worldofdypians.com/wod/baseBlueLogo.svg"
                      }
                      alt=""
                    />{" "}
                    Base
                  </button>
                  <button
                    className={`w-100 ${
                      selectedChain === "opbnb"
                        ? "new-chain-active-btn"
                        : "new-chain-inactive-btn "
                    } d-flex gap-1 align-items-center`}
                    onClick={() => {
                      setselectedChain("opbnb");
                    }}
                  >
                    <img
                      src={"https://cdn.worldofdypians.com/wod/bnbIcon.svg"}
                      alt=""
                    />{" "}
                    opBNB
                  </button>
                </div>
              )}
              <div
                className="w-100 d-flex gap-1 align-items-center justify-content-between position-relative"
                style={{ height: 38 }}
              >
                <div
                  className={`leaderboard-options-bg ${
                    optionText === "monthly" && "move-right"
                  } ${type !== "stoneCrack" && "d-none"} w-50`}
                ></div>
                {type !== "kittyDash" && type !== "cawsAdventure" && (
                  <span
                    className={`${
                      optionText === "weekly" && type === "stoneCrack"
                        ? "otheroptionsActive-stone"
                        : optionText === "weekly" && type === "kittyDash"
                        ? "otheroptionsActive-kitty"
                        : optionText === "weekly" && type === "cawsAdventure"
                        ? "otheroptionsActive-caws"
                        : ""
                    } durationText`}
                    style={{ width: type !== "stoneCrack" ? "100%" : "50%" }}
                    onClick={() => {
                      handleOption("weekly");
                    }}
                  >
                    Weekly
                  </span>
                )}
                {type === "stoneCrack" ||
                type === "kittyDash" ||
                type === "cawsAdventure" ? (
                  <span
                    className={`${
                      optionText === "monthly" && type === "stoneCrack"
                        ? "otheroptionsActive-stone"
                        : optionText === "monthly" && type === "kittyDash"
                        ? "otheroptionsActive-kitty"
                        : optionText === "monthly" && type === "cawsAdventure"
                        ? "otheroptionsActive-caws"
                        : ""
                    } durationText col-3`}
                    style={{
                      width:
                        type === "kittyDash" || type === "cawsAdventure"
                          ? "100%"
                          : "50%",
                    }}
                    onClick={() => {
                      handleOption("monthly");
                    }}
                  >
                    Monthly
                  </span>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex flex-column gap-2 tablewrapper">
            <div className="inner-table-wrapper p-2 w-100 position-relative d-flex flex-column align-items-end">
              {type === "stoneCrack" && (
                <span className="playerHeader reward-position d-none  d-lg-flex justify-content-center align-items-center gap-1 px-0 leaderboard-rewards-bg">
                  Rewards{" "}
                  <Tooltip
                    title={
                      <>
                        <div className="d-flex flex-column gap-2">
                          <span className="whitelist-tooltip-content-text">
                            The rewards will be distributed in DYP tokens.
                          </span>
                        </div>
                      </>
                    }
                    enterDelay={0}
                    leaveDelay={0}
                  >
                    <img
                      src={
                        "https://cdn.worldofdypians.com/tools/tooltipIcon.svg"
                      }
                      alt=""
                      className="tooltipicon-leaderboard"
                    />
                  </Tooltip>
                </span>
              )}
              {/* {type === "cawsAdventure" ? (
                <div className="coming-soon-position d-flex align-items-center justify-content-center">
                  <h6 className="mb-0">Coming Soon</h6>
                </div>
              ) : (
                <></>
              )} */}
              <table
                className={`playerTable w-100 
            
                `}
              >
                <tbody>
                  <tr className="playerRow">
                    {type === "stoneCrack" ? (
                      <>
                        {stoneHeaders.headers.map((item, index) =>
                          item.name === "Reward" ? (
                            <th
                              className={`playerHeader ${item.class}`}
                              key={index}
                            >
                              <div className="d-flex p-1 align-items-center justify-content-center gap-1">
                                {/* <div className="d-flex algin-items-center">
                                  <img
                                    src={
                                      selectedChain === "opbnb"
                                        ? "https://cdn.worldofdypians.com/wod/bnbIcon.svg"
                                        : "https://cdn.worldofdypians.com/wod/eth.svg"
                                    }
                                    width={15}
                                    height={15}
                                    alt=""
                                    className="me-1 d-none d-lg-block d-md-block"
                                  />
                                  {selectedChain === "opbnb" ? "BNB" : "ETH"}
                                </div>{" "}
                                + */}
                                <div className="d-flex algin-items-center">
                                  <img
                                    src={
                                      "https://cdn.worldofdypians.com/tools/dyplogo.svg"
                                    }
                                    width={15}
                                    height={15}
                                    alt=""
                                    className="me-1 d-none d-lg-block d-md-block"
                                  />{" "}
                                  DYP
                                </div>
                              </div>
                            </th>
                          ) : (
                            <th
                              className={`playerHeader ${item.class}`}
                              key={index}
                            >
                              {item.name}
                            </th>
                          )
                        )}
                      </>
                    ) : type === "kittyDash" ? (
                      <>
                        {kittyHeaders.headers.map((item, index) => (
                          <th
                            className={`playerHeader ${item.class}`}
                            key={index}
                          >
                            {item.name}
                          </th>
                        ))}
                      </>
                    ) : (
                      <>
                        {cawsHeaders.headers.map((item, index) => (
                          <th
                            className={`playerHeader ${item.class}`}
                            key={index}
                            style={{ background: "#313243" }}
                          >
                            {item.name}
                          </th>
                        ))}
                      </>
                    )}
                  </tr>

                  {type === "stoneCrack" &&
                  optionText === "weekly" &&
                  selectedChain === "base" ? (
                    <>
                      {weeklyplayerData.map((item, index) => (
                        <tr
                          key={index}
                          className={`playerInnerRow ${
                            item.displayName === username && "weekly-user-row"
                          }`}
                        >
                          <td className="playerData col-1">
                            {getFormattedNumber(Number(item.position) + 1, 0)}
                          </td>
                          <td className="playerName col-3">
                            <div className="position-relative d-flex align-items-center">
                              <span>{item.displayName}</span>
                            </div>
                          </td>
                          <td
                            className="playerScore col-4 text-center"
                            style={{ color: stoneHeaders.scoreColor }}
                          >
                            {getFormattedNumber(item.statValue, 0)}
                          </td>
                          <td
                            className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                            style={{ color: stoneHeaders.rewardColor }}
                          >
                            {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                            $
                            {getFormattedNumber(
                              stoneCrackRewards[index].reward,
                              0
                            )}
                          </td>
                        </tr>
                      ))}
                      {[...Array(10 - weeklyplayerData.length)].map(
                        (item, index) => (
                          <tr key={index} className={`playerInnerRow`}>
                            <td className="playerData col-1">
                              {Number(weeklyplayerData.length + index) + 1}
                            </td>
                            <td className="playerName col-3">
                              <div className="position-relative d-flex align-items-center">
                                <span>--</span>
                              </div>
                            </td>
                            <td
                              className="playerScore col-4 text-center"
                              style={{ color: stoneHeaders.scoreColor }}
                            >
                              {getFormattedNumber(0, 0)}
                            </td>
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                              $0
                            </td>
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={dyp} width={12} height={12} alt="" />{" "} */}
                              $0
                            </td>
                          </tr>
                        )
                      )}
                      {activePlayerWeekly === false &&
                        prevStatus === false &&
                        email && (
                          <tr className={`playerInnerRow weekly-user-row`}>
                            <td className="playerData col-1">
                              {weeklyUser?.statValue !== undefined &&
                              weeklyUser?.statValue > 0
                                ? getFormattedNumber(
                                    Number(weeklyUser.position) + 1,
                                    0
                                  )
                                : "---"}
                            </td>
                            <td className="playerName col-3">
                              <div className="position-relative d-flex align-items-center">
                                <span>{weeklyUser?.displayName}</span>
                              </div>
                            </td>
                            <td
                              className="playerScore col-4 text-center"
                              style={{ color: stoneHeaders.scoreColor }}
                            >
                              {getFormattedNumber(weeklyUser?.statValue, 0)}
                            </td>
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                              ${getFormattedNumber(0, 0)}
                            </td>
                          </tr>
                        )}
                    </>
                  ) : type === "stoneCrack" &&
                    optionText === "monthly" &&
                    selectedChain === "base" ? (
                    <>
                      {monthlyplayerData.map((item, index) => (
                        <tr
                          key={index}
                          className={`playerInnerRow ${
                            item.displayName === username && "weekly-user-row"
                          }`}
                        >
                          <td className="playerData col-1">
                            {Number(item.position) + 1}
                          </td>
                          <td className="playerName col-3">
                            <div className="position-relative d-flex align-items-center">
                              <span>{item.displayName}</span>
                            </div>
                          </td>
                          <td
                            className="playerScore col-4 text-center"
                            style={{ color: stoneHeaders.scoreColor }}
                          >
                            {getFormattedNumber(item.statValue, 0)}
                          </td>
                          <td
                            className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                            style={{ color: stoneHeaders.rewardColor }}
                          >
                            {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                            $
                            {getFormattedNumber(
                              stoneCrackRewardsMonthly[index].rewards,
                              0
                            )}
                          </td>
                        </tr>
                      ))}
                      {[...Array(10 - monthlyplayerData.length)].map(
                        (item, index) => (
                          <tr key={index} className={`playerInnerRow`}>
                            <td className="playerData col-1">
                              {Number(monthlyplayerData.length + index) + 1}
                            </td>
                            <td className="playerName col-3">
                              <div className="position-relative d-flex align-items-center">
                                <span>--</span>
                              </div>
                            </td>
                            <td
                              className="playerScore col-4 text-center"
                              style={{ color: stoneHeaders.scoreColor }}
                            >
                              {getFormattedNumber(0, 0)}
                            </td>
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                              $0
                            </td>
                          </tr>
                        )
                      )}
                      {activePlayerMonthly === false &&
                        prevStatus === false &&
                        email && (
                          <tr className={`playerInnerRow weekly-user-row`}>
                            <td className="playerData col-1">
                              {monthlyUser?.statValue !== undefined &&
                              monthlyUser?.statValue > 0
                                ? getFormattedNumber(
                                    Number(monthlyUser.position) + 1,
                                    0
                                  )
                                : "---"}
                            </td>
                            <td className="playerName col-3">
                              <div className="position-relative d-flex align-items-center">
                                <span>{monthlyUser?.displayName}</span>
                              </div>
                            </td>
                            <td
                              className="playerScore col-4 text-center"
                              style={{ color: stoneHeaders.scoreColor }}
                            >
                              {getFormattedNumber(monthlyUser?.statValue, 0)}
                            </td>
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                              ${getFormattedNumber(0, 0)}
                            </td>
                          </tr>
                        )}
                    </>
                  ) : type === "stoneCrack" &&
                    optionText === "weekly" &&
                    selectedChain === "opbnb" ? (
                    <>
                      {weeklyplayerDataOpbnb.map((item, index) => (
                        <tr
                          key={index}
                          className={`playerInnerRow ${
                            item.displayName === username && "weekly-user-row"
                          }`}
                        >
                          <td className="playerData col-1">
                            {getFormattedNumber(Number(item.position) + 1, 0)}
                          </td>
                          <td className="playerName col-3">
                            <div className="position-relative d-flex align-items-center">
                              <span>{item.displayName}</span>
                            </div>
                          </td>
                          <td
                            className="playerScore col-4 text-center"
                            style={{ color: stoneHeaders.scoreColor }}
                          >
                            {getFormattedNumber(item.statValue, 0)}
                          </td>
                          <td
                            className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                            style={{ color: stoneHeaders.rewardColor }}
                          >
                            {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                            $
                            {getFormattedNumber(
                              stoneCrackRewards[index].reward,
                              0
                            )}
                          </td>
                        </tr>
                      ))}
                      {[...Array(10 - weeklyplayerDataOpbnb.length)].map(
                        (item, index) => (
                          <tr key={index} className={`playerInnerRow`}>
                            <td className="playerData col-1">
                              {Number(weeklyplayerDataOpbnb.length + index) + 1}
                            </td>
                            <td className="playerName col-3">
                              <div className="position-relative d-flex align-items-center">
                                <span>--</span>
                              </div>
                            </td>
                            <td
                              className="playerScore col-4 text-center"
                              style={{ color: stoneHeaders.scoreColor }}
                            >
                              {getFormattedNumber(0, 0)}
                            </td>
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                              $0
                            </td>
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={dyp} width={12} height={12} alt="" />{" "} */}
                              $0
                            </td>
                          </tr>
                        )
                      )}
                      {activePlayerWeeklyOpbnb === false &&
                        prevStatus === false &&
                        email && (
                          <tr className={`playerInnerRow weekly-user-row`}>
                            <td className="playerData col-1">
                              {weeklyUserOpbnb?.statValue !== undefined &&
                              weeklyUserOpbnb?.statValue > 0
                                ? getFormattedNumber(
                                    Number(weeklyUserOpbnb.position) + 1,
                                    0
                                  )
                                : "---"}
                            </td>
                            <td className="playerName col-3">
                              <div className="position-relative d-flex align-items-center">
                                <span>{weeklyUserOpbnb?.displayName}</span>
                              </div>
                            </td>
                            <td
                              className="playerScore col-4 text-center"
                              style={{ color: stoneHeaders.scoreColor }}
                            >
                              {getFormattedNumber(
                                weeklyUserOpbnb?.statValue,
                                0
                              )}
                            </td>
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                              ${getFormattedNumber(0, 0)}
                            </td>
                          </tr>
                        )}
                    </>
                  ) : type === "stoneCrack" &&
                    optionText === "monthly" &&
                    selectedChain === "opbnb" ? (
                    <>
                      {monthlyplayerDataOpbnb.map((item, index) => (
                        <tr
                          key={index}
                          className={`playerInnerRow ${
                            item.displayName === username && "weekly-user-row"
                          }`}
                        >
                          <td className="playerData col-1">
                            {Number(item.position) + 1}
                          </td>
                          <td className="playerName col-3">
                            <div className="position-relative d-flex align-items-center">
                              <span>{item.displayName}</span>
                            </div>
                          </td>
                          <td
                            className="playerScore col-4 text-center"
                            style={{ color: stoneHeaders.scoreColor }}
                          >
                            {getFormattedNumber(item.statValue, 0)}
                          </td>
                          <td
                            className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                            style={{ color: stoneHeaders.rewardColor }}
                          >
                            {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                            $
                            {getFormattedNumber(
                              stoneCrackRewardsMonthly[index].rewards,
                              0
                            )}
                          </td>
                        </tr>
                      ))}
                      {[...Array(10 - monthlyplayerDataOpbnb.length)].map(
                        (item, index) => (
                          <tr key={index} className={`playerInnerRow`}>
                            <td className="playerData col-1">
                              {Number(monthlyplayerDataOpbnb.length + index) +
                                1}
                            </td>
                            <td className="playerName col-3">
                              <div className="position-relative d-flex align-items-center">
                                <span>--</span>
                              </div>
                            </td>
                            <td
                              className="playerScore col-4 text-center"
                              style={{ color: stoneHeaders.scoreColor }}
                            >
                              {getFormattedNumber(0, 0)}
                            </td>
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                              $0
                            </td>
                          </tr>
                        )
                      )}
                      {activePlayerMonthlyOpbnb === false &&
                        prevStatus === false &&
                        email && (
                          <tr className={`playerInnerRow weekly-user-row`}>
                            <td className="playerData col-1">
                              {monthlyUserOpbnb?.statValue !== undefined &&
                              monthlyUserOpbnb?.statValue > 0
                                ? getFormattedNumber(
                                    Number(monthlyUserOpbnb.position) + 1,
                                    0
                                  )
                                : "---"}
                            </td>
                            <td className="playerName col-3">
                              <div className="position-relative d-flex align-items-center">
                                <span>{monthlyUserOpbnb?.displayName}</span>
                              </div>
                            </td>
                            <td
                              className="playerScore col-4 text-center"
                              style={{ color: stoneHeaders.scoreColor }}
                            >
                              {getFormattedNumber(
                                monthlyUserOpbnb?.statValue,
                                0
                              )}
                            </td>
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={eth} width={12} height={12} alt="" />{" "} */}
                              ${getFormattedNumber(0, 0)}
                            </td>
                          </tr>
                        )}
                    </>
                  ) : type === "kittyDash" ? (
                    <>
                      {kittyDashRecords.map((item, index) => (
                        <tr
                          key={index}
                          className={`playerInnerRow ${
                            item.displayName === username && "kitty-user-row"
                          }`}
                        >
                          <td className="playerData col-1">
                            {Number(item.position) + 1}
                          </td>
                          <td className="playerName col-3">
                            <div className="position-relative d-flex align-items-center">
                              <span>{item.displayName}</span>
                            </div>
                          </td>
                          <td
                            className="playerScore col-4 text-center"
                            style={{ color: kittyHeaders.scoreColor }}
                          >
                            {getFormattedNumber(item.statValue, 0)}
                          </td>
                          <td
                            className={`playerReward col-4 text-center`}
                            style={{ color: kittyHeaders.rewardColor }}
                          >
                            ${getFormattedNumber(kittyDashRewards[index], 0)}
                          </td>
                        </tr>
                      ))}
                      {[...Array(10 - kittyDashRecords.length)].map(
                        (item, index) => (
                          <tr key={index} className={`playerInnerRow`}>
                            <td className="playerData col-1">
                              {Number(kittyDashRecords.length + index) + 1}
                            </td>
                            <td className="playerName col-3">
                              <div className="position-relative d-flex align-items-center">
                                --
                              </div>
                            </td>
                            <td
                              className="playerScore col-4 text-center"
                              style={{ color: kittyHeaders.scoreColor }}
                            >
                              {getFormattedNumber(0, 0)}
                            </td>
                            <td
                              className={`playerReward col-4 text-center`}
                              style={{ color: kittyHeaders.rewardColor }}
                            >
                              ${getFormattedNumber(0, 0)}
                            </td>
                          </tr>
                        )
                      )}
                      {activePlayerKitty === false &&
                        prevStatus === false &&
                        email && (
                          <tr className={`playerInnerRow kitty-user-row`}>
                            <td className="playerData col-1">
                              {Number(kittyUser?.position) + 1}
                            </td>
                            <td className="playerName col-3">
                              <div className="position-relative d-flex align-items-center">
                                <span>{kittyUser?.displayName}</span>
                              </div>
                            </td>
                            <td
                              className="playerScore col-4 text-center"
                              style={{ color: kittyHeaders.scoreColor }}
                            >
                              {getFormattedNumber(kittyUser?.statValue, 0)}
                            </td>
                            <td
                              className={`playerReward col-4 text-center`}
                              style={{ color: kittyHeaders.rewardColor }}
                            >
                              ${getFormattedNumber(0, 0)}
                            </td>
                          </tr>
                        )}
                    </>
                  ) : (
                    <>
                      {leaderboardCaws2d.slice(0, 10).map((item, index) => (
                        <tr
                          key={index}
                          className={`playerInnerRow ${
                            item?.address?.toLowerCase() ===
                              address?.toLowerCase() && "caws-user-row"
                          }`}
                        >
                          <td className="playerData col-2">
                            {Number(index) + 1}
                          </td>
                          <td className="playerName2 col-2">
                            <div className="position-relative d-flex align-items-center">
                              <span>{item?.username}</span>
                            </div>
                          </td>
                          <td
                            className="playerScore col-2 text-center"
                            style={{ color: cawsHeaders.scoreColor }}
                          >
                            {getFormattedNumber(item?.score, 0)}
                          </td>
                          <td
                            className={`playerReward col-2 text-center`}
                            style={{ color: cawsHeaders.rewardColor }}
                          >
                            {getFormattedNumber(item?.level, 0)}
                          </td>
                          <td
                            className={`playerReward col-2 text-center`}
                            style={{
                              color: cawsHeaders.rewardColor,
                              fontSize: "12px",
                            }}
                          >
                            {formatTimeByLevelAndSecond(
                              item?.timestamp,
                              item?.level
                            )}
                          </td>
                          <td
                            className={`playerReward col-2 text-center`}
                            style={{ color: cawsHeaders.rewardColor }}
                          >
                            ${caws2dRewards[index]}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}

                  {/* {weeklyplayerData &&
                  inactiveBoard === true &&
                  optionText === "weekly" &&
                  weeklyplayerData.length > 0 &&
                  weeklyplayerData.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className={`playerInnerRow ${
                          inactiveBoard || item.displayName === username
                            ? "playerInnerRow-inactive"
                            : null
                        }`}
                      >
                        <td className="playerData col-1">
                          #{item.position + 1}
                        </td>
                        <td className="playerName col-5">
                          {item.displayName === username ? (
                            <div className="position-relative d-flex align-items-center">
                              <img
                                src={premiumAvatar}
                                alt=""
                                className="playerAvatar"
                              />
                              <span>
                                {" "}
                                {item.displayName?.slice(0, 13)}
                                {item.displayName?.length > 13 && "..."}
                              </span>
                            </div>
                          ) : (
                            <div className="position-relative d-flex align-items-center">
                              <img
                                src={playerAvatar}
                                alt=""
                                className="playerAvatar"
                              />{" "}
                              {item.displayName?.slice(0, 13)}
                              {item.displayName?.length > 13 && "..."}
                            </div>
                          )}
                        </td>
                        <td className="playerScore col-2 text-center">
                          {getFormattedNumber(item.statValue, 0)}
                        </td>
                        <td
                          className={`playerReward text-center col-2 ${
                            username === item.displayName
                              ? "goldenscore"
                              : "playerReward"
                          }`}
                        >
                          ${prizes[index]}
                        </td>
                      </tr>
                    );
                  })}

                {inactiveBoard === true &&
                  ((weeklyplayerData.length === 0 && optionText === "weekly") ||
                    (monthlyplayerData.length === 0 &&
                      optionText === "monthly")) &&
                  optionText !== "genesis" && (
                    <CircularProgress
                      size={20}
                      style={{ alignSelf: "center", margin: "auto" }}
                    />
                  )} */}
                </tbody>
              </table>
            </div>
            {activePlayerCaws2d === false &&
              type === "cawsAdventure" &&
              prevStatus === false &&
              caws2dUser.address !== undefined &&
              email && (
                <div
                  className="px-2"
                  style={{ background: "rgba(139, 94, 79, 0.4)" }}
                >
                  <table
                    className={`playerTable w-100 
            
                `}
                  >
                    <tbody>
                      <tr className={`playerInnerRow caws-user-row`}>
                        <td className="playerData col-1">
                          {/* {Number(
                          leaderboardCaws2d.indexOf(
                            leaderboardCaws2d.find((item) => {
                              return item.address === address;
                            })
                          )
                        ) + 1} */}
                        </td>
                        <td className="playerName col-3">
                          <div className="position-relative d-flex align-items-center">
                            <span>{username}</span>
                          </div>
                        </td>
                        <td
                          className="playerScore col-3 text-center"
                          style={{ color: cawsHeaders.scoreColor }}
                        >
                          {getFormattedNumber(caws2dUser?.score, 0)}
                        </td>
                        <td
                          className="playerScore col-2 text-center"
                          style={{ color: cawsHeaders.rewardColor }}
                        >
                          {getFormattedNumber(caws2dUser?.level, 0)}
                        </td>
                        <td
                          className={`playerReward col-2 text-center`}
                          style={{
                            color: cawsHeaders.rewardColor,
                            fontSize: "12px",
                          }}
                        >
                          {formatTimeByLevelAndSecond(
                            caws2dUser.timestamp,
                            caws2dUser.level
                          )}
                        </td>
                        <td
                          className={`playerReward col-3 text-center`}
                          style={{ color: cawsHeaders.rewardColor }}
                        >
                          $0
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
          </div>

          <div className="optionsWrapper2 p-2">
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between gap-2 align-items-center">
                <span className="viewWinners">View previous winners</span>
                <Switch
                  onChange={() => {
                    switchPrev();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
