'use client';
import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, SearchX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'succeeded': 
      case 'paid':
      case 'active':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'pending': 
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'failed': 
      case 'canceled':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default: 
        return 'bg-foreground/5 text-text-secondary border-border';
    }
  };

  // Premium Skeleton Table Loader
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto w-full pb-10">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 mb-2 animate-pulse mr-5"></div>
            <div>
              <div className="w-48 h-8 bg-foreground/5 rounded-lg mb-2 animate-pulse"></div>
              <div className="w-64 h-4 bg-foreground/5 rounded-md animate-pulse"></div>
            </div>
          </div>
          <div className="w-32 h-10 bg-primary/10 rounded-xl animate-pulse"></div>
        </div>
        <div className="bg-surface border border-border rounded-[32px] shadow-sm overflow-hidden p-6">
          <div className="w-full h-10 bg-foreground/5 rounded-lg mb-4 animate-pulse"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-full h-16 bg-foreground/5 rounded-lg mb-2 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-green-500/10 to-primary/10 flex items-center justify-center text-green-500 dark:text-green-400 mr-5 shadow-inner ring-1 ring-green-500/20">
            <CreditCard size={26} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">All Payments</h1>
            <p className="text-text-secondary font-medium mt-1">Review global transactions and premium upgrades.</p>
          </div>
        </div>
        <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-5 py-2.5 rounded-xl font-bold flex items-center shadow-sm border border-green-500/20 whitespace-nowrap">
          <DollarSign size={18} className="mr-1.5" /> Revenue Log
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          
          {payments.length === 0 ? (
            /* Premium Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-border">
                <SearchX size={32} className="text-text-secondary/50" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">No transactions found</h3>
              <p className="text-text-secondary font-medium max-w-sm">
                There are currently no payment records available in the system.
              </p>
            </div>
          ) : (
            /* Data Table */
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="bg-foreground/5 border-b border-border text-[11px] uppercase tracking-widest text-text-secondary font-black">
                  <th className="p-5 pl-8">Transaction ID</th>
                  <th className="p-5">User Email</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 pr-8">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-[14px]">
                <AnimatePresence>
                  {payments.map((p, idx) => (
                    <motion.tr 
                      key={p._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="hover:bg-foreground/5 transition-colors group"
                    >
                      <td className="p-5 pl-8">
                        <span className="font-mono text-[12px] bg-background border border-border/60 px-2.5 py-1.5 rounded-md text-text-secondary group-hover:text-text-primary transition-colors">
                          {p._id}
                        </span>
                      </td>
                      <td className="p-5 text-text-secondary font-medium">
                        {p.user?.email || <span className="italic opacity-50">Unknown User</span>}
                      </td>
                      <td className="p-5 font-mono text-[15px] font-black text-text-primary">
                        ${(p.amount || 0).toFixed(2)}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1.5 rounded-md text-[10px] font-black border ${getStatusStyle(p.status)} uppercase tracking-widest shadow-sm`}>
                          {p.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-5 pr-8 text-text-secondary font-medium text-[13px]">
                        {new Date(p.createdAt).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Global Style for Horizontal Scrollbar in Table */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.2); 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(150, 150, 150, 0.4); 
        }
      `}} />
    </div>
  );
}