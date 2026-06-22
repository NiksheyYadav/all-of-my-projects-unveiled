# 🚀 DEPLOYMENT GUIDE

## Quick Navigation
- [Vercel Deployment](#vercel-deployment) (Recommended)
- [Android Build](#android-build)
- [Environment Setup](#environment-setup)
- [Post-Deployment](#post-deployment)

---

## 📦 Pre-Deployment Checklist

- [x] All code complete ✅
- [x] App running locally ✅
- [x] Environment variables documented ✅
- [ ] OpenRouter API key obtained
- [ ] Razorpay account created (optional)
- [ ] Supabase project created (optional)

---

## 🌐 Vercel Deployment

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - AI Chat App"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/ai-chat.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```env
# Required
OPENROUTER_API_KEY=sk-or-v1-...

# For payments
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
RAZORPAY_PLAN_BASIC=plan_...
RAZORPAY_PLAN_PRO=plan_...
RAZORPAY_PLAN_PREMIUM=plan_...

# For database (optional)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Auth (optional)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.vercel.app

# App info
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=AI Chat
```

### Step 4: Deploy!

Click "Deploy" - Your app will be live in 2 minutes! 🎉

**Your URL**: `https://your-project.vercel.app`

---

## 📱 Android Build (Play Store)

### Prerequisites

- Windows/Mac/Linux with:
  - Node.js installed ✅
  - Android Studio installed
  - JDK 17+ installed

### Step 1: Build Next.js

```bash
npm run build
```

### Step 2: Initialize Capacitor

```bash
# Run once
npx cap init "AI Chat" "com.aichat.app"
```

When prompted:
- **App name**: AI Chat
- **App ID**: com.aichat.app
- **Web directory**: out

### Step 3: Add Android Platform

```bash
npx cap add android
```

### Step 4: Sync Files

```bash
npm run build
npx cap sync android
```

### Step 5: Open in Android Studio

```bash
npx cap open android
```

### Step 6: Configure Android App

In Android Studio:

1. **Update `AndroidManifest.xml`**:
   - Add permissions (internet, network state)
   - Already configured in capacitor.config.ts ✅

2. **Update `strings.xml`**:
   - App name, descriptions

3. **Add App Icons**:
   - Place icons in `android/app/src/main/res/`
   - Sizes: hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi

4. **Add Splash Screen**:
   - Update `android/app/src/main/res/values/styles.xml`

### Step 7: Build APK/AAB

**For Testing (APK)**:
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- Find APK in `android/app/build/outputs/apk/debug/`

**For Play Store (AAB)**:
- Build → Generate Signed Bundle / APK
- Choose "Android App Bundle"
- Create/select keystore
- Build release AAB
- Find AAB in `android/app/build/outputs/bundle/release/`

### Step 8: Test APK

```bash
# Install on connected device/emulator
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 9: Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill app details:
   - **App name**: AI Chat
   - **Short description**: Chat with multiple AI models
   - **Full description**: (See template below)
   - **Category**: Productivity
   - **Content rating**: Everyone
4. Upload AAB
5. Add screenshots (1080x1920)
6. Submit for review

---

## 🎨 Play Store Assets

### App Description Template

```
AI Chat - Your Smart AI Assistant

Chat with the world's most advanced AI models in one beautiful app!

✨ FEATURES:
• Access GPT-4, Claude 3, Gemini Pro, and more
• Real-time streaming responses
• Beautiful, modern interface with smooth animations
• Save and manage multiple conversations
• Markdown and code syntax highlighting
• Dark theme optimized for OLED displays

🚀 MULTIPLE AI MODELS:
• GPT-4 Turbo - Most capable
• Claude 3 Opus - Advanced reasoning
• Gemini Pro - Google's powerful AI
• Llama 3 - Open source excellence
• And more!

💰 FLEXIBLE PLANS:
• Free: 10 messages/day with GPT-3.5
• Basic: ₹199/month - 100 messages, most models
• Pro: ₹499/month - 500 messages, all models
• Premium: ₹999/month - Unlimited everything

📱 BEAUTIFUL DESIGN:
• 120fps smooth animations
• Modern glassmorphism UI
• Intuitive and easy to use
• Optimized for mobile

Perfect for students, professionals, developers, and anyone who wants to harness the power of AI!

Download now and start chatting with the future! 🤖
```

### Screenshots Needed (9)

1. Landing page
2. Chat interface
3. Multiple conversations
4. Code highlighting
5. Model selector
6. Pricing page
7. Settings page
8. Dark theme showcase
9. Markdown rendering

**Resolution**: 1080x1920 (portrait)

### App Icon

- **Size**: 512x512 PNG
- **Design**: Purple/blue gradient with sparkle icon
- **Background**: Transparent or gradient

---

## 🔐 Environment Setup Details

### 1. OpenRouter (Required)

**Get API Key**:
1. https://openrouter.ai → Sign up
2. Keys → Create Key
3. Copy key (starts with `sk-or-v1-`)
4. Add $5-10 credits

**Cost**: ~$0.002 per message (GPT-3.5)

### 2. Razorpay (For Payments)

**Setup**:
1. https://razorpay.com → Sign up
2. Dashboard → Settings → API Keys
3. Generate Test/Live keys
4. Create 3 subscription plans:
   - Basic: ₹199/month
   - Pro: ₹499/month
   - Premium: ₹999/month
5. Copy all plan IDs

**Transaction Fee**: 2% per payment

### 3. Supabase (Optional - Database)

**Setup**:
1. https://supabase.com → New Project
2. Project Settings → API
3. Copy URL and Keys
4. SQL Editor → Run migrations from README
5. Set up Row Level Security

**Cost**: Free up to 500MB, then $25/month

### 4. NextAuth (Optional - Auth)

**Setup**:
1. Generate secret:
   ```bash
   openssl rand -base64 32
   ```
2. Add to NEXTAUTH_SECRET
3. Configure OAuth providers (Google, GitHub)

---

## 🎯 Post-Deployment Tasks

### Verify Deployment

- [ ] Visit your Vercel URL
- [ ] Test chat functionality
- [ ] Test model switching
- [ ] Test subscription page
- [ ] Test settings page
- [ ] Check mobile responsiveness

### Configure Webhooks

**Razorpay Webhook**:
1. Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-domain.vercel.app/api/subscription/webhook`
3. Select events: `payment.captured`, `subscription.activated`
4. Copy webhook secret to env

### Set Up Monitoring

**Vercel**:
- Analytics → Enable
- Speed Insights → Enable
- Error tracking → Check logs

**Optional**:
- Add Google Analytics
- Add Sentry for error tracking
- Add LogRocket for session replay

### Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy)
2. Vercel → Domains → Add Domain
3. Update DNS records
4. Update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL

### SSL Certificate

- Auto-generated by Vercel ✅
- Free Let's Encrypt SSL

---

## 📊 Testing Checklist

### Functionality
- [ ] Chat with AI works
- [ ] Streaming responses work
- [ ] Model selector works
- [ ] New conversation creation
- [ ] Conversation deletion
- [ ] Settings page
- [ ] Export conversations
- [ ] Subscription page loads

### Performance
- [ ] First load < 3s
- [ ] Animations smooth (60fps+)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Works offline (cached)

### Payments (Test Mode)
- [ ] Plan selection works
- [ ] Razorpay modal opens
- [ ] Test payment succeeds
- [ ] Plan updates after payment
- [ ] Webhook receives events

### Mobile App
- [ ] APK installs on Android
- [ ] App opens without errors
- [ ] Chat functionality works
- [ ] Keyboard doesn't cover input
- [ ] Back button works
- [ ] App icon shows correctly

---

## 🐛 Common Issues & Fixes

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API not working in production
- Check environment variables in Vercel
- Ensure all required vars are set
- Check API route logs in Vercel dashboard

### Capacitor build fails
```bash
npx cap sync
cd android
./gradlew clean
cd ..
npx cap open android
```

### Payments not working
- Verify Razorpay keys (test vs live)
- Check webhook URL is correct
- Verify webhook secret matches
- Check Razorpay dashboard logs

### Animations laggy
- Check browser performance
- Reduce animation complexity
- Test on real device, not emulator

---

## 🎉 Launch Checklist

### Pre-Launch
- [ ] All features tested
- [ ] No console errors
- [ ] Mobile app tested
- [ ] Payment flow tested
- [ ] Documentation complete
- [ ] Privacy policy created
- [ ] Terms of service created

### Launch Day
- [ ] Deploy to production
- [ ] Upload to Play Store
- [ ] Submit for review
- [ ] Share on social media
- [ ] Create landing page
- [ ] Set up support email
- [ ] Monitor for issues

### Post-Launch
- [ ] Respond to user feedback
- [ ] Fix critical bugs ASAP
- [ ] Monitor analytics
- [ ] Track revenue
- [ ] Plan new features
- [ ] Update documentation

---

## 🚀 You're Ready to Launch!

Everything is set up and ready. Just:
1. Add your API keys
2. Deploy to Vercel
3. Build Android app
4. Submit to Play Store
5. 🎉 Celebrate!

**Questions?** Check the other documentation files or create an issue on GitHub.

---

**Built with ❤️ - Ready for production!**
