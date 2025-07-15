"use client"

import { useState, useEffect } from 'react';
import { supabase, type Airdrop } from '@/lib/supabaseClient';
import { getAirdrops } from '@/lib/supabase-queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  SortAsc, 
  Grid3X3, 
  List,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

import { AirdropCard } from '@/components/airdrop-card';
import { Loader2, AlertCircle } from 'lucide-react';

const chains = ['All', 'Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'StarkNet', 'Scroll'];
const categories = ['All', 'DeFi', 'Layer 2', 'NFT', 'Gaming', 'Bridge', 'Governance'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

export default function AirdropsPage() {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchAirdrops();
  }, []);

  const fetchAirdrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAirdrops();
      setAirdrops(data);
    } catch (err) {
      console.error('Error fetching airdrops:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch airdrops');
    } finally {
      setLoading(false);
    }
  };

  const filteredAirdrops = airdrops.filter(airdrop => {
    const matchesSearch = airdrop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         airdrop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChain = selectedChain === 'All' || airdrop.chain === selectedChain;
    const matchesCategory = selectedCategory === 'All' || airdrop.tags.includes(selectedCategory);
    const matchesDifficulty = selectedDifficulty === 'All' || airdrop.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesChain && matchesCategory && matchesDifficulty;
  });

  const sortedAirdrops = [...filteredAirdrops].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.participants || 0) - (a.participants || 0);
      case 'reward':
        return (b.reward || '').localeCompare(a.reward || '');
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Loading Airdrops</h3>
              <p className="text-muted-foreground">Fetching the latest opportunities...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Failed to Load Airdrops</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchAirdrops}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Discover Airdrops
          </h1>
          <p className="text-xl text-muted-foreground">
            Find and claim the latest crypto airdrops and testnet opportunities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Active Airdrops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {airdrops.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Currently available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Ending Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {airdrops.filter(a => a.time_left && parseInt(a.time_left.split(' ')[0]) <= 30).length}
              </div>
              <p className="text-sm text-muted-foreground">
                Within 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Total Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                $10M+
              </div>
              <p className="text-sm text-muted-foreground">
                Potential value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search airdrops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            {/* Chain Filter */}
            <div className="flex flex-wrap gap-2">
              {chains.map((chain) => (
                <Badge
                  key={chain}
                  variant={selectedChain === chain ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedChain(chain)}
                >
                  {chain}
                </Badge>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <Badge
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty}
                </Badge>
              ))}
            </div>
          </div>

          {/* View Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {sortedAirdrops.length} of {airdrops.length} airdrops
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-background border border-border rounded px-2 py-1"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="reward">Highest Reward</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Airdrops Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {sortedAirdrops.map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>

        {/* Empty State */}
        {sortedAirdrops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No airdrops found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedChain('All');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}