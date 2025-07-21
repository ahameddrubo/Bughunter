import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  // Show only first 4 steps for mobile-first design
  const visibleSteps = steps.slice(0, 4);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        {visibleSteps.map((step, index) => (
          <motion.div 
            key={index} 
            className="flex-1 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <motion.div 
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold mb-1 transition-colors duration-300 ${
                index <= currentStep 
                  ? 'bg-primary text-white' 
                  : 'bg-border text-gray-400'
              }`}
              animate={{
                scale: index === currentStep ? 1.1 : 1,
                backgroundColor: index <= currentStep ? '#58a6ff' : '#30363d'
              }}
              transition={{ duration: 0.3 }}
            >
              {index === currentStep ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : index < currentStep ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ✓
                </motion.span>
              ) : (
                index + 1
              )}
            </motion.div>
            <p className={`text-xs transition-colors duration-300 ${
              index <= currentStep ? 'text-primary' : 'text-gray-500'
            }`}>
              {step}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-border rounded-full h-2">
        <motion.div
          className="bg-primary h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / visibleSteps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;