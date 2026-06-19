import PrivateRoute from '@/components/PrivateRoute';

export default function PaymentPage() {
  return (
    <PrivateRoute>
      <div className="w-full flex flex-col items-center justify-center bg-surface p-12 rounded-2xl shadow-sm border border-foreground/5 mt-8 animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Payment Gateway</h1>
        <p className="text-foreground/70 mb-8 text-center">Secure checkout for your PromtNest subscription.</p>
        
        <div className="w-full p-6 bg-background rounded-xl border border-foreground/10">
          <p className="opacity-60 italic text-center">Payment integration interface goes here.</p>
        </div>
      </div>
    </PrivateRoute>
  );
}
