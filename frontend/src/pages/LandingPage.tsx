import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppState, NavigationParams } from '../types';
import { validateAndFormatUrl, generateUUID } from '../utils';
import Card from '../components/Card';

interface LandingPageProps {
  appState: AppState;
  navigateTo: (page: AppState['currentPage'], params?: NavigationParams) => void;
  updateAppState: (updates: Partial<AppState>) => void;
  resetScanState: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  appState,
  navigateTo,
  updateAppState,
  resetScanState
}) => {
  const [inputUrl, setInputUrl] = useState(appState.targetUrl);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const validation = validateAndFormatUrl(inputUrl);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid URL');
      setIsLoading(false);
      return;
    }

    setError('');
    
    // Update app state with new scan data
    updateAppState({
      targetUrl: validation.formattedUrl,
      scanId: generateUUID(),
    });
    
    // Reset scan state
    resetScanState();
    
    // Small delay for better UX
    setTimeout(() => {
      setIsLoading(false);
      navigateTo('scan');
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleScan();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div 
        className="card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.h2 
          className="text-2xl font-semibold mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Paste a URL → Find SQLi in 30 sec
        </motion.h2>
        
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="https://vuln-site.com/product.php?id=1"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          {error && (
            <motion.p 
              className="text-error text-sm mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>
        
        <motion.button
          onClick={handleScan}
          disabled={isLoading}
          className={`btn-primary w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Starting Scan...
            </div>
          ) : (
            'Start Quick Scan'
          )}
        </motion.button>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card 
          title="How it Works" 
          content="আপনার URL পেস্ট করুন, আমরা দ্রুত SQL Injection এর জন্য স্ক্যান করব এবং বিস্তারিত রিপোর্ট দেব।"
          delay={0.6}
        />
        <Card 
          title="Sample Report" 
          content="একটি নমুনা রিপোর্ট দেখুন এবং বুঝুন কিভাবে দুর্বলতাগুলো উপস্থাপন করা হয়।"
          delay={0.7}
        />
        <Card 
          title="Legal Disclaimer" 
          content="এই টুলটি শুধুমাত্র শিক্ষামূলক এবং অনুমোদিত নিরাপত্তা পরীক্ষার জন্য। অননুমোদিত ব্যবহার কঠোরভাবে নিষিদ্ধ।"
          delay={0.8}
        />
      </motion.div>
    </div>
  );
};

export default LandingPage;