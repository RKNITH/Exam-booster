import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, ExternalLink, SlidersHorizontal } from 'lucide-react';
import api from '../utils/api.js';
import GsBadge from '../components/ui/GsBadge.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

const GS_FILTERS = ['all', 'GS1', 'GS2', 'GS3', 'GS4', 'Essay'];
const THEMES = ['all', 'Governance', 'Society', 'Economy', 'Environment', 'Ethics', 'Security', 'International', 'Culture', 'Technology'];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [paper, setPaper] = useState('all');
  const [theme, setTheme] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const doSearch = async (pg = 1) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: 12 });
      if (query.trim()) params.set('search', query.trim());
      if (paper !== 'all') params.set('gsPaper', paper);
      if (theme !== 'all') params.set('theme', theme);
      const res = await api.get(`/cases?${params}`);
      setResults(res.data.cases);
      setPagination(res.data.pagination);
      setPage(pg);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <Search className="text-saffron-400" size={28} />
          Search Content
        </h1>
        <p className="text-slate-400">Find topics from your generated content</p>
      </div>

      {/* Search form */}
      <div className="card space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" className="input-field pl-11 text-base"
              placeholder="Search topics, keywords..."
              value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <button type="button" onClick={() => setShowFilters(v => !v)}
            className={`btn-secondary flex items-center gap-2 text-sm px-4 ${showFilters ? 'border-saffron-500/50 text-saffron-300' : ''}`}>
            <SlidersHorizontal size={16} />
            <span className="hidden sm:block">Filters</span>
          </button>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>

        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-navy-700 animate-slide-up">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">GS Paper</p>
              <div className="flex flex-wrap gap-2">
                {GS_FILTERS.map(f => (
                  <button key={f} onClick={() => setPaper(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      paper === f ? 'bg-saffron-500 border-saffron-500 text-white' : 'bg-navy-800 border-navy-600 text-slate-300 hover:border-saffron-500/50'
                    }`}>
                    {f === 'all' ? 'All' : f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Theme</p>
              <div className="flex flex-wrap gap-2">
                {THEMES.map(t => (
                  <button key={t} onClick={() => setTheme(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      theme === t ? 'bg-blue-500 border-blue-500 text-white' : 'bg-navy-800 border-navy-600 text-slate-300 hover:border-blue-500/50'
                    }`}>
                    {t === 'all' ? 'All Themes' : t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-bold text-white mb-2">No results found</h3>
          <p className="text-slate-400 mb-6">Try different keywords or generate new content on this topic</p>
          <button onClick={() => navigate('/generate')} className="btn-primary">Generate Content</button>
        </div>
      ) : results.length > 0 ? (
        <>
          <p className="text-sm text-slate-400">{pagination?.total} result{pagination?.total !== 1 ? 's' : ''} found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(item => (
              <div key={item._id} onClick={() => navigate(`/result/${item._id}`)}
                className="card-hover cursor-pointer group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm leading-tight mb-1.5 line-clamp-2 group-hover:text-saffron-300 transition-colors">
                      {item.topic}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      <GsBadge paper={item.gsPaper} />
                      {item.language === 'hindi' && <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/20">हिंदी</span>}
                      {item.theme && <span className="badge bg-white/5 text-slate-400 border-white/10">{item.theme}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(item.keywords || []).slice(0, 4).map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-navy-800 text-slate-400">{kw}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString('en-IN')}</span>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-saffron-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => doSearch(page - 1)} disabled={page === 1} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">← Prev</button>
              <span className="text-slate-400 text-sm px-4">Page {page} of {pagination.pages}</span>
              <button onClick={() => doSearch(page + 1)} disabled={page === pagination.pages} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-bold text-white mb-2">Search your content</h3>
          <p className="text-slate-400">Enter a keyword or topic to search through your generated content</p>
        </div>
      )}
    </div>
  );
}
