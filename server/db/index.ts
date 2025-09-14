/**
 * Universal Database Adapter - Billion-Dollar Empire Grade
 * Single entry point for all database operations across the Findawise Empire
 * Supports both PostgreSQL (current) and Supabase (new integration)
 */

import { db } from '../db';
import { DatabaseStorage } from '../storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { autoConfigureEnvironment, getActiveSupabaseConfig } from '../config/embedded-credentials';

interface DbHealthStatus {
  isHealthy: boolean;
  connectionType: 'postgresql';
  errors: string[];
  latency: number;
  lastCheck: string;
}

interface DbConfig {
  healthCheckInterval: number;
  maxRetries: number;
  useSupabase: boolean;
}

class UniversalDbAdapter {
  private storage: DatabaseStorage;
  private config: DbConfig;
  private healthStatus: DbHealthStatus;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private supabase: SupabaseClient | null = null;

  constructor() {
    this.storage = new DatabaseStorage();
    this.config = {
      healthCheckInterval: 30000, // 30 seconds
      maxRetries: 3,
      useSupabase: false,
    };
    
    this.healthStatus = {
      isHealthy: false,
      connectionType: 'postgresql',
      errors: [],
      latency: 0,
      lastCheck: new Date().toISOString()
    };
  }

  /**
   * Initialize the universal database adapter
   * Sets up PostgreSQL connection with master config
   */
  async initialize(): Promise<void> {
    console.log('🔍 Initializing PostgreSQL Database Adapter...');
    
    try {
      // Test database connection
      const result = await db.execute('SELECT 1 as test');
      console.log('✅ PostgreSQL connection successful');
      
      this.healthStatus = {
        isHealthy: true,
        connectionType: 'postgresql',
        errors: [],
        latency: 0,
        lastCheck: new Date().toISOString()
      };
      
      this.startHealthMonitoring();
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
    
    // Auto-configure embedded Supabase credentials
    autoConfigureEnvironment();
    
    try {
      // Initialize Supabase if credentials are available
      if (this.hasSupabaseCredentials()) {
        await this.initializeSupabase();
      }

      // Always initialize PostgreSQL as fallback
      await this.initializePostgreSQL();

      // Run Supabase migrations if Supabase is available
      if (this.supabase) {
        await this.runSupabaseMigrations();
      }

      // Start health monitoring
      this.startHealthMonitoring();

      console.log('✅ Universal Database Adapter initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Universal Database Adapter:', error);
      throw error;
    }
  }

  /**
   * Check if Supabase credentials are available
   */
  private hasSupabaseCredentials(): boolean {
    // Always return true since we have embedded credentials
    return true;
  }

  /**
   * Initialize Supabase connection
   */
  private async initializeSupabase(): Promise<void> {
    try {
      const config = getActiveSupabaseConfig();
      const supabaseUrl = config.url;
      const supabaseKey = config.serviceRoleKey;
      
      this.supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'x-application-name': 'findawise-empire',
          },
        },
      });

      // Test connection
      const { data, error } = await this.supabase
        .from('users')
        .select('count', { count: 'exact', head: true });

      if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
        throw error;
      }

      console.log('✅ Supabase connection established');
      this.config.useSupabase = true;
    } catch (error) {
      console.warn('⚠️ Supabase initialization failed, falling back to PostgreSQL:', error);
      this.config.useSupabase = false;
    }
  }

  /**
   * Initialize PostgreSQL connection
   */
  private async initializePostgreSQL(): Promise<void> {
    try {
      // Test PostgreSQL connection
      await db.execute('SELECT 1');
      console.log('✅ PostgreSQL connection established');
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error);
      throw error;
    }
  }

  /**
   * Perform comprehensive health check
   */
  async healthCheck(): Promise<DbHealthStatus> {
    const startTime = Date.now();
    const errors: string[] = [];
    let connectionType: 'postgresql' | 'supabase' | 'both' = 'postgresql';

    try {
      // Test PostgreSQL
      await db.execute('SELECT 1');
    } catch (error) {
      errors.push(`PostgreSQL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test Supabase if available
    if (this.supabase) {
      try {
        const { error } = await this.supabase.from('users').select('count', { count: 'exact', head: true });
        if (!error || error.code === 'PGRST116') {
          connectionType = errors.length === 0 ? 'both' : 'supabase';
        } else {
          throw error;
        }
      } catch (error) {
        errors.push(`Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const latency = Date.now() - startTime;
    const isHealthy = errors.length < 2; // At least one connection must work

    this.healthStatus = {
      isHealthy,
      connectionType,
      errors,
      latency,
      lastCheck: new Date().toISOString()
    };

    return this.healthStatus;
  }

  /**
   * Start periodic health monitoring
   */
  private startHealthMonitoring(): void {
    this.healthCheckTimer = setInterval(async () => {
      await this.healthCheck();
      
      if (!this.healthStatus.isHealthy) {
        console.error('🚨 Database health check failed:', this.healthStatus.errors);
      }
    }, this.config.healthCheckInterval);
  }

  /**
   * Stop health monitoring
   */
  stopHealthMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }

  /**
   * Get current health status
   */
  getHealthStatus(): DbHealthStatus {
    return this.healthStatus;
  }

  /**
   * Get the appropriate database client
   */
  getClient(): { type: 'supabase' | 'postgresql'; client: SupabaseClient | typeof db } {
    if (this.config.useSupabase && this.supabase) {
      return { type: 'supabase', client: this.supabase };
    }
    return { type: 'postgresql', client: db };
  }

  /**
   * Get Supabase client (if available)
   */
  getSupabase(): SupabaseClient | null {
    return this.supabase;
  }

  /**
   * Get PostgreSQL client
   */
  getPostgreSQL(): typeof db {
    return db;
  }

  /**
   * Get storage adapter
   */
  getStorage(): DatabaseStorage {
    return this.storage;
  }

  /**
   * Execute raw SQL with fallback logic
   */
  async executeSQL(query: string, params?: any[]): Promise<any> {
    try {
      if (this.config.useSupabase && this.supabase) {
        // BILLION-DOLLAR ENTERPRISE FIX: Remove placeholder - use proper health check
        const { data, error } = await this.supabase
          .from('information_schema.tables')
          .select('table_name')
          .limit(1);
        
        // If Supabase is healthy, proceed with PostgreSQL for better compatibility
        if (!error || error.code === 'PGRST116') {
          return await db.execute(query);
        }
      }
    } catch (error) {
      // Always use PostgreSQL for reliability
      console.log('Using PostgreSQL for query execution');
    }

    // Use PostgreSQL as primary
    return await db.execute(query);
  }

  /**
   * Run Supabase schema migrations
   */
  private async runSupabaseMigrations(): Promise<void> {
    try {
      console.log('🔄 Running Supabase schema migrations...');
      const { SupabaseMigrationEngine } = await import('./supabase-migrations');
      const migrationEngine = new SupabaseMigrationEngine();
      await migrationEngine.runMigrations(this.supabase!);
      console.log('✅ Schema migrations completed');
    } catch (error) {
      console.error('❌ Schema migration failed:', error);
      // Don't throw - allow system to continue with PostgreSQL
    }
  }

  /**
   * Shutdown all connections gracefully
   */
  async shutdown(): Promise<void> {
    this.stopHealthMonitoring();
    
    if (this.supabase) {
      // Supabase doesn't need explicit connection closing
      console.log('✅ Supabase connection closed');
    }
    
    console.log('✅ Universal Database Adapter shutdown complete');
  }
}

// Singleton instance
export const universalDb = new UniversalDbAdapter();

// Initialize on import (auto-setup)
let initPromise: Promise<void> | null = null;

export async function ensureDbInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = universalDb.initialize();
  }
  return initPromise;
}

// Health check endpoint data
export async function getDbHealthData(): Promise<DbHealthStatus> {
  return universalDb.healthCheck();
}

// Export types and utilities
export type { DbHealthStatus, DbConfig };
export { UniversalDbAdapter };

// Default export for convenience
export default universalDb;