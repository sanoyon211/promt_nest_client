export default function DashboardHome() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm transition-transform hover:-translate-y-1">
          <h3 className="text-foreground/60 font-bold mb-2 tracking-wide uppercase text-xs">Total Prompts</h3>
          <p className="text-4xl font-black text-foreground">12</p>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm transition-transform hover:-translate-y-1">
          <h3 className="text-foreground/60 font-bold mb-2 tracking-wide uppercase text-xs">Total Bookmarks</h3>
          <p className="text-4xl font-black text-foreground">5</p>
        </div>
        <div className="bg-surface p-6 rounded-3xl border border-foreground/10 shadow-sm transition-transform hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10"></div>
          <h3 className="text-foreground/60 font-bold mb-2 tracking-wide uppercase text-xs">Account Status</h3>
          <p className="text-4xl font-black text-accent">Active</p>
        </div>
      </div>
    </div>
  );
}
