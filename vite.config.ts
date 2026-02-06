import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return
                    }

                    if (
                        id.includes('react-dom') ||
                        id.includes('react-router') ||
                        id.includes('/react/')
                    ) {
                        return 'vendor-react'
                    }

                    if (id.includes('@tanstack/react-query')) {
                        return 'vendor-query'
                    }

                    if (id.includes('framer-motion') || id.includes('/motion/')) {
                        return 'vendor-motion'
                    }

                    if (
                        id.includes('react-markdown') ||
                        id.includes('remark-gfm') ||
                        id.includes('mdast-util') ||
                        id.includes('hast-util') ||
                        id.includes('micromark')
                    ) {
                        return 'vendor-markdown'
                    }

                    if (id.includes('lucide-react')) {
                        return 'vendor-icons'
                    }
                },
            },
        },
    },
    ssr: {
        noExternal: ['react-helmet-async'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
