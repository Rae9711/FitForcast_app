import { listInsightsForUser, upsertInsightFromRule, evaluateInsightsForUser } from '../src/services/insights';
import { prisma } from '../src/db/prisma';

jest.mock('../src/db/prisma', () => ({
  prisma: {
    insight: { findMany: jest.fn(), upsert: jest.fn(), updateMany: jest.fn() },
    baselineMetric: { findMany: jest.fn() }
  }
}));

describe('Insights service', () => {
  const mockedPrisma = prisma as unknown as any;

  beforeEach(() => jest.clearAllMocks());

  it('lists insights for user', async () => {
    const row = { id: 'i1', userId: 'user-1', type: 't', summary: 's', supportingStats: {}, ruleName: 'r', createdAt: new Date(), isActive: true };
    mockedPrisma.insight.findMany.mockResolvedValue([row]);

    const listed = await listInsightsForUser('user-1', 5);
    expect(listed).toHaveLength(1);
    expect(listed[0].id).toBe(row.id);
  });

  it('upserts insight from rule', async () => {
    const upserted = { id: 'i2', userId: 'user-1', type: 't', summary: 'x', supportingStats: {}, ruleName: 'r', createdAt: new Date(), isActive: true };
    mockedPrisma.insight.upsert.mockResolvedValue(upserted);

    const result = await upsertInsightFromRule({ userId: 'user-1', type: 't', summary: 'x', supportingStats: {}, ruleName: 'r' });
    expect(result).toHaveProperty('id', 'i2');
  });

  it('evaluateInsightsForUser triggers upsert when rule met', async () => {
    // provide short and long term baseline metrics to trigger ENERGY_UPLIFT_RULE
    const shortTerm = { windowDays: 7, value: 5, dataPoints: 3, userId: 'user-1', scope: 'workout', metric: 'post_energy' };
    const longTerm = { windowDays: 30, value: 3, dataPoints: 3, userId: 'user-1', scope: 'workout', metric: 'post_energy' };
    mockedPrisma.baselineMetric.findMany.mockResolvedValue([shortTerm, longTerm]);
    mockedPrisma.insight.upsert.mockResolvedValue({ id: 'i3', userId: 'user-1', type: 'energy_uplift_strength', summary: 's', supportingStats: {}, ruleName: 'r', createdAt: new Date(), isActive: true });

    await evaluateInsightsForUser('user-1');
    expect(mockedPrisma.insight.upsert).toHaveBeenCalled();
  });
});
