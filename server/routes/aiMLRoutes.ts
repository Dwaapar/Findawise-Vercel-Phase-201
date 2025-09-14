import { Router } from 'express';
import { aimlOrchestrator } from '../services/ai-ml-orchestrator';
import { aiMLDataPipeline } from '../services/ai-ml-data-pipeline';
import { db } from '../db';
import {
  learningCycles,
  personalizationRules,
  aiMLModels,
  neuronDataPipelines,
  aiMLAnalytics,
  empireBrainConfig,
  aiMLAuditTrail
} from '@shared/schema';
import { eq, desc, and, gte, count } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const router = Router();

// AI/ML Orchestrator Management
router.get('/api/ai-ml/status', async (req, res) => {
  try {
    const systemStatus = await aimlOrchestrator.getStatus();
    const dataHealth = await aiMLDataPipeline.getDataHealth();
    const config = { isEnabled: true, safety: { silentMode: false } };

    res.json({
      success: true,
      data: {
        system: systemStatus,
        data: dataHealth,
        currentCycle: systemStatus.currentCycle,
        config: {
          isEnabled: config.isEnabled,
          silentMode: config.safety.silentMode,
          lastCycle: systemStatus.lastCycleTime
        }
      }
    });
  } catch (error) {
    console.error('❌ AI/ML status error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.get('/api/ai-ml/config', async (req, res) => {
  try {
    const config = { isEnabled: true, safety: { silentMode: false } };
    res.json({ success: true, data: config });
  } catch (error) {
    console.error('❌ AI/ML config error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.put('/api/ai-ml/config', async (req, res) => {
  try {
    const updates = req.body;
    
    // Audit the config change
    await db.insert(aiMLAuditTrail).values({
      auditId: randomUUID(),
      action: 'config_update',
      entityType: 'config',
      entityId: 'empire_brain',
      userId: req.session?.userId || 'system',
      sessionId: req.session?.id || '',
      oldValue: aimlOrchestrator.getConfig(),
      newValue: updates,
      changeReason: 'Manual configuration update',
      isAutomatic: false
    });

    aimlOrchestrator.updateConfig(updates);
    
    res.json({ 
      success: true, 
      message: 'Configuration updated successfully' 
    });
  } catch (error) {
    console.error('❌ AI/ML config update error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Learning Cycles
router.post('/api/ai-ml/learning-cycle', async (req, res) => {
  try {
    const cycle = await aimlOrchestrator.triggerManualLearningCycle();
    
    // Store in database
    await db.insert(learningCycles).values({
      cycleId: cycle.id,
      type: cycle.type,
      status: cycle.status,
      startTime: cycle.startTime,
      endTime: cycle.endTime,
      dataProcessed: cycle.dataProcessed,
      discoveries: cycle.discoveries,
      modelsUpdated: cycle.modelsUpdated,
      rulesGenerated: cycle.rulesGenerated.length,
      performance: cycle.performance,
      triggeredBy: req.session?.userId || 'manual_trigger',
      metadata: { requestId: randomUUID(), timestamp: new Date() }
    });

    res.json({ 
      success: true, 
      data: cycle 
    });
  } catch (error) {
    console.error('❌ Learning cycle trigger error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get learning cycles history
router.get('/api/ai-ml/learning-cycles', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const cycles = await db
      .select()
      .from(learningCycles)
      .orderBy(desc(learningCycles.startTime))
      .limit(limit);

    res.json({ success: true, data: cycles });
  } catch (error) {
    console.error('❌ Learning cycles fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Personalization Rules Management
router.get('/api/ai-ml/rules', async (req, res) => {
  try {
    const vertical = req.query.vertical as string;
    const archetype = req.query.archetype as string;
    
    let query = db.select().from(personalizationRules);
    
    if (vertical) {
      query = query.where(eq(personalizationRules.vertical, vertical));
    }
    
    if (archetype) {
      query = query.where(eq(personalizationRules.archetype, archetype));
    }

    const rules = await query.orderBy(desc(personalizationRules.priority));

    res.json({ success: true, data: rules });
  } catch (error) {
    console.error('❌ Rules fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.post('/api/ai-ml/rules', async (req, res) => {
  try {
    const ruleData = req.body;
    
    const rule = await db.insert(personalizationRules).values({
      ruleId: randomUUID(),
      name: ruleData.name,
      description: ruleData.description,
      vertical: ruleData.vertical,
      archetype: ruleData.archetype,
      condition: ruleData.condition,
      action: ruleData.action,
      confidence: ruleData.confidence,
      impact: ruleData.impact,
      priority: ruleData.priority || 100,
      isActive: true,
      isTestMode: ruleData.isTestMode || false,
      createdBy: req.session?.userId || 'system',
      learningCycleId: ruleData.learningCycleId
    }).returning();

    res.json({ success: true, data: rule[0] });
  } catch (error) {
    console.error('❌ Rule creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// AI/ML Models Management
router.get('/api/ai-ml/models', async (req, res) => {
  try {
    const modelType = req.query.type as string;
    const isProduction = req.query.production === 'true';
    
    let query = db.select().from(aiMLModels);
    
    if (modelType) {
      query = query.where(eq(aiMLModels.modelType, modelType));
    }
    
    if (isProduction !== undefined) {
      query = query.where(eq(aiMLModels.isProduction, isProduction));
    }

    const models = await query.orderBy(desc(aiMLModels.deployedAt));

    res.json({ success: true, data: models });
  } catch (error) {
    console.error('❌ Models fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.put('/api/ai-ml/models/:modelId/deploy', async (req, res) => {
  try {
    const { modelId } = req.params;
    
    // Audit the deployment
    await db.insert(aiMLAuditTrail).values({
      auditId: randomUUID(),
      action: 'model_deploy',
      entityType: 'model',
      entityId: modelId,
      userId: req.session?.userId || 'system',
      sessionId: req.session?.id || '',
      changeReason: 'Model deployment',
      isAutomatic: false
    });

    const [updatedModel] = await db
      .update(aiMLModels)
      .set({ 
        isProduction: true, 
        deployedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(aiMLModels.modelId, modelId))
      .returning();

    res.json({ success: true, data: updatedModel });
  } catch (error) {
    console.error('❌ Model deployment error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Analytics and Metrics
router.get('/api/ai-ml/analytics', async (req, res) => {
  try {
    const timeframe = req.query.timeframe as string || '24h';
    const metricType = req.query.metric as string;
    
    const timeframeDates = {
      '1h': new Date(Date.now() - 60 * 60 * 1000),
      '24h': new Date(Date.now() - 24 * 60 * 60 * 1000),
      '7d': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    };
    
    const startDate = timeframeDates[timeframe as keyof typeof timeframeDates];
    
    let query = db
      .select()
      .from(aiMLAnalytics);
    
    if (startDate) {
      query = query.where(gte(aiMLAnalytics.timestamp, startDate));
    }
    
    if (metricType) {
      query = query.where(eq(aiMLAnalytics.metricType, metricType));
    }

    const analytics = await query.orderBy(desc(aiMLAnalytics.timestamp));

    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('❌ Analytics fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Audit Trail
router.get('/api/ai-ml/audit', async (req, res) => {
  try {
    const action = req.query.action as string;
    const entityType = req.query.entityType as string;
    
    let query = db
      .select()
      .from(aiMLAuditTrail);
    
    if (action) {
      query = query.where(eq(aiMLAuditTrail.action, action));
    }
    
    if (entityType) {
      query = query.where(eq(aiMLAuditTrail.entityType, entityType));
    }

    const auditRecords = await query
      .orderBy(desc(aiMLAuditTrail.timestamp))
      .limit(100);

    res.json({ success: true, data: auditRecords });
  } catch (error) {
    console.error('❌ Audit fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Health Check
router.get('/api/ai-ml/health', async (req, res) => {
  try {
    const systemHealth = await aimlOrchestrator.getStatus();
    const dataHealth = await aiMLDataPipeline.getDataHealth();
    
    res.json({
      success: true,
      data: {
        system: systemHealth,
        data: dataHealth,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Silent Mode Toggle
router.post('/api/ai-ml/silent-mode', async (req, res) => {
  try {
    const { enabled } = req.body;
    
    if (enabled) {
      aimlOrchestrator.enableSilentMode();
    } else {
      aimlOrchestrator.disableSilentMode();
    }
    
    // Audit the change
    await db.insert(aiMLAuditTrail).values({
      auditId: randomUUID(),
      action: 'silent_mode_toggle',
      entityType: 'config',
      entityId: 'empire_brain',
      userId: req.session?.userId || 'system',
      sessionId: req.session?.id || '',
      newValue: { silentMode: enabled },
      changeReason: `Silent mode ${enabled ? 'enabled' : 'disabled'}`,
      isAutomatic: false
    });
    
    res.json({ 
      success: true, 
      message: `Silent mode ${enabled ? 'enabled' : 'disabled'}` 
    });
  } catch (error) {
    console.error('❌ Silent mode toggle error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;