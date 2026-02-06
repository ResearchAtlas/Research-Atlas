import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import App from './App'
import { canonicalForRoute, prerenderRoutes } from '@/lib/seoRoutes'

type HelmetContext = { helmet?: HelmetServerState }

const makeQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                retry: 1,
            },
        },
    })

export async function render(url: string) {
    const helmetContext: HelmetContext = {}
    const queryClient = makeQueryClient()

    const appHtml = renderToString(
        <StrictMode>
            <HelmetProvider context={helmetContext}>
                <QueryClientProvider client={queryClient}>
                    <StaticRouter location={url}>
                        <App />
                    </StaticRouter>
                </QueryClientProvider>
            </HelmetProvider>
        </StrictMode>,
    )

    return {
        appHtml,
        helmet: helmetContext.helmet,
    }
}

export { prerenderRoutes, canonicalForRoute }
