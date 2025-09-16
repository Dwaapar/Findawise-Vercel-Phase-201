import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, real, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pickDTOFields } from "./dtoHelpers";
// Semantic Graph Nodes - Core entities in the knowledge graph
export const semanticNodes = pgTable("semantic_nodes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  nodeType: varchar("node_type", { length: 50 }).notNull(), // page, quiz, offer, user_archetype, cta_block, neuron, blog_post, tag, vertical, session_profile
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  metadata: jsonb("metadata"), // niche, emotion, last_updated, CTR, conversions
  vectorEmbedding: jsonb("vector_embedding"), // Array of floats as JSON
  semanticKeywords: jsonb("semantic_keywords"), // Array of strings
  llmSummary: text("llm_summary"),
  intentProfileTags: jsonb("intent_profile_tags"), // Array of intent tags
  status: varchar("status", { length: 20 }).default("active"), // active, inactive, draft
  verticalId: varchar("vertical_id", { length: 50 }),
  neuronId: varchar("neuron_id", { length: 100 }),
  clickThroughRate: real("click_through_rate").default(0),
  conversionRate: real("conversion_rate").default(0),
  engagement: real("engagement").default(0),
  lastOptimized: timestamp("last_optimized"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Semantic Graph Edges - Relationships between nodes
export const semanticEdges = pgTable("semantic_edges", {
  id: serial("id").primaryKey(),
  fromNodeId: integer("from_node_id").notNull().references(() => semanticNodes.id, { onDelete: "cascade" }),
  toNodeId: integer("to_node_id").notNull().references(() => semanticNodes.id, { onDelete: "cascade" }),
  edgeType: varchar("edge_type", { length: 50 }).notNull(), // related_to, solves, leads_to, upsell_from, segment_for, matches_intent, influences, triggered_by, orphaned, popular_path, discovered_by, llm_suggested_link
  weight: real("weight").default(1.0), // Edge strength/relevance
  confidence: real("confidence").default(0.5), // AI confidence in this relationship
  metadata: jsonb("metadata"), // Additional edge properties
  createdBy: varchar("created_by", { length: 50 }).default("system"), // system, llm, admin, auto
  clickCount: integer("click_count").default(0),
  conversionCount: integer("conversion_count").default(0),
  lastTraversed: timestamp("last_traversed"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueEdgeIndex: uniqueIndex("unique_edge_idx").on(table.fromNodeId, table.toNodeId, table.edgeType),
}));

// User Intent Vectors - Personalization profiles
export const userIntentVectors = pgTable("user_intent_vectors", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }),
  sessionId: varchar("session_id", { length: 255 }),
  fingerprint: varchar("fingerprint", { length: 500 }),
  intentVector: jsonb("intent_vector").notNull(), // Vector representation of user interests
  currentArchetype: varchar("current_archetype", { length: 100 }),
  intentTags: jsonb("intent_tags"), // Array of current intent tags
  behaviors: jsonb("behaviors"), // Tracked user behaviors
  preferences: jsonb("preferences"), // User preferences and settings
  interactionHistory: jsonb("interaction_history"), // Recent interactions
  strength: real("strength").default(1.0), // How confident we are in this vector
  lastActivity: timestamp("last_activity").defaultNow(),
  decayRate: real("decay_rate").default(0.1), // How fast this vector decays over time
  neuronAffinities: jsonb("neuron_affinities"), // Which neurons this user prefers
  verticalPreferences: jsonb("vertical_preferences"), // Vertical-specific preferences
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vector Similarity Index - For fast vector searches
export const vectorSimilarityIndex = pgTable("vector_similarity_index", {
  id: serial("id").primaryKey(),
  nodeId: integer("node_id").notNull().references(() => semanticNodes.id, { onDelete: "cascade" }),
  similarNodeId: integer("similar_node_id").notNull().references(() => semanticNodes.id, { onDelete: "cascade" }),
  similarity: real("similarity").notNull(), // Cosine similarity score
  algorithm: varchar("algorithm", { length: 50 }).default("cosine"), // cosine, euclidean, etc.
  lastCalculated: timestamp("last_calculated").defaultNow(),
  isValid: boolean("is_valid").default(true),
}, (table) => ({
  uniqueSimilarityIndex: uniqueIndex("unique_similarity_idx").on(table.nodeId, table.similarNodeId),
}));

// Semantic Search Queries - Track and optimize searches
export const semanticSearchQueries = pgTable("semantic_search_queries", {
  id: serial("id").primaryKey(),
  queryText: text("query_text").notNull(),
  queryVector: jsonb("query_vector"),
  userId: varchar("user_id", { length: 255 }),
  sessionId: varchar("session_id", { length: 255 }),
  results: jsonb("results"), // Array of returned node IDs with scores
  clickedResults: jsonb("clicked_results"), // Which results were actually clicked
  performanceMetrics: jsonb("performance_metrics"), // Search latency, accuracy, etc.
  intent: varchar("intent", { length: 100 }),
  vertical: varchar("vertical", { length: 50 }),
  neuronId: varchar("neuron_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Real-time Recommendations - Generated personalized content
export const realtimeRecommendations = pgTable("realtime_recommendations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  fingerprint: varchar("fingerprint", { length: 500 }),
  nodeId: integer("node_id").notNull().references(() => semanticNodes.id),
  recommendationType: varchar("recommendation_type", { length: 50 }).notNull(), // content, offer, quiz, cta, neuron
  score: real("score").notNull(), // Recommendation strength
  reason: text("reason"), // Why this was recommended
  context: jsonb("context"), // Context that led to this recommendation
  position: integer("position"), // Display position
  isDisplayed: boolean("is_displayed").default(false),
  isClicked: boolean("is_clicked").default(false),
  isConverted: boolean("is_converted").default(false),
  displayedAt: timestamp("displayed_at"),
  clickedAt: timestamp("clicked_at"),
  convertedAt: timestamp("converted_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Graph Analytics - Performance tracking for the semantic graph
export const graphAnalytics = pgTable("graph_analytics", {
  id: serial("id").primaryKey(),
  nodeId: integer("node_id").references(() => semanticNodes.id),
  edgeId: integer("edge_id").references(() => semanticEdges.id),
  metricType: varchar("metric_type", { length: 50 }).notNull(), // views, clicks, conversions, dwell_time, bounce_rate
  value: real("value").notNull(),
  aggregationType: varchar("aggregation_type", { length: 20 }).default("sum"), // sum, avg, count, max, min
  timeframe: varchar("timeframe", { length: 20 }).notNull(), // hourly, daily, weekly, monthly
  date: timestamp("date").notNull(),
  neuronId: varchar("neuron_id", { length: 100 }),
  vertical: varchar("vertical", { length: 50 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Auto-Audit Results - Automated graph optimization
export const graphAuditResults = pgTable("graph_audit_results", {
  id: serial("id").primaryKey(),
  auditType: varchar("audit_type", { length: 50 }).notNull(), // orphan_detection, low_performance, optimization_opportunity
  nodeId: integer("node_id").references(() => semanticNodes.id),
  edgeId: integer("edge_id").references(() => semanticEdges.id),
  severity: varchar("severity", { length: 20 }).notNull(), // low, medium, high, critical
  issue: text("issue").notNull(),
  recommendation: text("recommendation"),
  autoFixAvailable: boolean("auto_fix_available").default(false),
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: varchar("resolved_by", { length: 50 }),
  resolvedAt: timestamp("resolved_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertSemanticNodeSchema = createInsertSchema(semanticNodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSemanticEdgeSchema = createInsertSchema(semanticEdges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserIntentVectorSchema = createInsertSchema(userIntentVectors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVectorSimilarityIndexSchema = createInsertSchema(vectorSimilarityIndex).omit({
  id: true,
});

export const insertSemanticSearchQuerySchema = createInsertSchema(semanticSearchQueries).omit({
  id: true,
  createdAt: true,
});

export const insertRealtimeRecommendationSchema = createInsertSchema(realtimeRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertGraphAnalyticsSchema = createInsertSchema(graphAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertGraphAuditResultSchema = createInsertSchema(graphAuditResults).omit({
  id: true,
  createdAt: true,
});

// Types
export type SemanticNode = InferSelectModel<typeof semanticNodes>;
export type InsertSemanticNode = InferInsertModel<typeof semanticNodes>;

export type SemanticEdge = InferSelectModel<typeof semanticEdges>;
export type InsertSemanticEdge = InferInsertModel<typeof semanticEdges>;

export type UserIntentVector = InferSelectModel<typeof userIntentVectors>;
export type InsertUserIntentVector = InferInsertModel<typeof userIntentVectors>;

export type VectorSimilarityIndex = InferSelectModel<typeof vectorSimilarityIndex>;
export type InsertVectorSimilarityIndex = InferInsertModel<typeof vectorSimilarityIndex>;

export type SemanticSearchQuery = InferSelectModel<typeof semanticSearchQueries>;
export type InsertSemanticSearchQuery = InferInsertModel<typeof semanticSearchQueries>;

export type RealtimeRecommendation = InferSelectModel<typeof realtimeRecommendations>;
export type InsertRealtimeRecommendation = InferInsertModel<typeof realtimeRecommendations>;

export type GraphAnalytics = InferSelectModel<typeof graphAnalytics>;
export type InsertGraphAnalytics = InferInsertModel<typeof graphAnalytics>;

export type GraphAuditResult = InferSelectModel<typeof graphAuditResults>;
export type InsertGraphAuditResult = InferInsertModel<typeof graphAuditResults>;

// DTOs
const semanticNodeDTOKeys = ["id", "title", "slug", "status", "neuronId", "createdAt", "updatedAt", "description"] as const;

export interface SemanticNodeDTO
  extends Pick<SemanticNode, (typeof semanticNodeDTOKeys)[number]> {}

export const toSemanticNodeDTO = (semanticNode: SemanticNode): SemanticNodeDTO =>
  pickDTOFields(semanticNode, semanticNodeDTOKeys);


const semanticEdgeDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface SemanticEdgeDTO
  extends Pick<SemanticEdge, (typeof semanticEdgeDTOKeys)[number]> {}

export const toSemanticEdgeDTO = (semanticEdge: SemanticEdge): SemanticEdgeDTO =>
  pickDTOFields(semanticEdge, semanticEdgeDTOKeys);


const userIntentVectorDTOKeys = ["id", "sessionId", "userId", "createdAt", "updatedAt"] as const;

export interface UserIntentVectorDTO
  extends Pick<UserIntentVector, (typeof userIntentVectorDTOKeys)[number]> {}

export const toUserIntentVectorDTO = (userIntentVector: UserIntentVector): UserIntentVectorDTO =>
  pickDTOFields(userIntentVector, userIntentVectorDTOKeys);


const vectorSimilarityIndexDTOKeys = ["id", "nodeId", "similarNodeId"] as const;

export interface VectorSimilarityIndexDTO
  extends Pick<VectorSimilarityIndex, (typeof vectorSimilarityIndexDTOKeys)[number]> {}

export const toVectorSimilarityIndexDTO = (vectorSimilarityIndex: VectorSimilarityIndex): VectorSimilarityIndexDTO =>
  pickDTOFields(vectorSimilarityIndex, vectorSimilarityIndexDTOKeys);


const semanticSearchQueryDTOKeys = ["id", "sessionId", "neuronId", "userId", "vertical", "createdAt"] as const;

export interface SemanticSearchQueryDTO
  extends Pick<SemanticSearchQuery, (typeof semanticSearchQueryDTOKeys)[number]> {}

export const toSemanticSearchQueryDTO = (semanticSearchQuery: SemanticSearchQuery): SemanticSearchQueryDTO =>
  pickDTOFields(semanticSearchQuery, semanticSearchQueryDTOKeys);


const realtimeRecommendationDTOKeys = ["id", "sessionId", "userId", "createdAt"] as const;

export interface RealtimeRecommendationDTO
  extends Pick<RealtimeRecommendation, (typeof realtimeRecommendationDTOKeys)[number]> {}

export const toRealtimeRecommendationDTO = (realtimeRecommendation: RealtimeRecommendation): RealtimeRecommendationDTO =>
  pickDTOFields(realtimeRecommendation, realtimeRecommendationDTOKeys);


const graphAnalyticsDTOKeys = ["id", "neuronId", "vertical", "createdAt"] as const;

export interface GraphAnalyticsDTO
  extends Pick<GraphAnalytics, (typeof graphAnalyticsDTOKeys)[number]> {}

export const toGraphAnalyticsDTO = (graphAnalytics: GraphAnalytics): GraphAnalyticsDTO =>
  pickDTOFields(graphAnalytics, graphAnalyticsDTOKeys);


const graphAuditResultDTOKeys = ["id", "severity", "createdAt"] as const;

export interface GraphAuditResultDTO
  extends Pick<GraphAuditResult, (typeof graphAuditResultDTOKeys)[number]> {}

export const toGraphAuditResultDTO = (graphAuditResult: GraphAuditResult): GraphAuditResultDTO =>
  pickDTOFields(graphAuditResult, graphAuditResultDTOKeys);

