# BugHunter Lab 🕸️

একটি আধুনিক ওয়েব-ভিত্তিক SQL Injection vulnerability scanner যা ৩০ সেকেন্ডে দুর্বলতা সনাক্ত করে।

## ✨ Features

- **দ্রুত স্ক্যান**: ৩০ সেকেন্ডের মধ্যে SQL Injection দুর্বলতা সনাক্তকরণ
- **বিস্তারিত রিপোর্ট**: Database schema, dumped data, XSS এবং defacement analysis
- **লাইভ লগিং**: Real-time scanning process দেখা
- **মোবাইল-ফ্রেন্ডলি**: Responsive design সব ডিভাইসের জন্য
- **এক্সপোর্ট অপশন**: PDF, JSON এবং CSV ফরম্যাটে রিপোর্ট ডাউনলোড

## 🚀 GitHub Pages এ Deploy করুন

### ১. Repository Setup

```bash
# Repository clone করুন
git clone https://github.com/yourusername/bughunter-lab.git
cd bughunter-lab

# Dependencies install করুন
cd frontend
npm install
```

### ২. Configuration Update

`frontend/package.json` এ `homepage` field আপডেট করুন:

```json
{
  "homepage": "https://yourusername.github.io/bughunter-lab"
}
```

### ৩. Manual Deployment

```bash
# Build এবং deploy
cd frontend
npm run build
npm run deploy
```

### ৪. Automatic Deployment (GitHub Actions)

1. GitHub repository এ push করুন
2. GitHub Pages settings এ যান: `Settings > Pages`
3. Source হিসেবে "GitHub Actions" সিলেক্ট করুন
4. Main branch এ push করলে automatic deploy হবে

## 🛠️ Local Development

```bash
# Development server শুরু করুন
cd frontend
npm run dev

# Browser এ http://localhost:3000 এ যান
```

## 📁 Project Structure

```
bughunter-lab/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── dist/               # Build output
├── backend/                 # FastAPI backend (optional)
├── .github/workflows/       # GitHub Actions
└── README.md
```

## 🎯 Usage

1. **URL Input**: Target URL পেস্ট করুন (যেমন: `https://vuln-site.com/product.php?id=1`)
2. **Quick Scan**: "Start Quick Scan" বাটনে ক্লিক করুন
3. **Live Monitoring**: Real-time scan progress দেখুন
4. **Results Analysis**: বিস্তারিত vulnerability report পান
5. **Export**: রিপোর্ট PDF/JSON/CSV ফরম্যাটে ডাউনলোড করুন

## ⚠️ Legal Disclaimer

এই টুলটি **শুধুমাত্র শিক্ষামূলক** এবং **অনুমোদিত নিরাপত্তা পরীক্ষার** জন্য। 

- ✅ নিজের ওয়েবসাইট টেস্ট করা
- ✅ অনুমতি নিয়ে security assessment
- ✅ Bug bounty programs
- ❌ অননুমোদিত scanning
- ❌ ক্ষতিকর উদ্দেশ্যে ব্যবহার

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Animation**: Framer Motion
- **Build Tool**: Vite
- **Deployment**: GitHub Pages + GitHub Actions
- **Backend** (Optional): FastAPI + Python

## 🌟 Features Coming Soon

- [ ] অথেন্টিকেটেড স্ক্যানিং (cookies/headers)
- [ ] XSS এবং SSTI detection
- [ ] Chrome extension
- [ ] Advanced WAF bypass techniques
- [ ] Community payload contributions

## 📞 Support

কোনো সমস্যা বা প্রশ্ন থাকলে GitHub Issues এ জানান।

## 📄 License

MIT License - দেখুন [LICENSE](LICENSE) ফাইল।

---

**Made with ❤️ for the security community**