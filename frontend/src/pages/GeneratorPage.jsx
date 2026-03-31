import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Lightbulb, Zap, Languages } from 'lucide-react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const GS_PAPERS = ['all', 'GS1', 'GS2', 'GS3', 'GS4', 'Essay'];

const PAPER_DESC = {
  all: 'All GS Papers & Essay',
  GS1: 'History, Geography, Society, Culture',
  GS2: 'Governance, Constitution, Polity, IR',
  GS3: 'Economy, Environment, Technology, Security',
  GS4: 'Ethics, Integrity, Aptitude',
  Essay: 'Essay Paper',
};

const PAPER_DESC_HI = {
  all: 'Sabhi GS Papers aur Essay',
  GS1: 'Itihas, Bhugol, Samaj, Sanskriti',
  GS2: 'Shasan, Samvidhan, Rajniti, Antarrashtriya Sambandh',
  GS3: 'Arthvyavastha, Paaryavaran, Praudyogiki, Suraksha',
  GS4: 'Naitikta, Suchharita, Abhiruchi',
  Essay: 'Nibandh Prashna Patra',
};

const SUGGESTIONS_EN = [
  'Women Empowerment in India', 'Federalism & Centre-State Relations', 'Ethics in AI Governance',
  'Climate Change & India\'s NDC', 'Digital Public Infrastructure', 'Food Security & PDS Reforms',
  'Judicial Reforms in India', 'Tribal Rights & Forest Act', 'Urban Governance & Smart Cities',
  'Critical Minerals & Geopolitics', 'Mental Health Policy', 'Cooperative Federalism',
  'One Nation One Election', 'Green Hydrogen Mission', 'Whistleblower Protection',
];

const SUGGESTIONS_HI = [
  'Bharat mein Mahila Sashaktikaran', 'Sanghvaad aur Kendr-Rajya Sambandh', 'AI Shasan mein Naitikta',
  'Jalvayu Parivartan aur Bharat ka NDC', 'Digital Public Infrastructure', 'Khadya Suraksha aur PDS Sudhar',
  'Bharat mein Nyayik Sudhar', 'Janjatiy Adhikar aur Van Adhiniyam', 'Shahari Shasan aur Smart Cities',
  'Mahatvapurna Khanij aur Bhu-rajniti', 'Mansik Swasthya Niti', 'Sahkaari Sanghvaad',
  'Ek Desh Ek Chunav', 'Green Hydrogen Mission', 'Whistleblower Suraksha',
];

const STEPS_EN = [
  'Connecting to AI engine...',
  'Analyzing topic dimensions...',
  'Generating case studies...',
  'Finding relevant quotes...',
  'Structuring UPSC content...',
  'Finalizing output...',
];

const STEPS_HI = [
  'AI engine se jud rahe hain...',
  'Topic ke dimensions analyze ho rahe hain...',
  'Case studies generate ho rahi hain...',
  'Relevant quotes dhunde ja rahe hain...',
  'UPSC content structure ho raha hai...',
  'Output final ho raha hai...',
];

export default function GeneratorPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [topic, setTopic] = useState(params.get('topic') || '');
  const [gsPaper, setGsPaper] = useState(params.get('paper') || 'all');
  const [context, setContext] = useState('');
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');

  const isHindi = language === 'hindi';
  const steps = isHindi ? STEPS_HI : STEPS_EN;
  const suggestions = isHindi ? SUGGESTIONS_HI : SUGGESTIONS_EN;
  const paperDesc = isHindi ? PAPER_DESC_HI : PAPER_DESC;

  useEffect(() => {
    let i = 0;
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setStep(steps[i % steps.length]);
        i++;
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading, language]);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error(isHindi ? 'Kripya topic darj karein' : 'Please enter a topic');
    if (topic.trim().length < 3) return toast.error(isHindi ? 'Topic bahut chhota hai' : 'Topic too short');

    setLoading(true);
    setStep(steps[0]);
    try {
      const res = await api.post('/generate', {
        topic: topic.trim(),
        gsPaper,
        additionalContext: context,
        language,
      });
      toast.success(isHindi ? 'Content successfully generate hua! 🎯' : 'Content generated successfully! 🎯');
      navigate(`/result/${res.data._id}`);
    } catch (err) {
      const msg = err.response?.data?.error || (isHindi ? 'Generation fail hua. Dobara try karein.' : 'Generation failed. Please try again.');
      toast.error(msg);
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
          {isHindi ? 'UPSC Content ' : 'Generate '}
          <span className="text-gradient">{isHindi ? 'Generate करें' : 'UPSC Content'}</span>
        </h1>
        <p className="text-slate-400">
          {isHindi
            ? 'Koi bhi UPSC topic dalein — AI-powered case studies, quotes aur structured answer content paayein'
            : 'Enter any UPSC topic to get AI-powered case studies, quotes & structured answer content'}
        </p>
      </div>

      {/* Main form */}
      <div className="card space-y-6">

        {/* Language Toggle */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Languages size={16} className="text-saffron-400" />
            {isHindi ? 'Bhasha chunein' : 'Select Language'}
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage('english')}
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                language === 'english'
                  ? 'bg-saffron-500 border-saffron-500 text-white shadow-lg shadow-saffron-500/20'
                  : 'bg-navy-800 border-navy-600 text-slate-300 hover:border-saffron-500/50 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setLanguage('hindi')}
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                language === 'hindi'
                  ? 'bg-saffron-500 border-saffron-500 text-white shadow-lg shadow-saffron-500/20'
                  : 'bg-navy-800 border-navy-600 text-slate-300 hover:border-saffron-500/50 hover:text-white'
              }`}
            >
              🇮🇳 हिंदी
            </button>
          </div>
          {language === 'hindi' && (
            <p className="text-xs text-saffron-400 mt-2">✓ AI poora content Hindi (Devanagari) mein generate karega</p>
          )}
        </div>

        {/* Topic input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {isHindi ? 'Topic / Vishay' : 'Topic / Subject'} <span className="text-red-400">*</span>
          </label>
          <textarea
            className="input-field resize-none h-24 text-base"
            placeholder={isHindi
              ? 'जैसे: भारत में महिला सशक्तिकरण, संघवाद, AI शासन में नैतिकता...'
              : 'e.g., Women Empowerment in India, Federalism, Ethics in AI Governance...'}
            value={topic}
            onChange={e => setTopic(e.target.value)}
            disabled={loading}
            maxLength={300}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-500">
              {isHindi ? 'Behtar results ke liye specific rahein' : 'Be specific for better results'}
            </span>
            <span className="text-xs text-slate-500">{topic.length}/300</span>
          </div>
        </div>

        {/* GS Paper selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            {isHindi ? 'GS Paper Focus' : 'GS Paper Focus'}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {GS_PAPERS.map(p => (
              <button key={p} onClick={() => setGsPaper(p)} disabled={loading}
                className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all ${
                  gsPaper === p
                    ? 'bg-saffron-500 border-saffron-500 text-white shadow-lg shadow-saffron-500/20'
                    : 'bg-navy-800 border-navy-600 text-slate-300 hover:border-saffron-500/50 hover:text-white'
                }`}>
                {p === 'all' ? (isHindi ? 'Sab' : 'All') : p}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">{paperDesc[gsPaper]}</p>
        </div>

        {/* Optional context */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {isHindi ? 'Atirikt Sandarbh' : 'Additional Context'}{' '}
            <span className="text-slate-500 font-normal">({isHindi ? 'vaikalpik' : 'optional'})</span>
          </label>
          <input type="text" className="input-field" disabled={loading}
            placeholder={isHindi
              ? 'जैसे: आर्थिक पहलुओं पर ध्यान दें, 2024 के हालिया घटनाक्रम...'
              : 'e.g., focus on economic aspects, recent 2024 developments, specific state...'}
            value={context} onChange={e => setContext(e.target.value)} />
        </div>

        {/* Generate button */}
        <button onClick={handleGenerate} disabled={loading || !topic.trim()}
          className="btn-primary w-full flex items-center justify-center gap-3 text-base py-4">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="animate-pulse">{step}</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              {isHindi ? 'UPSC Content Generate करें' : 'Generate UPSC Content'}
              <Zap size={16} className="text-saffron-200" />
            </>
          )}
        </button>

        {loading && (
          <div className="bg-navy-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-saffron-400 animate-pulse" />
              <span className="text-sm text-slate-300">
                {isHindi ? 'AI aapka content tayar kar raha hai...' : 'AI is working on your content...'}
              </span>
            </div>
            <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-saffron-500 to-saffron-400 rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {isHindi ? 'Comprehensive output ke liye 15-30 second lag sakte hain' : 'This may take 15–30 seconds for comprehensive output'}
            </p>
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      <div className="card">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb size={18} className="text-saffron-400" />
          {isHindi ? 'Quick Topic Suggestions' : 'Quick Topic Suggestions'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => setTopic(s)} disabled={loading}
              className="text-xs px-3 py-2 rounded-full bg-navy-800 border border-navy-600 text-slate-300
                hover:border-saffron-500/50 hover:text-saffron-300 hover:bg-navy-700 transition-all">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card bg-gradient-to-r from-navy-900 to-navy-800">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> {isHindi ? 'Best Results ke liye Tips' : 'Tips for Best Results'}
        </h3>
        <ul className="space-y-2 text-sm text-slate-400">
          {isHindi ? (
            <>
              <li className="flex items-start gap-2"><span className="text-saffron-400 shrink-0 mt-0.5">•</span>Specific rahein: "Gramin Bharat mein Mahila Sashaktikaran" &gt; "Mahila"</li>
              <li className="flex items-start gap-2"><span className="text-saffron-400 shrink-0 mt-0.5">•</span>Focused content ke liye sahi GS paper chunein</li>
              <li className="flex items-start gap-2"><span className="text-saffron-400 shrink-0 mt-0.5">•</span>"2024 ka data include karein" ya "Northeast India pe focus" jaisa context add karein</li>
              <li className="flex items-start gap-2"><span className="text-saffron-400 shrink-0 mt-0.5">•</span>Easy revision ke liye generated content ko bookmark aur tag karein</li>
            </>
          ) : (
            <>
              <li className="flex items-start gap-2"><span className="text-saffron-400 shrink-0 mt-0.5">•</span>Be specific: "Women Empowerment in Rural India" &gt; "Women"</li>
              <li className="flex items-start gap-2"><span className="text-saffron-400 shrink-0 mt-0.5">•</span>Select correct GS paper for focused content generation</li>
              <li className="flex items-start gap-2"><span className="text-saffron-400 shrink-0 mt-0.5">•</span>Add context like "include 2024 data" or "focus on Northeast India"</li>
              <li className="flex items-start gap-2"><span className="text-saffron-400 shrink-0 mt-0.5">•</span>Bookmark and tag generated content for easy revision</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
