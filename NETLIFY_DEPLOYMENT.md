# 🚀 BugHunter Lab - Netlify Deployment Guide

## 🤔 Netlify এ Backend কাজ করে?

### ❌ Traditional Backend (কাজ করবে না):
- Express.js server
- FastAPI server  
- Persistent database connections
- Long-running processes
- WebSocket servers

### ✅ Netlify এ যা কাজ করে:
- **Static Frontend** (React app)
- **Netlify Functions** (serverless API)
- **External API calls**
- **Client-side JavaScript**
- **Edge Functions**

---

## 🔧 BugHunter Lab Netlify Solutions

### Option 1: Client-Side Only (সবচেয়ে সহজ)
- সব scanning logic frontend এ
- Mock data ব্যবহার করুন
- Real scanning এর জন্য external API

### Option 2: Netlify Functions (Recommended)
- Serverless functions ব্যবহার করুন
- Basic scanning logic implement করুন
- Rate limiting add করুন

### Option 3: External API Integration
- Third-party security APIs
- Own backend server (Heroku, Railway)
- Hybrid approach

---

## 📁 Project Structure (Netlify)

```
bughunter-lab/
├── netlify/
│   └── functions/
│       ├── scan.js          # SQL injection scanner
│       ├── validate.js      # URL validation
│       └── report.js        # Report generation
├── frontend/
│   ├── src/
│   └── dist/
├── netlify.toml             # Netlify configuration
└── package.json
```

---

## 🛠️ Netlify Function Implementation

### netlify/functions/scan.js
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { targetUrl } = JSON.parse(event.body);
    
    // Basic URL validation
    if (!targetUrl || !targetUrl.includes('?')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid URL. Must contain query parameters.' 
        })
      };
    }

    // Simulated SQL injection scan
    const scanResult = await performSQLiScan(targetUrl);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(scanResult)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

async function performSQLiScan(url) {
  // Simulated scanning logic
  const startTime = Date.now();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Basic vulnerability detection simulation
  const isVulnerable = Math.random() > 0.3; // 70% chance of vulnerability
  
  const result = {
    scanId: generateUUID(),
    targetUrl: url,
    status: isVulnerable ? 'VULNERABLE' : 'NOT VULNERABLE',
    scanTime: Date.now() - startTime,
    findings: isVulnerable ? {
      columnCount: 3,
      vulnerableColumns: [2, 3],
      databaseType: 'MySQL',
      payloads: [
        "' OR 1=1--",
        "\" OR 1=1--",
        "1 UNION SELECT NULL,NULL,NULL--"
      ],
      riskLevel: 'HIGH'
    } : null,
    timestamp: new Date().toISOString()
  };
  
  return result;
}

---

## 🚀 Netlify Deployment Steps

### Step 1: Repository Preparation
```bash
# Ensure these files exist:
netlify.toml              # Netlify configuration
netlify/functions/scan.js  # Serverless function
frontend/                  # React app
```

### Step 2: Netlify Deployment

#### Option A: Git-based Deployment (Recommended)
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Netlify functions"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - "New site from Git"
   - Connect GitHub repository
   - Build settings will auto-detect from `netlify.toml`

3. **Deploy Settings**:
   ```
   Build command: cd frontend && npm install && npm run build
   Publish directory: frontend/dist
   Functions directory: netlify/functions
   ```

#### Option B: Manual Upload
1. **Build locally**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Upload to Netlify**:
   - Drag & drop `frontend/dist` folder
   - Upload `netlify` folder separately
   - Configure functions in dashboard

### Step 3: Environment Variables (Optional)
```bash
# Netlify Dashboard > Site settings > Environment variables
SCAN_RATE_LIMIT=10
API_TIMEOUT=30000
ALLOWED_DOMAINS=*
```

### Step 4: Custom Domain (Optional)
```bash
# netlify.toml এ add করুন:
[[redirects]]
  from = "https://bughunter-lab.netlify.app/*"
  to = "https://yourdomain.com/:splat"
  status = 301
```

---

## 🔗 API Endpoints (After Deployment)

```
Frontend: https://your-app.netlify.app
Scan API: https://your-app.netlify.app/.netlify/functions/scan

# POST request example:
curl -X POST https://your-app.netlify.app/.netlify/functions/scan \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://example.com/page.php?id=1"}'
```

---

## ⚡ Performance & Limitations

### Netlify Functions Limits:
- **Execution time**: 10 seconds (free), 15 minutes (pro)
- **Memory**: 1008 MB
- **Invocations**: 125K/month (free), unlimited (pro)
- **Cold starts**: ~100-500ms

### Optimizations:
```javascript
// Keep functions warm
exports.handler = async (event, context) => {
  // Add warming logic
  if (event.httpMethod === 'GET' && event.path === '/health') {
    return { statusCode: 200, body: 'OK' };
  }
  // ... rest of function
};
```

---

## 🛡️ Security Considerations

### Rate Limiting:
```javascript
// In scan.js function
const rateLimit = require('lambda-rate-limiter');
const limiter = rateLimit({
  interval: 60000, // 1 minute
  uniqueTokenPerInterval: 100 // 100 unique IPs per minute
});

exports.handler = async (event, context) => {
  try {
    await limiter.check(10, event.headers['x-forwarded-for']); // 10 requests per IP per minute
    // ... scanning logic
  } catch (error) {
    return {
      statusCode: 429,
      body: JSON.stringify({ error: 'Rate limit exceeded' })
    };
  }
};
```

### Input Validation:
```javascript
function validateUrl(url) {
  try {
    const parsedUrl = new URL(url);
    
    // Block localhost/private IPs
    if (['localhost', '127.0.0.1', '0.0.0.0'].includes(parsedUrl.hostname)) {
      throw new Error('Local URLs not allowed');
    }
    
    // Block private networks
    if (parsedUrl.hostname.match(/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/)) {
      throw new Error('Private network URLs not allowed');
    }
    
    return true;
  } catch (error) {
    return false;
  }
}
```

---

## 🔄 Alternative Backend Solutions

### Option 1: Hybrid Approach
- Frontend: Netlify
- Backend: Railway/Heroku
- Database: PlanetScale/Supabase

### Option 2: External APIs
```javascript
// Use existing security APIs
const scanUrl = async (targetUrl) => {
  const response = await fetch('https://api.securityscanner.com/scan', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SECURITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: targetUrl })
  });
  
  return response.json();
};
```

### Option 3: Edge Functions
```javascript
// netlify/edge-functions/scan.js
export default async (request, context) => {
  // Runs at CDN edge
  // Lower latency
  // Limited compute
};
```

---

## 📊 Monitoring & Analytics

### Function Logs:
```javascript
console.log('Scan request:', { 
  ip: event.headers['x-forwarded-for'],
  url: targetUrl,
  timestamp: new Date().toISOString()
});
```

### Error Tracking:
```javascript
// Install: npm install @netlify/functions
const { schedule } = require('@netlify/functions');

exports.handler = schedule('0 */6 * * *', async (event, context) => {
  // Health check every 6 hours
  console.log('Health check executed');
});
```

---

## 🎯 Deployment Checklist

- [ ] `netlify.toml` configured
- [ ] Netlify functions created
- [ ] Frontend build successful
- [ ] Repository connected to Netlify
- [ ] Environment variables set (if needed)
- [ ] Functions testing successful
- [ ] Rate limiting implemented
- [ ] Error handling added
- [ ] Monitoring set up

---

**✅ Result**: Functional BugHunter Lab with serverless backend on Netlify!