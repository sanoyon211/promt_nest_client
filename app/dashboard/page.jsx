import PrivateRoute from '@/components/PrivateRoute';

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <div className="w-full flex flex-col items-start bg-surface p-8 rounded-2xl shadow-sm border border-foreground/5 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-foreground/70 mb-8">Welcome to your secure area. This page is protected.</p>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-background rounded-xl border border-foreground/10 flex flex-col items-center justify-center min-h-[150px]">
            <span className="text-sm font-medium opacity-60">Total Prompts</span>
            <span className="text-4xl font-bold mt-2 text-primary">0</span>
          </div>
          <div className="p-6 bg-background rounded-xl border border-foreground/10 flex flex-col items-center justify-center min-h-[150px]">
            <span className="text-sm font-medium opacity-60">Active Subscriptions</span>
            <span className="text-4xl font-bold mt-2 text-accent">0</span>
          </div>
          <div className="p-6 bg-background rounded-xl border border-foreground/10 flex flex-col items-center justify-center min-h-[150px]">
            <span className="text-sm font-medium opacity-60">API Calls</span>
            <span className="text-4xl font-bold mt-2 text-foreground">0</span>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
