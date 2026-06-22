# 🚀 FlowMind - AI-Powered Productivity Tool

An intelligent productivity tool that enhances workflow efficiency through AI-powered task automation and real-time collaboration. Built with Next.js, Tailwind CSS, shadcn/ui, and seamless cross-platform synchronization.

## ✨ Features

- **AI-powered Task Automation**: Automate repetitive tasks with intelligent AI that learns your workflow patterns
- **Real-time Collaboration**: Work seamlessly with your team in real-time with instant updates
- **Cross-platform Synchronization**: Access your tasks from any device with seamless synchronization
- **Intelligent Scheduling**: Smart scheduling that considers your availability and priorities
- **Personalized Recommendations**: Get tailored suggestions for improving productivity
- **Analytics Dashboard**: Gain insights into your productivity with detailed analytics
- **120fps Smooth Animations**: Powered by Framer Motion
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Subscription Plans**: Free, Basic (₹199), Pro (₹499), Premium (₹999)
- **Secure Payments**: Razorpay integration
- **Mobile Ready**: Available on Android with Capacitor
- **Dark Theme**: Beautiful glassmorphism design

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Animations**: Framer Motion (120fps)
- **AI API**: OpenRouter
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js v5
- **Payments**: Razorpay
- **State Management**: Zustand
- **Mobile**: Capacitor for Android

## 📦 Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Create a `.env.local` file with:

```env
# OpenRouter API (Required)
OPENROUTER_API_KEY=your_openrouter_api_key

# Razorpay (Required for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Razorpay Plan IDs
RAZORPAY_PLAN_BASIC=plan_basic_id
RAZORPAY_PLAN_PRO=plan_pro_id
RAZORPAY_PLAN_PREMIUM=plan_premium_id

# Supabase (Optional - for production)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth (Optional - for auth)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# App Info
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FlowMind
```

3. **Run development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Getting API Keys

### 1. OpenRouter (Required)
- Sign up at [OpenRouter.ai](https://openrouter.ai)
- Go to Settings → API Keys
- Create a new API key
- Add credits to your account (pay-as-you-go)

### 2. Razorpay (For Payments)
- Sign up at [Razorpay.com](https://razorpay.com)
- Go to Settings → API Keys
- Generate Test/Live keys
- Create subscription plans in Dashboard
- Copy plan IDs for each tier

### 3. Supabase (Optional - for database)
- Sign up at [Supabase.com](https://supabase.com)
- Create a new project
- Go to Settings → API
- Copy URL and anon key
- Run the SQL migrations (see Database Setup below)

## 🗄️ Database Setup (Supabase)

Run this SQL in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('free', 'basic', 'pro', 'premium')),
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')),
  razorpay_subscription_id TEXT,
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model TEXT,
  tokens INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  message_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view own usage" ON usage FOR SELECT USING (auth.uid() = user_id);
```

## 📱 Build for Android

1. **Initialize Capacitor**:
```bash
npm run cap:init
```

2. **Add Android platform**:
```bash
npm run cap:add:android
```

3. **Sync and open in Android Studio**:
```bash
npm run android:dev
```

4. **Build APK/AAB in Android Studio**:
- Build → Build Bundle(s) / APK(s)
- Generate Signed Bundle/APK for Play Store

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  primary: { ... },
  secondary: { ... }
}
```

### Add New AI Models
Edit `lib/openrouter.ts` and add to `AI_MODELS` object.

### Modify Subscription Plans
Edit `lib/razorpay.ts` and update `SUBSCRIPTION_PLANS`.

## 📄 Project Structure

```
flowmind/
├── app/
│   ├── api/
│   │   ├── chat/         # Streaming chat endpoint
│   │   └── subscription/ # Razorpay integration
│   ├── chat/             # Main chat interface
│   ├── pricing/          # Subscription plans
│   ├── settings/         # User settings
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn components
│   ├── chat/             # Chat components
│   └── landing/          # Landing page components
├── lib/
│   ├── openrouter.ts     # AI API client
│   ├── razorpay.ts       # Payment integration
│   ├── supabase.ts       # Database client
│   └── utils.ts          # Utilities
├── store/
│   ├── chat.ts           # Chat state management
│   └── user.ts           # User state management
└── capacitor.config.ts   # Mobile configuration
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
```bash
npm run build
npm run start
```

## 💰 Subscription Plans

- **Free**: ₹0/month - 10 messages/day, GPT-3.5 only
- **Basic**: ₹199/month - 100 messages/day, Most models
- **Pro**: ₹499/month - 500 messages/day, All models including GPT-4
- **Premium**: ₹999/month - Unlimited messages, All features

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Capacitor issues
```bash
npx cap sync
```

## 📝 License

MIT License - feel free to use for any project!

## 🙏 Credits

- UI Components: [shadcn/ui](https://ui.shadcn.com)
- Icons: [Lucide Icons](https://lucide.dev)
- AI API: [OpenRouter](https://openrouter.ai)
- Database: [Supabase](https://supabase.com)
- Payments: [Razorpay](https://razorpay.com)

## 🎯 Next Steps

1. Add user authentication (Google, GitHub, Email)
2. Implement voice input/output
3. Add image generation with DALL-E/Stable Diffusion
4. Create admin dashboard
5. Add analytics and usage tracking
6. Implement file uploads for vision models
7. Add push notifications
8. Create iOS version

---

Built with ❤️ using Next.js, Tailwind CSS, and cutting-edge AI technology.
