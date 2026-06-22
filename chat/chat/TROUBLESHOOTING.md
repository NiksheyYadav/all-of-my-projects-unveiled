# 🐛 FlowMind Productivity Tool - Troubleshooting Guide

Common issues and their solutions.

---

## 🚀 App Won't Start

### Error: "Cannot find module"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
# Solution: Use different port
npm run dev -- -p 3001

# Or kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Error: "Module not found: Can't resolve '@/...'"
```bash
# Solution: Check tsconfig.json paths
# Should have:
# "paths": { "@/*": ["./*"] }

# Restart dev server
npm run dev
```

---

## 💬 Chat Not Working

### Error: "Failed to get response"

**Check 1: API Key Set?**
```bash
# Open .env.local
# Verify OPENROUTER_API_KEY is set
# Should start with: sk-or-v1-
```

**Check 2: Have Credits?**
- Go to https://openrouter.ai
- Check "Credits" tab
- Add credits if needed ($5 minimum)

**Check 3: API Key Correct?**
- Copy key again from OpenRouter
- Replace in `.env.local`
- Restart dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

**Check 4: Network Issues?**
- Check internet connection
- Try different network
- Check firewall settings

### Messages Not Streaming

**Solution 1: Clear Cache**
```bash
# Clear browser cache
# Or use incognito mode
```

**Solution 2: Check Browser**
- Use Chrome/Edge (best support)
- Update to latest version
- Disable extensions that might block requests

### Model Not Available

**Check Plan Limits:**
- Free plan: GPT-3.5 only
- Basic: Most models except GPT-4
- Pro/Premium: All models

**Solution:**
- Switch to allowed model
- Or upgrade plan in `/pricing`

---

## 💳 Payment Issues

### Razorpay Modal Won't Open

**Check 1: Script Loaded?**
- Open browser console (F12)
- Look for Razorpay errors
- Check network tab

**Check 2: Keys Correct?**
```env
# In .env.local:
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_... (or rzp_live_...)
RAZORPAY_KEY_SECRET=...
```

**Check 3: Test Mode?**
- Use test keys for development
- Use live keys for production
- Don't mix test and live keys

### Payment Verification Failed

**Check Webhook:**
- Razorpay Dashboard → Webhooks
- Verify webhook URL is correct
- Check webhook secret matches
- Look at webhook logs

**Check Signature:**
- Verify RAZORPAY_KEY_SECRET is correct
- Check no extra spaces in .env.local
- Restart server after changing keys

### Test Payment Not Working

**Use Test Cards:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

---

## 🎨 UI/Animation Issues

### Animations Laggy

**Solution 1: Check Browser**
- Use Chrome/Edge for best performance
- Update to latest version
- Close other tabs

**Solution 2: Check Device**
- Animations optimized for 120Hz displays
- Will run at 60fps on standard displays
- Mobile may have reduced performance

**Solution 3: Reduce Complexity**
```tsx
// In components, reduce duration:
transition={{ duration: 0.2 }}
// Instead of:
transition={{ duration: 0.5 }}
```

### Components Not Styled

**Check Tailwind:**
```bash
# Verify tailwind.config.ts exists
# Check app/globals.css has:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# Restart dev server
npm run dev
```

### Dark Theme Not Working

**Check:**
- Browser DevTools (F12)
- Console for errors
- Verify globals.css loaded
- Try hard refresh (Ctrl+Shift+R)

---

## 📱 Mobile/Android Issues

### Capacitor Build Fails

**Solution 1: Clean Build**
```bash
cd android
./gradlew clean
cd ..
npm run build
npx cap sync
```

**Solution 2: Android Studio Issues**
- Update Android Studio
- Update Gradle
- Sync project with Gradle files
- Invalidate caches & restart

**Solution 3: Java Version**
```bash
# Need JDK 17+
java -version

# If wrong version, update JDK
# Then restart Android Studio
```

### APK Won't Install

**Check:**
- Enable "Install from unknown sources"
- Check APK is for correct architecture
- Try uninstalling old version first
- Check storage space available

### App Crashes on Launch

**Check Logs:**
```bash
# Android Studio → Logcat
# Or use adb:
adb logcat | grep -i "error\|exception"
```

**Common Fixes:**
- Clear app data
- Reinstall app
- Check AndroidManifest.xml permissions
- Verify capacitor.config.ts is correct

---

## 🗄️ Database Issues

### Supabase Connection Failed

**Check:**
```env
# In .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Verify URL has https://
# Verify keys are correct (no extra spaces)
```

**Check RLS:**
- Go to Supabase → Authentication
- Verify Row Level Security policies
- Check policies allow user operations

### Data Not Saving

**Currently:**
- App uses localStorage by default
- Supabase is optional
- Enable Supabase to sync across devices

**To Enable:**
1. Get Supabase keys
2. Add to `.env.local`
3. Run SQL migrations from README
4. Restart dev server

---

## 🔐 Authentication Issues

### NextAuth Not Working

**Check Configuration:**
```env
NEXTAUTH_SECRET=... (generate with: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000 (or your domain)
```

**Check Providers:**
- Google: Verify client ID & secret
- GitHub: Verify client ID & secret
- Credentials: Check user data format

### Session Not Persisting

**Check:**
- Browser cookies enabled
- No ad blockers interfering
- Same domain for API and app
- NextAuth version correct (v5)

---

## 🚀 Deployment Issues

### Vercel Build Fails

**Check Build Logs:**
- Look for specific error
- Check environment variables set
- Verify all dependencies installed

**Common Issues:**
```bash
# TypeScript errors
npm run build
# Fix all errors shown

# Missing dependencies
npm install

# Wrong Node version
# Vercel uses Node 18+ by default
```

### Environment Variables Not Working

**Check:**
- All required vars added in Vercel
- No typos in variable names
- Public vars start with NEXT_PUBLIC_
- Redeploy after adding vars

### API Routes 404

**Check:**
- Routes in `app/api/` folder
- File named `route.ts` (not `route.tsx`)
- Exported POST/GET functions
- Correct Next.js version (15+)

---

## 📊 Performance Issues

### Slow First Load

**Solutions:**
- Use Vercel Edge Network (auto)
- Enable Next.js Image optimization
- Reduce bundle size
- Use dynamic imports

### High Memory Usage

**Check:**
- Close unused conversations
- Clear localStorage periodically
- Limit stored messages
- Use pagination for history

---

## 🔍 Debugging Tips

### Enable Verbose Logging

**Browser Console:**
```javascript
// In browser console:
localStorage.setItem('debug', '*')
// Reload page
```

**Check Network Requests:**
- F12 → Network tab
- Watch API calls
- Check status codes
- View request/response

### Check Environment

```bash
# List all env vars (bash)
printenv | grep -i openrouter

# Windows PowerShell
Get-ChildItem Env: | Where-Object {$_.Name -like "*OPENROUTER*"}

# Check in app:
console.log(process.env.OPENROUTER_API_KEY)
# Should show: sk-or-v1-... (not undefined)
```

---

## 🆘 Still Having Issues?

### Steps to Get Help:

1. **Check Console Errors**
   - F12 → Console
   - Screenshot errors
   
2. **Check Network Tab**
   - F12 → Network
   - Look for failed requests
   
3. **Check Environment**
   - Verify all required vars set
   - No typos, extra spaces
   
4. **Try Clean Install**
   ```bash
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

5. **Create Issue**
   - Include error messages
   - Include steps to reproduce
   - Include environment (OS, Node version, etc.)

---

## ✅ Quick Fixes Checklist

Try these in order:

- [ ] Restart dev server
- [ ] Clear browser cache
- [ ] Check .env.local file exists and has correct values
- [ ] Run `npm install`
- [ ] Delete node_modules and reinstall
- [ ] Try incognito/private browsing
- [ ] Check browser console for errors
- [ ] Verify API keys are active
- [ ] Check internet connection
- [ ] Update Node.js to latest LTS
- [ ] Update all dependencies: `npm update`

---

## 📝 Most Common Issues

1. **API Key not set** → Add to .env.local
2. **No credits** → Add credits to OpenRouter
3. **Port in use** → Use different port or kill process
4. **Cache issues** → Clear cache or use incognito
5. **Dependencies missing** → Run npm install

---

**90% of issues are solved by:**
- Checking .env.local is correct
- Restarting the dev server
- Clearing browser cache

**Try these first!**
