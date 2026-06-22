'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import PromptHeader from './PromptHeader';
import PromptContentBlock from './PromptContentBlock';
import PromptInstructions from './PromptInstructions';
import CreatorProfileSnippet from './CreatorProfileSnippet';
import PromptReviews from './PromptReviews';
import ReportModal from './ReportModal';
import { useAuth } from '@/components/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Premium Skeleton Loader for the entire Details Page
const DetailsSkeleton = () => (
  <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
    {/* Back Button Skeleton */}
    <div className="w-24 h-5 bg-foreground/5 rounded-md mb-8"></div>
    
    {/* Header Skeleton */}
    <div className="w-3/4 h-10 md:h-12 bg-foreground/5 rounded-xl mb-4"></div>
    <div className="flex gap-2 mb-10">
      <div className="w-20 h-6 bg-foreground/5 rounded-full"></div>
      <div className="w-24 h-6 bg-foreground/5 rounded-full"></div>
      <div className="w-16 h-6 bg-foreground/5 rounded-full"></div>
    </div>
    
    {/* Content Block Skeleton */}
    <div className="w-full h-64 md:h-80 bg-foreground/5 rounded-2xl mb-10"></div>
    
    {/* Instructions Skeleton */}
    <div className="w-1/3 h-8 bg-foreground/5 rounded-lg mb-4"></div>
    <div className="w-full h-32 bg-foreground/5 rounded-2xl mb-10"></div>
    
    {/* Creator Profile Skeleton */}
    <div className="w-full max-w-md h-24 bg-foreground/5 rounded-2xl"></div>
  </div>
);

export default function PromptDetailsClient({ promptId }) {
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPromptDetails = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_URL}/prompts/${promptId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setPrompt(data);
        } else {
          throw new Error('Prompt not found');
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPromptDetails();
  }, [promptId]);

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error || !prompt) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm"
        >
          <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6 text-text-secondary">
            <FileQuestion size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3">Prompt Not Found</h1>
          <p className="text-text-secondary mb-8 font-medium">The prompt you are looking for does not exist, has been removed, or is set to private.</p>
          <Link 
            href="/all-prompts"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Library
          </Link>
        </motion.div>
      </div>
    );
  }

  // Calculate Visibility Logic
  const isLocked = prompt.isLocked || false;

  return (
    <div className="w-full min-h-screen bg-background relative selection:bg-primary/20 selection:text-primary">
      {/* Decorative Background Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply dark:mix-blend-lighten"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Back Navigation */}
        <Link 
          href="/all-prompts" 
          className="inline-flex items-center text-sm font-bold text-text-secondary hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Library
        </Link>

        {/* Modular Child Components */}
        <div className="space-y-12 md:space-y-16">
          <PromptHeader 
            prompt={prompt} 
            promptId={prompt._id || prompt.id} 
            onReportClick={() => setIsReportModalOpen(true)} 
          />
          
          <PromptContentBlock 
            promptId={prompt._id || prompt.id} 
            content={prompt.content} 
            isLocked={isLocked} 
          />
          
          <PromptInstructions 
            instructions={prompt.instructions} 
          />
          
          <div className="pt-8 border-t border-border">
            <CreatorProfileSnippet 
              creator={prompt.creator} 
            />
          </div>
          
          <div className="pt-8 border-t border-border">
            <PromptReviews 
              reviews={prompt.reviews} 
              isLocked={isLocked} 
              promptId={prompt._id || prompt.id} 
            />
          </div>
        </div>

        <ReportModal 
          isOpen={isReportModalOpen} 
          onClose={() => setIsReportModalOpen(false)} 
          promptId={prompt._id || prompt.id} 
        />
      </motion.div>
    </div>
  );
}