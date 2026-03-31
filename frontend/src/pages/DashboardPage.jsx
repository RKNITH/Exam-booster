import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Bookmark, History, TrendingUp, BookOpen, Flame, ChevronRight, Star, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import GsBadge from '../components/ui/GsBadge.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card-hover flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [trending, setTrending] = useState([]);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trendRes, dailyRes] = await Promise.all([
          api.get('/user/stats'),
          api.get('/generate/trending').catch(() => ({ data: [] })),
          api.get('/generate/daily').catch(() => ({ data: null })),
        ]);
        setStats(statsRes.data);
        setTrending(trendRes.data.slice(0, 6));
        setDaily(dailyRes.data);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const trendBadge = (trend) => {
    if (trend === 'hot') return <span className="text-xs font-bold text-red-400 flex items-center gap-0.5"><Flame size={10} />HOT</span>;
    if (trend === 'rising') return <span className="text-xs font-bold text-saffron-400">↑ RISING</span>;
    return <span className="text-xs text-slate-500">STABLE</span>;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            Good day, <span className="text-gradient">{user?.username}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">Ready to ace your Exam preparation?</p>
        </div>
        <button onClick={() => navigate('/generate')} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Sparkles size={18} />
          Generate Content
        </button>
      </div>

      {/* Daily topic */}
      {daily && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-saffron-600/20 via-saffron-500/10 to-transparent border border-saffron-500/30 p-6">
          <div className="absolute right-4 top-4 text-5xl opacity-10">📅</div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-saffron-500/20 flex items-center justify-center shrink-0">
              <Star size={20} className="text-saffron-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-saffron-400 font-semibold uppercase tracking-wider mb-1">Today's Suggested Topic</p>
              <h3 className="text-white font-bold text-lg mb-3 truncate">{daily.today}</h3>
              <button onClick={() => navigate(`/generate?topic=${encodeURIComponent(daily.today)}`)}
                className="text-saffron-400 hover:text-saffron-300 text-sm font-semibold flex items-center gap-1">
                Generate Now <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon={BookOpen} label="Topics Generated" value={stats?.total || 0} color="bg-blue-600" />
            <StatCard icon={Bookmark} label="Bookmarked" value={stats?.bookmarked || 0} color="bg-saffron-600" />
            <StatCard icon={TrendingUp} label="Most Active" value={stats?.byPaper?.[0]?._id || '—'} color="bg-jade-600" />
            <StatCard icon={History} label="Recent Topics" value={stats?.recentTopics?.length || 0} color="bg-purple-600" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trending topics */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-saffron-400" />
              Trending Topics
            </h2>
            <button onClick={() => navigate('/generate')} className="text-xs text-saffron-400 hover:text-saffron-300">View all</button>
          </div>
          <div className="space-y-2">
            {loading ? Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-xl" />
            )) : trending.map((t, i) => (
              <button key={i} onClick={() => navigate(`/generate?topic=${encodeURIComponent(t.topic)}`)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-navy-800 transition-all group text-left">
                <span className="text-slate-500 text-sm font-mono w-5 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate group-hover:text-saffron-300 transition-colors">{t.topic}</p>
                  <p className="text-slate-500 text-xs truncate">{t.reason}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <GsBadge paper={t.gsPaper} />
                  {trendBadge(t.trend)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent history */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Clock size={20} className="text-saffron-400" />
              Recent Activity
            </h2>
            <button onClick={() => navigate('/history')} className="text-xs text-saffron-400 hover:text-saffron-300">View all</button>
          </div>
          <div className="space-y-2">
            {loading ? Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-14 skeleton rounded-xl" />
            )) : stats?.recentTopics?.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-slate-400">No topics yet. Start generating!</p>
                <button onClick={() => navigate('/generate')} className="mt-3 btn-primary text-sm px-4 py-2">
                  Generate First Topic
                </button>
              </div>
            ) : (
              stats?.recentTopics?.map((t, i) => (
                <button key={i} onClick={() => navigate(`/result/${t._id}`)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-navy-800 transition-all group text-left">
                  <div className="w-8 h-8 rounded-lg bg-navy-800 group-hover:bg-navy-700 flex items-center justify-center shrink-0">
                    <BookOpen size={14} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-saffron-300 transition-colors">{t.topic}</p>
                    <p className="text-slate-500 text-xs">{new Date(t.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {t.language === 'hindi' && <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/20">हिंदी</span>}
                    <GsBadge paper={t.gsPaper} />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: '📜', label: 'GS1 Topics', action: () => navigate('/generate?paper=GS1') },
          { icon: '🏛', label: 'GS2 Topics', action: () => navigate('/generate?paper=GS2') },
          { icon: '💹', label: 'GS3 Topics', action: () => navigate('/generate?paper=GS3') },
          { icon: '⚖', label: 'GS4 Ethics', action: () => navigate('/generate?paper=GS4') },
        ].map((item, i) => (
          <button key={i} onClick={item.action}
            className="card-hover flex flex-col items-center gap-2 py-5 cursor-pointer">
            <span className="text-3xl">{item.icon}</span>
            <span className="text-sm font-semibold text-slate-300">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
