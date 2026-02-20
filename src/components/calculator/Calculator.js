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
    timePillsArray[timePillsArray.length - 1],
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
          data.data.the_graph_bsc_v2.token_data,
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
        "https://api.geckoterminal.com/api/v2/networks/eth/pools/0x7c81087310a228470db28c1068f0663d6bf88679",
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
        setStakeApyAVAX(27.5);
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
        ).toFixed(2),
      );

      setCalculateApproxWeth(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(stakeApy)) / 100 / 365) *
              parseInt(days),
          ) / dypPrice,
          4,
        ),
      );

      setCalculateApproxUSDBNB(
        (
          ((parseInt(usdToDeposit) * parseFloat(stakeApyBNB)) / 100 / 365) *
          parseInt(days)
        ).toFixed(2),
      );
      setCalculateApproxWbnb(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(stakeApyBNB)) / 100 / 365) *
              parseInt(days),
          ) / idypPrice,
          4,
        ),
      );

      setCalculateApproxUSDAVAX(
        (
          ((parseInt(usdToDeposit) * parseFloat(stakeApyAVAX)) / 100 / 365) *
          parseInt(days)
        ).toFixed(2),
      );
      setCalculateApproxWavax(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(stakeApyAVAX)) / 100 / 365) *
              parseInt(days),
          ) / dypPrice,
          4,
        ),
      );
    } else if (activeMethod === "Vault") {
      setCalculateApproxUSD(
        (
          ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[0])) /
            100 /
            365) *
          parseInt(days)
        ).toFixed(2),
      );

      setCalculateApproxWeth(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[0])) /
              100 /
              365) *
              parseInt(days),
          ) / wethPrice,
          4,
        ),
      );

      setCalculateApproxUSDBNB(
        (
          ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[2])) /
            100 /
            365) *
          parseInt(days)
        ).toFixed(2),
      );
      setCalculateApproxWbnb(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[2])) /
              100 /
              365) *
              parseInt(days),
          ),
          4,
        ),
      );

      setCalculateApproxUSDAVAX(
        (
          ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[3])) /
            100 /
            365) *
          parseInt(days)
        ).toFixed(2),
      );

      setCalculateApproxWavax(
        getFormattedNumber(
          parseFloat(
            ((parseInt(usdToDeposit) * parseFloat(vaultplatformArrayNew[3])) /
              100 /
              365) *
              parseInt(days),
          ),
          4,
        ),
      );
    }
  }, [
    activeMethod,
    stakeApy,
    stakeApyAVAX,
    stakeApyBNB,
    idypPrice,
    dypPrice,
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
      className={`migration-banner-wrapper position-relative ${earnClass}`}
    >
      <div className="purplediv" style={{ background: "#8E97CD" }}></div>
      <div className="d-flex flex-column h-100">
        <div className="flex flex-column gap-2 h-100 justify-content-between">
          <div className="d-flex flex-column gap-2">
            <div className="d-flex justify-content-between gap-2 align-items-center pb-4">
              <h6 className="d-flex gap-2 align-items-center calc-title">
                <img
                  src={"https://cdn.worldofdypians.com/tools/coinStackIcon.svg"}
                  alt=""
                />{" "}
                Migration Portal
              </h6>
            </div>
            <div>
              <h6 className="explorercard-desc">
                Easily migrate your DYP and iDYP tokens
              </h6>
            </div>
             <div className="migrated-tokens-wrapper my-4 d-flex flex-column flex-xl-row align-items-center justify-content-between p-3">
          <>
            <span className="migrated-tokens mb-0">
              Migration <span className="d-none d-lg-flex"></span>
             
              deadline
            </span>
            <h6 className="migrated-tokens-amount mb-0" style={{fontSize: '16px'}}>
             February 23, 2026
            </h6>
          </>
        </div>
          </div>
          <NavLink to="/migration-portal">
            <button
              className="btn filled-btn m-3"
              style={{ fontSize: "16px", padding: "12px 24px" }}
            >
              Migrate
            </button>
          </NavLink>
        </div>
      </div>
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
