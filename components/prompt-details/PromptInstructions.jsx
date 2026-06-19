import { BookOpen } from 'lucide-react';

export default function PromptInstructions({ instructions }) {
  if (!instructions) return null;

  return (
    <div className="mb-10 bg-surface rounded-2xl p-8 border border-foreground/10 shadow-sm">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mr-4">
          <BookOpen size={20} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Usage Instructions</h2>
      </div>
      
      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
        {/* If instructions is markdown, you would render it here. For now, simple text split by newline */}
        {instructions.split('\n').map((line, i) => (
          <p key={i} className="mb-2">{line}</p>
        ))}
      </div>
    </div>
  );
}
