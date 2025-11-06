import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom', // Für React-Komponenten-Tests
    globals: true, // describe, it, expect global verfügbar
  },
})