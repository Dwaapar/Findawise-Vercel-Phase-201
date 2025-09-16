import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pickDTOFields } from "./dtoHelpers";
// Content & Offer Feed Engine - Database Tables
import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Content Feed Sources - External API/feed configurations
export const contentFeedSources = pgTable("content_feed_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sourceType: varchar("source_type", { length: 100 }).notNull(), // amazon_pa, cj_affiliate, rss, api, scraper
  apiEndpoint: text("api_endpoint"),
  authConfig: jsonb("auth_config"), // API keys, tokens, headers
  refreshInterval: integer("refresh_interval").default(3600), // seconds
  isActive: boolean("is_active").default(true),
  lastSyncAt: timestamp("last_sync_at"),
  nextSyncAt: timestamp("next_sync_at"),
  settings: jsonb("settings"), // Rate limits, filters, mappings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Master Content Feed - All ingested content/offers
export const contentFeed = pgTable("content_feed", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").references(() => contentFeedSources.id),
  externalId: varchar("external_id", { length: 255 }), // Original ID from source
  contentType: varchar("content_type", { length: 100 }).notNull(), // offer, article, product, deal, review
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  content: text("content"),
  excerpt: text("excerpt"),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags"),
  
  // Offer/Product specific fields
  price: decimal("price", { precision: 10, scale: 2 }),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }),
  discount: decimal("discount", { precision: 5, scale: 2 }),
  couponCode: varchar("coupon_code", { length: 100 }),
  affiliateUrl: text("affiliate_url"),
  merchantName: varchar("merchant_name", { length: 255 }),
  
  // Content metadata
  author: varchar("author", { length: 255 }),
  publishedAt: timestamp("published_at"),
  imageUrl: text("image_url"),
  images: jsonb("images"), // Array of image URLs
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count"),
  
  // Performance tracking
  views: integer("views").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  cttr: decimal("ctr", { precision: 5, scale: 4 }).default("0"), // Click-through rate
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 4 }).default("0"),
  
  // Quality & Status
  qualityScore: decimal("quality_score", { precision: 3, scale: 2 }),
  status: varchar("status", { length: 50 }).default("active"), // active, expired, out_of_stock, banned
  isManuallyOverridden: boolean("is_manually_overridden").default(false),
  manualPriority: integer("manual_priority"),
  
  // AI Enhancement
  aiEnriched: boolean("ai_enriched").default(false),
  aiGeneratedContent: jsonb("ai_generated_content"), // SEO meta, descriptions, FAQs
  aiQualityFlags: jsonb("ai_quality_flags"),
  
  // Compliance & Moderation
  complianceStatus: varchar("compliance_status", { length: 50 }).default("pending"), // approved, rejected, pending
  moderationFlags: jsonb("moderation_flags"),
  
  // Timestamps
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  syncedAt: timestamp("synced_at").defaultNow(),
});

// Content Feed Categories - Organized classification
export const contentFeedCategories = pgTable("content_feed_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  parentId: integer("parent_id"),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  verticalNeuron: varchar("vertical_neuron", { length: 100 }), // finance, health, saas, travel, etc.
  contentCount: integer("content_count").default(0),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Feed Sync Logs - Track all sync operations
export const contentFeedSyncLogs = pgTable("content_feed_sync_logs", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").references(() => contentFeedSources.id),
  syncType: varchar("sync_type", { length: 100 }).notNull(), // full, incremental, manual
  status: varchar("status", { length: 50 }).notNull(), // success, failed, partial
  itemsProcessed: integer("items_processed").default(0),
  itemsAdded: integer("items_added").default(0),
  itemsUpdated: integer("items_updated").default(0),
  itemsRemoved: integer("items_removed").default(0),
  errors: jsonb("errors"),
  metadata: jsonb("metadata"),
  duration: integer("duration"), // milliseconds
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Content Feed Rules - Auto-filtering and ranking rules
export const contentFeedRules = pgTable("content_feed_rules", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sourceId: integer("source_id").references(() => contentFeedSources.id),
  ruleType: varchar("rule_type", { length: 100 }).notNull(), // filter, ranking, enhancement, moderation
  conditions: jsonb("conditions").notNull(), // Rule logic
  actions: jsonb("actions").notNull(), // What to do when conditions met
  priority: integer("priority").default(0),
  isActive: boolean("is_active").default(true),
  appliedCount: integer("applied_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content Feed Analytics - Performance tracking
export const contentFeedAnalytics = pgTable("content_feed_analytics", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contentFeed.id),
  date: timestamp("date").notNull(),
  metric: varchar("metric", { length: 100 }).notNull(), // views, clicks, conversions, ctr, revenue
  value: decimal("value", { precision: 15, scale: 4 }).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Feed User Interactions - Track user engagement
export const contentFeedInteractions = pgTable("content_feed_interactions", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contentFeed.id),
  sessionId: varchar("session_id", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  interactionType: varchar("interaction_type", { length: 100 }).notNull(), // view, click, share, save, convert
  metadata: jsonb("metadata"), // Device, location, referrer, etc.
  revenue: decimal("revenue", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Feed Notifications - Alert system for changes
export const contentFeedNotifications = pgTable("content_feed_notifications", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contentFeed.id),
  sourceId: integer("source_id").references(() => contentFeedSources.id),
  notificationType: varchar("notification_type", { length: 100 }).notNull(), // price_drop, new_content, expired, error
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  severity: varchar("severity", { length: 50 }).default("info"), // info, warning, error, critical
  isRead: boolean("is_read").default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
// Media Contacts - PR/Media outreach management
export const mediaContacts = pgTable("media_contacts", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  publication: varchar("publication", { length: 255 }),
  beat: jsonb("beat"),
  tier: varchar("tier", { length: 100 }),
  location: varchar("location", { length: 255 }),
  verified: boolean("verified").default(false),
  lastContacted: timestamp("last_contacted"),
  responseHistory: jsonb("response_history"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Outreach Templates - Email/PR template management
export const outreachTemplates = pgTable("outreach_templates", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  subject: varchar("subject", { length: 500 }),
  template: text("template"),
  type: varchar("type", { length: 100 }),
  variables: jsonb("variables"),
  performance: jsonb("performance"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMediaContactsSchema = createInsertSchema(mediaContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOutreachTemplatesSchema = createInsertSchema(outreachTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentFeedSourceSchema = createInsertSchema(contentFeedSources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentFeedSchema = createInsertSchema(contentFeed).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  syncedAt: true,
});

export const insertContentFeedCategorySchema = createInsertSchema(contentFeedCategories).omit({
  id: true,
  createdAt: true,
});

export const insertContentFeedSyncLogSchema = createInsertSchema(contentFeedSyncLogs).omit({
  id: true,
  startedAt: true,
});

export const insertContentFeedRuleSchema = createInsertSchema(contentFeedRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentFeedAnalyticsSchema = createInsertSchema(contentFeedAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertContentFeedInteractionSchema = createInsertSchema(contentFeedInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertContentFeedNotificationSchema = createInsertSchema(contentFeedNotifications).omit({
  id: true,
  createdAt: true,
});

// Types
export type ContentFeedSource = InferSelectModel<typeof contentFeedSources>;
export type InsertContentFeedSource = InferInsertModel<typeof contentFeedSources>;

export type ContentFeed = InferSelectModel<typeof contentFeed>;
export type InsertContentFeed = InferInsertModel<typeof contentFeed>;

export type ContentFeedCategory = InferSelectModel<typeof contentFeedCategories>;
export type InsertContentFeedCategory = InferInsertModel<typeof contentFeedCategories>;

export type ContentFeedSyncLog = InferSelectModel<typeof contentFeedSyncLogs>;
export type InsertContentFeedSyncLog = InferInsertModel<typeof contentFeedSyncLogs>;

export type ContentFeedRule = InferSelectModel<typeof contentFeedRules>;
export type InsertContentFeedRule = InferInsertModel<typeof contentFeedRules>;

export type ContentFeedAnalytics = InferSelectModel<typeof contentFeedAnalytics>;
export type InsertContentFeedAnalytics = InferInsertModel<typeof contentFeedAnalytics>;

export type ContentFeedInteraction = InferSelectModel<typeof contentFeedInteractions>;
export type InsertContentFeedInteraction = InferInsertModel<typeof contentFeedInteractions>;

export type ContentFeedNotification = InferSelectModel<typeof contentFeedNotifications>;
export type InsertContentFeedNotification = InferInsertModel<typeof contentFeedNotifications>;

export type MediaContacts = InferSelectModel<typeof mediaContacts>;
export type InsertMediaContacts = InferInsertModel<typeof mediaContacts>;

export type OutreachTemplates = InferSelectModel<typeof outreachTemplates>;
export type InsertOutreachTemplates = InferInsertModel<typeof outreachTemplates>;

// DTOs
const contentFeedSourceDTOKeys = ["id", "name", "createdAt", "updatedAt"] as const;

export interface ContentFeedSourceDTO
  extends Pick<ContentFeedSource, (typeof contentFeedSourceDTOKeys)[number]> {}

export const toContentFeedSourceDTO = (contentFeedSource: ContentFeedSource): ContentFeedSourceDTO =>
  pickDTOFields(contentFeedSource, contentFeedSourceDTOKeys);


const contentFeedDTOKeys = ["id", "title", "status", "category", "createdAt", "updatedAt", "description"] as const;

export interface ContentFeedDTO
  extends Pick<ContentFeed, (typeof contentFeedDTOKeys)[number]> {}

export const toContentFeedDTO = (contentFeed: ContentFeed): ContentFeedDTO =>
  pickDTOFields(contentFeed, contentFeedDTOKeys);


const contentFeedCategoryDTOKeys = ["id", "name", "slug", "createdAt", "description"] as const;

export interface ContentFeedCategoryDTO
  extends Pick<ContentFeedCategory, (typeof contentFeedCategoryDTOKeys)[number]> {}

export const toContentFeedCategoryDTO = (contentFeedCategory: ContentFeedCategory): ContentFeedCategoryDTO =>
  pickDTOFields(contentFeedCategory, contentFeedCategoryDTOKeys);


const contentFeedSyncLogDTOKeys = ["id", "status", "sourceId"] as const;

export interface ContentFeedSyncLogDTO
  extends Pick<ContentFeedSyncLog, (typeof contentFeedSyncLogDTOKeys)[number]> {}

export const toContentFeedSyncLogDTO = (contentFeedSyncLog: ContentFeedSyncLog): ContentFeedSyncLogDTO =>
  pickDTOFields(contentFeedSyncLog, contentFeedSyncLogDTOKeys);


const contentFeedRuleDTOKeys = ["id", "name", "priority", "createdAt", "updatedAt"] as const;

export interface ContentFeedRuleDTO
  extends Pick<ContentFeedRule, (typeof contentFeedRuleDTOKeys)[number]> {}

export const toContentFeedRuleDTO = (contentFeedRule: ContentFeedRule): ContentFeedRuleDTO =>
  pickDTOFields(contentFeedRule, contentFeedRuleDTOKeys);


const contentFeedAnalyticsDTOKeys = ["id", "createdAt", "metric"] as const;

export interface ContentFeedAnalyticsDTO
  extends Pick<ContentFeedAnalytics, (typeof contentFeedAnalyticsDTOKeys)[number]> {}

export const toContentFeedAnalyticsDTO = (contentFeedAnalytics: ContentFeedAnalytics): ContentFeedAnalyticsDTO =>
  pickDTOFields(contentFeedAnalytics, contentFeedAnalyticsDTOKeys);


const contentFeedInteractionDTOKeys = ["id", "sessionId", "userId", "createdAt"] as const;

export interface ContentFeedInteractionDTO
  extends Pick<ContentFeedInteraction, (typeof contentFeedInteractionDTOKeys)[number]> {}

export const toContentFeedInteractionDTO = (contentFeedInteraction: ContentFeedInteraction): ContentFeedInteractionDTO =>
  pickDTOFields(contentFeedInteraction, contentFeedInteractionDTOKeys);


const contentFeedNotificationDTOKeys = ["id", "title", "severity", "createdAt"] as const;

export interface ContentFeedNotificationDTO
  extends Pick<ContentFeedNotification, (typeof contentFeedNotificationDTOKeys)[number]> {}

export const toContentFeedNotificationDTO = (contentFeedNotification: ContentFeedNotification): ContentFeedNotificationDTO =>
  pickDTOFields(contentFeedNotification, contentFeedNotificationDTOKeys);


const mediaContactsDTOKeys = ["id", "name", "createdAt", "updatedAt", "email"] as const;

export interface MediaContactsDTO
  extends Pick<MediaContacts, (typeof mediaContactsDTOKeys)[number]> {}

export const toMediaContactsDTO = (mediaContacts: MediaContacts): MediaContactsDTO =>
  pickDTOFields(mediaContacts, mediaContactsDTOKeys);


const outreachTemplatesDTOKeys = ["id", "name", "type", "createdAt", "updatedAt"] as const;

export interface OutreachTemplatesDTO
  extends Pick<OutreachTemplates, (typeof outreachTemplatesDTOKeys)[number]> {}

export const toOutreachTemplatesDTO = (outreachTemplates: OutreachTemplates): OutreachTemplatesDTO =>
  pickDTOFields(outreachTemplates, outreachTemplatesDTOKeys);

