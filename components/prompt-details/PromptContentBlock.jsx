'use client';
import { useState } from 'react';
import { Copy, CheckCircle2, Lock, Terminal } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PromptContentBlock({ promptId, content, isLocked }) {
  const [copied, setCopied] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleCopy = async () => {
    if (isLocked) return;
    
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Prompt copied to clipboard!', {
      position: "bottom-right",
      theme: "dark"
    });
    
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
    <div className="mb-12">
      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Terminal size={24} className="text-primary" />
          Prompt Payload
        </h2>
        
        <button 
          onClick={handleCopy}
          disabled={isLocked}
          className={`flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 ${
            isLocked 
              ? 'bg-surface border border-border text-text-secondary opacity-50 cursor-not-allowed' 
              : copied 
                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' 
                : 'bg-primary text-white hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)]'
          }`}
        >
          {copied ? (
            <>
              <CheckCircle2 size={18} className="mr-2" />
              Copied Successfully
            </>
          ) : (
            <>
              <Copy size={18} className="mr-2" />
              {isLocked ? 'Locked' : 'Copy Prompt'}
            </>
          )}
        </button>
      </div>

      {/* Editor Block */}
      <div className="relative group rounded-[24px] overflow-hidden bg-[#09090B] border border-border/50 shadow-2xl min-h-[300px] flex flex-col">
        
        {/* MacOS Style Top Bar */}
        <div className="absolute top-0 left-0 w-full h-12 bg-white/5 border-b border-white/10 flex items-center px-5 z-10 backdrop-blur-sm">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-white/10"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-white/10"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-white/10"></div>
          </div>
          <div className="mx-auto flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md">
            system_prompt.md
          </div>
        </div>
        
        {/* Actual Content */}
        <div className="flex-grow relative mt-12">
          <pre 
            className={`p-6 md:p-8 overflow-x-auto text-[15px] font-mono text-gray-300 whitespace-pre-wrap leading-[1.7] h-full custom-scrollbar ${
              isLocked ? 'blur-[8px] select-none opacity-40' : ''
            }`}
          >
            {content || 'No prompt content available.'}
          </pre>
        </div>
        
        {/* Premium Overlay for Locked Content */}
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/40 backdrop-blur-md rounded-[24px]"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-lg">
              <Lock size={32} className="text-accent" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-3 text-center">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Content</span>
            </h3>
            <p className="text-text-secondary mb-8 max-w-sm text-center font-medium leading-relaxed px-4">
              This highly optimized prompt is exclusive to our Premium Creators. Upgrade your account to unlock this and thousands more.
            </p>
            <Link 
              href={`/pricing?redirect=/prompt/${promptId}`} 
              className="bg-text-primary text-background px-8 py-4 rounded-xl font-bold text-base md:text-lg hover:bg-text-secondary active:scale-95 transition-all shadow-xl flex items-center gap-2"
            >
              Unlock Premium Access
            </Link>
          </motion.div>
        )}
      </div>

      {/* Global Style for Custom Scrollbar inside the Pre tag */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2); 
        }
      `}} />
    </div>
  );
}