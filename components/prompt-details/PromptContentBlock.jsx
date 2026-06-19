'use client';
import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

export default function PromptContentBlock({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Prompt Content</h2>
        <button 
          onClick={handleCopy}
          className={`flex items-center px-4 py-2 rounded-lg font-bold text-sm transition-all ${
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

      <div className="relative group rounded-2xl overflow-hidden bg-[#1E1B2E] border border-foreground/10 shadow-inner">
        <div className="absolute top-0 left-0 w-full h-12 bg-black/20 border-b border-white/5 flex items-center px-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="ml-4 text-xs font-mono text-white/40">prompt.txt</span>
        </div>
        <pre className="p-6 pt-16 overflow-x-auto text-sm font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
          {content || 'No content available.'}
        </pre>
      </div>
    </div>
  );
}
