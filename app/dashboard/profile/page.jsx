'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { Mail, Shield, Star, Zap, PenTool, Edit2, Save, X, Loader2, CheckCircle2, ShieldCheck, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', photo: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditData({ name: user.name || '', photo: user.photo || user.photoURL || '' });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  // Fallback defaults if user object doesn't have these
  const subscription = user.subscription || 'Free';
  const role = user.role || 'User';
  const totalPrompts = user.totalPrompts || 0;

  // Premium Role Checks
  const isAdmin = role.toLowerCase() === 'admin';
  const isPremium = subscription.toLowerCase() === 'premium';

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (updateUserProfile) {
        await updateUserProfile(editData.name, editData.photo);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      toast.success('Profile updated successfully!', { position: "bottom-right", theme: "dark" });
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile.', { position: "bottom-right" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-10">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">My Profile</h1>
          <p className="text-text-secondary font-medium mt-1">Manage your account details and workspace preferences.</p>
        </div>

        {!isEditing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center px-5 py-2.5 bg-surface border border-border hover:border-primary/50 text-text-primary text-[14px] font-bold rounded-xl transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:shadow-none active:scale-95"
          >
            <Edit2 size={16} className="mr-2 text-primary" />
            Edit Profile
          </motion.button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-surface border border-border rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden"
      >
        {/* Dynamic Cover Banner */}
        <div className={`h-32 sm:h-40 w-full relative ${isAdmin
            ? 'bg-gradient-to-r from-red-500/20 via-purple-500/20 to-background'
            : 'bg-gradient-to-r from-primary/20 via-accent/20 to-background'
          }`}>
          {/* Overlay Grid Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[size:20px_20px] dark:bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)]"></div>
        </div>

        <div className="px-6 md:px-10 pb-10 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 -mt-16 sm:-mt-20">

            {/* Profile Photo Area */}
            <div className="flex-shrink-0 relative group z-10">
              <div className={`relative w-36 h-36 rounded-2xl bg-background border-[6px] border-surface shadow-xl flex items-center justify-center text-primary text-5xl font-black overflow-hidden ${isEditing ? 'ring-4 ring-primary/20' : ''}`}>
                {isEditing && editData.photo ? (
                  <img src={editData.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (user.photo || user.photoURL) ? (
                  <img
                    src={user.photo || user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="bg-gradient-to-br from-primary/10 to-accent/10 w-full h-full flex items-center justify-center">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}

                {/* Edit Overlay */}
                {isEditing && (
                  <div className="absolute inset-0 bg-background/60 flex flex-col justify-center items-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <Camera size={28} className="text-text-primary mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-text-primary">Update URL</span>
                  </div>
                )}
              </div>

              {/* Dynamic Role Badge on Avatar */}
              {!isEditing && isAdmin && (
                <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-xl p-2 shadow-lg border-[4px] border-surface text-white" title="Platform Admin">
                  <ShieldCheck size={20} />
                </div>
              )}
              {!isEditing && !isAdmin && isPremium && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-accent to-primary rounded-xl p-2 shadow-lg border-[4px] border-surface text-white" title="Premium Member">
                  <Star size={18} className="fill-current" />
                </div>
              )}
            </div>

            {/* User Details / Form Area */}
            <div className="flex-1 w-full text-center md:text-left z-10 pt-2 md:pt-20">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="edit-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5 bg-background p-5 md:p-6 rounded-2xl border border-border shadow-inner mt-4 md:mt-0"
                  >
                    <div>
                      <label className="text-[11px] font-black text-text-secondary/60 uppercase tracking-widest mb-2 block text-left">Display Name</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full bg-surface border border-border rounded-xl px-5 py-3.5 text-[14px] font-medium text-text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-text-secondary/60 uppercase tracking-widest mb-2 block text-left">Profile Photo URL</label>
                      <input
                        type="url"
                        value={editData.photo}
                        onChange={(e) => setEditData({ ...editData, photo: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full bg-surface border border-border rounded-xl px-5 py-3.5 text-[14px] font-medium text-text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:outline-none transition-all placeholder:text-text-secondary/40"
                      />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 mt-2 border-t border-border">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center justify-center px-6 py-3.5 bg-surface text-text-primary border border-border font-bold rounded-xl hover:bg-foreground/5 transition-colors active:scale-95 w-full sm:w-auto text-[14px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center justify-center px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] disabled:opacity-50 disabled:shadow-none active:scale-95 w-full sm:w-auto text-[14px]"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 size={18} className="animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="read-mode"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row md:justify-between md:items-start gap-6"
                  >
                    <div>
                      <h2 className="text-3xl font-black text-text-primary mb-2 tracking-tight flex items-center justify-center md:justify-start gap-3">
                        {user.name || 'Anonymous Creator'}
                      </h2>
                      <div className="flex items-center justify-center md:justify-start text-text-secondary font-medium mb-6">
                        <Mail size={16} className="mr-2 opacity-70" />
                        <span>{user.email || 'No email provided'}</span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <span className={`px-3 py-1.5 text-[10px] font-black rounded-md uppercase tracking-widest flex items-center shadow-sm border ${isAdmin ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'
                          }`}>
                          <Shield size={14} className="mr-1.5" />
                          {role}
                        </span>

                        <span className={`px-3 py-1.5 text-[10px] font-black rounded-md uppercase tracking-widest flex items-center shadow-sm border ${isPremium
                            ? 'bg-gradient-to-r from-accent/10 to-primary/10 text-accent border-accent/20'
                            : 'bg-foreground/5 text-text-secondary border-border'
                          }`}>
                          {isPremium && <Star size={14} className="mr-1.5 fill-current" />}
                          {subscription} Plan
                        </span>
                      </div>
                    </div>

                    {/* Conditional Upgrade Button */}
                    {!isPremium && !isAdmin && (
                      <div className="flex-shrink-0 mt-4 md:mt-0">
                        <Link
                          href="/pricing?redirect=/dashboard/profile"
                          className="inline-flex items-center justify-center px-6 py-3 bg-text-primary text-background font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl w-full md:w-auto text-[14px]"
                        >
                          <Zap size={18} className="mr-2 text-accent fill-accent" />
                          Upgrade to Premium
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats Grid */}
          {!isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10 pt-10 border-t border-border"
            >
              <div className="bg-background rounded-2xl p-5 border border-border flex items-center group hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mr-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <PenTool size={24} strokeWidth={2} />
                </div>
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-widest text-text-secondary font-black mb-1">Total Prompts</p>
                  <p className="text-3xl font-black text-text-primary leading-none">{totalPrompts}</p>
                </div>
              </div>

              <div className={`bg-background rounded-2xl p-5 border border-border flex items-center group transition-all duration-300 shadow-sm hover:shadow-md ${isAdmin ? 'hover:border-red-500/30' : 'hover:border-green-500/30'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${isAdmin ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {isAdmin ? <ShieldCheck size={24} strokeWidth={2} /> : <CheckCircle2 size={24} strokeWidth={2} />}
                </div>
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-widest text-text-secondary font-black mb-1">Account Status</p>
                  <p className={`text-xl font-bold leading-none mt-1 ${isAdmin ? 'text-red-500' : 'text-text-primary'}`}>
                    {isAdmin ? 'Super Admin' : 'Verified User'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
