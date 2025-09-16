import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { InferSelectModel } from "drizzle-orm";
import { pickDTOFields } from "./dtoHelpers";
// ===================================================================
// MONEY/TRAFFIC GROWTH ENGINE TABLES - BILLION-DOLLAR EMPIRE GRADE
// ===================================================================

// 1. SEO OPTIMIZATION ENGINE
export const seoOptimizationTasks = pgTable("seo_optimization_tasks", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  targetKeyword: text("target_keyword").notNull(),
  title: text("title"),
  metaDescription: text("meta_description"),
  headingStructure: jsonb("heading_structure").default({}),
  keywordDensity: real("keyword_density").default(0),
  contentLength: integer("content_length").default(0),
  internalLinks: integer("internal_links").default(0),
  externalLinks: integer("external_links").default(0),
  imageAltTags: integer("image_alt_tags").default(0),
  seoScore: real("seo_score").default(0),
  status: varchar("status", { length: 50 }).default("pending"),
  recommendations: jsonb("recommendations").default([]),
  priority: integer("priority").default(1),
  lastAnalyzed: timestamp("last_analyzed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const seoKeywordResearch = pgTable("seo_keyword_research", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  searchVolume: integer("search_volume").default(0),
  competitionLevel: varchar("competition_level", { length: 20 }).default("medium"),
  difficulty: real("difficulty").default(0),
  cpc: real("cpc").default(0),
  trend: varchar("trend", { length: 20 }).default("stable"),
  relatedKeywords: jsonb("related_keywords").default([]),
  contentOpportunity: text("content_opportunity"),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  priority: integer("priority").default(1),
  isTargeted: boolean("is_targeted").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const seoSiteAudits = pgTable("seo_site_audits", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  overallScore: real("overall_score").default(0),
  technicalIssues: jsonb("technical_issues").default([]),
  contentIssues: jsonb("content_issues").default([]),
  linkingIssues: jsonb("linking_issues").default([]),
  speedScore: real("speed_score").default(0),
  mobileScore: real("mobile_score").default(0),
  accessibilityScore: real("accessibility_score").default(0),
  bestPracticesScore: real("best_practices_score").default(0),
  fixRecommendations: jsonb("fix_recommendations").default([]),
  estimatedTrafficImpact: integer("estimated_traffic_impact").default(0),
  auditDate: timestamp("audit_date").defaultNow(),
  nextAuditDue: timestamp("next_audit_due"),
  createdAt: timestamp("created_at").defaultNow()
});

// 2. VIRAL CONTENT GENERATION ENGINE
export const contentTemplates = pgTable("content_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  templateType: varchar("template_type", { length: 50 }).notNull(), // blog, social, video, infographic
  vertical: varchar("vertical", { length: 50 }).notNull(),
  viralScore: real("viral_score").default(0),
  structure: jsonb("structure").notNull(),
  hooks: jsonb("hooks").default([]),
  callToActions: jsonb("call_to_actions").default([]),
  emotionalTriggers: jsonb("emotional_triggers").default([]),
  targetAudience: jsonb("target_audience").default({}),
  avgEngagementRate: real("avg_engagement_rate").default(0),
  avgShareRate: real("avg_share_rate").default(0),
  estimatedReach: integer("estimated_reach").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const contentGeneration = pgTable("content_generation", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => contentTemplates.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  keywords: jsonb("keywords").default([]),
  contentType: varchar("content_type", { length: 50 }).notNull(),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  emotionalTone: varchar("emotional_tone", { length: 50 }),
  readabilityScore: real("readability_score").default(0),
  seoScore: real("seo_score").default(0),
  viralPotential: real("viral_potential").default(0),
  status: varchar("status", { length: 50 }).default("draft"),
  publishedAt: timestamp("published_at"),
  scheduledFor: timestamp("scheduled_for"),
  performanceMetrics: jsonb("performance_metrics").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const contentPerformance = pgTable("content_performance", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contentGeneration.id),
  platform: varchar("platform", { length: 50 }).notNull(),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  comments: integer("comments").default(0),
  clickThroughRate: real("click_through_rate").default(0),
  engagementRate: real("engagement_rate").default(0),
  conversionRate: real("conversion_rate").default(0),
  revenue: real("revenue").default(0),
  trafficGenerated: integer("traffic_generated").default(0),
  backlinksEarned: integer("backlinks_earned").default(0),
  viralityScore: real("virality_score").default(0),
  trackingPeriod: varchar("tracking_period", { length: 20 }).default("7d"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// 3. REFERRAL SYSTEM ENGINE
export const referralPrograms = pgTable("referral_programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  rewardType: varchar("reward_type", { length: 50 }).notNull(), // percentage, fixed, points, credits
  rewardValue: real("reward_value").notNull(),
  referrerReward: real("referrer_reward").notNull(),
  refereeReward: real("referee_reward").default(0),
  minimumPurchase: real("minimum_purchase").default(0),
  cookieDuration: integer("cookie_duration").default(30), // days
  maxRewardsPerUser: integer("max_rewards_per_user").default(0), // 0 = unlimited
  isActive: boolean("is_active").default(true),
  autoApproval: boolean("auto_approval").default(true),
  trackingMethod: varchar("tracking_method", { length: 50 }).default("cookie"),
  paymentSchedule: varchar("payment_schedule", { length: 50 }).default("monthly"),
  termsAndConditions: text("terms_and_conditions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const referralLinks = pgTable("referral_links", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").references(() => referralPrograms.id),
  referrerId: text("referrer_id").notNull(), // user ID or email
  referralCode: text("referral_code").notNull().unique(),
  customUrl: text("custom_url"),
  targetUrl: text("target_url").notNull(),
  campaignName: text("campaign_name"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  revenue: real("revenue").default(0),
  commissionEarned: real("commission_earned").default(0),
  lastClickAt: timestamp("last_click_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const referralTransactions = pgTable("referral_transactions", {
  id: serial("id").primaryKey(),
  linkId: integer("link_id").references(() => referralLinks.id),
  programId: integer("program_id").references(() => referralPrograms.id),
  referrerId: text("referrer_id").notNull(),
  refereeId: text("referee_id"),
  refereeEmail: text("referee_email"),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // click, signup, purchase, commission
  transactionValue: real("transaction_value").default(0),
  commissionRate: real("commission_rate").default(0),
  commissionAmount: real("commission_amount").default(0),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected, paid
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  conversionData: jsonb("conversion_data").default({}),
  paymentDate: timestamp("payment_date"),
  createdAt: timestamp("created_at").defaultNow()
});

// 4. BACKLINK BUILDING ENGINE
export const backlinkOpportunities = pgTable("backlink_opportunities", {
  id: serial("id").primaryKey(),
  targetDomain: text("target_domain").notNull(),
  contactEmail: text("contact_email"),
  contactName: text("contact_name"),
  websiteAuthority: real("website_authority").default(0),
  domainRating: real("domain_rating").default(0),
  trafficEstimate: integer("traffic_estimate").default(0),
  vertical: varchar("vertical", { length: 50 }),
  linkType: varchar("link_type", { length: 50 }).notNull(), // guest_post, resource_page, broken_link, testimonial
  outreachStatus: varchar("outreach_status", { length: 50 }).default("not_contacted"),
  responseStatus: varchar("response_status", { length: 50 }),
  linkPlaced: boolean("link_placed").default(false),
  linkUrl: text("link_url"),
  anchorText: text("anchor_text"),
  contentUrl: text("content_url"),
  pitchTemplate: text("pitch_template"),
  followUpSchedule: jsonb("follow_up_schedule").default([]),
  expectedValue: real("expected_value").default(0),
  priority: integer("priority").default(1),
  lastContactAt: timestamp("last_contact_at"),
  nextFollowUp: timestamp("next_follow_up"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const backlinkOutreach = pgTable("backlink_outreach", {
  id: serial("id").primaryKey(),
  opportunityId: integer("opportunity_id").references(() => backlinkOpportunities.id),
  outreachType: varchar("outreach_type", { length: 50 }).notNull(), // initial, follow_up, thank_you
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  opened: boolean("opened").default(false),
  openedAt: timestamp("opened_at"),
  clicked: boolean("clicked").default(false),
  clickedAt: timestamp("clicked_at"),
  replied: boolean("replied").default(false),
  repliedAt: timestamp("replied_at"),
  replyContent: text("reply_content"),
  sentiment: varchar("sentiment", { length: 50 }), // positive, negative, neutral
  nextAction: text("next_action"),
  automationTriggered: boolean("automation_triggered").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const backlinkMonitoring = pgTable("backlink_monitoring", {
  id: serial("id").primaryKey(),
  sourceUrl: text("source_url").notNull(),
  targetUrl: text("target_url").notNull(),
  anchorText: text("anchor_text"),
  linkType: varchar("link_type", { length: 50 }), // dofollow, nofollow, sponsored
  sourceAuthority: real("source_authority").default(0),
  linkStatus: varchar("link_status", { length: 50 }).default("active"), // active, removed, redirected, broken
  trafficFromLink: integer("traffic_from_link").default(0),
  linkValue: real("link_value").default(0),
  discoveredAt: timestamp("discovered_at").defaultNow(),
  lastChecked: timestamp("last_checked").defaultNow(),
  alertsEnabled: boolean("alerts_enabled").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

// 5. SOCIAL MEDIA AUTOMATION ENGINE
export const socialMediaAccounts = pgTable("social_media_accounts", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(), // twitter, linkedin, facebook, instagram, tiktok
  accountName: text("account_name").notNull(),
  accountHandle: text("account_handle"),
  accountId: text("account_id"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  isActive: boolean("is_active").default(true),
  isConnected: boolean("is_connected").default(false),
  vertical: varchar("vertical", { length: 50 }),
  followerCount: integer("follower_count").default(0),
  followingCount: integer("following_count").default(0),
  postCount: integer("post_count").default(0),
  engagementRate: real("engagement_rate").default(0),
  lastSyncAt: timestamp("last_sync_at"),
  automationSettings: jsonb("automation_settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const socialMediaPosts = pgTable("social_media_posts", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").references(() => socialMediaAccounts.id),
  platform: varchar("platform", { length: 50 }).notNull(),
  contentId: integer("content_id").references(() => contentGeneration.id),
  postContent: text("post_content").notNull(),
  mediaUrls: jsonb("media_urls").default([]),
  hashtags: jsonb("hashtags").default([]),
  mentions: jsonb("mentions").default([]),
  postUrl: text("post_url"),
  platformPostId: text("platform_post_id"),
  status: varchar("status", { length: 50 }).default("draft"), // draft, scheduled, posted, failed
  scheduledFor: timestamp("scheduled_for"),
  postedAt: timestamp("posted_at"),
  engagementMetrics: jsonb("engagement_metrics").default({}),
  isPromoted: boolean("is_promoted").default(false),
  promotionBudget: real("promotion_budget").default(0),
  targetAudience: jsonb("target_audience").default({}),
  campaignName: text("campaign_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const socialMediaEngagement = pgTable("social_media_engagement", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => socialMediaPosts.id),
  platform: varchar("platform", { length: 50 }).notNull(),
  engagementType: varchar("engagement_type", { length: 50 }).notNull(), // like, comment, share, save, click
  userId: text("user_id"),
  username: text("username"),
  userProfileUrl: text("user_profile_url"),
  engagementContent: text("engagement_content"), // for comments
  sentimentScore: real("sentiment_score"),
  isInfluencer: boolean("is_influencer").default(false),
  followerCount: integer("follower_count").default(0),
  engagementValue: real("engagement_value").default(0),
  automatedResponse: text("automated_response"),
  responseScheduled: boolean("response_scheduled").default(false),
  engagedAt: timestamp("engaged_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// 6. EMAIL MARKETING AUTOMATION ENGINE
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  campaignType: varchar("campaign_type", { length: 50 }).notNull(), // broadcast, drip, behavioral
  vertical: varchar("vertical", { length: 50 }).notNull(),
  subject: text("subject").notNull(),
  preheader: text("preheader"),
  emailContent: text("email_content").notNull(),
  template: text("template"),
  segmentId: integer("segment_id"),
  senderName: text("sender_name"),
  senderEmail: text("sender_email"),
  replyToEmail: text("reply_to_email"),
  status: varchar("status", { length: 50 }).default("draft"), // draft, scheduled, sending, sent, paused
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  totalRecipients: integer("total_recipients").default(0),
  deliveredCount: integer("delivered_count").default(0),
  openedCount: integer("opened_count").default(0),
  clickedCount: integer("clicked_count").default(0),
  unsubscribedCount: integer("unsubscribed_count").default(0),
  bouncedCount: integer("bounced_count").default(0),
  conversionCount: integer("conversion_count").default(0),
  revenue: real("revenue").default(0),
  automationTriggerId: integer("automation_trigger_id"),
  abTestVariant: varchar("ab_test_variant", { length: 10 }),
  trackingEnabled: boolean("tracking_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const emailAutomations = pgTable("email_automations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  automationType: varchar("automation_type", { length: 50 }).notNull(), // welcome, nurture, abandonment, reengagement
  triggerEvent: varchar("trigger_event", { length: 50 }).notNull(),
  triggerConditions: jsonb("trigger_conditions").default({}),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true),
  delayMinutes: integer("delay_minutes").default(0),
  sendTime: varchar("send_time", { length: 10 }), // specific time like "09:00"
  timeZone: varchar("time_zone", { length: 50 }).default("UTC"),
  frequency: varchar("frequency", { length: 50 }).default("once"), // once, daily, weekly, monthly
  maxExecutions: integer("max_executions").default(0), // 0 = unlimited
  currentExecutions: integer("current_executions").default(0),
  segmentFilters: jsonb("segment_filters").default({}),
  emailSequence: jsonb("email_sequence").default([]),
  performanceMetrics: jsonb("performance_metrics").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const emailSubscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  status: varchar("status", { length: 50 }).default("active"), // active, unsubscribed, bounced, complained
  sourceUrl: text("source_url"),
  sourceType: varchar("source_type", { length: 50 }), // opt_in, import, api, referral
  vertical: varchar("vertical", { length: 50 }),
  segments: jsonb("segments").default([]),
  tags: jsonb("tags").default([]),
  customFields: jsonb("custom_fields").default({}),
  preferences: jsonb("preferences").default({}),
  engagementScore: real("engagement_score").default(0),
  lastOpenedAt: timestamp("last_opened_at"),
  lastClickedAt: timestamp("last_clicked_at"),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  leadMagnetUsed: text("lead_magnet_used"),
  totalEmailsReceived: integer("total_emails_received").default(0),
  totalEmailsOpened: integer("total_emails_opened").default(0),
  totalLinksClicked: integer("total_links_clicked").default(0),
  lifetimeValue: real("lifetime_value").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// 7. CONVERSION OPTIMIZATION ENGINE
export const conversionFunnels = pgTable("conversion_funnels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  funnelType: varchar("funnel_type", { length: 50 }).notNull(), // sales, lead_gen, signup, onboarding
  steps: jsonb("steps").notNull(),
  goalType: varchar("goal_type", { length: 50 }).notNull(), // revenue, leads, signups, engagement
  goalValue: real("goal_value").default(0),
  isActive: boolean("is_active").default(true),
  trafficSources: jsonb("traffic_sources").default([]),
  targetAudience: jsonb("target_audience").default({}),
  conversionStrategy: text("conversion_strategy"),
  abTestingEnabled: boolean("ab_testing_enabled").default(false),
  currentVariant: varchar("current_variant", { length: 50 }).default("control"),
  variants: jsonb("variants").default([]),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  totalVisitors: integer("total_visitors").default(0),
  conversions: integer("conversions").default(0),
  conversionRate: real("conversion_rate").default(0),
  revenue: real("revenue").default(0),
  averageOrderValue: real("average_order_value").default(0),
  lastOptimizedAt: timestamp("last_optimized_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const conversionExperiments = pgTable("conversion_experiments", {
  id: serial("id").primaryKey(),
  funnelId: integer("funnel_id").references(() => conversionFunnels.id),
  experimentName: text("experiment_name").notNull(),
  experimentType: varchar("experiment_type", { length: 50 }).notNull(), // ab_test, multivariate, split_url
  hypothesis: text("hypothesis").notNull(),
  variable: text("variable").notNull(), // what's being tested
  controlVersion: jsonb("control_version").notNull(),
  variants: jsonb("variants").notNull(),
  trafficSplit: jsonb("traffic_split").default({}),
  status: varchar("status", { length: 50 }).default("draft"), // draft, running, paused, completed
  confidenceLevel: real("confidence_level").default(95),
  statisticalSignificance: real("statistical_significance").default(0),
  minimumSampleSize: integer("minimum_sample_size").default(1000),
  currentSampleSize: integer("current_sample_size").default(0),
  expectedLift: real("expected_lift").default(0),
  actualLift: real("actual_lift").default(0),
  winningVariant: varchar("winning_variant", { length: 50 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  duration: integer("duration").default(14), // days
  results: jsonb("results").default({}),
  conclusion: text("conclusion"),
  implementationStatus: varchar("implementation_status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const conversionEvents = pgTable("conversion_events", {
  id: serial("id").primaryKey(),
  funnelId: integer("funnel_id").references(() => conversionFunnels.id),
  experimentId: integer("experiment_id").references(() => conversionExperiments.id),
  sessionId: text("session_id").notNull(),
  userId: text("user_id"),
  visitorId: text("visitor_id").notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(), // page_view, click, form_submit, conversion
  stepName: text("step_name"),
  variantShown: varchar("variant_shown", { length: 50 }),
  eventValue: real("event_value").default(0),
  revenue: real("revenue").default(0),
  pageUrl: text("page_url").notNull(),
  referrerUrl: text("referrer_url"),
  trafficSource: varchar("traffic_source", { length: 50 }),
  utmCampaign: text("utm_campaign"),
  utmMedium: text("utm_medium"),
  utmSource: text("utm_source"),
  deviceType: varchar("device_type", { length: 50 }),
  browserType: varchar("browser_type", { length: 50 }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: jsonb("location").default({}),
  eventMetadata: jsonb("event_metadata").default({}),
  eventTimestamp: timestamp("event_timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas for all tables
export const insertSeoOptimizationTaskSchema = createInsertSchema(seoOptimizationTasks);
export const insertSeoKeywordResearchSchema = createInsertSchema(seoKeywordResearch);
export const insertSeoSiteAuditsSchema = createInsertSchema(seoSiteAudits);
export const insertContentTemplatesSchema = createInsertSchema(contentTemplates);
export const insertContentGenerationSchema = createInsertSchema(contentGeneration);
export const insertContentPerformanceSchema = createInsertSchema(contentPerformance);
export const insertReferralProgramsSchema = createInsertSchema(referralPrograms);
export const insertReferralLinksSchema = createInsertSchema(referralLinks);
export const insertReferralTransactionsSchema = createInsertSchema(referralTransactions);
export const insertBacklinkOpportunitiesSchema = createInsertSchema(backlinkOpportunities);
export const insertBacklinkOutreachSchema = createInsertSchema(backlinkOutreach);
export const insertBacklinkMonitoringSchema = createInsertSchema(backlinkMonitoring);
export const insertSocialMediaAccountsSchema = createInsertSchema(socialMediaAccounts);
export const insertSocialMediaPostsSchema = createInsertSchema(socialMediaPosts);
export const insertSocialMediaEngagementSchema = createInsertSchema(socialMediaEngagement);
export const insertEmailCampaignsSchema = createInsertSchema(emailCampaigns);
export const insertEmailAutomationsSchema = createInsertSchema(emailAutomations);
export const insertEmailSubscribersSchema = createInsertSchema(emailSubscribers);
export const insertConversionFunnelsSchema = createInsertSchema(conversionFunnels);
export const insertConversionExperimentsSchema = createInsertSchema(conversionExperiments);
export const insertConversionEventsSchema = createInsertSchema(conversionEvents);

// TypeScript types for all tables
export type SeoOptimizationTask = InferSelectModel<typeof seoOptimizationTasks>;
export type SeoKeywordResearch = InferSelectModel<typeof seoKeywordResearch>;
export type SeoSiteAudit = InferSelectModel<typeof seoSiteAudits>;
export type ContentTemplate = InferSelectModel<typeof contentTemplates>;
export type ContentGeneration = InferSelectModel<typeof contentGeneration>;
export type ContentPerformance = InferSelectModel<typeof contentPerformance>;
export type ReferralProgram = InferSelectModel<typeof referralPrograms>;
export type ReferralLink = InferSelectModel<typeof referralLinks>;
export type ReferralTransaction = InferSelectModel<typeof referralTransactions>;
export type BacklinkOpportunity = InferSelectModel<typeof backlinkOpportunities>;
export type BacklinkOutreach = InferSelectModel<typeof backlinkOutreach>;
export type BacklinkMonitoring = InferSelectModel<typeof backlinkMonitoring>;
export type SocialMediaAccount = InferSelectModel<typeof socialMediaAccounts>;
export type SocialMediaPost = InferSelectModel<typeof socialMediaPosts>;
export type SocialMediaEngagement = InferSelectModel<typeof socialMediaEngagement>;
export type EmailCampaign = InferSelectModel<typeof emailCampaigns>;
export type EmailAutomation = InferSelectModel<typeof emailAutomations>;
export type EmailSubscriber = InferSelectModel<typeof emailSubscribers>;
export type ConversionFunnel = InferSelectModel<typeof conversionFunnels>;
export type ConversionExperiment = InferSelectModel<typeof conversionExperiments>;
export type ConversionEvent = InferSelectModel<typeof conversionEvents>;

// ===================================================================
// ADDITIONAL TRAFFIC GENERATION MODULES - BILLION-DOLLAR EMPIRE GRADE
// ===================================================================

// 8. PROGRAMMATIC AI BLOG SWARM ENGINE
export const blogSwarmSites = pgTable("blog_swarm_sites", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull(),
  domain: text("domain").notNull().unique(),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  niche: text("niche").notNull(),
  targetLocation: text("target_location"),
  contentStrategy: jsonb("content_strategy").default({}),
  seoConfig: jsonb("seo_config").default({}),
  status: varchar("status", { length: 50 }).default("active"),
  totalPosts: integer("total_posts").default(0),
  monthlyTraffic: integer("monthly_traffic").default(0),
  backlinks: integer("backlinks").default(0),
  domainAuthority: real("domain_authority").default(0),
  revenue: real("revenue").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

export const blogSwarmPosts = pgTable("blog_swarm_posts", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").references(() => blogSwarmSites.id),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  metaDescription: text("meta_description"),
  focusKeyword: text("focus_keyword"),
  keywords: jsonb("keywords").default([]),
  categories: jsonb("categories").default([]),
  tags: jsonb("tags").default([]),
  internalLinks: jsonb("internal_links").default([]),
  externalLinks: jsonb("external_links").default([]),
  images: jsonb("images").default([]),
  faqSection: jsonb("faq_section").default([]),
  schemaMarkup: jsonb("schema_markup").default({}),
  status: varchar("status", { length: 50 }).default("published"),
  views: integer("views").default(0),
  shares: integer("shares").default(0),
  backlinks: integer("backlinks").default(0),
  conversionRate: real("conversion_rate").default(0),
  revenue: real("revenue").default(0),
  publishedAt: timestamp("published_at").defaultNow(),
  lastOptimized: timestamp("last_optimized"),
  createdAt: timestamp("created_at").defaultNow()
});

export const blogSwarmTrends = pgTable("blog_swarm_trends", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  trendSource: varchar("trend_source", { length: 50 }).notNull(), // google_trends, reddit, twitter, news
  searchVolume: integer("search_volume").default(0),
  competitionLevel: varchar("competition_level", { length: 20 }).default("medium"),
  trendDirection: varchar("trend_direction", { length: 20 }).default("stable"), // rising, falling, stable, spike
  viralPotential: real("viral_potential").default(0),
  contentOpportunities: jsonb("content_opportunities").default([]),
  relatedKeywords: jsonb("related_keywords").default([]),
  isProcessed: boolean("is_processed").default(false),
  lastTracked: timestamp("last_tracked").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// 9. DYNAMIC Q&A/FORUM MODULE
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  parentId: integer("parent_id").references(() => forumCategories.id),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  moderators: jsonb("moderators").default([]),
  postCount: integer("post_count").default(0),
  topicCount: integer("topic_count").default(0),
  lastPostAt: timestamp("last_post_at"),
  seoOptimized: boolean("seo_optimized").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  content: text("content").notNull(),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  isSticky: boolean("is_sticky").default(false),
  isLocked: boolean("is_locked").default(false),
  isPinned: boolean("is_pinned").default(false),
  views: integer("views").default(0),
  replies: integer("replies").default(0),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  helpfulVotes: integer("helpful_votes").default(0),
  tags: jsonb("tags").default([]),
  metaDescription: text("meta_description"),
  seoScore: real("seo_score").default(0),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyBy: text("last_reply_by"),
  isSolved: boolean("is_solved").default(false),
  bestAnswerId: integer("best_answer_id"),
  moderationStatus: varchar("moderation_status", { length: 50 }).default("approved"),
  aiGenerated: boolean("ai_generated").default(false),
  sourcePlatform: varchar("source_platform", { length: 50 }), // reddit, quora, stackoverflow
  originalUrl: text("original_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").references(() => forumTopics.id),
  parentId: integer("parent_id").references(() => forumReplies.id),
  content: text("content").notNull(),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  helpfulVotes: integer("helpful_votes").default(0),
  isAcceptedAnswer: boolean("is_accepted_answer").default(false),
  isFeatured: boolean("is_featured").default(false),
  moderationStatus: varchar("moderation_status", { length: 50 }).default("approved"),
  aiGenerated: boolean("ai_generated").default(false),
  sentiment: varchar("sentiment", { length: 20 }),
  editHistory: jsonb("edit_history").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// 10. AUTOMATED RESOURCE/TOOL DIRECTORY
export const resourceCategories = pgTable("resource_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  parentId: integer("parent_id").references(() => resourceCategories.id),
  icon: text("icon"),
  color: text("color"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  resourceCount: integer("resource_count").default(0),
  seoOptimized: boolean("seo_optimized").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const resourceDirectory = pgTable("resource_directory", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => resourceCategories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  url: text("url").notNull(),
  logoUrl: text("logo_url"),
  screenshots: jsonb("screenshots").default([]),
  resourceType: varchar("resource_type", { length: 50 }).notNull(), // tool, saas, guide, app, book
  pricing: jsonb("pricing").default({}),
  features: jsonb("features").default([]),
  tags: jsonb("tags").default([]),
  affiliateUrl: text("affiliate_url"),
  commissionRate: real("commission_rate").default(0),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  revenue: real("revenue").default(0),
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  submittedBy: text("submitted_by"),
  moderationStatus: varchar("moderation_status", { length: 50 }).default("approved"),
  seoScore: real("seo_score").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const resourceComparisons = pgTable("resource_comparisons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  comparisonType: varchar("comparison_type", { length: 50 }).notNull(), // vs, top_list, roundup
  resources: jsonb("resources").notNull(), // array of resource IDs
  comparisonMatrix: jsonb("comparison_matrix").default({}),
  winner: integer("winner"), // resource_id
  views: integer("views").default(0),
  shares: integer("shares").default(0),
  conversionRate: real("conversion_rate").default(0),
  revenue: real("revenue").default(0),
  isPublished: boolean("is_published").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// 11. VIRAL DATA VISUALIZATION HUB
export const dataVisualizationProjects = pgTable("data_visualization_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  vizType: varchar("viz_type", { length: 50 }).notNull(), // chart, infographic, comparison, stats_page
  dataSources: jsonb("data_sources").default([]),
  chartConfig: jsonb("chart_config").default({}),
  interactiveElements: jsonb("interactive_elements").default([]),
  embedCode: text("embed_code"),
  shareableUrl: text("shareable_url"),
  downloadFormats: jsonb("download_formats").default(["png", "pdf", "svg"]),
  views: integer("views").default(0),
  shares: integer("shares").default(0),
  embeds: integer("embeds").default(0),
  downloads: integer("downloads").default(0),
  viralScore: real("viral_score").default(0),
  isPublished: boolean("is_published").default(true),
  isFeatured: boolean("is_featured").default(false),
  tags: jsonb("tags").default([]),
  lastDataUpdate: timestamp("last_data_update"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const dataVisualizationStats = pgTable("data_visualization_stats", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => dataVisualizationProjects.id),
  platform: varchar("platform", { length: 50 }).notNull(), // twitter, linkedin, pinterest, reddit
  shares: integer("shares").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  clickThroughs: integer("click_throughs").default(0),
  viralityCoefficient: real("virality_coefficient").default(0),
  engagementRate: real("engagement_rate").default(0),
  reachEstimate: integer("reach_estimate").default(0),
  lastTracked: timestamp("last_tracked").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// 12. AI NEWSLETTER/EMAIL MAGNET SYSTEM
export const newsletterEditions = pgTable("newsletter_editions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  editionType: varchar("edition_type", { length: 50 }).notNull(), // daily, weekly, special
  subject: text("subject").notNull(),
  preheader: text("preheader"),
  content: text("content").notNull(),
  contentSummary: text("content_summary"),
  trendingSources: jsonb("trending_sources").default([]),
  aiGeneratedSections: jsonb("ai_generated_sections").default([]),
  embeddedOffers: jsonb("embedded_offers").default([]),
  cta: jsonb("cta").default({}),
  recipientCount: integer("recipient_count").default(0),
  openRate: real("open_rate").default(0),
  clickRate: real("click_rate").default(0),
  unsubscribeRate: real("unsubscribe_rate").default(0),
  conversionRate: real("conversion_rate").default(0),
  revenue: real("revenue").default(0),
  status: varchar("status", { length: 50 }).default("draft"), // draft, scheduled, sent
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  vertical: varchar("vertical", { length: 50 }),
  subscriptionSource: text("subscription_source"),
  leadMagnet: text("lead_magnet"),
  segments: jsonb("segments").default([]),
  preferences: jsonb("preferences").default({}),
  isActive: boolean("is_active").default(true),
  openRate: real("open_rate").default(0),
  clickRate: real("click_rate").default(0),
  engagementScore: real("engagement_score").default(0),
  lastOpenedAt: timestamp("last_opened_at"),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// 13. UGC VIDEO/SHORTS ENGINE
export const ugcVideoSubmissions = pgTable("ugc_video_submissions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  videoType: varchar("video_type", { length: 50 }).notNull(), // review, tip, guide, testimonial
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // seconds
  submitterName: text("submitter_name").notNull(),
  submitterEmail: text("submitter_email").notNull(),
  submitterSocial: jsonb("submitter_social").default({}),
  moderationStatus: varchar("moderation_status", { length: 50 }).default("pending"),
  isApproved: boolean("is_approved").default(false),
  rejectReason: text("reject_reason"),
  tags: jsonb("tags").default([]),
  aiOptimizedTitle: text("ai_optimized_title"),
  aiOptimizedDescription: text("ai_optimized_description"),
  aiGeneratedTags: jsonb("ai_generated_tags").default([]),
  platforms: jsonb("platforms").default([]), // where it will be published
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  conversionRate: real("conversion_rate").default(0),
  viralScore: real("viral_score").default(0),
  contestEntry: boolean("contest_entry").default(false),
  rewardEligible: boolean("reward_eligible").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const ugcVideoContests = pgTable("ugc_video_contests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  contestType: varchar("contest_type", { length: 50 }).notNull(), // best_review, most_creative, viral_challenge
  prize: text("prize").notNull(),
  prizeValue: real("prize_value").default(0),
  guidelines: text("guidelines").notNull(),
  judgementsCriteria: jsonb("judgement_criteria").default([]),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  votingEndDate: timestamp("voting_end_date"),
  maxSubmissions: integer("max_submissions").default(0), // 0 = unlimited
  currentSubmissions: integer("current_submissions").default(0),
  winnerAnnounced: boolean("winner_announced").default(false),
  winnerId: integer("winner_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// 14. GAMIFIED VIRAL CHALLENGE SYSTEM
export const viralChallenges = pgTable("viral_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  challengeType: varchar("challenge_type", { length: 50 }).notNull(), // quiz, checklist, score, photo, video
  rules: text("rules").notNull(),
  instructions: text("instructions").notNull(),
  duration: integer("duration").default(30), // days
  maxParticipants: integer("max_participants").default(0), // 0 = unlimited
  currentParticipants: integer("current_participants").default(0),
  challengeData: jsonb("challenge_data").notNull(), // quiz questions, checklist items, etc.
  scoring: jsonb("scoring").default({}),
  rewards: jsonb("rewards").default([]),
  badges: jsonb("badges").default([]),
  sharingRewards: jsonb("sharing_rewards").default({}),
  inviteRewards: jsonb("invite_rewards").default({}),
  leaderboardVisible: boolean("leaderboard_visible").default(true),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  viralFactor: real("viral_factor").default(0),
  totalShares: integer("total_shares").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const challengeParticipants = pgTable("challenge_participants", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").references(() => viralChallenges.id),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  score: integer("score").default(0),
  progress: jsonb("progress").default({}),
  completionData: jsonb("completion_data").default({}),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  rank: integer("rank"),
  badgesEarned: jsonb("badges_earned").default([]),
  rewardsEarned: jsonb("rewards_earned").default([]),
  sharesCount: integer("shares_count").default(0),
  invitesCount: integer("invites_count").default(0),
  invitedBy: text("invited_by"),
  referralCode: text("referral_code"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// 15. AI-DRIVEN WEB SCRAPER/CONTENT CURATOR
export const contentScrapingSources = pgTable("content_scraping_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sourceType: varchar("source_type", { length: 50 }).notNull(), // news, social, blog, forum
  baseUrl: text("base_url").notNull(),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  scrapingConfig: jsonb("scraping_config").notNull(),
  selectors: jsonb("selectors").default({}),
  apiEndpoint: text("api_endpoint"),
  apiKey: text("api_key"),
  requestHeaders: jsonb("request_headers").default({}),
  scrapingFrequency: varchar("scraping_frequency", { length: 50 }).default("daily"),
  lastScrapedAt: timestamp("last_scraped_at"),
  isActive: boolean("is_active").default(true),
  errorCount: integer("error_count").default(0),
  successRate: real("success_rate").default(0),
  averageContentQuality: real("average_content_quality").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const scrapedContent = pgTable("scraped_content", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").references(() => contentScrapingSources.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  author: text("author"),
  originalUrl: text("original_url").notNull(),
  publishedAt: timestamp("published_at"),
  scrapedAt: timestamp("scraped_at").defaultNow(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // article, tweet, post, comment
  language: varchar("language", { length: 10 }).default("en"),
  sentiment: varchar("sentiment", { length: 20 }),
  keywords: jsonb("keywords").default([]),
  entities: jsonb("entities").default([]),
  qualityScore: real("quality_score").default(0),
  viralPotential: real("viral_potential").default(0),
  isProcessed: boolean("is_processed").default(false),
  isApproved: boolean("is_approved").default(false),
  isPlagiarized: boolean("is_plagiarized").default(false),
  moderationStatus: varchar("moderation_status", { length: 50 }).default("pending"),
  aiEnhanced: boolean("ai_enhanced").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// 16. CONTENT REMIX & SPIN ENGINE
export const contentRemixProjects = pgTable("content_remix_projects", {
  id: serial("id").primaryKey(),
  sourceContentId: text("source_content_id").notNull(),
  sourceContentType: varchar("source_content_type", { length: 50 }).notNull(), // blog, video, tool
  originalTitle: text("original_title").notNull(),
  originalUrl: text("original_url"),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  remixStrategy: varchar("remix_strategy", { length: 50 }).notNull(), // carousel, thread, infographic, video_script
  targetPlatforms: jsonb("target_platforms").default([]),
  remixedContent: jsonb("remixed_content").default({}), // different formats
  generationPrompts: jsonb("generation_prompts").default({}),
  brandingElements: jsonb("branding_elements").default({}),
  affiliateLinks: jsonb("affiliate_links").default([]),
  backlinks: jsonb("backlinks").default([]),
  utmParameters: jsonb("utm_parameters").default({}),
  schedulingConfig: jsonb("scheduling_config").default({}),
  isGenerated: boolean("is_generated").default(false),
  isScheduled: boolean("is_scheduled").default(false),
  generatedAt: timestamp("generated_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const contentRemixDistribution = pgTable("content_remix_distribution", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => contentRemixProjects.id),
  platform: varchar("platform", { length: 50 }).notNull(), // linkedin, twitter, instagram, youtube
  contentFormat: varchar("content_format", { length: 50 }).notNull(), // carousel, thread, video, infographic
  platformContentId: text("platform_content_id"),
  contentUrl: text("content_url"),
  status: varchar("status", { length: 50 }).default("scheduled"), // scheduled, posted, failed
  scheduledFor: timestamp("scheduled_for"),
  postedAt: timestamp("posted_at"),
  engagement: jsonb("engagement").default({}),
  reach: integer("reach").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  revenue: real("revenue").default(0),
  backlinksGenerated: integer("backlinks_generated").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

// 17. API PUBLIC PORTAL / OPEN WIDGETS
export const publicApiEndpoints = pgTable("public_api_endpoints", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  endpoint: text("endpoint").notNull().unique(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // seo, content, comparison, stats
  method: varchar("method", { length: 10 }).notNull().default("GET"),
  parameters: jsonb("parameters").default([]),
  responseSchema: jsonb("response_schema").default({}),
  examples: jsonb("examples").default([]),
  rateLimit: jsonb("rate_limit").default({}),
  requiresAuth: boolean("requires_auth").default(false),
  pricingTier: varchar("pricing_tier", { length: 50 }).default("free"), // free, premium, enterprise
  isActive: boolean("is_active").default(true),
  totalCalls: integer("total_calls").default(0),
  monthlyCallLimit: integer("monthly_call_limit").default(1000),
  documentation: text("documentation"),
  createdAt: timestamp("created_at").defaultNow()
});

export const publicApiKeys = pgTable("public_api_keys", {
  id: serial("id").primaryKey(),
  keyHash: text("key_hash").notNull().unique(),
  keyPrefix: text("key_prefix").notNull(),
  userId: text("user_id"),
  userEmail: text("user_email"),
  keyName: text("key_name"),
  allowedEndpoints: jsonb("allowed_endpoints").default([]),
  callsThisMonth: integer("calls_this_month").default(0),
  totalCalls: integer("total_calls").default(0),
  lastUsedAt: timestamp("last_used_at"),
  monthlyLimit: integer("monthly_limit").default(1000),
  isActive: boolean("is_active").default(true),
  rateLimitTier: varchar("rate_limit_tier", { length: 50 }).default("basic"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at")
});

export const publicWidgets = pgTable("public_widgets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  widgetType: varchar("widget_type", { length: 50 }).notNull(), // comparison, stats, calculator, tool
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  embedCode: text("embed_code").notNull(),
  configOptions: jsonb("config_options").default({}),
  brandingRequired: boolean("branding_required").default(true),
  affiliateTracking: boolean("affiliate_tracking").default(true),
  isActive: boolean("is_active").default(true),
  embedCount: integer("embed_count").default(0),
  totalViews: integer("total_views").default(0),
  conversions: integer("conversions").default(0),
  revenue: real("revenue").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const widgetEmbeds = pgTable("widget_embeds", {
  id: serial("id").primaryKey(),
  widgetId: integer("widget_id").references(() => publicWidgets.id),
  embedDomain: text("embed_domain").notNull(),
  embedUrl: text("embed_url").notNull(),
  embedConfig: jsonb("embed_config").default({}),
  firstSeenAt: timestamp("first_seen_at").defaultNow(),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  viewCount: integer("view_count").default(0),
  clickCount: integer("click_count").default(0),
  conversionCount: integer("conversion_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas for all new tables
export const insertBlogSwarmSitesSchema = createInsertSchema(blogSwarmSites);
export const insertBlogSwarmPostsSchema = createInsertSchema(blogSwarmPosts);
export const insertBlogSwarmTrendsSchema = createInsertSchema(blogSwarmTrends);
export const insertForumCategoriesSchema = createInsertSchema(forumCategories);
export const insertForumTopicsSchema = createInsertSchema(forumTopics);
export const insertForumRepliesSchema = createInsertSchema(forumReplies);
export const insertResourceCategoriesSchema = createInsertSchema(resourceCategories);
export const insertResourceDirectorySchema = createInsertSchema(resourceDirectory);
export const insertResourceComparisonsSchema = createInsertSchema(resourceComparisons);
export const insertDataVisualizationProjectsSchema = createInsertSchema(dataVisualizationProjects);
export const insertDataVisualizationStatsSchema = createInsertSchema(dataVisualizationStats);
export const insertNewsletterEditionsSchema = createInsertSchema(newsletterEditions);
export const insertNewsletterSubscribersSchema = createInsertSchema(newsletterSubscribers);
export const insertUgcVideoSubmissionsSchema = createInsertSchema(ugcVideoSubmissions);
export const insertUgcVideoContestsSchema = createInsertSchema(ugcVideoContests);
export const insertViralChallengesSchema = createInsertSchema(viralChallenges);
export const insertChallengeParticipantsSchema = createInsertSchema(challengeParticipants);
export const insertContentScrapingSourcesSchema = createInsertSchema(contentScrapingSources);
export const insertScrapedContentSchema = createInsertSchema(scrapedContent);
export const insertContentRemixProjectsSchema = createInsertSchema(contentRemixProjects);
export const insertContentRemixDistributionSchema = createInsertSchema(contentRemixDistribution);
export const insertPublicApiEndpointsSchema = createInsertSchema(publicApiEndpoints);
export const insertPublicApiKeysSchema = createInsertSchema(publicApiKeys);
export const insertPublicWidgetsSchema = createInsertSchema(publicWidgets);
export const insertWidgetEmbedsSchema = createInsertSchema(widgetEmbeds);

// TypeScript types for all new tables
export type BlogSwarmSite = InferSelectModel<typeof blogSwarmSites>;
export type BlogSwarmPost = InferSelectModel<typeof blogSwarmPosts>;
export type BlogSwarmTrend = InferSelectModel<typeof blogSwarmTrends>;
export type ForumCategory = InferSelectModel<typeof forumCategories>;
export type ForumTopic = InferSelectModel<typeof forumTopics>;
export type ForumReply = InferSelectModel<typeof forumReplies>;
export type ResourceCategory = InferSelectModel<typeof resourceCategories>;
export type ResourceDirectory = InferSelectModel<typeof resourceDirectory>;
export type ResourceComparison = InferSelectModel<typeof resourceComparisons>;
export type DataVisualizationProject = InferSelectModel<typeof dataVisualizationProjects>;
export type DataVisualizationStats = InferSelectModel<typeof dataVisualizationStats>;
export type NewsletterEdition = InferSelectModel<typeof newsletterEditions>;
export type NewsletterSubscriber = InferSelectModel<typeof newsletterSubscribers>;
export type UgcVideoSubmission = InferSelectModel<typeof ugcVideoSubmissions>;
export type UgcVideoContest = InferSelectModel<typeof ugcVideoContests>;
export type ViralChallenge = InferSelectModel<typeof viralChallenges>;
export type ChallengeParticipant = InferSelectModel<typeof challengeParticipants>;
export type ContentScrapingSource = InferSelectModel<typeof contentScrapingSources>;
export type ScrapedContent = InferSelectModel<typeof scrapedContent>;
export type ContentRemixProject = InferSelectModel<typeof contentRemixProjects>;
export type ContentRemixDistribution = InferSelectModel<typeof contentRemixDistribution>;
export type PublicApiEndpoint = InferSelectModel<typeof publicApiEndpoints>;
export type PublicApiKey = InferSelectModel<typeof publicApiKeys>;
export type PublicWidget = InferSelectModel<typeof publicWidgets>;
export type WidgetEmbed = InferSelectModel<typeof widgetEmbeds>;

// DTOs
const seoOptimizationTaskDTOKeys = ["id", "title", "status", "priority", "createdAt", "updatedAt"] as const;

export interface SeoOptimizationTaskDTO
  extends Pick<SeoOptimizationTask, (typeof seoOptimizationTaskDTOKeys)[number]> {}

export const toSeoOptimizationTaskDTO = (seoOptimizationTask: SeoOptimizationTask): SeoOptimizationTaskDTO =>
  pickDTOFields(seoOptimizationTask, seoOptimizationTaskDTOKeys);


const seoKeywordResearchDTOKeys = ["id", "vertical", "priority", "createdAt"] as const;

export interface SeoKeywordResearchDTO
  extends Pick<SeoKeywordResearch, (typeof seoKeywordResearchDTOKeys)[number]> {}

export const toSeoKeywordResearchDTO = (seoKeywordResearch: SeoKeywordResearch): SeoKeywordResearchDTO =>
  pickDTOFields(seoKeywordResearch, seoKeywordResearchDTOKeys);


const seoSiteAuditDTOKeys = ["id", "createdAt", "domain"] as const;

export interface SeoSiteAuditDTO
  extends Pick<SeoSiteAudit, (typeof seoSiteAuditDTOKeys)[number]> {}

export const toSeoSiteAuditDTO = (seoSiteAudit: SeoSiteAudit): SeoSiteAuditDTO =>
  pickDTOFields(seoSiteAudit, seoSiteAuditDTOKeys);


const contentTemplateDTOKeys = ["id", "name", "vertical", "createdAt", "updatedAt"] as const;

export interface ContentTemplateDTO
  extends Pick<ContentTemplate, (typeof contentTemplateDTOKeys)[number]> {}

export const toContentTemplateDTO = (contentTemplate: ContentTemplate): ContentTemplateDTO =>
  pickDTOFields(contentTemplate, contentTemplateDTOKeys);


const contentGenerationDTOKeys = ["id", "title", "status", "vertical", "createdAt", "updatedAt"] as const;

export interface ContentGenerationDTO
  extends Pick<ContentGeneration, (typeof contentGenerationDTOKeys)[number]> {}

export const toContentGenerationDTO = (contentGeneration: ContentGeneration): ContentGenerationDTO =>
  pickDTOFields(contentGeneration, contentGenerationDTOKeys);


const contentPerformanceDTOKeys = ["id", "createdAt", "contentId"] as const;

export interface ContentPerformanceDTO
  extends Pick<ContentPerformance, (typeof contentPerformanceDTOKeys)[number]> {}

export const toContentPerformanceDTO = (contentPerformance: ContentPerformance): ContentPerformanceDTO =>
  pickDTOFields(contentPerformance, contentPerformanceDTOKeys);


const referralProgramDTOKeys = ["id", "name", "vertical", "createdAt", "updatedAt", "description"] as const;

export interface ReferralProgramDTO
  extends Pick<ReferralProgram, (typeof referralProgramDTOKeys)[number]> {}

export const toReferralProgramDTO = (referralProgram: ReferralProgram): ReferralProgramDTO =>
  pickDTOFields(referralProgram, referralProgramDTOKeys);


const referralLinkDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface ReferralLinkDTO
  extends Pick<ReferralLink, (typeof referralLinkDTOKeys)[number]> {}

export const toReferralLinkDTO = (referralLink: ReferralLink): ReferralLinkDTO =>
  pickDTOFields(referralLink, referralLinkDTOKeys);


const referralTransactionDTOKeys = ["id", "status", "createdAt"] as const;

export interface ReferralTransactionDTO
  extends Pick<ReferralTransaction, (typeof referralTransactionDTOKeys)[number]> {}

export const toReferralTransactionDTO = (referralTransaction: ReferralTransaction): ReferralTransactionDTO =>
  pickDTOFields(referralTransaction, referralTransactionDTOKeys);


const backlinkOpportunityDTOKeys = ["id", "vertical", "priority", "createdAt", "updatedAt"] as const;

export interface BacklinkOpportunityDTO
  extends Pick<BacklinkOpportunity, (typeof backlinkOpportunityDTOKeys)[number]> {}

export const toBacklinkOpportunityDTO = (backlinkOpportunity: BacklinkOpportunity): BacklinkOpportunityDTO =>
  pickDTOFields(backlinkOpportunity, backlinkOpportunityDTOKeys);


const backlinkOutreachDTOKeys = ["id", "createdAt", "opportunityId"] as const;

export interface BacklinkOutreachDTO
  extends Pick<BacklinkOutreach, (typeof backlinkOutreachDTOKeys)[number]> {}

export const toBacklinkOutreachDTO = (backlinkOutreach: BacklinkOutreach): BacklinkOutreachDTO =>
  pickDTOFields(backlinkOutreach, backlinkOutreachDTOKeys);


const backlinkMonitoringDTOKeys = ["id", "createdAt", "sourceUrl"] as const;

export interface BacklinkMonitoringDTO
  extends Pick<BacklinkMonitoring, (typeof backlinkMonitoringDTOKeys)[number]> {}

export const toBacklinkMonitoringDTO = (backlinkMonitoring: BacklinkMonitoring): BacklinkMonitoringDTO =>
  pickDTOFields(backlinkMonitoring, backlinkMonitoringDTOKeys);


const socialMediaAccountDTOKeys = ["id", "vertical", "createdAt", "updatedAt"] as const;

export interface SocialMediaAccountDTO
  extends Pick<SocialMediaAccount, (typeof socialMediaAccountDTOKeys)[number]> {}

export const toSocialMediaAccountDTO = (socialMediaAccount: SocialMediaAccount): SocialMediaAccountDTO =>
  pickDTOFields(socialMediaAccount, socialMediaAccountDTOKeys);


const socialMediaPostDTOKeys = ["id", "status", "createdAt", "updatedAt"] as const;

export interface SocialMediaPostDTO
  extends Pick<SocialMediaPost, (typeof socialMediaPostDTOKeys)[number]> {}

export const toSocialMediaPostDTO = (socialMediaPost: SocialMediaPost): SocialMediaPostDTO =>
  pickDTOFields(socialMediaPost, socialMediaPostDTOKeys);


const socialMediaEngagementDTOKeys = ["id", "userId", "createdAt"] as const;

export interface SocialMediaEngagementDTO
  extends Pick<SocialMediaEngagement, (typeof socialMediaEngagementDTOKeys)[number]> {}

export const toSocialMediaEngagementDTO = (socialMediaEngagement: SocialMediaEngagement): SocialMediaEngagementDTO =>
  pickDTOFields(socialMediaEngagement, socialMediaEngagementDTOKeys);


const emailCampaignDTOKeys = ["id", "name", "status", "vertical", "createdAt", "updatedAt"] as const;

export interface EmailCampaignDTO
  extends Pick<EmailCampaign, (typeof emailCampaignDTOKeys)[number]> {}

export const toEmailCampaignDTO = (emailCampaign: EmailCampaign): EmailCampaignDTO =>
  pickDTOFields(emailCampaign, emailCampaignDTOKeys);


const emailAutomationDTOKeys = ["id", "name", "vertical", "createdAt", "updatedAt"] as const;

export interface EmailAutomationDTO
  extends Pick<EmailAutomation, (typeof emailAutomationDTOKeys)[number]> {}

export const toEmailAutomationDTO = (emailAutomation: EmailAutomation): EmailAutomationDTO =>
  pickDTOFields(emailAutomation, emailAutomationDTOKeys);


const emailSubscriberDTOKeys = ["id", "status", "vertical", "createdAt", "updatedAt", "email"] as const;

export interface EmailSubscriberDTO
  extends Pick<EmailSubscriber, (typeof emailSubscriberDTOKeys)[number]> {}

export const toEmailSubscriberDTO = (emailSubscriber: EmailSubscriber): EmailSubscriberDTO =>
  pickDTOFields(emailSubscriber, emailSubscriberDTOKeys);


const conversionFunnelDTOKeys = ["id", "name", "vertical", "createdAt", "updatedAt"] as const;

export interface ConversionFunnelDTO
  extends Pick<ConversionFunnel, (typeof conversionFunnelDTOKeys)[number]> {}

export const toConversionFunnelDTO = (conversionFunnel: ConversionFunnel): ConversionFunnelDTO =>
  pickDTOFields(conversionFunnel, conversionFunnelDTOKeys);


const conversionExperimentDTOKeys = ["id", "status", "createdAt", "updatedAt", "funnelId"] as const;

export interface ConversionExperimentDTO
  extends Pick<ConversionExperiment, (typeof conversionExperimentDTOKeys)[number]> {}

export const toConversionExperimentDTO = (conversionExperiment: ConversionExperiment): ConversionExperimentDTO =>
  pickDTOFields(conversionExperiment, conversionExperimentDTOKeys);


const conversionEventDTOKeys = ["id", "sessionId", "userId", "createdAt", "eventType", "funnelId"] as const;

export interface ConversionEventDTO
  extends Pick<ConversionEvent, (typeof conversionEventDTOKeys)[number]> {}

export const toConversionEventDTO = (conversionEvent: ConversionEvent): ConversionEventDTO =>
  pickDTOFields(conversionEvent, conversionEventDTOKeys);


const blogSwarmSiteDTOKeys = ["id", "status", "vertical", "createdAt"] as const;

export interface BlogSwarmSiteDTO
  extends Pick<BlogSwarmSite, (typeof blogSwarmSiteDTOKeys)[number]> {}

export const toBlogSwarmSiteDTO = (blogSwarmSite: BlogSwarmSite): BlogSwarmSiteDTO =>
  pickDTOFields(blogSwarmSite, blogSwarmSiteDTOKeys);


const blogSwarmPostDTOKeys = ["id", "title", "slug", "status", "createdAt"] as const;

export interface BlogSwarmPostDTO
  extends Pick<BlogSwarmPost, (typeof blogSwarmPostDTOKeys)[number]> {}

export const toBlogSwarmPostDTO = (blogSwarmPost: BlogSwarmPost): BlogSwarmPostDTO =>
  pickDTOFields(blogSwarmPost, blogSwarmPostDTOKeys);


const blogSwarmTrendDTOKeys = ["id", "vertical", "createdAt"] as const;

export interface BlogSwarmTrendDTO
  extends Pick<BlogSwarmTrend, (typeof blogSwarmTrendDTOKeys)[number]> {}

export const toBlogSwarmTrendDTO = (blogSwarmTrend: BlogSwarmTrend): BlogSwarmTrendDTO =>
  pickDTOFields(blogSwarmTrend, blogSwarmTrendDTOKeys);


const forumCategoryDTOKeys = ["id", "name", "slug", "vertical", "createdAt", "description"] as const;

export interface ForumCategoryDTO
  extends Pick<ForumCategory, (typeof forumCategoryDTOKeys)[number]> {}

export const toForumCategoryDTO = (forumCategory: ForumCategory): ForumCategoryDTO =>
  pickDTOFields(forumCategory, forumCategoryDTOKeys);


const forumTopicDTOKeys = ["id", "title", "slug", "createdAt", "updatedAt"] as const;

export interface ForumTopicDTO
  extends Pick<ForumTopic, (typeof forumTopicDTOKeys)[number]> {}

export const toForumTopicDTO = (forumTopic: ForumTopic): ForumTopicDTO =>
  pickDTOFields(forumTopic, forumTopicDTOKeys);


const forumReplyDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface ForumReplyDTO
  extends Pick<ForumReply, (typeof forumReplyDTOKeys)[number]> {}

export const toForumReplyDTO = (forumReply: ForumReply): ForumReplyDTO =>
  pickDTOFields(forumReply, forumReplyDTOKeys);


const resourceCategoryDTOKeys = ["id", "name", "slug", "vertical", "createdAt", "description"] as const;

export interface ResourceCategoryDTO
  extends Pick<ResourceCategory, (typeof resourceCategoryDTOKeys)[number]> {}

export const toResourceCategoryDTO = (resourceCategory: ResourceCategory): ResourceCategoryDTO =>
  pickDTOFields(resourceCategory, resourceCategoryDTOKeys);


const resourceDirectoryDTOKeys = ["id", "name", "slug", "createdAt", "description"] as const;

export interface ResourceDirectoryDTO
  extends Pick<ResourceDirectory, (typeof resourceDirectoryDTOKeys)[number]> {}

export const toResourceDirectoryDTO = (resourceDirectory: ResourceDirectory): ResourceDirectoryDTO =>
  pickDTOFields(resourceDirectory, resourceDirectoryDTOKeys);


const resourceComparisonDTOKeys = ["id", "title", "slug", "vertical", "createdAt", "description"] as const;

export interface ResourceComparisonDTO
  extends Pick<ResourceComparison, (typeof resourceComparisonDTOKeys)[number]> {}

export const toResourceComparisonDTO = (resourceComparison: ResourceComparison): ResourceComparisonDTO =>
  pickDTOFields(resourceComparison, resourceComparisonDTOKeys);


const dataVisualizationProjectDTOKeys = ["id", "title", "slug", "vertical", "createdAt", "updatedAt", "description"] as const;

export interface DataVisualizationProjectDTO
  extends Pick<DataVisualizationProject, (typeof dataVisualizationProjectDTOKeys)[number]> {}

export const toDataVisualizationProjectDTO = (dataVisualizationProject: DataVisualizationProject): DataVisualizationProjectDTO =>
  pickDTOFields(dataVisualizationProject, dataVisualizationProjectDTOKeys);


const dataVisualizationStatsDTOKeys = ["id", "createdAt", "projectId"] as const;

export interface DataVisualizationStatsDTO
  extends Pick<DataVisualizationStats, (typeof dataVisualizationStatsDTOKeys)[number]> {}

export const toDataVisualizationStatsDTO = (dataVisualizationStats: DataVisualizationStats): DataVisualizationStatsDTO =>
  pickDTOFields(dataVisualizationStats, dataVisualizationStatsDTOKeys);


const newsletterEditionDTOKeys = ["id", "title", "status", "vertical", "createdAt"] as const;

export interface NewsletterEditionDTO
  extends Pick<NewsletterEdition, (typeof newsletterEditionDTOKeys)[number]> {}

export const toNewsletterEditionDTO = (newsletterEdition: NewsletterEdition): NewsletterEditionDTO =>
  pickDTOFields(newsletterEdition, newsletterEditionDTOKeys);


const newsletterSubscriberDTOKeys = ["id", "vertical", "createdAt", "email"] as const;

export interface NewsletterSubscriberDTO
  extends Pick<NewsletterSubscriber, (typeof newsletterSubscriberDTOKeys)[number]> {}

export const toNewsletterSubscriberDTO = (newsletterSubscriber: NewsletterSubscriber): NewsletterSubscriberDTO =>
  pickDTOFields(newsletterSubscriber, newsletterSubscriberDTOKeys);


const ugcVideoSubmissionDTOKeys = ["id", "title", "vertical", "createdAt", "description"] as const;

export interface UgcVideoSubmissionDTO
  extends Pick<UgcVideoSubmission, (typeof ugcVideoSubmissionDTOKeys)[number]> {}

export const toUgcVideoSubmissionDTO = (ugcVideoSubmission: UgcVideoSubmission): UgcVideoSubmissionDTO =>
  pickDTOFields(ugcVideoSubmission, ugcVideoSubmissionDTOKeys);


const ugcVideoContestDTOKeys = ["id", "title", "vertical", "createdAt", "description"] as const;

export interface UgcVideoContestDTO
  extends Pick<UgcVideoContest, (typeof ugcVideoContestDTOKeys)[number]> {}

export const toUgcVideoContestDTO = (ugcVideoContest: UgcVideoContest): UgcVideoContestDTO =>
  pickDTOFields(ugcVideoContest, ugcVideoContestDTOKeys);


const viralChallengeDTOKeys = ["id", "title", "vertical", "createdAt", "description"] as const;

export interface ViralChallengeDTO
  extends Pick<ViralChallenge, (typeof viralChallengeDTOKeys)[number]> {}

export const toViralChallengeDTO = (viralChallenge: ViralChallenge): ViralChallengeDTO =>
  pickDTOFields(viralChallenge, viralChallengeDTOKeys);


const challengeParticipantDTOKeys = ["id", "userId", "createdAt", "updatedAt"] as const;

export interface ChallengeParticipantDTO
  extends Pick<ChallengeParticipant, (typeof challengeParticipantDTOKeys)[number]> {}

export const toChallengeParticipantDTO = (challengeParticipant: ChallengeParticipant): ChallengeParticipantDTO =>
  pickDTOFields(challengeParticipant, challengeParticipantDTOKeys);


const contentScrapingSourceDTOKeys = ["id", "name", "vertical", "createdAt"] as const;

export interface ContentScrapingSourceDTO
  extends Pick<ContentScrapingSource, (typeof contentScrapingSourceDTOKeys)[number]> {}

export const toContentScrapingSourceDTO = (contentScrapingSource: ContentScrapingSource): ContentScrapingSourceDTO =>
  pickDTOFields(contentScrapingSource, contentScrapingSourceDTOKeys);


const scrapedContentDTOKeys = ["id", "title", "language", "createdAt", "summary"] as const;

export interface ScrapedContentDTO
  extends Pick<ScrapedContent, (typeof scrapedContentDTOKeys)[number]> {}

export const toScrapedContentDTO = (scrapedContent: ScrapedContent): ScrapedContentDTO =>
  pickDTOFields(scrapedContent, scrapedContentDTOKeys);


const contentRemixProjectDTOKeys = ["id", "vertical", "createdAt"] as const;

export interface ContentRemixProjectDTO
  extends Pick<ContentRemixProject, (typeof contentRemixProjectDTOKeys)[number]> {}

export const toContentRemixProjectDTO = (contentRemixProject: ContentRemixProject): ContentRemixProjectDTO =>
  pickDTOFields(contentRemixProject, contentRemixProjectDTOKeys);


const contentRemixDistributionDTOKeys = ["id", "status", "createdAt"] as const;

export interface ContentRemixDistributionDTO
  extends Pick<ContentRemixDistribution, (typeof contentRemixDistributionDTOKeys)[number]> {}

export const toContentRemixDistributionDTO = (contentRemixDistribution: ContentRemixDistribution): ContentRemixDistributionDTO =>
  pickDTOFields(contentRemixDistribution, contentRemixDistributionDTOKeys);


const publicApiEndpointDTOKeys = ["id", "name", "category", "createdAt", "description"] as const;

export interface PublicApiEndpointDTO
  extends Pick<PublicApiEndpoint, (typeof publicApiEndpointDTOKeys)[number]> {}

export const toPublicApiEndpointDTO = (publicApiEndpoint: PublicApiEndpoint): PublicApiEndpointDTO =>
  pickDTOFields(publicApiEndpoint, publicApiEndpointDTOKeys);


const publicApiKeyDTOKeys = ["id", "userId", "createdAt"] as const;

export interface PublicApiKeyDTO
  extends Pick<PublicApiKey, (typeof publicApiKeyDTOKeys)[number]> {}

export const toPublicApiKeyDTO = (publicApiKey: PublicApiKey): PublicApiKeyDTO =>
  pickDTOFields(publicApiKey, publicApiKeyDTOKeys);


const publicWidgetDTOKeys = ["id", "name", "category", "createdAt", "description"] as const;

export interface PublicWidgetDTO
  extends Pick<PublicWidget, (typeof publicWidgetDTOKeys)[number]> {}

export const toPublicWidgetDTO = (publicWidget: PublicWidget): PublicWidgetDTO =>
  pickDTOFields(publicWidget, publicWidgetDTOKeys);


const widgetEmbedDTOKeys = ["id", "createdAt", "widgetId"] as const;

export interface WidgetEmbedDTO
  extends Pick<WidgetEmbed, (typeof widgetEmbedDTOKeys)[number]> {}

export const toWidgetEmbedDTO = (widgetEmbed: WidgetEmbed): WidgetEmbedDTO =>
  pickDTOFields(widgetEmbed, widgetEmbedDTOKeys);

