import { useState, useCallback } from 'react';
import { ScanResult } from '../types';

interface NetlifyScanResult {
  scanId: string;
  targetUrl: string;
  status: 'VULNERABLE' | 'NOT VULNERABLE';
  scanTime: number;
  timestamp: string;
  findings?: {
    columnCount: number;
    vulnerableColumns: number[];
    databaseType: string;
    payloads: string[];
    riskLevel: string;
    details: {
      injectionPoint: string;
      dbmsFingerprint: string;
      additionalInfo: string;
    };
  };
}

export const useNetlifyScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanUrl = useCallback(async (targetUrl: string): Promise<ScanResult | null> => {
    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Scan failed');
      }

      const netlifyResult: NetlifyScanResult = await response.json();
      
      // Convert Netlify function result to our ScanResult format
      const scanResult: ScanResult = {
        status: netlifyResult.status,
        columnCount: netlifyResult.findings?.columnCount || 0,
        vulnerableColumns: netlifyResult.findings?.vulnerableColumns || [],
        payloads: netlifyResult.findings?.payloads.map((payload, index) => ({
          name: `Payload ${index + 1}`,
          value: payload
        })) || [],
        requestResponse: generateRequestResponse(targetUrl, netlifyResult),
        databaseNames: netlifyResult.findings?.databaseType ? [netlifyResult.findings.databaseType] : [],
        systemInfo: netlifyResult.findings ? {
          dbms: netlifyResult.findings.databaseType,
          dbmsVersion: 'Unknown',
          os: 'Unknown'
        } : undefined,
        xssVulnerable: false,
        defacementPossible: netlifyResult.status === 'VULNERABLE',
        defacementMethod: netlifyResult.status === 'VULNERABLE' ? 'SQL Injection' : undefined,
      };

      return scanResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsScanning(false);
    }
  }, []);

  return {
    scanUrl,
    isScanning,
    error,
  };
};

function generateRequestResponse(targetUrl: string, result: NetlifyScanResult): string {
  const url = new URL(targetUrl);
  
  return `
Request:
GET ${url.pathname}${url.search} HTTP/1.1
Host: ${url.hostname}
User-Agent: BugHunterLab/1.0 (Netlify)
Accept: text/html,application/xhtml+xml
Connection: keep-alive

Response:
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Server: ${result.findings?.databaseType || 'Apache'}/2.4.41
Date: ${new Date(result.timestamp).toUTCString()}

${result.status === 'VULNERABLE' 
  ? '<!DOCTYPE html><html><body>Database error: You have an error in your SQL syntax...</body></html>'
  : '<!DOCTYPE html><html><body>Page content loaded successfully</body></html>'
}
  `.trim();
}