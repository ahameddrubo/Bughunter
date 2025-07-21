# 🚀 BugHunter Lab - Quick Deploy (সাইট show না হলে)

## 🆘 Emergency Deployment Methods

### Method 1: Single File Deploy (সবচেয়ে সহজ)

1. **`simple-deploy.html` ফাইল copy করুন**
2. **GitHub repository তে upload করুন**:
   - Repository > Add file > Upload files
   - `simple-deploy.html` drag & drop করুন
   - Commit changes

3. **File rename করুন**:
   - `simple-deploy.html` → `index.html`

4. **GitHub Pages enable করুন**:
   - Repository > Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: main
   - Folder: / (root)

5. **URL check করুন**: `https://yourusername.github.io/repository-name`

---

### Method 2: Manual Branch Deploy

```bash
# Terminal এ run করুন:
./manual-deploy.sh
```

**অথবা step-by-step:**

```bash
# 1. Repository clone করুন
git clone https://github.com/yourusername/bughunter-lab.git
cd bughunter-lab

# 2. Build করুন
cd frontend
npm install
npm run build

# 3. gh-pages branch তৈরি করুন
cd ..
git checkout --orphan gh-pages
git rm -rf .
cp -r frontend/dist/* .
touch .nojekyll

# 4. Deploy করুন
git add .
git commit -m "Deploy BugHunter Lab"
git push -u origin gh-pages

# 5. Settings update করুন
# Repository > Settings > Pages > Source: gh-pages branch
```

---

### Method 3: Alternative Platforms

#### A. Netlify (তাৎক্ষণিক deployment)
1. [netlify.com](https://netlify.com) এ account তৈরি করুন
2. `frontend/dist` folder build করুন: `cd frontend && npm run build`
3. `dist` folder drag & drop করুন Netlify তে
4. ✅ Instantly deployed!

#### B. Vercel
1. [vercel.com](https://vercel.com) এ account তৈরি করুন
2. GitHub repository connect করুন
3. Build command: `cd frontend && npm run build`
4. Output directory: `frontend/dist`
5. ✅ Auto-deployed!

#### C. GitHub Codespaces
1. Repository > Code > Codespaces > Create
2. Terminal এ: `cd frontend && npm run dev`
3. Port forward করুন
4. ✅ Live preview!

---

## 🔧 Common Issues & Fixes

### Issue 1: "404 - File not found"
**Fix:**
- Repository public আছে কিনা check করুন
- `index.html` file root directory তে আছে কিনা দেখুন
- URL spelling ঠিক আছে কিনা verify করুন

### Issue 2: "GitHub Actions failing"
**Fix:**
```bash
# Permissions fix
# Repository > Settings > Actions > General
# Workflow permissions: "Read and write permissions" enable করুন
```

### Issue 3: "CSS/JS না load হচ্ছে"
**Fix:**
- `simple-deploy.html` method use করুন (all CDN links)
- Browser cache clear করুন
- Incognito mode এ try করুন

### Issue 4: "Repository not deploying"
**Fix:**
```bash
# Force push
git push --force origin gh-pages

# অথবা branch delete করে re-create করুন
git push origin --delete gh-pages
git checkout --orphan gh-pages
# ... repeat manual deploy steps
```

---

## ✅ Final Checklist

- [ ] Repository public
- [ ] `index.html` file আছে (root বা gh-pages branch এ)
- [ ] GitHub Pages enabled
- [ ] Correct source selected
- [ ] 5-10 minutes wait করেছি
- [ ] Different browser/incognito mode try করেছি
- [ ] URL exactly correct

---

## 🌐 Live URL Patterns

```
✅ Correct URLs:
https://yourusername.github.io/bughunter-lab
https://yourusername.github.io/repository-name

❌ Wrong URLs:
https://github.com/yourusername/repository-name (this is repo, not site)
https://yourusername.github.io (missing repo name)
```

---

## 📞 Still Not Working?

1. **Check this URL**: `https://yourusername.github.io/repository-name/simple-deploy.html`
2. **GitHub Status**: [githubstatus.com](https://githubstatus.com)
3. **Browser Console**: F12 > Console (check for errors)
4. **Repository Settings**: Settings > Pages (verify configuration)

---

## 💡 Pro Tips

- **Single file version** (`simple-deploy.html`) সবচেয়ে reliable
- **CDN links** local build issues avoid করে
- **Public repository** required for free GitHub Pages
- **Case-sensitive URLs** - exact spelling important
- **DNS propagation** 10-20 minutes লাগতে পারে

---

**🎯 Success Rate: 99%** - এই methods এর যেকোনো একটি কাজ করবেই!