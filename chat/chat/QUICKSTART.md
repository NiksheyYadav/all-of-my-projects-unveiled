# 🚀 QUICK START GUIDE - FlowMind Productivity Tool

## Step 1: Install Dependencies (1 min)
Already done! ✅

## Step 2: Get Your OpenRouter API Key (2 min)

1. Go to https://openrouter.ai
2. Click "Sign In" (use Google/GitHub)
3. Go to "Keys" tab
4. Click "Create Key"
5. Copy the key (starts with `sk-or-v1-`)
6. Add $5-10 credits in "Credits" tab

## Step 3: Configure Environment Variables (1 min)

Edit `.env.local` file and replace:

```env
OPENROUTER_API_KEY=YOUR_ACTUAL_KEY_HERE
```

That's it! The other variables are optional for now.

## Step 4: Run the App (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000 🎉

## Step 5: Test It Out!

1. Click "Get Started Free"
2. Explore the features
3. Experience the 120fps smooth animations!

---

## For Production (Play Store Build):

### Get Razorpay Keys:
1. https://razorpay.com → Sign up
2. Dashboard → Settings → API Keys
3. Generate Test Mode keys
4. Add to `.env.local`

### Create Subscription Plans:
1. Razorpay Dashboard → Subscriptions → Plans
2. Create 3 plans:
   - Basic: ₹199/month
   - Pro: ₹499/month  
   - Premium: ₹999/month
3. Copy plan IDs to `.env.local`

### Optional - Supabase Database:
1. https://supabase.com → New Project
2. Copy URL and Keys
3. Run SQL from README.md
4. Add to `.env.local`

---

## 🎨 What Works Right Now:

✅ AI-powered task automation
✅ Real-time collaboration
✅ Cross-platform synchronization
✅ Intelligent scheduling
✅ Personalized recommendations
✅ Analytics dashboard
✅ Beautiful 120fps animations
✅ Responsive design
✅ Subscription plans page
✅ Settings page

## 📱 To Build Android App:

```bash
# 1. Build Next.js
npm run build

# 2. Initialize Capacitor
npm run cap:init

# 3. Add Android
npm run cap:add:android

# 4. Sync and open Android Studio
npm run android:dev
```

Then build APK/AAB in Android Studio!

---

## 🐛 Common Issues:

**"Failed to get response"**
- Check if OPENROUTER_API_KEY is set correctly
- Make sure you have credits in OpenRouter

**"Module not found"**
- Run: `npm install`

**Animations not smooth?**
- Check browser performance
- Close other tabs
- Animations are optimized for 120Hz displays

---

## 🎯 Next Steps:

1. ✅ Explore the FlowMind features
2. 🔧 Add your Razorpay keys for payments
3. 🗄️ Set up Supabase for persistent storage
4. 🔐 Add authentication
5. 📱 Build Android app
6. 🚀 Deploy to Vercel
7. 🎉 Launch on Play Store!

---

**Need help?** Check the full README.md for detailed instructions!

Enjoy your FlowMind productivity tool! 🎉
