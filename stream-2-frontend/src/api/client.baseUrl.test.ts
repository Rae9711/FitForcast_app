import { describe, expect, it } from 'vitest';
import { resolveApiBaseUrl } from './client';

describe('resolveApiBaseUrl', () => {
  it('defaults to the same-origin /api proxy path', () => {
    expect(resolveApiBaseUrl(undefined)).toBe('/api');
    expect(resolveApiBaseUrl('')).toBe('/api');
    expect(resolveApiBaseUrl('   ')).toBe('/api');
  });

  it('keeps absolute API origins and strips trailing slashes', () => {
    expect(resolveApiBaseUrl('http://localhost:3000')).toBe('http://localhost:3000');
    expect(resolveApiBaseUrl('https://api.example.com/')).toBe('https://api.example.com');
    expect(resolveApiBaseUrl('/api/')).toBe('/api');
  });
});
