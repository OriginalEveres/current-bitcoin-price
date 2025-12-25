import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node', // or 'happy-dom' for DOM-like env
        coverage: {
            reporter: ['text', 'html']
        }
    }
})