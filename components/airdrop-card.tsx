"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  Star,
  Heart,
  TrendingUp,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AirdropCardProps {
  airdrop: {
    id: string;
    title: string;
    chain: string;
    reward: string;
    description: string;
    tags: string[];
    image_url: string;
    link: string;
    created_at: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    participants?: number;
    time_left: string;
    featured?: boolean;
  };
  className?: string;
}

export function AirdropCard({ airdrop, className }: AirdropCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <Card 
      className={cn(
        "group overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 min-h-[400px] flex flex-col relative",
        airdrop.featured && "ring-2 ring-primary/30 shadow-xl shadow-primary/20 bg-gradient-to-br from-primary/5 to-accent/5",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        {airdrop.image_url ? (
          <img 
            src={airdrop.image_url} 
            alt={airdrop.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-primary">{airdrop.chain}</p>
            </div>
          </div>
        )}
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {airdrop.featured && (
            <Badge className="bg-primary/90 text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          <Badge 
            variant="secondary" 
            className={cn("text-xs font-medium", difficultyColors[airdrop.difficulty])}
          >
            <Shield className="w-3 h-3 mr-1" />
            {airdrop.difficulty}
          </Badge>
        </div>
        
        {/* Heart button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 p-2 h-8 w-8 bg-white/90 hover:bg-white"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart 
            className={cn(
              "w-4 h-4 transition-colors",
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
            )} 
          />
        </Button>
      </div>

      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-1">
                {airdrop.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium">
                {airdrop.chain}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 px-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {airdrop.description}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <DollarSign className="w-4 h-4" />
              <div>
                <p className="text-xs text-muted-foreground">Reward</p>
                <p className="font-semibold text-sm">{airdrop.reward}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Users className="w-4 h-4" />
              <div>
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="font-semibold text-sm">{airdrop.participants?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/10">
            <Clock className="w-4 h-4" />
            <div>
              <p className="text-xs text-muted-foreground">Time Left</p>
              <p className="font-semibold text-sm text-accent">{airdrop.time_left}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {(Array.isArray(airdrop.tags) ? airdrop.tags : typeof airdrop.tags === 'string' ? airdrop.tags.split(',').map(t => t.trim()) : [])
              .slice(0, 3)
              .map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            {Array.isArray(airdrop.tags) && airdrop.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{airdrop.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 px-4 pb-4">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1 font-medium" size="default">
            <Link href={`/airdrop/${airdrop.id}`}>
              View Details
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="default"
            className="px-4"
            onClick={() => window.open(airdrop.link, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}