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
  Heart
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
        "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 min-h-[300px] flex flex-col", // Reduced min-h for smaller card
        airdrop.featured && "ring-2 ring-primary/20 shadow-lg shadow-primary/10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2 pt-3 px-4"> {/* Reduce padding */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {airdrop.title}
              </h3>
              {airdrop.featured && (
                <Star className="w-4 h-4 text-accent fill-accent" />
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {airdrop.chain}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("text-xs", difficultyColors[airdrop.difficulty])}
              >
                {airdrop.difficulty}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-8 w-8"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-2 px-4 flex-1 flex flex-col justify-between"> {/* Reduce padding */}
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium text-foreground">{airdrop.reward}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{airdrop.participants.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {airdrop.description}
          </p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{airdrop.time_left}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {(Array.isArray(airdrop.tags) ? airdrop.tags : typeof airdrop.tags === 'string' ? airdrop.tags.split(',').map(t => t.trim()) : [])
              .slice(0, 3)
              .map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            {Array.isArray(airdrop.tags) && airdrop.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{airdrop.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 px-4 pb-3"> {/* Reduce padding */}
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1" size="sm">
            <Link href={`/airdrop/${airdrop.id}`}>
              View Details
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="px-3"
            onClick={() => window.open(airdrop.link, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}