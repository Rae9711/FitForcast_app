import type { LogEntry, FeelingEntry } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { validateRequest } from '../middleware/validation';
import { logger } from '../utils/logger';


/**
 * Entries Router
 *
 * Handles all CRUD operations for LogEntry resources (workout/meal entries).
 * - POST /entries: Create a new log entry for a user
 * - GET /entries: List entries with optional filters and pagination
 * - GET /entries/:id: Retrieve a single entry and its associated feelings
 *
 * Input validation is performed using Zod schemas.
 * Database operations use Prisma ORM.
 * All responses are normalized for frontend consumption.
 */

// Instantiate a router dedicated to /entries operations.
const router = Router();


// Schema for validating entry creation requests.
// user_id: Optional override for admin/dev flows.
// type: Must be 'workout' or 'meal'.
// raw_text: Freeform description of the entry.
// occurred_at: ISO8601 datetime string.
const createEntrySchema = z.object({
  user_id: z.string().uuid().optional(),
  type: z.enum(['workout', 'meal']),
  raw_text: z.string().min(1),
  occurred_at: z.string().datetime()
});


/**
 * POST /entries
 * Creates a new log entry for the resolved user.
 * Validates input, persists to DB, returns normalized entry.
 */
router.post('/', validateRequest(createEntrySchema), async (req, res, next) => {
  try {
    // Extract validated fields from request
    const { user_id, type, raw_text, occurred_at } = res.locals.body as z.infer<typeof createEntrySchema>;
    // Use provided user_id or fallback to authenticated user
    const userId = user_id ?? req.userId;

    // User ID is required for all entry operations
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Create entry in database
    const entry = await prisma.logEntry.create({
      data: {
        userId,
        type,
        rawText: raw_text,
        occurredAt: new Date(occurred_at)
      }
    });

    // Respond with normalized entry
    res.status(201).json(toApiEntry(entry));
  } catch (error) {
    logger.error('Failed to create entry', { error });
    next(error);
  }
});


// Schema for validating entry listing queries.
// Supports filtering by user, entry type, and pagination.
const listEntriesSchema = z.object({
  user_id: z.string().uuid().optional(),
  type: z.enum(['workout', 'meal']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
});


/**
 * GET /entries
 * Fetches a page of entries for the user, optionally filtered and paginated.
 * Returns entries with associated feelings.
 */
router.get('/', validateRequest(listEntriesSchema, 'query'), async (req, res, next) => {
  try {
    const { user_id, type, limit, offset } = res.locals.query as z.infer<typeof listEntriesSchema>;
    const userId = user_id ?? req.userId;

    // User ID is required for listing
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Query entries from database, including associated feelings
    const entries = await prisma.logEntry.findMany({
      where: {
        userId,
        type
      },
      include: {
        feelings: true
      },
      orderBy: { occurredAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Respond with normalized entries
    res.json(entries.map((entry) => toApiEntry(entry)));
  } catch (error) {
    logger.error('Failed to list entries', { error });
    next(error);
  }
});


// Schema for validating path params for single entry retrieval.
const getEntrySchema = z.object({
  id: z.string().uuid()
});


/**
 * GET /entries/:id
 * Returns a single entry and its linked feelings.
 */
router.get('/:id', validateRequest(getEntrySchema, 'params'), async (req, res, next) => {
  try {
    const { id } = res.locals.params as z.infer<typeof getEntrySchema>;

    // Find entry by ID, include feelings
    const entry = await prisma.logEntry.findUnique({
      where: { id },
      include: { feelings: true }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Respond with normalized entry
    res.json(toApiEntry(entry));
  } catch (error) {
    logger.error('Failed to fetch entry', { error });
    next(error);
  }
});


/**
 * Helper: Converts FeelingEntry records into API response contract.
 */
const toApiFeeling = (feeling: FeelingEntry) => ({
  id: feeling.id,
  when: feeling.when,
  valence: feeling.valence,
  energy: feeling.energy,
  stress: feeling.stress,
  notes: feeling.notes,
  created_at: feeling.createdAt.toISOString()
});


/**
 * Helper: Shapes a log entry payload for API responses.
 */
const toApiEntry = (entry: LogEntry & { feelings?: FeelingEntry[] }) => ({
  id: entry.id,
  user_id: entry.userId,
  type: entry.type,
  raw_text: entry.rawText,
  occurred_at: entry.occurredAt.toISOString(),
  created_at: entry.createdAt.toISOString(),
  feelings: (entry.feelings ?? []).map(toApiFeeling)
});

export default router;
