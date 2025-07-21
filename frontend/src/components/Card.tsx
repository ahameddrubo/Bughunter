import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  content: string;
  delay?: number;
}

const Card: React.FC<CardProps> = ({ title, content, delay = 0 }) => {
  return (
    <motion.div
      className="bg-background p-4 rounded-md border border-border shadow-sm hover:border-primary/50 transition-colors duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="font-semibold text-lg mb-2 text-primary">{title}</h3>
      <p className="text-sm text-gray-400">{content}</p>
    </motion.div>
  );
};

export default Card;