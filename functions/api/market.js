export async function onRequest() {

  try {

    const r = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );

    const text = await r.text();

    return Response.json({
      success: true,
      status: r.status,
      data: text
    });

  } catch(e) {

    return Response.json({
      success: false,
      error: String(e)
    });

  }

}
