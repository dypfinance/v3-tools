import React, { useState, useEffect } from "react";
import validateInfo from "./validateinfo";
import axios from "axios";
import formIcon from "./assets/formIcon.svg";
import uploadLogo from './assets/uploadLogo.svg'
import clearFieldsIcon from './assets/clearFieldsIcon.svg'

const SubmitInfo = () => {
  const initialState = {
    project_name: "",
    email: "",
    ticker: "",
    contract_address: "",
    about: "",
    audit_info: "",
    audit_link: "",
    website_link: "",
    twitter: "",
    project_logo: "",
    coinmarket: "",
    telegram: "",
    telegram_channel: "",
    coingecko: "",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);


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
          console.log(reader.result);
          setValues({ ...values, project_logo: reader.result });
          setImageError(false);
        }
      } else {
        setImageError(true);
      }
    };
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(validateInfo(values));
    console.log(validateInfo(values));
    if (Object.keys(validateInfo(values)).length === 0) {
      if (
        values.project_name !== "" &&
        values.ticker !== "" &&
        values.project_logo !== "" &&
        values.email !== "" &&
        values.ticker !== "" &&
        values.contract_address !== "" &&
        values.about !== "" &&
        values.audit_info !== "" &&
        values.audit_link !== "" &&
        values.website_link !== "" &&
        values.twitter !== "" &&
        values.coinmarket !== "" &&
        values.telegram !== "" &&
        values.telegram_channel !== "" &&
        values.coingecko !== ""
      )
      {

      const data = {
        project_name: values.project_name,
        email: values.email,
        project_logo: values.project_logo,
        ticker: values.ticker,
        contract_address: values.contract_address,
        about: values.about,
        audit_info: values.audit_info,
        audit_link: values.audit_link,
        website_link: values.website_link,
        twitter: values.twitter,
        coinmarket: values.coinmarket,
        telegram: values.telegram,
        telegram_channel: values.telegram_channel,
        coingecko: values.coingecko,
      };
      console.log(data.project_logo);
        const send = await axios
          .post("https://api-mail.dyp.finance/api/submit_form", data)
          .then(function (result) {
            console.log(result.data.status);
            return result.data;
          })
          .catch(function (error) {
            console.error(error);
          });

        if (send.status === 1) {
          alert("Your information has been submitted.");
          setValues({ ...initialState });
          setErrors({})
          console.log("done!");
        } else {
          alert("Something went wrong.");
          console.log("not done!");

        }
      }
    }
  };

  const focusInput = (input) => {
    document.getElementById(input).focus();
  };

  const clearFields = () => {
    setValues(initialState)
    setErrors({})
  }

  return (
    <div className="container-lg px-0">
      <div className="d-flex flex-column gap-3 submit-form-title" style={{ width: "65%" }}>
        <h6 className="launchpad-hero-title">Submit Form</h6>
        <p className="launchpad-hero-desc">
          Use this form to submit information about your project to DYP Tools.
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
        <h6 className="mt-3 form-sub-title">Your details</h6>
        <div className="row px-0 gap-5 mx-0 gap-lg-0 w-100 mt-3">
          <div className="col-12 col-lg-7 col-xl-6 d-grid form-grid">
            <div className="input-container px-0" style={{ width: "100%" }}>
              <input
                type="text"
                id="project_name"
                name="project_name"
                placeholder=" "
                className={`text-input ${
                  errors.project_name && "error-border"
                }`}
                style={{ width: "100%" }}
                value={values.project_name}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                onClick={() => focusInput("project_name")}
              >
                Project name<span className="required-star">*</span>
              </label>
              {errors.project_name && (
                <span className="error-text">{errors.project_name}</span>
              )}
            </div>
            <div className="input-container px-0" style={{ width: "100%" }}>
              <input
                type="text"
                id="ticker"
                name="ticker"
                placeholder=" "
                className={`text-input ${
                  errors.ticker && "error-border"
                }`}
                style={{ width: "100%" }}
                value={values.ticker}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                onClick={() => focusInput("ticker")}
              >
                Ticker symbol<span className="required-star">*</span>
              </label>
              {errors.ticker && (
                <span className="error-text">{errors.ticker}</span>
              )}
            </div>
            <div className="input-container px-0" style={{ width: "100%" }}>
              <input
                type="text"
                id="email"
                name="email"
                placeholder=" "
                className={`text-input ${
                  errors.email && "error-border"
                }`}
                style={{ width: "100%" }}
                value={values.email}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                onClick={() => focusInput("email")}
              >
                Email<span className="required-star">*</span>
              </label>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>
            <div className="input-container px-0" style={{ width: "100%" }}>
              <input
                type="text"
                id="contract_address"
                name="contract_address"
                placeholder=" "
                className={`text-input ${
                  errors.contract_address && "error-border"
                }`}
                style={{ width: "100%" }}
                value={values.contract_address}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                onClick={() => focusInput("contract_address")}
              >
               Pair contract address<span className="required-star">*</span>
              </label>
              {errors.contract_address && (
                <span className="error-text">{errors.contract_address}</span>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-5 col-xl-5">
          <div className="input-container px-0" style={{ width: "100%" }}>
                  <textarea
                    type="text"
                    id="about"
                    name="about"
                    placeholder=" "
                    className={`text-input ${
                      errors.about && "error-border"
                    }`}
                    style={{ width: "100%" }}
                    rows="7"
                    value={values.about}
                    onChange={(e) => handleChange(e)}
                  />
                  <label
                    htmlFor="usd"
                    className="label"
                    onClick={() => focusInput("about")}
                  >
                    About the project <span className="required-star">*</span>
                  </label>
                  {errors.project_name && (
                <span className="error-text">{errors.about}</span>
              )}
                </div>
          </div>
        </div>
        <hr className="form-divider my-4" style={{height: '2px'}} />
        <h6 className="form-sub-title">Smart contract details</h6>

        <div className="row mx-0 px-0 w-100 mt-4">
          <div className="col-12 col-lg-7 col-xl-6 d-grid form-grid">
          <div className="input-container px-0" style={{ width: "100%" }}>
              <input
                type="text"
                id="audit_info"
                name="audit_info"
                placeholder=" "
                className={`text-input ${
                  errors.audit_info && "error-border"
                }`}
                style={{ width: "100%" }}
                value={values.audit_info}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                onClick={() => focusInput("audit_info")}
              >
                Smart contract audit information<span className="required-star">*</span>
              </label>
              {errors.audit_info && (
                <span className="error-text">{errors.audit_info}</span>
              )}
            </div>
            <div className="input-container px-0" style={{ width: "100%" }}>
              <img src={require('./assets/webIcon.svg').default} alt="" className="input-icon" />
              <input
                type="text"
                id="audit_link"
                name="audit_link"
                placeholder=" "
                className={`text-input ${
                  errors.audit_link && "error-border"
                }`}
                style={{ width: "100%", paddingLeft: '30px' }}
                value={values.audit_link}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                style={{left: '30px'}}
                onClick={() => focusInput("audit_link")}
              >
                Smart contract audit URL<span className="required-star">*</span>
              </label>
              {errors.audit_link && (
                <span className="error-text">{errors.audit_link}</span>
              )}
            </div>
          </div>
        </div>
        <hr className="form-divider my-4" style={{height: '2px'}} />
        <h6 className="form-sub-title">Additional links</h6>
        <h6 className="form-title mt-3">Media links</h6>
        <div className="row gap-4 gap-lg-0 mx-0 px-0 w-100 mt-2">
          <div className="col-12 d-flex justify-content-center justify-content-lg-start col-lg-2 col-xl-3">
          <div className="upload-container d-flex justify-content-center align-items-center position-relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={(e) => convert2base64(e)}
                />
                   {values.project_logo !== "" ? (
                  <img
                    src={values.project_logo}
                    alt=""
                    style={{ maxHeight: "110px", maxWidth: "110px" }}
                  />
                ) : (
                  <img src={uploadLogo} alt="" />
                )}
              {errors.project_logo && (
                <span className="error-text">{errors.project_logo}</span>
              )}
              </div>
          </div>
          <div className="col-12 col-lg-10 col-xl-9 ps-3 d-grid additional-grid">
          <div className="input-container px-0" style={{ width: "100%" }}>
              <img src={require('./assets/webIcon.svg').default} alt="" className="input-icon" />
              <input
                type="text"
                id="website_link"
                name="website_link"
                placeholder=" "
                className={`text-input ${
                  errors.website_link && "error-border"
                }`}
                style={{ width: "100%", paddingLeft: '30px' }}
                value={values.website_link}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                style={{left: '30px'}}
                onClick={() => focusInput("website_link")}
              >
                Website<span className="required-star">*</span>
              </label>
              {errors.website_link && (
                <span className="error-text">{errors.website_link}</span>
              )}
            </div>
          <div className="input-container px-0" style={{ width: "100%" }}>
              <img src={require('./assets/coinmarketcapIcon.svg').default} alt="" className="input-icon" />
              <input
                type="text"
                id="coinmarket"
                name="coinmarket"
                placeholder=" "
                className={`text-input ${
                  errors.coinmarket && "error-border"
                }`}
                style={{ width: "100%", paddingLeft: '30px' }}
                value={values.coinmarket}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                style={{left: '30px'}}
                onClick={() => focusInput("coinmarket")}
              >
                CoinMarketCap<span className="required-star">*</span>
              </label>
              {errors.coinmarket && (
                <span className="error-text">{errors.coinmarket}</span>
              )}
            </div>
          <div className="input-container px-0" style={{ width: "100%" }}>
              <img src={require('./assets/coingeckoIcon.svg').default} alt="" className="input-icon" />
              <input
                type="text"
                id="coingecko"
                name="coingecko"
                placeholder=" "
                className={`text-input ${
                  errors.coingecko && "error-border"
                }`}
                style={{ width: "100%", paddingLeft: '30px' }}
                value={values.coingecko}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                style={{left: '30px'}}
                onClick={() => focusInput("coingecko")}
              >
                CoinGecko<span className="required-star">*</span>
              </label>
              {errors.coingecko && (
                <span className="error-text">{errors.coingecko}</span>
              )}
            </div>
          <div className="input-container px-0" style={{ width: "100%" }}>
              <img src={require('./assets/telegramIcon.svg').default} alt="" className="input-icon" />
              <input
                type="text"
                id="telegram"
                name="telegram"
                placeholder=" "
                className={`text-input ${
                  errors.telegram && "error-border"
                }`}
                style={{ width: "100%", paddingLeft: '30px' }}
                value={values.telegram}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                style={{left: '30px'}}
                onClick={() => focusInput("telegram")}
              >
                Telegram username<span className="required-star">*</span>
              </label>
              {errors.telegram && (
                <span className="error-text">{errors.telegram}</span>
              )}
            </div>
          <div className="input-container px-0" style={{ width: "100%" }}>
              <img src={require('./assets/telegramIcon.svg').default} alt="" className="input-icon" />
              <input
                type="text"
                id="telegram_channel"
                name="telegram_channel"
                placeholder=" "
                className={`text-input ${
                  errors.telegram_channel && "error-border"
                }`}
                style={{ width: "100%", paddingLeft: '30px' }}
                value={values.telegram_channel}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                style={{left: '30px'}}
                onClick={() => focusInput("telegram_channel")}
              >
                Telegram official channel<span className="required-star">*</span>
              </label>
              {errors.telegram_channel && (
                <span className="error-text">{errors.telegram_channel}</span>
              )}
            </div>
          <div className="input-container px-0" style={{ width: "100%" }}>
              <img src={require('./assets/twitterIcon.svg').default} alt="" className="input-icon" />
              <input
                type="text"
                id="twitter"
                name="twitter"
                placeholder=" "
                className={`text-input ${
                  errors.twitter && "error-border"
                }`}
                style={{ width: "100%", paddingLeft: '30px' }}
                value={values.twitter}
                onChange={(e) => handleChange(e)}
              />
              <label
                htmlFor="usd"
                className="label"
                style={{left: '30px'}}
                onClick={() => focusInput("twitter")}
              >
                Twitter<span className="required-star">*</span>
              </label>
              {errors.twitter && (
                <span className="error-text">{errors.twitter}</span>
              )}
            </div>
          </div>
        </div>
        <h6 className={`image-tip mt-4 ${imageError && "required-star"}`}>*Logo dimensions must be 250px x 250px and max 150kb - jpeg, png.</h6>
        <div className="d-flex align-items-center justify-content-between mt-5">
          <div className="d-flex align-items-center gap-2 cursor-pointer">
            <img src={clearFieldsIcon} alt="" />
            <h6 className="clear-fields" onClick={clearFields}>
              Clear all fields
            </h6>
          </div>
          <button className="btn filledbtn px-5" onClick={(e) => handleSubmit(e)}>Submit</button>
        </div>
      </div>
    </div>
    // <div>
    //   <div className="row px-3 table-title">
    //     <div>
    //       <h2 style={{ display: "block", color: "var(--preloader-clr)" }}>
    //         Submit form
    //       </h2>
    //       <p className="d-block">
    //         Use this form to submit information about your project to DYP Tools
    //       </p>
    //     </div>
    //   </div>
    //   <div className="px-3 table-title" style={{ paddingBottom: "6rem" }}>
    //     <form
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         gap: 20,
    //         margin: "2rem",
    //       }}
    //     >
    //       <div style={{ borderBottom: "1px solid #D5D7E6" }}>
    //         <h5>Your details</h5>
    //         <div className="row mt-3 mb-4">
    //           <div className="col-lg-4 single-cell">
    //             <div className="input-wrapper">
    //               <span className="required-text">Project name</span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="project_name"
    //                 id="project_name"
    //                 value={values.project_name}
    //                 onChange={handleChange}
    //                 placeholder="Project name"
    //               />
    //               {errors.project_name && (
    //                 <span className="errormessage">{errors.project_name}</span>
    //               )}
    //             </div>
    //             {/* <div className="input-wrapper">
    //               <span className="required-text">Nr. of NFT to created</span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="nft_number"
    //                 id="nft_number"
    //                 value={values.nft_number}
    //                 onChange={handleChange}
    //                 placeholder="Nft number"
    //               />
    //               {errors.nft_number && (
    //                 <span className="errormessage">{errors.nft_number}</span>
    //               )}
    //             </div> */}
    //             <div className="input-wrapper">
    //               <span className="required-text">Email</span>
    //               <input
    //                 type="email"
    //                 className="inputfield"
    //                 name="email"
    //                 id="email"
    //                 value={values.email}
    //                 onChange={handleChange}
    //                 placeholder="Email"
    //               />
    //               {errors.email && (
    //                 <span className="errormessage">{errors.email}</span>
    //               )}
    //             </div>
    //           </div>
    //           <div className="col-lg-4 single-cell">
    //             <div className="input-wrapper">
    //               <span className="required-text">Ticker symbol</span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="ticker"
    //                 id="ticker"
    //                 value={values.ticker}
    //                 onChange={handleChange}
    //                 placeholder="Ticker"
    //               />
    //               {errors.ticker && (
    //                 <span className="errormessage">{errors.ticker}</span>
    //               )}
    //             </div>
    //             <div className="input-wrapper">
    //               <span className="required-text">
    //                 Uniswap pair contract list
    //               </span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="contract_address"
    //                 id="contract_address"
    //                 value={values.contract_address}
    //                 onChange={handleChange}
    //                 placeholder="For multiple addresses, separate them by comma ','"
    //               />
    //               {errors.contract_address && (
    //                 <span className="errormessage">
    //                   {errors.contract_address}
    //                 </span>
    //               )}
    //             </div>
    //           </div>
    //           <div className="col-lg-4">
    //             <div className="input-wrapper">
    //               <span className="required-text">About the project</span>

    //               <textarea
    //                 className="inputfield"
    //                 style={{
    //                   height: "auto",
    //                   paddingTop: 10,
    //                   paddingBottom: 10,
    //                 }}
    //                 id="inputAddress"
    //                 placeholder="Enter project description and include information about the project's liquidity, team profiles, smart contract security efforts, project mission etc."
    //                 name="about"
    //                 rows="8"
    //                 cols="2"
    //                 onChange={handleChange}
    //                 value={values.about}
    //               />
    //               {errors.about && (
    //                 <span className="errormessage">{errors.about}</span>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <div style={{ borderBottom: "1px solid #D5D7E6" }}>
    //         <h5>Smart contract details</h5>
    //         <div className="row mt-3 mb-4">
    //           <div className="col-lg-4 single-cell">
    //             <div className="input-wrapper">
    //               <span className="required-text">
    //                 Smart contract audit information
    //               </span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="audit_info"
    //                 id="audit_info"
    //                 value={values.audit_info}
    //                 onChange={handleChange}
    //                 placeholder="Smart contract audit information"
    //               />
    //               {errors.audit_info && (
    //                 <span className="errormessage">{errors.audit_info}</span>
    //               )}
    //             </div>
    //           </div>
    //           <div className="col-lg-4 single-cell">
    //             <div className="input-wrapper">
    //               <span className="required-text">Smart contract audit</span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="audit_link"
    //                 id="audit_link"
    //                 value={values.audit_link}
    //                 onChange={handleChange}
    //                 placeholder="URL"
    //               />
    //               {errors.audit_link && (
    //                 <span className="errormessage">{errors.audit_link}</span>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <div>
    //         <h5>Additional links</h5>
    //         <div className="row mt-3 mb-4">
    //           <div className="col-lg-4 single-cell">
    //             <div className="input-wrapper">
    //               <span className="required-text">Website</span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="website_link"
    //                 id="website_link"
    //                 value={values.website_link}
    //                 onChange={handleChange}
    //                 placeholder="URL"
    //               />
    //               {errors.website_link && (
    //                 <span className="errormessage">{errors.website_link}</span>
    //               )}
    //             </div>
    //             <div className="input-wrapper">
    //               <span className="required-text">Transparent logo image</span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="logo_link"
    //                 id="logo_link"
    //                 value={values.logo_link}
    //                 onChange={handleChange}
    //                 placeholder="URL"
    //               />
    //               {errors.logo_link && (
    //                 <span className="errormessage">{errors.logo_link}</span>
    //               )}
    //             </div>
    //           </div>
    //           <div className="col-lg-4 single-cell">
    //             <div className="input-wrapper">
    //               <span className="required-text">CoinMarketCap</span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="coinmarket"
    //                 id="coinmarket"
    //                 value={values.coinmarket}
    //                 onChange={handleChange}
    //                 placeholder="URL"
    //               />
    //               {errors.coinmarket && (
    //                 <span className="errormessage">{errors.coinmarket}</span>
    //               )}
    //             </div>
    //             <div className="input-wrapper">
    //               <span className="required-text">Telegram</span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="telegram"
    //                 id="telegram"
    //                 value={values.telegram}
    //                 onChange={handleChange}
    //                 placeholder="URL"
    //               />
    //               {errors.telegram && (
    //                 <span className="errormessage">{errors.telegram}</span>
    //               )}
    //             </div>
    //           </div>
    //           <div className="col-lg-4 single-cell">
    //             <div className="input-wrapper">
    //               <span className="required-text">CoinGecko</span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="coingecko"
    //                 id="coingecko"
    //                 value={values.coingecko}
    //                 onChange={handleChange}
    //                 placeholder="URL"
    //               />
    //               {errors.coingecko && (
    //                 <span className="errormessage">{errors.coingecko}</span>
    //               )}
    //             </div>
    //             <div className="input-wrapper">
    //               <span className="required-text">Twitter </span>
    //               <input
    //                 type="text"
    //                 className="inputfield"
    //                 name="twitter"
    //                 id="twitter"
    //                 value={values.twitter}
    //                 onChange={handleChange}
    //                 placeholder="URL"
    //               />
    //               {errors.twitter && (
    //                 <span className="errormessage">{errors.twitter}</span>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="row mt-3 buttons-wrapper">
    //         <div className="col-lg-4 single-cell">
    //           <div className="submitbtn" onClick={handleSubmit}>
    //             <span className="submit-text">Submit</span>
    //           </div>
    //         </div>
    //         <div className="col-lg-4 single-cell">
    //           <div
    //             className="clearbtn"
    //             onClick={() => {
    //               setValues({ ...initialState });
    //             }}
    //           >
    //             <span className="clear-text">Clear form</span>
    //           </div>
    //         </div>
    //       </div>
    //     </form>{" "}
    //   </div>
    // </div>
  );
};

export default SubmitInfo;
