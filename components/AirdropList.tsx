"use client"

import { useState, useEffect } from 'react';
import { supabase, type Airdrop } from '@/lib/supabaseClient';
import { AirdropCard } from '@/components/airdrop-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface AirdropListProps {
  limit?: number;
  featured?: boolean;
  className?: string;
}

export function AirdropList({ limit, featured, className }: AirdropListProps) {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAirdrops = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('airdrops')
        .select('*')
        .order('created_at', { ascending: false });

      if (featured) {
        query = query.eq('featured', true);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setAirdrops(data || []);
    } catch (err) {
      console.error('Error fetching airdrops:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch airdrops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirdrops();
  }, [limit, featured]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading airdrops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Airdrops</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchAirdrops} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (airdrops.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🪂</div>
            <h3 className="text-lg font-semibold mb-2">No Airdrops Found</h3>
            <p className="text-muted-foreground">
              {featured ? 'No featured airdrops available at the moment.' : 'No airdrops available at the moment.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {airdrops.map((airdrop) => (
        <AirdropCard key={airdrop.id} airdrop={airdrop} />
      ))}
    </div>
  );
}