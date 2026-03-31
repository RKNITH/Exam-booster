import React, { useEffect, useState } from 'react';
import { Shield, Users, BookOpen, TrendingUp, RefreshCw } from 'lucide-react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="text-saffron-400" size={28} />
            Admin Panel
          </h1>
          <p className="text-slate-400 mt-1">Platform management & moderation</p>
        </div>
        <button onClick={fetchData} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Users', value: stats?.totalUsers ?? '—', color: 'bg-blue-600' },
          { icon: BookOpen, label: 'Content Generated', value: stats?.totalContent ?? '—', color: 'bg-saffron-600' },
          { icon: TrendingUp, label: 'GS Papers', value: stats?.contentByPaper?.length ?? '—', color: 'bg-jade-600' },
          { icon: Shield, label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'bg-purple-600' },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} shrink-0`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content by paper */}
      {stats?.contentByPaper?.length > 0 && (
        <div className="card">
          <h2 className="font-display text-xl font-bold text-white mb-4">Content by GS Paper</h2>
          <div className="space-y-3">
            {stats.contentByPaper.map((p) => {
              const pct = Math.round((p.count / stats.totalContent) * 100);
              return (
                <div key={p._id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">{p._id || 'Unknown'}</span>
                    <span className="text-slate-400">{p.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-saffron-500 to-saffron-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Users list */}
      <div className="card">
        <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users size={20} className="text-saffron-400" />
          Registered Users ({users.length})
        </h2>
        {loading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => <div key={i} className="h-12 skeleton rounded-lg" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-navy-700">
                  <th className="pb-3 font-semibold">Username</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold hidden sm:table-cell">Joined</th>
                  <th className="pb-3 font-semibold hidden md:table-cell">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-navy-800/50 transition-colors">
                    <td className="py-3 text-white font-medium">{user.username}</td>
                    <td className="py-3">
                      <span className={`badge ${user.role === 'admin' ? 'bg-saffron-500/20 text-saffron-300 border-saffron-500/30' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 hidden sm:table-cell">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 text-slate-400 hidden md:table-cell">{new Date(user.lastActive).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
