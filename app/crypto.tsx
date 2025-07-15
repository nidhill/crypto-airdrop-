"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export default function CryptoLivePage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
        );
        if (!res.ok) throw new Error("Failed to fetch crypto data");
        const data = await res.json();
        setCoins(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch crypto data");
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Live Crypto Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search coin by name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 max-w-xs"
            />
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-2 text-left">#</th>
                      <th className="py-2 px-2 text-left">Coin</th>
                      <th className="py-2 px-2 text-right">Price</th>
                      <th className="py-2 px-2 text-right">24h Change</th>
                      <th className="py-2 px-2 text-right">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoins.map((coin, idx) => (
                      <tr key={coin.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2">{idx + 1}</td>
                        <td className="py-2 px-2 flex items-center gap-2">
                          <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                          <span className="font-medium">{coin.name}</span>
                          <span className="uppercase text-xs text-muted-foreground">{coin.symbol}</span>
                        </td>
                        <td className="py-2 px-2 text-right font-mono">${coin.current_price.toLocaleString()}</td>
                        <td className={`py-2 px-2 text-right font-mono ${coin.price_change_percentage_24h > 0 ? "text-green-600" : "text-red-500"}`}>
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </td>
                        <td className="py-2 px-2 text-right font-mono">${coin.market_cap.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCoins.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No coins found.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 