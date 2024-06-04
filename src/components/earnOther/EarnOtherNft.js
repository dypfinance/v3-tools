import React, { useEffect, useState } from "react";
import EarnOtherHero from "./EarnOtherHero/EarnOtherHero";
import EarnOtherContentNft from "./EarnOtherContent/EarnOtherContentNft";
import axios from "axios";

const EarnOtherNft = ({
  coinbase,
  isConnected,
  network,
  handleConnection,
  handleSwitchNetwork,
  isPremium,
  type,
}) => {
  const [poolClicked, setPoolClicked] = useState(false);
  const [poolClickedType, setPoolClickedType] = useState("");
  const [totalTvl, settotalTvl] = useState("");

  const getTotalTvl = async () => {
    const eth_result2 = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_eth`)
      .catch((err) => {
        console.log(err);
      });

    if (eth_result2 && eth_result2.status === 200) {
      const result = eth_result2.data.stakingInfoCAWS.find((obj) => {
        return obj.id === "0x097bB1679AC734E90907Ff4173bA966c694428Fc";
      });
      const result2 = eth_result2.data.stakingInfoCAWS.find((obj) => {
        return obj.id !== "0x097bB1679AC734E90907Ff4173bA966c694428Fc";
      });
      const resultLand = eth_result2.data.stakingInfoLAND.find((obj) => {
        return obj.id === "0x6821710B0D6E9e10ACfd8433aD023f874ed782F1";
      });
      const resultCawsLand = eth_result2.data.stakinginfoCAWSLAND.find(
        (obj) => {
          return obj.id === "0xD324A03BF17Eee8D34A8843D094a76FF8f561e38";
        }
      );

      if (result) {
        settotalTvl(
          Number(result.tvl_usd) +
            Number(result2.tvl_usd) +
            Number(resultLand.tvl_usd) +
            Number(resultCawsLand.tvl_usd)
        );
      }
    }
  };

  useEffect(() => {
    getTotalTvl();
  }, []);

  const handleSliderClick = (obj) => {
    setPoolClicked(true);
    setPoolClickedType(obj);
  };

  return (
    <div className="container-lg earn-wrapper d-flex flex-column justify-content-center align-items-center p-0 position-relative">
      <EarnOtherHero
        type={type}
        isPremium={isPremium}
        onSliderClick={handleSliderClick}
      />
      <EarnOtherContentNft
        coinbase={coinbase}
        type={type}
        poolClicked={poolClicked}
        poolClickedType={poolClickedType}
        isConnected={isConnected}
        chainId={network}
        networkId={network}
        handleConnection={handleConnection}
        handleSwitchNetwork={handleSwitchNetwork}
        isPremium={isPremium}
        onCloseCard={() => {
          setPoolClicked(false);
          setPoolClickedType("");
        }}
        totalTvl={totalTvl}
      />
    </div>
  );
};

export default EarnOtherNft;
