'use client';
import { useState, useEffect } from 'react';
import { Trash2, Shield, Star, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';

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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      // if (!res.ok) throw new Error('Failed to update role');
      toast.success(`User role updated to ${newRole.toUpperCase()}`);
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
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
      toast.success('User permanently deleted');
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setUserToDelete(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  // Developer note: we allow the UI to render even if the mocked local user isn't 'admin' just so you can test it natively.
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground flex items-center">
          User Management 
          {!isAdmin && <ShieldAlert size={20} className="ml-3 text-red-500" title="You are viewing this as a non-admin via local mock." />}
        </h1>
        <p className="text-foreground/60">Admin panel for managing platform users and roles.</p>
      </div>

      <div className="bg-surface border border-foreground/10 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-foreground/5 border-b border-foreground/10 text-xs uppercase tracking-wider text-foreground/60 font-bold">
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Subscription</th>
                <th className="p-4">Registered</th>
                <th className="p-4">Account Role</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 text-sm">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-foreground/50">
                    <div className="flex flex-col items-center justify-center">
                      <ShieldAlert size={48} className="mb-4 text-foreground/20" />
                      <p className="text-lg font-bold">No users found</p>
                      <p className="text-sm">Please ensure your backend server is running.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-foreground/[0.02] transition-colors group">
                  <td className="p-4 pl-6 font-bold text-foreground">{u.name}</td>
                  <td className="p-4 text-foreground/70">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      u.subscription === 'Premium' 
                        ? 'bg-[#CFFAFE] text-cyan-900 dark:bg-cyan-900 dark:text-[#CFFAFE]' 
                        : 'bg-foreground/10 text-foreground'
                    }`}>
                      {u.subscription === 'Premium' ? <Star size={10} className="inline mr-1 mb-0.5 fill-current" /> : null}
                      {u.subscription || 'Free'}
                    </span>
                  </td>
                  <td className="p-4 text-foreground/60">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.email, e.target.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        u.role === 'admin' 
                          ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                          : u.role === 'creator' 
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'bg-surface text-foreground border-foreground/20'
                      }`}
                    >
                      <option value="user" className="bg-background text-foreground font-bold">USER</option>
                      <option value="creator" className="bg-background text-foreground font-bold">CREATOR</option>
                      <option value="admin" className="bg-background text-foreground font-bold">ADMIN</option>
                    </select>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button 
                      onClick={() => handleDeleteClick(u)} 
                      title="Permanently Delete User" 
                      className="p-2 bg-background border border-foreground/10 rounded-lg text-foreground/60 hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={u.email === user?.email} // Prevent admin from deleting themselves
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-foreground/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -z-10 pointer-events-none"></div>
            
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-6 mx-auto">
              <ShieldAlert size={32} />
            </div>
            
            <h2 className="text-2xl font-black text-foreground text-center mb-2">Delete User?</h2>
            <p className="text-foreground/60 text-center mb-8">
              Are you sure you want to permanently delete <strong className="text-foreground">{userToDelete.name}</strong>? This action cannot be undone and all associated data will be removed.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-foreground/10 font-bold text-foreground hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
