import { defineConfig } from 'vitest/config'
import { string } from 'rollup-plugin-string'

export default defineConfig({
  test: {
    environment: 'jsdom', // for react component tests
    globals: true, // describe, it, expect global available
  },
  plugins: [
    string({ include: /\.(vs|fs)$/ }),
  ],
})