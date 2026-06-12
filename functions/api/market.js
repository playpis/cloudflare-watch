export async function onRequest(context) {

  const cache = caches.default;
  const cacheKey = new Request("https://cache.market");
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
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd&include_24hr_high_low=true&include_24hr_change=true"
    );
    const data = await res.json();

    result.btc = data.bitcoin?.usd ?? "--";
    result.btc_change = data.bitcoin?.usd_24h_change ?? 0;
    result.btc_high = data.bitcoin?.usd_24h_high ?? "--";
    result.btc_low = data.bitcoin?.usd_24h_low ?? "--";

    result.xaut = data["tether-gold"]?.usd ?? "--";
    result.xaut_change = data["tether-gold"]?.usd_24h_change ?? 0;
    result.xaut_high = data["tether-gold"]?.usd_24h_high ?? "--";
    result.xaut_low = data["tether-gold"]?.usd_24h_low ?? "--";

  } catch(e){
    console.log("CoinGecko fetch failed:", e);
  }

  const response = new Response(JSON.stringify(result), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public,max-age=300"
    }
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
}
