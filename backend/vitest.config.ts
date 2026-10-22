import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    // tsc emits to dist/; never run compiled test duplicates
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
})
