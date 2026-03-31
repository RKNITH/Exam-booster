import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, BookOpen, Eye, Star, ExternalLink, AlertTriangle } from 'lucide-react';
import api from '../utils/api.js';
import GsBadge from '../components/ui/GsBadge.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/history?page=${page}&limit=15`);
      setHistory(res.data.history);
      setPagination({ total: res.data.total, pages: res.data.pages });
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [page]);

  const clearHistory = async () => {
    setClearing(true);
    try {
      await api.delete('/history/clear');
      toast.success('History cleared (bookmarks kept)');
      setShowConfirm(false);
      fetchHistory();
    } catch {
      toast.error('Failed to clear history');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <History className="text-saffron-400" size={28} />
            History
          </h1>
          <p className="text-slate-400">All your generated UPSC content</p>
        </div>
        {history.length > 0 && (
          <button onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all shrink-0">
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card max-w-md w-full animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Clear History</h3>
                <p className="text-sm text-slate-400">This cannot be undone</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6 text-sm">All non-bookmarked content will be permanently deleted. Bookmarked items will be kept safe.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={clearHistory} disabled={clearing}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all disabled:opacity-50">
                {clearing ? 'Clearing...' : 'Clear History'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-16 skeleton rounded-xl" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="font-display text-xl font-bold text-white mb-2">No history yet</h3>
          <p className="text-slate-400 mb-6">Start generating UPSC content to build your revision history</p>
          <button onClick={() => navigate('/generate')} className="btn-primary">Generate Now</button>
        </div>
      ) : (
        <>
          {/* Stats summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="card text-center">
              <p className="text-2xl font-bold text-white">{pagination?.total || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Total Generated</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-saffron-400">{history.filter(h => h.isBookmarked).length}</p>
              <p className="text-xs text-slate-400 mt-1">Bookmarked</p>
            </div>
            <div className="card text-center col-span-2 sm:col-span-1">
              <p className="text-2xl font-bold text-jade-400">{history.filter(h => h.rating >= 4).length}</p>
              <p className="text-xs text-slate-400 mt-1">Highly Rated</p>
            </div>
          </div>

          {/* History list */}
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item._id} onClick={() => navigate(`/result/${item._id}`)}
                className="flex items-center gap-4 px-5 py-4 rounded-xl bg-navy-900 border border-navy-700 hover:border-saffron-500/30 hover:bg-navy-800 cursor-pointer group transition-all">
                <div className="w-9 h-9 rounded-xl bg-navy-800 group-hover:bg-navy-700 flex items-center justify-center shrink-0 transition-colors">
                  <BookOpen size={16} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm truncate group-hover:text-saffron-300 transition-colors">{item.topic}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <GsBadge paper={item.gsPaper} />
                    {item.language === 'hindi' && <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/20">हिंदी</span>}
                    {item.theme && <span className="text-xs text-slate-500">{item.theme}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.isBookmarked && (
                    <span className="text-saffron-400 text-xs font-semibold hidden sm:block">🔖</span>
                  )}
                  {item.rating > 0 && (
                    <div className="flex items-center gap-1 hidden sm:flex">
                      <Star size={12} className="text-saffron-400 fill-saffron-400" />
                      <span className="text-xs text-slate-400">{item.rating}</span>
                    </div>
                  )}
                  {item.viewCount > 0 && (
                    <div className="flex items-center gap-1 text-slate-500 hidden sm:flex">
                      <Eye size={12} />
                      <span className="text-xs">{item.viewCount}</span>
                    </div>
                  )}
                  <span className="text-xs text-slate-500 hidden md:block">
                    {new Date(item.createdAt).toLocaleDateString('en-IN')}
                  </span>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-saffron-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">← Previous</button>
              <span className="text-slate-400 text-sm px-4">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
