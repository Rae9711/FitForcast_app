/**
 * Insights Service
 *
 * Provides functions for evaluating deterministic insights based on baseline metrics and rules.
 * - listInsightsForUser: Fetches active insights for a user
 * - upsertInsightFromRule: Creates or updates insights based on rule evaluation
 * - evaluateInsightsForUser: Runs rule logic to determine if new insights should be fired
 *
 * Uses Prisma ORM for database access and supports extensible rule definitions.
 */
import type { BaselineMetric, Insight, Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

const ENERGY_UPLIFT_RULE = {
  type: 'energy_uplift_strength',
  ruleName: 'workout_post_energy_delta',
  shortWindow: 7,
  longWindow: 30,
  threshold: 0.8,
  minPoints: 3
};


/**
 * Fetches at most `limit` active insights for a user, ordered by recency.
 */
export const listInsightsForUser = async (userId: string, limit: number) => {
  const insights = await prisma.insight.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: 'desc' },
    take: limit
  });

  return insights.map((insight) => toApiInsight(insight));
};


/**
 * Creates or updates an insight for a user based on rule evaluation.
 * Ensures insights are unique per user, type, and ruleName.
 */
export const upsertInsightFromRule = async (params: {
  userId: string;
  type: string;
  summary: string;
  supportingStats: Prisma.InputJsonValue;
  ruleName: string;
}) => {
  // Deterministic rules will eventually call into this helper. For now this simply persists or updates an insight row.
  const { userId, type, summary, supportingStats, ruleName } = params;
  const insight = await prisma.insight.upsert({
    where: { userId_type_ruleName: { userId, type, ruleName } },
    create: {
      userId,
      type,
      summary,
      supportingStats,
      ruleName
    },
    update: {
      summary,
      supportingStats,
      isActive: true
    }
  });

  return toApiInsight(insight);
};

/**
 * Evaluates deterministic insight rules for a user based on baseline metrics.
 * Fires new insights or updates existing ones as needed.
 */
export const evaluateInsightsForUser = async (userId: string) => {
  const metrics = await prisma.baselineMetric.findMany({
    where: {
      userId,
      scope: 'workout',
      metric: 'post_energy',
      windowDays: { in: [ENERGY_UPLIFT_RULE.shortWindow, ENERGY_UPLIFT_RULE.longWindow] }
    }
  });

  const metricByWindow = new Map<number, BaselineMetric>();
  metrics.forEach((metric) => metricByWindow.set(metric.windowDays, metric));

  const shortTerm = metricByWindow.get(ENERGY_UPLIFT_RULE.shortWindow);
  const longTerm = metricByWindow.get(ENERGY_UPLIFT_RULE.longWindow);

  if (
    shortTerm &&
    longTerm &&
    shortTerm.dataPoints >= ENERGY_UPLIFT_RULE.minPoints &&
    longTerm.dataPoints >= ENERGY_UPLIFT_RULE.minPoints
  ) {
    const delta = shortTerm.value - longTerm.value;

    if (delta >= ENERGY_UPLIFT_RULE.threshold) {
      await upsertInsightFromRule({
        userId,
        type: ENERGY_UPLIFT_RULE.type,
        ruleName: ENERGY_UPLIFT_RULE.ruleName,
        summary: `You feel +${delta.toFixed(1)} more energized after recent strength workouts versus your ${ENERGY_UPLIFT_RULE.longWindow}-day average.`,
        supportingStats: {
          short_term_window_days: shortTerm.windowDays,
          short_term_value: Number(shortTerm.value.toFixed(2)),
          long_term_window_days: longTerm.windowDays,
          long_term_value: Number(longTerm.value.toFixed(2)),
          delta: Number(delta.toFixed(2)),
          data_points_short: shortTerm.dataPoints,
          data_points_long: longTerm.dataPoints
        }
      });
      return;
    }
  }

  await deactivateInsight(userId, ENERGY_UPLIFT_RULE.type, ENERGY_UPLIFT_RULE.ruleName);
};

const deactivateInsight = async (userId: string, type: string, ruleName: string) => {
  await prisma.insight.updateMany({
    where: { userId, type, ruleName },
    data: { isActive: false }
  });
};

// Translate database casing/fields to the client contract.
const toApiInsight = (insight: Insight) => ({
  id: insight.id,
  user_id: insight.userId,
  type: insight.type,
  summary: insight.summary,
  supporting_stats: insight.supportingStats,
  rule_name: insight.ruleName,
  created_at: insight.createdAt.toISOString(),
  is_active: insight.isActive
});
