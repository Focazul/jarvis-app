import { vi } from 'vitest';

vi.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};

  return {
    default: {
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
        return Promise.resolve(null);
      }),
      getItem: vi.fn((key: string) => {
        return Promise.resolve(store[key] || null);
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
        return Promise.resolve(null);
      }),
      clear: vi.fn(() => {
        store = {};
        return Promise.resolve(null);
      }),
      getAllKeys: vi.fn(() => {
        return Promise.resolve(Object.keys(store));
      }),
    },
  };
});

// @ts-ignore
global.window = global;
