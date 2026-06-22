'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ReportModal({ isOpen, onClose, promptId }) {
  const [reason, setReason] = useState('Inappropriate Content');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('access-token');
      await fetch(`${API_URL}/prompts/${promptId}/report`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ reason, description })
      });
      toast.success('Report submitted successfully. Thank you for keeping our community safe.', { position: "bottom-right", theme: "dark" });
      setReason('Inappropriate Content');
      setDescription('');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit report. Please try again.', { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-surface border border-border rounded-2xl p-5 md:p-6 w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none z-10"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-foreground/5 hover:text-text-primary transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-2">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0 ring-1 ring-red-500/20">
                <AlertTriangle size={24} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary leading-tight">Report Prompt</h2>
                <p className="text-sm text-text-secondary font-medium">Help us keep PromptNest safe & high quality.</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Reason for reporting</label>
                <div className="relative">
                  <select 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full appearance-none bg-background border border-border rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 text-text-primary text-[15px] font-medium transition-all cursor-pointer hover:border-text-secondary/30"
                    required
                  >
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Spam">Spam or Misleading</option>
                    <option value="Copyright Violation">Copyright Violation</option>
                    <option value="Broken/Not Working">Broken / Not Working</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Additional Details (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide any specific details about the issue..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-3.5 min-h-[120px] focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 text-text-primary text-[15px] transition-all resize-none placeholder:text-text-secondary/50"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl border border-border text-text-primary font-bold hover:bg-foreground/5 hover:border-text-secondary transition-colors active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 flex items-center justify-center rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50 active:scale-[0.98] shadow-md shadow-red-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}