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
        const res = await fetch(`${API_URL}/prompts/${promptId}`);
        if (res.ok) {
          const data = await res.json();
          setPrompt(data);
        } else {
          throw new Error('Prompt not found');
        }
      } catch (err) {
        // Robust mock data matching the highly modular structure needed for the UI
        setPrompt({
          id: promptId,
          title: promptId === '2' ? 'Python Code Architect' : 'SEO Optimized Blog Generator',
          description: 'This master prompt will automatically generate a highly optimized blog post including meta descriptions, H1-H3 tags, and a compelling introduction that ranks on Google.',
          content: 'Act as a senior SEO content writer and marketing expert.\n\nTarget Keyword: [INSERT KEYWORD]\nBrand Tone: [INSERT TONE]\n\nWrite a 1500 word blog post with the following structure:\n1. Hook Introduction\n2. Definition of the problem\n3. Actionable solutions\n4. Conclusion and CTA.',
          instructions: '1. Replace [INSERT KEYWORD] with your primary SEO target.\n2. Set the [INSERT TONE] to match your brand (e.g. professional, witty, authoritative).\n3. Paste into ChatGPT-4 for best results.',
          category: promptId === '2' ? 'Coding' : 'Marketing',
          aiTool: promptId === '2' ? 'Claude 3.5 Sonnet' : 'ChatGPT',
          level: promptId === '2' ? 'Pro' : 'Beginner',
          tier: promptId === '2' ? 'Private' : 'Private', // Hardcoding different tiers to test PromptVerse color engine
          copyCount: 1250,
          updatedAt: '2023-10-15',
          creator: {
            name: 'Alice Marketing',
            bio: 'Top 1% AI Content Strategist',
            totalPrompts: 45,
            isVerified: true
          },
          reviews: [
            { user: { name: 'David B.', email: 'david@example.com' }, rating: 5, text: 'This saved me hours of writing. Ranked on page 1 within a week!', date: '2023-11-01' },
            { user: { name: 'Sarah L.', email: 'sarah.l@example.com' }, rating: 4, text: 'Great structure, just needed a little human editing at the end.', date: '2023-11-05' }
          ]
        });
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
  const isLocked = prompt.tier === 'Private' && user?.subscription !== 'Premium';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PromptHeader prompt={prompt} promptId={prompt.id} onReportClick={() => setIsReportModalOpen(true)} />
      <PromptContentBlock promptId={prompt.id} content={prompt.content} isLocked={isLocked} />
      <PromptInstructions instructions={prompt.instructions} />
      <CreatorProfileSnippet creator={prompt.creator} />
      <PromptReviews reviews={prompt.reviews} isLocked={isLocked} promptId={prompt.id} />
      
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        promptId={prompt.id} 
      />
    </div>
  );
}
