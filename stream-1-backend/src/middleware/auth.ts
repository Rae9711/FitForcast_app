import { NextFunction, Request, Response } from 'express';

/**
 * Auth Middleware
 *
 * Attaches a userId to each request, inferring from headers or falling back to environment config.
 * Ensures all downstream handlers can rely on req.userId.
 * Returns 401 Unauthorized if userId cannot be determined.
 */
// Extend Express' request typing once so every handler can rely on req.userId.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


// Infers userId from request headers or environment fallback
const inferUserId = (req: Request): string => {
  const headerUserId = req.header('x-user-id');
  if (headerUserId) {
    return headerUserId;
  }

  // Fallback to environment config for dev flows
  const fallback = process.env.DEFAULT_USER_ID;
  if (!fallback) {
    throw new Error('DEFAULT_USER_ID must be configured for unauthenticated development flows.');
  }
  return fallback;
};


// Attaches userId to request or returns 401 if not found
export const attachUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.userId = inferUserId(req);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', detail: (error as Error).message });
  }
};
