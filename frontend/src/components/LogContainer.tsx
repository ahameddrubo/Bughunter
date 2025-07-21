import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLog, ScanStatus } from '../types';
import { getLogIcon, highlightPayload } from '../utils';

interface LogContainerProps {
  logs: ScanLog[];
  scanStatus: ScanStatus;
}

const LogContainer: React.FC<LogContainerProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [scrollLock, setScrollLock] = useState(true);
  const [showRawPayloads, setShowRawPayloads] = useState(false);

  useEffect(() => {
    if (scrollLock && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, scrollLock]);

  const getLogTypeColor = (type: ScanLog['type']): string => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-error';
      case 'probe':
        return 'text-primary';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="mb-6">
      <div className="log-container" ref={logContainerRef}>
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`mb-1 ${getLogTypeColor(log.type)}`}
            >
              <span className="text-gray-500 mr-2">{log.timestamp}</span>
              <span className="mr-2">{getLogIcon(log.type)}</span>
              {log.message}
              {showRawPayloads && log.payload && (
                <span className="block ml-8 text-gray-400">
                  পেলোড: <span className="text-gray-200">{highlightPayload(log.payload)}</span>
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {logs.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            স্ক্যান শুরু হতে প্রস্তুত...
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-sm text-gray-400">
            <input
              type="checkbox"
              className="mr-2 rounded border-border focus:ring-primary"
              checked={showRawPayloads}
              onChange={() => setShowRawPayloads(!showRawPayloads)}
            />
            I'm Feeling Geeky
          </label>
        </div>
        
        <button
          onClick={() => setScrollLock(!scrollLock)}
          className={`text-sm px-3 py-1 rounded-md transition-colors duration-200 ${
            scrollLock 
              ? 'bg-primary text-white' 
              : 'bg-border text-gray-300 hover:bg-gray-600'
          }`}
        >
          {scrollLock ? '🔒 Auto-scroll' : '🔓 Manual scroll'}
        </button>
      </div>
    </div>
  );
};

export default LogContainer;