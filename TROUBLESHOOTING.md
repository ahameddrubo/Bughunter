# 🚨 BugHunter Lab - Deployment Troubleshooting Guide

## সাইট show না হওয়ার সমাধান

### 🔍 Step 1: Repository Setup Check

#### A. Repository Name Check করুন:
```bash
# আপনার repository name এবং URL match করছে কিনা দেখুন
# Repository name: bughunter-lab
# Expected URL: https://yourusername.github.io/bughunter-lab
```

#### B. Files সঠিক জায়গায় আছে কিনা:
```bash
# Repository structure এইরকম হতে হবে:
your-repo/
├── .github/workflows/deploy.yml
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── README.md
└── deploy.sh
```

### 🔍 Step 2: GitHub Pages Settings

1. **GitHub এ যান**: Repository > Settings > Pages
2. **Source**: "GitHub Actions" selected আছে কিনা check করুন
3. **Branch**: main branch থেকে deploy হচ্ছে কিনা দেখুন

### 🔍 Step 3: GitHub Actions Status

#### A. Actions Tab Check করুন:
1. Repository > Actions tab এ যান
2. Latest workflow run status দেখুন
3. Red ❌ থাকলে error আছে, Green ✅ থাকলে successful

#### B. Workflow Logs দেখুন:
```
1. Failed action এ click করুন
2. "build-and-deploy" job expand করুন  
3. Error messages পড়ুন
```

### 🔧 Step 4: Common Fixes

#### Fix 1: Package.json Homepage URL Update

`frontend/package.json` এ:
```json
{
  "name": "bughunter-lab-frontend",
  "homepage": "https://YOUR_ACTUAL_USERNAME.github.io/YOUR_ACTUAL_REPO_NAME"
}
```

**Important**: `YOUR_ACTUAL_USERNAME` এবং `YOUR_ACTUAL_REPO_NAME` দিয়ে replace করুন!

#### Fix 2: Vite Config Base Path

`frontend/vite.config.ts` এ:
```typescript
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/YOUR_ACTUAL_REPO_NAME/' : '/',
  // ... rest of config
})
```

#### Fix 3: GitHub Actions Workflow File

`.github/workflows/deploy.yml` check করুন:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]  # অথবা master যদি সেটাই আপনার default branch

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: './frontend/package-lock.json'

    - name: Install dependencies
      run: |
        cd frontend
        npm ci

    - name: Build
      run: |
        cd frontend
        npm run build

    - name: Setup Pages
      uses: actions/configure-pages@v3

    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: './frontend/dist'

    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

### 🛠️ Step 5: Manual Fix Commands

#### Terminal এ এই commands run করুন:

```bash
# 1. Repository clone করুন (যদি আগে না করে থাকেন)
git clone https://github.com/yourusername/bughunter-lab.git
cd bughunter-lab

# 2. Configuration fix করুন
cd frontend

# 3. Package.json এ সঠিক homepage URL দিন
# Example: যদি আপনার username "john" এবং repo "bughunter-lab" হয়
# তাহলে: "homepage": "https://john.github.io/bughunter-lab"

# 4. Dependencies install করুন
npm install

# 5. Local test করুন
npm run build

# 6. Changes commit করুন
cd ..
git add .
git commit -m "Fix: GitHub Pages configuration"
git push origin main
```

### 🔍 Step 6: Alternative Deployment Method

যদি GitHub Actions কাজ না করে, manual deployment try করুন:

```bash
# Terminal এ:
cd frontend
npm install
npm run build

# gh-pages package install করুন (যদি না থাকে)
npm install -g gh-pages

# Manual deploy করুন
npm run deploy
```

### 🔍 Step 7: Check URL Pattern

সঠিক URL pattern:
```
✅ https://yourusername.github.io/repository-name
❌ https://yourusername.github.io (শুধু username দিয়ে হবে না)
❌ https://github.com/yourusername/repository-name (এটা repository page, deployed site না)
```

### 🔍 Step 8: Browser & Cache Issues

1. **Different Browser**: Chrome, Firefox, Safari এ try করুন
2. **Incognito/Private Mode**: Cache issue avoid করতে
3. **Hard Refresh**: Ctrl+F5 (Windows) বা Cmd+Shift+R (Mac)
4. **Clear Browser Cache**: Completely clear করুন

### 🔍 Step 9: Wait Time

- **GitHub Pages deployment**: 5-10 minutes সময় লাগতে পারে
- **DNS propagation**: First time deployment এ 10-20 minutes
- **Action complete হওয়ার পর**: 2-5 minutes wait করুন

### 📱 Step 10: Test Different URLs

Try these URL patterns:
```bash
# Primary URL
https://yourusername.github.io/bughunter-lab

# Index file directly  
https://yourusername.github.io/bughunter-lab/index.html

# Check if files uploaded
https://yourusername.github.io/bughunter-lab/assets/
```

### 🚨 Emergency Quick Fix

যদি কিছুতেই কাজ না করে:

#### Option 1: Simple HTML Deployment
```bash
# ১. frontend/dist/ folder এর সব files
# ২. Repository root এ copy করুন
# ৩. Push করুন
# ৪. Settings > Pages > Source: "Deploy from a branch" > main > root
```

#### Option 2: Netlify Alternative
```bash
# ১. netlify.com এ account তৈরি করুন
# ২. frontend/dist folder drag & drop করুন
# ৩. Instant deployment!
```

### 📞 Debug Information Collection

সমস্যা persist করলে এই information collect করুন:

1. **GitHub Username**: 
2. **Repository Name**: 
3. **Expected URL**: 
4. **GitHub Actions Status**: ✅/❌
5. **Error Message** (যদি থাকে):
6. **Browser & Version**:
7. **কতক্ষণ wait করেছেন**:

### 📋 Final Checklist

- [ ] Repository name সঠিক
- [ ] Files সঠিক structure এ আছে  
- [ ] package.json এ homepage URL correct
- [ ] vite.config.ts এ base path correct
- [ ] GitHub Actions successful (green checkmark)
- [ ] GitHub Pages enabled in settings
- [ ] 10+ minutes wait করেছি
- [ ] Different browser/incognito mode try করেছি
- [ ] URL exactly correct type করেছি

---

## 💡 Pro Tips:

1. **GitHub Actions Logs সবসময় check করুন** - এইখানে exact error পাবেন
2. **Repository public থাকতে হবে** (free GitHub Pages এর জন্য)
3. **main branch থেকে deploy করুন** - master নয়
4. **Case-sensitive URLs** - exact spelling important

এই steps follow করার পর যদি এখনও সমস্যা থাকে, আমাকে specific error message বা GitHub Actions logs দিন।