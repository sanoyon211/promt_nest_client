'use client';
import { useState } from 'react';
import { Copy, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function PromptContentBlock({ promptId, content, isLocked }) {
  const [copied, setCopied] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleCopy = async () => {
    if (isLocked) return;
    
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Prompt copied to clipboard!');
    
    try {
      const token = localStorage.getItem('access-token');
      await fetch(`${API_URL}/prompts/${promptId}/copy`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error(err);
    }
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Prompt Content</h2>
        <button 
          onClick={handleCopy}
          disabled={isLocked}
          className={`flex items-center px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            isLocked ? 'bg-foreground/10 text-foreground/40 cursor-not-allowed' :
            copied 
              ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' 
              : 'bg-primary text-background hover:scale-105 shadow-md shadow-primary/20'
          }`}
        >
          {copied ? (
            <>
              <CheckCircle2 size={16} className="mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} className="mr-2" />
              Copy Prompt
            </>
          )}
        </button>
      </div>

      <div className="relative group rounded-2xl overflow-hidden bg-[#1E1B2E] border border-foreground/10 shadow-inner min-h-[250px]">
        <div className="absolute top-0 left-0 w-full h-12 bg-black/20 border-b border-white/5 flex items-center px-4 z-10">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="ml-4 text-xs font-mono text-white/40">prompt.txt</span>
        </div>
        
        <pre className={`p-6 pt-16 overflow-x-auto text-sm font-mono text-gray-300 whitespace-pre-wrap leading-relaxed ${isLocked ? 'blur-md select-none opacity-50' : ''}`}>
          {content || 'No content available.'}
        </pre>
        
        {isLocked && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/30 backdrop-blur-[2px]">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <Lock size={32} className="text-accent" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 drop-shadow-md">Premium Content</h3>
            <p className="text-white/80 mb-6 max-w-sm text-center drop-shadow-sm font-medium">This private prompt is exclusive to Premium subscribers.</p>
            <Link 
              href="/payment" 
              className="bg-accent text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-accent/40"
            >
              Subscribe to Premium
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
