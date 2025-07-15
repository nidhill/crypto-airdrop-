"use client"

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AirdropCard } from '@/components/airdrop-card';
import { AirdropList } from '@/components/AirdropList';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  TrendingUp, 
  Gift, 
  Users, 
  Star,
  CheckCircle,
  Rocket
} from 'lucide-react';

// Mock data for featured airdrops
const featuredAirdrops = [
  {
    id: '1',
    title: 'LayerZero Protocol',
    chain: 'Ethereum',
    reward: '$500 - $2000',
    description: 'Interact with LayerZero bridges and protocols to qualify for potential airdrop.',
    tags: ['DeFi', 'Bridge', 'Layer 2'],
    imageUrl: '/placeholder.jpg',
    link: 'https://layerzero.network',
    createdAt: '2024-01-15',
    difficulty: 'Medium' as const,
    participants: 156000,
    timeLeft: '45 days left',
    featured: true
  },
  {
    id: '2',
    title: 'Starknet Ecosystem',
    chain: 'StarkNet',
    reward: '$200 - $1000',
    description: 'Use StarkNet dApps and bridges to become eligible for future airdrops.',
    tags: ['Layer 2', 'ZK-Rollup', 'DeFi'],
    imageUrl: '/placeholder.jpg',
    link: 'https://starknet.io',
    createdAt: '2024-01-14',
    difficulty: 'Easy' as const,
    participants: 234000,
    timeLeft: '30 days left',
    featured: true
  },
  {
    id: '3',
    title: 'Polygon zkEVM',
    chain: 'Polygon',
    reward: '$100 - $500',
    description: 'Bridge assets and interact with zkEVM protocols for potential rewards.',
    tags: ['zkEVM', 'Bridge', 'Polygon'],
    imageUrl: '/placeholder.jpg',
    link: 'https://polygon.technology',
    createdAt: '2024-01-13',
    difficulty: 'Hard' as const,
    participants: 89000,
    timeLeft: '60 days left',
    featured: true
  }
];

const benefits = [
  {
    icon: Shield,
    title: 'Verified Airdrops',
    description: 'All airdrops are carefully vetted and verified by our team to ensure legitimacy.'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Get instant notifications about new airdrops and important deadline changes.'
  },
  {
    icon: TrendingUp,
    title: 'Higher Success Rate',
    description: 'Our detailed guides and strategies help you maximize your airdrop success.'
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join thousands of users sharing tips and strategies in our active community.'
  }
];

const stats = [
  { label: 'Total Airdrops', value: '500+' },
  { label: 'Active Users', value: '25K+' },
  { label: 'Total Claimed', value: '$2M+' },
  { label: 'Success Rate', value: '94%' }
];

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Trusted by 25,000+ crypto enthusiasts</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Claim smarter.{' '}
              <span className="text-gradient">Earn faster.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the latest crypto airdrops and testnet opportunities. 
              Join thousands of users claiming rewards daily with our verified platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/airdrops">
                  Explore Drops
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/community">
                  Join Community
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Airdrops */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Airdrops
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on these high-potential airdrops currently active
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <AirdropList limit={3} featured={true} />
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/airdrops">
                View All Airdrops
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Claimex?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make airdrop hunting easier, safer, and more profitable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="text-center group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Claiming?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who are already earning from crypto airdrops
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/airdrops">
                  Start Claiming Now
                  <Rocket className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}