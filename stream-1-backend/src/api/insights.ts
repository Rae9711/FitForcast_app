import { Router } from 'express';
import { z } from 'zod';
import { dismissInsightForUser, listInsightsForUser } from '../services/insights';
import { logger } from '../utils/logger';
import { validateRequest } from '../middleware/validation';


/**
 * Insights Router
 *
 * Exposes endpoints for retrieving computed insights for a user based on baseline metrics and deterministic rules.
 * - GET /insights: Returns active insights with supporting stats and summaries.
 *
 * Input validation is performed using Zod schemas.
 * Insight computation logic is handled in the insights service.
 */

const router = Router();


// Schema for validating query params for /insights endpoint
// user_id: Optional override
// limit: Max number of insights to return
const querySchema = z.object({
  user_id: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(20).default(8)
});

const paramsSchema = z.object({
  insightId: z.string().uuid()
});


/**
 * GET /insights
 * Returns the freshest active insights for the user.
 * Validates input, fetches data from insights service, responds with summaries and supporting stats.
 */
router.get('/', validateRequest(querySchema, 'query'), async (req, res, next) => {
  try {
    const { user_id, limit } = res.locals.query as z.infer<typeof querySchema>;
    const userId = user_id ?? req.userId;

    // User ID is required for insights
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch active insights for user
    const insights = await listInsightsForUser(userId, limit);
    res.json(insights);
  } catch (error) {
    logger.error('Failed to fetch insights', { error });
    next(error);
  }
});

router.patch('/:insightId/dismiss', validateRequest(paramsSchema, 'params'), async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { insightId } = res.locals.params as z.infer<typeof paramsSchema>;
    const dismissed = await dismissInsightForUser(req.userId, insightId);

    if (!dismissed) {
      return res.status(404).json({ message: 'Insight not found' });
    }

    return res.status(204).send();
  } catch (error) {
    logger.error('Failed to dismiss insight', { error });
    next(error);
  }
});

export default router;
