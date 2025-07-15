# Claimex - Crypto Airdrop Discovery Platform

A modern, full-stack crypto airdrop discovery platform built with Next.js, Supabase, and Tailwind CSS.

## 🚀 Features

- **Airdrop Discovery**: Browse and discover the latest crypto airdrops
- **Real-time News**: Stay updated with crypto news via NewsData.io API
- **Community Features**: Share tips, ask questions, and participate in polls
- **Admin Dashboard**: Manage airdrops, news, and community content
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Meta tags and Open Graph support

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Auth, Storage)
- **Icons**: Lucide React
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd claimex
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=admin@claimex.com
```

4. Set up Supabase database:
Create the following tables in your Supabase project:

```sql
-- Airdrops table
CREATE TABLE airdrops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  chain TEXT NOT NULL,
  reward TEXT,
  description TEXT,
  link TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  participants INTEGER DEFAULT 0,
  time_left TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News table
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  url TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'General',
  views INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community posts table
CREATE TABLE community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL,
  author_avatar TEXT DEFAULT 'U',
  category TEXT DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Polls table
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE
);

-- Clicks tracking table
CREATE TABLE clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  airdrop_id UUID REFERENCES airdrops(id),
  ip_address TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Add them to your `.env.local` file
4. Run the SQL commands above to create the required tables

### Admin Access

- Default admin email: `admin@claimex.com`
- Access the admin dashboard at `/admin`
- Change the admin email in `.env.local` if needed

## 📱 Usage

### For Users
- Browse airdrops on the `/airdrops` page
- View detailed airdrop information and guides
- Read the latest crypto news
- Participate in community discussions and polls

### For Admins
- Access the admin dashboard at `/admin`
- Add, edit, and manage airdrops
- Create news articles
- Moderate community content
- View analytics and click tracking

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Lucide](https://lucide.dev/) for icons
- [NewsData.io](https://newsdata.io/) for crypto news API