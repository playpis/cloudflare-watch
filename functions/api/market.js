export async function onRequest(context) {

  const cache = caches.default;
  const key = new Request("https://cache.market");
  let cached = await cache.match(key);
  if(cached) return cached;

  const result = {};

  try{
    const crypto = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,tether-gold"
    ).then(r=>r.json());

    crypto.forEach(c=>{
      if(c.id==="bitcoin"){
        result.btc = c.current_price;
        result.btc_change = c.price_change_percentage_24h;
        result.btc_high = c.high_24h;
        result.btc_low = c.low_24h;
      }
      if(c.id==="tether-gold"){
        result.xaut = c.current_price;
        result.xaut_change = c.price_change_percentage_24h;
        result.xaut_high = c.high_24h;
        result.xaut_low = c.low_24h;
      }
    });

  }catch{
    result.btc="--"; result.btc_change=0; result.btc_high="--"; result.btc_low="--";
    result.xaut="--"; result.xaut_change=0; result.xaut_high="--"; result.xaut_low="--";
  }

  const response = new Response(
    JSON.stringify(result),
    { headers:{
        "content-type":"application/json",
        "cache-control":"public,max-age=300"
      } }
  );

  await cache.put(key, response.clone());
  return response;
      }
