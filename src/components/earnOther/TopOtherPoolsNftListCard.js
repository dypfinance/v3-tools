import React, { useEffect, useState } from "react"; 
import useWindowSize from "../../functions/useWindowSize";
import CawsDetailsPremium from "../FARMINNG/cawsPremium";
import LandDetailsPremium from "../FARMINNG/landPremium";

import "../top-pools-card/top-pools.css";

const TopOtherPoolsNftListCard = ({
  tokenLogo,
  cardId,
  tokenName,
  tokenTicker,
  apr,
  lockTime,
  chain,
  coming_soon,
  cardIndex,
  chainId,
  handleConnection,
  handleSwitchNetwork,
  coinbase,
  isConnected,
  listType,
  display,
  expired,
  clickedCawsPool,
  onCloseCard,
  poolClickedType,
  isPremium,
}) => {
  const ethCoins = ["ethereum", "wbtc", "usdc", "usdt"];
  const bscCoins = [
    "bsc",
    "btcb",
    "ethereum",
    "busd",
    "pancakeswap",
    "idypius",
  ];
  const bscCoins2 = ["bsc"];

  const avaxCoins = [
    "avax",
    "ethereum",
    "wbtc",
    "usdt",
    "usdc",
    "dai",
    "idypius",
    "pangolin",
    "benqi",
    "xava",
    "link",
  ];

  const avaxCoins2 = ["avax"];

  const [showDetails, setShowDetails] = useState(false);
  const [cardIndexDyp, setcardIndex] = useState();

  const [coins, setCoins] = useState(ethCoins);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (chain === "eth") {
      setCoins(ethCoins);
    } else if (chain === "bnb" && expired === false) {
      setCoins(bscCoins2);
    } else if (chain === "bnb" && expired === true) {
      setCoins(bscCoins);
    } else if (chain === "avax" && expired === true) {
      setCoins(avaxCoins);
    } else if (chain === "avax" && expired === false) {
      setCoins(avaxCoins2);
    }
  }, [chain]);

  const handleDetails = () => {
    if (showDetails === false && clickedCawsPool === false) {
      setShowDetails(true);
      setcardIndex(cardIndex);
      // onShowDetailsClick();
    } else if (clickedCawsPool === true) {
      setShowDetails(false);
      setcardIndex();
      onCloseCard();
    } else if (showDetails === true && clickedCawsPool === false) {
      setShowDetails(false);
      setcardIndex();
      onCloseCard();
    }
  };

  useEffect(() => {
    if (poolClickedType === "details-land-nft") {
      setcardIndex(1);
    } else if (poolClickedType === "details-nft") {
      setcardIndex(0);
    } else {
      setcardIndex();
    }
  }, [poolClickedType]);
  return (
    <>
      <div
        className={`row w-100 flex-column gap-3 gap-lg-0 flex-lg-row align-items-center position-relative justify-content-between  mx-0 cursor-pointer ${
          expired === true ? "poolscardwrapperexpired" : "list-pool-card-nft"
        } ${showDetails && "pools-card-hover"} `}
        onClick={() => handleDetails()}
        style={{
          display: display,
          pointerEvents: coming_soon ? "none" : "auto",
        }}
      >
        <img
          src={'https://cdn.worldofdypians.com/tools/premiumIcon.svg'}
          className="position-absolute nft-premium-icon d-none d-lg-block"
        />
        <div className="px-0 d-flex justify-content-between align-items-center">
          <table className="earnother-table">
            <tbody>
              {windowSize.width && windowSize.width > 768 ? (
                <tr className="d-flex w-100 align-items-center justify-content-around">
                  <td className="earnother-td col-2">
                    <div className={`col-6 d-flex align-items-center gap-2`}>
                      <img
                        src={`https://cdn.worldofdypians.com/tools/${tokenLogo}`}
                        width={28}
                        height={28}
                        alt=""
                      />
                      <h5
                        className="text-white"
                        style={{ fontSize: "16px", fontWeight: "600" }}
                      >
                        {tokenName}
                      </h5>
                    </div>
                  </td>
                  <td className="earnother-td col-2">
                    <h5
                      style={{
                        fontSize: "15px",
                        fontWeight: "300",
                        color: "#F7F7FC",
                      }}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src={
                          chain === "Ethereum"
                            ? 'https://cdn.worldofdypians.com/tools/ethStakeActive.svg'
                            : chain === "BNB Chain"
                            ? 'https://cdn.worldofdypians.com/tools/bnbStakeActive.svg'
                            : chain === "Base"
                            ? 'https://cdn.worldofdypians.com/tools/baseStakeActive.svg'
                            : 'https://cdn.worldofdypians.com/tools/avaxStakeActive.svg'
                        }
                        style={{ width: 18, height: 18 }}
                        alt=""
                        className="pool-coins"
                      />
                      {chain}
                    </h5>
                  </td>
                  <td className="earnother-td col-2">
                    <h5
                      style={{
                        fontSize: "16px",
                        fontWeight: "300",
                        color: "#F7F7FC",
                        // marginLeft: 30,
                      }}
                    >
                      {apr}%
                    </h5>
                  </td>
                  <td className="earnother-td col-2">
                    <h5
                      style={{
                        fontSize: "16px",
                        fontWeight: "300",
                        color: "#F7F7FC",
                      }}
                    >
                      {lockTime}
                    </h5>
                  </td>
                  {!coming_soon ? (
                    <td className="earnother-td col-2">
                      <h6 className="details-text2 w-75 gap-1 d-flex align-items-center cursor-pointer justify-content-center m-0">
                        Stake
                      </h6>
                    </td>
                  ) : (
                    <td className="earnother-td col-2">
                      <h6 className="details-text3 w-75 gap-1 d-flex align-items-center cursor-pointer justify-content-center m-0">
                        Coming Soon
                      </h6>
                    </td>
                  )}
                </tr>
              ) : windowSize.width && windowSize.width <= 768 ? (
                <>
                  <tr className="d-flex w-100 align-items-center justify-content-between mb-3">
                    <td className="earnother-td w-100">
                      <div className="d-flex align-items-center w-100  justify-content-between gap-2">
                        <div className={` d-flex align-items-center gap-1`}>
                          <img
                            src={`https://cdn.worldofdypians.com/tools/${tokenLogo}`}
                            width={28}
                            height={28}
                            alt=""
                          />
                          <div className="d-flex align-items-center gap-1">
                            <h5
                              className="text-white"
                              style={{ fontSize: "16px", fontWeight: "600" }}
                            >
                              {tokenName}
                            </h5>
                            <h5
                              className="text-white"
                              style={{
                                fontSize: "14px",
                                fontWeight: "300",
                                color: "#F7F7FC",
                              }}
                            >
                              <img
                                src={'https://cdn.worldofdypians.com/tools/premiumTag.svg'}
                                className="d-block d-lg-none d-md-none w-auto"
                              />
                            </h5>
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <h5
                            style={{
                              fontSize: "16px",
                              fontWeight: "300",
                              color: "#F7F7FC",
                            }}
                          >
                            {apr}%
                          </h5>
                          <h5
                            style={{
                              fontSize: "14px",
                              fontWeight: "300",
                              color: "#F7F7FC",
                            }}
                          >
                            APR
                          </h5>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {!coming_soon ? (
                    <tr className="d-flex w-100 align-items-center justify-content-around">
                      <td className="earnother-td w-100">
                        <h6 className="details-text2 gap-1 d-flex align-items-center cursor-pointer justify-content-center m-0 w-100">
                          Stake
                        </h6>
                      </td>
                    </tr>
                  ) : (
                    <tr className="d-flex w-100 align-items-center justify-content-around">
                      <td className="earnother-td w-100">
                        <h6 className="details-text3 gap-1 d-flex align-items-center cursor-pointer justify-content-center m-0 w-100">
                          Coming Soon
                        </h6>
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {(showDetails || clickedCawsPool || poolClickedType === "details-nft") &&
        expired === false &&
        cardIndex === 0 && cardIndexDyp ===0 && (
          <CawsDetailsPremium
            coinbase={coinbase}
            isConnected={isConnected}
            listType={listType}
            chainId={chainId}
            handleSwitchNetwork={handleSwitchNetwork}
            handleConnection={handleConnection}
            expired={false}
            apr={25}
            isPremium={isPremium}
          />
        )}
      {(showDetails ||
        clickedCawsPool ||
        poolClickedType === "details-land-nft") &&
        expired === false &&
        cardIndex === 1 && cardIndexDyp ===1 && (
          <LandDetailsPremium
            coinbase={coinbase}
            isConnected={isConnected}
            listType={listType}
            chainId={chainId}
            handleSwitchNetwork={handleSwitchNetwork}
            handleConnection={handleConnection}
            expired={false}
            apr={25}
            isPremium={isPremium}
          />
        )}
    </>
  );
};

export default TopOtherPoolsNftListCard;
