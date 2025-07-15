"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  ExternalLink, 
  TrendingUp, 
  Clock,
  Eye,
  MessageSquare,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  link: string;
  image_url: string;
  source_id: string;
  source_name: string;
  pubDate: string;
  category: string[];
}

const categories = ['All', 'Crypto', 'DeFi', 'NFT', 'Blockchain', 'Trading'];

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCryptoNews();
  }, []);

  const fetchCryptoNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        'https://newsdata.io/api/1/news?apikey=pub_5f92dd7c268f413bb2be02ff2d509989&q=crypto&language=en&category=business,technology'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      setNewsData(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = newsData.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           (article.category && article.category.some(cat => 
                             cat.toLowerCase().includes(selectedCategory.toLowerCase())
                           ));
    
    return matchesSearch && matchesCategory;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
      default:
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Loading Latest News</h3>
              <p className="text-muted-foreground">Fetching the latest crypto updates...</p>
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
              <h3 className="text-xl font-semibold mb-2">Failed to Load News</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchCryptoNews}>
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
            Latest News
          </h1>
          <p className="text-xl text-muted-foreground">
            Stay updated with the latest crypto and testnet developments
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-background border border-border rounded px-2 py-1"
              >
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Article */}
        {sortedNews.length > 0 && (
          <Card className="mb-8 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={sortedNews[0].image_url || 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={sortedNews[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{sortedNews[0].source_name}</Badge>
                  <Badge variant="outline">Crypto</Badge>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 hover:text-primary transition-colors">
                  <a href={sortedNews[0].link} target="_blank" rel="noopener noreferrer">
                    {sortedNews[0].title}
                  </a>
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {sortedNews[0].description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(sortedNews[0].pubDate)}</span>
                    </div>
                    <span>Source: {sortedNews[0].source_name}</span>
                  </div>
                  <Button asChild>
                    <a href={sortedNews[0].link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read More
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNews.slice(1).map((article) => (
            <Card key={article.article_id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.image_url || 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{article.source_name}</Badge>
                  <Badge variant="outline" className="text-xs">Crypto</Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{formatTimeAgo(article.pubDate)}</span>
                  <span>{article.source_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(article.pubDate)}
                  </span>
                  <Button size="sm" variant="outline" asChild>
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Read
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-2xl font-bold mb-2">No news found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}