'use client';
import { useState } from 'react';
import { Settings, Save, Bell, Shield, Key } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'PromtNest',
    contactEmail: 'admin@promtnest.com',
    maintenanceMode: false,
    requireEmailVerification: true,
    maxPromptsPerUser: 3
  });

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('System settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground mb-2 flex items-center">
          <Settings className="mr-3 text-primary" size={32} />
          System Settings
        </h1>
        <p className="text-foreground/60">Configure global platform settings, security rules, and maintenance modes.</p>
      </div>

      <div className="bg-surface border border-foreground/10 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* General Section */}
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center">
              <Settings className="mr-2 text-foreground/50" size={18} /> General Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-foreground/40 uppercase mb-2 block">Platform Name</label>
                <input 
                  type="text" 
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground/40 uppercase mb-2 block">Support Email</label>
                <input 
                  type="email" 
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                  className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                />
              </div>
            </div>
          </section>

          {/* Security & Access Section */}
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center mt-8">
              <Shield className="mr-2 text-foreground/50" size={18} /> Security & Access
            </h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 bg-background border border-foreground/5 rounded-xl cursor-pointer hover:border-foreground/10 transition-colors">
                <input 
                  type="checkbox" 
                  checked={settings.requireEmailVerification}
                  onChange={(e) => setSettings({...settings, requireEmailVerification: e.target.checked})}
                  className="w-5 h-5 rounded text-primary focus:ring-primary bg-surface border-foreground/20"
                />
                <div className="ml-4">
                  <span className="block font-bold text-foreground text-sm">Require Email Verification</span>
                  <span className="block text-foreground/50 text-xs mt-1">Users must verify their email before creating prompts.</span>
                </div>
              </label>

              <label className="flex items-center p-4 bg-background border border-foreground/5 rounded-xl cursor-pointer hover:border-foreground/10 transition-colors">
                <input 
                  type="checkbox" 
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  className="w-5 h-5 rounded text-red-500 focus:ring-red-500 bg-surface border-foreground/20"
                />
                <div className="ml-4">
                  <span className="block font-bold text-red-500 text-sm">Enable Maintenance Mode</span>
                  <span className="block text-foreground/50 text-xs mt-1">Temporarily disable access to the platform for all non-admin users.</span>
                </div>
              </label>
            </div>
          </section>

          {/* Limits Section */}
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center mt-8">
              <Key className="mr-2 text-foreground/50" size={18} /> Resource Limits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-foreground/40 uppercase mb-2 block">Max Free Prompts</label>
                <input 
                  type="number" 
                  min="0"
                  value={settings.maxPromptsPerUser}
                  onChange={(e) => setSettings({...settings, maxPromptsPerUser: parseInt(e.target.value)})}
                  className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                />
                <p className="text-xs text-foreground/40 mt-2">Maximum number of prompts a free user can add.</p>
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-foreground/10 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save size={18} className="mr-2" />
              )}
              {loading ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
