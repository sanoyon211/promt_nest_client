'use client';
import { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/ConfirmModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminReportedPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warningReportId, setWarningReportId] = useState(null);
  const [deleteReport, setDeleteReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/admin/reports`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        // Mock data for UI testing if API fails
        setReports([
          { 
            _id: 'r1', 
            prompt: { _id: 'p1', title: 'Ultimate Copywriting Bot', creator: { _id: 'u2', name: 'Bob Writing' } },
            reason: 'Inappropriate Content',
            description: 'This prompt generates toxic outputs and insults the user.',
            reporter: { name: 'Alice Reporter' },
            createdAt: '2023-11-20T10:00:00.000Z'
          },
          { 
            _id: 'r2', 
            prompt: { _id: 'p2', title: 'Free Crypto Trader', creator: { _id: 'u3', name: 'Scammy Joe' } },
            reason: 'Spam/Scam',
            description: 'Links out to a sketchy discord server promising free money.',
            reporter: { name: 'Charlie Vigilante' },
            createdAt: '2023-11-21T14:30:00.000Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access-token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleDismiss = async (reportId) => {
    try {
      setReports(reports.filter(r => r._id !== reportId));
      await fetch(`${API_URL}/admin/reports/${reportId}/manage`, { 
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'dismiss' })
      });
      toast.info('Report dismissed successfully', { position: "bottom-right", theme: "dark" });
    } catch (err) {
      toast.error('Failed to dismiss report', { position: "bottom-right" });
    }
  };

  const handleWarnClick = (reportId) => {
    setWarningReportId(reportId);
  };

  const confirmWarn = async () => {
    if (!warningReportId) return;
    try {
      await fetch(`${API_URL}/admin/reports/${warningReportId}/manage`, { 
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'warn' })
      });
      // Removing from list since report is resolved
      setReports(reports.filter(r => r._id !== warningReportId));
      toast.success('Warning sent to creator', { position: "bottom-right", theme: "dark" });
    } catch (err) {
      toast.error('Failed to warn creator', { position: "bottom-right" });
    } finally {
      setWarningReportId(null);
    }
  };

  const handleRemoveClick = (reportId, promptId) => {
    setDeleteReport({ reportId, promptId });
  };

  const confirmRemove = async () => {
    if (!deleteReport) return;
    try {
      // Optimistically remove all reports related to this prompt
      setReports(reports.filter(r => r.prompt?._id !== deleteReport.promptId));
      await fetch(`${API_URL}/admin/reports/${deleteReport.reportId}/manage`, { 
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'remove' })
      });
      toast.success('Prompt removed successfully', { position: "bottom-right", theme: "dark" });
    } catch (err) {
      toast.error('Failed to remove prompt', { position: "bottom-right" });
    } finally {
      setDeleteReport(null);
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
        </div>
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden p-5">
          <div className="w-full h-10 bg-foreground/5 rounded-lg mb-4 animate-pulse"></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-full h-20 bg-foreground/5 rounded-lg mb-2 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full pb-10">
      
      {/* Header */}
      <div className="mb-10 flex items-center">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center text-red-500 mr-5 shadow-inner ring-1 ring-red-500/20">
          <ShieldAlert size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">Reported Content</h1>
          <p className="text-text-secondary font-medium mt-1">Investigate community reports and enforce platform guidelines.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          
          {reports.length === 0 ? (
            /* Premium Inbox Zero Empty State */
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <CheckCircle size={36} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">All Clear!</h3>
              <p className="text-text-secondary font-medium max-w-sm">
                There are no pending reports. The community is looking clean and safe.
              </p>
            </div>
          ) : (
            /* Data Table */
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[950px]">
              <thead>
                <tr className="bg-foreground/5 border-b border-border text-[11px] uppercase tracking-widest text-text-secondary font-black">
                  <th className="p-5 pl-8">Prompt</th>
                  <th className="p-5">Report Details</th>
                  <th className="p-5">Reporter</th>
                  <th className="p-5">Date</th>
                  <th className="p-5 pr-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-[14px]">
                <AnimatePresence>
                  {reports.map((report, idx) => (
                    <motion.tr 
                      key={report._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="hover:bg-foreground/5 transition-colors group"
                    >
                      <td className="p-5 pl-8">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="font-bold text-text-primary truncate max-w-[180px] group-hover:text-primary transition-colors">
                              {report.prompt?.title || 'Unknown Prompt'}
                            </span>
                            <Link 
                              href={`/prompt/${report.prompt?._id}`} 
                              target="_blank"
                              className="ml-2 text-text-secondary/50 hover:text-primary transition-colors"
                              title="Open prompt in new tab"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          </div>
                          <span className="text-[12px] text-text-secondary font-medium mt-0.5">By {report.prompt?.creator?.name || report.prompt?.author?.name || report.prompt?.creator?.username || report.prompt?.author?.username || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="inline-block self-start px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-[10px] uppercase tracking-wider rounded-md mb-1.5 shadow-sm">
                            {report.reason}
                          </span>
                          <span className="truncate max-w-[280px] text-text-secondary font-medium text-[13px]" title={report.description}>
                            {report.description ? `"${report.description}"` : 'No additional details provided.'}
                          </span>
                        </div>
                      </td>
                      <td className="p-5 text-text-secondary font-medium">{report.reporter?.name || <span className="italic opacity-60">Anonymous</span>}</td>
                      <td className="p-5 text-text-secondary font-medium text-[13px]">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button 
                            onClick={() => handleDismiss(report._id)} 
                            title="Dismiss Report" 
                            className="px-3.5 py-2 bg-background border border-border rounded-xl text-text-secondary hover:text-text-primary hover:border-text-secondary/50 transition-all font-bold text-[12px] active:scale-95 shadow-sm"
                          >
                            Dismiss
                          </button>
                          <button 
                            onClick={() => handleWarnClick(report._id)} 
                            title="Issue Warning" 
                            className="px-3.5 py-2 bg-background border border-border rounded-xl text-text-secondary hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all font-bold text-[12px] flex items-center active:scale-95 shadow-sm"
                          >
                            <AlertTriangle size={14} className="mr-1.5" /> Warn
                          </button>
                          <button 
                            onClick={() => handleRemoveClick(report._id, report.prompt?._id)} 
                            title="Delete Prompt Permanently" 
                            className="px-3.5 py-2 bg-background border border-border rounded-xl text-text-secondary hover:text-white hover:border-red-500 hover:bg-red-500 transition-all font-bold text-[12px] flex items-center active:scale-95 shadow-sm"
                          >
                            <Trash2 size={14} className="mr-1.5" /> Remove
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!warningReportId}
        title="Issue Warning?"
        message="Are you sure you want to issue an official warning to this creator? This action will resolve the report."
        onConfirm={confirmWarn}
        onCancel={() => setWarningReportId(null)}
        confirmText="Warn Creator"
        isDestructive={false}
      />

      <ConfirmModal 
        isOpen={!!deleteReport}
        title="Delete Prompt?"
        message="CRITICAL WARNING: Are you sure you want to permanently delete this reported prompt? This action cannot be undone."
        onConfirm={confirmRemove}
        onCancel={() => setDeleteReport(null)}
        confirmText="Remove Prompt"
      />

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.02); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150, 150, 150, 0.2); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150, 150, 150, 0.4); }
      `}} />
    </div>
  );
}