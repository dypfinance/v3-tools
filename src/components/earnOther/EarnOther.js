import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import EarnOtherHero from "./EarnOtherHero/EarnOtherHero";
import EarnOtherContent from "./EarnOtherContent/EarnOtherContent";
import "./earnOther.css";
import axios from "axios";

const EarnOther = ({
  coinbase,
  the_graph_result,
  lp_id,
  isConnected,
  network,
  handleConnection,
  the_graph_resultavax,
  the_graph_resultbsc,
  referrer,
  handleSwitchNetwork,
  isPremium,
  type,
  onConnectWallet,
  aggregatorPools,
  userCurencyBalance,
}) => {
  const routeData = useLocation();
  const [poolClicked, setPoolClicked] = useState(false);
  const [poolClickedType, setPoolClickedType] = useState("");
  const [totalTvl, settotalTvl] = useState(0);
  const [wbnbPrice, setWbnbPrice] = useState(0);

  const { BigNumber } = window;

  const handleSliderClick = (obj) => {
    setPoolClicked(true);
    setPoolClickedType(obj);
  };

  const getBSCPrice = async () => {
    await axios
      .get("https://api.dyp.finance/api/the_graph_bsc_v2")
      .then((data) => {
        setWbnbPrice(data.data.the_graph_bsc_v2.usd_per_eth);
      });
  };

  const fetchTotalTvl = async () => {
    const staking = window.constant_staking_dypius_bscother1;
 
    const wbnbContract = new window.bscWeb3.eth.Contract(window.TOKEN_ABI, window.config.reward_token_wbnb_address)

    const tvl = await wbnbContract.methods.balanceOf(staking._address).call().catch((e)=>{ console.log(e); return 0});

    const tvlFormatted = new BigNumber(tvl).div(1e18).toFixed(4);

    const finalTvl = tvlFormatted * wbnbPrice;

    settotalTvl(finalTvl);
  };

  useEffect(() => {
    fetchTotalTvl();
  }, [wbnbPrice]);

  useEffect(() => {
    getBSCPrice();
  }, []);

  return (
    <div className="container-lg earn-wrapper d-flex flex-column justify-content-center align-items-center p-0 position-relative">
      <EarnOtherHero
        type={type}
        isPremium={isPremium}
        onSliderClick={handleSliderClick}
      />
      <EarnOtherContent
        aggregatorPools={aggregatorPools}
        coinbase={coinbase}
        type={type}
        poolClicked={poolClicked}
        poolClickedType={poolClickedType}
        the_graph_result={the_graph_result}
        lp_id={lp_id}
        isConnected={isConnected}
        chainId={network}
        networkId={network}
        handleConnection={handleConnection}
        the_graph_resultavax={the_graph_resultavax}
        the_graph_resultbsc={the_graph_resultbsc}
        referrer={referrer}
        routeOption={routeData.state ? routeData.state.option : "Staking"}
        routeChain={routeData.state ? routeData.state.chain : ""}
        pool={routeData.state ? routeData.state.pool : null}
        customChain={routeData.state ? routeData.state.customChain : "eth"}
        faqIndex={routeData.state ? routeData.state.faqIndex : -1}
        handleSwitchNetwork={handleSwitchNetwork}
        onConnectWallet={onConnectWallet}
        userCurencyBalance={userCurencyBalance}
        onCloseCard={() => {
          setPoolClicked(false);
          setPoolClickedType("");
        }}
        totalTvl={totalTvl}
        isPremium={isPremium}
      />
    </div>
  );
};

export default EarnOther;
