"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, X } from "lucide-react";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  volume_1day_usd?: number;
}

export default function CryptoLivePage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'market_cap'>('market_cap');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/crypto");
        if (!res.ok) throw new Error("Failed to fetch crypto data");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setCoins(
          data
            .filter((coin: any) => coin.price_usd && coin.type_is_crypto)
            .slice(0, 50)
            .map((coin: any) => ({
              id: coin.asset_id,
              symbol: coin.asset_id,
              name: coin.name,
              image: `https://assets.coincap.io/assets/icons/${coin.asset_id.toLowerCase()}@2x.png`,
              current_price: coin.price_usd,
              market_cap: coin.market_cap_usd || 0,
              price_change_percentage_24h: coin.change_24h || 0,
              volume_1day_usd: coin.volume_1day_usd || 0,
            }))
        );
      } catch (err: any) {
        setError(err.message || "Failed to fetch crypto data");
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
    interval = setInterval(fetchCoins, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCoins = useMemo(() => {
    return [...filteredCoins].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.current_price - a.current_price;
        case 'change':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'market_cap':
        default:
          return b.market_cap - a.market_cap;
      }
    });
  }, [filteredCoins, sortBy]);

  // Generate mock historical data for chart
  const generateChartData = (coin: Coin) => {
    const data = [];
    const basePrice = coin.current_price;
    for (let i = 30; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + variation * (i / 30));
      data.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        price: price,
        volume: coin.volume_1day_usd * (0.8 + Math.random() * 0.4)
      });
    }
    return data;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Chart of Top 10 Coins */}
        {!loading && !error && coins.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top 10 Cryptocurrencies Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={coins.slice(0, 10)}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" height={60} interval={0} />
                    <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`}/>
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`}/>
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="current_price" 
                      name="Price (USD)" 
                      stroke="#6366f1" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Cryptocurrency Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search coin by name or symbol..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <div className="flex gap-2">
                <Button variant={sortBy === 'market_cap' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('market_cap')}>
                  Market Cap
                </Button>
                <Button variant={sortBy === 'price' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('price')}>
                  Price
                </Button>
                <Button variant={sortBy === 'change' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('change')}>
                  24h Change
                </Button>
              </div>
            </div>
            
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
                      <th className="py-2 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCoins.map((coin, idx) => (
                      <tr key={coin.id} className="border-b hover:bg-muted/50 transition-colors cursor-pointer">
                        <td className="py-2 px-2">{idx + 1}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                            <div>
                              <div className="font-medium">{coin.name}</div>
                              <div className="uppercase text-xs text-muted-foreground">{coin.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <div className="font-mono font-semibold">${coin.current_price.toLocaleString()}</div>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <div className={`flex items-center justify-end gap-1 ${coin.price_change_percentage_24h > 0 ? "text-green-600" : "text-red-500"}`}>
                            {coin.price_change_percentage_24h > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="font-mono font-semibold">{coin.price_change_percentage_24h.toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <div className="font-mono">${coin.market_cap.toLocaleString()}</div>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedCoin(coin)}>
                                <BarChart3 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                  {coin.name} ({coin.symbol.toUpperCase()}) - Detailed Chart
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Price Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-muted-foreground">Current Price</span>
                                      </div>
                                      <div className="text-2xl font-bold">${coin.current_price.toLocaleString()}</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        {coin.price_change_percentage_24h > 0 ? 
                                          <TrendingUp className="w-4 h-4 text-green-500" /> : 
                                          <TrendingDown className="w-4 h-4 text-red-500" />
                                        }
                                        <span className="text-sm text-muted-foreground">24h Change</span>
                                      </div>
                                      <div className={`text-2xl font-bold ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {coin.price_change_percentage_24h.toFixed(2)}%
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <BarChart3 className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-muted-foreground">Market Cap</span>
                                      </div>
                                      <div className="text-2xl font-bold">${coin.market_cap.toLocaleString()}</div>
                                    </CardContent>
                                  </Card>
                                </div>
                                
                                {/* Price Chart */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle>30-Day Price History</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="w-full h-80">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={generateChartData(coin)}>
                                          <defs>
                                            <linearGradient id={`color-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                          </defs>
                                          <XAxis dataKey="date" />
                                          <YAxis tickFormatter={(v) => `$${v.toFixed(2)}`} />
                                          <Tooltip 
                                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                                            labelFormatter={(label) => `Date: ${label}`}
                                          />
                                          <Area 
                                            type="monotone" 
                                            dataKey="price" 
                                            stroke="#6366f1" 
                                            strokeWidth={2}
                                            fillOpacity={1} 
                                            fill={`url(#color-${coin.id})`} 
                                          />
                                        </AreaChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sortedCoins.length === 0 && (
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