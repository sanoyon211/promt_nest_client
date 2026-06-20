'use client';
import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/admin/payments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground">All Payments</h1>
          <p className="text-foreground/60">Review Stripe transactions and Premium upgrades.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold flex items-center shadow-sm">
          <DollarSign size={18} className="mr-1" /> Revenue Log
        </div>
      </div>

      <div className="bg-surface border border-foreground/10 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10 text-xs uppercase tracking-wider text-foreground/60 font-bold">
                <th className="p-4 pl-6">Transaction ID</th>
                <th className="p-4">User Email</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 text-sm">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="p-4 pl-6 font-mono text-xs text-foreground/80">{p._id}</td>
                  <td className="p-4 text-foreground/70">{p.user?.email || 'Unknown User'}</td>
                  <td className="p-4 font-bold text-foreground">${p.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      p.status === 'succeeded' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-foreground/60">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-foreground/50 italic">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
