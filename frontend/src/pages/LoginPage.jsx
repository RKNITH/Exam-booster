import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success('Welcome back! 🎯');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute text-6xl opacity-10 font-display text-saffron-400 select-none"
              style={{ top: `${(i * 7) % 100}%`, left: `${(i * 13) % 100}%`, transform: 'rotate(-15deg)' }}>
              {['⚖', '📜', '🏛', '🗺', '⭐'][i % 5]}
            </div>
          ))}
        </div>
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-3xl mb-8 shadow-2xl shadow-saffron-500/30">
            ⚖
          </div>
          <h1 className="font-display text-5xl font-black text-white mb-4 leading-tight">
            Exam<br />
            <span className="text-gradient">Booster</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            AI-powered case studies, quotes & structured content for Exam answer writing excellence.
          </p>
          <div className="space-y-4">
            {[
              'Real case studies from India & globally',
              'GS1–GS4 & Essay structured content',
              'Committee reports & government schemes',
              'GS4 ethical dimensions & examples',
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-saffron-500/20 border border-saffron-500/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-saffron-400" />
                </div>
                <span className="text-slate-300">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <span className="text-3xl">⚖</span>
            <h1 className="font-display text-2xl font-bold text-white">Exam Booster</h1>
          </div>

          <div className="card">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400">Sign in to continue your preparation</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="input-field pr-12"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-slate-400">
              New aspirant?{' '}
              <Link to="/register" className="text-saffron-400 hover:text-saffron-300 font-semibold">
                Create account
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-slate-600">
            For UPSC preparation purposes only
          </p>
        </div>
      </div>
    </div>
  );
}
