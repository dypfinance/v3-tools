import React, { useEffect, useState } from "react";
import greenArrow from "./assets/greenarrow.svg";
import orangeArrow from "./assets/orangearrow.svg";
import topPick from "./assets/toppick.svg";
import newPool from "./assets/newPool.png";

import "./top-pools.css";
import CawsDetails from "../FARMINNG/caws";

import initFarmAvax from "../FARMINNG/farmAvax";
import initBscFarming from "../FARMINNG/bscFarming";
import initStakingNew from "../FARMINNG/staking-new-front";

import stakeAvax from "../FARMINNG/stakeAvax";
import stakeAvax30 from "../FARMINNG/stakeAvax30";

import InitConstantStakingiDYP from "../FARMINNG/constant-staking-idyp-new-front";
import StakeAvaxIDyp from "../FARMINNG/stakeAvaxiDyp";
import StakeBscIDyp from "../FARMINNG/bscConstantStakeiDyp";
import StakeBscDai from "../FARMINNG/bscConstantStakeDai";
import StakeBsc from "../FARMINNG/bscConstantStake";
import StakeBsc2 from "../FARMINNG/bscConstantStake2";
import StakeAvaxDai from "../FARMINNG/stakeAvax3";
import StakeEthDai from "../FARMINNG/constant-staking-dai-front";
import StakeEth from "../FARMINNG/constant-staking-new-front";
import Vault from "../FARMINNG/vault-new";
import StakeNewEth from "../FARMINNG/stakeNewEth";

const TopPoolsListCard = ({
  tokenLogo,
  cardId,
  tokenName,
  apr,
  lockTime,
  tvl,
  onShowDetailsClick,
  onHideDetailsClick,
  top_pick,
  isNewPool,
  cardType,
  chain,
  topList,
  cardIndex,
  chainId,
  handleConnection,
  handleSwitchNetwork,
  coinbase,
  referrer,
  isConnected,
  the_graph_result,
  lp_id,
  the_graph_resultavax,
  the_graph_resultbsc,
  listType,
  display,
  expired,
  expiredPools,
  activePools,
  totalTvl,
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
  const [activeCardNFT, setActiveCardNFT] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [coins, setCoins] = useState(ethCoins);
  const [cardIndexiDyp, setcardIndexiDyp] = useState();
  const [cardIndexavax30, setcardIndexavax30] = useState();
  const [cardIndexavaxiDyp, setcardIndexavaxiDyp] = useState();

  const eth_address = "ETH";
  const wbnb_address = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
  const wbsc_address = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";

  const avax_address = "AVAX";

  const { rebase_factors, rebase_factorsavax, rebase_factorsbsc } = window;

  const stakeArray = [
    window.farming_new_4,
    window.farming_new_3,
    window.farming_new_1,
    window.farming_new_2,
    window.farming_new_5,
  ];

  const constantArray = [
    window.constant_staking_new8,
    window.constant_staking_new7,
    window.constant_staking_new5,
    window.constant_staking_new6,
    window.constant_staking_new9,
  ];

  const feeArray = [0.3, 0.3, 0.4, 0.8, 1.2];

  const lockarrayFarm = ["No Lock", 3, 30, 60, 90];

  const StakingNew1 = initStakingNew({
    token: window.token_new,
    staking: stakeArray[cardIndex - 1],
    chainId: chainId,
    constant: constantArray[cardIndex - 1],
    liquidity: eth_address,
    lp_symbol: "USD",
    reward: "30,000",
    lock: "3 Days",
    finalApr: expiredPools ? expiredPools[cardIndex - 1]?.apy_percent : 0,
    rebase_factor: rebase_factors[0],
    expiration_time: "14 December 2022",
    fee: feeArray[cardIndex - 1],
    handleConnection: handleConnection,
    lockTime: lockarrayFarm[cardIndex - 1],
    listType: listType,
  });
 

  const [mystakes, setMystakes] = useState([]);

  const getStakesIds = async () => {
    const address = coinbase;
    let staking_contract = await window.getContractNFT("NFTSTAKING");
    let stakenft = [];
    let myStakes = await staking_contract.methods
      .depositsOf(address)
      .call()
      .then((result) => {
        for (let i = 0; i < result.length; i++)
          stakenft.push(parseInt(result[i]));
        return stakenft;
      });

    return myStakes;
  };

  const myStakes = async () => {
    let myStakes = await getStakesIds();

    let stakes = myStakes.map((stake) => window.getNft(stake));

    stakes = await Promise.all(stakes);
    stakes.reverse();
    setMystakes(stakes);
  };

  const lockarrayFarmAvax = ["No Lock", 3, 30, 60, 90];
  const feearrayFarmAvax = [0.3, 0.3, 0.4, 0.8, 1.2];

  const constantArrayFarmAvax = [
    window.constant_staking_newavax5,
    window.constant_staking_newavax6,
    window.constant_staking_newavax7,
    window.constant_staking_newavax8,
    window.constant_staking_newavax9,
  ];

  const stakeArrayFarmAvax = [
    window.farming_newavax_1,
    window.farming_newavax_2,
    window.farming_newavax_3,
    window.farming_newavax_4,
    window.farming_newavax_5,
  ];

  const { LP_IDs_V2Avax, LP_IDs_V2BNB } = window;

  const LP_IDAVAX_Array = [
    LP_IDs_V2Avax.wavax[0],
    LP_IDs_V2Avax.wavax[1],
    LP_IDs_V2Avax.wavax[2],
    LP_IDs_V2Avax.wavax[3],
    LP_IDs_V2Avax.wavax[4],
  ];

  const FarmAvax = initFarmAvax({
    token: window.token_newavax,
    staking: stakeArrayFarmAvax[cardIndex - 1],
    constant: constantArrayFarmAvax[cardIndex - 1],
    finalApr: expiredPools ? expiredPools[cardIndex - 1]?.apy_percent : 0,
    liquidity: wbnb_address,
    lp_symbol: "USD",
    reward: "30,000",
    lock: lockarrayFarmAvax[cardIndex - 1],
    rebase_factor: rebase_factorsavax[0],
    expiration_time: "6 December 2022",
    fee: feearrayFarmAvax[cardIndex - 1],
    coinbase: coinbase,
    lockTime: lockarrayFarm[cardIndex - 1],
    listType: listType,
    chainId: chainId,
  });

  const aprarrayStakeAvaxActive = [30, 10];

  const feearrayStakeAvaxActive = [3.5, 1];

  const stakingarrayStakeAvaxActive = [
  window.constant_staking_new11,
  window.constant_staking_new10,
   
  ];

  const expirearrayStakeAvaxActive = [ "14 July 2023","05 August 2023"];

  const lockarrayStakeAvaxActive = [180, 30];

  const StakeAvaxActive = stakeAvax({
    finalApr:
      aprarrayStakeAvaxActive[cardIndex - 1] -
      feearrayStakeAvaxActive[cardIndex - 1],
    staking: stakingarrayStakeAvaxActive[ (cardIndex === 1 && expired === true) ? 1  : 0 ],
    apr: aprarrayStakeAvaxActive[cardIndex - 1],
    liquidity: avax_address,
    expiration_time: expirearrayStakeAvaxActive[cardIndex - 1],
    fee: feearrayStakeAvaxActive[cardIndex - 1],
    coinbase: coinbase,
    chainId: chainId,
    referrer: referrer,
    lockTime: lockarrayStakeAvaxActive[ expired === true ? cardIndex - 1 : cardIndex],
    listType: listType,
    handleSwitchNetwork: { handleSwitchNetwork },
  });

  const stakingarrayStakeAvax30 = [
    window.constant_staking_newavax2,
    window.constant_staking_newavax1,
  ];

  const StakeAvax30 = stakeAvax30({
    staking: stakingarrayStakeAvax30[cardIndex === 2 ? 0 : 1],
    apr: expiredPools
      ? expiredPools[cardIndex - 3]?.apy_percent
      : 0,
    liquidity: avax_address,
    expiration_time: "6 December 2022",
    fee: expiredPools ? expiredPools[cardIndex - 1]?.performancefee : 0,
    finalApr: expiredPools
      ? expiredPools[cardIndex - 1]?.apy_performancefee
      : 0,
    coinbase: coinbase,
    chainId: chainId,
    lockTime: expiredPools
      ? expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
        ? "No Lock"
        : expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
      : "No Lock",
    listType: listType,
    handleSwitchNetwork: { handleSwitchNetwork },
  });

  const feeUarrayStakeAvaxiDyp = [0.25, 0.25, 0, 0];

  
  const withdrawFeeiDyp = [0, 0];

  const vaultArray = [
    window.vault_weth,
    window.vault_wbtc,
    window.vault_usdc,
    window.vault_usdt,
    window.vault_dai,
  ];
  const tokenvaultArray = [
    window.token_weth,
    window.token_wbtc,
    window.vault_usdc,
    window.token_usdt,
    window.vault_dai,
  ];

  const LP_IDBNB_Array = [
    LP_IDs_V2BNB.wbnb[0],
    LP_IDs_V2BNB.wbnb[1],
    LP_IDs_V2BNB.wbnb[2],
    LP_IDs_V2BNB.wbnb[3],
    LP_IDs_V2BNB.wbnb[4],
  ];

  const vaultplatformArray = [10, 10, 15, 15, 15];
  const vaultdecimalsArray = [18, 8, 6, 6, 18];
  const vaultsymbolArray = ["WETH", "WBTC", "USDC", "USDT", "DAI"];

  const bscFarmArrayStake = [
    window.farming_newbsc_1,
    window.farming_newbsc_2,
    window.farming_newbsc_3,
    window.farming_newbsc_4,
    window.farming_newbsc_5,
  ];
  const bscFarmArrayConst = [
    window.constant_stakingnewbsc_new5,
    window.constant_stakingnewbsc_new6,
    window.constant_stakingnewbsc_new7,
    window.constant_stakingnewbsc_new8,
    window.constant_stakingnewbsc_new9,
  ];
  const bscFarmArrayFee = [0.3, 0.3, 0.4, 0.8, 1.2];
  const lockarrayFarmbsc = ["No Lock", 3, 30, 60, 90];

  const BscFarming = initBscFarming({
    token: window.token_newbsc,
    staking: bscFarmArrayStake[cardIndex - 1],
    chainId: chainId,
    constant: bscFarmArrayConst[cardIndex - 1],
    liquidity: wbsc_address,
    lp_symbol: "USD",
    reward: "30,000",
    lock: "3 Days",
    rebase_factor: rebase_factorsbsc[0],
    expiration_time: "19 November 2022",
    fee: bscFarmArrayFee[cardIndex - 1],
    handleConnection: handleConnection,
    lockTime: lockarrayFarmbsc[cardIndex],
    finalApr: expiredPools ? expiredPools[cardIndex - 1]?.apy_percent : 0,
    listType: listType,
    handleSwitchNetwork: { handleSwitchNetwork },
  });
 

  const handleDetails = () => {
    if (showDetails === false) {
      setShowDetails(true);
      onShowDetailsClick();
    } else if (showDetails === true) {
      setShowDetails(false);
    }
  };

  useEffect(() => {
    if (chain === "eth") {
      myStakes();
      setCoins(ethCoins);
    } else if (chain === "bnb") {
      setCoins(bscCoins);
    } else if (chain === "avax") {
      setCoins(avaxCoins);
    }
  }, [chain]);

  useEffect(() => {
    if (topList === "Staking") {
      if (cardIndex >= 2) {
        const newIndex = cardIndex - 2;
        setcardIndexiDyp(newIndex);
      }
    }

    if (topList === "Staking" && chain === "avax") {
      if (cardIndex >= 2) {
        const newIndex = cardIndex - 2;
        setcardIndexavax30(newIndex);
      }
    }

    if (topList === "Staking" && chain === "avax") {
      if (cardIndex >= 5) {
        const newIndex = cardIndex - 5;
        setcardIndexavaxiDyp(newIndex);
      }
    }
  }, [cardIndex, topList, chain]);

  
  return (
    <>
      <div
        className={`row w-100 flex-column gap-3 gap-lg-0 flex-lg-row align-items-center justify-content-between  mx-0 cursor-pointer ${
          expired === true ? "poolscardwrapperexpired" : "list-pool-card"
        }`}
        onClick={() => handleDetails()}
        style={{ display: display }}
      >
        <div className="col-12 col-lg-4 d-flex justify-content-between align-items-center">
          <div
            className={` d-flex align-items-center ${
              cardType === "Farming" || cardType === "Buyback" ? null : "gap-2"
            }`}
            style={{ width: "100px" }}
          >
            {cardType === "Farming" || cardType === "Buyback"
              ? coins.length > 0 &&
                coins
                  .slice(0, 5)
                  .map((coin, index) => (
                    <img
                      key={index}
                      src={require(`./assets/${coin}.svg`).default}
                      alt=""
                      className="pool-coins"
                    />
                  ))
              : tokenLogo !== undefined && (
                  <>
                    <img
                      src={require(`./assets/${tokenLogo}`).default}
                      width={32}
                      height={32}
                      alt=""
                    />
                    <h5
                      className="text-white"
                      style={{ fontSize: "25px", fontWeight: "600" }}
                    >
                      {tokenName}
                    </h5>
                  </>
                )}
          </div>
          <div className="d-flex align-items-baseline gap-2">
            <h5
              className="text-white"
              style={{
                fontSize: "26px",
                fontWeight: "600",
                lineHeight: "30px",
              }}
            >
              {apr}
            </h5>
            <p
              className="text-white"
              style={{
                fontSize: "18px",
                fontWeight: "600",
                lineHeight: "26px",
              }}
            >
              APR
            </p>
          </div>
        </div>
        <div className="d-flex col-12 col-lg-4 align-items-center justify-content-between">
          {cardType !== "Vault" && (
            <div className="d-flex flex-column gap-2">
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "#C0C9FF",
                }}
              >
                Total Value Locked
              </span>
              <h5
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  color: "#F7F7FC",
                }}
              >
                {tvl}
              </h5>
            </div>
          )}
          <div className="d-flex flex-column gap-2">
            <span
              style={{ fontSize: "12px", fontWeight: "400", color: "#C0C9FF" }}
            >
              Lock Time
            </span>
            <h5
              style={{ fontSize: "18px", fontWeight: "300", color: "#F7F7FC" }}
            >
              {lockTime}
            </h5>
          </div>
        </div>
        <div
          className="col-12 col-lg-4 d-flex justify-content-end gap-5"
          style={{ width: "170px" }}
        >
          {top_pick && <img src={topPick} alt="" />}
          {/* {isNewPool && <img src={newPool} alt="" />} */}

          <h6
            className="details-text gap-1 d-flex align-items-center cursor-pointer justify-content-end"
            style={{
              color: showDetails === false ? "#75CAC2" : "#C0C9FF",
              minWidth: "100px",
              maxWidth: "100px",
            }}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails === false ? "Deposit" : "Close"}
            <img
              src={showDetails === false ? greenArrow : orangeArrow}
              alt=""
            />
          </h6>
        </div>
      </div>
      {expired === false ? (
        <>
           { showDetails &&
                    topList === "Staking" &&
                    chain === "eth" && activePools &&
                    activePools[cardIndex-1].id ===
                      "0x50014432772b4123D04181727C6EdEAB34F5F988" ? (
                    <InitConstantStakingiDYP
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_result}
                      lp_id={lp_id[cardIndex]}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      staking={window.constant_staking_idyp_3}
                      listType={listType}
                      finalApr={activePools[cardIndex-1]?.apy_performancefee}
                      apr={ activePools[cardIndex-1]?.apy_percent
                          
                      }
                      liquidity={eth_address}
                      expiration_time={"15 August 2023"}
                      other_info={   activePools[cardIndex-1]?.expired === "Yes"
                              ? true
                              : false
                          
                      }
                      fee_s={  activePools[cardIndex-1]?.performancefee
                           
                      }
                      fee_u={withdrawFeeiDyp[cardIndex]}
                      lockTime={  activePools[cardIndex-1]?.lock_time?.split(
                                " "
                              )[0] === "No"
                              ? "No Lock"
                              : activePools[cardIndex-1]?.lock_time?.split(" ")[0]
                            
                      }
                    />
                  ) : showDetails &&
                    topList === "Staking" &&
                    chain === "eth" && activePools && 
                    activePools[cardIndex-1].id ===
                      "0xD4bE7a106ed193BEe39D6389a481ec76027B2660" ? (
                    <InitConstantStakingiDYP
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_result}
                      lp_id={lp_id[cardIndex]}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      staking={window.constant_staking_idyp_4}
                      listType={listType}
                      finalApr={activePools[cardIndex-1]?.apy_performancefee}
                      apr={  activePools[cardIndex-1]?.apy_percent
                          
                      }
                      liquidity={eth_address}
                      expiration_time={"15 August 2023"}
                      other_info={  activePools[cardIndex-1]?.expired === "Yes"
                              ? true
                              : false
                             
                      }
                      fee_s={ activePools[cardIndex-1]?.performancefee
                         
                      }
                      fee_u={withdrawFeeiDyp[cardIndex]}
                      lockTime={  activePools[cardIndex-1]?.lock_time?.split(
                                " "
                              )[0] === "No"
                              ? "No Lock"
                              : activePools[cardIndex-1]?.lock_time?.split(" ")[0]
                           
                      }
                    />
                  ) : showDetails && activePools &&
                    topList === "Staking" &&
                    activePools[cardIndex-1].id ===
                      "0xfc4493E85fD5424456f22135DB6864Dd4E4ED662" &&
                    chain === "bnb" ? (
                    <StakeBsc
                      lp_id={LP_IDBNB_Array[cardIndex]}
                      staking={window.constant_stakingbsc_new11}
                      apr={  activePools[cardIndex-1]?.apy_percent
                         
                      }
                      liquidity={wbsc_address}
                      expiration_time={"5 August 2023"}
                      finalApr={ activePools[cardIndex-1]?.apy_performancefee
                          
                      }
                      fee={  activePools[cardIndex-1]?.performancefee
                          
                      }
                      lockTime={  activePools[cardIndex-1]?.lock_time?.split(
                                " "
                              )[0] === "No"
                              ? "No Lock"
                              : parseInt(
                                  activePools[cardIndex-1]?.lock_time?.split(
                                    " "
                                  )[0]
                                )
                            
                      }
                      listType={listType}
                      other_info={  activePools[cardIndex-1]?.expired === "Yes"
                              ? true
                              : false
                           
                      }
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_resultbsc}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      referrer={referrer}
                    />
                  ) : showDetails && activePools &&
                    topList === "Staking" &&
                    chain === "eth" &&
                    activePools[cardIndex-1].id ===
                      "0xeb7dd6b50db34f7ff14898d0be57a99a9f158c4d" ? (
                    <StakeNewEth
                      staking={window.constant_staking_newi3}
                      apr={   activePools[cardIndex-1]?.apy_percent
                           
                      }
                      liquidity={eth_address}
                      expiration_time={"11 January 2024"}
                      finalApr={  activePools[cardIndex-1]?.apy_performancefee
                           
                      }
                      fee_s={0}
                      lockTime={  activePools[cardIndex-1]?.lock_time?.split(
                                " "
                              )[0] === "No"
                              ? "No Lock"
                              : activePools[cardIndex-1]?.lock_time?.split(" ")[0]
                            
                      }
                      lp_id={LP_IDBNB_Array[cardIndex]}
                      listType={listType}
                      other_info={  activePools[cardIndex-1]?.expired === "Yes"
                              ? true
                              : false
                           
                      }
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_result}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      referrer={referrer}
                      totalTvl={activePools[cardIndex-1].tvl_usd}
                    />
                  ) : showDetails && activePools &&
                    activePools[cardIndex-1].id ===
                      "0x4C04E53f9aAa17fc2C914694B4Aae57a9d1bE445" &&
                    topList === "Staking" &&
                    chain === "bnb" ? (
                    <StakeBscIDyp
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_resultbsc}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      staking={window.constant_stakingidyp_6}
                      listType={listType}
                      finalApr={ activePools[cardIndex-1]?.apy_performancefee
                           
                      }
                      apr={  activePools[cardIndex-1]?.apy_percent
                          
                      }
                      liquidity={wbsc_address}
                      expiration_time={"15 August 2023"}
                      other_info={  activePools[cardIndex-1]?.expired === "Yes"
                              ? true
                              : false
                            
                      }
                      fee_s={ activePools[cardIndex-1]?.performancefee
                         
                      }
                      fee_u={0}
                      lockTime={ activePools[cardIndex-1]?.lock_time?.split(
                                " "
                              )[0] === "No"
                              ? "No Lock"
                              : parseInt(
                                  activePools[cardIndex-1]?.lock_time?.split(
                                    " "
                                  )[0]
                                )
                            
                      }
                    />
                  ) : showDetails && activePools &&
                    activePools[cardIndex-1].id ===
                      "0x7e766F7005C7a9e74123b156697B582eeCB8d2D7" &&
                    topList === "Staking" &&
                    chain === "bnb" ? (
                    <StakeBscIDyp
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_resultbsc}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      staking={window.constant_stakingidyp_5}
                      listType={listType}
                      finalApr={ activePools[cardIndex-1]?.apy_performancefee
                           
                      }
                      apr={  activePools[cardIndex-1]?.apy_percent
                           
                      }
                      liquidity={wbsc_address}
                      expiration_time={"15 August 2023"}
                      other_info={  activePools[cardIndex-1]?.expired === "Yes"
                              ? true
                              : false
                           
                      }
                      fee_s={  activePools[cardIndex-1]?.performancefee
                          
                      }
                      fee_u={0}
                      lockTime={  activePools[cardIndex-1]?.lock_time?.split(
                                " "
                              )[0] === "No"
                              ? "No Lock"
                              : parseInt(
                                  activePools[cardIndex-1]?.lock_time?.split(
                                    " "
                                  )[0]
                                )
                            
                      }
                    />
                  ) : showDetails && activePools &&
                    topList === "Staking" &&
                    chain === "avax" &&
                    cardIndex === 1 ? (
                    <StakeAvaxActive
                      is_wallet_connected={isConnected}
                      handleConnection={handleConnection}
                      the_graph_result={the_graph_resultavax}
                      chainId={chainId}
                      coinbase={coinbase}
                      referrer={referrer}
                      expired={false}
                      handleSwitchNetwork={handleSwitchNetwork}
                    />
                  ) : showDetails && activePools &&
                    topList === "Staking" &&
                    chain === "avax" &&
                    activePools[cardIndex-1].id ===
                      "0xd13bdC0c9a9931cF959739631B1290b6BEE0c018" ? (
                    <StakeAvaxIDyp
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_resultavax}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      staking={window.constant_staking_idypavax_6}
                      listType={listType}
                      finalApr={  activePools[cardIndex-1]?.apy_performancefee
                           
                      }
                      apr={  activePools[cardIndex-1]?.apy_percent
                          
                      }
                      liquidity={avax_address}
                      expiration_time={"15 August 2023"}
                      other_info={  activePools[cardIndex-1]?.expired === "Yes"
                              ? true
                              : false
                             
                      }
                      fee_s={ activePools[cardIndex-1]?.performancefee
                         
                      }
                      fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                      lockTime={ activePools[cardIndex-1]?.lock_time?.split(
                                " "
                              )[0] === "No"
                              ? "No Lock"
                              : activePools[cardIndex-1]?.lock_time?.split(" ")[0]
                             
                      }
                    />
                  ) : showDetails && activePools &&
                    topList === "Staking" &&
                    chain === "avax" &&
                    activePools[cardIndex-1].id ===
                      "0xaF411BF994dA1435A3150B874395B86376C5f2d5" ? (
                    <StakeAvaxIDyp
                      is_wallet_connected={isConnected}
                      coinbase={coinbase}
                      the_graph_result={the_graph_resultavax}
                      chainId={chainId}
                      handleConnection={handleConnection}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      staking={window.constant_staking_idypavax_5}
                      listType={listType}
                      finalApr={  activePools[cardIndex-1]?.apy_performancefee
                           
                      }
                      apr={  activePools[cardIndex-1]?.apy_percent
                           
                      }
                      liquidity={avax_address}
                      expiration_time={"15 August 2023"}
                      other_info={  activePools[cardIndex-1]?.expired === "Yes"
                              ? true
                              : false
                             
                      }
                      fee_s={  activePools[cardIndex-1]?.performancefee
                          
                      }
                      fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                      lockTime={ activePools[cardIndex-1]?.lock_time?.split(
                                " "
                              )[0] === "No"
                              ? "No Lock"
                              : activePools[cardIndex-1]?.lock_time?.split(" ")[0]
                           
                      }
                    />
                  ) : showDetails && activePools &&  topList === "Vault" && chain === "eth" ? (
                    <Vault
                      vault={vaultArray[cardIndex]}
                      token={tokenvaultArray[cardIndex]}
                      platformTokenApyPercent={vaultplatformArray[cardIndex]}
                      UNDERLYING_DECIMALS={vaultdecimalsArray[cardIndex]}
                      UNDERLYING_SYMBOL={vaultsymbolArray[cardIndex]}
                      expiration_time={"04 March 2023"}
                      coinbase={coinbase}
                      lockTime={"No Lock"}
                      handleConnection={handleConnection}
                      chainId={chainId}
                      listType={listType}
                      handleSwitchNetwork={handleSwitchNetwork}
                      expired={false}
                      isConnected={isConnected}
                      the_graph_result={the_graph_result}
                    />
                  ) : showDetails &&
                  topList === "Staking" &&
                  cardIndex === 0 &&
                  chain === "eth" ? (
                    <CawsDetails
                      coinbase={coinbase}
                      isConnected={isConnected}
                      listType={listType}
                      chainId={chainId}
                      handleSwitchNetwork={handleSwitchNetwork}
                      handleConnection={handleConnection}
                      myStakes={mystakes}
                    />) :
                  
                  
                  
                  (
                    <></>
                  )}
         
        </>
      ) : (
        <>
        {showDetails && topList === "Farming" ? (
                chain === "eth" ? (
                  <StakingNew1
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_result}
                    lp_id={lp_id[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={true}
                  />
                ) : chain === "bnb" ? (
                  <BscFarming
                    is_wallet_connected={isConnected}
                    coinbase={coinbase}
                    the_graph_result={the_graph_resultbsc}
                    lp_id={LP_IDBNB_Array[cardIndex]}
                    chainId={chainId}
                    handleConnection={handleConnection}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={true}
                  />
                ) : (
                  <FarmAvax
                    is_wallet_connected={isConnected}
                    handleConnection={handleConnection}
                    the_graph_result={the_graph_resultavax}
                    lp_id={LP_IDAVAX_Array[cardIndex]}
                    chainId={chainId}
                    coinbase={coinbase}
                    handleSwitchNetwork={handleSwitchNetwork}
                    expired={true}
                  />
                )
              ) : showDetails &&
                topList === "Staking" && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0x8A30Be7B2780b503ff27dBeaCdecC4Fe2587Af5d" &&
                chain === "eth" ? (
                <StakeEth
                  staking={window.constant_staking_new2}
                  apr={ expiredPools[cardIndex-1]?.apy_percent
                  }
                  liquidity={eth_address}
                  expiration_time={"14 December 2022"}
                  finalApr={  expiredPools[cardIndex-1]?.apy_performancefee
                  }
                  lockTime={  expiredPools[cardIndex-1]?.lock_time?.split(
                            " "
                          )[0] === "No"
                        ? "No Lock"
                        : expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                      
                  }
                  listType={listType}
                  other_info={
                      expiredPools[cardIndex-1]?.expired === "Yes"
                        ? true
                        : false
                       
                  }
                  fee={
                     expiredPools[cardIndex-1]?.performancefee
                  }
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_result}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  referrer={referrer}
                />
              ) : showDetails &&
                topList === "Staking" && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0xa4da28B8e42680916b557459D338aF6e2D8d458f" &&
                chain === "eth" ? (
                <StakeEth
                  staking={window.constant_staking_new1}
                  apr={ expiredPools[cardIndex-1]?.apy_percent
                  }
                  liquidity={eth_address}
                  expiration_time={"14 December 2022"}
                  finalApr={ expiredPools[cardIndex-1]?.apy_performancefee
                  }
                  lockTime={  expiredPools[cardIndex-1]?.lock_time?.split(
                            " "
                          )[0] === "No"
                        ? "No Lock"
                        : expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                      
                  }
                  listType={listType}
                  other_info={  expiredPools[cardIndex-1]?.expired === "Yes"
                        ? true
                        : false
                      
                  }
                  fee={expiredPools[cardIndex-1]?.performancefee
                  }
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_result}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  referrer={referrer}
                />
              ) : showDetails && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0x44bEd8ea3296bda44870d0Da98575520De1735d4" &&
                topList === "Staking" &&
                chain === "eth" ? (
                <StakeEthDai
                  staking={window.constant_stakingdaieth}
                  apr={expiredPools[cardIndex-1]?.apy_percent}
                  liquidity={eth_address}
                  expiration_time={"Expired"}
                  finalApr={expiredPools[cardIndex-1]?.apy_performancefee}
                  fee={expiredPools[cardIndex-1]?.performancefee}
                  lockTime={ expiredPools[cardIndex-1]?.lock_time?.split(
                          " "
                        )[0] === "No"
                        ? "No Lock"
                        : expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                     
                  }
                  listType={listType}
                  other_info={true}
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_result}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  referrer={referrer}
                  lp_id={lp_id[cardIndex]}
                />
              ) : showDetails && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0x3fAb09ACAeDDAF579d7a72c24Ef3e9EB1D2975c4" &&
                topList === "Staking" &&
                chain === "eth" ? (
                <InitConstantStakingiDYP
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_result}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  staking={window.constant_staking_idyp_2}
                  listType={listType}
                  finalApr={ expiredPools[cardIndex-1]?.apy_performancefee
                  }
                  apr={ expiredPools[cardIndex-1]?.apy_percent
                  }
                  liquidity={eth_address}
                  expiration_time={"28 February 2023"}
                  other_info={ expiredPools[cardIndex-1]?.expired === "Yes"
                        ? true
                        : false
                     
                  }
                  fee_s={ expiredPools[cardIndex-1]?.performancefee
                  }
                  fee_u={withdrawFeeiDyp[cardIndex - 2]}
                  lockTime={  expiredPools[cardIndex-1]?.lock_time?.split(
                            " "
                          )[0] === "No"
                        ? "No Lock"
                        : expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                      
                  }
                />
              ) : showDetails && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0x9eA966B4023049BFF858BB5E698ECfF24EA54c4A" &&
                topList === "Staking" &&
                chain === "eth" ? (
                <InitConstantStakingiDYP
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_result}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  staking={window.constant_staking_idyp_1}
                  listType={listType}
                  finalApr={  expiredPools[cardIndex-1]?.apy_performancefee
                  }
                  apr={  expiredPools[cardIndex-1]?.apy_percent
                  }
                  liquidity={eth_address}
                  expiration_time={"28 February 2023"}
                  other_info={  expiredPools[cardIndex-1]?.expired === "Yes"
                        ? true
                        : false
                     
                  }
                  fee_s= {expiredPools[cardIndex-1]?.performancefee
                  }
                  fee_u={withdrawFeeiDyp[cardIndex - 2]}
                  lockTime={  expiredPools[cardIndex-1]?.lock_time?.split(
                            " "
                          )[0] === "No"
                        ? "No Lock"
                        : expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                       
                  }
                />
              ) : showDetails && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0xef9e50A19358CCC8816d9BC2c2355aea596efd06" &&
                topList === "Staking" &&
                chain === "bnb" ? (
                <StakeBsc
                  staking={window.constant_stakingbsc_new10}
                  apr={expiredPools[cardIndex-1]?.apy_percent}
                  liquidity={wbsc_address}
                  expiration_time={"14 July 2023"}
                  finalApr={expiredPools[cardIndex-1]?.apy_performancefee}
                  fee={expiredPools[cardIndex-1]?.performancefee}
                  lockTime={
                    expiredPools[cardIndex-1]?.lock_time?.split(" ")[0] ===
                    "No"
                      ? "No Lock"
                      : parseInt(
                          expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                        )
                  }
                  lp_id={LP_IDBNB_Array[cardIndex]}
                  listType={listType}
                  other_info={true}
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_resultbsc}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  referrer={referrer}
                />
              ) : showDetails && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0xaF411BF994dA1435A3150B874395B86376C5f2d5" &&
                topList === "Staking" &&
                chain === "bnb" ? (
                <StakeBsc2
                  staking={window.constant_stakingbsc_new13}
                  apr={expiredPools[cardIndex-1]?.apy_percent}
                  liquidity={wbsc_address}
                  expiration_time={"17 November 2022"}
                  finalApr={expiredPools[cardIndex-1]?.apy_performancefee}
                  fee={expiredPools[cardIndex-1]?.performancefee}
                  lockTime={
                    expiredPools[cardIndex-1]?.lock_time?.split(" ")[0] ===
                    "No"
                      ? "No Lock"
                      : parseInt(
                          expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                        )
                  }
                  lp_id={LP_IDBNB_Array[cardIndex]}
                  listType={listType}
                  other_info={true}
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_resultbsc}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  referrer={referrer}
                />
              ) : showDetails && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90" &&
                topList === "Staking" &&
                chain === "bnb" ? (
                <StakeBsc2
                  staking={window.constant_stakingbsc_new12}
                  apr={expiredPools[cardIndex-1]?.apy_percent}
                  liquidity={wbsc_address}
                  expiration_time={"17 November 2022"}
                  finalApr={expiredPools[cardIndex-1]?.apy_performancefee}
                  fee={expiredPools[cardIndex-1]?.performancefee}
                  lockTime={
                    expiredPools[cardIndex-1]?.lock_time?.split(" ")[0] ===
                    "No"
                      ? "No Lock"
                      : parseInt(
                          expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                        )
                  }
                  lp_id={LP_IDBNB_Array[cardIndex]}
                  listType={listType}
                  other_info={true}
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_resultbsc}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  referrer={referrer}
                />
              ) : showDetails && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0xa9efab22cCbfeAbB6dc4583d81421e76342faf8b" &&
                topList === "Staking" &&
                chain === "bnb" ? (
                <StakeBscDai
                  staking={window.constant_stakingdaibsc}
                  apr={expiredPools[cardIndex-1]?.apy_percent}
                  liquidity={wbsc_address}
                  expiration_time={"Expired"}
                  finalApr={expiredPools[cardIndex-1]?.apy_performancefee}
                  fee={expiredPools[cardIndex-1]?.performancefee}
                  lockTime={
                    expiredPools[cardIndex-1]?.lock_time?.split(" ")[0] ===
                    "No"
                      ? "No Lock"
                      : parseInt(
                          expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                        )
                  }
                  listType={listType}
                  other_info={true}
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_resultbsc}
                  lp_id={LP_IDBNB_Array[cardIndex]}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  referrer={referrer}
                />
              ) : showDetails && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0x160fF3c4A6E9Aa8E4271aa71226Cc811BFEf7ED9" &&
                topList === "Staking" &&
                chain === "bnb" ? (
                <StakeBscIDyp
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_resultbsc}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  staking={window.constant_stakingidyp_2}
                  listType={listType}
                  finalApr={  expiredPools[cardIndex-1]?.apy_performancefee
                  }
                  apr={ expiredPools[cardIndex-1]?.apy_percent
                  }
                  liquidity={wbsc_address}
                  expiration_time={"28 February 2023"}
                  other_info={  expiredPools[cardIndex-1]?.expired === "Yes"
                        ? true
                        : false
                       
                  }
                  fee_s={  expiredPools[cardIndex-1]?.performancefee
                  }
                  fee_u={0}
                  lockTime={ expiredPools[cardIndex-1]?.lock_time?.split(
                            " "
                          )[0] === "No"
                        ? "No Lock"
                        : parseInt(
                            expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                          )
                       
                  }
                />
              ) : showDetails && expiredPools &&
                expiredPools[cardIndex-1].id ===
                  "0x58366902082B90Fca01bE07D929478bD48AcFB19" &&
                topList === "Staking" &&
                chain === "bnb" ? (
                <StakeBscIDyp
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_resultbsc}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  staking={window.constant_stakingidyp_1}
                  listType={listType}
                  finalApr={  expiredPools[cardIndex-1]?.apy_performancefee
                  }
                  apr={ expiredPools[cardIndex-1]?.apy_percent
                  }
                  liquidity={wbsc_address}
                  expiration_time={"28 February 2023"}
                  other_info={ expiredPools[cardIndex-1]?.expired === "Yes"
                        ? true
                        : false
                     
                  }
                  fee_s={  expiredPools[cardIndex-1]?.performancefee
                  }
                  fee_u={0}
                  lockTime={ expiredPools[cardIndex-1]?.lock_time?.split(
                            " "
                          )[0] === "No"
                        ? "No Lock"
                        : parseInt(
                            expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                          )
                       
                  }
                />
              ) : showDetails && expiredPools &&
                topList === "Staking" &&
                chain === "avax" &&
                (cardIndex === 2 || cardIndex === 3) ? (
                <StakeAvax30
                  is_wallet_connected={isConnected}
                  handleConnection={handleConnection}
                  the_graph_result={the_graph_resultavax}
                  chainId={chainId}
                  coinbase={coinbase}
                  referrer={referrer}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                />
              ) : showDetails && expiredPools &&
                topList === "Staking" &&
                chain === "avax" &&
                cardIndex === 1 ? (
                <StakeAvaxActive
                  is_wallet_connected={isConnected}
                  handleConnection={handleConnection}
                  the_graph_result={the_graph_resultavax}
                  chainId={chainId}
                  coinbase={coinbase}
                  referrer={referrer}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                />
              ) : showDetails && expiredPools &&
                topList === "Staking" &&
                chain === "avax" &&
                expiredPools[cardIndex-1].id ===
                  "0x16429e51A64B7f88D4C018fbf66266A693df64b3" ? (
                <StakeAvaxDai
                  staking={window.constant_stakingdaiavax}
                  apr={ expiredPools[cardIndex-1]?.apy_percent
                  }
                  liquidity={avax_address}
                  expiration_time={"Expired"}
                  finalApr={  expiredPools[cardIndex-1]?.apy_performancefee
                  }
                  fee={0}
                  lockTime={
                    cardIndex !== undefined
                      ? expiredPools[cardIndex-1]?.lock_time?.split(" ")[0] ===
                        "No"
                        ? "No Lock"
                        : expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                      : "No Lock"
                  }
                  listType={listType}
                  other_info={true}
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_resultavax}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  referrer={referrer}
                />
              ) : showDetails && expiredPools &&
                topList === "Staking" &&
                chain === "avax" &&
                expiredPools[cardIndex-1].id ===
                  "0x5536E02336771CFa0317D4B6a042f3c38749535e" ? (
                <StakeAvaxIDyp
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_resultavax}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  staking={window.constant_staking_idypavax_2}
                  listType={listType}
                  finalApr={ expiredPools[cardIndex-1]?.apy_performancefee
                  }
                  apr={ expiredPools[cardIndex-1]?.apy_percent
                  }
                  liquidity={avax_address}
                  expiration_time={"28 February 2023"}
                  other_info={ expiredPools[cardIndex-1]?.expired === "Yes"
                        ? true
                        : false
                      
                  }
                  fee_s={  expiredPools[cardIndex-1]?.performancefee
                  }
                  fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                  lockTime={  expiredPools[cardIndex-1]?.lock_time?.split(
                            " "
                          )[0] === "No"
                        ? "No Lock"
                        : expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                      
                  }
                />
              ) : showDetails && expiredPools &&
                topList === "Staking" &&
                chain === "avax" &&
                expiredPools[cardIndex-1].id ===
                  "0x8f28110325a727f70B64bffEbf2B9dc94B932452" ? (
                <StakeAvaxIDyp
                  is_wallet_connected={isConnected}
                  coinbase={coinbase}
                  the_graph_result={the_graph_resultavax}
                  chainId={chainId}
                  handleConnection={handleConnection}
                  handleSwitchNetwork={handleSwitchNetwork}
                  expired={true}
                  staking={window.constant_staking_idypavax_1}
                  listType={listType}
                  finalApr={ expiredPools[cardIndex-1]?.apy_performancefee
                  }
                  apr={  expiredPools[cardIndex-1]?.apy_percent
                  }
                  liquidity={avax_address}
                  expiration_time={"28 February 2023"}
                  other_info={ expiredPools[cardIndex-1]?.expired === "Yes"
                        ? true
                        : false
                    
                  }
                  fee_s={ expiredPools[cardIndex-1]?.performancefee
                  }
                  fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
                  lockTime={ expiredPools[cardIndex-1]?.lock_time?.split(
                            " "
                          )[0] === "No"
                        ? "No Lock"
                        : expiredPools[cardIndex-1]?.lock_time?.split(" ")[0]
                      
                  }
                />
              ) : (
                <></>
              )}
          
        </>
      )}
    </>
  );
};

export default TopPoolsListCard;
