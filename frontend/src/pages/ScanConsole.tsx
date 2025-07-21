import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppState, NavigationParams } from '../types';
import { useScanSimulation } from '../hooks/useScanSimulation';
import { stepMessages } from '../utils';
import StepIndicator from '../components/StepIndicator';
import LogContainer from '../components/LogContainer';
import ScanControls from '../components/ScanControls';

interface ScanConsoleProps {
  appState: AppState;
  navigateTo: (page: AppState['currentPage'], params?: NavigationParams) => void;
  updateAppState: (updates: Partial<AppState>) => void;
}

const ScanConsole: React.FC<ScanConsoleProps> = ({
  appState,
  navigateTo,
  updateAppState
}) => {
  const { startScan, pauseScan, stopScan } = useScanSimulation(appState, updateAppState, navigateTo);

  useEffect(() => {
    if (appState.scanStatus === 'pending') {
      startScan();
    }
  }, [appState.scanStatus, startScan]);

  const handlePauseStop = () => {
    if (appState.scanStatus === 'scanning') {
      pauseScan();
    } else if (appState.scanStatus === 'paused') {
      startScan();
    } else if (appState.scanStatus === 'completed' || appState.scanStatus === 'error') {
      stopScan();
      navigateTo('landing');
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
          স্ক্যান কনসোল
        </motion.h2>

        {/* Step Indicator */}
        <StepIndicator 
          steps={stepMessages} 
          currentStep={appState.currentStep} 
        />

        {/* Log Container */}
        <LogContainer 
          logs={appState.scanLogs}
          scanStatus={appState.scanStatus}
        />

        {/* Scan Controls */}
        <ScanControls
          scanStatus={appState.scanStatus}
          onPauseStop={handlePauseStop}
        />
      </motion.div>
    </div>
  );
};

export default ScanConsole;