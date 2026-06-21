'use client';
import { BookOpen, Info } from 'lucide-react';

export default function PromptInstructions({ instructions }) {
  if (!instructions || instructions.trim() === '') return null;

  // Function to highlight variables like [Topic] or {Name} in the text
  const renderLineWithHighlights = (line) => {
    // Splits the text keeping the bracketed parts
    const parts = line.split(/(\[[^\]]+\]|\{[^\}]+\})/g);
    
    return parts.map((part, index) => {
      // If the part matches [Something] or {Something}, render as a badge
      if (part.match(/^\[[^\]]+\]$/) || part.match(/^\{[^\}]+\}$/)) {
        return (
          <span 
            key={index} 
            className="inline-flex items-center text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 font-mono text-[13px] mx-1 shadow-sm"
          >
            {part}
          </span>
        );
      }
      // Otherwise render normal text
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="mb-12 bg-surface p-8 md:p-10 rounded-[24px] border border-border relative overflow-hidden group hover:border-accent/30 transition-colors duration-500 shadow-sm">
      
      {/* Subtle Background Glow */}
      <div className="absolute -right-20 -top-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center mb-8 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center text-accent mr-5 border border-accent/20 shadow-inner">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">How to Use This Prompt</h2>
          <p className="text-sm text-text-secondary font-medium mt-1 flex items-center">
            <Info size={14} className="mr-1.5" />
            Follow these instructions for the best results
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-[15px] md:text-base text-text-secondary font-medium leading-[1.8]">
        {instructions.split('\n').map((line, i) => {
          // Add spacing for empty lines
          if (!line.trim()) return <div key={i} className="h-4"></div>;
          
          // Check if it's a list item
          const isListItem = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().match(/^\d+\./);
          
          return (
            <div key={i} className={`flex mb-2 ${isListItem ? 'pl-2 md:pl-4' : ''}`}>
              <span className="flex-1 text-text-secondary">
                {renderLineWithHighlights(line)}
              </span>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}