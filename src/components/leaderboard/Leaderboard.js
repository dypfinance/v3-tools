import React, { useState } from "react";
import "./leaderboard.scss";
import Switch from "@mui/material/Switch";
import getFormattedNumber from "../../functions/get-formatted-number";
import { CircularProgress } from "@mui/material";
import playerAvatar from "./assets/userAvatar2.png";
import premiumAvatar from "./assets/premiumAvatar.png";
import premiumStar from "./assets/premiumStar.png";

const Leaderboard = ({
  userData,
  username,
  monthlyplayerData,
  weeklyplayerData,
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
  const [optionText, setOptionText] = useState("weekly");
  const [inactiveBoard, setInactiveBoard] = useState(false);
  const [prizes, setPrizes] = useState(weeklyPrizes);
  const [activePlayer, setActivePlayer] = useState(false);
const [type, setType] = useState("stoneCrack")


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

  return (
    <div
      className="main-wrapper py-4 w-100 d-flex gap-4 mt-xxl-0 mt-lg-0 justify-content-center align-items-start"
      style={{ minHeight: "560px" }}
    >
      <div className="row w-100 align-items-start gap-4 gap-lg-0">
        <div className="d-flex flex-column gap-3 col-12  px-0">
            <div className="leaderboard-types-grid">
              <button className={`leaderboard-type-btn ${type === "stoneCrack" && "leaderboard-type-btn-active"} d-flex-align-items-center justify-content-center p-2`} onClick={() => setType("stoneCrack")}>
                Stone Crack
              </button>
              <button className={`leaderboard-type-btn ${type === "kittyDash" && "leaderboard-type-btn-active"} d-flex-align-items-center justify-content-center p-2`} onClick={() => {setType("kittyDash"); handleOption("weekly");}}>
                Kitty Dash
              </button>
              <button className={`leaderboard-type-btn ${type === "caws" && "leaderboard-type-btn-active"} d-flex-align-items-center justify-content-center p-2`} onClick={() => {setType("caws"); handleOption("weekly")}}>
                CAWS Adventure
              </button>
            </div>
          <div className="d-flex align-items-center gap-1">
            <div className="optionsWrapper col-12">
              <div
                className="d-flex gap-1 align-items-center justify-content-between"
                style={{ height: 38 }}
              >
                <span
                  className={`${
                    optionText === "weekly" && "otheroptionsActive"
                  } durationText col-3`}
                  style={{ width: type !== "stoneCrack" ? "100%" : "50%" }}
                  onClick={() => {
                    handleOption("weekly");
                  }}
                >
                  Weekly
                </span>
               {type === "stoneCrack" &&
                <span
                className={`${
                  optionText === "monthly" && "otheroptionsActive"
                } durationText col-3`}
                style={{ width: "50%" }}
                onClick={() => {
                  handleOption("monthly");
                }}
              >
                Monthly
              </span>
               }
              </div>
            </div>
          </div>
          <div
            className="d-flex flex-column gap-2 tablewrapper"
            style={{ height: optionText === "genesis" ? "345px" : "384px" }}
          >
            <table className="playerTable">
              <tbody>
                <tr className="playerRow">
                  <th className="playerHeader">Rank</th>
                  <th className="playerHeader">Player</th>
                  {optionText !== "genesis" && (
                    <th className="playerHeader text-center">Score</th>
                  )}
                  {optionText !== "genesis" && (
                    <th className="playerHeader text-center">Reward</th>
                  )}
                </tr>

                {[...Array(10)].map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className={`playerInnerRow`}
                      >
                        <td className="playerData col-1">
                          {Number(index) + 1}
                        </td>
                        <td className="playerName col-5">
                            <div className="position-relative d-flex align-items-center">
                              {/* <img
                                src={premiumAvatar}
                                alt=""
                                className="playerAvatar"
                              /> */}
                              <span>
                                {" "}
                                DarkSliffer
                              </span>
                            </div>
                        </td>
                        <td className="playerScore col-2  text-center">
                          1500
                        </td>
                        <td
                          className={`playerReward text-center col-2`}
                        >
                          ${weeklyPrizes[index]}
                        </td>
                      </tr>
                    );
                  })}

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

            {/* {activePlayer === false &&
              inactiveBoard === false &&
              optionText !== "genesis" && (
                <table className="playerTable">
                  <tbody>
                    <tr className={`playerInnerRow-inactive`}>
                      <td
                        className={`playerData ${
                          optionText === "genesis" ? "col-2" : "col-1"
                        }`}
                      >
                        #{userData.position + 1}
                      </td>
                      <td className="playerName col-5">
                        <div className="position-relative  d-flex align-items-center">
                          <div className="position-relative d-flex align-items-center">
                            <img
                              src={premiumAvatar}
                              alt=""
                              className="playerAvatar"
                            />
                            <img
                              src={premiumStar}
                              alt=""
                              className="premium-star"
                            />
                            <span>
                              {" "}
                              {userData.displayName?.slice(0, 13)}
                              {userData.displayName?.length > 13 && "..."}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="playerScore col-2 text-center">
                        {getFormattedNumber(userData.statValue, 0)}
                      </td>

                      <td
                        className={`playerReward text-center ${
                          username === userData.displayName
                            ? "goldenscore"
                            : "playerReward"
                        } col-2 ${optionText !== "genesis" && "text-center"} `}
                      >
                        $
                        {optionText === "genesis"
                          ? getFormattedNumber(userData.statValue, 0)
                          : "0"}{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )} */}
          </div>
          <div className="optionsWrapper2 p-2">
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between gap-2 align-items-center">
                <span className="viewWinners">View previous winners</span>
                <Switch
                  onChange={() => {
                    setInactiveBoard(!inactiveBoard);
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
