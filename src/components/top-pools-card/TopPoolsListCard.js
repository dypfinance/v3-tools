import React, { useEffect, useState } from "react";  
import "./top-pools.css";
  
import InitConstantStakingiDYP from "../FARMINNG/constant-staking-idyp-new-front";
import StakeAvaxIDyp from "../FARMINNG/stakeAvaxiDyp";
import StakeBscIDyp from "../FARMINNG/bscConstantStakeiDyp"; 
import StakeBsc from "../FARMINNG/bscConstantStake";
import StakeBsc2 from "../FARMINNG/bscConstantStake2";   
import Vault from "../FARMINNG/vault-new"; 

const TopPoolsListCard = ({
  tokenLogo,
  cardId,
  tokenName,
  apr,
  lockTime,
  tvl,
  onShowDetailsClick,
  theBnbPool,
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
  totalNftsLocked,
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

  const cawswodcoins = ["cawslogo", "lanft-poolicon"];
  const feeArray = [0.3, 0.3, 0.4, 0.8, 1.2];

  const lockarrayFarm = ["No Lock", 3, 30, 60, 90];

 
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
    window.token_usdc,
    window.token_usdt,
    window.token_dai,
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

  const vaultArrayNew = [
    window.vault_wethnew,
    window.vault_wbtcnew,
    window.vault_usdcnew,
    window.vault_usdtnew,
    window.vault_dainew,
  ];
  const tokenvaultArrayNew = [
    window.token_weth,
    window.token_wbtc,
    window.token_usdc,
    window.token_usdt,
    window.token_dai,
  ];
  const vaultplatformArrayNew = [4.2, 4.1, 4.6, 4.1, 4.8];
  const vaultdecimalsArrayNew = [18, 8, 6, 6, 18];
  const vaultsymbolArrayNew = ["WETH", "WBTC", "USDC", "USDT", "DAI"];

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

 
  const handleDetails = () => {
    if (showDetails === false && topList === "Farming" && chain === "bnb") {
      setShowDetails(true);
    } else if (
      showDetails === false &&
      topList === "Vault" &&
      chain === "eth"
    ) {
      setShowDetails(true);
    } else if (
      showDetails === true &&
      topList === "Farming" &&
      chain === "bnb"
    ) {
      setShowDetails(false);
    } else if (showDetails === true && topList === "Vault" && chain === "eth") {
      setShowDetails(false);
    }
    onShowDetailsClick();
    // else if (showDetails === true) {
    //   setShowDetails(false);
    // }
  };

  useEffect(() => {
    if (chain === "eth") {
      // myStakes();
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
            // style={{ width: "100px" }}
          >
            {(cardType === "Farming" || cardType === "Buyback") && tokenLogo !=="bsc.svg"  ? (
              coins.length > 0 &&
              coins.slice(0, 5).map((coin, index) => (
                <>
                  <img
                    key={index}
                    src={`https://cdn.worldofdypians.com/tools/${coin}.svg`}
                    alt=""
                    className="pool-coins"
                  />
                  <h5
                    className="text-white mx-3"
                    style={{
                      fontSize: "25px",
                      fontWeight: "600",
                      whiteSpace: "pre",
                    }}
                  >
                    {tokenName}
                  </h5>
                </>
              ))
            ) : tokenLogo !== undefined && tokenLogo !== "landcaws" ? (
              <>
                <img
                  src={`https://cdn.worldofdypians.com/tools/${tokenLogo}`}
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
            ) : (
              <>
                {coins.length > 0 &&
                  cawswodcoins.map((coin, index) => (
                    <img
                      key={index}
                      src={`https://cdn.worldofdypians.com/tools/${coin}.png`}
                      alt=""
                      className="pool-coins"
                    />
                  ))}
                <h5
                  className="text-white"
                  style={{ fontSize: "20px", fontWeight: "600" }}
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
          {top_pick && <img src={'https://cdn.worldofdypians.com/tools/toppick.svg'} alt="" />}
         

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
              src={showDetails === false ? 'https://cdn.worldofdypians.com/tools/greenarrow.svg' : 'https://cdn.worldofdypians.com/tools/orangearrow.svg'}
              alt=""
            />
          </h6>
        </div>
      </div>
      {expired === false ? (
        <>
          {
            //     showDetails &&
            //     topList === "Staking" &&
            //     chain === "eth" &&
            //     activePools &&
            //     activePools[cardIndex - 1].id ===
            //       "0x41b8a58f4307ea722ad0a964966caa18a6011d93" ? (
            //       <InitConstantStakingiDYP
            //         is_wallet_connected={isConnected}
            //         coinbase={coinbase}
            //         the_graph_result={the_graph_result}
            //         chainId={chainId}
            //         handleConnection={handleConnection}
            //         handleSwitchNetwork={handleSwitchNetwork}
            //         expired={false}
            //         staking={window.constant_staking_idyp_5}
            //         listType={listType}
            //         finalApr={activePools[cardIndex - 1]?.apy_performancefee}
            //         apr={activePools[cardIndex - 1]?.apy_percent}
            //         liquidity={eth_address}
            //         expiration_time={"18 July 2024"}
            //         other_info={
            //           activePools[cardIndex - 1]?.expired === "Yes" ? true : false
            //         }
            //         fee_s={activePools[cardIndex - 1]?.performancefee}
            //         fee_u={withdrawFeeiDyp[cardIndex]}
            //         lockTime={
            //           activePools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
            //             ? "No Lock"
            //             : activePools[cardIndex - 1]?.lock_time?.split(" ")[0]
            //         }
            //       />
            //     ) : showDetails &&
            //       activePools &&
            //       activePools[cardIndex - 1]?.id ===
            //         "0xC9075092Cc46E176B1F3c0D0EB8223F1e46555B0" &&
            //       topList === "Staking" &&
            //       chain === "eth" ? (
            //       <StakeDypiusEth
            //         staking={window.constant_staking_dypius_eth1}
            //         apr={activePools[cardIndex - 1]?.apy_percent}
            //         liquidity={eth_address}
            //         expiration_time={"09 November 2024"}
            //         finalApr={activePools[cardIndex - 1]?.apy_performancefee}
            //         lockTime={
            //           activePools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
            //             ? "No Lock"
            //             : activePools[cardIndex - 1]?.lock_time?.split(" ")[0]
            //         }
            //         listType={listType}
            //         other_info={false}
            //         fee={activePools[cardIndex - 1]?.performancefee}
            //         is_wallet_connected={isConnected}
            //         coinbase={coinbase}
            //         the_graph_result={the_graph_result}
            //         chainId={chainId}
            //         handleConnection={handleConnection}
            //         handleSwitchNetwork={handleSwitchNetwork}
            //         expired={false}
            //         referrer={referrer}
            //       />
            //     )  : showDetails &&
            //     activePools &&
            //     activePools[cardIndex - 1]?.id ===
            //       "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
            //     topList === "Staking" &&
            //     chain === "bnb" ? (
            //     <StakeDypiusBsc
            //       staking={window.constant_staking_dypius_bsc1}
            //       apr={activePools[cardIndex - 1]?.apy_percent}
            //       liquidity={wbsc_address}
            //       expiration_time={"09 November 2024"}
            //       finalApr={activePools[cardIndex - 1]?.apy_performancefee}
            //       lockTime={
            //         activePools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
            //           ? "No Lock"
            //           : activePools[cardIndex - 1]?.lock_time?.split(" ")[0]
            //       }
            //       listType={listType}
            //       other_info={false}
            //       fee={activePools[cardIndex - 1]?.performancefee}
            //       is_wallet_connected={isConnected}
            //       coinbase={coinbase}
            //       the_graph_result={the_graph_resultbsc}
            //       chainId={chainId}
            //       handleConnection={handleConnection}
            //       handleSwitchNetwork={handleSwitchNetwork}
            //       expired={false}
            //       referrer={referrer}
            //     />
            //   )  : showDetails &&
            //   activePools &&
            //   activePools[cardIndex - 1]?.id ===
            //     "0x8cee06119fffecdd560ee83b26cccfe8e2fe6603" &&
            //   topList === "Staking" &&
            //   chain === "avax" ? (
            //   <StakeDypiusAvax
            //     staking={window.constant_staking_dypius_bsc1}
            //     apr={activePools[cardIndex - 1]?.apy_percent}
            //     liquidity={avax_address}
            //     expiration_time={"09 November 2024"}
            //     finalApr={activePools[cardIndex - 1]?.apy_performancefee}
            //     lockTime={
            //       activePools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
            //         ? "No Lock"
            //         : activePools[cardIndex - 1]?.lock_time?.split(" ")[0]
            //     }
            //     listType={listType}
            //     other_info={false}
            //     fee_s={activePools[cardIndex - 1]?.performancefee}
            //     is_wallet_connected={isConnected}
            //     coinbase={coinbase}
            //     the_graph_result={the_graph_resultavax}
            //     chainId={chainId}
            //     handleConnection={handleConnection}
            //     handleSwitchNetwork={handleSwitchNetwork}
            //     expired={false}
            //     referrer={referrer}
            //   />
            // ) :

             showDetails &&
              topList === "Farming" &&
              chain === "avax" ? //   liquidity={wbnb_address} //   handleSwitchNetwork={handleSwitchNetwork} //   expired={false} //   handleConnection={handleConnection} //   chainId={chainId} //   lp_id={LP_IDAVAX_Array[cardIndex]} //   the_graph_result={the_graph_resultavax} //   coinbase={coinbase} //   is_wallet_connected={isConnected} //   <FarmAvaxFunc
            //   constant={window.farming_activeavax_1}
            //             staking={window.constant_staking_newavaxactive1}
            //   token={window.token_newavax}
            //   lp_symbol={"USD"}
            //   lock="3 Days"
            //   rebase_factor={1}
            //   expiration_time="7 June 2024"
            //   fee="0.4"
            //   finalApr={'3'}
            //   lockTime={3}
            //   listType={listType}
            // />
            null : //     "0x525cb0f6b5dae73965046bcb4c6f45ce74fb1b5d" && //   activePools[cardIndex - 1].id === //   activePools && // : showDetails &&
            //   topList === "Staking" &&
            //   chain === "bnb" ? (
            //   <StakeBscIDyp
            //     is_wallet_connected={isConnected}
            //     coinbase={coinbase}
            //     the_graph_result={the_graph_resultbsc}
            //     chainId={chainId}
            //     handleConnection={handleConnection}
            //     handleSwitchNetwork={handleSwitchNetwork}
            //     expired={false}
            //     staking={window.constant_stakingidyp_7}
            //     listType={listType}
            //     finalApr={activePools[cardIndex - 1]?.apy_performancefee}
            //     apr={activePools[cardIndex - 1]?.apy_percent}
            //     liquidity={wbsc_address}
            //     expiration_time={"18 July 2024"}
            //     other_info={
            //       activePools[cardIndex - 1]?.expired === "Yes" ? true : false
            //     }
            //     fee_s={activePools[cardIndex - 1]?.performancefee}
            //     fee_u={0}
            //     lockTime={
            //       activePools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
            //         ? "No Lock"
            //         : parseInt(
            //             activePools[cardIndex - 1]?.lock_time?.split(" ")[0]
            //           )
            //     }
            //   />
            // ) : showDetails &&
            //   activePools &&
            //   topList === "Staking" &&
            //   chain === "avax" &&
            //   activePools[cardIndex - 1]?.id ===
            //     "0xe026fb242d9523dc8e8d8833f7309dbdbed59d3d" ? (
            //   <StakeAvaxIDyp
            //     is_wallet_connected={isConnected}
            //     coinbase={coinbase}
            //     the_graph_result={the_graph_resultavax}
            //     chainId={chainId}
            //     handleConnection={handleConnection}
            //     handleSwitchNetwork={handleSwitchNetwork}
            //     expired={false}
            //     staking={window.constant_staking_idypavax_7}
            //     listType={listType}
            //     finalApr={activePools[cardIndex - 1]?.apy_performancefee}
            //     apr={activePools[cardIndex - 1]?.apy_percent}
            //     liquidity={avax_address}
            //     expiration_time={"18 July 2024"}
            //     other_info={false}
            //     fee_s={activePools[cardIndex - 1]?.performancefee}
            //     fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
            //     lockTime={
            //       activePools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
            //         ? "No Lock"
            //         : activePools[cardIndex - 1]?.lock_time?.split(" ")[0]
            //     }
            //   />
            // )
            showDetails && topList === "Vault" && chain === "eth" ? (
              <Vault
                vault={vaultArrayNew[cardIndex - 1]}
                token={tokenvaultArrayNew[cardIndex - 1]}
                platformTokenApyPercent={vaultplatformArrayNew[cardIndex - 1]}
                UNDERLYING_DECIMALS={vaultdecimalsArrayNew[cardIndex - 1]}
                UNDERLYING_SYMBOL={vaultsymbolArrayNew[cardIndex - 1]}
                expiration_time={"1 August 2024"}
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
            ) : (
              <></>
            )
          }
        </>
      ) : (
        <>
          {showDetails && topList === "Farming" ? (
             (
              <></>
            )
          ) : showDetails && topList === "Vault" && chain === "eth" ? (
            <Vault
              vault={vaultArray[cardIndex - 1]}
              token={tokenvaultArray[cardIndex - 1]}
              platformTokenApyPercent={vaultplatformArray[cardIndex - 1]}
              UNDERLYING_DECIMALS={vaultdecimalsArray[cardIndex - 1]}
              UNDERLYING_SYMBOL={vaultsymbolArray[cardIndex - 1]}
              expiration_time={"04 March 2023"}
              coinbase={coinbase}
              lockTime={"No Lock"}
              handleConnection={handleConnection}
              chainId={chainId}
              listType={listType}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={true}
              isConnected={isConnected}
              the_graph_result={the_graph_result}
            />
          )   : //     : showDetails &&
          //     topList === "Staking" &&
          //     cardIndex === 0 &&
          //     chain === "eth" ? (
          //     <CawsWodDetails
          //       coinbase={coinbase}
          //       isConnected={isConnected}
          //       apr={apr.slice(0, apr.length - 1)}
          //       totalNftsLocked={totalNftsLocked}
          //       listType={listType}
          //       chainId={chainId}
          //       handleSwitchNetwork={handleSwitchNetwork}
          //       handleConnection={handleConnection}
          //       myStakes={mystakes}
          //       expired={expired}
          //     />
          //   ): showDetails &&
          //   topList === "Staking" &&
          //   cardIndex === 1 &&
          //   chain === "eth" ? (
          //   <LandDetails
          //     coinbase={coinbase}
          //     isConnected={isConnected}
          //     apr={apr.slice(0, apr.length - 1)}
          //     totalNftsLocked={totalNftsLocked}
          //     listType={listType}
          //     chainId={chainId}
          //     handleSwitchNetwork={handleSwitchNetwork}
          //     handleConnection={handleConnection}
          //     myStakes={mystakes}
          //     expired={expired}
          //   />
          // )  : showDetails &&
          //       topList === "Staking" &&
          //       cardIndex === 2 &&
          //       chain === "eth" ? (
          //       <CawsDetails
          //         coinbase={coinbase}
          //         isConnected={isConnected}
          //         listType={listType}
          //         chainId={chainId}
          //         handleSwitchNetwork={handleSwitchNetwork}
          //         handleConnection={handleConnection}
          //         expired={expired}
          //         myStakes={mystakes}
          //       />
          //     )

            showDetails &&
            expiredPools &&
            topList === "Staking" &&
            expiredPools[cardIndex - 1].id ===
              "0x7c82513b69c1b42c23760cfc34234558119a3399" &&
            chain === "bnb" ? (
            <StakeBsc
              lp_id={LP_IDBNB_Array[cardIndex]}
              staking={window.constant_stakingbsc_new111}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={wbsc_address}
              expiration_time={"14 March 2024"}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              fee={expiredPools[cardIndex - 1]?.performancefee}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
                    )
              }
              listType={listType}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_resultbsc}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={true}
              referrer={referrer}
            />
          ) : showDetails &&
            expiredPools &&
            topList === "Staking" &&
            expiredPools[cardIndex - 1].id ===
              "0xc03cd383bbbd78e54b8a0dc2ee4342e6d027a487" &&
            chain === "bnb" ? (
            <StakeBsc
              lp_id={LP_IDBNB_Array[cardIndex]}
              staking={window.constant_stakingbsc_new14}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={wbsc_address}
              expiration_time={"5 August 2023"}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              fee={expiredPools[cardIndex - 1]?.performancefee}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
                    )
              }
              listType={listType}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_resultbsc}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={true}
              referrer={referrer}
            />
          ) : showDetails &&
            topList === "Staking" &&
            chain === "eth" &&
            expiredPools &&
            expiredPools[cardIndex - 1].id ===
              "0x50014432772b4123D04181727C6EdEAB34F5F988" ? (
            <InitConstantStakingiDYP
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_result}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={true}
              staking={window.constant_staking_idyp_3}
              listType={listType}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={eth_address}
              expiration_time={"15 August 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={withdrawFeeiDyp[cardIndex]}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
              }
            />
          ) : showDetails &&
            topList === "Staking" &&
            chain === "eth" &&
            expiredPools &&
            expiredPools[cardIndex - 1].id ===
              "0xD4bE7a106ed193BEe39D6389a481ec76027B2660" ? (
            <InitConstantStakingiDYP
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_result}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={true}
              staking={window.constant_staking_idyp_4}
              listType={listType}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={eth_address}
              expiration_time={"15 August 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={withdrawFeeiDyp[cardIndex]}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
              }
            />
          )  : showDetails &&
            expiredPools &&
            expiredPools[cardIndex] &&
            expiredPools[cardIndex - 1].id ===
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
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={eth_address}
              expiration_time={"28 February 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={withdrawFeeiDyp[cardIndex - 2]}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
              }
            />
          ) : showDetails &&
            expiredPools &&
            expiredPools[cardIndex - 1]?.id ===
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
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={eth_address}
              expiration_time={"28 February 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={withdrawFeeiDyp[cardIndex - 2]}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
              }
            />
          ) : showDetails &&
            expiredPools &&
            topList === "Staking" &&
            expiredPools[cardIndex - 1].id ===
              "0xfc4493E85fD5424456f22135DB6864Dd4E4ED662" &&
            chain === "bnb" ? (
            <StakeBsc
              lp_id={LP_IDBNB_Array[cardIndex]}
              staking={window.constant_stakingbsc_new11}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={wbsc_address}
              expiration_time={"5 August 2023"}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              fee={expiredPools[cardIndex - 1]?.performancefee}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
                    )
              }
              listType={listType}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_resultbsc}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={true}
              referrer={referrer}
            />
          ) : showDetails &&
            expiredPools &&
            expiredPools[cardIndex - 1].id ===
              "0xef9e50A19358CCC8816d9BC2c2355aea596efd06" &&
            topList === "Staking" &&
            expiredPools[cardIndex] &&
            chain === "bnb" ? (
            <StakeBsc
              staking={window.constant_stakingbsc_new10}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={wbsc_address}
              expiration_time={"14 July 2023"}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              fee={expiredPools[cardIndex - 1]?.performancefee}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
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
          ) : showDetails &&
            expiredPools &&
            expiredPools[cardIndex - 1].id ===
              "0xaF411BF994dA1435A3150B874395B86376C5f2d5" &&
            topList === "Staking" &&
            expiredPools[cardIndex] &&
            chain === "bnb" ? (
            <StakeBsc2
              staking={window.constant_stakingbsc_new13}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={wbsc_address}
              expiration_time={"17 November 2022"}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              fee={expiredPools[cardIndex - 1]?.performancefee}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
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
          ) : showDetails &&
            expiredPools &&
            expiredPools[cardIndex] &&
            expiredPools[cardIndex - 1].id ===
              "0xf13aDbEb27ea9d9469D95e925e56a1CF79c06E90" &&
            topList === "Staking" &&
            chain === "bnb" ? (
            <StakeBsc2
              staking={window.constant_stakingbsc_new12}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={wbsc_address}
              expiration_time={"17 November 2022"}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              fee={expiredPools[cardIndex - 1]?.performancefee}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
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
          )  : showDetails &&
            expiredPools &&
            expiredPools[cardIndex - 1].id ===
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
              expired={true}
              staking={window.constant_stakingidyp_5}
              listType={listType}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={wbsc_address}
              expiration_time={"15 August 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={0}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
                    )
              }
            />
          ) : showDetails &&
            expiredPools &&
            expiredPools[cardIndex - 1].id ===
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
              expired={true}
              staking={window.constant_stakingidyp_6}
              listType={listType}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={wbsc_address}
              expiration_time={"15 August 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={0}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
                    )
              }
            />
          ) : showDetails &&
            expiredPools &&
            expiredPools[cardIndex - 1].id ===
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
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={wbsc_address}
              expiration_time={"28 February 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={0}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
                    )
              }
            />
          ) : showDetails &&
            expiredPools &&
            expiredPools[cardIndex - 1].id ===
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
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={wbsc_address}
              expiration_time={"28 February 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={0}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : parseInt(
                      expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
                    )
              }
            />
          ) : showDetails &&
            expiredPools &&
            topList === "Staking" &&
            chain === "avax" &&
            expiredPools[cardIndex - 1].id ===
              "0xd13bdC0c9a9931cF959739631B1290b6BEE0c018" ? (
            <StakeAvaxIDyp
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_resultavax}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={true}
              staking={window.constant_staking_idypavax_6}
              listType={listType}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={avax_address}
              expiration_time={"15 August 2023"}
              other_info={false}
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
              }
            />
          ) : showDetails &&
            expiredPools &&
            topList === "Staking" &&
            chain === "avax" &&
            expiredPools[cardIndex - 1].id ===
              "0xaF411BF994dA1435A3150B874395B86376C5f2d5" ? (
            <StakeAvaxIDyp
              is_wallet_connected={isConnected}
              coinbase={coinbase}
              the_graph_result={the_graph_resultavax}
              chainId={chainId}
              handleConnection={handleConnection}
              handleSwitchNetwork={handleSwitchNetwork}
              expired={true}
              staking={window.constant_staking_idypavax_5}
              listType={listType}
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={avax_address}
              expiration_time={"15 August 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
              }
            />
          )  : showDetails &&
            expiredPools &&
            topList === "Staking" &&
            expiredPools[cardIndex] &&
            chain === "avax" &&
            expiredPools[cardIndex - 1].id ===
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
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={avax_address}
              expiration_time={"28 February 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
              }
            />
          ) : showDetails &&
            expiredPools &&
            topList === "Staking" &&
            chain === "avax" &&
            expiredPools[cardIndex - 1].id ===
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
              finalApr={expiredPools[cardIndex - 1]?.apy_performancefee}
              apr={expiredPools[cardIndex - 1]?.apy_percent}
              liquidity={avax_address}
              expiration_time={"28 February 2023"}
              other_info={
                expiredPools[cardIndex - 1]?.expired === "Yes" ? true : false
              }
              fee_s={expiredPools[cardIndex - 1]?.performancefee}
              fee_u={feeUarrayStakeAvaxiDyp[cardIndexavaxiDyp - 3]}
              lockTime={
                expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0] === "No"
                  ? "No Lock"
                  : expiredPools[cardIndex - 1]?.lock_time?.split(" ")[0]
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