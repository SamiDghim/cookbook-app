import { beforeAll, afterAll, afterEach, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import server from './mocks/server';

// Register jest-dom matchers with Vitest's expect (do this before importing modules that rely on them)
expect.extend(matchers as any);

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
// Reset any request handlers that are declared as a part of our tests (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
