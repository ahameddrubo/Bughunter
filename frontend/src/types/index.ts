export type ScanStatus = 'pending' | 'scanning' | 'paused' | 'completed' | 'error';

export type LogType = 'info' | 'success' | 'warning' | 'error' | 'probe';

export interface ScanLog {
  timestamp: string;
  message: string;
  type: LogType;
  payload?: string;
}

export interface SystemInfo {
  dbms: string;
  dbmsVersion: string;
  os: string;
}

export interface TableData {
  [key: string]: string | number;
}

export interface DatabaseTable {
  name: string;
  columns: string[];
  dumpedData?: TableData[];
}

export interface DatabaseSchema {
  name: string;
  tables: DatabaseTable[];
}

export interface XSSPayload {
  name: string;
  value: string;
}

export interface SQLPayload {
  name: string;
  value: string;
}

export interface ScanResult {
  status: 'VULNERABLE' | 'NOT VULNERABLE' | 'POTENTIAL';
  columnCount: number;
  vulnerableColumns: number[];
  databaseNames?: string[];
  systemInfo?: SystemInfo;
  fullDatabaseSchema?: DatabaseSchema[];
  xssVulnerable: boolean;
  xssPayloadsFound?: XSSPayload[];
  defacementPossible: boolean;
  defacementMethod?: string;
  defacementPayloadExample?: string;
  payloads: SQLPayload[];
  requestResponse: string;
}

export interface AppState {
  currentPage: 'landing' | 'scan' | 'report';
  targetUrl: string;
  scanId: string | null;
  scanLogs: ScanLog[];
  scanStatus: ScanStatus;
  scanResult: ScanResult | null;
  currentStep: number;
}

export interface NavigationParams {
  scanId?: string;
}