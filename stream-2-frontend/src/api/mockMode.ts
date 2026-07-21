const MOCK_MODE_KEY = 'fitforecast_mock_mode';

const readSessionFlag = () => {
  try {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(MOCK_MODE_KEY) === 'true';
  } catch {
    return false;
  }
};

/** Compile-time mock flag (Vercel/static demos) or session fallback after offline demo login. */
export const isMockModeEnabled = (): boolean =>
  import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' || readSessionFlag();

export const setMockModeEnabled = (enabled: boolean): void => {
  try {
    if (typeof sessionStorage === 'undefined') {
      return;
    }
    if (enabled) {
      sessionStorage.setItem(MOCK_MODE_KEY, 'true');
    } else {
      sessionStorage.removeItem(MOCK_MODE_KEY);
    }
  } catch {
    // Ignore storage failures (private mode / blocked cookies).
  }
};
