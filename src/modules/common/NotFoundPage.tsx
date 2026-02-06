import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
    return (
        <main className="container mx-auto py-20 text-center">
            <Helmet>
                <title>Page Not Found | Research Atlas</title>
                <meta
                    name="description"
                    content="The page you requested could not be found on Research Atlas."
                />
                <meta name="robots" content="noindex, nofollow" />
                <link rel="canonical" href="https://researchatlas.info/404" />
            </Helmet>

            <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
            <p className="mt-3 text-muted-foreground">
                The URL may be outdated or incorrect. Continue from one of the main sections.
            </p>

            <div className="mt-8 flex justify-center gap-3">
                <Button asChild variant="outline">
                    <Link to="/library">Prompt Library</Link>
                </Button>
                <Button asChild>
                    <Link to="/">Go Home</Link>
                </Button>
            </div>
        </main>
    )
}
