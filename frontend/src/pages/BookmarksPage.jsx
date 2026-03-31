import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Search, Filter, BookOpen, ExternalLink } from 'lucide-react';
import api from '../utils/api.js';
import GsBadge from '../components/ui/GsBadge.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

const GS_FILTERS = ['all', 'GS1', 'GS2', 'GS3', 'GS4', 'Essay'];

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paperFilter, setPaperFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ bookmarked: 'true', page, limit: 12 });
      if (search) params.set('search', search);
      if (paperFilter !== 'all') params.set('gsPaper', paperFilter);
      const res = await api.get(`/cases?${params}`);
      setBookmarks(res.data.cases);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookmarks(); }, [page, paperFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookmarks();
  };

  const removeBookmark = async (id, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/cases/${id}/bookmark`);
      setBookmarks(prev => prev.filter(b => b._id !== id));
      toast.success('Bookmark removed');
    } catch {
      toast.error('Failed to remove bookmark');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <Bookmark className="text-saffron-400" size={28} />
          Bookmarks
        </h1>
        <p className="text-slate-400">Your saved UPSC content for quick revision</p>
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" className="input-field pl-9" placeholder="Search bookmarks..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary px-5">Search</button>
        </form>
        <div className="flex flex-wrap gap-2">
          {GS_FILTERS.map(f => (
            <button key={f} onClick={() => { setPaperFilter(f); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                paperFilter === f
                  ? 'bg-saffron-500 border-saffron-500 text-white'
                  : 'bg-navy-800 border-navy-600 text-slate-300 hover:border-saffron-500/50'
              }`}>
              {f === 'all' ? 'All Papers' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔖</div>
          <h3 className="font-display text-xl font-bold text-white mb-2">No bookmarks yet</h3>
          <p className="text-slate-400 mb-6">Generate content and bookmark it for quick access during revision</p>
          <button onClick={() => navigate('/generate')} className="btn-primary">Generate Content</button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map(b => (
              <div key={b._id} onClick={() => navigate(`/result/${b._id}`)}
                className="card-hover cursor-pointer group relative">
                <button onClick={(e) => removeBookmark(b._id, e)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-saffron-400 hover:bg-red-500/10 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100">
                  <Bookmark size={16} className="fill-current" />
                </button>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-saffron-500/10 flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-saffron-400" />
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2 group-hover:text-saffron-300 transition-colors">
                      {b.topic}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      <GsBadge paper={b.gsPaper} />
                      {b.language === 'hindi' && <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/20">हिंदी</span>}
                      {b.theme && <span className="badge bg-white/5 text-slate-400 border-white/10">{b.theme}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(b.keywords || []).slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-navy-800 text-slate-400">{kw}</span>
                  ))}
                </div>
                {b.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {b.tags.map((t, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{new Date(b.createdAt).toLocaleDateString('en-IN')}</span>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-saffron-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Previous</button>
              <span className="text-slate-400 text-sm">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
