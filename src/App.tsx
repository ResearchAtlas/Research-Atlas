import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { HomePage } from '@/modules/home/HomePage'
import { LibraryPage } from '@/modules/library/LibraryPage'
import { WorkflowsPage } from '@/modules/workflows/WorkflowsPage'
import { WorkflowDetailPage } from '@/modules/workflows/WorkflowDetailPage'
import { GuidesPage } from '@/modules/guides/GuidesPage'
import { FavoritesProvider } from '@/lib/favorites'

function App() {
    return (
        <FavoritesProvider>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="workflows" element={<WorkflowsPage />} />
                    <Route path="workflows/:workflowId" element={<WorkflowDetailPage />} />
                    <Route path="guides" element={<GuidesPage />} />
                </Route>
            </Routes>
        </FavoritesProvider>
    )
}

export default App
