import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mlsokdxukpwyhuorsjcb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sc29rZHh1a3B3eWh1b3JzamNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzUzODIsImV4cCI6MjA2NzY1MTM4Mn0.j2ZVhH6bFoYM_KD8CbdpWRcwKiAxJwYCagf7JY9rVGQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for better TypeScript support
export interface Airdrop {
  id: string;
  title: string;
  chain: string;
  reward: string;
  description: string;
  link: string;
  tags: string[];
  image_url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  participants: number;
  time_left: string;
  featured: boolean;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  url: string;
  image_url: string;
  category: string;
  created_at: string;
  views: number;
  comments: number;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  author: string;
  author_avatar: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  replies: number;
  created_at: string;
  pinned: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  total_votes: number;
  created_at: string;
  ends_at: string;
}