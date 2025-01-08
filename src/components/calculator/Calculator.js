import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { isMobile } from "react-device-detect";
import { NavLink } from "react-router-dom";

import getFormattedNumber from "../../functions/getFormattedNumber2";

import { abbreviateNumber } from "js-abbreviation-number";

import "./calculator.css";
import {
  ClickAwayListener,
  createTheme,
  TextField,
  Tooltip,
} from "@material-ui/core";
import useWindowSize from "../../functions/useWindowSize";

const Calculator = ({ earnClass, onClose, ref }) => {
  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {},
        },
      },
    },
  });

  const chainButtonsArray = [
    {
      icon: "eth.svg",
      text: "ETH",
    },
    {
      icon: "bnb.svg",
      text: "BSC",
    },
    {
      icon: "avax.svg",
      text: "AVAX",
    },
  ];
  const timePillsArray = ["1 month", "3 months", "6 months", "Max"];
  const pillsNames = ["Staking", "Vault"];

  const getActivePill = (activePill) => {
    setActiveMethod(activePill);
  };

  const [usdToDeposit, setUsdToDeposit] = useState(1000);
  const [days, setDays] = useState(365);
  const [activeChain, setActiveChain] = useState(chainButtonsArray[0]);
  const [activeTime, setActiveTime] = useState(
    timePillsArray[timePillsArray.length - 1]
  );
  const [activeMethod, setActiveMethod] = useState(pillsNames[0]);
  const [calculateApproxUSD, setCalculateApproxUSD] = useState(0);
  const [calculateApproxUSDAVAX, setCalculateApproxUSDAVAX] = useState(0);
  const [calculateApproxUSDBNB, setCalculateApproxUSDBNB] = useState(0);

  const [calculateApproxWeth, setCalculateApproxWeth] = useState("0");
  const [calculateApproxWbnb, setCalculateApproxWbnb] = useState("0");
  const [calculateApproxWavax, setCalculateApproxWavax] = useState("0");
  const [stakeApy, setStakeApy] = useState();
  const [stakeApyBNB, setStakeApyBNB] = useState();
  const [stakeApyAVAX, setStakeApyAVAX] = useState();
  const [activePill, setActivePill] = useState(pillsNames[0]);
  const [open, setOpen] = React.useState(false);
  const [activeTimePill, setActiveTimePill] = useState(timePillsArray[3]);

  const [apyData, setapyData] = useState();
  const [wethPrice, setWethPrice] = useState(0);
  const [wbnbPrice, setWbnbPrice] = useState(0);
  const [wavaxPrice, setWavaxPrice] = useState(0);
  const [dypPrice, setDypPrice] = useState(0);
  const [idypPrice, setiDypPrice] = useState(0);

  let formData = {};
  const pillRef = useRef([]);
  if (isMobile) {
    const newChainButtons = [...chainButtonsArray];

    newChainButtons.map((item) => {
      item.text = item.text.split(" ")[0];
      return item;
    });
  }

  const getApy = async () => {
    await axios
      .get("https://api.dyp.finance/api/highest-apy")
      .then((data) => {
        setapyData(data.data.highestAPY);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getEthApy = async () => {
    await axios
      .get("https://api.dyp.finance/api/get_staking_info_eth")
      .then((data) => {
        // console.log(data.data.highestAPY_ETH[0].highest_apy)
        // setStakeApy(data.data.highestAPY_ETH[0].highest_apy);
        setStakeApy(35);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getETHdata = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_eth_v2")
      .then((data) => {
        setWethPrice(data.data.the_graph_eth_v2.usd_per_eth);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getBSCdata = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_bsc_v2")
      .then((data) => {
        setWbnbPrice(data.data.the_graph_bsc_v2.usd_per_eth);

        const propertyIDyp = Object.entries(
          data.data.the_graph_bsc_v2.token_data
        );
        setiDypPrice(propertyIDyp[1][1].token_price_usd);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getPriceDYP = async () => {
    const dypprice = await axios
      .get(
        "https://api.geckoterminal.com/api/v2/networks/eth/pools/0x7c81087310a228470db28c1068f0663d6bf88679"
      )
      .then((res) => {
        return res.data.data.attributes.base_token_price_usd;
      })
      .catch((e) => {
        console.log(e);
      });

    setDypPrice(dypprice);
  };

  const getAVAXdata = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_avax_v2")
      .then((data) => {
        const wavaxPrice = data.data.the_graph_avax_v2.usd_per_eth;
        setWavaxPrice(wavaxPrice);
      });
  };

  useEffect(() => {
    getApy();

    getEthApy();
  }, [wethPrice, wavaxPrice, wbnbPrice, activeMethod]);

  useEffect(() => {
    if (apyData) {
      if (activeMethod === "Staking") {
        setStakeApyAVAX(25);
        setStakeApyBNB(25);
        // setStakeApy(30);
      }
    }
  }, [activeMethod, apyData]);
  const vaultplatformArrayNew = [3.08, 3.02, 3.94, 4.46, 4.8];

  useEffect(() => {
    if (activeMethod === "Staking") {
      setCalculateApproxUSD(
        (
          ((parseInt(usdToDeposit) * parseFloat(stakeApy)) / 100 / 365) *
          parseInt(days)
        ).toFixed(2)
      );

      setCalculateApproxWeth(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(stakeApy)) / 100 / 365) *
              parseInt(days)
          ) / dypPrice,
          4
        )
      );

      setCalculateApproxUSDBNB(
        (
          ((parseInt(usdToDeposit) * parseFloat(stakeApyBNB)) / 100 / 365) *
          parseInt(days)
        ).toFixed(2)
      );
      setCalculateApproxWbnb(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(stakeApyBNB)) / 100 / 365) *
              parseInt(days)
          ) / idypPrice,
          4
        )
      );

      setCalculateApproxUSDAVAX(
        (
          ((parseInt(usdToDeposit) * parseFloat(stakeApyAVAX)) / 100 / 365) *
          parseInt(days)
        ).toFixed(2)
      );
      setCalculateApproxWavax(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(stakeApyAVAX)) / 100 / 365) *
              parseInt(days)
          ) / dypPrice,
          4
        )
      );
    } else if (activeMethod === "Vault") {
      setCalculateApproxUSD(
        (
          ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[0])) /
            100 /
            365) *
          parseInt(days)
        ).toFixed(2)
      );

      setCalculateApproxWeth(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[0])) /
              100 /
              365) *
              parseInt(days)
          ) / wethPrice,
          4
        )
      );

      setCalculateApproxUSDBNB(
        (
          ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[2])) /
            100 /
            365) *
          parseInt(days)
        ).toFixed(2)
      );
      setCalculateApproxWbnb(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[2])) /
              100 /
              365) *
              parseInt(days)
          ),
          4
        )
      );

      setCalculateApproxUSDAVAX(
        (
          ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[3])) /
            100 /
            365) *
          parseInt(days)
        ).toFixed(2)
      );

      setCalculateApproxWavax(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[3])) /
              100 /
              365) *
              parseInt(days)
          ),
          4
        )
      );
    }
  }, [
    activeMethod,
    stakeApy,
    stakeApyAVAX,
    stakeApyBNB,
    idypPrice,

    usdToDeposit,
    days,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    formData = {
      usdToDeposit,
      days,
      chain: activeChain,
      time: activeTime.text,
      method: activeMethod,
    };

    console.log(formData);
  };

  const handleInputDays = (e) => {
    setDays(e.slice(0, 5));
    if (parseInt(e) <= 30) {
      setActiveTime(timePillsArray[0]);
      setActiveTimePill(timePillsArray[0]);
    } else if (parseInt(e) > 30 && parseInt(e) < 92) {
      setActiveTime(timePillsArray[1]);
      setActiveTimePill(timePillsArray[1]);
    } else if (parseInt(e) > 92 && parseInt(e) < 185) {
      setActiveTime(timePillsArray[2]);
      setActiveTimePill(timePillsArray[2]);
    } else if (parseInt(e) > 185) {
      setActiveTime(timePillsArray[3]);
      setActiveTimePill(timePillsArray[3]);
    }
  };

  const handleInputUSD = (e) => {
    setUsdToDeposit(e.slice(0, 7));
  };

  const focusInput = (field) => {
    document.getElementById(field).focus();
  };

  useEffect(() => {
    getPriceDYP();
    getETHdata();
    getBSCdata();
    getAVAXdata();
  }, []);

  return (
    <div
      id="calculator"
      className={`calculator-wrapper position-relative ${earnClass}`}
    >
      <div className="purplediv" style={{ background: "#8E97CD" }}></div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-column gap-2 justify-content-between">
          <div className="d-flex justify-content-between gap-2 align-items-center pb-4">
            <h6 className="d-flex gap-2 align-items-center calc-title">
              <img
                src={"https://cdn.worldofdypians.com/tools/calculator.svg"}
                alt=""
              />{" "}
              Calculator
            </h6>
            <img
              src={"https://cdn.worldofdypians.com/tools/calculatorChart.svg"}
              className="calculator-chart d-flex d-md-none"
              alt=""
            />

            {/* {earnClass === "earn-calculator" && (
              <img
                src={xMark}
                width={25}
                height={25}
                onClick={onClose}
              style={{ cursor: "pointer" }}
              />
            )} */}
            {/* <ClickAwayListener onClickAway={handleTooltipClose}>
           <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              placement="top"
              title={
                <div className="tooltip-text">
                  {
                    "This calculator is for informational purposes only."
                  }
                </div>
              }
            >
              <img src={moreinfo} width={24} height={24} className="cursor-pointer" alt="tooltip" onClick={handleTooltipOpen} />
            </Tooltip>
           </ClickAwayListener> */}
          </div>
          <div className="pills-container gap-3 d-flex justify-content-start row m-0 w-100 position-relative">
            <img
              src={"https://cdn.worldofdypians.com/tools/calculatorChart.svg"}
              className="calculator-chart d-none d-xl-flex"
              alt=""
            />
            {pillsNames &&
              pillsNames.length > 0 &&
              pillsNames.map((item, id) => (
                <p
                  key={id}
                  onClick={() => {
                    setActivePill(item);
                    getActivePill(item);
                  }}
                  className={`col col-lg-3 pill-item d-flex align-items-center gap-2 ${
                    activePill == item ? "active-color" : ""
                  }`}
                  ref={(el) => (pillRef.current[id] = el)}
                  style={{
                    background: activePill == item ? "#1E1C40" : "#312F69",
                    color: activePill == item ? "#F7F7FC" : "#8E97CD",
                    border:
                      activePill == item
                        ? "1px solid #565891"
                        : "1px solid #312F69",
                  }}
                >
                  <img
                    src={`https://cdn.worldofdypians.com/tools/${item.toLowerCase()}Icon.svg`}
                    alt=""
                  />
                  <span className={`pill-item-text`}>{item}</span>
                </p>
              ))}
          </div>
          <div className="separator"></div>

          <div
            className="row align-items-center gap-2 m-0 position-relative"
            style={{ top: "15px" }}
          >
            {/* <div
              className="inputwrapper position-relative px-0"
              style={{ width: "32%" }}
            >
              <h6 className="inputlabel position-absolute">
                USD to deposit<h6 className="requiredstar">*</h6>
              </h6>
              <input
                type="number"
                min={1}
                className="form-control calcinput w-100"
                id="usd_to_deposit"
                name="usd_to_deposit"
                value={usdToDeposit}
                onChange={(e) => handleInputUSD(e.target.value)}
              />
            </div> */}
            <div className="input-container usd-input px-0">
              <input
                type="number"
                min={1}
                max={999999}
                maxLength={6}
                autoComplete="off"
                id="usd_to_deposit"
                name="usd_to_deposit"
                value={usdToDeposit}
                placeholder=" "
                className="text-input"
                onChange={(e) => handleInputUSD(e.target.value)}
                style={{ width: "100%" }}
              />
              <label
                htmlFor="usd"
                className="label"
                onClick={() => focusInput("usd_to_deposit")}
              >
                USD to deposit
              </label>
            </div>
            <div className="input-container days-input px-0">
              <input
                type="number"
                min={1}
                max={365}
                id="days"
                name="days"
                value={days}
                placeholder=" "
                className="text-input"
                onChange={(e) => handleInputDays(e.target.value)}
                style={{ width: "100%" }}
              />
              <label
                htmlFor="usd"
                className="label"
                onClick={() => focusInput("days")}
              >
                Days
              </label>
            </div>
            <span className="calculator-purpose px-0 mt-3 mt-lg-0">
              This calculator is for informational purposes only
            </span>

            {/* <div
              className="inputwrapper position-relative px-0"
              style={{ width: "32%", paddingLeft: 0 }}
            >
              <h6 className="inputlabel position-absolute">
                Days<h6 className="requiredstar">*</h6>
              </h6>
              <input
                type="number"
                min={1}
                max={365}
                className="form-control calcinput w-100"
                id="days"
                name="days"
                value={days}
                onChange={(e) => handleInputDays(e.target.value)}
              />
            </div> */}
            {/* <div className="time-pills-container row m-0">)
              {timePillsArray.length > 0 &&
                timePillsArray.map((item, id) => (
                  <p
                    key={id}
                    className={`time-pill-item`}
                    ref={(el) => (timepillRef.current[id] = el)}
                    onClick={() => {
                      setActiveTimePill(item);
                      handleInputDays2(item);
                    }} // ref={(el) => (pillRef.current[id] = el)}
                    style={{
                      background:
                        activeTimePill == item
                          ? "linear-gradient(90.74deg, #7770E0 0%, #554FD8 100%)"
                          : "transparent",
                      color: activeTimePill == item ? "#F7F7FC" : "#6E7191",
                      border: "none",
                    }}
                  >
                    {item}
                  </p>
                ))}
            </div> */}
          </div>

          {/* <div className="d-flex justify-content-between gap-2 align-items-end mt-3">
            <button
              className="earnbtn btn"
              onClick={() => {
                gotoEarn();
              }}
            >
              Earn now <img src={rightarrow} alt="" />{" "}
            </button>
          
             <div className="d-flex justify-content-end gap-2 align-items-center mt-2">
           
           <h6 className="output-txt d-flex flex-column align-items-center gap-1">
             ${calculateApproxUSD === "NaN" ? "0.0" : calculateApproxUSD}
             <h6 className="cryptotext">
               Approx. (
               {calculateApproxCrypto != "∞.undefined" &&
                 calculateApproxCrypto != "..."
                 ? calculateApproxCrypto
                 : "0.0"}
               {activeChain.text === "BSC"
                 ? "WBNB"
                 : activeChain.text === "AVAX"
                   ? "WAVAX"
                   : "WETH"}
               )
             </h6>
           </h6>
         </div>
          </div>
            <h6 className="calc-footer mt-3">
              *This calculator is for informational purposes only. Calculated
              yields assume that prices of the deposited assets don't change.
            </h6> */}
          <div className="row w-100 gap-3 gap-lg-2 gap-xl-0 mx-0 align-items-center justify-content-between mt-4 mt-lg-5 position-relative calculator-chains-wrapper">
            <NavLink to={"/earn/dypius"} className="ethereum-chain-wrapper">
              <div className="chain-content gap-4 p-2">
                <div className="values-wrapper align-items-start d-flex flex-column gap-1">
                  <div className="usd-value">
                    $
                    {calculateApproxUSD === "NaN"
                      ? "0.0"
                      : abbreviateNumber(calculateApproxUSD)}
                  </div>
                  <div className="approx-value">
                    Approx. (
                    {calculateApproxWeth != "∞.undefined" &&
                    calculateApproxWeth != "..."
                      ? calculateApproxWeth.slice(0, 6)
                      : "0.0"}{" "}
                    {activeMethod === "Vault" ? "WETH" : "DYP"})
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2 gap-lg-4">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={
                        activeMethod === "Vault"
                          ? "https://cdn.worldofdypians.com/tools/weth.svg"
                          : "https://cdn.worldofdypians.com/tools/ethStakeActive.svg"
                      }
                      width={20}
                      height={20}
                      alt=""
                    />
                    <h6 className="chain-name">
                      {activeMethod === "Vault" ? "WETH" : "Ethereum"}
                    </h6>
                  </div>
                  <img
                    src={"https://cdn.worldofdypians.com/tools/filledArrow.svg"}
                    alt=""
                  />
                </div>
              </div>
            </NavLink>
            <NavLink
              to={"/earn/dypius"}
              className={
                activeMethod === "Vault" ? "usdc-wrapper" : `bnb-chain-wrapper`
              }
            >
              <div className="chain-content gap-4 p-2">
                <div className="values-wrapper d-flex flex-column gap-1">
                  <div className="usd-value">
                    $
                    {calculateApproxUSDBNB === "NaN"
                      ? "0.0"
                      : abbreviateNumber(calculateApproxUSDBNB)}
                  </div>
                  <div className="approx-value">
                    Approx. (
                    {calculateApproxWbnb != "∞.undefined" &&
                    calculateApproxWbnb != "..."
                      ? calculateApproxWbnb.slice(0, 6)
                      : "0.0"}{" "}
                    {activeMethod === "Vault" ? "USDC" : "iDYP"})
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2 gap-lg-4">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={
                        activeMethod === "Vault"
                          ? "https://cdn.worldofdypians.com/tools/usdc.svg"
                          : "https://cdn.worldofdypians.com/tools/bnbStakeActive.svg"
                      }
                      width={20}
                      height={20}
                      alt=""
                    />
                    <h6 className="chain-name">
                      {activeMethod === "Vault" ? "USDC" : "BNB Chain"}
                    </h6>
                  </div>
                  <img
                    src={"https://cdn.worldofdypians.com/tools/filledArrow.svg"}
                    alt=""
                  />
                </div>
              </div>
            </NavLink>
            <NavLink
              to={"/earn/dypius"}
              className={
                activeMethod === "Vault" ? "usdt-wrapper" : "avax-chain-wrapper"
              }
            >
              <div className="chain-content  gap-4 p-2">
                <div className="d-flex values-wrapper flex-column gap-1">
                  <div className="usd-value">
                    $
                    {calculateApproxUSDAVAX === "NaN"
                      ? "0.0"
                      : abbreviateNumber(calculateApproxUSDAVAX)}
                  </div>
                  <div className="approx-value">
                    Approx. (
                    {calculateApproxWavax != "∞.undefined" &&
                    calculateApproxWavax != "..."
                      ? calculateApproxWavax.slice(0, 6)
                      : "0.0"}{" "}
                    {activeMethod === "Vault" ? "USDT" : "DYP"})
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2 gap-lg-4">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={
                        activeMethod === "Vault"
                          ? "https://cdn.worldofdypians.com/tools/usdt.svg"
                          : "https://cdn.worldofdypians.com/wod/baseBlueLogo.svg"
                      }
                      width={20}
                      height={20}
                      alt=""
                    />
                    <h6 className="chain-name">
                      {activeMethod === "Vault" ? "USDT" : "Base Chain"}
                    </h6>
                  </div>
                  <img
                    src={"https://cdn.worldofdypians.com/tools/filledArrow.svg"}
                    alt=""
                  />
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
};
Calculator.propTypes = {
  values: PropTypes.shape({
    usd_to_deposit: PropTypes.string,
    days: PropTypes.string,
    method: PropTypes.string,
    type_of_chain: PropTypes.string,
    time_period: PropTypes.string,
  }),

  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
};

export default Calculator;
