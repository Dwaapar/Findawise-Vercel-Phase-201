import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pickDTOFields } from "./dtoHelpers";
/**
 * Empire Brain "Throne Protocol" Database Tables
 * Billion-Dollar Empire Grade, Migration-Proof, Auto-Healing Schema
 * 
 * Comprehensive database schema for unified intelligence layer with
 * LLM routing, RLHF, vector memory, and autonomous system evolution.
 */

import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, real, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Empire Intelligence Core
export const empireIntelligence = pgTable("empire_intelligence", {
  id: uuid("id").primaryKey().defaultRandom(),
  analysisType: varchar("analysis_type", { length: 50 }).notNull(), // system_performance, user_behavior, market_analysis
  analysisData: jsonb("analysis_data").notNull(),
  insights: jsonb("insights").default([]),
  recommendations: jsonb("recommendations").default([]),
  confidence: real("confidence").notNull(), // 0-1
  actionable: boolean("actionable").default(false),
  priority: integer("priority").default(5), // 1-10
  processedBy: varchar("processed_by", { length: 50 }), // llm provider used
  processingTime: integer("processing_time"), // ms
  tokensUsed: integer("tokens_used"),
  status: varchar("status", { length: 30 }).default("pending"), // pending, processing, completed, failed
  implementationPlan: jsonb("implementation_plan").default([]),
  expectedOutcome: jsonb("expected_outcome").default({}),
  actualOutcome: jsonb("actual_outcome"),
  successMetrics: jsonb("success_metrics").default({}),
  validatedAt: timestamp("validated_at"),
  expiresAt: timestamp("expires_at"),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// LLM Provider Management
export const llmProviders = pgTable("llm_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerName: varchar("provider_name", { length: 50 }).notNull().unique(),
  modelName: varchar("model_name", { length: 100 }).notNull(),
  apiEndpoint: text("api_endpoint"),
  capabilities: text("capabilities").array(), // reasoning, creativity, analysis, coding
  specialties: text("specialties").array(), // specific use cases
  quotaLimit: integer("quota_limit"), // tokens per day
  currentUsage: integer("current_usage").default(0),
  resetAt: timestamp("reset_at"),
  costPerToken: real("cost_per_token"),
  avgLatency: integer("avg_latency"), // ms
  reliabilityScore: real("reliability_score"), // 0-100
  priority: integer("priority").default(5), // 1-10 routing priority
  isActive: boolean("is_active").default(true),
  healthStatus: varchar("health_status", { length: 20 }).default("healthy"), // healthy, degraded, unhealthy
  lastHealthCheck: timestamp("last_health_check"),
  failureCount: integer("failure_count").default(0),
  successCount: integer("success_count").default(0),
  configSettings: jsonb("config_settings").default({}),
  rateLimit: integer("rate_limit"), // requests per minute
  currentRateUsage: integer("current_rate_usage").default(0),
  rateLimitResetAt: timestamp("rate_limit_reset_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Intelligence Routing System
export const intelligenceRoutes = pgTable("intelligence_routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  routeName: varchar("route_name", { length: 100 }).notNull(),
  requestType: varchar("request_type", { length: 50 }).notNull(), // analysis, generation, reasoning, decision
  requiredCapabilities: text("required_capabilities").array(),
  preferredProviders: text("preferred_providers").array(),
  fallbackProviders: text("fallback_providers").array(),
  routingRules: jsonb("routing_rules").notNull(),
  loadBalancing: varchar("load_balancing", { length: 20 }).default("priority"), // priority, round_robin, least_loaded
  timeoutMs: integer("timeout_ms").default(30000),
  retryAttempts: integer("retry_attempts").default(3),
  retryDelay: integer("retry_delay").default(1000), // ms
  cacheEnabled: boolean("cache_enabled").default(true),
  cacheTtl: integer("cache_ttl").default(3600), // seconds
  rateLimitEnabled: boolean("rate_limit_enabled").default(true),
  successCount: integer("success_count").default(0),
  failureCount: integer("failure_count").default(0),
  avgResponseTime: integer("avg_response_time"), // ms
  lastUsed: timestamp("last_used"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Autonomic Decision Engine
export const autonomicDecisions = pgTable("autonomic_decisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  decisionId: varchar("decision_id", { length: 50 }).notNull().unique(),
  decisionType: varchar("decision_type", { length: 50 }).notNull(), // optimization, mutation, scaling, healing
  contextData: jsonb("context_data").notNull(),
  decisionRules: jsonb("decision_rules").notNull(),
  systemState: jsonb("system_state").notNull(),
  decision: text("decision").notNull(),
  confidence: real("confidence").notNull(), // 0-1
  reasoning: text("reasoning").array(),
  alternatives: text("alternatives").array(),
  expectedOutcome: jsonb("expected_outcome").notNull(),
  actualOutcome: jsonb("actual_outcome"),
  riskAssessment: real("risk_assessment"), // 0-1
  implementationPlan: text("implementation_plan").array(),
  rollbackPlan: jsonb("rollback_plan").default({}),
  implementationStatus: varchar("implementation_status", { length: 30 }).default("pending"), // pending, executing, completed, failed, rolled_back
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  validatedAt: timestamp("validated_at"),
  performanceImpact: real("performance_impact"), // % improvement/degradation
  userFeedback: varchar("user_feedback", { length: 20 }), // positive, negative, neutral
  feedbackDetails: jsonb("feedback_details").default({}),
  learnedPatterns: jsonb("learned_patterns").default({}),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// System Mutations Engine
export const systemMutations = pgTable("system_mutations", {
  id: uuid("id").primaryKey().defaultRandom(),
  mutationId: varchar("mutation_id", { length: 50 }).notNull().unique(),
  mutationType: varchar("mutation_type", { length: 50 }).notNull(), // layout, content, flow, offer, cta, persona
  targetSystem: varchar("target_system", { length: 100 }).notNull(),
  targetComponent: varchar("target_component", { length: 100 }),
  originalState: jsonb("original_state").notNull(),
  mutatedState: jsonb("mutated_state").notNull(),
  mutationReason: text("mutation_reason").notNull(),
  expectedImpact: jsonb("expected_impact").notNull(),
  actualImpact: jsonb("actual_impact"),
  rollbackPlan: jsonb("rollback_plan").notNull(),
  testingStrategy: text("testing_strategy").array(),
  validationCriteria: jsonb("validation_criteria").default({}),
  mutationStatus: varchar("mutation_status", { length: 30 }).default("pending"), // pending, executing, successful, failed, rolled_back
  confidence: real("confidence"), // 0-1
  riskLevel: varchar("risk_level", { length: 20 }).default("medium"), // low, medium, high, critical
  approvalRequired: boolean("approval_required").default(false),
  approvedBy: varchar("approved_by", { length: 100 }),
  approvedAt: timestamp("approved_at"),
  executedAt: timestamp("executed_at"),
  completedAt: timestamp("completed_at"),
  rolledBackAt: timestamp("rolled_back_at"),
  performanceImpact: real("performance_impact"), // % change
  userImpact: real("user_impact"), // % change in user metrics
  businessImpact: real("business_impact"), // % change in business metrics
  failureReason: text("failure_reason"),
  learnedInsights: jsonb("learned_insights").default({}),
  relatedMutations: text("related_mutations").array(),
  isReversible: boolean("is_reversible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// RLHF Feedback System
export const rlhfFeedback = pgTable("rlhf_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  feedbackId: varchar("feedback_id", { length: 50 }).notNull().unique(),
  sessionId: varchar("session_id", { length: 100 }),
  userId: varchar("user_id", { length: 100 }),
  actionTaken: text("action_taken").notNull(),
  actionContext: jsonb("action_context").notNull(),
  actionOutcome: jsonb("action_outcome").notNull(),
  userFeedback: varchar("user_feedback", { length: 20 }).notNull(), // positive, negative, neutral
  feedbackType: varchar("feedback_type", { length: 30 }).default("explicit"), // explicit, implicit, inferred
  feedbackDetails: jsonb("feedback_details").default({}),
  feedbackWeight: real("feedback_weight").notNull(), // 0-1
  confidence: real("confidence"), // 0-1
  contextData: jsonb("context_data").notNull(),
  environmentData: jsonb("environment_data").default({}),
  timeToFeedback: integer("time_to_feedback"), // ms from action to feedback
  feedbackQuality: real("feedback_quality"), // 0-1
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at"),
  learningApplied: boolean("learning_applied").default(false),
  appliedAt: timestamp("applied_at"),
  behaviorChanges: jsonb("behavior_changes").default({}),
  relatedFeedback: text("related_feedback").array(),
  feedbackTrend: varchar("feedback_trend", { length: 20 }), // improving, stable, declining
  impactMeasured: boolean("impact_measured").default(false),
  impactResults: jsonb("impact_results").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Empire Vector Memory System
export const empireVectorMemory = pgTable("empire_vector_memory", {
  id: uuid("id").primaryKey().defaultRandom(),
  memoryId: varchar("memory_id", { length: 50 }).notNull().unique(),
  memoryType: varchar("memory_type", { length: 50 }).notNull(), // experience, pattern, insight, decision
  memoryContent: text("memory_content").notNull(),
  vectorEmbedding: jsonb("vector_embedding").notNull(), // vector array
  embeddingModel: varchar("embedding_model", { length: 50 }).default("text-embedding-3-large"),
  memorySource: varchar("memory_source", { length: 50 }).notNull(), // user_interaction, system_analysis, external_data
  contextTags: text("context_tags").array(),
  importanceScore: real("importance_score").notNull(), // 0-1
  accessFrequency: integer("access_frequency").default(0),
  lastAccessedAt: timestamp("last_accessed_at"),
  memoryAge: integer("memory_age"), // days since creation
  decayRate: real("decay_rate").default(0.01), // memory decay per day
  refreshCount: integer("refresh_count").default(0),
  lastRefreshedAt: timestamp("last_refreshed_at"),
  relatedMemories: text("related_memories").array(),
  similarityThreshold: real("similarity_threshold").default(0.85),
  clusterId: varchar("cluster_id", { length: 50 }),
  clusterWeight: real("cluster_weight"),
  isActive: boolean("is_active").default(true),
  isArchived: boolean("is_archived").default(false),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Intent Graph System
export const intentGraphs = pgTable("intent_graphs", {
  id: uuid("id").primaryKey().defaultRandom(),
  graphId: varchar("graph_id", { length: 50 }).notNull().unique(),
  sourceIntent: varchar("source_intent", { length: 100 }).notNull(),
  targetIntent: varchar("target_intent", { length: 100 }).notNull(),
  transitionWeight: real("transition_weight").notNull(), // 0-1
  transitionConditions: jsonb("transition_conditions").default({}),
  expectedOutcomes: jsonb("expected_outcomes").default({}),
  actualOutcomes: jsonb("actual_outcomes").default({}),
  successRate: real("success_rate"), // 0-1
  transitionCount: integer("transition_count").default(0),
  lastTransition: timestamp("last_transition"),
  avgTransitionTime: integer("avg_transition_time"), // ms
  conversionRate: real("conversion_rate"), // 0-1
  revenue_impact: real("revenue_impact"),
  userSegments: text("user_segments").array(),
  contextRequirements: jsonb("context_requirements").default({}),
  optimizationHistory: jsonb("optimization_history").default([]),
  isActive: boolean("is_active").default(true),
  confidence: real("confidence"), // 0-1
  lastOptimized: timestamp("last_optimized"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Empire Brain Configuration
export const empireBrainConfig = pgTable("empire_brain_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  configKey: varchar("config_key", { length: 100 }).notNull().unique(),
  configValue: jsonb("config_value").notNull(),
  configType: varchar("config_type", { length: 30 }).notNull(), // system, user, experimental
  description: text("description"),
  isActive: boolean("is_active").default(true),
  requiresRestart: boolean("requires_restart").default(false),
  validationRules: jsonb("validation_rules").default({}),
  defaultValue: jsonb("default_value"),
  lastModifiedBy: varchar("last_modified_by", { length: 100 }),
  environmentScope: varchar("environment_scope", { length: 20 }).default("all"), // development, staging, production, all
  featureFlag: varchar("feature_flag", { length: 50 }),
  experimentId: varchar("experiment_id", { length: 50 }),
  rolloutPercentage: integer("rollout_percentage").default(100), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Empire Analytics & Metrics
export const empireAnalytics = pgTable("empire_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  metricName: varchar("metric_name", { length: 100 }).notNull(),
  metricType: varchar("metric_type", { length: 30 }).notNull(), // performance, business, user, system
  metricValue: real("metric_value").notNull(),
  metricUnit: varchar("metric_unit", { length: 20 }), // percentage, count, time, currency
  dimension1: varchar("dimension1", { length: 100 }), // e.g., page, user_segment, feature
  dimension2: varchar("dimension2", { length: 100 }),
  dimension3: varchar("dimension3", { length: 100 }),
  timeGranularity: varchar("time_granularity", { length: 20 }).default("hourly"), // minute, hourly, daily, weekly
  aggregationType: varchar("aggregation_type", { length: 20 }).default("sum"), // sum, avg, count, min, max
  metricSource: varchar("metric_source", { length: 50 }).notNull(),
  calculationMethod: text("calculation_method"),
  isRealTime: boolean("is_real_time").default(false),
  alertThreshold: real("alert_threshold"),
  alertDirection: varchar("alert_direction", { length: 10 }), // above, below, change
  isAnomalous: boolean("is_anomalous").default(false),
  anomalyScore: real("anomaly_score"),
  trend: varchar("trend", { length: 20 }), // increasing, decreasing, stable
  seasonality: jsonb("seasonality").default({}),
  correlatedMetrics: text("correlated_metrics").array(),
  businessImpact: real("business_impact"),
  recordedAt: timestamp("recorded_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Zod validation schemas
export const createEmpireIntelligenceSchema = createInsertSchema(empireIntelligence);
export const createLLMProviderSchema = createInsertSchema(llmProviders);
export const createIntelligenceRouteSchema = createInsertSchema(intelligenceRoutes);
export const createAutonomicDecisionSchema = createInsertSchema(autonomicDecisions);
export const createSystemMutationSchema = createInsertSchema(systemMutations);
export const createRLHFFeedbackSchema = createInsertSchema(rlhfFeedback);
export const createEmpireVectorMemorySchema = createInsertSchema(empireVectorMemory);
export const createIntentGraphSchema = createInsertSchema(intentGraphs);
export const createEmpireBrainConfigSchema = createInsertSchema(empireBrainConfig);
export const createEmpireAnalyticsSchema = createInsertSchema(empireAnalytics);

// Type exports
export type NewEmpireIntelligence = z.infer<typeof createEmpireIntelligenceSchema>;
export type NewLLMProvider = z.infer<typeof createLLMProviderSchema>;
export type NewIntelligenceRoute = z.infer<typeof createIntelligenceRouteSchema>;
export type NewAutonomicDecision = z.infer<typeof createAutonomicDecisionSchema>;
export type NewSystemMutation = z.infer<typeof createSystemMutationSchema>;
export type NewRLHFFeedback = z.infer<typeof createRLHFFeedbackSchema>;
export type NewEmpireVectorMemory = z.infer<typeof createEmpireVectorMemorySchema>;
export type NewIntentGraph = z.infer<typeof createIntentGraphSchema>;
export type NewEmpireBrainConfig = z.infer<typeof createEmpireBrainConfigSchema>;
export type NewEmpireAnalytics = z.infer<typeof createEmpireAnalyticsSchema>;

export type EmpireBrainEmpireIntelligence = InferSelectModel<typeof empireIntelligence>;
export type InsertEmpireBrainEmpireIntelligence = InferInsertModel<typeof empireIntelligence>;
export type EmpireBrainLlmProvider = InferSelectModel<typeof llmProviders>;
export type InsertEmpireBrainLlmProvider = InferInsertModel<typeof llmProviders>;
export type EmpireBrainIntelligenceRoute = InferSelectModel<typeof intelligenceRoutes>;
export type InsertEmpireBrainIntelligenceRoute = InferInsertModel<typeof intelligenceRoutes>;
export type EmpireBrainAutonomicDecision = InferSelectModel<typeof autonomicDecisions>;
export type InsertEmpireBrainAutonomicDecision = InferInsertModel<typeof autonomicDecisions>;
export type EmpireBrainSystemMutation = InferSelectModel<typeof systemMutations>;
export type InsertEmpireBrainSystemMutation = InferInsertModel<typeof systemMutations>;
export type EmpireBrainRlhfFeedback = InferSelectModel<typeof rlhfFeedback>;
export type InsertEmpireBrainRlhfFeedback = InferInsertModel<typeof rlhfFeedback>;
export type EmpireBrainEmpireVectorMemory = InferSelectModel<typeof empireVectorMemory>;
export type InsertEmpireBrainEmpireVectorMemory = InferInsertModel<typeof empireVectorMemory>;
export type EmpireBrainIntentGraph = InferSelectModel<typeof intentGraphs>;
export type InsertEmpireBrainIntentGraph = InferInsertModel<typeof intentGraphs>;
export type EmpireBrainEmpireBrainConfig = InferSelectModel<typeof empireBrainConfig>;
export type InsertEmpireBrainEmpireBrainConfig = InferInsertModel<typeof empireBrainConfig>;
export type EmpireBrainEmpireAnalytic = InferSelectModel<typeof empireAnalytics>;
export type InsertEmpireBrainEmpireAnalytic = InferInsertModel<typeof empireAnalytics>;

// DTOs
const empireBrainEmpireIntelligenceDTOKeys = ["id", "status", "priority", "createdAt", "updatedAt"] as const;

export interface EmpireBrainEmpireIntelligenceDTO
  extends Pick<EmpireBrainEmpireIntelligence, (typeof empireBrainEmpireIntelligenceDTOKeys)[number]> {}

export const toEmpireBrainEmpireIntelligenceDTO = (empireBrainEmpireIntelligence: EmpireBrainEmpireIntelligence): EmpireBrainEmpireIntelligenceDTO =>
  pickDTOFields(empireBrainEmpireIntelligence, empireBrainEmpireIntelligenceDTOKeys);


const empireBrainLlmProviderDTOKeys = ["id", "priority", "createdAt", "updatedAt"] as const;

export interface EmpireBrainLlmProviderDTO
  extends Pick<EmpireBrainLlmProvider, (typeof empireBrainLlmProviderDTOKeys)[number]> {}

export const toEmpireBrainLlmProviderDTO = (empireBrainLlmProvider: EmpireBrainLlmProvider): EmpireBrainLlmProviderDTO =>
  pickDTOFields(empireBrainLlmProvider, empireBrainLlmProviderDTOKeys);


const empireBrainIntelligenceRouteDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface EmpireBrainIntelligenceRouteDTO
  extends Pick<EmpireBrainIntelligenceRoute, (typeof empireBrainIntelligenceRouteDTOKeys)[number]> {}

export const toEmpireBrainIntelligenceRouteDTO = (empireBrainIntelligenceRoute: EmpireBrainIntelligenceRoute): EmpireBrainIntelligenceRouteDTO =>
  pickDTOFields(empireBrainIntelligenceRoute, empireBrainIntelligenceRouteDTOKeys);


const empireBrainAutonomicDecisionDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface EmpireBrainAutonomicDecisionDTO
  extends Pick<EmpireBrainAutonomicDecision, (typeof empireBrainAutonomicDecisionDTOKeys)[number]> {}

export const toEmpireBrainAutonomicDecisionDTO = (empireBrainAutonomicDecision: EmpireBrainAutonomicDecision): EmpireBrainAutonomicDecisionDTO =>
  pickDTOFields(empireBrainAutonomicDecision, empireBrainAutonomicDecisionDTOKeys);


const empireBrainSystemMutationDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface EmpireBrainSystemMutationDTO
  extends Pick<EmpireBrainSystemMutation, (typeof empireBrainSystemMutationDTOKeys)[number]> {}

export const toEmpireBrainSystemMutationDTO = (empireBrainSystemMutation: EmpireBrainSystemMutation): EmpireBrainSystemMutationDTO =>
  pickDTOFields(empireBrainSystemMutation, empireBrainSystemMutationDTOKeys);


const empireBrainRlhfFeedbackDTOKeys = ["id", "sessionId", "userId", "createdAt", "updatedAt"] as const;

export interface EmpireBrainRlhfFeedbackDTO
  extends Pick<EmpireBrainRlhfFeedback, (typeof empireBrainRlhfFeedbackDTOKeys)[number]> {}

export const toEmpireBrainRlhfFeedbackDTO = (empireBrainRlhfFeedback: EmpireBrainRlhfFeedback): EmpireBrainRlhfFeedbackDTO =>
  pickDTOFields(empireBrainRlhfFeedback, empireBrainRlhfFeedbackDTOKeys);


const empireBrainEmpireVectorMemoryDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface EmpireBrainEmpireVectorMemoryDTO
  extends Pick<EmpireBrainEmpireVectorMemory, (typeof empireBrainEmpireVectorMemoryDTOKeys)[number]> {}

export const toEmpireBrainEmpireVectorMemoryDTO = (empireBrainEmpireVectorMemory: EmpireBrainEmpireVectorMemory): EmpireBrainEmpireVectorMemoryDTO =>
  pickDTOFields(empireBrainEmpireVectorMemory, empireBrainEmpireVectorMemoryDTOKeys);


const empireBrainIntentGraphDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface EmpireBrainIntentGraphDTO
  extends Pick<EmpireBrainIntentGraph, (typeof empireBrainIntentGraphDTOKeys)[number]> {}

export const toEmpireBrainIntentGraphDTO = (empireBrainIntentGraph: EmpireBrainIntentGraph): EmpireBrainIntentGraphDTO =>
  pickDTOFields(empireBrainIntentGraph, empireBrainIntentGraphDTOKeys);


const empireBrainEmpireBrainConfigDTOKeys = ["id", "createdAt", "updatedAt", "description"] as const;

export interface EmpireBrainEmpireBrainConfigDTO
  extends Pick<EmpireBrainEmpireBrainConfig, (typeof empireBrainEmpireBrainConfigDTOKeys)[number]> {}

export const toEmpireBrainEmpireBrainConfigDTO = (empireBrainEmpireBrainConfig: EmpireBrainEmpireBrainConfig): EmpireBrainEmpireBrainConfigDTO =>
  pickDTOFields(empireBrainEmpireBrainConfig, empireBrainEmpireBrainConfigDTOKeys);


const empireBrainEmpireAnalyticDTOKeys = ["id", "createdAt", "metricName"] as const;

export interface EmpireBrainEmpireAnalyticDTO
  extends Pick<EmpireBrainEmpireAnalytic, (typeof empireBrainEmpireAnalyticDTOKeys)[number]> {}

export const toEmpireBrainEmpireAnalyticDTO = (empireBrainEmpireAnalytic: EmpireBrainEmpireAnalytic): EmpireBrainEmpireAnalyticDTO =>
  pickDTOFields(empireBrainEmpireAnalytic, empireBrainEmpireAnalyticDTOKeys);

