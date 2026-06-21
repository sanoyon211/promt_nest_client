'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  isDestructive = true
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-surface border border-border rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
          >
            {/* Background Blob */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -z-10 pointer-events-none ${isDestructive ? 'bg-red-500/10' : 'bg-orange-500/10'}`}></div>
            
            <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto ring-1 shadow-inner ${isDestructive ? 'bg-gradient-to-br from-red-500/10 to-red-500/5 text-red-500 ring-red-500/20' : 'bg-gradient-to-br from-orange-500/10 to-orange-500/5 text-orange-500 ring-orange-500/20'}`}>
              <ShieldAlert size={28} />
            </div>
            
            <h2 className="text-2xl font-black text-text-primary mb-2 tracking-tight">{title}</h2>
            <p className="text-text-secondary font-medium mb-8">
              {message}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={onCancel}
                className="flex-1 py-3.5 px-4 rounded-xl border border-border font-bold text-text-primary hover:bg-foreground/5 transition-all active:scale-95"
              >
                {cancelText}
              </button>
              <button 
                onClick={onConfirm}
                className={`flex-1 py-3.5 px-4 rounded-xl text-white font-bold transition-all active:scale-95 ${
                  isDestructive 
                    ? 'bg-red-500 hover:bg-red-600 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.23)]'
                    : 'bg-orange-500 hover:bg-orange-600 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)]'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
