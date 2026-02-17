import { prisma } from '../src/db/prisma';
import { LogEntryType } from '@prisma/client';

// Predefined deterministic users guarantee stable IDs for integration tests.
const demoUsers = [
  { id: '00000000-0000-0000-0000-000000000001', email: 'athena@example.com' },
  { id: '00000000-0000-0000-0000-000000000002', email: 'boris@example.com' },
  { id: '00000000-0000-0000-0000-000000000003', email: 'cora@example.com' }
];

// Entry templates keep the script concise while still generating varied activities.
const sampleEntries: Array<{
  type: LogEntryType;
  rawText: string;
  dayOffset: number;
}> = [
  { type: 'workout', rawText: '45m strength session with supersets', dayOffset: 1 },
  { type: 'meal', rawText: 'Overnight oats with berries and almonds', dayOffset: 1 },
  { type: 'workout', rawText: 'Tempo run - 5 miles moderate', dayOffset: 2 },
  { type: 'meal', rawText: 'Roasted salmon, quinoa, and greens', dayOffset: 3 },
  { type: 'workout', rawText: 'Yoga recovery flow (30m)', dayOffset: 4 }
];

// Helper rewinds the date so entries look historically distributed.
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Main seeding routine: ensure users exist, then attach log + feeling entries.
const seed = async () => {
  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email },
      create: {
        id: user.id,
        email: user.email
      }
    });

    for (const entryTemplate of sampleEntries) {
      const entry = await prisma.logEntry.create({
        data: {
          userId: user.id,
          type: entryTemplate.type,
          rawText: entryTemplate.rawText,
          occurredAt: daysAgo(entryTemplate.dayOffset)
        }
      });

      await prisma.feelingEntry.create({
        data: {
          logEntryId: entry.id,
          when: 'pre',
          valence: 3,
          energy: 3,
          stress: 2,
          notes: 'Felt neutral going in.'
        }
      });

      await prisma.feelingEntry.create({
        data: {
          logEntryId: entry.id,
          when: 'post',
          valence: entryTemplate.type === 'workout' ? 4 : 3,
          energy: entryTemplate.type === 'workout' ? 4 : 3,
          stress: 2,
          notes: entryTemplate.type === 'workout' ? 'Energy lifted after session.' : 'Satisfied meal.'
        }
      });
    }
  }
};

// Execute the seeding workflow and exit with an appropriate status code.
seed()
  .then(async () => {
    console.log('Seed data created successfully.');
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Seed failed', error);
    await prisma.$disconnect();
    process.exit(1);
  });
