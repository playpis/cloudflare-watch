export async function onRequest(context) {
  const cache = caches.default;
  const cacheKey = new Request("https://cache.market");

  // 先查缓存
  let cached = await cache.match(cacheKey);
  if (cached) return cached;

  const result = {
    btc: "--",
    btc_change: 0,
    btc_high: "--",
    btc_low: "--",
    xaut: "--",
    xaut_change: 0,
    xaut_high: "--",
    xaut_low: "--"
  };

  try {
    // BTC：Binance
    const btcRes = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT");
    const btc = await btcRes.json();
    result.btc = btc.lastPrice ?? "--";
    result.btc_change = parseFloat(btc.priceChangePercent) ?? 0;
    result.btc_high = btc.highPrice ?? "--";
    result.btc_low = btc.lowPrice ?? "--";

    // XAUT：OKX 公共行情
    const xautRes = await fetch("https://www.okx.com/api/v5/market/ticker?instId=XAUT-USD");
    const xaut = await xautRes.json();
    const x = xaut.data?.[0];
    result.xaut = x?.last ?? "--";
    result.xaut_change = parseFloat(x?.pctChg) ?? 0;
    result.xaut_high = x?.high24h ?? "--";
    result.xaut_low = x?.low24h ?? "--";

  } catch(e){
    console.log("Fetch failed:", e);
  }

  const response = new Response(JSON.stringify(result), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public,max-age=300" // 缓存 5 分钟
    }
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
      }
