"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3, 
  Users, 
  TrendingUp,
  Calendar,
  ExternalLink,
  Shield,
  Lock
} from 'lucide-react';
import { createAirdrop, deleteAirdrop, getAirdrops, updateAirdrop } from '@/lib/supabase-queries';

// Mock data for admin dashboard
const dashboardStats = {
  totalAirdrops: 156,
  activeUsers: 1247,
  totalClicks: 12450,
  successRate: 94
};

const recentAirdrops = [
  {
    id: '1',
    title: 'LayerZero Protocol',
    chain: 'Ethereum',
    status: 'Active',
    clicks: 1250,
    conversions: 89,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Starknet Ecosystem',
    chain: 'StarkNet',
    status: 'Active',
    clicks: 980,
    conversions: 67,
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Polygon zkEVM',
    chain: 'Polygon',
    status: 'Pending',
    clicks: 567,
    conversions: 34,
    createdAt: '2024-01-13'
  }
];

const recentNews = [
  {
    id: '1',
    title: 'LayerZero Announces Major Protocol Upgrade',
    status: 'Published',
    views: 1250,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Arbitrum Launches New Developer Incentive Program',
    status: 'Draft',
    views: 0,
    createdAt: '2024-01-14'
  }
];

export default function AdminPage() {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;
  const loading = auth?.loading;
  const signOut = auth?.signOut;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@claimex.com';
  const isAdmin = user && user.email === adminEmail;

  // Restore newAirdrop and newNews state
  const [newAirdrop, setNewAirdrop] = useState({
    title: '',
    chain: '',
    reward: '',
    description: '',
    link: '',
    tags: '',
    difficulty: 'Medium',
    featured: true, // Default to true
    image: null as File | null,
  });
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    category: 'Protocol Updates',
    url: '',
  });
  const [addAirdropError, setAddAirdropError] = useState('');
  const [addAirdropSuccess, setAddAirdropSuccess] = useState('');
  const [refreshAirdrops, setRefreshAirdrops] = useState(0);
  const [airdrops, setAirdrops] = useState<any[]>([]);
  const [editAirdrop, setEditAirdrop] = useState<any | null>(null);
  const [editAirdropError, setEditAirdropError] = useState('');
  const [editAirdropSuccess, setEditAirdropSuccess] = useState('');

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchAirdrops() {
      try {
        const data = await getAirdrops();
        setAirdrops(data);
      } catch (err) {
        // handle error
      }
    }
    fetchAirdrops();
  }, [refreshAirdrops]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Not Authorized</h2>
          <p className="text-muted-foreground mb-4">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const handleAddAirdrop = async () => {
    setAddAirdropError('');
    setAddAirdropSuccess('');
    let imageUrl = '';
    
    try {
      // Upload image if present
      if (newAirdrop.image) {
        const fileExt = newAirdrop.image.name.split('.').pop();
        const fileName = `airdrop-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('airdrop-images')
          .upload(fileName, newAirdrop.image);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('airdrop-images')
          .getPublicUrl(fileName);
          
        imageUrl = urlData.publicUrl;
      }
      
      await createAirdrop({
        ...newAirdrop,
        tags: newAirdrop.tags.split(',').map((t) => t.trim()),
        participants: 0,
        time_left: '',
        image_url: imageUrl,
        difficulty: newAirdrop.difficulty as 'Easy' | 'Medium' | 'Hard',
      });
      
      setAddAirdropSuccess('Airdrop added successfully!');
      setNewAirdrop({
        title: '',
        chain: '',
        reward: '',
        description: '',
        link: '',
        tags: '',
        difficulty: 'Medium',
        featured: true,
        image: null,
      });
      setImagePreview(null);
      setRefreshAirdrops((c) => c + 1);
    } catch (err: any) {
      setAddAirdropError(err.message || 'Failed to add airdrop');
    }
  };

  const handleDeleteAirdrop = async (id: string) => {
    try {
      await deleteAirdrop(id);
      setRefreshAirdrops((c) => c + 1);
    } catch (err) {
      // handle error
    }
  };

  const handleEditAirdrop = (airdrop: any) => {
    setEditAirdrop(airdrop);
  };

  const handleSaveEditAirdrop = async () => {
    setEditAirdropError('');
    setEditAirdropSuccess('');
    try {
      // You need to implement updateAirdrop in supabase-queries
      await updateAirdrop(editAirdrop.id, editAirdrop);
      setEditAirdropSuccess('Airdrop updated!');
      setEditAirdrop(null);
      setRefreshAirdrops((c) => c + 1);
    } catch (err: any) {
      setEditAirdropError(err.message || 'Failed to update airdrop');
    }
  };

  const handleAddNews = () => {
    // In a real app, this would submit to your backend
    console.log('Adding news:', newNews);
    // Reset form
    setNewNews({
      title: '',
      content: '',
      category: 'Protocol Updates',
      url: ''
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAirdrop({ ...newAirdrop, image: file });
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setNewAirdrop({ ...newAirdrop, image: null });
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Manage airdrops, news, and monitor platform analytics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Total Airdrops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {dashboardStats.totalAirdrops}
              </div>
              <p className="text-sm text-muted-foreground">
                +12 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {dashboardStats.activeUsers.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                +87 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Total Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                {dashboardStats.totalClicks.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                +1.2K today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {dashboardStats.successRate}%
              </div>
              <p className="text-sm text-muted-foreground">
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="airdrops" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="airdrops">Airdrops</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="airdrops" className="space-y-6">
            {/* Add New Airdrop */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Airdrop
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Airdrop title"
                      value={newAirdrop.title}
                      onChange={(e) => setNewAirdrop({...newAirdrop, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chain">Chain</Label>
                    <Input
                      id="chain"
                      placeholder="Ethereum, Polygon, etc."
                      value={newAirdrop.chain}
                      onChange={(e) => setNewAirdrop({...newAirdrop, chain: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward">Reward</Label>
                    <Input
                      id="reward"
                      placeholder="$100 - $500"
                      value={newAirdrop.reward}
                      onChange={(e) => setNewAirdrop({...newAirdrop, reward: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <select
                      id="difficulty"
                      value={newAirdrop.difficulty}
                      onChange={(e) => setNewAirdrop({...newAirdrop, difficulty: e.target.value})}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="mb-4">
                    <Label htmlFor="featured" className="mb-1 block">Featured</Label>
                    <input
                      id="featured"
                      type="checkbox"
                      checked={newAirdrop.featured}
                      onChange={e => setNewAirdrop({ ...newAirdrop, featured: e.target.checked })}
                      className="mr-2"
                    />
                    <span>Show on Home page</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="airdropImage">Airdrop Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="airdropImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
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
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Airdrop description"
                    value={newAirdrop.description}
                    onChange={(e) => setNewAirdrop({...newAirdrop, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="link">Official Link</Label>
                    <Input
                      id="link"
                      placeholder="https://..."
                      value={newAirdrop.link}
                      onChange={(e) => setNewAirdrop({...newAirdrop, link: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="DeFi, Bridge, Layer 2"
                      value={newAirdrop.tags}
                      onChange={(e) => setNewAirdrop({...newAirdrop, tags: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleAddAirdrop} className="w-full">
                  Add Airdrop
                </Button>
                {addAirdropError && (
                  <p className="text-red-500 text-sm mt-2">{addAirdropError}</p>
                )}
                {addAirdropSuccess && (
                  <p className="text-green-500 text-sm mt-2">{addAirdropSuccess}</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Airdrops */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Airdrops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {airdrops.map((airdrop) => (
                    <div key={airdrop.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{airdrop.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{airdrop.chain}</Badge>
                          <Badge variant={airdrop.status === 'Active' ? 'default' : 'secondary'}>
                            {airdrop.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <div className="text-sm text-muted-foreground">
                          {airdrop.clicks} clicks • {airdrop.conversions} conversions
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {airdrop.createdAt}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditAirdrop(airdrop)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteAirdrop(airdrop.id)}><Trash2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Edit airdrop modal/inline form */}
            {editAirdrop && (
              <div className="p-4 border rounded bg-muted">
                <h3 className="font-bold mb-2">Edit Airdrop</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editTitle">Title</Label>
                    <Input
                      id="editTitle"
                      placeholder="Airdrop title"
                      value={editAirdrop.title}
                      onChange={e => setEditAirdrop({ ...editAirdrop, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editChain">Chain</Label>
                    <Input
                      id="editChain"
                      placeholder="Ethereum, Polygon, etc."
                      value={editAirdrop.chain}
                      onChange={e => setEditAirdrop({ ...editAirdrop, chain: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editReward">Reward</Label>
                    <Input
                      id="editReward"
                      placeholder="$100 - $500"
                      value={editAirdrop.reward}
                      onChange={e => setEditAirdrop({ ...editAirdrop, reward: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDifficulty">Difficulty</Label>
                    <select
                      id="editDifficulty"
                      value={editAirdrop.difficulty}
                      onChange={e => setEditAirdrop({ ...editAirdrop, difficulty: e.target.value })}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    placeholder="Airdrop description"
                    value={editAirdrop.description}
                    onChange={e => setEditAirdrop({ ...editAirdrop, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editLink">Official Link</Label>
                    <Input
                      id="editLink"
                      placeholder="https://..."
                      value={editAirdrop.link}
                      onChange={e => setEditAirdrop({ ...editAirdrop, link: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editTags">Tags (comma-separated)</Label>
                    <Input
                      id="editTags"
                      placeholder="DeFi, Bridge, Layer 2"
                      value={editAirdrop.tags}
                      onChange={e => setEditAirdrop({ ...editAirdrop, tags: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="mb-4">
                    <Label htmlFor="editFeatured" className="mb-1 block">Featured</Label>
                    <input
                      id="editFeatured"
                      type="checkbox"
                      checked={editAirdrop.featured}
                      onChange={e => setEditAirdrop({ ...editAirdrop, featured: e.target.checked })}
                      className="mr-2"
                    />
                    <span>Show on Home page</span>
                  </div>
                </div>
                <Button onClick={handleSaveEditAirdrop} className="w-full">
                  Save Airdrop
                </Button>
                <Button variant="outline" onClick={() => setEditAirdrop(null)} className="w-full mt-2">Cancel</Button>
                {editAirdropError && <div className="text-red-500 text-sm mt-2">{editAirdropError}</div>}
                {editAirdropSuccess && <div className="text-green-500 text-sm mt-2">{editAirdropSuccess}</div>}
              </div>
            )}
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            {/* Add New News */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New News Article
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newsTitle">Title</Label>
                    <Input
                      id="newsTitle"
                      placeholder="News article title"
                      value={newNews.title}
                      onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={newNews.category}
                      onChange={(e) => setNewNews({...newNews, category: e.target.value})}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="Protocol Updates">Protocol Updates</option>
                      <option value="Ecosystem News">Ecosystem News</option>
                      <option value="Testnet News">Testnet News</option>
                      <option value="Analysis">Analysis</option>
                      <option value="Guides">Guides</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newsContent">Content</Label>
                  <Textarea
                    id="newsContent"
                    placeholder="Article content"
                    value={newNews.content}
                    onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                    className="min-h-[120px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newsUrl">External URL (optional)</Label>
                  <Input
                    id="newsUrl"
                    placeholder="https://..."
                    value={newNews.url}
                    onChange={(e) => setNewNews({...newNews, url: e.target.value})}
                  />
                </div>
                <Button onClick={handleAddNews} className="w-full">
                  Add News Article
                </Button>
              </CardContent>
            </Card>

            {/* Recent News */}
            <Card>
              <CardHeader>
                <CardTitle>Recent News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentNews.map((news) => (
                    <div key={news.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{news.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={news.status === 'Published' ? 'default' : 'secondary'}>
                            {news.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {news.views} views • {news.createdAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Detailed analytics and reporting features would be implemented here
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        Click-through Rate
                      </div>
                      <div className="text-3xl font-bold text-green-500">
                        7.2%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        Conversion Rate
                      </div>
                      <div className="text-3xl font-bold text-blue-500">
                        3.8%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        Avg. Session Duration
                      </div>
                      <div className="text-3xl font-bold text-purple-500">
                        4m 32s
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {user && isAdmin && (
          <Button onClick={signOut} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</Button>
        )}
      </div>
    </div>
  );
}