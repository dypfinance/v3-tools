import React, { useEffect, useState, useRef } from "react";
import "./launchpadform.css";
import formIcon from "../assets/formIcon.svg";
import uploadLogo from "../assets/uploadLogo.svg";
import launchpadIndicator from "../assets/launchpadIndicator.svg";
import websiteIcon from "../assets/websiteIcon.svg";
import twitterIcon from "../assets/twitterIcon.svg";
import telegramIcon from "../assets/telegramIcon.svg";
import mediumIcon from "../assets/mediumIcon.svg";
import discordIcon from "../assets/discordIcon.svg";
import clearFieldsIcon from "../assets/clearFieldsIcon.svg";
import validateFormInfo from "./validateFormInfo";
import ReCaptchaV2 from "react-google-recaptcha";
import axios from "axios";

const LaunchpadForm = () => {
  const projectStatusItems = [
    {
      value: "Initial idea",
      label: "Initial idea",
    },
    {
      value: "Early development",
      label: "Early development",
    },
    {
      value: "Late stage of development",
      label: "Late stage of development",
    },
    {
      value: "Ready to launch",
      label: "Ready to launch",
    },
    {
      value: "Already launched",
      label: "Already launched",
    },
  ];

  const refundTypeItems = [
    {
      value: "Refund",
      label: "Refund",
    },
    {
      value: "Burn",
      label: "Burn",
    },
  ];

  const routerItems = [
    {
      value: "Pancakeswap",
      label: "Pancakeswap",
    },
    {
      value: "Pancakeswap2",
      label: "Pancakeswap2",
    },
  ];

  const blockchainLaunchItems = [
    {
      value: "Ethereum",
      label: "Ethereum",
      icon: "ethIcon.svg",
    },
    {
      value: "BNB chain",
      label: "BNB Chain",
      icon: "bnbIcon.svg",
    },
    {
      value: "Avalanche",
      label: "Avalanche",
      icon: "avaxIcon.svg",
    },
  ];

  const [formItems, setFormItems] = useState({
    project_logo: "",
    project_name: "",
    ticker_symbol: "",
    name: "",
    email_address: "",
    project_description: "",
    project_status: "",
    token_address: "",
    token_name: "",
    token_symbol: "",
    token_decimals: "",
    currency: "",
    fee: "",
    listingtype: "",
    presale_rate: "",
    whitelistvalue: "",
    softcap: "",
    hardcap: "",
    minimumbuy: "",
    maxbuy: "",
    refundType_status: "",
    router_status: "",
    pancLiq: "",
    pancListRate: "",
    startDate: "",
    endDate: "",
    team: "",
    blockchain_launch: "",
    raised_funds: "",
    funds_amount: "",
    ido_capital: "",
    funding_description: "",
    website: "",
    twitter: "",
    telegram_user: "",
    telegram_channel: "",
    medium: "",
    discord: "",
    additional_description: "",
  });

  const [dropdownTitles, setDropdownTitles] = useState({
    project_status: "Project status*",
    refundType_status: "Refund type*",
    router_status: "Router*",
    team: "Team*",
    blockchain_launch: "Blockchain launch*",
    raised_funds: "Have you raised funds",
  });
  const [imageError, setImageError] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const convert2base64 = (e) => {
    const fileTypes = ["image/jpg", "image/png", "image/jpeg"];

    const file = e.target.files[0];
    const reader = new FileReader();
    const testImage = new Image();

    reader.onload = function () {
      if (reader !== null && typeof reader.result == "string") {
        testImage.src = reader.result;
      }
    };
    reader.readAsDataURL(file);

    testImage.onload = async function () {
      const width = testImage.width;
      const height = testImage.height;
      if (fileTypes.includes(file.type)) {
        if (
          width > 250 ||
          height > 250 ||
          height !== width ||
          file.size > 150000
        ) {
          setImageError(true);
        } else {
          setFormItems({ ...formItems, project_logo: reader.result });
          setImageError(false);
        }
      } else {
        setImageError(true);
      }
    };
  };

  const [blockChainIcon, setBlockChainIcon] = useState(null);

  const focusInput = (inputName) => {
    document.getElementById(inputName).focus();
  };

  const clearFields = () => {
    setFormItems({
      project_logo: "",
      project_name: "",
      ticker_symbol: "",
      name: "",
      email_address: "",
      project_description: "",
      project_status: "",
      team: "",
      blockchain_launch: "",
      raised_funds: "",
      funds_amount: "",
      ido_capital: "",
      funding_description: "",
      website: "",
      twitter: "",
      telegram_user: "",
      telegram_channel: "",
      medium: "",
      discord: "",
      additional_description: "",
    });

    setDropdownTitles({
      project_status: "Project status*",
      team: "Team*",
      blockchain_launch: "Blockchain launch*",
      raised_funds: "Have you raised funds",
    });
    setBlockChainIcon(null);
  };
  const recaptchaRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setImageError(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formItems);
    setErrors(validateFormInfo(formItems));
    if (Object.keys(validateFormInfo(formItems)).length === 0) {
      if (
        formItems.project_logo !== "" &&
        formItems.project_name !== "" &&
        formItems.ticker_symbol !== "" &&
        formItems.email_address !== "" &&
        formItems.project_status !== "" &&
        formItems.team !== "" &&
        formItems.blockchain_launch !== "" &&
        formItems.raised_funds !== "" &&
        formItems.ido_capital !== "" &&
        formItems.website !== "" &&
        formItems.twitter !== "" &&
        formItems.telegram_user !== "" &&
        formItems.telegram_channel !== ""
      ) {
        const captchaToken = await recaptchaRef.current.executeAsync();
        const data = {
          project_logo: formItems.project_logo,
          project_name: formItems.project_name,
          ticker_symbol: formItems.ticker_symbol,
          name: formItems.name,
          email_address: formItems.email_address,
          project_description: formItems.project_description,
          project_status: formItems.project_status,
          team: formItems.team,
          blockchain_launch: formItems.blockchain_launch,
          raised_funds: formItems.raised_funds,
          funds_amount: formItems.funds_amount,
          ido_capital: formItems.ido_capital,
          funding_description: formItems.funding_description,
          website: formItems.website,
          twitter: formItems.twitter,
          telegram_user: formItems.telegram_user,
          telegram_channel: formItems.telegram_channel,
          medium: formItems.medium,
          discord: formItems.discord,
          additional_description: formItems.additional_description,
          recaptcha: captchaToken,
        };

        const send = await axios
          .post("https://api-mail.dyp.finance/api/launch_form", data)
          .then(function (result) {
            return result.data;
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log(send.status);
        if (send.status === 1) {
          setSuccess(true);
          alert("Form submitted succesfully!");
        } else {
          setSuccess(false);
          alert("Something went wrong");
        }
      }
      recaptchaRef.current.reset();
      clearFields();
      console.log(success);
    }
  };

  console.log(step);

  return (
    <div className="container-lg px-0">
      <div className="d-flex flex-column gap-3" style={{ width: "65%" }}>
        <h6 className="launchpad-hero-title">Launchpad Form</h6>
        <p className="launchpad-hero-desc">
          This form is for project owners to submit their projects for us to
          review as a potential IDO (Initial DEX Offering). DO NOT submit this
          form if you are looking to participate in an IDO.
        </p>
      </div>
      <div className="form-container p-3 position-relative mt-4">
        <div
          className="purplediv"
          style={{ background: "#8E97CD", left: "0px" }}
        ></div>
        <div className="d-flex align-items-center gap-2 mt-1">
          <img src={formIcon} alt="form icon" />
          <h6
            style={{
              fontWeight: "500",
              fontSize: "20px",
              lineHeight: "30px",
              color: "#f7f7fc",
            }}
          >
            Submit form
          </h6>
        </div>

        <form>
          <div className="row flex-column flex-lg-row align-items-center justify-content-between first-form mt-4">
            {step === 1 ? (
              <>
                <div className="row gap-4 gap-lg-0 align-items-center">
                  <h6
                    style={{
                      fontWeight: "500",
                      fontSize: "20px",
                      lineHeight: "30px",
                      color: "#f7f7fc",
                    }}
                  >
                    Verify Token
                  </h6>
                  <span
                    className={`image-tip mb-3 ${
                      imageError && "required-star"
                    }`}
                  >
                    Enter the token address and verify
                  </span>
                  <div className="funding-grid2 d-grid">
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="token_address"
                        name="token_address"
                        placeholder=" "
                        className={`text-input ${
                          errors.token_address && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.token_address}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            token_address: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="token_address"
                        className="label"
                        onClick={() => focusInput("token_address")}
                      >
                        Token address
                      </label>
                      {errors.token_address && (
                        <span className="error-text">
                          {errors.token_address}
                        </span>
                      )}
                    </div>

                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="token_name"
                        name="token_name"
                        placeholder=" "
                        className={`text-input ${
                          errors.token_name && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.token_name}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            token_name: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="token_name"
                        className="label"
                        onClick={() => focusInput("token_name")}
                      >
                        Token name
                      </label>
                      {errors.token_name && (
                        <span className="error-text">{errors.token_name}</span>
                      )}
                    </div>

                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="token_symbol"
                        name="token_symbol"
                        placeholder=" "
                        className={`text-input ${
                          errors.token_symbol && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.token_symbol}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            token_symbol: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="token_symbol"
                        className="label"
                        onClick={() => focusInput("token_symbol")}
                      >
                        Token symbol
                      </label>
                      {errors.token_symbol && (
                        <span className="error-text">
                          {errors.token_symbol}
                        </span>
                      )}
                    </div>

                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="token_decimals"
                        name="token_decimals"
                        placeholder=" "
                        className={`text-input ${
                          errors.token_decimals && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.token_decimals}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            token_decimals: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="token_decimals"
                        className="label"
                        onClick={() => focusInput("token_decimals")}
                      >
                        Token decimals
                      </label>
                      {errors.token_decimals && (
                        <span className="error-text">
                          {errors.token_decimals}
                        </span>
                      )}
                    </div>
                    <div className="input-container px-0 w-100 d-flex position-relative">
                      <span className="d-flex gap-2 my-2 align-items-center">
                        <input
                          type="radio"
                          id="currency"
                          name="currency"
                          placeholder=" "
                          className="text-input"
                          checked
                        />
                        <label
                          htmlFor="currency"
                          className="label"
                          onClick={() => focusInput("currency")}
                        >
                          Currency
                        </label>
                        ETH
                      </span>
                    </div>
                    <div className="input-container px-0 w-100 d-flex position-relative">
                      <span className="d-flex gap-2 my-2 align-items-center">
                        <input
                          type="radio"
                          id="fee"
                          name="fee"
                          placeholder=" "
                          className="text-input"
                          checked
                        />
                        <label
                          htmlFor="fee"
                          className="label"
                          onClick={() => focusInput("fee")}
                        >
                          Fee Option
                        </label>
                        5% ETH raised only
                      </span>
                    </div>
                    <div className="input-container px-0 w-100 d-flex position-relative">
                      <span className="d-flex gap-2 my-2 align-items-center">
                        <input
                          type="radio"
                          id="listingtype"
                          name="listingtype"
                          placeholder=" "
                          className="text-input"
                          checked
                        />
                        <label
                          htmlFor="listingtype"
                          className="label"
                          onClick={() => focusInput("listingtype")}
                        >
                          Listing Option
                        </label>
                        Auto Listing
                      </span>
                    </div>
                  </div>
                </div>
                <hr className="form-divider my-4" />
                <div className="row gap-4 gap-lg-0 align-items-center">
                  <h6
                    style={{
                      fontWeight: "500",
                      fontSize: "20px",
                      lineHeight: "30px",
                      color: "#f7f7fc",
                    }}
                  >
                    DeFi Launchpad Info
                  </h6>
                  <span
                    className={`image-tip mb-3 ${
                      imageError && "required-star"
                    }`}
                  >
                    Enter the launchpad information that you want to raise ,
                    that should be enter all details about your presale
                  </span>
                  <div className="funding-grid2 d-grid">
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="presale_rate"
                        name="presale_rate"
                        placeholder=" "
                        className={`text-input ${
                          errors.presale_rate && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.presale_rate}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            presale_rate: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="presale_rate"
                        className="label"
                        onClick={() => focusInput("presale_rate")}
                      >
                        Presale rate
                      </label>
                      {errors.presale_rate && (
                        <span className="error-text">
                          {errors.presale_rate}
                        </span>
                      )}
                    </div>

                    <div className="input-container px-0 gap-3 w-100 d-flex position-relative">
                      <span className="d-flex gap-2 my-2 align-items-center">
                        <input
                          type="radio"
                          id="whitelistno"
                          name="whitelistno"
                          placeholder=" "
                          className="text-input"
                          checked
                        />
                        <label
                          htmlFor="whitelistno"
                          className="label"
                          onClick={() => focusInput("whitelistno")}
                        >
                          Whitelist
                        </label>
                        Disable
                      </span>
                      <span className="d-flex gap-2 my-2 align-items-center">
                        <input
                          type="radio"
                          id="whitelistyes"
                          name="whitelistyes"
                          placeholder=" "
                          className="text-input"
                        />
                        Enable
                      </span>
                    </div>

                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="softcap"
                        name="softcap"
                        placeholder=" "
                        className={`text-input ${
                          errors.softcap && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.softcap}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            softcap: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="softcap"
                        className="label"
                        onClick={() => focusInput("softcap")}
                      >
                        Softcap (BNB)
                      </label>
                      {errors.softcap && (
                        <span className="error-text">{errors.softcap}</span>
                      )}
                    </div>

                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="hardcap"
                        name="hardcap"
                        placeholder=" "
                        className={`text-input ${
                          errors.hardcap && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.hardcap}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            hardcap: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="hardcap"
                        className="label"
                        onClick={() => focusInput("hardcap")}
                      >
                        HardCap (BNB)
                      </label>
                      {errors.hardcap && (
                        <span className="error-text">{errors.hardcap}</span>
                      )}
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="minimumbuy"
                        name="minimumbuy"
                        placeholder=" "
                        className={`text-input ${
                          errors.minimumbuy && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.minimumbuy}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            minimumbuy: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="minimumbuy"
                        className="label"
                        onClick={() => focusInput("minimumbuy")}
                      >
                        Minimum buy (BNB)
                      </label>
                      {errors.minimumbuy && (
                        <span className="error-text">{errors.minimumbuy}</span>
                      )}
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="maxbuy"
                        name="maxbuy"
                        placeholder=" "
                        className={`text-input ${
                          errors.maxbuy && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.maxbuy}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            maxbuy: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="maxbuy"
                        className="label"
                        onClick={() => focusInput("maxbuy")}
                      >
                        Maximum buy (BNB)
                      </label>
                      {errors.maxbuy && (
                        <span className="error-text">{errors.maxbuy}</span>
                      )}
                    </div>
                    <div class="dropdown position relative">
                      <button
                        class={`btn launchpad-dropdown d-flex justify-content-between align-items-center dropdown-toggle w-100 ${
                          errors.refundType_status && "error-border"
                        }`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {dropdownTitles.refundType_status}
                        <img src={launchpadIndicator} alt="" />
                      </button>
                      <ul class="dropdown-menu w-100">
                        {refundTypeItems.map((item, index) => (
                          <li
                            key={index}
                            className="dropdown-item launchpad-item"
                            onClick={() => {
                              setDropdownTitles({
                                ...dropdownTitles,
                                refundType_status: item.label,
                              });
                              setFormItems({
                                ...formItems,
                                refundType_status: item.value,
                              });
                            }}
                          >
                            {item.label}
                          </li>
                        ))}
                      </ul>
                      {errors.project_status && (
                        <span className="error-text">
                          {errors.refundType_status}
                        </span>
                      )}
                    </div>
                    <div class="dropdown position relative">
                      <button
                        class={`btn launchpad-dropdown d-flex justify-content-between align-items-center dropdown-toggle w-100 ${
                          errors.router_status && "error-border"
                        }`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {dropdownTitles.router_status}
                        <img src={launchpadIndicator} alt="" />
                      </button>
                      <ul class="dropdown-menu w-100">
                        {routerItems.map((item, index) => (
                          <li
                            key={index}
                            className="dropdown-item launchpad-item"
                            onClick={() => {
                              setDropdownTitles({
                                ...dropdownTitles,
                                router_status: item.label,
                              });
                              setFormItems({
                                ...formItems,
                                router_status: item.value,
                              });
                            }}
                          >
                            {item.label}
                          </li>
                        ))}
                      </ul>
                      {errors.project_status && (
                        <span className="error-text">
                          {errors.router_status}
                        </span>
                      )}
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="pancLiq"
                        name="pancLiq"
                        placeholder=" "
                        className={`text-input ${
                          errors.pancLiq && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.pancLiq}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            pancLiq: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="pancLiq"
                        className="label"
                        onClick={() => focusInput("pancLiq")}
                      >
                        Pancakeswap liquidity (%)
                      </label>
                      {errors.pancLiq && (
                        <span className="error-text">{errors.pancLiq}</span>
                      )}
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="pancListRate"
                        name="pancListRate"
                        placeholder=" "
                        className={`text-input ${
                          errors.pancListRate && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.pancListRate}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            pancListRate: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor="pancListRate"
                        className="label"
                        onClick={() => focusInput("pancListRate")}
                      >
                        Pancakeswap listing rate
                      </label>
                      {errors.pancListRate && (
                        <span className="error-text">
                          {errors.pancListRate}
                        </span>
                      )}
                    </div>

                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        placeholder=" "
                        className="text-input"
                        style={{ width: "100%" }}
                        value={formItems.startDate}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            startDate: e.target.value,
                          })
                        }
                      />
                      <label
                        htmlFor="startDate"
                        className="label"
                        onClick={() => focusInput("startDate")}
                      >
                        Start time (UTC)
                      </label>
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        placeholder=" "
                        className="text-input"
                        style={{ width: "100%" }}
                        value={formItems.endDate}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            endDate: e.target.value,
                          })
                        }
                      />
                      <label
                        htmlFor="startDate"
                        className="label"
                        onClick={() => focusInput("endDate")}
                      >
                        End time (UTC)
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="form-divider my-4" />
              </>
            ) : step === 2 ? (
              <>
                <h6
                  className="my-3"
                  style={{
                    fontWeight: "500",
                    fontSize: "20px",
                    lineHeight: "30px",
                    color: "#f7f7fc",
                  }}
                >
                  Project details
                </h6>
                <div className="col-12 col-lg-2 align-items-center align-items-lg-start d-flex flex-column gap-3">
                  <div className="form-title">Project logo</div>
                  <div
                    className={`upload-container ${
                      errors.project_logo && "error-upload-container"
                    } d-flex justify-content-center align-items-center position-relative`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      onChange={(e) => convert2base64(e)}
                    />
                    {formItems.project_logo !== "" ? (
                      <img
                        src={formItems.project_logo}
                        alt=""
                        style={{ maxHeight: "110px", maxWidth: "110px" }}
                      />
                    ) : (
                      <img src={uploadLogo} alt="" />
                    )}
                  </div>
                </div>
                <div className="col-12 col-lg-10 d-flex flex-column gap-3">
                  <div className="form-title">Project details</div>
                  <div className="d-flex flex-column flex-lg-row align-items-center gap-4">
                    <div className="d-grid form-grid w-100">
                      <div
                        className="input-container px-0"
                        style={{ width: "100%" }}
                      >
                        <input
                          type="text"
                          id="project_name"
                          name="project_name"
                          placeholder=" "
                          className={`text-input ${
                            errors.project_name && "error-border"
                          }`}
                          style={{ width: "100%" }}
                          value={formItems.project_name}
                          onChange={(e) =>
                            setFormItems({
                              ...formItems,
                              project_name: e.target.value,
                            })
                          }
                        />
                        <label
                          htmlFor="usd"
                          className="label"
                          onClick={() => focusInput("project_name")}
                        >
                          Project name<span className="required-star">*</span>
                        </label>
                        {errors.project_name && (
                          <span className="error-text">
                            {errors.project_name}
                          </span>
                        )}
                      </div>
                      <div
                        className="input-container px-0"
                        style={{ width: "100%" }}
                      >
                        <input
                          type="text"
                          id="ticker_symbol"
                          name="ticker_symbol"
                          placeholder=" "
                          className={`text-input ${
                            errors.ticker_symbol && "error-border"
                          }`}
                          style={{ width: "100%" }}
                          value={formItems.ticker_symbol}
                          onChange={(e) =>
                            setFormItems({
                              ...formItems,
                              ticker_symbol: e.target.value,
                            })
                          }
                        />
                        <label
                          htmlFor="usd"
                          className="label"
                          onClick={() => focusInput("ticker_symbol")}
                        >
                          Ticker symbol<span className="required-star">*</span>
                        </label>
                        {errors.ticker_symbol && (
                          <span className="error-text">
                            {errors.ticker_symbol}
                          </span>
                        )}
                      </div>{" "}
                      <div
                        className="input-container px-0"
                        style={{ width: "100%" }}
                      >
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder=" "
                          className="text-input"
                          style={{ width: "100%" }}
                          value={formItems.name}
                          onChange={(e) =>
                            setFormItems({ ...formItems, name: e.target.value })
                          }
                        />
                        <label
                          htmlFor="usd"
                          className="label"
                          onClick={() => focusInput("name")}
                        >
                          Name
                        </label>
                      </div>
                      <div
                        className="input-container px-0"
                        style={{ width: "100%" }}
                      >
                        <input
                          type="text"
                          min={1}
                          max={365}
                          id="email_address"
                          name="email_address"
                          placeholder=" "
                          className={`text-input ${
                            errors.email_address && "error-border"
                          }`}
                          style={{ width: "100%" }}
                          value={formItems.email_address}
                          onChange={(e) =>
                            setFormItems({
                              ...formItems,
                              email_address: e.target.value,
                            })
                          }
                        />
                        <label
                          htmlFor="usd"
                          className="label"
                          onClick={() => focusInput("email_address")}
                        >
                          Email address<span className="required-star">*</span>
                        </label>
                        {errors.email_address && (
                          <span className="error-text">
                            {errors.email_address}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <textarea
                        type="text"
                        id="project_description"
                        name="project_description"
                        placeholder=" "
                        className="text-input"
                        style={{ width: "100%" }}
                        rows="7"
                        value={formItems.project_description}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            project_description: e.target.value,
                          })
                        }
                      />
                      <label
                        htmlFor="usd"
                        className="label"
                        onClick={() => focusInput("project_description")}
                      >
                        About the project
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-3 position-relative col-12 col-lg-4">
                  <span
                    className={`image-tip mt-3 ${
                      imageError && "required-star"
                    }`}
                  >
                    *Logos must have a 1:1 aspect ratio, a maximum size of 250 x
                    250 pixels, and a maximum file size of 150 kilobytes (kb) -
                    jpg, jpeg, png.
                  </span>
                  {errors.project_logo && (
                    <span className="error-text">{errors.project_logo}</span>
                  )}
                </div>
                <hr className="form-divider my-4" />
                <div className="row gap-4 gap-lg-0 align-items-center">
                  <h6
                    className="my-3"
                    style={{
                      fontWeight: "500",
                      fontSize: "20px",
                      lineHeight: "30px",
                      color: "#f7f7fc",
                    }}
                  >
                    Funding details
                  </h6>
                  <div className="funding-grid d-grid col-12 col-lg-9 col-xl-7">
                    <div class="dropdown position relative">
                      <button
                        class={`btn launchpad-dropdown d-flex justify-content-between align-items-center dropdown-toggle w-100 ${
                          errors.project_status && "error-border"
                        }`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {dropdownTitles.project_status}
                        <img src={launchpadIndicator} alt="" />
                      </button>
                      <ul class="dropdown-menu w-100">
                        {projectStatusItems.map((item, index) => (
                          <li
                            key={index}
                            className="dropdown-item launchpad-item"
                            onClick={() => {
                              setDropdownTitles({
                                ...dropdownTitles,
                                project_status: item.label,
                              });
                              setFormItems({
                                ...formItems,
                                project_status: item.value,
                              });
                            }}
                          >
                            {item.label}
                          </li>
                        ))}
                      </ul>
                      {errors.project_status && (
                        <span className="error-text">
                          {errors.project_status}
                        </span>
                      )}
                    </div>

                    <div class="dropdown position relative">
                      <button
                        class={`btn launchpad-dropdown d-flex justify-content-between align-items-center dropdown-toggle w-100 ${
                          errors.team && "error-border"
                        }`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {dropdownTitles.team}
                        <img src={launchpadIndicator} alt="" />
                      </button>
                      <ul class="dropdown-menu w-100">
                        <li
                          className="dropdown-item launchpad-item"
                          onClick={() => {
                            setDropdownTitles({
                              ...dropdownTitles,
                              team: "Public",
                            });
                            setFormItems({ ...formItems, team: "Public" });
                          }}
                        >
                          Public
                        </li>
                        <li
                          className="dropdown-item launchpad-item"
                          onClick={() => {
                            setDropdownTitles({
                              ...dropdownTitles,
                              team: "Anonymous",
                            });
                            setFormItems({ ...formItems, team: "Anonymous" });
                          }}
                        >
                          Anonymous
                        </li>
                      </ul>
                      {errors.team && (
                        <span className="error-text">{errors.team}</span>
                      )}
                    </div>
                    <div class="dropdown position relative">
                      <button
                        class={`btn launchpad-dropdown d-flex justify-content-between align-items-center dropdown-toggle w-100 ${
                          errors.blockchain_launch && "error-border"
                        }`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div className="d-flex align-items-center gap-2">
                          {blockChainIcon !== null && (
                            <img
                              src={
                                require(`../assets/${blockChainIcon}`).default
                              }
                              alt=""
                            />
                          )}
                          {dropdownTitles.blockchain_launch}
                        </div>
                        <img src={launchpadIndicator} alt="" />
                      </button>
                      <ul class="dropdown-menu w-100">
                        {blockchainLaunchItems.map((item) => (
                          <li
                            className="dropdown-item launchpad-item d-flex align-items-center gap-2"
                            onClick={() => {
                              setDropdownTitles({
                                ...dropdownTitles,
                                blockchain_launch: item.label,
                              });
                              setFormItems({
                                ...formItems,
                                blockchain_launch: item.label,
                              });
                              setBlockChainIcon(item.icon);
                            }}
                          >
                            <img
                              src={require(`../assets/${item.icon}`).default}
                              alt=""
                            />
                            {item.label}
                          </li>
                        ))}
                      </ul>
                      {errors.blockchain_launch && (
                        <span className="error-text">
                          {errors.blockchain_launch}
                        </span>
                      )}
                    </div>
                    <div class="dropdown position relative">
                      <button
                        class="btn launchpad-dropdown d-flex justify-content-between align-items-center dropdown-toggle w-100"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {dropdownTitles.raised_funds}
                        <img src={launchpadIndicator} alt="" />
                      </button>
                      <ul class="dropdown-menu w-100">
                        <li
                          className="dropdown-item launchpad-item"
                          onClick={() => {
                            setDropdownTitles({
                              ...dropdownTitles,
                              raised_funds: "Yes",
                            });
                            setFormItems({ ...formItems, raised_funds: "Yes" });
                          }}
                        >
                          Yes
                        </li>
                        <li
                          className="dropdown-item launchpad-item"
                          onClick={() => {
                            setDropdownTitles({
                              ...dropdownTitles,
                              raised_funds: "No",
                            });
                            setFormItems({ ...formItems, raised_funds: "No" });
                          }}
                        >
                          No
                        </li>
                      </ul>
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="funds_amount"
                        name="funds_amount"
                        placeholder=" "
                        className="text-input"
                        style={{ width: "100%" }}
                        value={formItems.funds_amount}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            funds_amount: e.target.value,
                          })
                        }
                      />
                      <label
                        htmlFor="usd"
                        className="label"
                        onClick={() => focusInput("funds_amount")}
                      >
                        Raised funds amount (USD)
                      </label>
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="text"
                        id="ido_capital"
                        name="ido_capital"
                        placeholder=" "
                        className={`text-input ${
                          errors.email_address && "error-border"
                        }`}
                        style={{ width: "100%" }}
                        value={formItems.ido_capital}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            ido_capital: e.target.value,
                          })
                        }
                      />
                      <label
                        htmlFor="usd"
                        className="label"
                        onClick={() => focusInput("ido_capital")}
                      >
                        Desired IDO capital (USD)
                        <span className="required-star">*</span>
                      </label>
                      {errors.ido_capital && (
                        <span className="error-text">{errors.ido_capital}</span>
                      )}
                    </div>
                  </div>
                  <div className="input-container col-12 col-lg-3 col-xl-5">
                    <textarea
                      type="text"
                      id="funding_description"
                      name="funding_description"
                      placeholder=" "
                      className="text-input"
                      style={{ width: "100%" }}
                      rows="7"
                      value={formItems.funding_description}
                      onChange={(e) =>
                        setFormItems({
                          ...formItems,
                          funding_description: e.target.value,
                        })
                      }
                    />
                    <label
                      htmlFor="usd"
                      className="label"
                      style={{ left: "20px" }}
                      onClick={() => focusInput("funding_description")}
                    >
                      Describe token use case
                    </label>
                  </div>
                </div>
                <hr className="form-divider my-4" />
              </>
            ) : (
              <>
                {" "}
                <div className="row gap-4 gap-lg-0 align-items-center">
                  <div className="d-flex flex-column gap-3 mb-3">
                    <h6
                      style={{
                        fontWeight: "500",
                        fontSize: "20px",
                        lineHeight: "30px",
                        color: "#f7f7fc",
                      }}
                    >
                      Additional Information
                    </h6>
                    <span className="form-title">Social media</span>
                  </div>
                  <div className="col-12 col-lg-7 form-grid d-grid">
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <img src={websiteIcon} alt="" className="input-icon" />
                      <input
                        type="text"
                        id="website"
                        name="website"
                        placeholder=" "
                        className={`text-input ${
                          errors.website && "error-border"
                        }`}
                        style={{
                          width: "100%",
                          paddingLeft: "30px",
                          paddingLeft: "30px",
                        }}
                        value={formItems.website}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            website: e.target.value,
                          })
                        }
                      />
                      <label
                        htmlFor="usd"
                        className="label"
                        style={{ left: "30px" }}
                        onClick={() => focusInput("website")}
                      >
                        Website<span className="required-star">*</span>
                      </label>
                      {errors.website && (
                        <span className="error-text">{errors.website}</span>
                      )}
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <img src={twitterIcon} alt="" className="input-icon" />

                      <input
                        type="text"
                        id="twitter"
                        name="twitter"
                        placeholder=" "
                        className={`text-input ${
                          errors.twitter && "error-border"
                        }`}
                        style={{ width: "100%", paddingLeft: "30px" }}
                        value={formItems.twitter}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            twitter: e.target.value,
                          })
                        }
                      />
                      <label
                        htmlFor="usd"
                        className="label"
                        style={{ left: "30px" }}
                        onClick={() => focusInput("twitter")}
                      >
                        Twitter<span className="required-star">*</span>
                      </label>
                      {errors.twitter && (
                        <span className="error-text">{errors.twitter}</span>
                      )}
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <img src={telegramIcon} alt="" className="input-icon" />

                      <input
                        type="text"
                        id="telegram_user"
                        name="telegram_user"
                        placeholder=" "
                        className={`text-input ${
                          errors.telegram_user && "error-border"
                        }`}
                        style={{ width: "100%", paddingLeft: "30px" }}
                        value={formItems.telegram_user}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            telegram_user: e.target.value,
                          })
                        }
                      />
                      <label
                        htmlFor="usd"
                        className="label"
                        style={{ left: "30px" }}
                        onClick={() => focusInput("telegram_user")}
                      >
                        Telegram username
                        <span className="required-star">*</span>
                      </label>
                      {errors.telegram_user && (
                        <span className="error-text">
                          {errors.telegram_user}
                        </span>
                      )}
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <img src={telegramIcon} alt="" className="input-icon" />

                      <input
                        type="text"
                        id="telegram_channel"
                        name="telegram_channel"
                        placeholder=" "
                        className={`text-input ${
                          errors.telegram_channel && "error-border"
                        }`}
                        style={{ width: "100%", paddingLeft: "30px" }}
                        value={formItems.telegram_channel}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            telegram_channel: e.target.value,
                          })
                        }
                      />
                      <label
                        htmlFor="usd"
                        className="label"
                        style={{ left: "30px" }}
                        onClick={() => focusInput("telegram_channel")}
                      >
                        Telegram official channel
                        <span className="required-star">*</span>
                      </label>
                      {errors.telegram_channel && (
                        <span className="error-text">
                          {errors.telegram_channel}
                        </span>
                      )}
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <img src={mediumIcon} alt="" className="input-icon" />

                      <input
                        type="text"
                        id="medium"
                        name="medium"
                        placeholder=" "
                        className="text-input"
                        style={{ width: "100%", paddingLeft: "30px" }}
                        value={formItems.medium}
                        onChange={(e) =>
                          setFormItems({ ...formItems, medium: e.target.value })
                        }
                      />
                      <label
                        htmlFor="usd"
                        className="label"
                        style={{ left: "30px" }}
                        onClick={() => focusInput("medium")}
                      >
                        Medium
                      </label>
                    </div>
                    <div
                      className="input-container px-0"
                      style={{ width: "100%" }}
                    >
                      <img src={discordIcon} alt="" className="input-icon" />
                      <input
                        type="text"
                        id="Discord"
                        name="Discord"
                        placeholder=" "
                        className="text-input"
                        style={{ width: "100%", paddingLeft: "30px" }}
                        value={formItems.discord}
                        onChange={(e) =>
                          setFormItems({
                            ...formItems,
                            discord: e.target.value,
                          })
                        }
                      />
                      <label
                        htmlFor="usd"
                        className="label"
                        style={{ left: "30px" }}
                        onClick={() => focusInput("discord")}
                      >
                        Discord
                      </label>
                    </div>
                  </div>
                  <div className="input-container col-12 col-lg-5">
                    <textarea
                      type="text"
                      id="additional_description"
                      name="additional_description"
                      placeholder=" "
                      className="text-input"
                      style={{ width: "100%" }}
                      rows="12"
                      value={formItems.additional_description}
                      onChange={(e) =>
                        setFormItems({
                          ...formItems,
                          additional_description: e.target.value,
                        })
                      }
                    />
                    <label
                      htmlFor="usd"
                      className="label"
                      style={{ left: "20px" }}
                      onClick={() => focusInput("additional_description")}
                    >
                      Additional information
                    </label>
                  </div>
                </div>{" "}
                <hr className="form-divider my-4" />
              </>
            )}
          </div>
        </form>
        <div className="d-flex align-items-center gap-2 w-auto m-auto justify-content-center">
          <button
            className={`btn ${
              step > 1 ? "filledbtn px-2 py-1" : "disabled-btn px-2 py-1"
            }`}
            onClick={() => {
              setStep(step - 1);
            }}
            disabled={step === 1}
          >
            Back
          </button>
          <button
            className={`btn ${
              step < 3 ? "filledbtn px-2 py-1" : "disabled-btn px-2 py-1"
            }`}
            onClick={() => {
              setStep(step + 1);
            }}
            disabled={step === 3}
          >
            Next
          </button>
        </div>
        {step === 3 && (
          <div className="d-flex align-items-center justify-content-between mt-5">
            <div className="d-flex align-items-center gap-2 cursor-pointer">
              <img src={clearFieldsIcon} alt="" />
              <h6 className="clear-fields" onClick={clearFields}>
                Clear all fields
              </h6>
            </div>
            <button
              className="btn filledbtn px-5"
              onClick={(e) => handleSubmit(e)}
            >
              Submit
            </button>
          </div>
        )}
        <ReCaptchaV2
          sitekey="6LflZgEgAAAAAO-psvqdoreRgcDdtkQUmYXoHuy2"
          style={{ display: "inline-block" }}
          theme="dark"
          size="invisible"
          ref={recaptchaRef}
        />
      </div>
    </div>
  );
};

export default LaunchpadForm;
