import { pgTable, text, integer, decimal, boolean, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pickDTOFields } from "./dtoHelpers";
// AI Tools Core Tables
export const aiToolsArchetypes = pgTable('ai_tools_archetypes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  icon: text().notNull(),
  primaryMotivation: text().notNull(),
  preferredFeatures: jsonb().$type<string[]>(),
  uiPreferences: jsonb().$type<{
    colorScheme: string;
    layout: string;
    complexity: string;
  }>(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export const aiToolsCategories = pgTable('ai_tools_categories', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  icon: text(),
  parentId: integer(),
  sortOrder: integer().default(0),
  isActive: boolean().default(true),
  createdAt: timestamp().notNull().defaultNow()
});

export const aiTools = pgTable('ai_tools', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  shortDescription: text(),
  website: text().notNull(),
  logo: text(),
  categoryId: integer().notNull(),
  subcategories: jsonb().$type<string[]>(),
  
  // Pricing
  pricingModel: text().notNull(), // free, freemium, paid, lifetime
  priceFrom: decimal({ precision: 10, scale: 2 }),
  priceTo: decimal({ precision: 10, scale: 2 }),
  pricingDetails: jsonb().$type<{
    plans: Array<{
      name: string;
      price: number;
      features: string[];
      limitations?: string[];
    }>;
    trial?: {
      duration: number;
      type: string;
    };
  }>(),
  
  // Features & Capabilities
  features: jsonb().$type<string[]>(),
  useCase: jsonb().$type<string[]>(),
  platforms: jsonb().$type<string[]>(),
  integrations: jsonb().$type<string[]>(),
  apiAvailable: boolean().default(false),
  
  // Ratings & Reviews
  rating: decimal({ precision: 3, scale: 2 }).default('0'),
  totalReviews: integer().default(0),
  
  // Metadata
  launchDate: timestamp(),
  lastUpdated: timestamp(),
  isActive: boolean().default(true),
  isFeatured: boolean().default(false),
  trustScore: integer().default(50), // 0-100
  
  // SEO & Content
  metaTitle: text(),
  metaDescription: text(),
  tags: jsonb().$type<string[]>(),
  
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export const aiToolsReviews = pgTable('ai_tools_reviews', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  toolId: integer().notNull(),
  userId: text(),
  sessionId: text(),
  
  rating: integer().notNull(), // 1-5
  title: text(),
  content: text(),
  pros: jsonb().$type<string[]>(),
  cons: jsonb().$type<string[]>(),
  
  // User context
  userArchetype: text(),
  useCase: text(),
  experienceLevel: text(), // beginner, intermediate, expert
  
  verified: boolean().default(false),
  helpful: integer().default(0),
  unhelpful: integer().default(0),
  
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export const aiToolsComparisons = pgTable('ai_tools_comparisons', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  toolIds: jsonb().$type<number[]>().notNull(),
  
  // Comparison criteria
  criteria: jsonb().$type<Array<{
    name: string;
    weight: number;
    scores: Record<string, number>;
  }>>(),
  
  // Winner analysis
  overallWinner: integer(),
  categoryWinners: jsonb().$type<Record<string, number>>(),
  
  // SEO
  metaTitle: text(),
  metaDescription: text(),
  
  views: integer().default(0),
  isPublished: boolean().default(true),
  
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export const aiToolsOffers = pgTable('ai_tools_offers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  toolId: integer().notNull(),
  
  // Offer details
  title: text().notNull(),
  description: text(),
  offerType: text().notNull(), // discount, lifetime_deal, free_trial, bonus
  originalPrice: decimal({ precision: 10, scale: 2 }),
  offerPrice: decimal({ precision: 10, scale: 2 }),
  discountPercentage: integer(),
  
  // Affiliate tracking
  affiliateUrl: text().notNull(),
  affiliateNetwork: text(), // appsumo, pitchground, dealify, direct
  commission: decimal({ precision: 5, scale: 2 }),
  
  // Offer validity
  startDate: timestamp(),
  endDate: timestamp(),
  isActive: boolean().default(true),
  isLimitedTime: boolean().default(false),
  
  // Performance tracking
  clicks: integer().default(0),
  conversions: integer().default(0),
  revenue: decimal({ precision: 10, scale: 2 }).default('0'),
  
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export const aiToolsQuizzes = pgTable('ai_tools_quizzes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  description: text(),
  questions: jsonb().$type<Array<{
    id: string;
    question: string;
    type: 'multiple_choice' | 'slider' | 'checkbox' | 'text';
    options?: Array<{
      text: string;
      value: any;
      archetypes: string[];
      categories: string[];
    }>;
    weight: number;
  }>>().notNull(),
  
  // Scoring logic
  archetypeWeights: jsonb().$type<Record<string, number>>(),
  categoryWeights: jsonb().$type<Record<string, number>>(),
  
  isActive: boolean().default(true),
  totalTaken: integer().default(0),
  
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export const aiToolsQuizResults = pgTable('ai_tools_quiz_results', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  quizId: integer().notNull(),
  sessionId: text().notNull(),
  userId: text(),
  
  // User responses
  answers: jsonb().$type<Record<string, any>>().notNull(),
  
  // Results
  primaryArchetype: text().notNull(),
  secondaryArchetype: text(),
  recommendedCategories: jsonb().$type<string[]>(),
  recommendedTools: jsonb().$type<number[]>(),
  
  // Scores
  archetypeScores: jsonb().$type<Record<string, number>>(),
  categoryScores: jsonb().$type<Record<string, number>>(),
  
  completedAt: timestamp().notNull().defaultNow()
});

export const aiToolsContent = pgTable('ai_tools_content', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  type: text().notNull(), // article, guide, comparison, listicle, tutorial
  
  // Content
  excerpt: text(),
  content: text().notNull(),
  featuredImage: text(),
  
  // Relationships
  relatedTools: jsonb().$type<number[]>(),
  categories: jsonb().$type<string[]>(),
  tags: jsonb().$type<string[]>(),
  
  // SEO
  metaTitle: text(),
  metaDescription: text(),
  focusKeyword: text(),
  
  // Analytics
  views: integer().default(0),
  avgTimeOnPage: integer().default(0), // seconds
  bounceRate: decimal({ precision: 5, scale: 2 }).default('0'),
  
  // Status
  status: text().default('draft'), // draft, published, archived
  publishedAt: timestamp(),
  
  // Generation metadata
  isAiGenerated: boolean().default(false),
  generationPrompt: text(),
  lastOptimized: timestamp(),
  
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export const aiToolsLeads = pgTable('ai_tools_leads', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text().notNull(),
  sessionId: text().notNull(),
  
  // Lead source
  source: text().notNull(), // quiz, download, newsletter, comparison
  leadMagnet: text(), // ebook, template, toolkit, course
  
  // User profile
  archetype: text(),
  interests: jsonb().$type<string[]>(),
  experience: text(), // beginner, intermediate, expert
  
  // Engagement
  quizTaken: boolean().default(false),
  downloadsCount: integer().default(0),
  emailsOpened: integer().default(0),
  emailsClicked: integer().default(0),
  
  // Status
  isSubscribed: boolean().default(true),
  unsubscribedAt: timestamp(),
  
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export const aiToolsExperiments = pgTable('ai_tools_experiments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  type: text().notNull(), // layout, cta, headline, quiz, offers
  description: text(),
  
  // Experiment setup
  variants: jsonb().$type<Array<{
    name: string;
    config: Record<string, any>;
    traffic: number; // percentage
  }>>().notNull(),
  
  // Targeting
  targetArchetypes: jsonb().$type<string[]>(),
  targetPages: jsonb().$type<string[]>(),
  
  // Status
  status: text().default('draft'), // draft, running, completed, paused
  startDate: timestamp(),
  endDate: timestamp(),
  
  // Results tracking
  participantCount: integer().default(0),
  results: jsonb().$type<Record<string, {
    participants: number;
    conversions: number;
    conversionRate: number;
    revenue?: number;
  }>>(),
  
  winner: text(),
  confidence: decimal({ precision: 5, scale: 2 }),
  
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export const aiToolsAnalytics = pgTable('ai_tools_analytics', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: text().notNull(),
  event: text().notNull(),
  
  // Context
  toolId: integer(),
  categoryId: integer(),
  contentId: integer(),
  offerId: integer(),
  
  // User context
  userArchetype: text(),
  deviceType: text(),
  source: text(),
  
  // Event data
  data: jsonb(),
  value: decimal({ precision: 10, scale: 2 }),
  
  timestamp: timestamp().notNull().defaultNow()
});

// Insert Schemas
export const insertAiToolsArchetypeSchema = createInsertSchema(aiToolsArchetypes, {
  uiPreferences: z.object({
    colorScheme: z.string(),
    layout: z.string(),
    complexity: z.string(),
  }).optional(),
  primaryMotivation: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAiToolSchema = createInsertSchema(aiTools, {
  subcategories: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  useCase: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  integrations: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAiToolsOfferSchema = createInsertSchema(aiToolsOffers).omit({
  id: true,
  clicks: true,
  conversions: true,
  revenue: true,
  createdAt: true,
  updatedAt: true
});

export const insertAiToolsQuizSchema = createInsertSchema(aiToolsQuizzes, {
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    type: z.enum(['multiple_choice', 'slider', 'checkbox', 'text']),
    options: z.array(z.object({
      text: z.string(),
      value: z.any(),
      archetypes: z.array(z.string()),
      categories: z.array(z.string()),
    })).optional(),
    weight: z.number(),
  })),
}).omit({
  id: true,
  totalTaken: true,
  createdAt: true,
  updatedAt: true
});

export const insertAiToolsContentSchema = createInsertSchema(aiToolsContent, {
  relatedTools: z.array(z.number()).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
}).omit({
  id: true,
  views: true,
  avgTimeOnPage: true,
  bounceRate: true,
  createdAt: true,
  updatedAt: true
});

export const insertAiToolsLeadSchema = createInsertSchema(aiToolsLeads, {
  interests: z.array(z.string()).optional(),
}).omit({
  id: true,
  downloadsCount: true,
  emailsOpened: true,
  emailsClicked: true,
  createdAt: true,
  updatedAt: true
});

// Type exports
export type AiToolsArchetype = InferSelectModel<typeof aiToolsArchetypes>;
export type InsertAiToolsArchetype = InferInsertModel<typeof aiToolsArchetypes>;

export type AiTool = InferSelectModel<typeof aiTools>;
export type InsertAiTool = InferInsertModel<typeof aiTools>;

export type AiToolsOffer = InferSelectModel<typeof aiToolsOffers>;
export type InsertAiToolsOffer = InferInsertModel<typeof aiToolsOffers>;

export type AiToolsQuiz = InferSelectModel<typeof aiToolsQuizzes>;
export type InsertAiToolsQuiz = InferInsertModel<typeof aiToolsQuizzes>;

export type AiToolsContent = InferSelectModel<typeof aiToolsContent>;
export type InsertAiToolsContent = InferInsertModel<typeof aiToolsContent>;

export type AiToolsLead = InferSelectModel<typeof aiToolsLeads>;
export type InsertAiToolsLead = InferInsertModel<typeof aiToolsLeads>;

export type AiToolsCategory = InferSelectModel<typeof aiToolsCategories>;
export type InsertAiToolsCategory = InferInsertModel<typeof aiToolsCategories>;
export type AiToolsReview = InferSelectModel<typeof aiToolsReviews>;
export type InsertAiToolsReview = InferInsertModel<typeof aiToolsReviews>;
export type AiToolsComparison = InferSelectModel<typeof aiToolsComparisons>;
export type InsertAiToolsComparison = InferInsertModel<typeof aiToolsComparisons>;
export type AiToolsQuizResult = InferSelectModel<typeof aiToolsQuizResults>;
export type InsertAiToolsQuizResult = InferInsertModel<typeof aiToolsQuizResults>;
export type AiToolsExperiment = InferSelectModel<typeof aiToolsExperiments>;
export type InsertAiToolsExperiment = InferInsertModel<typeof aiToolsExperiments>;
export type AiToolsAnalytic = InferSelectModel<typeof aiToolsAnalytics>;
export type InsertAiToolsAnalytic = InferInsertModel<typeof aiToolsAnalytics>;

// DTOs
const aiToolsArchetypeDTOKeys = ["id", "name", "slug", "createdAt", "updatedAt", "description"] as const;

export interface AiToolsArchetypeDTO
  extends Pick<AiToolsArchetype, (typeof aiToolsArchetypeDTOKeys)[number]> {}

export const toAiToolsArchetypeDTO = (aiToolsArchetype: AiToolsArchetype): AiToolsArchetypeDTO =>
  pickDTOFields(aiToolsArchetype, aiToolsArchetypeDTOKeys);


const aiToolDTOKeys = ["id", "name", "slug", "type", "createdAt", "updatedAt", "description"] as const;

export interface AiToolDTO
  extends Pick<AiTool, (typeof aiToolDTOKeys)[number]> {}

export const toAiToolDTO = (aiTool: AiTool): AiToolDTO =>
  pickDTOFields(aiTool, aiToolDTOKeys);


const aiToolsOfferDTOKeys = ["id", "title", "createdAt", "updatedAt", "description", "toolId", "offerType"] as const;

export interface AiToolsOfferDTO
  extends Pick<AiToolsOffer, (typeof aiToolsOfferDTOKeys)[number]> {}

export const toAiToolsOfferDTO = (aiToolsOffer: AiToolsOffer): AiToolsOfferDTO =>
  pickDTOFields(aiToolsOffer, aiToolsOfferDTOKeys);


const aiToolsQuizDTOKeys = ["id", "title", "type", "createdAt", "updatedAt", "description"] as const;

export interface AiToolsQuizDTO
  extends Pick<AiToolsQuiz, (typeof aiToolsQuizDTOKeys)[number]> {}

export const toAiToolsQuizDTO = (aiToolsQuiz: AiToolsQuiz): AiToolsQuizDTO =>
  pickDTOFields(aiToolsQuiz, aiToolsQuizDTOKeys);


const aiToolsContentDTOKeys = ["id", "title", "slug", "status", "type", "createdAt", "updatedAt"] as const;

export interface AiToolsContentDTO
  extends Pick<AiToolsContent, (typeof aiToolsContentDTOKeys)[number]> {}

export const toAiToolsContentDTO = (aiToolsContent: AiToolsContent): AiToolsContentDTO =>
  pickDTOFields(aiToolsContent, aiToolsContentDTOKeys);


const aiToolsLeadDTOKeys = ["id", "sessionId", "createdAt", "updatedAt", "email", "source"] as const;

export interface AiToolsLeadDTO
  extends Pick<AiToolsLead, (typeof aiToolsLeadDTOKeys)[number]> {}

export const toAiToolsLeadDTO = (aiToolsLead: AiToolsLead): AiToolsLeadDTO =>
  pickDTOFields(aiToolsLead, aiToolsLeadDTOKeys);


const aiToolsCategoryDTOKeys = ["id", "name", "slug", "createdAt", "description"] as const;

export interface AiToolsCategoryDTO
  extends Pick<AiToolsCategory, (typeof aiToolsCategoryDTOKeys)[number]> {}

export const toAiToolsCategoryDTO = (aiToolsCategory: AiToolsCategory): AiToolsCategoryDTO =>
  pickDTOFields(aiToolsCategory, aiToolsCategoryDTOKeys);


const aiToolsReviewDTOKeys = ["id", "title", "sessionId", "userId", "createdAt", "updatedAt", "toolId"] as const;

export interface AiToolsReviewDTO
  extends Pick<AiToolsReview, (typeof aiToolsReviewDTOKeys)[number]> {}

export const toAiToolsReviewDTO = (aiToolsReview: AiToolsReview): AiToolsReviewDTO =>
  pickDTOFields(aiToolsReview, aiToolsReviewDTOKeys);


const aiToolsComparisonDTOKeys = ["id", "name", "title", "slug", "createdAt", "updatedAt", "description"] as const;

export interface AiToolsComparisonDTO
  extends Pick<AiToolsComparison, (typeof aiToolsComparisonDTOKeys)[number]> {}

export const toAiToolsComparisonDTO = (aiToolsComparison: AiToolsComparison): AiToolsComparisonDTO =>
  pickDTOFields(aiToolsComparison, aiToolsComparisonDTOKeys);


const aiToolsQuizResultDTOKeys = ["id", "sessionId", "userId"] as const;

export interface AiToolsQuizResultDTO
  extends Pick<AiToolsQuizResult, (typeof aiToolsQuizResultDTOKeys)[number]> {}

export const toAiToolsQuizResultDTO = (aiToolsQuizResult: AiToolsQuizResult): AiToolsQuizResultDTO =>
  pickDTOFields(aiToolsQuizResult, aiToolsQuizResultDTOKeys);


const aiToolsExperimentDTOKeys = ["id", "name", "status", "type", "createdAt", "updatedAt", "description"] as const;

export interface AiToolsExperimentDTO
  extends Pick<AiToolsExperiment, (typeof aiToolsExperimentDTOKeys)[number]> {}

export const toAiToolsExperimentDTO = (aiToolsExperiment: AiToolsExperiment): AiToolsExperimentDTO =>
  pickDTOFields(aiToolsExperiment, aiToolsExperimentDTOKeys);


const aiToolsAnalyticDTOKeys = ["id", "sessionId", "offerId", "toolId", "source"] as const;

export interface AiToolsAnalyticDTO
  extends Pick<AiToolsAnalytic, (typeof aiToolsAnalyticDTOKeys)[number]> {}

export const toAiToolsAnalyticDTO = (aiToolsAnalytic: AiToolsAnalytic): AiToolsAnalyticDTO =>
  pickDTOFields(aiToolsAnalytic, aiToolsAnalyticDTOKeys);

