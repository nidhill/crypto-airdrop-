import { NextRequest } from "next/server";

// Mock cryptocurrency data as fallback
const mockCryptoData = [
  {
    asset_id: "BTC",
    name: "Bitcoin",
    type_is_crypto: 1,
    data_quote_start: "2010-07-17T23:09:17.0000000Z",
    data_quote_end: "2024-01-15T00:00:00.0000000Z",
    data_orderbook_start: "2014-02-24T17:43:05.0000000Z",
    data_orderbook_end: "2024-01-15T00:00:00.0000000Z",
    data_trade_start: "2010-07-17T23:09:17.0000000Z",
    data_trade_end: "2024-01-15T00:00:00.0000000Z",
    data_symbols_count: 63390,
    volume_1hrs_usd: 2847392847.32,
    volume_1day_usd: 68337428736.45,
    volume_1mth_usd: 2108234567890.12,
    price_usd: 42350.67
  },
  {
    asset_id: "ETH",
    name: "Ethereum",
    type_is_crypto: 1,
    data_quote_start: "2015-08-07T14:50:38.0000000Z",
    data_quote_end: "2024-01-15T00:00:00.0000000Z",
    data_orderbook_start: "2015-08-07T14:50:38.0000000Z",
    data_orderbook_end: "2024-01-15T00:00:00.0000000Z",
    data_trade_start: "2015-08-07T14:50:38.0000000Z",
    data_trade_end: "2024-01-15T00:00:00.0000000Z",
    data_symbols_count: 48291,
    volume_1hrs_usd: 1234567890.45,
    volume_1day_usd: 29876543210.87,
    volume_1mth_usd: 987654321098.76,
    price_usd: 2587.34
  },
  {
    asset_id: "USDT",
    name: "Tether",
    type_is_crypto: 1,
    data_quote_start: "2015-02-25T13:34:26.0000000Z",
    data_quote_end: "2024-01-15T00:00:00.0000000Z",
    data_orderbook_start: "2015-02-25T13:34:26.0000000Z",
    data_orderbook_end: "2024-01-15T00:00:00.0000000Z",
    data_trade_start: "2015-02-25T13:34:26.0000000Z",
    data_trade_end: "2024-01-15T00:00:00.0000000Z",
    data_symbols_count: 35672,
    volume_1hrs_usd: 3456789012.34,
    volume_1day_usd: 82963741852.96,
    volume_1mth_usd: 2567890123456.78,
    price_usd: 1.00
  },
  {
    asset_id: "BNB",
    name: "Binance Coin",
    type_is_crypto: 1,
    data_quote_start: "2017-07-25T04:30:05.0000000Z",
    data_quote_end: "2024-01-15T00:00:00.0000000Z",
    data_orderbook_start: "2017-07-25T04:30:05.0000000Z",
    data_orderbook_end: "2024-01-15T00:00:00.0000000Z",
    data_trade_start: "2017-07-25T04:30:05.0000000Z",
    data_trade_end: "2024-01-15T00:00:00.0000000Z",
    data_symbols_count: 12847,
    volume_1hrs_usd: 567890123.45,
    volume_1day_usd: 13629472583.69,
    volume_1mth_usd: 418765432109.87,
    price_usd: 315.42
  },
  {
    asset_id: "XRP",
    name: "XRP",
    type_is_crypto: 1,
    data_quote_start: "2013-08-04T18:38:32.0000000Z",
    data_quote_end: "2024-01-15T00:00:00.0000000Z",
    data_orderbook_start: "2013-08-04T18:38:32.0000000Z",
    data_orderbook_end: "2024-01-15T00:00:00.0000000Z",
    data_trade_start: "2013-08-04T18:38:32.0000000Z",
    data_trade_end: "2024-01-15T00:00:00.0000000Z",
    data_symbols_count: 9876,
    volume_1hrs_usd: 234567890.12,
    volume_1day_usd: 5629384756.28,
    volume_1mth_usd: 172847593021.45,
    price_usd: 0.52
  }
];

export async function GET(req: NextRequest) {
  const url = "https://rest.coinapi.io/v1/assets";
  
  try {
    const res = await fetch(url, {
      headers: {
        "X-CoinAPI-Key": "15a42019-4385-4a32-993e-4cded7bec83f"
      }
    });

    // Check if the API returned a quota exceeded error (403) before parsing JSON
    if (res.status === 403) {
      console.warn("CoinAPI quota exceeded, using fallback mock data");
      
      return new Response(JSON.stringify(mockCryptoData), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "X-Data-Source": "fallback" // Header to indicate this is fallback data
        }
      });
    }

    const data = await res.json();

    // If CoinAPI returns any other error, forward it to the frontend
    if (res.status !== 200) {
      return new Response(JSON.stringify({ error: data.error || data.message || 'Unknown error from CoinAPI', status: res.status }), {
        status: res.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Network error when fetching from CoinAPI:", error);
    
    // If there's a network error, also fall back to mock data
    console.warn("Network error occurred, using fallback mock data");
    
    return new Response(JSON.stringify(mockCryptoData), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "X-Data-Source": "fallback"
      }
    });
  }
}