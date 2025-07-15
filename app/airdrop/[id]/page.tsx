"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAirdropById, trackAirdropClick, getAirdrops } from '@/lib/supabase-queries';
import { type Airdrop } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  CheckCircle,
  ArrowLeft,
  Share2,
  Heart,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Rocket,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export async function generateStaticParams() {
  const airdrops = await getAirdrops();
  return airdrops.map((airdrop) => ({ id: airdrop.id }));
}

export default function AirdropDetailPage() {
  const params = useParams();
  const [airdropData, setAirdropData] = useState<Airdrop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchAirdropDetails(params.id as string);
    }
  }, [params.id]);

  const fetchAirdropDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAirdropById(id);
      setAirdropData(data);
    } catch (err) {
      console.error('Error fetching airdrop details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch airdrop details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAirdrop = async () => {
    if (airdropData) {
      // Track the click
      try {
        await trackAirdropClick(airdropData.id);
      } catch (err) {
        console.error('Error tracking click:', err);
      }
      
      // Open the airdrop link
      window.open(airdropData.link, '_blank');
    }
  };

  const toggleStepCompletion = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  // Mock data for steps and other details (in production, this would come from the database)
  const mockSteps = [
    {
      id: 1,
      title: 'Set up your wallet',
      description: 'Install MetaMask or another compatible wallet and fund it with the required tokens',
      completed: false
    },
    {
      id: 2,
      title: 'Complete required tasks',
      description: 'Follow the official guide to complete all required tasks for eligibility',
      completed: false
    },
    {
      id: 3,
      title: 'Maintain activity',
      description: 'Continue using the protocol regularly to maximize your chances',
      completed: false
    }
  ];

  const mockRequirements = [
    'Hold minimum required tokens in your wallet',
    'Complete all specified tasks',
    'Maintain consistent activity',
    'Follow official social media accounts'
  ];

  const mockWarnings = [
    'This is a speculative airdrop - not guaranteed',
    'Gas fees may apply for transactions',
    'Only use official websites and contracts'
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Loading Airdrop Details</h3>
              <p className="text-muted-foreground">Please wait...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !airdropData) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Airdrop Not Found</h3>
              <p className="text-muted-foreground mb-4">
                {error || 'The requested airdrop could not be found.'}
              </p>
              <Button asChild>
                <Link href="/airdrops">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Airdrops
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/airdrops">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Airdrops
            </Link>
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold">{airdropData.title}</h1>
                      {airdropData.featured && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{airdropData.chain}</Badge>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", difficultyColors[airdropData.difficulty])}
                      >
                        {airdropData.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart 
                        className={cn(
                          "w-4 h-4",
                          isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                        )} 
                      />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {airdropData.fullDescription}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {airdropData.reward || 'TBA'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Reward Range
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1">
                      {airdropData.participants?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Participants
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {airdropData.time_left || 'TBA'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time Left
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500 mb-1">
                      {Math.round((completedSteps.length / mockSteps.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Progress
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {airdropData.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockRequirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Step-by-Step Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Step-by-Step Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={cn(
                        "p-4 rounded-lg border transition-colors",
                        completedSteps.includes(step.id) 
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                          : "bg-muted/50 border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleStepCompletion(step.id)}
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5",
                            completedSteps.includes(step.id)
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-border"
                          )}
                        >
                          {completedSteps.includes(step.id) && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">
                            {index + 1}. {step.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Warnings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="w-5 h-5" />
                  Important Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockWarnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm">{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full text-lg py-6" 
                  size="lg"
                  onClick={handleJoinAirdrop}
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Join Airdrop
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleJoinAirdrop}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Official Site
                </Button>
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Documentation
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share with Friends
                </Button>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Steps</span>
                    <span className="text-sm font-medium">
                      {completedSteps.length} / {mockSteps.length}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(completedSteps.length / mockSteps.length) * 100}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Keep going! Complete all steps to maximize your chances.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Official Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <Link href="#" target="_blank">
                    <span className="mr-2">🐦</span>
                    Twitter
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <Link href="#" target="_blank">
                    <span className="mr-2">💬</span>
                    Discord
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <Link href="#" target="_blank">
                    <span className="mr-2">📱</span>
                    Telegram
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}