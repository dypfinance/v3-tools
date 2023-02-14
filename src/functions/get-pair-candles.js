import axios from "axios";

async function getPairCandles(pair) {
    
  let candles = await axios.get(
    window.ethereum ?
    window.ethereum.chainId === "0x1"
      ? `${window.config.apieth_baseurl}/api/candles/minutes/${pair}`
      : `${window.config.api_baseurl}/api/candles/minutes/${pair}`
      : `${window.config.apieth_baseurl}/api/candles/minutes/${pair}`
  );
  candles = candles.data;
  
  return processCandles(candles);
}

function processCandles(candles) {
  let result = candles.map((c) => {
    return {
      time: Math.floor(new Date(c.time).getTime() / 1e3),
      open: c.o_usdPerToken0,
      high: c.h_usdPerToken0,
      low: c.l_usdPerToken0,
      close: c.c_usdPerToken0,
      volume: c.v_usd,
      isVolumeBarRed: c.o_usdPerToken0 > c.c_usdPerToken0,
    };
  });
  return withSpaces(result.sort((a, b) => a.time - b.time));
}

function withSpaces(candles) {
  if (!candles.length) return candles;
  let result = [candles[0]];
  for (let i = 1; i < candles.length; i++) {
    let timediff = candles[i].time - candles[i - 1].time;
    console.log({ timediff });
    let spacesToAdd = Math.abs(Math.round(timediff / 60)) - 1;
    for (let j = 0; j < spacesToAdd; j++) {
      let whitespace = {
        time: candles[i - 1].time + (j + 1) * 60,
        // value: candles[i-1].close
        open: candles[i - 1].close,
        high: candles[i - 1].close,
        low: candles[i - 1].close,
        close: candles[i - 1].close,
        volume: 0,
        isVolumeBarRed: false,
      };
      result.push(whitespace);
      console.log("Pushed whitespace", whitespace);
    }
    result.push(candles[i]);
  }
  console.log({ result });
  return result;
}

export default getPairCandles;
