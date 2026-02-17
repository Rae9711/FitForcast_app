import { prisma } from '../src/db/prisma';
import { LogEntryType } from '@prisma/client';

// Enhanced Seed Script
// Generates deterministic demo users and a configurable number of entries
// per user to support local testing and performance experiments.
//
// Configuration:
// - `SEED_ENTRY_COUNT` (env): number of log entries to create per user (default: 50)
// - `SEED_SPAN_DAYS` (env): how many days in the past to spread entries (default: 180)
//
// Safety: The script uses `upsert` for users but `create` for log/feeling
// rows. Running the script multiple times will create additional entries
// unless you reset the DB. Do not run this against production databases.

const ENTRY_COUNT = Number(process.env.SEED_ENTRY_COUNT ?? 50);
const SPAN_DAYS = Number(process.env.SEED_SPAN_DAYS ?? 180);

// Predefined deterministic users guarantee stable IDs for integration tests.
const demoUsers = [
  { id: '00000000-0000-0000-0000-000000000001', email: 'athena@example.com' },
  { id: '00000000-0000-0000-0000-000000000002', email: 'boris@example.com' },
  { id: '00000000-0000-0000-0000-000000000003', email: 'cora@example.com' }
];

// Small deterministic pool of activity/meal templates we sample from.
const activityPool: Array<{ type: LogEntryType; rawText: string }> = [
  { type: 'workout', rawText: 'Strength session: upper body (45m)' },
  { type: 'workout', rawText: 'Easy run: 5 miles' },
  { type: 'workout', rawText: 'HIIT: EMOM 20' },
  { type: 'workout', rawText: 'Yoga flow: recovery (30m)' },
  { type: 'meal', rawText: 'Breakfast: overnight oats with fruit' },
  { type: 'meal', rawText: 'Lunch: grilled chicken salad' },
  { type: 'meal', rawText: 'Dinner: salmon, rice, greens' },
  { type: 'meal', rawText: 'Snack: yogurt and nuts' }
];

// Deterministic pseudo-random helper so repeated runs are predictable.
const deterministic = (seed: number) => {
  let x = seed % 2147483647;
  return () => {
    x = (x * 48271) % 2147483647;
    return x / 2147483647;
  };
};

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const seed = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set — aborting seed to avoid accidental writes.');
    process.exit(1);
  }

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email },
      create: { id: user.id, email: user.email }
    });

    const rand = deterministic(user.id.split('-').pop()!.length);

    for (let i = 0; i < ENTRY_COUNT; i++) {
      // Spread entries across the configured span deterministically
      const offset = Math.floor(rand() * SPAN_DAYS);
      const template = activityPool[Math.floor(rand() * activityPool.length)];

      const entry = await prisma.logEntry.create({
        data: {
          userId: user.id,
          type: template.type,
          rawText: template.rawText,
          occurredAt: daysAgo(offset)
        }
      });

      // Create a 'pre' feeling and a 'post' feeling for each entry. Values are
      // seeded deterministically so downstream baselines are repeatable.
      const base = Math.floor(rand() * 3) + 2; // 2..4

      await prisma.feelingEntry.create({
        data: {
          logEntryId: entry.id,
          when: 'pre',
          valence: base,
          energy: base,
          stress: Math.max(1, base - 1),
          notes: 'Pre-activity snapshot.'
        }
      });

      await prisma.feelingEntry.create({
        data: {
          logEntryId: entry.id,
          when: 'post',
          valence: Math.min(5, base + (template.type === 'workout' ? 1 : 0)),
          energy: Math.min(5, base + (template.type === 'workout' ? 1 : 0)),
          stress: Math.max(1, base - (template.type === 'workout' ? 0 : 0)),
          notes: template.type === 'workout' ? 'Energy lifted after session.' : 'Satisfied meal.'
        }
      });
    }
  }
};

seed()
  .then(async () => {
    console.log(`Seeded ${ENTRY_COUNT} entries per user successfully.`);
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Seed failed', error);
    await prisma.$disconnect();
    process.exit(1);
  });
