import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import ScanConsole from './pages/ScanConsole';
import ResultsPage from './pages/ResultsPage';
import { AppState, NavigationParams } from './types';
import { generateUUID } from './utils';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'landing',
    targetUrl: '',
    scanId: null,
    scanLogs: [],
    scanStatus: 'pending',
    scanResult: null,
    currentStep: 0,
  });

  const navigateTo = (page: AppState['currentPage'], params: NavigationParams = {}) => {
    setAppState(prev => ({
      ...prev,
      currentPage: page,
      ...(page === 'report' && params.scanId ? { scanId: params.scanId } : {}),
    }));
  };

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const resetScanState = () => {
    setAppState(prev => ({
      ...prev,
      scanId: generateUUID(),
      scanLogs: [],
      scanStatus: 'pending',
      scanResult: null,
      currentStep: 0,
    }));
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
  };

  const renderPage = () => {
    switch (appState.currentPage) {
      case 'landing':
        return (
          <LandingPage
            appState={appState}
            navigateTo={navigateTo}
            updateAppState={updateAppState}
            resetScanState={resetScanState}
          />
        );
      case 'scan':
        return (
          <ScanConsole
            appState={appState}
            navigateTo={navigateTo}
            updateAppState={updateAppState}
          />
        );
      case 'report':
        return (
          <ResultsPage
            appState={appState}
            navigateTo={navigateTo}
            updateAppState={updateAppState}
            resetScanState={resetScanState}
          />
        );
      default:
        return (
          <LandingPage
            appState={appState}
            navigateTo={navigateTo}
            updateAppState={updateAppState}
            resetScanState={resetScanState}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-200 font-inter flex flex-col items-center justify-center p-4">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        BugHunter Lab
      </motion.h1>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={appState.currentPage}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full max-w-4xl"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;