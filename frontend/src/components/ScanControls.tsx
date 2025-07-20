import React from 'react';
import { motion } from 'framer-motion';
import { ScanStatus } from '../types';

interface ScanControlsProps {
  scanStatus: ScanStatus;
  onPauseStop: () => void;
}

const ScanControls: React.FC<ScanControlsProps> = ({ scanStatus, onPauseStop }) => {
  const getButtonText = (): string => {
    switch (scanStatus) {
      case 'scanning':
        return 'Pause';
      case 'paused':
        return 'Resume';
      case 'completed':
      case 'error':
        return 'Stop';
      default:
        return 'Stop';
    }
  };

  const getButtonColor = (): string => {
    switch (scanStatus) {
      case 'scanning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'paused':
        return 'bg-success hover:bg-green-600';
      case 'completed':
      case 'error':
        return 'bg-error hover:bg-red-600';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getIcon = (): string => {
    switch (scanStatus) {
      case 'scanning':
        return '⏸️';
      case 'paused':
        return '▶️';
      case 'completed':
      case 'error':
        return '⏹️';
      default:
        return '⏹️';
    }
  };

  return (
    <div className="flex justify-center">
      <motion.button
        onClick={onPauseStop}
        className={`py-2 px-6 rounded-md font-bold text-white transition duration-200 ease-in-out ${getButtonColor()}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={scanStatus === 'pending'}
      >
        <span className="mr-2">{getIcon()}</span>
        {getButtonText()}
      </motion.button>
    </div>
  );
};

export default ScanControls;