import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
})

const app = (
    <StrictMode>
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>
        </HelmetProvider>
    </StrictMode>
)

const rootElement = document.getElementById('root')

if (!rootElement) {
    throw new Error('Root element #root not found')
}

// Hydrate only when the pre-rendered HTML matches the current route.
// SPA-fallback hosts (e.g. vite preview) may serve the root index.html
// for every route; in that case, skip hydration and do a fresh render.
const prerenderMeta = document.querySelector<HTMLMetaElement>('meta[name="prerender-route"]')
const prerenderRoute = prerenderMeta?.content
const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
const canHydrate = rootElement.hasChildNodes() && prerenderRoute === currentPath

if (canHydrate) {
    hydrateRoot(rootElement, app)
} else {
    createRoot(rootElement).render(app)
}
