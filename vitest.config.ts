import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
      // environment: 'jsdom', // Commenting out the existing line
      environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['e2e', 'e2e/**', 'node_modules/**'], // Modifying the exclude array
  },
});
