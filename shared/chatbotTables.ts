import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, real, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pickDTOFields } from "./dtoHelpers";
// ================================================
// REAL-TIME CHATBOT/ASSISTANT MODULE
// Billion-Dollar Empire Grade, Migration-Proof, Full-Stack
// ================================================

// Chat Sessions - Core conversation tracking
export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  sessionId: text("session_id").notNull().unique(),
  channelType: varchar("channel_type", { length: 50 }).notNull().default("web"), // web, whatsapp, telegram, voice
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, closed, escalated, transferred
  intent: varchar("intent", { length: 100 }), // support, sales, lead_gen, product_discovery
  language: varchar("language", { length: 10 }).default("en"),
  userArchetype: varchar("user_archetype", { length: 100 }),
  isAnonymous: boolean("is_anonymous").default(true),
  metadata: jsonb("metadata").default({}),
  startedAt: timestamp("started_at").defaultNow(),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  totalMessages: integer("total_messages").default(0),
  humanTakeoverAt: timestamp("human_takeover_at"),
  humanAgentId: text("human_agent_id"),
  satisfactionRating: integer("satisfaction_rating"), // 1-5 stars
  conversionEvent: varchar("conversion_event", { length: 100 }),
  leadValue: real("lead_value"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Chat Messages - Individual message storage
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  messageType: varchar("message_type", { length: 20 }).notNull(), // user, bot, system, agent
  content: text("content").notNull(),
  contentType: varchar("content_type", { length: 50 }).default("text"), // text, voice, image, file, cta
  intent: varchar("intent", { length: 100 }),
  confidence: real("confidence"), // AI confidence score 0-1
  language: varchar("language", { length: 10 }).default("en"),
  userId: text("user_id"),
  agentId: text("agent_id"),
  llmProvider: varchar("llm_provider", { length: 50 }), // openai, claude, local, etc
  llmModel: varchar("llm_model", { length: 100 }),
  processingTime: integer("processing_time"), // ms
  tokens: integer("tokens"),
  attachments: jsonb("attachments").default([]),
  metadata: jsonb("metadata").default({}),
  isEdited: boolean("is_edited").default(false),
  isDeleted: boolean("is_deleted").default(false),
  parentMessageId: uuid("parent_message_id"),
  threadId: text("thread_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Chat Intents - AI intent classification and responses
export const chatIntents = pgTable("chat_intents", {
  id: serial("id").primaryKey(),
  intentName: varchar("intent_name", { length: 100 }).notNull().unique(),
  intentCategory: varchar("intent_category", { length: 50 }).notNull(), // support, sales, lead_gen, info
  triggerKeywords: text("trigger_keywords").array(),
  triggerPhrases: text("trigger_phrases").array(),
  responseTemplates: jsonb("response_templates").default([]),
  followUpActions: jsonb("follow_up_actions").default([]), // cta, form, escalate, etc
  confidence: real("confidence").default(0.5),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(5), // 1-10, higher = more priority
  contextRequired: jsonb("context_required").default([]),
  personalizedByArchetype: boolean("personalized_by_archetype").default(false),
  conversionPotential: real("conversion_potential").default(0.1), // 0-1
  handoffToHuman: boolean("handoff_to_human").default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Bot Knowledge Base - Dynamic knowledge for responses
export const botKnowledgeBase = pgTable("bot_knowledge_base", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  sourceType: varchar("source_type", { length: 50 }), // manual, scraped, api, semantic_graph
  sourceId: text("source_id"),
  tags: text("tags").array(),
  intents: text("intents").array(),
  verticals: text("verticals").array(),
  archetypes: text("archetypes").array(),
  priority: integer("priority").default(5),
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  lastUsedAt: timestamp("last_used_at"),
  accuracy: real("accuracy").default(0.8), // 0-1
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Conversation Context - Session memory and personalization
export const conversationContext = pgTable("conversation_context", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  userId: text("user_id"),
  contextType: varchar("context_type", { length: 50 }).notNull(), // user_profile, session_memory, intent_history
  contextKey: varchar("context_key", { length: 100 }).notNull(),
  contextValue: jsonb("context_value").notNull(),
  importance: integer("importance").default(5), // 1-10
  expiresAt: timestamp("expires_at"),
  isGlobal: boolean("is_global").default(false), // persist across sessions
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Chat Analytics - Performance tracking and optimization
export const chatAnalytics = pgTable("chat_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id"),
  eventType: varchar("event_type", { length: 50 }).notNull(), // message_sent, intent_detected, conversion, escalation
  eventData: jsonb("event_data").notNull(),
  userId: text("user_id"),
  userArchetype: varchar("user_archetype", { length: 100 }),
  intent: varchar("intent", { length: 100 }),
  conversionValue: real("conversion_value"),
  responseTime: integer("response_time"), // ms
  satisfactionScore: real("satisfaction_score"), // 0-1
  metadata: jsonb("metadata").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// Chat Widgets - Embeddable chat configuration
export const chatWidgets = pgTable("chat_widgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  widgetName: varchar("widget_name", { length: 100 }).notNull().unique(),
  widgetType: varchar("widget_type", { length: 50 }).notNull(), // embedded, popup, inline, floating
  targetPages: text("target_pages").array(),
  targetVerticals: text("target_verticals").array(),
  appearance: jsonb("appearance").notNull(), // colors, position, size, etc
  behavior: jsonb("behavior").notNull(), // triggers, delays, conditions
  greetingMessage: text("greeting_message"),
  placeholderText: text("placeholder_text"),
  isActive: boolean("is_active").default(true),
  showOnMobile: boolean("show_on_mobile").default(true),
  showOnDesktop: boolean("show_on_desktop").default(true),
  triggerConditions: jsonb("trigger_conditions").default({}),
  analytics: jsonb("analytics").default({}),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Human Agents - Support team management
export const humanAgents = pgTable("human_agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentName: varchar("agent_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 50 }).notNull(), // support, sales, manager, admin
  departments: text("departments").array(),
  skills: text("skills").array(),
  languages: text("languages").array(),
  isActive: boolean("is_active").default(true),
  isOnline: boolean("is_online").default(false),
  currentSessions: integer("current_sessions").default(0),
  maxSessions: integer("max_sessions").default(5),
  totalSessions: integer("total_sessions").default(0),
  avgRating: real("avg_rating"),
  totalRatings: integer("total_ratings").default(0),
  schedule: jsonb("schedule").default({}), // working hours
  metadata: jsonb("metadata").default({}),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Chat Escalations - Human handoff tracking
export const chatEscalations = pgTable("chat_escalations", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  fromAgentId: text("from_agent_id"), // bot id or human id
  toAgentId: text("to_agent_id"),
  escalationType: varchar("escalation_type", { length: 50 }).notNull(), // bot_to_human, human_to_human, department_transfer
  reason: varchar("reason", { length: 100 }).notNull(),
  priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high, urgent
  status: varchar("status", { length: 20 }).default("pending"), // pending, accepted, rejected, completed
  notes: text("notes"),
  context: jsonb("context").default({}),
  responseTime: integer("response_time"), // seconds until accepted
  resolutionTime: integer("resolution_time"), // seconds until completed
  customerSatisfaction: integer("customer_satisfaction"), // 1-5
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Canned Responses - Quick reply templates
export const cannedResponses = pgTable("canned_responses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  intents: text("intents").array(),
  languages: text("languages").array(),
  isGlobal: boolean("is_global").default(true),
  agentId: text("agent_id"), // null for global responses
  usageCount: integer("usage_count").default(0),
  tags: text("tags").array(),
  metadata: jsonb("metadata").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Chat Feedback - Quality improvement tracking
export const chatFeedback = pgTable("chat_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  feedbackType: varchar("feedback_type", { length: 50 }).notNull(), // satisfaction, bug_report, feature_request, complaint
  rating: integer("rating"), // 1-5 stars
  comment: text("comment"),
  categories: text("categories").array(), // helpful, fast, knowledgeable, etc
  userId: text("user_id"),
  agentId: text("agent_id"),
  isResolved: boolean("is_resolved").default(false),
  resolution: text("resolution"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Schemas for validation
export const insertChatSessionSchema = createInsertSchema(chatSessions);
export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const insertChatIntentSchema = createInsertSchema(chatIntents);
export const insertBotKnowledgeBaseSchema = createInsertSchema(botKnowledgeBase);
export const insertConversationContextSchema = createInsertSchema(conversationContext);
export const insertChatAnalyticsSchema = createInsertSchema(chatAnalytics);
export const insertChatWidgetSchema = createInsertSchema(chatWidgets);
export const insertHumanAgentSchema = createInsertSchema(humanAgents);
export const insertChatEscalationSchema = createInsertSchema(chatEscalations);
export const insertCannedResponseSchema = createInsertSchema(cannedResponses);
export const insertChatFeedbackSchema = createInsertSchema(chatFeedback);

// Types
export type ChatSession = InferSelectModel<typeof chatSessions>;
export type NewChatSession = InferInsertModel<typeof chatSessions>;
export type ChatMessage = InferSelectModel<typeof chatMessages>;
export type NewChatMessage = InferInsertModel<typeof chatMessages>;
export type ChatIntent = InferSelectModel<typeof chatIntents>;
export type NewChatIntent = InferInsertModel<typeof chatIntents>;
export type BotKnowledgeBase = InferSelectModel<typeof botKnowledgeBase>;
export type NewBotKnowledgeBase = InferInsertModel<typeof botKnowledgeBase>;
export type ConversationContext = InferSelectModel<typeof conversationContext>;
export type NewConversationContext = InferInsertModel<typeof conversationContext>;
export type ChatAnalytic = InferSelectModel<typeof chatAnalytics>;
export type NewChatAnalytic = InferInsertModel<typeof chatAnalytics>;
export type ChatWidget = InferSelectModel<typeof chatWidgets>;
export type NewChatWidget = InferInsertModel<typeof chatWidgets>;
export type HumanAgent = InferSelectModel<typeof humanAgents>;
export type NewHumanAgent = InferInsertModel<typeof humanAgents>;
export type ChatEscalation = InferSelectModel<typeof chatEscalations>;
export type NewChatEscalation = InferInsertModel<typeof chatEscalations>;
export type CannedResponse = InferSelectModel<typeof cannedResponses>;
export type NewCannedResponse = InferInsertModel<typeof cannedResponses>;
export type ChatFeedback = InferSelectModel<typeof chatFeedback>;
export type NewChatFeedback = InferInsertModel<typeof chatFeedback>;

// DTOs
const chatSessionDTOKeys = ["id", "status", "sessionId", "userId", "language", "createdAt", "updatedAt"] as const;

export interface ChatSessionDTO
  extends Pick<ChatSession, (typeof chatSessionDTOKeys)[number]> {}

export const toChatSessionDTO = (chatSession: ChatSession): ChatSessionDTO =>
  pickDTOFields(chatSession, chatSessionDTOKeys);


const chatMessageDTOKeys = ["id", "sessionId", "userId", "language", "createdAt", "updatedAt"] as const;

export interface ChatMessageDTO
  extends Pick<ChatMessage, (typeof chatMessageDTOKeys)[number]> {}

export const toChatMessageDTO = (chatMessage: ChatMessage): ChatMessageDTO =>
  pickDTOFields(chatMessage, chatMessageDTOKeys);


const chatIntentDTOKeys = ["id", "priority", "createdAt", "updatedAt"] as const;

export interface ChatIntentDTO
  extends Pick<ChatIntent, (typeof chatIntentDTOKeys)[number]> {}

export const toChatIntentDTO = (chatIntent: ChatIntent): ChatIntentDTO =>
  pickDTOFields(chatIntent, chatIntentDTOKeys);


const botKnowledgeBaseDTOKeys = ["id", "title", "category", "priority", "createdAt", "updatedAt"] as const;

export interface BotKnowledgeBaseDTO
  extends Pick<BotKnowledgeBase, (typeof botKnowledgeBaseDTOKeys)[number]> {}

export const toBotKnowledgeBaseDTO = (botKnowledgeBase: BotKnowledgeBase): BotKnowledgeBaseDTO =>
  pickDTOFields(botKnowledgeBase, botKnowledgeBaseDTOKeys);


const conversationContextDTOKeys = ["id", "sessionId", "userId", "createdAt", "updatedAt"] as const;

export interface ConversationContextDTO
  extends Pick<ConversationContext, (typeof conversationContextDTOKeys)[number]> {}

export const toConversationContextDTO = (conversationContext: ConversationContext): ConversationContextDTO =>
  pickDTOFields(conversationContext, conversationContextDTOKeys);


const chatAnalyticDTOKeys = ["id", "sessionId", "userId", "createdAt", "eventType"] as const;

export interface ChatAnalyticDTO
  extends Pick<ChatAnalytic, (typeof chatAnalyticDTOKeys)[number]> {}

export const toChatAnalyticDTO = (chatAnalytic: ChatAnalytic): ChatAnalyticDTO =>
  pickDTOFields(chatAnalytic, chatAnalyticDTOKeys);


const chatWidgetDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface ChatWidgetDTO
  extends Pick<ChatWidget, (typeof chatWidgetDTOKeys)[number]> {}

export const toChatWidgetDTO = (chatWidget: ChatWidget): ChatWidgetDTO =>
  pickDTOFields(chatWidget, chatWidgetDTOKeys);


const humanAgentDTOKeys = ["id", "createdAt", "updatedAt", "email", "role"] as const;

export interface HumanAgentDTO
  extends Pick<HumanAgent, (typeof humanAgentDTOKeys)[number]> {}

export const toHumanAgentDTO = (humanAgent: HumanAgent): HumanAgentDTO =>
  pickDTOFields(humanAgent, humanAgentDTOKeys);


const chatEscalationDTOKeys = ["id", "status", "sessionId", "priority", "createdAt", "updatedAt"] as const;

export interface ChatEscalationDTO
  extends Pick<ChatEscalation, (typeof chatEscalationDTOKeys)[number]> {}

export const toChatEscalationDTO = (chatEscalation: ChatEscalation): ChatEscalationDTO =>
  pickDTOFields(chatEscalation, chatEscalationDTOKeys);


const cannedResponseDTOKeys = ["id", "title", "category", "createdAt", "updatedAt"] as const;

export interface CannedResponseDTO
  extends Pick<CannedResponse, (typeof cannedResponseDTOKeys)[number]> {}

export const toCannedResponseDTO = (cannedResponse: CannedResponse): CannedResponseDTO =>
  pickDTOFields(cannedResponse, cannedResponseDTOKeys);


const chatFeedbackDTOKeys = ["id", "sessionId", "userId", "createdAt", "updatedAt"] as const;

export interface ChatFeedbackDTO
  extends Pick<ChatFeedback, (typeof chatFeedbackDTOKeys)[number]> {}

export const toChatFeedbackDTO = (chatFeedback: ChatFeedback): ChatFeedbackDTO =>
  pickDTOFields(chatFeedback, chatFeedbackDTOKeys);

