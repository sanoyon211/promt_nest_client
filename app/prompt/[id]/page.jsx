import PrivateRoute from '@/components/PrivateRoute';

export default async function PromptPage({ params }) {
  const { id } = await params;
  return (
    <PrivateRoute>
      <div className="w-full bg-surface p-8 rounded-2xl shadow-sm border border-foreground/5 mt-8 animate-in fade-in duration-500">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-xl">P</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Prompt #{id}</h1>
            <p className="text-sm text-foreground/60">Restricted Access</p>
          </div>
        </div>
        
        <div className="p-6 bg-background rounded-xl border border-foreground/10 font-mono text-sm leading-relaxed">
          <p className="opacity-80">// The details of this prompt are securely protected.</p>
          <p className="opacity-80 mt-2">// Only authorized users can view the underlying prompt instruction.</p>
        </div>
      </div>
    </PrivateRoute>
  );
}
