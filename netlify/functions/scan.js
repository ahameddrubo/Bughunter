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

    // Rate limiting check (basic)
    const clientIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'];
    console.log(`Scan request from IP: ${clientIP} for URL: ${targetUrl}`);

    // Simulated SQL injection scan
    const scanResult = await performSQLiScan(targetUrl);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(scanResult)
    };
  } catch (error) {
    console.error('Scan error:', error);
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
  const startTime = Date.now();
  
  // Simulate scanning steps
  const steps = [
    { step: 0, message: 'URL ভ্যালিডেশন চলছে...', delay: 500 },
    { step: 1, message: 'SQL Injection প্রোব শুরু...', delay: 1000 },
    { step: 2, message: 'কলাম সংখ্যা নির্ণয়...', delay: 800 },
    { step: 3, message: 'দুর্বল কলাম সনাক্তকরণ...', delay: 700 }
  ];

  // Simulate network delays
  for (const stepInfo of steps) {
    await new Promise(resolve => setTimeout(resolve, stepInfo.delay));
  }
  
  // Basic vulnerability detection (simulation)
  const urlParams = new URL(url).searchParams;
  const hasVulnerableParams = Array.from(urlParams.keys()).some(key => 
    ['id', 'user', 'page', 'cat', 'item'].includes(key.toLowerCase())
  );
  
  const isVulnerable = hasVulnerableParams && Math.random() > 0.2; // 80% chance if has vulnerable params
  
  const result = {
    scanId: generateUUID(),
    targetUrl: url,
    status: isVulnerable ? 'VULNERABLE' : 'NOT VULNERABLE',
    scanTime: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    findings: isVulnerable ? {
      columnCount: Math.floor(Math.random() * 5) + 2, // 2-6 columns
      vulnerableColumns: [2, 3],
      databaseType: ['MySQL', 'PostgreSQL', 'MSSQL'][Math.floor(Math.random() * 3)],
      payloads: [
        "' OR 1=1--",
        "\" OR 1=1--", 
        "1 UNION SELECT NULL,NULL,NULL--",
        "1' AND SLEEP(5)--",
        "1\" AND SLEEP(5)--"
      ],
      riskLevel: 'HIGH',
      details: {
        injectionPoint: Array.from(urlParams.keys())[0],
        dbmsFingerprint: `Database detected via error messages`,
        additionalInfo: 'Multiple injection vectors found'
      }
    } : {
      testedParams: Array.from(urlParams.keys()),
      payloadsTested: 15,
      message: 'No SQL injection vulnerabilities detected'
    }
  };
  
  return result;
}

function generateUUID() {
  return 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}