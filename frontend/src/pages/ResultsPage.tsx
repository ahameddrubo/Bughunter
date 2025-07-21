import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppState, NavigationParams } from '../types';
import { getStatusColor, copyToClipboard, generateExportFilename } from '../utils';

interface ResultsPageProps {
  appState: AppState;
  navigateTo: (page: AppState['currentPage'], params?: NavigationParams) => void;
  updateAppState: (updates: Partial<AppState>) => void;
  resetScanState: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({
  appState,
  navigateTo,
  resetScanState
}) => {
  const [activeTab, setActiveTab] = useState<'payloads' | 'requestResponse' | 'dbSystemInfo'>('payloads');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'JSON' | 'CSV'>('PDF');

  const { scanResult, scanId } = appState;

  if (!scanResult) {
    return (
      <div className="w-full max-w-md mx-auto">
        <motion.div 
          className="card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-lg text-gray-400 mb-4">কোনো স্ক্যান ফলাফল পাওয়া যায়নি।</p>
          <button
            onClick={() => navigateTo('landing')}
            className="btn-primary"
          >
            নতুন স্ক্যান শুরু করুন
          </button>
        </motion.div>
      </div>
    );
  }

  const handleReScan = () => {
    resetScanState();
    navigateTo('scan');
  };

  const handleExport = () => {
    const filename = generateExportFilename(scanId || 'scan');
    console.log(`Exporting scan ${scanId} as ${exportFormat} with filename: ${filename}`);
    alert(`রিপোর্ট ${exportFormat} ফরম্যাটে এক্সপোর্ট করা হচ্ছে। ফাইলনেম: ${filename}`);
    setShowExportModal(false);
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'VULNERABLE':
        return 'দুর্বল';
      case 'NOT VULNERABLE':
        return 'সুরক্ষিত';
      case 'POTENTIAL':
        return 'সম্ভাব্য';
      default:
        return status;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-2xl font-semibold mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          স্ক্যান ফলাফল
        </motion.h2>

        {/* Summary Card */}
        <motion.div 
          className="bg-background p-4 rounded-md border border-border mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-white font-bold ${getStatusColor(scanResult.status)}`}>
              {getStatusText(scanResult.status)}
            </span>
            <span className="text-sm text-gray-400">স্ক্যান ID: {scanId}</span>
          </div>
          <p className="text-lg mb-2">
            কলাম সংখ্যা: <span className="font-bold text-primary">{scanResult.columnCount}</span>
          </p>
          <p className="text-lg">
            দুর্বল কলাম:
            {scanResult.vulnerableColumns.length > 0 ? (
              scanResult.vulnerableColumns.map((col, index) => (
                <span key={index} className="inline-block bg-error text-white text-xs px-2 py-1 rounded-full ml-2">
                  {col}
                </span>
              ))
            ) : (
              <span className="ml-2 text-gray-400">কোনো দুর্বল কলাম পাওয়া যায়নি।</span>
            )}
          </p>
          {scanResult.status === 'NOT VULNERABLE' && (
            <p className="text-success mt-4 text-center">
              No SQLi detected this time — but keep testing! 0-day happens.
            </p>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex border-b border-border">
            {[
              { key: 'payloads', label: 'পেলোডস' },
              { key: 'requestResponse', label: 'রিকোয়েস্ট/রেসপন্স' },
              { key: 'dbSystemInfo', label: 'ডেটাবেজ ও সিস্টেম তথ্য' }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`flex-1 py-2 text-center font-semibold transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div 
            className="mt-4 bg-background p-4 rounded-md border border-border font-mono text-sm"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'payloads' && (
              <div className="space-y-3">
                {scanResult.payloads.map((payload, index) => (
                  <div key={index} className="bg-surface p-3 rounded-md flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs mb-1">{payload.name}:</p>
                      <p className="text-gray-200 break-all">{payload.value}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(payload.value, 'পেলোড কপি করা হয়েছে!')}
                      className="ml-4 bg-border hover:bg-gray-600 text-gray-200 px-3 py-1 rounded-md text-xs transition-colors duration-200"
                    >
                      কপি
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'requestResponse' && (
              <pre className="whitespace-pre-wrap text-gray-200">
                {scanResult.requestResponse}
              </pre>
            )}

            {activeTab === 'dbSystemInfo' && (
              <div className="space-y-6">
                {/* Database Names */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">ডেটাবেজের নামসমূহ:</h3>
                  {scanResult.databaseNames && scanResult.databaseNames.length > 0 ? (
                    <ul className="space-y-2">
                      {scanResult.databaseNames.map((dbName, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span className="text-gray-200">{dbName}</span>
                          <button
                            onClick={() => copyToClipboard(dbName, 'ডেটাবেজের নাম কপি করা হয়েছে!')}
                            className="bg-border hover:bg-gray-600 text-gray-200 px-3 py-1 rounded-md text-xs"
                          >
                            কপি
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">কোনো ডেটাবেজের নাম পাওয়া যায়নি।</p>
                  )}
                </div>

                {/* System Info */}
                {scanResult.systemInfo && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">সিস্টেম তথ্য:</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">DBMS:</span>
                        <span className="text-gray-200">{scanResult.systemInfo.dbms}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">সংস্করণ:</span>
                        <span className="text-gray-200">{scanResult.systemInfo.dbmsVersion}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">OS:</span>
                        <span className="text-gray-200">{scanResult.systemInfo.os}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Export Options & Re-Scan */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setShowExportModal(true)}
            className="btn-secondary"
          >
            এক্সপোর্ট রিপোর্ট
          </button>
          <button
            onClick={handleReScan}
            className="btn-primary"
          >
            পুনরায় স্ক্যান করুন
          </button>
        </div>
      </motion.div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div 
            className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">রিপোর্ট এক্সপোর্ট করুন</h3>
            <div className="mb-4">
              <label htmlFor="exportFormat" className="block text-gray-400 text-sm font-bold mb-2">
                ফরম্যাট নির্বাচন করুন:
              </label>
              <select
                id="exportFormat"
                className="input-field"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
              >
                <option value="PDF">PDF (স্টাইলড)</option>
                <option value="JSON">JSON (র‍্য)</option>
                <option value="CSV">CSV (শুধুমাত্র সারাংশ)</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowExportModal(false)}
                className="btn-secondary"
              >
                বাতিল করুন
              </button>
              <button
                onClick={handleExport}
                className="btn-primary"
              >
                এক্সপোর্ট
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;