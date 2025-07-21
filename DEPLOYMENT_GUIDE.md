# 🚀 BugHunter Lab - GitHub Pages Deployment Guide

এই গাইড অনুসরণ করে আপনি সহজেই BugHunter Lab আপনার GitHub Pages এ deploy করতে পারবেন।

## 📋 Prerequisites

- GitHub অ্যাকাউন্ট
- Node.js (version 18+)
- Git

## 🛠️ Step-by-Step Deployment

### ১. Repository Setup

```bash
# GitHub এ নতুন repository তৈরি করুন (bughunter-lab নামে)
# তারপর আপনার local machine এ:

git clone https://github.com/yourusername/bughunter-lab.git
cd bughunter-lab

# এই project files গুলো আপনার repository তে copy করুন
```

### ২. Configuration Update

#### A. Package.json এ homepage URL আপডেট করুন:

```bash
cd frontend
```

`frontend/package.json` ফাইলে:
```json
{
  "homepage": "https://yourusername.github.io/bughunter-lab"
}
```

**Important**: `yourusername` কে আপনার actual GitHub username দিয়ে replace করুন।

#### B. Vite Config check করুন:

`frontend/vite.config.ts` এ base path ঠিক আছে কিনা দেখুন:
```typescript
base: process.env.NODE_ENV === 'production' ? '/bughunter-lab/' : '/',
```

### ৩. Local Test

```bash
# Dependencies install করুন
npm install

# Local development server test করুন
npm run dev

# Build test করুন
npm run build
```

### ৪. GitHub Pages Setup

#### Method 1: Manual Deployment

```bash
# Build এবং deploy
npm run deploy
```

#### Method 2: Automatic Deployment (Recommended)

1. **GitHub Repository Settings**: 
   - Repository > Settings > Pages
   - Source: "GitHub Actions" select করুন

2. **Push your code**:
```bash
git add .
git commit -m "Initial BugHunter Lab deployment"
git push origin main
```

3. **GitHub Actions automatically deploy করবে**

### ৫. Custom Domain (Optional)

যদি আপনার নিজস্ব domain থাকে:

1. `frontend/public/CNAME` ফাইল তৈরি করুন:
```
bughunter-lab.yourdomain.com
```

2. DNS settings এ CNAME record add করুন:
```
bughunter-lab.yourdomain.com → yourusername.github.io
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. **404 Error after deployment**
- `homepage` URL ঠিক আছে কিনা check করুন
- Repository name আর URL match করছে কিনা দেখুন

#### 2. **CSS/JS files loading issue**
- Vite config এর `base` path check করুন
- Browser cache clear করুন

#### 3. **GitHub Actions fail**
- `.github/workflows/deploy.yml` ফাইল সঠিক জায়গায় আছে কিনা দেখুন
- Repository এর Actions tab এ error logs check করুন

#### 4. **Local development works but production doesn't**
- Environment variables check করুন
- Production build locally test করুন: `npm run build && npm run preview`

## 📱 Mobile Testing

Deploy করার পর mobile device এ test করুন:
- Responsive design
- Touch interactions
- Loading speed

## 🔒 Security Considerations

Deploy করার আগে:
- ✅ কোনো sensitive data আছে কিনা check করুন
- ✅ API keys বা secrets expose হয়নি কিনা দেখুন
- ✅ Legal disclaimer properly displayed হচ্ছে কিনা verify করুন

## 📊 Performance Optimization

GitHub Pages এর জন্য optimized performance:

```bash
# Build optimization check
npm run build
# Check bundle size in dist/ folder
```

Expected bundle sizes:
- Main CSS: ~16KB (gzipped: ~3.5KB)
- Main JS: ~22KB (gzipped: ~8KB)
- Vendor JS: ~140KB (gzipped: ~45KB)
- Motion JS: ~102KB (gzipped: ~34KB)

## 🌟 Post-Deployment Checklist

- [ ] Site loads properly at `https://yourusername.github.io/bughunter-lab`
- [ ] All pages (Landing, Scan, Results) work correctly
- [ ] Mobile responsive design works
- [ ] Scan simulation completes successfully
- [ ] Export functionality works
- [ ] Legal disclaimer is visible
- [ ] No console errors

## 📈 Analytics (Optional)

Google Analytics বা similar service add করতে চাইলে:

1. `frontend/index.html` এ tracking code add করুন
2. Privacy policy update করুন

## 🔄 Updates & Maintenance

নতুন features add করতে:

```bash
# Local development
npm run dev

# Changes করার পর
git add .
git commit -m "Feature: new feature description"
git push origin main

# GitHub Actions automatically deploy করবে
```

## 📞 Support

সমস্যা হলে:
1. GitHub Issues check করুন
2. Browser console logs দেখুন
3. GitHub Actions logs check করুন

---

**🎉 Congratulations! আপনার BugHunter Lab এখন live!**

Access URL: `https://yourusername.github.io/bughunter-lab`