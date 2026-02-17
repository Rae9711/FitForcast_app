// Entry point that wires middleware, routes, and server lifecycle for the FitForecast backend.
// HTTP middleware and framework imports wire up the core server plumbing.
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
// Route modules encapsulate each feature surface.
import entriesRouter from './api/entries';
import feelingsRouter from './api/feelings';
import trendsRouter from './api/trends';
import insightsRouter from './api/insights';
// Shared middleware and utilities keep cross-cutting concerns centralized.
import { attachUser } from './middleware/auth';
import { logger } from './utils/logger';
import path from 'path';

// Optional: serve API docs via Swagger UI when dependency is installed.
// This is non-critical and will not affect runtime if `swagger-ui-express`
// is not present in the environment during tests.
let swaggerUi: any;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
  swaggerUi = require('swagger-ui-express');
} catch (err) {
  swaggerUi = null;
}

// Load environment variables before any component accesses configuration.
dotenv.config();

// Create the Express application instance that glues middleware and routes together.
const app = express();

// Enable CORS so the frontend can hit the API from other origins during development.
app.use(cors());
// Automatically parse JSON payloads on every request.
app.use(express.json());
// Inject the resolved user id on each request for downstream handlers.
app.use(attachUser);

// Lightweight readiness probe ensures deployment targets can check service health.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount feature routers under their respective prefixes.
app.use('/entries', entriesRouter);
app.use('/entries/:entryId/feelings', feelingsRouter);
app.use('/trends', trendsRouter);
app.use('/insights', insightsRouter);

// Serve OpenAPI YAML and host Swagger UI at /docs when available.
if (swaggerUi) {
  const openApiPath = path.join(process.cwd(), 'stream-1-backend', 'docs', 'openapi.yaml');
  app.get('/docs/openapi.yaml', (_req, res) => res.sendFile(openApiPath));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: '/docs/openapi.yaml' }));
}

// Resolve the port from configuration with a development default.
const port = Number(process.env.PORT) || 3000;

// Keep integration tests from opening sockets while still running the server in other envs.
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`FitForecast backend listening on port ${port}`);
  });
}

// Export the configured app for tests and external consumers.
export default app;
