export type DemoUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const DEMO_PASSWORD = 'password123';

const createdAt = '2025-09-01T12:00:00.000Z';

/** Built-in personas advertised on the login page / README. */
export const DEMO_USERS: Record<string, DemoUser> = {
  'athena@example.com': {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'athena@example.com',
    name: 'Athena',
    createdAt,
    updatedAt: createdAt,
  },
  'boris@example.com': {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'boris@example.com',
    name: 'Boris',
    createdAt,
    updatedAt: createdAt,
  },
  'cora@example.com': {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'cora@example.com',
    name: 'Cora',
    createdAt,
    updatedAt: createdAt,
  },
};

type DemoTokenPayload = {
  email: string;
  exp: number;
};

const encodePayload = (payload: DemoTokenPayload) => {
  const json = JSON.stringify(payload);
  if (typeof btoa === 'function') {
    return btoa(json);
  }
  return Buffer.from(json, 'utf8').toString('base64');
};

const decodePayload = (encoded: string): DemoTokenPayload | null => {
  try {
    const json =
      typeof atob === 'function'
        ? atob(encoded)
        : Buffer.from(encoded, 'base64').toString('utf8');
    return JSON.parse(json) as DemoTokenPayload;
  } catch {
    return null;
  }
};

export const isDemoEmail = (email: string) =>
  Boolean(DEMO_USERS[email.trim().toLowerCase()]);

export const createDemoToken = (email: string) => {
  const normalized = email.trim().toLowerCase();
  return `demo.${encodePayload({
    email: normalized,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  })}`;
};

export const parseDemoToken = (token: string): DemoUser | null => {
  if (!token.startsWith('demo.')) {
    return null;
  }

  const payload = decodePayload(token.slice('demo.'.length));
  if (!payload?.email || typeof payload.exp !== 'number' || payload.exp <= Date.now()) {
    return null;
  }

  return DEMO_USERS[payload.email] ?? null;
};

export const authenticateDemoUser = (
  email: string,
  password: string
): { user: DemoUser; token: string } | null => {
  const normalized = email.trim().toLowerCase();
  const user = DEMO_USERS[normalized];
  if (!user || password !== DEMO_PASSWORD) {
    return null;
  }

  return { user, token: createDemoToken(normalized) };
};
