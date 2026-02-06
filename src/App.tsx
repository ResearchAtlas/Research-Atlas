import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AppLayout } from '@/components/layout/AppLayout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { FavoritesProvider } from '@/lib/favorites'
import { HomePage } from '@/modules/home/HomePage'
import { LibraryPage } from '@/modules/library/LibraryPage'
import { WorkflowsPage } from '@/modules/workflows/WorkflowsPage'
import { WorkflowDetailPage } from '@/modules/workflows/WorkflowDetailPage'
import { GuidesPage } from '@/modules/guides/GuidesPage'
import { NotFoundPage } from '@/modules/common/NotFoundPage'

function App() {
    return (
        <FavoritesProvider>
            <Helmet
                defaultTitle="Research Atlas | AI Prompts & Workflows for Academic Research"
            >
                <meta name="description" content="Empower your qualitative, quantitative, and mixed methods research with rigorously tested AI workflows and prompts." />
            </Helmet>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="workflows" element={<WorkflowsPage />} />
                    <Route path="workflows/:workflowId" element={<WorkflowDetailPage />} />
                    <Route path="guides" element={<GuidesPage />} />
                    <Route path="guides/:guideId" element={<GuidesPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </FavoritesProvider>
    )
}

export default App
