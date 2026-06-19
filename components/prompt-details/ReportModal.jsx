'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
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
      await fetch(`${API_URL}/prompts/${promptId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, description })
      });
      toast.success('Report submitted successfully. Thank you.');
      setReason('Inappropriate Content');
      setDescription('');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-surface border border-foreground/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-foreground/40 hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mr-4">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Report Prompt</h2>
                <p className="text-sm text-foreground/60">Help us keep PromptVerse safe.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Reason</label>
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-foreground transition-colors"
                  required
                >
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Spam">Spam or Misleading</option>
                  <option value="Copyright Violation">Copyright Violation</option>
                  <option value="Broken/Not Working">Broken / Not Working</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Additional Details (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide any specific details..."
                  className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 min-h-[120px] focus:outline-none focus:border-red-500 text-foreground transition-colors resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-foreground/10 text-foreground font-bold hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
