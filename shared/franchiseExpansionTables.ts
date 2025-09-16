import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, real, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pickDTOFields } from "./dtoHelpers";
// ================================================
// CONTENT FRANCHISE EXPANSION KIT MODULE
// Billion-Dollar Empire Grade, Infinite Scaling, Migration-Proof
// ================================================

// Franchise Templates - Master blueprints for cloning
export const franchiseTemplates = pgTable("franchise_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateName: varchar("template_name", { length: 100 }).notNull().unique(),
  templateType: varchar("template_type", { length: 50 }).notNull(), // vertical, tool, landing, microsite, full_neuron
  sourceNeuronId: text("source_neuron_id"),
  sourceModuleId: text("source_module_id"),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }), // finance, health, saas, education, etc
  complexity: varchar("complexity", { length: 20 }).default("medium"), // simple, medium, complex, enterprise
  estimatedValue: real("estimated_value"), // business value assessment
  requiredResources: jsonb("required_resources").default({}), // domains, apis, content, etc
  dependencies: text("dependencies").array(),
  supportedRegions: text("supported_regions").array(),
  supportedLanguages: text("supported_languages").array(),
  templateStructure: jsonb("template_structure").notNull(), // file structure, config, assets
  codeTemplates: jsonb("code_templates").default({}), // code patterns and customizations
  contentTemplates: jsonb("content_templates").default({}), // content patterns
  configTemplates: jsonb("config_templates").default({}), // configuration patterns
  deploymentInstructions: text("deployment_instructions"),
  migrationSteps: jsonb("migration_steps").default([]),
  testingChecklist: jsonb("testing_checklist").default([]),
  performanceMetrics: jsonb("performance_metrics").default({}),
  successCriteria: jsonb("success_criteria").default({}),
  lastUsed: timestamp("last_used"),
  usageCount: integer("usage_count").default(0),
  averageSetupTime: integer("average_setup_time"), // minutes
  successRate: real("success_rate").default(1.0), // 0-1
  isActive: boolean("is_active").default(true),
  isPublic: boolean("is_public").default(false),
  version: varchar("version", { length: 20 }).default("1.0.0"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Franchise Instances - Active deployed franchises
export const franchiseInstances = pgTable("franchise_instances", {
  id: uuid("id").primaryKey().defaultRandom(),
  franchiseName: varchar("franchise_name", { length: 100 }).notNull(),
  franchiseSlug: varchar("franchise_slug", { length: 100 }).notNull().unique(),
  templateId: uuid("template_id").notNull(),
  parentNeuronId: text("parent_neuron_id"),
  status: varchar("status", { length: 30 }).default("initializing"), // initializing, active, paused, failed, archived
  deploymentType: varchar("deployment_type", { length: 50 }).notNull(), // subdomain, domain, microsite, embedded
  primaryDomain: varchar("primary_domain", { length: 255 }),
  subdomains: text("subdomains").array(),
  customDomains: text("custom_domains").array(),
  deploymentUrl: text("deployment_url"),
  adminUrl: text("admin_url"),
  apiEndpoint: text("api_endpoint"),
  region: varchar("region", { length: 50 }),
  language: varchar("language", { length: 10 }).default("en"),
  localization: jsonb("localization").default({}),
  brandingCustomization: jsonb("branding_customization").default({}),
  contentCustomization: jsonb("content_customization").default({}),
  featureFlags: jsonb("feature_flags").default({}),
  integrationConfig: jsonb("integration_config").default({}),
  analyticsConfig: jsonb("analytics_config").default({}),
  seoConfig: jsonb("seo_config").default({}),
  affiliateConfig: jsonb("affiliate_config").default({}),
  crossPromotionConfig: jsonb("cross_promotion_config").default({}),
  backlinksToParent: text("backlinks_to_parent").array(),
  backlinksfromParent: text("backlinks_from_parent").array(),
  sharedResources: jsonb("shared_resources").default({}),
  isolatedResources: jsonb("isolated_resources").default({}),
  performanceMetrics: jsonb("performance_metrics").default({}),
  businessMetrics: jsonb("business_metrics").default({}),
  deployedAt: timestamp("deployed_at"),
  lastSync: timestamp("last_sync"),
  lastUpdate: timestamp("last_update"),
  healthStatus: varchar("health_status", { length: 20 }).default("healthy"), // healthy, warning, critical
  uptime: real("uptime").default(1.0), // 0-1
  isAutoUpdateEnabled: boolean("is_auto_update_enabled").default(true),
  syncFrequency: varchar("sync_frequency", { length: 20 }).default("daily"), // realtime, hourly, daily, weekly
  backupStrategy: varchar("backup_strategy", { length: 30 }).default("automated"),
  lastBackup: timestamp("last_backup"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Franchise Deployments - Deployment history and management
export const franchiseDeployments = pgTable("franchise_deployments", {
  id: uuid("id").primaryKey().defaultRandom(),
  franchiseId: uuid("franchise_id").notNull(),
  deploymentType: varchar("deployment_type", { length: 50 }).notNull(), // initial, update, hotfix, rollback
  version: varchar("version", { length: 20 }).notNull(),
  deploymentStatus: varchar("deployment_status", { length: 30 }).default("pending"), // pending, in_progress, completed, failed, rolled_back
  deploymentMethod: varchar("deployment_method", { length: 50 }), // automated, manual, scheduled
  triggeredBy: varchar("triggered_by", { length: 100 }), // user_id, scheduled_job, webhook
  changesIncluded: jsonb("changes_included").default([]),
  deploymentSteps: jsonb("deployment_steps").default([]),
  currentStep: integer("current_step").default(0),
  totalSteps: integer("total_steps"),
  deploymentLogs: text("deployment_logs"),
  errors: jsonb("errors").default([]),
  warnings: jsonb("warnings").default([]),
  preDeploymentTests: jsonb("pre_deployment_tests").default({}),
  postDeploymentTests: jsonb("post_deployment_tests").default({}),
  performanceComparison: jsonb("performance_comparison").default({}),
  rollbackPoint: varchar("rollback_point", { length: 100 }),
  canRollback: boolean("can_rollback").default(true),
  estimatedDuration: integer("estimated_duration"), // minutes
  actualDuration: integer("actual_duration"), // minutes
  resourcesUsed: jsonb("resources_used").default({}),
  downtime: integer("downtime").default(0), // seconds
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  rollbackAt: timestamp("rollback_at"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow()
});

// Cross Promotion Links - Interlinking between franchises
export const crossPromotionLinks = pgTable("cross_promotion_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceFranchiseId: uuid("source_franchise_id").notNull(),
  targetFranchiseId: uuid("target_franchise_id").notNull(),
  linkType: varchar("link_type", { length: 50 }).notNull(), // banner, footer, sidebar, popup, content_mention
  linkPosition: varchar("link_position", { length: 100 }), // specific placement
  linkContent: text("link_content").notNull(), // HTML content or banner data
  linkText: text("link_text"),
  linkUrl: text("link_url").notNull(),
  linkTitle: text("link_title"),
  linkDescription: text("link_description"),
  displayConditions: jsonb("display_conditions").default({}), // when to show
  audienceTargeting: jsonb("audience_targeting").default({}), // who to show to
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(5), // 1-10
  clickTrackingEnabled: boolean("click_tracking_enabled").default(true),
  conversionTrackingEnabled: boolean("conversion_tracking_enabled").default(true),
  performanceMetrics: jsonb("performance_metrics").default({}),
  clickCount: integer("click_count").default(0),
  conversionCount: integer("conversion_count").default(0),
  conversionValue: real("conversion_value").default(0),
  lastClicked: timestamp("last_clicked"),
  lastConverted: timestamp("last_converted"),
  isReciprocal: boolean("is_reciprocal").default(false), // if target should link back
  reciprocalLinkId: uuid("reciprocal_link_id"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Franchise Analytics - Performance tracking across all franchises
export const franchiseAnalytics = pgTable("franchise_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  franchiseId: uuid("franchise_id").notNull(),
  metricType: varchar("metric_type", { length: 50 }).notNull(), // traffic, conversion, revenue, performance
  metricName: varchar("metric_name", { length: 100 }).notNull(),
  metricValue: real("metric_value").notNull(),
  metricUnit: varchar("metric_unit", { length: 20 }), // visitors, dollars, percentage, ms
  timeframe: varchar("timeframe", { length: 20 }).notNull(), // hourly, daily, weekly, monthly
  date: timestamp("date").notNull(),
  dimensions: jsonb("dimensions").default({}), // additional breakdowns
  comparedToParent: real("compared_to_parent"), // performance vs parent neuron
  comparedToPrevious: real("compared_to_previous"), // period-over-period change
  benchmark: real("benchmark"), // industry or internal benchmark
  isAnomaly: boolean("is_anomaly").default(false),
  confidence: real("confidence"), // 0-1 data quality
  dataSource: varchar("data_source", { length: 100 }),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow()
});

// Franchise Updates - Update propagation management
export const franchiseUpdates = pgTable("franchise_updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  updateName: varchar("update_name", { length: 100 }).notNull(),
  updateType: varchar("update_type", { length: 50 }).notNull(), // code, content, config, security, feature
  updateScope: varchar("update_scope", { length: 50 }).notNull(), // all_franchises, template_based, selective, single
  sourceNeuronId: text("source_neuron_id"),
  templateIds: text("template_ids").array(),
  targetFranchiseIds: text("target_franchise_ids").array(),
  updateContent: jsonb("update_content").notNull(),
  updateInstructions: text("update_instructions"),
  preConditions: jsonb("pre_conditions").default([]),
  postConditions: jsonb("post_conditions").default([]),
  testingRequired: boolean("testing_required").default(true),
  approvalRequired: boolean("approval_required").default(false),
  rollbackPlan: jsonb("rollback_plan").default({}),
  updatePriority: varchar("update_priority", { length: 20 }).default("medium"), // low, medium, high, critical
  scheduledAt: timestamp("scheduled_at"),
  batchSize: integer("batch_size").default(10), // franchises per batch
  batchDelay: integer("batch_delay").default(300), // seconds between batches
  updateStatus: varchar("update_status", { length: 30 }).default("pending"), // pending, in_progress, completed, failed, cancelled
  successCount: integer("success_count").default(0),
  failureCount: integer("failure_count").default(0),
  skipCount: integer("skip_count").default(0),
  updateLogs: text("update_logs"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  estimatedDuration: integer("estimated_duration"), // minutes
  actualDuration: integer("actual_duration"), // minutes
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Franchise Backups - Backup and restore management
export const franchiseBackups = pgTable("franchise_backups", {
  id: uuid("id").primaryKey().defaultRandom(),
  franchiseId: uuid("franchise_id").notNull(),
  backupName: varchar("backup_name", { length: 100 }).notNull(),
  backupType: varchar("backup_type", { length: 50 }).notNull(), // full, incremental, config_only, content_only
  backupTrigger: varchar("backup_trigger", { length: 50 }), // scheduled, manual, pre_deployment, pre_update
  backupStatus: varchar("backup_status", { length: 30 }).default("in_progress"), // in_progress, completed, failed, corrupted
  backupSize: integer("backup_size"), // bytes
  compressionRatio: real("compression_ratio"),
  backupLocation: text("backup_location").notNull(),
  backupMetadata: jsonb("backup_metadata").default({}),
  includedComponents: text("included_components").array(), // database, files, config, content, etc
  excludedComponents: text("excluded_components").array(),
  retentionPolicy: varchar("retention_policy", { length: 50 }).default("30_days"),
  encryptionEnabled: boolean("encryption_enabled").default(true),
  compressionEnabled: boolean("compression_enabled").default(true),
  verificationStatus: varchar("verification_status", { length: 30 }), // not_verified, verified, corrupted
  restoreTested: boolean("restore_tested").default(false),
  lastRestoreTest: timestamp("last_restore_test"),
  expiresAt: timestamp("expires_at"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"), // seconds
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow()
});

// Franchise Opportunities - Market expansion opportunities
export const franchiseOpportunities = pgTable("franchise_opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  opportunityName: varchar("opportunity_name", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }),
  marketSize: real("market_size"),
  competitionLevel: varchar("competition_level", { length: 20 }).default("medium"),
  entryBarriers: text("entry_barriers").array(),
  revenueProjection: real("revenue_projection"),
  investmentRequired: real("investment_required"),
  roi: real("roi"),
  riskScore: real("risk_score"),
  demographicFit: real("demographic_fit"),
  priority: integer("priority").default(5),
  isActive: boolean("is_active").default(true),
  analysisDate: timestamp("analysis_date").defaultNow(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Franchise Management Dashboard - Administrative overview
export const franchiseManagementDashboard = pgTable("franchise_management_dashboard", {
  id: uuid("id").primaryKey().defaultRandom(),
  dashboardName: varchar("dashboard_name", { length: 100 }).notNull(),
  dashboardType: varchar("dashboard_type", { length: 50 }).default("overview"), // overview, performance, health, deployments
  ownerId: text("owner_id"),
  accessLevel: varchar("access_level", { length: 20 }).default("admin"), // admin, manager, viewer
  dashboardConfig: jsonb("dashboard_config").notNull(),
  widgets: jsonb("widgets").default([]),
  filters: jsonb("filters").default({}),
  alertRules: jsonb("alert_rules").default([]),
  reportSchedule: jsonb("report_schedule").default({}),
  isDefault: boolean("is_default").default(false),
  isPublic: boolean("is_public").default(false),
  shareToken: varchar("share_token", { length: 100 }),
  lastAccessed: timestamp("last_accessed"),
  accessCount: integer("access_count").default(0),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Schemas for validation
export const insertFranchiseTemplateSchema = createInsertSchema(franchiseTemplates);
export const insertFranchiseInstanceSchema = createInsertSchema(franchiseInstances);
export const insertFranchiseDeploymentSchema = createInsertSchema(franchiseDeployments);
export const insertCrossPromotionLinkSchema = createInsertSchema(crossPromotionLinks);
export const insertFranchiseAnalyticsSchema = createInsertSchema(franchiseAnalytics);
export const insertFranchiseUpdateSchema = createInsertSchema(franchiseUpdates);
export const insertFranchiseBackupSchema = createInsertSchema(franchiseBackups);
export const insertFranchiseManagementDashboardSchema = createInsertSchema(franchiseManagementDashboard);

// Types
export type FranchiseTemplate = InferSelectModel<typeof franchiseTemplates>;
export type NewFranchiseTemplate = InferInsertModel<typeof franchiseTemplates>;
export type FranchiseInstance = InferSelectModel<typeof franchiseInstances>;
export type NewFranchiseInstance = InferInsertModel<typeof franchiseInstances>;
export type FranchiseDeployment = InferSelectModel<typeof franchiseDeployments>;
export type NewFranchiseDeployment = InferInsertModel<typeof franchiseDeployments>;
export type CrossPromotionLink = InferSelectModel<typeof crossPromotionLinks>;
export type NewCrossPromotionLink = InferInsertModel<typeof crossPromotionLinks>;
export type FranchiseAnalytic = InferSelectModel<typeof franchiseAnalytics>;
export type NewFranchiseAnalytic = InferInsertModel<typeof franchiseAnalytics>;
export type FranchiseUpdate = InferSelectModel<typeof franchiseUpdates>;
export type NewFranchiseUpdate = InferInsertModel<typeof franchiseUpdates>;
export type FranchiseBackup = InferSelectModel<typeof franchiseBackups>;
export type NewFranchiseBackup = InferInsertModel<typeof franchiseBackups>;
export type FranchiseManagementDashboard = InferSelectModel<typeof franchiseManagementDashboard>;
export type NewFranchiseManagementDashboard = InferInsertModel<typeof franchiseManagementDashboard>;

export type FranchiseOpportunity = InferSelectModel<typeof franchiseOpportunities>;
export type InsertFranchiseOpportunity = InferInsertModel<typeof franchiseOpportunities>;

// DTOs
const franchiseTemplateDTOKeys = ["id", "category", "createdAt", "updatedAt", "description", "version"] as const;

export interface FranchiseTemplateDTO
  extends Pick<FranchiseTemplate, (typeof franchiseTemplateDTOKeys)[number]> {}

export const toFranchiseTemplateDTO = (franchiseTemplate: FranchiseTemplate): FranchiseTemplateDTO =>
  pickDTOFields(franchiseTemplate, franchiseTemplateDTOKeys);


const franchiseInstanceDTOKeys = ["id", "status", "region", "language", "createdAt", "updatedAt"] as const;

export interface FranchiseInstanceDTO
  extends Pick<FranchiseInstance, (typeof franchiseInstanceDTOKeys)[number]> {}

export const toFranchiseInstanceDTO = (franchiseInstance: FranchiseInstance): FranchiseInstanceDTO =>
  pickDTOFields(franchiseInstance, franchiseInstanceDTOKeys);


const franchiseDeploymentDTOKeys = ["id", "createdAt", "version"] as const;

export interface FranchiseDeploymentDTO
  extends Pick<FranchiseDeployment, (typeof franchiseDeploymentDTOKeys)[number]> {}

export const toFranchiseDeploymentDTO = (franchiseDeployment: FranchiseDeployment): FranchiseDeploymentDTO =>
  pickDTOFields(franchiseDeployment, franchiseDeploymentDTOKeys);


const crossPromotionLinkDTOKeys = ["id", "priority", "createdAt", "updatedAt"] as const;

export interface CrossPromotionLinkDTO
  extends Pick<CrossPromotionLink, (typeof crossPromotionLinkDTOKeys)[number]> {}

export const toCrossPromotionLinkDTO = (crossPromotionLink: CrossPromotionLink): CrossPromotionLinkDTO =>
  pickDTOFields(crossPromotionLink, crossPromotionLinkDTOKeys);


const franchiseAnalyticDTOKeys = ["id", "createdAt", "franchiseId"] as const;

export interface FranchiseAnalyticDTO
  extends Pick<FranchiseAnalytic, (typeof franchiseAnalyticDTOKeys)[number]> {}

export const toFranchiseAnalyticDTO = (franchiseAnalytic: FranchiseAnalytic): FranchiseAnalyticDTO =>
  pickDTOFields(franchiseAnalytic, franchiseAnalyticDTOKeys);


const franchiseUpdateDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface FranchiseUpdateDTO
  extends Pick<FranchiseUpdate, (typeof franchiseUpdateDTOKeys)[number]> {}

export const toFranchiseUpdateDTO = (franchiseUpdate: FranchiseUpdate): FranchiseUpdateDTO =>
  pickDTOFields(franchiseUpdate, franchiseUpdateDTOKeys);


const franchiseBackupDTOKeys = ["id", "createdAt", "franchiseId"] as const;

export interface FranchiseBackupDTO
  extends Pick<FranchiseBackup, (typeof franchiseBackupDTOKeys)[number]> {}

export const toFranchiseBackupDTO = (franchiseBackup: FranchiseBackup): FranchiseBackupDTO =>
  pickDTOFields(franchiseBackup, franchiseBackupDTOKeys);


const franchiseManagementDashboardDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface FranchiseManagementDashboardDTO
  extends Pick<FranchiseManagementDashboard, (typeof franchiseManagementDashboardDTOKeys)[number]> {}

export const toFranchiseManagementDashboardDTO = (franchiseManagementDashboard: FranchiseManagementDashboard): FranchiseManagementDashboardDTO =>
  pickDTOFields(franchiseManagementDashboard, franchiseManagementDashboardDTOKeys);


const franchiseOpportunityDTOKeys = ["id", "region", "country", "priority", "createdAt", "updatedAt"] as const;

export interface FranchiseOpportunityDTO
  extends Pick<FranchiseOpportunity, (typeof franchiseOpportunityDTOKeys)[number]> {}

export const toFranchiseOpportunityDTO = (franchiseOpportunity: FranchiseOpportunity): FranchiseOpportunityDTO =>
  pickDTOFields(franchiseOpportunity, franchiseOpportunityDTOKeys);

