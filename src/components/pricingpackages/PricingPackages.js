import React from "react";
import "./pricingpackages.css";
import greenCheck from "./assets/greenCheck.svg";

const PricingPackages = () => {
  const basicBenefits = [
    "Token Contract Development",
    "Token Lock, Vesting, and TimeLock Contracts",
    "Audit Advisory",
    "Governance Setup",
    "Tokenomics Advisory",
    "Wallet Integration Support",
    "Marketing Strategy Guidance",
    "Partnership Consultation",
    "3-Month Ongoing Support",
  ];

  const premiumBenefits = [
    "Everything in Basic Plan plus:",
    "Staking Smart Contracts",
    "Farming Smart Contracts",
    "NFT Smart Contract Development",
    "API Contract Integrations",
    "Pitch Deck Creation",
    "Dedicated Marketing Campaign",
    "Access to Partner Networks",
    "6-Month Ongoing Support",
  ];

  const enterpriseBenefits = [
    "Everything in Advanced Plan plus:",
    "Bridge Development (Cross-Chain Integration)",
    "Utility Smart Contracts",
    "Telegram Mini-App Development",
    "Launchpool Development",
    "Web3 Mini-Game Development",
    "World of Dypians Marketing Collaboration",
    "Access to VC Network",
    "12-Month Ongoing Support",
  ];

  return (
    <div className="container-lg p-0">
      <div className="row">
        <div className="col-12">
          <div className="migration-banner d-flex flex-column flex-lg-row p-4 gap-3 gap-lg-0 align-items-center justify-content-between mb-4">
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-2">
                <h6 className="migration-banner-title mb-0">
                  Unlock Your Web3 Growth Potential
                </h6>
                <p className="migration-banner-desc mb-0">
                  Empower your project with tailored solutions for every stage
                  of growth. From smart contract development to advanced
                  integrations, we offer the tools and expertise you need to
                  succeed in Web3. Enjoy FREE support for builders across all
                  packages, helping you navigate challenges and scale
                  seamlessly.
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="d-flex w-100 align-items-center justify-content-end">
                <div
                  className="pricing-package-buy-wrapper p-3 d-flex align-items-center justify-content-center position-relative"
                  style={{ width: "fit-content" }}
                >
                   <div className="d-flex flex-column">
                <span className="package-amount-needed">
                  My Balance:
                </span>
                <h6 className="package-plan-price mb-0 text-white">
                  X,XXX DYP
                </h6>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pricing-grid mt-3">
          <div className="package-plan-wrapper d-flex flex-column justify-content-between">
            <div className="d-flex flex-column gap-2">
              <div className="package-plan-header-holder p-3 d-flex align-items-center justify-content-center flex-column gap-2">
                <h6 className="package-plan-price text-white mb-0">Basic</h6>
                {/* <h6 className="mb-0 package-plan-price text-white">
                  5,000 DYP
                </h6> */}
                <span className="package-benefit text-center">
                  Ideal for projects just starting in Web3.
                </span>
              </div>
              <div className="d-flex flex-column gap-3 p-3">
                {basicBenefits.map((item, index) => (
                  <div className="d-flex align-items-center gap-2" key={index}>
                    <img src={greenCheck} alt="" />
                    <span className="package-benefit text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pricing-package-buy-wrapper p-3 d-flex gap-2 align-items-center justify-content-between w-100">
              <div className="d-flex flex-column">
                <span className="package-amount-needed">
                  Minimum Lock Amount:
                </span>
                <h6 className="package-plan-price mb-0 text-white">
                  X,XXX DYP
                </h6>
              </div>
              <button
                className="btn filledbtn px-5 py-2"
                style={{ fontSize: "14px" }}
              >
                Lock
              </button>
            </div>
          </div>
          <div className="package-plan-wrapper main-package-wrapper d-flex flex-column justify-content-between">
            <div className="d-flex flex-column gap-2">
              <div className="package-plan-header-holder main-package-holder position-relative p-3 d-flex align-items-center justify-content-center flex-column gap-2">
                <div className="top-package-pick px-2 py-1 d-flex align-items-center justify-content-center">
                  <span className="top-package-pick-span">Top Pick</span>
                </div>
                <h6 className="package-plan-price text-white mb-0 ">
                  Advanced
                </h6>
                {/* <h6 className="mb-0 package-plan-price text-white">15,000 DYP</h6> */}
                <span className="package-benefit text-center">
                  Perfect for growing teams needing advanced tools and support.
                </span>
              </div>
              <div className="d-flex flex-column gap-3 p-3">
                {premiumBenefits.map((item, index) => (
                  <div className="d-flex align-items-center gap-2" key={index}>
                    <img src={greenCheck} alt="" />
                    <span className="package-benefit text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pricing-package-buy-wrapper p-3 d-flex gap-2 align-items-center justify-content-between w-100">
              <div className="d-flex flex-column">
                <span className="package-amount-needed">
                  Minimum Lock Amount:
                </span>
                <h6 className="package-plan-price mb-0 text-white">
                  XX,XXX DYP
                </h6>
              </div>
              <button
                className="btn filledbtn px-5 py-2"
                style={{ fontSize: "14px" }}
              >
                Lock
              </button>
            </div>
          </div>
          <div className="package-plan-wrapper d-flex flex-column justify-content-between">
            <div className="d-flex flex-column gap-2">
              <div className="package-plan-header-holder p-3 d-flex align-items-center justify-content-center flex-column gap-2">
                <h6 className="package-plan-price text-white mb-0">
                  Enterprise
                </h6>
                {/* <h6 className="mb-0 package-plan-price text-white">30,000 DYP</h6> */}
                <span className="package-benefit text-center">
                  Designed for large organizations with custom needs and
                  full-scale solutions.
                </span>
              </div>
              <div className="d-flex flex-column gap-3 p-3">
                {enterpriseBenefits.map((item, index) => (
                  <div className="d-flex align-items-center gap-2" key={index}>
                    <img src={greenCheck} alt="" />
                    <span className="package-benefit text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pricing-package-buy-wrapper p-3 d-flex gap-2 align-items-center justify-content-between w-100">
              <div className="d-flex flex-column">
                <span className="package-amount-needed">
                  Minimum Lock Amount:
                </span>
                <h6 className="package-plan-price mb-0 text-white">
                  XX,XXX DYP
                </h6>
              </div>
              <button
                className="btn filledbtn px-5 py-2"
                style={{ fontSize: "14px" }}
              >
                Lock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPackages;
