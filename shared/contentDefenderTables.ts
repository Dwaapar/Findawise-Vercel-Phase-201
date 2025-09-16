import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, real, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pickDTOFields } from "./dtoHelpers";
// ================================================
// AI CONTENT DEFENDER & PLAGIARISM WATCHDOG MODULE
// Billion-Dollar Empire Grade, Migration-Proof, DMCA-Ready
// ================================================

// Content Inventory - Track all empire content
export const contentInventory = pgTable("content_inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // page, blog, tool, ugc, landing
  contentUrl: text("content_url").notNull().unique(),
  contentTitle: text("content_title").notNull(),
  contentHash: text("content_hash").notNull(), // SHA-256 content fingerprint
  contentSnippet: text("content_snippet"), // First 500 chars for quick comparison
  wordCount: integer("word_count"),
  vertical: varchar("vertical", { length: 50 }),
  neuronId: text("neuron_id"),
  isProtected: boolean("is_protected").default(true),
  isPublic: boolean("is_public").default(true),
  seoValue: real("seo_value").default(0.5), // 0-1 score
  trafficValue: integer("traffic_value").default(0), // monthly visitors
  businessValue: real("business_value").default(0.0), // revenue attribution
  lastScanned: timestamp("last_scanned"),
  lastModified: timestamp("last_modified"),
  scanFrequency: varchar("scan_frequency", { length: 20 }).default("weekly"), // daily, weekly, monthly
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Plagiarism Detections - Track content theft incidents
export const plagiarismDetections = pgTable("plagiarism_detections", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalContentId: uuid("original_content_id").notNull(),
  theftUrl: text("theft_url").notNull(),
  theftDomain: varchar("theft_domain", { length: 255 }).notNull(),
  similarityScore: real("similarity_score").notNull(), // 0-1
  detectionMethod: varchar("detection_method", { length: 50 }).notNull(), // api, scrape, user_report
  detectionSource: varchar("detection_source", { length: 100 }), // google, bing, ahrefs, manual
  theftType: varchar("theft_type", { length: 50 }).notNull(), // exact_copy, paraphrase, excerpt, image
  theftSeverity: varchar("theft_severity", { length: 20 }).notNull(), // low, medium, high, critical
  isConfirmed: boolean("is_confirmed").default(false),
  status: varchar("status", { length: 30 }).default("detected"), // detected, investigating, dmca_sent, resolved, ignored
  dmcaStatus: varchar("dmca_status", { length: 30 }), // draft, sent, acknowledged, complied, refused, escalated
  theftContent: text("theft_content"), // Stolen content snapshot
  theftMetadata: jsonb("theft_metadata").default({}), // domain info, whois, etc
  impactAssessment: jsonb("impact_assessment").default({}), // seo, traffic, revenue impact
  evidenceUrls: text("evidence_urls").array(),
  priority: integer("priority").default(5), // 1-10
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  lastCheckedAt: timestamp("last_checked_at"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// DMCA Requests - Legal takedown tracking
export const dmcaRequests = pgTable("dmca_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  plagiarismDetectionId: uuid("plagiarism_detection_id").notNull(),
  dmcaType: varchar("dmca_type", { length: 50 }).notNull(), // takedown, counter_notice, repeat_infringer
  targetPlatform: varchar("target_platform", { length: 100 }).notNull(), // google, hosting_provider, cdn
  platformEmail: varchar("platform_email", { length: 255 }),
  requestStatus: varchar("request_status", { length: 30 }).default("draft"), // draft, sent, pending, acknowledged, complied, refused, escalated
  dmcaTemplate: varchar("dmca_template", { length: 50 }), // us_standard, eu_copyright, india_copyright
  legalJurisdiction: varchar("legal_jurisdiction", { length: 50 }),
  requestContent: text("request_content").notNull(), // Full DMCA text
  confirmationNumber: varchar("confirmation_number", { length: 100 }),
  responseReceived: text("response_received"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  legalCounselInvolved: boolean("legal_counsel_involved").default(false),
  estimatedCost: real("estimated_cost"),
  actualCost: real("actual_cost"),
  successRate: real("success_rate"), // 0-1 for this platform/domain combo
  timeToResolution: integer("time_to_resolution"), // hours
  notes: text("notes"),
  attachments: jsonb("attachments").default([]),
  sentAt: timestamp("sent_at"),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedAt: timestamp("resolved_at"),
  escalatedAt: timestamp("escalated_at"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Content Refreshes - AI rewrite and update tracking
export const contentRefreshes = pgTable("content_refreshes", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalContentId: uuid("original_content_id").notNull(),
  refreshReason: varchar("refresh_reason", { length: 100 }).notNull(), // plagiarism_detected, seo_boost, scheduled_update
  refreshType: varchar("refresh_type", { length: 50 }).notNull(), // ai_rewrite, manual_edit, content_expansion
  llmProvider: varchar("llm_provider", { length: 50 }), // openai, claude, local
  llmModel: varchar("llm_model", { length: 100 }),
  originalContent: text("original_content"),
  refreshedContent: text("refreshed_content"),
  contentChanges: jsonb("content_changes").default({}), // diff summary
  qualityScore: real("quality_score"), // 0-1 AI quality assessment
  seoImprovements: jsonb("seo_improvements").default({}),
  readabilityScore: real("readability_score"), // 0-1
  uniquenessScore: real("uniqueness_score"), // 0-1 vs original
  approvalStatus: varchar("approval_status", { length: 30 }).default("pending"), // pending, approved, rejected, live
  approvedBy: text("approved_by"),
  goLiveAt: timestamp("go_live_at"),
  performanceMetrics: jsonb("performance_metrics").default({}), // post-refresh analytics
  rollbackAvailable: boolean("rollback_available").default(true),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Scraper Detection - Bot and unauthorized access monitoring
export const scraperDetections = pgTable("scraper_detections", {
  id: uuid("id").primaryKey().defaultRandom(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  userAgent: text("user_agent"),
  requestPattern: varchar("request_pattern", { length: 100 }), // bulk_download, rapid_requests, systematic_crawl
  requestCount: integer("request_count").default(1),
  requestTimespan: integer("request_timespan"), // seconds
  avgRequestRate: real("avg_request_rate"), // requests per second
  suspicionScore: real("suspicion_score").notNull(), // 0-1
  scraperType: varchar("scraper_type", { length: 50 }), // competitor, seo_tool, content_farm, unknown
  targetUrls: text("target_urls").array(),
  detectionMethod: varchar("detection_method", { length: 50 }), // rate_limiting, pattern_analysis, ml_detection
  isBlocked: boolean("is_blocked").default(false),
  blockReason: text("block_reason"),
  actionTaken: varchar("action_taken", { length: 100 }), // rate_limit, captcha, ip_block, legal_notice
  geolocation: jsonb("geolocation").default({}),
  whoisData: jsonb("whois_data").default({}),
  threatLevel: varchar("threat_level", { length: 20 }).default("medium"), // low, medium, high, critical
  isResolved: boolean("is_resolved").default(false),
  firstDetectedAt: timestamp("first_detected_at").defaultNow(),
  lastDetectedAt: timestamp("last_detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Content Monitoring Jobs - Scheduled scanning and alerts
export const contentMonitoringJobs = pgTable("content_monitoring_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobName: varchar("job_name", { length: 100 }).notNull(),
  jobType: varchar("job_type", { length: 50 }).notNull(), // plagiarism_scan, scraper_analysis, seo_check
  schedule: varchar("schedule", { length: 50 }).notNull(), // daily, weekly, monthly, realtime
  cronExpression: varchar("cron_expression", { length: 100 }),
  targetContentIds: text("target_content_ids").array(),
  scanParameters: jsonb("scan_parameters").notNull(),
  searchEngines: text("search_engines").array(), // google, bing, duckduckgo
  monitoringAPIs: text("monitoring_apis").array(), // ahrefs, semrush, copyscape
  alertThresholds: jsonb("alert_thresholds").notNull(),
  notificationChannels: text("notification_channels").array(), // email, slack, webhook
  isActive: boolean("is_active").default(true),
  lastRunAt: timestamp("last_run_at"),
  nextRunAt: timestamp("next_run_at"),
  totalRuns: integer("total_runs").default(0),
  successfulRuns: integer("successful_runs").default(0),
  avgExecutionTime: integer("avg_execution_time"), // seconds
  lastError: text("last_error"),
  performance: jsonb("performance").default({}),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// SEO Counter-Attacks - Anti-plagiarism SEO strategies
export const seoCounterAttacks = pgTable("seo_counter_attacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  plagiarismDetectionId: uuid("plagiarism_detection_id").notNull(),
  attackStrategy: varchar("attack_strategy", { length: 100 }).notNull(), // content_flooding, backlink_campaign, social_amplification
  targetKeywords: text("target_keywords").array(),
  contentVariations: integer("content_variations"), // number of variations published
  publicationChannels: text("publication_channels").array(),
  backlinkCampaigns: jsonb("backlink_campaigns").default([]),
  socialSignals: jsonb("social_signals").default({}),
  seoMetrics: jsonb("seo_metrics").default({}), // rankings, traffic, impressions
  effectivenessScore: real("effectiveness_score"), // 0-1
  costInvested: real("cost_invested"),
  roiEstimate: real("roi_estimate"),
  campaignStatus: varchar("campaign_status", { length: 30 }).default("active"), // active, paused, completed, failed
  launchedAt: timestamp("launched_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Content Defense Analytics - Performance tracking
export const contentDefenseAnalytics = pgTable("content_defense_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventType: varchar("event_type", { length: 50 }).notNull(), // detection, dmca_sent, content_removed, scraper_blocked
  eventData: jsonb("event_data").notNull(),
  contentId: uuid("content_id"),
  plagiarismId: uuid("plagiarism_id"),
  dmcaId: uuid("dmca_id"),
  impactMetrics: jsonb("impact_metrics").default({}), // traffic, revenue, seo impact
  responseTime: integer("response_time"), // seconds from detection to action
  resolutionTime: integer("resolution_time"), // seconds from action to resolution
  costMetrics: jsonb("cost_metrics").default({}), // legal fees, tool costs, time costs
  successMetrics: jsonb("success_metrics").default({}), // resolution rate, deterrent effect
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow()
});

// Schemas for validation
export const insertContentInventorySchema = createInsertSchema(contentInventory);
export const insertPlagiarismDetectionSchema = createInsertSchema(plagiarismDetections);
export const insertDmcaRequestSchema = createInsertSchema(dmcaRequests);
export const insertContentRefreshSchema = createInsertSchema(contentRefreshes);
export const insertScraperDetectionSchema = createInsertSchema(scraperDetections);
export const insertContentMonitoringJobSchema = createInsertSchema(contentMonitoringJobs);
export const insertSeoCounterAttackSchema = createInsertSchema(seoCounterAttacks);
export const insertContentDefenseAnalyticsSchema = createInsertSchema(contentDefenseAnalytics);

// Types
export type ContentInventory = InferSelectModel<typeof contentInventory>;
export type NewContentInventory = InferInsertModel<typeof contentInventory>;
export type PlagiarismDetection = InferSelectModel<typeof plagiarismDetections>;
export type NewPlagiarismDetection = InferInsertModel<typeof plagiarismDetections>;
export type DmcaRequest = InferSelectModel<typeof dmcaRequests>;
export type NewDmcaRequest = InferInsertModel<typeof dmcaRequests>;
export type ContentRefresh = InferSelectModel<typeof contentRefreshes>;
export type NewContentRefresh = InferInsertModel<typeof contentRefreshes>;
export type ScraperDetection = InferSelectModel<typeof scraperDetections>;
export type NewScraperDetection = InferInsertModel<typeof scraperDetections>;
export type ContentMonitoringJob = InferSelectModel<typeof contentMonitoringJobs>;
export type NewContentMonitoringJob = InferInsertModel<typeof contentMonitoringJobs>;
export type SeoCounterAttack = InferSelectModel<typeof seoCounterAttacks>;
export type NewSeoCounterAttack = InferInsertModel<typeof seoCounterAttacks>;
export type ContentDefenseAnalytic = InferSelectModel<typeof contentDefenseAnalytics>;
export type NewContentDefenseAnalytic = InferInsertModel<typeof contentDefenseAnalytics>;

// DTOs
const contentInventoryDTOKeys = ["id", "neuronId", "vertical", "createdAt", "updatedAt"] as const;

export interface ContentInventoryDTO
  extends Pick<ContentInventory, (typeof contentInventoryDTOKeys)[number]> {}

export const toContentInventoryDTO = (contentInventory: ContentInventory): ContentInventoryDTO =>
  pickDTOFields(contentInventory, contentInventoryDTOKeys);


const plagiarismDetectionDTOKeys = ["id", "status", "priority", "createdAt", "updatedAt"] as const;

export interface PlagiarismDetectionDTO
  extends Pick<PlagiarismDetection, (typeof plagiarismDetectionDTOKeys)[number]> {}

export const toPlagiarismDetectionDTO = (plagiarismDetection: PlagiarismDetection): PlagiarismDetectionDTO =>
  pickDTOFields(plagiarismDetection, plagiarismDetectionDTOKeys);


const dmcaRequestDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface DmcaRequestDTO
  extends Pick<DmcaRequest, (typeof dmcaRequestDTOKeys)[number]> {}

export const toDmcaRequestDTO = (dmcaRequest: DmcaRequest): DmcaRequestDTO =>
  pickDTOFields(dmcaRequest, dmcaRequestDTOKeys);


const contentRefreshDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface ContentRefreshDTO
  extends Pick<ContentRefresh, (typeof contentRefreshDTOKeys)[number]> {}

export const toContentRefreshDTO = (contentRefresh: ContentRefresh): ContentRefreshDTO =>
  pickDTOFields(contentRefresh, contentRefreshDTOKeys);


const scraperDetectionDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface ScraperDetectionDTO
  extends Pick<ScraperDetection, (typeof scraperDetectionDTOKeys)[number]> {}

export const toScraperDetectionDTO = (scraperDetection: ScraperDetection): ScraperDetectionDTO =>
  pickDTOFields(scraperDetection, scraperDetectionDTOKeys);


const contentMonitoringJobDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface ContentMonitoringJobDTO
  extends Pick<ContentMonitoringJob, (typeof contentMonitoringJobDTOKeys)[number]> {}

export const toContentMonitoringJobDTO = (contentMonitoringJob: ContentMonitoringJob): ContentMonitoringJobDTO =>
  pickDTOFields(contentMonitoringJob, contentMonitoringJobDTOKeys);


const seoCounterAttackDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface SeoCounterAttackDTO
  extends Pick<SeoCounterAttack, (typeof seoCounterAttackDTOKeys)[number]> {}

export const toSeoCounterAttackDTO = (seoCounterAttack: SeoCounterAttack): SeoCounterAttackDTO =>
  pickDTOFields(seoCounterAttack, seoCounterAttackDTOKeys);


const contentDefenseAnalyticDTOKeys = ["id", "createdAt", "eventType"] as const;

export interface ContentDefenseAnalyticDTO
  extends Pick<ContentDefenseAnalytic, (typeof contentDefenseAnalyticDTOKeys)[number]> {}

export const toContentDefenseAnalyticDTO = (contentDefenseAnalytic: ContentDefenseAnalytic): ContentDefenseAnalyticDTO =>
  pickDTOFields(contentDefenseAnalytic, contentDefenseAnalyticDTOKeys);

