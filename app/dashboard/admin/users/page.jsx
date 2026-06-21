'use client';
import { useState, useEffect } from 'react';
import { Trash2, ShieldAlert, Star, Users, X, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/ConfirmModal';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const res = await fetch(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userEmail, newRole) => {
    try {
      // Optimistic update for UI snapiness
      setUsers(users.map(u => u.email === userEmail ? { ...u, role: newRole } : u));
      
      const token = localStorage.getItem('access-token');
      const res = await fetch(`${API_URL}/admin/users/${userEmail}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Failed to update role');
      toast.success(`User role updated to ${newRole.toUpperCase()}`, { position: "bottom-right", theme: "dark" });
    } catch (err) {
      toast.error('Failed to update role', { position: "bottom-right" });
    }
  };

  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (userObj) => {
    setUserToDelete(userObj);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const token = localStorage.getItem('access-token');
      setUsers(users.filter(u => u.email !== userToDelete.email));
      await fetch(`${API_URL}/admin/users/${userToDelete.email}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User permanently deleted', { position: "bottom-right", theme: "dark" });
    } catch (err) {
      toast.error('Failed to delete user', { position: "bottom-right" });
    } finally {
      setUserToDelete(null);
    }
  };

  // Developer note: we allow the UI to render even if the mocked local user isn't 'admin' just so you can test it natively.
  const isAdmin = user?.role === 'admin';

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
      <div className="mb-10 flex items-center">
        <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mr-5 shadow-inner ring-1 ring-primary/20">
          <Users size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight flex items-center">
            User Management
            {!isAdmin && <ShieldAlert size={20} className="ml-3 text-red-500" title="You are viewing this as a non-admin via local mock." />}
          </h1>
          <p className="text-text-secondary font-medium mt-1">Admin panel for managing platform users, roles, and access.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
            <thead>
              <tr className="bg-foreground/5 border-b border-border text-[11px] uppercase tracking-widest text-text-secondary font-black">
                <th className="p-5 pl-8">Name</th>
                <th className="p-5">Email</th>
                <th className="p-5">Subscription</th>
                <th className="p-5">Registered</th>
                <th className="p-5">Account Role</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-[14px]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center text-text-secondary">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-red-500/20">
                        <ShieldAlert size={28} className="text-red-500" />
                      </div>
                      <p className="text-xl font-bold text-text-primary mb-1">No users found</p>
                      <p className="text-[14px] font-medium max-w-sm">Please ensure your backend server is running and database is connected.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {users.map((u, idx) => (
                    <motion.tr 
                      key={u._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="hover:bg-foreground/5 transition-colors group"
                    >
                      <td className="p-5 pl-8 font-bold text-text-primary">
                        <div className="flex items-center">
                          {u.photoURL ? (
                            <Image 
                              src={u.photoURL} 
                              alt={u.name || "User"} 
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-lg object-cover mr-3 shadow-inner shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-black text-[12px] mr-3 shadow-inner shrink-0">
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          {u.name}
                        </div>
                      </td>
                      <td className="p-5 text-text-secondary font-medium">{u.email}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center w-max shadow-sm border ${
                          u.subscription === 'Premium' 
                            ? 'bg-gradient-to-r from-accent/10 to-primary/10 text-accent border-accent/20' 
                            : 'bg-foreground/5 text-text-secondary border-border'
                        }`}>
                          {u.subscription === 'Premium' && <Star size={12} className="mr-1.5 fill-current" />}
                          {u.subscription || 'Free'}
                        </span>
                      </td>
                      <td className="p-5 text-text-secondary font-medium text-[13px]">{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="p-5">
                        <div className="relative w-max">
                          <select 
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.email, e.target.value)}
                            className={`appearance-none pl-3.5 pr-8 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest cursor-pointer focus:outline-none focus:ring-4 transition-all shadow-sm ${
                              u.role === 'admin' 
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20 focus:ring-red-500/10' 
                                : u.role === 'creator' 
                                  ? 'bg-primary/10 text-primary border border-primary/20 focus:ring-primary/10'
                                  : 'bg-surface text-text-primary border border-border focus:ring-primary/10'
                            }`}
                          >
                            <option value="user" className="bg-background text-text-primary font-bold">USER</option>
                            <option value="creator" className="bg-background text-text-primary font-bold">CREATOR</option>
                            <option value="admin" className="bg-background text-text-primary font-bold">ADMIN</option>
                          </select>
                          <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                            u.role === 'admin' ? 'text-red-500' : u.role === 'creator' ? 'text-primary' : 'text-text-secondary'
                          }`} />
                        </div>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => handleDeleteClick(u)} 
                            title="Permanently Delete User" 
                            className="p-2.5 bg-background border border-border rounded-xl text-text-secondary hover:text-white hover:border-red-500 hover:bg-red-500 transition-all active:scale-95 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-text-secondary disabled:hover:border-border"
                            disabled={u.email === user?.email} // Prevent admin from deleting themselves
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal (Framer Motion) */}
      <ConfirmModal 
        isOpen={!!userToDelete}
        title="Delete User?"
        message={
          <>
            Are you sure you want to permanently delete <strong className="text-text-primary">{userToDelete?.name}</strong>? This action cannot be undone and all associated data will be wiped.
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setUserToDelete(null)}
        confirmText="Delete User"
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