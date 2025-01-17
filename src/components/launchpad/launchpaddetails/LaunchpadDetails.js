import React from "react";
import "./launchpaddetails.css";
import launchpadDetailsIcon from "../assets/launchpadDetailsIcon.svg";
import timerIcon from "../assets/timerIcon.svg";
// import coinStack from "../assets/coinStackIcon.svg";
import messageWarningIcon from "../assets/messageWarningIcon.svg";
import { DropdownButton } from "react-bootstrap";
import getFormattedNumber from "../../../functions/get-formatted-number";
// import walletIcon from "../../header/assets/walletIcon.svg";

const LaunchpadDetails = () => {
  return (
    <div className="container-lg">
      <div className="row gap-4 gap-lg-0">
        <div className="col-12 col-lg-7 p-2 p-lg-4 main-details-wrapper position-relative">
          <div
            className="purplediv"
            style={{ left: "0px", background: "#8E97CD" }}
          ></div>
          <img
            src="https://cdn.worldofdypians.com/tools/midleDetailsBanner.png"
            alt=""
          />
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="d-flex align-items-center gap-2">
              <img
                src="https://cdn.worldofdypians.com/tools/midleLogo.png"
                height={30}
                width={30}
                alt=""
              />
              <span className="launch-details-header">
                Introduction to Midle
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <a href="#">
                <img
                  src="https://cdn.worldofdypians.com/tools/detailsWebsite.svg"
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src="https://cdn.worldofdypians.com/tools/detailsTwitter.svg"
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src="https://cdn.worldofdypians.com/tools/detailsTelegram.svg"
                  alt=""
                />
              </a>
              <a href="#">
                <img
                  src="https://cdn.worldofdypians.com/tools/detailsPoll.svg"
                  alt=""
                />
              </a>
            </div>
          </div>
          <p className="mt-3 launch-details-content">
            Midle is an all-in-one marketing platform that enhances user
            acquisition, engagement, and retention for both Web2 and Web3
            brands. By implementing a task-to-earn model, it incentivizes users
            to complete various social media and on-chain tasks, rewarding them
            with tokens and NFTs. Brands can create tailored campaigns
            accessible to Midle’s extensive user base across more than 140
            countries, thereby boosting brand awareness and digital presence.
            <br />
            <br />
            The platform’s data-driven approach offers detailed analytics
            through a comprehensive dashboard, enabling brands to monitor
            campaign performance and refine marketing strategies effectively.
            Midle’s anti-bot system ensures genuine user engagement, while its
            gamified clan system fosters competition and loyalty among users.
            Additionally, Midle facilitates the transition from Web2 to Web3 for
            traditional brands, providing seamless access to a diverse and
            engaged audience.
          </p>
          <h6 className="mt-3 launch-subheader">Highlights</h6>
          <ul style={{ listStyle: "disc", margin: "0", paddingLeft: "30px" }}>
            <li className="launch-details-content">
              Partnered with over 350 projects, including Linea, Sei, Scroll,
              Taiko, The Sandbox, CoreDAO, and many more!
            </li>
            <li className="launch-details-content">
              Reached clients and campaigns in more than 140 countries, with
              over 300,000 individual active users.
            </li>
            <li className="launch-details-content">
              Seven free airdrops for stakers are already live!
            </li>
            <li className="launch-details-content">
              Accelerated by CoinTelegraph and Albaraka Garaj.
            </li>
            <li className="launch-details-content">
              Backed by Castrum Capital, Nadmah, GAMI, and NovaClubAI.
            </li>
            <li className="launch-details-content">
              Supported by grants from Microsoft, Google, BNB Chain, Telos, Haqq
              Network, CovalentHQ, and Nibiru Chain.
            </li>
          </ul>
          <h6 className="mt-3 launch-subheader">
            Tokenomics & Token Utilities
          </h6>
          <ul style={{ listStyle: "disc", margin: "0", paddingLeft: "30px" }}>
            <li className="launch-details-content">Token Ticker: $MIDLE</li>
            <li className="launch-details-content">Token Standard: BEP-20</li>
            <li className="launch-details-content">Network: BNB Chain</li>
            <li className="launch-details-content">
              Total Supply: 1,000,000,000
            </li>
            <li className="launch-details-content">
              Fully Diluted Valuation: $10,000,000
            </li>
            <li className="launch-details-content">
              Initial Market Cap Without Liquidity: $261,000
            </li>
            <li className="launch-details-content">
              Initial Market Cap: $561,000
            </li>
          </ul>
          <h6 className="mt-3 launch-subheader">$MIDLE Token Utilities</h6>
          <p className="launch-details-content mt-2">
            <b>B2C Token Utilities</b>
          </p>
          <ul style={{ listStyle: "disc", margin: "0", paddingLeft: "30px" }}>
            <li className="launch-details-content">
              Participate in special campaigns and tasks by staking Midle
              tokens.
            </li>
            <li className="launch-details-content">
              Earn tickets and token rewards based on the amount of staked
              tokens.
            </li>
            <li className="launch-details-content">
              Receive whitelist rewards for token stakers.{" "}
            </li>
            <li className="launch-details-content">
              Access Midle token staking pools with different APRs.
            </li>
            <li className="launch-details-content">
              Join campaigns and tasks, including seasonal ones, based on staked
              amounts.
            </li>
            <li className="launch-details-content">
              Earn bonus tickets (1.5x, 2x, or 3x) based on staking amounts and
              pools.
            </li>
            <li className="launch-details-content">
              Gain whitelist rewards from upcoming projects using Midle tokens.
            </li>
            <li className="launch-details-content">
              Enjoy leaderboard and giveaway rewards with Midle tokens.
            </li>
          </ul>
          <p className="launch-details-content mt-2">
            <b>B2B Token Utilities</b>
          </p>
          <ul style={{ listStyle: "disc", margin: "0", paddingLeft: "30px" }}>
            <li className="launch-details-content">
              Participate in ecosystem groups.
            </li>
            <li className="launch-details-content">
              Access free automated task systems and additional features by
              staking.
            </li>
            <li className="launch-details-content">
              Benefit from Midle token staking pools with varied APRs.
            </li>
            <li className="launch-details-content">
              Use services for free by staking Midle tokens.
            </li>
            <li className="launch-details-content">
              Avail discounts on Midle Point and subscription purchases.
            </li>
          </ul>
          <p className="launch-details-content mt-2">
            <b>Mechanisms</b>
          </p>
          <ul style={{ listStyle: "disc", margin: "0", paddingLeft: "30px" }}>
            <li className="launch-details-content">
              Buyback Mechanism: 30% of project payments are used for token
              buybacks.
            </li>
            <li className="launch-details-content">
              Burn Mechanism: 100 Midle tokens are burned for each new user,
              with burns every three months post-IDO.
            </li>
            <li className="launch-details-content">
              Stake Mechanism: Both B2C and B2B stakers gain access to utilities
              like staking pools, discounts, and campaign participation.
            </li>
          </ul>
        </div>
        <div className="col-12 col-lg-5 px-0 px-lg-2">
          <div className="main-details-wrapper p-3 position-relative">
            <div
              className="purplediv"
              style={{ left: "0px", background: "#8E97CD", top: "25px" }}
            ></div>
            <div className="d-flex flex-column flex-lg-row align-items-center align-items-lg-start gap-3 gap-lg-0 justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={"https://cdn.worldofdypians.com/tools/coinStackIcon.svg"}
                  alt=""
                />
                <div className="d-flex flex-column gap-1">
                  <h6 className="launch-details-header">Buy Midle</h6>
                  <span className="details-warning">
                    By depositing one of the supported assets
                  </span>
                </div>
              </div>
              {/* <button id="dropdown-basic-button2">Connect wallet</button> */}
              <DropdownButton
                id="dropdown-basic-button2"
                title={
                  <span
                    className="d-flex align-items-center gap-2 connecttitle position-relative"
                    style={{ bottom: "5px", fontSize: "12px" }}
                  >
                    {/* <img
                      src={walletIcon}
                      alt=""
                      className="position-relative"
                      // style={{ top: 4 }}
                    /> */}
                    Connect Wallet
                  </span>
                }
              ></DropdownButton>
            </div>
            <hr className="form-divider my-4" />
            <span className="my-rewards-text">
              Balance: <b>10000 WETH</b>
            </span>
            <div className="d-flex align-items-center justify-content-between mt-4 gap-2">
              <div className="d-flex align-items-center gap-4">
                <div className="position-relative">
                  <h6 className="amount-txt">Amount</h6>
                  <input
                    type={"number"}
                    className="styledinput"
                    placeholder="0.0"
                    style={{ width: "100%" }}
                  />
                </div>
                <button className="btn maxbtn">Max</button>
              </div>
              <button className="btn filledbtn">Approve</button>
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            <div className="my-commitment-wrapper py-4 w-100 d-flex flex-column align-items-center gap-2 mt-3">
              <h6 className="mb-0 my-commitment-value">
                ${getFormattedNumber(0)}
              </h6>
              <span className="my-commitment-span">My Commitment</span>
            </div>
          </div>
          <div className="details-date-wrapper p-3 d-flex align-items-center justify-content-between mt-3">
            <div className="d-flex flex-column align-items-start">
              <span className="date-start-span">Start Date</span>
              <h6 className="mb-0 date-start-value">17 Jan 2025</h6>
            </div>
            <img
              src="https://cdn.worldofdypians.com/tools/detailsTimer.svg"
              alt=""
            />
            <div className="d-flex flex-column align-items-end">
              <span className="date-start-span">End Date</span>
              <h6 className="mb-0 date-start-value">21 Jan 2025</h6>
            </div>
          </div>

          <div className="main-details-wrapper p-3 position-relative mt-3">
            <div
              className="purplediv"
              style={{ left: "0px", background: "#8E97CD", top: "25px" }}
            ></div>
            <div className="d-flex flex-column flex-lg-row align-items-center align-items-lg-start gap-3 gap-lg-0 justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={"https://cdn.worldofdypians.com/tools/coinStackIcon.svg"}
                  alt=""
                />
                <h6 className="launch-details-header">Details</h6>
              </div>
              {/* <button id="dropdown-basic-button2">Connect wallet</button> */}
            </div>
            <hr className="form-divider my-4" />
            <div className="launchpad-details-grid">
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Token Distribution</span>
                <h6 className="mb-0 midle-details-value">Private Round</h6>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Token Price</span>
                <h6 className="mb-0 midle-details-value"> $ 0.007</h6>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Cliff/Vesting Period</span>
                <h6 className="mb-0 midle-details-value">1/10 Months</h6>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Network</span>
                <div className="d-flex align-items-center gap-1">
                  <img
                    src={"https://cdn.worldofdypians.com/wod/bnbIcon.svg"}
                    alt=""
                  />
                  <h6 className="mb-0 midle-details-value">BNB Chain</h6>
                </div>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Fully Market Cap</span>
                <h6 className="mb-0 midle-details-value">$ 10,000,000</h6>
              </div>
              <div className="midle-details-item p-3 d-flex flex-column gap-2">
                <span className="midle-details-span">Initial Market Cap</span>
                <h6 className="mb-0 midle-details-value">$ 260,000</h6>
              </div>
            </div>
            <div className="launchpad-info-divider my-4"></div>
            <div className="d-flex align-items-center gap-2">
              <img
                src={"https://cdn.worldofdypians.com/tools/detailsWarning.svg"}
                alt=""
              />
              <span className="details-warning-text">Imprtant Note</span>
            </div>
            <div className="mt-3 launch-details-content">
              The final allocation will be determined based on the amount of DYP
              you stake or hold, with priority given to stakers. Unlike
              traditional launchpads that offer fixed allocations, our unique
              approach allows users to make deposits without predefined limits.
            </div>
            <div className="mt-3 launch-details-content">
              The final allocation is decided based on overall demand, ensuring
              fairness and rewarding greater participation. The more DYP you
              stake, the larger your allocation will be.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchpadDetails;
