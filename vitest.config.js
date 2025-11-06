import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom', // for react component tests
    globals: true, // describe, it, expect global available
  },
})