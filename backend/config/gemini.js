import axios from 'axios';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const paperContext = {
  GS1: 'Indian Heritage, Culture, History, Geography, Society',
  GS2: 'Governance, Constitution, Polity, Social Justice, International Relations',
  GS3: 'Economy, Environment, Technology, Security, Disaster Management',
  GS4: 'Ethics, Integrity, Aptitude, Emotional Intelligence',
  Essay: 'Essay paper requiring multidimensional analysis',
  all: 'All GS Papers and Essay',
};

// Paper context labels in both languages
const paperContextHindi = {
  GS1: 'भारतीय विरासत, संस्कृति, इतिहास, भूगोल, समाज',
  GS2: 'शासन, संविधान, राजव्यवस्था, सामाजिक न्याय, अंतरराष्ट्रीय संबंध',
  GS3: 'अर्थव्यवस्था, पर्यावरण, प्रौद्योगिकी, सुरक्षा, आपदा प्रबंधन',
  GS4: 'नैतिकता, सत्यनिष्ठा, अभिवृत्ति, भावनात्मक बुद्धिमत्ता',
  Essay: 'बहुआयामी विश्लेषण की आवश्यकता वाला निबंध प्रश्नपत्र',
  all: 'सभी GS प्रश्नपत्र और निबंध',
};

function buildPrompt(topic, gsPaper, additionalContext, language) {
  const isHindi = language === 'hindi';
  const paperDesc = isHindi
    ? (paperContextHindi[gsPaper] || paperContextHindi.all)
    : (paperContext[gsPaper] || paperContext.all);

  if (isHindi) {
    // ── HINDI PROMPT ──────────────────────────────────────────────────────────
    // CRITICAL: placeholder values inside the JSON template are in Hindi so
    // Gemini uses Hindi examples and does not revert to English.
    return `आप एक विशेषज्ञ UPSC Mains उत्तर लेखन कोच और कंटेंट क्यूरेटर हैं।

विषय: "${topic}"
प्रश्नपत्र संदर्भ: ${paperDesc}
${additionalContext ? `अतिरिक्त संदर्भ: ${additionalContext}` : ''}

भाषा नियम (अनिवार्य — किसी भी स्थिति में अनदेखा न करें):
- सभी JSON string values हिंदी देवनागरी लिपि में लिखें।
- JSON keys अंग्रेजी में रहेंगी (topic, gsPaper, keywords आदि)।
- किसी भी string value में अंग्रेजी का उपयोग न करें।
- परिचय, मुख्य बिंदु, निष्कर्ष, केस स्टडी, उद्धरण — सब हिंदी में।

महत्वपूर्ण नियम:
- केवल raw valid JSON लौटाएं — कोई markdown, backtick या स्पष्टीकरण नहीं
- string values के अंदर कोई newline या tab character नहीं (space का उपयोग करें)
- सभी string values ठीक से escaped हों
- वास्तविक समिति नाम, रिपोर्ट, योजनाएं, अनुच्छेद शामिल करें
- भारतीय शासन संदर्भ पर ध्यान दें
- सभी तथ्य सटीक और सत्यापन योग्य हों

नीचे दी गई JSON संरचना को हिंदी मानों के साथ लौटाएं:
{
  "topic": "${topic}",
  "gsPaper": "${gsPaper}",
  "language": "hindi",
  "theme": "शासन",
  "keywords": ["मुख्यशब्द1", "मुख्यशब्द2", "मुख्यशब्द3", "मुख्यशब्द4", "मुख्यशब्द5"],
  "introduction": "2-3 वाक्यों में परिचय लिखें",
  "body": {
    "mainPoints": ["मुख्य बिंदु 1", "मुख्य बिंदु 2", "मुख्य बिंदु 3", "मुख्य बिंदु 4", "मुख्य बिंदु 5"],
    "analysis": "आलोचनात्मक विश्लेषण अनुच्छेद",
    "dimensions": ["आर्थिक", "सामाजिक", "राजनीतिक", "पर्यावरणीय", "नैतिक"]
  },
  "conclusion": "2-3 वाक्यों में निष्कर्ष",
  "indiaCaseStudies": [
    {"title": "शीर्षक", "location": "राज्य", "year": "2023", "description": "विवरण", "relevance": "प्रासंगिकता", "impact": "प्रभाव", "type": "india"},
    {"title": "शीर्षक 2", "location": "राज्य", "year": "2022", "description": "विवरण", "relevance": "प्रासंगिकता", "impact": "प्रभाव", "type": "india"}
  ],
  "globalCaseStudies": [
    {"title": "शीर्षक", "location": "देश", "year": "2023", "description": "विवरण", "relevance": "भारत के लिए सबक", "impact": "प्रभाव", "type": "global"}
  ],
  "ethicalExamples": ["नैतिक उदाहरण 1", "नैतिक उदाहरण 2", "नैतिक उदाहरण 3"],
  "quotes": [
    {"text": "उद्धरण पाठ", "author": "लेखक", "context": "संदर्भ", "source": "स्रोत"},
    {"text": "उद्धरण पाठ 2", "author": "लेखक 2", "context": "संदर्भ", "source": "स्रोत"}
  ],
  "committees": ["समिति नाम (वर्ष) - मुख्य सिफारिश", "रिपोर्ट नाम (वर्ष) - मुख्य निष्कर्ष"],
  "governmentSchemes": ["योजना नाम - वर्ष - प्रासंगिकता", "अनुच्छेद/प्रावधान - संबंध"],
  "articles": ["अनुच्छेद/प्रावधान", "विधान"]
}`;
  }

  // ── ENGLISH PROMPT ────────────────────────────────────────────────────────
  return `You are an expert UPSC Mains answer writing coach and content curator.

Generate a comprehensive UPSC Mains preparation guide on the topic: "${topic}"
Paper context: ${paperDesc}
${additionalContext ? `Additional context: ${additionalContext}` : ''}

LANGUAGE REQUIREMENT: Write all content in English.

CRITICAL RULES:
- Return ONLY raw valid JSON — no markdown, no backticks, no explanation before or after
- No trailing commas
- No newlines or tab characters inside string values (use spaces instead)
- All string values must be properly escaped
- Include real committee names, reports, schemes, articles
- Focus on Indian governance context with global comparisons
- All facts must be accurate and verifiable

Return EXACTLY this JSON structure and nothing else:
{
  "topic": "${topic}",
  "gsPaper": "${gsPaper}",
  "language": "english",
  "theme": "Governance",
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "introduction": "2-3 sentence introduction",
  "body": {
    "mainPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
    "analysis": "Critical analysis paragraph",
    "dimensions": ["Economic", "Social", "Political", "Environmental", "Ethical"]
  },
  "conclusion": "2-3 sentence conclusion",
  "indiaCaseStudies": [
    {"title": "Title", "location": "State", "year": "2023", "description": "Description", "relevance": "Relevance", "impact": "Impact", "type": "india"},
    {"title": "Title 2", "location": "State", "year": "2022", "description": "Description", "relevance": "Relevance", "impact": "Impact", "type": "india"}
  ],
  "globalCaseStudies": [
    {"title": "Title", "location": "Country", "year": "2023", "description": "Description", "relevance": "Lessons for India", "impact": "Impact", "type": "global"}
  ],
  "ethicalExamples": ["Ethical example 1", "Ethical example 2", "Ethical example 3"],
  "quotes": [
    {"text": "Quote text", "author": "Author", "context": "Context", "source": "Source"},
    {"text": "Quote text 2", "author": "Author 2", "context": "Context", "source": "Source"}
  ],
  "committees": ["Committee Name (Year) - Key recommendation", "Report Name (Year) - Key finding"],
  "governmentSchemes": ["Scheme Name - Year - Relevance", "Article/Provision - Connection"],
  "articles": ["Article/provision", "Legislation"]
}`;
}

function buildTrendingPrompt(language) {
  const isHindi = language === 'hindi';
  const languageInstruction = isHindi
    ? `LANGUAGE REQUIREMENT (MANDATORY): Write ALL topic names and reason values in Hindi using Devanagari script. JSON keys stay in English. Do NOT use English for any value.`
    : `Write all content in English.`;

  return `Generate 12 trending UPSC Mains 2024-2025 topics.

${languageInstruction}

CRITICAL: Return ONLY a valid JSON array — no markdown, no backticks, no explanation.
Return exactly 12 items in this format:
[
  {"topic": "Topic Name", "gsPaper": "GS1", "trend": "hot", "reason": "Why trending"},
  {"topic": "Topic 2", "gsPaper": "GS2", "trend": "rising", "reason": "Reason"}
]`;
}

async function callGemini(prompt) {
  const model = process.env.MODEL_NAME || 'gemini-2.0-flash';
  const url = `${GEMINI_BASE}/${model}:generateContent`;

  const payload = {
    system_instruction: {
      parts: [{ text: 'You are a strict JSON-only AI. You NEVER output markdown, prose, or explanations. You output ONLY a valid JSON object or array as instructed in the user prompt. You MUST follow the LANGUAGE REQUIREMENT in the user prompt exactly — if it says Hindi, every string value MUST be in Hindi Devanagari. Never default to English.' }]
    },
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: parseInt(process.env.MAX_OUTPUT_TOKENS || '16384', 10),
      topP: 0.9,
      topK: 40,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  const response = await axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY,
    },
    timeout: 60000,
  });

  // Check for prompt feedback / blocks
  const promptFeedback = response?.data?.promptFeedback;
  if (promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked the request: ${promptFeedback.blockReason}`);
  }

  const candidate = response?.data?.candidates?.[0];

  // Check finish reason for issues
  if (candidate?.finishReason && candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
    throw new Error(`Gemini finish reason: ${candidate.finishReason}`);
  }

  const text = candidate?.content?.parts?.[0]?.text?.trim() || '';
  if (!text) throw new Error('Empty response from Gemini');

  // Warn if response looks truncated
  const trimmed = text.trimEnd();
  if (!trimmed.endsWith('}') && !trimmed.endsWith(']')) {
    console.warn('WARNING: Gemini response may be truncated. Last chars:', trimmed.slice(-80));
  }

  return text;
}


// Collapses runs of \r\n\t between JSON tokens without touching string value contents.
// This preserves Devanagari (and other Unicode) text inside quoted values.
function collapseWhitespaceOutsideStrings(text) {
  let result = '';
  let inString = false;
  let escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) {
      result += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      result += ch;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }
    if (!inString && (ch === '\r' || ch === '\n' || ch === '\t')) {
      // Replace with a single space only if the last result char isn't already a space
      if (result.length > 0 && result[result.length - 1] !== ' ') result += ' ';
      continue;
    }
    result += ch;
  }
  return result;
}

function robustParseJSON(raw) {
  // 1. Strip markdown fences
  let text = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  // 2. Collapse literal newlines/tabs that appear OUTSIDE of string values.
  //    We must NOT strip them blindly — Devanagari/Hindi content is multi-byte Unicode
  //    and a global \r\n\t strip can corrupt sequences that span "lines" in the raw
  //    Gemini output when the model emits pretty-printed JSON.
  //    Strategy: collapse runs of whitespace between tokens but preserve content inside strings.
  text = collapseWhitespaceOutsideStrings(text);

  // 3. Try direct parse
  try {
    return JSON.parse(text);
  } catch (_) { }

  // 4. Extract first complete JSON object/array using brace counting
  const objStart = text.indexOf('{');
  const arrStart = text.indexOf('[');

  if (objStart !== -1 && (arrStart === -1 || objStart < arrStart)) {
    const extracted = extractBalanced(text, objStart, '{', '}');
    if (extracted) {
      try { return JSON.parse(extracted); } catch (_) { }
      const fixed = fixCommonJSONIssues(extracted);
      try { return JSON.parse(fixed); } catch (_) { }
    }
  }

  if (arrStart !== -1) {
    const extracted = extractBalanced(text, arrStart, '[', ']');
    if (extracted) {
      try { return JSON.parse(extracted); } catch (_) { }
      const fixed = fixCommonJSONIssues(extracted);
      try { return JSON.parse(fixed); } catch (_) { }
    }
  }

  console.error('RAW GEMINI RESPONSE (parse failed):\n', raw.slice(0, 800));
  throw new Error('Failed to parse AI response as JSON');
}

function extractBalanced(text, start, open, close) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === open) depth++;
    else if (text[i] === close) {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function fixCommonJSONIssues(text) {
  return text
    // Remove trailing commas before } or ]
    .replace(/,\s*([\]}])/g, '$1')
    // Replace unescaped control characters
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    // Fix single quotes used instead of double quotes
    .replace(/([{,]\s*)'([^']+)'(\s*:)/g, '$1"$2"$3')
    .replace(/:\s*'([^']*)'/g, ': "$1"');
}

export async function generateUPSCContent(topic, gsPaper = 'all', additionalContext = '', language = 'english') {
  const prompt = buildPrompt(topic, gsPaper, additionalContext, language);
  const text = await callGemini(prompt);
  const parsed = robustParseJSON(text);
  parsed.language = language;
  return parsed;
}

export async function getTrendingTopics(language = 'english') {
  const prompt = buildTrendingPrompt(language);
  const text = await callGemini(prompt);
  return robustParseJSON(text);
}