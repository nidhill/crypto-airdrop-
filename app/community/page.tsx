"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Plus, 
  Search,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  BarChart3,
  Upload,
  X,
  Image as ImageIcon,
  Edit,
  Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { createCommunityPost, getCommunityPosts, updateCommunityPost, deleteCommunityPost } from '@/lib/supabase-queries';

// Mock data for community posts
const communityPosts = [
  {
    id: '1',
    title: 'LayerZero Airdrop Strategy - What\'s Working?',
    content: 'I\'ve been farming LayerZero for 3 months now. Here\'s what I\'ve learned about the most effective strategies...',
    author: 'CryptoHunter',
    authorAvatar: 'CH',
    category: 'Strategy',
    tags: ['LayerZero', 'Airdrop', 'Strategy'],
    upvotes: 45,
    downvotes: 3,
    replies: 12,
    createdAt: '2024-01-15T10:30:00Z',
    pinned: true
  },
  {
    id: '2',
    title: 'Starknet Testnet Reset - New Opportunities',
    content: 'With the recent testnet reset, there are new opportunities to farm Starknet. Here\'s how to get started...',
    author: 'AirdropPro',
    authorAvatar: 'AP',
    category: 'News',
    tags: ['Starknet', 'Testnet', 'Guide'],
    upvotes: 32,
    downvotes: 1,
    replies: 8,
    createdAt: '2024-01-14T14:20:00Z',
    pinned: false
  },
  {
    id: '3',
    title: 'Gas Optimization Tips for Airdrop Farming',
    content: 'Gas fees are eating into profits. Here are some proven strategies to minimize gas costs while farming...',
    author: 'GasOptimizer',
    authorAvatar: 'GO',
    category: 'Tips',
    tags: ['Gas', 'Optimization', 'Ethereum'],
    upvotes: 28,
    downvotes: 2,
    replies: 15,
    createdAt: '2024-01-13T09:15:00Z',
    pinned: false
  },
  {
    id: '4',
    title: 'Polygon zkEVM: Early Adopter Advantage',
    content: 'Got early access to Polygon zkEVM. Here\'s what I\'ve discovered about potential airdrop opportunities...',
    author: 'EarlyAdopter',
    authorAvatar: 'EA',
    category: 'Alpha',
    tags: ['Polygon', 'zkEVM', 'Alpha'],
    upvotes: 67,
    downvotes: 4,
    replies: 23,
    createdAt: '2024-01-12T16:45:00Z',
    pinned: false
  }
];

// Mock data for polls
const polls = [
  {
    id: '1',
    question: 'Which airdrop has the highest potential in 2024?',
    options: [
      { id: 'a', text: 'LayerZero', votes: 156 },
      { id: 'b', text: 'Starknet', votes: 89 },
      { id: 'c', text: 'Polygon zkEVM', votes: 134 },
      { id: 'd', text: 'Scroll', votes: 67 }
    ],
    totalVotes: 446,
    createdAt: '2024-01-15T10:00:00Z',
    endsAt: '2024-01-22T10:00:00Z'
  },
  {
    id: '2',
    question: 'What\'s your preferred chain for airdrop farming?',
    options: [
      { id: 'a', text: 'Ethereum', votes: 78 },
      { id: 'b', text: 'Arbitrum', votes: 45 },
      { id: 'c', text: 'Optimism', votes: 56 },
      { id: 'd', text: 'Polygon', votes: 34 }
    ],
    totalVotes: 213,
    createdAt: '2024-01-14T12:00:00Z',
    endsAt: '2024-01-21T12:00:00Z'
  }
];

const categories = ['All', 'Strategy', 'News', 'Tips', 'Alpha', 'Question'];

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [editPost, setEditPost] = useState<any | null>(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostError, setEditPostError] = useState('');
  const [editPostLoading, setEditPostLoading] = useState(false);

  // Fetch posts from Supabase
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getCommunityPosts();
        setPosts(data);
      } catch (err: any) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setUserVotes(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [voteType]: !prev[postId]?.[voteType],
        [voteType === 'up' ? 'down' : 'up']: false
      }
    }));
  };

  const handlePollVote = (pollId: string, optionId: string) => {
    // In a real app, this would update the poll data
    console.log('Poll vote:', pollId, optionId);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPostImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setNewPostImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleAddPost = async () => {
    setLoading(true);
    setError(null);
    let imageUrl = '';
    try {
      // 1. Upload image if present
      if (newPostImage) {
        const fileExt = newPostImage.name.split('.').pop();
        const fileName = `post-${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('community-images')
          .upload(fileName, newPostImage);
        if (uploadError) throw uploadError;
        // 2. Get public URL
        const { data: urlData } = supabase.storage
          .from('community-images')
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }
      // 3. Save post to Supabase
      const post = await createCommunityPost({
        title: newPostTitle,
        content: newPostContent,
        image_url: imageUrl,
        author: 'Anonymous', // Replace with real user if available
        author_avatar: 'AN',
        category: selectedCategory === 'All' ? 'General' : selectedCategory,
        tags: [],
      });
      setPosts([post, ...posts]);
      // Reset form
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostImage(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      setShowNewPostForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add post');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post: any) => {
    setEditPost(post);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };

  const handleSaveEditPost = async () => {
    setEditPostLoading(true);
    setEditPostError('');
    try {
      const updated = await updateCommunityPost(editPost.id, { title: editPostTitle, content: editPostContent });
      setPosts(posts.map(p => p.id === editPost.id ? updated : p));
      setEditPost(null);
    } catch (err: any) {
      setEditPostError(err.message || 'Failed to update post');
    } finally {
      setEditPostLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    setEditPostLoading(true);
    try {
      await deleteCommunityPost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      // handle error
    } finally {
      setEditPostLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Community
          </h1>
          <p className="text-xl text-muted-foreground">
            Share strategies, ask questions, and connect with fellow airdrop hunters
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                1,247
              </div>
              <p className="text-sm text-muted-foreground">
                +124 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                Total Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {posts.length}
              </div>
              <p className="text-sm text-muted-foreground">
                +8 today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Success Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                156
              </div>
              <p className="text-sm text-muted-foreground">
                Successful claims
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
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

              <Button onClick={() => setShowNewPostForm(!showNewPostForm)}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="postTitle">Title</Label>
                    <Input
                      id="postTitle"
                      placeholder="Post title..."
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postContent">Content</Label>
                    <Textarea
                      id="postContent"
                      placeholder="What's on your mind?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postImage">Add Image (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          id="postImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="cursor-pointer"
                        />
                      </div>
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
                        <div className="relative w-full max-w-md">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddPost} disabled={loading}>
                      {loading ? 'Posting...' : 'Post'}
                      <Plus className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewPostForm(false)} disabled={loading}>
                      Cancel
                    </Button>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className={`${post.pinned ? 'ring-2 ring-primary/20' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{post.authorAvatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{post.author}</span>
                            {post.pinned && (
                              <Badge variant="secondary" className="text-xs">
                                Pinned
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatTimeAgo(post.createdAt)}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editPost && editPost.id === post.id ? (
                      <div className="space-y-2">
                        <Input value={editPostTitle} onChange={e => setEditPostTitle(e.target.value)} />
                        <Textarea value={editPostContent} onChange={e => setEditPostContent(e.target.value)} />
                        <div className="flex gap-2">
                          <Button onClick={handleSaveEditPost} disabled={editPostLoading}>
                            {editPostLoading ? 'Saving...' : 'Save'}
                          </Button>
                          <Button variant="outline" onClick={() => setEditPost(null)} disabled={editPostLoading}>
                            Cancel
                          </Button>
                        </div>
                        {editPostError && <div className="text-red-500 text-sm">{editPostError}</div>}
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                        <p className="text-muted-foreground mb-4">{post.content}</p>
                        
                        {post.image_url && (
                          <div className="relative w-full max-w-md mb-4 rounded-lg overflow-hidden">
                            <img
                              src={post.image_url}
                              alt="Post image"
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(post.id, 'up')}
                              className={userVotes[post.id]?.up ? 'text-green-500' : ''}
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {post.upvotes + (userVotes[post.id]?.up ? 1 : 0)}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(post.id, 'down')}
                              className={userVotes[post.id]?.down ? 'text-red-500' : ''}
                            >
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              {post.downvotes + (userVotes[post.id]?.down ? 1 : 0)}
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {post.replies} replies
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="polls" className="space-y-6">
            {/* Polls */}
            <div className="space-y-6">
              {polls.map((poll) => (
                <Card key={poll.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {poll.question}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{poll.totalVotes} votes</span>
                      <span>•</span>
                      <span>Ends {formatTimeAgo(poll.endsAt)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {poll.options.map((option) => {
                        const percentage = (option.votes / poll.totalVotes) * 100;
                        return (
                          <div
                            key={option.id}
                            className="relative p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => handlePollVote(poll.id, option.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{option.text}</span>
                              <span className="text-sm text-muted-foreground">
                                {option.votes} votes ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}