import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface ModernModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModernModal: React.FC<ModernModalProps> = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white rounded-3xl shadow-lg max-w-lg w-full p-0 overflow-hidden"
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}
          initial={{ scale: 0.96, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          onClick={e => e.stopPropagation()}
        >
          <motion.button
            className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/60 hover:bg-white/80 active:bg-white/90 shadow-lg border border-white/40 transition-all flex items-center justify-center"
            whileHover={{ scale: 1.15, rotate: 90, backgroundColor: 'rgba(255,255,255,0.85)' }}
            whileTap={{ scale: 0.92, backgroundColor: 'rgba(255,255,255,0.95)' }}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {/* Modern close SVG icon */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="11" fill="rgba(255,255,255,0.1)"/>
              <path d="M7 7L15 15M15 7L7 15" stroke="#222" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </motion.button>
          <div className="p-8">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
