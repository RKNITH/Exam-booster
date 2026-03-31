import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema({
  title: String,
  location: String,
  year: String,
  description: String,
  relevance: String,
  impact: String,
  type: { type: String, enum: ['india', 'global'] },
});

const quoteSchema = new mongoose.Schema({
  text: String,
  author: String,
  context: String,
  source: String,
});

const generatedContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  topic: { type: String, required: true, index: true },
  gsPaper: {
    type: String,
    enum: ['GS1', 'GS2', 'GS3', 'GS4', 'Essay', 'all'],
    default: 'all',
    index: true,
  },
  language: {
    type: String,
    enum: ['english', 'hindi'],
    default: 'english',
    index: true,
  },
  theme: { type: String, index: true },
  keywords: [{ type: String, index: true }],
  introduction: String,
  body: {
    mainPoints: [String],
    analysis: String,
    dimensions: [String],
  },
  conclusion: String,
  indiaCaseStudies: [caseStudySchema],
  globalCaseStudies: [caseStudySchema],
  ethicalExamples: [String],
  quotes: [quoteSchema],
  committees: [String],
  governmentSchemes: [String],
  articles: [String],
  isBookmarked: { type: Boolean, default: false },
  tags: [String],
  rating: { type: Number, min: 1, max: 5 },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, index: true },
});

generatedContentSchema.index({ userId: 1, createdAt: -1 });
generatedContentSchema.index({ topic: 'text', keywords: 'text' });

export default mongoose.models.GeneratedContent ||
  mongoose.model('GeneratedContent', generatedContentSchema);
