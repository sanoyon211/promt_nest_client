'use client';
import { useState, useEffect } from 'react';
import PromptHeader from './PromptHeader';
import PromptContentBlock from './PromptContentBlock';
import PromptInstructions from './PromptInstructions';
import CreatorProfileSnippet from './CreatorProfileSnippet';
import PromptReviews from './PromptReviews';
import ReportModal from './ReportModal';
import { useAuth } from '@/components/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-32 text-center bg-surface rounded-3xl border border-foreground/10 my-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">Prompt Not Found</h1>
        <p className="text-foreground/60">The prompt you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  // Calculate Visibility Logic
  const isLocked = prompt.isLocked || false;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PromptHeader prompt={prompt} promptId={prompt._id || prompt.id} onReportClick={() => setIsReportModalOpen(true)} />
      <PromptContentBlock promptId={prompt._id || prompt.id} content={prompt.content} isLocked={isLocked} />
      <PromptInstructions instructions={prompt.instructions} />
      <CreatorProfileSnippet creator={prompt.creator} />
      <PromptReviews reviews={prompt.reviews} isLocked={isLocked} promptId={prompt._id || prompt.id} />
      
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        promptId={prompt._id || prompt.id} 
      />
    </div>
  );
}
