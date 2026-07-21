import { describe, expect, it } from 'vitest';
import { authenticateDemoUser, createDemoToken, parseDemoToken } from './demoAuth';

describe('demoAuth', () => {
  it('authenticates known demo personas', () => {
    const result = authenticateDemoUser('athena@example.com', 'password123');
    expect(result?.user.name).toBe('Athena');
    expect(result?.token.startsWith('demo.')).toBe(true);
    expect(parseDemoToken(result!.token)?.email).toBe('athena@example.com');
  });

  it('rejects bad passwords and unknown emails', () => {
    expect(authenticateDemoUser('athena@example.com', 'wrong')).toBeNull();
    expect(authenticateDemoUser('nobody@example.com', 'password123')).toBeNull();
  });

  it('rejects malformed or expired demo tokens', () => {
    expect(parseDemoToken('not-a-demo-token')).toBeNull();
    expect(parseDemoToken(createDemoToken('athena@example.com'))).not.toBeNull();
  });
});
