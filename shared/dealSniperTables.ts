import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, real, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pickDTOFields } from "./dtoHelpers";
// ================================================
// GLOBAL DEAL SNIPER & PRICE TRACKER MODULE
// Billion-Dollar Empire Grade, AI-First, Migration-Proof
// ================================================

// Product Catalog - Unified product database
export const productCatalog = pgTable("product_catalog", {
  id: uuid("id").primaryKey().defaultRandom(),
  productName: text("product_name").notNull(),
  productSlug: varchar("product_slug", { length: 255 }).notNull().unique(),
  brand: varchar("brand", { length: 100 }),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  description: text("description"),
  specifications: jsonb("specifications").default({}),
  images: text("images").array(),
  upc: varchar("upc", { length: 50 }),
  ean: varchar("ean", { length: 50 }),
  asin: varchar("asin", { length: 20 }),
  mpn: varchar("mpn", { length: 100 }), // Manufacturer Part Number
  tags: text("tags").array(),
  averageRating: real("average_rating"),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
  trackingPriority: integer("tracking_priority").default(5), // 1-10
  popularityScore: real("popularity_score").default(0.5), // 0-1
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Price History - Track price changes across all sources
export const priceHistory = pgTable("price_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull(),
  retailer: varchar("retailer", { length: 100 }).notNull(), // amazon, walmart, bestbuy, etc
  retailerProductId: text("retailer_product_id"),
  productUrl: text("product_url").notNull(),
  currentPrice: real("current_price").notNull(),
  originalPrice: real("original_price"),
  discountPercent: real("discount_percent"),
  discountAmount: real("discount_amount"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  availability: varchar("availability", { length: 50 }), // in_stock, out_of_stock, limited, preorder
  stockLevel: integer("stock_level"),
  priceHistory: jsonb("price_history").default([]), // Array of price points
  lowestPrice: real("lowest_price"),
  highestPrice: real("highest_price"),
  averagePrice: real("average_price"),
  priceVolatility: real("price_volatility"), // 0-1 score
  lastPriceChange: timestamp("last_price_change"),
  priceChangeFrequency: integer("price_change_frequency"), // days
  isOnSale: boolean("is_on_sale").default(false),
  saleEndDate: timestamp("sale_end_date"),
  couponCodes: text("coupon_codes").array(),
  shippingCost: real("shipping_cost"),
  totalCost: real("total_cost"),
  dealScore: real("deal_score"), // 0-1 algorithmic deal quality
  apiSource: varchar("api_source", { length: 50 }), // api name or scraper
  dataQuality: real("data_quality").default(0.8), // 0-1 confidence
  lastUpdated: timestamp("last_updated").defaultNow(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow()
});

// Price Alerts - User subscription management
export const priceAlerts = pgTable("price_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  userEmail: varchar("user_email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  productId: uuid("product_id").notNull(),
  retailer: varchar("retailer", { length: 100 }),
  alertType: varchar("alert_type", { length: 50 }).notNull(), // price_drop, back_in_stock, flash_sale, any_deal
  targetPrice: real("target_price"),
  discountThreshold: real("discount_threshold"), // minimum % discount
  isActive: boolean("is_active").default(true),
  frequency: varchar("frequency", { length: 20 }).default("instant"), // instant, daily, weekly
  channels: text("channels").array(), // email, sms, push, webhook
  lastTriggered: timestamp("last_triggered"),
  triggerCount: integer("trigger_count").default(0),
  maxTriggers: integer("max_triggers").default(50),
  userArchetype: varchar("user_archetype", { length: 100 }),
  preferences: jsonb("preferences").default({}),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Deal Events - Real-time deal detection and notifications
export const dealEvents = pgTable("deal_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull(),
  dealType: varchar("deal_type", { length: 50 }).notNull(), // price_drop, flash_sale, clearance, coupon, bundle
  dealSeverity: varchar("deal_severity", { length: 20 }).notNull(), // low, medium, high, amazing
  retailer: varchar("retailer", { length: 100 }).notNull(),
  oldPrice: real("old_price"),
  newPrice: real("new_price").notNull(),
  discountPercent: real("discount_percent"),
  discountAmount: real("discount_amount"),
  savingsValue: real("savings_value"),
  dealScore: real("deal_score").notNull(), // 0-1 AI quality score
  isFlashSale: boolean("is_flash_sale").default(false),
  dealDuration: integer("deal_duration"), // estimated hours
  dealEndTime: timestamp("deal_end_time"),
  couponCode: varchar("coupon_code", { length: 100 }),
  minQuantity: integer("min_quantity").default(1),
  maxQuantity: integer("max_quantity"),
  dealUrl: text("deal_url").notNull(),
  dealDescription: text("deal_description"),
  eligibilityConditions: text("eligibility_conditions"),
  regions: text("regions").array(), // geographic restrictions
  verificationStatus: varchar("verification_status", { length: 30 }).default("pending"), // pending, verified, expired, invalid
  popularityRank: integer("popularity_rank"),
  clickCount: integer("click_count").default(0),
  conversionRate: real("conversion_rate"),
  revenue: real("revenue"),
  isExpired: boolean("is_expired").default(false),
  notificationsSent: integer("notifications_sent").default(0),
  detectedAt: timestamp("detected_at").defaultNow(),
  expiredAt: timestamp("expired_at"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow()
});

// Coupon Codes - Track promotional codes and discounts
export const couponCodes = pgTable("coupon_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  couponCode: varchar("coupon_code", { length: 100 }).notNull(),
  retailer: varchar("retailer", { length: 100 }).notNull(),
  couponType: varchar("coupon_type", { length: 50 }).notNull(), // percentage, fixed_amount, free_shipping, bogo
  discountValue: real("discount_value").notNull(),
  minimumPurchase: real("minimum_purchase"),
  maximumDiscount: real("maximum_discount"),
  applicableCategories: text("applicable_categories").array(),
  excludedCategories: text("excluded_categories").array(),
  applicableProducts: text("applicable_products").array(),
  isStorewide: boolean("is_storewide").default(false),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  successRate: real("success_rate"), // 0-1 verification success
  lastTested: timestamp("last_tested"),
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  source: varchar("source", { length: 100 }), // where we found this coupon
  popularity: integer("popularity").default(0),
  userRating: real("user_rating"),
  description: text("description"),
  terms: text("terms"),
  regions: text("regions").array(),
  firstTimeCustomerOnly: boolean("first_time_customer_only").default(false),
  membershipRequired: boolean("membership_required").default(false),
  stackableWithOthers: boolean("stackable_with_others").default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Retailer APIs - Integration management
export const retailerApis = pgTable("retailer_apis", {
  id: serial("id").primaryKey(),
  retailerName: varchar("retailer_name", { length: 100 }).notNull().unique(),
  retailerSlug: varchar("retailer_slug", { length: 50 }).notNull().unique(),
  apiType: varchar("api_type", { length: 50 }).notNull(), // official_api, scraper, rss, webhook
  apiEndpoint: text("api_endpoint"),
  apiKey: text("api_key"), // encrypted
  apiSecret: text("api_secret"), // encrypted
  rateLimit: integer("rate_limit"), // requests per hour
  currentUsage: integer("current_usage").default(0),
  isActive: boolean("is_active").default(true),
  lastSync: timestamp("last_sync"),
  syncFrequency: integer("sync_frequency").default(60), // minutes
  errorCount: integer("error_count").default(0),
  successRate: real("success_rate").default(1.0),
  avgResponseTime: integer("avg_response_time"), // ms
  dataQuality: real("data_quality").default(0.8),
  supportedFeatures: text("supported_features").array(), // price_tracking, inventory, reviews, etc
  regions: text("regions").array(),
  categories: text("categories").array(),
  apiDocumentation: text("api_documentation"),
  contactInfo: jsonb("contact_info").default({}),
  billingInfo: jsonb("billing_info").default({}),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Deal Analytics - Performance tracking and optimization
export const dealAnalytics = pgTable("deal_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventType: varchar("event_type", { length: 50 }).notNull(), // deal_detected, alert_sent, click, conversion
  eventData: jsonb("event_data").notNull(),
  dealId: uuid("deal_id"),
  productId: uuid("product_id"),
  userId: text("user_id"),
  userArchetype: varchar("user_archetype", { length: 100 }),
  retailer: varchar("retailer", { length: 100 }),
  dealValue: real("deal_value"),
  conversionValue: real("conversion_value"),
  clickThroughRate: real("click_through_rate"),
  bounceRate: real("bounce_rate"),
  timeOnPage: integer("time_on_page"), // seconds
  deviceType: varchar("device_type", { length: 50 }),
  trafficSource: varchar("traffic_source", { length: 100 }),
  geolocation: jsonb("geolocation").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow()
});

// Price Predictions - AI-powered price forecasting
export const pricePredictions = pgTable("price_predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull(),
  retailer: varchar("retailer", { length: 100 }).notNull(),
  currentPrice: real("current_price").notNull(),
  predictedPrice: real("predicted_price").notNull(),
  predictionConfidence: real("prediction_confidence").notNull(), // 0-1
  predictionHorizon: integer("prediction_horizon").notNull(), // days ahead
  predictionModel: varchar("prediction_model", { length: 100 }),
  modelVersion: varchar("model_version", { length: 50 }),
  factors: jsonb("factors").default({}), // seasonality, demand, competition, etc
  nextSaleDate: timestamp("next_sale_date"),
  bestBuyWindow: jsonb("best_buy_window").default({}), // optimal purchase timing
  priceDirection: varchar("price_direction", { length: 20 }), // up, down, stable
  volatilityScore: real("volatility_score"), // 0-1
  demandForecast: real("demand_forecast"), // relative demand
  accuracy: real("accuracy"), // backtest accuracy for this model
  isActive: boolean("is_active").default(true),
  predictedAt: timestamp("predicted_at").defaultNow(),
  actualPrice: real("actual_price"), // for backtesting
  accuracyScore: real("accuracy_score"), // actual vs predicted
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow()
});

// Deal Categories - Product categorization
export const dealCategories = pgTable("deal_categories", {
  id: serial("id").primaryKey(),
  categoryName: varchar("category_name", { length: 100 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description"),
  keywords: text("keywords").array(),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(5),
  parentCategoryId: integer("parent_category_id"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Deal Sources - API and scraper management
export const dealSources = pgTable("deal_sources", {
  id: serial("id").primaryKey(),
  sourceName: varchar("source_name", { length: 100 }).notNull().unique(),
  sourceType: varchar("source_type", { length: 50 }).notNull(),
  baseUrl: text("base_url").notNull(),
  apiEndpoint: text("api_endpoint"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(5),
  categories: text("categories").array(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Deal Inventory - Current available deals
export const dealInventory = pgTable("deal_inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  productName: text("product_name").notNull(),
  retailer: varchar("retailer", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }),
  currentPrice: real("current_price").notNull(),
  originalPrice: real("original_price"),
  discountPercent: real("discount_percent"),
  dealUrl: text("deal_url").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Deal Alerts - Alias for priceAlerts for backward compatibility
export const dealAlerts = priceAlerts;

// User Wishlist - Personal deal tracking
export const userWishlists = pgTable("user_wishlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  wishlistName: varchar("wishlist_name", { length: 100 }).default("My Wishlist"),
  productId: uuid("product_id").notNull(),
  targetPrice: real("target_price"),
  maxPrice: real("max_price"),
  priority: integer("priority").default(5), // 1-10
  notes: text("notes"),
  alertsEnabled: boolean("alerts_enabled").default(true),
  isPublic: boolean("is_public").default(false),
  shareToken: varchar("share_token", { length: 100 }),
  tags: text("tags").array(),
  addedAt: timestamp("added_at").defaultNow(),
  lastChecked: timestamp("last_checked"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Schemas for validation
export const insertProductCatalogSchema = createInsertSchema(productCatalog);
export const insertPriceHistorySchema = createInsertSchema(priceHistory);
export const insertPriceAlertSchema = createInsertSchema(priceAlerts);
export const insertDealEventSchema = createInsertSchema(dealEvents);
export const insertCouponCodeSchema = createInsertSchema(couponCodes);
export const insertRetailerApiSchema = createInsertSchema(retailerApis);
export const insertDealAnalyticsSchema = createInsertSchema(dealAnalytics);
export const insertPricePredictionSchema = createInsertSchema(pricePredictions);
export const insertUserWishlistSchema = createInsertSchema(userWishlists);

// Types
export type ProductCatalog = InferSelectModel<typeof productCatalog>;
export type NewProductCatalog = InferInsertModel<typeof productCatalog>;
export type PriceHistory = InferSelectModel<typeof priceHistory>;
export type NewPriceHistory = InferInsertModel<typeof priceHistory>;
export type PriceAlert = InferSelectModel<typeof priceAlerts>;
export type NewPriceAlert = InferInsertModel<typeof priceAlerts>;
export type DealEvent = InferSelectModel<typeof dealEvents>;
export type NewDealEvent = InferInsertModel<typeof dealEvents>;
export type CouponCode = InferSelectModel<typeof couponCodes>;
export type NewCouponCode = InferInsertModel<typeof couponCodes>;
export type RetailerApi = InferSelectModel<typeof retailerApis>;
export type NewRetailerApi = InferInsertModel<typeof retailerApis>;
export type DealAnalytic = InferSelectModel<typeof dealAnalytics>;
export type NewDealAnalytic = InferInsertModel<typeof dealAnalytics>;
export type PricePrediction = InferSelectModel<typeof pricePredictions>;
export type NewPricePrediction = InferInsertModel<typeof pricePredictions>;
export type UserWishlist = InferSelectModel<typeof userWishlists>;
export type NewUserWishlist = InferInsertModel<typeof userWishlists>;

export type DealCategory = InferSelectModel<typeof dealCategories>;
export type InsertDealCategory = InferInsertModel<typeof dealCategories>;
export type DealSource = InferSelectModel<typeof dealSources>;
export type InsertDealSource = InferInsertModel<typeof dealSources>;
export type DealInventory = InferSelectModel<typeof dealInventory>;
export type InsertDealInventory = InferInsertModel<typeof dealInventory>;

// DTOs
const productCatalogDTOKeys = ["id", "category", "createdAt", "updatedAt", "description"] as const;

export interface ProductCatalogDTO
  extends Pick<ProductCatalog, (typeof productCatalogDTOKeys)[number]> {}

export const toProductCatalogDTO = (productCatalog: ProductCatalog): ProductCatalogDTO =>
  pickDTOFields(productCatalog, productCatalogDTOKeys);


const priceHistoryDTOKeys = ["id", "createdAt", "productId"] as const;

export interface PriceHistoryDTO
  extends Pick<PriceHistory, (typeof priceHistoryDTOKeys)[number]> {}

export const toPriceHistoryDTO = (priceHistory: PriceHistory): PriceHistoryDTO =>
  pickDTOFields(priceHistory, priceHistoryDTOKeys);


const priceAlertDTOKeys = ["id", "userId", "createdAt", "updatedAt", "productId"] as const;

export interface PriceAlertDTO
  extends Pick<PriceAlert, (typeof priceAlertDTOKeys)[number]> {}

export const toPriceAlertDTO = (priceAlert: PriceAlert): PriceAlertDTO =>
  pickDTOFields(priceAlert, priceAlertDTOKeys);


const dealEventDTOKeys = ["id", "createdAt", "productId"] as const;

export interface DealEventDTO
  extends Pick<DealEvent, (typeof dealEventDTOKeys)[number]> {}

export const toDealEventDTO = (dealEvent: DealEvent): DealEventDTO =>
  pickDTOFields(dealEvent, dealEventDTOKeys);


const couponCodeDTOKeys = ["id", "createdAt", "updatedAt", "description", "source"] as const;

export interface CouponCodeDTO
  extends Pick<CouponCode, (typeof couponCodeDTOKeys)[number]> {}

export const toCouponCodeDTO = (couponCode: CouponCode): CouponCodeDTO =>
  pickDTOFields(couponCode, couponCodeDTOKeys);


const retailerApiDTOKeys = ["id", "createdAt", "updatedAt"] as const;

export interface RetailerApiDTO
  extends Pick<RetailerApi, (typeof retailerApiDTOKeys)[number]> {}

export const toRetailerApiDTO = (retailerApi: RetailerApi): RetailerApiDTO =>
  pickDTOFields(retailerApi, retailerApiDTOKeys);


const dealAnalyticDTOKeys = ["id", "userId", "createdAt", "eventType", "productId"] as const;

export interface DealAnalyticDTO
  extends Pick<DealAnalytic, (typeof dealAnalyticDTOKeys)[number]> {}

export const toDealAnalyticDTO = (dealAnalytic: DealAnalytic): DealAnalyticDTO =>
  pickDTOFields(dealAnalytic, dealAnalyticDTOKeys);


const pricePredictionDTOKeys = ["id", "createdAt", "productId"] as const;

export interface PricePredictionDTO
  extends Pick<PricePrediction, (typeof pricePredictionDTOKeys)[number]> {}

export const toPricePredictionDTO = (pricePrediction: PricePrediction): PricePredictionDTO =>
  pickDTOFields(pricePrediction, pricePredictionDTOKeys);


const userWishlistDTOKeys = ["id", "userId", "priority", "createdAt", "updatedAt", "productId"] as const;

export interface UserWishlistDTO
  extends Pick<UserWishlist, (typeof userWishlistDTOKeys)[number]> {}

export const toUserWishlistDTO = (userWishlist: UserWishlist): UserWishlistDTO =>
  pickDTOFields(userWishlist, userWishlistDTOKeys);


const dealCategoryDTOKeys = ["id", "priority", "createdAt", "updatedAt", "description"] as const;

export interface DealCategoryDTO
  extends Pick<DealCategory, (typeof dealCategoryDTOKeys)[number]> {}

export const toDealCategoryDTO = (dealCategory: DealCategory): DealCategoryDTO =>
  pickDTOFields(dealCategory, dealCategoryDTOKeys);


const dealSourceDTOKeys = ["id", "priority", "createdAt", "updatedAt"] as const;

export interface DealSourceDTO
  extends Pick<DealSource, (typeof dealSourceDTOKeys)[number]> {}

export const toDealSourceDTO = (dealSource: DealSource): DealSourceDTO =>
  pickDTOFields(dealSource, dealSourceDTOKeys);


const dealInventoryDTOKeys = ["id", "category", "createdAt", "updatedAt"] as const;

export interface DealInventoryDTO
  extends Pick<DealInventory, (typeof dealInventoryDTOKeys)[number]> {}

export const toDealInventoryDTO = (dealInventory: DealInventory): DealInventoryDTO =>
  pickDTOFields(dealInventory, dealInventoryDTOKeys);

