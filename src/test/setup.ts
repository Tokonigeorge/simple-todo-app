/// <reference types="vitest" />
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Add vi to global scope
globalThis.vi = vi;

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock import.meta.env
globalThis.import = {
  meta: {
    env: {
      VITE_FIREBASE_API_KEY: 'mock-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'mock-auth-domain',
      VITE_FIREBASE_PROJECT_ID: 'mock-project-id',
      VITE_FIREBASE_STORAGE_BUCKET: 'mock-storage-bucket',
      VITE_FIREBASE_MESSAGING_SENDER_ID: 'mock-sender-id',
      VITE_FIREBASE_APP_ID: 'mock-app-id',
    },
  },
};
