import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = "https://rest.coinapi.io/v1/assets";
  const res = await fetch(url, {
    headers: {
      "X-CoinAPI-Key": "15a42019-4385-4a32-993e-4cded7bec83f"
    }
  });

  const data = await res.json();

  // If CoinAPI returns an error, forward it to the frontend
  if (res.status !== 200) {
    console.error("CoinAPI error:", data);
    return new Response(JSON.stringify({ error: data.error || data.message || 'Unknown error from CoinAPI', status: res.status }), {
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
} 