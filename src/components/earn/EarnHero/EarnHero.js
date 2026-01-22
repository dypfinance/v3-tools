import React, { useEffect, useState } from "react";
import getFormattedNumber from "../../../functions/get-formatted-number";
import axios from "axios";

const EarnHero = () => {
  const [totalpaid, setTotalPaid] = useState();
  const [totalTvl, setTotalTvl] = useState();

  const getTotalPaidData = async () => {
    await axios.get("https://api.dyp.finance/api/totalpaid").then((data) => {
      setTotalPaid(data.data);
    }).catch((err) => {
      console.log(err);
    });
  };
  var tempTvl = 0;
  const fetchTotalTvl = async () => {
    const avaxResult2 = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_avax_new`)
      .catch((err) => {
        console.log(err);
      });

    const avaxResult = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_avax`)
      .catch((err) => {
        console.log(err);
      });

    const bnbResult2 = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_bnb_new`)
      .catch((err) => {
        console.log(err);
      });

    const bnbResult = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_bnb`)
      .catch((err) => {
        console.log(err);
      });

    const ethRestult2 = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_eth_new`)
      .catch((err) => {
        console.log(err);
      });

    const ethRestult = await axios
      .get(`https://api.dyp.finance/api/get_staking_info_eth`)
      .catch((err) => {
        console.log(err);
      });

    const vaulttvl = await axios
      .get(`https://api.dyp.finance/api/get_vault_info`)
      .catch((err) => {
        console.log(err);
      });

    const bscFarming = await axios
      .get(`https://api.dyp.finance/api/the_graph_bsc_v2`)
      .catch((err) => console.error(err));

    if (
      avaxResult2 &&
      avaxResult2.status === 200 &&
      bnbResult2 &&
      bnbResult2.status === 200 &&
      bnbResult &&
      bnbResult.status === 200 &&
      ethRestult &&
      ethRestult.status === 200 &&
      ethRestult2 &&
      ethRestult2.status === 200 &&
      vaulttvl &&
      vaulttvl.status === 200 &&
      bscFarming &&
      bscFarming.status === 200
    ) {
      const ethv2Tvl = ethRestult2.data.stakingInfoDYPEth[0]?.tvl_usd;
      const ethv1Tvl = ethRestult.data.totalTVL_ETH;

      const bnbTvl2 = bnbResult2.data.stakingInfoDYPBnb[0].tvl_usd;
      const bnbTvl = bnbResult.data.totalTVL_BNB;

      const avaxtvl2 = avaxResult2.data.stakingInfoDYPAvax[0].tvl_usd;
      const avaxtvl = avaxResult.data.totalTVL_AVAX;

      const vaultTvl = vaulttvl.data.VaultTotalTVL[0].tvl;
      let bscFarmingTvl = Object.entries(
        bscFarming.data.the_graph_bsc_v2.lp_data
      );
      const finalitem = bscFarmingTvl.filter((item) => {
        return (
          item[1].id ===
          "0x1bc61d08a300892e784ed37b2d0e63c85d1d57fb-0x5bc3a80a1f2c4fb693d9dddcebbb5a1b5bb15d65"
        );
      });
      const tmp = finalitem[0];
      if (tmp) {
        tempTvl = tmp[1].tvl_usd;
      }

      setTotalTvl(
        ethv1Tvl +
          ethv2Tvl +
          bnbTvl2 +
          bnbTvl +
          avaxtvl2 +
          vaultTvl +
          tempTvl +
          avaxtvl
      );
    }
  };

  useEffect(() => {
    getTotalPaidData();
    fetchTotalTvl();
  }, []);

  return (
    <div className="row w-100 flex-column flex-lg-row earn-hero gap-4 gap-lg-0 p-3 p-lg-4 justify-content-between">
      <div className="col-12 col-lg-5 px-0 px-lg-2 d-flex flex-column justify-content-center gap-3">
        <h3 className="text-white" style={{ whiteSpace: "pre" }}>
          Dypius Earn
        </h3>
        <p className="text-white ">
          Make the most of your assets with Dypius Earn products. Dypius offers
          three ways to productively use your assets. Participate in Staking,
          Farming and Vault. Start earning today!
        </p>
      </div>
      <div className="col-12 col-lg-7 px-0 px-lg-2 d-flex gap-3 gap-lg-4 flex-column flex-lg-row">
        <div className="d-flex align-items-start gap-2 p-3 total-tvl-wrapper position-relative">
          <div className="purplediv" style={{ left: "1px", top: "10px" }}></div>
          <img src={'https://cdn.worldofdypians.com/tools/totalTvlIcon.svg'} alt="total-tvl" />
          <div
            className="d-flex flex-column gap-1 position-relative"
            style={{ top: "5px" }}
          >
            <span className="total-tvl-title">Total value locked</span>
            <h6 className="total-tvl-content">
              ${getFormattedNumber(totalTvl)}
            </h6>
          </div>
        </div>
        <div className="d-flex gap-0 gap-lg-4">
          <div className="d-flex flex-column align-items-start">
            <div className="d-flex flex-column paid-rewards">
              <p
                style={{ fontSize: "9px", color: "#f7f7fc", fontWeight: "300" }}
              >
                Rewards paid out
              </p>
              {/* <CountUp
                className="count-up"
                style={{
                  fontSize: "19px",
                  color: "#f7f7fc",
                  fontWeight: "600",
                  textAlign: "start",
                }}
                start={totalpaid?.totalPaidInUsd - 400.0}
                end={totalpaid?.totalPaidInUsd}
                duration={120}
                separator=","
                decimals={2}
                prefix="$"
              /> */}
              <h6
                className="count-up"
                style={{
                  fontSize: "19px",
                  color: "#f7f7fc",
                  fontWeight: "600",
                  textAlign: "start",
                }}
              >
                ${getFormattedNumber(totalpaid?.totalPaidInUsd, 2)}
              </h6>
            </div>
            <img
              src={'https://cdn.worldofdypians.com/tools/earnHeroStats.webp'}
              style={{ width: "230px", height: "80px" }}
              alt=""
            />
          </div>
          <div className="d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-start align-items-center gap-2">
              <img src={'https://cdn.worldofdypians.com/tools/ethereumIcon.svg'} alt="" />
              <h4 style={{ color: "#f7f7fc", fontWeight: "500" }}>
                {" "}
                {getFormattedNumber(totalpaid?.ethTotal.wethPaiOutTotals, 0)}
              </h4>
            </div>
            <div className="d-flex justify-content-start align-items-center gap-2">
              <img src={'https://cdn.worldofdypians.com/tools/bnbIcon.svg'} alt="" />
              <h4 style={{ color: "#f7f7fc", fontWeight: "500" }}>
                {getFormattedNumber(totalpaid?.bnbTotal.wbnbPaidOutTotals, 0)}
              </h4>
            </div>
            <div className="d-flex justify-content-start align-items-center gap-2">
              <img src={'https://cdn.worldofdypians.com/tools/avaxIcon.svg'} alt="" />
              <h4 style={{ color: "#f7f7fc", fontWeight: "500" }}>
                {getFormattedNumber(totalpaid?.avaxTotal.avaxPaidOutTotals, 0)}
              </h4>
            </div>
          </div>
        </div>
        <div className="position-relative d-none d-xxl-block">
          <img src={'https://cdn.worldofdypians.com/tools/coin.webp'} alt="" className="coin" />
          <img src={'https://cdn.worldofdypians.com/tools/coinBackground.webp'} alt="" className="coin" />
        </div>
      </div>
    </div>
  );
};

export default EarnHero;
