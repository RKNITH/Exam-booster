import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return toast.error('Fill all fields');
    if (form.username.length < 3) return toast.error('Username must be at least 3 characters');
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) return toast.error('Username can only contain letters, numbers, underscores');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await register(form.username, form.password);
      toast.success('Account created! Welcome to Exam Booster 🎯');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-2xl">⚖</div>
          <h1 className="font-display text-2xl font-bold text-white">Exam Booster</h1>
        </div>

        <div className="card">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-white mb-2">Start your journey</h2>
            <p className="text-slate-400">Create your free account to begin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input type="text" className="input-field" placeholder="Choose a username (letters, numbers, _)"
                value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input-field pr-12"
                  placeholder="Minimum 6 characters"
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <input type="password" className="input-field" placeholder="Re-enter password"
                value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                <><UserPlus size={18} />Create Account</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-saffron-400 hover:text-saffron-300 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
