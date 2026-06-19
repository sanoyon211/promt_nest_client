'use client';
import { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminReportedPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/reports`);
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        // Mock data for UI testing
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

  const handleDismiss = async (reportId) => {
    try {
      setReports(reports.filter(r => r._id !== reportId));
      await fetch(`${API_URL}/admin/reports/${reportId}/dismiss`, { method: 'PUT' });
      toast.info('Report dismissed');
    } catch (err) {
      toast.error('Failed to dismiss report');
    }
  };

  const handleWarn = async (userId) => {
    if (!confirm('Are you sure you want to issue an official warning to this creator?')) return;
    try {
      await fetch(`${API_URL}/admin/users/${userId}/warn`, { method: 'POST' });
      toast.success('Warning sent to creator');
    } catch (err) {
      toast.error('Failed to warn creator');
    }
  };

  const handleRemovePrompt = async (promptId, reportId) => {
    if (!confirm('CRITICAL WARNING: Are you sure you want to permanently delete this reported prompt?')) return;
    try {
      // Optimistically remove all reports related to this prompt
      setReports(reports.filter(r => r.prompt._id !== promptId));
      await fetch(`${API_URL}/admin/prompts/${promptId}`, { method: 'DELETE' });
      toast.success('Prompt removed successfully');
    } catch (err) {
      toast.error('Failed to remove prompt');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Reported Content</h1>
        <p className="text-foreground/60">Investigate community reports and enforce platform guidelines.</p>
      </div>

      <div className="bg-surface border border-foreground/10 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10 text-xs uppercase tracking-wider text-foreground/60 font-bold">
                <th className="p-4 pl-6">Prompt</th>
                <th className="p-4">Report Details</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 text-sm">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-foreground/[0.02] transition-colors group">
                  <td className="p-4 pl-6 font-bold text-foreground">
                    <div className="flex flex-col">
                      <span className="truncate max-w-[200px]">{report.prompt?.title || 'Unknown Prompt'}</span>
                      <span className="text-xs text-foreground/50 font-normal">By {report.prompt?.creator?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-red-500 font-bold text-xs uppercase tracking-wider mb-1">{report.reason}</span>
                      <span className="truncate max-w-[250px] text-foreground/70 italic text-xs" title={report.description}>
                        "{report.description || 'No description provided.'}"
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-foreground/70">{report.reporter?.name || 'Anonymous'}</td>
                  <td className="p-4 text-foreground/60">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleDismiss(report._id)} title="Dismiss Report" className="px-3 py-1.5 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors font-bold text-xs">
                        Dismiss
                      </button>
                      <button onClick={() => handleWarn(report.prompt?.creator?._id)} title="Warn Creator" className="px-3 py-1.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg hover:bg-orange-500 hover:text-white transition-colors font-bold text-xs flex items-center">
                        <AlertTriangle size={14} className="mr-1" /> Warn
                      </button>
                      <button onClick={() => handleRemovePrompt(report.prompt?._id, report._id)} title="Delete Prompt" className="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors font-bold text-xs flex items-center">
                        <Trash2 size={14} className="mr-1" /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-foreground/50 italic">No reported prompts. Everything is looking clean!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
