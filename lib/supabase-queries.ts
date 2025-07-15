import { supabase, type Airdrop, type CommunityPost, type NewsArticle, type Poll } from './supabaseClient';

// Airdrop queries
export const getAirdrops = async (options?: {
  limit?: number;
  featured?: boolean;
  chain?: string;
  difficulty?: string;
}) => {
  let query = supabase
    .from('airdrops')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.featured) {
    query = query.eq('featured', true);
  }

  if (options?.chain && options.chain !== 'All') {
    query = query.eq('chain', options.chain);
  }

  if (options?.difficulty && options.difficulty !== 'All') {
    query = query.eq('difficulty', options.difficulty);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as Airdrop[];
};

export const getAirdropById = async (id: string) => {
  const { data, error } = await supabase
    .from('airdrops')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Airdrop;
};

export const createAirdrop = async (airdrop: Omit<Airdrop, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('airdrops')
    .insert([airdrop])
    .select()
    .single();

  if (error) throw error;
  return data as Airdrop;
};

export const updateAirdrop = async (id: string, airdrop: Partial<Airdrop>) => {
  const { data, error } = await supabase
    .from('airdrops')
    .update(airdrop)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Airdrop;
};

export const deleteAirdrop = async (id: string) => {
  const { error } = await supabase
    .from('airdrops')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// Community queries
export const getCommunityPosts = async (options?: {
  limit?: number;
  category?: string;
}) => {
  let query = supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.category && options.category !== 'All') {
    query = query.eq('category', options.category);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as CommunityPost[];
};

export const createCommunityPost = async (post: Omit<CommunityPost, 'id' | 'created_at' | 'upvotes' | 'downvotes' | 'replies'>) => {
  const { data, error } = await supabase
    .from('community_posts')
    .insert([{
      ...post,
      upvotes: 0,
      downvotes: 0,
      replies: 0
    }])
    .select()
    .single();

  if (error) throw error;
  return data as CommunityPost;
};

export const updateCommunityPost = async (id: string, post: Partial<CommunityPost>) => {
  const { data, error } = await supabase
    .from('community_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as CommunityPost;
};

export const deleteCommunityPost = async (id: string) => {
  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// News queries
export const getNews = async (options?: {
  limit?: number;
  category?: string;
}) => {
  let query = supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.category && options.category !== 'All') {
    query = query.eq('category', options.category);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as NewsArticle[];
};

export const createNews = async (news: Omit<NewsArticle, 'id' | 'created_at' | 'views' | 'comments'>) => {
  const { data, error } = await supabase
    .from('news')
    .insert([{
      ...news,
      views: 0,
      comments: 0
    }])
    .select()
    .single();

  if (error) throw error;
  return data as NewsArticle;
};

// Poll queries
export const getPolls = async () => {
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Poll[];
};

export const createPoll = async (poll: Omit<Poll, 'id' | 'created_at' | 'total_votes'>) => {
  const { data, error } = await supabase
    .from('polls')
    .insert([{
      ...poll,
      total_votes: 0
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Poll;
};

// Analytics
export const trackAirdropClick = async (airdropId: string, ipAddress?: string) => {
  const { error } = await supabase
    .from('clicks')
    .insert([{
      airdrop_id: airdropId,
      ip_address: ipAddress,
      timestamp: new Date().toISOString()
    }]);

  if (error) throw error;
};

export const getClickAnalytics = async (airdropId?: string) => {
  let query = supabase
    .from('clicks')
    .select('*');

  if (airdropId) {
    query = query.eq('airdrop_id', airdropId);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};