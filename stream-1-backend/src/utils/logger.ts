
/**
 * Logger Utility
 *
 * Provides lightweight structured logging for consistent telemetry across the backend.
 * Supports log levels: info, error, warn, debug.
 * Formats payloads and outputs JSON for easy tracing.
 */

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

// Formats log payload and chooses correct console method
const log = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
  const payload = { level, message, ...meta, timestamp: new Date().toISOString() };
  // Using console methods keeps bootstrap lightweight while still structured enough for tracing.
  // eslint-disable-next-line no-console
  console[level === 'info' ? 'log' : level](JSON.stringify(payload));
};

// Exported logger facade exposes helpers for each log level
export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta)
};
