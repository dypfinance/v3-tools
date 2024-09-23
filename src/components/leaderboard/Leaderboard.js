import React, { useEffect, useState } from "react";
import "./leaderboard.scss";
import Switch from "@mui/material/Switch";
import getFormattedNumber from "../../functions/get-formatted-number";
import { CircularProgress } from "@mui/material";
import playerAvatar from "./assets/userAvatar2.png";
import premiumAvatar from "./assets/premiumAvatar.png";
import premiumStar from "./assets/premiumStar.png";
import kittyDashFlag from "./assets/kittyDashFlag.png";
import stoneCrackFlag from "./assets/stoneCrackFlag.png";
import cawsAdventuresFlag from "./assets/cawsAdventuresFlag.png";
import eth from "./assets/eth.svg";
import dyp from "./assets/dyp.svg";

const Leaderboard = ({
  userData,
  username,
  type,
  setType,
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
        name: "ETH Reward",
        class: "col-2 text-center leaderboard-rewards-bg",
      },
      {
        name: "DYP Reward",
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
        class: "col-1",
      },
      {
        name: "Player",
        class: "col-3",
      },
      {
        name: "Score",
        class: "col-3 text-center",
      },
      {
        name: "Level",
        class: "col-2 text-center",
      },
      {
        name: "Time",
        class: "col-3 text-center",
      },
    ],
  };

  const stoneCrackRewards = [
    {
      ethReward: 1000,
      dypReward: 1000,
    },
    {
      ethReward: 500,
      dypReward: 500,
    },
    {
      ethReward: 10,
      dypReward: 10,
    },
    {
      ethReward: 10,
      dypReward: 10,
    },
    {
      ethReward: 10,
      dypReward: 10,
    },
    {
      ethReward: 10,
      dypReward: 10,
    },
    {
      ethReward: 10,
      dypReward: 10,
    },
    {
      ethReward: 10,
      dypReward: 10,
    },
    {
      ethReward: 10,
      dypReward: 10,
    },
    {
      ethReward: 10,
      dypReward: 10,
    },
  ];

  const kittyDashRewards = [1000, 500, 10, 10, 10, 10, 10, 10, 10, 10];

  const stoneData = [
    {
      player: "DarkSliffer",
      score: 11502635,
      ethReward: 1000,
      dypReward: 1000,
    },
    {
      player: "Energy",
      score: 10102000,
      ethReward: 500,
      dypReward: 500,
    },
    {
      player: "POGL",
      score: 7502635,
      ethReward: 10,
      dypReward: 10,
    },
    {
      player: "GDoge",
      score: 5000000,
      ethReward: 10,
      dypReward: 10,
    },
    {
      player: "Beku",
      score: 2404445,
      ethReward: 10,
      dypReward: 10,
    },
    {
      player: "Lorena",
      score: 1152879,
      ethReward: 10,
      dypReward: 10,
    },
    {
      player: "Dark",
      score: 906800,
      ethReward: 10,
      dypReward: 10,
    },
    {
      player: "Rediness",
      score: 901625,
      ethReward: 10,
      dypReward: 10,
    },
    {
      player: "Gbani",
      score: 800583,
      ethReward: 10,
      dypReward: 10,
    },
    {
      player: "Sakrifica",
      score: 783540,
      ethReward: 10,
      dypReward: 10,
    },
  ];
  const kittyData = [
    {
      player: "DarkSliffer",
      score: 11502635,
      reward: 1000,
    },
    {
      player: "Energy",
      score: 10102000,
      reward: 500,
    },
    {
      player: "POGL",
      score: 7502635,
      reward: 10,
    },
    {
      player: "GDoge",
      score: 5000000,
      reward: 10,
    },
    {
      player: "Beku",
      score: 2404445,
      reward: 10,
    },
    {
      player: "Lorena",
      score: 1152879,
      reward: 10,
    },
    {
      player: "Dark",
      score: 906800,
      reward: 10,
    },
    {
      player: "Rediness",
      score: 901625,
      reward: 10,
    },
    {
      player: "Gbani",
      score: 800583,
      reward: 10,
    },
    {
      player: "Sakrifica",
      score: 783540,
      reward: 10,
    },
  ];
  const cawsData = [
    {
      player: "DarkSliffer",
      score: 11502635,
      level: 10,
      time: "2m:01s",
    },
    {
      player: "Energy",
      score: 10102000,
      level: 10,
      time: "2m:05s",
    },
    {
      player: "POGL",
      score: 7502635,
      level: 10,
      time: "3m:15s",
    },
    {
      player: "GDoge",
      score: 5000000,
      level: 9,
      time: "6m:12s",
    },
    {
      player: "Beku",
      score: 2404445,
      level: 8,
      time: "6m:55s",
    },
    {
      player: "Lorena",
      score: 1152879,
      level: 10,
      time: "10m:05s",
    },
    {
      player: "Dark",
      score: 906800,
      level: 10,
      time: "50m:05s",
    },
    {
      player: "Rediness",
      score: 901625,
      level: 9,
      time: "59m:05s",
    },
    {
      player: "Gbani",
      score: 800583,
      level: 2,
      time: "1h:12m:05s",
    },
    {
      player: "Sakrifica",
      score: 783540,
      level: 10,
      time: "1h:16m:05s",
    },
  ];

  const [optionText, setOptionText] = useState("weekly");
  const [inactiveBoard, setInactiveBoard] = useState(false);
  const [prizes, setPrizes] = useState(weeklyPrizes);
  const [activePlayer, setActivePlayer] = useState(false);
  const [prevStatus, setPrevStatus] = useState(false);

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
    fetchKittyDashWinners();
  }, []);

  const switchPrev = () => {
    setPrevStatus((prevStatus) => {
      const newStatus = !prevStatus;
  
      if (newStatus) {
        fetchPreviousWeeklyWinners();
        fetchPreviousMonthlyWinners();
        fetchPreviousKittyDashWinners();
      } else {
        fetchWeeklyWinners();
        fetchMonthlyWinners();
        fetchKittyDashWinners();
      }
  
      return newStatus;
    });
  };

  return (
    <div
      className="main-wrapper py-4 w-100 d-flex gap-4 mt-xxl-0 mt-lg-0 justify-content-center align-items-start"
      style={{ minHeight: "560px" }}
    >
      <div className="row w-100 align-items-start gap-4 gap-lg-0">
        <div className="d-flex flex-column gap-3 col-12  px-0">
          <div className="d-flex leaderboards-flag-wrapper align-items-center gap-2 justify-content-center">
            <img
              src={stoneCrackFlag}
              onClick={() => setType("stoneCrack")}
              className="leaderboard-flag"
              alt=""
            />
            <img
              src={kittyDashFlag}
              onClick={() => {
                setType("kittyDash");
                handleOption("weekly");
              }}
              className="leaderboard-flag"
              alt=""
            />
            <img
              src={cawsAdventuresFlag}
              onClick={() => {
                setType("cawsAdventure");
                handleOption("weekly");
              }}
              className="leaderboard-flag"
              alt=""
            />
          </div>
          <div className="d-flex align-items-center gap-1 mt-5">
            <div className="optionsWrapper col-12">
              <div
                className="d-flex gap-1 align-items-center justify-content-between position-relative"
                style={{ height: 38 }}
              >
                <div
                  className={`leaderboard-options-bg ${
                    optionText === "monthly" && "move-right"
                  } ${type !== "stoneCrack" && "d-none"} w-50`}
                ></div>
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
                {type === "stoneCrack" && (
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
                    style={{ width: "50%" }}
                    onClick={() => {
                      handleOption("monthly");
                    }}
                  >
                    Monthly
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex flex-column gap-2 tablewrapper">
            <div className="inner-table-wrapper p-2 w-100 position-relative">
              {type === "stoneCrack" && (
                <span className="playerHeader reward-position d-none  d-lg-flex justify-content-center px-0 leaderboard-rewards-bg">
                  Rewards
                </span>
              )}
              <table className="playerTable w-100">
                <tbody>
                  <tr className="playerRow">
                    {type === "stoneCrack" ? (
                      <>
                        {stoneHeaders.headers.map((item, index) =>
                          item.name === "ETH Reward" ? (
                            <th
                              className={`playerHeader ${item.class}`}
                              key={index}
                            >
                              <img src={eth} width={15} height={15} alt="" />{" "}
                              {/* {item.name.slice(4, item.name.length)} */}
                              ETH
                            </th>
                          ) : item.name === "DYP Reward" ? (
                            <th
                              className={`playerHeader ${item.class}`}
                              key={index}
                            >
                              <img src={dyp} width={15} height={15} alt="" />{" "}
                              {/* {item.name.slice(4, item.name.length)} */}
                              DYP
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
                          >
                            {item.name}
                          </th>
                        ))}
                      </>
                    )}
                  </tr>

                  {type === "stoneCrack" && optionText === "weekly" ? (
                    <>
                      {weeklyplayerData.map((item, index) => (
                        <tr key={index} className={`playerInnerRow ${item.displayName === username && "weekly-user-row"}`}>
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
                              stoneCrackRewards[index].ethReward,
                              0
                            )}
                          </td>
                          <td
                            className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                            style={{ color: stoneHeaders.rewardColor }}
                          >
                            {/* <img src={dyp} width={12} height={12} alt="" />{" "} */}
                            $
                            {getFormattedNumber(
                              stoneCrackRewards[index].ethReward,
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
                      {activePlayerWeekly === false && prevStatus === false && (
                        <tr className={`playerInnerRow weekly-user-row`}>
                          <td className="playerData col-1">
                            {Number(weeklyUser?.position) + 1}
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
                          <td
                            className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                            style={{ color: stoneHeaders.rewardColor }}
                          >
                            {/* <img src={dyp} width={12} height={12} alt="" />{" "} */}
                            ${getFormattedNumber(0, 0)}
                          </td>
                        </tr>
                      )}
                    </>
                  ) : type === "stoneCrack" && optionText === "monthly" ? (
                    <>
                      {monthlyplayerData.map((item, index) => (
                        <tr key={index} className={`playerInnerRow ${item.displayName === username && "weekly-user-row"}`}>
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
                              stoneCrackRewards[index].ethReward,
                              0
                            )}
                          </td>
                          <td
                            className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                            style={{ color: stoneHeaders.rewardColor }}
                          >
                            {/* <img src={dyp} width={12} height={12} alt="" />{" "} */}
                            $
                            {getFormattedNumber(
                              stoneCrackRewards[index].ethReward,
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
                      {activePlayerMonthly === false &&
                        prevStatus === false && (
                          <tr className={`playerInnerRow weekly-user-row`}>
                            <td className="playerData col-1">
                              {Number(monthlyUser?.position) + 1}
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
                            <td
                              className={`playerReward col-2 text-center leaderboard-rewards-bg`}
                              style={{ color: stoneHeaders.rewardColor }}
                            >
                              {/* <img src={dyp} width={12} height={12} alt="" />{" "} */}
                              ${getFormattedNumber(0, 0)}
                            </td>
                          </tr>
                        )}
                    </>
                  ) : type === "kittyDash" ? (
                    <>
                      {kittyDashRecords.map((item, index) => (
                        <tr key={index} className={`playerInnerRow ${item.displayName === username && "kitty-user-row"}`}>
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
                      {activePlayerKitty === false && prevStatus === false && (
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
                      {cawsData.map((item, index) => (
                        <tr key={index} className={`playerInnerRow`}>
                          <td className="playerData col-1">
                            {Number(index) + 1}
                          </td>
                          <td className="playerName col-3">
                            <div className="position-relative d-flex align-items-center">
                              <span>{item.player}</span>
                            </div>
                          </td>
                          <td
                            className="playerScore col-3 text-center"
                            style={{ color: cawsHeaders.scoreColor }}
                          >
                            {getFormattedNumber(item.score, 0)}
                          </td>
                          <td
                            className={`playerReward col-2 text-center`}
                            style={{ color: cawsHeaders.scoreColor }}
                          >
                            {getFormattedNumber(item.level, 0)}
                          </td>
                          <td
                            className={`playerReward col-3 text-center`}
                            style={{ color: cawsHeaders.rewardColor }}
                          >
                            {item.time}
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
