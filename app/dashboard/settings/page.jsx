'use client';
import { useState, useEffect } from 'react';
import { Settings, Save, Shield, Key, Loader2, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [settings, setSettings] = useState({
    siteName: 'PromptNest',
    contactEmail: 'admin@promptnest.com',
    maintenanceMode: false,
    requireEmailVerification: true,
    maxPromptsPerUser: 3
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('access-token');
        if (!token) return;
        const res = await fetch(`${API_URL}/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchSettings();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access-token');
      const res = await fetch(`${API_URL}/admin/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success('System settings saved successfully!', { position: "bottom-right", theme: "dark" });
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      toast.error('Failed to save settings', { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-10">

      {/* Header */}
      <div className="mb-10 flex items-center">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mr-5 shadow-inner ring-1 ring-primary/20">
          <Settings size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">System Settings</h1>
          <p className="text-text-secondary font-medium mt-1">Configure global platform rules, security, and maintenance.</p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="bg-surface border border-border rounded-2xl p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        {initialLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={40} className="animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-10">

          {/* General Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center mb-6 pb-4 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center mr-3">
                <Settings size={18} className="text-text-secondary" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">General Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
              <div>
                <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-2 block">Platform Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-[15px] font-medium text-text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-2 block">Support Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-[15px] font-medium text-text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          </motion.section>

          {/* Security & Access Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center mb-6 pb-4 border-b border-border mt-8">
              <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center mr-3">
                <Shield size={18} className="text-text-secondary" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">Security & Access</h2>
            </div>

            <div className="space-y-4 px-2">
              {/* Custom Toggle: Email Verification */}
              <label className="flex items-center justify-between p-5 bg-background border border-border rounded-2xl cursor-pointer hover:border-primary/30 transition-colors group">
                <div className="pr-4">
                  <span className="block font-bold text-text-primary mb-1">Require Email Verification</span>
                  <span className="block text-text-secondary text-[13px] font-medium leading-relaxed">Users must verify their email before creating or copying prompts.</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6.5 bg-foreground/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                </div>
              </label>

              {/* Custom Toggle: Maintenance Mode */}
              <label className="flex items-center justify-between p-5 bg-red-500/5 border border-red-500/20 rounded-2xl cursor-pointer hover:border-red-500/40 transition-colors group">
                <div className="pr-4">
                  <span className="flex items-center font-bold text-red-600 dark:text-red-400 mb-1">
                    Enable Maintenance Mode
                    {settings.maintenanceMode && <span className="ml-2 flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>}
                  </span>
                  <span className="block text-red-600/70 dark:text-red-400/70 text-[13px] font-medium leading-relaxed">Temporarily disable access to the platform for all non-admin users.</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6.5 bg-red-500/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-red-200 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-red-500 shadow-inner"></div>
                </div>
              </label>
            </div>
          </motion.section>

          {/* Limits Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center mb-6 pb-4 border-b border-border mt-8">
              <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center mr-3">
                <Key size={18} className="text-text-secondary" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">Resource Limits</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
              <div className="bg-background p-5 rounded-2xl border border-border">
                <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-3 block">Max Free Prompts per User</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    value={settings.maxPromptsPerUser}
                    onChange={(e) => setSettings({ ...settings, maxPromptsPerUser: parseInt(e.target.value) })}
                    className="w-24 bg-surface border border-border rounded-xl px-4 py-3 text-[15px] font-bold text-text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none transition-all text-center"
                  />
                  <div className="ml-4 flex items-start text-[13px] text-text-secondary/70">
                    <Info size={16} className="mr-1.5 mt-0.5 flex-shrink-0" />
                    <span>Number of prompts a free tier user can create before hitting the paywall.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Form Actions */}
          <motion.div variants={itemVariants} className="pt-8 mt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] flex items-center disabled:opacity-70 disabled:shadow-none disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Saving Configuration...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save System Settings
                </>
              )}
            </button>
          </motion.div>

        </form>
        )}
      </motion.div>
    </div>
  );
}