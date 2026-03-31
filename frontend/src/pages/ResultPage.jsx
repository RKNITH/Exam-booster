import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bookmark, BookmarkCheck, Download, Copy, FileText, Star,
  ChevronDown, ChevronUp, Globe, MapPin, Quote, Users,
  Lightbulb, FileCheck, Landmark, ArrowLeft, Tag, Share2, Trash2
} from 'lucide-react';
import api from '../utils/api.js';
import { exportToPDF, exportToMarkdown } from '../utils/export.js';
import GsBadge from '../components/ui/GsBadge.jsx';
import { SkeletonResult } from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

// ── UI string translations ────────────────────────────────────────────────────
const UI = {
  english: {
    introduction: 'Introduction',
    keyAnalysis: 'Key Analysis Points',
    criticalAnalysis: 'Critical Analysis',
    indiaCaseStudies: 'India Case Studies',
    globalCaseStudies: 'Global Case Studies',
    ethicalDimensions: 'GS4 Ethical Dimensions',
    quotes: 'Relevant Quotes & Thinkers',
    committees: 'Committees, Reports & Surveys',
    schemes: 'Government Schemes & Constitutional Articles',
    conclusion: 'Conclusion',
    relevance: 'Relevance',
    impact: 'Impact',
    rateContent: 'Rate this content:',
    manageTags: 'Manage Tags',
    addTagPlaceholder: 'Add a tag...',
    add: 'Add',
    bookmarked: 'Bookmarked',
    bookmark: 'Bookmark',
    copy: 'Copy',
    copied: 'Copied!',
    exportPDF: 'Export PDF',
    exportMarkdown: 'Export Markdown',
    generateAnother: 'Generate Another',
    contentNotFound: 'Content not found',
    failedLoad: 'Failed to load content',
    failedBookmark: 'Failed to update bookmark',
    failedRate: 'Failed to rate',
    failedTag: 'Failed to add tag',
    failedRemoveTag: 'Failed to remove tag',
    failedDelete: 'Failed to delete',
    ratingSaved: 'Rating saved!',
    tagAdded: 'Tag added!',
    copiedClipboard: 'Copied to clipboard!',
    deleted: 'Deleted successfully',
    confirmDelete: 'Delete this generated content?',
    bookmarkRemoved: 'Bookmark removed',
  },
  hindi: {
    introduction: 'परिचय',
    keyAnalysis: 'मुख्य विश्लेषण बिंदु',
    criticalAnalysis: 'आलोचनात्मक विश्लेषण',
    indiaCaseStudies: 'भारत के केस स्टडी',
    globalCaseStudies: 'वैश्विक केस स्टडी',
    ethicalDimensions: 'GS4 नैतिक आयाम',
    quotes: 'प्रासंगिक उद्धरण और विचारक',
    committees: 'समितियाँ, रिपोर्ट और सर्वेक्षण',
    schemes: 'सरकारी योजनाएँ और संवैधानिक अनुच्छेद',
    conclusion: 'निष्कर्ष',
    relevance: 'प्रासंगिकता',
    impact: 'प्रभाव',
    rateContent: 'इस सामग्री को रेट करें:',
    manageTags: 'टैग प्रबंधित करें',
    addTagPlaceholder: 'टैग जोड़ें...',
    add: 'जोड़ें',
    bookmarked: 'बुकमार्क किया',
    bookmark: 'बुकमार्क',
    copy: 'कॉपी',
    copied: 'कॉपी हो गया!',
    exportPDF: 'PDF निर्यात करें',
    exportMarkdown: 'Markdown निर्यात करें',
    generateAnother: 'दूसरा जेनेरेट करें',
    contentNotFound: 'सामग्री नहीं मिली',
    failedLoad: 'सामग्री लोड नहीं हो सकी',
    failedBookmark: 'बुकमार्क अपडेट नहीं हो सका',
    failedRate: 'रेटिंग सहेजी नहीं जा सकी',
    failedTag: 'टैग जोड़ा नहीं जा सका',
    failedRemoveTag: 'टैग हटाया नहीं जा सका',
    failedDelete: 'हटाने में विफल',
    ratingSaved: 'रेटिंग सहेजी गई!',
    tagAdded: 'टैग जोड़ा गया!',
    copiedClipboard: 'क्लिपबोर्ड पर कॉपी हो गया!',
    deleted: 'सफलतापूर्वक हटाया गया',
    confirmDelete: 'क्या आप इस सामग्री को हटाना चाहते हैं?',
    bookmarkRemoved: 'बुकमार्क हटाया गया',
  },
};

function Section({ icon: Icon, title, color = 'text-saffron-400', children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3">
          <Icon size={20} className={color} />
          <h3 className="font-display text-lg font-bold text-white">{title}</h3>
        </div>
        {open ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
      </button>
      {open && <div className="mt-5 pt-5 border-t border-navy-700">{children}</div>}
    </div>
  );
}

function CaseCard({ cs, type, t }) {
  const isIndia = type === 'india';
  return (
    <div className={`rounded-xl p-4 border ${isIndia ? 'bg-jade-500/5 border-jade-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${isIndia ? 'bg-jade-500/20' : 'bg-blue-500/20'}`}>
          {isIndia ? '🇮🇳' : '🌍'}
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">{cs.title}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <MapPin size={10} />
            <span>{cs.location}</span>
            {cs.year && <><span>•</span><span>{cs.year}</span></>}
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-300 mb-2 leading-relaxed">{cs.description}</p>
      {cs.relevance && (
        <div className="text-xs text-slate-400 mb-1">
          <span className="font-semibold text-slate-300">{t.relevance}: </span>{cs.relevance}
        </div>
      )}
      {cs.impact && (
        <div className={`text-xs mt-2 px-3 py-2 rounded-lg ${isIndia ? 'bg-jade-500/10 text-jade-300' : 'bg-blue-500/10 text-blue-300'}`}>
          <span className="font-semibold">{t.impact}: </span>{cs.impact}
        </div>
      )}
    </div>
  );
}

function KeywordHighlight({ text, keywords = [] }) {
  if (!keywords.length) return <span>{text}</span>;
  const pattern = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);
  return (
    <span>
      {parts.map((part, i) =>
        keywords.some(k => k.toLowerCase() === part.toLowerCase())
          ? <span key={i} className="highlight">{part}</span>
          : part
      )}
    </span>
  );
}

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [rating, setRating] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  // Derive translation table — useMemo so it re-computes whenever content loads
  const t = React.useMemo(
    () => UI[(content?.language === 'hindi') ? 'hindi' : 'english'],
    [content?.language]
  );

  useEffect(() => {
    api.get(`/cases/${id}`).then(res => {
      setContent(res.data);
      setBookmarked(res.data.isBookmarked);
      setRating(res.data.rating || 0);
      setTags(res.data.tags || []);
    }).catch(() => toast.error(UI.english.failedLoad))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleBookmark = async () => {
    try {
      const res = await api.patch(`/cases/${id}/bookmark`);
      setBookmarked(res.data.isBookmarked);
      toast.success(res.data.isBookmarked ? t.bookmarked + ' 🔖' : t.bookmarkRemoved);
    } catch { toast.error(t.failedBookmark); }
  };

  const handleRate = async (r) => {
    try {
      await api.patch(`/cases/${id}/rate`, { rating: r });
      setRating(r);
      toast.success(t.ratingSaved);
    } catch { toast.error(t.failedRate); }
  };

  const addTag = async () => {
    if (!tagInput.trim()) return;
    const newTags = [...new Set([...tags, tagInput.trim()])];
    try {
      await api.patch(`/cases/${id}/tags`, { tags: newTags });
      setTags(newTags);
      setTagInput('');
      toast.success(t.tagAdded);
    } catch { toast.error(t.failedTag); }
  };

  const removeTag = async (tag) => {
    const newTags = tags.filter(t => t !== tag);
    try {
      await api.patch(`/cases/${id}/tags`, { tags: newTags });
      setTags(newTags);
    } catch { toast.error(t.failedRemoveTag); }
  };

  const copyToClipboard = () => {
    const text = `Exam: ${content.topic}\n\nINTRODUCTION:\n${content.introduction}\n\nKEY POINTS:\n${content.body?.mainPoints?.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nCONCLUSION:\n${content.conclusion}`;
    navigator.clipboard.writeText(text);
    setCopyDone(true);
    toast.success(t.copiedClipboard);
    setTimeout(() => setCopyDone(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm(t.confirmDelete)) return;
    try {
      await api.delete(`/cases/${id}`);
      toast.success(t.deleted);
      navigate('/history');
    } catch { toast.error(t.failedDelete); }
  };

  if (loading) return <SkeletonResult />;
  if (!content) return <div className="text-center py-20"><p className="text-slate-400">{UI.english.contentNotFound}</p></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2 mt-1 shrink-0">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <GsBadge paper={content.gsPaper} />
            {content.language === 'hindi' && (
              <span className="badge bg-orange-500/15 text-orange-300 border border-orange-500/30">🇮🇳 हिंदी</span>
            )}
            {content.language === 'english' && (
              <span className="badge bg-blue-500/15 text-blue-300 border border-blue-500/30">🇬🇧 English</span>
            )}
            {content.theme && (
              <span className="badge bg-white/5 text-slate-300 border border-white/10">{content.theme}</span>
            )}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">{content.topic}</h1>
          <div className="flex flex-wrap gap-1.5">
            {(content.keywords || []).map((kw, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-saffron-500/10 text-saffron-300 border border-saffron-500/20">{kw}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={toggleBookmark}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${bookmarked ? 'bg-saffron-500/20 border-saffron-500/40 text-saffron-300' : 'btn-secondary'
            }`}>
          {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {bookmarked ? t.bookmarked : t.bookmark}
        </button>
        <button onClick={copyToClipboard} className="btn-secondary flex items-center gap-2 text-sm">
          <Copy size={16} />
          {copyDone ? t.copied : t.copy}
        </button>
        <button onClick={() => exportToPDF(content)} className="btn-secondary flex items-center gap-2 text-sm">
          <FileText size={16} />
          PDF
        </button>
        <button onClick={() => exportToMarkdown(content)} className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={16} />
          Markdown
        </button>
        <button onClick={() => setShowTagInput(v => !v)} className="btn-secondary flex items-center gap-2 text-sm">
          <Tag size={16} />
          Tags
        </button>
        <button onClick={handleDelete} className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-red-500/20 text-sm transition-all">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">{t.rateContent}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(r => (
            <button key={r} onClick={() => handleRate(r)} className="transition-transform hover:scale-110">
              <Star size={20} className={r <= rating ? 'text-saffron-400 fill-saffron-400' : 'text-slate-600'} />
            </button>
          ))}
        </div>
      </div>

      {/* Tag input */}
      {showTagInput && (
        <div className="card animate-slide-up">
          <p className="text-sm font-semibold text-slate-300 mb-3">{t.manageTags}</p>
          <div className="flex gap-2 mb-3">
            <input type="text" className="input-field flex-1 py-2" placeholder={t.addTagPlaceholder}
              value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()} />
            <button onClick={addTag} className="btn-primary px-4 py-2 text-sm">{t.add}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-navy-800 border border-navy-600 text-sm text-slate-300">
                {t}
                <button onClick={() => removeTag(t)} className="text-slate-500 hover:text-red-400 ml-1">×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Introduction */}
      <Section icon={FileCheck} title={t.introduction} color="text-saffron-400">
        <p className="text-slate-300 leading-relaxed text-base">
          <KeywordHighlight text={content.introduction} keywords={content.keywords} />
        </p>
      </Section>

      {/* Main Points */}
      {content.body?.mainPoints?.length > 0 && (
        <Section icon={Lightbulb} title={t.keyAnalysis} color="text-blue-400">
          <div className="space-y-3">
            {content.body.mainPoints.map((point, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  <KeywordHighlight text={point} keywords={content.keywords} />
                </p>
              </div>
            ))}
          </div>
          {content.body?.analysis && (
            <div className="mt-5 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wide">{t.criticalAnalysis}</p>
              <p className="text-slate-300 text-sm leading-relaxed">{content.body.analysis}</p>
            </div>
          )}
        </Section>
      )}

      {/* India Case Studies */}
      {content.indiaCaseStudies?.length > 0 && (
        <Section icon={MapPin} title={t.indiaCaseStudies} color="text-jade-400">
          <div className="grid md:grid-cols-2 gap-4">
            {content.indiaCaseStudies.map((cs, i) => <CaseCard key={i} cs={cs} type="india" t={t} />)}
          </div>
        </Section>
      )}

      {/* Global Case Studies */}
      {content.globalCaseStudies?.length > 0 && (
        <Section icon={Globe} title={t.globalCaseStudies} color="text-blue-400">
          <div className="grid md:grid-cols-2 gap-4">
            {content.globalCaseStudies.map((cs, i) => <CaseCard key={i} cs={cs} type="global" t={t} />)}
          </div>
        </Section>
      )}

      {/* GS4 Ethical Dimensions */}
      {content.ethicalExamples?.length > 0 && (
        <Section icon={Star} title={t.ethicalDimensions} color="text-saffron-400">
          <div className="space-y-3">
            {content.ethicalExamples.map((ex, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-saffron-500/5 border border-saffron-500/10">
                <div className="w-5 h-5 rounded-full bg-saffron-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-saffron-400" />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{ex}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Quotes */}
      {content.quotes?.length > 0 && (
        <Section icon={Quote} title={t.quotes} color="text-purple-400">
          <div className="space-y-4">
            {content.quotes.map((q, i) => (
              <div key={i} className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 relative">
                <div className="absolute top-3 right-3 text-purple-300/20 text-4xl font-serif">"</div>
                <p className="text-slate-200 italic mb-3 leading-relaxed text-sm">"{q.text}"</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-purple-400 font-semibold text-sm">— {q.author}</span>
                  {q.source && <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-white/5">{q.source}</span>}
                  {q.context && <span className="text-xs text-slate-500">{q.context}</span>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Committees & Reports */}
      {content.committees?.length > 0 && (
        <Section icon={Users} title={t.committees} color="text-teal-400">
          <div className="space-y-2">
            {content.committees.map((c, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-teal-500/5 border border-teal-500/10">
                <span className="text-teal-400 shrink-0 mt-0.5">→</span>
                <p className="text-slate-300 text-sm">{c}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Government Schemes & Articles */}
      {(content.governmentSchemes?.length > 0 || content.articles?.length > 0) && (
        <Section icon={Landmark} title={t.schemes} color="text-indigo-400">
          <div className="grid sm:grid-cols-2 gap-2">
            {[...(content.governmentSchemes || []), ...(content.articles || [])].map((s, i) => (
              <div key={i} className="flex gap-2 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                <span className="text-indigo-400 text-xs mt-1 shrink-0">◆</span>
                <p className="text-slate-300 text-sm">{s}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Conclusion */}
      <Section icon={FileCheck} title={t.conclusion} color="text-jade-400">
        <div className="p-4 rounded-xl bg-jade-500/5 border border-jade-500/10">
          <p className="text-slate-200 leading-relaxed">
            <KeywordHighlight text={content.conclusion} keywords={content.keywords} />
          </p>
        </div>
      </Section>

      {/* Bottom actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-navy-700">
        <button onClick={() => exportToPDF(content)} className="btn-primary flex items-center gap-2">
          <FileText size={18} />
          {t.exportPDF}
        </button>
        <button onClick={() => exportToMarkdown(content)} className="btn-secondary flex items-center gap-2">
          <Download size={18} />
          {t.exportMarkdown}
        </button>
        <button onClick={() => navigate('/generate')} className="btn-secondary flex items-center gap-2 ml-auto">
          Generate Another
        </button>
      </div>
    </div>
  );
}